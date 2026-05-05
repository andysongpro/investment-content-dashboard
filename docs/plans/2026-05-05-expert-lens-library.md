# Expert Lens Library for Investment Content Intelligence OS

> 목적: 앞으로 모든 기획 단계에서 `Primary lens / Second opinion / Contrarian-risk lens`를 자동으로 붙이기 위한 전문가 멘탈 모델 라이브러리.
>
> 사용법: 기능·제품·마케팅·AI·데이터·컴플라이언스 계획을 작성할 때, 해당 단계에 맞는 전문가 렌즈 2~3개를 선택해 `Expert Lens Hook` 블록에 연결한다.
>
> 주의: 이 문서는 전문가의 공개 저서·에세이·강연·인터뷰에서 널리 알려진 프레임워크를 제품 기획용으로 재구성한 것이다. 직접 인용이 필요한 경우 원문 링크/영상 확인 후 quote를 확정한다.

---

## 0. Standard Hook Template

```markdown
**Expert Lens Hook**
- Primary lens: [expert/framework] — [이 단계의 핵심 의사결정에 주는 관점]
- Second opinion: [expert/framework] — [보완/반박/다른 각도]
- Contrarian/risk lens: [expert/framework] — [과잉 확신·법적 리스크·데이터 왜곡·시장 오판]
- Decision impact: [계획, 범위, metric, UX, copy, guardrail에 실제 반영할 내용]
```

---

## 1. Product / PMF Lens

### Primary: Lenny Rachitsky

**Core philosophy**
- PMF는 감이 아니라 반복 사용, 입소문, retention, 사용자 pull로 확인되는 신호다.
- 성장은 일회성 마케팅보다 product loop와 operating cadence에서 나온다.

**Key mental models**
- PMF signal: retention, referral, willingness-to-pay, repeated pull.
- Narrow ICP: 모두가 아니라 가장 절박한 초기 세그먼트부터.
- Growth loops > one-off tactics.
- Retention before acquisition.
- Founder-led customer discovery.

**Planning questions**
- 이 기능은 사용자가 매주 돌아올 이유를 만드는가?
- 누가 이 제품이 없어지면 가장 아쉬워할까?
- 공유/리포트/채널 요청이 다음 유입을 만드는 loop인가?

**Source pointers**
- Lenny’s Newsletter / Lenny’s Podcast: PMF, growth loops, retention, B2B/B2C growth interviews.

### Second opinion: Rahul Vohra

**Core philosophy**
- PMF는 “이 제품을 더 이상 쓸 수 없다면 얼마나 실망하는가?”로 측정·개선할 수 있다.

**Key mental models**
- Superhuman PMF survey.
- Very disappointed cohort.
- High-expectation customer.
- Segment by love, not demographics.
- Roadmap from disappointed/somewhat-disappointed users.

**Planning questions**
- 어떤 사용자가 “매우 실망”할까?
- 그들이 사랑하는 기능은 무엇이고, somewhat disappointed 사용자는 무엇이 막히는가?
- 채널 요청/재방문/공유 같은 행동 신호가 있는가?

**Source pointers**
- First Round Review: “How Superhuman Built an Engine to Find Product/Market Fit”.

### Contrarian/risk: Rob Fitzpatrick

**Core philosophy**
- 사용자의 칭찬과 미래 의향은 믿기 어렵다. 과거 행동과 실제 지불/시간/노력만 믿어라.

**Key mental models**
- The Mom Test.
- Talk about their life, not your idea.
- Past behavior > future intent.
- Commitment and currency.
- Avoid compliments.

**Planning questions**
- “좋네요”가 아니라 실제 채널 요청/공유/재방문이 있었나?
- 사용자가 지금 이 문제를 해결하려고 돈·시간·수작업을 쓰고 있나?
- 아이디어 평가가 아니라 최근 실제 행동을 물었나?

**Source pointers**
- Rob Fitzpatrick, *The Mom Test*.

---

## 2. Product Strategy / Discovery Lens

### Primary: Marty Cagan

**Core philosophy**
- 제품팀의 일은 기능 납품이 아니라 value, usability, feasibility, viability 리스크를 줄이는 것이다.

**Key mental models**
- Four big risks: value, usability, feasibility, business viability.
- Discovery before delivery.
- Outcome over output.
- Empowered product team.
- Product vision and strategy.

