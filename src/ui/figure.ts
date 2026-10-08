// Parametric SVG figure, ported from arbeit/06-mockups (figur()).
// Frame 240 x 232, line drawing. Looks of Frau Brandt (day 1) and Jule (day 2) as in the mockup;
// season 1: Mira (big sister, younger than Brandt), Frau Albers (about sixty), the mother (older, white hair in a bun).
import type { FaceParams } from '../engine/faces';
import type { Scene } from '../engine/game';

export type Who = Scene['who'];

type Look = {
  skin: string; hair: string; cloth: string; glasses: boolean; wear: 'blazer' | 'hoodie' | 'cardigan' | 'collar'; phone: boolean;
  hairBack: string; hairFront: string;
  hairLine?: boolean; // outline the hair (light hair on the light room)
  age?: 0 | 1 | 2;    // lines in the face: 1 = around the mouth, 2 = also forehead and eyes
};

const LOOKS: Record<Who, Look> = {
  brandt: {
    skin: 'var(--skin-a)', hair: 'var(--hair-a)', cloth: 'var(--cloth-a)', glasses: true, wear: 'blazer', phone: false,
    hairBack: 'M60 92 C58 52 80 34 100 34 C122 34 142 52 140 92 L141 116 Q120 122 116 112 L84 112 Q80 122 59 116 Z',
    hairFront: 'M66 84 C64 52 84 38 102 38 C122 38 136 52 134 80 C124 66 108 58 92 62 C82 66 72 74 66 84 Z',
  },
  jule: {
    skin: 'var(--skin-b)', hair: 'var(--hair-b)', cloth: 'var(--cloth-b)', glasses: false, wear: 'hoodie', phone: true,
    hairBack: 'M60 100 C54 56 76 32 100 32 C124 32 146 56 140 100 C140 128 146 146 152 160 L48 160 C54 146 60 128 60 100 Z',
    hairFront: 'M66 84 C66 56 82 40 100 40 C114 40 126 48 132 62 C118 62 104 56 97 48 C90 62 78 72 66 82 Z',
  },
  // brown bob to the chin with a straight fringe, sweater
  mira: {
    skin: 'var(--skin-c)', hair: 'var(--hair-c)', cloth: 'var(--cloth-c)', glasses: false, wear: 'hoodie', phone: false,
    hairBack: 'M58 96 C54 54 78 34 100 34 C122 34 146 54 142 96 L144 130 Q128 136 118 126 L82 126 Q72 136 56 130 Z',
    hairFront: 'M66 82 C64 50 84 38 100 38 C116 38 136 50 134 82 C132 72 128 66 122 64 L78 64 C72 66 68 72 66 82 Z',
  },
  // short ash-blond hair with a side parting, glasses, cardigan
  albers: {
    skin: 'var(--skin-d)', hair: 'var(--hair-d)', cloth: 'var(--cloth-d)', glasses: true, wear: 'cardigan', phone: false, age: 1,
    hairBack: 'M62 90 C58 50 80 34 100 34 C120 34 142 50 138 90 L136 100 L64 100 Z',
    hairFront: 'M66 82 C62 52 82 36 100 36 C120 36 138 52 134 82 C130 66 120 56 106 54 C94 56 80 64 66 82 Z',
  },
  // white hair combed back into a bun, blouse collar
  mutter: {
    skin: 'var(--skin-e)', hair: 'var(--hair-e)', cloth: 'var(--cloth-e)', glasses: false, wear: 'collar', phone: false, age: 2, hairLine: true,
    hairBack: 'M62 90 C58 52 80 36 100 36 C120 36 142 52 138 90 L136 104 L64 104 Z M84 40 C80 18 120 18 116 40 Z',
    hairFront: 'M66 80 C64 52 84 40 100 40 C116 40 136 52 134 80 C126 62 112 54 100 54 C88 54 74 62 66 80 Z',
  },
};

// The neckline per kind of clothing, from the shoulder line y0.
function wear(kind: Look['wear'], y0: number): string {
  if (kind === 'blazer') return `<path class="f-ln" d="M102 ${y0 - 3} L120 ${y0 + 30} L138 ${y0 - 3}"/><path class="f-fine" d="M94 ${y0} L112 ${y0 + 44} L104 ${y0 + 52} M146 ${y0} L128 ${y0 + 44} L136 ${y0 + 52}"/>`;
  if (kind === 'cardigan') return `<path class="f-ln" d="M100 ${y0 - 3} L120 ${y0 + 34} L140 ${y0 - 3}"/><path class="f-fine" d="M120 ${y0 + 34} V234"/>`
    + `<circle class="f-dot" cx="125" cy="${y0 + 46}" r="2"/><circle class="f-dot" cx="125" cy="${y0 + 62}" r="2"/>`;
  if (kind === 'collar') return `<path class="f-ln" d="M98 ${y0 - 3} L110 ${y0 + 14} L120 ${y0 + 4} L130 ${y0 + 14} L142 ${y0 - 3}"/><path class="f-fine" d="M120 ${y0 + 4} V${y0 + 40}"/>`;
  return `<path class="f-ln" d="M88 ${y0 - 2} Q120 ${y0 + 20} 152 ${y0 - 2}"/><path class="f-fine" d="M112 ${y0 + 10} L111 ${y0 + 36} M128 ${y0 + 10} L129 ${y0 + 36}"/>`;
}

