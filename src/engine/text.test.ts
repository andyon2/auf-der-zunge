// Visible text rules: no blocked words, no digits except "16:50".
import { expect, it } from 'vitest';
import de from '../../content/de/tag1.json';
import blocklist from '../../content/blocklist.json';

const texts = Object.entries(de as Record<string, string>);

it.each(texts)('%s has no blocked word and no digits', (_id, s) => {
  for (const w of blocklist) expect(s.toLowerCase()).not.toContain(w.toLowerCase());
  expect(s.replace(/16:50/g, '')).not.toMatch(/\d/);
  expect(s.trim()).not.toBe('');
});
