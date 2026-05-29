# Qaraqalpaq App Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 13 UX/feature improvements across 12 HTML files and 3 new statistics pages for the Qaraqalpaq genealogical web app.

**Architecture:** All shared logic (theme toggle, favorites, share button, tamga SVG) goes into two new files — `js/shared-features.js` and `css/shared-features.css` — included via `<link>`/`<script>` tags in every page. Per-page features (search dropdown, list filters, D3 animation, breadcrumbs, PDF export) are added inline in the relevant files. Three new statistics pages (`statsQQ.html`, `statsKZ.html`, `statsRU.html`) are created fresh.

**Tech Stack:** Vanilla JS, CSS variables, Chart.js CDN (statistics only), D3.js already present in scheme pages, localStorage API, Clipboard API.

**File inventory:**
- CREATE: `css/shared-features.css` — light/dark theme variables + shared component styles
- CREATE: `js/shared-features.js` — theme toggle, favorites, share button, tamga SVG, empty states
- CREATE: `statsQQ.html`, `statsKZ.html`, `statsRU.html` — statistics pages
- MODIFY (search dropdown + breadcrumbs + mobile redirect): `index.html`, `indexKZ.html`, `indexRU.html`
- MODIFY (filter buttons + badges + PDF export): `listsQQ.html`, `listsKZ.html`, `listsRU.html`
- MODIFY (D3 collapsible animation): `schemeQQ.html`, `schemeKZ.html`, `schemeRU.html`
- MODIFY (include shared files only): `exogamyQQ.html`, `exogamyKZ.html`, `exogamyRU.html`

**Language text map:**
| Key | QQ (kaa) | KZ (kk) | RU (ru) |
|-----|----------|---------|---------|
| theme_dark | Qaranǵı | Қараңғы | Тёмная |
| theme_light | Aqshıl | Ашық | Светлая |
| share_copied | Silteme kóshirildi | Сілтеме көшірілді | Ссылка скопирована |
| share_btn | Bólisiw | Бөлісу | Поделиться |
| fav_add | Tańdaǵanlarga | Таңдаулыларға | В избранное |
| fav_remove | Alıp taslaw | Жою | Удалить |
| fav_title | Tańdaǵanlar | Таңдаулылар | Избранное |
| filter_all | Barlıǵı | Барлығы | Все |
| filter_uruw | Urıwlar | Рулар | Роды |
| filter_tiyre | Tiyreler | Тірелер | Тире |
| filter_koshe | Kósheler | Көшелер | Коше |
| filter_tamga | Tamǵalı | Тамғалы | С тамгой |
| filter_uran | Uranlı | Уранды | С ураном |
| empty_info | Maǵlıwmat joq | Ақпарат жоқ | Нет данных |
| empty_invite | Maǵlıwmat qosıń | Ақпарат қосыңыз | Добавить сведения |
| print_btn | Basıp shıǵarıw | Басып шығару | Распечатать |
| stats_title | Statistika | Статистика | Статистика |
| breadcrumb_root | Qaraqalpaqlar | Қарақалпақтар | Каракалпаки |

---

## Task 1: Create shared CSS file

**Files:**
- Create: `css/shared-features.css`

- [ ] **Step 1: Create css/ directory and shared-features.css**

