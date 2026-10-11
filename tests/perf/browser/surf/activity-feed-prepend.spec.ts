// REQ-SURF-97 perf (remote Playwright, L10, chromium): prepending to the
// day-grouped ActivityFeed (Default story) stays inside the declared frame
// budget. The budget row is read from fragments/perf-budgets/surf.ts
// (subject surf/activity-feed--default, profile mid-mobile, frame-p95-ms) —
// never restated here — and the mid-mobile profile is the perf harness's
// throttled mobile profile (tests/perf/harness/run-perf.mjs PROFILES.b:
// 390x844, 4x CPU throttle via CDP). Frames are sampled with the shared
// perf.frames probe while ten prepends of three items run, one per 200 ms.
// The measurement is attached as JSON. Fails — never skips — when the story
// is missing.
import { test, expect } from '@playwright/test';
import { gotoStory, listSubjects, perf } from '../../../helpers';
import budgets from '../../../../fragments/perf-budgets/surf';
import { PROFILES } from '../../harness/run-perf.mjs';

const SUBJECT = 'surf/activity-feed--default';
const PREPENDS = 10;

test.describe('activity feed prepend perf (REQ-SURF-97)', () => {
  test('day-grouping prepend under the mid-mobile frame budget', async ({ page, browserName }, testInfo) => {
    expect(browserName, 'mid-mobile throttling uses the Chromium CDP session').toBe('chromium');
    const row = (budgets as ReadonlyArray<{ subject: string; profile: string; metric: string; max: number }>).find(
      (r) => r.subject === SUBJECT && r.profile === 'mid-mobile' && r.metric === 'frame-p95-ms',
    );
    expect(row, `${SUBJECT} mid-mobile frame-p95-ms row in fragments/perf-budgets/surf.ts`).toBeDefined();
    const profile = PROFILES.b;
    await page.setViewportSize(profile.viewport);

    const subjects = await listSubjects({});
    const story = subjects.find((s) => (s.subject === 'ActivityFeed' || s.subject === 'activity-feed') && s.id.endsWith('--default'));
    expect(story, 'ActivityFeed Default story must be registered').toBeDefined();
    await gotoStory(page, story!.id);
    const items = page.locator('[data-ag-part="activity-feed"] [data-ag-part="timeline-item"]');
    await expect(items).toHaveCount(4);

    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: profile.cpuThrottle });
    let result: { p95Ms: number; longTasks: number };
    try {
      result = await perf.frames(page, {
        durationMs: PREPENDS * 200,
        during: async () => {
          for (let i = 0; i < PREPENDS; i++) {
            await page.getByTestId('feed-prepend').click();
            await page.waitForTimeout(200);
          }
        },
      });
    } finally {
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
    }

    // the measured window covered real prepends into the day groups
    await expect(items).toHaveCount(4 + PREPENDS * 3);
    await testInfo.attach('activity-feed-prepend.json', {
      contentType: 'application/json',
      body: JSON.stringify({ subject: SUBJECT, profile: profile.name, cpuThrottle: profile.cpuThrottle, prepends: PREPENDS, itemsPerPrepend: 3, ...result, budget: row }),
    });
    expect(result.p95Ms).toBeLessThanOrEqual(row!.max);
  });
});
