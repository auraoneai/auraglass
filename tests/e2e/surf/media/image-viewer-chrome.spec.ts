// image-viewer-chrome.spec.ts — REQ-SURF-145 (REQ-FIN-86): ImageViewer chrome
// over media. The scrim paints the --ag-scrim-media token with no backdrop
// filter; the Stage and popup declare data-ag-backdrop='media'; Toolbar and
// Caption carry the clear chrome material; the Inspector is a 320 px side
// region at 1440 px and a bottom region (≤50dvh) at 390 px. A missing
// subject or story is a failure, never a skip.
import { test, expect, type Page } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

async function openStory(page: Page, story: string) {
  const subjects = await listSubjects({ owner: 'SURF' });
  const subject = subjects.find((s) => s.subject === 'ImageViewer' && s.id.endsWith(`--${story}`));
  expect(subject, `ImageViewer ${story} story registered in the subject index`).toBeTruthy();
  await gotoStory(page, subject!.id);
  await expect(page.locator('[data-ag-part="image-viewer-popup"]')).toBeVisible();
}

async function chrome(page: Page) {
  return page.evaluate(() => {
    const q = (p: string) => document.querySelector(`[data-ag-part="${p}"]`) as HTMLElement | null;
    const scrim = q('image-viewer-scrim')!;
    // resolve the token through a probe so both sides use the same colour serialisation
    const token = getComputedStyle(scrim).getPropertyValue('--ag-scrim-media').trim();
    const probe = document.createElement('div');
    probe.style.backgroundColor = 'var(--ag-scrim-media)';
    scrim.parentElement!.appendChild(probe);
    const tokenColour = getComputedStyle(probe).backgroundColor;
    probe.remove();
    const cs = getComputedStyle(scrim);
    const filters = ['image-viewer-scrim', 'image-viewer-popup', 'image-viewer-stage'].map((p) => {
      const s = getComputedStyle(q(p)!);
      return { p, filter: s.backdropFilter || (s as unknown as { webkitBackdropFilter?: string }).webkitBackdropFilter || 'none' };
    });
    const vp = { w: window.innerWidth, h: window.innerHeight };
    const inspector = q('image-viewer-inspector');
    const ir = inspector?.getBoundingClientRect() ?? null;
    const sr = q('image-viewer-stage')!.getBoundingClientRect();
    return {
      token,
      tokenColour,
      scrimColour: cs.backgroundColor,
      filters,
      vp,
      inspector: ir && { left: ir.left, right: ir.right, top: ir.top, bottom: ir.bottom, width: ir.width, height: ir.height },
      stage: { right: sr.right, bottom: sr.bottom },
      backdrop: {
        popup: q('image-viewer-popup')!.getAttribute('data-ag-backdrop'),
        stage: q('image-viewer-stage')!.getAttribute('data-ag-backdrop'),
      },
      material: ['image-viewer-toolbar', 'image-viewer-caption'].map((p) => {
        const el = q(p);
        return el && { p, surface: el.classList.contains('ag-surface'), layer: el.getAttribute('data-ag-layer'), variant: el.getAttribute('data-ag-variant') };
      }),
    };
  });
}

test.describe('image-viewer chrome (REQ-SURF-145)', () => {
  test('1440: token scrim, no backdrop filter, media backdrop, clear chrome, 320 px side inspector', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openStory(page, 'with-inspector');
    const r = await chrome(page);
    expect(r.token, '--ag-scrim-media is defined').not.toBe('');
    expect(r.scrimColour).toBe(r.tokenColour);
    for (const f of r.filters) expect(f.filter, `${f.p} backdrop-filter`).toBe('none');
    expect(r.backdrop).toEqual({ popup: 'media', stage: 'media' });
    expect(r.material.filter(Boolean)).toContainEqual({ p: 'image-viewer-toolbar', surface: true, layer: 'chrome', variant: 'clear' });
    expect(r.inspector).not.toBeNull();
    expect(Math.round(r.inspector!.width)).toBe(320);
    expect(Math.round(r.inspector!.right)).toBe(r.vp.w);
    // side region: the Stage stops where the Inspector starts
    expect(r.stage.right).toBeLessThanOrEqual(r.inspector!.left + 1);
  });

  test('390: the inspector is a bottom region no taller than 50dvh', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openStory(page, 'with-inspector');
    const r = await chrome(page);
    expect(r.scrimColour).toBe(r.tokenColour);
    for (const f of r.filters) expect(f.filter, `${f.p} backdrop-filter`).toBe('none');
    expect(r.inspector).not.toBeNull();
    expect(Math.round(r.inspector!.width)).toBe(390);
    expect(r.inspector!.height).toBeLessThanOrEqual(r.vp.h / 2 + 1);
    expect(r.inspector!.bottom).toBeLessThanOrEqual(r.vp.h + 1);
    // below the Stage, not over it
    expect(r.inspector!.top).toBeGreaterThanOrEqual(r.stage.bottom - 1);
  });

  test('reduced motion: the zoom transform does not transition', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1440, height: 900 });
    await openStory(page, 'with-inspector');
    const t = await page.locator('[data-ag-part="image-viewer-stage"] img:not([hidden])').first()
      .evaluate((el) => getComputedStyle(el).transitionProperty);
    expect(t.split(',').map((s) => s.trim())).not.toContain('transform');
  });
});
