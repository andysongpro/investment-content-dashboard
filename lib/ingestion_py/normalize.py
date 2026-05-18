from __future__ import annotations

import hashlib
import re
from datetime import datetime, timezone
from typing import Any, Dict, Iterable, List, Optional

TITLE_SEED_VERSION = "title-claim-seed-v0.1"
TRANSCRIPT_READY_VERSION = "content-ingestion-v0.1"

YOUTUBE_ID_RE = re.compile(r"(?:v=|youtu\.be/|shorts/)([A-Za-z0-9_-]{6,})")


def now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def stable_id(prefix: str, *parts: Any) -> str:
    raw = "|".join(str(p or "") for p in parts)
    return f"{prefix}:{hashlib.sha1(raw.encode('utf-8')).hexdigest()[:16]}"


def extract_youtube_id(url: str) -> Optional[str]:
    match = YOUTUBE_ID_RE.search(url or "")
    return match.group(1) if match else None


def is_youtube_url(url: str) -> bool:
    return "youtube.com" in (url or "") or "youtu.be" in (url or "")


def _first(*values: Any) -> Any:
    for value in values:
        if value not in (None, "", [], {}):
            return value
    return None


def _get_url(item: Dict[str, Any]) -> Optional[str]:
    url = _first(item.get("url"), item.get("webpage_url"), item.get("videoUrl"), item.get("video_url"), item.get("link"))
    if isinstance(url, dict):
        url = url.get("url")
    video_id = _first(item.get("video_id"), item.get("videoId"), item.get("id"))
    if not url and video_id:
        url = f"https://www.youtube.com/watch?v={video_id}"
    return url


def _get_transcript(item: Dict[str, Any]) -> Any:
    return _first(
        item.get("transcript"),
        item.get("transcript_text"),
        item.get("transcriptText"),
        item.get("captions"),
        item.get("subtitles"),
        item.get("subtitle"),
    )


def transcript_to_text(transcript: Any) -> str:
    if not transcript:
        return ""
    if isinstance(transcript, str):
        return transcript.strip()
    if isinstance(transcript, list):
        chunks = []
        for part in transcript:
            if isinstance(part, str):
                chunks.append(part)
            elif isinstance(part, dict):
                chunks.append(str(_first(part.get("text"), part.get("caption"), part.get("content"), "")))
        return " ".join(c.strip() for c in chunks if c and c.strip())
    if isinstance(transcript, dict):
        return str(_first(transcript.get("text"), transcript.get("content"), transcript.get("transcript"), "")).strip()
    return str(transcript).strip()


def seconds_to_timestamp(value: Any) -> Optional[str]:
    try:
        seconds = float(value)
    except (TypeError, ValueError):
        return None
    if seconds < 0:
        return None
    total = int(seconds)
    hours, rem = divmod(total, 3600)
    minutes, secs = divmod(rem, 60)
    if hours:
        return f"{hours:02d}:{minutes:02d}:{secs:02d}"
    return f"{minutes:02d}:{secs:02d}"


def transcript_to_segments(transcript: Any) -> List[Dict[str, Any]]:
    """Preserve timestamped transcript chunks for later evidence/claim extraction."""
    if not isinstance(transcript, list):
        return []
    segments: List[Dict[str, Any]] = []
    for part in transcript:
        if not isinstance(part, dict):
            continue
        text = str(_first(part.get("text"), part.get("caption"), part.get("content"), "")).strip()
        if not text:
            continue
        start = _first(part.get("start"), part.get("startTime"), part.get("offset"))
        end = _first(part.get("end"), part.get("endTime"))
        duration = part.get("duration")
        segments.append({
            "start": start,
            "end": end,
            "duration": duration,
            "timestamp": seconds_to_timestamp(start),
            "text": text,
        })
    return segments


def normalize_youtube_item(item: Dict[str, Any], *, source_query: Optional[str] = None, source_actor: Optional[str] = None) -> Dict[str, Any]:
    url = _get_url(item) or ""
    video_id = _first(item.get("video_id"), item.get("videoId"), item.get("id"), extract_youtube_id(url))
    title = _first(item.get("title"), item.get("videoTitle"), item.get("name"), "")
    channel_name = _first(item.get("channel_name"), item.get("channelName"), item.get("channel"), item.get("uploader"), item.get("author"))
    published_at = _first(item.get("publishedAt"), item.get("published_at"), item.get("upload_date"), item.get("datePublished"), item.get("publishedTimeText"))
    transcript_raw = _get_transcript(item)
    transcript_text = transcript_to_text(transcript_raw)
    transcript_segments = transcript_to_segments(transcript_raw)
    transcript_available = bool(transcript_text or transcript_segments)
    content_id = f"youtube:{video_id}" if video_id else stable_id("youtube", url, title)
    return {
        "contentId": content_id,
        "sourceType": "youtube_channel" if channel_name else "youtube_video",
        "platform": "youtube",
        "title": title,
        "url": url,
        "publishedAt": published_at,
        "channelName": channel_name,
        "videoId": video_id,
        "sourceQuery": source_query,
        "sourceActor": source_actor,
        "transcriptAvailable": transcript_available,
        "transcriptText": transcript_text if transcript_available else None,
        "transcriptSegments": transcript_segments,
        "reviewStatus": "needs_human_review" if transcript_available else "needs_transcript_review",
        "titleMetadataSeed": not transcript_available,
        "transcriptVerified": False,
        "performanceBacktested": False,
        "evidenceSource": "transcript_available_unextracted" if transcript_available else "video_title_only",
        "algorithmVersion": TRANSCRIPT_READY_VERSION if transcript_available else TITLE_SEED_VERSION,
        "collectedAt": now_iso(),
    }


def normalize_tavily_result(item: Dict[str, Any], *, source_query: str) -> Dict[str, Any]:
    url = item.get("url") or ""
    if is_youtube_url(url):
        return normalize_youtube_item(item, source_query=source_query, source_actor="tavily")
    return {
        "contentId": stable_id("web", url, item.get("title")),
        "sourceType": "web_page",
        "platform": "web",
        "title": item.get("title") or "",
        "url": url,
        "publishedAt": None,
        "sourceQuery": source_query,
        "transcriptAvailable": False,
        "reviewStatus": "needs_source_review",
        "titleMetadataSeed": True,
        "transcriptVerified": False,
        "performanceBacktested": False,
        "evidenceSource": "search_metadata_only",
        "algorithmVersion": TITLE_SEED_VERSION,
        "collectedAt": now_iso(),
        "snippet": item.get("content") or item.get("description"),
    }


def review_queue_from_normalized(items: Iterable[Dict[str, Any]]) -> List[Dict[str, Any]]:
    queue = []
    for item in items:
        queue.append({
            "contentId": item.get("contentId"),
            "title": item.get("title"),
            "url": item.get("url"),
            "sourceType": item.get("sourceType"),
            "reviewStatus": item.get("reviewStatus"),
            "reason": "Transcript exists but financial claim extraction is not implemented" if item.get("transcriptAvailable") else "Title/metadata seed requires transcript/source review",
            "promotionCondition": "Promote only after direct transcript/source quote with timestamp/page evidence is extracted",
            "algorithmVersion": item.get("algorithmVersion"),
        })
    return queue