```css
/* css/shared-features.css */

/* ── LIGHT/DARK THEME ───────────────────────────────────────── */
:root {
  --primary-bg: #0f1419;
  --secondary-bg: #1a1f2e;
  --card-bg: #1e2535;
  --text-primary: #ecf0f1;
  --text-secondary: #bdc3c7;
  --border-color: #34495e;
  --gold: #f1c40f;
  --shadow: rgba(0,0,0,0.4);
}

body.light-theme {
  --primary-bg: #f5f5f0;
  --secondary-bg: #ffffff;
  --card-bg: #ffffff;
  --text-primary: #1a1a2e;
  --text-secondary: #4a4a6a;
  --border-color: #d0d0e0;
  --gold: #c8a000;
  --shadow: rgba(0,0,0,0.1);
}

body.light-theme {
  background: linear-gradient(135deg, #f5f5f0 0%, #e8e8f0 100%);
}

body.light-theme header {
  background: rgba(255,255,255,0.97);
}

body.light-theme .node-box {
  border-color: var(--border-color);
}

/* ── THEME TOGGLE BUTTON ─────────────────────────────────────── */
.theme-toggle-btn {
  background: rgba(255,255,255,0.1);
  border: 1px solid var(--gold);
  color: var(--gold);
  border-radius: 20px;
  padding: 0.3rem 0.8rem;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.3s;
  white-space: nowrap;
}
.theme-toggle-btn:hover { background: var(--gold); color: #000; }

/* ── SHARE BUTTON ────────────────────────────────────────────── */
.share-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(52,152,219,0.15);
  border: 1px solid #3498db;
  color: #3498db;
  border-radius: 16px;
  padding: 0.3rem 0.9rem;
  cursor: pointer;
  font-size: 0.82rem;
  transition: all 0.25s;
}
.share-btn:hover { background: #3498db; color: #fff; }

.share-toast {
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%) translateY(20px);
  background: #2ecc71;
  color: #fff;
  padding: 0.6rem 1.4rem;
  border-radius: 20px;
  font-size: 0.9rem;
  opacity: 0;
  transition: all 0.3s;
  z-index: 9999;
  pointer-events: none;
}
.share-toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }

/* ── FAVORITES ───────────────────────────────────────────────── */
.fav-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  line-height: 1;
  padding: 2px 4px;
  transition: transform 0.2s;
  color: var(--text-secondary);
}
.fav-btn:hover { transform: scale(1.3); }
.fav-btn.active { color: #f1c40f; }

.favorites-panel {
  position: fixed;
  top: 80px;
  right: 16px;
  background: var(--secondary-bg);
  border: 1px solid var(--gold);
  border-radius: 12px;
  padding: 12px;
  min-width: 220px;
  max-width: 300px;
  z-index: 900;
  box-shadow: 0 4px 20px var(--shadow);
  display: none;
}
.favorites-panel.open { display: block; }
.favorites-panel h4 {
  color: var(--gold);
  margin-bottom: 8px;
  font-size: 0.9rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 6px;
}
.fav-item {
  padding: 6px 8px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  color: var(--text-primary);
  transition: background 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.fav-item:hover { background: rgba(241,196,15,0.1); }
.fav-item-remove {
  color: var(--text-secondary);
  font-size: 0.75rem;
  cursor: pointer;
}
.fav-empty {
  color: var(--text-secondary);
  font-size: 0.82rem;
  text-align: center;
  padding: 8px 0;
}

/* ── TAMGA SVG ───────────────────────────────────────────────── */
.tamga-svg-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 0;
}
.tamga-svg-wrap svg {
  filter: drop-shadow(0 0 6px rgba(231,76,60,0.5));
}

/* ── EMPTY STATE ─────────────────────────────────────────────── */
.empty-state {
  text-align: center;
  padding: 12px;
  border: 1px dashed var(--border-color);
  border-radius: 8px;
  margin: 8px 0;
  color: var(--text-secondary);
  font-size: 0.82rem;
}
.empty-state a {
  color: var(--gold);
  text-decoration: none;
  font-size: 0.8rem;
  display: block;
  margin-top: 4px;
}
.empty-state a:hover { text-decoration: underline; }

/* ── SEARCH DROPDOWN ─────────────────────────────────────────── */
.search-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--secondary-bg);
  border: 1px solid var(--gold);
  border-radius: 0 0 12px 12px;
  max-height: 280px;
  overflow-y: auto;
  z-index: 1100;
  box-shadow: 0 8px 24px var(--shadow);
  display: none;
}
.search-dropdown.open { display: block; }
.search-result-item {
  padding: 8px 14px;
  cursor: pointer;
  border-bottom: 1px solid var(--border-color);
  transition: background 0.15s;
}
.search-result-item:last-child { border-bottom: none; }
.search-result-item:hover { background: rgba(241,196,15,0.1); }
.search-result-name {
  font-size: 0.9rem;
  color: var(--text-primary);
  font-weight: 600;
}
.search-result-path {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-top: 2px;
}

/* ── BREADCRUMBS ─────────────────────────────────────────────── */
.breadcrumb-bar {
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  background: rgba(10,12,16,0.92);
  border-bottom: 1px solid var(--border-color);
  padding: 5px 16px;
  font-size: 0.78rem;
  color: var(--text-secondary);
  z-index: 990;
  display: none;
  align-items: center;
  gap: 6px;
  backdrop-filter: blur(6px);
  white-space: nowrap;
  overflow-x: auto;
}
.breadcrumb-bar.visible { display: flex; }
body.light-theme .breadcrumb-bar { background: rgba(245,245,240,0.95); }
.breadcrumb-sep { opacity: 0.5; }
.breadcrumb-item {
  color: var(--gold);
  cursor: pointer;
}
.breadcrumb-item:hover { text-decoration: underline; }
.breadcrumb-item.current { color: var(--text-primary); cursor: default; }
.breadcrumb-item.current:hover { text-decoration: none; }

/* ── LIST FILTER BUTTONS ─────────────────────────────────────── */
.list-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 10px 16px;
  background: var(--secondary-bg);
  border-bottom: 1px solid var(--border-color);
}
.filter-chip {
  padding: 4px 12px;
  border-radius: 14px;
  border: 1px solid var(--border-color);
  background: transparent;
  color: var(--text-secondary);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
}
.filter-chip:hover { border-color: var(--gold); color: var(--gold); }
.filter-chip.active {
  background: var(--gold);
  color: #000;
  border-color: var(--gold);
  font-weight: 600;
}

/* ── LIST ITEM BADGES ────────────────────────────────────────── */
.list-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 4px;
}
.list-badge {
  font-size: 0.72rem;
  padding: 2px 7px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  gap: 3px;
}
.badge-tamga { background: rgba(231,76,60,0.15); color: #e74c3c; border: 1px solid rgba(231,76,60,0.3); }
.badge-uran  { background: rgba(46,204,113,0.15); color: #2ecc71; border: 1px solid rgba(46,204,113,0.3); }
.badge-pop   { background: rgba(52,152,219,0.15); color: #3498db; border: 1px solid rgba(52,152,219,0.3); }

/* ── PDF PRINT BUTTON ────────────────────────────────────────── */
.print-btn {
  background: rgba(155,89,182,0.15);
  border: 1px solid #9b59b6;
  color: #9b59b6;
  border-radius: 16px;
  padding: 0.3rem 0.9rem;
  cursor: pointer;
  font-size: 0.82rem;
  transition: all 0.25s;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}
.print-btn:hover { background: #9b59b6; color: #fff; }

@media print {
  header, .list-filters, .print-btn, .theme-toggle-btn,
  .share-btn, .fav-btn, .favorites-panel, .breadcrumb-bar,
  .view-switch, .lang-switch, .burger-menu { display: none !important; }
  body { background: #fff !important; color: #000 !important; padding-top: 0 !important; }
  .list-panel { width: 100% !important; }
  .info-panel { display: none !important; }
  .list-item { break-inside: avoid; }
  .list-item.hidden-by-filter { display: block !important; }
}

@media (max-width: 480px) {
  .favorites-panel { right: 8px; min-width: 200px; }
  .breadcrumb-bar { font-size: 0.72rem; }
}
```

- [ ] **Step 2: Commit**
```bash
git add css/shared-features.css
git commit -m "feat: add shared CSS for theme, favorites, share, search, badges"
```

---

## Task 2: Create shared JavaScript file

**Files:**
- Create: `js/shared-features.js`

- [ ] **Step 1: Create js/ directory and shared-features.js**

