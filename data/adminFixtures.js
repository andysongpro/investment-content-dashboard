const leagueFixtures = require('./leagueFixtures');

const { channelLeagues, panelLeagues } = leagueFixtures;

const sourceCandidates = [
  {
    "id": "src-815",
    "name": "815머니톡",
    "url": "channel-transcripts",
    "discoveryPath": "daily_cron_channel_transcripts",
    "requestCount": 0,
    "recentContentCount": 1,
    "relevanceScore": 45,
    "duplicateRisk": "low",
    "riskFlags": [
      "반복 transcript 결손"
    ],
    "status": "exclude_candidate",
    "note": "2026-05-19 cron: transcript 0/1 확보"
  },
  {
    "id": "src-db",
    "name": "DB증권 더블",
    "url": "channel-transcripts",
    "discoveryPath": "daily_cron_channel_transcripts",
    "requestCount": 0,
    "recentContentCount": 1,
    "relevanceScore": 45,
    "duplicateRisk": "low",
    "riskFlags": [
      "반복 transcript 결손"
    ],
    "status": "exclude_candidate",
    "note": "2026-05-19 cron: transcript 0/1 확보"
  },
  {
    "id": "src-e",
    "name": "E트렌드",
    "url": "channel-transcripts",
    "discoveryPath": "daily_cron_channel_transcripts",
    "requestCount": 0,
    "recentContentCount": 1,
    "relevanceScore": 65,
    "duplicateRisk": "low",
    "riskFlags": [],
    "status": "rookie_observed",
    "note": "2026-05-19 cron: transcript 1/1 확보"
  },
  {
    "id": "src-ls",
    "name": "LS증권",
    "url": "channel-transcripts",
    "discoveryPath": "daily_cron_channel_transcripts",
    "requestCount": 0,
    "recentContentCount": 1,
    "relevanceScore": 65,
    "duplicateRisk": "low",
    "riskFlags": [],
    "status": "rookie_observed",
    "note": "2026-05-19 cron: transcript 1/1 확보"
  },
  {
    "id": "src-tv",
    "name": "강민우 돈깡TV",
    "url": "channel-transcripts",
    "discoveryPath": "daily_cron_channel_transcripts",
    "requestCount": 0,
    "recentContentCount": 1,
    "relevanceScore": 65,
    "duplicateRisk": "low",
    "riskFlags": [],
    "status": "rookie_observed",
    "note": "2026-05-19 cron: transcript 1/1 확보"
  },
  {
    "id": "src-tv",
    "name": "김작가 TV",
    "url": "channel-transcripts",
    "discoveryPath": "daily_cron_channel_transcripts",
    "requestCount": 0,
    "recentContentCount": 1,
    "relevanceScore": 65,
    "duplicateRisk": "low",
    "riskFlags": [],
    "status": "rookie_observed",
    "note": "2026-05-19 cron: transcript 1/1 확보"
  },
  {
    "id": "src-item",
    "name": "내일은 투자왕 - 김단테",
    "url": "channel-transcripts",
    "discoveryPath": "daily_cron_channel_transcripts",
    "requestCount": 0,
    "recentContentCount": 1,
    "relevanceScore": 65,
    "duplicateRisk": "low",
    "riskFlags": [],
    "status": "rookie_observed",
    "note": "2026-05-19 cron: transcript 1/1 확보"
  },
  {
    "id": "src-item",
    "name": "달란트투자",
    "url": "channel-transcripts",
    "discoveryPath": "daily_cron_channel_transcripts",
    "requestCount": 0,
    "recentContentCount": 1,
    "relevanceScore": 65,
    "duplicateRisk": "low",
    "riskFlags": [],
    "status": "rookie_observed",
    "note": "2026-05-19 cron: transcript 1/1 확보"
  },
  {
    "id": "src-item",
    "name": "대왕개미 홍인기",
    "url": "channel-transcripts",
    "discoveryPath": "daily_cron_channel_transcripts",
    "requestCount": 0,
    "recentContentCount": 1,
    "relevanceScore": 65,
    "duplicateRisk": "low",
    "riskFlags": [],
    "status": "rookie_observed",
    "note": "2026-05-19 cron: transcript 1/1 확보"
  },
  {
    "id": "src-item",
    "name": "매경 월가월부",
    "url": "channel-transcripts",
    "discoveryPath": "daily_cron_channel_transcripts",
    "requestCount": 0,
    "recentContentCount": 1,
    "relevanceScore": 65,
    "duplicateRisk": "low",
    "riskFlags": [],
    "status": "rookie_observed",
    "note": "2026-05-19 cron: transcript 1/1 확보"
  },
  {
    "id": "src-item",
    "name": "매경 자이앤트",
    "url": "channel-transcripts",
    "discoveryPath": "daily_cron_channel_transcripts",
    "requestCount": 0,
    "recentContentCount": 1,
    "relevanceScore": 65,
    "duplicateRisk": "low",
    "riskFlags": [],
    "status": "rookie_observed",
    "note": "2026-05-19 cron: transcript 1/1 확보"
  },
  {
    "id": "src-item",
    "name": "머니인사이드",
    "url": "channel-transcripts",
    "discoveryPath": "daily_cron_channel_transcripts",
    "requestCount": 0,
    "recentContentCount": 1,
    "relevanceScore": 65,
    "duplicateRisk": "low",
    "riskFlags": [],
    "status": "rookie_observed",
    "note": "2026-05-19 cron: transcript 1/1 확보"
  },
  {
    "id": "src-item",
    "name": "미국주식으로 은퇴하기 - 미주은",
    "url": "channel-transcripts",
    "discoveryPath": "daily_cron_channel_transcripts",
    "requestCount": 0,
    "recentContentCount": 1,
    "relevanceScore": 65,
    "duplicateRisk": "low",
    "riskFlags": [],
    "status": "rookie_observed",
    "note": "2026-05-19 cron: transcript 1/1 확보"
  },
  {
    "id": "src-tv",
    "name": "박곰희TV",
    "url": "channel-transcripts",
    "discoveryPath": "daily_cron_channel_transcripts",
    "requestCount": 0,
    "recentContentCount": 1,
    "relevanceScore": 65,
    "duplicateRisk": "low",
    "riskFlags": [],
    "status": "rookie_observed",
    "note": "2026-05-19 cron: transcript 1/1 확보"
  },
  {
    "id": "src-item",
    "name": "비하이브 투자자문",
    "url": "channel-transcripts",
    "discoveryPath": "daily_cron_channel_transcripts",
    "requestCount": 0,
    "recentContentCount": 1,
    "relevanceScore": 65,
    "duplicateRisk": "low",
    "riskFlags": [],
    "status": "rookie_observed",
    "note": "2026-05-19 cron: transcript 1/1 확보"
  },
  {
    "id": "src-tv-3protv",
    "name": "삼프로TV 3PROTV",
    "url": "channel-transcripts",
    "discoveryPath": "daily_cron_channel_transcripts",
    "requestCount": 0,
    "recentContentCount": 1,
    "relevanceScore": 45,
    "duplicateRisk": "low",
    "riskFlags": [
      "반복 transcript 결손"
    ],
    "status": "exclude_candidate",
    "note": "2026-05-19 cron: transcript 0/1 확보"
  },
  {
    "id": "src-item",
    "name": "소수몽키",
    "url": "channel-transcripts",
    "discoveryPath": "daily_cron_channel_transcripts",
    "requestCount": 0,
    "recentContentCount": 1,
    "relevanceScore": 65,
    "duplicateRisk": "low",
    "riskFlags": [],
    "status": "rookie_observed",
    "note": "2026-05-19 cron: transcript 1/1 확보"
  },
  {
    "id": "src-item",
    "name": "시윤주식",
    "url": "channel-transcripts",
    "discoveryPath": "daily_cron_channel_transcripts",
    "requestCount": 0,
    "recentContentCount": 1,
    "relevanceScore": 65,
    "duplicateRisk": "low",
    "riskFlags": [],
    "status": "rookie_observed",
    "note": "2026-05-19 cron: transcript 1/1 확보"
  },
  {
    "id": "src-item",
    "name": "신사임당",
    "url": "channel-transcripts",
    "discoveryPath": "daily_cron_channel_transcripts",
    "requestCount": 0,
    "recentContentCount": 1,
    "relevanceScore": 65,
    "duplicateRisk": "low",
    "riskFlags": [],
    "status": "rookie_observed",
    "note": "2026-05-19 cron: transcript 1/1 확보"
  },
  {
    "id": "src-item",
    "name": "와이스트릿 - 지식과 자산의 복리효과",
    "url": "channel-transcripts",
    "discoveryPath": "daily_cron_channel_transcripts",
    "requestCount": 0,
    "recentContentCount": 1,
    "relevanceScore": 65,
    "duplicateRisk": "low",
    "riskFlags": [],
    "status": "rookie_observed",
    "note": "2026-05-19 cron: transcript 1/1 확보"
  },
  {
    "id": "src-item",
    "name": "이효석아카데미",
    "url": "channel-transcripts",
    "discoveryPath": "daily_cron_channel_transcripts",
    "requestCount": 0,
    "recentContentCount": 1,
    "relevanceScore": 65,
    "duplicateRisk": "low",
    "riskFlags": [],
    "status": "rookie_observed",
    "note": "2026-05-19 cron: transcript 1/1 확보"
  },
  {
    "id": "src-item",
    "name": "주식장인",
    "url": "channel-transcripts",
    "discoveryPath": "daily_cron_channel_transcripts",
    "requestCount": 0,
    "recentContentCount": 1,
    "relevanceScore": 65,
    "duplicateRisk": "low",
    "riskFlags": [],
    "status": "rookie_observed",
    "note": "2026-05-19 cron: transcript 1/1 확보"
  },
  {
    "id": "src-tv",
    "name": "증시각도기TV",
    "url": "channel-transcripts",
    "discoveryPath": "daily_cron_channel_transcripts",
    "requestCount": 0,
    "recentContentCount": 1,
    "relevanceScore": 65,
    "duplicateRisk": "low",
    "riskFlags": [],
    "status": "rookie_observed",
    "note": "2026-05-19 cron: transcript 1/1 확보"
  },
  {
    "id": "src-item",
    "name": "지식인사이드",
    "url": "channel-transcripts",
    "discoveryPath": "daily_cron_channel_transcripts",
    "requestCount": 0,
    "recentContentCount": 1,
    "relevanceScore": 65,
    "duplicateRisk": "low",
    "riskFlags": [],
    "status": "rookie_observed",
    "note": "2026-05-19 cron: transcript 1/1 확보"
  },
  {
    "id": "src-tv",
    "name": "하승훈의 주식투자TV",
    "url": "channel-transcripts",
    "discoveryPath": "daily_cron_channel_transcripts",
    "requestCount": 0,
    "recentContentCount": 1,
    "relevanceScore": 65,
    "duplicateRisk": "low",
    "riskFlags": [],
    "status": "rookie_observed",
    "note": "2026-05-19 cron: transcript 1/1 확보"
  },
  {
    "id": "src-tv",
    "name": "한국경제TV",
    "url": "channel-transcripts",
    "discoveryPath": "daily_cron_channel_transcripts",
    "requestCount": 0,
    "recentContentCount": 1,
    "relevanceScore": 45,
    "duplicateRisk": "low",
    "riskFlags": [
      "반복 transcript 결손"
    ],
    "status": "exclude_candidate",
    "note": "2026-05-19 cron: transcript 0/1 확보"
  }
];

