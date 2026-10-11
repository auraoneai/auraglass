// tests/e2e/surf/motion/idle.spec.ts — REQ-SURF-190 (REQ-FIN-90, AC-FIN-90)
// and the SURF loop-idle matrix (REQ-SURF-05: rAF suspends when hidden).
// L9 motion lane, remote only (fragments/lanes/surf.ts W1; Playwright project
// surf:motion in fragments/playwright/surf.json).
//
// Every SURF subject in QUAL's subject index (REPORTS.subjects, via
// listSubjects({ owner: 'SURF' })) is loaded at each motion setting
// (full / calm / none) with the OS at no-preference and left alone for
// 1,000 ms with no input. At rest a SURF story must show:
//   - 0 running animations (`document.getAnimations()` playState 'running'),
//   - 0 infinite animations and 0 pending rAF callbacks (QUAL perf.settledIdle, S-40).
// Under `none` it must additionally show no caret blink, no running dots, no
// `scroll-behavior: smooth`, and no entrance transform (no animation or
// transition on transform/translate/scale/rotate right after load).
// Loops (caret, dots, backdrop drift, carousel autoplay) run only under
// [data-ag-continuous="on"], which no motion global sets here.
//
// No SURF subject in the index is a failure, never a pass. A negative control
// injects an infinite animation into the first subject and requires the same
// probe to catch it, so the 0 above is never vacuous.
import { test, expect, type Page } from '@playwright/test';
import { gotoStory, listSubjects, perf } from '../../../helpers';
import type { MotionPreference } from '../../../../src/contracts/motion';

const MOTIONS = ['full', 'calm', 'none'] as const satisfies readonly MotionPreference[];
const SETTLE_MS = 1_000;

interface IdleProbe {
  running: string[];
  infiniteAnimations: number;
  pendingRaf: number;
}

/** Running animations described as "<target>: <name>" so a failure names the offender. */
async function runningAnimations(page: Page): Promise<string[]> {
  return page.evaluate(() => document.getAnimations()
    .filter((a) => a.playState === 'running')
    .map((a) => {
      const t = (a.effect as KeyframeEffect | null)?.target as Element | null | undefined;
      const part = t?.getAttribute?.('data-ag-part');
      const name = (a as CSSAnimation).animationName ?? (a as CSSTransition).transitionProperty ?? a.id ?? 'anonymous';
      const pseudo = (a.effect as KeyframeEffect | null)?.pseudoElement ?? '';
      return `${t ? `${t.tagName.toLowerCase()}${part ? `[data-ag-part=${part}]` : ''}${pseudo}` : '<no target>'}: ${name}`;
    }));
}

/** Waits SETTLE_MS with no input, then samples animations and rAF. */
async function probeIdle(page: Page): Promise<IdleProbe> {
  const idle = await perf.settledIdle(page, { afterMs: SETTLE_MS });
  return { running: await runningAnimations(page), infiniteAnimations: idle.infiniteAnimations, pendingRaf: idle.pendingRaf };
}

/** Animations/transitions that move geometry, sampled right after the story is ready. */
async function entranceTransforms(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const MOVES = /^(transform|translate|scale|rotate)$/;
    const out: string[] = [];
    for (const a of document.getAnimations()) {
      const effect = a.effect as KeyframeEffect | null;
      if (!effect) continue;
      const props = new Set<string>();
      for (const kf of effect.getKeyframes()) {
        for (const k of Object.keys(kf)) if (!['offset', 'easing', 'composite', 'computedOffset'].includes(k)) props.add(k);
      }
      if ((a as CSSTransition).transitionProperty) props.add((a as CSSTransition).transitionProperty);
      const moving = [...props].filter((p) => MOVES.test(p));
      if (moving.length) {
        const t = effect.target as Element | null;
        out.push(`${t?.getAttribute?.('data-ag-part') ?? t?.tagName.toLowerCase() ?? '<no target>'}: ${moving.join(',')}`);
      }
    }
    return out;
  });
}

/** The `none`-only checks: caret, dots, smooth scrolling. */
async function noneChecks(page: Page) {
  return page.evaluate(() => {
    const animated = (el: Element, pseudo?: string) => {
      const cs = getComputedStyle(el, pseudo);
      return cs.animationName !== 'none' && cs.animationName !== '';
    };
    const carets = [...document.querySelectorAll('[data-ag-part="caret"]')];
    const dots = [...document.querySelectorAll('[data-ag-part="running-dots"], [data-ag-part="typing-dot"]')];
    const smooth: string[] = [];
    for (const el of [document.documentElement, document.body, ...document.querySelectorAll('*')]) {
      if (getComputedStyle(el).scrollBehavior === 'smooth') {
        smooth.push(el.getAttribute('data-ag-part') ?? el.tagName.toLowerCase());
      }
    }
    return {
      blinkingCarets: carets.filter((c) => animated(c)).length,
      runningDots: dots.filter((d) => {
        const after = getComputedStyle(d, '::after').content;
        return animated(d) || animated(d, '::after') ||
          (d.getAttribute('data-ag-part') === 'running-dots' && after !== 'none' && after !== 'normal' && after !== '');
      }).length,
      smooth,
    };
  });
}

