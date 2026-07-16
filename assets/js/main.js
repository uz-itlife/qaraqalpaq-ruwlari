// assets/js/main.js — Stage 3 shared behavior: header compress-on-scroll,
// back-to-top button (for pages that don't already have one), theme-toggle icon swap.
// Loaded after js/shared-features.js; does not modify its toggleTheme()/initTheme().
(function () {
  var SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></svg>';
  var MOON = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.8 14.5A8.5 8.5 0 1 1 9.5 3.2a7 7 0 0 0 11.3 11.3z"/></svg>';

  document.addEventListener('DOMContentLoaded', function () {
    // -- header compress on scroll --
    var header = document.querySelector('header');
    if (header) {
      var onScroll = function () {
        header.classList.toggle('header--compact', window.scrollY > 40);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    // -- back-to-top (only if page has no existing one) --
    if (!document.querySelector('.scrollup, #scrollUpBtn, .qq-back-to-top')) {
      var btn = document.createElement('button');
      btn.className = 'qq-back-to-top';
      btn.setAttribute('aria-label', 'Scroll to top');
      btn.innerHTML = '&uarr;';
      btn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      document.body.appendChild(btn);
      window.addEventListener('scroll', function () {
        btn.classList.toggle('visible', window.scrollY > 300);
      }, { passive: true });
    }

    // -- theme toggle: sun/moon icon --
    // _updateThemeBtn() in shared-features.js sets btn.textContent on every toggle,
    // which wipes any child element — so the icon must be re-created, not just updated.
    var themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
      var renderIcon = function () {
        var icon = document.createElement('span');
        icon.className = 'qq-theme-icon';
        icon.innerHTML = document.body.classList.contains('light-theme') ? MOON : SUN;
        themeBtn.insertBefore(icon, themeBtn.firstChild);
      };
      renderIcon();
      themeBtn.addEventListener('click', function () {
        setTimeout(renderIcon, 0);
      });
    }
  });
})();
