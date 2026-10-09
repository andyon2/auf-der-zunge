import { describe, expect, it } from 'vitest';
import sceneJson from '../../content/tag1.json';
import de from '../../content/de/tag1.json';
import { choose, hand, newGame, review, type GameState, type Scene } from './game';
import { mulberry32, nextRound, seedFromDate, shuffle } from './rng';
import { FACES } from './faces';
import dachbodenJson from '../../content/dachboden.json';
import samstagJson from '../../content/samstag.json';
import gansJson from '../../content/gans.json';
import deDachboden from '../../content/de/dachboden.json';
import deSamstag from '../../content/de/samstag.json';
import deGans from '../../content/de/gans.json';
import blockDe from '../../content/blocklist.json';
import { guessHand, guessReply, takeGuess } from './game';
import { figure } from '../ui/figure';

const scene = sceneJson as Scene;
const text = de as Record<string, string>;

// Play option indices (0..2) per turn; turns after the end are ignored.
function play(seed: number, picks: number[]): { state: GameState; path: string[] } {
  let state = newGame(scene, seed);
  const path: string[] = [];
  for (const pick of picks) {
    if (state.end) break;
    const option = hand(state)[pick];
    path.push(option);
    state = choose(scene, state, option);
  }
  return { state, path };
}

const all27: number[][] = [];
for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) for (let c = 0; c < 3; c++) all27.push([a, b, c]);

describe('day 1, Frau Brandt', () => {
  it.each([1, 20261007, 424242])('all 27 paths end in a valid review (seed %i)', seed => {
    const endings = new Set<string>();
    for (const picks of all27) {
      const { state, path } = play(seed, picks);
      expect(state.end, path.join('>')).toBeDefined();
      const r = review(scene, state);
      endings.add(state.end!);
      for (const id of [r.inner!, r.cost, ...r.log.map(e => e.text), ...(state.note ? [state.note] : [])]) {
        expect(text[id], `${path.join('>')}: ${id}`).toBeTruthy();
      }
      expect(r.log.length).toBe(path.length * 2 + 1);
      expect(r.log[0]).toEqual({ who: 'her', text: scene.opening.line });
      expect(Object.values(r.face).every(v => v !== undefined)).toBe(true);
      expect(JSON.stringify(r)).not.toContain('undefined');
    }
    expect([...endings].sort()).toEqual(['D', 'E', 'G', 'H', 'I']);
  });

  it('follows the script branches', () => {
    const byIds = (ids: string[]) => {
      let s = newGame(scene, 7);
      for (const id of ids) s = choose(scene, s, id);
      return s;
    };
    expect(byIds(['C', 'E']).end).toBe('E');
    expect(byIds(['C', 'E']).face).toBe('yielding');
    expect(byIds(['B', 'D']).note).toBe('D.note');
    expect(byIds(['A', 'E', 'G']).line).toBe('G.reply.afterE');
    expect(byIds(['A', 'F', 'G']).line).toBe('G.reply');
    expect(byIds(['A', 'E']).end).toBeUndefined();
    expect(byIds(['A', 'E']).line).toBe('E.reply');
    expect(byIds(['B', 'D']).end).toBe('D');
    expect(byIds(['A', 'F', 'H']).end).toBe('H');
    expect(review(scene, byIds(['A', 'E', 'G'])).log.map(e => e.text)).toEqual(['brandt.open', 'A', 'A.reply', 'E', 'E.reply', 'G', 'G.reply.afterE']);
  });

  it('shuffles hands deterministically per seed', () => {
    expect(newGame(scene, 5).hands).toEqual(newGame(scene, 5).hands);
    const orders = new Set(Array.from({ length: 50 }, (_, i) => newGame(scene, i).hands[0].join('')));
    expect(orders.size).toBeGreaterThan(1);
    for (const h of newGame(scene, 5).hands) expect(h).toHaveLength(3);
  });

  it('rejects options not in hand', () => {
    expect(() => choose(scene, newGame(scene, 1), 'G')).toThrow();
  });

  it('every face named in the scene exists', () => {
    const faces = [scene.opening.face, ...Object.values(scene.options).flat().map(o => o.face)];
    for (const f of faces) expect(FACES[f]).toBeDefined();
  });
});

