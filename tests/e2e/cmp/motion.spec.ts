/* REQ-CMP-138 (lane L9). CMP motion contract: gated continuous motion honors
   prefers-reduced-motion and the data-ag-continuous flag — no un-gated loops. */
import { test, expect } from "@playwright/test";
import { gotoStory } from "../../helpers/index";
import { ANIMATABLE, type MotionPreference } from "../../../src/contracts/motion";

test.describe("cmp motion (L9)", () => {
  test("no continuous animation without data-ag-continuous opt-in", async ({
    page,
  }) => {
    await gotoStory(page, "flagships-controls-switch--default").catch(() =>
      gotoStory(page, "flagships-controls-button--default")
    );
    const ungated = await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll("[data-ag-surface] *"));
      return els.filter((el) => {
        const cs = getComputedStyle(el);
        if (cs.animationName === "none" || cs.animationName === "")
          return false;
        if (cs.animationPlayState !== "running") return false;
        if (
          !Number.isFinite(parseFloat(cs.animationIterationCount)) ||
          cs.animationIterationCount === "infinite"
        ) {
          return !el.closest("[data-ag-continuous]");
        }
        return false;
      }).length;
    });
    expect(ungated).toBe(0);
  });

  test("reduced motion collapses transitions on interactive surfaces", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await gotoStory(page, "flagships-controls-button--default").catch(() =>
      gotoStory(page, "flagships-controls-switch--default")
    );
    const leaking = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll('button, [role="switch"], input')
      ).filter((el) => {
        const cs = getComputedStyle(el);
        return (
          cs.animationName !== "none" &&
          cs.animationPlayState === "running" &&
          (cs.animationIterationCount === "infinite" ||
            parseFloat(cs.animationDuration) > 0.2)
        );
      }).length;
    });
    expect(leaking).toBe(0);
  });
});

/* REQ-CMP-18 (REQ-FIN-70): computed-style half of the CMP motion contract,
   run in every motion mode (full / calm / none) on the remote e2e lane.
   - transitionProperty ⊆ ANIMATABLE (src/contracts/motion.ts) for every leg
     with a non-zero duration; under `none` no part transitions at all;
   - transform is identity at rest, hover and press;
   - nothing is running at rest (document.getAnimations());
   - loading spinners are static under calm/none, spin with a finite
     iteration count under full, and never read allowContinuous
     (data-ag-continuous on/off leaves them unchanged).
   The static half (no `infinite` outside Skeleton, gating, no
   --ag-ease-spring) is tests/foundation/motion-loops.test.ts. */

const MODES: readonly MotionPreference[] = ['full', 'calm', 'none'];

/* control stories whose pointer feedback must stay inside ANIMATABLE
   (Storybook ids from stories/cmp/components/*.stories.tsx titles). */
const CONTROL_STORIES = [
  'flagships-controls-button--default',
  'flagships-controls-checkbox--default',
  'flagships-controls-switch--default',
  'flagships-controls-slider--default',
  'flagships-controls-select--default',
  'flagships-controls-textfield--default',
] as const;

/* loading stories and the spinner element each renders */
const SPINNER_STORIES = [
  { story: 'flagships-controls-button--width-stability', spinner: '.ag-button [data-ag-part="spinner"]' },
  { story: 'flagships-controls-combobox--loading', spinner: '.ag-combobox-spin' },
  { story: 'flagships-controls-searchfield--default', spinner: '.ag-search-field [data-ag-part="spinner"]' },
  { story: 'core-loadingstate--default', spinner: '.ag-state-view-spinner' },
] as const;

const IDENTITY = /^(none|matrix\(1, 0, 0, 1, 0, 0\))$/;

type Leg = { part: string; property: string; durationS: number };

test.describe('cmp motion contract (REQ-CMP-18)', () => {
  for (const motion of MODES) {
    for (const storyId of CONTROL_STORIES) {
      test(`${storyId} [${motion}]: transitions list only ANIMATABLE properties`, async ({ page }) => {
        await gotoStory(page, storyId, { motion });
        const legs: Leg[] = await page.evaluate(() =>
          Array.from(document.querySelectorAll('[data-ag-part]')).flatMap((el) => {
            const cs = getComputedStyle(el);
            const props = cs.transitionProperty.split(',').map((s) => s.trim());
            const durs = cs.transitionDuration.split(',').map((s) => parseFloat(s) || 0);
            const part = el.getAttribute('data-ag-part') ?? '';
            // CSS repeats the duration list to the property list's length
            return props.map((property, i) => ({ part, property, durationS: durs[i % durs.length] }));
          }),
        );
        expect(legs.length).toBeGreaterThan(0);
        const live = legs.filter((l) => l.durationS > 0);
        if (motion === 'none') {
          expect(live).toEqual([]);
        } else {
          const allowed = new Set<string>(ANIMATABLE);
          expect(live.filter((l) => !allowed.has(l.property))).toEqual([]);
        }
      });

      test(`${storyId} [${motion}]: transform is identity at rest, hover and press`, async ({ page }) => {
        await gotoStory(page, storyId, { motion });
        // the pointer target: the control root, or Select's trigger (it has no root part)
        const part = page.locator('[data-ag-part="root"], [data-ag-part="trigger"]').first();
        await expect(part).toBeVisible();
        const transformOf = () => part.evaluate((el) => getComputedStyle(el).transform);
        expect(await transformOf()).toMatch(IDENTITY);
        await part.hover();
        expect(await transformOf()).toMatch(IDENTITY);
        await page.mouse.down();
        const atPress = await transformOf();
        await page.mouse.up();
        expect(atPress).toMatch(IDENTITY);
      });

      test(`${storyId} [${motion}]: nothing is running at rest`, async ({ page }) => {
        await gotoStory(page, storyId, { motion });
        await page.mouse.move(0, 0);
        // entry transitions may still be settling; at rest the count must reach 0
        await expect
          .poll(
            () =>
              page.evaluate(
                () => document.getAnimations().filter((a) => a.playState === 'running').length,
              ),
            { timeout: 5_000 },
          )
          .toBe(0);
      });
    }

    for (const { story, spinner } of SPINNER_STORIES) {
      test(`${story} [${motion}]: spinner is ${motion === 'full' ? 'finite' : 'static'} and ignores allowContinuous`, async ({ page }) => {
        await gotoStory(page, story, { motion });
        await expect(page.locator(spinner).first()).toBeAttached();
        const read = () =>
          page.evaluate((sel) => {
            const cs = getComputedStyle(document.querySelector(sel) as Element);
            return { name: cs.animationName, count: cs.animationIterationCount };
          }, spinner);
        const before = await read();
        if (motion === 'full') {
          expect(before.name).not.toBe('none');
          expect(before.count).not.toBe('infinite');
          expect(Number(before.count)).toBeGreaterThan(0);
        } else {
          expect(before.name).toBe('none');
        }
        // REQ-CMP-18: only Skeleton shimmer reads allowContinuous
        const toggled = await page.evaluate((sel) => {
          const host = document.querySelector('[data-ag-motion]') ?? document.documentElement;
          const had = host.getAttribute('data-ag-continuous');
          if (had === 'on') host.removeAttribute('data-ag-continuous');
          else host.setAttribute('data-ag-continuous', 'on');
          const cs = getComputedStyle(document.querySelector(sel) as Element);
          return { name: cs.animationName, count: cs.animationIterationCount };
        }, spinner);
        expect(toggled).toEqual(before);
      });
    }
  }
});
