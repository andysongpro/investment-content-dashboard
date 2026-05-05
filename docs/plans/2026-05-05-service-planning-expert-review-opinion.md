# 서비스 기획 의견서: 투자 콘텐츠 인텔리전스 OS 전문가 검증 루프

> 작성 목적: 지금까지의 대화에서 나온 서비스 기획 단계를 `Primary lens / Second opinion / Contrarian-risk lens` 3단계 전문가 검증 루프로 재검토하고, 다음 제품 방향과 실행 우선순위를 확정한다.
>
> 대상 서비스: 투자 콘텐츠 인텔리전스 OS — 공개 투자 콘텐츠 속 추천 발언을 수집·검증·성과 추적하고, 채널/패널을 리그제로 평가하며, 종목 차트 위에 투자픽 레이어를 얹는 시스템.
>
> 기준 문서: `docs/plans/2026-05-05-expert-lens-library.md`

---

## 0. Executive Summary

지금까지의 기획은 방향성이 강하다. 단순 투자 대시보드가 아니라 다음 5개 요소가 결합된 차별적 제품이다.

1. 공개 투자 콘텐츠 발언 추적
2. 추천일 종가 기준 사후 성과 검증
3. 채널/패널 리그제와 승급·강등
4. 종목별 일봉 차트 위 투자픽 레이어
5. 제품 자체가 주간 리포트/공유 카드/채널 요청을 만들어내는 product-led viral loop

전문가 검증 루프를 돌린 결론은 다음과 같다.

- **가장 강한 PMF wedge:** “투자 유튜브 추천, 누가 언제 무엇을 말했고 이후 어떻게 됐는지 검증한다.”
- **가장 먼저 만들 MVP:** League Dashboard + Weekly Report + Asset Timeline + Channel Request Loop.
- **가장 큰 리스크:** 투자 추천 서비스로 오해, 단기 성과를 실력으로 과대해석, AI 추출 오류, 팬덤/비방 논쟁, 데이터 신뢰 부족.
- **핵심 guardrail:** evidence URL, quote, 추천일 종가, 최신가, confidence, humanStatus, algorithmVersion, 면책 문구.
- **운영 철학:** 완전 자동화보다 `semi-manual verified data + agent-assisted operation`으로 PMF 신호를 먼저 검증한다.

---

## 1. 단계별 기획 검증

## Stage 1. 서비스 포지셔닝: 채널명 중심 대시보드에서 중립 OS로 전환

### 현재 기획

초기 화면은 `김작가 TV + 신사임당`처럼 특정 채널명이 서비스 타이틀에 들어갔으나, 채널이 계속 늘어날 구조이므로 중립적 타이틀 `투자 콘텐츠 인텔리전스 허브`로 전환했다.

### Expert Lens Hook

- **Primary lens: April Dunford**  
  고객은 제품을 비교 맥락 안에서 이해한다. 특정 채널명 조합을 서비스명처럼 두면 “두 채널 비교 사이트”로 오해된다.

- **Second opinion: Andy Raskin**  
  제품 이름보다 더 중요한 것은 “낡은 게임 vs 새로운 게임”이다. 낡은 게임은 투자 콘텐츠를 보고 기억에 의존하는 것, 새로운 게임은 공개 발언을 기록하고 성과로 검증하는 것이다.

- **Contrarian/risk lens: Ries & Trout**  
  `Investment Content Intelligence OS`는 장기 비전으로 좋지만 초기 고객에게 너무 추상적일 수 있다. 첫 hook은 더 직관적이어야 한다.

### 전문가 검증 의견

- 타이틀 중립화는 올바른 결정이다.
- 다만 초기 랜딩/광고 카피는 `투자 콘텐츠 인텔리전스 OS`보다 `투자 유튜브 추천, 차트 위에서 검증`이 더 강하다.
- 브랜드명과 hook을 분리해야 한다.

### Decision Impact

- 서비스명: **투자 콘텐츠 인텔리전스 허브/OS**
- 초기 hook: **투자 유튜브 추천, 이제 차트 위에서 검증하세요.**
- 설명: **투자 판단을 대신하지 않고, 공개 콘텐츠 발언과 이후 성과를 추적하는 검증 도구.**

---

## Stage 2. 다채널·시계열 확장

### 현재 기획

김작가 TV와 신사임당을 시작으로, 지난 3개월 기준 채널별 성과 비교, 월별 언급 추이, 채널 필터를 구성했다.