describe('rng', () => {
  it('seed from date is YYYYMMDD', () => {
    expect(seedFromDate(new Date(2026, 9, 7))).toBe(20261007);
  });
  it('mulberry32 is deterministic and in range', () => {
    const a = mulberry32(3), b = mulberry32(3);
    for (let i = 0; i < 100; i++) {
      const x = a();
      expect(x).toBe(b());
      expect(x >= 0 && x < 1).toBe(true);
    }
    expect(shuffle([1, 2, 3], mulberry32(1)).sort()).toEqual([1, 2, 3]);
  });
});

describe('nextRound ("Again")', () => {
  it('adds a counter to the seed of the day', () => {
    expect(nextRound(null, 20261007)).toEqual({ seed: 20261008, stored: '20261007:1' });
    expect(nextRound('20261007:1', 20261007)).toEqual({ seed: 20261009, stored: '20261007:2' });
  });

  it('starts the counter again on a new day', () => {
    expect(nextRound('20261007:5', 20261008)).toEqual({ seed: 20261009, stored: '20261008:1' });
  });

  it('survives a broken stored value', () => {
    expect(nextRound('20261007:x', 20261007)).toEqual({ seed: 20261008, stored: '20261007:1' });
  });
});

// Season 1: every path of the three scenes, the last move and the observing sentence.
const STAFFEL = [
  { name: 'dachboden', scene: dachbodenJson as Scene, de: deDachboden as Record<string, string>, paths: 28 },
  { name: 'samstag', scene: samstagJson as Scene, de: deSamstag as Record<string, string>, paths: 36 },
  { name: 'gans', scene: gansJson as Scene, de: deGans as Record<string, string>, paths: 36 },
];

function allPaths(sc: Scene, seed: number): GameState[] {
  const out: GameState[] = [];
  const walk = (state: GameState) => {
    if (state.end) return void out.push(state);
    for (const id of hand(state)) walk(choose(sc, state, id));
  };
  walk(newGame(sc, seed));
  return out;
}

