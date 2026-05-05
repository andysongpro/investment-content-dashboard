'use client';

import { useMemo, useState, useEffect } from 'react';
import leagueFixtures from '../data/leagueFixtures';
import weeklyFixtures from '../data/weeklyReportFixtures';
import timelineFixtures from '../data/assetTimelineFixtures';
import pmfEvents from '../lib/pmfEvents';

const STORAGE_KEY = 'investment-content-dashboard/source-draft';
const REQUESTS_KEY = 'investment-content-dashboard/channel-requests';

const { channelLeagues, panelLeagues, LEAGUE_ALGORITHM_VERSION } = leagueFixtures;
const { weeklyReport } = weeklyFixtures;
const { assetTimelines } = timelineFixtures;
const { getEvents, recordEvent, summarizeEvents } = pmfEvents;

const analysisWindow = '2026-02-05 ~ 2026-05-05';
const latestFixtureSync = '2026-05-05 06:10 KST';

const defaultSource = {
  name: '김작가 TV + 신사임당',
  url: 'https://www.youtube.com/channel/UCvil4OAt-zShzkKHsg9EQAw/videos',
  language: 'ko',
  candidateLimit: 60,
  analysisLimit: 24,
};

const sourceChannels = [
  { id: 'kim', name: '김작가 TV', handle: '김작가 TV', status: '운영 중', candidate: 30, analyzed: 10, url: 'https://www.youtube.com/channel/UCvil4OAt-zShzkKHsg9EQAw/videos' },
  { id: 'sinsa', name: '신사임당', handle: '신사임당', status: '지난 3개월 신규 확장', candidate: 30, analyzed: 14, url: 'https://www.youtube.com/results?search_query=%EC%8B%A0%EC%82%AC%EC%9E%84%EB%8B%B9+%EC%A3%BC%EC%8B%9D' },
];

const statusLabels = {
  all: '전체',
  include: '포함',
  maybe: '보류',
  needs_review: '수동 검토 필요',
};

const stanceLabels = {
  BULL: '긍정',
  'V-BULL': '매우 긍정',
  WATCH: '관찰',
  UNC: '불명확',
  BEAR: '부정',
};

const contents = [
  { channelId: 'kim', status: 'include', process: 'ready', date: '2026-05-03', month: '2026-05', title: '삼성전자와 SK하이닉스, 지금은 비중을 늘릴 구간인가 (염승환 이사)', contributor: '염승환 이사', length: '34m', evidence: 4, assets: ['삼성전자', 'SK하이닉스'] },
  { channelId: 'kim', status: 'include', process: 'ready', date: '2026-05-02', month: '2026-05', title: '2차전지 급등 나온 진짜 이유, 삼성SDI와 이 주식 무섭게 오른다 (이안나 부센터장)', contributor: '이안나 부센터장', length: '28m', evidence: 3, assets: ['삼성SDI', '에코프로비엠'] },
  { channelId: 'kim', status: 'maybe', process: 'ready', date: '2026-04-18', month: '2026-04', title: '미국 금리와 환율, 한국 증시에 어떤 충격이 올까', contributor: '염승환 이사', length: '41m', evidence: 2, assets: ['코스피'] },
  { channelId: 'kim', status: 'needs_review', process: 'pending', date: '2026-04-02', month: '2026-04', title: '원전과 로봇 둘 다 보는 이유, 두산은 어디까지 갈까 (익명 패널)', contributor: '익명 패널', length: '37m', evidence: 1, assets: ['두산'] },
  { channelId: 'sinsa', status: 'include', process: 'ready', date: '2026-04-27', month: '2026-04', title: '부자들이 현금 비중을 줄이기 시작한 이유, AI 인프라 수혜주는 여전히 남았다', contributor: '신사임당 진행자', length: '31m', evidence: 5, assets: ['엔비디아', 'SK하이닉스', '전력기기'] },
  { channelId: 'sinsa', status: 'include', process: 'ready', date: '2026-03-21', month: '2026-03', title: '3개월 안에 실적 확인해야 할 반도체·전력기기 대표주', contributor: '신사임당 게스트', length: '46m', evidence: 4, assets: ['HD현대일렉트릭', 'LS ELECTRIC', '삼성전자'] },
  { channelId: 'sinsa', status: 'maybe', process: 'ready', date: '2026-03-04', month: '2026-03', title: '금리 인하 기대가 커질 때 배당주와 리츠를 보는 방법', contributor: '신사임당 진행자', length: '29m', evidence: 2, assets: ['배당 ETF', '리츠'] },
  { channelId: 'sinsa', status: 'needs_review', process: 'pending', date: '2026-02-14', month: '2026-02', title: '테마가 너무 빨리 오른 시장, 로봇주는 추격보다 확인이 먼저다', contributor: '신사임당 게스트', length: '38m', evidence: 2, assets: ['로봇 테마', '두산로보틱스'] },
];

