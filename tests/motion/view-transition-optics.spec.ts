/* MAT-241 / REQ-MOT-T12,-75 + REQ-MAT-48 (FIN D.3-29): View Transition optics
 * and timing. Remote only (GitLab mat:test:motion-vt on the Playwright image).
 *
 * MAT subject (stories/mat/motion/ViewTransitions, swap runs startMorph):
 *  - full: on engines with startViewTransition the participant's
 *    ::view-transition-group runs for the computed --ag-duration-medium; without
 *    it the FLIP fallback animates transform only. --_ag-optics dips to 0 on the
 *    participant during the morph and is back to 1 once settled.
 *  - calm: every animation the morph starts (VT pseudo-elements or the FLIP
 *    fallback) is opacity-only and lasts the computed --ag-duration-micro.
 *  - none: the update applies with no animation at all.
 * Morph owners (Tabs, SegmentedControl, TabBar, SourceTransition) must show the
 * same optics dip; they are CMP/SURF subjects wired through REQ-FIN-72/-82 and
 * fail here — never skip — until those land. */
import { test, expect, type Page } from '@playwright/test';
import { gotoStory, listSubjects } from '../helpers';

const MAT_STORY = 'mat-motion-view-transitions--optics-debug-toggle';
const OWNER_SUBJECTS = ['Tabs', 'SegmentedControl', 'TabBar', 'SourceTransition'] as const;
const PARTICIPANT = '[data-ag-surface][data-ag-vt-participant]';
const META_KEYS = new Set(['offset', 'computedOffset', 'easing', 'composite']);

interface SeenAnimation { pseudo: string | null; target: string; props: string[]; duration: number }

const hasVT = (page: Page) =>
  page.evaluate(() => typeof (document as { startViewTransition?: unknown }).startViewTransition === 'function');

/** computed CSS time on <html> in ms (the token sheet declares it on :root). */
const tokenMs = (page: Page, name: string) =>
  page.evaluate((n) => {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(n).trim();
    const m = /^(-?\d*\.?\d+)(ms|s)$/.exec(raw);
    return m ? (m[2] === 's' ? parseFloat(m[1]!) * 1000 : parseFloat(m[1]!)) : NaN;
  }, name);

/** Every frame: record each running morph animation (VT pseudo-elements and the
    participant's own WAAPI/CSS animations; CSS transitions such as the settled
    --_ag-optics fade are not morph animations) and the participants' --_ag-optics. */
