# Expert Lens Hook Integration Guide

> 목적: `expert-lens-library.md`를 실제 제품/마케팅/운영 계획 문서에 연결하는 방법.

## Canonical Expert Lens Library

- Main library: `docs/plans/2026-05-05-expert-lens-library.md`
- OS blueprint: `docs/plans/2026-05-05-autonomous-investment-content-os.md`
- PMF plan: `docs/plans/2026-05-05-pmf-test-initial-version-ops-plan.md`

## Rule

모든 주요 planning 문서의 각 phase/task에는 아래 hook을 붙인다.

```markdown
**Expert Lens Hook**
- Primary lens:
- Second opinion:
- Contrarian/risk lens:
- Decision impact:
```

## Default Presets

### PMF / 초기 버전

- Primary: Lenny Rachitsky
- Second: Rahul Vohra
- Contrarian: Rob Fitzpatrick
- Decision impact: 방문 수보다 채널 요청, 리포트 재방문, 공유, 구체 피드백을 PMF 지표로 둔다.

### League Ranking Algorithm

- Primary: Michael Mauboussin
- Second: Ronny Kohavi
- Contrarian: Taleb + Eugene Fama
- Decision impact: 표본 수 보정, confidence, algorithmVersion, score breakdown, 겸손한 표현 필수.

### AI Extraction / Human Review

- Primary: Andrew Ng
- Second: Chip Huyen
- Contrarian: Gary Marcus + Rumman Chowdhury
- Decision impact: source URL, quote, confidence, humanStatus, audit log, red-team scenario 필수.

### Viral / Social Growth

- Primary: Brian Balfour/Reforge
- Second: Nikita Bier + Eugene Wei
- Contrarian: Zeynep Tufekci + compliance
- Decision impact: 공유 카드는 evidence-backed, 중립 표현, 면책 문구, 원본 링크를 포함한다.

### Positioning / Landing

- Primary: April Dunford
- Second: Andy Raskin
- Contrarian: Ries & Trout
- Decision impact: 초기 카피는 직관적으로, 하위 설명에서 OS 비전을 제시한다.

### Weekly Report / Media Ops

- Primary: Greg Isenberg
- Second: Gary Vaynerchuk / Colin & Samir
- Contrarian: Hank Green + compliance
- Decision impact: 주간 리포트를 X thread, blog, Shorts, Telegram summary로 재가공하되 근거/면책 유지.

## Planning Workflow

1. Plan phase를 정의한다.
2. phase의 의사결정 성격을 분류한다.
   - PMF
   - Product strategy
   - Growth/viral
   - AI/data
   - Ranking/finance
   - Trust/compliance
   - Media/community
3. `expert-lens-library.md`에서 적절한 primary/second/contrarian lens를 선택한다.
4. hook의 `Decision impact`를 빈 말이 아니라 실제 scope/metric/UX/copy/guardrail 변경으로 쓴다.
5. 구현 후 테스트/QA 항목에도 hook에서 나온 guardrail을 반영한다.

## Example

```markdown
### Phase 1: League OS Foundation

**Goal**
채널/패널 리그 점수를 계산하고 설명 가능한 카드 UI로 보여준다.

**Expert Lens Hook**
- Primary lens: Michael Mauboussin — 추천 성과에서 skill과 luck을 구분하고 base rate를 반영한다.
- Second opinion: Ronny Kohavi — score metric과 guardrail metric을 사전에 정의한다.
- Contrarian/risk lens: Taleb + Fama — 단기 성과를 미래 alpha로 과대해석하지 않는다.
- Decision impact: 리그 카드에는 pickCount, confidence, algorithmVersion, score breakdown, 투자 권유 아님 문구를 포함한다.
```