const contentCandidates = [
  {
    "id": "cnt-6L3Kw6KERVA",
    "title": "금값, 은값 앞으로 진짜 무섭다, 가진 금, 은 싹다 '이렇게' 하세요 (금남일 대표)",
    "channel": "김작가 TV",
    "publishedText": "2026-05-19",
    "sourceUrl": "https://www.youtube.com/watch?v=6L3Kw6KERVA",
    "scrapeMethod": "Apify starvibe/youtube-video-transcript",
    "relevanceScore": 70,
    "keywords": [
      "transcript 확보"
    ],
    "status": "needs_review"
  },
  {
    "id": "cnt-EbndGKoRi3c",
    "title": "[5월20일 #장시작전] 미 국채금리 급등에 뉴욕증시 하락, 마이크론은 2.5% 반등 / 삼성전자 오늘 10시 최종담판, 총파업 갈림길",
    "channel": "815머니톡",
    "publishedText": "2026-05-20",
    "sourceUrl": "https://www.youtube.com/watch?v=EbndGKoRi3c",
    "scrapeMethod": "Apify starvibe/youtube-video-transcript",
    "relevanceScore": 45,
    "keywords": [
      "transcript 미확보"
    ],
    "status": "needs_transcript_review"
  },
  {
    "id": "cnt-0ysTvNCxoTk",
    "title": "19년만에 최고 금리 달성으로 흔들리는 뉴욕증시 | 굿모닝작전_260520",
    "channel": "한국경제TV",
    "publishedText": "2026-05-20",
    "sourceUrl": "https://www.youtube.com/watch?v=0ysTvNCxoTk",
    "scrapeMethod": "Apify starvibe/youtube-video-transcript",
    "relevanceScore": 45,
    "keywords": [
      "transcript 미확보"
    ],
    "status": "needs_transcript_review"
  },
  {
    "id": "cnt-OtKtA90rvGk",
    "title": "2차전지 다 끝났다는 역대급 매도 리포트의 소름 돋는 모순 폭로합니다 | 윤석천 경제평론가",
    "channel": "E트렌드",
    "publishedText": "2026-05-20",
    "sourceUrl": "https://www.youtube.com/watch?v=OtKtA90rvGk",
    "scrapeMethod": "Apify starvibe/youtube-video-transcript",
    "relevanceScore": 70,
    "keywords": [
      "transcript 확보"
    ],
    "status": "needs_review"
  },
  {
    "id": "cnt-4E1XcOEZWyg",
    "title": "주식 투자 기준이 내가 되면 안되는 이유 1편  |  미국 주식으로 은퇴하기",
    "channel": "미국주식으로 은퇴하기 - 미주은",
    "publishedText": "2026-05-19",
    "sourceUrl": "https://www.youtube.com/watch?v=4E1XcOEZWyg",
    "scrapeMethod": "Apify starvibe/youtube-video-transcript",
    "relevanceScore": 70,
    "keywords": [
      "transcript 확보"
    ],
    "status": "needs_review"
  },
  {
    "id": "cnt-zjnKEmJgNHY",
    "title": "트럼프 최측근의 은밀한 매수, 역발상 베팅 적중할까",
    "channel": "소수몽키",
    "publishedText": "2026-05-19",
    "sourceUrl": "https://www.youtube.com/watch?v=zjnKEmJgNHY",
    "scrapeMethod": "Apify starvibe/youtube-video-transcript",
    "relevanceScore": 70,
    "keywords": [
      "transcript 확보"
    ],
    "status": "needs_review"
  },
  {
    "id": "cnt-tfVQMsCvDNE",
    "title": "양자 컴퓨터 시대의 수혜주 의외로 정답은 여기에 있습니다ㅣ정지훈 박사 [2부]",
    "channel": "이효석아카데미",
    "publishedText": "2026-05-19",
    "sourceUrl": "https://www.youtube.com/watch?v=tfVQMsCvDNE",
    "scrapeMethod": "Apify starvibe/youtube-video-transcript",
    "relevanceScore": 70,
    "keywords": [
      "transcript 확보"
    ],
    "status": "needs_review"
  },
  {
    "id": "cnt-VXzEHmW-M0A",
    "title": "지수보다 강한 종목. 이게 강함의 증거다.",
    "channel": "하승훈의 주식투자TV",
    "publishedText": "2026-05-19",
    "sourceUrl": "https://www.youtube.com/watch?v=VXzEHmW-M0A",
    "scrapeMethod": "Apify starvibe/youtube-video-transcript",
    "relevanceScore": 70,
    "keywords": [
      "transcript 확보"
    ],
    "status": "needs_review"
  },
  {
    "id": "cnt-4WgJaE7bEuQ",
    "title": "높은 금리 부담 속 뉴욕증시 하락 마감...마이크론·인텔 '상승', 왜?_26.05.20 | 여도은, 박명석, 김효진 [월스트리트 모닝브리핑]",
    "channel": "삼프로TV 3PROTV",
    "publishedText": "2026-05-20",
    "sourceUrl": "https://www.youtube.com/watch?v=4WgJaE7bEuQ",
    "scrapeMethod": "Apify starvibe/youtube-video-transcript",
    "relevanceScore": 45,
    "keywords": [
      "transcript 미확보"
    ],
    "status": "needs_transcript_review"
  },
  {
    "id": "cnt-Wp8XjI-5nbE",
    "title": "홈디포, 컨센서스 상회 호실적 상승ㅣ구글-블랙스톤, 37조원 'TPU 전용' 합작 법인 설립ㅣ메타, 이번주부터 8000명 감원 시작ㅣ홍키자의 매일뉴욕",
    "channel": "매경 월가월부",
    "publishedText": "2026-05-19",
    "sourceUrl": "https://www.youtube.com/watch?v=Wp8XjI-5nbE",
    "scrapeMethod": "Apify starvibe/youtube-video-transcript",
    "relevanceScore": 70,
    "keywords": [
      "transcript 확보"
    ],
    "status": "needs_review"
  },
  {
    "id": "cnt-qgyTPPFm1v0",
    "title": "\"선진국 됐어도 짠돌이\" 한국은 절대 이해 못한다 #선진국 #한국 #최준영",
    "channel": "와이스트릿 - 지식과 자산의 복리효과",
    "publishedText": "2026-05-20",
    "sourceUrl": "https://www.youtube.com/watch?v=qgyTPPFm1v0",
    "scrapeMethod": "Apify starvibe/youtube-video-transcript",
    "relevanceScore": 70,
    "keywords": [
      "transcript 확보"
    ],
    "status": "needs_review"
  },
  {
    "id": "cnt-AqA6_Zh6yi4",
    "title": "\"물가상승과 경기침체는 기정사실입니다\" 30년 세계 무역질서가 완전히 무너진 이유  | 홍기빈 글로벌정치경제연구소 소장 #2 [도기 아카데미]",
    "channel": "증시각도기TV",
    "publishedText": "2026-05-19",
    "sourceUrl": "https://www.youtube.com/watch?v=AqA6_Zh6yi4",
    "scrapeMethod": "Apify starvibe/youtube-video-transcript",
    "relevanceScore": 70,
    "keywords": [
      "transcript 확보"
    ],
    "status": "needs_review"
  },
  {
    "id": "cnt-mE2Bf653hNc",
    "title": "진통 겪는 삼성전자 노사 협상｜매경1면｜숏클립",
    "channel": "매경 자이앤트",
    "publishedText": "2026-05-19",
    "sourceUrl": "https://www.youtube.com/watch?v=mE2Bf653hNc",
    "scrapeMethod": "Apify starvibe/youtube-video-transcript",
    "relevanceScore": 70,
    "keywords": [
      "transcript 확보"
    ],
    "status": "needs_review"
  },
  {
    "id": "cnt-EhAZDYKKcVg",
    "title": "혹시 국수 이름 아시는 분? 🍜",
    "channel": "LS증권",
    "publishedText": "2026-05-19",
    "sourceUrl": "https://www.youtube.com/watch?v=EhAZDYKKcVg",
    "scrapeMethod": "Apify starvibe/youtube-video-transcript",
    "relevanceScore": 70,
    "keywords": [
      "transcript 확보"
    ],
    "status": "needs_review"
  },
  {
    "id": "cnt-nu5qx62mgoM",
    "title": "✨오늘의 종목 탑3✨Q. 증권가에서 지금 가장 많이 읽은 레포트는? #주식 #주식공부 #투자 #한국주식",
    "channel": "DB증권 더블",
    "publishedText": "2026-05-19",
    "sourceUrl": "https://www.youtube.com/watch?v=nu5qx62mgoM",
    "scrapeMethod": "Apify starvibe/youtube-video-transcript",
    "relevanceScore": 45,
    "keywords": [
      "transcript 미확보"
    ],
    "status": "needs_transcript_review"
  },
  {
    "id": "cnt-MlGiWH-mXc4",
    "title": "[🍯 주식시황 ] 마지막 희망 젠슨 황 어(혀)닝콜",
    "channel": "비하이브 투자자문",
    "publishedText": "2026-05-20",
    "sourceUrl": "https://www.youtube.com/watch?v=MlGiWH-mXc4",
    "scrapeMethod": "Apify starvibe/youtube-video-transcript",
    "relevanceScore": 70,
    "keywords": [
      "transcript 확보"
    ],
    "status": "needs_review"
  },
  {
    "id": "cnt-24wJEyYNz2w",
    "title": "\"남은 인생부터 술술풀린다\" 50대, 지나간 운도 잡아채는 사람의 공통점? (강기진 소장 / 2부)",
    "channel": "신사임당",
    "publishedText": "2026-05-19",
    "sourceUrl": "https://www.youtube.com/watch?v=24wJEyYNz2w",
    "scrapeMethod": "Apify starvibe/youtube-video-transcript",
    "relevanceScore": 70,
    "keywords": [
      "transcript 확보"
    ],
    "status": "needs_review"
  },
  {
    "id": "cnt--BOuXTnmkIU",
    "title": "요즘 90년생들이 돈 절대 모을 수 없는 이유ㅣ대외비 EP.21",
    "channel": "지식인사이드",
    "publishedText": "2026-05-19",
    "sourceUrl": "https://www.youtube.com/watch?v=-BOuXTnmkIU",
    "scrapeMethod": "Apify starvibe/youtube-video-transcript",
    "relevanceScore": 70,
    "keywords": [
      "transcript 확보"
    ],
    "status": "needs_review"
  },
  {
    "id": "cnt-kZBPrLVWdUc",
    "title": "\"이건 역사적으로 증명됐어요\" 한국인이 유독 기가 센 이유 (박정재 교수 1부) I 머니포커스",
    "channel": "머니인사이드",
    "publishedText": "2026-05-19",
    "sourceUrl": "https://www.youtube.com/watch?v=kZBPrLVWdUc",
    "scrapeMethod": "Apify starvibe/youtube-video-transcript",
    "relevanceScore": 70,
    "keywords": [
      "transcript 확보"
    ],
    "status": "needs_review"
  },
  {
    "id": "cnt-PVnfJs__T30",
    "title": "피지컬 AI 경쟁 이미 끝났다 이 주식이 3년내 씹어먹는다 | 김덕진 소장 2부",
    "channel": "달란트투자",
    "publishedText": "2026-05-19",
    "sourceUrl": "https://www.youtube.com/watch?v=PVnfJs__T30",
    "scrapeMethod": "Apify starvibe/youtube-video-transcript",
    "relevanceScore": 70,
    "keywords": [
      "transcript 확보"
    ],
    "status": "needs_review"
  },
  {
    "id": "cnt-mRRev963GaA",
    "title": "📈 앞으로 어떻게 투자를 해야 할까? | 코스피 1만 투자지도ㅣ효라클님ㅣ특별한 만남",
    "channel": "박곰희TV",
    "publishedText": "2026-05-17",
    "sourceUrl": "https://www.youtube.com/watch?v=mRRev963GaA",
    "scrapeMethod": "Apify starvibe/youtube-video-transcript",
    "relevanceScore": 70,
    "keywords": [
      "transcript 확보"
    ],
    "status": "needs_review"
  },
  {
    "id": "cnt-Wq4SQ2Qkqxo",
    "title": "#삼성전자 #하이닉스 떡락 이유 (5월 19일)",
    "channel": "내일은 투자왕 - 김단테",
    "publishedText": "2026-05-19",
    "sourceUrl": "https://www.youtube.com/watch?v=Wq4SQ2Qkqxo",
    "scrapeMethod": "Apify starvibe/youtube-video-transcript",
    "relevanceScore": 70,
    "keywords": [
      "transcript 확보"
    ],
    "status": "needs_review"
  },
  {
    "id": "cnt-VLBE1ouzmCE",
    "title": "코스피 폭등 중인데 숏이요?",
    "channel": "강민우 돈깡TV",
    "publishedText": "2026-05-19",
    "sourceUrl": "https://www.youtube.com/watch?v=VLBE1ouzmCE",
    "scrapeMethod": "Apify starvibe/youtube-video-transcript",
    "relevanceScore": 70,
    "keywords": [
      "transcript 확보"
    ],
    "status": "needs_review"
  },
  {
    "id": "cnt-sXtqu672KIw",
    "title": "NXT 프리마켓 매매 꿀팁",
    "channel": "대왕개미 홍인기",
    "publishedText": "2026-05-19",
    "sourceUrl": "https://www.youtube.com/watch?v=sXtqu672KIw",
    "scrapeMethod": "Apify starvibe/youtube-video-transcript",
    "relevanceScore": 70,
    "keywords": [
      "transcript 확보"
    ],
    "status": "needs_review"
  },
  {
    "id": "cnt-iP9ZbqLRYKE",
    "title": "위기가 생겼지만 아직은 상승장으로 보겠습니다 #마감시황",
    "channel": "시윤주식",
    "publishedText": "2026-05-18",
    "sourceUrl": "https://www.youtube.com/watch?v=iP9ZbqLRYKE",
    "scrapeMethod": "Apify starvibe/youtube-video-transcript",
    "relevanceScore": 70,
    "keywords": [
      "transcript 확보"
    ],
    "status": "needs_review"
  },
  {
    "id": "cnt-h5Jt-db71EM",
    "title": "외국인의 코스피 폭탄매도 하락은 기회다, 현대차와 '이 주식' 바닥에서 사모으면 무섭게 오를 겁니다 [인생주식]",
    "channel": "주식장인",
    "publishedText": "2026-05-19",
    "sourceUrl": "https://www.youtube.com/watch?v=h5Jt-db71EM",
    "scrapeMethod": "Apify starvibe/youtube-video-transcript",
    "relevanceScore": 70,
    "keywords": [
      "transcript 확보"
    ],
    "status": "needs_review"
  }
];