```js
// js/shared-features.js
// Shared utilities: theme, favorites, share, tamga SVG, empty states

/* ── THEME ─────────────────────────────────────────────────── */
const THEME_KEY = 'qq-theme';

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'light') document.body.classList.add('light-theme');
  updateThemeBtn();
}

function toggleTheme() {
  document.body.classList.toggle('light-theme');
  const isLight = document.body.classList.contains('light-theme');
  localStorage.setItem(THEME_KEY, isLight ? 'light' : 'dark');
  updateThemeBtn();
}

function updateThemeBtn() {
  const btn = document.getElementById('themeToggleBtn');
  if (!btn) return;
  const isLight = document.body.classList.contains('light-theme');
  btn.textContent = isLight ? (btn.dataset.dark || '🌙 Dark') : (btn.dataset.light || '☀️ Light');
}

/* ── FAVORITES ──────────────────────────────────────────────── */
const FAV_KEY = 'qq-favorites';
const MAX_FAVS = 5;

function getFavorites() {
  try { return JSON.parse(localStorage.getItem(FAV_KEY)) || []; }
  catch { return []; }
}

function saveFavorites(favs) {
  localStorage.setItem(FAV_KEY, JSON.stringify(favs));
}

function isFavorite(id) {
  return getFavorites().some(f => f.id === id);
}

function toggleFavorite(id, name) {
  let favs = getFavorites();
  if (isFavorite(id)) {
    favs = favs.filter(f => f.id !== id);
  } else {
    if (favs.length >= MAX_FAVS) favs.shift();
    favs.push({ id, name });
  }
  saveFavorites(favs);
  renderFavoritesPanel();
  updateFavBtn(id);
}

function updateFavBtn(id) {
  const btn = document.getElementById('fav-btn-' + id);
  if (!btn) return;
  btn.classList.toggle('active', isFavorite(id));
  btn.title = isFavorite(id) ? (btn.dataset.remove || 'Remove') : (btn.dataset.add || 'Add');
}

function renderFavoritesPanel() {
  const panel = document.getElementById('favoritesPanel');
  if (!panel) return;
  const favs = getFavorites();
  const title = panel.dataset.title || 'Favorites';
  const empty = panel.dataset.empty || 'No favorites yet';
  let html = `<h4>⭐ ${title}</h4>`;
  if (favs.length === 0) {
    html += `<div class="fav-empty">${empty}</div>`;
  } else {
    favs.forEach(f => {
      html += `<div class="fav-item" onclick="navigateToFavorite('${f.id}')">
        <span>${f.name}</span>
        <span class="fav-item-remove" onclick="event.stopPropagation();removeFavorite('${f.id}')">✕</span>
      </div>`;
    });
  }
  panel.innerHTML = html;
}

function removeFavorite(id) {
  let favs = getFavorites().filter(f => f.id !== id);
  saveFavorites(favs);
  renderFavoritesPanel();
  updateFavBtn(id);
}

function toggleFavoritesPanel() {
  const panel = document.getElementById('favoritesPanel');
  if (panel) panel.classList.toggle('open');
}

// navigateToFavorite is implemented per-page (calls showInfo / scrolls to node)

/* ── SHARE ──────────────────────────────────────────────────── */
function shareCurrentNode(id, copiedText) {
  const url = window.location.href.split('#')[0] + '#' + id;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(url).then(() => showShareToast(copiedText));
  } else {
    const ta = document.createElement('textarea');
    ta.value = url;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showShareToast(copiedText);
  }
}

function showShareToast(msg) {
  let toast = document.getElementById('shareToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'shareToast';
    toast.className = 'share-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg || '✓ Copied';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

/* ── TAMGA SVG ──────────────────────────────────────────────── */
const TAMGA_SVG_MAP = {
  // Karakalpak tamgas — key = abbreviation, value = SVG path data
  // If no custom SVG defined, falls back to styled text rendering
};

function renderTamgaSVG(tamgaText, size = 80) {
  if (!tamgaText) return '';
  const custom = TAMGA_SVG_MAP[tamgaText];
  if (custom) {
    return `<div class="tamga-svg-wrap">
      <svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="46" stroke="#e74c3c" stroke-width="2" fill="rgba(231,76,60,0.08)"/>
        ${custom}
      </svg>
    </div>`;
  }
  // Fallback: styled text in circle
  const fontSize = tamgaText.length > 3 ? 18 : tamgaText.length > 2 ? 22 : 28;
  return `<div class="tamga-svg-wrap">
    <svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="46" stroke="#e74c3c" stroke-width="2" fill="rgba(231,76,60,0.08)"/>
      <text x="50" y="50" dominant-baseline="central" text-anchor="middle"
            font-family="'Cormorant Garamond',serif" font-size="${fontSize}"
            fill="#e74c3c" font-weight="bold" letter-spacing="1">${tamgaText}</text>
    </svg>
  </div>`;
}

/* ── EMPTY STATE ─────────────────────────────────────────────── */
function renderEmptyState(noDataText, inviteText, telegramUrl) {
  return `<div class="empty-state">
    <div>🔍 ${noDataText}</div>
    <a href="${telegramUrl || 'https://t.me/qaraqalpaq_rulari'}" target="_blank">+ ${inviteText}</a>
  </div>`;
}

/* ── ANCHOR NAVIGATION ──────────────────────────────────────── */
function handleAnchorOnLoad() {
  const hash = window.location.hash;
  if (!hash) return;
  const id = hash.replace('#', '');
  // Delay to let tree render first
  setTimeout(() => {
    const el = document.getElementById('node-' + id) || document.getElementById('item-' + id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.click();
    }
  }, 500);
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  renderFavoritesPanel();
  handleAnchorOnLoad();
});
```

- [ ] **Step 2: Commit**
```bash
git add js/shared-features.js
git commit -m "feat: add shared JS for theme, favorites, share, tamga SVG, empty states"
```

---

## Task 3: Include shared files + add theme/fav buttons in all 12 pages

**Files:**
- Modify: `index.html`, `indexKZ.html`, `indexRU.html`
- Modify: `listsQQ.html`, `listsKZ.html`, `listsRU.html`
- Modify: `schemeQQ.html`, `schemeKZ.html`, `schemeRU.html`
- Modify: `exogamyQQ.html`, `exogamyKZ.html`, `exogamyRU.html`

**Pattern for every file — add in `<head>` before `</head>`:**
```html
<link rel="stylesheet" href="css/shared-features.css">
```

**Pattern — add before `</body>`:**
```html
<script src="js/shared-features.js"></script>
```