### Expert Lens Hook

- **Primary lens: Marty Cagan**  
  기능 확장이 아니라 고객 가치 리스크를 줄여야 한다. 다채널/시계열은 사용자가 “비교와 추적” 가치를 이해하게 만드는 핵심이다.

- **Second opinion: Teresa Torres**  
  desired outcome은 “투자 콘텐츠 소비자가 여러 채널에서 나온 투자 발언을 비교·검증할 수 있다”이다. 월별 추이는 이 outcome의 opportunity 중 하나다.

- **Contrarian/risk lens: Rob Fitzpatrick**  
  사용자가 “좋다”고 말하는 것과 실제로 채널 요청/재방문/공유하는 것은 다르다. 다채널 UI 자체보다 행동 신호를 봐야 한다.

### 전문가 검증 의견

- 다채널/시계열은 필수 방향이다.
- 하지만 단순 채널 비교만으로 PMF를 보장하지 않는다.
- 핵심은 “내가 보는 채널도 추가해달라”는 요청과 “이 리포트를 공유하고 싶다”는 행동을 만드는 것이다.

### Decision Impact

- 채널 필터는 유지.
- 다음 단계에서 반드시 `Channel Request Loop`를 붙인다.
- 월별 추이는 “분석 리포트 소재”로 재사용 가능해야 한다.

---

## Stage 3. 리그제 채널/패널 시스템

### 현재 기획

채널과 패널을 Rookie, Minor, Major, Ace, Caution 등 리그로 나누고, 자동 발견·승급·강등·인간 승인 구조를 설계했다.

### Expert Lens Hook

- **Primary lens: Michael Mauboussin**  
  성과는 skill과 luck의 혼합이다. 리그 점수는 단기 수익률만으로 매기면 안 되고 표본 수, base rate, process quality를 반영해야 한다.

- **Second opinion: Ronny Kohavi**  
  ranking metric은 사전에 정의되어야 하며 guardrail metric이 필요하다. 리그 점수 상승이 신뢰 하락이나 규제 리스크 증가를 만들면 실패다.

- **Contrarian/risk lens: Taleb + Eugene Fama**  
  공개 정보 기반 성과를 미래 알파로 과대해석하면 위험하다. fat-tail 이벤트와 평균회귀를 고려해야 한다.

### 전문가 검증 의견

- 리그제는 제품 차별화의 핵심이다.
- 다만 리그명은 게임화되지만, 계산 로직은 매우 보수적이어야 한다.
- 점수와 리그와 랭킹을 분리해야 한다.

```text
score = 현재 데이터 기준 성과/신뢰 추정치
league = 운영상 노출/검증 등급
rank = 같은 리그 내 정렬 순서
```

### Decision Impact

리그 카드에는 반드시 다음을 포함한다.

- pickCount
- hitRate
- avgReturn
- ambiguityRate
- confidence
- algorithmVersion
- score breakdown
- “공개 콘텐츠 발언 기준 / 투자 권유 아님” 문구

승급/강등에는 hysteresis를 둔다.

- 승급: 조건 2회 연속 충족
- 강등: 조건 2회 연속 악화
- 즉시 Caution: 중대한 리스크 발생 시

---

## Stage 4. 알고리즘 버전 관리와 주기적 업데이트

### 현재 기획

알고리즘을 `league-ranking-v0.1`, `v0.2-candidate`, `v0.2`처럼 버전 관리하고, Daily Evaluation, Weekly Calibration, Monthly Version Update 구조를 설계했다.

### Expert Lens Hook

- **Primary lens: Ronny Kohavi**  
  알고리즘 변경은 실험이다. OEC와 guardrail을 사전에 정의하고, 놀라운 결과는 먼저 instrumentation bug를 의심해야 한다.

- **Second opinion: Chip Huyen**  
  모델/알고리즘은 배포 후 drift가 생긴다. 시장 국면 변화, 콘텐츠 트렌드 변화, 사용자 행동 변화에 따라 eval이 계속 필요하다.

- **Contrarian/risk lens: Taleb**  
  평상시 calibration이 crisis regime에서 무너질 수 있다. fat-tail failure mode와 kill-switch가 필요하다.

### 전문가 검증 의견

- 알고리즘 버전 관리는 반드시 초기부터 들어가야 한다.
- candidate 알고리즘을 바로 active로 올리면 안 된다.
- score history와 algorithm change log는 PMF 이전에도 fixture 형태로 구조를 잡아야 한다.

