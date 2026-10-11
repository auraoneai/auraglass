/* REQ-QUAL-15 glass density (QUAL). Summed visible area of every element (and ::before) whose computed
   `backdrop-filter` ≠ none, each clipped to the viewport, divided by the viewport area, must be ≤ `density.max`.
   The element list is collected in-page by `collectBackdropRects` (serialised into the page by the lane). */
import type { Rect } from './raster';
import { gate, type GateResult } from './gate';

export interface BackdropRect extends Rect { selector: string; pseudo: '' | '::before'; filter: string }

export function density(rects: readonly BackdropRect[], viewport: { width: number; height: number }, t: { max: number }): GateResult {
  let sum = 0;
  for (const r of rects) {
    const w = Math.min(viewport.width, r.x + r.w) - Math.max(0, r.x);
    const h = Math.min(viewport.height, r.y + r.h) - Math.max(0, r.y);
    if (w > 0 && h > 0) sum += w * h;
  }
  const ratio = sum / (viewport.width * viewport.height);
  return gate('glass-density', ratio <= t.max, ratio, t.max,
    `${rects.length} backdrop-filter element(s) cover ${(ratio * 100).toFixed(1)} % of the viewport (≤${t.max * 100} % allowed)`);
}

/** In-page (pass by value to `page.evaluate`): visible elements and `::before` boxes with backdrop-filter ≠ none
    under `rootSelector` (whole document when null), in CSS px relative to the viewport. Self-contained: no closures. */
export function collectBackdropRects(rootSelector: string | null): BackdropRect[] {
  const root: ParentNode = rootSelector ? (document.querySelector(rootSelector) ?? document) : document;
  const out: BackdropRect[] = [];
  const bf = (cs: CSSStyleDeclaration): string => cs.getPropertyValue('backdrop-filter') || cs.getPropertyValue('-webkit-backdrop-filter') || 'none';
  const describe = (el: Element): string => {
    const attrs = [...el.attributes].filter((a) => a.name.startsWith('data-ag-')).map((a) => (a.value ? `[${a.name}="${a.value}"]` : `[${a.name}]`)).join('');
    return `${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ''}${attrs}`.slice(0, 200);
  };
  const all = rootSelector && root !== document ? [root as Element, ...(root as Element).querySelectorAll('*')] : [...document.querySelectorAll('*')];
  for (const el of all) {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    const r = el.getBoundingClientRect();
    if (r.width <= 0 || r.height <= 0) continue;
    const own = bf(cs);
    if (own !== 'none') out.push({ x: r.left, y: r.top, w: r.width, h: r.height, selector: describe(el), pseudo: '', filter: own });
    const before = getComputedStyle(el, '::before');
    const pb = bf(before);
    if (pb !== 'none' && before.content !== 'none') {
      // ::before boxes are not exposed; an absolutely positioned inset:0 pseudo (the material recipe) covers the host box
      out.push({ x: r.left, y: r.top, w: r.width, h: r.height, selector: describe(el), pseudo: '::before', filter: pb });
    }
  }
  return out;
}
