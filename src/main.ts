import './ui/style.css';
import { seedFromDate } from './engine/rng';
import { SCENE_NAMES, start, type SceneName } from './ui/app';
import { detectLand } from './engine/help';

const params = new URLSearchParams(location.search);

if (params.get('reset') === '1') {
  // ?reset=1 forgets the stored language, counter and end of day 1 (only our keys: on GitHub Pages other projects share the origin),
  // then loads the page again (the language is German again) without the parameter.
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
  // Country of the help page from the browser; ?land=xx overrides, ?hilfe=1 opens the help page directly (both for tests).
  const land = detectLand(navigator.languages ?? [navigator.language], Intl.DateTimeFormat().resolvedOptions().timeZone, params.get('land'));
  // ?szene=dachboden|samstag|gans plays one scene of season 1 directly; unknown names are ignored.
  const name = params.get('szene') as SceneName;
  start(document.getElementById('app')!, seed, lang, params.get('tag') === '2' ? 2 : 1, land, params.get('hilfe') === '1',
    SCENE_NAMES.includes(name) ? name : null);
}

// Offline play: the service worker caches the built game (only in the build, not in the dev server).
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(() => { /* game still works online */ });
}
