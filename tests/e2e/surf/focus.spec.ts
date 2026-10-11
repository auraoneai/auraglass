// tests/e2e/surf/focus.spec.ts — REQ-SURF-193 (REQ-FIN-90), L5 remote.
// Real keyboard focus over the SURF story set:
//  1. Every SURF story is walked with page.keyboard.press('Tab') until focus
//     leaves the document or wraps. Every DOM tab stop must be reached, and
//     each focused element must paint the MAT focus ring: outline
//     `--_ag-focus-width solid --_ag-focus-outer` plus the inner ring
//     `0 0 0 --_ag-focus-width --_ag-focus-inner` (src/a11y/css/focus.css),
//     resolved from the element's own computed tokens.
//  2. No focused element is covered by sticky TopBar / TabBar / StatusBar
//     chrome (WCAG 2.4.11): elementFromPoint at the element's centre after
//     the browser scrolls it into view must not land in chrome that does not
//     contain the element.
//  3. aria-disabled (unavailable) calendar cells stay focusable and paint the
//     same ring.
//  4. Sidebar drawer, Sheet, CommandPalette, ImageViewer and Popover each
//     move focus inside on open and return it to their trigger on Escape.
// The story fixtures for 3 and 4 live in stories/surf/focus/FocusRestore.stories.tsx.
import { test, expect, type Page } from '@playwright/test';
import { listSubjects, gotoStory } from '../../helpers';

/** Safety bound on a single Tab walk; reaching it means focus never left the story. */
const MAX_STOPS = 250;
const OVERLAYS_STORY = 'surf-focus-restore--overlays';
const UNAVAILABLE_STORY = 'surf-focus-restore--unavailable-cells';

interface Stop {
  done: boolean;
  label: string;
  ariaDisabled: boolean;
  ring: { ok: boolean; detail: string };
  inView: boolean;
  obscuredBy: string | null;
}

/** Page-side probe of document.activeElement. Self-contained (serialised by page.evaluate). */
function probeActive(): Stop {
  const w = window as unknown as { __agFocusSeen?: Set<Element> };
  const seen = (w.__agFocusSeen ??= new Set<Element>());
  const el = document.activeElement as HTMLElement | SVGElement | null;
  const empty = { label: '', ariaDisabled: false, ring: { ok: false, detail: '' }, inView: false, obscuredBy: null };
  if (!el || el === document.body || el === document.documentElement || seen.has(el)) return { done: true, ...empty };
  seen.add(el);

  const part = el.getAttribute('data-ag-part');
  const name = el.getAttribute('aria-label') ?? (el.textContent ?? '').trim().slice(0, 32);
  const label = `${el.tagName.toLowerCase()}${part ? `[data-ag-part=${part}]` : ''}${el.className && typeof el.className === 'string' ? `.${el.className.split(/\s+/).join('.')}` : ''} "${name}"`;

  // Expected ring, resolved through the element's own computed tokens and the
  // same fallbacks src/a11y/css/focus.css uses.
  const cs = getComputedStyle(el);
  const tok = (n: string) => cs.getPropertyValue(n).trim();
  const width = tok('--_ag-focus-width') || '2px';
  const outer = tok('--_ag-focus-outer') || tok('--ag-color-focus-outer') || 'Highlight';
  const inner = tok('--_ag-focus-inner') || tok('--ag-color-focus-inner') || 'transparent';
  const probe = document.createElement('span');
  probe.style.cssText = `position:absolute;outline:${width} solid ${outer};color:${inner};`;
  document.body.append(probe);
  const ps = getComputedStyle(probe);
  const want = { width: ps.outlineWidth, outer: ps.outlineColor, inner: ps.color };
  probe.remove();

  const outlineOk = cs.outlineStyle === 'solid' && cs.outlineWidth === want.width && cs.outlineColor === want.outer;
  const innerOk = cs.boxShadow.includes(`${want.inner} 0px 0px 0px ${want.width}`);
  const ring = {
    ok: outlineOk && innerOk,
    detail: `outline=${cs.outlineStyle} ${cs.outlineWidth} ${cs.outlineColor}; box-shadow=${cs.boxShadow}; want outline ${want.width} solid ${want.outer} + inner ${want.inner} 0px 0px 0px ${want.width}`,
  };

  const r = el.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  const inView = r.width > 0 && r.height > 0 && cx >= 0 && cy >= 0 && cx < innerWidth && cy < innerHeight;
  const hit = inView ? document.elementFromPoint(cx, cy) : null;
  const CHROME = '.ag-top-bar, [data-ag-slot="top"], [data-ag-slot="tabbar"], .ag-tab-bar, [data-ag-slot="status"], [data-ag-part="status-bar"]';
  const chrome = hit?.closest(CHROME) ?? null;
  const obscuredBy = chrome && !chrome.contains(el) ? (chrome.getAttribute('data-ag-part') ?? chrome.className.toString()) : null;

  return { done: false, label, ariaDisabled: el.getAttribute('aria-disabled') === 'true', ring, inView, obscuredBy };
}

