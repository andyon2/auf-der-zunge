// Screens in the order of the picture sequence (arbeit/06-mockups/bildfolge):
// start -> lage with her line -> hand -> your line -> her face changes -> her answer with the next hand -> ... -> over -> review
// Day 1 (Frau Brandt, office) is followed by day 2 (Jule, chat), then "done".
// #app[data-step] names the current screen, data-face and data-echo what the stage shows; scripts/shots.js reads them.
import day1Json from '../../content/tag1.json';
import day2Json from '../../content/tag2.json';
import de1 from '../../content/de/tag1.json';
import en1 from '../../content/en/tag1.json';
import de2 from '../../content/de/tag2.json';
import en2 from '../../content/en/tag2.json';
import { FACES, type FaceName } from '../engine/faces';
import { choose, hand, newGame, review, type GameState, type Scene } from '../engine/game';
import { figure } from './figure';
import { nextRound } from '../engine/rng';

export type Lang = 'de' | 'en';
export type Day = 1 | 2;
const SCENES: Record<Day, Scene> = { 1: day1Json as Scene, 2: day2Json as Scene };
// Day 2 has its own ids for the scene; the ui.* labels of day 1 hold for both days.
const TEXTS: Record<Lang, Record<Day, Record<string, string>>> = {
  de: { 1: de1, 2: { ...de1, ...de2 } },
  en: { 1: en1, 2: { ...en1, ...en2 } },
};
let lang: Lang = 'de';
let day: Day = 1;
const scene = () => SCENES[day];
const chat = () => scene().frame === 'chat';

// Pauses between the beats of one exchange (ms). No screen without a card or button lasts longer than 1 s.
const BEAT = { hand: 600, you: 400, face: 600 };

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
const t = (id: string) => esc(TEXTS[lang][day][id]);

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

function setLang(next: Lang): void {
  lang = next;
  document.documentElement.lang = next;
  document.title = TEXTS[next][1]['ui.title'];
}

export function start(root: HTMLElement, daySeed: number, startLang: Lang, startDay: Day = 1): void {
  app = root;
  baseSeed = seed = daySeed;
  setLang(startLang);
  if (startDay === 2) showDay2();
  else showStart();
}

// "Again" plays a new game; the counter lives in localStorage.
function nextSeed(): number {
  const round = nextRound(load('adz.round'), baseSeed);
  save('adz.round', round.stored);
  return round.seed;
}

function setStep(step: string): void {
  app.dataset.step = step;
}

function showStart(): void {
  day = 1;
  const choice = (l: Lang) => `<button data-lang="${l}" aria-pressed="${l === lang}">${l.toUpperCase()}</button>`;
  app.innerHTML = `
    <div class="lang">${choice('de')}<span aria-hidden="true">|</span>${choice('en')}</div>
    <div class="start"><h1 class="title">${t('ui.title')}</h1><p class="tagline">${t('ui.tagline')}</p></div>
    <div class="bottom"><button class="go" id="go">${t('ui.go')}</button></div>
    <p class="help">${t('ui.help')}</p>`;
  setStep('start');
  window.scrollTo(0, 0);
  app.querySelector('#go')!.addEventListener('click', () => conversation());
  app.querySelectorAll<HTMLButtonElement>('[data-lang]').forEach(b => b.addEventListener('click', () => {
    setLang(b.dataset.lang as Lang);
    save('adz.lang', lang);
    showStart();
  }));
}

// Start of day 2: one sentence, it names Kessler if day 1 ended with E or G (stored in adz.day1end).
export function day2Line(day1End: string | null): string {
  return day1End === 'E' || day1End === 'G' ? 'ui.day2.kessler' : 'ui.day2';
}

function showDay2(): void {
  day = 2;
  const line = day2Line(load('adz.day1end'));
  app.innerHTML = `
    <div class="start"><h1 class="day">${t(line)}</h1></div>
    <div class="bottom"><button class="go" id="go">${t('ui.next')}</button></div>
    <p class="help">${t('ui.help')}</p>`;
  setStep('day2');
  window.scrollTo(0, 0);
  app.querySelector('#go')!.addEventListener('click', () => conversation());
}

