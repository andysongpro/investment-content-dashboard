# PMF Test Initial Version & Operations Plan

> **For Hermes:** Use this as the execution blueprint for the PMF-focused version of the investment content intelligence OS.

**Goal:** Build the smallest credible product that tests whether target users care enough about investment-content verification to request channels, revisit reports, and share results.

**Architecture:** Combine a public-facing report/dashboard, league-scoring foundation, channel request loop, weekly report loop, and lightweight human-in-the-loop review. Delay full automation until PMF signals are visible.

**Tech Stack:** Next.js/Vercel static dashboard, fixture-first data model, league scoring utility, public report pages, lightweight form capture, weekly manual/agent-generated reports, browser QA.

---

## 1. PMF Hypothesis

Target users will care if the service can answer:

1. Who said what investment pick?
2. When did they say it?
3. What was the stock price then?
4. What happened afterward?
5. Which channels/panels are consistently useful?
6. Can I request the channels I watch?
7. Can I share a report that other investors find interesting?

Primary PMF statement:

> Active retail investors who consume investment YouTube content will repeatedly use and share a tool that tracks public investment recommendations, evaluates outcomes, and ranks channels/panels by evidence-backed performance.

---

## 2. PMF Success Metrics

### Activation

- Visitor clicks at least one report/card/filter.
- Visitor views at least one channel, panel, or asset detail.
- Visitor submits a channel request.
- Visitor clicks share/copy report link.

### Retention

- Same user returns within 7 days.
- Weekly report page gets repeat visits.
- Users request more than one channel/asset.

### Virality

- Shared report links create new visits.
- Community posts produce comments/replies.
- Users ask, “Can you add this channel?”

### Willingness-to-pay proxy

- Users ask for alerts.
- Users ask for private watchlists.
- Users ask for more channels.
- Users ask for real-time updates.
- Users ask for paid/pro features before pricing exists.

---

## 3. Initial Version Scope

### Must Build

1. Public landing/overview with clear positioning.
2. League ranking algorithm v0.1.
3. Channel League cards.
4. Panel League cards.
5. Weekly Investment Content Report page.
6. Asset Recommendation Timeline page/card.
7. Channel Request form/page.
8. Shareable report/card copy.
9. Review Queue placeholder.
10. Algorithm Monitor placeholder.

### Must Not Build Yet

1. Full YouTube automation.
2. Full transcript extraction pipeline.
3. Real login system.
4. Payments.
5. Complex database admin.
6. Real-time chart infrastructure.
7. Fully automated algorithm update workflow.

---

## 4. User Journeys to Test

### Journey A: Investor sees shared report

```text
Community/X/Telegram link
  -> Weekly report page
  -> sees top mentioned stocks and channel/panel scores
  -> clicks asset timeline
  -> requests another channel
  -> returns next week
```

### Journey B: Investor searches for trusted panel/channel

```text
Landing page
  -> Channel League / Panel League
  -> score breakdown
  -> sees evidence-backed picks
  -> shares card or asks for another channel
```

### Journey C: User wants a channel added

```text
Channel Request page
  -> enters YouTube URL
  -> sees Rookie candidate status
  -> gets share prompt
  -> request count/priority increases later
```

### Journey D: Community operator wants content

```text
Weekly report page
  -> copy Telegram/community summary
  -> shares to group
  -> audience asks for more sources
```

---

## 5. PMF Build Phases

### Phase 0: Algorithm & Narrative Lock

Deliverables:

- `docs/league-ranking-algorithm.md`
- `app/lib/leagueScoring.js`
- `tests/league-scoring.test.js`
- clear score breakdown in UI

Acceptance:

- Unit tests prove ranking edge cases.
- UI explains why an entity is Rookie/Minor/Major/Ace/Caution.

### Phase 1: Public League Dashboard

Deliverables:

- League Overview
- Channel League cards
- Panel League cards
- Promotion/Demotion cards
- Algorithm version badge

Acceptance:

- User can understand the league system in under 30 seconds.
- Mobile/desktop screenshots are clean.

### Phase 2: Shareable Report MVP

Deliverables:

- `/report/weekly` or equivalent section
- top mentioned assets
- top themes
- Good/Flat/Miss picks
- promotion candidates
- copy/share text block

