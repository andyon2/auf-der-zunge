import './ui/style.css';
import { seedFromDate } from './engine/rng';
import { firstLang, start } from './ui/app';

const params = new URLSearchParams(location.search);

if (params.get('reset') === '1') {
  // ?reset=1 forgets the stored language and counter, then loads the page again without the parameter.
  try { localStorage.clear(); } catch { /* nothing stored */ }
  params.delete('reset');
  const query = params.toString();
  location.replace(location.pathname + (query ? `?${query}` : '') + location.hash);
} else {
  // ?seed=123 overrides the seed of the day.
  const param = params.get('seed');
  const seed = param !== null && /^\d+$/.test(param) ? Number(param) : seedFromDate(new Date());
  start(document.getElementById('app')!, seed, firstLang());
}

// Offline play: the service worker caches the built game (only in the build, not in the dev server).
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(() => { /* game still works online */ });
}
