/** node scripts/crop.mjs <file> --x 1200 --y 1400 --s 320 --zoom 3 */
import sharp from 'sharp';
import path from 'node:path';

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith('--'));
const val = (n, d) => {
  const i = args.indexOf(`--${n}`);
  return i >= 0 ? Number(args[i + 1]) : d;
};
const x = val('x', 0);
const y = val('y', 0);
const s = val('s', 300);
const zoom = val('zoom', 3);

const src = sharp(file);
const { width, height } = await src.metadata();
const left = Math.max(0, Math.min(x - s / 2, width - s));
const top = Math.max(0, Math.min(y - s / 2, height - s));

const out = path.join(path.dirname(file), `${path.basename(file, '.png')}_crop.png`);
await src
  .extract({ left: Math.round(left), top: Math.round(top), width: Math.round(s), height: Math.round(s) })
  .resize({ width: Math.round(s * zoom), kernel: 'nearest' })
  .toFile(out);
console.log(out);
