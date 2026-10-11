/* MAT-134 — jsdom/browser computed-style helpers for MAT Playwright specs.
   On jsdom these read inline stylesheets only — layout-dependent assertions
   run on the GitLab playwright lane. */
import type { Page } from 'playwright-core';

/** Resolved value of a private scalar/custom prop on an element. */
export async function computedVar(page: Page, selector: string, name: string): Promise<string> {
  return page.evaluate(
    ({ sel, prop }) => {
      const el = document.querySelector(sel);
      if (!el) return '';
      return getComputedStyle(el).getPropertyValue(prop).trim();
    },
    { sel: selector, prop: name },
  );
}

/** Computed border-radius of the ::before lens band on a surface. */
export async function computedPseudoVar(
  page: Page, selector: string, pseudo: '::before' | '::after', prop: string,
): Promise<string> {
  return page.evaluate(
    ({ sel, ps, prop }) => {
      const el = document.querySelector(sel);
      if (!el) return '';
      return (getComputedStyle(el, ps).getPropertyValue(prop) || '').trim();
    },
    { sel: selector, ps: pseudo, prop },
  );
}
