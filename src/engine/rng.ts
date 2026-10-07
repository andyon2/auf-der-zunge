// mulberry32: small seeded PRNG, returns floats in [0, 1).
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Seed of the day: YYYYMMDD of the local date.
export function seedFromDate(d: Date): number {
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

export function shuffle<T>(items: readonly T[], rand: () => number): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// "Again" plays a new game: seed of the day plus a counter that starts again on each new day.
// stored is the saved "daySeed:n" (or null); returns the new seed and what to save.
export function nextRound(stored: string | null, daySeed: number): { seed: number; stored: string } {
  const [day, count] = (stored ?? '').split(':');
  const n = Number(day) === daySeed ? (Number(count) || 0) + 1 : 1;
  return { seed: daySeed + n, stored: `${daySeed}:${n}` };
}