### Decision Impact

초기부터 데이터 구조에 포함한다.

```text
algorithmVersion
scoreBreakdown
scoreHistory
candidateVersion
changeLog
calibrationReport
```

운영 원칙:

- Daily: 같은 알고리즘으로 최신 데이터 재평가
- Weekly: calibration report
- Monthly: candidate 생성, backtest, shadow mode, active 승격 검토

---

## Stage 5. 신규 영상 필터링과 인간 승인

### 현재 기획

신규 영상 발견 → 투자 관련성 필터링 → transcript 수집 → 종목/패널/stance 추출 → confidence 기준 자동 포함 또는 인간 검수로 이동.

### Expert Lens Hook

- **Primary lens: Andrew Ng**  
  AI 성능의 핵심은 모델보다 라벨 정의와 데이터 품질이다. 좋은/나쁜 투자픽, 모호 발언, 협찬/과장 표현의 라벨 가이드가 먼저다.

- **Second opinion: Chip Huyen**  
  extraction eval을 명확히 해야 한다. offline eval, human eval, production metric이 연결되어야 한다.

- **Contrarian/risk lens: Gary Marcus + Rumman Chowdhury**  
  LLM hallucination과 조작 가능성을 기본값으로 가정해야 한다. 특히 투자 발언 추출 오류는 신뢰와 법적 리스크를 만든다.

### 전문가 검증 의견

- 완전 자동화보다 `confidence-based auto + human review escalation` 구조가 맞다.
- 초기 PMF 단계에서는 semi-manual verified data가 오히려 낫다.
- Review Queue는 단순 UI가 아니라 AI 개선 데이터 수집 장치다.

### Decision Impact

모든 추출 결과에 다음 필드 필수.

```text
sourceUrl
publishedAt
quote
timestamp
assetId / ticker
contributorId
stance
confidence
humanStatus
auditLog
```

인간 승인 필요 조건:

- 종목 매핑 불확실
- 패널 identity 불확실
- stance 불명확
- quote evidence 없음
- 신규 고영향 채널/패널
- Caution 후보

---

## Stage 6. 종목별 일봉 차트 위 투자픽 레이어

### 현재 기획

종목별 일봉차트 위에 채널/패널/리그/stance별 투자픽 marker를 표시하고, 추천일 종가와 현재 수익률을 tooltip으로 제공한다.

### Expert Lens Hook

- **Primary lens: April Dunford**  
  이 기능은 제품 차별성을 가장 직관적으로 보여주는 unique attribute다. “추천을 차트 위에서 본다”는 메시지는 매우 강하다.

- **Second opinion: Mauboussin**  
  추천 이후 성과를 보여주되, 실력과 운을 혼동하지 않도록 표본 수와 기간을 함께 보여줘야 한다.

- **Contrarian/risk lens: Fama + compliance**  
  차트 marker가 매수/매도 신호처럼 보이면 위험하다. “공개 발언 시점 표시”로 표현해야 한다.

### 전문가 검증 의견

- 종목 차트 레이어는 제품의 killer visual이다.
- 하지만 PMF 초기에는 완전한 고급 차트보다 `Asset Timeline MVP`로 먼저 검증해도 된다.
- 차트는 공유/바이럴의 핵심 소재가 된다.

### Decision Impact

초기 구현 순서:

1. Asset Recommendation Timeline
2. 추천일 종가/최신가 수익률 표시
3. marker형 간단 차트
4. lightweight-charts 기반 일봉 overlay

표현 원칙:

- “추천 신호”가 아니라 “공개 발언 시점”
- tooltip에 source URL, quote, 기준가, 수익률, confidence 표시

---

## Stage 7. 사람 개입 최소화 OS

### 현재 기획

Source Discovery, Content Ingestion, Extraction, Price/Performance, League Scoring, Review Escalation, Asset Overlay, Algorithm Calibration, Marketing Agent까지 자동 루프화한다.

### Expert Lens Hook

- **Primary lens: Andrew Ng**  
  작은 자동화 성공 → 반복 가능한 플랫폼 → 확장 순서가 맞다.

- **Second opinion: Harrison Chase / Chip Huyen**  
  에이전트는 tool boundary, audit log, failure mode, monitoring이 있어야 한다.

- **Contrarian/risk lens: Kathy Baxter + Rumman Chowdhury**  
  자동화는 appropriate reliance와 accountability를 해칠 수 있다. 사람은 완전히 제거되는 것이 아니라 고위험 예외 처리자로 남아야 한다.

