/* packages/qa/src/perf/bci.ts — REQ-QUAL-36 Blur Cost Index (QUAL PRD §4.6), the implementation behind `perf.bci` (S-40).

   BCI = Σ over visible elements whose computed backdrop-filter ≠ none (the element itself and its ::before)
         of (visibleArea / viewportArea) × (blurPx / 20)

   - visibleArea is the layer box clipped to the viewport; a layer with no visible area contributes nothing.
   - blurPx is the sum of the `blur(<px>)` radii in the backdrop-filter chain plus, for `url(#id)` references that resolve to an
     SVG <filter> (the enhanced `ag-lens-*` defs), the largest feGaussianBlur stdDeviation in that filter (CSS blur(r) is a
     Gaussian with standard deviation r, so the two are on the same scale).
   - A full-viewport 20 px surface is 1.0; a full-viewport 12 px scrim is 0.6. The value is never capped.

   Effective nesting of a blurred layer = the number of its ancestors whose ::before computed backdrop-filter ≠ none
   (the AuraGlass 5 material paints its backdrop on ::before, so a host is never a backdrop root).

   `collectBlurLayers` is self-contained (no references to module scope) so it can be passed straight to Playwright's
   `page.evaluate`. Outside a browser it accepts an injected environment (`BlurEnv`) for unit tests. */

export const BCI_REFERENCE_BLUR_PX = 20;

export interface LayerRect { x: number; y: number; width: number; height: number }
export interface BlurLayer {
  /** 'element' = the element's own backdrop-filter; 'before' = its ::before pseudo-element */
  kind: 'element' | 'before';
  /** stable index of the host element in document order (several layers may share one host) */
  host: number;
  tag: string;
  part: string | null;
  rect: LayerRect;
  backdropFilter: string;
  blurPx: number;
  nesting: number;
}
export interface BlurLayerSnapshot {
  viewport: { width: number; height: number };
  layers: BlurLayer[];
  /** distinct url(#id) references (filter / backdrop-filter, incl. ::before) that resolve to an SVG <filter> on a visible box */
  activeSvgFilters: number;
}
export interface BlurCost {
  bci: number;
  blurredSurfaces: number;
  maxBlurPx: number;
  maxEffectiveNesting: number;
  activeSvgFilters: number;
}

/** Injected environment for non-browser callers (jsdom has no layout engine and no pseudo-element styles). */
export interface BlurEnv {
  document: Document;
  viewport: { width: number; height: number };
  style(el: Element, pseudo: '::before' | null): Pick<CSSStyleDeclaration, 'backdropFilter' | 'filter' | 'content' | 'position'
    | 'visibility' | 'opacity' | 'display' | 'left' | 'top' | 'width' | 'height' | 'borderLeftWidth' | 'borderTopWidth'>
    & { webkitBackdropFilter?: string };
  rect(el: Element): LayerRect;
}

/** Visible area of `rect` inside the viewport, in px². */
export function clippedArea(rect: LayerRect, viewport: { width: number; height: number }): number {
  const w = Math.min(rect.x + rect.width, viewport.width) - Math.max(rect.x, 0);
  const h = Math.min(rect.y + rect.height, viewport.height) - Math.max(rect.y, 0);
  return w > 0 && h > 0 ? w * h : 0;
}

/** Sum of blur(<n>px) radii in a CSS filter chain; `resolveUrl(id)` returns the blur radius of a referenced SVG filter. */
export function blurRadiusPx(filterValue: string | null | undefined, resolveUrl?: (id: string) => number): number {
  if (!filterValue || filterValue === 'none') return 0;
  let px = 0;
  const blurRe = /blur\(\s*(-?[\d.]+)(px)?\s*\)/g;
  for (let m = blurRe.exec(filterValue); m; m = blurRe.exec(filterValue)) px += Math.max(0, Number.parseFloat(m[1] ?? '0'));
  if (resolveUrl) {
    const urlRe = /url\(\s*["']?[^"')#]*#([^"')\s]+)["']?\s*\)/g;
    for (let m = urlRe.exec(filterValue); m; m = urlRe.exec(filterValue)) px += resolveUrl(m[1] ?? '');
  }
  return px;
}

