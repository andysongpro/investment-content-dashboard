const { chromium } = require('playwright');
const assert = require('assert');

(async()=>{
  const browser=await chromium.launch({headless:true});
  const page=await browser.newPage({viewport:{width:390,height:844}, isMobile:true});
  const errors=[]; const failures=[];
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
  page.on('pageerror',e=>errors.push(e.message));
  page.on('requestfailed',r=>failures.push(`${r.url()} ${r.failure()?.errorText}`));
  const resp=await page.goto('http://127.0.0.1:3000',{waitUntil:'networkidle',timeout:60000});
  assert.equal(resp.status(),200);
  assert.equal(errors.length,0,errors.join('\n'));
  assert.equal(failures.length,0,failures.join('\n'));
  const body=await page.locator('body').innerText();
  for(const text of ['요약','리그','리포트','종목','요청','성과','후보','리뷰','투자 콘텐츠','인텔리전스 허브','추천일 종가 대비 최신가 성과','League Score v0.1','주간 투자 콘텐츠 리포트','종목별 추천 타임라인','이 채널도 분석해주세요']) assert(body.includes(text), text);

  const overflow = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    return Array.from(document.querySelectorAll('body *')).filter(el => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && (r.right > vw + 1 || r.left < -1);
    }).slice(0,10).map(el => ({tag: el.tagName, cls: el.className, text: (el.innerText || '').slice(0,60), left: el.getBoundingClientRect().left, right: el.getBoundingClientRect().right, vw}));
  });
  assert.deepEqual(overflow, []);

  const touchIssues = await page.evaluate(() => Array.from(document.querySelectorAll('button, a, input, select')).filter(el => {
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && r.height < 36;
  }).map(el => ({tag: el.tagName, text: (el.innerText || el.value || '').slice(0,40), height: el.getBoundingClientRect().height})));
  assert.deepEqual(touchIssues, []);

  const mobileGrids = await page.evaluate(() => ({
    topKpis: getComputedStyle(document.querySelector('main > section.kpi')).gridTemplateColumns.split(' ').length,
    heroKpis: getComputedStyle(document.querySelector('.hero .grid-3')).gridTemplateColumns.split(' ').length,
    timeline: getComputedStyle(document.querySelector('.timeline')).gridTemplateColumns.split(' ').length,
    performance: getComputedStyle(document.querySelector('#performance-board .grid-4')).gridTemplateColumns.split(' ').length,
    report: getComputedStyle(document.querySelector('#weekly-report .report-grid')).gridTemplateColumns.split(' ').length,
  }));
  assert.deepEqual(mobileGrids, { topKpis: 2, heroKpis: 3, timeline: 2, performance: 2, report: 3 });

  const persistentNav = await page.evaluate(async () => {
    const nav = document.querySelector('.mobile-sticky-nav');
    window.scrollTo(0, document.documentElement.scrollHeight);
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const rect = nav.getBoundingClientRect();
    const style = getComputedStyle(nav);
    return {
      position: style.position,
      visible: rect.width > 0 && rect.height > 0,
      top: Math.round(rect.top),
      bottom: Math.round(rect.bottom),
      viewportHeight: window.innerHeight,
    };
  });
  assert.equal(persistentNav.position, 'fixed', `mobile global nav should be fixed, got ${JSON.stringify(persistentNav)}`);
  assert(persistentNav.visible, `mobile global nav disappeared after deep scroll: ${JSON.stringify(persistentNav)}`);
  assert(persistentNav.top >= 0 && persistentNav.bottom <= persistentNav.viewportHeight, `mobile global nav should remain in viewport: ${JSON.stringify(persistentNav)}`);

  await page.click('a[href="#review-queue"]');
  await page.waitForTimeout(300);
  const y = await page.evaluate(() => window.scrollY);
  assert(y > 1000, `review link did not scroll enough: ${y}`);

  await page.screenshot({path:'/tmp/investment-dashboard-local-mobile-optimized.png', fullPage:true});
  await browser.close();
  console.log('LOCAL_MOBILE_OPTIMIZED_PASS screenshot=/tmp/investment-dashboard-local-mobile-optimized.png');
})();
