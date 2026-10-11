/* G-18 / REQ-QUAL-23 (FIN-440) — L9 motion and settled-state lane over every
   certification subject (one story per subject), in chromium, webkit, firefox.

   motion full (reducedMotion no-preference):
   - subjects whose ComponentMeta.states contain `open` get an entrance: a
     12-frame strip at 16 ms through the running transitions/animations must
     show ≥3 distinct frames (pixelmatch, VISUAL_TOLERANCE.changedRatio);
   - 500 ms after the last transitionend without input: 0 pending rAF, 0 live
     intervals, 0 infinite animations (indeterminate progress: ≤1, transform/
     opacity only), and no element keeps will-change ≠ auto;
   reducedMotion reduce + motion none:
   - after a 500 ms settle, 0 rAF callbacks and 0 running animations over the
     next 1,000 ms; subject root (and any open popup) at opacity 1, scale 1;
   document-wide: no backdrop-filter on ::view-transition-* pseudo-elements.
   Negative control: stories/qual/fixtures/InfiniteAnimation.stories.tsx.
   The probe is packages/qa/src/motion/idleProbe.ts (self-test:
   packages/qa/test/settled-idle.selftest.test.ts). Remote-only browser lane. */
import { test, expect, type Browser, type Page } from '@playwright/test';
import { gotoStory } from '../../tests/helpers';
import { VISUAL_TOLERANCE } from '../../src/contracts/testing';
import {
  installIdleProbe, markIdleProbe, readIdleProbe, settledIdleViolations, type IdleSnapshot,
} from '../../packages/qa/src/motion/idleProbe';
import { decodePng, diffRatio, type Rgba } from './_fixtures/pixels';
import { componentMetas, fixtureStory, laneSubjects, onePerSubject, type SubjectStory } from './_fixtures/subjects';

/* page-side probe functions are passed by value (serialised into the page); their optional
   `target` parameter is for the jsdom self-test and is undefined in the page */
const pageInstallIdle = installIdleProbe as () => void;
const pageReadIdle = readIdleProbe as () => IdleSnapshot;
const pageMarkIdle = markIdleProbe as () => void;

const STRIP_FRAMES = 12;
const STRIP_STEP_MS = 16;
const SETTLE_MS = 500;
const QUIET_WINDOW_MS = 1_000;
const SETTLE_TIMEOUT_MS = 10_000;
const INFINITE_FIXTURE = 'qual-fixtures-infinite-animation--pulse';

/** Opens the subject's entrance (closing a story-default-open overlay first). Returns false when no trigger exists. */
async function driveEntrance(page: Page): Promise<boolean> {
  const openPopup = page.locator('[data-ag-layer-root] [data-ag-part="popup"]');
  if (await openPopup.count()) {
    await page.keyboard.press('Escape');
    await expect(openPopup).toHaveCount(0, { timeout: 5_000 });
    await waitSettled(page);
  }
  const trigger = page.locator('#storybook-root [data-ag-part="trigger"]').first();
  if (!(await trigger.count())) return false;
  await trigger.click();
  return true;
}

/** Waits until no finite animation runs and ≥500 ms passed since the last transitionend/animationend. */
async function waitSettled(page: Page): Promise<IdleSnapshot> {
  await page.waitForTimeout(SETTLE_MS);
  const deadline = Date.now() + SETTLE_TIMEOUT_MS;
  for (;;) {
    const snap = await page.evaluate(pageReadIdle);
    const finiteRunning = snap.running.filter((a) => !a.infinite).length;
    if (finiteRunning === 0 && snap.sinceLastEnd >= SETTLE_MS) return snap;
    if (Date.now() > deadline) {
      throw new Error(`did not settle within ${SETTLE_TIMEOUT_MS} ms (finite animations running: ${finiteRunning}, ms since last end: ${Math.round(snap.sinceLastEnd)})`);
    }
    await page.waitForTimeout(100);
  }
}

