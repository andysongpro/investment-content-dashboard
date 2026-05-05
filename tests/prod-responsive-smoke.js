const { chromium } = require('playwright');
const assert = require('assert');

const url = process.env.PROD_URL || 'https://investment-content-dashboard.vercel.app/';

async function runViewport(browser, name, viewport, screenshotPath) {
  const page = await browser.newPage({ viewport, isMobile: viewport.width <= 560 });
  const consoleErrors = [];
  const pageErrors = [];
  const requestFailures = [];
  page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  page.on('pageerror', e => pageErrors.push(e.message));
  page.on('requestfailed', r => requestFailures.push(`${r.url()} ${r.failure()?.errorText || ''}`));

  const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  assert(resp, `${name}: no response`);
  assert.equal(resp.status(), 200, `${name}: HTTP ${resp.status()}`);
  await page.waitForSelector('h1', { timeout: 30000 });

  const title = await page.title();
  assert(title.includes('Investment Content Dashboard MVP'), `${name}: title mismatch ${title}`);
  const body = await page.locator('body').innerText();
  for (const text of ['김작가 TV 기반', '첫 소스 설정', '추천일 종가 대비 최신가 성과', '샘플 데이터 기반 후보 검토', '사람이 확인해야 하는 항목']) {
    assert(body.includes(text), `${name}: missing ${text}`);
  }

  if (viewport.width <= 560) {
    for (const text of ['요약', '소스', '성과', '후보', '리뷰']) assert(body.includes(text), `${name}: missing mobile nav ${text}`);
    const navDisplay = await page.locator('.mobile-sticky-nav').evaluate(el => getComputedStyle(el).display);
    assert.notEqual(navDisplay, 'none', `${name}: mobile sticky nav hidden`);
  }

  const overflow = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    return Array.from(document.querySelectorAll('body *')).filter(el => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && (r.right > vw + 1 || r.left < -1);
    }).slice(0, 10).map(el => ({ tag: el.tagName, cls: String(el.className), text: (el.innerText || '').slice(0, 50), left: el.getBoundingClientRect().left, right: el.getBoundingClientRect().right, vw }));
  });
  assert.deepEqual(overflow, [], `${name}: horizontal overflow ${JSON.stringify(overflow)}`);

  const touchIssues = await page.evaluate(() => Array.from(document.querySelectorAll('button, a, input, select')).filter(el => {
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && r.height < 36;
  }).map(el => ({ tag: el.tagName, text: (el.innerText || el.value || '').slice(0, 40), height: el.getBoundingClientRect().height })));
  assert.deepEqual(touchIssues, [], `${name}: small touch targets ${JSON.stringify(touchIssues)}`);

  await page.fill('input[type="url"]', 'not-a-url');
  await page.click('text=Save Local Draft');
  assert((await page.locator('text=유효한 YouTube URL').count()) > 0, `${name}: URL validation missing`);

  await page.screenshot({ path: screenshotPath, fullPage: true });
  await page.close();
  return { name, screenshotPath, consoleErrors, pageErrors, requestFailures };
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const results = [];
  results.push(await runViewport(browser, 'mobile', { width: 390, height: 844 }, '/tmp/investment-dashboard-prod-mobile-optimized.png'));
  results.push(await runViewport(browser, 'desktop', { width: 1440, height: 1000 }, '/tmp/investment-dashboard-prod-desktop-optimized.png'));
  await browser.close();

  for (const r of results) {
    assert.equal(r.consoleErrors.length, 0, `${r.name}: console errors ${r.consoleErrors.join('\n')}`);
    assert.equal(r.pageErrors.length, 0, `${r.name}: page errors ${r.pageErrors.join('\n')}`);
    assert.equal(r.requestFailures.length, 0, `${r.name}: request failures ${r.requestFailures.join('\n')}`);
  }

  console.log(JSON.stringify({ status: 'PROD_RESPONSIVE_PASS', url, results }, null, 2));
})();
