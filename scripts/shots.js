// Plays day 1 with a fixed seed in 390x844 (and 360x640, 375x667) and takes one screenshot per screen.
// Checks: blocklist, digits (only "16:50"), max 3 lines per sentence, font >= 17 px,
// touch targets >= 44 px, cards / button / cost line inside the viewport, nothing sticking out sideways,
// no stretch longer than 1 s without a card or button (timers run on Playwright's fake clock), console errors.
// Run: npm run shots (builds first). Output: shots/<path>/NN-<step>.png
import { chromium } from 'playwright';
import { preview } from 'vite';
import { mkdirSync, readFileSync, rmSync } from 'node:fs';

const SEED = 20261007;
const BLOCK = JSON.parse(readFileSync(new URL('../content/blocklist.json', import.meta.url)));
const PATHS = { 'A-E-G': ['A', 'E', 'G'], 'B-D': ['B', 'D'], 'C-E': ['C', 'E'], 'A-F-H': ['A', 'F', 'H'], 'B-F-I': ['B', 'F', 'I'] };
const BIG = { width: 390, height: 844 }, SMALL = { width: 360, height: 640 }, MID = { width: 375, height: 667 };
const RUNS = [
  ...Object.entries(PATHS).map(([name, picks]) => ({ name, picks, viewport: BIG })),
  { name: 'dunkel-C-E', picks: PATHS['C-E'], viewport: BIG, dark: true },
  ...Object.entries(PATHS).map(([name, picks]) => ({ name: `360-${name}`, picks, viewport: SMALL })),
  { name: '375-A-E-G', picks: PATHS['A-E-G'], viewport: MID },
];
const MAX_IDLE = 1000; // ms without a visible card or button

function check(page) {
  return page.evaluate(BLOCK => {
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
      if (r.width && (r.width < 44 || r.height < 44)) out.push(`Tippziel ${Math.round(r.width)}x${Math.round(r.height)}: ${b.textContent.trim().slice(0, 30)}`);
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
    const digits = text.replace(/16:50/g, '').match(/\d+/g);
    if (digits) out.push(`Zahl ${digits.join(',')}`);
    return out;
  }, BLOCK);
}

const server = await preview({ preview: { port: 4179, strictPort: true }, logLevel: 'silent' });
const url = `http://localhost:4179/?seed=${SEED}`;
const browser = await chromium.launch();
rmSync('shots', { recursive: true, force: true });

let findings = 0, errors = 0, shots = 0;
for (const run of RUNS) {
  const dir = `shots/${run.name}`;
  mkdirSync(dir, { recursive: true });
  const page = await browser.newPage({ viewport: run.viewport, deviceScaleFactor: 1,
    colorScheme: run.dark ? 'dark' : 'light', hasTouch: true, isMobile: true });
  page.on('console', m => { if (m.type() === 'error') { errors++; console.log(`FEHLER ${run.name} console: ${m.text()}`); } });
  page.on('pageerror', e => { errors++; console.log(`FEHLER ${run.name} page: ${e.message}`); });
  await page.clock.install();

  // Advance the fake clock in 100 ms steps until the screen is reached; count time without card or button.
  const reach = async step => {
    let idle = 0;
    for (let ms = 0; !(await page.$(`#app[data-step="${step}"]`)); ms += 100) {
      if (ms > 10000) throw new Error(`${run.name}: ${step} nicht erreicht`);
      const active = await page.evaluate(() => [...document.querySelectorAll('.say, #go')].some(el => !el.closest('[hidden]')));
      idle = active ? 0 : idle + 100;
      if (idle > MAX_IDLE) { findings++; console.log(`WARN ${run.name}: vor ${step} ueber ${MAX_IDLE} ms ohne Karte oder Knopf`); idle = -1e9; }
      await page.clock.runFor(100);
    }
  };
  let n = 0;
  const snap = async step => {
    await reach(step);
    const file = `${dir}/${String(++n).padStart(2, '0')}-${step}.png`;
    await page.screenshot({ path: file, animations: 'disabled' });
    shots++;
    for (const f of await check(page)) { findings++; console.log(`WARN ${file}: ${f}`); }
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
  await snap('her'); // "Noch mal" starts the conversation again
  await page.close();
}

await browser.close();
await new Promise(resolve => server.httpServer.close(resolve));
console.log(`${shots} Screenshots in shots/, ${findings} Befunde, ${errors} Konsolenfehler`);
process.exitCode = findings || errors ? 1 : 0;
