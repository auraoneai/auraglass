/* MAT-155 — density helpers: visible ::before backdrop filters intersecting
   the viewport, and live nesting depth. */
import type { Page } from 'playwright-core';

export interface DensityReading {
  /** elements whose computed ::before has a non-none backdrop-filter and which intersect the viewport */
  liveBackdropFilters: number;
  /** deepest live nesting depth across the page (allowNested trees) */
  maxLiveDepth: number;
}

export async function readDensity(page: Page, rootSelector = 'body'): Promise<DensityReading> {
  return page.evaluate((root) => {
    const scope = document.querySelector(root) ?? document.body;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let live = 0;
    let maxDepth = 0;
    const els = scope.querySelectorAll('.ag-surface');
    for (const el of els) {
      const r = el.getBoundingClientRect();
      const visible = r.width > 0 && r.height > 0 && r.bottom > 0 && r.right > 0 && r.top < vh && r.left < vw;
      if (!visible) continue;
      const bf = getComputedStyle(el, '::before').backdropFilter;
      if (bf && bf !== 'none') live += 1;
      const depth = (function liveDepthInDom(e: Element) {
        let d = 0; let c = e.parentElement;
        while (c) { if (c.classList.contains('ag-surface')) d += 1; c = c.parentElement; }
        return d;
      })(el);
      if (depth > maxDepth) maxDepth = depth;
    }
    return { liveBackdropFilters: live, maxLiveDepth: maxDepth };
  }, rootSelector);
}