const extractionReviewItems = [
  {
    "id": "rev-34b79d0c043bae34",
    "contentId": "cnt-4E1XcOEZWyg",
    "title": "주식 투자 기준이 내가 되면 안되는 이유 1편  |  미국 주식으로 은퇴하기",
    "channel": "미국주식으로 은퇴하기 - 미주은",
    "asset": "마이크론 / MU",
    "contributor": "unknown",
    "stance": "BEAR",
    "quote": "마이크론을 제가 어, 1차 매도한게",
    "confidence": 0.58,
    "impactScore": 66,
    "uncertaintyScore": 72,
    "entityImportanceScore": 80,
    "freshnessScore": 95,
    "userDemandScore": 65,
    "status": "pending_review",
    "reason": "Rule-based v0.1 후보입니다. 사람 검수 전에는 verified claim, 성과, 리그 점수에 반영하지 않습니다."
  },
  {
    "id": "rev-7163ee5aa4dc55ea",
    "contentId": "cnt-zjnKEmJgNHY",
    "title": "트럼프 최측근의 은밀한 매수, 역발상 베팅 적중할까",
    "channel": "소수몽키",
    "asset": "마이크로소프트 / MSFT",
    "contributor": "unknown",
    "stance": "BULL",
    "quote": "마이크로소프트 집중 매수했습니다.",
    "confidence": 0.58,
    "impactScore": 76,
    "uncertaintyScore": 72,
    "entityImportanceScore": 80,
    "freshnessScore": 95,
    "userDemandScore": 65,
    "status": "pending_review",
    "reason": "Rule-based v0.1 후보입니다. 사람 검수 전에는 verified claim, 성과, 리그 점수에 반영하지 않습니다."
  },
  {
    "id": "rev-9575fb24ea32f7a1",
    "contentId": "cnt-zjnKEmJgNHY",
    "title": "트럼프 최측근의 은밀한 매수, 역발상 베팅 적중할까",
    "channel": "소수몽키",
    "asset": "구글 / GOOGL",
    "contributor": "unknown",
    "stance": "BULL",
    "quote": "2023년에 구글을 매수했었어요.",
    "confidence": 0.58,
    "impactScore": 76,
    "uncertaintyScore": 72,
    "entityImportanceScore": 80,
    "freshnessScore": 95,
    "userDemandScore": 65,
    "status": "pending_review",
    "reason": "Rule-based v0.1 후보입니다. 사람 검수 전에는 verified claim, 성과, 리그 점수에 반영하지 않습니다."
  },
  {
    "id": "rev-8491657a00e4e6d0",
    "contentId": "cnt-Wp8XjI-5nbE",
    "title": "홈디포, 컨센서스 상회 호실적 상승ㅣ구글-블랙스톤, 37조원 'TPU 전용' 합작 법인 설립ㅣ메타, 이번주부터 8000명 감원 시작ㅣ홍키자의 매일뉴욕",
    "channel": "매경 월가월부",
    "asset": "테슬라 / TSLA",
    "contributor": "unknown",
    "stance": "BEAR",
    "quote": "하락하고 있는데 지금 어 테슬라를",
    "confidence": 0.58,
    "impactScore": 66,
    "uncertaintyScore": 72,
    "entityImportanceScore": 80,
    "freshnessScore": 95,
    "userDemandScore": 65,
    "status": "pending_review",
    "reason": "Rule-based v0.1 후보입니다. 사람 검수 전에는 verified claim, 성과, 리그 점수에 반영하지 않습니다."
  },
  {
    "id": "rev-74c078e8806892d1",
    "contentId": "cnt-mRRev963GaA",
    "title": "📈 앞으로 어떻게 투자를 해야 할까? | 코스피 1만 투자지도ㅣ효라클님ㅣ특별한 만남",
    "channel": "박곰희TV",
    "asset": "삼성전자 / 005930",
    "contributor": "unknown",
    "stance": "BULL",
    "quote": ">> 삼성전자 SK 사도 되나요? 막",
    "confidence": 0.58,
    "impactScore": 76,
    "uncertaintyScore": 72,
    "entityImportanceScore": 74,
    "freshnessScore": 95,
    "userDemandScore": 65,
    "status": "pending_review",
    "reason": "Rule-based v0.1 후보입니다. 사람 검수 전에는 verified claim, 성과, 리그 점수에 반영하지 않습니다."
  },
  {
    "id": "rev-ff9ce9eb7908b922",
    "contentId": "cnt-mRRev963GaA",
    "title": "📈 앞으로 어떻게 투자를 해야 할까? | 코스피 1만 투자지도ㅣ효라클님ㅣ특별한 만남",
    "channel": "박곰희TV",
    "asset": "SK하이닉스 / 000660",
    "contributor": "unknown",
    "stance": "BULL",
    "quote": "하이닉스 지금 사도 되나요? 이런",
    "confidence": 0.58,
    "impactScore": 76,
    "uncertaintyScore": 72,
    "entityImportanceScore": 74,
    "freshnessScore": 95,
    "userDemandScore": 65,
    "status": "pending_review",
    "reason": "Rule-based v0.1 후보입니다. 사람 검수 전에는 verified claim, 성과, 리그 점수에 반영하지 않습니다."
  }
];