### 전문가 검증 의견

- “완전 무인 자동화”보다 “사람 개입을 고가치 예외로 압축하는 OS”가 맞다.
- 운영자는 수동 입력자가 아니라 supervisor/reviewer/calibrator가 되어야 한다.
- 모든 자동 루프는 실패 시 사람에게 escalate되어야 한다.

### Decision Impact

OS 운영 원칙:

```text
Low confidence + low impact → 보류/자동 제외
High confidence + low risk → 자동 승인
High impact + medium uncertainty → 인간 검수
Severe risk → 즉시 Caution + 인간 검수
```

각 에이전트는 다음을 남긴다.

- input
- output
- confidence
- reason codes
- tool trace
- human override 여부
- error bucket

---

## Stage 8. PMF 테스트 초기 버전

### 현재 기획

완성형 자동화보다 PMF 신호를 확인하는 초기 버전: League Dashboard, Weekly Report, Asset Timeline, Channel Request Loop, Share/Copy Blocks.

### Expert Lens Hook

- **Primary lens: Lenny Rachitsky**  
  PMF는 반복 사용과 사용자 pull로 확인한다.

- **Second opinion: Rahul Vohra**  
  “이 제품이 없어지면 매우 실망할 사용자”를 찾아야 한다.

- **Contrarian/risk lens: Rob Fitzpatrick**  
  “재밌다”는 반응과 실제 행동을 구분해야 한다.

### 전문가 검증 의견

- PMF 초기 버전의 범위는 적절하다.
- 그러나 MVP가 너무 많은 화면을 담으면 Aha moment가 흐려질 수 있다.
- 첫 화면에서 사용자가 해야 할 행동은 3개 이하로 제한해야 한다.

### Decision Impact

초기 PMF 성공 지표:

```text
채널 요청 수
주간 리포트 재방문
공유/복사 클릭
특정 종목/패널 추가 요청
커뮤니티 댓글/질문
유료/알림/watchlist 요청
```

하지 말아야 할 것:

- 완전 자동 YouTube 파이프라인 과투자
- 로그인/결제 선구축
- 너무 많은 채널 fixture 확장
- 수익 예측 서비스처럼 보이는 표현

---

## Stage 9. 비용 0 바이럴 전략

### 현재 기획

공유 카드, 주간 리포트, 종목별 추천 타임라인, 채널 분석 요청/투표, 소셜미디어 직접 운영을 비용 0 성장 엔진으로 설계했다.

### Expert Lens Hook

- **Primary lens: Brian Balfour / Reforge**  
  바이럴은 campaign이 아니라 product loop여야 한다.

- **Second opinion: Nikita Bier + Eugene Wei**  
  공유는 정보 전달보다 social emotion/status에서 발생한다. 사용자는 자기 의견 증명, 발견 자랑, 논쟁 참여를 위해 공유한다.

- **Contrarian/risk lens: Zeynep Tufekci + compliance**  
  논쟁 유도는 misinformation, fan war, 비방 리스크를 만들 수 있다.

### 전문가 검증 의견

- 비용 0 바이럴의 핵심은 “서비스 홍보”가 아니라 “공유 가능한 증거물”이다.
- 가장 강한 바이럴 소재는 다음이다.

```text
누가 먼저 말했나
추천 후 어떻게 됐나
이번 주 많이 언급된 종목
채널/패널 리그 변화
고점/저점 언급 타임라인
이 채널도 분석해달라 요청
```

- 하지만 표현은 절대 저격형이 아니어야 한다.

### Decision Impact

공유 카드 필수 구성:

```text
제목
핵심 수치
기준 기간
추천일 종가/최신가
source URL/quote
서비스 URL
면책 문구
```

권장 문구:

- “공개 콘텐츠 발언 기준”
- “추천일 종가 대비”
- “투자 권유 아님”
- “데이터 기준 비교”

금지/주의 문구:

- “사라/팔아라”
- “이 사람 틀림/사기”
- “수익 보장”
- “AI 추천주”

---

## Stage 10. 소셜미디어 운영 에이전트

### 현재 기획

X, 블로그, YouTube Shorts, Instagram, TikTok, LinkedIn 등을 직접 운영하되, 서비스 홍보 계정이 아니라 “투자 콘텐츠 검증 미디어”로 운영한다.

### Expert Lens Hook