/** 12 frames at 16 ms through every running animation (paused and stepped), distinct-frame count. */
async function entranceStrip(page: Page): Promise<{ distinct: number; animations: number }> {
  const animations = await page.evaluate(() => {
    const list = document.getAnimations();
    for (const a of list) a.pause();
    return list.length;
  });
  const frames: Rgba[] = [];
  try {
    for (let i = 0; i < STRIP_FRAMES; i++) {
      await page.evaluate((t) => { for (const a of document.getAnimations()) a.currentTime = t; }, i * STRIP_STEP_MS);
      frames.push(await decodePng(page.context(), await page.screenshot({ caret: 'hide' })));
    }
  } finally {
    await page.evaluate(() => { for (const a of document.getAnimations()) a.play(); });
  }
  const distinct: Rgba[] = [];
  for (const f of frames) {
    let seen = false;
    for (const d of distinct) if ((await diffRatio(f, d)) <= VISUAL_TOLERANCE.changedRatio) { seen = true; break; }
    if (!seen) distinct.push(f);
  }
  return { distinct: distinct.length, animations };
}

async function finalState(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    // subject root: first element inside the story content wrapper (StoryRoot when present)
    const host = document.querySelector('[data-ag-story-content]')
      ?? document.querySelector('#storybook-root [data-ag-root]') ?? document.querySelector('#storybook-root');
    const root = host?.firstElementChild ?? null;
    const targets = [root, ...document.querySelectorAll('[data-ag-layer-root] [data-ag-part="popup"]')].filter(Boolean) as Element[];
    const out: string[] = [];
    if (!root) out.push('no subject root rendered');
    for (const el of targets) {
      const cs = getComputedStyle(el);
      const label = `${el.tagName.toLowerCase()}${el.getAttribute('data-ag-part') ? `[data-ag-part=${el.getAttribute('data-ag-part')}]` : ''}`;
      if (cs.opacity !== '1') out.push(`${label}: final opacity ${cs.opacity}`);
      if (cs.transform !== 'none') {
        const m = new DOMMatrixReadOnly(cs.transform);
        const sx = Math.hypot(m.a, m.b);
        const sy = Math.hypot(m.c, m.d);
        if (Math.abs(sx - 1) > 1e-3 || Math.abs(sy - 1) > 1e-3) out.push(`${label}: final scale ${sx.toFixed(3)}×${sy.toFixed(3)}`);
      }
      if (cs.scale !== 'none' && cs.scale !== '' && cs.scale !== '1') out.push(`${label}: final scale property ${cs.scale}`);
    }
    return out;
  });
}

interface MotionResult { violations: string[]; entrance: boolean; strip?: { distinct: number; animations: number } }

async function fullMotion(browser: Browser, story: SubjectStory, entrance: boolean, indeterminate: boolean): Promise<MotionResult> {
  const context = await browser.newContext({ reducedMotion: 'no-preference' });
  const page = await context.newPage();
  const violations: string[] = [];
  let strip: MotionResult['strip'];
  try {
    await page.addInitScript(pageInstallIdle);
    await gotoStory(page, story.id, { motion: 'full' });
    if (entrance) {
      if (!(await driveEntrance(page))) violations.push('meta declares state "open" but the story exposes no [data-ag-part="trigger"]');
      else {
        strip = await entranceStrip(page);
        if (strip.distinct < 3) violations.push(`entrance strip: ${strip.distinct} distinct of ${STRIP_FRAMES} frames (<3; ${strip.animations} animations)`);
      }
    }
    const settled = await waitSettled(page);
    violations.push(...settledIdleViolations(settled, { indeterminate }));
    for (const w of settled.willChange) violations.push(`will-change held after settle: ${w}`);
  } finally {
    await context.close();
  }
  return { violations, entrance, ...(strip ? { strip } : {}) };
}

async function reducedMotion(browser: Browser, story: SubjectStory, entrance: boolean, indeterminate: boolean): Promise<string[]> {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  const v: string[] = [];
  try {
    await page.addInitScript(pageInstallIdle);
    await gotoStory(page, story.id, { motion: 'none' });
    if (entrance && !(await driveEntrance(page))) v.push('meta declares state "open" but the story exposes no [data-ag-part="trigger"]');
    await page.waitForTimeout(SETTLE_MS);
    await page.evaluate(pageMarkIdle);
    await page.waitForTimeout(QUIET_WINDOW_MS);
    const snap = await page.evaluate(pageReadIdle);
    if (snap.rafFired !== 0) v.push(`reduce+none: ${snap.rafFired} rAF callbacks in ${QUIET_WINDOW_MS} ms after settle`);
    if (snap.running.length !== 0) v.push(`reduce+none: ${snap.running.length} running animations after settle (${snap.running.map((a) => a.target).join(', ')})`);
    v.push(...settledIdleViolations(snap, { indeterminate, reducedMotion: true }).map((x) => `reduce+none: ${x}`));
    v.push(...(await finalState(page)).map((x) => `reduce+none: ${x}`));
  } finally {
    await context.close();
  }
  return v;
}