**Planning questions**
- 이 단계의 4대 리스크는 무엇인가?
- 우리가 검증하는 것은 기술 가능성인가, 고객 가치인가?
- roadmap이 outcome 중심인가, 기능 목록인가?

**Source pointers**
- Marty Cagan, *Inspired*, *Empowered*, SVPG articles.

### Second opinion: Teresa Torres

**Core philosophy**
- Discovery는 프로젝트가 아니라 습관이다. desired outcome에서 opportunity와 solution을 분리해 탐색한다.

**Key mental models**
- Continuous Discovery.
- Opportunity Solution Tree.
- Assumption testing.
- Outcome-oriented discovery.
- Interview snapshots.

**Planning questions**
- desired outcome은 무엇인가?
- 이 기능이 해결하는 opportunity는 무엇인가?
- 가장 위험한 가정과 가장 작은 실험은 무엇인가?

**Source pointers**
- Teresa Torres, *Continuous Discovery Habits*, Product Talk.

### Second opinion: Shreyas Doshi / Julie Zhuo

**Core philosophy**
- 제품 판단은 기능의 멋짐이 아니라 사용자 경험, 전략 적합성, decision quality에서 나온다.

**Planning questions**
- 첫 방문자가 10초 안에 가치를 이해하는가?
- 이 기능은 core loop 강화인가, nice-to-have인가?
- 리그 점수와 알고리즘 설명이 너무 복잡하지 않은가?

---

## 3. Growth / Product-Led Growth Lens

### Primary: Brian Balfour / Reforge

**Core philosophy**
- 성장은 funnel보다 loop다. 사용자의 행동이 다음 사용자·콘텐츠·데이터·가치를 생성해야 한다.

**Key mental models**
- Growth loop > funnel.
- Four fits: Market-Product, Product-Channel, Channel-Model, Model-Market.
- Product-channel fit.
- Retention is the floor.
- Output reinvested as next input.

**Planning questions**
- 이 기능의 growth loop는 무엇인가?
- 사용자의 어떤 행동이 다음 사용자를 데려오는가?
- 주간 리포트/공유 카드/채널 요청이 루프로 연결되는가?

**Source pointers**
- Reforge essays: “Growth Loops”, “Four Fits”, “Product Channel Fit”.

### Second opinion: Andrew Chen

**Core philosophy**
- 네트워크 제품은 atomic network에서 시작하고, 채널 효율은 시간이 지나면 감소한다.

**Key mental models**
- Cold Start Problem.
- Atomic network.
- Network effects.
- Growth accounting.
- Law of Shitty Clickthroughs.

**Planning questions**
- 초기 atomic network는 누구인가? AI반도체 투자자? 특정 유튜브 채널 팬덤? 커뮤니티 운영자?
- 사용자 수가 늘수록 데이터/랭킹/채널 요청 가치가 실제로 증가하는가?

**Source pointers**
- Andrew Chen, *The Cold Start Problem*, “Law of Shitty Clickthroughs”.

### Second opinion: Casey Winters / Elena Verna

**Planning questions**
- activation moment는 무엇인가? 채널 요청? 리포트 복사? 종목 timeline 확인?
- SEO surface는 무엇인가? `/asset`, `/channel`, `/panel`, `/report/weekly`가 검색 유입을 만들 수 있는가?

### Contrarian/risk: Rand Fishkin

**Core philosophy**
- 플랫폼 유입에만 의존하면 위험하다. zero-click 환경에서도 브랜드와 audience를 만들어야 한다.

**Planning questions**
- 공유 카드가 클릭 없이 소비되어도 브랜드 자산을 남기는가?
- 검색/X/유튜브 알고리즘 변화에 과의존하지 않는가?

---

## 4. Viral / Social Product Lens

### Primary: Nikita Bier

**Core philosophy**
- consumer social은 utility보다 social emotion, curiosity, status, invite loop에서 터진다.

**Key mental models**
- Social emotion > utility.
- Invite loop with personal reason.
- Notification as social event.
- Frictionless onboarding.
- Fast iteration of hooks.

**Planning questions**
- 사용자가 공유하면 무엇을 얻는가? 자랑, 논쟁, 발견, 소속, 지위?
- 채널 분석 요청은 타인을 초대할 개인적 이유가 있는가?
- 알림이 단순 정보인가, 사회적 사건인가?

