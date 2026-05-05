# PMF League OS Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Build the PMF-focused first version of the Investment Content Intelligence OS: league scoring, channel/panel league UI, weekly report, asset recommendation timeline, channel request loop, share/copy blocks, and compliance/evidence guardrails.

**Architecture:** Keep the app as a static-export Next.js client app for now. Split pure scoring and fixture data out of `app/page.jsx` into small CommonJS-compatible modules under `lib/` and `data/` so Node smoke tests can import them without a bundler. Use fixture + semi-manual verified data, not real ingestion, until PMF signals are proven.

**Tech Stack:** Next.js static export, React client components, Node `assert` tests, existing Playwright smoke scripts, Vercel prebuilt deployment flow.

**Planning Basis:** `docs/plans/2026-05-05-service-planning-expert-review-opinion.md` and `docs/plans/2026-05-05-expert-lens-library.md`.

---

## 0. Scope and Non-Scope

### In Scope

1. Versioned league scoring algorithm v0.1.
2. Channel and panel metrics fixtures.
3. Channel/Panel League Dashboard.
4. Promotion/Demotion/Caution cards.
5. Weekly Investment Content Report section.
6. Asset Recommendation Timeline section.
7. Channel Request Loop UI with localStorage persistence.
8. Share/Copy blocks for weekly report, asset timeline, and channel request.
9. PMF metric placeholders/events in local state/localStorage.
10. Evidence and compliance guardrails in UI.
11. Static, build, and browser smoke tests.

### Explicitly Out of Scope

1. Real YouTube API ingestion.
2. Transcript collection and LLM extraction.
3. Real price API integration.
4. Login/auth/payment.
5. Database/Supabase.
6. Fully automated algorithm calibration.
7. Real social media posting.
8. Investment advice, buy/sell recommendations, or predictive claims.

---

## 1. Global Acceptance Criteria

The implementation is complete only when all are true:

- `npm test` passes.
- `npm run build` passes with `output: 'export'` intact.
- Local responsive smoke passes:
  - `LD_LIBRARY_PATH=/tmp/chrome-libs/root/usr/lib/x86_64-linux-gnu:$LD_LIBRARY_PATH node tests/multichannel-responsive-smoke.js`
- New league scoring tests pass.
- UI includes these exact concepts:
  - `League Score v0.1`
  - `algorithmVersion`
  - `Rookie`, `Minor`, `Major`, `Ace`, `Caution Watch`
  - `주간 투자 콘텐츠 리포트`
  - `종목별 추천 타임라인`
  - `이 채널도 분석해주세요`
  - `공개 콘텐츠 발언 기준`
  - `투자 권유가 아닙니다`
  - `추천일 종가 대비`
- Every displayed investment pick has evidence fields: source, quote, recommendation date, recommendation close, latest close, return.
- No UI copy says or implies `매수`, `매도`, `추천주`, `수익 보장`, or `AI 추천`.

---

## 2. Phase-Level Expert Lens Hooks

### Phase A. PMF Foundation

**Expert Lens Hook**
- Primary lens: Lenny Rachitsky — The MVP must create weekly retention and user pull.
- Second opinion: Rahul Vohra — Identify who would be very disappointed if weekly reports/channel requests disappeared.
- Contrarian/risk lens: Rob Fitzpatrick — Treat praise as weak signal; measure channel requests, shares, and return visits.
- Decision impact: Build `Channel Request Loop`, `Weekly Report`, and `Share/Copy` before advanced automation.

### Phase B. League Scoring

**Expert Lens Hook**
- Primary lens: Michael Mauboussin — Separate skill from luck; use sample size and process quality.
- Second opinion: Ronny Kohavi — Define metrics, guardrails, and versioned algorithm outputs.
- Contrarian/risk lens: Taleb + Eugene Fama — Avoid interpreting short-term public-content performance as predictive alpha.
- Decision impact: Add sample gates, confidence, Caution override, score breakdown, and humble copy.

### Phase C. Viral/Media Loop

**Expert Lens Hook**
- Primary lens: Brian Balfour/Reforge — Turn reports and cards into growth loops, not one-off posts.
- Second opinion: Nikita Bier + Eugene Wei — Give users a social reason to share: discovery, debate, status.
- Contrarian/risk lens: Zeynep Tufekci + compliance — Prevent fan-war, misinformation, and defamation dynamics.
- Decision impact: Share blocks must be evidence-backed, neutral, and include disclaimers.

### Phase D. AI/Automation Readiness

**Expert Lens Hook**
- Primary lens: Andrew Ng — Data quality and label definitions come before model automation.
- Second opinion: Chip Huyen — Prepare eval and drift-aware data structures.
- Contrarian/risk lens: Gary Marcus + Rumman Chowdhury — Assume extraction errors and harmful misclassification.
- Decision impact: Include `confidence`, `humanStatus`, `evidence`, and `auditLog` fields in fixtures now.

---

## 3. Implementation Tasks

### Task 1: Add League Scoring Tests First

**Objective:** Lock the algorithm contract before UI work.

**Files:**
- Create: `tests/league-scoring.test.js`
- Later create: `lib/leagueScoring.js`
- Modify: `package.json`

**Step 1: Create failing test file**

Create `tests/league-scoring.test.js` with tests for:

```js
const assert = require('assert');
const {
  LEAGUE_ALGORITHM_VERSION,
  clamp,
  scoreReturn,
  calculatePerformanceRaw,
  calculateReliabilityRaw,
  calculateSampleRaw,
  calculateRecencyRaw,
  calculateRiskRaw,
  calculateLeagueScore,
  assignLeague,
  getPromotionStatus,
} = require('../lib/leagueScoring');

function test(name, fn) {
  try { fn(); console.log(`PASS ${name}`); }
  catch (e) { console.error(`FAIL ${name}\n${e.stack || e.message}`); process.exitCode = 1; }
}

test('exports versioned league algorithm', () => {
  assert.strictEqual(LEAGUE_ALGORITHM_VERSION, 'league-ranking-v0.1');
});

test('scoreReturn maps -10 to 0, 0 to 50, +10 to 100 with clamps', () => {
  assert.strictEqual(scoreReturn(-20), 0);
  assert.strictEqual(scoreReturn(-10), 0);
  assert.strictEqual(scoreReturn(0), 50);
  assert.strictEqual(scoreReturn(10), 100);
  assert.strictEqual(scoreReturn(20), 100);
});

test('performance combines 1w 1m 3m returns with 20/30/50 weights', () => {
  const raw = calculatePerformanceRaw({ return1w: 2, return1m: 4, return3m: 6 });
  assert(raw > 65 && raw < 85);
});

test('reliability gives hit full credit and flat half credit', () => {
  assert.strictEqual(calculateReliabilityRaw({ hitRate: 0.6, flatRate: 0.2, missRate: 0.2 }), 70);
});

test('sample score gates low sample and reaches 100 around 30 picks', () => {
  assert(calculateSampleRaw(4) < calculateSampleRaw(20));
  assert.strictEqual(calculateSampleRaw(30), 100);
  assert.strictEqual(calculateSampleRaw(80), 100);
});

test('recency score decays by 2 points per day', () => {
  assert.strictEqual(calculateRecencyRaw(0), 100);
  assert.strictEqual(calculateRecencyRaw(10), 80);
  assert.strictEqual(calculateRecencyRaw(100), 0);
});

test('risk score penalizes drawdown hype pump and sponsor risk', () => {
  const safe = calculateRiskRaw({ maxDrawdownPct: -5, hypeRate: 0, repeatedAssetRate: 0, sponsorConflictRate: 0, sectorConsistencyRate: 0.8 });
  const risky = calculateRiskRaw({ maxDrawdownPct: -30, hypeRate: 0.8, repeatedAssetRate: 0.6, sponsorConflictRate: 0.5, sectorConsistencyRate: 0.1 });
  assert(safe > risky);
});

test('high score but fewer than 5 picks remains Rookie', () => {
  const metrics = { pickCount: 4, hitRate: 0.9, flatRate: 0.1, missRate: 0, ambiguityRate: 0.05, severeRiskFlag: false };
  assert.strictEqual(assignLeague(metrics, 95), 'Rookie');
});

test('severe risk overrides score into Caution Watch', () => {
  const metrics = { pickCount: 40, hitRate: 0.8, flatRate: 0.1, missRate: 0.1, ambiguityRate: 0.1, severeRiskFlag: true };
  assert.strictEqual(assignLeague(metrics, 90), 'Caution Watch');
});

test('score result includes weighted breakdown and algorithmVersion', () => {
  const result = calculateLeagueScore({
    return1w: 2, return1m: 4, return3m: 8,
    hitRate: 0.65, flatRate: 0.2, missRate: 0.15,
    approvedPickRate: 0.9, explicitStanceRate: 0.85, quoteEvidenceRate: 0.9,
    ambiguityRate: 0.1, contradictionRate: 0,
    pickCount: 25, daysSinceLastPick: 3,
    maxDrawdownPct: -12, hypeRate: 0.1, repeatedAssetRate: 0.15, sponsorConflictRate: 0, sectorConsistencyRate: 0.8,
    severeRiskFlag: false,
  });
  assert.strictEqual(result.algorithmVersion, 'league-ranking-v0.1');
  assert(result.score > 0 && result.score <= 100);
  assert(result.breakdown.performance.points > 0);
  assert(result.breakdown.risk.points > 0);
});

test('promotion status requires repeated qualification', () => {
  assert.strictEqual(getPromotionStatus({ currentLeague: 'Minor', consecutivePromotionSignals: 1, consecutiveDemotionSignals: 0, severeRiskFlag: false }, 75), 'watch');
  assert.strictEqual(getPromotionStatus({ currentLeague: 'Minor', consecutivePromotionSignals: 2, consecutiveDemotionSignals: 0, severeRiskFlag: false }, 75), 'promote_candidate');
  assert.strictEqual(getPromotionStatus({ currentLeague: 'Major', consecutivePromotionSignals: 0, consecutiveDemotionSignals: 2, severeRiskFlag: false }, 45), 'demotion_risk');
});
```

**Step 2: Run test to verify failure**

Run:

```bash
node tests/league-scoring.test.js
```

Expected: FAIL because `../lib/leagueScoring` does not exist.

**Step 3: Add npm script**

Modify `package.json` scripts:

```json
"test": "node tests/smoke.js && node tests/league-scoring.test.js"
```

**Step 4: Commit**

```bash
git add package.json tests/league-scoring.test.js
git commit -m "test: add league scoring contract"
```

---

### Task 2: Implement Versioned League Scoring Utility

**Objective:** Implement the pure scoring functions used by fixtures and UI.

**Files:**
- Create: `lib/leagueScoring.js`
- Test: `tests/league-scoring.test.js`

**Step 1: Create implementation**

Implement `lib/leagueScoring.js` as CommonJS:

```js
const LEAGUE_ALGORITHM_VERSION = 'league-ranking-v0.1';

const DEFAULT_WEIGHTS = Object.freeze({
  performance: 0.35,
  reliability: 0.20,
  clarity: 0.15,
  sample: 0.10,
  recency: 0.10,
  risk: 0.10,
});

function clamp(value, min = 0, max = 100) {
  return Math.min(max, Math.max(min, Number.isFinite(value) ? value : 0));
}

function round(value, digits = 2) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function scoreReturn(returnPct) {
  return clamp(50 + returnPct * 5, 0, 100);
}

function calculatePerformanceRaw(metrics) {
  return round(
    scoreReturn(metrics.return1w || 0) * 0.20 +
    scoreReturn(metrics.return1m || 0) * 0.30 +
    scoreReturn(metrics.return3m || 0) * 0.50
  );
}

function calculateReliabilityRaw(metrics) {
  return round(clamp((metrics.hitRate || 0) * 100 + (metrics.flatRate || 0) * 50));
}

function calculateClarityRaw(metrics) {
  return round(clamp(
    (metrics.approvedPickRate || 0) * 70 +
    (metrics.explicitStanceRate || 0) * 20 +
    (metrics.quoteEvidenceRate || 0) * 10 -
    (metrics.ambiguityRate || 0) * 40 -
    (metrics.contradictionRate || 0) * 30
  ));
}

function calculateSampleRaw(pickCount) {
  return round(clamp(Math.sqrt((pickCount || 0) / 30) * 100));
}

function calculateRecencyRaw(daysSinceLastPick) {
  return round(clamp(100 - (daysSinceLastPick || 0) * 2));
}

function calculateRiskRaw(metrics) {
  const maxDrawdownPenalty = clamp(Math.abs(metrics.maxDrawdownPct || 0) * 2, 0, 30);
  const hypePenalty = clamp((metrics.hypeRate || 0) * 20, 0, 20);
  const pumpPenalty = clamp((metrics.repeatedAssetRate || 0) * 15, 0, 15);
  const sponsorPenalty = clamp((metrics.sponsorConflictRate || 0) * 25, 0, 25);
  const sectorExpertiseBonus = clamp((metrics.sectorConsistencyRate || 0) * 10, 0, 10);
  return round(clamp(100 - maxDrawdownPenalty - hypePenalty - pumpPenalty - sponsorPenalty + sectorExpertiseBonus));
}

function calculateLeagueScore(metrics, weights = DEFAULT_WEIGHTS) {
  const raw = {
    performance: calculatePerformanceRaw(metrics),
    reliability: calculateReliabilityRaw(metrics),
    clarity: calculateClarityRaw(metrics),
    sample: calculateSampleRaw(metrics.pickCount),
    recency: calculateRecencyRaw(metrics.daysSinceLastPick),
    risk: calculateRiskRaw(metrics),
  };

  const breakdown = Object.fromEntries(Object.entries(raw).map(([key, value]) => [
    key,
    { raw: value, weight: weights[key], points: round(value * weights[key]) },
  ]));

  const score = round(Object.values(breakdown).reduce((sum, item) => sum + item.points, 0));
  return {
    algorithmVersion: LEAGUE_ALGORITHM_VERSION,
    score,
    raw,
    breakdown,
    evaluatedAt: '2026-05-05',
  };
}

function isCaution(metrics, score) {
  return Boolean(metrics.severeRiskFlag)
    || score < 40
    || (metrics.missRate || 0) >= 0.45
    || (metrics.ambiguityRate || 0) >= 0.5
    || (metrics.maxDrawdownPct || 0) <= -25;
}

function assignLeague(metrics, score) {
  if (isCaution(metrics, score)) return 'Caution Watch';
  if ((metrics.pickCount || 0) < 5) return 'Rookie';
  if (score >= 85 && (metrics.pickCount || 0) >= 30 && (metrics.hitRate || 0) >= 0.65) return 'Ace';
  if (score >= 70 && (metrics.pickCount || 0) >= 20 && (metrics.hitRate || 0) >= 0.55 && (metrics.ambiguityRate || 0) <= 0.30) return 'Major';
  if (score >= 45 && (metrics.pickCount || 0) >= 5) return 'Minor';
  return 'Rookie';
}

function getPromotionStatus(metrics, score) {
  if (metrics.severeRiskFlag || isCaution(metrics, score)) return 'caution_review';
  if ((metrics.consecutivePromotionSignals || 0) >= 2) return 'promote_candidate';
  if ((metrics.consecutiveDemotionSignals || 0) >= 2) return 'demotion_risk';
  if ((metrics.consecutivePromotionSignals || 0) === 1 || (metrics.consecutiveDemotionSignals || 0) === 1) return 'watch';
  return 'stable';
}

module.exports = {
  LEAGUE_ALGORITHM_VERSION,
  DEFAULT_WEIGHTS,
  clamp,
  scoreReturn,
  calculatePerformanceRaw,
  calculateReliabilityRaw,
  calculateClarityRaw,
  calculateSampleRaw,
  calculateRecencyRaw,
  calculateRiskRaw,
  calculateLeagueScore,
  assignLeague,
  getPromotionStatus,
};
```

**Step 2: Run tests**

```bash
node tests/league-scoring.test.js
npm test
```

Expected: PASS.

**Step 3: Commit**

```bash
git add lib/leagueScoring.js tests/league-scoring.test.js package.json
git commit -m "feat: implement league scoring v0.1"
```

