// Plays every path of day 1 and the test paths of day 2 (skript-tag2.md) in German and English with a fixed seed
// in 390x844, 360x640 and 375x667 and takes one screenshot per screen. Day 1 runs go on to the start of day 2
// (Kessler sentence after the ends E and G); day 2 runs start with ?tag=2 and end with "Noch mal" back at day 1.
// Day 2 per step: echo shown or not, the echo sentence only at the first echo, face preset, cost line of the end. The language is stored for the English runs (locale en-US), German is the default.
// Checks: blocklist, digits (only the clock time), max 3 lines per sentence, font >= 17 px,
// touch targets >= 44 px, cards / button / cost line inside the viewport, nothing sticking out sideways,
// no stretch longer than 1 s without a card or button (timers run on Playwright's fake clock), console errors.
// Extra runs: ?reset=1 with locale en-US and de-DE shows the start screen in German (the browser language does not matter), forgets the end of day 1 (day 2 then starts with the plain sentence);
// offline: after one visit the page reloads without network and the game plays (service worker).
// Help page (M4): every country (?land=xx&hilfe=1) in DE and EN, 390x844 light and dark, 360x640; entries, tel: and web links,
// switch to the international list and back, "Back" to the start. Ways back from the start, the review, day 2 and the end
// inside the played runs (the screen must be the same as before). Country from browser language / time zone. Offline: help page too.
// On the help page digits are allowed only in numbers, links, hours and the date; blocked words in all but numbers, names, links.
// Season 1 (?szene=dachboden|samstag|gans, German only): one run per end of each scene in 390x844 and 360x640, the first end
// also in 375x667, dark, and with English stored (falls back to German). The last move rotates over the four guesses.
// Checks as above, plus: the stage line and the four guess cards, her answer to the guess (short after guessShortAfter),
// the cost line, the link "Was ist da passiert?" and its sentence, "Noch mal" plays the scene again.
// Run: npm run shots [-- <dir>] (builds first). Output: <dir>/<lang>/<path>/NN-<step>.png, <dir>/reset/, <dir>/offline/
// (<dir> defaults to shots)
import { chromium } from 'playwright';
import { preview } from 'vite';
import { mkdirSync, readFileSync, rmSync } from 'node:fs';

const SEED = 20261007;
const json = file => JSON.parse(readFileSync(new URL(`../content/${file}`, import.meta.url)));
const OUT = process.argv[2] || 'shots';
const text = (lang, day) => ({ ...json(`${lang}/tag1.json`), ...(day === 2 ? json(`${lang}/tag2.json`) : {}) });
const LANGS = {
  de: { locale: 'de-DE', block: json('blocklist.json'), clock: '16:50', t1: text('de', 1), t2: text('de', 2) },
  en: { locale: 'en-US', block: json('blocklist-en.json'), clock: '4:50', t1: text('en', 1), t2: text('en', 2) },
};
const PATHS = { 'A-E-G': ['A', 'E', 'G'], 'B-D': ['B', 'D'], 'C-E': ['C', 'E'], 'A-F-G': ['A', 'F', 'G'], 'A-F-H': ['A', 'F', 'H'], 'B-F-I': ['B', 'F', 'I'] };
// Day 2 test paths, copied from skript-tag2.md ("Testpfade fuer Playwright").
const PATHS2 = {
  'A-R1-I': { picks: ['A', 'R1', 'I'], echo: ['echo.A', null, null], faces: ['closed', 'tense', 'opening'], end: 'I' },
  'A-E-H':  { picks: ['A', 'E', 'H'],  echo: ['echo.A', 'echo.A', 'echo.A'], faces: ['closed', 'hard', 'tenseAway'], end: 'H' },
  'B-F-R2': { picks: ['B', 'F', 'R2'], echo: [null, 'echo.F', null], faces: ['tense', 'closed', 'tense'], end: 'R2' },
  'C-E-G':  { picks: ['C', 'E', 'G'],  echo: [null, null, null], faces: ['opening', 'yielding', 'closed'], end: 'G' },
  'B-D':    { picks: ['B', 'D'],       echo: [null, null], faces: ['tense', 'tenseAway'], end: 'D' },
};
const BIG = { width: 390, height: 844 }, SMALL = { width: 360, height: 640 }, MID = { width: 375, height: 667 };
const HELP = json('help.json');
const LANDS = Object.keys(HELP);
// runs that open the help page at these screens and come back
const HELP_AT = { 'C-E': ['start', 'review-2'], '360-C-E': ['start', 'review-2'], 'tag2-B-D': ['day2', 'review-3', 'done'] };
const RUNS = Object.keys(LANGS).flatMap(lang => [
  ...Object.entries(PATHS).map(([name, picks]) => ({ lang, name, picks, viewport: BIG })),
  { lang, name: 'dunkel-C-E', picks: PATHS['C-E'], viewport: BIG, dark: true },
  ...Object.entries(PATHS).map(([name, picks]) => ({ lang, name: `360-${name}`, picks, viewport: SMALL })),
  ...Object.entries(PATHS).map(([name, picks]) => ({ lang, name: `375-${name}`, picks, viewport: MID })),
  ...Object.entries(PATHS2).map(([name, p]) => ({ lang, day: 2, name: `tag2-${name}`, ...p, viewport: BIG })),
  { lang, day: 2, name: 'tag2-dunkel-A-E-H', ...PATHS2['A-E-H'], viewport: BIG, dark: true },
  ...Object.entries(PATHS2).map(([name, p]) => ({ lang, day: 2, name: `tag2-360-${name}`, ...p, viewport: SMALL })),
  ...Object.entries(PATHS2).map(([name, p]) => ({ lang, day: 2, name: `tag2-375-${name}`, ...p, viewport: MID })),
]);
const MAX_IDLE = 1000; // ms without a visible card or button

