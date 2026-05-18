from __future__ import annotations

import hashlib
import json
import re
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional

CLAIM_EXTRACTION_VERSION = "content-pick-extraction-v0.1"
CHANNEL_HEALTH_VERSION = "channel-health-v0.1"

# v0.1 intentionally small/high-confidence dictionary. Expand after review.
ASSET_DICTIONARY: List[Dict[str, str]] = [
    {"name": "삼성전자", "ticker": "005930", "market": "KR"},
    {"name": "SK하이닉스", "ticker": "000660", "market": "KR"},
    {"name": "하이닉스", "ticker": "000660", "market": "KR", "canonicalName": "SK하이닉스"},
    {"name": "현대차", "ticker": "005380", "market": "KR"},
    {"name": "기아", "ticker": "000270", "market": "KR"},
    {"name": "NAVER", "ticker": "035420", "market": "KR"},
    {"name": "네이버", "ticker": "035420", "market": "KR", "canonicalName": "NAVER"},
    {"name": "카카오", "ticker": "035720", "market": "KR"},
    {"name": "LG에너지솔루션", "ticker": "373220", "market": "KR"},
    {"name": "삼성SDI", "ticker": "006400", "market": "KR"},
    {"name": "POSCO홀딩스", "ticker": "005490", "market": "KR"},
    {"name": "포스코홀딩스", "ticker": "005490", "market": "KR", "canonicalName": "POSCO홀딩스"},
    {"name": "한화에어로스페이스", "ticker": "012450", "market": "KR"},
    {"name": "두산에너빌리티", "ticker": "034020", "market": "KR"},
    {"name": "한미반도체", "ticker": "042700", "market": "KR"},
    {"name": "테슬라", "ticker": "TSLA", "market": "US"},
    {"name": "엔비디아", "ticker": "NVDA", "market": "US"},
    {"name": "애플", "ticker": "AAPL", "market": "US"},
    {"name": "마이크로소프트", "ticker": "MSFT", "market": "US"},
    {"name": "구글", "ticker": "GOOGL", "market": "US"},
    {"name": "알파벳", "ticker": "GOOGL", "market": "US"},
    {"name": "아마존", "ticker": "AMZN", "market": "US"},
    {"name": "메타", "ticker": "META", "market": "US"},
    {"name": "브로드컴", "ticker": "AVGO", "market": "US"},
    {"name": "마이크론", "ticker": "MU", "market": "US"},
    {"name": "샌디스크", "ticker": "SNDK", "market": "US"},
]

BULLISH_MARKERS = [
    "관심", "좋아 보", "매력", "저평가", "기회", "주목", "담아", "사도", "매수", "추천",
    "상승", "반등", "튀어오", "좋은 주식", "대장주", "수혜", "모아", "봐야",
]
BEARISH_MARKERS = [
    "리스크", "위험", "피해야", "매도", "하락", "손절", "비싸", "고평가", "주의",
]
EXPLICIT_MARKERS = ["추천", "매수", "사도", "담아", "탑픽", "top pick", "비중"]


def now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def stable_claim_id(*parts: Any) -> str:
    raw = "|".join(str(p or "") for p in parts)
    return "claim:" + hashlib.sha1(raw.encode("utf-8")).hexdigest()[:16]


def _contains_any(text: str, markers: Iterable[str]) -> bool:
    lower = text.lower()
    return any(marker.lower() in lower for marker in markers)


def _has_bearish_signal(text: str) -> bool:
    lower = text.lower()
    for marker in BEARISH_MARKERS:
        if marker.lower() not in lower:
            continue
        if marker == "비싸" and ("비싸지 않" in text or "비싸지 않습니다" in text or "비싸지 않다" in text):
            continue
        if marker == "고평가" and ("고평가가 아니" in text or "고평가 아니" in text):
            continue
        return True
    return False


def _asset_hits(text: str) -> List[Dict[str, str]]:
    hits: List[Dict[str, str]] = []
    for asset in ASSET_DICTIONARY:
        if asset["name"] and asset["name"] in text:
            canonical = asset.get("canonicalName", asset["name"])
            hits.append({**asset, "canonicalName": canonical})
    # de-dupe aliases by ticker/name, preserving first mention order.
    seen = set()
    unique: List[Dict[str, str]] = []
    for hit in hits:
        key = (hit.get("ticker"), hit.get("canonicalName"))
        if key not in seen:
            seen.add(key)
            unique.append(hit)
    return unique