- **Primary lens: Greg Isenberg**  
  커뮤니티와 distribution은 제품 이후가 아니라 제품의 일부다.

- **Second opinion: Gary Vaynerchuk / Colin & Samir / MrBeast packaging**  
  하나의 데이터 리포트를 플랫폼별 콘텐츠로 재가공하고, hook과 packaging을 최적화해야 한다.

- **Contrarian/risk lens: Hank Green + compliance**  
  숏폼은 과도한 단순화와 오해를 만들기 쉽다. 투자 조언처럼 보이면 안 된다.

### 전문가 검증 의견

- 소셜 운영은 해야 한다. 단, “우리 서비스 써보세요”가 아니라 데이터 기반 미디어로 운영해야 한다.
- 초기 우선순위는 X, 블로그, YouTube Shorts가 적절하다.
- LinkedIn은 글로벌/전문가/AI agent narrative용으로 보조 채널이다.

### Decision Impact

초기 콘텐츠 pillar:

1. 추천 검증
2. 채널/패널 리그
3. 종목별 추천 timeline
4. 주간 투자 콘텐츠 리포트
5. 빌드 인 퍼블릭

운영 원칙:

- 모든 콘텐츠는 원본 근거와 면책 유지
- 숏폼은 hook은 강하게, 결론은 겸손하게
- 투자 유튜버를 적대하지 않고 “신뢰도 증명 도구”로 포지셔닝

---

## Stage 11. 전문가 렌즈 훅 자체의 도입

### 현재 기획

앞으로 모든 planning phase에 Primary, Second Opinion, Contrarian/Risk 전문가 렌즈를 붙인다.

### Expert Lens Hook

- **Primary lens: Marty Cagan**  
  좋은 planning은 기능 목록이 아니라 의사결정 리스크를 줄이는 구조여야 한다.

- **Second opinion: Ronny Kohavi**  
  전문가 의견도 hypothesis다. 실제 metric과 실험으로 검증되어야 한다.

- **Contrarian/risk lens: Bob Hoffman / Taleb**  
  구루 프레임을 과신하면 다른 시장 맥락을 놓칠 수 있다. 한국 투자 콘텐츠 시장의 특수성을 별도 검증해야 한다.

### 전문가 검증 의견

- 전문가 훅은 매우 유용하다.
- 다만 전문가 이름을 권위로 쓰면 안 되고, decision checklist로 써야 한다.
- 각 단계마다 “이 렌즈 때문에 실제 계획이 어떻게 바뀌었는가”가 있어야 한다.

### Decision Impact

모든 planning 문서에 다음 필드를 넣는다.

```text
Primary lens
Second opinion
Contrarian/risk lens
Decision impact
Validation metric
```

---

## 2. 종합 기획 판단

## 2.1 가장 강한 제품 정의

> 공개 투자 콘텐츠 속 추천 발언을 날짜·가격·근거와 함께 기록하고, 추천 이후 성과를 추적해 채널/패널 신뢰도를 리그제로 평가하는 투자 콘텐츠 검증 OS.

## 2.2 가장 강한 초기 hook

> 투자 유튜브 추천, 이제 차트 위에서 검증하세요.

## 2.3 가장 강한 PMF 사용자

1. 투자 유튜브를 많이 보는 적극적 개인 투자자
2. 투자 콘텐츠 큐레이터/커뮤니티 운영자
3. 특정 패널/전문가 검증에 관심 있는 헤비 투자자

## 2.4 가장 강한 PMF 행동 신호

- “이 채널도 분석해주세요” 요청
- 주간 리포트 재방문
- 종목/패널 리포트 공유
- 특정 패널/종목 추가 요청
- 알림/watchlist/export 요청
- 커뮤니티 운영자가 리포트를 가져가 공유

## 2.5 가장 위험한 오해

- AI 주식 추천 서비스
- 매수/매도 시그널 서비스
- 특정 유튜버 저격/비방 사이트
- 단기 수익률 랭킹 서비스
- 규제 없는 유사투자자문 서비스

## 2.6 방어 포지셔닝

- 공개 콘텐츠 발언 추적
- 추천일 종가 기준 사후 성과 검증
- 투자 판단 참고용 데이터
- 투자 권유 아님
- 근거 URL/quote 기반
- 알고리즘 버전과 confidence 표시

---

## 3. 최종 제품 로드맵 의견

## Phase 1. League OS Foundation

**목표**  
리그제 데이터 모델과 알고리즘 기반 점수 구조를 대시보드에 반영한다.

