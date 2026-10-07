/* MAT-237 (REQ-MOT-74): idle counter — instruments requestAnimationFrame and
 * setInterval before page scripts run (addInitScript), counts callbacks, and
 * keeps stack traces filtered to AuraGlass chunk URLs so a spec can attribute
 * library rAF/interval activity. Reuses QA-076's counter convention:
 * window.__agRafCount / __agIntervalCount / __agRafStacks. */
import type { Page } from '@playwright/test';

export const IDLE_INIT_SCRIPT = `
(() => {
  const w = window;
  w.__agRafCount = 0;
  w.__agIntervalCount = 0;
  w.__agRafStacks = [];
  w.__agIntervalStacks = [];
  const origRaf = w.requestAnimationFrame.bind(w);
  const origSi = w.setInterval.bind(w);
  const origCi = w.clearInterval.bind(w);
  const origCf = w.cancelAnimationFrame.bind(w);
  w.requestAnimationFrame = (cb) => {
    w.__agRafCount++;
    const stack = new Error('raf').stack ?? '';
    w.__agRafStacks.push(stack);
    return origRaf(cb);
  };
  w.setInterval = (cb, ms, ...a) => {
    w.__agIntervalCount++;
    w.__agIntervalStacks.push(new Error('interval').stack ?? '');
    return origSi(cb, ms, ...a);
  };
  w.clearInterval = (id) => origCi(id);
  w.cancelAnimationFrame = (id) => origCf(id);
})();
`;

/** Install the idle counter before any page script runs. Call before gotoStory. */
export const instrumentIdle = async (page: Page): Promise<void> => {
  await page.addInitScript(IDLE_INIT_SCRIPT);
};

export interface IdleStats {
  rafCount: number;
  intervalCount: number;
  /** stacks whose frames mention an AuraGlass chunk URL (chunk filename match). */
  agRafStacks: string[];
  agIntervalStacks: string[];
}

const AG_CHUNK = /aura-glass|auraglass|chunk-[A-Za-z0-9_-]+\.(js|mjs)|src\/motion/i;

export const readIdle = async (page: Page): Promise<IdleStats> =>
  page.evaluate((re) => {
    const w = window as unknown as {
      __agRafCount: number; __agIntervalCount: number;
      __agRafStacks: string[]; __agIntervalStacks: string[];
    };
    const rx = new RegExp(re, 'i');
    return {
      rafCount: w.__agRafCount ?? 0,
      intervalCount: w.__agIntervalCount ?? 0,
      agRafStacks: (w.__agRafStacks ?? []).filter((s) => rx.test(s)),
      agIntervalStacks: (w.__agIntervalStacks ?? []).filter((s) => rx.test(s)),
    };
  }, AG_CHUNK.source);

/** Wait `ms`, then return stats accumulated in that window only. */
export const idleFor = async (page: Page, ms: number): Promise<IdleStats> => {
  const before = await readIdle(page);
  await page.waitForTimeout(ms);
  const after = await readIdle(page);
  return {
    rafCount: after.rafCount - before.rafCount,
    intervalCount: after.intervalCount - before.intervalCount,
    agRafStacks: after.agRafStacks.slice(before.agRafStacks.length),
    agIntervalStacks: after.agIntervalStacks.slice(before.agIntervalStacks.length),
  };
};
