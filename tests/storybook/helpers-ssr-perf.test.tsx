/**
 * @jest-environment jsdom
 */
/* REQ-QUAL-21 / REQ-QUAL-23 (FIN-440): unit tests against the S-40 helper API
   in tests/helpers/index.ts. The helper internals are FIN-A's (REQ-FIN-08,
   clause transfer); these tests pin the behaviour the QUAL lanes rely on:

   - renderAgServer().hydrate() resolves only after hydration has committed,
     so a hydration mismatch warning raised by React is in `warnings`
     (the helper must await hydration — act + microtask flush — before it
     restores console);
   - perf.frames() leaves no rAF scheduled once it returns, so a following
     perf.settledIdle() reports 0 pending rAF;
   - perf.settledIdle() counts live intervals (S-40 `intervals`), not a
     constant.

   They run against a Playwright-shaped page adapter whose evaluate() runs the
   page function in this jsdom window (jest-environment-jsdom is
   pretendToBeVisual, so requestAnimationFrame ticks). */
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import * as React from 'react';
import { perf, renderAgServer } from '../helpers';

type PageLike = Parameters<typeof perf.frames>[0];

/** Minimal Playwright Page adapter over the jsdom window. */
const jsdomPage = (): PageLike => ({
  evaluate: async (fn: (arg?: unknown) => unknown, arg?: unknown) => fn(arg),
  waitForTimeout: (ms: number) => new Promise<void>((r) => setTimeout(r, ms)),
} as unknown as PageLike);

describe('renderAgServer (S-40) awaits hydration', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it('collects the hydration mismatch React reports for a Date.now() render', async () => {
    let now = 1_000;
    jest.spyOn(Date, 'now').mockImplementation(() => (now += 1_000));
    const Clock = () => <time data-ag-part="clock">{String(Date.now())}</time>;
    const server = renderAgServer(<Clock />);
    expect(server.html).toMatch(/<time data-ag-part="clock">\d+<\/time>/);
    const { warnings } = await server.hydrate();
    expect(warnings.length).toBeGreaterThan(0);
    expect(warnings.join('\n')).toMatch(/hydrat/i);
  });

  it('reports no warnings for a deterministic tree', async () => {
    const Stable = () => <p data-ag-part="body">stable text</p>;
    const { warnings } = await renderAgServer(<Stable />).hydrate();
    expect(warnings).toEqual([]);
  });

  it('has hydrated (event handlers attached) when hydrate() resolves', async () => {
    const clicks: number[] = [];
    const Btn = () => <button type="button" onClick={() => clicks.push(1)}>go</button>;
    const server = renderAgServer(<Btn />);
    await server.hydrate();
    const btn = [...document.querySelectorAll('button')].find((b) => b.textContent === 'go');
    expect(btn).toBeDefined();
    btn!.click();
    expect(clicks).toEqual([1]);
  });
});

describe('perf.frames / perf.settledIdle (S-40)', () => {
  // jsdom has no Web Animations API and no PerformanceObserver; every certified
  // engine has both. Neither produces entries here (no animations, no long tasks).
  const g = globalThis as unknown as { PerformanceObserver?: unknown };
  const hadPO = 'PerformanceObserver' in g;
  beforeEach(() => {
    (document as unknown as { getAnimations: () => Animation[] }).getAnimations = () => [];
    if (!hadPO) {
      g.PerformanceObserver = class { observe(): void {} disconnect(): void {} takeRecords(): [] { return []; } };
    }
  });
  afterEach(() => {
    delete (document as unknown as { getAnimations?: unknown }).getAnimations;
    if (!hadPO) delete g.PerformanceObserver;
  });
  it('perf.frames cancels its rAF loop: settledIdle afterwards reports 0 pending rAF', async () => {
    const page = jsdomPage();
    const res = await perf.frames(page, { durationMs: 80 });
    expect(typeof res.p95Ms).toBe('number');
    const idle = await perf.settledIdle(page, { afterMs: 80 });
    expect(idle.pendingRaf).toBe(0);
  });

  it('perf.settledIdle counts an interval started during the settle window and still live', async () => {
    const page = jsdomPage();
    let id: number | undefined;
    // the "subject" starts a polling interval while settledIdle is observing
    const starter = setTimeout(() => { id = window.setInterval(() => undefined, 1_000); }, 10);
    try {
      const busy = await perf.settledIdle(page, { afterMs: 60 });
      expect(id).toBeDefined();
      expect(busy.intervals).toBeGreaterThanOrEqual(1);
    } finally {
      clearTimeout(starter);
      if (id !== undefined) window.clearInterval(id);
    }
  });

  it('perf.settledIdle reports 0 intervals when an interval is started and cleared within the window', async () => {
    const page = jsdomPage();
    const starter = setTimeout(() => {
      const id = window.setInterval(() => undefined, 1_000);
      setTimeout(() => window.clearInterval(id), 10);
    }, 5);
    try {
      const idle = await perf.settledIdle(page, { afterMs: 60 });
      expect(idle.intervals).toBe(0);
    } finally {
      clearTimeout(starter);
    }
  });
});
