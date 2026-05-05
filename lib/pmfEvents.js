const PMF_EVENTS_KEY = 'investment-content-dashboard/pmf-events';

function getEvents(storage) {
  if (!storage) return [];
  try { return JSON.parse(storage.getItem(PMF_EVENTS_KEY) || '[]'); }
  catch { return []; }
}

function recordEvent(storage, type, payload = {}) {
  if (!storage) return [];
  const events = getEvents(storage);
  const next = [...events, { type, payload, at: new Date().toISOString() }].slice(-200);
  storage.setItem(PMF_EVENTS_KEY, JSON.stringify(next));
  return next;
}

function summarizeEvents(events) {
  return (events || []).reduce((acc, event) => {
    acc[event.type] = (acc[event.type] || 0) + 1;
    return acc;
  }, {});
}

module.exports = { PMF_EVENTS_KEY, getEvents, recordEvent, summarizeEvents };
