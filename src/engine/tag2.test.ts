// Day 2, Jule: all 21 paths, echo and taking it back, the five test paths from skript-tag2.md.
import { describe, expect, it } from 'vitest';
import sceneJson from '../../content/tag2.json';
import de from '../../content/de/tag2.json';
import { choose, hand, newGame, review, type GameState, type Scene } from './game';

const scene = sceneJson as Scene;
const text = de as Record<string, string>;

// Every path through the hands, as option ids, with the state after each choice.
function allPaths(): { path: string[]; states: GameState[] }[] {
  const out: { path: string[]; states: GameState[] }[] = [];
  const walk = (state: GameState, path: string[], states: GameState[]) => {
    if (state.end) return out.push({ path, states });
    for (const id of hand(state)) {
      const next = choose(scene, state, id);
      walk(next, [...path, id], [...states, next]);
    }
  };
  walk(newGame(scene, 1), [], []);
  return out;
}

const byIds = (ids: string[]) => {
  const states: GameState[] = [];
  let s = newGame(scene, 3);
  for (const id of ids) states.push(s = choose(scene, s, id));
  return states;
};

describe('day 2, Jule', () => {
  const paths = allPaths();

  it('has the 21 paths and the five endings of the script', () => {
    expect(paths.length).toBe(21);
    expect(new Set(paths.map(p => p.states.at(-1)!.end))).toEqual(new Set(['D', 'G', 'H', 'I', 'R2']));
  });

  it('every path ends in a review whose text ids exist', () => {
    for (const { path, states } of paths) {
      const r = review(scene, states.at(-1)!);
      for (const id of [r.inner!, r.cost, ...r.log.map(e => e.text), ...(r.echo ? [r.echo, `${r.echo}.brick`] : [])]) {
        expect(text[id], `${path.join('>')}: ${id}`).toBeTruthy();
      }
      expect(r.log[0]).toEqual({ who: 'her', text: 'jule.open' });
    }
  });

  it('never sets an echo while one is standing', () => {
    for (const { path, states } of paths) {
      states.forEach((s, i) => {
        const before = i ? states[i - 1].echo : undefined;
        const outcome = scene.options[path[i]].find(o => o.reply === s.line)!;
        if (outcome.echo) expect(before, path.join('>')).toBeUndefined();
      });
    }
  });

  it('keeps the echo to the end on exactly the paths of the script table', () => {
    const withEcho = paths.filter(p => p.states.at(-1)!.echo).map(p => p.path.join('-')).sort();
    expect(withEcho).toEqual(['A-D', 'A-E-G', 'A-E-H', 'A-E-I', 'B-F-H', 'B-F-I', 'C-F-H', 'C-F-I']);
  });

  it('sets, keeps and takes back the echo', () => {
    expect(byIds(['A']).map(s => s.echo)).toEqual(['echo.A']);
    expect(byIds(['A', 'R1', 'I']).map(s => s.echo)).toEqual(['echo.A', undefined, undefined]);
    expect(byIds(['B', 'F', 'R2']).map(s => s.echo)).toEqual([undefined, 'echo.F', undefined]);
    expect(review(scene, byIds(['A', 'E', 'H']).at(-1)!).echo).toBe('echo.A');
    expect(review(scene, byIds(['B', 'F', 'R2']).at(-1)!).echo).toBeUndefined();
  });

  // skript-tag2.md, "Testpfade fuer Playwright"
  const TEST_PATHS: Record<string, { picks: string[]; echo: (string | null)[]; faces: string[]; end: string }> = {
    'A-R1-I': { picks: ['A', 'R1', 'I'], echo: ['echo.A', null, null], faces: ['closed', 'tense', 'opening'], end: 'I' },
    'A-E-H': { picks: ['A', 'E', 'H'], echo: ['echo.A', 'echo.A', 'echo.A'], faces: ['closed', 'hard', 'tenseAway'], end: 'H' },
    'B-F-R2': { picks: ['B', 'F', 'R2'], echo: [null, 'echo.F', null], faces: ['tense', 'closed', 'tense'], end: 'R2' },
    'C-E-G': { picks: ['C', 'E', 'G'], echo: [null, null, null], faces: ['opening', 'yielding', 'closed'], end: 'G' },
    'B-D': { picks: ['B', 'D'], echo: [null, null], faces: ['tense', 'tenseAway'], end: 'D' },
  };
  it.each(Object.entries(TEST_PATHS))('test path %s', (_name, t) => {
    const states = byIds(t.picks);
    expect(states.map(s => s.echo ?? null)).toEqual(t.echo);
    expect(states.map(s => s.face)).toEqual(t.faces);
    expect(states.at(-1)!.end).toBe(t.end);
  });

  it('answers by earlier choice as the script says', () => {
    const last = (ids: string[]) => byIds(ids).at(-1)!.line;
    expect(last(['A', 'E'])).toBe('E.reply.afterA');
    expect(last(['C', 'E'])).toBe('E.reply.afterC');
    expect(last(['B', 'E'])).toBe('E.reply');
    expect(last(['A', 'R1', 'I'])).toBe('I.reply.warm');
    expect(last(['A', 'E', 'I'])).toBe('I.reply.cool');
    expect(last(['B', 'F', 'I'])).toBe('I.reply.cool');
    expect(last(['C', 'E', 'I'])).toBe('I.reply.warm');
    expect(last(['B', 'F', 'H'])).toBe('H.reply.afterF');
    expect(last(['B', 'E', 'H'])).toBe('H.reply');
    expect(last(['A', 'D'])).toBe('D.reply');
  });
});