// ---------- Conversation ----------

function stage(face: FaceName): string {
  const W = 390, H = 300, sc = 1.42, tx = W / 2 - 120 * sc, ty = -14, wx = W - 108;
  // Day 1: office with desk. Day 2: Jule in her room, no desk; the figure runs out at the bottom edge.
  const desk = chat() ? '' : `
    <rect x="-4" y="${H - 34}" width="${W + 8}" height="40" fill="var(--paper-3)" stroke="var(--fig-ink)" stroke-width="2.2"/>
    <g transform="rotate(-4 120 ${H - 28})">
      <rect x="84" y="${H - 46}" width="92" height="22" rx="2" fill="var(--paper-2)" stroke="var(--fig-ink)" stroke-width="2"/>
      <path d="M94 ${H - 38} H160 M94 ${H - 32} H146" stroke="var(--fig-ink)" stroke-width="1.4" stroke-linecap="round"/>
    </g>`;
  return `<div class="stage"><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax meet" role="img" aria-label="${t('ui.stage')}">
    <rect width="${W}" height="${H}" fill="var(--room)"/>
    <rect x="${wx}" y="40" width="86" height="130" fill="var(--window)" stroke="var(--rule)" stroke-width="4"/>
    <path d="M${wx + 43} 40 V170" stroke="var(--rule)" stroke-width="4"/>
    <g transform="translate(${tx} ${ty}) scale(${sc})"><g class="fig">${figure(FACES[face], scene().who)}</g></g>${desk}
  </svg><p class="echo" id="echo" hidden></p></div><p class="sr" id="echo-say" aria-live="polite"></p>`;
}

// The echo: a quote at its fixed place top left in the stage, grey, only the brick word in --brick.
function echoHtml(id: string): string {
  const quote = t(id), brick = t(`${id}.brick`);
  return quote.replace(brick, `<span class="brick">${brick}</span>`);
}

function setEcho(id: string | undefined): void {
  const box = app.querySelector<HTMLElement>('#echo')!;
  box.innerHTML = id ? echoHtml(id) : '';
  box.hidden = !id;
  app.dataset.echo = id ?? '';
}

// Cross-fade the figure to a new face.
function changeFace(face: FaceName): void {
  const old = app.querySelector<SVGGElement>('.fig')!;
  const next = old.cloneNode(false) as SVGGElement;
  next.innerHTML = figure(FACES[face], scene().who);
  next.classList.add('fig-in');
  old.classList.remove('fig', 'fig-in');
  old.classList.add('fig-out');
  old.after(next);
  setTimeout(() => old.remove(), 350);
  app.dataset.face = face;
}

// Day 1: her line in quotes, yours as "Du: ...". Day 2: chat messages, the speaker only for screen readers.
const herLine = (id: string) => chat()
  ? `<p class="her msg appear"><span class="sr">${t('ui.her')} </span>${t(id)}</p>`
  : `<p class="her appear"><q>${t(id)}</q></p>`;
const youLine = (id: string) => chat()
  ? `<p class="you msg appear"><span class="sr">${t('ui.you')} </span>${t(id)}</p>`
  : `<p class="you appear">${t('ui.you')} <q>${t(id)}</q></p>`;

