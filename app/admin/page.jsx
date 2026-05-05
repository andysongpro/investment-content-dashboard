'use client';

import { useCallback, useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import adminFixtures from '../../data/adminFixtures';
import adminOps from '../../lib/adminOps';

const {
  sourceCandidates,
  contentCandidates,
  extractionReviewItems,
  adminMetrics,
  publishChecklist,
  algorithmMonitor,
  pmfGrowthSignals,
  auditLog,
  weeklyReport,
  leagueItems,
} = adminFixtures;

const {
  summarizeAdminMetrics,
  applyAdminAction,
  createAuditEntry,
  getReviewPriorityLabel,
} = adminOps;

const ADMIN_ACTIONS_KEY = 'investment-content-dashboard/admin-prototype-actions';

const tabs = [
  { id: 'overview', label: '상황판', ko: '운영 상황판' },
  { id: 'sources', label: '소스', ko: '소스 후보' },
  { id: 'inbox', label: '콘텐츠', ko: '콘텐츠 후보' },
  { id: 'review', label: '검수', ko: '추출 검수 큐' },
  { id: 'league', label: '리그', ko: '리그 운영' },
  { id: 'report', label: '리포트', ko: '주간 리포트' },
  { id: 'algorithm', label: '알고리즘', ko: '알고리즘 모니터' },
  { id: 'pmf', label: 'PMF', ko: 'PMF 신호' },
  { id: 'audit', label: '로그', ko: '감사 로그' },
];

const actionLabels = {
  approve: '승인',
  hold: '보류',
  reject: '거절',
  edit: '수정 확인',
  rookie: 'Rookie 후보 등록',
  include: '분석 큐 포함',
  exclude: '제외',
};

function loadLocalActions() {
  if (typeof window === 'undefined') return { items: {}, audit: [] };
  try {
    const parsed = JSON.parse(window.localStorage.getItem(ADMIN_ACTIONS_KEY) || '{}');
    return { items: parsed.items || {}, audit: parsed.audit || [] };
  } catch {
    return { items: {}, audit: [] };
  }
}

function saveLocalActions(state) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(ADMIN_ACTIONS_KEY, JSON.stringify(state));
}