**Pattern — add theme + fav buttons inside `<header>`, after language switcher:**

QQ version:
```html
<button class="theme-toggle-btn" id="themeToggleBtn"
  data-light="☀️ Aqshıl" data-dark="🌙 Qaranǵı"
  onclick="toggleTheme()">🌙 Qaranǵı</button>
<button class="fav-btn" id="favToggleBtn" onclick="toggleFavoritesPanel()" title="Tańdaǵanlar">⭐</button>
<div class="favorites-panel" id="favoritesPanel"
  data-title="Tańdaǵanlar" data-empty="Tańdaǵanlar joq"></div>
```

KZ version:
```html
<button class="theme-toggle-btn" id="themeToggleBtn"
  data-light="☀️ Ашық" data-dark="🌙 Қараңғы"
  onclick="toggleTheme()">🌙 Қараңғы</button>
<button class="fav-btn" id="favToggleBtn" onclick="toggleFavoritesPanel()" title="Таңдаулылар">⭐</button>
<div class="favorites-panel" id="favoritesPanel"
  data-title="Таңдаулылар" data-empty="Таңдаулылар жоқ"></div>
```

RU version:
```html
<button class="theme-toggle-btn" id="themeToggleBtn"
  data-light="☀️ Светлая" data-dark="🌙 Тёмная"
  onclick="toggleTheme()">🌙 Тёмная</button>
<button class="fav-btn" id="favToggleBtn" onclick="toggleFavoritesPanel()" title="Избранное">⭐</button>
<div class="favorites-panel" id="favoritesPanel"
  data-title="Избранное" data-empty="Нет избранного"></div>
```

- [ ] **Step 1:** Add `<link>` to shared CSS in all 12 files (after existing `</style>`)
- [ ] **Step 2:** Add `<script>` to shared JS in all 12 files (before `</body>`)
- [ ] **Step 3:** Add theme+fav buttons in all 12 header sections
- [ ] **Step 4: Commit**
```bash
git add index.html indexKZ.html indexRU.html listsQQ.html listsKZ.html listsRU.html \
  schemeQQ.html schemeKZ.html schemeRU.html exogamyQQ.html exogamyKZ.html exogamyRU.html
git commit -m "feat: include shared CSS/JS and add theme/favorites buttons to all pages"
```

---

## Task 4: Search dropdown with path — index × 3 langs

**Files:**
- Modify: `index.html`, `indexKZ.html`, `indexRU.html`

**Context:** Each file has a `.search-box` div containing `<input id="searchInput">` and calls `searchNode()` on keyup. The tree data is in `const treeData = {...}`.

**Step 1: Wrap search-box for positioning and add dropdown div**

Find:
```html
<div class="search-box">
  <input type="text" id="searchInput" placeholder="Izlew..." onkeyup="searchNode()"/>
</div>
```

Replace (QQ):
```html
<div class="search-box" style="position:relative">
  <input type="text" id="searchInput" placeholder="Izlew..."
    oninput="searchWithDropdown(this.value)" onkeyup="handleSearchKey(event)"
    autocomplete="off"/>
  <div class="search-dropdown" id="searchDropdown"></div>
</div>
```

For KZ: `placeholder="Іздеу..."`, For RU: `placeholder="Поиск..."`

**Step 2: Add search functions in `<script>` section of each index file**

```js
// Search index built from tree data
let _searchIndex = null;

function buildSearchIndex(node, path, result) {
  if (!result) result = [];
  if (!path) path = [];
  const currentPath = [...path, node.name];
  result.push({ id: node.id, name: node.name, path: currentPath, node });
  if (node.children) node.children.forEach(c => buildSearchIndex(c, currentPath, result));
  return result;
}

function getSearchIndex() {
  if (!_searchIndex) _searchIndex = buildSearchIndex(treeData, []);
  return _searchIndex;
}

function searchWithDropdown(query) {
  const dd = document.getElementById('searchDropdown');
  if (!query || query.length < 2) { dd.classList.remove('open'); return; }
  const q = query.toLowerCase();
  const results = getSearchIndex()
    .filter(r => r.name.toLowerCase().includes(q))
    .slice(0, 8);
  if (results.length === 0) { dd.classList.remove('open'); return; }
  dd.innerHTML = results.map(r => {
    const pathStr = r.path.slice(0, -1).join(' → ');
    return `<div class="search-result-item" onclick="selectSearchResult('${r.id}')">
      <div class="search-result-name">${r.name}</div>
      ${pathStr ? `<div class="search-result-path">${pathStr}</div>` : ''}
    </div>`;
  }).join('');
  dd.classList.add('open');
}

function selectSearchResult(id) {
  document.getElementById('searchDropdown').classList.remove('open');
  document.getElementById('searchInput').value = '';
  const el = document.getElementById('node-' + id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.click();
  }
}

function handleSearchKey(e) {
  if (e.key === 'Escape') {
    document.getElementById('searchDropdown').classList.remove('open');
    document.getElementById('searchInput').value = '';
  }
}

// Close dropdown on outside click
document.addEventListener('click', e => {
  if (!e.target.closest('.search-box')) {
    const dd = document.getElementById('searchDropdown');
    if (dd) dd.classList.remove('open');
  }
});
```

- [ ] **Step 1:** Update search input HTML in all 3 index files
- [ ] **Step 2:** Add search JS functions in all 3 index files
- [ ] **Step 3: Commit**
```bash
git add index.html indexKZ.html indexRU.html
git commit -m "feat: add search dropdown with ancestor path on index pages"
```

---

## Task 5: Share button + favorites in info panels — index × 3 langs

**Files:**
- Modify: `index.html`, `indexKZ.html`, `indexRU.html`

**Context:** `showInfo(data)` function builds HTML for the info panel. Find the section that creates the panel header (after `infoContent` is populated).

**Step 1: In `showInfo(data)` function, after building the header HTML, add share + fav buttons**

Find the line that sets `document.getElementById('infoContent').innerHTML = ...` or `html +=` for the header section. After the `info-title` / `info-type` header block, append:

```js
// Add this at the END of showInfo(), before the closing brace:
const nodeId = data.id;
const nodeName = data.name;
const copiedText = 'Silteme kóshirildi ✓'; // QQ | 'Сілтеме көшірілді ✓' KZ | 'Ссылка скопирована ✓' RU
const addText = 'Tańdaǵanlarga'; // QQ | 'Таңдаулыларға' KZ | 'В избранное' RU
const removeText = 'Alıp taslaw'; // QQ | 'Жою' KZ | 'Удалить' RU
const shareText = 'Bólisiw'; // QQ | 'Бөлісу' KZ | 'Поделиться' RU

const actionBar = `<div style="display:flex;gap:8px;flex-wrap:wrap;margin:10px 0">
  <button class="share-btn" onclick="shareCurrentNode('${nodeId}','${copiedText}')">
    🔗 ${shareText}
  </button>
  <button class="fav-btn ${isFavorite(nodeId) ? 'active' : ''}"
    id="fav-btn-${nodeId}"
    data-add="${addText}" data-remove="${removeText}"
    onclick="toggleFavorite('${nodeId}','${nodeName}')">
    ${isFavorite(nodeId) ? '★' : '☆'}
  </button>
</div>`;

// Insert actionBar into infoContent after header
const infoContent = document.getElementById('infoContent');
const headerEl = infoContent.querySelector('.info-header');
if (headerEl) headerEl.insertAdjacentHTML('afterend', actionBar);

// Also update URL hash
history.replaceState(null, '', '#' + nodeId);
```

**Step 2: Add `navigateToFavorite` implementation (per page)**
```js
function navigateToFavorite(id) {
  toggleFavoritesPanel(); // close panel
  const el = document.getElementById('node-' + id);
  if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.click(); }
}
```

- [ ] **Step 1:** Add share + fav logic in `showInfo()` in all 3 index files
- [ ] **Step 2:** Add `navigateToFavorite` function in all 3 index files
- [ ] **Step 3: Commit**
```bash
git add index.html indexKZ.html indexRU.html
git commit -m "feat: add share button and favorites in info panel on index pages"
```

---

## Task 6: Share + favorites in lists pages

**Files:**
- Modify: `listsQQ.html`, `listsKZ.html`, `listsRU.html`

Same as Task 5 but for lists pages. The `showInfo`/`showDetails` function in lists pages builds the info panel. Find where `tamga-box` and `uran-box` are added and insert the action bar before them.

Also add `navigateToFavorite`:
```js
function navigateToFavorite(id) {
  toggleFavoritesPanel();
  const el = document.getElementById('item-' + id);
  if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.click(); }
}
```

- [ ] **Step 1:** Add share + fav in lists info panels (3 files)
- [ ] **Step 2:** Add `navigateToFavorite` in 3 files
- [ ] **Step 3: Commit**
```bash
git add listsQQ.html listsKZ.html listsRU.html
git commit -m "feat: add share and favorites to lists info panels"
```

---

## Task 7: Tamga SVG + empty states in info panels — all pages

**Files:**
- Modify: `index.html`, `indexKZ.html`, `indexRU.html`
- Modify: `listsQQ.html`, `listsKZ.html`, `listsRU.html`

**Context:** Info panels currently render tamga as:
```js
html += '<div class="tamga-box"><div class="tamga-symbol">' + tamga + '</div>...'
```

**Replace tamga rendering in showInfo() — all 6 files:**

Find:
```js
html += '<div class="tamga-box"><div class="tamga-symbol">' + tamga + '</div><div class="tamga-label">
```

Replace (QQ):
```js
html += '<div class="tamga-box">' + renderTamgaSVG(tamga, 90) +
  '<div class="tamga-label">TAMǴA (Ruwlıq belgi)</div></div>';
```
Replace (KZ): label = `ТАМҒА (Рулық белгі)`
Replace (RU): label = `ТАМГА (Родовой знак)`

**Add empty states — when tamga, uran, or history all absent:**

```js
const hasInfo = tamga || uran || (data.info && Object.keys(data.info).length > 0);
if (!hasInfo) {
  // QQ:
  html += renderEmptyState('Maǵlıwmat joq', 'Maǵlıwmat qosıń');
  // KZ:
  // html += renderEmptyState('Ақпарат жоқ', 'Ақпарат қосыңыз');
  // RU:
  // html += renderEmptyState('Нет данных', 'Добавить сведения');
}
```

- [ ] **Step 1:** Replace tamga HTML rendering in all 6 files
- [ ] **Step 2:** Add empty state logic in all 6 files
- [ ] **Step 3: Commit**
```bash
git add index.html indexKZ.html indexRU.html listsQQ.html listsKZ.html listsRU.html
git commit -m "feat: tamga SVG renderer and empty states in info panels"
```

---

## Task 8: List filtering + badges — lists × 3 langs

**Files:**
- Modify: `listsQQ.html`, `listsKZ.html`, `listsRU.html`

**Context:** List items are rendered by `renderNode()` or similar; each item has a `data-type` and data fields. Items need `data-type`, `data-has-tamga`, `data-has-uran` attributes for filtering.

**Step 1: Add filter chips HTML above the list panel**

Find the list container div (class `list-panel` or similar). Insert BEFORE it (QQ):
```html
<div class="list-filters" id="listFilters">
  <button class="filter-chip active" data-filter="all" onclick="applyFilter('all')">Barlıǵı</button>
  <button class="filter-chip" data-filter="uruw" onclick="applyFilter('uruw')">🏘 Urıwlar</button>
  <button class="filter-chip" data-filter="tiyre" onclick="applyFilter('tiyre')">🌿 Tiyreler</button>
  <button class="filter-chip" data-filter="koshe" onclick="applyFilter('koshe')">🌱 Kósheler</button>
  <button class="filter-chip" data-filter="has-tamga" onclick="applyFilter('has-tamga')">🔴 Tamǵalı</button>
  <button class="filter-chip" data-filter="has-uran" onclick="applyFilter('has-uran')">📢 Uranlı</button>
</div>
```

KZ: Барлығы / Рулар / Тірелер / Көшелер / Тамғалы / Уранды
RU: Все / Роды / Тире / Коше / С тамгой / С ураном