const adminMetrics = {
  "newSourceCandidates": 26,
  "autoIncludedContent": 22,
  "needsReviewContent": 26,
  "extractionPending": 6,
  "channelRequests": 0,
  "promotionCandidates": 0,
  "demotionRisks": 0,
  "cautionCandidates": 4,
  "reportStatus": "Draft",
  "algorithmVersion": "league-ranking-v0.1",
  "complianceBasis": "공개 콘텐츠 발언 기준, 투자 권유가 아닙니다."
};

const publishChecklist = [
  {
    "id": "pc-evidence",
    "label": "근거 발언과 sourceUrl 확인",
    "done": false
  },
  {
    "id": "pc-wording",
    "label": "투자 권유 오해 방지 문구 확인",
    "done": true
  },
  {
    "id": "pc-caution",
    "label": "Transcript 결손 채널 별도 검토",
    "done": false
  },
  {
    "id": "pc-sample",
    "label": "표본 수와 기간 제한 표시",
    "done": true
  },
  {
    "id": "pc-final",
    "label": "주간 리포트 최종 승인",
    "done": false
  }
];

const algorithmMonitor = {
  "activeVersion": "league-ranking-v0.1",
  "shadowVersion": "content-pick-extraction-v0.1",
  "lastRunAt": "2026-05-19 22:03 UTC / 2026-05-20 07:03 KST",
  "health": "watch",
  "checks": [
    {
      "id": "alg-seed-verified",
      "label": "후보와 검증 claim 분리",
      "status": "pass"
    },
    {
      "id": "alg-no-backtest",
      "label": "사람 검수 전 성과/리그 미반영",
      "status": "pass"
    },
    {
      "id": "alg-transcript-missing",
      "label": "반복 transcript 결손 채널 watch",
      "status": "watch"
    },
    {
      "id": "alg-copy",
      "label": "컴플라이언스 문구 누락 검사",
      "status": "pass"
    }
  ]
};

