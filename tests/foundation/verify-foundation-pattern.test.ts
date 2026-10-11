/* @jest-environment node */
/* CMP-020/021: drives scripts/cmp/verify-foundation-pattern.mjs against fixtures —
   the bad fixture must fail with one line per pattern (a-e); the clean fixture
   must pass. Relocated from tests/ci/ per contracts/ownership.json. */
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
const ROOT = join(__dirname, '..', '..');
const SCRIPT = join(ROOT, 'scripts', 'cmp', 'verify-foundation-pattern.mjs');
const FIX = join(__dirname, 'fixtures', 'foundation-pattern');

function run(dir) {
  try {
    const out = execFileSync(process.execPath, [SCRIPT, '--root', dir, '--baseline', join(dir, 'scripts/cmp/foundation-pattern-baseline.json')], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    return { code: 0, out };
  } catch (e) {
    return { code: e.status ?? 1, out: `${e.stdout ?? ''}${e.stderr ?? ''}` };
  }
}

describe('verify-foundation-pattern', () => {
  it('clean fixture exits 0', () => {
    const r = run(join(FIX, 'clean'));
    expect(r.code).toBe(0);
    expect(r.out).toContain('OK');
  });
  it('bad fixture fails with one violation per pattern', () => {
    const r = run(join(FIX, 'bad'));
    expect(r.code).toBe(1);
    const out = r.out;
    expect(out).toMatch(/no-asChild.*JSX attribute/);
    expect(out).toMatch(/no-asChild.*BadProps/);
    expect(out).toMatch(/no-legacy-shim-import.*FocusTrap/);
    expect(out).toMatch(/no-legacy-shim-import.*primitives\/slot\//);
    expect(out).toMatch(/no-skip-todo-fixme/);
    expect(out).toMatch(/no-important/);
    expect(out).toMatch(/base-ui-outside-client/);
  });
  it('real tree: script runs and reports', () => {
    const r = run(ROOT);
    expect([0, 1]).toContain(r.code);
  });
});
