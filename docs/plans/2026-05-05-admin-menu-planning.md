# Admin Menu Planning: PMF League OS

> 목적: 현재 배포된 PMF League OS 단계에서 필요한 관리자 메뉴를 정의한다. 이 문서는 바로 구현 계획으로 전환 가능한 IA/UX/운영 정책 기획서다.

**현재 단계:** PMF 검증용 초기 버전  
**제품:** 투자 콘텐츠 인텔리전스 허브 / PMF League OS  
**작성일:** 2026-05-05

---

## 1. 관리자 메뉴의 핵심 목적

관리자 메뉴는 “백오피스 CRUD”가 아니라, 최소 인력으로 OS를 운영하기 위한 **Control Tower**여야 한다.

```text
수집 후보 확인
→ 애매한 추출 검수
→ 채널/패널/종목 정규화
→ 리그 점수·승급/강등 검토
→ 주간 리포트 발행
→ 알고리즘 상태 점검
→ PMF/마케팅 반응 확인
```

관리자 메뉴의 1차 목표:

1. 사람이 봐야 할 것만 모아준다.
2. 자동 처리 결과의 근거와 confidence를 보여준다.
3. 검수 결과가 다시 데이터 품질 개선에 쓰이게 한다.
4. 리그/랭킹/리포트/마케팅 발행 전 위험을 통제한다.
5. PMF 신호를 보고 다음 작업 우선순위를 정하게 한다.

---

## 2. Expert Lens Hook

### Primary lens: Andrew Ng

- Human-in-the-loop 자동화 관점.
- 관리자는 데이터를 직접 입력하는 사람이 아니라, AI/스크래핑/알고리즘이 애매해하는 사례를 판정하는 사람이어야 한다.

### Second opinion: Marty Cagan + Teresa Torres

- 관리자 메뉴도 내부 사용자의 제품이다.
- 운영자가 실제로 매일/매주 해야 하는 job을 기준으로 메뉴를 구성해야 한다.

### Contrarian / Risk lens: Rumman Chowdhury + 금융 컴플라이언스

- 관리자 메뉴는 잘못된 자동 추출, 명예훼손, 투자 조언 오해, 알고리즘 불공정성을 막는 마지막 방어선이어야 한다.

### Decision impact

- 메뉴는 “데이터 관리”보다 “검수 큐/위험 큐/발행 승인/알고리즘 감사” 중심으로 설계한다.
- 모든 관리자 액션은 audit log를 남긴다.
- 투자픽/리그/공유 카드 발행 전 evidence와 면책 문구를 확인한다.

---

## 3. 관리자 사용자 역할

초기에는 로그인/권한 시스템을 크게 만들지 않더라도, 역할 모델은 먼저 정의한다.

### 3.1 Operator

역할:

- 신규 채널 후보 승인/거절
- 콘텐츠 후보 포함/제외
- 추출 결과 검수
- 주간 리포트 초안 확인

권한:

- 승인/보류/거절
- 메모 추가
- humanStatus 변경

---

### 3.2 Analyst

역할:

- 패널/종목/stance 정규화
- 추천 발언 근거 검토
- 성과 계산 이상치 확인
- 리그 이동 후보 검토

권한:

- entity merge/split 제안
- confidence 수정
- 리그 이동 승인 요청

---

### 3.3 Admin

역할:

- 알고리즘 config 관리
- candidate algorithm 생성
- shadow mode 시작/종료
- 리그 변경 승인
- 발행 승인

권한:

- algorithmVersion active 전환
- 리포트 publish
- Caution override
- 사용자 권한 관리

---

### 3.4 Compliance Reviewer

역할:

- 표현 리스크 점검
- 투자 권유 오해 방지
- 인물/채널 평판 리스크 점검
- 이의제기 처리

권한:

- publish block
- wording 수정 요청
- dispute status 변경

---

## 4. 관리자 메뉴 IA

초기 관리자 메뉴는 아래 9개로 구성한다.

```text
/admin
  1. OS Overview
  2. Source Discovery
  3. Content Inbox
  4. Extraction Review Queue
  5. Entity Registry
  6. League Operations
  7. Weekly Report Studio
  8. Algorithm Monitor
  9. PMF & Growth Signals
  10. Audit / Risk Log
```

MVP에서는 1~8을 우선 만들고, 9~10은 placeholder로 시작해도 된다.

---

## 5. 메뉴별 기획

## 5.1 OS Overview

### 목적