---

### Task 3: Extract Current Fixture Data Into Shared Data Module

**Objective:** Reduce `app/page.jsx` size and make fixtures reusable for reports/timelines.

**Files:**
- Create: `data/contentFixtures.js`
- Modify: `app/page.jsx`
- Test: `tests/smoke.js`

**Step 1: Create `data/contentFixtures.js`**

Move these existing constants from `app/page.jsx`:

- `analysisWindow`
- `latestFixtureSync`
- `defaultSource`
- `sourceChannels`
- `statusLabels`
- `stanceLabels`
- `contents`
- `performances`
- `monthlyTrend`
- `channelSummaries`
- `matrix`
- `reviewItems`

Export them as CommonJS:

```js
const analysisWindow = '2026-02-05 ~ 2026-05-05';
const latestFixtureSync = '2026-05-05 06:10 KST';
// ...existing data...
module.exports = { analysisWindow, latestFixtureSync, defaultSource, sourceChannels, statusLabels, stanceLabels, contents, performances, monthlyTrend, channelSummaries, matrix, reviewItems };
```

**Step 2: Import in `app/page.jsx`**

Because this is a Next client file, use named import from CommonJS-compatible module:

```js
import fixtures from '../data/contentFixtures';

const {
  analysisWindow,
  latestFixtureSync,
  defaultSource,
  sourceChannels,
  statusLabels,
  stanceLabels,
  contents,
  performances,
  monthlyTrend,
  channelSummaries,
  matrix,
  reviewItems,
} = fixtures;
```

If Next complains about default import from CommonJS, switch `data/contentFixtures.js` to ES module export and update Node tests to read file contents only. Prefer whichever passes build.

**Step 3: Run tests**

```bash
npm test
npm run build
```

Expected: PASS.

**Step 4: Commit**

```bash
git add app/page.jsx data/contentFixtures.js
git commit -m "refactor: extract investment content fixtures"
```

---

### Task 4: Add Channel and Panel League Fixtures

**Objective:** Add metrics and computed league scores for channels and contributors.

**Files:**
- Create: `data/leagueFixtures.js`
- Modify: `tests/smoke.js`

**Step 1: Create `data/leagueFixtures.js`**

Use `lib/leagueScoring.js` to compute scores.

Shape:

```js
const { calculateLeagueScore, assignLeague, getPromotionStatus } = require('../lib/leagueScoring');

const channelMetricInputs = [
  {
    id: 'kim', entityType: 'channel', name: '김작가 TV', currentLeague: 'Major', pickCount: 24,
    return1w: 2.4, return1m: 4.1, return3m: 5.2,
    hitRate: 0.75, flatRate: 0.15, missRate: 0.10,
    approvedPickRate: 0.92, explicitStanceRate: 0.86, quoteEvidenceRate: 0.88,
    ambiguityRate: 0.18, contradictionRate: 0.02,
    daysSinceLastPick: 2, maxDrawdownPct: -11,
    hypeRate: 0.12, repeatedAssetRate: 0.18, sponsorConflictRate: 0.03, sectorConsistencyRate: 0.72,
    severeRiskFlag: false, consecutivePromotionSignals: 1, consecutiveDemotionSignals: 0,
  },
  {
    id: 'sinsa', entityType: 'channel', name: '신사임당', currentLeague: 'Minor', pickCount: 13,
    return1w: 1.8, return1m: 3.6, return3m: 4.18,
    hitRate: 0.67, flatRate: 0.20, missRate: 0.13,
    approvedPickRate: 0.88, explicitStanceRate: 0.81, quoteEvidenceRate: 0.90,
    ambiguityRate: 0.22, contradictionRate: 0.03,
    daysSinceLastPick: 8, maxDrawdownPct: -13,
    hypeRate: 0.10, repeatedAssetRate: 0.16, sponsorConflictRate: 0.02, sectorConsistencyRate: 0.70,
    severeRiskFlag: false, consecutivePromotionSignals: 1, consecutiveDemotionSignals: 0,
  },
];

const panelMetricInputs = [
  // 염승환 이사, 이안나 부센터장, 신사임당 진행자, 신사임당 게스트, 익명 패널
];

function enrich(input) {
  const score = calculateLeagueScore(input);
  return {
    ...input,
    ...score,
    league: assignLeague(input, score.score),
    promotionStatus: getPromotionStatus(input, score.score),
  };
}

const channelLeagues = channelMetricInputs.map(enrich);
const panelLeagues = panelMetricInputs.map(enrich);

module.exports = { channelMetricInputs, panelMetricInputs, channelLeagues, panelLeagues };
```

For panel fixtures include at least:

- `염승환 이사` as `Major` or `Major 후보`
- `이안나 부센터장` as `Minor`
- `신사임당 진행자` as `Minor/Major 후보`
- `신사임당 게스트` as `Rookie/Minor`
- `익명 패널` as `Caution Watch`

**Step 2: Add smoke assertions**

In `tests/smoke.js`, add a test that reads `data/leagueFixtures.js` and asserts it includes:

- `channelLeagues`
- `panelLeagues`
- `league-ranking-v0.1` indirectly via scoring import or string
- `Caution Watch`

**Step 3: Run tests**

```bash
npm test
```

Expected: PASS.

**Step 4: Commit**

```bash
git add data/leagueFixtures.js tests/smoke.js
git commit -m "feat: add league fixture data"
```

---

### Task 5: Add League Dashboard UI

**Objective:** Display channel and panel league cards with score breakdown and expert-validated guardrails.

