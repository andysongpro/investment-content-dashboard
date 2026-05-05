const assetTimelines = [
  {
    ticker: 'NVDA', name: '엔비디아', market: 'US',
    events: [{ date: '2026-04-27', channel: '신사임당', contributor: '신사임당 진행자', league: 'Minor', stance: '매우 긍정', recClose: 1140, latest: 1218, returnPct: 6.84, sourceUrl: 'https://www.youtube.com/results?search_query=신사임당+엔비디아+AI+인프라', quote: 'AI 인프라 투자는 아직 끝나지 않았고 실적 확인이 중요합니다.', confidence: 0.86, humanStatus: 'manual verified sample' }],
  },
  {
    ticker: '000660', name: 'SK하이닉스', market: 'KR',
    events: [{ date: '2026-05-03', channel: '김작가 TV', contributor: '염승환 이사', league: 'Major', stance: '매우 긍정', recClose: 221500, latest: 235500, returnPct: 6.32, sourceUrl: 'https://www.youtube.com/results?search_query=김작가TV+SK하이닉스+AI', quote: 'AI 서버 수요가 실적 추정치를 다시 올릴 수 있습니다.', confidence: 0.88, humanStatus: 'manual verified sample' }],
  },
  {
    ticker: '005930', name: '삼성전자', market: 'KR',
    events: [{ date: '2026-05-03', channel: '김작가 TV', contributor: '염승환 이사', league: 'Major', stance: '긍정', recClose: 83700, latest: 86100, returnPct: 2.87, sourceUrl: 'https://www.youtube.com/results?search_query=김작가TV+삼성전자', quote: '지금 구간에서는 분할로 계속 모아가는 전략이 유효합니다.', confidence: 0.82, humanStatus: 'manual verified sample' }],
  },
  {
    ticker: '267260', name: 'HD현대일렉트릭', market: 'KR',
    events: [{ date: '2026-03-21', channel: '신사임당', contributor: '신사임당 게스트', league: 'Rookie', stance: '긍정', recClose: 334000, latest: 357500, returnPct: 7.04, sourceUrl: 'https://www.youtube.com/results?search_query=신사임당+HD현대일렉트릭', quote: '전력망 투자는 3개월 시계열로 추적할 필요가 있습니다.', confidence: 0.8, humanStatus: 'manual verified sample' }],
  },
  {
    ticker: '454910', name: '두산로보틱스', market: 'KR',
    events: [{ date: '2026-02-14', channel: '신사임당', contributor: '신사임당 게스트', league: 'Rookie', stance: '불명확', recClose: 82100, latest: 75800, returnPct: -7.67, sourceUrl: 'https://www.youtube.com/results?search_query=신사임당+두산로보틱스', quote: '로봇주는 기대가 빨리 반영돼 추격보다 확인이 먼저입니다.', confidence: 0.62, humanStatus: 'needs human review sample' }],
  },
];

module.exports = { assetTimelines };
