// tools/inject-stage3.js — one-off script: wires the Stage 3 assets (theme-init.js,
// main.css preload+link, main.js) into all 15 page HTML files via anchor-based
// string replace, so we don't hand-edit the same 3 tags 15 times.
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const pages = [
  'index.html', 'indexRU.html', 'indexKZ.html',
  'listsQQ.html', 'listsRU.html', 'listsKZ.html',
  'schemeQQ.html', 'schemeRU.html', 'schemeKZ.html',
  'exogamyQQ.html', 'exogamyRU.html', 'exogamyKZ.html',
  'statsQQ.html', 'statsRU.html', 'statsKZ.html',
];

let changed = 0;
for (const file of pages) {
  const full = path.join(root, file);
  let html = fs.readFileSync(full, 'utf8');
  const before = html;

  if (!html.includes('assets/js/theme-init.js')) {
    html = html.replace(
      /(<meta charset="UTF-8">\s*\n)/,
      '$1  <script src="assets/js/theme-init.js"></script>\n'
    );
  }
  if (!html.includes('assets/css/main.css')) {
    html = html.replace(
      /(\s*<link rel="stylesheet" href="css\/shared-features\.css">)/,
      '$1\n    <link rel="preload" as="font" type="font/woff2" href="assets/fonts/pt-sans-latin-ext-400-normal.woff2" crossorigin>' +
      '\n    <link rel="preload" as="font" type="font/woff2" href="assets/fonts/pt-serif-latin-ext-700-normal.woff2" crossorigin>' +
      '\n    <link rel="stylesheet" href="assets/css/main.css">'
    );
  }
  if (!html.includes('assets/js/main.js')) {
    html = html.replace(
      /(<script src="js\/shared-features\.js"><\/script>)/,
      '$1\n    <script src="assets/js/main.js"></script>'
    );
  }

  if (html !== before) {
    fs.writeFileSync(full, html, 'utf8');
    changed++;
    console.log('updated', file);
  } else {
    console.log('SKIPPED (no anchor matched or already present)', file);
  }
}
console.log(changed + '/' + pages.length + ' files updated');
