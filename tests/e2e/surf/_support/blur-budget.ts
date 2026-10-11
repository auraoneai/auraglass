// tests/e2e/surf/_support/blur-budget.ts — shared blur-budget probes for the
// SURF blur-budget specs (REQ-SURF-191, REQ-FIN-90 / AC-FIN-90):
//   tests/e2e/surf/app-shell/blur-budget.spec.ts
//   tests/e2e/surf/media/blur-budget.spec.ts
//   tests/perf/browser/surf/registry-blocks.spec.ts
//
// The surface COUNT always comes from QUAL's `perf.blurredSurfaces` (contract
// PerfProbe, S-40: elements with a non-none backdrop-filter on the element or
// its ::before). `blurredDetail` walks the same set page-side to report what
// the count cannot: which elements they are, their parsed blur radii and
// whether one blurred surface sits inside another. The specs assert that both
// views agree, so the detail never describes a different set than the count.
//
// Budgets are exact constants in the specs; nothing here relaxes them.
import { expect, type Browser, type BrowserContext, type Page } from '@playwright/test';
import { listSubjects, perf } from '../../../helpers';

export interface BlurredSurface {
  /** Document-order index of the host element (an element and its ::before share one). */
  host: number;
  /** `tag[data-ag-part=…][data-ag-layer=…]` (+ `::before`) — names the offender in failures. */
  label: string;
  /** True for `[data-ag-layer="scrim"]` or a `data-ag-part` ending in `scrim`. */
  scrim: boolean;
  /** Every `blur(<len>)` radius in the computed backdrop-filter, in px. */
  radiiPx: number[];
  /** Radii the probe could not resolve to px (any non-px computed unit). */
  unparsed: string[];
  /** Labels of blurred ancestors (incl. the host when the blur is on ::before of a blurred host). */
  blurredAncestors: string[];
}

/** Page-side walk of every blurred element / ::before, mirroring perf.blurredSurfaces. */
export async function blurredDetail(page: Page): Promise<BlurredSurface[]> {
  return page.evaluate(() => {
    const filterOf = (cs: CSSStyleDeclaration): string => {
      const v = cs.backdropFilter || (cs as unknown as { webkitBackdropFilter?: string }).webkitBackdropFilter || 'none';
      return v === '' ? 'none' : v;
    };
    const label = (el: Element, pseudo = ''): string => {
      const part = el.getAttribute('data-ag-part');
      const layer = el.getAttribute('data-ag-layer');
      return `${el.tagName.toLowerCase()}${part ? `[data-ag-part=${part}]` : ''}${layer ? `[data-ag-layer=${layer}]` : ''}${pseudo}`;
    };
    const isScrim = (el: Element): boolean =>
      el.getAttribute('data-ag-layer') === 'scrim' || /(^|-)scrim$/.test(el.getAttribute('data-ag-part') ?? '');
    const parse = (filter: string) => {
      const radiiPx: number[] = [];
      const unparsed: string[] = [];
      for (const m of filter.matchAll(/blur\(\s*([^)]*?)\s*\)/g)) {
        const raw = m[1] ?? '';
        const px = /^(-?\d*\.?\d+(?:e-?\d+)?)px$/i.exec(raw);
        if (px) radiiPx.push(Number(px[1]));
        else if (raw === '' || raw === '0') radiiPx.push(0);
        else unparsed.push(raw);
      }
      return { radiiPx, unparsed };
    };

    const self = new Map<Element, string>();
    const before = new Map<Element, string>();
    for (const el of document.querySelectorAll('*')) {
      const own = filterOf(getComputedStyle(el));
      const pre = filterOf(getComputedStyle(el, '::before'));
      if (own !== 'none') self.set(el, own);
      if (pre !== 'none') before.set(el, pre);
    }
    const blurredAncestorsOf = (el: Element): string[] => {
      const out: string[] = [];
      for (let p = el.parentElement; p; p = p.parentElement) {
        if (self.has(p)) out.push(label(p));
        if (before.has(p)) out.push(label(p, '::before'));
      }
      return out;
    };

    const order = new Map<Element, number>();
    let i = 0;
    for (const el of document.querySelectorAll('*')) order.set(el, i++);
    const out: Array<{ host: number; label: string; scrim: boolean; radiiPx: number[]; unparsed: string[]; blurredAncestors: string[] }> = [];
    for (const el of new Set([...self.keys(), ...before.keys()])) {
      const ancestors = blurredAncestorsOf(el);
      const host = order.get(el)!;
      if (self.has(el)) out.push({ host, label: label(el), scrim: isScrim(el), ...parse(self.get(el)!), blurredAncestors: ancestors });
      // A blurred ::before inside a blurred host is a second blurred layer nested in the first.
      if (before.has(el)) {
        out.push({
          host,
          label: label(el, '::before'),
          scrim: isScrim(el),
          ...parse(before.get(el)!),
          blurredAncestors: self.has(el) ? [label(el), ...ancestors] : ancestors,
        });
      }
    }
    return out;
  });
}