const performances = [
  { channelId: 'kim', contributor: '이안나 부센터장', asset: '에코프로비엠', state: 'GOOD', date: '2026-05-02', latestDate: '2026-05-05', recClose: 214000, latest: 228500, title: contents[1].title, source: '김작가 TV 샘플' },
  { channelId: 'kim', contributor: '염승환 이사', asset: 'SK하이닉스', state: 'GOOD', date: '2026-05-03', latestDate: '2026-05-05', recClose: 221500, latest: 235500, title: contents[0].title, source: '김작가 TV 샘플' },
  { channelId: 'kim', contributor: '염승환 이사', asset: '삼성전자', state: 'FLAT', date: '2026-05-03', latestDate: '2026-05-05', recClose: 83700, latest: 86100, title: contents[0].title, source: '김작가 TV 샘플' },
  { channelId: 'kim', contributor: '이안나 부센터장', asset: '삼성SDI', state: 'FLAT', date: '2026-05-02', latestDate: '2026-05-05', recClose: 338500, latest: 332000, title: contents[1].title, source: '김작가 TV 샘플' },
  { channelId: 'sinsa', contributor: '신사임당 진행자', asset: '엔비디아', state: 'GOOD', date: '2026-04-27', latestDate: '2026-05-05', recClose: 1140, latest: 1218, title: contents[4].title, source: '신사임당 샘플' },
  { channelId: 'sinsa', contributor: '신사임당 게스트', asset: 'HD현대일렉트릭', state: 'GOOD', date: '2026-03-21', latestDate: '2026-05-05', recClose: 334000, latest: 357500, title: contents[5].title, source: '신사임당 샘플' },
  { channelId: 'sinsa', contributor: '신사임당 게스트', asset: '두산로보틱스', state: 'MISS', date: '2026-02-14', latestDate: '2026-05-05', recClose: 82100, latest: 75800, title: contents[7].title, source: '신사임당 샘플' },
];

const monthlyTrend = [
  { month: '2026-02', label: '2월', kim: 1, sinsa: 2, mentions: 3, hitRate: 50 },
  { month: '2026-03', label: '3월', kim: 2, sinsa: 4, mentions: 6, hitRate: 67 },
  { month: '2026-04', label: '4월', kim: 4, sinsa: 5, mentions: 9, hitRate: 71 },
  { month: '2026-05', label: '5월', kim: 5, sinsa: 3, mentions: 8, hitRate: 75 },
];

const channelSummaries = [
  { id: 'kim', name: '김작가 TV', videos: 4, mentions: 10, assets: 7, avgReturn: 3.51, hitRate: 75, focus: '반도체·2차전지·시장 코멘트' },
  { id: 'sinsa', name: '신사임당', videos: 4, mentions: 13, assets: 8, avgReturn: 4.18, hitRate: 67, focus: 'AI 인프라·전력기기·배당/리츠' },
];

const matrix = [
  { channelId: 'kim', contributor: '염승환 이사', asset: '삼성전자', stance: 'BULL', date: '2026-05-03', quote: '지금 구간에서는 분할로 계속 모아가는 전략이 유효합니다.', mentions: 2, review: false },
  { channelId: 'kim', contributor: '염승환 이사', asset: 'SK하이닉스', stance: 'V-BULL', date: '2026-05-03', quote: 'AI 서버 수요가 실적 추정치를 다시 올릴 수 있습니다.', mentions: 2, review: false },
  { channelId: 'kim', contributor: '이안나 부센터장', asset: '삼성SDI', stance: 'WATCH', date: '2026-05-02', quote: '반등은 나왔지만 수주 가시성 확인이 먼저입니다.', mentions: 1, review: false },
  { channelId: 'sinsa', contributor: '신사임당 진행자', asset: '엔비디아', stance: 'V-BULL', date: '2026-04-27', quote: 'AI 인프라 투자는 아직 끝나지 않았고 실적 확인이 중요합니다.', mentions: 3, review: false },
  { channelId: 'sinsa', contributor: '신사임당 게스트', asset: 'HD현대일렉트릭', stance: 'BULL', date: '2026-03-21', quote: '전력망 투자는 3개월 시계열로 추적할 필요가 있습니다.', mentions: 2, review: false },
  { channelId: 'sinsa', contributor: '신사임당 게스트', asset: '두산로보틱스', stance: 'UNC', date: '2026-02-14', quote: '로봇주는 기대가 빨리 반영돼 추격보다 확인이 먼저입니다.', mentions: 1, review: true },
];

