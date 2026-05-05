const leagueFixtures = require('./leagueFixtures');
const weeklyFixtures = require('./weeklyReportFixtures');

const { LEAGUE_ALGORITHM_VERSION, channelLeagues, panelLeagues } = leagueFixtures;

const sourceCandidates = [
  {
    id: 'src-kim',
    name: '김작가 TV',
    url: 'https://www.youtube.com/channel/UCvil4OAt-zShzkKHsg9EQAw/videos',
    discoveryPath: 'scrape_seed',
    requestCount: 4,
    recentContentCount: 30,
    relevanceScore: 94,
    duplicateRisk: 'low',
    riskFlags: [],
    status: 'approved',
    note: '기존 공개 대시보드 분석 소스',
  },
  {
    id: 'src-sinsa',
    name: '신사임당',
    url: 'https://www.youtube.com/results?search_query=신사임당 주식',
    discoveryPath: 'scrape_seed',
    requestCount: 3,
    recentContentCount: 30,
    relevanceScore: 88,
    duplicateRisk: 'medium',
    riskFlags: ['채널명 검색 기반 URL 정규화 필요'],
    status: 'rookie_candidate',
    note: '최근 3개월 확장 후보',
  },
  {
    id: 'src-user-robot',
    name: '로봇·AI 투자 토크',
    url: 'https://www.youtube.com/@robot-ai-investing/videos',
    discoveryPath: 'user_request',
    requestCount: 2,
    recentContentCount: 9,
    relevanceScore: 76,
    duplicateRisk: 'low',
    riskFlags: ['광고성 표현 샘플 확인 필요'],
    status: 'needs_review',
    note: '사용자 요청 누적 후보',
  },
];

const contentCandidates = [
  {
    id: 'cnt-hynix',
    title: '삼성전자와 SK하이닉스, 지금은 비중 조절을 논의할 구간인가',
    channel: '김작가 TV',
    publishedText: '2026-05-03',
    sourceUrl: sourceCandidates[0].url,
    scrapeMethod: 'yt-dlp seed fallback',
    relevanceScore: 93,
    keywords: ['반도체', 'AI 서버', 'SK하이닉스'],
    status: 'auto_included',
  },
  {
    id: 'cnt-battery',
    title: '2차전지 반등의 근거와 확인해야 할 실적 변수',
    channel: '김작가 TV',
    publishedText: '2026-05-02',
    sourceUrl: sourceCandidates[0].url,
    scrapeMethod: 'fixture',
    relevanceScore: 86,
    keywords: ['2차전지', '삼성SDI', '에코프로비엠'],
    status: 'candidate',
  },
  {
    id: 'cnt-robot-theme',
    title: '로봇주는 추격보다 확인이 먼저라는 공개 발언',
    channel: '신사임당',
    publishedText: '2026-02-14',
    sourceUrl: sourceCandidates[1].url,
    scrapeMethod: 'fixture',
    relevanceScore: 71,
    keywords: ['로봇 테마', '두산로보틱스'],
    status: 'needs_review',
  },
];

const extractionReviewItems = [
  {
    id: 'rev-001',
    contentId: 'cnt-robot-theme',
    title: '로봇주는 추격보다 확인이 먼저라는 공개 발언',
    channel: '신사임당',
    asset: '두산로보틱스 / 로봇 테마',
    contributor: '신사임당 게스트',
    stance: 'WATCH',
    quote: '로봇주는 기대가 빨리 반영돼 추격보다 확인이 먼저입니다.',
    confidence: 0.57,
    impactScore: 72,
    uncertaintyScore: 84,
    entityImportanceScore: 64,
    freshnessScore: 42,
    userDemandScore: 58,
    status: 'pending_review',
    reason: '단일 자산 발언인지 테마 관찰 발언인지 구분 필요',
  },
  {
    id: 'rev-002',
    contentId: 'cnt-battery',
    title: '2차전지 반등의 근거와 확인해야 할 실적 변수',
    channel: '김작가 TV',
    asset: '삼성SDI',
    contributor: '이안나 부센터장',
    stance: 'WATCH',
    quote: '반등은 나왔지만 수주 가시성 확인이 먼저입니다.',
    confidence: 0.72,
    impactScore: 66,
    uncertaintyScore: 61,
    entityImportanceScore: 74,
    freshnessScore: 91,
    userDemandScore: 49,
    status: 'pending_review',
    reason: '성과 집계 대상 포함 여부 확인 필요',
  },
  {
    id: 'rev-003',
    contentId: 'cnt-hynix',
    title: '삼성전자와 SK하이닉스, 지금은 비중 조절을 논의할 구간인가',
    channel: '김작가 TV',
    asset: 'SK하이닉스',
    contributor: '염승환 이사',
    stance: 'BULL',
    quote: 'AI 서버 수요가 실적 추정치를 다시 올릴 수 있습니다.',
    confidence: 0.83,
    impactScore: 88,
    uncertaintyScore: 38,
    entityImportanceScore: 90,
    freshnessScore: 95,
    userDemandScore: 74,
    status: 'approved',
    reason: '근거 발언과 자산명이 명확한 샘플',
  },
];