**Source pointers**
- Nikita Bier interviews on TBH/Gas and consumer social mechanics.

### Second opinion: Eugene Wei

**Core philosophy**
- 소셜 제품은 status as a service다. 사람은 utility뿐 아니라 social capital을 얻기 위해 참여한다.

**Key mental models**
- Status as a Service.
- Social capital accumulation.
- Proof of work.
- Status ladder.
- Utility vs status.

**Planning questions**
- 사용자가 이 서비스에서 얻는 지위는 무엇인가?
- “내가 먼저 좋은 패널을 찾았다”, “내 채널이 Major다” 같은 status asset이 있는가?
- 단순 수익률 경쟁이 위험한 행동을 유도하지 않는가?

**Source pointers**
- Eugene Wei, “Status as a Service”.

### Contrarian/risk: Zeynep Tufekci

**Core philosophy**
- 소셜 확산은 misinformation, polarization, amplification harm을 만들 수 있다.

**Planning questions**
- 패널 랭킹이 팬덤 싸움이나 허위 확산을 키우지 않는가?
- 논쟁을 만들되 비난/저격으로 흐르지 않게 guardrail이 있는가?

---

## 5. Positioning / Strategic Narrative Lens

### Primary: April Dunford

**Core philosophy**
- 포지셔닝은 고객의 머릿속 비교 맥락을 설계하는 일이다.

**Key mental models**
- Competitive alternatives.
- Unique attributes → value → best-fit customer.
- Market category selection.
- Context setting.
- Best-fit customers.

**Planning questions**
- 고객은 우리 대신 지금 무엇을 쓰는가? 유튜브 메모, 엑셀, X, 블로그, ChatGPT?
- 우리가 이기는 비교 프레임은 무엇인가?
- “AI 투자 추천”이 아니라 “공개 투자 발언 검증 OS”로 이해되는가?

**Source pointers**
- April Dunford, *Obviously Awesome*, *Sales Pitch*.

### Second opinion: Andy Raskin

**Core philosophy**
- 좋은 전략 내러티브는 제품이 아니라 세상의 변화, old game vs new game, promised land를 말한다.

**Key mental models**
- Strategic narrative.
- Old game vs new game.
- Name the enemy.
- Promised land.
- Product as magic gift.

**Planning questions**
- 시장에서 어떤 변화가 일어나고 있는가?
- 낡은 방식은 왜 실패하는가?
- 고객이 도달할 promised land는 무엇인가?

**Source pointers**
- Andy Raskin, “The Greatest Sales Deck I’ve Ever Seen”.

### Contrarian/risk: Ries & Trout

**Core philosophy**
- 초기 포지셔닝은 단순해야 한다. 너무 거창한 카테고리 언어는 고객 머리에 남지 않는다.

**Planning questions**
- “Investment Content Intelligence OS”보다 “투자 유튜브 추천 검증”이 더 잘 먹히는 단계인가?
- 한 단어/한 문장으로 기억되는가?

---

## 6. Messaging / Offer Lens

### Primary: Alex Hormozi

**Core philosophy**
- 좋은 오퍼는 명확한 고통, 강한 결과, 낮은 노력, 높은 신뢰를 압축한다.

**Planning questions**
- 카피가 “누가 언제 어떤 종목을 말했고, 이후 어떻게 됐는지 보여준다”처럼 즉시 이해되는가?
- 수익 보장/매수 추천처럼 오해될 표현은 없는가?

### Second opinion: Joanna Wiebe

**Core philosophy**
- 전환 카피는 고객의 실제 언어에서 나온다.

**Planning questions**
- 사용자가 실제로 말하는 pain 문장인가?
- “영상은 많은데 누가 맞췄는지 모르겠다” 같은 VOC가 반영됐는가?

### Contrarian/risk: Bob Hoffman

**Planning questions**
- 성장 해킹 문구가 신뢰 브랜드를 훼손하지 않는가?
- 과장/선동형 카피가 투자 규제 리스크를 만들지 않는가?

---

## 7. AI / Agent OS Lens

### Primary: Andrew Ng

**Core philosophy**
- AI 성능 개선의 핵심은 모델보다 데이터 품질, 라벨 일관성, 운영 workflow다.