function check(page, lang) {
  return page.evaluate(({ BLOCK, CLOCK, LANG }) => {
    const out = [];
    const W = innerWidth, H = innerHeight;
    const help = document.getElementById('app').dataset.step === 'help';
    document.querySelectorAll('.caption, .her, .you, .say, .over, .note, .log p, .rv p, .title, .tagline, .help-link, .day, .echo, .safe, .hname, .hours, .hland, .hchecked, .switch').forEach(el => {
      const cs = getComputedStyle(el);
      const h = el.getBoundingClientRect().height - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom)
        - parseFloat(cs.borderTopWidth) - parseFloat(cs.borderBottomWidth);
      const lines = Math.round(h / parseFloat(cs.lineHeight));
      const label = el.textContent.trim().slice(0, 40);
      // the lage of day 2 (131 characters, verbatim from the script) needs 4 lines at 17 px; accepted, see bericht M3
      if (lines > (el.id === 'lage' && el.textContent.length > 120 ? 4 : 3)) out.push(`${lines} Zeilen: ${label}`);
      if (el.scrollWidth > el.clientWidth + 1) out.push(`abgeschnitten: ${label}`);
      if (parseFloat(cs.fontSize) < 17) out.push(`Schrift ${cs.fontSize}: ${label}`);
    });
    document.querySelectorAll('button, .helpview a').forEach(b => {
      const r = b.getBoundingClientRect();
      const min = b.closest('.lang') ? 48 : 44; // language switch: 48 px as in STIL.md
      if (r.width && (r.width < min || r.height < min)) out.push(`Tippziel ${Math.round(r.width)}x${Math.round(r.height)}: ${b.textContent.trim().slice(0, 30)}`);
    });
    const de = document.documentElement;
    if (de.scrollWidth > W) out.push(`ragt seitlich raus: ${de.scrollWidth} > ${W}`);
    // the help hint below the last button of the review may need scrolling (bericht M4); everything above it has to fit
    const foot = document.querySelector('#app > .help');
    const footH = foot && document.getElementById('app').dataset.step.startsWith('review') ? foot.offsetHeight : 0;
    if (H >= 800 && !help && de.scrollHeight - footH > H) out.push(`ragt unten raus: ${de.scrollHeight - footH} > ${H}`);
    // what the player must reach has to be on screen without scrolling by hand
    const last = [...document.querySelectorAll('.rv')].pop();
    [...document.querySelectorAll('.say, #go'), ...(last ? [last] : [])].forEach(el => {
      if (el.closest('[hidden]')) return;
      const r = el.getBoundingClientRect();
      if (r.top < 0 || r.bottom > H + 0.5) out.push(`ausserhalb des Bildes (${Math.round(r.top)}..${Math.round(r.bottom)} bei ${H}): ${el.textContent.trim().slice(0, 30)}`);
    });
    const text = document.body.innerText + ' ' + [...document.querySelectorAll('[aria-label]')].map(e => e.getAttribute('aria-label')).join(' ');
    // help page, the only exceptions: numbers, names of the services and links may hold blocked words;
    // digits only in numbers, links, hours and the date of the check
    // longest first, so "110" does not cut a piece out of "0800 1110111"
    const minus = sel => [...document.querySelectorAll(sel)].map(el => el.innerText).sort((x, y) => y.length - x.length)
      .reduce((s, part) => s.split(part).join(' '), text);
    const blockText = help ? minus('.helpview .tel, .helpview .hname, .helpview .web') : text;
    const digitText = help ? minus('.helpview .tel, .helpview .web, .helpview .hours, .helpview .hchecked') : text;
    BLOCK.forEach(w => { if (blockText.toLowerCase().includes(w.toLowerCase())) out.push(`Sperrwort "${w}"`); });
    const digits = digitText.split(CLOCK).join('').match(/\d+/g);
    if (digits) out.push(`Zahl ${digits.join(',')}`);
    if (de.lang !== LANG) out.push(`html lang ${de.lang} statt ${LANG}`);
    return out;
  }, { BLOCK: LANGS[lang].block, CLOCK: LANGS[lang].clock, LANG: lang });
}

