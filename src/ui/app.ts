// Screens of day 1, in the order of the picture sequence (arbeit/06-mockups/bildfolge):
// start -> lage with her line -> hand -> your line -> her face changes -> her answer with the next hand -> ... -> over -> review -> done.
// #app[data-step] names the current screen; scripts/shots.js waits for it.
import sceneJson from '../../content/tag1.json';
import de from '../../content/de/tag1.json';
import en from '../../content/en/tag1.json';
import { FACES, type FaceName } from '../engine/faces';
import { choose, hand, newGame, review, type GameState, type Scene } from '../engine/game';
import { figure } from './figure';

const scene = sceneJson as Scene;
export type Lang = 'de' | 'en';
const TEXTS: Record<Lang, Record<string, string>> = { de, en };
let lang: Lang = 'de';

// Pauses between the beats of one exchange (ms). No screen without a card or button lasts longer than 1 s.
const BEAT = { hand: 600, you: 400, face: 600 };

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
const t = (id: string) => esc(TEXTS[lang][id]);

let app: HTMLElement;
let baseSeed = 0; // seed of the day, or ?seed=
let seed = 0;     // seed of the current game

// localStorage can be missing or throw (private mode); the game works without it.
function load(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}
function save(key: string, value: string): void {
  try { localStorage.setItem(key, value); } catch { /* not stored, fine */ }
}

// Stored choice first, otherwise the browser's first language: de* -> de, anything else -> en.
export function firstLang(): Lang {
  const stored = load('adz.lang');
  if (stored === 'de' || stored === 'en') return stored;
  const first = navigator.languages?.[0] ?? navigator.language ?? '';
  return first.toLowerCase().startsWith('de') ? 'de' : 'en';
}

function setLang(next: Lang): void {
  lang = next;
  document.documentElement.lang = next;
  document.title = TEXTS[next]['ui.title'];
}

export function start(root: HTMLElement, daySeed: number, startLang: Lang): void {
  app = root;
  baseSeed = seed = daySeed;
  setLang(startLang);
  showStart();
}

// "Again" plays a new game: seed of the day plus a counter kept per day in localStorage.
function nextSeed(): number {
  const [day, count] = (load('adz.round') ?? '').split(':');
  const n = Number(day) === baseSeed ? Number(count) + 1 : 1;
  save('adz.round', `${baseSeed}:${n}`);
  return baseSeed + n;
}

function setStep(step: string): void {
  app.dataset.step = step;
}

function showStart(): void {
  const choice = (l: Lang) => `<button data-lang="${l}" aria-pressed="${l === lang}">${l.toUpperCase()}</button>`;
  app.innerHTML = `
    <div class="lang">${choice('de')}<span aria-hidden="true">|</span>${choice('en')}</div>
    <div class="start"><h1 class="title">${t('ui.title')}</h1><p class="tagline">${t('ui.tagline')}</p></div>
    <div class="bottom"><button class="go" id="go">${t('ui.go')}</button></div>
    <p class="help">${t('ui.help')}</p>`;
  setStep('start');
  app.querySelector('#go')!.addEventListener('click', () => conversation());
  app.querySelectorAll<HTMLButtonElement>('[data-lang]').forEach(b => b.addEventListener('click', () => {
    setLang(b.dataset.lang as Lang);
    save('adz.lang', lang);
    showStart();
  }));
}

// ---------- Conversation ----------

function stage(face: FaceName): string {
  const W = 390, H = 300, sc = 1.42, tx = W / 2 - 120 * sc, ty = -14, wx = W - 108;
  return `<div class="stage"><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax meet" role="img" aria-label="${t('ui.stage')}">
    <rect width="${W}" height="${H}" fill="var(--room)"/>
    <rect x="${wx}" y="40" width="86" height="130" fill="var(--window)" stroke="var(--rule)" stroke-width="4"/>
    <path d="M${wx + 43} 40 V170" stroke="var(--rule)" stroke-width="4"/>
    <g transform="translate(${tx} ${ty}) scale(${sc})"><g class="fig">${figure(FACES[face])}</g></g>
    <rect x="-4" y="${H - 34}" width="${W + 8}" height="40" fill="var(--paper-3)" stroke="var(--fig-ink)" stroke-width="2.2"/>
    <g transform="rotate(-4 120 ${H - 28})">
      <rect x="84" y="${H - 46}" width="92" height="22" rx="2" fill="var(--paper-2)" stroke="var(--fig-ink)" stroke-width="2"/>
      <path d="M94 ${H - 38} H160 M94 ${H - 32} H146" stroke="var(--fig-ink)" stroke-width="1.4" stroke-linecap="round"/>
    </g>
  </svg></div>`;
}

// Cross-fade the figure to a new face.
function changeFace(face: FaceName): void {
  const old = app.querySelector<SVGGElement>('.fig')!;
  const next = old.cloneNode(false) as SVGGElement;
  next.innerHTML = figure(FACES[face]);
  next.classList.add('fig-in');
  old.classList.remove('fig', 'fig-in');
  old.classList.add('fig-out');
  old.after(next);
  setTimeout(() => old.remove(), 350);
}

