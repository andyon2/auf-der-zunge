import indexHtml from '../../index.html?raw';
import { describe, expect, it } from 'vitest';
import { day2Line } from './app';

describe('start sentence of day 2', () => {
  it('names Kessler after the day 1 ends E and G', () => {
    expect(day2Line('E')).toBe('ui.day2.kessler');
    expect(day2Line('G')).toBe('ui.day2.kessler');
  });
  it('is the plain sentence after the other ends', () => {
    for (const end of ['D', 'H', 'I']) expect(day2Line(end)).toBe('ui.day2');
  });
  it('is the plain sentence when nothing or something unknown is stored', () => {
    expect(day2Line(null)).toBe('ui.day2');
    expect(day2Line('')).toBe('ui.day2');
    expect(day2Line('X')).toBe('ui.day2');
  });
});

// The inline script in index.html picks the language; run it against stubs (no DOM in the test environment).
function pickedLang(stored: string | null, browser: string[]): string {
  const script = indexHtml.match(/<script>([\s\S]*?)<\/script>/)![1];
  const doc = { documentElement: { lang: '' }, title: '' };
  const storage = { getItem: () => stored };
  new Function('document', 'localStorage', 'navigator', script)(doc, storage, { languages: browser, language: browser[0] });
  return doc.documentElement.lang;
}

describe('start language', () => {
  it('is German without a stored choice, whatever the browser says', () => {
    for (const browser of [['en-US'], ['fr-FR', 'en'], ['de-DE'], []]) expect(pickedLang(null, browser)).toBe('de');
  });
  it('is the stored choice when there is one', () => {
    expect(pickedLang('en', ['de-DE'])).toBe('en');
    expect(pickedLang('de', ['en-US'])).toBe('de');
  });
  it('ignores a stored value that is not a language', () => {
    expect(pickedLang('fr', ['en-US'])).toBe('de');
  });
});
