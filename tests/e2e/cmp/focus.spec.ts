/* REQ-CMP-19 (REQ-FIN-11 / REQ-FIN-70): the shared CMP focus ring
   (src/components/control-shared/controls.css), remote e2e lane only.

   Over every CMP story in the subject index, keyboard Tab walks the story and
   every focused library part must draw the ring on its ring host (the part
   itself, or the control-shell / input-shell that wraps a text control):
     - computed outline-style `solid`, outline-width >= 2px;
     - the inner --ag-focus-inner band: a non-`none` box-shadow;
     - a focused element inside a library component (class `ag-*`) with no
       data-ag-part is an offender (it can never receive the shared ring).
   Focusable-disabled parts ([aria-disabled='true'] / [data-disabled]) keep
   the ring. Forced colours: outline 2px solid, no box-shadow. Forced-colour
   emulation exists in Chromium only (page.emulateMedia, read back through
   matchMedia), so the per-engine mode list carries it for chromium and the
   test asserts that exactly that list ran. */
import { test, expect, type Page } from '@playwright/test';
import { gotoStory, listSubjects } from '../../helpers/index';

type Mode = 'default' | 'forced-colors';
type Ring = { story: string; mode: Mode; part: string | null; host: string | null; fv: boolean; outlineStyle: string; outlineWidth: number; boxShadow: string; inLibrary: boolean };

const TAB_STOPS = 12;
const MODES: Record<'chromium' | 'webkit' | 'firefox', Mode[]> = { chromium: ['default', 'forced-colors'], webkit: ['default'], firefox: ['default'] };

/** Ring host + computed ring for document.activeElement, or null when focus left the story. */
const readRing = (page: Page, story: string, mode: Mode) =>
  page.evaluate(({ story, mode }) => {
    const el = document.activeElement as HTMLElement | null;
    if (!el || el === document.body || el === document.documentElement) return null;
    const shell = el.matches("[data-ag-part='control'], [data-ag-part='input']")
      ? el.closest<HTMLElement>("[data-ag-part='control-shell'], [data-ag-part='input-shell']")
      : null;
    const host = shell ?? el;
    const cs = getComputedStyle(host);
    return {
      story, mode,
      part: el.getAttribute('data-ag-part'),
      host: host.getAttribute('data-ag-part'),
      fv: el.matches(':focus-visible'),
      outlineStyle: cs.outlineStyle,
      outlineWidth: parseFloat(cs.outlineWidth) || 0,
      boxShadow: cs.boxShadow,
      inLibrary: el.closest("[class^='ag-'], [class*=' ag-']") !== null,
    };
  }, { story, mode });

const ringOffence = (r: Ring): string | null => {
  const where = `${r.story} [${r.mode}] part=${r.part ?? '<none>'} host=${r.host ?? '<none>'}`;
  if (r.part === null) return r.inLibrary ? `${where}: focusable library element has no data-ag-part` : null;
  if (!r.fv) return `${where}: keyboard focus did not match :focus-visible`;
  if (r.outlineStyle !== 'solid') return `${where}: outline-style ${r.outlineStyle}, want solid`;
  if (r.outlineWidth < 2) return `${where}: outline-width ${r.outlineWidth}px, want >= 2px`;
  if (r.mode === 'default' && r.boxShadow === 'none') return `${where}: no inner --ag-focus-inner band (box-shadow none)`;
  if (r.mode === 'forced-colors' && r.boxShadow !== 'none') return `${where}: forced colours keep box-shadow ${r.boxShadow}`;
  return null;
};

const enterMode = async (page: Page, mode: Mode) => {
  await page.emulateMedia({ forcedColors: mode === 'forced-colors' ? 'active' : 'none' });
  const active = await page.evaluate(() => matchMedia('(forced-colors: active)').matches);
  expect(active, `forced-colors media query for mode ${mode}`).toBe(mode === 'forced-colors');
};

test.describe('cmp focus ring (REQ-CMP-19)', () => {
  test('every focusable CMP part draws the two-tone ring on :focus-visible', async ({ page, browserName }) => {
    test.setTimeout(15 * 60_000);
    const stories = (await listSubjects({ owner: 'CMP' })).filter((s) => s.kind === 'component');
    expect(stories.length, 'CMP component stories in the subject index').toBeGreaterThan(0);
    const modes = MODES[browserName];
    const ran: Mode[] = [];
    const offences: string[] = [];
    let checked = 0;
    for (const mode of modes) {
      ran.push(mode);
      for (const s of stories) {
        await gotoStory(page, s.id);
        await enterMode(page, mode);
        const seen = new Set<string>();
        for (let i = 0; i < TAB_STOPS; i++) {
          await page.keyboard.press('Tab');
          const ring = await readRing(page, s.id, mode);
          if (ring === null) break;
          const key = `${ring.part}|${ring.host}|${i}`;
          if (seen.has(key)) continue;
          seen.add(key);
          if (ring.part !== null) checked++;
          const offence = ringOffence(ring);
          if (offence) offences.push(offence);
        }
      }
    }
    expect(ran).toEqual(modes);
    expect(checked, 'focused library parts measured').toBeGreaterThan(0);
    expect(offences).toEqual([]);
  });

  test('pointer focus draws no ring; keyboard focus does', async ({ page }) => {
    await gotoStory(page, 'flagships-controls-button--default');
    const btn = page.locator("button[data-ag-part='root']").first();
    await btn.click();
    expect(await btn.evaluate((el) => el.matches(':focus-visible'))).toBe(false);
    expect(await btn.evaluate((el) => getComputedStyle(el).outlineStyle)).toBe('none');
    await page.locator('body').click({ position: { x: 1, y: 1 } });
    await page.keyboard.press('Tab');
    const ring = await readRing(page, 'flagships-controls-button--default', 'default');
    expect(ring).not.toBeNull();
    expect(ringOffence(ring!)).toBeNull();
    expect(ring!.part).toBe('root');
  });

  for (const attr of [['aria-disabled', 'true'], ['data-disabled', '']] as const) {
    test(`focusable-disabled part [${attr[0]}] keeps the ring`, async ({ page }) => {
      await gotoStory(page, 'flagships-controls-button--default');
      await page.locator("button[data-ag-part='root']").first().evaluate((el, [k, v]) => el.setAttribute(k, v), attr);
      await page.keyboard.press('Tab');
      const ring = await readRing(page, 'flagships-controls-button--default', 'default');
      expect(ring).not.toBeNull();
      expect(await page.evaluate((k) => document.activeElement?.hasAttribute(k) ?? false, attr[0])).toBe(true);
      expect(ringOffence(ring!)).toBeNull();
    });
  }
});
