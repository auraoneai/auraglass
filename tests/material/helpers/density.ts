/* MAT-134 — density/typography read helpers: --ag-type-size-index is a
   token scale index (0..n), not a px value; spacing comes from the scale.
   See tests/helpers/spacing.ts precedent in the PRD notes. */
import type { Page } from 'playwright-core';

export interface DensityReading {
  typeSizeIndex: number;
  groupSpacingPx: number;
  radiusPx: number;
}

export async function readDensity(page: Page, selector = ':root'): Promise<DensityReading> {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel) ?? document.documentElement;
    const cs = getComputedStyle(el as Element);
    const num = (v: string) => Number.parseFloat(v) || 0;
    return {
      typeSizeIndex: num(cs.getPropertyValue('--ag-type-size-index')),
      groupSpacingPx: num(cs.getPropertyValue('--ag-group-spacing')),
      radiusPx: num(cs.getPropertyValue('--ag-radius-outer')),
    };
  }, selector);
}
