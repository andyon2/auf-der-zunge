import './ui/style.css';
import { seedFromDate } from './engine/rng';
import { start } from './ui/app';

const params = new URLSearchParams(location.search);

if (params.get('reset') === '1') {
  // ?reset=1 forgets the stored language, counter and end of day 1 (only our keys: on GitHub Pages other projects share the origin),
  // then loads the page again without the parameter.
  try {
    localStorage.removeItem('adz.lang');
    localStorage.removeItem('adz.round');
    localStorage.removeItem('adz.day1end');
  } catch { /* nothing stored */ }
  params.delete('reset');
  const query = params.toString();
  location.replace(location.pathname + (query ? `?${query}` : '') + location.hash);
} else {
  // ?seed=123 overrides the seed of the day.
  const param = params.get('seed');
  const seed = param !== null && /^\d+$/.test(param) ? Number(param) : seedFromDate(new Date());
  // index.html has already picked the language (inline script) and set it on <html lang>.
  // ?tag=2 starts directly at day 2 (for tests).
  const lang = document.documentElement.lang === 'de' ? 'de' : 'en';
  start(document.getElementById('app')!, seed, lang, params.get('tag') === '2' ? 2 : 1);
}

// Offline play: the service worker caches the built game (only in the build, not in the dev server).
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(() => { /* game still works online */ });
}
