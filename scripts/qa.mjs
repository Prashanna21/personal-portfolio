/**
 * Behavioural QA that a screenshot cannot catch.
 *   node scripts/qa.mjs [--port 3211]
 *
 * Checks the three degraded modes the design promises to support:
 *   1. prefers-reduced-motion  — content visible, no WebGL, no animation
 *   2. JavaScript disabled     — content visible, static graph present
 *   3. dark theme              — palette actually flips
 */
import { chromium } from 'playwright-core';

const args = process.argv.slice(2);
const port = (() => {
  const i = args.indexOf('--port');
  return i >= 0 ? args[i + 1] : '3211';
})();
const BASE = `http://localhost:${port}`;
const OUT = 'C:/Users/DELL/AppData/Local/Temp/claude/C--Users-DELL-Personal-Personal-Portfolio/bfbb59b4-a644-433c-a2a0-cccfdc6d9ee2/scratchpad';

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const results = [];
const check = (name, pass, detail = '') =>
  results.push({ name, pass, detail: String(detail).slice(0, 120) });

const probe = (page) =>
  page.evaluate(() => {
    const reveals = [...document.querySelectorAll('.reveal')];
    const hidden = reveals.filter((el) => Number(getComputedStyle(el).opacity) < 0.5);
    const h1 = document.querySelector('h1');
    return {
      revealCount: reveals.length,
      hiddenCount: hidden.length,
      readyAttr: document.documentElement.hasAttribute('data-reveal-ready'),
      theme: document.documentElement.getAttribute('data-theme'),
      paper: getComputedStyle(document.body).backgroundColor,
      h1Visible: h1 ? Number(getComputedStyle(h1).opacity) > 0.5 : false,
      hasCanvas: Boolean(document.querySelector('canvas')),
      svgNodeLabels: document.querySelectorAll('#stack svg text').length,
      portraitVisible: (() => {
        const img = document.querySelector('img[alt*="Prashanna"]');
        if (!img) return false;
        const cs = getComputedStyle(img.parentElement ?? img);
        return Number(cs.opacity) > 0.5;
      })(),
    };
  });

/* ---------------------------------------------- 1. reduced motion */
{
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
  });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.getElementById('stack').scrollIntoView());
  await page.waitForTimeout(2500);
  const r = await probe(page);
  check('reduced-motion: all content visible', r.hiddenCount === 0, `${r.hiddenCount} hidden of ${r.revealCount}`);
  check('reduced-motion: no WebGL canvas mounted', !r.hasCanvas);
  check('reduced-motion: static graph labels present', r.svgNodeLabels >= 25, `${r.svgNodeLabels} <text>`);
  check('reduced-motion: portrait visible', r.portraitVisible);
  await ctx.close();
}

/* ---------------------------------------------- 2. JavaScript off */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'load' });
  await page.waitForTimeout(1200);
  const r = await probe(page);
  check('no-JS: reveal gate not armed', r.readyAttr === false, `data-reveal-ready=${r.readyAttr}`);
  check('no-JS: all content visible', r.hiddenCount === 0, `${r.hiddenCount} hidden of ${r.revealCount}`);
  check('no-JS: h1 visible', r.h1Visible);
  check('no-JS: portrait visible', r.portraitVisible);
  check('no-JS: static graph labels present', r.svgNodeLabels >= 25, `${r.svgNodeLabels} <text>`);
  await page.screenshot({ path: `${OUT}/qa-nojs.png` });
  await ctx.close();
}

/* ---------------------------------------------- 3. dark theme */
{
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: 'dark',
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const r = await probe(page);
  check('dark: data-theme is dark', r.theme === 'dark', r.theme);
  check('dark: body ground is dark', /rgb\((1[0-9]|[0-9]),/.test(r.paper), r.paper);
  await ctx.close();
}

/* ---------------------------------------------- report */
console.log('');
let failed = 0;
for (const r of results) {
  if (!r.pass) failed++;
  console.log(`  ${r.pass ? 'PASS' : 'FAIL'}  ${r.name}${r.detail ? `  (${r.detail})` : ''}`);
}
console.log(`\n  ${results.length - failed}/${results.length} passed\n`);
await browser.close();
process.exit(failed ? 1 : 0);