const adminMetrics = {
  newSourceCandidates: 3,
  autoIncludedContent: 1,
  needsReviewContent: 1,
  extractionPending: 2,
  channelRequests: 5,
  promotionCandidates: [...channelLeagues, ...panelLeagues].filter(item => item.promotionStatus === 'promote_candidate').length,
  demotionRisks: [...channelLeagues, ...panelLeagues].filter(item => item.promotionStatus === 'demotion_risk').length,
  cautionCandidates: [...channelLeagues, ...panelLeagues].filter(item => item.league === 'Caution Watch').length,
  reportStatus: 'Draft',
  algorithmVersion: LEAGUE_ALGORITHM_VERSION,
  complianceBasis: '공개 콘텐츠 발언 기준, 투자 권유가 아닙니다.',
};

const publishChecklist = [
  { id: 'pc-evidence', label: '근거 발언과 sourceUrl 확인', done: true },
  { id: 'pc-wording', label: '투자 권유 오해 방지 문구 확인', done: true },
  { id: 'pc-caution', label: 'Caution Watch 후보 별도 검토', done: false },
  { id: 'pc-sample', label: '표본 수와 기간 제한 표시', done: true },
  { id: 'pc-final', label: '주간 리포트 최종 승인', done: false },
];

const algorithmMonitor = {
  activeVersion: LEAGUE_ALGORITHM_VERSION,
  shadowVersion: 'league-ranking-v0.2-shadow',
  lastRunAt: '2026-05-05 06:10 KST',
  health: 'watch',
  checks: [
    { id: 'alg-sample', label: '표본 5개 미만 Rookie 유지', status: 'pass' },
    { id: 'alg-caution', label: 'Caution 조건 score보다 우선', status: 'pass' },
    { id: 'alg-drift', label: '채널별 ambiguityRate drift', status: 'watch' },
    { id: 'alg-copy', label: '컴플라이언스 문구 누락 검사', status: 'pass' },
  ],
};

const pmfGrowthSignals = [
  { id: 'pmf-channel-request', label: '채널 요청', value: 5, insight: '요청 누적 채널을 Source Discovery에 연결' },
  { id: 'pmf-share-copy', label: '공유 문구 복사', value: 7, insight: '주간 리포트 공유 의도 확인' },
  { id: 'pmf-asset-timeline', label: '종목 타임라인 조회', value: 12, insight: '종목별 근거 확인 수요 확인' },
];

const auditLog = [
  { id: 'aud-001', at: '2026-05-05 06:15 KST', actor: 'prototype-operator', action: 'approve', targetId: 'rev-003', note: '근거 발언 확인 완료' },
  { id: 'aud-002', at: '2026-05-05 06:18 KST', actor: 'prototype-operator', action: 'hold', targetId: 'rev-001', note: '테마/자산 구분 재검토' },
];

module.exports = {
  sourceCandidates,
  contentCandidates,
  extractionReviewItems,
  adminMetrics,
  publishChecklist,
  algorithmMonitor,
  pmfGrowthSignals,
  auditLog,
  weeklyReport: weeklyFixtures.weeklyReport,
  leagueItems: [...channelLeagues, ...panelLeagues],
};