export function figure(p: FaceParams, who: Who = 'brandt'): string {
  const k = LOOKS[who];
  const y0 = 168 - p.shoulders * 12; // shoulder line
  const X = (x: number) => x + 20, Y = (y: number) => y + 6; // head from 200 grid into 240 frame

  let s = '';
  // body
  const hairClass = k.hairLine ? ' class="f-fill"' : '';
  s += `<path${hairClass} d="${k.hairBack}" style="fill:${k.hair}" transform="translate(20 6) rotate(${p.tilt} 100 130)"/>`;
  s += `<path class="f-fill" style="fill:${k.cloth}" d="M2 234 C6 ${y0 + 18} 50 ${y0} 98 ${y0 - 4} L142 ${y0 - 4} C190 ${y0} 234 ${y0 + 18} 238 234 Z"/>`;
  s += `<path class="f-fill" style="fill:${k.skin}" d="M${X(89)} ${Y(116)} L${X(89)} ${y0 - 2} Q120 ${y0 + 6} ${X(111)} ${y0 - 2} L${X(111)} ${Y(116)}"/>`;
  s += wear(k.wear, y0);
  if (p.arms === 'down') {
    s += `<path class="f-fine" d="M40 ${y0 + 22} Q34 ${y0 + 44} 36 234 M200 ${y0 + 22} Q206 ${y0 + 44} 204 234"/>`;
  } else {
    // crossed arms sit high on the chest so they show above the desk edge (review S4)
    const a = y0 - 22;
    s += `<path class="f-fill" style="fill:${k.cloth}" d="M26 ${a + 34} Q120 ${a + 14} 214 ${a + 30} L216 ${a + 58} Q120 ${a + 42} 24 ${a + 62} Z"/>`;
    s += `<path class="f-fine" d="M44 ${a + 44} Q120 ${a + 28} 198 ${a + 40}"/>`;
    // with crossed arms Jule keeps the phone in her right hand, it sticks out above the hand
    if (k.phone) s += `<rect class="f-fill" x="200" y="${a + 10}" width="16" height="26" rx="3" transform="rotate(12 208 ${a + 23})" style="fill:var(--paper-3)"/>`;
    s += `<path class="f-fill" style="fill:${k.skin}" d="M196 ${a + 30} q12 -4 16 5 q-2 9 -14 9 Z"/><path class="f-fill" style="fill:${k.skin}" d="M44 ${a + 40} q-12 -2 -14 8 q4 8 14 6 Z"/>`;
  }
  // Jule holds her phone in both hands in front of her (STIL.md `phone`, as in bildfolge).
  if (k.phone && p.arms === 'down') {
    s += `<g transform="rotate(-8 120 ${y0 + 22})"><rect class="f-fill" x="102" y="${y0 + 10}" width="36" height="26" rx="4" style="fill:var(--paper-3)"/>`
      + `<path class="f-fill" style="fill:${k.skin}" d="M98 ${y0 + 38} q-3 -16 9 -18 l2 18 Z M142 ${y0 + 38} q3 -16 -9 -18 l-2 18 Z"/></g>`;
  }

  // head
  const eye = (x: number) => {
    const h = 4.4 * (1 - p.lid), px = x + p.gazeX * 2.6, py = 86 + p.gazeY * 2;
    return `<path class="f-eye" d="M${x - 7} 86 Q${x} ${86 - h - 2.5} ${x + 7} 86 Q${x} 89 ${x - 7} 86 Z"/>`
      + (h > 1.5 ? `<circle class="f-dot" cx="${px}" cy="${py}" r="2.3"/>` : '')
      + `<path class="f-ln" style="stroke-width:2.6" d="M${x - 7.5} 86 Q${x} ${86 - h - 3} ${x + 7.5} 86"/>`;
  };
  const kb = p.brow * 2.6, yb = 74;
  const brows = `<path class="f-ln" style="stroke-width:3" d="M78 ${yb - kb} Q86 ${yb - kb - 2.4} 93 ${yb + kb}"/>`
    + `<path class="f-ln" style="stroke-width:3" d="M107 ${yb + kb} Q114 ${yb - kb - 2.4} 122 ${yb - kb}"/>`;
  const mouth = `<path class="f-ln" d="M${100 - p.width / 2} ${114 - p.mouth * 1.5} Q100 ${114 + p.mouth * 8} ${100 + p.width / 2} ${114 - p.mouth * 1.5}"/>`;
  const age = (k.age ? `<path class="f-fine" d="M88 104 Q85 110 88 116 M112 104 Q115 110 112 116"/>` : '')
    + (k.age === 2 ? `<path class="f-fine" d="M82 64 Q100 60 118 64 M70 84 l-4 -2 M70 88 l-4 1 M130 84 l4 -2 M130 88 l4 1"/>` : '');
  const jaw = p.jaw ? `<path class="f-fine" d="M73 104 l3 6 M127 104 l-3 6"/>` : '';
  const glasses = `<g class="f-fine" style="stroke-width:1.7"><rect x="76" y="79" width="20" height="14" rx="6"/><rect x="104" y="79" width="20" height="14" rx="6"/><path d="M96 84 Q100 81 104 84 M76 84 L67 82 M124 84 L133 82"/></g>`;
  s += `<g transform="translate(20 ${6 + p.lean * 5}) rotate(${p.tilt} 100 130) scale(${1 + p.lean * 0.03})">`
    + `<path class="f-fill" style="fill:${k.skin}" d="M67 80 C59 77 58 96 68 98 M133 80 C141 77 142 96 132 98"/>`
    + `<path class="f-fill" style="fill:${k.skin}" d="M66 82 C66 52 82 40 100 40 C118 40 134 52 134 82 C134 106 122 126 100 128 C78 126 66 106 66 82 Z"/>`
    + `<path${hairClass} d="${k.hairFront}" style="fill:${k.hair}"/>`
    + brows + eye(86) + eye(114) + (k.glasses ? glasses : '')
    + `<path class="f-fine" d="M100 90 Q97.5 99 96 102 Q99 104.5 103 103"/>`
    + mouth + jaw + age + `</g>`;
  return s;
}
