const { calculateLeagueScore, assignLeague, getPromotionStatus, LEAGUE_ALGORITHM_VERSION } = require('../lib/leagueScoring');

const channelMetricInputs = [
  { id: 'kim', entityType: 'channel', name: '김작가 TV', currentLeague: 'Major', pickCount: 24, return1w: 2.4, return1m: 4.1, return3m: 5.2, hitRate: 0.75, flatRate: 0.15, missRate: 0.10, approvedPickRate: 0.92, explicitStanceRate: 0.86, quoteEvidenceRate: 0.88, ambiguityRate: 0.18, contradictionRate: 0.02, daysSinceLastPick: 2, maxDrawdownPct: -11, hypeRate: 0.12, repeatedAssetRate: 0.18, sponsorConflictRate: 0.03, sectorConsistencyRate: 0.72, severeRiskFlag: false, consecutivePromotionSignals: 1, consecutiveDemotionSignals: 0 },
  { id: 'sinsa', entityType: 'channel', name: '신사임당', currentLeague: 'Minor', pickCount: 13, return1w: 1.8, return1m: 3.6, return3m: 4.18, hitRate: 0.67, flatRate: 0.20, missRate: 0.13, approvedPickRate: 0.88, explicitStanceRate: 0.81, quoteEvidenceRate: 0.90, ambiguityRate: 0.22, contradictionRate: 0.03, daysSinceLastPick: 8, maxDrawdownPct: -13, hypeRate: 0.10, repeatedAssetRate: 0.16, sponsorConflictRate: 0.02, sectorConsistencyRate: 0.70, severeRiskFlag: false, consecutivePromotionSignals: 1, consecutiveDemotionSignals: 0 },
];

const panelMetricInputs = [
  { id: 'yeom', entityType: 'panel', name: '염승환 이사', currentLeague: 'Major', pickCount: 21, return1w: 2.6, return1m: 4.5, return3m: 5.8, hitRate: 0.68, flatRate: 0.2, missRate: 0.12, approvedPickRate: 0.94, explicitStanceRate: 0.88, quoteEvidenceRate: 0.9, ambiguityRate: 0.12, contradictionRate: 0.02, daysSinceLastPick: 2, maxDrawdownPct: -10, hypeRate: 0.08, repeatedAssetRate: 0.18, sponsorConflictRate: 0, sectorConsistencyRate: 0.82, severeRiskFlag: false, consecutivePromotionSignals: 1, consecutiveDemotionSignals: 0 },
  { id: 'leeanna', entityType: 'panel', name: '이안나 부센터장', currentLeague: 'Minor', pickCount: 9, return1w: 1.2, return1m: 2.1, return3m: 3.3, hitRate: 0.58, flatRate: 0.24, missRate: 0.18, approvedPickRate: 0.86, explicitStanceRate: 0.83, quoteEvidenceRate: 0.88, ambiguityRate: 0.2, contradictionRate: 0.02, daysSinceLastPick: 3, maxDrawdownPct: -12, hypeRate: 0.1, repeatedAssetRate: 0.2, sponsorConflictRate: 0, sectorConsistencyRate: 0.78, severeRiskFlag: false, consecutivePromotionSignals: 0, consecutiveDemotionSignals: 0 },
  { id: 'sinsa-host', entityType: 'panel', name: '신사임당 진행자', currentLeague: 'Minor', pickCount: 12, return1w: 2.0, return1m: 3.8, return3m: 4.8, hitRate: 0.64, flatRate: 0.2, missRate: 0.16, approvedPickRate: 0.9, explicitStanceRate: 0.82, quoteEvidenceRate: 0.92, ambiguityRate: 0.18, contradictionRate: 0.02, daysSinceLastPick: 8, maxDrawdownPct: -11, hypeRate: 0.09, repeatedAssetRate: 0.16, sponsorConflictRate: 0.02, sectorConsistencyRate: 0.76, severeRiskFlag: false, consecutivePromotionSignals: 2, consecutiveDemotionSignals: 0 },
  { id: 'sinsa-guest', entityType: 'panel', name: '신사임당 게스트', currentLeague: 'Rookie', pickCount: 6, return1w: -0.5, return1m: 1.2, return3m: 2.0, hitRate: 0.5, flatRate: 0.25, missRate: 0.25, approvedPickRate: 0.78, explicitStanceRate: 0.72, quoteEvidenceRate: 0.82, ambiguityRate: 0.28, contradictionRate: 0.05, daysSinceLastPick: 16, maxDrawdownPct: -16, hypeRate: 0.13, repeatedAssetRate: 0.22, sponsorConflictRate: 0.01, sectorConsistencyRate: 0.62, severeRiskFlag: false, consecutivePromotionSignals: 0, consecutiveDemotionSignals: 2 },
  { id: 'anonymous', entityType: 'panel', name: '익명 패널', currentLeague: 'Minor', pickCount: 7, return1w: -4, return1m: -7, return3m: -12, hitRate: 0.2, flatRate: 0.1, missRate: 0.7, approvedPickRate: 0.45, explicitStanceRate: 0.55, quoteEvidenceRate: 0.5, ambiguityRate: 0.58, contradictionRate: 0.22, daysSinceLastPick: 33, maxDrawdownPct: -31, hypeRate: 0.5, repeatedAssetRate: 0.48, sponsorConflictRate: 0.18, sectorConsistencyRate: 0.18, severeRiskFlag: true, consecutivePromotionSignals: 0, consecutiveDemotionSignals: 2 },
];

function enrich(input) {
  const scoreResult = calculateLeagueScore(input);
  return { ...input, ...scoreResult, league: assignLeague(input, scoreResult.score), promotionStatus: getPromotionStatus(input, scoreResult.score) };
}

const channelLeagues = channelMetricInputs.map(enrich);
const panelLeagues = panelMetricInputs.map(enrich);

module.exports = { LEAGUE_ALGORITHM_VERSION, channelMetricInputs, panelMetricInputs, channelLeagues, panelLeagues };