def _classify_segment(text: str) -> Optional[Dict[str, str]]:
    bullish = _contains_any(text, BULLISH_MARKERS)
    bearish = _has_bearish_signal(text)
    explicit = _contains_any(text, EXPLICIT_MARKERS)
    if explicit and bullish and not bearish:
        return {"claimType": "explicit_recommendation", "stance": "bullish", "conviction": "moderate", "confidence": "medium"}
    if bullish and not bearish:
        return {"claimType": "positive_watchlist", "stance": "bullish", "conviction": "watchlist", "confidence": "medium"}
    if bearish and not bullish:
        return {"claimType": "negative_avoid", "stance": "bearish", "conviction": "negative", "confidence": "medium"}
    if bullish and bearish:
        return {"claimType": "unclear", "stance": "unclear", "conviction": "unclear", "confidence": "low"}
    return None


def _segments_for_item(item: Dict[str, Any]) -> List[Dict[str, Any]]:
    segments = item.get("transcriptSegments") or []
    if segments:
        return [seg for seg in segments if isinstance(seg, dict)]
    text = item.get("transcriptText")
    if text:
        return [{"text": text, "timestamp": None, "start": None, "end": None, "duration": None}]
    return []


def extract_claim_candidates(items: Iterable[Dict[str, Any]], *, max_claims_per_content: int = 20) -> List[Dict[str, Any]]:
    """Extract quote-backed candidate mentions; never mark them verified in v0.1."""
    claims: List[Dict[str, Any]] = []
    for item in items:
        if not item.get("transcriptAvailable"):
            continue
        content_claims = 0
        emitted_assets_for_content = set()
        for seg in _segments_for_item(item):
            quote = str(seg.get("text") or "").strip()
            if not quote:
                continue
            classification = _classify_segment(quote)
            if not classification:
                continue
            for asset in _asset_hits(quote):
                asset_name = asset.get("canonicalName", asset["name"])
                # Keep only first evidence segment per content/asset in v0.1 to avoid noisy duplicates.
                key = (item.get("contentId"), asset_name, asset.get("ticker"))
                if key in emitted_assets_for_content:
                    continue
                emitted_assets_for_content.add(key)
                claim = {
                    "claimId": stable_claim_id(item.get("contentId"), asset_name, asset.get("ticker"), seg.get("timestamp"), quote),
                    "contentId": item.get("contentId"),
                    "sourceId": item.get("sourceId"),
                    "channelName": item.get("channelName"),
                    "contentTitle": item.get("title"),
                    "url": item.get("url"),
                    "publishedAt": item.get("publishedAt"),
                    "claimDate": item.get("publishedAt"),
                    "assetName": asset_name,
                    "ticker": asset.get("ticker"),
                    "market": asset.get("market"),
                    **classification,
                    "evidenceSource": "transcript_candidate",
                    "evidenceQuote": quote,
                    "timestamp": seg.get("timestamp"),
                    "start": seg.get("start"),
                    "end": seg.get("end"),
                    "reviewStatus": "needs_human_review",
                    "transcriptVerified": False,
                    "performanceBacktested": False,
                    "algorithmVersion": CLAIM_EXTRACTION_VERSION,
                    "extractedAt": now_iso(),
                    "limitations": "Rule-based v0.1 candidate. Human review required before verified claim/backtest/league scoring.",
                }
                claims.append(claim)
                content_claims += 1
                if content_claims >= max_claims_per_content:
                    break
            if content_claims >= max_claims_per_content:
                break
    return claims