const herLine = (id: string) => `<p class="her appear"><q>${t(id)}</q></p>`;
const youLine = (id: string) => `<p class="you appear">${t('ui.you')} <q>${t(id)}</q></p>`;

async function conversation(): Promise<void> {
  let state = newGame(scene, seed);
  // Lage and her first line appear together, the cards follow shortly after.
  app.innerHTML = `${stage(state.face)}<p class="caption" id="lage">${t(scene.lage)}</p>`
    + `<div id="lines" aria-live="polite">${herLine(state.line)}</div><div id="below" hidden></div>`;
  const lines = app.querySelector<HTMLElement>('#lines')!;
  const below = app.querySelector<HTMLElement>('#below')!;
  below.className = 'hand';
  window.scrollTo(0, 0);
  setStep('her');
  await wait(BEAT.hand);

  for (let n = 1; !state.end; n++) {
    const option = await pick(below, hand(state), n);
    const before = state.line;
    state = choose(scene, state, option);

    app.querySelector('#lage')?.remove(); // from the first answer on, the stage and the lines need the room
    lines.innerHTML = `<p class="her"><q>${t(before)}</q></p>` + youLine(option);
    setStep(`you-${n}`);
    await wait(BEAT.you);
    changeFace(state.face);
    setStep(`face-${n}`);
    await wait(BEAT.face);
    // her answer and the next cards come together
    lines.innerHTML = `<p class="you">${t('ui.you')} <q>${t(option)}</q></p>` + herLine(state.line);
  }

  if (state.note) lines.insertAdjacentHTML('beforeend', `<p class="note appear">${t(state.note)}</p>`);
  lines.insertAdjacentHTML('beforeend', `<p class="over appear">${t('ui.over')}</p>`);
  below.className = 'bottom';
  below.innerHTML = `<button class="go" id="go">${t('ui.next')}</button>`;
  below.hidden = false;
  below.scrollIntoView({ block: 'end' });
  setStep('over');
  const final = state;
  below.querySelector('#go')!.addEventListener('click', () => showReview(final));
}

// Show three cards, resolve with the tapped option id.
function pick(box: HTMLElement, options: string[], n: number): Promise<string> {
  box.innerHTML = `<h2>${t('ui.ask')}</h2>`
    + options.map(id => `<button class="say" data-id="${id}">${t(id)}</button>`).join('');
  box.hidden = false;
  box.classList.add('appear');
  box.scrollIntoView({ block: 'end' });
  setStep(`hand-${n}`);
  return new Promise(resolve => {
    box.querySelectorAll<HTMLButtonElement>('.say').forEach(b => b.addEventListener('click', () => {
      box.hidden = true;
      box.classList.remove('appear');
      resolve(b.dataset.id!);
    }, { once: true }));
  });
}

// ---------- Review, one line per step ----------

function showReview(state: GameState): void {
  const r = review(scene, state);
  const log = r.log.map(e => e.who === 'you'
    ? `<p class="y">${t('ui.you')} <q>${t(e.text)}</q></p>`
    : `<p>${t('ui.her')} <q>${t(e.text)}</q></p>`).join('');
  const steps = [
    `<div class="rv appear"><p>${t('ui.inner')}</p><p class="inner"><q>${t(r.inner)}</q></p></div>`,
    `<div class="rv appear"><p>${t('ui.noRight')}</p><p>${t(r.cost)}</p></div>`,
  ];
  app.innerHTML = `
    <div class="rv-face"><svg width="120" height="113" viewBox="40 34 160 150" role="img" aria-label="${t('ui.face')}">${figure(r.face)}</svg></div>
    <div class="log">${log}</div>
    <div id="more"></div>
    <div class="bottom"><button class="go" id="go">${t('ui.next')}</button></div>`;
  const more = app.querySelector<HTMLElement>('#more')!;
  window.scrollTo(0, 0);
  let shown = 0;
  setStep('review-1');
  app.querySelector('#go')!.addEventListener('click', () => {
    if (shown === steps.length) return showDone();
    more.insertAdjacentHTML('beforeend', steps[shown++]);
    app.querySelector('#go')!.scrollIntoView({ block: 'end' });
    setStep(`review-${shown + 1}`);
  });
}

function showDone(): void {
  app.innerHTML = `
    <div class="start"><h1 class="title">${t('ui.title')}</h1><p class="tagline">${t('ui.done')}</p></div>
    <div class="bottom"><button class="go" id="go">${t('ui.again')}</button></div>
    <p class="help">${t('ui.help')}</p>`;
  setStep('done');
  app.querySelector('#go')!.addEventListener('click', () => {
    seed = nextSeed();
    conversation();
  });
  window.scrollTo(0, 0);
}