/** Page-side: the tab stops the DOM exposes (inside the open modal if any). */
function tabbableLabels(): string[] {
  const modal = [...document.querySelectorAll<HTMLElement>('[aria-modal="true"]')].find((m) => m.getClientRects().length > 0);
  const scope: ParentNode = modal ?? document;
  const SEL = 'a[href], area[href], button, input:not([type="hidden"]), select, textarea, summary, iframe, audio[controls], video[controls], [contenteditable]:not([contenteditable="false"]), [tabindex]';
  const radioGroups = new Set<string>();
  const out: string[] = [];
  for (const el of scope.querySelectorAll<HTMLElement>(SEL)) {
    if (el.tabIndex < 0 || (el as HTMLButtonElement).disabled) continue;
    if (el.closest('[inert], [data-base-ui-inert], [hidden]') || el.hasAttribute('data-base-ui-focus-guard')) continue;
    const cs = getComputedStyle(el);
    if (el.getClientRects().length === 0 || cs.visibility === 'hidden' || cs.display === 'none') continue;
    if (el instanceof HTMLInputElement && el.type === 'radio' && el.name) {
      if (radioGroups.has(el.name)) continue;
      radioGroups.add(el.name);
    }
    const w = window as unknown as { __agFocusSeen?: Set<Element> };
    out.push(`${w.__agFocusSeen?.has(el) ? 'seen' : 'missed'}:${el.tagName.toLowerCase()}${el.getAttribute('data-ag-part') ? `[data-ag-part=${el.getAttribute('data-ag-part')}]` : ''} "${(el.getAttribute('aria-label') ?? el.textContent ?? '').trim().slice(0, 32)}"`);
  }
  return out;
}

async function walkTabs(page: Page): Promise<Stop[]> {
  await page.evaluate(() => {
    (document.activeElement as HTMLElement | null)?.blur?.();
    (window as unknown as { __agFocusSeen?: Set<Element> }).__agFocusSeen = new Set();
  });
  const stops: Stop[] = [];
  for (let i = 0; i < MAX_STOPS; i++) {
    await page.keyboard.press('Tab');
    const stop = await page.evaluate(probeActive);
    if (stop.done) return stops;
    stops.push(stop);
  }
  throw new Error(`Tab walk did not leave the story within ${MAX_STOPS} stops`);
}

function expectStops(stops: Stop[]) {
  const ringless = stops.filter((s) => !s.ring.ok).map((s) => `${s.label}: ${s.ring.detail}`);
  const outOfView = stops.filter((s) => !s.inView).map((s) => s.label);
  const obscured = stops.filter((s) => s.obscuredBy !== null).map((s) => `${s.label} under ${s.obscuredBy}`);
  expect(ringless, 'focused elements without the MAT focus ring').toEqual([]);
  expect(outOfView, 'focused elements not scrolled into view').toEqual([]);
  expect(obscured, 'focused elements covered by sticky chrome').toEqual([]);
}

test.describe('SURF focus (REQ-SURF-193)', () => {
  test('every SURF story: each tab stop is reached, ringed with the MAT tokens and not obscured', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    expect(subjects.length, 'no SURF subjects registered in the subject index').toBeGreaterThan(0);
    for (const subject of subjects) {
      await test.step(subject.id, async () => {
        await gotoStory(page, subject.id);
        const stops = await walkTabs(page);
        const missed = (await page.evaluate(tabbableLabels)).filter((l) => l.startsWith('missed:'));
        expect(missed, `${subject.id}: tab stops never reached by Tab`).toEqual([]);
        expectStops(stops);
      });
    }
  });

  test('sticky chrome: >= 10 tab stops scroll under the overlay TopBar without being covered', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 640 });
    await gotoStory(page, OVERLAYS_STORY);
    const stops = await walkTabs(page);
    expect(stops.filter((s) => /focus-row|Row \d+/.test(s.label)).length).toBeGreaterThanOrEqual(10);
    expectStops(stops);
  });

  test('aria-disabled calendar cells keep the focus ring', async ({ page }) => {
    await gotoStory(page, UNAVAILABLE_STORY);
    const cell = page.locator('.ag-calendar__cell[aria-disabled="true"]', { hasText: /^8$/ }).first();
    await expect(cell).toHaveCount(1);
    // Reach the grid by Tab, then move from the 7th onto the unavailable 8th.
    const stops = await walkTabs(page);
    expectStops(stops);
    await page.locator('.ag-calendar__cell', { hasText: /^7$/ }).first().focus();
    await page.keyboard.press('ArrowRight');
    await expect(cell).toBeFocused();
    const stop = await page.evaluate(() => {
      (window as unknown as { __agFocusSeen?: Set<Element> }).__agFocusSeen = new Set();
    }).then(() => page.evaluate(probeActive));
    expect(stop.ariaDisabled).toBe(true);
    expectStops([stop]);
  });

  const OVERLAYS: Array<{ name: string; trigger: string; surface: string; viewport?: { width: number; height: number } }> = [
    { name: 'sidebar drawer', trigger: '[data-ag-focus-overlay="sidebar-drawer"]', surface: '[data-ag-part="sidebar-drawer"]' },
    { name: 'sheet', trigger: '[data-ag-focus-overlay="sheet"]', surface: '[role="dialog"]' },
    { name: 'command palette', trigger: '[data-ag-focus-overlay="command-palette"]', surface: '[data-ag-part="command-palette"]' },
    { name: 'image viewer', trigger: '[data-ag-focus-overlay-host="image-viewer"] [data-ag-part="image-viewer-trigger"]', surface: '[role="dialog"]' },
    { name: 'popover', trigger: '[data-ag-focus-overlay="popover"]', surface: '[role="dialog"]' },
  ];
  for (const o of OVERLAYS) {
    test(`focus returns to the trigger when the ${o.name} closes`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 640 });
      await gotoStory(page, OVERLAYS_STORY);
      const trigger = page.locator(o.trigger).first();
      await expect(trigger).toHaveCount(1);
      await trigger.focus();
      await page.keyboard.press('Enter');
      const surface = page.locator(o.surface).first();
      await expect(surface).toBeVisible();
      // Focus moved into the overlay.
      await expect
        .poll(() => surface.evaluate((s) => s.contains(document.activeElement)))
        .toBe(true);
      await page.keyboard.press('Escape');
      await expect(surface).toBeHidden();
      await expect(trigger).toBeFocused();
    });
  }
});
