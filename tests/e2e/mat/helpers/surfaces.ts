/* MAT-282: shared helpers for the MAT e2e specs — surface enumeration,
   computed-style reads incl. pseudo-elements, and the remote-visible
   backdrop-filter counter (host + ::before + ::after, non-none, area > 0,
   visible). */
import type { Page } from '@playwright/test';

export interface SurfaceRef {
  index: number;
  surface: string; // data-ag-surface value or ''
  part: string | null;
  box: { x: number; y: number; width: number; height: number };
}

/** All [data-ag-surface] elements on the page, with boxes. */
export async function listSurfaces(page: Page): Promise<SurfaceRef[]> {
  return page.evaluate(() => {
    const out: Array<{
      index: number; surface: string; part: string | null;
      box: { x: number; y: number; width: number; height: number };
    }> = [];
    document.querySelectorAll('[data-ag-surface]').forEach((el, index) => {
      const r = (el as HTMLElement).getBoundingClientRect();
      out.push({
        index,
        surface: el.getAttribute('data-ag-surface') ?? '',
        part: el.getAttribute('data-ag-part'),
        box: { x: r.x, y: r.y, width: r.width, height: r.height },
      });
    });
    return out;
  });
}

/** getComputedStyle for an element (or its ::before/::after via pseudo arg). */
export async function computed(
  page: Page,
  sel: string,
  pseudo?: '::before' | '::after',
): Promise<Record<string, string>> {
  return page.evaluate(([s, p]) => {
    const el = document.querySelector(s);
    if (!el) return {};
    const cs = getComputedStyle(el, p ?? null);
    const out: Record<string, string> = {};
    for (const k of [
      'backdropFilter', '-webkit-backdrop-filter', 'filter', 'backgroundImage',
      'backgroundColor', 'color', 'opacity', 'outlineStyle', 'outlineWidth',
      'outlineColor', 'boxShadow', 'forcedColorAdjust', 'display', 'visibility',
      'overflow', 'scrollPaddingTop', 'scrollPaddingBottom',
    ]) {
      const v = cs.getPropertyValue(k.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase()));
      if (v) out[k] = v;
    }
    return out;
  }, [sel, pseudo ?? null] as const);
}

/** Count of surfaces with a VISIBLE backdrop-filter on host/::before/::after —
 *  area > 0 and not display:none/visibility:hidden. Run-2 remote method: reads
 *  computed styles in the engine, which is the only honest measure. */
export async function countVisibleBackdropFilters(page: Page): Promise<number> {
  return page.evaluate(() => {
    const visible = (el: Element, pseudo: string | null) => {
      const cs = getComputedStyle(el, pseudo);
      if (cs.display === 'none' || cs.visibility === 'hidden' || cs.visibility === 'collapse') return false;
      const bf = cs.backdropFilter || cs.getPropertyValue('-webkit-backdrop-filter');
      if (!bf || bf === 'none') return false;
      const r = (el as HTMLElement).getBoundingClientRect();
      if (pseudo !== null) {
        const w = parseFloat(cs.width), h = parseFloat(cs.height);
        return (w > 0 || r.width > 0) && (h > 0 || r.height > 0);
      }
      return r.width > 0 && r.height > 0;
    };
    let n = 0;
    document.querySelectorAll('[data-ag-surface], [data-ag-layer="scrim"]').forEach((el) => {
      for (const p of [null, '::before', '::after']) {
        if (visible(el, p)) { n += 1; return; }
      }
    });
    return n;
  });
}

/** Rung read: effective background alpha + whether filters are cleared. */
export async function surfaceRung(page: Page, index: number): Promise<{
  alpha: number; filtersCleared: boolean; backgroundImage: string; onSurface: string;
}> {
  return page.evaluate((i) => {
    const el = document.querySelectorAll('[data-ag-surface]')[i] as HTMLElement | undefined;
    if (!el) return { alpha: NaN, filtersCleared: false, backgroundImage: '', onSurface: '' };
    const cs = getComputedStyle(el);
    const bf = cs.backdropFilter || cs.getPropertyValue('-webkit-backdrop-filter');
    const csb = getComputedStyle(el, '::before');
    const bfb = csb.backdropFilter || csb.getPropertyValue('-webkit-backdrop-filter');
    const rgba = /rgba?\([^)]+\)/.exec(cs.backgroundColor)?.[0] ?? '';
    const a = /, ?([\d.]+)\)/.exec(rgba)?.[1];
    return {
      alpha: a === undefined ? (rgba.startsWith('rgba') ? NaN : 1) : Number(a),
      filtersCleared: (!bf || bf === 'none') && (!bfb || bfb === 'none'),
      backgroundImage: cs.backgroundImage,
      onSurface: cs.getPropertyValue('--ag-on-surface') || cs.color,
    };
  }, index);
}
