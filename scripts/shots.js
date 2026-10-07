// Plays every path of day 1 in German and English with a fixed seed in 390x844, 360x640 and 375x667
// and takes one screenshot per screen. The language comes from the browser locale (de-DE / en-US).
// Checks: blocklist, digits (only the clock time), max 3 lines per sentence, font >= 17 px,
// touch targets >= 44 px, cards / button / cost line inside the viewport, nothing sticking out sideways,
// no stretch longer than 1 s without a card or button (timers run on Playwright's fake clock), console errors.
// Extra runs: ?reset=1 with locale en-US and de-DE shows the start screen in that language;
// offline: after one visit the page reloads without network and the game plays (service worker).
// Run: npm run shots (builds first). Output: shots/<lang>/<path>/NN-<step>.png, shots/reset/, shots/offline/
import { chromium } from 'playwright';
import { preview } from 'vite';
import { mkdirSync, readFileSync, rmSync } from 'node:fs';

const SEED = 20261007;
const json = file => JSON.parse(readFileSync(new URL(`../content/${file}`, import.meta.url)));
const LANGS = {
  de: { locale: 'de-DE', block: json('blocklist.json'), clock: '16:50', title: json('de/tag1.json')['ui.title'] },
  en: { locale: 'en-US', block: json('blocklist-en.json'), clock: '4:50', title: json('en/tag1.json')['ui.title'] },
};
const PATHS = { 'A-E-G': ['A', 'E', 'G'], 'B-D': ['B', 'D'], 'C-E': ['C', 'E'], 'A-F-G': ['A', 'F', 'G'], 'A-F-H': ['A', 'F', 'H'], 'B-F-I': ['B', 'F', 'I'] };
const BIG = { width: 390, height: 844 }, SMALL = { width: 360, height: 640 }, MID = { width: 375, height: 667 };
const RUNS = Object.keys(LANGS).flatMap(lang => [
  ...Object.entries(PATHS).map(([name, picks]) => ({ lang, name, picks, viewport: BIG })),
  { lang, name: 'dunkel-C-E', picks: PATHS['C-E'], viewport: BIG, dark: true },
  ...Object.entries(PATHS).map(([name, picks]) => ({ lang, name: `360-${name}`, picks, viewport: SMALL })),
  ...Object.entries(PATHS).map(([name, picks]) => ({ lang, name: `375-${name}`, picks, viewport: MID })),
]);
const MAX_IDLE = 1000; // ms without a visible card or button

function check(page, lang) {
  return page.evaluate(({ BLOCK, CLOCK, LANG }) => {
    const out = [];
    const W = innerWidth, H = innerHeight;
    document.querySelectorAll('.caption, .her, .you, .say, .over, .log p, .rv p, .title, .tagline, .help').forEach(el => {
      const cs = getComputedStyle(el);
      const h = el.getBoundingClientRect().height - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom)
        - parseFloat(cs.borderTopWidth) - parseFloat(cs.borderBottomWidth);
      const lines = Math.round(h / parseFloat(cs.lineHeight));
      const label = el.textContent.trim().slice(0, 40);
      if (lines > 3) out.push(`${lines} Zeilen: ${label}`);
      if (el.scrollWidth > el.clientWidth + 1) out.push(`abgeschnitten: ${label}`);
      if (parseFloat(cs.fontSize) < 17 && !el.classList.contains('help')) out.push(`Schrift ${cs.fontSize}: ${label}`);
    });
    document.querySelectorAll('button').forEach(b => {
      const r = b.getBoundingClientRect();
      const min = b.closest('.lang') ? 48 : 44; // language switch: 48 px as in STIL.md
      if (r.width && (r.width < min || r.height < min)) out.push(`Tippziel ${Math.round(r.width)}x${Math.round(r.height)}: ${b.textContent.trim().slice(0, 30)}`);
    });
    const de = document.documentElement;
    if (de.scrollWidth > W) out.push(`ragt seitlich raus: ${de.scrollWidth} > ${W}`);
    if (H >= 800 && de.scrollHeight > H) out.push(`ragt unten raus: ${de.scrollHeight} > ${H}`);
    // what the player must reach has to be on screen without scrolling by hand
    const last = [...document.querySelectorAll('.rv')].pop();
    [...document.querySelectorAll('.say, #go'), ...(last ? [last] : [])].forEach(el => {
      if (el.closest('[hidden]')) return;
      const r = el.getBoundingClientRect();
      if (r.top < 0 || r.bottom > H + 0.5) out.push(`ausserhalb des Bildes (${Math.round(r.top)}..${Math.round(r.bottom)} bei ${H}): ${el.textContent.trim().slice(0, 30)}`);
    });
    const text = document.body.innerText + ' ' + [...document.querySelectorAll('[aria-label]')].map(e => e.getAttribute('aria-label')).join(' ');
    BLOCK.forEach(w => { if (text.toLowerCase().includes(w.toLowerCase())) out.push(`Sperrwort "${w}"`); });
    const digits = text.split(CLOCK).join('').match(/\d+/g);
    if (digits) out.push(`Zahl ${digits.join(',')}`);
    if (de.lang !== LANG) out.push(`html lang ${de.lang} statt ${LANG}`);
    return out;
  }, { BLOCK: LANGS[lang].block, CLOCK: LANGS[lang].clock, LANG: lang });
}

const server = await preview({ preview: { port: 4179, strictPort: true }, logLevel: 'silent' });
const url = `http://localhost:4179/?seed=${SEED}`;
const browser = await chromium.launch();
rmSync('shots', { recursive: true, force: true });