const PORT = Number(process.env.SHOTS_PORT) || 4179; // another port lets two worktrees run shots at the same time
const server = await preview({ preview: { port: PORT, strictPort: true }, logLevel: 'silent' });
const url = `http://localhost:${PORT}/?seed=${SEED}`;
const browser = await chromium.launch();
rmSync(OUT, { recursive: true, force: true });

let findings = 0, errors = 0, shots = 0;
const warn = msg => { findings++; console.log(`WARN ${msg}`); };

// A fresh phone-like browser context with an empty localStorage; console errors are counted.
// The game starts in German whatever the browser language is; lang 'en' stores the choice like the DE | EN switch does.
async function phone(name, { viewport = BIG, locale = 'de-DE', dark = false, lang = 'de' } = {}) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1, locale,
    colorScheme: dark ? 'dark' : 'light', hasTouch: true, isMobile: true });
  if (lang === 'en') await context.addInitScript(() => { try { if (!localStorage.getItem('adz.lang')) localStorage.setItem('adz.lang', 'en'); } catch { /* none */ } });
  const page = await context.newPage();
  page.on('console', m => { if (m.type() === 'error') { errors++; console.log(`FEHLER ${name} console: ${m.text()}`); } });
  page.on('pageerror', e => { errors++; console.log(`FEHLER ${name} page: ${e.message}`); });
  return { context, page };
}

// Help page: shown country, every entry of content/help.json with name in the language, tel: links, web link in a new tab,
// hours, the country line, the switch, the date line.
async function checkHelp(page, lang, shown, detected) {
  const out = [];
  const T = LANGS[lang].t1;
  const st = await page.evaluate(() => ({
    step: document.getElementById('app').dataset.step, land: document.getElementById('app').dataset.land,
    safe: document.querySelector('.safe')?.textContent, hland: document.querySelector('.hland')?.textContent,
    checked: document.querySelector('.hchecked')?.textContent, toggle: document.querySelector('.switch')?.textContent ?? null,
    items: [...document.querySelectorAll('.hlist li')].map(li => ({
      name: li.querySelector('.hname').textContent, tels: [...li.querySelectorAll('.tel')].map(a => a.getAttribute('href')),
      href: li.querySelector('.web').getAttribute('href'), target: li.querySelector('.web').target, rel: li.querySelector('.web').rel,
      hours: li.querySelector('.hours').textContent, hoursLang: li.querySelector('.hours').lang,
    })),
  }));
  if (st.step !== 'help') out.push(`Schritt ${st.step} statt help`);
  if (st.land !== shown) out.push(`Land ${st.land} statt ${shown}`);
  if (st.safe !== T['ui.helpSafe']) out.push(`Sicherheitssatz "${st.safe}"`);
  if (st.hland !== `${T['ui.helpLand']} ${T[`ui.land.${shown}`]}`) out.push(`Landzeile "${st.hland}"`);
  const year = HELP[shown][0].checked.slice(0, 4);
  if (!st.checked?.startsWith(T['ui.helpChecked']) || !st.checked.includes(year)) out.push(`Datumszeile "${st.checked}"`);
  const toggle = detected === 'intl' ? null : T[`ui.land.${shown === 'intl' ? detected : 'intl'}`];
  if (st.toggle !== toggle) out.push(`Umschalter "${st.toggle}" statt "${toggle}"`);
  if (st.items.length !== HELP[shown].length) out.push(`${st.items.length} Eintraege statt ${HELP[shown].length}`);
  HELP[shown].forEach((e, i) => {
    const it = st.items[i];
    if (!it) return;
    const name = lang === 'de' ? e.name_de : e.name_en;
    const tels = e.number.split(' / ').map(n => n.replace(/\D/g, '')).filter(n => n).map(n => `tel:${n}`);
    if (it.name !== name) out.push(`Name "${it.name}" statt "${name}"`);
    if (it.tels.join() !== tels.join()) out.push(`${name}: tel ${it.tels.join()} statt ${tels.join()}`);
    if (it.href !== e.url || it.target !== '_blank' || !it.rel.includes('noopener')) out.push(`${name}: Link ${it.href} ${it.target} ${it.rel}`);
    const hours = lang === 'de' ? e.hours : e.hours_en;
    if (it.hours !== hours) out.push(`${name}: Zeiten "${it.hours}" statt "${hours}"`);
    if (it.hoursLang !== '') out.push(`${name}: Zeiten lang="${it.hoursLang}"`);
  });
  return out;
}

