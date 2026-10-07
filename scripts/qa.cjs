'use strict';
const fs = require('node:fs/promises');
const path = require('node:path');
const assert = require('node:assert/strict');
const playwrightPath = process.env.PLAYWRIGHT_MODULE_PATH || 'C:/Users/Gabriel/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright';
const { chromium } = require(playwrightPath);
const baseURL = process.argv[2] || 'http://127.0.0.1:4173/';
const phase = (process.argv[3] || 'local').replace(/[^a-z0-9-]/gi, '');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'docs', 'qa');
(async () => {
  await fs.mkdir(output, { recursive: true });
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const report = { baseURL, phase, observedUTC: new Date().toISOString(), viewports: [], assertions: [], consoleErrors: [], failedRequests: [], assets: [], accessibility: [] };
  try {
    for (const width of [360, 390, 768, 1440]) {
      const context = await browser.newContext({ viewport: { width, height: width === 1440 ? 960 : 844 }, reducedMotion: 'reduce' });
      const page = await context.newPage();
      const requests = [];
      page.on('pageerror', error => report.consoleErrors.push(error.message));
      page.on('console', msg => { if (msg.type() === 'error') report.consoleErrors.push(msg.text()); });
      page.on('requestfailed', request => report.failedRequests.push({ url: request.url(), failure: request.failure() }));
      page.on('request', request => requests.push({ url: request.url(), method: request.method() }));
      const response = await page.goto(baseURL, { waitUntil: 'networkidle' });
      assert.equal(response.status(), 200, 'HTML must load');
      const geometry = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, hero: document.querySelector('h1').getBoundingClientRect().toJSON(), overflows: [...document.querySelectorAll('h1,h2,h3,.panel-services,input,select,textarea,.button,.header-inner,.section,.mobile-actions')].filter(el => getComputedStyle(el).display !== 'none').filter(el => { const r = el.getBoundingClientRect(); return r.left < -1 || r.right > innerWidth + 1; }).map(el => ({ tag: el.tagName, text: el.textContent.trim().slice(0,80) })), sticky: getComputedStyle(document.querySelector('.mobile-actions')).display, contentSize: document.body.innerText.length }));
      assert.ok(geometry.scrollWidth <= width + 1, `Horizontal overflow at ${width}`);
      assert.deepEqual(geometry.overflows, [], `Element overflow at ${width}`);
      assert.ok(geometry.contentSize > 4000, 'Complete content must render');
      assert.equal(await page.locator('h1').count(), 1);
      assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'), 'noindex, nofollow');
      assert.equal(await page.locator('html').getAttribute('lang'), 'en-US');
      assert.equal(await page.locator('.mobile-actions').isVisible(), width <= 600);
      const brokenHashes = await page.evaluate(() => [...document.querySelectorAll('a[href^="#"]')].map(el=>el.getAttribute('href')).filter(href => href.length > 1 && !document.getElementById(href.slice(1))));
      assert.deepEqual(brokenHashes, []);
      const phones = await page.locator('a[href^="tel:"]').evaluateAll(els => els.map(el => el.getAttribute('href')));
      assert.ok(phones.length > 0 && phones.every(href => href === 'tel:+19405533290'));
      const emails = await page.locator('a[href^="mailto:"]').evaluateAll(els => els.map(el => el.getAttribute('href')));
      assert.ok(emails.every(href => href.startsWith('mailto:jameshuber56@yahoo.com')));
      const schema = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
      assert.equal(schema['@type'], 'HVACBusiness');
      assert.equal(schema.address.addressLocality, 'Vernon');
      assert.equal(schema.telephone, '+1-940-553-3290');
      assert.ok(!schema.url && !schema.aggregateRating && !schema.openingHours && !schema.priceRange);
      assert.ok(!(await page.locator('body').innerText()).includes('\u2014'), 'No em dash in public copy');
      assert.ok((await page.locator('.concept-note').innerText()).includes('Independent website concept for presentation.'));
      await page.screenshot({ path: path.join(output, `${phase}-${width}.png`), fullPage: false });
      if (process.env.AXE_SCRIPT_PATH) {
        await page.addScriptTag({ path: process.env.AXE_SCRIPT_PATH });
        const axe = await page.evaluate(async () => window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a','wcag2aa','wcag21a','wcag21aa'] } }));
        const violations = axe.violations.map(v => ({ id:v.id, impact:v.impact, description:v.description, nodes:v.nodes.map(n => ({ target:n.target, summary:n.failureSummary })) }));
        report.accessibility.push({ width, violations, passes:axe.passes.length, incomplete:axe.incomplete.length });
        assert.deepEqual(violations, [], `Accessibility violations at ${width}: ${JSON.stringify(violations)}`);
      }
      await page.locator('a[data-intent="estimate"]').first().click();
      assert.equal(await page.locator('#service-needed').inputValue(), 'System replacement');
      assert.equal(await page.locator('#request-type').inputValue(), 'estimate');
      assert.ok(!(await page.locator('#service-form').evaluate(form => form.checkValidity())), 'Empty required fields must be rejected');
      await page.locator('#customer-name').fill('QA Test');
      await page.locator('#customer-phone').fill('abc');
      await page.getByRole('button', { name: 'Prepare Email Request' }).click();
      assert.ok(await page.locator('#customer-phone').evaluate(el => !el.validity.valid));
      assert.ok(await page.locator('#draft-result').isHidden());
      await page.locator('#customer-phone').fill('(940) 555-0100');
      await page.locator('#customer-email').fill('qa@example.org');
      await page.locator('#customer-message').fill('Test only: AC & heating + estimate? Address: 123 Test St.');
      await page.getByRole('button', { name: 'Prepare Email Request' }).click();
      assert.ok(await page.locator('#draft-result').isVisible());
      const mailto = new URL(await page.locator('#email-draft-link').getAttribute('href'));
      assert.equal(mailto.protocol, 'mailto:');
      assert.equal(mailto.pathname, 'jameshuber56@yahoo.com');
      assert.equal(mailto.searchParams.get('subject'), 'Huber estimate request: System replacement');
      assert.ok(mailto.searchParams.get('body').includes('Test only: AC & heating + estimate?'));
      assert.ok((await page.locator('#draft-status').innerText()).includes('Nothing has been sent yet.'));
      assert.equal(await page.evaluate(() => document.activeElement.id), 'email-draft-link');
      await page.locator('#customer-message').fill('Changed message');
      assert.ok(await page.locator('#draft-result').isHidden(), 'Changing input must hide stale draft');
      await page.locator('a[data-service="Heating repair"]').first().click();
      assert.equal(await page.locator('#service-needed').inputValue(), 'Heating repair');
      assert.equal(await page.locator('#request-type').inputValue(), 'service');
      await page.locator('#customer-email').fill('invalid');
      assert.ok(await page.locator('#customer-email').evaluate(el => !el.validity.valid));
      await page.locator('#customer-email').fill('');
      await page.locator('#customer-name').fill('   ');
      await page.getByRole('button', { name: 'Prepare Email Request' }).click();
      assert.ok(await page.locator('#customer-name').evaluate(el => !el.validity.valid));
      assert.ok(requests.every(r => r.method === 'GET'), 'Form must not submit data');
      assert.ok(requests.every(r => r.url.startsWith(new URL(baseURL).origin)), 'No third-party loads');
      await page.reload({ waitUntil:'networkidle' });
      await page.locator('#request').scrollIntoViewIfNeeded();
      await page.screenshot({ path: path.join(output, `${phase}-${width}-request.png`) });
      await page.goto(baseURL, {waitUntil:'networkidle'});
      await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(() => document.activeElement.getAttribute('href')), '#main');
      const focusStyles = await page.evaluate(() => ({ outline:getComputedStyle(document.activeElement).outlineStyle, motion:getComputedStyle(document.documentElement).scrollBehavior }));
      assert.equal(focusStyles.outline, 'solid');
      assert.equal(focusStyles.motion, 'auto');
      {
        await page.evaluate(() => {document.documentElement.style.fontSize='200%';});
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), '200% text must not overflow');
        await page.screenshot({ path: path.join(output, `${phase}-${width}-text-200.png`) });
      }
      report.viewports.push({ width, status:'PASS', scrollWidth:geometry.scrollWidth, sticky:geometry.sticky, screenshots:[`${phase}-${width}.png`,`${phase}-${width}-request.png`] });
      await context.close();
    }
    const context = await browser.newContext({ viewport:{width:390,height:844}, javaScriptEnabled:false });
    const page = await context.newPage();
    await page.goto(baseURL,{waitUntil:'networkidle'});
    assert.ok(await page.locator('.noscript-note').isVisible());
    assert.ok(await page.getByRole('button', { name: 'Prepare Email Request' }).isDisabled());
    assert.ok(await page.locator('.header-phone').isVisible());
    await context.close();
    const httpContext = await browser.newContext();
    for(const asset of ['assets/styles.css','assets/site.js']) {
      const url=new URL(asset,baseURL.endsWith('/')?baseURL:baseURL+'/').href;
      const response=await httpContext.request.get(url);
      assert.equal(response.status(),200);
      report.assets.push({url,status:response.status(),bytes:(await response.body()).length,contentType:response.headers()['content-type']});
    }
    await httpContext.close();
    assert.deepEqual(report.consoleErrors,[]);
    assert.deepEqual(report.failedRequests,[]);
    report.assertions=['4 viewport layouts and no horizontal overflow','One h1, English language, preview metadata and factual JSON-LD','All internal anchors, telephone and email targets','Service and estimate preselection','Required fields, whitespace name, invalid phone and invalid email rejected','Encoded email draft, correct recipient and subject, honest status, focus transfer','Stale draft reset after edits','No transmission or third-party requests','Keyboard skip link and focus outline','Reduced-motion behavior','200% text at all four viewports','No-JavaScript contact fallback','HTTP 200 CSS and JavaScript'];
    report.status='PASS';
  } catch(error) { report.status='FAIL'; report.error=error.stack; throw error; }
  finally { await fs.writeFile(path.join(output,`${phase}-results.json`),JSON.stringify(report,null,2)); await browser.close(); console.log(JSON.stringify(report,null,2)); }
})();