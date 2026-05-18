#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from lib.ingestion_py.claim_extractor import write_postprocess_outputs
from lib.ingestion_py.clients import IngestionError
from lib.ingestion_py.runner import load_channels, persist_run, run_channel_transcripts


def read_defaults(config_path: Path) -> dict:
    if not config_path.exists():
        return {}
    data = json.loads(config_path.read_text(encoding="utf-8"))
    if isinstance(data, dict):
        return dict(data.get("defaults") or {})
    return {}


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Daily YouTube transcript collector for Investment Content OS")
    parser.add_argument("--channels", default="config/youtube_channels.json")
    parser.add_argument("--run-id", default=None)
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--print-summary", action="store_true")
    args = parser.parse_args(argv)

    config_path = ROOT / args.channels
    defaults = read_defaults(config_path)
    channels = load_channels(str(config_path))
    if not channels and not args.dry_run:
        print(f"collector failed: no channels in {config_path}", file=sys.stderr)
        return 1

    days = int(defaults.get("days", 2))
    max_videos = int(defaults.get("maxVideosPerChannel", 2))
    language = str(defaults.get("language", "ko"))
    run_id = args.run_id or "daily-youtube-transcripts-" + datetime.now(timezone.utc).strftime("%H%M%S")

    try:
        result = run_channel_transcripts(
            channels,
            max_videos=max_videos,
            days=days,
            language=language,
            dry_run=args.dry_run,
        )
        run_dir = persist_run(ROOT, "channel-transcripts", result, run_id=run_id)
        postprocess = write_postprocess_outputs(run_dir)
        summary = {
            "ok": True,
            "job": "daily-youtube-transcripts",
            "provider": result.get("provider"),
            "actor": result.get("actor"),
            "channelCount": len(channels),
            "days": days,
            "maxVideosPerChannel": max_videos,
            "language": language,
            "rawCount": len(result.get("raw", [])),
            "normalizedCount": len(result.get("normalized", [])),
            "claimCandidates": postprocess.get("claimCandidates"),
            "exclusionCandidates": postprocess.get("exclusionCandidates"),
            "runDir": str(run_dir.relative_to(ROOT)),
            "postprocessDir": str((run_dir / "postprocess").relative_to(ROOT)),
            "dataStatus": "review queue / transcript-ready candidates only; claim candidates require human review; not investment advice",
        }
        print(json.dumps(summary, ensure_ascii=False, indent=2) if args.print_summary else summary)
        return 0
    except IngestionError as exc:
        print(f"collector failed: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
