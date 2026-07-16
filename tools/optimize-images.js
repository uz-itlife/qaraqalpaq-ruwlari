// tools/optimize-images.js — one-off: resize decorative/icon images down to their
// actual display size (Stage 5 polish). Overwrites in place, same filename/format,
// so no HTML changes are needed. Run once; not part of any build step.
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', 'images');

const jobs = [
  // flag icons in .lang-switch, displayed at max 53px (3rem) — 160px covers 3x retina
  { file: 'QQ_.png', resize: { width: 160, height: 160 }, opts: { compressionLevel: 9 } },
  { file: 'KZ.webp', resize: { width: 160, height: 160 }, webp: { quality: 85 } },
  { file: 'RU.jpg', resize: { width: 160, height: 160 }, jpeg: { quality: 85 } },
  // favicon (shortcut icon), never displayed larger than ~180px
  { file: 'naqsh.jpg', resize: { width: 180, height: 180 }, jpeg: { quality: 85 } },
  // og:image / twitter:image, standard social preview size
  { file: 'preview.png', resize: { width: 1200, height: 630 }, opts: { compressionLevel: 9 } },
];

(async () => {
  for (const job of jobs) {
    const file = path.join(root, job.file);
    const source = fs.readFileSync(file); // read fully so sharp holds no handle on `file`
    const before = source.length;
    let img = sharp(source).resize({ ...job.resize, fit: 'cover' });
    if (job.webp) img = img.webp(job.webp);
    else if (job.jpeg) img = img.jpeg(job.jpeg);
    else img = img.png(job.opts);
    const buf = await img.toBuffer();
    fs.writeFileSync(file, buf);
    console.log(job.file, before, '->', buf.length, 'bytes');
  }
})();