**포함**
- league scoring config v0.1
- score breakdown
- channel league cards
- panel league cards
- promotion/demotion cards
- algorithmVersion badge
- sample/manual/live data status

**Expert Lens Hook**
- Primary: Mauboussin
- Second: Kohavi
- Risk: Taleb + Fama
- Decision impact: 점수는 겸손하게, 표본 수와 confidence를 같이 표시한다.

---

## Phase 2. PMF Report MVP

**목표**  
사용자가 공유하고 다시 볼 수 있는 weekly report를 만든다.

**포함**
- weekly report page/section
- top mentioned assets
- top themes
- channel/panel league movement
- Good/Flat/Miss picks
- copy/share block

**Expert Lens Hook**
- Primary: Lenny
- Second: Rahul Vohra
- Risk: Rob Fitzpatrick
- Decision impact: 방문 수보다 재방문, 공유, 채널 요청을 본다.

---

## Phase 3. Asset Timeline MVP

**목표**  
종목별로 누가 언제 말했고 이후 어떻게 됐는지 보여준다.

**포함**
- asset selector
- pick timeline
- recommendation close/latest close/return
- source URL/quote
- channel/panel/league filter

**Expert Lens Hook**
- Primary: April Dunford
- Second: Mauboussin
- Risk: Fama + compliance
- Decision impact: “신호”가 아니라 “공개 발언 시점”으로 표현한다.

---

## Phase 4. Channel Request Loop

**목표**  
사용자가 직접 다음 분석 대상을 지정하게 만든다.

**포함**
- channel request form
- requested channel list
- Rookie candidate status
- request count
- share prompt

**Expert Lens Hook**
- Primary: Brian Balfour
- Second: Andrew Chen
- Risk: Rand Fishkin
- Decision impact: 요청이 데이터 확장과 공유 루프로 이어지게 설계한다.

---

## Phase 5. Social/Media Agent MVP

**목표**  
서비스 데이터를 소셜 콘텐츠로 재가공해 비용 0 유입을 만든다.

**포함**
- weekly X thread draft
- blog draft
- Shorts script
- Telegram/community summary
- compliance wording check

**Expert Lens Hook**
- Primary: Greg Isenberg
- Second: GaryV / Colin & Samir
- Risk: Hank Green + compliance
- Decision impact: 미디어 브랜드처럼 운영하되 과장과 투자 권유 표현을 방지한다.

---

## Phase 6. Real Data Ingestion

**목표**  
semi-manual verified data에서 실제 YouTube 영상 수집/추출로 확장한다.

**포함**
- channel discovery
- recent video ingestion
- transcript collection
- asset/panel/stance extraction
- review queue
- price data linkage

**Expert Lens Hook**
- Primary: Andrew Ng
- Second: Chip Huyen
- Risk: Gary Marcus + Rumman
- Decision impact: 자동화보다 eval, error bucket, human review를 먼저 설계한다.

---

## 4. 최종 권고

## 4.1 지금 바로 구현해야 할 것

1. League scoring algorithm v0.1
2. Channel/Panel League Dashboard
3. Weekly Report MVP
4. Asset Timeline MVP
5. Channel Request Loop
6. Share/Copy blocks
7. PMF metric placeholders
8. Compliance/evidence guardrails

## 4.2 아직 하지 말아야 할 것

1. 완전 자동 YouTube pipeline 과투자
2. 로그인/결제/복잡한 DB 우선 구축
3. 수익 예측/매수 추천처럼 보이는 기능
4. 너무 많은 채널을 검증 없이 추가
5. 단기 수익률만으로 패널을 서열화
6. 자극적 저격형 바이럴 콘텐츠

## 4.3 가장 중요한 설계 원칙

```text
공유 가능하되 비방하지 않는다.
자동화하되 근거와 감사 로그를 남긴다.
랭킹하되 실력과 운을 구분한다.
검증하되 투자 조언으로 보이지 않는다.
성장하되 신뢰를 훼손하지 않는다.
```

## 4.4 최종 한 줄 의견

> 이 서비스는 “AI 주식 추천 서비스”가 아니라, 투자 콘텐츠 시장에 존재하지 않던 **공개 투자 발언의 기록·검증·리그화·차트화 인프라**로 포지셔닝해야 한다. 초기 PMF는 완전 자동화보다, 근거 있는 주간 리포트와 채널 요청 루프로 검증하는 것이 맞다.
