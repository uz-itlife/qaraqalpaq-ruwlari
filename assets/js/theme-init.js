// assets/js/theme-init.js — blocking, runs before first paint (placed right after
// <meta charset> in <head>) to set the theme class on <html> and avoid a light-theme FOUC.
// Reads the same localStorage key that js/shared-features.js already uses for <body>.
if (localStorage.getItem('qq-theme') === 'light') {
  document.documentElement.classList.add('light-theme');
}
