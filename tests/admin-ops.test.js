const assert = require('assert');
const fixtures = require('../data/adminFixtures');
const {
  summarizeAdminMetrics,
  applyAdminAction,
  createAuditEntry,
  nextStatusForAction,
  getReviewPriorityLabel,
} = require('../lib/adminOps');

function test(name, fn) {
  try { fn(); console.log(`PASS ${name}`); }
  catch (e) { console.error(`FAIL ${name}\n${e.stack || e.message}`); process.exitCode = 1; }
}

test('summarizeAdminMetrics counts statuses and publish readiness without storage', () => {
  const summary = summarizeAdminMetrics(fixtures);
  assert.strictEqual(summary.totalSources, fixtures.sourceCandidates.length);
  assert.strictEqual(summary.totalContentCandidates, fixtures.contentCandidates.length);
  assert(summary.pendingReviews >= 1);
  assert.strictEqual(summary.publishReady, false);
  assert(summary.checklistDone < summary.checklistTotal);
});

test('nextStatusForAction maps admin actions to safe statuses', () => {
  assert.strictEqual(nextStatusForAction('approve'), 'approved');
  assert.strictEqual(nextStatusForAction('edit'), 'edited');
  assert.strictEqual(nextStatusForAction('hold'), 'needs_second_review');
  assert.strictEqual(nextStatusForAction('reject'), 'rejected');
  assert.strictEqual(nextStatusForAction('unknown', 'pending_review'), 'pending_review');
});

test('applyAdminAction is pure and records reviewer metadata', () => {
  const item = { id: 'rev-test', status: 'pending_review', title: '샘플' };
  const updated = applyAdminAction(item, 'approve', { actor: 'tester', now: '2026-05-05T00:00:00.000Z', note: '확인' });
  assert.notStrictEqual(updated, item);
  assert.strictEqual(item.status, 'pending_review');
  assert.strictEqual(updated.status, 'approved');
  assert.strictEqual(updated.humanStatus, 'approved');
  assert.strictEqual(updated.reviewedBy, 'tester');
  assert.strictEqual(updated.adminNote, '확인');
});

test('createAuditEntry creates deterministic localStorage-safe entries when timestamp is passed', () => {
  const entry = createAuditEntry({ action: 'approve', targetId: 'rev 1', actor: 'tester', note: '메모', at: '2026-05-05T00:00:00.000Z' });
  assert.strictEqual(entry.action, 'approve');
  assert.strictEqual(entry.targetId, 'rev 1');
  assert(!entry.id.includes(' '));
  assert(entry.id.startsWith('audit-'));
});

test('getReviewPriorityLabel calculates weighted priority labels', () => {
  const high = getReviewPriorityLabel({ impactScore: 95, uncertaintyScore: 90, entityImportanceScore: 90, freshnessScore: 90, userDemandScore: 80 });
  const low = getReviewPriorityLabel({ impactScore: 10, uncertaintyScore: 10, entityImportanceScore: 10, freshnessScore: 10, userDemandScore: 10 });
  assert.strictEqual(high.label, '긴급 검수');
  assert.strictEqual(high.tone, 'red');
  assert.strictEqual(low.label, '낮은 우선순위');
  assert.strictEqual(low.tone, 'green');
});
