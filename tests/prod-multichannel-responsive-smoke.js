const { chromium } = require('playwright');
const assert = require('assert');
const url = 'https://investment-content-dashboard.vercel.app/';

(async()=>{
  const browser = await chromium.launch({ headless: true });
  const viewports = [
    ['mobile', { width: 390, height: 844 }, '/tmp/investment-dashboard-prod-multichannel-mobile.png'],
    ['desktop', { width: 1440, height: 1000 }, '/tmp/investment-dashboard-prod-multichannel-desktop.png'],
  ];
  const results = [];
  for (const [name, viewport, screenshot] of viewports) {
    const page = await browser.newPage({ viewport, isMobile: viewport.width <= 560 });
    const errors = []; const failures = [];
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', e => errors.push(e.message));
    page.on('requestfailed', r => failures.push(`${r.url()} ${r.failure()?.errorText || ''}`));
    const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    assert.equal(resp.status(), 200, `${name} status`);
    const body = await page.locator('body').innerText();
    for (const text of ['투자 콘텐츠', '인텔리전스 허브', '지난 3개월', '2026-02-05 ~ 2026-05-05', '3개월 언급 추이', '채널별 성과 비교', '신사임당', 'Channel Filter']) {
      assert(body.includes(text), `${name} missing ${text}`);
    }
    assert(!body.includes('김작가 TV + 신사임당\n다채널 시계열 MVP'), `${name} still uses channel-locked hero title`);
    const selects = await page.locator('select').all();
    let selected = false;
    for (const s of selects) {
      const opts = await s.locator('option').allTextContents();
      if (opts.includes('신사임당')) { await s.selectOption('sinsa'); selected = true; break; }
    }
    assert(selected, `${name} channel select missing`);
    await page.waitForTimeout(200);
    const filtered = await page.locator('body').innerText();
    assert(filtered.includes('현재 보기: 신사임당'), `${name} channel filter did not apply`);
    assert(filtered.includes('전체 채널로 초기화'), `${name} reset channel filter missing`);
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
        performance: getComputedStyle(document.querySelector('#performance-board .performance-card-grid')).gridTemplateColumns.split(' ').length,
      }));
      assert.deepEqual(mobileGrids, { topKpis: 2, timeline: 2, performance: 2 }, `${name} mobile grids ${JSON.stringify(mobileGrids)}`);
      const persistentNav = await page.evaluate(async () => {
        const nav = document.querySelector('.mobile-sticky-nav');
        window.scrollTo(0, document.documentElement.scrollHeight);
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        const rect = nav.getBoundingClientRect();
        const style = getComputedStyle(nav);
        return { position: style.position, visible: rect.width > 0 && rect.height > 0, top: Math.round(rect.top), bottom: Math.round(rect.bottom), viewportHeight: window.innerHeight };
      });
      assert.equal(persistentNav.position, 'fixed', `${name} mobile global nav should be fixed ${JSON.stringify(persistentNav)}`);
      assert(persistentNav.visible && persistentNav.top >= 0 && persistentNav.bottom <= persistentNav.viewportHeight, `${name} mobile global nav disappeared ${JSON.stringify(persistentNav)}`);
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
    results.push({name, screenshot});
  }
  await browser.close();
  console.log(JSON.stringify({ status: 'PROD_MULTICHANNEL_RESPONSIVE_PASS', url, results }, null, 2));
})();