// Day 2: what the stage must show at this step of the test path.
async function checkDay2(page, run, step) {
  const out = [];
  const L = LANGS[run.lang];
  const st = await page.evaluate(() => ({
    face: document.getElementById('app').dataset.face, echo: document.getElementById('app').dataset.echo,
    echoShown: !!document.querySelector('.echo:not([hidden])'),
    echoText: document.querySelector('.echo:not([hidden])')?.textContent ?? '',
    hint: [...document.querySelectorAll('.caption')].map(c => c.textContent),
    cost: [...document.querySelectorAll('.rv p')].map(p => p.textContent),
    say: document.querySelector('#echo-say')?.textContent ?? null,
  }));
  const m = step.match(/^(you|face|hand)-(\d)$/);
  const n = m ? Number(m[2]) : 0;
  // the echo after answer k is visible from face-k on, until face-(k+1); at the end and in the review it stays
  const k = !m ? (step === 'her' ? 0 : run.picks.length) : m[1] === 'face' ? n : n - 1;
  const want = k ? run.echo[k - 1] : null;
  if ((st.echo || null) !== want) out.push(`Echo ${st.echo || '-'} statt ${want || '-'}`);
  if (st.echoShown !== !!want) out.push(`Echo ${st.echoShown ? 'sichtbar' : 'nicht sichtbar'}`);
  if (want && st.echoText !== L.t2[want]) out.push(`Echo-Text "${st.echoText}"`);
  // the echo sentence: only at the first echo, until the next answer
  const first = run.echo.findIndex(e => e) + 1;
  const hintWanted = first > 0 && (step === `face-${first}` || step === `hand-${first + 1}`);
  if (st.hint.includes(L.t2['ui.echoHint']) !== hintWanted) out.push(`Echo-Erklaersatz ${hintWanted ? 'fehlt' : 'steht da'}`);
  // the chat sentence: at the first picture, until the first answer
  const chatWanted = step === 'her' || step === 'hand-1';
  if (st.hint.includes(L.t2['ui.chatHint']) !== chatWanted) out.push(`Chat-Satz ${chatWanted ? 'fehlt' : 'steht da'}`);
  if (m && m[1] === 'face' && st.face !== run.faces[n - 1]) out.push(`Gesicht ${st.face} statt ${run.faces[n - 1]}`);
  // screen readers: when the echo comes or goes, #echo-say (aria-live) says it, the first time with the explaining sentence
  if (m && m[1] === 'face') {
    const prev = n > 1 ? run.echo[n - 2] : null;
    if (want !== prev) {
      const say = want ? (n === first ? `${L.t2['ui.echoHint']} ` : '') + L.t2[want] : L.t2['ui.echoGone'];
      if (st.say !== say) out.push(`Ansage "${st.say}" statt "${say}"`);
    }
  }
  if (step === 'her' && st.say !== '') out.push(`Ansage zu Beginn "${st.say}"`);
  if (step === 'review-3' && !st.cost.includes(L.t2[`cost.${run.end}`])) out.push(`Kostenzeile ${run.end} fehlt`);
  return out;
}

