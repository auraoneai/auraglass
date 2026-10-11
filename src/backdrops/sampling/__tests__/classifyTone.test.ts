/** @jest-environment node */
import { describe, expect, it } from '@jest/globals';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { classifyTone, TONE_DARK_MEAN, TONE_DARK_P90, TONE_LIGHT_MEAN, TONE_LIGHT_P10 } from '../classifyTone';
import { sceneIds } from '../../../../scripts/surf/media-sampling-harness.mjs';
import anchorsFile from '../__fixtures__/scene-anchors.json';

const SCENES = sceneIds();

type SceneStat = { mean: number; p10: number; p90: number; stdev: number; expect: 'light' | 'dark' | 'busy' };
type Fixture = { generatedBy: string; source: { job: string | null; sha: string | null; engine: string }; scenes: Record<string, SceneStat> };

// Written only by `scripts/surf/calibrate-media-tone.mjs --write --from <CI artifact>`.
const FIXTURE = join(__dirname, '..', '__fixtures__', 'scene-stats.json');
const loadFixture = (): Fixture => {
  if (!existsSync(FIXTURE)) {
    throw new Error('scene-stats.json is missing: run the GitLab job surf:test:media-tone-calibration, download '
      + 'media-tone-calibration.json and run `node scripts/surf/calibrate-media-tone.mjs --write --from <artifact>`');
  }
  return JSON.parse(readFileSync(FIXTURE, 'utf8')) as Fixture;
};
const asTone = (t: SceneStat['expect']) => (t === 'busy' ? undefined : t);

describe('classifyTone (REQ-SURF-152)', () => {
  it.each([
    [{ mean: TONE_LIGHT_MEAN, p10: TONE_LIGHT_P10, p90: 1, stdev: 0 }, 'light'],
    [{ mean: TONE_LIGHT_MEAN - 0.01, p10: 0.9, p90: 1, stdev: 0 }, undefined],
    [{ mean: TONE_LIGHT_MEAN, p10: TONE_LIGHT_P10 - 0.01, p90: 1, stdev: 0 }, undefined],
    [{ mean: TONE_DARK_MEAN, p10: 0, p90: TONE_DARK_P90, stdev: 0 }, 'dark'],
    [{ mean: TONE_DARK_MEAN + 0.01, p10: 0, p90: 0.4, stdev: 0 }, undefined],
    [{ mean: TONE_DARK_MEAN, p10: 0, p90: TONE_DARK_P90 + 0.01, stdev: 0 }, undefined],
    [{ mean: 0.45, p10: 0.4, p90: 0.5, stdev: 0 }, undefined],
  ])('boundary %# → %s', (stats, out) => {
    expect(classifyTone(stats)).toBe(out);
  });
});

describe('classifyTone on the measured QUAL scenes (REQ-SURF-152)', () => {
  it('scene-stats.json is the calibration output for exactly the 8 S-42 scenes', () => {
    const f = loadFixture();
    expect(f.generatedBy).toMatch(/^scripts\/surf\/calibrate-media-tone\.mjs --write/);
    expect(f.source.job).toMatch(/^https:\/\/gitlab\.com\/.+\/-\/jobs\/\d+$/);
    expect(f.source.sha).toMatch(/^[0-9a-f]{40}$/);
    expect(Object.keys(f.scenes).sort()).toEqual([...SCENES].sort());
    for (const s of Object.values(f.scenes)) {
      for (const k of ['mean', 'p10', 'p90', 'stdev'] as const) {
        expect(s[k]).toBeGreaterThanOrEqual(0);
        expect(s[k]).toBeLessThanOrEqual(1);
      }
      expect(s.p10).toBeLessThanOrEqual(s.p90);
    }
  });

  it.each(Object.entries(anchorsFile.anchors))('anchor %s classifies as %s on its measured stats', (id, want) => {
    const s = loadFixture().scenes[id]!;
    expect(classifyTone(s)).toBe(asTone(want as SceneStat['expect']));
  });

  it.each([...SCENES])('%s: the current TONE_* constants reproduce the calibrated classification', (id) => {
    const s = loadFixture().scenes[id]!;
    expect(classifyTone(s)).toBe(asTone(s.expect));
  });

  it('flat-white measures mean >= 0.999 and flat-black mean <= 0.001', () => {
    const f = loadFixture();
    expect(f.scenes['flat-white']!.mean).toBeGreaterThanOrEqual(0.999);
    expect(f.scenes['flat-black']!.mean).toBeLessThanOrEqual(0.001);
  });
});
