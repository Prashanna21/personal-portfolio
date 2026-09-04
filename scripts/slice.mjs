/**
 * Slice a tall full-page screenshot into readable chunks for review.
 *   node scripts/slice.mjs <file.png> [--h 1500] [--w 1100]
 */
import sharp from 'sharp';
import path from 'node:path';

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith('--'));
const val = (n, d) => {
  const i = args.indexOf(`--${n}`);
  return i >= 0 ? Number(args[i + 1]) : d;
};
const outW = val('w', 1100);
const sliceH = val('h', 1500);

const src = sharp(file);
const { width, height } = await src.metadata();
const scale = outW / width;
const scaledH = Math.round(height * scale);

const resized = await src.resize({ width: outW }).png().toBuffer();
const dir = path.dirname(file);
const stem = path.basename(file, '.png');

const n = Math.ceil(scaledH / sliceH);
for (let i = 0; i < n; i++) {
  const top = i * sliceH;
  const h = Math.min(sliceH, scaledH - top);
  const out = path.join(dir, `${stem}_${String(i + 1).padStart(2, '0')}.png`);
  await sharp(resized).extract({ left: 0, top, width: outW, height: h }).toFile(out);
  console.log(out);
}