for (const run of RUNS) {
  const dir = `${OUT}/${run.lang}/${run.name}`;
  mkdirSync(dir, { recursive: true });
  const { context, page } = await phone(`${run.lang}/${run.name}`, { viewport: run.viewport, locale: LANGS[run.lang].locale, dark: run.dark, lang: run.lang });
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
  let n = 0, again = false; // again: after "Noch mal" day 1 runs, the day 2 checks stop
  const snap = async step => {
    await reach(step);
    const file = `${dir}/${String(++n).padStart(2, '0')}-${step}.png`;
    await page.screenshot({ path: file, animations: 'disabled' });
    shots++;
    for (const f of await check(page, run.lang)) warn(`${file}: ${f}`);
    if (run.day === 2 && !again && /^(her|hand|you|face|over|review)/.test(step)) for (const f of await checkDay2(page, run, step)) warn(`${file}: ${f}`);
    if (HELP_AT[run.name]?.includes(step) && !again) await helpAndBack(step);
  };
  // Open the help page from this screen and come back: the screen must be exactly as before.
  const helpAndBack = async step => {
    const before = await page.innerHTML('#app');
    await page.click('[data-help]');
    await page.waitForSelector('#app[data-step="help"]');
    const file = `${dir}/${String(++n).padStart(2, '0')}-hilfe-von-${step}.png`;
    await page.screenshot({ path: file, fullPage: true, animations: 'disabled' });
    shots++;
    const detected = run.lang === 'de' ? 'de' : 'us'; // locale de-DE / en-US
    for (const f of [...await check(page, run.lang), ...await checkHelp(page, run.lang, detected, detected)]) warn(`${file}: ${f}`);
    await page.click('#back');
    await page.waitForSelector(`#app[data-step="${step}"]`);
    const after = await page.innerHTML('#app');
    if (after !== before) warn(`${file}: nach Zurueck ist ${step} nicht wie vorher`);
    const focus = await page.evaluate(() => document.activeElement?.hasAttribute('data-help'));
    if (!focus) warn(`${file}: Fokus nach Zurueck nicht auf dem Hilfe-Link`);
  };
  const L = LANGS[run.lang];
  const day2Line = async want => {
    const line = await page.textContent('h1.day');
    if (line !== L.t2[want]) warn(`${dir}: Tag-2-Satz "${line}" statt ${want}`);
  };

  if (run.day === 2) {
    await page.goto(`${url}&tag=2`);
    await snap('day2');
    await day2Line('ui.day2'); // nothing stored from day 1: the plain sentence
  } else {
    await page.goto(url);
    await snap('start');
  }
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
  if (!run.day) { // day 1 stores its end for the start sentence of day 2
    const stored = await page.evaluate(() => localStorage.getItem('adz.day1end'));
    if (stored !== run.picks.at(-1)) warn(`${dir}: adz.day1end "${stored}" statt ${run.picks.at(-1)}`);
  }
  for (const step of ['review-1', 'review-2', 'review-3']) {
    await page.click('#go');
    await snap(step);
  }
  await page.click('#go');
  if (run.day === 2) {
    await snap('done');
    await page.click('#go');
    again = true;
    await snap('her'); // "Noch mal" starts day 1 again, with a new seed
    const label = await page.getAttribute('.stage svg', 'aria-label');
    if (label !== L.t1['ui.stage']) warn(`${dir}: Noch mal zeigt "${label}" statt Tag 1`);
  } else {
    // after the review of day 1: start of day 2; ends E and G name Kessler
    await snap('day2');
    const end = run.picks.at(-1);
    await day2Line(end === 'E' || end === 'G' ? 'ui.day2.kessler' : 'ui.day2');
  }
  await context.close();
}