**Step 2: Add filter JS**
```js
function applyFilter(type) {
  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  document.querySelector(`.filter-chip[data-filter="${type}"]`).classList.add('active');
  document.querySelectorAll('.list-item').forEach(item => {
    let show = true;
    if (type === 'uruw') show = item.dataset.type === 'uruw' || item.dataset.type === 'уруу' || item.dataset.type === 'род';
    else if (type === 'tiyre') show = item.dataset.type === 'tiyre' || item.dataset.type === 'тіре' || item.dataset.type === 'тире';
    else if (type === 'koshe') show = item.dataset.type === 'koshe' || item.dataset.type === 'көше' || item.dataset.type === 'коше';
    else if (type === 'has-tamga') show = item.dataset.hasTamga === 'true';
    else if (type === 'has-uran') show = item.dataset.hasUran === 'true';
    item.classList.toggle('hidden-by-filter', !show);
  });
}
```

**Step 3: Add `data-*` attributes and badges when rendering list items**

In the render function where list item HTML is built, add:
```js
// After building the node's element, set data attributes
element.dataset.type = node.type || node.túri || '';
element.dataset.hasTamga = !!(node.tamga || (node.info && node.info.tamga)) ? 'true' : 'false';
element.dataset.hasUran = !!(node.uran || (node.info && node.info.uran)) ? 'true' : 'false';
element.classList.add('list-item');

// Add badges inside the item
const tamgaVal = node.tamga || (node.info && node.info.tamga);
const uranVal  = node.uran  || (node.info && node.info.uran);
const popVal   = node.population || (node.info && node.info.population);
let badges = '';
if (tamgaVal) badges += `<span class="list-badge badge-tamga">🔴 ${tamgaVal}</span>`;
if (uranVal)  badges += `<span class="list-badge badge-uran">📢 ${uranVal}</span>`;
if (popVal)   badges += `<span class="list-badge badge-pop">👥 ${popVal}</span>`;
if (badges)   badges = `<div class="list-badges">${badges}</div>`;
// Append badges to item HTML
```

- [ ] **Step 1:** Add filter chips HTML in all 3 lists files
- [ ] **Step 2:** Add `applyFilter()` JS in all 3 lists files
- [ ] **Step 3:** Add `data-*` attributes + badges in render function (3 files)
- [ ] **Step 4: Commit**
```bash
git add listsQQ.html listsKZ.html listsRU.html
git commit -m "feat: list filter chips and inline tamga/uran/population badges"
```

---

## Task 9: PDF export button — lists × 3 langs

**Files:**
- Modify: `listsQQ.html`, `listsKZ.html`, `listsRU.html`

**Context:** Print CSS is already in `shared-features.css`. Just need a button that calls `window.print()`.

**Step 1: Add print button near the expand/collapse buttons area (QQ)**
```html
<button class="print-btn" onclick="window.print()">🖨️ Basıp shıǵarıw</button>
```
KZ: `🖨️ Басып шығару`
RU: `🖨️ Распечатать`

- [ ] **Step 1:** Add print button HTML in all 3 lists files
- [ ] **Step 2: Commit**
```bash
git add listsQQ.html listsKZ.html listsRU.html
git commit -m "feat: add PDF print button to lists pages"
```

---

## Task 10: Breadcrumbs in tree — index × 3 langs

**Files:**
- Modify: `index.html`, `indexKZ.html`, `indexRU.html`

**Context:** When a node is selected in the tree, `showInfo(data)` is called. We need to track the ancestor path and display it in a sticky bar below the header.

**Step 1: Add breadcrumb bar HTML after `<header>...</header>`**
```html
<div class="breadcrumb-bar" id="breadcrumbBar"></div>
```

**Step 2: Add breadcrumb logic in `<script>`**
```js
// Build ancestor path for a node
function getAncestorPath(root, targetId, path) {
  if (!path) path = [];
  if (root.id === targetId) return [...path, root];
  if (root.children) {
    for (const child of root.children) {
      const found = getAncestorPath(child, targetId, [...path, root]);
      if (found) return found;
    }
  }
  return null;
}

function updateBreadcrumb(nodeId) {
  const bar = document.getElementById('breadcrumbBar');
  if (!bar) return;
  const path = getAncestorPath(treeData, nodeId, []);
  if (!path || path.length === 0) { bar.classList.remove('visible'); return; }
  bar.classList.add('visible');
  bar.innerHTML = path.map((n, i) => {
    const isCurrent = i === path.length - 1;
    if (isCurrent) return `<span class="breadcrumb-item current">${n.name}</span>`;
    return `<span class="breadcrumb-item" onclick="selectSearchResult('${n.id}')">${n.name}</span>
            <span class="breadcrumb-sep">›</span>`;
  }).join('');
}
```

**Step 3: Call `updateBreadcrumb(data.id)` at the end of `showInfo()` in each index file.**

When panel closes, call:
```js
function closePanel() {
  // ... existing code ...
  document.getElementById('breadcrumbBar').classList.remove('visible');
}
```

- [ ] **Step 1:** Add `<div class="breadcrumb-bar" id="breadcrumbBar"></div>` in all 3 index files
- [ ] **Step 2:** Add breadcrumb JS functions in all 3 index files
- [ ] **Step 3:** Call `updateBreadcrumb()` in `showInfo()` and clear in `closePanel()`
- [ ] **Step 4: Commit**
```bash
git add index.html indexKZ.html indexRU.html
git commit -m "feat: add sticky breadcrumb path bar to index tree pages"
```

---

## Task 11: Mobile redirect to lists page — index × 3 langs

**Files:**
- Modify: `index.html`, `indexKZ.html`, `indexRU.html`

**Context:** On mobile (<768px) the tree is hard to use; `listsQQ/KZ/RU.html` is much better. Add a JS redirect that fires once per session (not every visit, to avoid trapping users).

**Step 1: Add early in `<script>` section (before DOMContentLoaded)**