**Files:**
- Modify: `app/page.jsx`
- Modify: `app/globals.css`
- Modify: `tests/smoke.js`

**Step 1: Add failing smoke assertions**

In `tests/smoke.js`, assert `app/page.jsx` includes:

```js
assert(app.includes('League Score v0.1'));
assert(app.includes('Channel League'));
assert(app.includes('Panel League'));
assert(app.includes('algorithmVersion'));
assert(app.includes('Caution Watch'));
assert(app.includes('score breakdown'));
assert(app.includes('공개 콘텐츠 발언 기준'));
```

Run `npm test`. Expected: FAIL.

**Step 2: Import league fixtures**

In `app/page.jsx`:

```js
import leagueFixtures from '../data/leagueFixtures';
const { channelLeagues, panelLeagues } = leagueFixtures;
```

**Step 3: Add League section after hero/source coverage**

Add section id `league-board`:

```jsx
<section className="section" id="league-board">
  <div className="section-heading">
    <p className="eyebrow">League Score v0.1</p>
    <h2>채널·패널 리그 보드</h2>
    <p className="muted">공개 콘텐츠 발언 기준으로 계산한 샘플 리그입니다. 투자 권유가 아닙니다.</p>
  </div>
  ...
</section>
```

Add:

- Overview stats: active algorithm, channel count, panel count, Caution count.
- Channel League cards.
- Panel League cards.
- Score breakdown list: performance, reliability, clarity, sample, recency, risk.
- League badges.

**Step 4: Add CSS**

Add classes:

```css
.league-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
.league-card { border: 1px solid var(--line); border-radius: 18px; padding: 16px; background: rgba(255,255,255,0.04); }
.league-badge { display: inline-flex; min-height: 28px; align-items: center; border-radius: 999px; padding: 0 10px; font-size: 12px; font-weight: 800; }
.league-badge.caution { background: rgba(255, 107, 107, 0.16); color: #ffb3b3; }
.score-breakdown { display: grid; gap: 8px; }
.score-row { display: grid; grid-template-columns: 96px 1fr auto; gap: 8px; align-items: center; }
.score-meter { height: 8px; border-radius: 999px; background: rgba(255,255,255,0.09); overflow: hidden; }
.score-fill { height: 100%; background: linear-gradient(90deg, #6ee7b7, #60a5fa); }
```

Add mobile 1-column rule.

**Step 5: Run tests/build**

```bash
npm test
npm run build
```

Expected: PASS.

**Step 6: Commit**

```bash
git add app/page.jsx app/globals.css tests/smoke.js
git commit -m "feat: add league dashboard"
```

---

### Task 6: Add Promotion/Demotion/Caution Cards

**Objective:** Make league movement explicit and explainable.

**Files:**
- Modify: `app/page.jsx`
- Modify: `app/globals.css`
- Modify: `tests/smoke.js`

**Step 1: Add failing smoke assertions**

Assert strings:

- `승급 후보`
- `강등 위험`
- `주의 관찰`
- `2회 연속 조건`
- `Major까지`

**Step 2: Add computed lists**

In `Page()`:

```js
const promotionCandidates = [...channelLeagues, ...panelLeagues].filter(item => item.promotionStatus === 'promote_candidate' || item.promotionStatus === 'watch');
const demotionRisks = [...channelLeagues, ...panelLeagues].filter(item => item.promotionStatus === 'demotion_risk');
const cautionItems = [...channelLeagues, ...panelLeagues].filter(item => item.league === 'Caution Watch');
```

**Step 3: Render movement cards**

Add a sub-section under `league-board`:

```jsx
<div className="movement-grid">
  <MovementCard title="승급 후보" items={promotionCandidates} />
  <MovementCard title="강등 위험" items={demotionRisks} />
  <MovementCard title="주의 관찰" items={cautionItems} />
</div>
```

If creating a helper component inside `app/page.jsx`, keep it pure and small.

**Step 4: Add CSS and mobile behavior**

Use `movement-grid`, `movement-card`, `reason-list`.

**Step 5: Verify**

```bash
npm test
npm run build
```

Expected: PASS.

**Step 6: Commit**

```bash
git add app/page.jsx app/globals.css tests/smoke.js
git commit -m "feat: add league movement cards"
```

---

### Task 7: Add Weekly Investment Content Report

**Objective:** Create the first repeatable PMF/viral artifact inside the app.

**Files:**
- Create: `data/weeklyReportFixtures.js`
- Modify: `app/page.jsx`
- Modify: `app/globals.css`
- Modify: `tests/smoke.js`

**Step 1: Create fixture module**

`data/weeklyReportFixtures.js`:

```js
const weeklyReport = {
  reportId: '2026-W19',
  title: '주간 투자 콘텐츠 리포트',
  period: '2026-04-29 ~ 2026-05-05',
  dataStatus: 'sample + manual verified',
  topAssets: [
    { asset: 'SK하이닉스', mentions: 4, avgReturn: 6.32 },
    { asset: '엔비디아', mentions: 3, avgReturn: 6.84 },
    { asset: '삼성전자', mentions: 3, avgReturn: 2.87 },
  ],
  topThemes: [
    { theme: 'AI 인프라', mentions: 7 },
    { theme: '반도체', mentions: 6 },
    { theme: '전력기기', mentions: 4 },
  ],
  highlights: [
    '김작가 TV와 신사임당 모두 AI 인프라·반도체 언급 비중이 높았습니다.',
    '신사임당은 전력기기 테마의 3개월 추적 필요성을 반복 언급했습니다.',
  ],
  shareText: `[주간 투자 콘텐츠 리포트]\n많이 언급된 종목: SK하이닉스, 엔비디아, 삼성전자\n기준: 공개 콘텐츠 발언 / 추천일 종가 대비\n투자 권유가 아닙니다.`,
};

module.exports = { weeklyReport };
```

