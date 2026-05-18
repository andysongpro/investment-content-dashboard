#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from lib.ingestion_py.claim_extractor import write_postprocess_outputs


def main() -> int:
    parser = argparse.ArgumentParser(description="Extract claim candidates and channel health from an ingestion run")
    parser.add_argument("--run-dir", required=True, help="Path to data/ingestion_runs/YYYY-MM-DD/RUN_ID")
    parser.add_argument("--missing-threshold", type=int, default=3, help="Missing transcript count before exclusion candidate")
    parser.add_argument("--print-summary", action="store_true")
    args = parser.parse_args()

    run_dir = Path(args.run_dir)
    if not run_dir.is_absolute():
        run_dir = ROOT / run_dir
    summary = write_postprocess_outputs(run_dir, missing_threshold=args.missing_threshold)
    if args.print_summary:
        print(json.dumps(summary, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
