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
