// js/shared-features.js — theme, favorites, share, tamga SVG, empty states, anchor nav

/* ═══════════════════════════════════════════════════════════════
   THEME
═══════════════════════════════════════════════════════════════ */
const THEME_KEY = 'qq-theme';

function initTheme() {
  if (localStorage.getItem(THEME_KEY) === 'light') {
    document.body.classList.add('light-theme');
  }
  _updateThemeBtn();
}

function toggleTheme() {
  document.body.classList.toggle('light-theme');
  const isLight = document.body.classList.contains('light-theme');
  localStorage.setItem(THEME_KEY, isLight ? 'light' : 'dark');
  _updateThemeBtn();
}

function _updateThemeBtn() {
  const btn = document.getElementById('themeToggleBtn');
  if (!btn) return;
  const isLight = document.body.classList.contains('light-theme');
  btn.textContent = isLight
    ? (btn.dataset.dark  || '🌙 Dark')
    : (btn.dataset.light || '☀️ Light');
}

/* ═══════════════════════════════════════════════════════════════
   FAVORITES
═══════════════════════════════════════════════════════════════ */
const FAV_KEY  = 'qq-favorites';
const MAX_FAVS = 5;

function getFavorites() {
  try { return JSON.parse(localStorage.getItem(FAV_KEY)) || []; }
  catch { return []; }
}

function _saveFavorites(favs) {
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
  _saveFavorites(favs);
  _renderFavoritesPanel();
  _updateStarBtn(id);
  // update toggle button badge
  const tb = document.getElementById('favToggleBtn');
  if (tb) tb.classList.toggle('has-favs', getFavorites().length > 0);
}

function removeFavorite(id) {
  _saveFavorites(getFavorites().filter(f => f.id !== id));
  _renderFavoritesPanel();
  _updateStarBtn(id);
  const tb = document.getElementById('favToggleBtn');
  if (tb) tb.classList.toggle('has-favs', getFavorites().length > 0);
}

function _updateStarBtn(id) {
  const btn = document.getElementById('star-btn-' + id);
  if (!btn) return;
  const faved = isFavorite(id);
  btn.classList.toggle('active', faved);
  btn.textContent = faved ? '★ ' + (btn.dataset.remove || 'Remove') : '☆ ' + (btn.dataset.add || 'Add');
}

function _renderFavoritesPanel() {
  const panel = document.getElementById('favoritesPanel');
  if (!panel) return;
  const favs  = getFavorites();
  const title = panel.dataset.title || 'Favorites';
  const empty = panel.dataset.empty || 'No favorites yet';
  let html = `<h4>⭐ ${title}</h4>`;
  if (favs.length === 0) {
    html += `<div class="fav-empty">${empty}</div>`;
  } else {
    favs.slice().reverse().forEach(f => {
      html += `<div class="fav-item" onclick="navigateToFavorite('${f.id}')">
        <span class="fav-item-name">${f.name}</span>
        <span class="fav-item-remove" title="remove"
          onclick="event.stopPropagation();removeFavorite('${f.id}')">✕</span>
      </div>`;
    });
  }
  panel.innerHTML = html;
}

function toggleFavoritesPanel() {
  const panel = document.getElementById('favoritesPanel');
  if (!panel) return;
  panel.classList.toggle('open');
  if (panel.classList.contains('open')) _renderFavoritesPanel();
}

// Close favorites panel on outside click
document.addEventListener('click', e => {
  const panel = document.getElementById('favoritesPanel');
  if (!panel) return;
  if (!panel.contains(e.target) && !e.target.closest('#favToggleBtn')) {
    panel.classList.remove('open');
  }
});

// navigateToFavorite() must be defined per-page (to call showInfo / scroll to node)

/* ═══════════════════════════════════════════════════════════════
   SHARE
═══════════════════════════════════════════════════════════════ */
function shareCurrentNode(id, copiedText) {
  const url = window.location.href.split('#')[0] + '#' + id;
  history.replaceState(null, '', '#' + id);
  const fallback = () => {
    const ta = document.createElement('textarea');
    ta.value = url;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    _showShareToast(copiedText);
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(() => _showShareToast(copiedText)).catch(fallback);
  } else {
    fallback();
  }
}

function _showShareToast(msg) {
  let toast = document.getElementById('shareToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'shareToast';
    toast.className = 'share-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = '✓ ' + (msg || 'Copied');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

/* ═══════════════════════════════════════════════════════════════
   TAMGA SVG
═══════════════════════════════════════════════════════════════ */
function renderTamgaSVG(tamgaText, size) {
  if (!tamgaText) return '';
  size = size || 88;
  const len      = tamgaText.length;
  const fontSize = len > 4 ? 16 : len > 3 ? 18 : len > 2 ? 22 : len > 1 ? 26 : 32;
  return `<div class="tamga-svg-wrap">
    <svg width="${size}" height="${size}" viewBox="0 0 100 100"
         fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="45" stroke="#e74c3c" stroke-width="2"
              fill="rgba(231,76,60,0.08)"/>
      <circle cx="50" cy="50" r="38" stroke="rgba(231,76,60,0.3)"
              stroke-width="1" stroke-dasharray="4 3" fill="none"/>
      <text x="50" y="50" dominant-baseline="central" text-anchor="middle"
            font-family="'Cormorant Garamond','Georgia',serif"
            font-size="${fontSize}" fill="#e74c3c"
            font-weight="bold" letter-spacing="1">${tamgaText}</text>
    </svg>
  </div>`;
}

/* ═══════════════════════════════════════════════════════════════
   EMPTY STATE
═══════════════════════════════════════════════════════════════ */
function renderEmptyState(noDataText, inviteText, href) {
  const link = href || 'https://t.me/qaraqalpaq_rulari';
  return `<div class="empty-state">
    🔍 ${noDataText}<br>
    <a href="${link}" target="_blank" rel="noopener">+ ${inviteText}</a>
  </div>`;
}

/* ═══════════════════════════════════════════════════════════════
   ANCHOR / HASH NAVIGATION
═══════════════════════════════════════════════════════════════ */
function handleAnchorOnLoad() {
  const hash = window.location.hash;
  if (!hash) return;
  const id = hash.replace('#', '');
  setTimeout(() => {
    // Try tree node first, then list item
    const el = document.getElementById('node-' + id) ||
               document.getElementById('item-' + id) ||
               document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.click && el.click();
    }
  }, 600);
}

/* ═══════════════════════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  _renderFavoritesPanel();
  handleAnchorOnLoad();

  // mark fav toggle if there are saved favorites
  const tb = document.getElementById('favToggleBtn');
  if (tb && getFavorites().length > 0) tb.classList.add('has-favs');
});
