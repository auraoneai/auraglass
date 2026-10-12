/* tests/dx/lib/registry-probes.ts — REQ-PLAT-97. In-page probes for the
   registry render gate. Each function is passed to page.evaluate, so it is
   self-contained (no imports, no closure over module scope). Rects are CSS px. */

export interface ProbeRect { x: number; y: number; width: number; height: number }

/** Hide everything inside <body> (backdrop-only capture). */
export const HIDE_ALL_CSS = 'body * { visibility: hidden !important; }';

/** Landmarks present (visible) for each selector, and the visible h1 count. */
export function probeLandmarks(selectors: Record<string, string>): { found: Record<string, boolean>; h1: number } {
  const vis = (el: Element) => {
    const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none';
  };
  const found: Record<string, boolean> = {};
  for (const [name, sel] of Object.entries(selectors)) found[name] = [...document.querySelectorAll(sel)].some(vis);
  return { found, h1: [...document.querySelectorAll('h1, [role="heading"][aria-level="1"]')].filter(vis).length };
}

/** First visible match of each named selector. */
export function probeBoxes(boxes: Record<string, string>): Record<string, ProbeRect | null> {
  const out: Record<string, ProbeRect | null> = {};
  for (const [name, sel] of Object.entries(boxes)) {
    const el = [...document.querySelectorAll(sel)].find((e) => {
      const r = e.getBoundingClientRect(); const cs = getComputedStyle(e);
      return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none';
    });
    const r = el?.getBoundingClientRect();
    out[name] = r ? { x: r.x, y: r.y, width: r.width, height: r.height } : null;
  }
  return out;
}

/** Visible controls smaller than `min` (all controls) or `minPrimary` (primary controls; 0 = not checked). */
export function probeTouchTargets(a: { controls: string; primary: string; min: number; minPrimary: number }): string[] {
  const bad: string[] = [];
  for (const el of document.querySelectorAll(a.controls)) {
    const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
    if (!(r.width > 0 && r.height > 0) || cs.visibility === 'hidden' || cs.display === 'none') continue;
    if ((el as HTMLElement).closest('[inert], [aria-hidden="true"]')) continue;
    const need = a.minPrimary && el.matches(a.primary) ? a.minPrimary : a.min;
    if (r.width < need || r.height < need) bad.push(`${Math.round(r.width)}×${Math.round(r.height)} < ${need}: ${el.outerHTML.slice(0, 100)}`);
  }
  return bad;
}

/** Marks every visible, enabled tab stop with data-ag-tabstop="<i>"; returns their labels. */
export function markTabStops(selector: string): string[] {
  const out: string[] = [];
  for (const el of document.querySelectorAll('[data-ag-tabstop]')) el.removeAttribute('data-ag-tabstop');
  for (const el of document.querySelectorAll(selector)) {
    const h = el as HTMLElement;
    const r = h.getBoundingClientRect(); const cs = getComputedStyle(h);
    if (!(r.width > 0 && r.height > 0) || cs.visibility === 'hidden' || cs.display === 'none') continue;
    if (h.closest('[inert], [aria-hidden="true"], fieldset[disabled]')) continue;
    h.setAttribute('data-ag-tabstop', String(out.length));
    out.push(h.outerHTML.slice(0, 100));
  }
  (document.activeElement as HTMLElement | null)?.blur?.();
  return out;
}

export function activeTabStop(): number | null {
  let el: Element | null = document.activeElement;
  while (el && (el as HTMLElement).shadowRoot?.activeElement) el = (el as HTMLElement).shadowRoot!.activeElement;
  const v = el?.closest('[data-ag-tabstop]')?.getAttribute('data-ag-tabstop');
  return v == null ? null : Number(v);
}

/** Visible nodes with a live backdrop-filter (element or ::before/::after), clipped later to the viewport. */
export function probeBackdrops(): ProbeRect[] {
  const out: ProbeRect[] = [];
  const live = (cs: CSSStyleDeclaration) => {
    const v = cs.backdropFilter || (cs as unknown as { webkitBackdropFilter?: string }).webkitBackdropFilter || 'none';
    return v !== 'none' && v !== '';
  };
  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || Number(cs.opacity) === 0) continue;
    if (!(live(cs) || live(getComputedStyle(el, '::before')) || live(getComputedStyle(el, '::after')))) continue;
    const r = el.getBoundingClientRect();
    if (r.width > 0 && r.height > 0) out.push({ x: r.x, y: r.y, width: r.width, height: r.height });
  }
  return out;
}

