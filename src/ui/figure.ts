// Parametric SVG figure, ported from arbeit/06-mockups (figur()).
// Frame 240 x 232, line drawing. Only Frau Brandt exists on day 1, so only her look is kept.
import type { FaceParams } from '../engine/faces';

const LOOK = {
  skin: 'var(--skin-a)',
  hair: 'var(--hair-a)',
  cloth: 'var(--cloth-a)',
  hairBack: 'M60 92 C58 52 80 34 100 34 C122 34 142 52 140 92 L141 116 Q120 122 116 112 L84 112 Q80 122 59 116 Z',
  hairFront: 'M66 84 C64 52 84 38 102 38 C122 38 136 52 134 80 C124 66 108 58 92 62 C82 66 72 74 66 84 Z',
};

export function figure(p: FaceParams): string {
  const k = LOOK;
  const y0 = 168 - p.shoulders * 12; // shoulder line
  const X = (x: number) => x + 20, Y = (y: number) => y + 6; // head from 200 grid into 240 frame

  let s = '';
  // body
  s += `<path d="${k.hairBack}" style="fill:${k.hair}" transform="translate(20 6) rotate(${p.tilt} 100 130)"/>`;
  s += `<path class="f-fill" style="fill:${k.cloth}" d="M2 234 C6 ${y0 + 18} 50 ${y0} 98 ${y0 - 4} L142 ${y0 - 4} C190 ${y0} 234 ${y0 + 18} 238 234 Z"/>`;
  s += `<path class="f-fill" style="fill:${k.skin}" d="M${X(89)} ${Y(116)} L${X(89)} ${y0 - 2} Q120 ${y0 + 6} ${X(111)} ${y0 - 2} L${X(111)} ${Y(116)}"/>`;
  // blazer
  s += `<path class="f-ln" d="M102 ${y0 - 3} L120 ${y0 + 30} L138 ${y0 - 3}"/><path class="f-fine" d="M94 ${y0} L112 ${y0 + 44} L104 ${y0 + 52} M146 ${y0} L128 ${y0 + 44} L136 ${y0 + 52}"/>`;
  if (p.arms === 'down') {
    s += `<path class="f-fine" d="M40 ${y0 + 22} Q34 ${y0 + 44} 36 234 M200 ${y0 + 22} Q206 ${y0 + 44} 204 234"/>`;
  } else {
    // crossed arms sit high on the chest so they show above the desk edge (review S4)
    const a = y0 - 22;
    s += `<path class="f-fill" style="fill:${k.cloth}" d="M26 ${a + 34} Q120 ${a + 14} 214 ${a + 30} L216 ${a + 58} Q120 ${a + 42} 24 ${a + 62} Z"/>`;
    s += `<path class="f-fine" d="M44 ${a + 44} Q120 ${a + 28} 198 ${a + 40}"/>`;
    s += `<path class="f-fill" style="fill:${k.skin}" d="M196 ${a + 30} q12 -4 16 5 q-2 9 -14 9 Z"/><path class="f-fill" style="fill:${k.skin}" d="M44 ${a + 40} q-12 -2 -14 8 q4 8 14 6 Z"/>`;
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
  const jaw = p.jaw ? `<path class="f-fine" d="M73 104 l3 6 M127 104 l-3 6"/>` : '';
  const glasses = `<g class="f-fine" style="stroke-width:1.7"><rect x="76" y="79" width="20" height="14" rx="6"/><rect x="104" y="79" width="20" height="14" rx="6"/><path d="M96 84 Q100 81 104 84 M76 84 L67 82 M124 84 L133 82"/></g>`;
  s += `<g transform="translate(20 ${6 + p.lean * 5}) rotate(${p.tilt} 100 130) scale(${1 + p.lean * 0.03})">`
    + `<path class="f-fill" style="fill:${k.skin}" d="M67 80 C59 77 58 96 68 98 M133 80 C141 77 142 96 132 98"/>`
    + `<path class="f-fill" style="fill:${k.skin}" d="M66 82 C66 52 82 40 100 40 C118 40 134 52 134 82 C134 106 122 126 100 128 C78 126 66 106 66 82 Z"/>`
    + `<path d="${k.hairFront}" style="fill:${k.hair}"/>`
    + brows + eye(86) + eye(114) + glasses
    + `<path class="f-fine" d="M100 90 Q97.5 99 96 102 Q99 104.5 103 103"/>`
    + mouth + jaw + `</g>`;
  return s;
}