**Step 2: Add smoke assertions**

Assert:

- `주간 투자 콘텐츠 리포트`
- `많이 언급된 종목`
- `많이 언급된 테마`
- `공유용 요약`
- `복사하기`

**Step 3: Render section**

Add section id `weekly-report`:

```jsx
<section className="section" id="weekly-report">
  <p className="eyebrow">PMF Report</p>
  <h2>주간 투자 콘텐츠 리포트</h2>
  ...
  <textarea readOnly value={weeklyReport.shareText} />
  <button className="btn" type="button" onClick={() => navigator.clipboard?.writeText(weeklyReport.shareText)}>복사하기</button>
</section>
```

Use copy state to show `복사 완료`.

**Step 4: Add CSS**

Add `report-grid`, `rank-list`, `share-box`.

**Step 5: Verify**

```bash
npm test
npm run build
```

Expected: PASS.

**Step 6: Commit**

```bash
git add data/weeklyReportFixtures.js app/page.jsx app/globals.css tests/smoke.js
git commit -m "feat: add weekly report MVP"
```

---

### Task 8: Add Asset Recommendation Timeline MVP

**Objective:** Show asset-centric recommendation history before building full candle charts.

**Files:**
- Create: `data/assetTimelineFixtures.js`
- Modify: `app/page.jsx`
- Modify: `app/globals.css`
- Modify: `tests/smoke.js`

**Step 1: Create fixture**

`data/assetTimelineFixtures.js`:

```js
const assetTimelines = [
  {
    ticker: 'NVDA', name: '엔비디아', market: 'US',
    events: [
      {
        date: '2026-04-27', channel: '신사임당', contributor: '신사임당 진행자', league: 'Minor', stance: '매우 긍정',
        recClose: 1140, latest: 1218, returnPct: 6.84,
        sourceUrl: 'https://www.youtube.com/results?search_query=신사임당+엔비디아+AI+인프라',
        quote: 'AI 인프라 투자는 아직 끝나지 않았고 실적 확인이 중요합니다.',
        confidence: 0.86, humanStatus: 'manual verified sample',
      },
    ],
  },
  // SK하이닉스, 삼성전자, HD현대일렉트릭, 두산로보틱스
];
module.exports = { assetTimelines };
```

**Step 2: Add smoke assertions**

Assert:

- `종목별 추천 타임라인`
- `추천일 종가`
- `최신가`
- `근거 발언`
- `sourceUrl`
- `humanStatus`

**Step 3: Render UI**

Add state:

```js
const [assetFilter, setAssetFilter] = useState(assetTimelines[0].ticker);
```

Render select and timeline cards.

Important copy:

```text
차트 신호가 아니라 공개 콘텐츠 발언 시점입니다.
```

**Step 4: Add CSS**

Add `asset-timeline`, `timeline-event`, `event-marker`, `evidence-box`.

**Step 5: Verify**

```bash
npm test
npm run build
```

Expected: PASS.

**Step 6: Commit**

```bash
git add data/assetTimelineFixtures.js app/page.jsx app/globals.css tests/smoke.js
git commit -m "feat: add asset recommendation timeline"
```

---

### Task 9: Add Channel Request Loop

**Objective:** Capture PMF demand and create a user-driven data expansion loop.

**Files:**
- Modify: `app/page.jsx`
- Modify: `app/globals.css`
- Modify: `tests/smoke.js`

**Step 1: Add smoke assertions**

Assert:

- `이 채널도 분석해주세요`
- `Rookie 후보`
- `요청 수`
- `분석 요청`
- `공유하면 우선순위`

**Step 2: Add state and localStorage**

Use key:

```js
const REQUESTS_KEY = 'investment-content-dashboard/channel-requests';
```

State:

```js
const [channelRequest, setChannelRequest] = useState({ name: '', url: '' });
const [requestedChannels, setRequestedChannels] = useState([]);
```

On submit:

- validate YouTube URL using existing `isYoutubeUrl`.
- dedupe by URL.
- add item: `{ id, name, url, votes: 1, status: 'Rookie 후보', createdAt }`.
- persist to localStorage.

**Step 3: Render section**

Add section id `channel-request`:

```jsx
<section className="section" id="channel-request">
  <p className="eyebrow">User Request Loop</p>
  <h2>이 채널도 분석해주세요</h2>
  <p className="muted">요청이 많은 채널은 Rookie 후보로 올리고 다음 리포트 우선순위에 반영합니다.</p>
  ...
</section>
```

**Step 4: Add share prompt**

For each request show copy:

```text
이 투자 채널도 공개 발언 성과 분석 요청했습니다. 같이 요청하면 우선순위가 올라갑니다.
```

**Step 5: Verify**

```bash
npm test
npm run build
```

Expected: PASS.

**Step 6: Commit**

```bash
git add app/page.jsx app/globals.css tests/smoke.js
git commit -m "feat: add channel request loop"
```

---

### Task 10: Add PMF Metrics Placeholder

**Objective:** Track local event counts without a backend so PMF instrumentation is visible.

