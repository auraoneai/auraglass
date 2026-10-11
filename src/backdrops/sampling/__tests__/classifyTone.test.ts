import { describe, expect, it } from '@jest/globals';
import { classifyTone, TONE_DARK_MEAN, TONE_DARK_P90, TONE_LIGHT_MEAN, TONE_LIGHT_P10 } from '../classifyTone';
import fixture from '../__fixtures__/scene-stats.json';

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
  it.each(Object.entries(fixture.scenes))('scene %s → %s', (_name, s) => {
    expect(classifyTone({ mean: s.mean, p10: s.p10, p90: s.p90, stdev: s.stdev })).toBe(s.expect === 'busy' ? undefined : s.expect);
  });
});