describe.each(STAFFEL)('season 1, $name', ({ scene: sc, de: text, paths: count }) => {
  const ends = allPaths(sc, 20261008);

  it('every path ends, and every text id it shows exists', () => {
    expect(ends.length).toBe(count);
    for (const state of ends) {
      const path = state.chosen.join('-');
      expect(state.end, path).toBeDefined();
      const r = review(sc, state);
      expect(r.inner).toBeUndefined();
      for (const id of [sc.lage, r.cost, ...r.log.map(e => e.text), ...(state.note ? [state.note] : [])]) {
        expect(text[id], `${path}: ${id}`).toBeTruthy();
      }
    }
  });

  it('every answer id and every face exists', () => {
    for (const o of Object.values(sc.options).flat()) {
      expect(text[o.reply], o.reply).toBeTruthy();
      expect(FACES[o.face], o.face).toBeDefined();
    }
    for (const id of sc.turns.flat()) expect(text[id], id).toBeTruthy();
  });

  it('every end has a cost line', () => {
    const endKeys = new Set(Object.values(sc.options).flat().flatMap(o => o.end ? [o.end] : []));
    expect(new Set(ends.map(s => s.end))).toEqual(endKeys);
    for (const end of endKeys) expect(text[sc.review.cost[end]], end).toBeTruthy();
  });

  it('observe covers every path and nothing else', () => {
    const paths = ends.map(s => s.chosen.join('-')).sort();
    expect(Object.keys(sc.observe!).sort()).toEqual(paths);
    for (const state of ends) {
      const r = review(sc, state);
      expect(text[r.observe!], state.chosen.join('-')).toBeTruthy();
    }
  });

  it('the last move gives four cards and leaves end and cost alone', () => {
    for (const state of ends) {
      const cards = guessHand(sc, state);
      expect(cards).toHaveLength(4);
      expect(new Set(cards.map(c => c.id)).size).toBe(4);
      const short = sc.guessShortAfter?.includes(state.end!) ?? false;
      for (const c of cards) {
        const g = sc.guess!.find(x => x.id === c.id)!;
        expect(c.text).toBe(g.text);
        expect(text[c.text], c.text).toBeTruthy();
        const after = takeGuess(sc, state, c.id);
        expect(after.end).toBe(state.end);
        expect(after.chosen).toEqual(state.chosen);
        expect(after.line).toBe(short ? g.short ?? g.reply : g.reply); // TREPPE 'stufe'
        expect(after.line).toBe(guessReply(sc, state.end!, g));
        expect(after.face).toBe(g.face);
        expect(guessHand(sc, after)).toEqual([]);
        const r = review(sc, after);
        expect(r.cost).toBe(review(sc, state).cost);
        expect(r.observe).toBe(review(sc, state).observe);
        expect(r.log.slice(-2)).toEqual([{ who: 'you', text: c.text }, { who: 'her', text: after.line }]);
      }
    }
    expect(guessHand(sc, newGame(sc, 1))).toEqual([]); // not before the end
  });

  it('every guess text exists, weights stay out of the texts', () => {
    expect(sc.guess).toHaveLength(4);
    for (const g of sc.guess!) {
      for (const id of [g.text, g.reply, ...(g.alt ? [g.alt] : []), ...(g.short ? [g.short] : [])]) expect(text[id], id).toBeTruthy();
      expect(FACES[g.face]).toBeDefined();
    }
  });

  it('shuffles the guess cards with the seed of the game', () => {
    expect(newGame(sc, 5).guesses).toEqual(newGame(sc, 5).guesses);
    const orders = new Set(Array.from({ length: 50 }, (_, i) => newGame(sc, i).guesses.join('')));
    expect(orders.size).toBeGreaterThan(1);
  });

  it('has the ui labels of a scene and a figure', () => {
    for (const id of ['ui.lastQuestion', 'ui.observe', 'ui.stage', 'ui.face']) expect(text[id], id).toBeTruthy();
    for (const f of Object.values(FACES)) expect(figure(f, sc.who)).not.toContain('undefined');
  });

  it.each(Object.entries(text))('%s has no blocked word and no digits', (_id, s) => {
    for (const w of blockDe) expect(s.toLowerCase()).not.toContain(w.toLowerCase());
    expect(s).not.toMatch(/\d/);
  });
});

it('day 1 has no guess cards', () => {
  expect(newGame(scene, 5).guesses).toEqual([]);
});

it('Dachboden: after the ends E and E.w Mira answers from the ladder with the short line', () => {
  const sc = dachbodenJson as Scene;
  for (const [ids, end] of [[['A', 'E'], 'E'], [['D', 'E'], 'E.w']] as const) {
    let s = newGame(sc, 1);
    for (const id of ids) s = choose(sc, s, id);
    expect(s.end).toBe(end);
    expect(guessHand(sc, s).map(c => c.text).sort()).toEqual(['guess.K1', 'guess.K2', 'guess.K3', 'guess.K4']);
    expect(sc.guess!.map(g => takeGuess(sc, s, g.id).line)).toEqual(['guess.K1.short', 'guess.K2.short', 'guess.K3.short', 'guess.K4.short']);
  }
  let s = newGame(sc, 1);
  for (const id of ['A', 'F', 'I']) s = choose(sc, s, id);
  expect(takeGuess(sc, s, 'K1').line).toBe('guess.K1.reply');
});