// ---------- Season 1 ----------
// Every path of a scene as option ids, walked like the engine does (first outcome whose `after` was chosen).
function scenePaths(sc) {
  const out = [];
  const walk = (turn, chosen) => {
    for (const id of sc.turns[turn]) {
      const o = sc.options[id].find(x => !x.after || chosen.includes(x.after));
      const path = [...chosen, id];
      if (o.end) out.push({ picks: path, end: o.end, outcomes: path.map((p, i) => sc.options[p].find(x => !x.after || path.slice(0, i).includes(x.after))) });
      else walk(o.next, path);
    }
  };
  walk(0, []);
  return out;
}
const STAFFEL_RUNS = ['dachboden', 'samstag', 'gans'].flatMap(name => {
  const sc = json(`${name}.json`);
  const t = { ...LANGS.de.t1, ...json(`de/${name}.json`) };
  const byEnd = new Map();
  for (const p of scenePaths(sc)) if (!byEnd.has(p.end)) byEnd.set(p.end, p);
  const ends = [...byEnd.values()];
  const guess = i => sc.guess[i % sc.guess.length];
  return [
    ...ends.map((p, i) => ({ name, sc, t, ...p, guess: guess(i), viewport: BIG, run: `${p.picks.join('-')}` })),
    ...ends.map((p, i) => ({ name, sc, t, ...p, guess: guess(i + 1), viewport: SMALL, run: `360-${p.picks.join('-')}` })),
    { name, sc, t, ...ends[0], guess: guess(2), viewport: MID, run: `375-${ends[0].picks.join('-')}` },
    { name, sc, t, ...ends[0], guess: guess(3), viewport: BIG, dark: true, run: `dunkel-${ends[0].picks.join('-')}` },
    { name, sc, t, ...ends[0], guess: guess(0), viewport: BIG, lang: 'en', run: `en-${ends[0].picks.join('-')}` },
  ];
});

for (const r of STAFFEL_RUNS) {
  const dir = `${OUT}/staffel/${r.name}/${r.run}`;
  mkdirSync(dir, { recursive: true });
  const { context, page } = await phone(`staffel/${r.name}/${r.run}`, { viewport: r.viewport, dark: r.dark, lang: r.lang ?? 'de' });
  await page.clock.install();
  const reach = async step => {
    let idle = 0;
    for (let ms = 0; !(await page.$(`#app[data-step="${step}"]`)); ms += 100) {
      if (ms > 10000) throw new Error(`${dir}: ${step} nicht erreicht`);
      const active = await page.evaluate(() => [...document.querySelectorAll('.say, #go')].some(el => !el.closest('[hidden]')));
      idle = active ? 0 : idle + 100;
      if (idle > MAX_IDLE) { warn(`${dir}: vor ${step} ueber ${MAX_IDLE} ms ohne Karte oder Knopf`); idle = -1e9; }
      await page.clock.runFor(100);
    }
  };
  let n = 0;
  const snap = async (step, label = step) => {
    await reach(step);
    const file = `${dir}/${String(++n).padStart(2, '0')}-${label}.png`;
    await page.screenshot({ path: file, animations: 'disabled' });
    shots++;
    for (const f of await check(page, 'de')) warn(`${file}: ${f}`); // the scenes are German, also with English stored
    return file;
  };
  const texts = sel => page.$$eval(sel, els => els.map(e => e.textContent));

  await page.goto(`${url}&szene=${r.name}`);
  let file = await snap('her');
  const lage = await page.textContent('#lage');
  if (lage !== r.t[r.sc.lage]) warn(`${file}: Lage "${lage}"`);
  for (let i = 0; i < r.picks.length; i++) {
    await snap(`hand-${i + 1}`);
    await page.click(`.say[data-id="${r.picks[i]}"]`);
    await snap(`you-${i + 1}`);
    file = await snap(`face-${i + 1}`);
    const face = await page.getAttribute('#app', 'data-face');
    if (face !== r.outcomes[i].face) warn(`${file}: Gesicht ${face} statt ${r.outcomes[i].face}`);
  }
  // last move: stage line, four guess cards, her answer (the short one after guessShortAfter)
  const g = r.picks.length + 1;
  file = await snap(`hand-${g}`, `hand-${g}-vermutung`);
  if (await page.textContent('#last') !== r.t['ui.lastQuestion']) warn(`${file}: Regiezeile fehlt`);
  const short = (r.sc.guessShortAfter ?? []).includes(r.end);
  const want = r.sc.guess.map(x => r.t[x.text]).sort();
  const cards = (await texts('.say')).sort();
  if (JSON.stringify(cards) !== JSON.stringify(want)) warn(`${file}: Vermutungskarten ${JSON.stringify(cards)}`);
  await page.click(`.say[data-id="${r.guess.id}"]`);
  await snap(`you-${g}`);
  file = await snap(`face-${g}`);
  if (await page.getAttribute('#app', 'data-face') !== r.guess.face) warn(`${file}: Gesicht nach Vermutung`);
  file = await snap('over');
  const her = (await texts('.her q')).pop();
  const reply = short && r.guess.short ? r.guess.short : r.guess.reply; // TREPPE 'stufe'
  if (her !== r.t[reply]) warn(`${file}: Antwort "${her}" statt ${reply}`);
  await page.click('#go');
  file = await snap('review-1');
  if (await page.$('.inner')) warn(`${file}: Inneres steht da`);
  await page.click('#go');
  file = await snap('review-2');
  const rv = await texts('.rv p');
  if (!rv.includes(r.t[r.sc.review.cost[r.end]])) warn(`${file}: Kostenzeile ${r.end} fehlt`);
  const obs = r.sc.observe[r.picks.join('-')];
  if (await page.textContent('#obs') !== r.t['ui.observe']) warn(`${file}: Link zum Beobachtungssatz fehlt`);
  await page.click('#obs');
  file = await snap('review-2', 'review-2-satz');
  if (!(await texts('.rv .obs')).includes(r.t[obs])) warn(`${file}: Beobachtungssatz ${obs} fehlt`);
  await page.click('#go');
  await snap('done');
  await page.click('#go');
  await snap('her', 'noch-mal');
  if (await page.getAttribute('.stage svg', 'aria-label') !== r.t['ui.stage']) warn(`${dir}: Noch mal spielt nicht ${r.name}`);
  await context.close();
}
console.log(`Staffel 1: ${STAFFEL_RUNS.length} Laeufe`);

