const { chromium } = require('playwright');
const assert = require('assert');
const url = 'https://investment-content-dashboard.vercel.app/';
(async()=>{
  const browser = await chromium.launch({ headless: true });
  for (const [name, viewport, path] of [
    ['mobile', {width:390,height:844}, '/tmp/investment-dashboard-prod-mobile-final-clean.png'],
    ['desktop', {width:1440,height:1000}, '/tmp/investment-dashboard-prod-desktop-final-clean.png'],
  ]) {
    const page = await browser.newPage({ viewport, isMobile: viewport.width <= 560 });
    const consoleErrors=[]; const failures=[]; const pageErrors=[];
    page.on('console', m=>{ if(m.type()==='error') consoleErrors.push(m.text()); });
    page.on('requestfailed', r=>failures.push(`${r.url()} ${r.failure()?.errorText||''}`));
    page.on('pageerror', e=>pageErrors.push(e.message));
    const resp = await page.goto(url, { waitUntil:'networkidle', timeout:60000 });
    assert.equal(resp.status(), 200);
    await page.screenshot({path, fullPage:true});
    assert.equal(consoleErrors.length, 0, `${name} console ${consoleErrors.join('\n')}`);
    assert.equal(failures.length, 0, `${name} failures ${failures.join('\n')}`);
    assert.equal(pageErrors.length, 0, `${name} page errors ${pageErrors.join('\n')}`);
    await page.close();
    console.log(`${name.toUpperCase()}_CLEAN_SCREENSHOT=${path}`);
  }
  await browser.close();
})();
