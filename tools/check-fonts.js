// tools/check-fonts.js — verifies glyph coverage of candidate fonts for Qaraqalpaq Latin + RU/KZ Cyrillic.
// fontsource splits each font into latin/latin-ext/cyrillic/cyrillic-ext unicode-range subset
// files, so a font's full coverage = union of glyphs across all its subset files.
const fs = require('fs');
const opentype = require('opentype.js');
const { decompress } = require('wawoff2');

const qqChars = ['ı', 'I', 'ń', 'Ń', 'ǵ', 'Ǵ', 'ú', 'Ú', 'ó', 'Ó', 'á', 'Á'];
const kzChars = ['ә', 'Ә', 'ғ', 'Ғ', 'қ', 'Қ', 'ң', 'Ң', 'ө', 'Ө', 'ұ', 'Ұ', 'ү', 'Ү', 'һ', 'Һ', 'і', 'І'];
const ruSample = ['а', 'б', 'в', 'я', 'ё', 'э'];

const fonts = {
  'PT Serif': { dir: 'node_modules/@fontsource/pt-serif/files', base: 'pt-serif', weight: '400' },
  'PT Sans': { dir: 'node_modules/@fontsource/pt-sans/files', base: 'pt-sans', weight: '400' },
  'Alegreya': { dir: 'node_modules/@fontsource-variable/alegreya/files', base: 'alegreya', weight: 'wght' },
  'Golos Text': { dir: 'node_modules/@fontsource-variable/golos-text/files', base: 'golos-text', weight: 'wght' },
  'Spectral': { dir: 'node_modules/@fontsource/spectral/files', base: 'spectral', weight: '400' },
  'Marcellus': { dir: 'node_modules/@fontsource/marcellus/files', base: 'marcellus', weight: '400' },
};
const subsets = ['latin', 'latin-ext', 'cyrillic', 'cyrillic-ext'];

async function loadFont(file) {
  if (!fs.existsSync(file)) return null;
  const ttf = await decompress(fs.readFileSync(file));
  return opentype.parse(ttf.buffer.slice(ttf.byteOffset, ttf.byteOffset + ttf.byteLength));
}

function has(font, ch) {
  return font.charToGlyphIndex(ch) !== 0;
}

(async () => {
  for (const [label, { dir, base, weight }] of Object.entries(fonts)) {
    const loaded = {};
    for (const s of subsets) {
      const font = await loadFont(`${dir}/${base}-${s}-${weight}-normal.woff2`);
      if (font) loaded[s] = font;
    }
    const anyHas = (ch) => Object.values(loaded).some((f) => has(f, ch));
    const missingQQ = qqChars.filter((ch) => !anyHas(ch));
    const missingKZ = kzChars.filter((ch) => !anyHas(ch));
    const missingRU = ruSample.filter((ch) => !anyHas(ch));
    console.log(
      label,
      '| subsets:', Object.keys(loaded).join(','),
      '| QQ missing:', missingQQ.length ? missingQQ.join(' ') : 'NONE',
      '| KZ missing:', missingKZ.length ? missingKZ.join(' ') : 'NONE',
      '| RU missing:', missingRU.length ? missingRU.join(' ') : 'NONE',
    );
  }
})();