const reviewItems = [
  { channelId: 'kim', type: '자산', title: '두산', score: 42, summary: '두산로보틱스와 두산에너빌리티 맥락이 혼합되어 실제 추천 자산 확인이 필요합니다.', source: contents[3].title },
  { channelId: 'kim', type: '강도', title: '코스피', score: 48, summary: '시장 방향성 코멘트인지 특정 매수 추천인지 불명확합니다.', source: contents[2].title },
  { channelId: 'sinsa', type: '테마', title: '로봇 테마', score: 57, summary: '두산로보틱스 단일 종목 추천인지 로봇 테마 경계 발언인지 확인이 필요합니다.', source: contents[7].title },
];

function formatWon(n) { return `${n.toLocaleString('ko-KR')}원`; }
function pct(item) { return ((item.latest - item.recClose) / item.recClose) * 100; }
function isYoutubeUrl(value) {
  try {
    const url = new URL(value);
    return ['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtu.be'].includes(url.hostname);
  } catch { return false; }
}
function channelName(id) { return sourceChannels.find(c => c.id === id)?.name || id; }

export default function Page() {
  const [source, setSource] = useState(defaultSource);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('all');
  const [query, setQuery] = useState('');
  const [channelFilter, setChannelFilter] = useState('all');
  const [copied, setCopied] = useState('');
  const [assetFilter, setAssetFilter] = useState(assetTimelines[0].ticker);
  const [channelRequest, setChannelRequest] = useState({ name: '', url: '' });
  const [requestError, setRequestError] = useState('');
  const [requestedChannels, setRequestedChannels] = useState([]);
  const [pmfSummary, setPmfSummary] = useState({});

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try { setSource({ ...defaultSource, ...JSON.parse(raw) }); setSaved(true); } catch {}
    }
    try { setRequestedChannels(JSON.parse(localStorage.getItem(REQUESTS_KEY) || '[]')); } catch {}
    setPmfSummary(summarizeEvents(getEvents(localStorage)));
  }, []);

  const validate = (draft) => {
    const next = {};
    if (!draft.name.trim()) next.name = '소스 이름을 입력하세요.';
    if (!isYoutubeUrl(draft.url)) next.url = '유효한 YouTube URL을 입력하세요.';
    if (!Number.isInteger(Number(draft.candidateLimit)) || Number(draft.candidateLimit) < 1) next.candidateLimit = '후보 영상 수는 1 이상이어야 합니다.';
    if (!Number.isInteger(Number(draft.analysisLimit)) || Number(draft.analysisLimit) < 1) next.analysisLimit = '분석할 영상 수는 1 이상이어야 합니다.';
    if (!next.candidateLimit && !next.analysisLimit && Number(draft.analysisLimit) > Number(draft.candidateLimit)) {
      next.analysisLimit = '분석할 영상 수는 후보 영상 수보다 클 수 없습니다.';
    }
    return next;
  };

  const update = (key, value) => {
    const next = { ...source, [key]: key.includes('Limit') ? Number(value) : value };
    setSource(next);
    setErrors(validate(next));
    setSaved(false);
  };

  const save = () => {
    const nextErrors = validate(source);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(source));
    setSaved(true);
  };

  const reset = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSource(defaultSource);
    setErrors({});
    setSaved(false);
  };

  const track = (type, payload = {}) => {
    const events = recordEvent(localStorage, type, payload);
    setPmfSummary(summarizeEvents(events));
  };

  const copyText = async (key, text, eventType, payload = {}) => {
    try { await navigator.clipboard?.writeText(text); } catch {}
    setCopied(key);
    track(eventType, payload);
    window.setTimeout(() => setCopied(''), 1400);
  };

  const changeAsset = (ticker) => {
    setAssetFilter(ticker);
    track('asset_timeline_change', { ticker });
  };

  const submitChannelRequest = () => {
    const draft = { name: channelRequest.name.trim(), url: channelRequest.url.trim() };
    if (!draft.name) { setRequestError('채널명을 입력하세요.'); return; }
    if (!isYoutubeUrl(draft.url)) { setRequestError('유효한 YouTube URL을 입력하세요.'); return; }
    const exists = requestedChannels.some(item => item.url === draft.url);
    const next = exists
      ? requestedChannels.map(item => item.url === draft.url ? { ...item, votes: item.votes + 1 } : item)
      : [{ id: `${Date.now()}`, ...draft, votes: 1, status: 'Rookie 후보', createdAt: new Date().toISOString() }, ...requestedChannels];
    setRequestedChannels(next);
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(next));
    setChannelRequest({ name: '', url: '' });
    setRequestError('');
    track('channel_request_submit', { name: draft.name });
  };

  const inChannel = (item) => channelFilter === 'all' || item.channelId === channelFilter;
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return contents.filter((item) => {
      const statusOk = status === 'all' || item.status === status;
      const channelOk = channelFilter === 'all' || item.channelId === channelFilter;
      const haystack = [item.title, item.contributor, channelName(item.channelId), ...item.assets].join(' ').toLowerCase();
      return statusOk && channelOk && (!q || haystack.includes(q));
    });
  }, [status, query, channelFilter]);

  const filteredPerformances = performances.filter(inChannel);
  const filteredMatrix = matrix.filter(inChannel);
  const filteredReviews = reviewItems.filter(inChannel);
  const includeCount = visible.filter(x => x.status === 'include').length;
  const maybeCount = visible.filter(x => x.status === 'maybe').length;
  const reviewCount = visible.filter(x => x.status === 'needs_review').length;
  const selectedChannelLabel = channelFilter === 'all' ? '전체 채널' : channelName(channelFilter);
  const totalCandidates = sourceChannels.reduce((sum, c) => sum + c.candidate, 0);
  const totalAnalyzed = sourceChannels.reduce((sum, c) => sum + c.analyzed, 0);
  const maxTrend = Math.max(...monthlyTrend.map(x => x.mentions));
  const allLeagueItems = [...channelLeagues, ...panelLeagues];
  const promotionCandidates = allLeagueItems.filter(item => item.promotionStatus === 'promote_candidate' || item.promotionStatus === 'watch');
  const demotionRisks = allLeagueItems.filter(item => item.promotionStatus === 'demotion_risk');
  const cautionItems = allLeagueItems.filter(item => item.league === 'Caution Watch');
  const selectedTimeline = assetTimelines.find(item => item.ticker === assetFilter) || assetTimelines[0];
  const assetShareText = `[종목별 추천 타임라인]\n${selectedTimeline.name}: 공개 콘텐츠 발언 기준 ${selectedTimeline.events.length}건\n기준: 추천일 종가 대비 / 근거 발언 포함\n투자 권유가 아닙니다.`;

  return (
    <main id="top" className="container mobile-compact">
      <nav className="mobile-sticky-nav" aria-label="모바일 섹션 바로가기">
        <a href="#top">요약</a>
        <a href="#league-board">리그</a>
        <a href="#weekly-report">리포트</a>
        <a href="#asset-timeline">종목</a>
        <a href="#channel-request">요청</a>
        <a href="#review-queue">리뷰</a>
      </nav>
      <section className="hero panel panel-strong block">
        <div className="stack">
          <div className="row">
            <span className="chip chip-accent">MVP</span>
            <span className="chip chip-green">3개월</span>
            <span className="chip">{saved ? '저장됨' : '저장 대기'}</span>
          </div>
          <div>
            <p className="eyebrow">콘텐츠 검증 OS</p>
            <h1>투자 콘텐츠<br />인텔리전스 허브</h1>
            <p className="muted mobile-hide">YouTube 투자 콘텐츠를 소스·채널·월별로 확장 관리하고, 추천 발언의 3개월 흐름과 추천일 종가 대비 최신가 성과를 함께 검토하는 대시보드입니다. 김작가 TV와 신사임당은 현재 분석 대상 소스이며, 이후 채널이 늘어나도 서비스 타이틀은 고정 채널명에 묶이지 않습니다.</p>
            <p className="muted mobile-only">공개 투자 콘텐츠 발언을 기록하고, 추천일 종가 대비 성과를 검증합니다. 투자 권유가 아닙니다.</p>
          </div>
          <div className="grid-3">
            <Kpi label="Channels" value={sourceChannels.length} desc="김작가 TV, 신사임당" />
            <Kpi label="Candidates" value={totalCandidates} desc="지난 3개월 후보 영상" />
            <Kpi label="Analyzed" value={totalAnalyzed} desc="우선 분석 영상" />
          </div>
          <div className="row">
            <a className="btn anchor-link" href="#time-series">3개월</a>
            <a className="btn secondary anchor-link" href="#review-queue" aria-label="검토 큐로 이동">검토</a>
            <a className="btn secondary anchor-link" href="/admin">관리자</a>
          </div>
        </div>

        <section id="source-registration" className="panel block stack mobile-hide">
          <div className="between">
            <div><p className="eyebrow">소스</p><h2>다채널 소스 설정</h2></div>
            <span className="chip">로컬 저장</span>
          </div>
          <label className="field"><span className="label">소스명</span><input className="input" value={source.name} onChange={e => update('name', e.target.value)} />{errors.name && <span className="error">{errors.name}</span>}</label>
          <label className="field"><span className="label">YouTube URL</span><input className="input" type="url" value={source.url} onChange={e => update('url', e.target.value)} />{errors.url && <span className="error">{errors.url}</span>}</label>
          <div className="grid-3">
            <label className="field"><span className="label">언어</span><input className="input" value={source.language} onChange={e => update('language', e.target.value)} /></label>
            <label className="field"><span className="label">후보</span><input className="input" type="number" inputMode="numeric" min="1" value={source.candidateLimit} onChange={e => update('candidateLimit', e.target.value)} />{errors.candidateLimit && <span className="error">{errors.candidateLimit}</span>}</label>
            <label className="field"><span className="label">분석</span><input className="input" type="number" inputMode="numeric" min="1" max={source.candidateLimit} value={source.analysisLimit} onChange={e => update('analysisLimit', e.target.value)} />{errors.analysisLimit && <span className="error">{errors.analysisLimit}</span>}</label>
          </div>
          <div className="source-list">
            {sourceChannels.map(ch => <div className="source-row" key={ch.id}><div><strong>{ch.name}</strong><p className="footer-note">{ch.status} · 후보 {ch.candidate} / 분석 {ch.analyzed}</p></div><span className="chip">{ch.handle}</span></div>)}
          </div>
          <div className="row"><button className="btn" type="button" onClick={save}>저장</button><button className="btn secondary" type="button" onClick={reset}>초기화</button></div>
          <div className="card mobile-hide"><p className="eyebrow">소스 스냅샷</p><strong>{source.name}</strong><p className="muted">{source.url}</p><p className="footer-note">last fixture sync: {latestFixtureSync}</p></div>
        </section>
      </section>

      <section className="section kpi">
        <Kpi label="Include" value={contents.filter(x => x.status === 'include').length} desc="포함 후보" />
        <Kpi label="Maybe" value={contents.filter(x => x.status === 'maybe').length} desc="보류 후보" />
        <Kpi label="Review Queue" value={reviewItems.length} desc="수동 확인 필요" />
        <Kpi label="Assets" value="12" desc="자산/테마 수" />
      </section>

      <section className="section panel block stack" id="league-board">
        <div className="between">
          <div><p className="eyebrow">League Score v0.1</p><h2>채널·패널 리그 보드</h2><span className="chip">League Score v0.1</span></div>
          <span className="chip chip-accent">algorithmVersion: {LEAGUE_ALGORITHM_VERSION}</span>
        </div>
        <p className="muted">공개 콘텐츠 발언 기준으로 계산한 샘플 리그입니다. 투자 권유가 아닙니다. Rookie, Minor, Major, Ace, Caution Watch는 자동 판단이 아니라 수동 검증 전 후보 신호입니다.</p>
        <div className="grid-3 mini-grid">
          <Kpi label="Channels" value={channelLeagues.length} desc="Channel League" />
          <Kpi label="Panels" value={panelLeagues.length} desc="Panel League" />
          <Kpi label="Caution" value={cautionItems.length} desc="주의 관찰" />
        </div>
        <div className="movement-grid">
          <MovementCard title="승급 후보" items={promotionCandidates} empty="2회 연속 조건 대기" />
          <MovementCard title="강등 위험" items={demotionRisks} empty="현재 강등 위험 없음" />
          <MovementCard title="주의 관찰" items={cautionItems} empty="주의 관찰 없음" />
        </div>
        <p className="footer-note">승급/강등은 2회 연속 조건 확인 후 반영합니다. Rookie에서 Major까지 샘플 게이트가 있으며 Caution Watch는 위험 플래그가 우선합니다.</p>
        <div>
          <div className="between"><h3>Channel League</h3><span className="chip">score breakdown</span></div>
          <div className="league-grid">{channelLeagues.map(item => <LeagueCard item={item} key={item.id} />)}</div>
        </div>
        <div>
          <div className="between"><h3>Panel League</h3><span className="chip">public evidence fixture</span></div>
          <div className="league-grid">{panelLeagues.map(item => <LeagueCard item={item} key={item.id} />)}</div>
        </div>
      </section>

      <section className="section panel block stack" id="weekly-report">
        <div className="between"><div><p className="eyebrow">PMF Report</p><h2>주간 투자 콘텐츠 리포트</h2></div><span className="chip">{weeklyReport.period}</span></div>
        <p className="muted">공개 콘텐츠 발언 기준 · 추천일 종가 대비 · 투자 권유가 아닙니다.</p>
        <div className="report-grid">
          <div className="card stack"><h3>많이 언급된 종목</h3><RankList items={weeklyReport.topAssets} labelKey="asset" valueKey="mentions" suffix="회" /></div>
          <div className="card stack"><h3>많이 언급된 테마</h3><RankList items={weeklyReport.topThemes} labelKey="theme" valueKey="mentions" suffix="회" /></div>
          <div className="card stack"><h3>이번 주 관찰 메모</h3>{weeklyReport.highlights.map(x => <p className="muted" key={x}>{x}</p>)}</div>
        </div>
        <div className="share-box"><label className="field"><span className="label">공유용 요약</span><textarea className="input textarea" readOnly value={weeklyReport.shareText} /></label><button className="btn" type="button" onClick={() => copyText('weekly', weeklyReport.shareText, 'share_copy_weekly_report', { reportId: weeklyReport.reportId })}>{copied === 'weekly' ? '복사 완료' : '복사하기'}</button></div>
      </section>

      <section className="section panel block stack" id="asset-timeline">
        <div className="between"><div><p className="eyebrow">Asset Timeline</p><h2>종목별 추천 타임라인</h2></div><span className="chip chip-blue">차트 신호가 아니라 공개 콘텐츠 발언 시점입니다.</span></div>
        <label className="field compact"><span className="label">종목 선택</span><select className="select" value={assetFilter} onChange={e => changeAsset(e.target.value)}>{assetTimelines.map(item => <option value={item.ticker} key={item.ticker}>{item.name}</option>)}</select></label>
        <div className="asset-timeline">
          {selectedTimeline.events.map(event => <article className="timeline-event" key={`${selectedTimeline.ticker}-${event.date}`}>
            <div className="event-marker" />
            <div className="card stack">
              <div className="between"><h3>{selectedTimeline.name}</h3><span className="chip">{event.channel} · {event.contributor}</span></div>
              <div className="grid-3 mini-grid"><Kpi label="추천일 종가" value={formatWon(event.recClose)} desc={event.date} /><Kpi label="최신가" value={formatWon(event.latest)} desc="2026-05-05" /><Kpi label="추천일 종가 대비" value={`${event.returnPct >= 0 ? '+' : ''}${event.returnPct.toFixed(2)}%`} desc={event.league} /></div>
              <div className="evidence-box"><span className="label">근거 발언</span><p>{event.quote}</p><a href={event.sourceUrl} target="_blank" rel="noreferrer">sourceUrl</a><p className="footer-note">humanStatus: {event.humanStatus} · confidence {Math.round(event.confidence * 100)}%</p></div>
            </div>
          </article>)}
        </div>
        <div className="share-box"><label className="field"><span className="label">타임라인 공유 문구</span><textarea className="input textarea" readOnly value={assetShareText} /></label><button className="btn" type="button" onClick={() => copyText('asset', assetShareText, 'share_copy_asset_timeline', { ticker: selectedTimeline.ticker })}>{copied === 'asset' ? '복사 완료' : '복사하기'}</button></div>
      </section>

      <section className="section panel block stack" id="channel-request">
        <div className="between"><div><p className="eyebrow">User Request Loop</p><h2>이 채널도 분석해주세요</h2></div><span className="chip chip-green">공유하면 우선순위</span></div>
        <p className="muted">요청이 많은 채널은 Rookie 후보로 올리고 다음 리포트 우선순위에 반영합니다.</p>
        <div className="request-grid"><label className="field"><span className="label">채널명</span><input className="input" value={channelRequest.name} onChange={e => setChannelRequest({ ...channelRequest, name: e.target.value })} /></label><label className="field"><span className="label">YouTube URL</span><input className="input" type="url" value={channelRequest.url} onChange={e => setChannelRequest({ ...channelRequest, url: e.target.value })} /></label><button className="btn" type="button" onClick={submitChannelRequest}>분석 요청</button></div>
        {requestError && <span className="error">{requestError}</span>}
        <div className="request-list">{requestedChannels.length === 0 ? <div className="empty">아직 로컬 요청이 없습니다. 관심 채널을 추가해 주세요.</div> : requestedChannels.map(item => <article className="card stack" key={item.id}><div className="between"><h3>{item.name}</h3><span className="chip chip-accent">{item.status}</span></div><p className="muted">요청 수 {item.votes} · {item.url}</p><p className="footer-note">이 투자 채널도 공개 발언 성과 분석 요청했습니다. 같이 요청하면 우선순위가 올라갑니다.</p></article>)}</div>
        <div className="card"><p className="eyebrow">PMF Signals Preview</p><p className="muted">채널 요청, 공유 복사, 종목 타임라인 조회는 초기 PMF 신호로만 로컬 집계됩니다.</p><div className="row"><span className="chip">channel_request_submit {pmfSummary.channel_request_submit || 0}</span><span className="chip">share_copy_weekly_report {pmfSummary.share_copy_weekly_report || 0}</span><span className="chip">asset_timeline_change {pmfSummary.asset_timeline_change || 0}</span></div></div>
      </section>

      <section id="time-series" className="section panel block stack">
        <div className="between">
          <div><p className="eyebrow">3-month Timeline</p><h2>3개월 언급 추이</h2></div>
          <span className="chip chip-accent">지난 3개월 · {analysisWindow}</span>
        </div>
        <p className="muted">월별 집계는 최근 3개월 기간에 걸친 포함 월 기준입니다. 2월과 5월은 부분 월로 표시됩니다.</p>
        <div className="timeline">
          {monthlyTrend.map(item => <article className="card trend-card" key={item.month}>
            <div className="between"><strong>{item.label}</strong><span className="chip">hit {item.hitRate}%</span></div>
            <div className="trend-track"><span className="trend-bar" style={{ width: `${(item.mentions / maxTrend) * 100}%` }} /></div>
            <div className="value-line"><span className="muted">전체 언급</span><strong>{item.mentions}</strong></div>
            <div className="value-line"><span className="muted">김작가 TV</span><strong>{item.kim}</strong></div>
            <div className="value-line"><span className="muted">신사임당</span><strong>{item.sinsa}</strong></div>
          </article>)}
        </div>
      </section>

      <section className="section panel block stack">
        <div className="between">
          <div><p className="eyebrow">Channel Comparison</p><h2>채널별 성과 비교</h2></div>
          <span className="chip">fixture cohort</span>
        </div>
        <div className="grid-2 equal-grid">
          {channelSummaries.map(ch => <article className="card stack" key={ch.id}>
            <div className="between"><h3>{ch.name}</h3><span className="chip chip-green">{ch.hitRate}% hit</span></div>
            <p className="muted">관심 테마: {ch.focus}</p>
            <div className="grid-3 mini-grid">
              <Kpi label="Videos" value={ch.videos} desc="분석" />
              <Kpi label="Mentions" value={ch.mentions} desc="언급" />
              <Kpi label="Avg Return" value={`${ch.avgReturn.toFixed(2)}%`} desc="샘플 평균" />
            </div>
          </article>)}
        </div>
      </section>

      <section id="performance-board" className="section panel block stack">
        <div className="between">
          <div><p className="eyebrow">Performance Board</p><h2>추천일 종가 대비 최신가 성과</h2></div>
          <span className="chip chip-accent">0 live / {performances.length} fallback</span>
        </div>
        <div className="legend muted">
          <strong>성과 기준: GOOD: +5% 이상 · FLAT: -3% ~ +5% · MISS: -3% 이하</strong>
          <span>추천일 종가 대비 최신가 수익률을 계산합니다. 데이터 출처: 현재 화면은 검수용 샘플 데이터이며, live 연동 시 가격 API 출처와 기준일을 함께 표시해야 합니다.</span>
        </div>
        <div className="row filter-row">
          <label className="field compact"><span className="label">Channel Filter</span><select className="select" value={channelFilter} onChange={e => setChannelFilter(e.target.value)}><option value="all">전체 채널</option>{sourceChannels.map(ch => <option value={ch.id} key={ch.id}>{ch.name}</option>)}</select></label>
          <span className="chip">현재 보기: {selectedChannelLabel}</span>
          {channelFilter !== 'all' && <button className="btn secondary small" type="button" onClick={() => setChannelFilter('all')}>전체 채널로 초기화</button>}
        </div>
        <div className="grid-4">
          {filteredPerformances.map((item) => {
            const rate = pct(item); const delta = item.latest - item.recClose;
            return <article className="card stack" key={`${item.channelId}-${item.asset}`}>
              <div className="between"><span className="muted">{channelName(item.channelId)} · {item.contributor}</span><span className={`chip ${item.state === 'GOOD' ? 'chip-green' : item.state === 'MISS' ? 'chip-red' : 'chip-blue'}`}>{item.state}</span></div>
              <h3>{item.asset}</h3>
              <span className="chip">{item.source}</span>
              <div>
                <div className="value-line"><span className="muted">추천일 종가 기준일</span><strong className="nowrap">{item.date}</strong></div>
                <div className="value-line"><span className="muted">최신가 기준일</span><strong className="nowrap">{item.latestDate}</strong></div>
                <div className="value-line"><span className="muted">추천일 종가</span><strong className="nowrap">{formatWon(item.recClose)}</strong></div>
                <div className="value-line"><span className="muted">현재가</span><strong className="nowrap">{formatWon(item.latest)}</strong></div>
              </div>
              <div><p className="eyebrow">Return</p><strong className={rate >= 0 ? 'positive' : 'negative'}>{rate >= 0 ? '+' : ''}{rate.toFixed(2)}%</strong><p className={delta >= 0 ? 'positive' : 'negative'}>{delta >= 0 ? '+' : ''}{formatWon(delta)}</p></div>
              <p className="muted">{item.title}</p>
            </article>;
          })}
        </div>
      </section>

      <section id="content-filtering" className="section grid-2">
        <div className="panel block stack">
          <div className="between"><div><p className="eyebrow">Content Filtering</p><h2>다채널 후보 검토</h2></div><span className="chip">필터/검색</span></div>
          <div className="grid-2">
            <label className="field"><span className="label">Status</span><select className="select" value={status} onChange={e => setStatus(e.target.value)}>{Object.entries(statusLabels).map(([v,l]) => <option value={v} key={v}>{l}</option>)}</select></label>
            <label className="field"><span className="label">자산 / 출연자 / 채널 / 제목 검색</span><input className="input" placeholder="자산, 출연자, 채널, 제목 검색" value={query} onChange={e => setQuery(e.target.value)} /></label>
          </div>
          <div className="row"><span>{visible.length} visible items</span><span>{includeCount} include</span><span>{maybeCount} maybe</span><span>{reviewCount} pending review</span>{(query || status !== 'all') && <button className="btn secondary small" type="button" onClick={() => { setStatus('all'); setQuery(''); }}>필터 초기화</button>}</div>
          {visible.length === 0 ? <div className="empty">현재 필터 조건에 맞는 콘텐츠가 없습니다.</div> : visible.map(item => <article className="card content-card" key={item.title}>
            <div className="row"><span className="chip chip-accent">{channelName(item.channelId)}</span><span className={item.status === 'include' ? 'chip chip-green' : item.status === 'maybe' ? 'chip chip-orange' : 'chip chip-red'}>{statusLabels[item.status]}</span><span className="chip">{item.process === 'ready' ? '준비 완료' : '검토 대기'}</span><span className="muted nowrap">{item.date}</span></div>
            <h3>{item.title}</h3><p className="muted">{item.contributor} · {item.length} · {item.evidence} evidence</p><div className="row">{item.assets.map(a => <span className="chip" key={a}>{a}</span>)}</div>
          </article>)}
        </div>

        <div id="contributor-matrix" className="panel block stack">
          <div className="between"><div><p className="eyebrow">Contributor × Asset</p><h2>추천 강도 매트릭스</h2></div><span className="chip">최근 언급 우선</span></div>
          <div className="legend muted">동일 contributor-asset 조합에서는 가장 최근 언급을 현재 의견으로 사용합니다. 충돌 감지 항목은 Review Queue에서 수동 확인합니다.</div>
          {filteredMatrix.map(item => <article className="card stack" key={`${item.channelId}-${item.contributor}-${item.asset}`}>
            <div className="between"><span className="muted">{channelName(item.channelId)} · {item.contributor}</span>{item.review && <span className="chip chip-red">conflict detected</span>}</div>
            <h3>{item.asset}</h3><div className="row"><span className="chip chip-accent">{stanceLabels[item.stance]}</span><span className="muted nowrap">{item.date}</span><span className="muted">{item.mentions} mentions</span></div><p>{item.quote}</p>
          </article>)}
        </div>
      </section>

      <section id="review-queue" className="section panel block stack">
        <div className="between"><div><p className="eyebrow">Review Queue</p><h2>사람이 확인해야 하는 항목</h2></div><span className="chip chip-red">derived from flags</span></div>
        <div className="grid-3">
          {filteredReviews.map(item => <article className="card stack" key={item.title}>
            <div className="between"><span className="chip chip-orange">{channelName(item.channelId)} · {item.type}</span><strong className="warning">{item.score}% ambiguity</strong></div>
            <h3>{item.title}</h3><p className="muted">{item.summary}</p><div className="card"><span className="footer-note">관련 콘텐츠</span><p>{item.source}</p></div>
            <div className="actions"><button className="btn small">포함 승인</button><button className="btn secondary small">보류 처리</button><button className="btn secondary small">검토 완료</button></div>
          </article>)}
        </div>
      </section>
    </main>
  );
}