**Key mental models**
- Data-centric AI.
- AI Transformation Playbook.
- Small win → repeatable platform → scaling.
- Human-in-the-loop.
- Error bucket iteration.

**Planning questions**
- 문제는 모델 성능인가, 라벨/데이터 정의 문제인가?
- top error bucket은 무엇인가?
- 사람이 수정한 결과가 다음 추출/랭킹 개선에 들어가는가?

**Source pointers**
- Andrew Ng, AI Transformation Playbook, Data-centric AI talks, DeepLearning.AI.

### Second opinion: Chip Huyen

**Core philosophy**
- ML 시스템은 배포 후 시작된다. eval, drift, feedback loop가 핵심이다.

**Key mental models**
- Evaluation is bottleneck.
- Data distribution shift.
- Feedback loops.
- Production ML monitoring.
- LLMOps/evals.

**Planning questions**
- offline eval, human eval, production metric이 연결되는가?
- 시장 국면 변화로 extraction/ranking drift가 생기면 어떻게 감지하는가?
- LLM judge와 human judge가 다를 때 무엇을 우선하는가?

**Source pointers**
- Chip Huyen, *Designing Machine Learning Systems*, blog on LLM evaluation.

### Second opinion: Harrison Chase

**Planning questions**
- 수집/추출/리뷰/마케팅 에이전트가 tool boundary와 audit log를 갖고 분리됐는가?
- agent가 실패할 때 사람이 개입할 경로가 있는가?

### Contrarian/risk: Gary Marcus

**Core philosophy**
- AI 환각과 추론 한계를 기본값으로 가정하고, 검증 가능한 근거와 guardrail을 둬야 한다.

**Planning questions**
- 모든 투자픽에 evidence quote, source URL, confidence, human status가 있는가?
- AI가 추천 발언을 잘못 추출했을 때 피해를 어떻게 막는가?

---

## 8. Data / Experimentation Lens

### Primary: Ronny Kohavi

**Core philosophy**
- 신뢰 가능한 온라인 실험은 직관보다 강하다. 단, metric과 실험 인프라 자체도 검증해야 한다.

**Key mental models**
- OEC: Overall Evaluation Criterion.
- Guardrail metrics.
- A/A test.
- Twyman’s Law.
- Trustworthy controlled experiments.

**Planning questions**
- 실험의 OEC는 무엇인가?
- guardrail은 compliance, complaint, misinformation, churn을 포함하는가?
- 너무 큰 uplift를 먼저 버그로 의심했는가?

**Source pointers**
- Kohavi et al., *Trustworthy Online Controlled Experiments*.

### Second opinion: Benn Stancil / C. Thi Nguyen

**Planning questions**
- 지금 필요한 것은 Big Data인가, Good Data인가?
- leagueScore가 측정 가능한 것만 과대평가하지 않는가?
- metric이 사용자 행동을 gaming하게 만들지 않는가?

### Contrarian/risk: Nassim Taleb

**Core philosophy**
- 평균과 정규분포에 속지 말고, fat tail, black swan, antifragility를 고려해야 한다.

**Planning questions**
- rare but catastrophic failure mode는 무엇인가?
- 단기 성과를 실력으로 과대해석하지 않는가?
- 시스템이 충격에서 학습하고 강해지는가?

**Source pointers**
- Taleb, *The Black Swan*, *Antifragile*, *Fooled by Randomness*, *Skin in the Game*.

---

## 9. Finance / Ranking Algorithm Lens

### Primary: Michael Mauboussin

**Core philosophy**
- 투자 성과는 skill과 luck의 혼합이다. 결과보다 process quality, base rate, mean reversion을 봐야 한다.

**Key mental models**
- Skill-luck continuum.
- Base rates.
- Process over outcome.
- Reversion to the mean.
- Decision quality.

**Planning questions**
- 이 패널의 성과는 skill인가 luck인가?
- 표본 수와 confidence interval을 표시하는가?
- 좋은 결과와 좋은 판단 과정을 분리하는가?

**Source pointers**
- Mauboussin, *The Success Equation*, *Think Twice*.

### Second opinion: Howard Marks / Aswath Damodaran

**Planning questions**
- 시장 국면별로 성과를 보정하는가?
- narrative와 numbers를 같이 보여주는가?
- 리스크를 수익률만큼 중요하게 표시하는가?

