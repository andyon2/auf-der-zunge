// Visible text rules for both languages: every id exists, no blocked words, no digits except the clock time.
import { describe, expect, it } from 'vitest';
import sceneJson from '../../content/tag1.json';
import de from '../../content/de/tag1.json';
import en from '../../content/en/tag1.json';
import scene2Json from '../../content/tag2.json';
import de2 from '../../content/de/tag2.json';
import en2 from '../../content/en/tag2.json';
import blockDe from '../../content/blocklist.json';
import blockEn from '../../content/blocklist-en.json';
import type { Scene } from './game';

// Every text id a scene refers to.
const sceneIds = (scene: Scene) => [
  scene.lage, scene.opening.line, ...scene.turns.flat(),
  ...Object.values(scene.options).flat().flatMap(o => [o.reply, ...(o.note ? [o.note] : []), ...(o.echo ? [o.echo, `${o.echo}.brick`] : [])]),
  ...(scene.review.inner ? [scene.review.inner] : []), ...Object.values(scene.review.cost),
];

const DAYS = [
  { day: 1, scene: sceneJson as Scene, de: de as Record<string, string>, langs: { de, en } },
  { day: 2, scene: scene2Json as Scene, de: de2 as Record<string, string>, langs: { de: de2, en: en2 } },
];
const LANGS = DAYS.flatMap(d => [
  { lang: 'de', day: d.day, scene: d.scene, ids: d.de, text: d.langs.de as Record<string, string>, block: blockDe, clock: '16:50' },
  { lang: 'en', day: d.day, scene: d.scene, ids: d.de, text: d.langs.en as Record<string, string>, block: blockEn, clock: '4:50' },
]);

describe.each(LANGS)('$lang day $day', ({ scene, ids, text, block, clock }) => {
  it('has the same ids as de', () => {
    expect(Object.keys(text).sort()).toEqual(Object.keys(ids).sort());
  });

  it('has every id the scene uses', () => {
    for (const id of sceneIds(scene)) expect(text[id], id).toBeTruthy();
  });

  it('has each brick word inside its echo', () => {
    for (const id of Object.keys(text).filter(k => /^echo\.[^.]+$/.test(k))) expect(text[id]).toContain(text[`${id}.brick`]);
  });

  it.each(Object.entries(text))('%s has no blocked word and no digits', (_id, s) => {
    for (const w of block) expect(s.toLowerCase()).not.toContain(w.toLowerCase());
    expect(s.split(clock).join('')).not.toMatch(/\d/);
    expect(s.trim()).not.toBe('');
  });
});