function Kpi({ label, value, desc }) {
  return <div className="card"><p className="eyebrow">{label}</p><div className="stat">{value}</div><p className="muted">{desc}</p></div>;
}

function LeagueCard({ item }) {
  const rows = Object.entries(item.breakdown);
  return <article className="league-card stack">
    <div className="between"><div><h3>{item.name}</h3><p className="footer-note">{item.entityType} · {item.pickCount} picks</p></div><span className={`league-badge ${item.league === 'Caution Watch' ? 'caution' : ''}`}>{item.league}</span></div>
    <div><p className="eyebrow">League Score</p><div className="stat">{item.score}</div><p className="footer-note">algorithmVersion: {item.algorithmVersion}</p></div>
    <div className="score-breakdown">{rows.map(([key, value]) => <div className="score-row" key={key}><span className="label">{key}</span><span className="score-meter"><span className="score-fill" style={{ width: `${value.raw}%` }} /></span><strong>{value.points}</strong></div>)}</div>
  </article>;
}

function MovementCard({ title, items, empty }) {
  return <article className="movement-card card stack"><h3>{title}</h3>{items.length === 0 ? <p className="muted">{empty}</p> : <ul className="reason-list">{items.map(item => <li key={`${title}-${item.id}`}><strong>{item.name}</strong><span className="muted">{item.league} · {item.score}점</span></li>)}</ul>}</article>;
}

function RankList({ items, labelKey, valueKey, suffix }) {
  return <ol className="rank-list">{items.map(item => <li key={item[labelKey]}><strong>{item[labelKey]}</strong><span className="chip">{item[valueKey]}{suffix}</span></li>)}</ol>;
}