**Files:**
- Create: `lib/pmfEvents.js`
- Modify: `app/page.jsx`
- Modify: `tests/smoke.js`

**Step 1: Create `lib/pmfEvents.js`**

```js
const PMF_EVENTS_KEY = 'investment-content-dashboard/pmf-events';

function getEvents(storage) {
  try { return JSON.parse(storage.getItem(PMF_EVENTS_KEY) || '[]'); }
  catch { return []; }
}

function recordEvent(storage, type, payload = {}) {
  if (!storage) return [];
  const events = getEvents(storage);
  const next = [...events, { type, payload, at: new Date().toISOString() }].slice(-200);
  storage.setItem(PMF_EVENTS_KEY, JSON.stringify(next));
  return next;
}

function summarizeEvents(events) {
  return events.reduce((acc, event) => {
    acc[event.type] = (acc[event.type] || 0) + 1;
    return acc;
  }, {});
}

module.exports = { PMF_EVENTS_KEY, getEvents, recordEvent, summarizeEvents };
```

**Step 2: Add tests or smoke assertions**

Either create `tests/pmf-events.test.js` or add to `tests/smoke.js` that `lib/pmfEvents.js` includes:

- `PMF_EVENTS_KEY`
- `recordEvent`
- `summarizeEvents`

If adding a new test, update `package.json` test script.

**Step 3: Wire events**

Record events for:

- `share_copy_weekly_report`
- `share_copy_asset_timeline`
- `channel_request_submit`
- `asset_timeline_change`

Display a small PMF placeholder card:

```text
PMF Signals Preview
채널 요청, 공유 복사, 종목 타임라인 조회는 초기 PMF 신호로만 로컬 집계됩니다.
```

**Step 4: Verify**

```bash
npm test
npm run build
```

Expected: PASS.

**Step 5: Commit**

```bash
git add lib/pmfEvents.js app/page.jsx tests/smoke.js package.json
git commit -m "feat: add PMF signal placeholders"
```

---

### Task 11: Strengthen Compliance and Evidence Guardrail Tests

**Objective:** Prevent regression into investment-advice or defamation copy.

**Files:**
- Modify: `tests/smoke.js`
- Modify: `app/page.jsx` if test fails

**Step 1: Add tests**

Add a smoke test:

```js
test('compliance guardrails avoid investment advice copy and require evidence language', () => {
  const app = read('app/page.jsx');
  assert(app.includes('투자 권유가 아닙니다'));
  assert(app.includes('공개 콘텐츠 발언 기준'));
  assert(app.includes('근거 발언'));
  assert(app.includes('추천일 종가 대비'));
  assert(!app.includes('AI 추천주'));
  assert(!app.includes('수익 보장'));
  assert(!app.includes('매수 신호'));
});
```

**Step 2: Run test**

```bash
npm test
```

Expected: PASS after adding missing copy if necessary.

**Step 3: Commit**

```bash
git add tests/smoke.js app/page.jsx
git commit -m "test: add compliance guardrail checks"
```

---

### Task 12: Update Mobile Sticky Navigation

**Objective:** Make new PMF sections accessible on mobile.

**Files:**
- Modify: `app/page.jsx`
- Modify: `app/globals.css`
- Modify: `tests/smoke.js`

**Step 1: Update mobile nav links**

Add compact links:

- `리그` → `#league-board`
- `리포트` → `#weekly-report`
- `종목` → `#asset-timeline`
- `요청` → `#channel-request`

Keep total nav manageable. If too many links, use two-row horizontal scroll.

**Step 2: Add tests**

Assert new anchors exist.

**Step 3: Verify browser smoke**

```bash
npm test
npm run build
```

Then start local server and run:

```bash
npm start
LD_LIBRARY_PATH=/tmp/chrome-libs/root/usr/lib/x86_64-linux-gnu:$LD_LIBRARY_PATH node tests/multichannel-responsive-smoke.js
```

Expected: PASS, no horizontal overflow.

**Step 4: Commit**

```bash
git add app/page.jsx app/globals.css tests/smoke.js
git commit -m "feat: update mobile navigation for PMF sections"
```

---

### Task 13: Extend Browser Smoke Test for PMF Sections

**Objective:** Verify the new sections render in actual Chromium viewports.

**Files:**
- Modify: `tests/multichannel-responsive-smoke.js`
- Modify: `tests/prod-multichannel-responsive-smoke.js` later before production deploy

**Step 1: Update local smoke expected text**

Add required strings:

- `League Score v0.1`
- `주간 투자 콘텐츠 리포트`
- `종목별 추천 타임라인`
- `이 채널도 분석해주세요`
- `투자 권유가 아닙니다`

**Step 2: Run local smoke**

```bash
LD_LIBRARY_PATH=/tmp/chrome-libs/root/usr/lib/x86_64-linux-gnu:$LD_LIBRARY_PATH node tests/multichannel-responsive-smoke.js
```

Expected: PASS.

**Step 3: Commit**

```bash
git add tests/multichannel-responsive-smoke.js
git commit -m "test: cover PMF sections in browser smoke"
```

---

### Task 14: Documentation Update

**Objective:** Document what was built, what is PMF-only, and what remains future work.

**Files:**
- Create: `docs/plans/2026-05-05-pmf-league-os-release-notes.md`
- Modify: `docs/plans/2026-05-05-pmf-league-os-implementation-plan.md` if needed

**Step 1: Create release notes draft**

Include:

- Built features.
- Algorithm version and guardrails.
- Data status: sample + manual verified fixture.
- PMF signals to watch.
- What not to infer from the data.
- Next phases.

