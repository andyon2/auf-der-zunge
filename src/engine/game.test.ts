import { describe, expect, it } from 'vitest';
import sceneJson from '../../content/tag1.json';
import de from '../../content/de/tag1.json';
import { choose, hand, newGame, review, type GameState, type Scene } from './game';
import { mulberry32, seedFromDate, shuffle } from './rng';
import { FACES } from './faces';

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
      for (const id of [r.inner, r.cost, ...r.log.map(e => e.text), ...(state.note ? [state.note] : [])]) {
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
