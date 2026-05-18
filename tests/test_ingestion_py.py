#!/usr/bin/env python3
from __future__ import annotations

import json
import subprocess
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from lib.ingestion_py.claim_extractor import (
    evaluate_channel_transcript_health,
    extract_claim_candidates,
    update_channel_health_state,
)
from lib.ingestion_py.normalize import normalize_youtube_item, review_queue_from_normalized
from lib.ingestion_py.runner import load_channels


class IngestionNormalizeTests(unittest.TestCase):
    def test_title_only_seed_guardrails(self):
        item = normalize_youtube_item({
            "id": "abc123xyz",
            "title": "국내주식 추천 후보 영상",
            "url": "https://www.youtube.com/watch?v=abc123xyz",
            "channelName": "테스트 채널",
        })
        self.assertEqual(item["reviewStatus"], "needs_transcript_review")
        self.assertTrue(item["titleMetadataSeed"])
        self.assertFalse(item["transcriptVerified"])
        self.assertFalse(item["performanceBacktested"])
        self.assertEqual(item["algorithmVersion"], "title-claim-seed-v0.1")

    def test_transcript_present_is_not_claim_verified(self):
        item = normalize_youtube_item({
            "id": "abc123xyz",
            "title": "전문가 발언 영상",
            "transcript_text": "삼성전자를 언급하지만 아직 claim extraction은 하지 않는다.",
        })
        self.assertTrue(item["transcriptAvailable"])
        self.assertFalse(item["transcriptVerified"])
        self.assertEqual(item["reviewStatus"], "needs_human_review")

    def test_timestamped_transcript_segments_are_preserved(self):
        item = normalize_youtube_item({
            "video_id": "abc123xyz",
            "title": "전문가 발언 영상",
            "transcript": [
                {"start": 6.2, "end": 11.2, "duration": 5, "text": "삼성전자부터 보겠습니다."},
                {"start": 72, "text": "SK하이닉스도 언급합니다."},
            ],
        })
        self.assertTrue(item["transcriptAvailable"])
        self.assertEqual(item["transcriptSegments"][0]["timestamp"], "00:06")
        self.assertIn("삼성전자", item["transcriptText"])
        self.assertFalse(item["transcriptVerified"])

    def test_review_queue_shape(self):
        item = normalize_youtube_item({"id": "v1", "title": "seed"})
        queue = review_queue_from_normalized([item])
        self.assertEqual(len(queue), 1)
        self.assertIn("promotionCondition", queue[0])

    def test_channel_config_accepts_metadata_objects(self):
        path = ROOT / "config" / "youtube_channels.json"
        channels = load_channels(str(path))
        self.assertIn("https://www.youtube.com/@815Moneytalk", channels)