**Step 2: Commit**

```bash
git add docs/plans/2026-05-05-pmf-league-os-release-notes.md
git commit -m "docs: add PMF league OS release notes"
```

---

### Task 15: Final Local Verification

**Objective:** Validate static app before any deploy.

**Files:**
- None unless failures require fixes.

**Step 1: Run full local checks**

```bash
npm test
npm run build
```

Expected: PASS.

**Step 2: Run local server**

If a stale server is on port 3000, kill it first:

```bash
fuser -k 3000/tcp 2>/dev/null || true
npm start
```

**Step 3: Run browser smoke**

```bash
LD_LIBRARY_PATH=/tmp/chrome-libs/root/usr/lib/x86_64-linux-gnu:$LD_LIBRARY_PATH node tests/multichannel-responsive-smoke.js
```

Expected:

- HTTP 200.
- No console errors.
- No page errors.
- No request failures.
- Mobile screenshot shows new PMF sections without overflow.

**Step 4: Visual QA**

Use screenshot from existing smoke script:

- `/tmp/investment-dashboard-local-multichannel-mobile.png`

Check:

- league cards readable.
- score breakdown not cramped.
- copy/share text area usable.
- channel request form touch targets >= 44px.
- no investment advice copy.

**Step 5: Commit any fixes**

```bash
git add app/page.jsx app/globals.css tests/* data/* lib/* docs/plans/*
git commit -m "fix: polish PMF league OS local QA"
```

Only commit if actual fixes were made.

---

### Task 16: Production Deploy Plan

**Objective:** Deploy only after local QA passes.

**Files:**
- Modify: `tests/prod-multichannel-responsive-smoke.js`

**Step 1: Update prod smoke expectations**

Mirror Task 13 strings in production smoke.

**Step 2: Build prebuilt output**

Because this project previously had `INTERNAL_DEPLOYMENT_FETCH_FAILED`, use the known safe flow:

```bash
vercel pull --yes --environment=production --token [REDACTED]
vercel build --prod --token [REDACTED]
vercel deploy --prebuilt --prod --yes --token [REDACTED]
```

Do not store or print the token. If no token is available, stop and ask the user for it.

**Step 3: Verify HTTP**

```bash
curl -L -I https://investment-content-dashboard.vercel.app/
```

Expected: HTTP 200.

**Step 4: Run production smoke**

```bash
LD_LIBRARY_PATH=/tmp/chrome-libs/root/usr/lib/x86_64-linux-gnu:$LD_LIBRARY_PATH node tests/prod-multichannel-responsive-smoke.js
```

Expected: PASS.

**Step 5: Inspect deployment**

```bash
vercel inspect https://investment-content-dashboard.vercel.app --token [REDACTED]
```

Expected: Ready.

**Step 6: Final response to user**

Report:

- production URL
- deployment URL
- tests passed
- known data status: sample/manual verified fixture
- token revoke/reissue recommendation

---

## 4. Suggested File Layout After Implementation

```text
app/
  page.jsx
  layout.jsx
  globals.css
lib/
  leagueScoring.js
  pmfEvents.js
data/
  contentFixtures.js
  leagueFixtures.js
  weeklyReportFixtures.js
  assetTimelineFixtures.js
tests/
  smoke.js
  league-scoring.test.js
  multichannel-responsive-smoke.js
  prod-multichannel-responsive-smoke.js
docs/plans/
  2026-05-05-pmf-league-os-implementation-plan.md
  2026-05-05-pmf-league-os-release-notes.md
```

---

## 5. Copy Guardrails

Use:

```text
공개 콘텐츠 발언 기준
추천일 종가 대비
성과 추적
근거 발언
투자 권유가 아닙니다
샘플/수동 검증 데이터
```

Avoid:

```text
매수
매도
매수 신호
추천주
수익 보장
AI 추천
믿어라
틀렸다/사기
```

If a strong viral card needs negative framing, convert it to neutral performance language:

```text
Bad: OO패널 틀림
Good: OO패널 공개 발언 기준 최근 3개월 GOOD 2 / FLAT 1 / MISS 3
```

---

## 6. Implementation Order Summary

1. `tests/league-scoring.test.js`
2. `lib/leagueScoring.js`
3. `data/contentFixtures.js`
4. `data/leagueFixtures.js`
5. League Dashboard UI
6. Promotion/Demotion/Caution UI
7. `data/weeklyReportFixtures.js` + Weekly Report UI
8. `data/assetTimelineFixtures.js` + Asset Timeline UI
9. Channel Request Loop
10. `lib/pmfEvents.js`
11. Compliance guardrail tests
12. Mobile nav update
13. Browser smoke update
14. Release notes
15. Local QA
16. Production deploy

---

## 7. Open Questions for Post-MVP PMF Review

Do not block implementation on these. Answer after real usage signals.

1. Do users click/return for weekly reports or asset timelines more?
2. Which CTA performs better: `채널 요청` vs `종목 검색` vs `리포트 공유`?
3. Do users understand league score, or is it too complex?
4. Do social posts with chart/timeline outperform league/ranking posts?
5. Which persona shows stronger pull: personal investors or community curators?
6. Does the disclaimer reduce trust or increase trust?
7. Which channels are repeatedly requested?

---

## 8. Handoff Note

Plan complete. Implement with small TDD cycles. Do not jump directly to UI without first creating league scoring tests and fixtures. Do not introduce real data ingestion or investment-advice language in this phase.