let findings = 0, errors = 0, shots = 0;
const warn = msg => { findings++; console.log(`WARN ${msg}`); };

// A fresh phone-like browser context with an empty localStorage; console errors are counted.
async function phone(name, { viewport = BIG, locale = 'de-DE', dark = false } = {}) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1, locale,
    colorScheme: dark ? 'dark' : 'light', hasTouch: true, isMobile: true });
  const page = await context.newPage();
  page.on('console', m => { if (m.type() === 'error') { errors++; console.log(`FEHLER ${name} console: ${m.text()}`); } });
  page.on('pageerror', e => { errors++; console.log(`FEHLER ${name} page: ${e.message}`); });
  return { context, page };
}

for (const run of RUNS) {
  const dir = `shots/${run.lang}/${run.name}`;
  mkdirSync(dir, { recursive: true });
  const { context, page } = await phone(`${run.lang}/${run.name}`, { viewport: run.viewport, locale: LANGS[run.lang].locale, dark: run.dark });
  await page.clock.install();

  // Advance the fake clock in 100 ms steps until the screen is reached; count time without card or button.
  const reach = async step => {
    let idle = 0;
    for (let ms = 0; !(await page.$(`#app[data-step="${step}"]`)); ms += 100) {
      if (ms > 10000) throw new Error(`${run.name}: ${step} nicht erreicht`);
      const active = await page.evaluate(() => [...document.querySelectorAll('.say, #go')].some(el => !el.closest('[hidden]')));
      idle = active ? 0 : idle + 100;
      if (idle > MAX_IDLE) { warn(`${dir}: vor ${step} ueber ${MAX_IDLE} ms ohne Karte oder Knopf`); idle = -1e9; }
      await page.clock.runFor(100);
    }
  };
  let n = 0;
  const snap = async step => {
    await reach(step);
    const file = `${dir}/${String(++n).padStart(2, '0')}-${step}.png`;
    await page.screenshot({ path: file, animations: 'disabled' });
    shots++;
    for (const f of await check(page, run.lang)) warn(`${file}: ${f}`);
  };

  await page.goto(url);
  await snap('start');
  await page.click('#go');
  await snap('her');
  for (let i = 0; i < run.picks.length; i++) {
    const t = i + 1;
    await snap(`hand-${t}`);
    await page.click(`.say[data-id="${run.picks[i]}"]`);
    await snap(`you-${t}`);
    await snap(`face-${t}`);
  }
  await snap('over');
  for (const step of ['review-1', 'review-2', 'review-3']) {
    await page.click('#go');
    await snap(step);
  }
  await page.click('#go');
  await snap('done');
  await page.click('#go');
  await snap('her'); // "Noch mal" starts the conversation again, with a new seed
  await context.close();
}

// ?reset=1: the stored language is forgotten, the browser language decides, the parameter is gone.
mkdirSync('shots/reset', { recursive: true });
for (const [lang, other] of [['en', 'de'], ['de', 'en']]) {
  const { context, page } = await phone(`reset-${lang}`, { locale: LANGS[lang].locale });
  await page.goto(url);
  await page.click(`[data-lang="${other}"]`); // stores the other language
  await page.reload();
  if (await page.locator('html').getAttribute('lang') !== other) warn(`reset-${lang}: Umschalter auf ${other} nicht gespeichert`);
  await page.goto(`${url}&reset=1`);
  await page.waitForURL(u => !u.search.includes('reset'));
  await page.waitForSelector('#app[data-step="start"]');
  const file = `shots/reset/${LANGS[lang].locale}-start.png`;
  await page.screenshot({ path: file });
  shots++;
  const title = await page.textContent('.title');
  if (title !== LANGS[lang].title) warn(`${file}: Titel "${title}" statt "${LANGS[lang].title}"`);
  if (await page.title() !== LANGS[lang].title) warn(`${file}: Seitentitel "${await page.title()}"`);
  const active = await page.getAttribute('[aria-pressed="true"]', 'data-lang');
  if (active !== lang) warn(`${file}: Umschalter zeigt ${active} als aktiv`);
  for (const f of await check(page, lang)) warn(`${file}: ${f}`);
  await context.close();
}

// Offline: one visit online, then no network, reload, play C-E to the end (real timers).
mkdirSync('shots/offline', { recursive: true });
{
  const { context, page } = await phone('offline');
  await page.goto(url);
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
  await context.setOffline(true);
  await page.reload();
  await page.waitForSelector('#app[data-step="start"]');
  await page.screenshot({ path: 'shots/offline/01-start.png' });
  await page.click('#go');
  for (const id of PATHS['C-E']) await page.click(`.say[data-id="${id}"]`);
  await page.waitForSelector('#app[data-step="over"]');
  for (let i = 0; i < 3; i++) await page.click('#go');
  await page.waitForSelector('#app[data-step="review-3"]');
  await page.waitForTimeout(600); // let the last line finish fading in
  await page.screenshot({ path: 'shots/offline/02-review-3.png', animations: 'disabled' });
  shots += 2;
  for (const f of await check(page, 'de')) warn(`shots/offline/02-review-3.png: ${f}`);
  const online = await page.evaluate(() => navigator.onLine);
  if (online) warn('offline: Seite meldet navigator.onLine = true');
  console.log(`offline: Neu laden ohne Netz und Pfad C-E bis zum Rueckblick gespielt (navigator.onLine = ${online})`);
  await context.close();
}

await browser.close();
await new Promise(resolve => server.httpServer.close(resolve));
console.log(`${shots} Screenshots in shots/, ${findings} Befunde, ${errors} Konsolenfehler`);
process.exitCode = findings || errors ? 1 : 0;
