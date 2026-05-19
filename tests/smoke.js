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

test('investor page removes admin review actions from visible navigation', () => {
  const app = read('app/page.jsx');
  const css = read('app/globals.css');
  assert(app.includes('#today-picks'));
  assert(app.includes('#source-trust'));
  assert(app.includes('종목 우선순위 보기'));
  assert(app.includes('출처 신뢰도'));
  assert(app.includes('#stock-decision'));
  assert(app.includes('출처별 신뢰도 요약'));
  assert(!app.includes('관리자 페이지로 넘긴 항목'));
  assert(!app.includes('오늘 화면에서 고친 핵심 문제'));
  assert(css.includes('.investor-deferred { display: none !important; }'));
});

test('investor page explains today-date problem and avoids premature performance claims', () => {
  const app = read('app/page.jsx');
  const fixture = read('data/ingestionDashboardFixtures.js');
  assert(app.includes('2026-05-19 KST'));
  assert(app.includes('당일/전일 영상은 아직 성과 검증 대상이 아닙니다'));
  assert(fixture.includes('기존 사용자 화면에 2026-05-05 샘플 성과와 2026-05-19 실제 수집 결과가 섞일 수 있어'));
  assert(fixture.includes('투자자 화면에는 transcript health, exclusion candidate, 운영 우선순위 같은 관리자 정보를 직접 노출하지 않습니다'));
});

test('performance board uses numeric summary card information design', () => {
  const app = read('app/page.jsx');
  const css = read('app/globals.css');
  for (const text of ['PerformanceSummaryCard', 'performance-summary-card', 'performance-headline', 'price-journey', 'performance-detail', '<summary>근거/기준 보기</summary>', '추천일 종가 대비', '추천일', '현재', '근거 콘텐츠']) {
    assert(app.includes(text), `missing performance card information design ${text}`);
  }
  for (const text of ['performance-list-row', 'performance-price-line', 'mini-ascii-rule', 'performance-detail', 'card-disclaimer', '.mobile-compact .performance-detail:not([open])']) {
    assert(css.includes(text), `missing performance card CSS ${text}`);
  }
});

test('mobile optimization includes sticky navigation, safe wrapping, and touch targets', () => {
  const css = read('app/globals.css');
  const app = read('app/page.jsx');
  assert(app.includes('mobile-sticky-nav'));
  assert(app.includes('요약'));
  assert(app.includes('오늘'));
  assert(app.includes('신뢰도'));
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
  for (const text of ['2026-05-19 KST', '종목 우선', '출처는 근거 레이어', '종목 우선순위 보기', '출처 신뢰도']) {
    assert(app.includes(text), `missing compact copy ${text}`);
  }
  for (const text of ['상황판', '소스', '콘텐츠', '검수', '리그', '리포트', '알고리즘', 'PMF', '로그']) {
    assert(admin.includes(`label: '${text}'`), `missing compact admin menu ${text}`);
  }
  for (const longCopy of ['Multi-channel MVP', 'PMF Admin Prototype</a>', 'browser storage', 'Live Source Snapshot']) {
    assert(!app.includes(longCopy), `long mobile copy should be removed or hidden: ${longCopy}`);
  }
});

test('Revolut-inspired design tokens are applied to shared UI surfaces', () => {
  const css = read('app/globals.css');
  for (const token of [
    '--bg: #ffffff',
    '--panel: #ffffff',
    '--text: #191c1f',
    '--accent: #494fdf',
    '--revolut-blue: #494fdf',
    '--revolut-surface: #f4f4f4',
    '--revolut-gray-100: #f4f4f4',
    '--radius-xl: 24px',
    '--shadow-card: none',
    'background: #ffffff',
    'box-shadow: none',
  ]) {
    assert(css.includes(token), `missing Revolut style token ${token}`);
  }
  assert(css.includes('.btn { border: 0; background: var(--text); color: #fff;'));
  assert(css.includes('border-radius: 9999px'));
  assert(css.includes('.chip, .status-chip {'));
});

