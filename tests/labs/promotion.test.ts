// tests/labs/promotion.test.ts — REQ-SURF-169.
// A resident promoted to core keeps a one-minor re-export that warns once;
// promotion without the core export fails the gate.
import { describe, expect, it, jest } from '@jest/globals';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { warnLabsPromoted, __resetWarned } from '../../packages/labs/src/_internal/warn-once';

const ROOT = join(__dirname, '../..');
const SCRIPT = join(ROOT, 'scripts/surf/verify-labs-admission.mjs');
const FX = join(ROOT, 'tests/labs/fixtures');

describe('labs promotion', () => {
  it('promoted resident absent from the exports manifest exits 1', () => {
    const dir = join(FX, 'promoted-missing-core');
    const r = spawnSync(process.execPath,
      [SCRIPT, '--root', dir, '--manifest', join(dir, 'exports-manifest.json')],
      { encoding: 'utf8', cwd: ROOT });
    expect(r.status).toBe(1);
    expect(`${r.stdout}${r.stderr}`).toContain('promotion');
  });

  it('warnLabsPromoted warns exactly once per name', () => {
    __resetWarned();
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    warnLabsPromoted('Parallax');
    warnLabsPromoted('Parallax');
    expect(spy).toHaveBeenCalledTimes(1);
    warnLabsPromoted('OtherName');
    expect(spy).toHaveBeenCalledTimes(2);
    spy.mockRestore();
  });
});
