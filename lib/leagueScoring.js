const LEAGUE_ALGORITHM_VERSION = 'league-ranking-v0.1';

const DEFAULT_WEIGHTS = Object.freeze({
  performance: 0.35,
  reliability: 0.20,
  clarity: 0.15,
  sample: 0.10,
  recency: 0.10,
  risk: 0.10,
});

function clamp(value, min = 0, max = 100) {
  return Math.min(max, Math.max(min, Number.isFinite(Number(value)) ? Number(value) : 0));
}

function round(value, digits = 2) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function scoreReturn(returnPct) {
  return clamp(50 + Number(returnPct || 0) * 5, 0, 100);
}

function calculatePerformanceRaw(metrics = {}) {
  return round(
    scoreReturn(metrics.return1w || 0) * 0.20 +
    scoreReturn(metrics.return1m || 0) * 0.30 +
    scoreReturn(metrics.return3m || 0) * 0.50
  );
}

function calculateReliabilityRaw(metrics = {}) {
  return round(clamp((metrics.hitRate || 0) * 100 + (metrics.flatRate || 0) * 50));
}

function calculateClarityRaw(metrics = {}) {
  return round(clamp(
    (metrics.approvedPickRate || 0) * 70 +
    (metrics.explicitStanceRate || 0) * 20 +
    (metrics.quoteEvidenceRate || 0) * 10 -
    (metrics.ambiguityRate || 0) * 40 -
    (metrics.contradictionRate || 0) * 30
  ));
}

function calculateSampleRaw(pickCount) {
  return round(clamp(Math.sqrt((pickCount || 0) / 30) * 100));
}

function calculateRecencyRaw(daysSinceLastPick) {
  return round(clamp(100 - (daysSinceLastPick || 0) * 2));
}

function calculateRiskRaw(metrics = {}) {
  const maxDrawdownPenalty = clamp(Math.abs(metrics.maxDrawdownPct || 0) * 2, 0, 30);
  const hypePenalty = clamp((metrics.hypeRate || 0) * 20, 0, 20);
  const pumpPenalty = clamp((metrics.repeatedAssetRate || 0) * 15, 0, 15);
  const sponsorPenalty = clamp((metrics.sponsorConflictRate || 0) * 25, 0, 25);
  const sectorExpertiseBonus = clamp((metrics.sectorConsistencyRate || 0) * 10, 0, 10);
  return round(clamp(100 - maxDrawdownPenalty - hypePenalty - pumpPenalty - sponsorPenalty + sectorExpertiseBonus));
}

function calculateLeagueScore(metrics = {}, weights = DEFAULT_WEIGHTS) {
  const raw = {
    performance: calculatePerformanceRaw(metrics),
    reliability: calculateReliabilityRaw(metrics),
    clarity: calculateClarityRaw(metrics),
    sample: calculateSampleRaw(metrics.pickCount),
    recency: calculateRecencyRaw(metrics.daysSinceLastPick),
    risk: calculateRiskRaw(metrics),
  };
  const breakdown = Object.fromEntries(Object.entries(raw).map(([key, value]) => [
    key,
    { raw: value, weight: weights[key], points: round(value * weights[key]) },
  ]));
  const score = round(Object.values(breakdown).reduce((sum, item) => sum + item.points, 0));
  return { algorithmVersion: LEAGUE_ALGORITHM_VERSION, score, raw, breakdown, evaluatedAt: '2026-05-05' };
}

function isCaution(metrics = {}, score) {
  return Boolean(metrics.severeRiskFlag)
    || score < 40
    || (metrics.missRate || 0) >= 0.45
    || (metrics.ambiguityRate || 0) >= 0.5
    || (metrics.maxDrawdownPct || 0) <= -25;
}

function assignLeague(metrics = {}, score) {
  if (isCaution(metrics, score)) return 'Caution Watch';
  if ((metrics.pickCount || 0) < 5) return 'Rookie';
  if (score >= 85 && (metrics.pickCount || 0) >= 30 && (metrics.hitRate || 0) >= 0.65) return 'Ace';
  if (score >= 70 && (metrics.pickCount || 0) >= 20 && (metrics.hitRate || 0) >= 0.55 && (metrics.ambiguityRate || 0) <= 0.30) return 'Major';
  if (score >= 45 && (metrics.pickCount || 0) >= 5) return 'Minor';
  return 'Rookie';
}

function getPromotionStatus(metrics = {}, score) {
  if (metrics.severeRiskFlag || isCaution(metrics, score)) return 'caution_review';
  if ((metrics.consecutivePromotionSignals || 0) >= 2) return 'promote_candidate';
  if ((metrics.consecutiveDemotionSignals || 0) >= 2) return 'demotion_risk';
  if ((metrics.consecutivePromotionSignals || 0) === 1 || (metrics.consecutiveDemotionSignals || 0) === 1) return 'watch';
  return 'stable';
}

module.exports = {
  LEAGUE_ALGORITHM_VERSION,
  DEFAULT_WEIGHTS,
  clamp,
  scoreReturn,
  calculatePerformanceRaw,
  calculateReliabilityRaw,
  calculateClarityRaw,
  calculateSampleRaw,
  calculateRecencyRaw,
  calculateRiskRaw,
  calculateLeagueScore,
  assignLeague,
  getPromotionStatus,
};
