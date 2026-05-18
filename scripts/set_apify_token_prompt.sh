#!/usr/bin/env bash
set -euo pipefail
cd /home/user/projects/investment-content-dashboard
printf '\nInvestment Content Dashboard - APIFY_TOKEN setup\n'
printf 'Token is written to: %s\n\n' "$(pwd)/.env.local"
printf 'Paste APIFY_TOKEN and press Enter: '
IFS= read -r APIFY_TOKEN
if [ -z "${APIFY_TOKEN}" ]; then
  echo 'No token entered. Nothing changed.'
  printf '\nPress Enter to close...'
  IFS= read -r _ || true
  exit 1
fi
umask 077
tmp="$(mktemp)"
if [ -f .env.local ]; then
  grep -v '^APIFY_TOKEN=' .env.local > "$tmp" || true
fi
printf 'APIFY_TOKEN=%s\n' "$APIFY_TOKEN" >> "$tmp"
mv "$tmp" .env.local
chmod 600 .env.local
printf '\nSaved APIFY_TOKEN to .env.local\n'
printf 'You can now run:\n  python3 scripts/ingest_investment_content.py --mode youtube-discovery --query "국내주식 추천" --max-results 5 --print-summary\n\n'
printf 'Press Enter to close...'
IFS= read -r _ || true