### Contrarian/risk: Eugene Fama

**Core philosophy**
- 공개 정보는 빠르게 가격에 반영된다. 단기 성과를 alpha로 해석하는 데 매우 조심해야 한다.

**Planning questions**
- 추천 후 성과는 factor exposure인가 genuine edge인가?
- transaction cost와 implementation shortfall을 고려하는가?
- “예측력”이 아니라 “공개 발언의 사후 성과 추적”으로 겸손하게 표현하는가?

**Source pointers**
- Fama, Efficient Markets papers; Fama-French factor model papers.

---

## 10. Trust / Compliance / Responsible AI Lens

### Primary: 금융 규제·컴플라이언스 전문가

**Core philosophy**
- 이 서비스는 투자 판단을 대신하는 것이 아니라 공개 콘텐츠 발언을 추적·검증하는 도구로 포지셔닝해야 한다.

**Planning questions**
- 매수/매도 추천처럼 보이는 표현이 있는가?
- 유사투자자문/투자자문 경계선을 넘지 않는가?
- 인용/저작권/명예훼손 리스크가 관리되는가?

### Second opinion: Kathy Baxter

**Core philosophy**
- responsible AI는 추상 원칙이 아니라 transparency, control, appropriate reliance를 제품에 구현하는 것이다.

**Planning questions**
- 사용자가 AI 결과를 과신하지 않게 confidence와 evidence를 보여주는가?
- 오류 신고/수정 loop가 있는가?
- human review status가 표시되는가?

**Source pointers**
- Salesforce Responsible AI / Trusted Generative AI resources by Kathy Baxter.

### Second opinion: Rumman Chowdhury

**Core philosophy**
- 알고리즘은 사회기술 시스템이다. red teaming, audit, harm taxonomy, governance가 필요하다.

**Planning questions**
- 누가 이 시스템으로 피해를 볼 수 있는가?
- 악의적 사용자가 랭킹을 어떻게 조작할 수 있는가?
- red-team 결과가 roadmap에 반영되는가?

### Contrarian/risk: Cory Doctorow

**Planning questions**
- 공개 콘텐츠 검증이 과도한 감시/평판 시스템으로 보이지 않게 하려면?
- 사용자와 크리에이터의 권리를 어떻게 존중하는가?

---

## 11. Community / Media / Creator Ops Lens

### Primary: Greg Isenberg

**Core philosophy**
- 커뮤니티와 distribution은 제품 이후가 아니라 제품의 일부다. niche community에서 시작해 product를 만든다.

**Planning questions**
- 투자 콘텐츠 검증 커뮤니티가 먼저 생길 수 있는가?
- 주간 리포트가 커뮤니티 운영자의 반복 콘텐츠가 되는가?

### Second opinion: Li Jin / Ben Thompson

**Planning questions**
- 투자 콘텐츠 큐레이터가 이 서비스를 자기 도구로 쓸 수 있는가?
- 이 서비스는 콘텐츠를 aggregate하는가, 신뢰도 평가 layer인가?
- 독립 미디어/리서치 브랜드로 확장 가능한가?

### Creator ops: Gary Vaynerchuk / Colin & Samir / MrBeast packaging lens

**Planning questions**
- 한 리포트를 X thread, Shorts, Instagram carousel, blog, Telegram summary로 재가공하는가?
- 숏폼 첫 2초 hook은 충분히 강한가?
- 투자 유튜버를 적대하지 않고 신뢰도 증명 도구로 포지셔닝할 수 있는가?

### Contrarian/risk: Hank Green / Ezra Klein

**Planning questions**
- 숏폼이 과도한 단순화와 오해를 만들지 않는가?
- 패널 랭킹이 팬덤 논쟁을 악화시키지 않는가?

---

## 12. Recommended Hook Presets by Planning Phase

### A. PMF Test Plan

```markdown
**Expert Lens Hook**
- Primary lens: Lenny Rachitsky — weekly retention과 PMF pull을 기준으로 설계
- Second opinion: Rahul Vohra — very disappointed cohort를 찾는 survey 구조
- Contrarian/risk lens: Rob Fitzpatrick — 칭찬이 아니라 실제 채널 요청·재방문·공유 행동 확인
- Decision impact: 지표를 방문 수가 아니라 채널 요청, 리포트 재방문, 공유, 구체 피드백으로 둔다.
```

