/** @jest-environment node */
// REQ-SURF-151 — fragments/playwright/surf.json is a PlaywrightProjectFragment[]
// (contract S-45) so playwright.config.ts and certification/playwright.cert.config.ts
// can spread it, and the L8 sampling spec runs in all three engines.
import { describe, expect, it } from '@jest/globals';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { PlaywrightProjectFragment } from '../../src/contracts/fragments';

const ROOT = join(__dirname, '..', '..');
const projects = JSON.parse(readFileSync(join(ROOT, 'fragments/playwright/surf.json'), 'utf8')) as PlaywrightProjectFragment[];

describe('fragments/playwright/surf.json (REQ-SURF-151)', () => {
  it('is an array of uniquely named surf:* projects, spec files only', () => {
    expect(Array.isArray(projects)).toBe(true);
    const names = projects.map((p) => p.name);
    expect(new Set(names).size).toBe(names.length);
    for (const p of projects) {
      expect(p.name).toMatch(/^surf:[a-z0-9-]+$/);
      expect(p.testDir).toMatch(/^tests\/[a-z0-9/-]+$/);
      expect(p.testMatch).toMatch(/\.spec\.ts$/);
    }
  });

  it('registers surf:cert-media-sampling once per engine on the L8 spec', () => {
    const cert = projects.filter((p) => p.name.startsWith('surf:cert-media-sampling'));
    expect(cert.map((p) => [p.name, p.testDir, p.testMatch, (p.use as { browserName?: string }).browserName])).toEqual([
      ['surf:cert-media-sampling-chromium', 'tests/e2e/surf/media', 'sampling-engines.spec.ts', 'chromium'],
      ['surf:cert-media-sampling-firefox', 'tests/e2e/surf/media', 'sampling-engines.spec.ts', 'firefox'],
      ['surf:cert-media-sampling-webkit', 'tests/e2e/surf/media', 'sampling-engines.spec.ts', 'webkit'],
    ]);
    expect(existsSync(join(ROOT, 'tests/e2e/surf/media/sampling-engines.spec.ts'))).toBe(true);
  });
});
