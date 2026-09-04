/**
 * Lighthouse against the production build.
 *   node scripts/lh.mjs [--route /blog] [--desktop] [--port 3211] [--no-warm]
 *
 * Warms the route in a real page first. `next start` runs the image optimizer
 * on demand, so an unwarmed run measures the optimizer rather than the site.
 */
import lighthouse from 'lighthouse';
import { chromium } from 'playwright-core';

const args = process.argv.slice(2);
const val = (n, d) => {
  const i = args.indexOf(`--${n}`);
  return i >= 0 ? args[i + 1] : d;
};
const flag = (n) => args.includes(`--${n}`);

const raw = val('route', '/');
const route = raw.replace(/^[A-Za-z]:[/\\]Program Files[/\\]Git/, '') || '/';
const port = val('port', '3211');
const desktop = flag('desktop');
const url = `http://localhost:${port}${route}`;

const browser = await chromium.launch({
  channel: 'chrome',
  headless: true,
  args: ['--remote-debugging-port=9222'],
});

// ---- warm-up + LCP element identification ---------------------------------
let lcpInfo = null;
if (!flag('no-warm')) {
  const ctx = await browser.newContext({
    viewport: { width: 412, height: 823 },
    deviceScaleFactor: 2,
    isMobile: true,
  });
  const page = await ctx.newPage();
  await page.addInitScript(() => {
    window.__lcp = null;
    new PerformanceObserver((list) => {
      const e = list.getEntries().at(-1);
      if (!e) return;
      window.__lcp = {
        ms: Math.round(e.startTime),
        tag: e.element?.tagName ?? null,
        id: e.element?.id ?? null,
        cls: e.element?.className?.toString?.().slice(0, 90) ?? null,
        src: e.url || null,
        text: e.element?.textContent?.trim().slice(0, 70) ?? null,
      };
    }).observe({ type: 'largest-contentful-paint', buffered: true });
  });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
  await page.waitForTimeout(1200);
  lcpInfo = await page.evaluate(() => window.__lcp);
  await ctx.close();
}

// ---- lighthouse -----------------------------------------------------------
const result = await lighthouse(
  url,
  { port: 9222, output: 'json', logLevel: 'error' },
  desktop
    ? {
        extends: 'lighthouse:default',
        settings: {
          formFactor: 'desktop',
          screenEmulation: { mobile: false, width: 1440, height: 900, deviceScaleFactor: 1 },
          throttling: { rttMs: 40, throughputKbps: 10240, cpuSlowdownMultiplier: 1 },
        },
      }
    : undefined,
);

const { categories, audits } = result.lhr;
const pct = (c) => (c ? Math.round(c.score * 100) : '—');

console.log(`\n${desktop ? 'DESKTOP' : 'MOBILE'}  ${route}`);
console.log('─'.repeat(48));
console.log(`  Performance      ${pct(categories.performance)}`);
console.log(`  Accessibility    ${pct(categories.accessibility)}`);
console.log(`  Best practices   ${pct(categories['best-practices'])}`);
console.log(`  SEO              ${pct(categories.seo)}`);
console.log('─'.repeat(48));
for (const k of [
  'first-contentful-paint',
  'largest-contentful-paint',
  'total-blocking-time',
  'cumulative-layout-shift',
  'speed-index',
]) {
  const a = audits[k];
  if (a) console.log(`  ${a.title.padEnd(28)} ${a.displayValue ?? '—'}`);
}

if (lcpInfo) {
  console.log(
    `\n  LCP element (unthrottled ${lcpInfo.ms}ms): <${lcpInfo.tag}> ${
      lcpInfo.src ?? lcpInfo.text ?? lcpInfo.cls ?? ''
    }`,
  );
}

for (const id of [
  'color-contrast',
  'label-content-name-mismatch',
  'target-size',
  'image-aspect-ratio',
  'errors-in-console',
  'link-name',
  'button-name',
]) {
  const a = audits[id];
  if (!a || a.score === null || a.score === 1) continue;
  console.log(`\n  [${id}] ${a.title}`);
  for (const item of a.details?.items?.slice(0, 6) ?? []) {
    const n = item.node ?? {};
    console.log(`   · ${(n.snippet ?? item.description ?? item.reason ?? '').slice(0, 150)}`);
    if (n.explanation) console.log(`     ${n.explanation.slice(0, 190)}`);
  }
}

const net = audits['network-requests']?.details?.items ?? [];
const byType = (t) => net.filter((r) => r.resourceType === t);
const sum = (rows) => rows.reduce((a, r) => a + (r.transferSize ?? 0), 0);
console.log(`\n  Transfer: script ${Math.round(sum(byType('Script')) / 1024)}KB · css ${Math.round(
  sum(byType('Stylesheet')) / 1024,
)}KB · font ${Math.round(sum(byType('Font')) / 1024)}KB · img ${Math.round(
  sum(byType('Image')) / 1024,
)}KB`);

const mt = audits['mainthread-work-breakdown']?.details?.items ?? [];
if (mt.length) {
  console.log('\n  Main-thread work:');
  for (const r of mt.slice(0, 6)) {
    console.log(`   ${String(Math.round(r.duration)).padStart(5)} ms  ${r.group}`);
  }
}

const failed = Object.values(audits).filter(
  (a) => a.score !== null && a.score < 0.9 && a.scoreDisplayMode !== 'informative',
);
if (failed.length) {
  console.log('\n  Failing audits:');
  for (const a of failed.slice(0, 14)) {
    const saving = a.details?.overallSavingsMs
      ? ` (~${Math.round(a.details.overallSavingsMs)}ms)`
      : '';
    console.log(`   · [${a.id}] ${a.title}${saving}`);
  }
}

await browser.close();
