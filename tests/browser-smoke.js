const { chromium } = require('playwright');
const assert = require('assert');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  const consoleErrors = [];
  const failures = [];
  page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  page.on('pageerror', e => consoleErrors.push(e.message));
  page.on('requestfailed', r => failures.push(`${r.url()} ${r.failure()?.errorText}`));
  const resp = await page.goto('http://127.0.0.1:3000', { waitUntil: 'networkidle' });
  assert.equal(resp.status(), 200);
  const body = await page.locator('body').innerText();
  for (const text of ['김작가 TV 기반', '추천일 종가 대비 최신가 성과', 'GOOD: +5% 이상', '검토 큐로 이동', '수동 검토 필요']) assert(body.includes(text), text);
  assert.equal(consoleErrors.length, 0, consoleErrors.join('\n'));
  assert.equal(failures.length, 0, failures.join('\n'));

  // validation: invalid URL blocks persistence and shows Korean message
  await page.locator('input').nth(1).fill('not-a-url');
  await page.getByRole('button', { name: /Save Local Draft/i }).click();
  await page.waitForTimeout(200);
  assert((await page.locator('body').innerText()).includes('유효한 YouTube URL을 입력하세요.'));
  assert.equal(await page.evaluate(() => localStorage.getItem('investment-content-dashboard/source-draft')), null);

  // validation: analysis > candidates
  await page.locator('input').nth(1).fill('https://www.youtube.com/@test/videos');
  await page.locator('input').nth(3).fill('3');
  await page.locator('input').nth(4).fill('5');
  await page.getByRole('button', { name: /Save Local Draft/i }).click();
  await page.waitForTimeout(200);
  assert((await page.locator('body').innerText()).includes('분석할 영상 수는 후보 영상 수보다 클 수 없습니다'));

  // valid save/reset
  await page.locator('input').nth(4).fill('2');
  await page.getByRole('button', { name: /Save Local Draft/i }).click();
  await page.waitForTimeout(200);
  const saved = await page.evaluate(() => localStorage.getItem('investment-content-dashboard/source-draft'));
  assert(saved && saved.includes('youtube.com'));
  await page.getByRole('button', { name: /^Reset$/ }).click();
  await page.waitForTimeout(200);
  assert.equal(await page.evaluate(() => localStorage.getItem('investment-content-dashboard/source-draft')), null);

  // filters
  await page.locator('input').nth(5).fill('삼성전자');
  await page.waitForTimeout(150);
  assert((await page.locator('body').innerText()).includes('1 visible items'));
  await page.locator('input').nth(5).fill('');
  await page.locator('select').selectOption('needs_review');
  await page.waitForTimeout(150);
  assert((await page.locator('body').innerText()).includes('1 pending review'));

  await page.screenshot({ path: '/tmp/investment-dashboard-local-after-fixes.png', fullPage: true });
  await browser.close();
  console.log('LOCAL_QA_PASS screenshot=/tmp/investment-dashboard-local-after-fixes.png');
})();
