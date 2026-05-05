# PMF League OS Release Notes

Date: 2026-05-05
Status: production deployed and verified.

## Implemented

- Versioned league scoring algorithm `league-ranking-v0.1`.
- Channel and panel league fixtures with score breakdowns.
- League dashboard sections for Channel League, Panel League, promotion candidates, demotion risk, and Caution Watch.
- Weekly Investment Content Report MVP with share/copy blocks.
- Asset Recommendation Timeline MVP with evidence quote, source URL, recommendation-date close, latest price, return, confidence, and human review status.
- Channel Request Loop for adding requested YouTube channels as Rookie candidates via localStorage.
- PMF Signals Preview for local event summaries.
- Compliance/evidence guardrails: public-content basis, recommendation-date close basis, quote evidence, and “not investment advice” wording.
- YouTube seed scraper script with no-credential HTML fallback when `yt-dlp` is unavailable.
- Font inheritance fix for `textarea`, `code`, and `pre` to prevent Hangul missing-glyph boxes in share text areas.

## Scraping Seed Status

Command:

```bash
npm run scrape:seed
```

Output file:

```text
data/scraped/youtube-seed.json
```

Current scrape tool:

```text
html-search-fallback
```

Notes:

- This is candidate discovery only.
- Results are not verified investment picks.
- Transcript/entity extraction still requires review.
- `yt-dlp` is not installed in the current environment, so the script used a no-dependency YouTube search HTML fallback.

## Verified Locally

Commands passed:

```bash
npm test
npm run build
LD_LIBRARY_PATH=/tmp/chrome-libs/root/usr/lib/x86_64-linux-gnu:$LD_LIBRARY_PATH node tests/multichannel-responsive-smoke.js
LD_LIBRARY_PATH=/tmp/chrome-libs/root/usr/lib/x86_64-linux-gnu:$LD_LIBRARY_PATH node tests/mobile-browser-smoke.js
```

Local screenshot:

```text
/tmp/investment-dashboard-local-mobile-optimized.png
```

Local visual QA result:

```text
PASS — no major mobile layout regression. Minor concern: dense text on mobile due to content-heavy dashboard.
```

## Production Deploy

Production URL:

```text
https://investment-content-dashboard.vercel.app/
```

Latest verified deployment URL:

```text
https://investment-content-dashboard-m3v2882hi-andy-7767s-projects.vercel.app
```

Deploy method:

```bash
vercel build --prod --token "[REDACTED]"
vercel deploy --prebuilt --prod --yes --token "[REDACTED]"
```

HTTP verification:

```text
https://investment-content-dashboard.vercel.app/ → HTTP 200
```

Production smoke passed:

```bash
LD_LIBRARY_PATH=/tmp/chrome-libs/root/usr/lib/x86_64-linux-gnu:$LD_LIBRARY_PATH node tests/prod-multichannel-responsive-smoke.js
```

Screenshots:

```text
/tmp/investment-dashboard-prod-multichannel-mobile.png
/tmp/investment-dashboard-prod-multichannel-desktop.png
```

Production visual QA:

```text
PASS — mobile and desktop layouts render correctly, Hangul rendering is normal, PMF League OS sections are present.
```

## Security Note

A Vercel token was used for deployment and is intentionally redacted in docs/log summaries. Revoke or rotate the token if it was created for this support session.

## Next Work

- Connect scraped seed candidates to an internal review queue.
- Add transcript scraping/extraction pipeline with confidence and human review status.
- Replace fixture price data with a conservative price-data ingestion job.
- Add public report pages and share-card image generation.
