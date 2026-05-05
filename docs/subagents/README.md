# Investment Content Dashboard Subagents

Created: 2026-05-05

이 폴더는 다음 앱 개발/기획/QA 때 `delegate_task`로 바로 넘길 수 있는 서브에이전트 역할 정의와 프롬프트 템플릿이다.

## 왜 만들었나

지금까지 작업에서 반복적으로 발생한 고부가 업무는 아래 5가지였다.

1. 제품/PMF/바이럴 전략을 서비스 포지셔닝에 맞게 정리
2. 리그/알고리즘/데이터 모델을 투자 권유가 아닌 검증 OS로 설계
3. 모바일 fintech UI를 실제 스크린샷 기준으로 QA
4. Vercel/Next.js 정적 export 배포와 production alias 검증
5. 소셜/콘텐츠 운영을 제품형 바이럴 루프로 설계

각 역할은 독립 서브에이전트로 분리하면 다음 앱 개발 때 속도와 품질이 좋아진다.

## 사용법

상위 에이전트가 작업을 쪼갠 뒤 아래 파일의 `Delegate prompt` 블록을 복사해 `delegate_task`의 `goal/context`로 사용한다.

추천 패턴:

```text
1. Product Strategy Agent로 요구사항/PMF/포지셔닝 정리
2. Data & League Algorithm Agent로 점수/리그/검수 로직 검토
3. UI QA Agent로 모바일/데스크톱 화면 품질 리뷰
4. Release QA Agent로 테스트/배포/production 검증
5. Social Viral Ops Agent로 공유 카드/콘텐츠 루프 설계
```

## 서브에이전트 목록

- `product-strategy-agent.md` — PMF, 포지셔닝, IA, 기능 우선순위
- `data-league-algorithm-agent.md` — league scoring, algorithmVersion, 검수/승급/강등 로직
- `fintech-ui-qa-agent.md` — Revolut-inspired 모바일 UI/스크린샷 QA
- `release-qa-agent.md` — Next/Vercel 배포, smoke, screenshot, secret safety
- `social-viral-ops-agent.md` — YouTube/TikTok/Instagram/X/Blog/LinkedIn 운영 전략

## 공통 주의

- 한국어로 요약한다.
- 투자 권유처럼 보이는 표현을 피한다.
- 구체 파일 경로, 테스트 명령, 스크린샷 경로를 반환한다.
- 외부 side effect가 있으면 URL/commit/status 같은 검증 가능한 handle을 반환한다.
- subagent self-report는 그대로 믿지 말고 상위 에이전트가 최종 검증한다.
