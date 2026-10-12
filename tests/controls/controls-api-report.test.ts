/** CMP-114 (REQ-CMP-01): the public "." api report must not leak Base UI or
    4.x-era props. Fails closed when the report is missing. */
import { describe, expect, it } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const REPORT = join(__dirname, '..', '..', 'etc', 'api', 'root.api.md');

/* REQ-CMP-05 banned names plus 4.x-era props. `intent` is NOT banned: REQ-CMP-05
   makes it the only status prop (Button REQ-CMP-34, Badge -114, Alert -116,
   AlertDialog.Action), so it must appear in the public report. `glow\w*`
   covers glow* (REQ-CMP-05). */
const BANNED_PROPS = [
  'material', 'elevation', 'as', 'tone', 'asChild', 'tier', 'intensity', 'depth', 'tint', 'blur',
  'glow\\w*', 'caustics', 'chromatic', 'ior', 'lighting', 'animation', 'respectMotionPreference',
  'consciousness', 'predictive', 'eyeTracking', 'adaptive', 'spatialAudio', 'trackAchievements',
  'backdropBlur', 'glassVariant', 'shimmer', 'blurAmount',
];

describe('controls api report surface', () => {
  const text = existsSync(REPORT) ? readFileSync(REPORT, 'utf8') : null;

  it('report exists (fail closed)', () => {
    expect(text).not.toBeNull();
  });

  it('no @base-ui substring in the public surface', () => {
    expect(text).not.toBeNull();
    expect(text).not.toContain('@base-ui');
  });

  it.each(BANNED_PROPS.map((p) => [p] as const))('no prop named %s', (prop) => {
    expect(text).not.toBeNull();
    const re = new RegExp(`\\b${prop}\\s*[?]?:`);
    expect(text!.match(re)).toBeNull();
  });
});
