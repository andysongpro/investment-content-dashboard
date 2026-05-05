#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const https = require('https');
const { spawnSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'data', 'scraped');
const outFile = path.join(outDir, 'youtube-seed.json');
const queries = [
  { id: 'kim', name: '김작가 TV', url: 'https://www.youtube.com/results?search_query=%EA%B9%80%EC%9E%91%EA%B0%80TV+%EC%A3%BC%EC%8B%9D+2026' },
  { id: 'sinsa', name: '신사임당', url: 'https://www.youtube.com/results?search_query=%EC%8B%A0%EC%82%AC%EC%9E%84%EB%8B%B9+%EC%A3%BC%EC%8B%9D+2026' },
];

function hasYtDlp() {
  const probe = spawnSync('yt-dlp', ['--version'], { encoding: 'utf8' });
  return probe.status === 0;
}

function tryYtDlp(query) {
  const result = spawnSync('yt-dlp', ['--dump-json', '--flat-playlist', '--playlist-end', '10', query.url], { encoding: 'utf8', timeout: 30000, maxBuffer: 1024 * 1024 * 5 });
  if (result.status !== 0) return { error: result.stderr || result.error?.message || 'yt-dlp failed', candidates: [] };
  const candidates = result.stdout.split('\n').filter(Boolean).map(line => {
    try {
      const item = JSON.parse(line);
      return {
        id: item.id,
        title: item.title,
        url: item.webpage_url || (item.id ? `https://www.youtube.com/watch?v=${item.id}` : item.url),
        uploader: item.uploader,
        duration: item.duration,
        seedOnly: true,
        scrapeMethod: 'yt-dlp',
      };
    } catch { return null; }
  }).filter(Boolean);
  return { candidates };
}

function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; InvestmentContentSeed/0.1; +https://investment-content-dashboard.vercel.app)',
        'Accept-Language': 'ko-KR,ko;q=0.9,en;q=0.7',
      },
      timeout: 20000,
    }, (res) => {
      let data = '';
      res.setEncoding('utf8');
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => resolve(data));
    });
    req.on('timeout', () => { req.destroy(new Error('timeout')); });
    req.on('error', reject);
  });
}

function cleanText(value) {
  if (!value) return '';
  return value
    .replace(/\\u0026/g, '&')
    .replace(/\\u003d/g, '=')
    .replace(/\\u003c/g, '<')
    .replace(/\\u003e/g, '>')
    .replace(/\\n/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/\\+$/g, '')
    .trim();
}

function parseYouTubeSearchHtml(html) {
  const candidates = [];
  const seen = new Set();
  const seenTitles = new Set();
  const chunks = html.split('"videoRenderer":').slice(1);
  for (const chunk of chunks) {
    const idMatch = chunk.match(/"videoId":"([^"]+)"/);
    if (!idMatch) continue;
    const id = idMatch[1];
    if (seen.has(id)) continue;
    const titleMatch = chunk.match(/"title":\{"runs":\[\{"text":"([^"]+)"/) || chunk.match(/"title":\{"simpleText":"([^"]+)"/);
    const uploaderMatch = chunk.match(/"ownerText":\{"runs":\[\{"text":"([^"]+)"/) || chunk.match(/"longBylineText":\{"runs":\[\{"text":"([^"]+)"/);
    const publishedMatch = chunk.match(/"publishedTimeText":\{"simpleText":"([^"]+)"/);
    const viewMatch = chunk.match(/"viewCountText":\{"simpleText":"([^"]+)"/);
    const title = cleanText(titleMatch?.[1]);
    // YouTube search HTML sometimes includes escaped quote fragments before the real title.
    // Seed data is for candidate discovery only, so skip unusable title fragments instead of polluting fixtures.
    if (!title || title === '\\' || title.length < 6 || seenTitles.has(title)) continue;
    candidates.push({
      id,
      title,
      url: `https://www.youtube.com/watch?v=${id}`,
      uploader: cleanText(uploaderMatch?.[1]) || null,
      publishedText: cleanText(publishedMatch?.[1]) || null,
      viewCountText: cleanText(viewMatch?.[1]) || null,
      seedOnly: true,
      scrapeMethod: 'html-search',
    });
    seen.add(id);
    seenTitles.add(title);
    if (candidates.length >= 10) break;
  }
  return candidates;
}

async function tryHtmlScrape(query) {
  try {
    const html = await fetchHtml(query.url);
    const candidates = parseYouTubeSearchHtml(html);
    return { candidates, htmlBytes: html.length };
  } catch (error) {
    return { candidates: [], error: error.message };
  }
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  const ytDlpAvailable = hasYtDlp();
  const rows = [];
  for (const q of queries) {
    if (ytDlpAvailable) {
      const result = tryYtDlp(q);
      if (result.candidates.length) rows.push({ ...q, ...result });
      else rows.push({ ...q, ...await tryHtmlScrape(q), fallbackReason: result.error || 'yt-dlp returned no candidates' });
    } else {
      rows.push({ ...q, ...await tryHtmlScrape(q), fallbackReason: 'yt-dlp not installed; used no-dependency HTML scrape fallback' });
    }
  }
  const payload = {
    generatedAt: new Date().toISOString(),
    dataStatus: 'seed/candidate data only - not investment advice, not verified extraction',
    note: 'Safe no-credential YouTube seed. HTML scrape fallback stores candidate videos only; transcript/entity extraction still requires review.',
    tool: ytDlpAvailable ? 'yt-dlp-or-html-fallback' : 'html-search-fallback',
    queries: rows,
  };
  fs.writeFileSync(outFile, JSON.stringify(payload, null, 2));
  console.log(`Wrote ${path.relative(root, outFile)} using ${payload.tool}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