def evaluate_channel_transcript_health(items: Iterable[Dict[str, Any]], *, missing_threshold: int = 3) -> Dict[str, Any]:
    """Flag channels that repeatedly produce collected videos without transcripts."""
    stats: Dict[str, Dict[str, Any]] = defaultdict(lambda: {
        "channelName": None,
        "totalItems": 0,
        "missingTranscriptCount": 0,
        "transcriptAvailableCount": 0,
        "missingContentIds": [],
        "missingTitles": [],
        "lastPublishedAt": None,
    })
    for item in items:
        channel = item.get("channelName") or item.get("sourceName") or "unknown"
        row = stats[channel]
        row["channelName"] = channel
        row["totalItems"] += 1
        published = item.get("publishedAt")
        if published and (not row["lastPublishedAt"] or str(published) > str(row["lastPublishedAt"])):
            row["lastPublishedAt"] = published
        if item.get("transcriptAvailable"):
            row["transcriptAvailableCount"] += 1
        else:
            row["missingTranscriptCount"] += 1
            row["missingContentIds"].append(item.get("contentId"))
            row["missingTitles"].append(item.get("title"))

    channel_health = []
    exclusion_candidates = []
    for channel in sorted(stats):
        row = dict(stats[channel])
        total = row["totalItems"] or 1
        row["missingTranscriptRate"] = round(row["missingTranscriptCount"] / total, 4)
        row["algorithmVersion"] = CHANNEL_HEALTH_VERSION
        row["statusRecommendation"] = "monitor"
        if row["missingTranscriptCount"] >= missing_threshold and row["transcriptAvailableCount"] == 0:
            row["statusRecommendation"] = "exclude_candidate"
            exclusion_candidates.append({
                "channelName": channel,
                "recommendedStatus": "exclude_candidate",
                "reasonCode": "repeated_missing_transcripts",
                "missingTranscriptCount": row["missingTranscriptCount"],
                "totalItems": row["totalItems"],
                "missingTranscriptRate": row["missingTranscriptRate"],
                "lastPublishedAt": row["lastPublishedAt"],
                "reviewRequired": True,
                "algorithmVersion": CHANNEL_HEALTH_VERSION,
                "reason": f"Collected {row['missingTranscriptCount']} videos without transcripts and no transcript-ready items in the evaluated window.",
            })
        channel_health.append(row)

    return {
        "algorithmVersion": CHANNEL_HEALTH_VERSION,
        "generatedAt": now_iso(),
        "missingThreshold": missing_threshold,
        "channelHealth": channel_health,
        "exclusionCandidates": exclusion_candidates,
    }


def load_normalized_items(run_dir: Path) -> List[Dict[str, Any]]:
    normalized_dir = run_dir / "normalized"
    if not normalized_dir.exists():
        raise FileNotFoundError(f"normalized directory not found: {normalized_dir}")
    files = sorted(normalized_dir.glob("*.json"))
    if not files:
        raise FileNotFoundError(f"no normalized JSON files found under {normalized_dir}")
    items: List[Dict[str, Any]] = []
    for path in files:
        data = json.loads(path.read_text(encoding="utf-8"))
        if isinstance(data, list):
            items.extend(x for x in data if isinstance(x, dict))
    return items


