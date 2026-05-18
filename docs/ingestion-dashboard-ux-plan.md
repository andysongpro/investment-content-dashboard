# Ingestion Results Dashboard UX Plan

## 목적

오늘 수집된 YouTube 투자 콘텐츠 결과를 운영자가 웹 대시보드에서 즉시 판단할 수 있게 만든다. 이 화면은 투자 추천 화면이 아니라 **수집/후보/검수 운영 상황판**이다.

## 핵심 사용자 흐름

1. **오늘 수집 상태 확인**
   - 28개 채널 중 몇 개 영상이 수집됐는지
   - transcript segment가 얼마나 확보됐는지
   - Review Queue가 몇 개 생성됐는지
2. **Claim 후보 우선 검수**
   - 종목/티커/발언 timestamp/evidence quote를 먼저 본다
   - `needs_human_review` 상태를 명확히 노출한다
   - 검증 전에는 성과/리그 점수에 반영하지 않는다
3. **Transcript 결손 감시**
   - 채널별 transcript 없음 발생 여부를 본다
   - 반복 결손 시 제외 후보로 올라가는 루틴을 이해할 수 있게 보여준다
4. **Review Queue 진입**
   - title-only seed와 transcript-ready candidate를 섞지 않는다
   - 사람 검수 전에는 verified claim으로 승격하지 않는다

## 정보 구조

### 1. Daily Ingestion OS

- 실행 라벨
- run directory
- data status
- algorithmVersion
- 주요 KPI
  - tracked channels
  - content items
  - transcript-ready items
  - missing transcript items
  - claim candidates
  - review queue items

### 2. Claim Candidate Triage

카드 단위:

- 채널명
- 종목명 / ticker / market
- stance / claimType
- timestamp
- evidence quote
- 원본 영상 링크
- reviewStatus
- algorithmVersion

### 3. Channel Transcript Health

행 단위:

- 채널명
- transcript available / missing
- segment count
- claim candidate count
- latest title
- status recommendation

UI 규칙:

- missing transcript가 있으면 red chip
- transcript 있음은 green chip
- 제외 후보는 red/orange priority chip

### 4. UX Principles

화면 하단에 운영 원칙을 노출한다.

- 후보와 검증 분리
- 모바일 scan-first
- evidence-first
- not investment advice

## 시각 방향

현재 앱의 Revolut-inspired 방향을 유지한다.

- white canvas
- near-black `#191c1f`
- accent `#494fdf`
- flat bordered cards
- no shadow
- pill chips/buttons
- Korean `keep-all` wrapping
- mobile fixed appbar + horizontal section tabs

## 다음 확장

1. `/admin`에서 claim candidate 승인/거절 action 연결
2. 승인된 candidate만 verified claim store에 저장
3. 종가/최신가 API 연결 후 performance board에 반영
4. repeated missing transcript state를 관리자 제외 후보 큐에 연결
5. league promotion/demotion scoring에 verified claim만 투입