QQ version:
```js
(function() {
  const isMobile = window.innerWidth < 768;
  const alreadyRedirected = sessionStorage.getItem('qq-mobile-redirected');
  if (isMobile && !alreadyRedirected) {
    sessionStorage.setItem('qq-mobile-redirected', '1');
    window.location.href = 'listsQQ.html';
  }
})();
```
KZ: redirect to `listsKZ.html`
RU: redirect to `listsRU.html`

- [ ] **Step 1:** Add IIFE redirect in all 3 index files
- [ ] **Step 2: Commit**
```bash
git add index.html indexKZ.html indexRU.html
git commit -m "feat: auto-redirect mobile users to list view on index pages"
```

---

## Task 12: Statistics pages — new statsQQ.html, statsKZ.html, statsRU.html

**Files:**
- Create: `statsQQ.html`, `statsKZ.html`, `statsRU.html`

**Navigation:** Add "Statistika" button to `<nav>` in ALL 12 existing pages (same pattern as existing view-switch buttons).

**Step 1: Create `statsQQ.html`** (KZ and RU follow same pattern, translate labels)

The file needs:
- Same header + nav as index.html (copy header block)
- Include `css/shared-features.css`
- Chart.js from CDN: `<script src="https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js"></script>`
- The tribeData constant (same tree data as index.html)
- 3 charts: aris distribution pie, top-10 tribes bar, type breakdown doughnut

```html
<!DOCTYPE html>
<html lang="kaa">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Statistika | Qaraqalpaq shejiresi</title>
  <!-- same meta/SEO tags as index.html -->
  <link rel="shortcut icon" href="./images/naqsh.jpg" type="image/x-icon">
  <!-- copy full <style> block from index.html -->
  <link rel="stylesheet" href="css/shared-features.css">
  <style>
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .stats-card {
      background: var(--secondary-bg);
      border: 1px solid var(--border-color);
      border-radius: 16px;
      padding: 20px;
    }
    .stats-card h3 {
      color: var(--gold);
      font-size: 1rem;
      margin-bottom: 16px;
      text-align: center;
    }
    .stats-card canvas { width: 100% !important; }
    .kpi-row {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      padding: 24px 24px 0;
      max-width: 1200px;
      margin: 0 auto;
    }
    .kpi-card {
      flex: 1; min-width: 140px;
      background: var(--secondary-bg);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 16px;
      text-align: center;
    }
    .kpi-value { font-size: 2rem; font-weight: bold; color: var(--gold); }
    .kpi-label { font-size: 0.8rem; color: var(--text-secondary); margin-top: 4px; }
  </style>
</head>
<body>
  <!-- copy header from index.html (all 3 lang versions) -->
  <header>...</header>

  <div class="kpi-row" id="kpiRow"></div>
  <div class="stats-grid">
    <div class="stats-card">
      <h3>Arıslar boyınsha (QQ: Arıs bo'linisi)</h3>
      <canvas id="chartAris"></canvas>
    </div>
    <div class="stats-card">
      <h3>Eń kóp urıwlar Top-10</h3>
      <canvas id="chartTopTribes"></canvas>
    </div>
    <div class="stats-card">
      <h3>Túr boyınsha bo'linisi</h3>
      <canvas id="chartTypes"></canvas>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js"></script>
  <!-- paste treeData const here (same as index.html) -->
  <script>
  // ---- KPI computation ----
  function countByType(node, counts) {
    if (!counts) counts = {};
    const t = node.type || node.túri || '';
    counts[t] = (counts[t] || 0) + 1;
    if (node.children) node.children.forEach(c => countByType(c, counts));
    return counts;
  }

  function getAllNodes(node, arr) {
    if (!arr) arr = [];
    arr.push(node);
    if (node.children) node.children.forEach(c => getAllNodes(c, arr));
    return arr;
  }

  document.addEventListener('DOMContentLoaded', () => {
    const all = getAllNodes(treeData);
    const typeCounts = countByType(treeData);

    // KPI
    const kpiRow = document.getElementById('kpiRow');
    kpiRow.innerHTML = [
      { v: all.filter(n => n.level === 1).length, l: 'Arıs' },
      { v: all.filter(n => n.level === 2).length, l: 'Bólim' },
      { v: all.filter(n => n.level === 3).length, l: 'Urıw' },
      { v: all.filter(n => n.level >= 4).length, l: 'Tiyre/Ko\'she' },
      { v: all.filter(n => n.tamga || (n.info && n.info.tamga)).length, l: 'Tamǵalı' },
      { v: all.filter(n => n.uran  || (n.info && n.info.uran )).length, l: 'Uranlı' },
    ].map(k => `<div class="kpi-card"><div class="kpi-value">${k.v}</div><div class="kpi-label">${k.l}</div></div>`).join('');

    // Aris pie
    const arisNodes = all.filter(n => n.level === 1);
    new Chart(document.getElementById('chartAris'), {
      type: 'pie',
      data: {
        labels: arisNodes.map(n => n.name),
        datasets: [{ data: arisNodes.map(n => getAllNodes(n).length),
          backgroundColor: ['#e74c3c','#e67e22','#f1c40f','#2ecc71','#3498db','#9b59b6'] }]
      },
      options: { plugins: { legend: { labels: { color: '#ecf0f1' } } } }
    });

    // Top-10 tribes by children count (level 3)
    const tribes = all.filter(n => n.level === 3)
      .map(n => ({ name: n.name, count: getAllNodes(n).length - 1 }))
      .sort((a,b) => b.count - a.count).slice(0, 10);
    new Chart(document.getElementById('chartTopTribes'), {
      type: 'bar',
      data: {
        labels: tribes.map(t => t.name),
        datasets: [{ label: 'Urıwlar sany', data: tribes.map(t => t.count),
          backgroundColor: '#3498db' }]
      },
      options: {
        indexAxis: 'y',
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: '#bdc3c7' }, grid: { color: '#34495e' } },
          y: { ticks: { color: '#ecf0f1' }, grid: { color: '#34495e' } }
        }
      }
    });

    // Type breakdown doughnut
    const typeEntries = Object.entries(typeCounts).filter(([k]) => k).sort((a,b) => b[1]-a[1]).slice(0,7);
    new Chart(document.getElementById('chartTypes'), {
      type: 'doughnut',
      data: {
        labels: typeEntries.map(e => e[0]),
        datasets: [{ data: typeEntries.map(e => e[1]),
          backgroundColor: ['#e74c3c','#e67e22','#f1c40f','#2ecc71','#3498db','#9b59b6','#1abc9c'] }]
      },
      options: { plugins: { legend: { labels: { color: '#ecf0f1', boxWidth: 12 } } } }
    });
  });
  </script>
  <script src="js/shared-features.js"></script>
</body>
</html>
```