test.describe('L9 motion and settled state (REQ-QUAL-23)', () => {
  test('every subject: entrance strip, settled idle, reduced motion', async ({ browser }, testInfo) => {
    test.setTimeout(60 * 60_000);
    const stories = await onePerSubject(await laneSubjects());
    const metas = await componentMetas();
    const failures: Record<string, string[]> = {};
    const strips: Record<string, { distinct: number; animations: number }> = {};
    for (const story of stories) {
      const states = metas.get(story.subject)?.states ?? [];
      const entrance = states.includes('open');
      const indeterminate = states.includes('indeterminate');
      const key = `${story.subject} (${story.id})`;
      try {
        const full = await fullMotion(browser, story, entrance, indeterminate);
        if (full.strip) strips[key] = full.strip;
        const reduce = await reducedMotion(browser, story, entrance, indeterminate);
        const v = [...full.violations, ...reduce];
        if (v.length) failures[key] = v;
      } catch (e) {
        failures[key] = [`lane error: ${(e as Error).message}`];
      }
    }
    await testInfo.attach('motion.json', { body: JSON.stringify({ subjects: stories.map((s) => s.id), strips, failures }, null, 2), contentType: 'application/json' });
    expect(stories.length).toBeGreaterThan(0);
    expect(failures).toEqual({});
  });

  test('no backdrop-filter on ::view-transition-* pseudo-elements', async ({ page }, testInfo) => {
    const [first] = await onePerSubject(await laneSubjects());
    await gotoStory(page, first!.id);
    const report = await page.evaluate(async () => {
      const violations: string[] = [];
      const unreadable: string[] = [];
      const visit = (rules: CSSRuleList) => {
        for (const rule of rules) {
          if ('cssRules' in rule && (rule as CSSGroupingRule).cssRules) visit((rule as CSSGroupingRule).cssRules);
          const style = (rule as CSSStyleRule).style;
          const sel = (rule as CSSStyleRule).selectorText;
          if (!style || !sel || !sel.includes('::view-transition')) continue;
          for (const p of ['backdrop-filter', '-webkit-backdrop-filter']) {
            const val = style.getPropertyValue(p).trim();
            if (val && val !== 'none') violations.push(`stylesheet: ${sel} { ${p}: ${val} }`);
          }
        }
      };
      for (const sheet of document.styleSheets) {
        try { visit(sheet.cssRules); } catch { unreadable.push(sheet.href ?? '(inline)'); }
      }
      let dynamic = false;
      const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void>; finished: Promise<void> } };
      if (typeof doc.startViewTransition === 'function') {
        dynamic = true;
        const names = new Set<string>(['root']);
        for (const el of document.querySelectorAll('*')) {
          const n = getComputedStyle(el).getPropertyValue('view-transition-name').trim();
          if (n && n !== 'none') names.add(n);
        }
        const vt = doc.startViewTransition(() => undefined);
        await vt.ready;
        for (const n of names) {
          for (const pseudo of ['group', 'image-pair', 'old', 'new']) {
            const cs = getComputedStyle(document.documentElement, `::view-transition-${pseudo}(${n})`);
            const val = `${cs.backdropFilter || 'none'}`;
            if (val !== 'none') violations.push(`::view-transition-${pseudo}(${n}) backdrop-filter: ${val}`);
          }
        }
        await vt.finished;
      }
      return { violations, unreadable, dynamic };
    });
    testInfo.annotations.push({ type: 'view-transition', description: `dynamic check: ${report.dynamic}; cross-origin sheets not scanned: ${report.unreadable.join(', ') || 'none'}` });
    expect(report.violations).toEqual([]);
  });

  test('negative control: an infinite non-compositor animation is rejected', async ({ browser }) => {
    const story = await fixtureStory(INFINITE_FIXTURE);
    const full = await fullMotion(browser, story, false, false);
    expect(full.violations.join('\n')).toMatch(/infinite animations/);
  });
});