오늘 운영자가 어디부터 봐야 하는지 알려주는 상황판.

### 핵심 카드

```text
신규 수집 후보: 20
자동 포함: 8
검수 필요: 7
거절/제외: 5
채널 요청: 12
승급 후보: 3
강등 위험: 1
Caution 후보: 2
리포트 발행 상태: Draft
알고리즘 버전: league-ranking-v0.1
```

### 주요 액션

- “검수 큐로 이동”
- “주간 리포트 초안 보기”
- “Caution 후보 확인”
- “채널 요청 처리”

### Expert Lens Hook

- Primary: Lenny — 매일/매주 반복 사용될 핵심 operational dashboard인가?
- Second: Julie Zhuo — 첫 화면에서 우선순위가 명확한가?
- Risk: John Cutler — 내부 지표가 vanity metric이 되지 않는가?

### MVP 포함 여부

**포함.** 관리자 메뉴 첫 화면.

---

## 5.2 Source Discovery

### 목적

스크래핑 seed, 사용자 채널 요청, 외부 발견 후보를 모아 신규 소스를 승인/거절한다.

### 입력 데이터

- `data/scraped/youtube-seed.json`
- Channel Request Loop local data / future DB
- 수동 입력 URL
- 향후 X/블로그/뉴스레터 source 후보

### 화면 구성

```text
[후보 채널 리스트]
- 채널명
- URL
- 발견 경로: scrape / user_request / manual
- 요청 수
- 최근 영상 수
- 투자 관련성 추정
- 중복 가능성
- 리스크 flag
- 상태: new / rookie_candidate / approved / rejected
```

### 액션

- Rookie 후보 등록
- 기존 채널과 병합
- 거절
- 보류
- 메모 추가

### 자동 승인 조건 v0.1

```text
투자 관련성 높음
중복 아님
요청 수 2 이상
최근 영상 존재
리스크 flag 없음
```

### 인간 검수 조건

```text
채널명 유사 중복
투자/재테크/코인/부동산 혼합
리딩방/광고성 의심
요청 수는 많은데 콘텐츠 품질 불명확
```

### Expert Lens Hook

- Primary: Andrew Ng — 자동 후보 발견 + human approval loop.
- Second: Greg Isenberg — 사용자 요청이 community-led discovery가 되는가?
- Risk: Compliance — 리딩방/광고성/유사투자자문 리스크 채널을 걸러내는가?

### MVP 포함 여부

**포함.** 현재 스크래핑 seed와 Channel Request Loop를 연결하는 첫 관리자 메뉴.

---

## 5.3 Content Inbox

### 목적

승인된 소스에서 수집된 신규 영상/콘텐츠 후보를 처리한다.

### 화면 구성

```text
[콘텐츠 후보]
- title
- channel
- publishedAt 또는 publishedText
- sourceUrl
- scrapeMethod
- 투자 관련성 점수
- 예상 종목/테마 keyword
- 상태: new / candidate / auto_included / needs_review / rejected
```

### 필터

- 채널
- 상태
- 투자 관련성
- 수집일
- scrapeMethod
- 검수 필요 여부

### 액션

- 분석 큐에 포함
- 제외
- 보류
- 수동 태그 추가
- transcript 수집 요청

### Expert Lens Hook

- Primary: Marty Cagan — 운영자가 매일 처리할 실제 job인가?
- Second: Andrew Ng — 자동 분류가 인간 시간을 줄이는가?
- Risk: Gary Marcus — 제목만 보고 투자픽을 오판하지 않도록 하는가?

### MVP 포함 여부

**포함.** 단, 초기에는 scraped seed 기반 candidate list로 시작.

---

## 5.4 Extraction Review Queue

### 목적

AI/룰/반자동 추출 결과 중 애매한 것만 사람이 검수한다.

### 검수 대상

- 종목 추출
- 패널/출연자 추출
- stance 분류
- 추천 vs 단순 언급 구분
- evidence quote 확인
- timestamp 확인
- confidence 확인

### 화면 구성

```text
[검수 카드]
원본 콘텐츠: title / channel / URL
추출 결과:
  asset: SK하이닉스
  contributor: 김정수
  stance: BULL
  quote: "..."
  confidence: 0.72
  reason: 종목명 명확, stance는 일부 애매

관리자 선택:
  승인 / 수정 / 보류 / 거절
```

### 우선순위 공식 v0.1

```text
reviewPriority =
  impactScore * 0.35
+ uncertaintyScore * 0.30
+ entityImportanceScore * 0.20
+ freshnessScore * 0.10
+ userDemandScore * 0.05
```

