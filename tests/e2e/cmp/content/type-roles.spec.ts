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
    const bodySel = '[data-ag-part="root"][data-ag-type="body"]';
    await expect(page.locator(bodySel).first()).not.toHaveAttribute('data-ag-size', /.+/);
    const body = await computed(page, bodySel);
    expect(body).toEqual(await expected(page, bodySel, 'body'));

    await gotoStory(page, 'core-text--matrix');
    const captionSel = '[data-ag-part="root"][data-ag-type="caption"]';
    const caption = await computed(page, captionSel);
    expect(caption).toEqual(await expected(page, captionSel, 'caption'));
    for (const role of ['callout', 'label', 'mono']) {
      const sel = `[data-ag-part="root"][data-ag-type="${role}"]`;
      expect(await computed(page, sel)).toEqual(await expected(page, sel, role));
    }
    expect(caption.fontSize).not.toBe(body.fontSize);
  });

  test('an explicit Text size still overrides the role size', async ({ page }) => {
    await gotoStory(page, 'core-text--sizes');
    const sizes = await page.locator('[data-ag-part="root"][data-ag-size]').evaluateAll((els) =>
      els.map((el) => [el.getAttribute('data-ag-size'), getComputedStyle(el).fontSize]));
    expect(sizes.map(([s]) => s)).toEqual(['xs', 'sm', 'md', 'lg']);
    const px = sizes.map(([, v]) => parseFloat(String(v)));
    expect(px).toEqual([...px].sort((a, b) => a - b));
    expect(new Set(px).size).toBe(4);
  });

  test('Heading sizes consume their token quartet; unset size derives from level', async ({ page }) => {
    await gotoStory(page, 'core-heading--sizes');
    for (const role of ['display', 'title-1', 'title-2', 'title-3']) {
      const sel = `[data-ag-part="root"][data-ag-size="${role}"]`;
      expect(await computed(page, sel)).toEqual(await expected(page, sel, role));
    }

    await gotoStory(page, 'core-heading--levels');
    const derived = await page.locator('[data-ag-part="root"][data-ag-level]').evaluateAll((els) =>
      els.map((el) => [el.tagName, el.getAttribute('data-ag-size')]));
    expect(derived).toEqual([
      ['H1', 'title-1'], ['H2', 'title-2'], ['H3', 'title-3'],
      ['H4', 'title-3'], ['H5', 'title-3'], ['H6', 'title-3'],
    ]);
    const h1 = '[data-ag-part="root"][data-ag-level="1"]';
    expect(await computed(page, h1)).toEqual(await expected(page, h1, 'title-1'));
  });
});
