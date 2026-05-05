const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }

function test(name, fn) {
  try { fn(); console.log(`PASS ${name}`); }
  catch (e) { console.error(`FAIL ${name}\n${e.message}`); process.exitCode = 1; }
}

test('global CSS defines Korean-first font fallback and layout embeds Korean webfont', () => {
  const css = read('app/globals.css');
  const layout = read('app/layout.jsx');
  assert(css.includes('Noto Sans KR') || css.includes('Pretendard'));
  assert(css.includes('Apple SD Gothic Neo'));
  assert(css.includes('Malgun Gothic'));
  assert(layout.includes("next/font/google"));
  assert(layout.includes('Noto_Sans_KR'));
});

test('source form validates youtube url and numeric limits with Korean messages', () => {
  const app = read('app/page.jsx');
  assert(app.includes('유효한 YouTube URL'));
  assert(app.includes('1 이상'));
  assert(app.includes('분석할 영상 수는 후보 영상 수보다 클 수 없습니다'));
  assert(app.includes('type="url"'));
  assert(app.includes('type="number"'));
});

test('internal enum labels are mapped to user-facing Korean labels', () => {
  const app = read('app/page.jsx');
  assert(app.includes('수동 검토 필요'));
  assert(app.includes('매우 긍정'));
  assert(app.includes('불명확'));
  assert(app.includes('샘플 데이터'));
});

test('review queue has top jump link and explicit review actions', () => {
  const app = read('app/page.jsx');
  assert(app.includes('#review-queue'));
  assert(app.includes('검토 큐로 이동'));
  assert(app.includes('포함 승인'));
  assert(app.includes('보류 처리'));
  assert(app.includes('검토 완료'));
});

test('performance board explains GOOD/FLAT/MISS and data basis', () => {
  const app = read('app/page.jsx');
  assert(app.includes('GOOD: +5% 이상'));
  assert(app.includes('FLAT: -3% ~ +5%'));
  assert(app.includes('추천일 종가 대비 최신가'));
  assert(app.includes('데이터 출처'));
});

test('performance board uses numeric summary card information design', () => {
  const app = read('app/page.jsx');
  const css = read('app/globals.css');
  for (const text of ['PerformanceSummaryCard', 'performance-summary-card', 'performance-headline', 'price-journey', '추천일 종가 대비', '추천일', '현재', '근거 콘텐츠']) {
    assert(app.includes(text), `missing performance card information design ${text}`);
  }
  for (const text of ['performance-list-row', 'performance-price-line', 'mini-ascii-rule', 'card-disclaimer']) {
    assert(css.includes(text), `missing performance card CSS ${text}`);
  }
});

test('mobile optimization includes sticky navigation, safe wrapping, and touch targets', () => {
  const css = read('app/globals.css');
  const app = read('app/page.jsx');
  assert(app.includes('mobile-sticky-nav'));
  assert(app.includes('요약'));
  assert(app.includes('후보'));
  assert(app.includes('리뷰'));
  assert(css.includes('overflow-wrap: anywhere'));
  assert(css.includes('min-height: 44px'));
  assert(css.includes('position: sticky'));
  assert(css.includes('env(safe-area-inset-bottom)'));
  assert(css.includes('scroll-padding-top'));
  assert(css.includes('grid-template-columns: 1fr'));
});

test('mobile compact mode shortens labels, reduces spacing, and hides nonessential copy', () => {
  const css = read('app/globals.css');
  const app = read('app/page.jsx');
  const admin = read('app/admin/page.jsx');
  assert(app.includes('className="container mobile-compact"'));
  assert(css.includes('.mobile-compact'));
  assert(css.includes('.mobile-hide'));
  assert(css.includes('.mobile-only'));
  assert(css.includes('gap: 6px'));
  assert(css.includes('line-height: 1.45'));
  assert(css.includes('min-height: 36px'));
  assert(css.includes('.mobile-compact .admin-kpi'));
  assert(css.includes('.mobile-compact .admin-section > .grid-3:not(.mini-grid)'));
  assert(css.includes('.mobile-compact .timeline'));
  assert(css.includes('.mobile-compact .grid-4'));
  assert(css.includes('.mobile-compact .report-grid'));
  assert(css.includes('.mobile-compact .league-grid'));
  for (const text of ['MVP', '3개월', '저장', '검토', '관리자']) {
    assert(app.includes(text), `missing compact copy ${text}`);
  }
  for (const text of ['상황판', '소스', '콘텐츠', '검수', '리그', '리포트', '알고리즘', 'PMF', '로그']) {
    assert(admin.includes(`label: '${text}'`), `missing compact admin menu ${text}`);
  }
  for (const longCopy of ['Multi-channel MVP', 'PMF Admin Prototype</a>', 'browser storage', 'Live Source Snapshot']) {
    assert(!app.includes(longCopy), `long mobile copy should be removed or hidden: ${longCopy}`);
  }
});

