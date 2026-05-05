function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function countByStatus(items = []) {
  return asArray(items).reduce((acc, item) => {
    const status = item && item.status ? item.status : 'unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});
}

function summarizeAdminMetrics(fixtures = {}) {
  const sources = asArray(fixtures.sourceCandidates);
  const contents = asArray(fixtures.contentCandidates);
  const reviews = asArray(fixtures.extractionReviewItems);
  const leagueItems = asArray(fixtures.leagueItems);
  const checklist = asArray(fixtures.publishChecklist);

  return {
    totalSources: sources.length,
    sourceStatus: countByStatus(sources),
    totalContentCandidates: contents.length,
    contentStatus: countByStatus(contents),
    pendingReviews: reviews.filter(item => item.status === 'pending_review' || item.status === 'needs_second_review').length,
    approvedReviews: reviews.filter(item => item.status === 'approved').length,
    cautionCandidates: leagueItems.filter(item => item.league === 'Caution Watch').length,
    promotionCandidates: leagueItems.filter(item => item.promotionStatus === 'promote_candidate').length,
    demotionRisks: leagueItems.filter(item => item.promotionStatus === 'demotion_risk').length,
    checklistDone: checklist.filter(item => item.done).length,
    checklistTotal: checklist.length,
    publishReady: checklist.length > 0 && checklist.every(item => item.done),
  };
}

function nextStatusForAction(action, currentStatus = 'pending_review') {
  const map = {
    approve: 'approved',
    edit: 'edited',
    reject: 'rejected',
    hold: 'needs_second_review',
    include: 'auto_included',
    exclude: 'rejected',
    candidate: 'candidate',
    rookie: 'rookie_candidate',
  };
  return map[action] || currentStatus;
}

function applyAdminAction(item = {}, action, options = {}) {
  const now = options.now || new Date().toISOString();
  const actor = options.actor || 'prototype-operator';
  const note = options.note || '';
  const nextStatus = nextStatusForAction(action, item.status);
  return {
    ...item,
    status: nextStatus,
    humanStatus: nextStatus,
    lastAction: action,
    reviewedBy: actor,
    reviewedAt: now,
    adminNote: note || item.adminNote || '',
  };
}

function createAuditEntry({ action, targetId, actor = 'prototype-operator', note = '', at } = {}) {
  const timestamp = at || new Date().toISOString();
  return {
    id: `audit-${timestamp}-${targetId || 'unknown'}-${action || 'unknown'}`.replace(/[^a-zA-Z0-9._-]/g, '-'),
    at: timestamp,
    actor,
    action: action || 'unknown',
    targetId: targetId || 'unknown',
    note,
  };
}

function getReviewPriorityLabel(item = {}) {
  const score = Number.isFinite(Number(item.reviewPriority))
    ? Number(item.reviewPriority)
    : (Number(item.impactScore || 0) * 0.35)
      + (Number(item.uncertaintyScore || 0) * 0.30)
      + (Number(item.entityImportanceScore || 0) * 0.20)
      + (Number(item.freshnessScore || 0) * 0.10)
      + (Number(item.userDemandScore || 0) * 0.05);

  if (score >= 75) return { score: Math.round(score), label: '긴급 검수', tone: 'red' };
  if (score >= 60) return { score: Math.round(score), label: '우선 검수', tone: 'orange' };
  if (score >= 40) return { score: Math.round(score), label: '일반 검수', tone: 'blue' };
  return { score: Math.round(score), label: '낮은 우선순위', tone: 'green' };
}

module.exports = {
  summarizeAdminMetrics,
  applyAdminAction,
  createAuditEntry,
  nextStatusForAction,
  getReviewPriorityLabel,
};
