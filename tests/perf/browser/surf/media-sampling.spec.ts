// media-sampling.spec.ts — SURF-496 (REQ-SURF-153, AC-SURF-19), L10.
// The real sampler (scripts/surf/media-sampling-harness.mjs bundle) samples a
// QUAL scene at 10 seek positions (10 regions → 10 cache misses) under a 4×
// CPU throttle. Every sample is one getImageData and one performance measure
// 'ag:sample'; the slowest measure must stay <= 4 ms. CPU throttling is a
// Chromium DevTools capability, so this file always runs in Chromium.
import { test, expect } from '@playwright/test';
import { bundleSampler, readScenes, startSamplingServer } from '../../../../scripts/surf/media-sampling-harness.mjs';

test.use({ browserName: 'chromium' });

const BUDGET_MS = 4;
const SEEKS = 10;
const scene = readScenes().find((s) => s.id === 'video-frame')!;
let harness: { origin: string; close: () => Promise<void> };

test.beforeAll(async () => {
  harness = await startSamplingServer({ bundle: await bundleSampler({ mode: 'production' }) });
});
test.afterAll(async () => { await harness?.close(); });

test.describe('media sampling perf (SURF-496, REQ-SURF-153)', () => {
  test(`${SEEKS} seek samples at 4× CPU throttle: one getImageData each, max ag:sample <= ${BUDGET_MS} ms`, async ({ page }) => {
    await page.goto(`${harness.origin}/`);
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    const result = await page.evaluate(async ({ src, seeks }) => {
      const api = (globalThis as unknown as { __agSampling: { sampleOwnedPixels: (el: HTMLImageElement, r?: object) => unknown } }).__agSampling;
      let reads = 0;
      for (const proto of [CanvasRenderingContext2D.prototype, OffscreenCanvasRenderingContext2D.prototype]) {
        const real = proto.getImageData;
        proto.getImageData = function getImageData(this: never, ...a: Parameters<typeof real>) { reads += 1; return real.apply(this, a); } as typeof real;
      }
      const img = document.createElement('img');
      img.crossOrigin = 'anonymous';
      img.src = src;
      document.body.append(img);
      await img.decode();
      performance.clearMeasures('ag:sample');
      const sampled: boolean[] = [];
      for (let i = 0; i < seeks; i++) {
        // each seek lands on a new region of the frame → a fresh sample
        sampled.push(api.sampleOwnedPixels(img, { x: i * 9, y: 0, width: 10, height: 100 }) !== null);
      }
      return { reads, sampled, measures: performance.getEntriesByName('ag:sample', 'measure').map((m) => m.duration) };
    }, { src: `${harness.origin}/scenes/${scene.file}`, seeks: SEEKS });
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });

    expect(result.sampled).toEqual(Array(SEEKS).fill(true));
    expect(result.reads).toBe(SEEKS);
    expect(result.measures).toHaveLength(SEEKS);
    test.info().annotations.push({ type: 'ag:sample max ms', description: Math.max(...result.measures).toFixed(3) });
    expect(Math.max(...result.measures)).toBeLessThanOrEqual(BUDGET_MS);
  });
});
