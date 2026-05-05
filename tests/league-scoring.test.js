const assert = require('assert');
const {
  LEAGUE_ALGORITHM_VERSION,
  clamp,
  scoreReturn,
  calculatePerformanceRaw,
  calculateReliabilityRaw,
  calculateSampleRaw,
  calculateRecencyRaw,
  calculateRiskRaw,
  calculateLeagueScore,
  assignLeague,
  getPromotionStatus,
} = require('../lib/leagueScoring');

function test(name, fn) {
  try { fn(); console.log(`PASS ${name}`); }
  catch (e) { console.error(`FAIL ${name}\n${e.stack || e.message}`); process.exitCode = 1; }
}

test('exports versioned league algorithm', () => {
  assert.strictEqual(LEAGUE_ALGORITHM_VERSION, 'league-ranking-v0.1');
});

test('clamp and scoreReturn maps -10 to 0, 0 to 50, +10 to 100 with clamps', () => {
  assert.strictEqual(clamp(120), 100);
  assert.strictEqual(clamp(-5), 0);
  assert.strictEqual(scoreReturn(-20), 0);
  assert.strictEqual(scoreReturn(-10), 0);
  assert.strictEqual(scoreReturn(0), 50);
  assert.strictEqual(scoreReturn(10), 100);
  assert.strictEqual(scoreReturn(20), 100);
});

test('performance combines 1w 1m 3m returns with 20/30/50 weights', () => {
  const raw = calculatePerformanceRaw({ return1w: 2, return1m: 4, return3m: 6 });
  assert(raw > 65 && raw < 85);
});

test('reliability gives hit full credit and flat half credit', () => {
  assert.strictEqual(calculateReliabilityRaw({ hitRate: 0.6, flatRate: 0.2, missRate: 0.2 }), 70);
});

test('sample score gates low sample and reaches 100 around 30 picks', () => {
  assert(calculateSampleRaw(4) < calculateSampleRaw(20));
  assert.strictEqual(calculateSampleRaw(30), 100);
  assert.strictEqual(calculateSampleRaw(80), 100);
});

test('recency score decays by 2 points per day', () => {
  assert.strictEqual(calculateRecencyRaw(0), 100);
  assert.strictEqual(calculateRecencyRaw(10), 80);
  assert.strictEqual(calculateRecencyRaw(100), 0);
});

test('risk score penalizes drawdown hype pump and sponsor risk', () => {
  const safe = calculateRiskRaw({ maxDrawdownPct: -5, hypeRate: 0, repeatedAssetRate: 0, sponsorConflictRate: 0, sectorConsistencyRate: 0.8 });
  const risky = calculateRiskRaw({ maxDrawdownPct: -30, hypeRate: 0.8, repeatedAssetRate: 0.6, sponsorConflictRate: 0.5, sectorConsistencyRate: 0.1 });
  assert(safe > risky);
});

test('high score but fewer than 5 picks remains Rookie', () => {
  const metrics = { pickCount: 4, hitRate: 0.9, flatRate: 0.1, missRate: 0, ambiguityRate: 0.05, severeRiskFlag: false };
  assert.strictEqual(assignLeague(metrics, 95), 'Rookie');
});

test('severe risk overrides score into Caution Watch', () => {
  const metrics = { pickCount: 40, hitRate: 0.8, flatRate: 0.1, missRate: 0.1, ambiguityRate: 0.1, severeRiskFlag: true };
  assert.strictEqual(assignLeague(metrics, 90), 'Caution Watch');
});

test('score result includes weighted breakdown and algorithmVersion', () => {
  const result = calculateLeagueScore({
    return1w: 2, return1m: 4, return3m: 8,
    hitRate: 0.65, flatRate: 0.2, missRate: 0.15,
    approvedPickRate: 0.9, explicitStanceRate: 0.85, quoteEvidenceRate: 0.9,
    ambiguityRate: 0.1, contradictionRate: 0,
    pickCount: 25, daysSinceLastPick: 3,
    maxDrawdownPct: -12, hypeRate: 0.1, repeatedAssetRate: 0.15, sponsorConflictRate: 0, sectorConsistencyRate: 0.8,
    severeRiskFlag: false,
  });
  assert.strictEqual(result.algorithmVersion, 'league-ranking-v0.1');
  assert(result.score > 0 && result.score <= 100);
  assert(result.breakdown.performance.points > 0);
  assert(result.breakdown.risk.points > 0);
});

test('promotion status requires repeated qualification', () => {
  assert.strictEqual(getPromotionStatus({ currentLeague: 'Minor', consecutivePromotionSignals: 1, consecutiveDemotionSignals: 0, severeRiskFlag: false }, 75), 'watch');
  assert.strictEqual(getPromotionStatus({ currentLeague: 'Minor', consecutivePromotionSignals: 2, consecutiveDemotionSignals: 0, severeRiskFlag: false }, 75), 'promote_candidate');
  assert.strictEqual(getPromotionStatus({ currentLeague: 'Major', consecutivePromotionSignals: 0, consecutiveDemotionSignals: 2, severeRiskFlag: false }, 45), 'demotion_risk');
});