// Help page for every country, in both languages, 390x844 light and dark and 360x640; switch to the international list and back; "Back" to the start.
for (const land of LANDS) for (const lang of Object.keys(LANGS)) for (const [vp, dark] of [[BIG, false], [BIG, true], [SMALL, false]]) {
  const name = `${land}-${vp.width}${dark ? '-dunkel' : ''}`;
  const dir = `${OUT}/hilfe/${lang}`;
  mkdirSync(dir, { recursive: true });
  const { context, page } = await phone(`hilfe/${lang}/${name}`, { viewport: vp, locale: LANGS[lang].locale, dark, lang });
  await page.goto(`${url}&land=${land}&hilfe=1`);
  await page.waitForSelector('#app[data-step="help"]');
  const look = async (file, shown) => {
    await page.screenshot({ path: file, fullPage: true, animations: 'disabled' });
    shots++;
    for (const f of [...await check(page, lang), ...await checkHelp(page, lang, shown, land)]) warn(`${file}: ${f}`);
  };
  await look(`${dir}/${name}.png`, land);
  if (land !== 'intl') {
    await page.click('.switch');
    await look(`${dir}/${name}-weitere.png`, 'intl');
    await page.click('.switch');
    await look(`${dir}/${name}-zurueck.png`, land);
  }
  await page.click('#back');
  await page.waitForSelector('#app[data-step="start"]');
  if (await page.textContent('.title') !== LANGS[lang].t1['ui.title']) warn(`${dir}/${name}: Zurueck fuehrt nicht zum Start`);
  if (await page.$('.helpview')) warn(`${dir}/${name}: Hilfeseite nach Zurueck noch da`);
  await context.close();
}

// Country from the browser: region of the first language, else the time zone (no ?land=).
for (const [locale, timezoneId, want] of [['de-AT', 'Europe/Berlin', 'at'], ['en-GB', 'Europe/Berlin', 'gb'], ['fr-CH', 'Europe/Berlin', 'ch'],
  ['en-IE', 'Europe/Berlin', 'ie'], ['de-DE', 'America/Chicago', 'de'], ['de', 'Europe/Zurich', 'ch'], ['en', 'America/Chicago', 'us'], ['en', 'America/Toronto', 'intl'], ['es', 'America/Mexico_City', 'intl'],
  ['fr-FR', 'Europe/Berlin', 'intl'], ['de', 'Asia/Tokyo', 'intl']]) {
  const context = await browser.newContext({ locale, timezoneId });
  const page = await context.newPage();
  await page.goto(`${url}&hilfe=1`);
  await page.waitForSelector('#app[data-step="help"]');
  const got = await page.getAttribute('#app', 'data-land');
  if (got !== want) warn(`Land bei ${locale} / ${timezoneId}: ${got} statt ${want}`);
  await context.close();
}
console.log('Land aus Browsersprache und Zeitzone: 11 Faelle geprueft');