def update_channel_health_state(
    items: Iterable[Dict[str, Any]],
    *,
    prior_state: Optional[Dict[str, Any]] = None,
    missing_threshold: int = 3,
    run_key: Optional[str] = None,
) -> Dict[str, Any]:
    """Persistable channel health state across daily runs.

    A channel becomes an exclusion candidate only after repeated runs where all collected
    items for that channel lack transcripts. One transcript-ready item resets the
    consecutive missing counter.
    """
    state = prior_state.copy() if isinstance(prior_state, dict) else {}
    processed_runs = list(state.get("processedRuns") or [])
    if run_key and run_key in processed_runs:
        return {
            **state,
            "algorithmVersion": CHANNEL_HEALTH_VERSION,
            "generatedAt": now_iso(),
            "missingThreshold": missing_threshold,
            "processedRuns": processed_runs,
            "exclusionCandidates": [],
        }
    channels: Dict[str, Dict[str, Any]] = dict(state.get("channels") or {})
    grouped: Dict[str, List[Dict[str, Any]]] = defaultdict(list)
    for item in items:
        channel = item.get("channelName") or item.get("sourceName") or "unknown"
        grouped[channel].append(item)

    exclusion_candidates: List[Dict[str, Any]] = []
    for channel, channel_items in grouped.items():
        row = dict(channels.get(channel) or {})
        row.setdefault("channelName", channel)
        row.setdefault("consecutiveMissingTranscriptRuns", 0)
        row.setdefault("totalMissingTranscriptItems", 0)
        row.setdefault("totalTranscriptReadyItems", 0)
        row.setdefault("totalObservedItems", 0)
        missing_items = [it for it in channel_items if not it.get("transcriptAvailable")]
        ready_items = [it for it in channel_items if it.get("transcriptAvailable")]
        row["totalObservedItems"] += len(channel_items)
        row["totalMissingTranscriptItems"] += len(missing_items)
        row["totalTranscriptReadyItems"] += len(ready_items)
        row["lastObservedAt"] = now_iso()
        row["lastContentIds"] = [it.get("contentId") for it in channel_items]
        row["lastTitles"] = [it.get("title") for it in channel_items]
        if ready_items:
            row["consecutiveMissingTranscriptRuns"] = 0
            row["statusRecommendation"] = "active"
        elif missing_items:
            row["consecutiveMissingTranscriptRuns"] += 1
            row["statusRecommendation"] = "monitor"
        if row["consecutiveMissingTranscriptRuns"] >= missing_threshold:
            row["statusRecommendation"] = "exclude_candidate"
            exclusion_candidates.append({
                "channelName": channel,
                "recommendedStatus": "exclude_candidate",
                "reasonCode": "repeated_missing_transcripts",
                "consecutiveMissingTranscriptRuns": row["consecutiveMissingTranscriptRuns"],
                "totalMissingTranscriptItems": row["totalMissingTranscriptItems"],
                "totalObservedItems": row["totalObservedItems"],
                "reviewRequired": True,
                "algorithmVersion": CHANNEL_HEALTH_VERSION,
                "reason": f"No transcript-ready item for {row['consecutiveMissingTranscriptRuns']} consecutive observed runs.",
            })
        row["algorithmVersion"] = CHANNEL_HEALTH_VERSION
        channels[channel] = row

    if run_key:
        processed_runs.append(run_key)
        processed_runs = processed_runs[-90:]

    return {
        "algorithmVersion": CHANNEL_HEALTH_VERSION,
        "generatedAt": now_iso(),
        "missingThreshold": missing_threshold,
        "processedRuns": processed_runs,
        "channels": channels,
        "exclusionCandidates": exclusion_candidates,
    }


def _default_state_path(run_dir: Path) -> Path:
    # Expected layout: <root>/data/ingestion_runs/YYYY-MM-DD/RUN_ID
    try:
        return run_dir.parents[3] / "data" / "channel_health_state.json"
    except IndexError:
        return run_dir / "channel_health_state.json"


def _read_json_if_exists(path: Path) -> Dict[str, Any]:
    if not path.exists():
        return {}
    return json.loads(path.read_text(encoding="utf-8"))


def write_postprocess_outputs(run_dir: Path, *, missing_threshold: int = 3) -> Dict[str, Any]:
    items = load_normalized_items(run_dir)
    claims = extract_claim_candidates(items)
    health = evaluate_channel_transcript_health(items, missing_threshold=missing_threshold)
    state_path = _default_state_path(run_dir)
    state = update_channel_health_state(items, prior_state=_read_json_if_exists(state_path), missing_threshold=missing_threshold, run_key=str(run_dir))
    state_path.parent.mkdir(parents=True, exist_ok=True)
    state_path.write_text(json.dumps(state, ensure_ascii=False, indent=2), encoding="utf-8")
    (run_dir / "postprocess").mkdir(parents=True, exist_ok=True)
    (run_dir / "postprocess" / "claim_candidates.json").write_text(json.dumps(claims, ensure_ascii=False, indent=2), encoding="utf-8")
    (run_dir / "postprocess" / "channel_health.json").write_text(json.dumps(health["channelHealth"], ensure_ascii=False, indent=2), encoding="utf-8")
    (run_dir / "postprocess" / "exclusion_candidates.json").write_text(json.dumps(state["exclusionCandidates"], ensure_ascii=False, indent=2), encoding="utf-8")
    summary = {
        "ok": True,
        "runDir": str(run_dir),
        "contentItems": len(items),
        "claimCandidates": len(claims),
        "channelHealthRows": len(health["channelHealth"]),
        "exclusionCandidates": len(state["exclusionCandidates"]),
        "statePath": str(state_path),
        "claimAlgorithmVersion": CLAIM_EXTRACTION_VERSION,
        "channelHealthAlgorithmVersion": CHANNEL_HEALTH_VERSION,
        "dataStatus": "claim candidates require human review; not investment advice",
    }
    (run_dir / "postprocess" / "summary.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")
    return summary
