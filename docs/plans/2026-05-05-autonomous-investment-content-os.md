# Autonomous Investment Content Intelligence OS

> **For Hermes:** Use this as the product/operations blueprint before implementing league, ingestion, scoring, review, chart overlay, and algorithm-calibration features.

**Goal:** Design an operating system that continuously discovers investment content sources, evaluates channels/panels/assets, promotes or demotes entities through leagues, and improves its ranking algorithm with minimal human intervention.

**Architecture:** The system is organized as autonomous loops: ingestion, extraction, scoring, league movement, review escalation, chart-layer rendering, calibration, and governance. Humans only intervene on low-confidence, high-impact, or policy-changing decisions.

**Tech Stack:** Next.js dashboard, scheduled collectors, scoring engine, versioned ranking configs, review queue, price/candle data store, audit logs, Vercel deployment.

---

## 1. Core Product Thesis

This service should not be a static dashboard. It should operate as an **investment content intelligence OS**:

```text
Discover sources
  -> ingest new content
  -> extract investment picks
  -> score channels/panels
  -> assign leagues
  -> surface chart overlays
  -> request human input only when needed
  -> recalibrate algorithms
  -> repeat
```

The durable product value is not only "what did a YouTuber recommend?" but:

- Which channels deserve attention?
- Which panels are consistently useful?
- Which picks worked after recommendation?
- Which entities are improving or degrading?
- Which recommendations appeared on a stock chart before the move?
- Which unclear items need human judgment?
- Is the ranking algorithm itself still predictive?

---

## 2. Operating Loops

### Loop A: Source Discovery Loop

**Purpose:** Find new channels/sources without manual setup.

**Inputs:** YouTube search, channel graph, comments, descriptions, external watchlists, manually seeded URLs.

**Outputs:** `SourceCandidate` records.

**Autonomy rule:** Auto-add as `Rookie` when source relevance score is high enough; otherwise send to approval queue.

```text
SourceCandidate
- id
- platform
- name
- url
- discoveredFrom
- relevanceScore
- duplicateScore
- riskFlags
- status: discovered | auto_added | needs_human_approval | rejected
```

**Human intervention only if:**

- duplicate confidence is unclear
- relevance score is borderline
- source has sponsor/scam/pump-risk flags
- source is high-impact and should enter active monitoring immediately

---

### Loop B: Content Ingestion Loop

**Purpose:** Continuously collect new videos/posts/reports.

**Daily schedule:** 1-4 times per day, depending on source league.

```text
Ace/Major: every 6h
Minor: daily
Rookie: every 2-3 days
Caution: daily if high market influence, otherwise weekly
```

**Content states:**

```text
new
candidate
auto_included
needs_review
rejected
analyzed
archived
```

**Autonomy rule:** Auto-include content when investment relevance and extraction confidence pass thresholds.

**Human intervention only if:**

- content relevance is 45-70 range
- content mentions assets but stance is unclear
- transcript unavailable but title is highly investment-relevant
- new source/panel with no history

---

### Loop C: Extraction Loop

**Purpose:** Convert content into structured investment picks.

**Extracted objects:**

- assets/tickers
- themes/sectors
- contributor/panel name
- stance
- quote/evidence
- timestamp
- confidence
- ambiguity flags

```text
InvestmentPick
- contentItemId
- sourceId
- contributorId
- assetId
- ticker
- stance
- horizon
- confidence
- quote
- evidenceType
- humanStatus
```

**Autonomy rule:** Approve when confidence is high and entity mapping is stable.

**Human intervention only if:**

- asset mapping uncertain
- recommendation vs casual mention unclear
- conflicting quotes in same content
- panel identity uncertain
- detected hype/sponsor conflict

---

### Loop D: Price/Performance Loop

**Purpose:** Evaluate picks against market data.

**Data:** Daily OHLC candles, split-adjusted where possible.

**Performance horizons:**

- 1D
- 1W
- 1M
- 3M
- max gain after mention
- max drawdown after mention
- benchmark-adjusted return

