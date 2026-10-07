/* CMP-386 (lane 3i-Q). Remote perf lane only — runs under AG_REMOTE_RUNNER=1 on
   the PRD-PERF harness (tests/perf/harness/run-perf.mjs + grade.mjs). This file
   registers the cases; harness seam lands with PRD-PERF. */
import { test, expect } from '@playwright/test';
import { gotoStory, perf } from '../../../helpers/index';

test.skip(!process.env.AG_REMOTE_RUNNER, 'remote perf lane only (AG_REMOTE_RUNNER=1)');


test.describe('overlay infinite animations audit (CMP-386)', () => {
  test('0 animations with iterations===Infinity under hover+scroll on glass-modal', async ({ page }) => {
    await gotoStory(page, 'glass-modal--default').catch(() => gotoStory(page, 'overlays-dialog--default'));
    // runtime-remote.md §5 hover+scroll script
    await page.mouse.move(200, 200);
    await page.mouse.wheel(0, 300);
    await page.waitForTimeout(600);

    const infinite = await page.evaluate(() =>
      document.getAnimations()
        .filter((a) => {
          const t = a.effect?.getTiming();
          return t?.iterations === Infinity;
        })
        .map((a) => {
          const el = (a.effect as KeyframeEffect | null)?.target as Element | null;
          const path: string[] = [];
          let n = el;
          while (n && path.length < 6) {
            path.unshift(n.tagName.toLowerCase() + (n.id ? `#${n.id}` : ''));
            n = n.parentElement;
          }
          return {
            name: (a as CSSAnimation).animationName ?? a.id,
            target: path.join(' > '),
          };
        }),
    );
    await page.evaluate((rows) => console.info('AG-INFINITE-ANIMATIONS', JSON.stringify(rows)), infinite);
    expect(infinite).toEqual([]);
  });
});