### 상태

```text
pending_review
approved
edited
rejected
needs_second_review
```

### Expert Lens Hook

- Primary: Andrew Ng — data-centric correction loop.
- Second: Chip Huyen — eval set과 error bucket을 만드는가?
- Risk: Gary Marcus + Rumman — hallucination/불공정 점수 반영 방지.

### MVP 포함 여부

**우선순위 높음.** 단, 실제 AI 추출 전에는 현재 fixture/reviewItems 기반 UI로 시작 가능.

---

## 5.5 Entity Registry

### 목적

채널, 패널, 종목, 테마를 정규화한다.

### 관리 대상

```text
Source
ContentItem
Contributor
Asset
Theme
Mention
Evidence
```

### 주요 문제

- 같은 패널의 이름 표기 차이
- 종목명/티커 매핑
- 테마와 종목 혼동
- 채널명 변경
- 익명 패널 처리

### 화면 구성

```text
[Entity Search]
- 이름
- type
- aliases
- linked items count
- confidence
- status
```

### 액션

- alias 추가
- merge
- split
- canonical name 지정
- ticker 연결
- entity status 변경

### Expert Lens Hook

- Primary: Chip Huyen — entity quality가 모델/알고리즘 품질을 좌우한다.
- Second: Benn Stancil — big data보다 good data.
- Risk: Rumman Chowdhury — 잘못된 identity merge가 평판 피해를 만들 수 있음.

### MVP 포함 여부

**v1.1.** MVP에는 placeholder와 간단한 alias list만 둔다.

---

## 5.6 League Operations

### 목적

채널/패널 리그 점수와 승급/강등/Caution 후보를 검토한다.

### 화면 구성

```text
[League Table]
- entity
- type: channel / panel
- currentLeague
- score
- previousScore
- pickCount
- hitRate
- avgReturn
- ambiguityRate
- riskRaw
- algorithmVersion
- promotionStatus
```

### 상세 패널

- score breakdown
- 최근 5개 투자픽
- Good/Flat/Miss 분포
- 리그 변경 이유
- Caution flag
- 운영자 메모

### 액션

- 승급 승인
- 강등 승인
- Caution 지정
- watch 유지
- second review 요청
- 알고리즘 오류 flag

### Guardrail

```text
표본 5개 미만은 Rookie 유지
Caution 조건은 score보다 우선
승급/강등은 2회 연속 조건 필요
모든 변경은 audit log 기록
```

### Expert Lens Hook

- Primary: Michael Mauboussin — skill vs luck, base rate.
- Second: Ronny Kohavi — OEC와 guardrail metric.
- Risk: Taleb + Fama — 단기 성과를 실력/alpha로 과대해석하지 않기.

### MVP 포함 여부

**포함.** 현재 public league board의 admin 버전.

---

## 5.7 Weekly Report Studio

### 목적

주간 투자 콘텐츠 리포트를 검수하고 발행한다.

### 화면 구성

```text
[Report Draft]
- 많이 언급된 종목
- 많이 언급된 테마
- 채널별 hitRate
- 패널별 성과 TOP
- Good/Flat/Miss picks
- 승급 후보
- Caution 후보
- 공유용 요약
```

### 액션

- draft regenerate
- 문구 수정
- evidence 확인
- compliance check
- publish
- copy X thread
- copy Telegram summary
- copy Blog outline

### 발행 전 체크리스트

```text
모든 수치 기준 기간 표시
추천일 종가 대비 표시
source/evidence 링크 존재
투자 권유 아님 문구 포함
비방/단정 표현 없음
sample/live/manual 구분 표시
```

### Expert Lens Hook

- Primary: Brian Balfour — 리포트가 growth loop를 만드는가?
- Second: Nikita Bier + Eugene Wei — 공유 욕구/status asset이 있는가?
- Risk: Zeynep + Compliance — 논쟁 유도/비방/투자 조언 오해 방지.

### MVP 포함 여부

**포함.** 바이럴/PMF 핵심 메뉴.

---

## 5.8 Algorithm Monitor

### 목적

랭킹 알고리즘의 버전, 후보 버전, calibration 상태를 관리한다.

### 화면 구성

```text
Active version: league-ranking-v0.1
Candidate version: 없음 / v0.2-candidate
최근 평가일
최근 calibration report
score drift
리그별 이후 성과
candidate vs active 차이
change log
```

### 액션