async function conversation(): Promise<void> {
  const sc = scene();
  let state = newGame(sc, seed);
  let echoExplained = false;
  // Lage and her first line appear together, the cards follow shortly after. .once lines go with the next answer.
  // Day 2: the chat sentence sits in the stage, below the face, so 360x640 keeps room for the cards (bericht M3).
  app.innerHTML = `${stage(state.face)}<div id="hints"><p class="caption once" id="lage">${t(sc.lage)}</p></div>`
    + `<div id="lines" aria-live="polite">${herLine(state.line)}</div><div id="below" hidden></div>`;
  const hints = app.querySelector<HTMLElement>('#hints')!;
  if (chat()) app.querySelector('.stage')!.insertAdjacentHTML('beforeend', `<p class="caption once stage-hint">${t('ui.chatHint')}</p>`);
  const lines = app.querySelector<HTMLElement>('#lines')!;
  const below = app.querySelector<HTMLElement>('#below')!;
  below.className = 'hand';
  app.dataset.face = state.face;
  setEcho(undefined);
  window.scrollTo(0, 0);
  setStep('her');
  await wait(BEAT.hand);

  for (let n = 1; !state.end; n++) {
    const option = await pick(below, hand(state), n);
    state = choose(sc, state, option);

    app.querySelectorAll('.once').forEach(el => el.remove()); // from the first answer on, the lines need the room
    // Lines are only appended (aria-live reads just the new one); older ones are dropped so two lines stay visible.
    while (lines.children.length > 1) lines.firstElementChild!.remove();
    lines.insertAdjacentHTML('beforeend', youLine(option));
    setStep(`you-${n}`);
    await wait(BEAT.you);
    changeFace(state.face);
    const before = app.dataset.echo;
    setEcho(state.echo);
    // Screen readers hear the echo once when it comes and a short line when it goes (#echo-say, aria-live).
    // The first echo of the game gets its one explaining sentence, until the next answer; it is read in the same
    // announcement, so #hints itself is not a live region and nothing is read twice.
    let say = '';
    if (state.echo && !echoExplained) {
      echoExplained = true;
      hints.insertAdjacentHTML('beforeend', `<p class="caption once appear" id="echo-hint">${t('ui.echoHint')}</p>`);
      say = `${t('ui.echoHint')} `;
    }
    if ((state.echo ?? '') !== before) {
      app.querySelector('#echo-say')!.innerHTML = say + (state.echo ? t(state.echo) : t('ui.echoGone'));
    }
    setStep(`face-${n}`);
    await wait(BEAT.face);
    // her answer and the next cards come together
    lines.firstElementChild!.remove();
    lines.insertAdjacentHTML('beforeend', herLine(state.line));
  }

  if (day === 1) save('adz.day1end', state.end);
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
  box.innerHTML = `<h2>${t(chat() ? 'ui.write' : 'ui.ask')}</h2>`
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
  const r = review(scene(), state);
  const log = r.log.map(e => e.who === 'you'
    ? `<p class="y">${t('ui.you')} <q>${t(e.text)}</q></p>`
    : `<p>${t('ui.her')} <q>${t(e.text)}</q></p>`).join('');
  const steps = [
    `<div class="rv appear"><p>${t('ui.inner')}</p><p class="inner"><q>${t(r.inner)}</q></p></div>`,
    `<div class="rv appear"><p>${t('ui.noRight')}</p><p>${t(r.cost)}</p></div>`,
  ];
  // A standing echo stays at its place above her face.
  app.innerHTML = `
    <div class="rv-face"><svg width="120" height="113" viewBox="40 34 160 150" role="img" aria-label="${t('ui.face')}">${figure(r.face, scene().who)}</svg>`
    + (r.echo ? `<p class="echo" id="echo">${echoHtml(r.echo)}</p>` : '') + `</div>
    <div class="log">${log}</div>
    <div id="more"></div>
    <div class="bottom"><button class="go" id="go">${t('ui.next')}</button></div>`;
  app.dataset.echo = r.echo ?? '';
  const more = app.querySelector<HTMLElement>('#more')!;
  window.scrollTo(0, 0);
  let shown = 0;
  setStep('review-1');
  app.querySelector('#go')!.addEventListener('click', () => {
    if (shown === steps.length) return day === 1 ? showDay2() : showDone();
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
  app.dataset.echo = '';
  app.querySelector('#go')!.addEventListener('click', () => {
    // "Again" starts at day 1 with a new seed.
    day = 1;
    seed = nextSeed();
    conversation();
  });
  window.scrollTo(0, 0);
}
