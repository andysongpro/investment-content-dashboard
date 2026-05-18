#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from lib.ingestion_py.clients import IngestionError
from lib.ingestion_py.runner import (
    load_channels,
    persist_run,
    run_channel_transcripts,
    run_normalize_sample,
    run_youtube_discovery,
)


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Investment Content OS ingestion router v0.1")
    parser.add_argument("--mode", choices=["youtube-discovery", "channel-transcripts", "normalize-sample"], required=True)
    parser.add_argument("--query", default="국내주식 추천", help="YouTube/web discovery query")
    parser.add_argument("--max-results", type=int, default=10)
    parser.add_argument("--channels", help="JSON file: array of channel URLs or {'channels': [...]}")
    parser.add_argument("--days", type=int, default=2)
    parser.add_argument("--max-videos-per-channel", type=int, default=5)
    parser.add_argument("--language", default="ko")
    parser.add_argument("--dry-run", action="store_true", help="Use built-in fixture data; no API keys needed")
    parser.add_argument("--run-id", help="Optional deterministic run directory id")
    parser.add_argument("--print-summary", action="store_true", help="Print compact JSON summary")
    return parser


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    try:
        if args.mode == "youtube-discovery":
            result = run_youtube_discovery(args.query, args.max_results, dry_run=args.dry_run)
        elif args.mode == "channel-transcripts":
            channels = load_channels(args.channels)
            if not channels and not args.dry_run:
                raise IngestionError("--channels is required unless --dry-run is used")
            result = run_channel_transcripts(
                channels,
                max_videos=args.max_videos_per_channel,
                days=args.days,
                language=args.language,
                dry_run=args.dry_run,
            )
        else:
            result = run_normalize_sample(dry_run=True)
        run_dir = persist_run(ROOT, args.mode, result, run_id=args.run_id)
        summary = {
            "ok": True,
            "mode": args.mode,
            "provider": result.get("provider"),
            "actor": result.get("actor"),
            "fallbackReason": result.get("fallbackReason"),
            "rawCount": len(result.get("raw", [])),
            "normalizedCount": len(result.get("normalized", [])),
            "runDir": str(run_dir.relative_to(ROOT)),
        }
        if args.print_summary:
            print(json.dumps(summary, ensure_ascii=False, indent=2))
        else:
            print(f"Wrote {summary['runDir']} ({summary['normalizedCount']} normalized items via {summary['provider']})")
        return 0
    except Exception as exc:
        # Do not print env var values or provider tokens.
        print(f"ingestion failed: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
