/* REQ-CMP-111. Text type roles and Heading sizes in a real engine: each role's
   computed font-size / line-height / font-weight / letter-spacing equals the
   resolved value of its --ag-type-<role>-* quartet (public size, leading,
   weight; private --_ag-type-<role>-tracking), Text without `size` is not
   overridden by a size class, and caption differs from body. Values are
   resolved by applying each custom property to a probe element in the same
   document, so the fluid clamp() sizes are compared at the same viewport. */
import { test, expect, type Page } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';

type Quartet = { fontSize: string; lineHeight: string; fontWeight: string; letterSpacing: string };

/** Computed quartet of the first element matching `selector`. */
async function computed(page: Page, selector: string): Promise<Quartet> {
  return page.locator(selector).first().evaluate((el) => {
    const cs = getComputedStyle(el);
    return { fontSize: cs.fontSize, lineHeight: cs.lineHeight, fontWeight: cs.fontWeight, letterSpacing: cs.letterSpacing };
  });
}

/** The quartet a role's tokens resolve to, measured on a probe element that
    inherits the same context as `selector`'s parent. */
async function expected(page: Page, selector: string, role: string): Promise<Quartet> {
  return page.locator(selector).first().evaluate((el, r) => {
    const probe = document.createElement('span');
    probe.style.display = 'block';
    probe.style.fontSize = `var(--ag-type-${r}-size)`;
    probe.style.lineHeight = `var(--ag-type-${r}-leading)`;
    probe.style.fontWeight = `var(--ag-type-${r}-weight)`;
    probe.style.letterSpacing = `var(--_ag-type-${r}-tracking)`;
    (el.parentElement ?? document.body).appendChild(probe);
    const cs = getComputedStyle(probe);
    const out = { fontSize: cs.fontSize, lineHeight: cs.lineHeight, fontWeight: cs.fontWeight, letterSpacing: cs.letterSpacing };
    probe.remove();
    return out;
  }, role);
}

test.describe('Text / Heading type roles (REQ-CMP-111)', () => {
  test('Text roles consume their token quartet and caption != body', async ({ page }) => {
    await gotoStory(page, 'core-text--default');
