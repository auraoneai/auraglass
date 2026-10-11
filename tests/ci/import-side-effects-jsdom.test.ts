/* REQ-PLAT-41: jsdom import side-effect gate — three fixture cases.
 * (Distinct from PLAT-072's sideEffects-field gate in import-side-effects.test.ts.) */
import { describe, it, expect } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const ROOT = join(__dirname, '..', '..');
const SCRIPT = join(ROOT, 'scripts/ci/import-side-effects.mjs');
const run = (args, opts = {}) =>
  execFileSync('node', [SCRIPT, ...args], { cwd: ROOT, encoding: 'utf8', stdio: 'pipe', ...opts });

const FIXTURE = join(__dirname, 'fixtures', 'import-side-effects');

describe('import-side-effects (REQ-PLAT-41)', () => {
  it('fixture clean.mjs — no global effects, passes an empty baseline', () => {
    const bl = join(mkdtempSync(join(tmpdir(), 'bl-')), 'b.json');
    writeFileSync(bl, JSON.stringify({ effects: [] }));
    const out = run(['--module', join(FIXTURE, 'clean.mjs'), '--baseline', bl]);
    expect(out).toContain('baseline clean');
  });
  it('fixture listener.mjs — new listener+timer effects fail the shrink-only gate', () => {
    const bl = join(mkdtempSync(join(tmpdir(), 'bl-')), 'b.json');
    writeFileSync(bl, JSON.stringify({ effects: [] }));
    let code = 0, out = '';
    try { out = run(['--module', join(FIXTURE, 'listener.mjs'), '--baseline', bl]); }
    catch (e) { code = e.status; out = (e.stderr ?? '') + (e.stdout ?? ''); }
    expect(code).toBe(1);
    expect(out).toMatch(/new listener effect 'document\.addEventListener\(click\)'/);
    expect(out).toContain("new timer effect 'window.setInterval'");
  });
  it('baseline shrinks — a removed effect only narrows the baseline and passes', () => {
    const bl = join(mkdtempSync(join(tmpdir(), 'bl-')), 'b.json');
    writeFileSync(bl, JSON.stringify({ effects: [
      { kind: 'listener', symbol: 'document.addEventListener(click)' },
      { kind: 'timer', symbol: 'window.setInterval' },
      { kind: 'timer', symbol: 'window.setTimeout' },
    ] }));
    const out = run(['--module', join(FIXTURE, 'listener.mjs'), '--baseline', bl]);
    expect(out).toContain('baseline shrank by 1');
    expect(out).toContain('baseline clean');
  });
});