export interface BlurReport {
  /** perf.blurredSurfaces — the contract count every budget is asserted on. */
  count: number;
  surfaces: BlurredSurface[];
}

/** Waits for every finite running animation/transition (entrance fades, popup open) to finish. */
async function settleFiniteAnimations(page: Page): Promise<void> {
  await page.evaluate(() => Promise.all(document.getAnimations()
    .filter((a) => Number.isFinite(Number(a.effect?.getComputedTiming().endTime)))
    .map((a) => a.finished.catch(() => undefined))));
}

/** Count via the QUAL probe plus the detail walk; asserts both describe the same elements. */
export async function measureBlur(page: Page): Promise<BlurReport> {
  await settleFiniteAnimations(page);
  const count = await perf.blurredSurfaces(page);
  const surfaces = await blurredDetail(page);
  // perf.blurredSurfaces counts an element once even when both it and its ::before are blurred.
  const hosts = new Set(surfaces.map((s) => s.host));
  expect(hosts.size, `detail walk saw ${hosts.size} blurred hosts, perf.blurredSurfaces saw ${count}: ${surfaces.map((s) => s.label).join(', ')}`).toBe(count);
  return { count, surfaces };
}

/** Nesting depth 1: no blurred surface has a blurred ancestor. */
export function expectDepthOne(report: BlurReport, where: string): void {
  const nested = report.surfaces.filter((s) => s.blurredAncestors.length > 0).map((s) => `${s.label} inside ${s.blurredAncestors.join(' > ')}`);
  expect(nested, `${where}: blurred surfaces nested in another blurred surface`).toEqual([]);
}

export const CHROME_MAX_BLUR_PX = 32;
export const SCRIM_MAX_BLUR_PX = 12;

/** Parsed blur radius ≤32 px on chrome, ≤12 px on scrims; every radius must parse. */
export function expectRadii(report: BlurReport, where: string): void {
  const unparsed = report.surfaces.filter((s) => s.unparsed.length > 0).map((s) => `${s.label}: ${s.unparsed.join(', ')}`);
  expect(unparsed, `${where}: blur radii that did not compute to px`).toEqual([]);
  const over = report.surfaces.flatMap((s) => {
    const max = s.scrim ? SCRIM_MAX_BLUR_PX : CHROME_MAX_BLUR_PX;
    return s.radiiPx.filter((r) => r > max).map((r) => `${s.label} (${s.scrim ? 'scrim' : 'chrome'}): ${r}px > ${max}px`);
  });
  expect(over, `${where}: blur radius over budget`).toEqual([]);
}

/** Primary pointer the page reports, so a run can prove which budget class it is under. */
export async function pointerKind(page: Page): Promise<'coarse' | 'fine' | 'none'> {
  return page.evaluate(() =>
    matchMedia('(pointer: coarse)').matches ? 'coarse' : matchMedia('(pointer: fine)').matches ? 'fine' : 'none');
}

/** Asserts the primary pointer, so a budget is never checked under the wrong class. */
export async function expectPointer(page: Page, want: 'coarse' | 'fine'): Promise<void> {
  expect(await pointerKind(page), `primary pointer for the ${want} budget`).toBe(want);
}

/** Engines whose Playwright context supports `isMobile` (Firefox rejects the option). */
export const ENGINES_WITH_IS_MOBILE = ['chromium', 'webkit'] as const;

/**
 * Coarse-pointer context: 390×844, `hasTouch: true`, and `isMobile: true` on
 * engines that support it (Firefox gets touch emulation only; Gecko reports
 * `(pointer: coarse)` when touch events are overridden on). Callers assert via
 * `expectPointer(page, 'coarse')` that the page really reports a coarse
 * pointer on every engine, so a context that silently stays fine fails
 * instead of passing under the fine budget.
 */
export async function coarseContext(browser: Browser, browserName: string, baseURL: string | undefined): Promise<BrowserContext> {
  const mobile = (ENGINES_WITH_IS_MOBILE as readonly string[]).includes(browserName);
  return browser.newContext({
    ...(baseURL ? { baseURL } : {}),
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    ...(mobile ? { isMobile: true } : {}),
  });
}

export type SubjectStory = Awaited<ReturnType<typeof listSubjects>>[number];

/** Every SURF story of `subject` in QUAL's subject index; none registered is a failure. */
export async function surfStoriesOf(subject: string): Promise<SubjectStory[]> {
  const stories = (await listSubjects({ owner: 'SURF' })).filter((s) => s.subject === subject);
  expect(stories.map((s) => s.id), `${subject}: no SURF story in the subject index (REPORTS.subjects) — a missing subject fails`).not.toEqual([]);
  return stories;
}

/**
 * Stories that render the default material. Forced-colors stories swap
 * material for system colours (MAT rungs), so they are held to the "≤"
 * budgets but excluded from the "exactly N blurred surfaces" checks.
 */
export const isMaterialStory = (s: SubjectStory): boolean => !/--forced-colors$/.test(s.id);
