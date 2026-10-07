// Visible text rules for both languages: every id exists, no blocked words, no digits except the clock time.
import { describe, expect, it } from 'vitest';
import sceneJson from '../../content/tag1.json';
import de from '../../content/de/tag1.json';
import en from '../../content/en/tag1.json';
import blockDe from '../../content/blocklist.json';
import blockEn from '../../content/blocklist-en.json';
import type { Scene } from './game';

const scene = sceneJson as Scene;

// Every text id the scene refers to.
const sceneIds = [
  scene.lage, scene.opening.line, ...scene.turns.flat(),
  ...Object.values(scene.options).flat().flatMap(o => [o.reply, ...(o.note ? [o.note] : [])]),
  scene.review.inner, ...Object.values(scene.review.cost),
];

const LANGS = [
  { lang: 'de', text: de as Record<string, string>, block: blockDe, clock: '16:50' },
  { lang: 'en', text: en as Record<string, string>, block: blockEn, clock: '4:50' },
];

describe.each(LANGS)('$lang', ({ text, block, clock }) => {
  it('has the same ids as de', () => {
    expect(Object.keys(text).sort()).toEqual(Object.keys(de).sort());
  });

  it('has every id the scene uses', () => {
    for (const id of sceneIds) expect(text[id], id).toBeTruthy();
  });

  it.each(Object.entries(text))('%s has no blocked word and no digits', (_id, s) => {
    for (const w of block) expect(s.toLowerCase()).not.toContain(w.toLowerCase());
    expect(s.split(clock).join('')).not.toMatch(/\d/);
    expect(s.trim()).not.toBe('');
  });
});