### B. League Ranking Algorithm

```markdown
**Expert Lens Hook**
- Primary lens: Michael Mauboussin — skill과 luck, base rate, process quality 분리
- Second opinion: Ronny Kohavi — OEC, guardrail, 실험 설계
- Contrarian/risk lens: Taleb + Fama — 단기 성과/공개정보 기반 alpha 과대해석 방지
- Decision impact: 표본 수 보정, confidence, algorithmVersion, 리그 점수의 겸손한 표현을 필수화한다.
```

### C. AI Extraction / Human Review

```markdown
**Expert Lens Hook**
- Primary lens: Andrew Ng — data-centric AI와 error bucket 개선
- Second opinion: Chip Huyen — eval, drift, production monitoring
- Contrarian/risk lens: Gary Marcus + Rumman Chowdhury — hallucination, 조작, harm scenario
- Decision impact: 모든 투자픽에 source URL, quote, confidence, humanStatus, audit log를 붙인다.
```

### D. Viral / Social Growth

```markdown
**Expert Lens Hook**
- Primary lens: Brian Balfour/Reforge — product-led growth loop
- Second opinion: Nikita Bier + Eugene Wei — 공유 이유, status asset, invite loop
- Contrarian/risk lens: Zeynep Tufekci + compliance — 논쟁 증폭, 허위확산, 비방 리스크
- Decision impact: 공유 카드는 evidence-backed, 중립 표현, 면책 문구, 원본 링크를 포함한다.
```

### E. Positioning / Landing Page

```markdown
**Expert Lens Hook**
- Primary lens: April Dunford — competitive alternatives와 best-fit customer
- Second opinion: Andy Raskin — old game vs new game strategic narrative
- Contrarian/risk lens: Ries & Trout — 너무 복잡한 카테고리 언어 방지
- Decision impact: 초기 카피는 “투자 유튜브 추천, 차트 위에서 검증”처럼 직관적으로 쓰고, 하위 설명에서 OS 비전을 제시한다.
```

### F. Weekly Report / Media Operation

```markdown
**Expert Lens Hook**
- Primary lens: Greg Isenberg — community-led product와 distribution-first media
- Second opinion: Gary Vaynerchuk / Colin & Samir — 멀티채널 콘텐츠 repurposing
- Contrarian/risk lens: Hank Green + compliance — 과도한 단순화와 투자 조언 오해 방지
- Decision impact: 주간 리포트는 커뮤니티용 요약, X thread, 블로그, Shorts script를 같이 생산하되 근거와 면책을 유지한다.
```

---

## 13. Source Verification Backlog

직접 인용이나 랜딩페이지 quote에 쓰기 전에 아래 원문/영상 확인 필요.

- Lenny Rachitsky: PMF/growth loop 관련 newsletter/podcast 원문.
- Rahul Vohra: First Round Review Superhuman PMF engine.
- Marty Cagan: *Inspired*, *Empowered*, SVPG articles.
- Teresa Torres: *Continuous Discovery Habits*, Opportunity Solution Tree 자료.
- Rob Fitzpatrick: *The Mom Test*.
- Brian Balfour/Reforge: Growth Loops, Four Fits, Product-Channel Fit essays.
- Andrew Chen: *The Cold Start Problem*, Law of Shitty Clickthroughs.
- Nikita Bier: TBH/Gas 인터뷰, consumer social threads.
- Eugene Wei: “Status as a Service”.
- April Dunford: *Obviously Awesome*, *Sales Pitch*.
- Andy Raskin: “The Greatest Sales Deck I’ve Ever Seen”.
- Andrew Ng: AI Transformation Playbook, Data-centric AI talks.
- Chip Huyen: *Designing Machine Learning Systems*, LLM eval posts.
- Ronny Kohavi: *Trustworthy Online Controlled Experiments*.
- Michael Mauboussin: *The Success Equation*, skill vs luck papers.
- Taleb: *The Black Swan*, *Antifragile*, *Fooled by Randomness*.
- Eugene Fama: Efficient Markets papers, Fama-French factor model papers.
- Kathy Baxter / Rumman Chowdhury: responsible AI, AI audit/red-teaming resources.
