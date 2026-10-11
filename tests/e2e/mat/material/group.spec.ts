/* MAT-158 — SurfaceGroup: 5-child toolbar has exactly 1 visible backdrop
   filter (grouping); children keep rim and shadow.
   REQ-MAT-26 (REQ-FIN-55, FIN D.3-17) — structural mapping, measured on
   computed values in the browser:
   - SurfaceGroup spacing=4 computes gap == --ag-space-4;
   - ConcentricFrame radius=lg inset=3 gives a child concentric radius of
     lg − space-3 and pads by space-3;
   - ScrollEdge computed background is not transparent.
   Producers outside FIN-D: the Storybook preview must load the token sheet
   (dist/tokens.css; FIN-G/QUAL .storybook/preview.tsx), material.css must read
   --_ag-group-spacing and paint the ScrollEdge background (FIN-A REQ-FIN-02).
   Until they land, the affected case raises `pending: …` (PRD-F §4.3 rule 2;
   never a pass); at AG_SCOPE=release it is a plain failure. */
import { test, expect, type Page } from '@playwright/test';
import { readDensity } from '../../../material/helpers/density';
import { gotoMaterialStory } from '../../../material/helpers/story';

const pendingOrFail = (reason: string, producer: string): never => {
  if (process.env.AG_SCOPE === 'release') throw new Error(`release scope: ${reason} (producer: ${producer})`);
  const e = new Error(`pending: ${reason} (producer: ${producer})`);
  e.name = 'AgPendingProducer';
  throw e;
};
const TOKENS_PRODUCER = 'FIN-G/QUAL .storybook/preview.tsx loads dist/tokens.css';
const MATERIAL_PRODUCER = 'FIN-A REQ-FIN-02 src/material/css/material.css';

/** Resolve a length expression to px with a probe element under `scope`. */
const probePx = (page: Page, scope: string, expr: string): Promise<number> =>
  page.evaluate(([sel, value]) => {
    const host = document.querySelector(sel) ?? document.body;
    const probe = document.createElement('div');
    probe.style.position = 'absolute';
    probe.style.width = value;
    host.appendChild(probe);
    const px = probe.getBoundingClientRect().width;
    probe.remove();
    return px;
  }, [scope, expr] as const);

/** The token sheet is loaded when the root declares the space scale. */
const requireTokenSheet = async (page: Page): Promise<void> => {
  const space4 = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue('--ag-space-4').trim());
  if (!space4) pendingOrFail('--ag-space-4 is not declared on :root: the story does not load the token sheet', TOKENS_PRODUCER);
};

test.describe('SurfaceGroup', () => {
  test('5-child toolbar renders exactly 1 visible backdrop filter', async ({ page }) => {
    await gotoMaterialStory(page, 'material-lab-examples--nesting-and-groups');
    const density = await readDensity(page, '[data-ag-group]');
    expect(density.liveBackdropFilters).toBe(1);
    // children keep rim (::after background non-none) and shadow
    const rimBg = await page.locator('[data-ag-group] .ag-surface').first()
      .evaluate((el) => getComputedStyle(el, '::after').backgroundImage);
    expect(rimBg).not.toBe('none');
    const shadow = await page.locator('[data-ag-group] .ag-surface').first()
      .evaluate((el) => getComputedStyle(el, '::before').boxShadow);
    expect(shadow).not.toBe('none');
  });

  test('spacing=4 computes gap == --ag-space-4 (REQ-MAT-26)', async ({ page }) => {
    await gotoMaterialStory(page, 'material-lab-examples--nesting-and-groups');
    await requireTokenSheet(page);
    const group = page.locator('[data-ag-group]').first();
    // The story renders spacing="2"; the component's attribute emission is unit-tested
    // (components.test.tsx). Here the CSS mapping is measured for the spacing=4 token.
    await group.evaluate((el) => el.setAttribute('data-ag-spacing', '4'));
    const expected = await probePx(page, '[data-ag-group]', 'var(--ag-space-4)');
    const space2 = await probePx(page, '[data-ag-group]', 'var(--ag-space-2)');
    expect(expected).toBeGreaterThan(space2);
    const { gap, mapped } = await group.evaluate((el) => ({
      gap: parseFloat(getComputedStyle(el).columnGap),
      mapped: getComputedStyle(el).getPropertyValue('--_ag-group-spacing').trim(),
    }));
    // FIN-D side: the generated mapping rule sets the private on the group.
    expect(mapped).not.toBe('');
    if (Math.abs(gap - expected) > 0.5 && Math.abs(gap - space2) <= 0.5)
      pendingOrFail('group gap still uses the space-2 default: material.css does not read --_ag-group-spacing', MATERIAL_PRODUCER);
    expect(gap).toBeCloseTo(expected, 1);
  });
});

test.describe('ConcentricFrame (REQ-MAT-26)', () => {
  test('radius=lg inset=3: child concentric radius = lg − space-3, frame pads by space-3', async ({ page }) => {
    await gotoMaterialStory(page, 'material-lab-examples--shape-and-concentricity');
    await requireTokenSheet(page);
    const frame = '[data-ag-part="concentric-frame"][data-ag-radius="lg"][data-ag-inset="3"]';
    await expect(page.locator(frame)).toHaveCount(1);
    const lg = await probePx(page, frame, 'var(--ag-radius-lg)');
    const space3 = await probePx(page, frame, 'var(--ag-space-3)');
    expect(lg).toBeGreaterThan(space3);
    const child = page.locator(`${frame} > .ag-surface[data-ag-shape="concentric"]`).first();
    const radius = await child.evaluate((el) => parseFloat(getComputedStyle(el).borderTopLeftRadius));
    expect(radius).toBeCloseTo(lg - space3, 1);
    const padding = await page.locator(frame).evaluate((el) => parseFloat(getComputedStyle(el).paddingTop));
    expect(padding).toBeCloseTo(space3, 1);
  });
});

test.describe('ScrollEdge (REQ-MAT-26)', () => {
  test('computed background is not transparent', async ({ page }) => {
    await gotoMaterialStory(page, 'material-lab-examples--scroll-edge-story');
    await requireTokenSheet(page);
    const edges = page.locator('[data-ag-part="scroll-edge"]');
    await expect(edges).toHaveCount(2);
    for (const edge of await edges.all()) {
      const bg = await edge.evaluate((el) => {
        const cs = getComputedStyle(el);
        return { color: cs.backgroundColor, image: cs.backgroundImage };
      });
      const transparent = bg.image === 'none' && /^(transparent|rgba\(0, 0, 0, 0\))$/.test(bg.color);
      if (transparent) pendingOrFail('ScrollEdge part paints no background', MATERIAL_PRODUCER);
      expect(transparent).toBe(false);
    }
  });
});