/** The storybook decorator writes the motion global on the story root; the run must be at that setting. */
async function storyMotion(page: Page): Promise<string | null> {
  return page.evaluate(() => document.querySelector('[data-ag-root][data-ag-motion]')?.getAttribute('data-ag-motion') ?? null);
}

test.describe('SURF motion idle (REQ-SURF-190)', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
  });

  test('the SURF subject index is not empty', async () => {
    const subjects = await listSubjects({ owner: 'SURF' });
    expect(subjects.length, 'no SURF subjects in REPORTS.subjects (QUAL cert-manifest) — L9 cannot run').toBeGreaterThan(0);
  });

  for (const motion of MOTIONS) {
    test(`every SURF subject is idle 1,000 ms after load at motion=${motion}`, async ({ page }) => {
      const subjects = await listSubjects({ owner: 'SURF' });
      expect(subjects.length, 'no SURF subjects in REPORTS.subjects').toBeGreaterThan(0);
      const failures: string[] = [];
      for (const subject of subjects) {
        await test.step(`${subject.id} @ ${motion}`, async () => {
          await gotoStory(page, subject.id, { motion });
          expect(await storyMotion(page), `${subject.id}: story root is not at motion=${motion}`).toBe(motion);
          const entrance = motion === 'none' ? await entranceTransforms(page) : [];
          const idle = await probeIdle(page);
          const row = [
            idle.running.length ? `${idle.running.length} running animation(s): ${idle.running.join('; ')}` : '',
            idle.infiniteAnimations ? `${idle.infiniteAnimations} infinite animation(s)` : '',
            idle.pendingRaf ? `${idle.pendingRaf} pending rAF callback(s)` : '',
          ];
          if (motion === 'none') {
            const n = await noneChecks(page);
            row.push(
              entrance.length ? `entrance transform under none: ${entrance.join('; ')}` : '',
              n.blinkingCarets ? `${n.blinkingCarets} blinking caret(s)` : '',
              n.runningDots ? `${n.runningDots} running dot part(s)` : '',
              n.smooth.length ? `scroll-behavior: smooth on ${n.smooth.join(', ')}` : '',
            );
          }
          const msg = row.filter(Boolean);
          if (msg.length) failures.push(`${subject.id} @ ${motion}: ${msg.join(' | ')}`);
        });
      }
      expect(failures, `SURF stories not idle at motion=${motion}`).toEqual([]);
    });
  }

  test('negative control: an injected infinite animation is caught by the same probe', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    expect(subjects.length, 'no SURF subjects in REPORTS.subjects').toBeGreaterThan(0);
    const subject = subjects[0]!;
    await gotoStory(page, subject.id, { motion: 'full' });
    await page.addStyleTag({
      content: '@keyframes ag-idle-probe { from { opacity: 1; } to { opacity: 0.5; } }'
        + ' [data-ag-root] > * { animation: ag-idle-probe 300ms linear infinite; }',
    });
    const idle = await probeIdle(page);
    expect(idle.running.length, `${subject.id}: injected loop not seen as running`).toBeGreaterThan(0);
    expect(idle.infiniteAnimations, `${subject.id}: injected loop not seen as infinite`).toBeGreaterThan(0);
  });

  test('every shipped SURF subject suspends rAF when hidden (REQ-SURF-05)', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    expect(subjects.length, 'no SURF subjects registered in the subject index').toBeGreaterThan(0);
    for (const subject of subjects) {
      await test.step(subject.id, async () => {
        await gotoStory(page, subject.id);
        await page.evaluate(() => {
          (window as any).__rafCount = 0;
          const orig = requestAnimationFrame.bind(window);
          (window as any).requestAnimationFrame = (cb: FrameRequestCallback) =>
            orig((t) => { (window as any).__rafCount++; cb(t); });
        });
        await page.evaluate(() => {
          Object.defineProperty(document, 'visibilityState', { value: 'hidden' });
          document.dispatchEvent(new Event('visibilitychange'));
        });
        const before = await page.evaluate(() => (window as any).__rafCount);
        await page.waitForTimeout(300);
        const after = await page.evaluate(() => (window as any).__rafCount);
        expect(after - before, `${subject.id} kept animating while hidden`).toBeLessThanOrEqual(1);
      });
    }
  });
});