class ClaimExtractorTests(unittest.TestCase):
    def test_extracts_quote_backed_asset_candidate_without_verifying_claim(self):
        item = normalize_youtube_item({
            "video_id": "claim001",
            "title": "삼성전자와 SK하이닉스 점검",
            "channel_name": "테스트 투자채널",
            "published_at": "2026-05-18T00:00:00Z",
            "url": "https://www.youtube.com/watch?v=claim001",
            "transcript": [
                {"start": 6.2, "end": 10.0, "text": "오늘 삼성전자부터 보겠습니다."},
                {"start": 11.0, "end": 18.0, "text": "삼성전자는 지금 급락할 때 관심을 가져볼 만한 구간입니다."},
                {"start": 21.0, "end": 27.0, "text": "SK하이닉스는 리스크도 같이 봐야 합니다."},
            ],
        })
        claims = extract_claim_candidates([item])
        samsung = next(c for c in claims if c["assetName"] == "삼성전자")
        self.assertEqual(samsung["ticker"], "005930")
        self.assertEqual(samsung["market"], "KR")
        self.assertEqual(samsung["stance"], "bullish")
        self.assertEqual(samsung["reviewStatus"], "needs_human_review")
        self.assertFalse(samsung["transcriptVerified"])
        self.assertEqual(samsung["evidenceSource"], "transcript_candidate")
        self.assertEqual(samsung["timestamp"], "00:11")
        self.assertIn("관심", samsung["evidenceQuote"])
        self.assertEqual(samsung["algorithmVersion"], "content-pick-extraction-v0.1")

    def test_transcript_health_flags_repeated_missing_transcripts(self):
        items = [
            {"channelName": "반복무자막", "contentId": "v1", "transcriptAvailable": False, "publishedAt": "2026-05-16"},
            {"channelName": "반복무자막", "contentId": "v2", "transcriptAvailable": False, "publishedAt": "2026-05-17"},
            {"channelName": "정상채널", "contentId": "v3", "transcriptAvailable": False, "publishedAt": "2026-05-17"},
            {"channelName": "정상채널", "contentId": "v4", "transcriptAvailable": True, "publishedAt": "2026-05-18"},
        ]
        result = evaluate_channel_transcript_health(items, missing_threshold=2)
        self.assertEqual(len(result["exclusionCandidates"]), 1)
        candidate = result["exclusionCandidates"][0]
        self.assertEqual(candidate["channelName"], "반복무자막")
        self.assertEqual(candidate["recommendedStatus"], "exclude_candidate")
        self.assertEqual(candidate["reasonCode"], "repeated_missing_transcripts")
        self.assertEqual(candidate["algorithmVersion"], "channel-health-v0.1")

    def test_channel_health_state_tracks_consecutive_missing_across_runs(self):
        prior = {
            "channels": {
                "반복무자막": {"consecutiveMissingTranscriptRuns": 1, "totalMissingTranscriptItems": 1, "totalTranscriptReadyItems": 0}
            }
        }
        items = [{"channelName": "반복무자막", "contentId": "v2", "transcriptAvailable": False, "publishedAt": "2026-05-18"}]
        updated = update_channel_health_state(items, prior_state=prior, missing_threshold=2, run_key="run-2")
        row = updated["channels"]["반복무자막"]
        self.assertEqual(row["consecutiveMissingTranscriptRuns"], 2)
        self.assertEqual(len(updated["exclusionCandidates"]), 1)
        self.assertEqual(updated["exclusionCandidates"][0]["channelName"], "반복무자막")

    def test_channel_health_state_is_idempotent_for_same_run_key(self):
        items = [{"channelName": "반복무자막", "contentId": "v1", "transcriptAvailable": False, "publishedAt": "2026-05-18"}]
        first = update_channel_health_state(items, prior_state={}, missing_threshold=2, run_key="same-run")
        second = update_channel_health_state(items, prior_state=first, missing_threshold=2, run_key="same-run")
        self.assertEqual(second["channels"]["반복무자막"]["consecutiveMissingTranscriptRuns"], 1)
        self.assertEqual(second["exclusionCandidates"], [])

    def test_korean_negated_expensive_phrase_is_not_bearish(self):
        item = normalize_youtube_item({
            "video_id": "claim002",
            "channel_name": "테스트 투자채널",
            "transcript": [{"start": 30, "text": "엔비디아는 비싸지 않습니다. 지금 봐야 할 구간입니다."}],
        })
        claims = extract_claim_candidates([item])
        nvidia = next(c for c in claims if c["assetName"] == "엔비디아")
        self.assertEqual(nvidia["stance"], "bullish")
        self.assertNotEqual(nvidia["claimType"], "negative_avoid")


class IngestionCliTests(unittest.TestCase):
    def test_dry_run_cli_writes_outputs(self):
        run_id = "test-dry-run"
        out_dir = ROOT / "data" / "ingestion_runs"
        cmd = [
            sys.executable,
            str(ROOT / "scripts" / "ingest_investment_content.py"),
            "--mode",
            "youtube-discovery",
            "--dry-run",
            "--run-id",
            run_id,
            "--print-summary",
        ]
        completed = subprocess.run(cmd, cwd=ROOT, text=True, capture_output=True, timeout=30)
        self.assertEqual(completed.returncode, 0, completed.stderr)
        summary = json.loads(completed.stdout)
        self.assertEqual(summary["provider"], "dry-run")
        run_dir = ROOT / summary["runDir"]
        self.assertTrue((run_dir / "review_queue.json").exists())
        review = json.loads((run_dir / "review_queue.json").read_text(encoding="utf-8"))
        self.assertGreaterEqual(len(review), 1)


if __name__ == "__main__":
    unittest.main()