Acceptance:

- A user can copy a useful community post from the page.
- The report stands alone without explanation.

### Phase 3: Asset Timeline MVP

Deliverables:

- asset selector
- timeline of picks by date
- recommended close/current return
- channel/panel/league markers
- shareable summary

Acceptance:

- User can answer: “Who mentioned this stock, when, and what happened after?”

### Phase 4: Channel Request Loop

Deliverables:

- request form
- requested channel list
- Rookie candidate status
- share prompt

Acceptance:

- Users can request channels without account creation.
- Each request can become a PMF signal.

### Phase 5: Lightweight Ops Loop

Deliverables:

- weekly report production checklist
- social posting templates
- feedback log
- PMF metrics dashboard placeholder

Acceptance:

- One operator/agent can run weekly cycle in under 2 hours until automation arrives.

---

## 6. Data Strategy for PMF

Use fixture/semi-manual data first, but be transparent:

- Label as sample, pilot, or manually verified data.
- Use a small set of channels: 김작가 TV, 신사임당, plus 1-3 requested channels.
- Use 10-30 representative picks.
- Prioritize high-quality evidence over data volume.

Data fields required:

```text
source/channel
content title
content URL
published date
contributor/panel
asset/ticker/theme
stance
quote/evidence
recommendation date
recommendation close
latest close
return
status: auto | human_verified | sample
```

---

## 7. Operating Cadence

### Daily, 15-30 min

- Check site is alive.
- Check channel requests.
- Log new user feedback.
- Capture interesting content examples.

### Twice Weekly, 45-60 min

- Add/update sample picks.
- Update score fixtures.
- Generate 1-2 social posts.
- Review comments/replies.

### Weekly, 90-120 min

- Publish weekly report.
- Post to X/blog/community/Telegram draft.
- Review PMF metrics.
- Decide next channel/source to add.
- Produce learnings.

### Monthly

- Review algorithm calibration.
- Decide whether to change scoring config.
- Update roadmap based on user behavior.

---

## 8. PMF Test Channels

Initial channels to use:

1. X/Twitter build-in-public + insight posts.
2. Blog post explaining methodology.
3. Telegram/community-ready weekly summary.
4. Direct outreach to investment-content heavy users.
5. Channel-request sharing loop.

Avoid paid ads until:

- users share reports organically,
- channel requests happen repeatedly,
- weekly report has repeat visitors.

---

## 9. PMF Decision Gates

### After 2 weeks

Continue if:

- at least 10 meaningful feedback items,
- at least 5 channel requests,
- at least 3 users ask for more data or specific channels.

Pivot messaging if:

- people like concept but do not click reports,
- people do not understand league scoring,
- people think it is stock recommendation rather than content verification.

### After 4 weeks

PMF weak signal if:

- 50+ channel/asset requests total,
- 20%+ report visitors click deeper section,
- users share screenshots/links without being asked,
- at least 3 repeat users/communities ask for weekly updates.

### After 8 weeks

PMF stronger signal if:

- weekly report has repeat audience,
- requested channels shape roadmap,
- users ask for alerts/watchlists/export,
- users ask for paid/private version.

---

## 10. Risks & Guardrails

### Legal/positioning risk

Do not market as investment advice.

Use:

- public content tracking
- recommendation outcome analysis
- educational/reference data
- not investment advice

### Defamation/reputation risk

Do not say “wrong/fraud/scam” casually.

Use:

- public-claim performance
- Good/Flat/Miss by rule
- evidence-backed quote/date/price

### Data quality risk

Always show:

- sample/live/manual status
- evidence link
- confidence
- human verification status

### Overbuilding risk

Do not automate before users prove they want the output.

---

## 11. Immediate Implementation Tasks

1. Add league scoring algorithm and tests.
2. Add league dashboard UI.
3. Add weekly report section/page.
4. Add asset timeline section/page.
5. Add channel request section/page.
6. Add share/copy blocks.
7. Add PMF metrics placeholders.
8. Deploy and verify production.
9. Start 30-day PMF content/feedback cycle.

---

## 12. Final PMF Test Question

The PMF test is not “can we build this?”

The real PMF test is:

> When users see evidence-backed investment-content performance reports, do they request more sources, revisit weekly, and share the results with other investors?
