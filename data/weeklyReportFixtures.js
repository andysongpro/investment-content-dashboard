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
