/**
 * Dev preview shots.
 *   node scripts/preview.mjs [--route /blog] [--full] [--dark] [--mobile] [--port 3210]
 *
 * Pass the route via --route, never as a bare positional "/": Git Bash rewrites
 * a lone slash into a Windows path and the navigation fails.
 */
import { chromium } from 'playwright-core';
import fs from 'node:fs/promises';
import path from 'node:path';

const args = process.argv.slice(2);
const flag = (n) => args.includes(`--${n}`);
const val = (n, d) => {
  const i = args.indexOf(`--${n}`);
  return i >= 0 ? args[i + 1] : d;
};
const rawRoute = val('route', '/');
// Git Bash may hand us "C:/Program Files/Git/blog" instead of "/blog"
const route = rawRoute.replace(/^[A-Za-z]:[/\\]Program Files[/\\]Git/, '') || '/';
const port = val('port', '3210');
const OUT = val('out', 'C:/Users/DELL/AppData/Local/Temp/claude/C--Users-DELL-Personal-Personal-Portfolio/bfbb59b4-a644-433c-a2a0-cccfdc6d9ee2/scratchpad');

const mobile = flag('mobile');
const dark = flag('dark');
const full = flag('full');

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await browser.newContext({
  viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 },
  deviceScaleFactor: 2,
  isMobile: mobile,
  hasTouch: mobile,
  colorScheme: dark ? 'dark' : 'light',
});
const page = await ctx.newPage();

const errors = [];
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(m.text());
});
page.on('pageerror', (e) => errors.push(`PAGEERROR ${e.message}`));

const url = `http://localhost:${port}${route}`;
await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
// let fonts, reveals and any settle animation land
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(full ? 2500 : 1800);

// --click "<selector>"  → click a DOM element before shooting
const clickSel = val('click', null);
if (clickSel) {
  await page.click(clickSel);
  await page.waitForTimeout(800);
}

// --node <index>  → hover the Nth stack-graph node (its glyph is centred on it)
const nodeIdx = val('node', null);
if (nodeIdx !== null) {
  const box = await page.evaluate((i) => {
    const layer = document.querySelector('[aria-hidden="true"].pointer-events-none.absolute.inset-0');
    const anchor = layer?.children?.[Number(i)];
    const glyph = anchor?.firstElementChild;
    if (!glyph) return null;
    const r = glyph.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }, nodeIdx);
  if (box) {
    await page.mouse.move(box.x, box.y);
    await page.waitForTimeout(900);
    console.log(`hovering node #${nodeIdx} at ${box.x.toFixed(0)},${box.y.toFixed(0)}`);
  } else {
    console.log('could not locate node', nodeIdx);
  }
}

if (full) {
  await page.evaluate(async () => {
    await new Promise((res) => {
      let y = 0;
      const step = () => {
        y += window.innerHeight * 0.8;
        window.scrollTo(0, y);
        if (y < document.body.scrollHeight) setTimeout(step, 220);
        else {
          window.scrollTo(0, 0);
          setTimeout(res, 700);
        }
      };
      step();
    });
  });
  await page.waitForTimeout(900);
  // Chromium's fullPage capture resizes the viewport, which restarts any
  // in-flight reveal transition and can shoot a section mid-fade. Pin them all
  // visible first so a full-page shot is deterministic.
  await page.evaluate(() => {
    document
      .querySelectorAll('.reveal')
      .forEach((el) => el.setAttribute('data-revealed', ''));
  });
  await page.waitForTimeout(800);
}

const tag = val('tag', '');
const name = `pv${route.replace(/\W+/g, '-')}${tag ? `-${tag}` : ''}${mobile ? '-m' : ''}${dark ? '-dark' : ''}${full ? '-full' : ''}.png`;
const file = path.join(OUT, name);
await fs.mkdir(OUT, { recursive: true });
await page.screenshot({ path: file, fullPage: full });

console.log(file);
if (errors.length) {
  console.log('\n--- console errors ---');
  for (const e of [...new Set(errors)].slice(0, 12)) console.log(' ', e.slice(0, 300));
}
await browser.close();
