/* REQ-CMP-33 / REQ-CMP-85: the CMP browser specs that prove button loading
   (width stability, calm spinner) and the 390px anchored-popup contract
   (incl. SURF Citation) are executed by a registered L5 row — QUAL's
   location builtin for tests/e2e/cmp/**, which the lane runner merges with
   the stream fragments (packages/qa/src/evidence/laneRunner.ts
   loadRegistrations). A spec no registered row matches never runs. */
import { describe, expect, it } from '@jest/globals';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import picomatch from 'picomatch';
import { BUILTINS, locationBuiltins } from '../../certification/lanes.config';

const ROOT = join(__dirname, '..', '..');

describe('CMP e2e specs are lane-registered', () => {
  const rows = [...BUILTINS, ...locationBuiltins(ROOT)].filter((r) => r.kind === 'playwright');
  it.each([
    'tests/e2e/cmp/controls/button-loading.spec.ts',
    'tests/e2e/cmp/overlays/popover.spec.ts',
  ])('%s runs on a remote, fail-closed L5 row', (spec) => {
    expect(existsSync(join(ROOT, spec))).toBe(true);
    const hits = rows.filter((r) => picomatch(r.path, { dot: true })(spec));
    expect(hits.map((r) => r.lane)).toContain('L5');
    expect(hits.every((r) => r.remote === true && r.failClosed === true)).toBe(true);
  });

  it('button-loading.spec.ts drives a story that exists', () => {
    const spec = readFileSync(join(ROOT, 'tests/e2e/cmp/controls/button-loading.spec.ts'), 'utf8');
    expect(spec).toContain('flagships-controls-button--width-stability');
    const stories = readFileSync(join(ROOT, 'stories/cmp/components/Button.stories.tsx'), 'utf8');
    expect(stories).toMatch(/export const WidthStability\b/);
  });
});