- candidate config 생성
- backtest 실행
- shadow mode 시작
- active 승격 요청
- change log 작성

### MVP에서는

- active version 표시
- config weights 표시
- candidate placeholder
- calibration checklist 표시

### Expert Lens Hook

- Primary: Ronny Kohavi — 실험 설계와 guardrail.
- Second: Chip Huyen — 모델/알고리즘 drift monitoring.
- Risk: Taleb — overfitting과 narrative fallacy 방지.

### MVP 포함 여부

**placeholder 포함.** 실제 config editing은 v1.1.

---

## 5.9 PMF & Growth Signals

### 목적

서비스가 실제로 PMF 신호를 만들고 있는지 본다.

### 지표

```text
channel_request_submit
share_copy
asset_timeline_change
weekly_report_copy
return_visit
requested_channel_votes
```

### 화면 구성

```text
오늘/7일/30일
- 채널 요청 수
- 공유 복사 수
- 종목 타임라인 선택 수
- 리포트 재방문
- 가장 많이 요청된 채널
- 가장 많이 클릭된 종목
```

### Expert Lens Hook

- Primary: Lenny — retention과 pull signal.
- Second: Rahul Vohra — very disappointed cohort 탐색.
- Risk: Rob Fitzpatrick — 말뿐인 칭찬 대신 행동 데이터 확인.

### MVP 포함 여부

**현재 public PMF Signals Preview를 admin으로 이동/확장.**

---

## 5.10 Audit / Risk Log

### 목적

모든 운영 변경과 위험 판단을 추적한다.

### 기록 대상

- 채널 승인/거절
- 콘텐츠 포함/제외
- 추출 결과 수정
- entity merge/split
- 리그 변경
- Caution 지정
- 리포트 publish
- 알고리즘 버전 변경
- dispute/이의제기

### 필드

```ts
AuditLog {
  id: string;
  actorId: string;
  actionType: string;
  targetType: string;
  targetId: string;
  beforeJson?: object;
  afterJson?: object;
  reason?: string;
  createdAt: string;
}
```

### Expert Lens Hook

- Primary: Rumman Chowdhury — algorithmic accountability.
- Second: Kathy Baxter — appropriate reliance and transparency.
- Risk: Compliance counsel — 사후 분쟁 대응 가능성.

### MVP 포함 여부

**v1.1.** MVP에는 local event log 수준으로 시작.

---

## 6. Admin MVP 우선순위

이번 단계에서 바로 만들 관리자 메뉴는 아래 6개가 적절하다.

```text
/admin/overview
/admin/sources
/admin/content
/admin/review
/admin/league
/admin/reports
```

그리고 아래 3개는 placeholder로 둔다.

```text
/admin/entities
/admin/algorithm
/admin/growth
```

Audit log는 눈에 보이는 메뉴보다 내부 utility로 먼저 만든다.

---

## 7. 추천 화면 구조

### Admin Shell

```text
좌측/상단 메뉴
- Overview
- Sources
- Content
- Review Queue
- League Ops
- Report Studio
- Entities
- Algorithm
- Growth
- Audit
```

모바일에서는 상단 tab 또는 select로 전환.

### 공통 컴포넌트

```text
AdminMetricCard
AdminStatusChip
AdminQueueTable
AdminReviewCard
AdminActionBar
AdminEvidencePanel
AdminAuditTrail
```

---

## 8. 초기 데이터 모델

### SourceCandidate

```ts
SourceCandidate {
  id: string;
  name: string;
  url: string;
  discoveredBy: 'scrape' | 'user_request' | 'manual';
  requestCount: number;
  relevanceScore: number;
  duplicateRisk: number;
  riskFlags: string[];
  status: 'new' | 'rookie_candidate' | 'approved' | 'rejected' | 'held';
  createdAt: string;
}
```

### ContentCandidate

```ts
ContentCandidate {
  id: string;
  sourceId: string;
  title: string;
  url: string;
  publishedText?: string;
  scrapeMethod: string;
  relevanceScore?: number;
  status: 'new' | 'candidate' | 'auto_included' | 'needs_review' | 'rejected';
}
```

### ExtractionReviewItem

```ts
ExtractionReviewItem {
  id: string;
  contentId: string;
  assetName?: string;
  contributorName?: string;
  stance?: 'BULL' | 'V-BULL' | 'WATCH' | 'UNC' | 'BEAR';
  quote?: string;
  confidence: number;
  priority: number;
  status: 'pending_review' | 'approved' | 'edited' | 'rejected' | 'needs_second_review';
}
```

