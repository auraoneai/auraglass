// sampling-engines.spec.ts — SURF-439 (REQ-SURF-151, AC-SURF-19), L8.
// Runs under the surf:cert-media-sampling-{chromium,firefox,webkit} projects
// (fragments/playwright/surf.json). Each engine decodes the 8 QUAL S-42
// scenes as <img crossOrigin="anonymous"> on a loopback harness page that
// carries the REAL sampler bundle (scripts/surf/media-sampling-harness.mjs),
// samples each scene with sampleOwnedPixels and asserts the measured stats;
// a cross-origin image without CORS yields no stats and exactly one warning.
import { test, expect } from '@playwright/test';
import {
  bundleSampler, readScenes, sampleScenesInPage, startSamplingServer,
} from '../../../../scripts/surf/media-sampling-harness.mjs';

type Server = { origin: string; close: () => Promise<void> };
type Stats = { mean: number; p10: number; p90: number; stdev: number };
type Sample = { id: string; naturalWidth: number; stats: Stats | null; tone: 'light' | 'dark' | null };

const scenes = readScenes();
let harness: Server;
let noCors: Server;

test.beforeAll(async () => {
  const bundle = await bundleSampler({ mode: 'development' });
  harness = await startSamplingServer({ bundle });
  noCors = await startSamplingServer({ bundle: null, cors: false });
});
test.afterAll(async () => {
  await harness?.close();
  await noCors?.close();
});

test.describe('media sampling engines (SURF-439, REQ-SURF-151)', () => {
  test('the scene manifest lists exactly the 8 S-42 ids', () => {
    expect(scenes.map((s) => s.id)).toHaveLength(8);
  });

  for (const scene of scenes) {
    test(`${scene.id}: decoded and sampled by the real sampler`, async ({ page }) => {
      await page.goto(`${harness.origin}/`);
      const [r] = (await sampleScenesInPage(page, { origin: harness.origin, scenes: [scene] })) as Sample[];
      expect(r!.id).toBe(scene.id);
      expect(r!.naturalWidth, 'decoded').toBeGreaterThan(0);
      expect(r!.stats, 'sampled (canvas not tainted)').not.toBeNull();
      const s = r!.stats!;
      for (const v of [s.mean, s.p10, s.p90, s.stdev]) {
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(1);
      }
      expect(s.p10).toBeLessThanOrEqual(s.mean);
      expect(s.mean).toBeLessThanOrEqual(s.p90);
    });
  }

  test('flat-white measures mean >= 0.999 and classifies light; flat-black mean <= 0.001 and dark', async ({ page }) => {
    await page.goto(`${harness.origin}/`);
    const flats = scenes.filter((s) => s.id === 'flat-white' || s.id === 'flat-black');
    const [white, black] = (await sampleScenesInPage(page, { origin: harness.origin, scenes: flats })) as Sample[];
    expect([white!.id, black!.id]).toEqual(['flat-white', 'flat-black']);
    expect(white!.stats!.mean).toBeGreaterThanOrEqual(0.999);
    expect(white!.tone).toBe('light');
    expect(black!.stats!.mean).toBeLessThanOrEqual(0.001);
    expect(black!.tone).toBe('dark');
  });

  test('a CORS-less cross-origin image yields no stats and exactly one dev warning', async ({ page }) => {
    const warnings: string[] = [];
    page.on('console', (m) => { if (m.type() === 'warning') warnings.push(m.text()); });
    await page.goto(`${harness.origin}/`);
    const scene = scenes.find((s) => s.id === 'photo')!;
    const tainted = (await sampleScenesInPage(page, { origin: noCors.origin, scenes: [scene, scene], crossOrigin: null })) as Sample[];
    expect(tainted).toHaveLength(2);
    for (const r of tainted) {
      expect(r.naturalWidth).toBeGreaterThan(0);
      expect(r.stats).toBeNull();
      expect(r.tone).toBeNull();
    }
    const corsWarnings = warnings.filter((w) => w.startsWith('[aura-glass] Cannot sample'));
    expect(corsWarnings).toEqual([
      `[aura-glass] Cannot sample ${noCors.origin}/scenes/${scene.file}: add crossOrigin="anonymous" and CORS headers, or pass mediaTone="light|dark" to Backdrop.`,
    ]);
  });
});