const armProbe = (page: Page) =>
  page.evaluate(({ sel, meta }) => {
    const w = window as unknown as { __vt: { anims: Map<unknown, SeenAnimation>; opticsZero: number; stop: boolean } };
    type SeenAnimation = { pseudo: string | null; target: string; props: string[]; duration: number };
    w.__vt = { anims: new Map(), opticsZero: 0, stop: false };
    const skip = new Set(meta);
    const tick = () => {
      if (w.__vt.stop) return;
      for (const a of document.getAnimations()) {
        const eff = a.effect as KeyframeEffect | null;
        if (!eff || w.__vt.anims.has(a)) continue;
        if (typeof CSSTransition !== 'undefined' && a instanceof CSSTransition) continue;
        const pseudo = eff.pseudoElement ?? null;
        const target = eff.target as Element | null;
        const isVT = !!pseudo && pseudo.startsWith('::view-transition');
        const isParticipant = !!target && !pseudo && target.matches(sel);
        if (!isVT && !isParticipant) continue;
        const props = new Set<string>();
        for (const kf of eff.getKeyframes()) for (const k of Object.keys(kf)) if (!skip.has(k)) props.add(k);
        const d = eff.getComputedTiming().duration;
        w.__vt.anims.set(a, { pseudo, target: target?.tagName ?? '', props: [...props].sort(), duration: typeof d === 'number' ? d : NaN });
      }
      for (const p of document.querySelectorAll(sel)) {
        if (parseFloat(getComputedStyle(p).getPropertyValue('--_ag-optics') || '1') === 0) w.__vt.opticsZero += 1;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, { sel: PARTICIPANT, meta: [...META_KEYS] });

const readProbe = (page: Page) =>
  page.evaluate(() => {
    const w = window as unknown as { __vt: { anims: Map<unknown, SeenAnimation>; opticsZero: number; stop: boolean } };
    w.__vt.stop = true;
    return { anims: [...w.__vt.anims.values()], opticsZero: w.__vt.opticsZero };
  });

/** true once no morph animation (VT pseudo-element or participant) is running
    and startMorph has cleared data-ag-vt / data-ag-vt-settled. */
const morphOver = (page: Page) =>
  page.waitForFunction((sel) =>
    !document.querySelector('[data-ag-vt], [data-ag-vt-settled]') &&
    document.getAnimations().every((a) => {
      const eff = a.effect as KeyframeEffect | null;
      const pseudo = eff?.pseudoElement ?? '';
      const t = eff?.target as Element | null | undefined;
      const morph = pseudo.startsWith('::view-transition') || (!pseudo && !!t?.matches(sel));
      return !morph || a.playState !== 'running';
    }), PARTICIPANT, { timeout: 5_000 });

/** swap, then wait until the morph is over: no data-ag-vt / -settled left, no
    running animation, two frames + a microtask. */
const swapAndSettle = async (page: Page) => {
  await page.locator('[data-ag-vt-trigger]').click();
  await expect(page.locator('[data-ag-vt-node]')).toContainText('(after)');
  await morphOver(page);
  await page.evaluate(async () => {
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    await Promise.resolve();
  });
};

const opticsAfter = (page: Page) =>
  page.locator(PARTICIPANT).evaluateAll((els) =>
    els.map((e) => getComputedStyle(e).getPropertyValue('--_ag-optics').trim()));

test.describe('MAT View Transitions story (REQ-MAT-48)', () => {
  test.beforeEach(async () => {
    const subs = await listSubjects();
    expect(subs.map((s) => s.id), 'MAT/Motion/View Transitions story is in the Storybook index').toContain(MAT_STORY);
  });

  test('full: group runs --ag-duration-medium (FLIP: transform only); optics 0 during, 1 after', async ({ page }) => {
    await gotoStory(page, MAT_STORY, { motion: 'full' });
    const vt = await hasVT(page);
    const medium = await tokenMs(page, '--ag-duration-medium');
    expect(medium, '--ag-duration-medium resolves on :root').toBeGreaterThan(0);
    await armProbe(page);
    await swapAndSettle(page);
    const { anims, opticsZero } = await readProbe(page);
    expect(anims.length, 'the morph started at least one animation').toBeGreaterThan(0);
    if (vt) {
      const groups = anims.filter((a) => a.pseudo?.startsWith('::view-transition-group(ag-vt-lab'));
      expect(groups.length, 'participant ::view-transition-group animated').toBeGreaterThan(0);
      for (const g of groups) expect(g.duration, 'group animation-duration = --ag-duration-medium').toBe(medium);
    } else {
      const own = anims.filter((a) => a.pseudo === null);
      expect(own.length, 'FLIP fallback animated the participant').toBeGreaterThan(0);
      for (const a of own) {
        expect(a.props.filter((p) => p !== 'transform' && p !== 'transformOrigin'), 'FLIP animates transform only').toEqual([]);
        expect(a.props).toContain('transform');
      }
    }
    expect(opticsZero, '--_ag-optics dips to 0 on the participant during the morph').toBeGreaterThan(0);
    for (const v of await opticsAfter(page)) expect(['', '1']).toContain(v);
  });

  test('calm: every morph animation is opacity-only at --ag-duration-micro', async ({ page }) => {
    await gotoStory(page, MAT_STORY, { motion: 'calm' });
    const micro = await tokenMs(page, '--ag-duration-micro');
    expect(micro, '--ag-duration-micro resolves to 120 ms').toBe(120);
    await armProbe(page);
    await swapAndSettle(page);
    const { anims } = await readProbe(page);
    expect(anims.length, 'calm still cross-fades').toBeGreaterThan(0);
    expect(anims.filter((a) => a.pseudo?.startsWith('::view-transition-group(')), 'calm runs no group geometry').toEqual([]);
    for (const a of anims) {
      expect(a.props, `${a.pseudo ?? a.target}: opacity-only keyframes`).toEqual(['opacity']);
      expect(a.duration, `${a.pseudo ?? a.target}: duration = --ag-duration-micro`).toBe(micro);
    }
  });

  test('none: the update applies with no animation', async ({ page }) => {
    await gotoStory(page, MAT_STORY, { motion: 'none' });
    await armProbe(page);
    await swapAndSettle(page);
    const { anims } = await readProbe(page);
    expect(anims).toEqual([]);
  });
});

/* Morph owners (CMP/SURF): REQ-FIN-72 (SegmentedControl) and REQ-FIN-82 (Tabs,
   TabBar, SourceTransition) wire useMorphName + data-ag-vt-participant. */
for (const subject of OWNER_SUBJECTS) {
  test(`${subject}: --_ag-optics 0 during transition, 1 after finished`, async ({ page }) => {
    const subs = await listSubjects();
    const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
    const hit = subs.find((s) => norm(s.subject) === norm(subject));
    expect(hit, `${subject} story is in the Storybook index`).toBeDefined();
    await gotoStory(page, hit!.id, { motion: 'full' });
    const root = page.locator('[data-ag-root]');
    await expect(root.locator('[data-ag-vt-participant]').first(), `${subject} renders a morph participant`).toBeAttached();
    await armProbe(page);
    const triggers = root.locator('[role="tab"], [data-ag-part="trigger"], button');
    expect(await triggers.count(), `${subject} has a second trigger to morph to`).toBeGreaterThan(1);
    await triggers.nth(1).click();
    await morphOver(page);
    const { opticsZero } = await readProbe(page);
    expect(opticsZero, `${subject}: --_ag-optics must dip to 0 on a participant during the morph`).toBeGreaterThan(0);
    for (const v of await opticsAfter(page)) expect(['', '1']).toContain(v);
  });
}