- [ ] **Step 1:** Create `statsQQ.html` with QQ labels + QQ tree data
- [ ] **Step 2:** Create `statsKZ.html` with KZ labels + KZ tree data
- [ ] **Step 3:** Create `statsRU.html` with RU labels + RU tree data
- [ ] **Step 4:** Add "Statistika/Статистика" nav button to ALL 12 existing pages
- [ ] **Step 5: Commit**
```bash
git add statsQQ.html statsKZ.html statsRU.html \
  index.html indexKZ.html indexRU.html \
  listsQQ.html listsKZ.html listsRU.html \
  schemeQQ.html schemeKZ.html schemeRU.html \
  exogamyQQ.html exogamyKZ.html exogamyRU.html
git commit -m "feat: add statistics pages with charts and nav link in all pages"
```

---

## Task 13: D3 collapsible tree animation — scheme × 3 langs

**Files:**
- Modify: `schemeQQ.html`, `schemeKZ.html`, `schemeRU.html`

**Context:** Each scheme file uses D3.js to render a static tree. The tree data is in a `const treeData`. Currently all nodes are shown at once.

**Goal:** Nodes beyond level 2 start collapsed. Clicking a node toggles its children open/closed with a smooth D3 transition.

**Step 1: Add collapse state to tree data before rendering**

At the start of the D3 rendering function (after `const root = d3.hierarchy(treeData)`), add:
```js
// Collapse nodes deeper than level 2 by default
root.descendants().forEach(d => {
  if (d.depth > 2) {
    d._children = d.children;
    d.children = null;
  }
});
```

**Step 2: Replace static node click with toggle + update**

Find the node `on('click', ...)` handler (or add one). Replace with:
```js
function toggleNode(event, d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else if (d._children) {
    d.children = d._children;
    d._children = null;
  }
  update(d); // re-render
  showInfo(d.data); // existing info panel
}
```

**Step 3: Wrap D3 rendering in an `update(source)` function**

Move the D3 `node` / `link` append code into a function:
```js
function update(source) {
  const treeLayout = d3.tree().nodeSize([nodeSpacing, levelHeight]);
  treeLayout(root);
  const duration = 400;

  // Update links
  const link = svg.selectAll('path.link')
    .data(root.links(), d => d.target.data.id);
  link.enter().append('path').attr('class', 'link')
    .attr('d', d => `M${source.x0},${source.y0}C${source.x0},${(source.y0+source.y)/2} ${d.target.x},${(source.y0+source.y)/2} ${d.target.x},${d.target.y}`)
    .merge(link).transition().duration(duration)
    .attr('d', d3.linkVertical().x(d => d.x).y(d => d.y));
  link.exit().transition().duration(duration)
    .attr('d', d => `M${source.x},${source.y}C${source.x},${source.y} ${source.x},${source.y} ${source.x},${source.y}`)
    .remove();

  // Update nodes
  const node = svg.selectAll('g.node')
    .data(root.descendants(), d => d.data.id);
  const nodeEnter = node.enter().append('g').attr('class', 'node')
    .attr('transform', d => `translate(${source.x0 || source.x},${source.y0 || source.y})`)
    .on('click', toggleNode);
  // ... append rect and text as before, then merge and transition
  nodeEnter.merge(node).transition().duration(duration)
    .attr('transform', d => `translate(${d.x},${d.y})`);
  node.exit().transition().duration(duration)
    .attr('transform', `translate(${source.x},${source.y})`).remove();

  // Store positions
  root.descendants().forEach(d => { d.x0 = d.x; d.y0 = d.y; });
}

// Add expand/collapse indicator (+/-) on node boxes
// In nodeEnter, after appending main rect:
nodeEnter.filter(d => d._children || d.children)
  .append('text')
  .attr('class', 'node-toggle')
  .attr('dy', 14)
  .attr('dx', d => d._children ? 10 : -10)
  .style('fill', '#f1c40f')
  .style('font-size', '11px')
  .text(d => d._children ? '+' : '−');
```

- [ ] **Step 1:** Add collapse initialization in all 3 scheme files
- [ ] **Step 2:** Wrap render in `update()` function, add toggle logic in all 3 scheme files
- [ ] **Step 3:** Add +/- indicator text on nodes in all 3 scheme files
- [ ] **Step 4: Commit**
```bash
git add schemeQQ.html schemeKZ.html schemeRU.html
git commit -m "feat: D3 collapsible tree animation with smooth transitions in scheme pages"
```

---

## Task 14: Final commit and push

- [ ] **Step 1: Verify all pages open without JS errors**

Open each page in browser devtools, check console for errors.

- [ ] **Step 2: Git status check**
```bash
git status
git log --oneline -15
```

- [ ] **Step 3: Push to GitHub**
```bash
git push origin main
```

---

## Self-Review

**Spec coverage check:**
- ✅ Search dropdown with path → Task 4
- ✅ List filter buttons → Task 8
- ✅ Share button → Tasks 5, 6
- ✅ Mobile redirect → Task 11
- ✅ Statistics charts → Task 12
- ✅ PDF export → Task 9
- ✅ Favorites localStorage → Tasks 5, 6
- ✅ Tamga SVG → Task 7
- ✅ List badges → Task 8
- ✅ Dark/light theme → Tasks 1, 2, 3
- ✅ D3 animation → Task 13
- ✅ Breadcrumbs → Task 10
- ✅ Empty states → Task 7
- ✅ Shared files included in exogamy pages → Task 3

**Dependency order:** Tasks 1→2→3 must be sequential. Tasks 4–13 can be parallelized (they touch different files or independent sections).