test('Toss-inspired design tokens are applied to shared UI surfaces', () => {
  const css = read('app/globals.css');
  for (const token of [
    '--bg: #f7f9fc',
    '--panel: #ffffff',
    '--text: #191f28',
    '--accent: #3182f6',
    '--toss-blue: #3182f6',
    '--toss-gray-50: #f9fafb',
    '--toss-gray-100: #f2f4f6',
    '--radius-xl: 28px',
    '--shadow-card: 0 18px 48px rgba(49, 130, 246, .10)',
    'background: linear-gradient(180deg, #ffffff 0%, #f7f9fc 100%)',
    'box-shadow: var(--shadow-card)',
  ]) {
    assert(css.includes(token), `missing Toss style token ${token}`);
  }
  assert(css.includes('.btn { border: 0; background: var(--accent); color: #fff;'));
  assert(css.includes('.chip, .status-chip {'));
  assert(css.includes('border: 0;'));
});

test('PMF League OS sections, fixtures, and guardrails are present', () => {
  const app = read('app/page.jsx');
  const league = read('data/leagueFixtures.js');
  const weekly = read('data/weeklyReportFixtures.js');
  const timeline = read('data/assetTimelineFixtures.js');
  const pmf = read('lib/pmfEvents.js');
  const scraper = read('scripts/scrape-youtube-seed.js');
  const pkg = read('package.json');
  for (const text of ['League Score v0.1', 'Channel League', 'Panel League', 'algorithmVersion', 'Caution Watch', 'score breakdown', '공개 콘텐츠 발언 기준', '투자 권유가 아닙니다', '추천일 종가 대비', '근거 발언', '주간 투자 콘텐츠 리포트', '종목별 추천 타임라인', '이 채널도 분석해주세요', '복사하기', 'Rookie 후보', '요청 수', '분석 요청', '공유하면 우선순위', 'PMF Signals Preview']) {
    assert(app.includes(text), `missing ${text}`);
  }
  assert(league.includes('channelLeagues'));
  assert(league.includes('panelLeagues'));
  assert(weekly.includes('많이 언급된 종목'));
  assert(timeline.includes('sourceUrl'));
  assert(timeline.includes('humanStatus'));
  assert(pmf.includes('PMF_EVENTS_KEY'));
  assert(pmf.includes('recordEvent'));
  assert(pmf.includes('summarizeEvents'));
  assert(scraper.includes('yt-dlp'));
  assert(scraper.includes('seed/candidate data only'));
  assert(pkg.includes('scrape:seed'));
  for (const forbidden of ['AI 추천주', '수익 보장', '매수 신호']) assert(!app.includes(forbidden), `forbidden copy ${forbidden}`);
});

test('admin prototype route includes compact hero, planned IA, and fixtures', () => {
  const admin = read('app/admin/page.jsx');
  const fixtures = read('data/adminFixtures.js');
  const ops = read('lib/adminOps.js');
  const pkg = read('package.json');
  for (const text of ['관리자 운영실', 'OS Overview', 'Source Discovery', 'Content Inbox', 'Extraction Review Queue', 'League Operations', 'Weekly Report Studio', 'Algorithm Monitor', 'PMF & Growth Signals', 'Audit Log']) {
    assert(admin.includes(text), `missing admin text ${text}`);
  }
  for (const removedText of ['PMF Admin Prototype', 'static export · localStorage actions', '공개 콘텐츠 발언 기준', '투자 권유가 아닙니다']) {
    assert(!admin.includes(removedText), `removed admin copy still present ${removedText}`);
  }
  for (const text of ['sourceCandidates', 'contentCandidates', 'extractionReviewItems', 'adminMetrics', 'publishChecklist', 'algorithmMonitor']) {
    assert(fixtures.includes(text), `missing fixture ${text}`);
  }
  for (const text of ['summarizeAdminMetrics', 'applyAdminAction', 'createAuditEntry', 'nextStatusForAction', 'getReviewPriorityLabel']) {
    assert(ops.includes(text), `missing helper ${text}`);
  }
  assert(pkg.includes('admin-ops.test.js'));
  assert(admin.includes('localStorage'));
});

test('multi-channel and three-month timeline expansion includes Sinsa-imdang without channel-locked product title', () => {
  const app = read('app/page.jsx');
  const layout = read('app/layout.jsx');
  const css = read('app/globals.css');
  assert(app.includes('신사임당'));
  assert(app.includes('지난 3개월'));
  assert(app.includes('2026-02-05 ~ 2026-05-05'));
  assert(app.includes('channelSummaries'));
  assert(app.includes('monthlyTrend'));
  assert(app.includes('채널별 성과 비교'));
  assert(app.includes('3개월 언급 추이'));
  assert(app.includes('Channel Filter'));
  assert(app.includes('setChannelFilter'));
  assert(app.includes('투자 콘텐츠'));
  assert(app.includes('인텔리전스 허브'));
  assert(app.includes('#league-board'));
  assert(app.includes('#weekly-report'));
  assert(app.includes('#asset-timeline'));
  assert(app.includes('#channel-request'));
  assert(!app.includes('<h1>김작가 TV + 신사임당'));
  assert(!app.includes('다채널 시계열 MVP</h1>'));
  assert(layout.includes("title: '투자 콘텐츠 인텔리전스 허브'"));
  assert(!layout.includes('Investment Content Dashboard MVP'));
  assert(css.includes('.timeline'));
  assert(css.includes('.trend-bar'));
  assert(css.includes('.league-grid'));
});
