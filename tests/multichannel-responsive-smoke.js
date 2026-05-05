const { chromium } = require('playwright');
const assert = require('assert');

(async()=>{
  const browser = await chromium.launch({ headless: true });
  const viewports = [
    ['mobile', { width: 390, height: 844 }, '/tmp/investment-dashboard-local-multichannel-mobile.png'],
    ['desktop', { width: 1440, height: 1000 }, '/tmp/investment-dashboard-local-multichannel-desktop.png'],
  ];
  for (const [name, viewport, screenshot] of viewports) {
    const page = await browser.newPage({ viewport, isMobile: viewport.width <= 560 });
    const errors = []; const failures = [];
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', e => errors.push(e.message));
    page.on('requestfailed', r => failures.push(`${r.url()} ${r.failure()?.errorText || ''}`));
    const resp = await page.goto('http://127.0.0.1:3000', { waitUntil: 'networkidle', timeout: 60000 });
    assert.equal(resp.status(), 200, `${name} status`);
    const body = await page.locator('body').innerText();
    for (const text of ['투자 콘텐츠', '인텔리전스 허브', '지난 3개월', '2026-02-05 ~ 2026-05-05', '3개월 언급 추이', '채널별 성과 비교', '신사임당', 'Channel Filter', 'League Score v0.1', '주간 투자 콘텐츠 리포트', '종목별 추천 타임라인', '이 채널도 분석해주세요', '투자 권유가 아닙니다']) {
      assert(body.includes(text), `${name} missing ${text}`);
    }
    assert(!body.includes('김작가 TV + 신사임당\n다채널 시계열 MVP'), `${name} still uses channel-locked hero title`);
    await page.selectOption('select', 'sinsa').catch(async () => {
      const selects = await page.locator('select').all();
      for (const s of selects) {
        const opts = await s.locator('option').allTextContents();
        if (opts.includes('신사임당')) { await s.selectOption('sinsa'); break; }
      }
    });
    await page.waitForTimeout(200);
    const filtered = await page.locator('body').innerText();
    assert(filtered.includes('현재 보기: 신사임당'), `${name} channel filter did not apply`);
    assert(filtered.includes('엔비디아'), `${name} sinsa asset missing`);

    const overflow = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      return Array.from(document.querySelectorAll('body *')).filter(el => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && (r.right > vw + 1 || r.left < -1);
      }).slice(0, 10).map(el => ({ tag: el.tagName, cls: String(el.className), text: (el.innerText || '').slice(0, 50), left: el.getBoundingClientRect().left, right: el.getBoundingClientRect().right, vw }));
    });
    assert.deepEqual(overflow, [], `${name} overflow ${JSON.stringify(overflow)}`);
    if (viewport.width <= 560) {
      const mobileGrids = await page.evaluate(() => ({
        topKpis: getComputedStyle(document.querySelector('main > section.kpi')).gridTemplateColumns.split(' ').length,
        timeline: getComputedStyle(document.querySelector('.timeline')).gridTemplateColumns.split(' ').length,
        performance: getComputedStyle(document.querySelector('#performance-board .grid-4')).gridTemplateColumns.split(' ').length,
      }));
      assert.deepEqual(mobileGrids, { topKpis: 2, timeline: 2, performance: 2 }, `${name} mobile grids ${JSON.stringify(mobileGrids)}`);
      const touchIssues = await page.evaluate(() => Array.from(document.querySelectorAll('button, a, input, select')).filter(el => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && r.height < 36;
      }).map(el => ({ tag: el.tagName, text: (el.innerText || el.value || '').slice(0, 40), height: el.getBoundingClientRect().height })));
      assert.deepEqual(touchIssues, [], `${name} touch issues ${JSON.stringify(touchIssues)}`);
    }
    assert.equal(errors.length, 0, `${name} errors ${errors.join('\n')}`);
    assert.equal(failures.length, 0, `${name} failures ${failures.join('\n')}`);
    await page.screenshot({ path: screenshot, fullPage: true });
    await page.close();
  }
  await browser.close();
  console.log('LOCAL_MULTICHANNEL_RESPONSIVE_PASS');
})();
