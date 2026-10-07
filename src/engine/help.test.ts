import { describe, expect, it } from 'vitest';
import help from '../../content/help.json';
import blockDe from '../../content/blocklist.json';
import { detectLand, LANDS, phoneLinks } from './help';

describe('detectLand', () => {
  it.each([
    ['de-AT', 'at'], ['en-GB', 'gb'], ['en-US', 'us'], ['en-IE', 'ie'],
    ['de-CH', 'ch'], ['fr-CH', 'ch'], ['it-CH', 'ch'], ['de-DE', 'de'],
    ['en-gb', 'gb'], ['zh-Hant-TW', 'intl'], ['fr-FR', 'intl'], ['de-LU', 'intl'],
  ])('region of %s -> %s', (tag, land) => {
    expect(detectLand([tag, 'de-DE'], 'Europe/Berlin', null)).toBe(land);
  });

  it('uses only the first language', () => {
    expect(detectLand(['fr-FR', 'de-AT'], 'Europe/Vienna', null)).toBe('intl');
  });

  it.each([
    ['Europe/Berlin', 'de'], ['Europe/Vienna', 'at'], ['Europe/Zurich', 'ch'], ['Europe/London', 'gb'],
    ['Europe/Dublin', 'ie'], ['America/New_York', 'us'], ['America/Los_Angeles', 'us'], ['America/Toronto', 'us'],
    ['Europe/Paris', 'intl'], ['Asia/Tokyo', 'intl'], ['UTC', 'intl'], [undefined, 'intl'],
  ])('without region, time zone %s -> %s', (zone, land) => {
    expect(detectLand(['de'], zone, null)).toBe(land);
    expect(detectLand([], zone, null)).toBe(land);
  });

  it('falls back to the time zone for a broken tag', () => {
    expect(detectLand(['not a tag!'], 'Europe/Vienna', null)).toBe('at');
  });

  it('lets ?land= override, but only with a known country', () => {
    expect(detectLand(['de-DE'], 'Europe/Berlin', 'us')).toBe('us');
    expect(detectLand(['de-DE'], 'Europe/Berlin', 'intl')).toBe('intl');
    expect(detectLand(['de-DE'], 'Europe/Berlin', 'fr')).toBe('de');
    expect(detectLand(['de-DE'], 'Europe/Berlin', '')).toBe('de');
  });
});

describe('phoneLinks', () => {
  it('splits alternatives and keeps only digits for tel:', () => {
    expect(phoneLinks('0800 1110111 / 0800 1110222 / 116 123').map(n => n.tel)).toEqual(['08001110111', '08001110222', '116123']);
    expect(phoneLinks('1-800-799-SAFE (7233)')).toEqual([{ text: '1-800-799-SAFE (7233)', tel: '18007997233' }]);
    expect(phoneLinks('0800/222 555')[0].tel).toBe('0800222555');
    expect(phoneLinks('999 / 112').map(n => n.tel)).toEqual(['999', '112']);
    expect(phoneLinks('')).toEqual([]);
  });
});

describe('content/help.json', () => {
  const data = help as Record<string, { name_de: string; name_en: string; number: string; url: string; hours: string; checked: string }[]>;
  it('has every country, each with entries', () => {
    expect(Object.keys(data).sort()).toEqual([...LANDS].sort());
    for (const land of LANDS) expect(data[land].length).toBeGreaterThan(0);
  });
  it.each(LANDS)('%s: every entry has names, a number or https link, a date, and hours without blocked words', land => {
    for (const e of data[land]) {
      expect(e.name_de && e.name_en).toBeTruthy();
      expect(phoneLinks(e.number).length > 0 || e.number === '').toBe(true);
      expect(e.url).toMatch(/^https:\/\//);
      expect(e.checked).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      for (const w of blockDe) expect(e.hours.toLowerCase()).not.toContain(w.toLowerCase());
    }
  });
});