**Autonomy rule:** Recalculate after every market close.

```text
PickPerformance
- pickId
- recClose
- latestClose
- return1w
- return1m
- return3m
- maxGain
- maxDrawdown
- benchmarkReturn
- excessReturn
- state: good | flat | miss | pending
```

---

### Loop E: League Scoring Loop

**Purpose:** Rank sources and contributors mathematically.

**Daily evaluation:** Same active algorithm, updated data.

**Score components:**

```text
Performance
Reliability
Clarity
Sample size
Recency
Risk
Curation quality for channels
```

**Outputs:**

```text
LeagueScoreResult
- entityType: source | contributor
- entityId
- algorithmVersion
- leagueScore
- rankScore
- league
- scoreBreakdown
- promotionStatus
- evaluatedAt
```

**Autonomy rule:** Update scores daily. Do not immediately promote/demote unless hysteresis rules pass.

---

### Loop F: Promotion/Demotion Loop

**Purpose:** Move channels/panels through Rookie, Minor, Major, Ace, Caution.

**Leagues:**

```text
Rookie
Minor
Major
Ace
Caution Watch
```

**Rules:**

- Promotion requires 2 consecutive evaluations meeting criteria.
- Demotion requires 2 consecutive evaluations failing criteria.
- Immediate Caution is allowed for severe risk.
- Low-sample entities cannot skip directly to Major/Ace.

**Human intervention only if:**

- promotion affects product visibility materially
- entity jumps more than one league
- severe Caution event is detected
- algorithm version changed and many entities move at once

---

### Loop G: Review Escalation Loop

**Purpose:** Keep human workload small by only escalating high-value uncertainty.

**Review priority formula:**

```text
reviewPriority =
  impactScore * 0.35
+ uncertaintyScore * 0.30
+ entityImportanceScore * 0.20
+ freshnessScore * 0.10
+ userDemandScore * 0.05
```

**High priority examples:**

- Major/Ace panel made unclear call on high-market-cap asset
- conflicting stance on same asset
- low-confidence extraction with large audience reach
- promotion/demotion decision near threshold
- chart overlay marker with uncertain timestamp/price

**Human actions:**

- approve
- reject
- correct asset
- correct contributor
- correct stance
- mark as theme-only
- mark sponsor/conflict
- escalate algorithm issue

---

### Loop H: Asset Chart Overlay Loop

**Purpose:** Show investment picks on daily stock charts.

**Chart layers:**

- source layer
- contributor layer
- league layer
- stance layer
- confidence layer
- performance layer

**Marker model:**

```text
PickMarker
- assetId
- ticker
- date
- price
- sourceId
- contributorId
- stance
- leagueAtMention
- confidence
- returnSinceMention
- tooltip
```

**Autonomy rule:** All approved/high-confidence picks become chart markers automatically.

**Human intervention only if:**

- ticker mapping uncertain
- mention date ambiguous
- recommendation price missing
- multiple assets with same Korean name

---

### Loop I: Algorithm Calibration Loop

**Purpose:** Improve ranking rules without breaking trust.

**Daily:** Evaluate entities using active algorithm.

**Weekly:** Generate calibration report.

**Monthly:** Consider algorithm version update.

**Algorithm lifecycle:**

```text
active -> candidate -> shadow mode -> backtest -> review -> active
```

**Required records:**

```text
AlgorithmConfig
AlgorithmBacktestRun
AlgorithmChangeLog
LeagueScoreHistory
```

**Autonomy rule:** The system can recommend config changes, but active algorithm promotion requires explicit approval in early versions.

---

## 3. Human-Minimized Operating Model

Humans should not operate the system manually. Humans should act as exception handlers.

### Human touches allowed

1. Approve/reject uncertain source candidates.
2. Correct ambiguous investment picks.
3. Resolve contributor identity conflicts.
4. Approve major league movement if high-impact.
5. Approve active algorithm version changes.
6. Review severe Caution flags.