/** BCI over a layer snapshot (§4.6). Uncapped. */
export function computeBci(layers: readonly Pick<BlurLayer, 'rect' | 'blurPx'>[], viewport: { width: number; height: number }): number {
  const vpArea = viewport.width * viewport.height;
  if (!(vpArea > 0)) throw new Error(`computeBci: viewport ${viewport.width}x${viewport.height} has no area`);
  let sum = 0;
  for (const l of layers) sum += (clippedArea(l.rect, viewport) / vpArea) * (l.blurPx / BCI_REFERENCE_BLUR_PX);
  return sum;
}

export function summarizeBlurCost(snapshot: BlurLayerSnapshot): BlurCost {
  const visible = snapshot.layers.filter((l) => clippedArea(l.rect, snapshot.viewport) > 0);
  const hosts = new Set(visible.map((l) => l.host));
  return {
    bci: computeBci(visible, snapshot.viewport),
    blurredSurfaces: hosts.size,
    maxBlurPx: visible.reduce((m, l) => Math.max(m, l.blurPx), 0),
    maxEffectiveNesting: visible.reduce((m, l) => Math.max(m, l.nesting), 0),
    activeSvgFilters: snapshot.activeSvgFilters,
  };
}

/** Page-side collector. Self-contained: Playwright serialises it with Function.prototype.toString. */
export function collectBlurLayers(env?: BlurEnv): BlurLayerSnapshot {
  const doc: Document = env ? env.document : document;
  const viewport = env ? env.viewport : { width: window.innerWidth, height: window.innerHeight };
  const styleOf = env
    ? env.style
    : (el: Element, pseudo: '::before' | null) => getComputedStyle(el, pseudo) as ReturnType<BlurEnv['style']>;
  const rectOf = env
    ? env.rect
    : (el: Element) => { const r = el.getBoundingClientRect(); return { x: r.left, y: r.top, width: r.width, height: r.height }; };

  const backdropOf = (s: ReturnType<BlurEnv['style']>): string => {
    const v = s.backdropFilter || s.webkitBackdropFilter || 'none';
    return v === '' ? 'none' : v;
  };
  const svgBlur = (id: string): number => {
    const f = doc.getElementById(id);
    if (!f || f.tagName.toLowerCase() !== 'filter') return 0;
    let max = 0;
    for (const g of Array.from(f.querySelectorAll('feGaussianBlur'))) {
      const parts = (g.getAttribute('stdDeviation') ?? '0').trim().split(/[\s,]+/).map(Number);
      for (const p of parts) if (Number.isFinite(p) && p > max) max = p;
    }
    return max;
  };
  const blurOf = (value: string): number => {
    if (!value || value === 'none') return 0;
    let px = 0;
    const blurRe = /blur\(\s*(-?[\d.]+)(px)?\s*\)/g;
    for (let m = blurRe.exec(value); m; m = blurRe.exec(value)) px += Math.max(0, Number.parseFloat(m[1] ?? '0'));
    const urlRe = /url\(\s*["']?[^"')#]*#([^"')\s]+)["']?\s*\)/g;
    for (let m = urlRe.exec(value); m; m = urlRe.exec(value)) px += svgBlur(m[1] ?? '');
    return px;
  };
  const svgIds = (value: string, into: Set<string>) => {
    if (!value || value === 'none') return;
    const urlRe = /url\(\s*["']?[^"')#]*#([^"')\s]+)["']?\s*\)/g;
    for (let m = urlRe.exec(value); m; m = urlRe.exec(value)) {
      const f = doc.getElementById(m[1] ?? '');
      if (f && f.tagName.toLowerCase() === 'filter') into.add(m[1] ?? '');
    }
  };
  const area = (r: LayerRect) => {
    const w = Math.min(r.x + r.width, viewport.width) - Math.max(r.x, 0);
    const h = Math.min(r.y + r.height, viewport.height) - Math.max(r.y, 0);
    return w > 0 && h > 0 ? w * h : 0;
  };
  const px = (v: string | undefined) => { const n = Number.parseFloat(v ?? ''); return Number.isFinite(n) ? n : null; };
  /* ::before box: an absolutely positioned pseudo whose host is its containing block resolves to px offsets/sizes;
     otherwise (inset: 0 material layers, static pseudos) it is measured by the host box. */
  const beforeRect = (hostStyle: ReturnType<BlurEnv['style']>, s: ReturnType<BlurEnv['style']>, hr: LayerRect): LayerRect => {
    if ((s.position === 'absolute') && hostStyle.position !== 'static') {
      const l = px(s.left); const t = px(s.top); const w = px(s.width); const h = px(s.height);
      if (l !== null && t !== null && w !== null && h !== null) {
        return { x: hr.x + (px(hostStyle.borderLeftWidth) ?? 0) + l, y: hr.y + (px(hostStyle.borderTopWidth) ?? 0) + t, width: w, height: h };
      }
    }
    return hr;
  };

  const all = Array.from(doc.querySelectorAll('*'));
  const hidden = new Set<Element>();
  const beforeBlurred = new Set<Element>();
  const layers: BlurLayer[] = [];
  const filters = new Set<string>();
  all.forEach((el, index) => {
    const s = styleOf(el, null);
    const parent = el.parentElement;
    if (s.display === 'none' || (parent && hidden.has(parent)) || Number.parseFloat(String(s.opacity)) === 0) { hidden.add(el); return; }
    if (s.visibility === 'hidden' || s.visibility === 'collapse') return;
    const ownBackdrop = backdropOf(s);
    const b = styleOf(el, '::before');
    const hasBefore = !!b.content && b.content !== 'none' && b.content !== 'normal' && b.display !== 'none';
    const beforeBackdrop = hasBefore ? backdropOf(b) : 'none';
    if (beforeBackdrop !== 'none') beforeBlurred.add(el);
    if (ownBackdrop === 'none' && beforeBackdrop === 'none' && (!s.filter || s.filter === 'none') && (!hasBefore || !b.filter || b.filter === 'none')) return;
    const rect = rectOf(el);
    let nesting = 0;
    for (let a = el.parentElement; a; a = a.parentElement) if (beforeBlurred.has(a)) nesting++;
    const tag = el.tagName.toLowerCase();
    const part = el.getAttribute('data-ag-part');
    if (ownBackdrop !== 'none') {
      layers.push({ kind: 'element', host: index, tag, part, rect, backdropFilter: ownBackdrop, blurPx: blurOf(ownBackdrop), nesting });
      if (area(rect) > 0) svgIds(ownBackdrop, filters);
    }
    if (area(rect) > 0) svgIds(s.filter, filters);
    if (hasBefore) {
      const br = beforeRect(s, b, rect);
      if (beforeBackdrop !== 'none') {
        layers.push({ kind: 'before', host: index, tag, part, rect: br, backdropFilter: beforeBackdrop, blurPx: blurOf(beforeBackdrop), nesting });
        if (area(br) > 0) svgIds(beforeBackdrop, filters);
      }
      if (area(br) > 0) svgIds(b.filter, filters);
    }
  });
  return { viewport, layers, activeSvgFilters: filters.size };
}

/** Structural type of the Playwright page we need (keeps @playwright/test out of this module's runtime). */
export interface EvaluatingPage { evaluate<R>(fn: () => R): Promise<R> }

export async function blurCost(page: EvaluatingPage): Promise<BlurCost> {
  return summarizeBlurCost(await page.evaluate(collectBlurLayers as () => BlurLayerSnapshot));
}

/** `perf.bci` (S-40 PerfProbe.bci): the uncapped Blur Cost Index of the current page. */
export async function bci(page: EvaluatingPage): Promise<number> {
  return (await blurCost(page)).bci;
}
