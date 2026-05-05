const { chromium } = require('playwright');
const assert = require('assert');

const url = process.env.ADMIN_URL || 'https://investment-content-dashboard.vercel.app/admin';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1360, height: 1000 } });
  const consoleErrors = [];
  const failures = [];
  page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  page.on('pageerror', e => consoleErrors.push(e.message));
  page.on('requestfailed', r => {
    const failure = r.failure()?.errorText || '';
    if (failure === 'net::ERR_ABORTED') return;
    failures.push(`${r.url()} ${failure}`);
  });

  const resp = await page.goto(url, { waitUntil: 'networkidle' });
  assert(resp && resp.ok(), `unexpected status ${resp && resp.status()}`);
  const body = await page.locator('body').innerText();
  for (const text of [
    '관리자 운영실',
    '상황판',
    '소스',
    '콘텐츠',
    '검수',
    '리그',
    '리포트',
    '알고리즘',
    'PMF',
    '로그',
    '1 / 9',
    'Previous',
    'Next',
  ]) assert(body.includes(text), `missing ${text}`);
  for (const removedText of [
    'PMF Admin Prototype',
    'static export · localStorage actions',
    '공개 콘텐츠 발언 기준',
    '투자 권유가 아닙니다',
  ]) assert(!body.includes(removedText), `removed copy still visible: ${removedText}`);

  await page.getByRole('button', { name: '다음 관리자 카드' }).click();
  assert((await page.locator('body').innerText()).includes('2 / 9'), 'next slide did not advance');

  await page.screenshot({ path: '/tmp/investment-dashboard-prod-admin-desktop.png', fullPage: true });
  await page.setViewportSize({ width: 390, height: 1400 });
  await page.goto(url, { waitUntil: 'networkidle' });
  const mobileGrid = await page.locator('.admin-kpi').evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length);
  assert.equal(mobileGrid, 2, `mobile admin KPI grid should be 2 columns, got ${mobileGrid}`);
  const statusGrid = await page.locator('.admin-section > .grid-3').first().evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length);
  assert.equal(statusGrid, 3, `mobile admin status grid should be 3 columns, got ${statusGrid}`);
  const persistentAdminNav = await page.evaluate(async () => {
    const nav = document.querySelector('.admin-mobile-jump');
    window.scrollTo(0, document.documentElement.scrollHeight);
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const rect = nav.getBoundingClientRect();
    const style = getComputedStyle(nav);
    return { position: style.position, visible: rect.width > 0 && rect.height > 0, top: Math.round(rect.top), bottom: Math.round(rect.bottom), viewportHeight: window.innerHeight };
  });
  assert.equal(persistentAdminNav.position, 'fixed', `mobile admin global nav should be fixed ${JSON.stringify(persistentAdminNav)}`);
  assert(persistentAdminNav.visible && persistentAdminNav.top >= 0 && persistentAdminNav.bottom <= persistentAdminNav.viewportHeight, `mobile admin global nav disappeared ${JSON.stringify(persistentAdminNav)}`);
  const overflow = await page.evaluate(() => {
    const width = document.documentElement.clientWidth;
    return Array.from(document.querySelectorAll('body *')).filter(el => {
      if (el.closest('.admin-tabs')) return false;
      if (el.closest('.admin-slide-card[aria-hidden="true"]')) return false;
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && (rect.left < -1 || rect.right > width + 1);
    }).slice(0, 5).map(el => `${el.tagName}.${el.className}`);
  });
  assert.equal(overflow.length, 0, overflow.join('\n'));
  await page.screenshot({ path: '/tmp/investment-dashboard-prod-admin-mobile.png', fullPage: true });

  assert.equal(consoleErrors.length, 0, consoleErrors.join('\n'));
  assert.equal(failures.length, 0, failures.join('\n'));
  await browser.close();
  console.log(JSON.stringify({ status: 'PROD_ADMIN_SMOKE_PASS', url }, null, 2));
})();
