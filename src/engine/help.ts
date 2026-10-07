// Help page: which country's numbers to show, and how a number from content/help.json becomes tel: links.
export type Land = 'de' | 'at' | 'ch' | 'gb' | 'us' | 'ie' | 'intl';
export const LANDS: Land[] = ['de', 'at', 'ch', 'gb', 'us', 'ie', 'intl'];

const BY_REGION: Record<string, Land> = { DE: 'de', AT: 'at', CH: 'ch', GB: 'gb', US: 'us', IE: 'ie' };
const BY_ZONE: Record<string, Land> = {
  'Europe/Berlin': 'de', 'Europe/Vienna': 'at', 'Europe/Zurich': 'ch', 'Europe/London': 'gb', 'Europe/Dublin': 'ie',
};

// America/* means the US, except Canada and Mexico City (they get the international list).
const NOT_US = ['Toronto', 'Vancouver', 'Edmonton', 'Winnipeg', 'Halifax', 'St_Johns', 'Regina', 'Montreal', 'Moncton',
  'Whitehorse', 'Yellowknife', 'Iqaluit', 'Mexico_City'];

// Region of the first browser language (de-AT -> at); without a region the time zone; otherwise intl.
// ?land=xx (param) overrides, for tests.
export function detectLand(languages: readonly string[], timeZone: string | undefined, param: string | null): Land {
  if (param && (LANDS as string[]).includes(param)) return param as Land;
  let region: string | undefined;
  try { region = languages[0] ? new Intl.Locale(languages[0]).region : undefined; } catch { /* not a language tag */ }
  if (region) return BY_REGION[region.toUpperCase()] ?? 'intl';
  if (timeZone && BY_ZONE[timeZone]) return BY_ZONE[timeZone];
  if (timeZone?.startsWith('America/') && !NOT_US.includes(timeZone.slice(8))) return 'us';
  return 'intl';
}

// "0800 1110111 / 0800 1110222 / 116 123" -> three numbers; each keeps its text and gets the digits for tel:.
// Letters are dropped: "1-800-799-SAFE (7233)" -> 18007997233 (SAFE is 7233).
export function phoneLinks(number: string): { text: string; tel: string }[] {
  return number.split(' / ').map(text => ({ text: text.trim(), tel: text.replace(/\D/g, '') })).filter(n => n.tel);
}
