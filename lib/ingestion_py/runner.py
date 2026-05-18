from __future__ import annotations

import json
import os
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

from .clients import ApifyClient, FirecrawlClient, IngestionError, QuotaExceededError, TavilyClient
from .normalize import normalize_tavily_result, normalize_youtube_item, review_queue_from_normalized

DEFAULT_DISCOVERY_ACTOR = "streamers/youtube-scraper"
DEFAULT_TRANSCRIPT_ACTOR = "starvibe/youtube-video-transcript"


def utc_date() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%d")


def make_run_dir(root: Path, run_id: Optional[str] = None) -> Path:
    rid = run_id or datetime.now(timezone.utc).strftime("%H%M%S")
    run_dir = root / "data" / "ingestion_runs" / utc_date() / rid
    (run_dir / "raw").mkdir(parents=True, exist_ok=True)
    (run_dir / "normalized").mkdir(parents=True, exist_ok=True)
    return run_dir


def write_json(path: Path, data: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def dry_run_items(query: str = "국내주식 추천") -> List[Dict[str, Any]]:
    return [
        {
            "id": "dryrun001",
            "title": "반도체 주식, 지금 봐야 할 핵심 포인트",
            "url": "https://www.youtube.com/watch?v=dryrun001",
            "channelName": "Dry Run 투자채널",
            "publishedAt": "2026-05-18T00:00:00Z",
            "sourceQuery": query,
        },
        {
            "id": "dryrun002",
            "title": "이 종목 아직도 싼가? 2차전지 밸류체인 점검",
            "url": "https://www.youtube.com/watch?v=dryrun002",
            "channelName": "Dry Run 마켓토크",
            "publishedAt": "2026-05-18T01:00:00Z",
            "sourceQuery": query,
            "transcript_text": "오늘은 2차전지 밸류체인을 점검합니다. 특정 종목 추천이 아니라 공개 콘텐츠 발언 검증 예시입니다.",
        },
    ]


def discovery_input(query: str, max_results: int) -> Dict[str, Any]:
    return {
        "searchQueries": [query],
        "maxResults": max_results,
        "maxResultsShorts": 0,
        "maxResultStreams": 0,
        "downloadSubtitles": False,
        "sortingOrder": "date",
        "dateFilter": "week",
    }


def run_youtube_discovery(query: str, max_results: int, *, dry_run: bool = False) -> Dict[str, Any]:
    if dry_run:
        raw = dry_run_items(query)
        normalized = [normalize_youtube_item(item, source_query=query, source_actor="dry-run") for item in raw]
        return {"provider": "dry-run", "raw": raw, "normalized": normalized, "fallbackReason": None}

    tavily = TavilyClient()
    apify = ApifyClient()
    if tavily.available:
        try:
            raw = tavily.search(f"site:youtube.com {query}", max_results=max_results)
            normalized = [normalize_tavily_result(item, source_query=query) for item in raw]
            return {"provider": "tavily", "raw": raw, "normalized": normalized, "fallbackReason": None}
        except QuotaExceededError as exc:
            fallback_reason = str(exc)
        except IngestionError as exc:
            fallback_reason = f"Tavily failed: {exc}"
    else:
        fallback_reason = "TAVILY_API_KEY not configured"

    if not apify.available:
        raise IngestionError(f"{fallback_reason}; APIFY_TOKEN not configured for YouTube fallback")
    actor = os.getenv("APIFY_YOUTUBE_DISCOVERY_ACTOR", DEFAULT_DISCOVERY_ACTOR)
    raw = apify.run_actor_sync(actor, discovery_input(query, max_results))
    normalized = [normalize_youtube_item(item, source_query=query, source_actor=actor) for item in raw]
    return {"provider": "apify", "raw": raw, "normalized": normalized, "fallbackReason": fallback_reason, "actor": actor}


def channel_input(channel_url: str, max_videos: int, days: int, language: str) -> Dict[str, Any]:
    end = datetime.now(timezone.utc).date()
    start = end - timedelta(days=days)
    return {
        "channel_url": channel_url,
        "max_videos": max_videos,
        "language": language,
        "start_date": start.isoformat(),
        "end_date": end.isoformat(),
        "include_transcript_text": True,
    }


def run_channel_transcripts(channels: List[str], max_videos: int, days: int, language: str, *, dry_run: bool = False) -> Dict[str, Any]:
    if dry_run:
        raw = dry_run_items("channel-transcripts")
        normalized = [normalize_youtube_item(item, source_query="channel-transcripts", source_actor="dry-run") for item in raw]
        return {"provider": "dry-run", "raw": raw, "normalized": normalized, "fallbackReason": None}

    apify = ApifyClient()
    if not apify.available:
        raise IngestionError("APIFY_TOKEN not configured for channel transcript collection")
    actor = os.getenv("APIFY_YOUTUBE_TRANSCRIPT_ACTOR", DEFAULT_TRANSCRIPT_ACTOR)
    all_raw: List[Dict[str, Any]] = []
    for channel_url in channels:
        all_raw.extend(apify.run_actor_sync(actor, channel_input(channel_url, max_videos, days, language)))
    normalized = [normalize_youtube_item(item, source_query="channel-transcripts", source_actor=actor) for item in all_raw]
    return {"provider": "apify", "raw": all_raw, "normalized": normalized, "actor": actor, "fallbackReason": None}


def run_normalize_sample(*, dry_run: bool = True) -> Dict[str, Any]:
    raw = dry_run_items("normalize-sample")
    normalized = [normalize_youtube_item(item, source_query="normalize-sample", source_actor="sample") for item in raw]
    return {"provider": "sample", "raw": raw, "normalized": normalized, "fallbackReason": None}


def persist_run(root: Path, mode: str, result: Dict[str, Any], run_id: Optional[str] = None) -> Path:
    run_dir = make_run_dir(root, run_id)
    meta = {
        "mode": mode,
        "provider": result.get("provider"),
        "actor": result.get("actor"),
        "fallbackReason": result.get("fallbackReason"),
        "generatedAt": datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z"),
        "secretsPrinted": False,
        "dataStatus": "candidate/review data only - not investment advice",
    }
    write_json(run_dir / "run_meta.json", meta)
    write_json(run_dir / "raw" / f"{mode}.json", result.get("raw", []))
    normalized = result.get("normalized", [])
    write_json(run_dir / "normalized" / f"{mode}.json", normalized)
    write_json(run_dir / "review_queue.json", review_queue_from_normalized(normalized))
    return run_dir


def _channel_url(entry: Any) -> Optional[str]:
    if isinstance(entry, str):
        return entry
    if isinstance(entry, dict):
        value = entry.get("url") or entry.get("channel_url") or entry.get("channelUrl")
        return str(value) if value else None
    return None


def load_channels(path: Optional[str]) -> List[str]:
    if not path:
        return []
    data = json.loads(Path(path).read_text(encoding="utf-8"))
    entries: List[Any]
    if isinstance(data, list):
        entries = data
    elif isinstance(data, dict):
        entries = list(data.get("channels", []))
    else:
        entries = []
    urls = [_channel_url(entry) for entry in entries]
    return [url for url in urls if url]
