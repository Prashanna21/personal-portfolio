/**
 * Captures live screenshots of the shipped projects with the locally installed
 * Chrome, then emits AVIF + WebP derivatives and a tiny blur placeholder.
 *
 *   node scripts/capture-shots.mjs            # all targets
 *   node scripts/capture-shots.mjs auth-sync  # one target
 *
 * Output: public/work/<slug>.{avif,webp} and src/data/shot-placeholders.json
 */
import { chromium } from 'playwright-core';
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';

const OUT_DIR = path.join(process.cwd(), 'public', 'work');
const DATA_DIR = path.join(process.cwd(), 'src', 'data');

const TARGETS = [
  { slug: 'auth-sync', url: 'https://true2fa.com/' },
  { slug: 'orbit-chat', url: 'https://orbitchat.ai/' },
  { slug: 'vrit', url: 'https://vrittechnologies.com/' },
  { slug: 'everest-thrills', url: 'https://everestthrills.com/' },
];

/**
 * Remove floating chat bubbles / cookie bars only. Deliberately conservative:
 * an earlier version force-set opacity on every element to defeat scroll-reveal
 * libraries, which un-hid Everest Thrills' mobile menu overlay and wrecked the
 * shot. Better to wait for the page than to fight its CSS.
 */
const SETTLE = () => {
  const KILL = [
    '[id*="cookie" i]', '[class*="cookie" i]',
    '[id*="consent" i]', '[class*="consent" i]',
    '#crisp-chatbox', '.grecaptcha-badge',
    '[class*="whatsapp" i]', '[id*="whatsapp" i]',
    '[class*="chat-widget" i]', '[class*="floating" i]',
  ];
  for (const sel of KILL) {
    document.querySelectorAll(sel).forEach((el) => {
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      const floating = cs.position === 'fixed' || cs.position === 'sticky';
      // only remove small floating furniture, never in-flow page content
      if (floating && r.height > 0 && r.height < window.innerHeight * 0.35) el.remove();
    });
  }
};

async function shoot(browser, { slug, url }) {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
    colorScheme: 'light',
    reducedMotion: 'reduce',
  });
  const page = await ctx.newPage();
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForLoadState('networkidle', { timeout: 25000 }).catch(() => {});
    // nudge lazy-loaded hero media, then return to top and let reveals finish
    await page.evaluate(() => window.scrollTo(0, 700));
    await page.waitForTimeout(1400);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1800);
    await page.evaluate(SETTLE);
    await page.waitForTimeout(600);
    await page.waitForFunction(() =>
      [...document.images].every((i) => !i.loading || i.complete), null, { timeout: 8000 },
    ).catch(() => {});

    const png = await page.screenshot({ type: 'png' });
    await fs.mkdir(OUT_DIR, { recursive: true });

    const base = sharp(png).resize({ width: 1600, withoutEnlargement: true });
    await base.clone().avif({ quality: 62, effort: 6 }).toFile(path.join(OUT_DIR, `${slug}.avif`));
    await base.clone().webp({ quality: 78 }).toFile(path.join(OUT_DIR, `${slug}.webp`));

    const blur = await sharp(png).resize(16).webp({ quality: 40 }).toBuffer();
    const meta = await sharp(png).metadata();

    const stat = await fs.stat(path.join(OUT_DIR, `${slug}.avif`));
    console.log(`  ok  ${slug.padEnd(16)} ${(stat.size / 1024).toFixed(0)}KB avif`);

    return {
      slug,
      width: meta.width,
      height: meta.height,
      blurDataURL: `data:image/webp;base64,${blur.toString('base64')}`,
    };
  } catch (err) {
    console.log(`  FAIL ${slug.padEnd(16)} ${err.message.split('\n')[0]}`);
    return null;
  } finally {
    await ctx.close();
  }
}

const only = process.argv[2];
const queue = only ? TARGETS.filter((t) => t.slug === only) : TARGETS;

const browser = await chromium.launch({ channel: 'chrome', headless: true });
console.log(`capturing ${queue.length} target(s)\n`);

const results = [];
for (const t of queue) {
  const r = await shoot(browser, t);
  if (r) results.push(r);
}
await browser.close();

await fs.mkdir(DATA_DIR, { recursive: true });
const file = path.join(DATA_DIR, 'shot-placeholders.json');
let existing = {};
try {
  existing = JSON.parse(await fs.readFile(file, 'utf8'));
} catch {}
for (const r of results) existing[r.slug] = r;
await fs.writeFile(file, JSON.stringify(existing, null, 2) + '\n');

console.log(`\n${results.length}/${queue.length} captured -> public/work/`);