const pmfGrowthSignals = [
  {
    "id": "pmf-review-load",
    "label": "검수 큐 후보",
    "value": 6,
    "insight": "오늘 cron 후보를 관리자 검수 우선순위로 연결"
  },
  {
    "id": "pmf-transcript-ready",
    "label": "Transcript 확보",
    "value": 22,
    "insight": "후보 추출 가능 영상 수"
  },
  {
    "id": "pmf-exclusion",
    "label": "결손 채널",
    "value": 4,
    "insight": "반복 transcript 결손 채널은 소스 품질 검토"
  }
];

const auditLog = [
  {
    "id": "aud-cron-20260519",
    "at": "2026-05-19 22:03 UTC / 2026-05-20 07:03 KST",
    "actor": "daily-cron",
    "action": "ingest",
    "targetId": "daily-youtube-transcripts-220026",
    "note": "26 videos, 6 claim candidates, 4 transcript-missing exclusion candidates"
  }
];

const weeklyReport = {
  "period": "2026-05-19 cron 후보 리포트",
  "shareText": "2026-05-19 cron 수집분: 영상 26건, 후보 claim 6건, transcript 확보 22건. 사람 검수 전이며 투자 권유가 아닙니다."
};

module.exports = {
  sourceCandidates,
  contentCandidates,
  extractionReviewItems,
  adminMetrics,
  publishChecklist,
  algorithmMonitor,
  pmfGrowthSignals,
  auditLog,
  weeklyReport,
  leagueItems: [...channelLeagues, ...panelLeagues],
};