// ?reset=1: the stored language is forgotten, German is the default again, the parameter is gone.
mkdirSync(`${OUT}/reset`, { recursive: true });
for (const lang of ['en', 'de']) { // browser language; the game is German after the reset either way
  const other = 'en';
  const { context, page } = await phone(`reset-${lang}`, { locale: LANGS[lang].locale });
  await page.goto(url);
  await page.click(`[data-lang="${other}"]`); // stores the other language
  await page.evaluate(() => localStorage.setItem('adz.day1end', 'E')); // as after day 1 with end E
  await page.reload();
  if (await page.locator('html').getAttribute('lang') !== other) warn(`reset-${lang}: Umschalter auf ${other} nicht gespeichert`);
  await page.goto(`${url}&reset=1`);
  await page.waitForURL(u => !u.search.includes('reset'));
  await page.waitForSelector('#app[data-step="start"]');
  const file = `${OUT}/reset/${LANGS[lang].locale}-start.png`;
  await page.screenshot({ path: file });
  shots++;
  const want = LANGS.de.t1['ui.title'];
  const title = await page.textContent('.title');
  if (title !== want) warn(`${file}: Titel "${title}" statt "${want}"`);
  if (await page.title() !== want) warn(`${file}: Seitentitel "${await page.title()}"`);
  const active = await page.getAttribute('[aria-pressed="true"]', 'data-lang');
  if (active !== 'de') warn(`${file}: Umschalter zeigt ${active} als aktiv`);
  for (const f of await check(page, 'de')) warn(`${file}: ${f}`);
  // the end of day 1 is gone, so day 2 starts with the plain sentence
  const end1 = await page.evaluate(() => localStorage.getItem('adz.day1end'));
  if (end1 !== null) warn(`${file}: adz.day1end nach Reset "${end1}"`);
  await page.goto(`${url}&tag=2`);
  await page.waitForSelector('#app[data-step="day2"]');
  const line = await page.textContent('h1.day');
  if (line !== LANGS.de.t2['ui.day2']) warn(`${file}: Tag-2-Satz nach Reset "${line}"`);
  await page.screenshot({ path: `${OUT}/reset/${LANGS[lang].locale}-tag2.png` });
  shots++;
  await context.close();
}

// Offline: one visit online, then no network, reload, play C-E to the end (real timers).
mkdirSync(`${OUT}/offline`, { recursive: true });
{
  const { context, page } = await phone('offline');
  await page.goto(url);
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
  await context.setOffline(true);
  await page.reload();
  await page.waitForSelector('#app[data-step="start"]');
  await page.screenshot({ path: `${OUT}/offline/01-start.png` });
  // the help page works offline too (help.json is in the cached bundle)
  await page.click('[data-help]');
  await page.waitForSelector('#app[data-step="help"]');
  await page.screenshot({ path: `${OUT}/offline/02-hilfe.png`, fullPage: true });
  shots++;
  for (const f of [...await check(page, 'de'), ...await checkHelp(page, 'de', 'de', 'de')]) warn(`${OUT}/offline/02-hilfe.png: ${f}`);
  await page.click('#back');
  await page.waitForSelector('#app[data-step="start"]');
  await page.click('#go');
  for (const id of PATHS['C-E']) await page.click(`.say[data-id="${id}"]`);
  await page.waitForSelector('#app[data-step="over"]');
  for (let i = 0; i < 3; i++) await page.click('#go');
  await page.waitForSelector('#app[data-step="review-3"]');
  await page.waitForTimeout(600); // let the last line finish fading in
  await page.screenshot({ path: `${OUT}/offline/03-review-3.png`, animations: 'disabled' });
  shots += 2;
  for (const f of await check(page, 'de')) warn(`${OUT}/offline/03-review-3.png: ${f}`);
  const online = await page.evaluate(() => navigator.onLine);
  if (online) warn('offline: Seite meldet navigator.onLine = true');
  console.log(`offline: Neu laden ohne Netz, Hilfeseite, Pfad C-E bis zum Rueckblick gespielt (navigator.onLine = ${online})`);
  await context.close();
}

await browser.close();
await new Promise(resolve => server.httpServer.close(resolve));
console.log(`${shots} Screenshots in ${OUT}/, ${findings} Befunde, ${errors} Konsolenfehler`);
process.exitCode = findings || errors ? 1 : 0;
