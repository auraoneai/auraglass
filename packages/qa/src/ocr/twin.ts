/* REQ-QUAL-13 OCR text contrast — the text-hidden twin (QUAL, FIN-430).
   The twin is the same page with every text glyph made transparent (`color: transparent`, plus the properties that
   would otherwise still paint glyphs: -webkit-text-fill-color, text-shadow, text-decoration, caret and placeholder),
   leaving layout and every non-text paint untouched. The lane captures the cell, injects TWIN_CSS, captures again,
   removes it. `collectTextRuns` (in-page, self-contained) lists the subject's visible text runs with font metrics for
   the large-text rule and the "≥1 visible text node" check. */
import type { TextRun } from './contrast';

export const twinCss = (root: string): string => `
${root} *, ${root} *::before, ${root} *::after, ${root}, [data-ag-portal-root] *, [data-ag-layer-root] * {
  color: transparent !important; -webkit-text-fill-color: transparent !important; text-shadow: none !important;
  text-decoration-color: transparent !important; caret-color: transparent !important;
}
${root} *::placeholder, [data-ag-portal-root] *::placeholder, [data-ag-layer-root] *::placeholder { color: transparent !important; }`;

/** In-page: visible, non-empty text runs under `rootSelector` and the portal/layer roots. CSS px, viewport-relative. */
export function collectTextRuns(rootSelector: string): TextRun[] {
  const roots = [document.querySelector(rootSelector), ...document.querySelectorAll('[data-ag-portal-root], [data-ag-layer-root]')].filter((r): r is Element => !!r);
  const out: TextRun[] = [];
  const hidden = (el: Element | null): boolean => {
    for (let e = el; e && e !== document.documentElement; e = e.parentElement) {
      const cs = getComputedStyle(e);
      if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) <= 0.01 || e.hasAttribute('hidden')) return true;
    }
    return false;
  };
  const srOnly = (el: Element): boolean => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return r.width <= 1 && r.height <= 1 && (cs.position === 'absolute' || cs.position === 'fixed');
  };
  const seen = new Set<Node>();
  for (const root of roots) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      if (seen.has(n)) continue;
      seen.add(n);
      const text = (n.textContent ?? '').trim();
      const el = n.parentElement;
      if (!text || !el || hidden(el) || srOnly(el)) continue;
      if (getComputedStyle(el).color === 'rgba(0, 0, 0, 0)') continue; // intentionally invisible text
      const range = document.createRange();
      range.selectNodeContents(n);
      const cs = getComputedStyle(el);
      for (const r of range.getClientRects()) {
        if (r.width < 1 || r.height < 1 || r.right <= 0 || r.bottom <= 0 || r.left >= innerWidth || r.top >= innerHeight) continue;
        out.push({ rect: { x: r.left, y: r.top, w: r.width, h: r.height }, fontSizePx: parseFloat(cs.fontSize), fontWeight: Number(cs.fontWeight) || 400, text: text.slice(0, 80) });
      }
    }
    // text inside form controls (value/placeholder) is not a text node
    for (const el of root.querySelectorAll('input:not([type=hidden]):not([type=range]):not([type=checkbox]):not([type=radio]), textarea')) {
      const c = el as HTMLInputElement;
      const text = (c.value || c.placeholder || '').trim();
      if (!text || hidden(c)) continue;
      const r = c.getBoundingClientRect();
      const cs = getComputedStyle(c);
      out.push({ rect: { x: r.left, y: r.top, w: r.width, h: r.height }, fontSizePx: parseFloat(cs.fontSize), fontWeight: Number(cs.fontWeight) || 400, text: text.slice(0, 80) });
    }
  }
  return out;
}