export default function AdminPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [localState, setLocalState] = useState({ items: {}, audit: [] });
  const [note, setNote] = useState('');

  useEffect(() => { setLocalState(loadLocalActions()); }, []);

  const reviewItems = useMemo(() => extractionReviewItems.map(item => localState.items[item.id] || item), [localState.items]);
  const contentItems = useMemo(() => contentCandidates.map(item => localState.items[item.id] || item), [localState.items]);
  const sourceItems = useMemo(() => sourceCandidates.map(item => localState.items[item.id] || item), [localState.items]);
  const runtimeFixtures = { ...adminFixtures, sourceCandidates: sourceItems, contentCandidates: contentItems, extractionReviewItems: reviewItems };
  const summary = summarizeAdminMetrics(runtimeFixtures);
  const combinedAudit = [...localState.audit, ...auditLog];
  const activeTab = tabs[activeIndex];
  const slideCount = tabs.length;

  const goToSlide = useCallback((index) => {
    setActiveIndex((index + slideCount) % slideCount);
  }, [slideCount]);

  const goPrev = useCallback(() => {
    setActiveIndex(index => (index - 1 + slideCount) % slideCount);
  }, [slideCount]);

  const goNext = useCallback(() => {
    setActiveIndex(index => (index + 1) % slideCount);
  }, [slideCount]);

  useEffect(() => {
    const onKeyDown = (event) => {
      const tag = event.target?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || event.target?.isContentEditable) return;
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goPrev();
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        goNext();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [goPrev, goNext]);

  const handlePointerDown = (event) => {
    const interactiveTarget = event.target?.closest?.('button, a, input, textarea, select, label');
    if (interactiveTarget) return;

    const startX = event.clientX;
    const pointerId = event.pointerId;
    const target = event.currentTarget;

    const handlePointerUp = (upEvent) => {
      const deltaX = upEvent.clientX - startX;
      if (Math.abs(deltaX) > 40) {
        if (deltaX > 0) goPrev();
        else goNext();
      }
      target.releasePointerCapture?.(pointerId);
      target.removeEventListener('pointerup', handlePointerUp);
      target.removeEventListener('pointercancel', handlePointerCancel);
    };

    const handlePointerCancel = () => {
      target.releasePointerCapture?.(pointerId);
      target.removeEventListener('pointerup', handlePointerUp);
      target.removeEventListener('pointercancel', handlePointerCancel);
    };

    target.setPointerCapture?.(pointerId);
    target.addEventListener('pointerup', handlePointerUp);
    target.addEventListener('pointercancel', handlePointerCancel);
  };

  const runAction = (item, action) => {
    const updated = applyAdminAction(item, action, { actor: 'prototype-admin', note });
    const entry = createAuditEntry({ action, targetId: item.id, actor: 'prototype-admin', note });
    const next = { items: { ...localState.items, [item.id]: updated }, audit: [entry, ...localState.audit].slice(0, 20) };
    setLocalState(next);
    saveLocalActions(next);
    setNote('');
  };

  return (
    <main className="container admin-shell mobile-compact">
      <section className="panel panel-strong block stack admin-hero">
        <div className="between">
          <div className="stack">
            <div>
              <p className="eyebrow">관리자 Control Tower</p>
              <h1>관리자 운영실</h1>
            </div>
          </div>
          <Link className="btn secondary anchor-link" href="/">공개 대시보드로 돌아가기</Link>
        </div>
      </section>

      <section className="admin-deck-layout" aria-label="관리자 슬라이드 카드 데크">
        <aside className="admin-step-rail" aria-label="데스크톱 섹션 바로가기">
          {tabs.map((tab, index) => (
            <button key={tab.id} className={`admin-step ${activeIndex === index ? 'active' : ''}`} type="button" onClick={() => goToSlide(index)} aria-current={activeIndex === index ? 'step' : undefined}>
              <span className="admin-step-index">{String(index + 1).padStart(2, '0')}</span>
              <span><strong>{tab.label}</strong></span>
            </button>
          ))}
        </aside>

        <div className="admin-deck-main">
          <nav className="admin-tabs admin-mobile-jump" aria-label="모바일 관리자 섹션 버튼">
            {tabs.map((tab, index) => (
              <button key={tab.id} className={`admin-tab ${activeIndex === index ? 'active' : ''}`} type="button" onClick={() => goToSlide(index)} aria-current={activeIndex === index ? 'page' : undefined}>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>

          <div className="admin-deck-toolbar" aria-label="슬라이드 탐색 컨트롤">
            <button className="btn secondary admin-nav-btn" type="button" onClick={goPrev} aria-label="이전 관리자 카드">← Previous</button>
            <div className="admin-progress" aria-live="polite">
              <span className="chip chip-accent">{activeIndex + 1} / {slideCount}</span>
              <strong>{activeTab.label}</strong>
            </div>
            <button className="btn secondary admin-nav-btn" type="button" onClick={goNext} aria-label="다음 관리자 카드">Next →</button>
          </div>

          <div className="admin-dot-row" role="tablist" aria-label="관리자 슬라이드 점 표시기">
            {tabs.map((tab, index) => (
              <button key={tab.id} type="button" className={`admin-dot ${activeIndex === index ? 'active' : ''}`} onClick={() => goToSlide(index)} aria-label={`${index + 1}번 ${tab.label} 슬라이드로 이동`} aria-selected={activeIndex === index} />
            ))}
          </div>

          <div className="admin-slide-stage" onPointerDown={handlePointerDown}>
            <div className="admin-slide-track" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
              <SlideCard tab={tabs[0]} index={0} activeIndex={activeIndex} slideCount={slideCount}>
                <Section title="OS Overview" eyebrow="운영 우선순위" desc="오늘 사람이 먼저 봐야 할 큐와 발행 위험을 요약합니다.">
        <div className="kpi admin-kpi">
          <Kpi label="신규 수집 후보" value={adminMetrics.newSourceCandidates} desc="Source Discovery" />
          <Kpi label="검수 필요" value={summary.pendingReviews} desc="Extraction Queue" />
          <Kpi label="승급 후보" value={summary.promotionCandidates} desc="2회 조건 확인" />
          <Kpi label="Caution 후보" value={summary.cautionCandidates} desc="위험 우선 검토" />
        </div>
        <div className="grid-3">
          <StatusCard title="리포트 상태" value={adminMetrics.reportStatus} detail={weeklyReport.period} />
          <StatusCard title="알고리즘 버전" value={adminMetrics.algorithmVersion} detail="shadow mode 후보 모니터링" />
          <StatusCard title="발행 체크" value={`${summary.checklistDone}/${summary.checklistTotal}`} detail={summary.publishReady ? '발행 가능' : '미완료 항목 있음'} />
        </div>
      </Section>
              </SlideCard>

              <SlideCard tab={tabs[1]} index={1} activeIndex={activeIndex} slideCount={slideCount}>
                <Section title="Source Discovery" eyebrow="소스 후보 승인" desc="스크래핑 seed, 사용자 요청, 수동 발견 후보를 Rookie 후보 또는 보류 상태로 판정합니다.">
        <div className="admin-list">{sourceItems.map(item => <article className="card stack" key={item.id}>
          <div className="between"><h3>{item.name}</h3><span className="chip chip-accent">{item.status}</span></div>
          <p className="muted">{item.discoveryPath} · 요청 {item.requestCount} · 최근 콘텐츠 {item.recentContentCount} · 관련성 {item.relevanceScore}</p>
          <p className="footer-note">{item.url}</p>
          <p>{item.note}</p>
          {item.riskFlags.length > 0 && <p className="warning">리스크: {item.riskFlags.join(', ')}</p>}
          <AdminActions item={item} actions={['rookie', 'hold', 'reject']} runAction={runAction} />
        </article>)}</div>
      </Section>
              </SlideCard>

              <SlideCard tab={tabs[2]} index={2} activeIndex={activeIndex} slideCount={slideCount}>
                <Section title="Content Inbox" eyebrow="콘텐츠 후보 처리" desc="승인된 소스에서 들어온 콘텐츠를 분석 큐 포함, 보류, 제외로 처리합니다.">
        <div className="admin-list">{contentItems.map(item => <article className="card stack" key={item.id}>
          <div className="between"><h3>{item.title}</h3><span className="chip chip-blue">{item.status}</span></div>
          <p className="muted">{item.channel} · {item.publishedText} · {item.scrapeMethod} · 관련성 {item.relevanceScore}</p>
          <div className="row">{item.keywords.map(keyword => <span className="chip" key={keyword}>{keyword}</span>)}</div>
          <AdminActions item={item} actions={['include', 'hold', 'exclude']} runAction={runAction} />
        </article>)}</div>
      </Section>
              </SlideCard>

              <SlideCard tab={tabs[3]} index={3} activeIndex={activeIndex} slideCount={slideCount}>
                <Section title="Extraction Review Queue" eyebrow="사람이 봐야 할 추출 결과" desc="confidence가 애매하거나 영향도가 큰 공개 발언만 우선 검수합니다.">
        <label className="field"><span className="label">공통 관리자 메모</span><input className="input" value={note} onChange={e => setNote(e.target.value)} placeholder="예: 근거 발언 확인 완료" /></label>
        <div className="admin-list">{reviewItems.map(item => {
          const priority = getReviewPriorityLabel(item);
          return <article className="card stack" key={item.id}>
            <div className="between"><h3>{item.asset}</h3><span className={`chip chip-${priority.tone}`}>{priority.label} {priority.score}</span></div>
            <p className="muted">{item.channel} · {item.contributor} · stance {item.stance} · confidence {Math.round(item.confidence * 100)}%</p>
            <blockquote className="admin-quote">“{item.quote}”</blockquote>
            <p>{item.reason}</p>
            <p className="footer-note">status: {item.status} · 원본: {item.title}</p>
            <AdminActions item={item} actions={['approve', 'edit', 'hold', 'reject']} runAction={runAction} />
          </article>;
        })}</div>
      </Section>
              </SlideCard>

              <SlideCard tab={tabs[4]} index={4} activeIndex={activeIndex} slideCount={slideCount}>
                <Section title="League Operations" eyebrow="리그 변경 전 검토" desc="승급·강등·Caution 후보를 표본 수와 위험 플래그 기준으로 확인합니다.">
        <div className="admin-list">{leagueItems.map(item => <article className="card stack" key={item.id}>
          <div className="between"><h3>{item.name}</h3><span className={item.league === 'Caution Watch' ? 'league-badge caution' : 'league-badge'}>{item.league}</span></div>
          <div className="grid-3 mini-grid"><Kpi label="score" value={item.score} desc={item.entityType} /><Kpi label="pickCount" value={item.pickCount} desc="표본" /><Kpi label="상태" value={item.promotionStatus} desc="수동 승인 전" /></div>
          <p className="footer-note">표본 5개 미만은 Rookie 유지 · Caution 조건은 score보다 우선 · 모든 변경은 audit log 기록</p>
        </article>)}</div>
      </Section>
              </SlideCard>

              <SlideCard tab={tabs[5]} index={5} activeIndex={activeIndex} slideCount={slideCount}>
                <Section title="Weekly Report Studio" eyebrow="발행 전 체크리스트" desc="주간 리포트는 근거 발언, 기간, 면책 문구 확인 후에만 발행합니다.">
        <div className="card stack"><h3>{weeklyReport.period}</h3><p className="muted">{adminMetrics.complianceBasis}</p><textarea className="input textarea" readOnly value={weeklyReport.shareText} /></div>
        <div className="admin-list">{publishChecklist.map(item => <div className="source-row" key={item.id}><strong>{item.label}</strong><span className={item.done ? 'chip chip-green' : 'chip chip-orange'}>{item.done ? '완료' : '대기'}</span></div>)}</div>
      </Section>
              </SlideCard>

              <SlideCard tab={tabs[6]} index={6} activeIndex={activeIndex} slideCount={slideCount}>
                <Section title="Algorithm Monitor" eyebrow="알고리즘 상태 점검" desc="active/shadow 버전과 guardrail 결과를 확인합니다.">
        <div className="grid-3"><StatusCard title="Active" value={algorithmMonitor.activeVersion} detail={algorithmMonitor.lastRunAt} /><StatusCard title="Shadow" value={algorithmMonitor.shadowVersion} detail="비교 모드" /><StatusCard title="Health" value={algorithmMonitor.health} detail="watch 항목 확인" /></div>
        <div className="admin-list">{algorithmMonitor.checks.map(check => <div className="source-row" key={check.id}><strong>{check.label}</strong><span className={check.status === 'pass' ? 'chip chip-green' : 'chip chip-orange'}>{check.status}</span></div>)}</div>
      </Section>
              </SlideCard>

              <SlideCard tab={tabs[7]} index={7} activeIndex={activeIndex} slideCount={slideCount}>
                <Section title="PMF & Growth Signals" eyebrow="성장 신호" desc="채널 요청, 공유, 타임라인 조회 같은 초기 수요 신호를 운영 우선순위로 연결합니다.">
        <div className="grid-3">{pmfGrowthSignals.map(signal => <StatusCard key={signal.id} title={signal.label} value={signal.value} detail={signal.insight} />)}</div>
      </Section>
              </SlideCard>

              <SlideCard tab={tabs[8]} index={8} activeIndex={activeIndex} slideCount={slideCount}>
                <Section title="Audit Log" eyebrow="감사 로그" desc="프로토타입 액션은 브라우저 localStorage에만 저장되며 실제 서버 상태를 바꾸지 않습니다.">
        <div className="admin-list">{combinedAudit.map(entry => <article className="source-row" key={entry.id}><div><strong>{entry.action} · {entry.targetId}</strong><p className="footer-note">{entry.at} · {entry.actor} · {entry.note}</p></div><span className="chip">audit</span></article>)}</div>
      </Section>
              </SlideCard>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}

function SlideCard({ tab, index, activeIndex, slideCount, children }) {
  return (
    <article className="admin-slide-card" aria-hidden={activeIndex !== index}>
      <div className="admin-card-status">
        <span className="chip chip-blue">Slide {index + 1} / {slideCount}</span>
        <span className="chip chip-accent">{tab.ko}</span>
      </div>
      {children}
    </article>
  );
}

function Section({ title, eyebrow, desc, children }) {
  return <section className="section panel block stack admin-section"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2><p className="muted">{desc}</p></div>{children}</section>;
}

function Kpi({ label, value, desc }) {
  return <article className="card"><span className="label">{label}</span><div className="stat">{value}</div><p className="footer-note">{desc}</p></article>;
}

function StatusCard({ title, value, detail }) {
  return <article className="card stack"><span className="label">{title}</span><strong>{value}</strong><p className="footer-note">{detail}</p></article>;
}

function AdminActions({ item, actions, runAction }) {
  return <div className="actions">{actions.map(action => <button className="btn secondary small" type="button" key={action} onClick={() => runAction(item, action)}>{actionLabels[action]}</button>)}</div>;
}