test('PMF League OS sections, fixtures, and guardrails are present', () => {
  const app = read('app/page.jsx');
  const league = read('data/leagueFixtures.js');
  const weekly = read('data/weeklyReportFixtures.js');
  const timeline = read('data/assetTimelineFixtures.js');
  const pmf = read('lib/pmfEvents.js');
  const scraper = read('scripts/scrape-youtube-seed.js');
  const pkg = read('package.json');
  for (const text of ['League Score v0.1', 'Channel League', 'Panel League', 'algorithmVersion', 'Caution Watch', 'score breakdown', '공개 콘텐츠 발언 기준', '투자 권유가 아닙니다', '추천일 종가 대비', '근거 발언', '주간 투자 콘텐츠 리포트', '종목별 추천 타임라인', '이 채널도 분석해주세요', '복사하기', '요청 수', '분석 요청', 'PMF Signals Preview']) {
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

test('investor briefing exposes today picks, trust score, and admin-deferred guardrails', () => {
  const app = read('app/page.jsx');
  const css = read('app/globals.css');
  const fixture = read('data/ingestionDashboardFixtures.js');
  const plan = read('docs/ingestion-dashboard-ux-plan.md');
  for (const text of ['investorDashboard', 'Stock-first Decision Board', '무엇을 먼저 살펴볼까', 'TopDecisionCard', '먼저 열어볼 3종목', '종목 판단의 보조 근거', 'DecisionTableRow', 'InvestorPickCard', '종목 분석 요약', 'kick-quote', '신뢰도:', 'SourceTrustCard', '출처별 신뢰도 요약', '투자 권유가 아닙니다']) {
    assert(app.includes(text), `missing investor briefing text ${text}`);
  }
  for (const text of ['stock-decision-board', 'stock-first-hero', 'hero-decision-panel', 'top-decision-card', 'decision-mini-metrics', 'decision-layout', 'decision-table', 'investor-pick-grid', 'source-trust-grid', 'trust-meter', 'pick-analysis-block', 'kick-quote', 'source-trust-metrics', 'investor-deferred', '#today-picks']) {
    assert(css.includes(text), `missing investor briefing CSS ${text}`);
  }
  for (const text of ['publicInvestorDashboard', 'recommendationCards', 'analysisSummary', 'kickQuote', 'trustScore', 'trustReasons', 'adminDeferred', 'content-pick-extraction-v0.1']) {
    assert(fixture.includes(text), `missing investor fixture ${text}`);
  }
  for (const text of ['후보와 검증 분리', 'Transcript 결손 감시', 'Revolut-inspired']) {
    assert(plan.includes(text), `missing UX plan ${text}`);
  }
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
  assert(app.includes('2026-05-19 수집분'));
  assert(app.includes('channelSummaries'));
  assert(app.includes('monthlyTrend'));
  assert(app.includes('채널별 성과 비교'));
  assert(app.includes('3개월 언급 추이'));
  assert(app.includes('Channel Filter'));
  assert(app.includes('setChannelFilter'));
  assert(app.includes('투자 콘텐츠'));
  assert(app.includes('무엇을 먼저'));
  assert(app.includes('종목이 1순위 · 출처는 근거'));
  assert(app.includes('id="league-board"'));
  assert(app.includes('id="weekly-report"'));
  assert(app.includes('id="asset-timeline"'));
  assert(app.includes('#channel-request'));
  assert(!app.includes('<h1>김작가 TV + 신사임당'));
  assert(!app.includes('다채널 시계열 MVP</h1>'));
  assert(layout.includes("title: '투자 콘텐츠 인텔리전스 허브'"));
  assert(!layout.includes('Investment Content Dashboard MVP'));
  assert(css.includes('.timeline'));
  assert(css.includes('.trend-bar'));
  assert(css.includes('.league-grid'));
});