### Human touches avoided

1. Manually adding every channel.
2. Manually filtering every video.
3. Manually calculating returns.
4. Manually ranking channels/panels.
5. Manually updating charts.
6. Manually recalculating leagues.

---

## 4. Automation Decision Matrix

```text
High confidence + low risk      -> auto-approve
High confidence + high impact    -> auto-approve + notify
Medium confidence + high impact  -> human review
Low confidence + low impact      -> defer or archive
Low confidence + high risk       -> human review / caution
Severe risk flag                 -> immediate caution + human review
```

---

## 5. MVP Implementation Sequence

### Phase 1: League OS Foundation

- Add versioned league scoring config.
- Add score calculation utility.
- Add unit tests.
- Add channel/contributor metric fixtures.
- Add League Overview.
- Add Channel League cards.
- Add Panel League cards.
- Add Promotion/Demotion cards.
- Add Algorithm Monitor placeholder.

### Phase 2: New Content Queue

- Add source/content candidate model.
- Add investment relevance score.
- Add auto-include vs needs-review status.
- Add human approval buttons.
- Connect approved content to Candidate list.

### Phase 3: Chart Overlay

- Add asset selector.
- Add daily candle fixture.
- Add pick marker fixture.
- Render daily chart.
- Overlay source/panel pick markers.
- Add filters by league, source, contributor, stance.

### Phase 4: Real Data Ingestion

- YouTube source discovery.
- Recent video ingestion.
- Transcript collection.
- Entity extraction.
- Price data ingestion.
- Scheduled daily scoring.

### Phase 5: Calibration/Algorithm Ops

- Weekly calibration report.
- Candidate algorithm shadow mode.
- Backtest comparison.
- Algorithm change log.
- Operator approval flow.

---

## 6. Dashboard Navigation Proposal

```text
OS Overview
- system health
- new sources discovered
- new videos processed
- pending human reviews
- promotion/demotion events

League Board
- channel leagues
- panel leagues
- score breakdowns
- rank movement

Review Queue
- uncertain sources
- uncertain picks
- identity conflicts
- promotion/demotion exceptions

Asset Radar
- asset selector
- daily chart
- pick markers
- layer filters

Algorithm Monitor
- active version
- candidate version
- weekly calibration flags
- backtest summary
- score drift
```

---

## 7. Operating KPIs

### Automation KPIs

- auto-inclusion rate
- human review rate
- extraction confidence average
- review backlog age
- false approval rate
- correction rate

### Investment Intelligence KPIs

- Major vs Minor future return spread
- Ace hit rate
- Caution miss rate
- score correlation with future returns
- average pick performance by stance
- benchmark-adjusted return by league

### Product KPIs

- number of active sources
- number of tracked contributors
- number of chart markers
- daily processed content
- pending reviews
- algorithm version age

---

## 8. Guardrails

1. Never let low-sample entities become Major/Ace.
2. Caution rules override high score when risk is severe.
3. Promotions/demotions require hysteresis.
4. Algorithm changes require versioning and backtest.
5. Every score must have a breakdown.
6. Every pick marker must link to evidence.
7. Human corrections must be saved as training/evaluation signals.
8. The dashboard must show when data is sample/fallback/live.

---

## 9. Immediate Next Build

The immediate next build should implement **Phase 1: League OS Foundation**.

Files likely to modify/create:

- `app/page.jsx`
- `app/globals.css`
- `app/lib/leagueScoring.js`
- `tests/league-scoring.test.js`
- `tests/smoke.js`
- `docs/league-ranking-algorithm.md`
- `docs/plans/2026-05-05-autonomous-investment-content-os.md`

Acceptance criteria:

- UI shows League Overview.
- UI shows Channel League cards.
- UI shows Panel League cards.
- UI shows Promotion/Demotion cards.
- UI shows active algorithm version.
- Score breakdown is visible.
- Static and algorithm tests pass.
- Mobile/desktop smoke pass.
- Production deploy returns HTTP 200.
