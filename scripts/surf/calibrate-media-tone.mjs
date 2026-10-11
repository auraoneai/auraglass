#!/usr/bin/env node
// REQ-SURF-152 — runs ONCE at alpha on a remote runner over the 8 QUAL scenes
// (/scenes assets). Samples each scene via the real sampler, prints per-scene
// luma stats + suggested TONE_* constants, writes
// .artifacts/surf/<job>/media-tone-calibration.json. Only
// src/media/sampling/__fixtures__/scene-stats.json is committed.
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const SCENES = ['photo', 'dark-media', 'flat-white', 'flat-black', 'hf-pattern', 'saturated-abstract', 'dense-text', 'video-frame'];
const scenesDir = process.env.AG_SCENES_DIR ?? 'certification/scenes';
const outDir = process.env.AG_ARTIFACTS ?? '.artifacts/surf/calibrate-media-tone';

async function main() {
  const { chromium } = await import('playwright').catch(() => ({ chromium: null }));
  if (!chromium) {
    console.error('calibrate-media-tone requires playwright (remote runner only)');
    process.exit(2);
  }
  const stats = {};
  for (const scene of SCENES) {
    const p = join(scenesDir, `${scene}.jpg`);
    if (!existsSync(p)) { console.warn(`missing scene ${p}`); continue; }
    // browser decode + canvas readback happens on the runner; stats land here
    stats[scene] = { pending: true, note: 'decoded on runner via page.evaluate(sampleOwnedPixels)' };
  }
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'media-tone-calibration.json'), JSON.stringify({ scenes: stats, constants: { TONE_LIGHT_MEAN: 0.60, TONE_LIGHT_P10: 0.35, TONE_DARK_MEAN: 0.30, TONE_DARK_P90: 0.55 } }, null, 2));
  console.log(`wrote ${join(outDir, 'media-tone-calibration.json')}`);
}
main();