### AdminAction

```ts
AdminAction {
  id: string;
  actor: string;
  action: string;
  targetType: string;
  targetId: string;
  reason?: string;
  createdAt: string;
}
```

---

## 9. 구현 방식 제안

현재 앱은 static export 구조이므로, 이 단계의 admin도 우선 **client-only localStorage 기반 demo admin**으로 만든다.

### 이유

- PMF 단계에서 DB/Auth 과투자 방지.
- 운영 플로우 검증이 먼저.
- 나중에 Supabase/DB로 자연스럽게 이전 가능.

### 라우팅 옵션

Next static export에서 안전하게 가려면 두 가지 중 하나.

#### 옵션 A: `/admin` 별도 페이지

```text
app/admin/page.jsx
```

장점:

- public dashboard와 분리.
- 관리자 UX 설계 명확.

단점:

- static export에서 추가 route 검증 필요.

#### 옵션 B: 기존 페이지 내 Admin Mode 탭

```text
?mode=admin
```

장점:

- 구현 빠름.
- 현재 단일 페이지 구조 유지.

단점:

- public UI가 더 복잡해짐.

### 추천

**옵션 A: `/admin` 별도 페이지.**

초기에는 접근 제어 없이 “PMF Admin Prototype” 문구를 명확히 표시한다. 실제 운영 전에는 인증 필요.

---

## 10. 구현 순서

### Phase A — Admin Shell

1. `app/admin/page.jsx` 생성
2. `data/adminFixtures.js` 생성
3. `lib/adminOps.js` 생성
4. `tests/admin-smoke.js` 생성
5. `/admin` route build 확인

### Phase B — Overview / Sources / Content

1. Overview metric cards
2. Source Discovery table/cards
3. scraped seed import display
4. Content Inbox display
5. 승인/거절 localStorage action

### Phase C — Review / League / Reports

1. Extraction Review Queue
2. League Operations admin view
3. Weekly Report Studio
4. Publish checklist
5. share copy generation

### Phase D — Algorithm / Growth / Audit placeholders

1. Algorithm Monitor placeholder
2. PMF Growth Signals
3. Audit log localStorage
4. Compliance checklist

### Phase E — QA / Deploy

1. `npm test`
2. `npm run build`
3. local browser smoke `/admin`
4. production deploy prebuilt
5. production admin smoke

---

## 11. Admin 메뉴 MVP Acceptance Criteria

### 기능 기준

- `/admin` 페이지가 존재한다.
- Overview가 운영 우선순위를 보여준다.
- scraped YouTube seed 후보가 Source/Content 메뉴에 보인다.
- 채널 후보를 Rookie 후보/거절/보류 처리할 수 있다.
- 검수 큐에서 extraction item을 승인/수정/거절할 수 있다.
- League Ops에서 score breakdown과 promotion status를 볼 수 있다.
- Weekly Report Studio에서 발행 전 체크리스트와 공유 문구를 볼 수 있다.
- 모든 admin action은 local audit log에 기록된다.

### UX 기준

- 모바일에서도 메뉴 전환 가능.
- CTA는 44px 이상.
- 한글 깨짐 없음.
- public dashboard와 admin prototype이 구분된다.

### 리스크 기준

- 투자 권유/추천주/매수 신호 표현 없음.
- publish 전 evidence/compliance checklist가 보인다.
- algorithmVersion이 표시된다.
- sample/manual/live 데이터 상태가 표시된다.

---

## 12. 이번 단계에서 하지 않을 것

```text
실제 로그인/권한 시스템
DB/Supabase 연결
실시간 YouTube API
자동 transcript extraction
실제 리포트 소셜 자동 게시
알고리즘 config 직접 수정 UI
결제/사용자 계정
```

대신 관리자 UX와 운영 루프를 검증한다.

---

## 13. 최종 권고

이번 단계의 관리자 메뉴는 “관리자 패널”이 아니라 **운영 검수 콘솔**로 만들어야 한다.

가장 먼저 만들 화면:

```text
1. Admin Overview
2. Source Discovery
3. Content Inbox
4. Extraction Review Queue
5. League Operations
6. Weekly Report Studio
```

핵심 원칙:

```text
사람은 모든 데이터를 입력하지 않는다.
사람은 애매하고 위험하고 중요한 것만 판단한다.
모든 판단은 audit log로 남긴다.
모든 발행물은 evidence와 compliance checklist를 통과한다.
```
