// tools/screenshot.js — captures mobile + desktop screenshots of every page for design audit.
// Usage: node tools/screenshot.js <base-url> <out-dir>
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const baseUrl = process.argv[2] || 'http://localhost:8080';
const outDir = process.argv[3] || 'tools/shots/before';

const pages = [
  'index.html', 'indexRU.html', 'indexKZ.html',
  'listsQQ.html', 'listsRU.html', 'listsKZ.html',
  'schemeQQ.html', 'schemeRU.html', 'schemeKZ.html',
  'exogamyQQ.html', 'exogamyRU.html', 'exogamyKZ.html',
  'statsQQ.html', 'statsRU.html', 'statsKZ.html',
];

const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'desktop', width: 1440, height: 900 },
];

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch();
  for (const vp of viewports) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 2 });
    const page = await context.newPage();
    for (const file of pages) {
      const url = `${baseUrl}/${file}`;
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(500);
        const outFile = path.join(outDir, `${file.replace('.html', '')}_${vp.name}.png`);
        await page.screenshot({ path: outFile, fullPage: true });
        console.log('OK', outFile);
      } catch (e) {
        console.log('FAIL', url, e.message);
      }
    }
    await context.close();
  }
  await browser.close();
})();