/** Visible AuraGlass surfaces (regular/clear, not the content layer), marked with
    data-ag-qa-surface="<i>" and their surface-nesting depth. */
export function markSurfaces(): Array<{ index: number; depth: number; rect: ProbeRect; glass: boolean; label: string }> {
  for (const el of document.querySelectorAll('[data-ag-qa-surface]')) el.removeAttribute('data-ag-qa-surface');
  const out: Array<{ index: number; depth: number; rect: ProbeRect; glass: boolean; label: string }> = [];
  const vw = window.innerWidth, vh = window.innerHeight;
  for (const el of document.querySelectorAll('[data-ag-surface]')) {
    if (el.getAttribute('data-ag-layer') === 'content' || el.hasAttribute('data-ag-content')) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || Number(cs.opacity) === 0) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 4 || r.height < 4 || r.right <= 0 || r.bottom <= 0 || r.left >= vw || r.top >= vh) continue;
    let depth = 0;
    for (let p = el.parentElement; p; p = p.parentElement) if (p.hasAttribute('data-ag-surface') && p.getAttribute('data-ag-layer') !== 'content') depth++;
    const variant = el.getAttribute('data-ag-variant') ?? 'regular';
    el.setAttribute('data-ag-qa-surface', String(out.length));
    const part = el.getAttribute('data-ag-part');
    out.push({ index: out.length, depth, rect: { x: r.x, y: r.y, width: r.width, height: r.height }, glass: variant === 'regular' || variant === 'clear',
      label: `${el.tagName.toLowerCase()}[data-ag-variant="${variant}"]${part ? `[data-ag-part="${part}"]` : ''}` });
  }
  return out;
}

/** Visible text runs (one per element with direct text) and icon-only control glyphs. */
export function probeTextRuns(): Array<{ rect: ProbeRect; large: boolean; glyph: boolean; label: string }> {
  const out: Array<{ rect: ProbeRect; large: boolean; glyph: boolean; label: string }> = [];
  const vw = window.innerWidth, vh = window.innerHeight;
  const inView = (r: DOMRect) => r.width >= 2 && r.height >= 4 && r.right > 0 && r.bottom > 0 && r.left < vw && r.top < vh;
  const shown = (el: Element) => {
    const cs = getComputedStyle(el);
    return cs.visibility !== 'hidden' && cs.display !== 'none' && Number(cs.opacity) > 0 && !el.closest('[disabled], [aria-disabled="true"], [inert]');
  };
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const seen = new Set<Element>();
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const el = n.parentElement;
    if (!el || seen.has(el) || !(n.textContent ?? '').trim()) continue;
    if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE', 'OPTION'].includes(el.tagName) || !shown(el)) continue;
    seen.add(el);
    const range = document.createRange();
    range.selectNodeContents(n);
    const rects = [...range.getClientRects()].filter(inView);
    if (!rects.length) continue;
    const x0 = Math.min(...rects.map((r) => r.left)), y0 = Math.min(...rects.map((r) => r.top));
    const x1 = Math.max(...rects.map((r) => r.right)), y1 = Math.max(...rects.map((r) => r.bottom));
    const cs = getComputedStyle(el);
    const px = parseFloat(cs.fontSize); const bold = Number(cs.fontWeight) >= 700;
    out.push({ rect: { x: Math.max(0, x0), y: Math.max(0, y0), width: Math.min(vw, x1) - Math.max(0, x0), height: Math.min(vh, y1) - Math.max(0, y0) },
      large: px >= 24 || (bold && px >= 18.66), glyph: false, label: `${el.tagName.toLowerCase()} "${(n.textContent ?? '').trim().slice(0, 30)}"` });
  }
  for (const c of document.querySelectorAll('button, a[href], [role="button"]')) {
    if ((c.textContent ?? '').trim() || !shown(c)) continue;
    const svg = c.querySelector('svg');
    const r = svg?.getBoundingClientRect();
    if (svg && r && inView(r)) out.push({ rect: { x: r.x, y: r.y, width: r.width, height: r.height }, large: false, glyph: true, label: `glyph in ${c.getAttribute('aria-label') ?? c.tagName.toLowerCase()}` });
  }
  return out;
}

/** Init script: collect long tasks from document start. */
export function installLongTaskProbe(): void {
  const w = window as unknown as { __agLongTasks?: number[] };
  w.__agLongTasks = [];
  try {
    new PerformanceObserver((l) => { for (const e of l.getEntries()) w.__agLongTasks!.push(e.duration); }).observe({ type: 'longtask', buffered: true });
  } catch { /* longtask unsupported (WebKit): the gate only reads it in Chromium */ }
}
