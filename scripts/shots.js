// Plays day 1 in a 390x844 viewport with a fixed seed and takes one screenshot per screen.
// Checks: blocklist, digits (only "16:50"), max 3 lines per sentence, font >= 17 px,
// touch targets >= 44 px, nothing outside the screen, console errors.
// Run: npm run shots (builds first). Output: shots/<path>/NN-<step>.png
import { chromium } from 'playwright';
import { preview } from 'vite';
import { mkdirSync, readFileSync, rmSync } from 'node:fs';

const SEED = 20261007;
const BLOCK = JSON.parse(readFileSync(new URL('../content/blocklist.json', import.meta.url)));
const RUNS = [
  { name: 'A-E-G', picks: ['A', 'E', 'G'] },
  { name: 'B-D', picks: ['B', 'D'] },
  { name: 'C-E', picks: ['C', 'E'] },
  { name: 'A-F-H', picks: ['A', 'F', 'H'] },
  { name: 'B-F-I', picks: ['B', 'F', 'I'] },
  { name: 'dunkel-C-E', picks: ['C', 'E'], dark: true },
];

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
    if (de.scrollHeight > H) out.push(`ragt unten raus: ${de.scrollHeight} > ${H}`);
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
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1,
    colorScheme: run.dark ? 'dark' : 'light', hasTouch: true, isMobile: true });
  page.on('console', m => { if (m.type() === 'error') { errors++; console.log(`FEHLER ${run.name} console: ${m.text()}`); } });
  page.on('pageerror', e => { errors++; console.log(`FEHLER ${run.name} page: ${e.message}`); });

  let n = 0;
  const snap = async step => {
    await page.waitForSelector(`#app[data-step="${step}"]`, { timeout: 15000 });
    await page.waitForTimeout(600); // let fades finish
    const file = `${dir}/${String(++n).padStart(2, '0')}-${step}.png`;
    await page.screenshot({ path: file, animations: 'disabled' });
    shots++;
    for (const f of await check(page)) { findings++; console.log(`WARN ${file}: ${f}`); }
  };

  await page.goto(url);
  await snap('start');
  await page.click('#go');
  await snap('lage');
  await snap('her');
  for (let i = 0; i < run.picks.length; i++) {
    const t = i + 1;
    await snap(`hand-${t}`);
    await page.click(`.say[data-id="${run.picks[i]}"]`);
    await snap(`you-${t}`);
    await snap(`face-${t}`);
    await snap(`reply-${t}`);
  }
  await snap('over');
  for (const step of ['review-1', 'review-2', 'review-3']) {
    await page.click('#go');
    await snap(step);
  }
  await page.click('#go');
  await snap('done');
  await page.click('#go');
  await snap('lage'); // "Noch mal" starts the conversation again
  await page.close();
}

await browser.close();
await new Promise(resolve => server.httpServer.close(resolve));
console.log(`${shots} Screenshots in shots/, ${findings} Befunde, ${errors} Konsolenfehler`);
process.exitCode = findings || errors ? 1 : 0;
