/** REQ-PLAT-41: the 4.x import side-effect gate imports the built entry in a
 *  fresh jsdom and fails on document/window listeners, setInterval,
 *  setTimeout with delay > 0, <html> setAttribute and style.setProperty
 *  performed during the import. Effects are named by the stack-derived code
 *  symbol; the baseline ({ effects: [{ symbol, kind }] }) is shrink-only and
 *  may never carry adaptiveAI. Fixture "dists" stand in for dist/index.mjs. */
import { describe, expect, it } from '@jest/globals';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const ROOT = join(__dirname, '..', '..');
const SCRIPT = join(ROOT, 'scripts/ci/verify-import-side-effects.js');
const BASELINE = join(ROOT, 'scripts/ci/import-side-effects-baseline.json');
const FX = 'tests/ci/fixtures/import-side-effects';

type Effect = { symbol: string; kind: string };
const baselineFile = (effects: unknown) => {
  const f = join(mkdtempSync(join(tmpdir(), 'ise-')), 'baseline.json');
  writeFileSync(f, JSON.stringify(effects === undefined ? {} : { effects }));
  return f;
};
const run = (fixture: string, effects: unknown, extra: string[] = []) => {
  const bl = baselineFile(effects);
  const r = spawnSync('node', [SCRIPT, '--dist', `${FX}/${fixture}`, '--baseline', bl, ...extra], {
    cwd: ROOT,
    encoding: 'utf8',
  });
  return { code: r.status, out: `${r.stdout}${r.stderr}`, baseline: bl };
};
const LISTENER: Effect[] = [
  { symbol: `${FX}/listener.mjs#<module>`, kind: 'listener' },
  { symbol: `${FX}/listener.mjs#startTracking`, kind: 'listener' },
  { symbol: `${FX}/listener.mjs#startTracking`, kind: 'timer' },
];

describe('verify-import-side-effects (REQ-PLAT-41)', () => {
  it('clean fixture dist passes an empty baseline', () => {
    const r = run('clean.mjs', []);
    expect([r.code, r.out]).toEqual([0, expect.stringContaining('import-side-effects: OK (0 baselined effect(s), 0 new, 0 stale)')]);
  });

  it('top-level and in-function listeners and an interval fail, named by stack-derived symbol', () => {
    const r = run('listener.mjs', []);
    expect(r.code).toBe(1);
    for (const e of LISTENER) expect(r.out).toContain(`new ${e.kind} effect '${e.symbol}'`);
  });

  it('passes when every observed effect is baselined', () => {
    const r = run('listener.mjs', LISTENER);
    expect([r.code, r.out]).toEqual([0, expect.stringContaining('OK (3 baselined effect(s)')]);
  });

  it('a stale baseline row (effect no longer observed) fails', () => {
    const r = run('clean.mjs', [{ symbol: 'src/utils/soundDesign.ts#gone', kind: 'listener' }]);
    expect(r.code).toBe(1);
    expect(r.out).toContain("stale baseline row listener 'src/utils/soundDesign.ts#gone'");
  });

  it('--write-baseline only shrinks: drops stale rows, never adds', () => {
    const shrink = run('listener.mjs', [...LISTENER, { symbol: 'src/x.ts#old', kind: 'timer' }], ['--write-baseline']);
    expect(shrink.code).toBe(0);
    expect(JSON.parse(readFileSync(shrink.baseline, 'utf8')).effects).toEqual(LISTENER);
    const grow = run('listener.mjs', [], ['--write-baseline']);
    expect(grow.code).toBe(1);
    expect(JSON.parse(readFileSync(grow.baseline, 'utf8'))).toEqual({ effects: [] });
  });

  it('setTimeout with delay 0 / none is not an effect; delay > 0 is', () => {
    const r = run('timers.mjs', []);
    expect(r.code).toBe(1);
    expect(r.out).toContain(`new timer effect '${FX}/timers.mjs#scheduleFlush'`);
    expect(r.out).not.toContain(`'${FX}/timers.mjs#<module>'`);
  });

  it('<html> setAttribute and style.setProperty fail; other elements are not counted', () => {
    const r = run('dom-writes.mjs', []);
    expect(r.code).toBe(1);
    expect(r.out).toContain(`new attribute effect '${FX}/dom-writes.mjs#<module>'`);
    expect(r.out).toContain(`new style effect '${FX}/dom-writes.mjs#applyVars'`);
    expect(r.out.match(/new \w+ effect/g)).toHaveLength(2);
  });

  it('adaptiveAI effects fail even when baselined', () => {
    const r = run('adaptiveAI.mjs', [{ symbol: `${FX}/adaptiveAI.mjs#<module>`, kind: 'listener' }]);
    expect(r.code).toBe(1);
    expect(r.out).toContain('adaptiveAI must have no import effect');
  });

  it('a missing dist or malformed baseline is a usage failure (exit 2)', () => {
    expect(run('missing.mjs', []).code).toBe(2);
    expect(run('clean.mjs', undefined).out).toContain('expected { effects: [{ symbol, kind }] }');
    expect(run('clean.mjs', [{ symbol: 'x', kind: 'listener', note: 'extra' }]).code).toBe(2);
  });

  it('the checked-in baseline is { effects: [{ symbol, kind }] } without adaptiveAI', () => {
    const data = JSON.parse(readFileSync(BASELINE, 'utf8'));
    expect(Object.keys(data)).toEqual(['effects']);
    for (const e of data.effects as Effect[]) {
      expect(Object.keys(e).sort()).toEqual(['kind', 'symbol']);
      expect(['listener', 'timer', 'attribute', 'style']).toContain(e.kind);
      expect(e.symbol).not.toMatch(/adaptiveAI/i);
    }
  });

  it('plat:gate:glass-quality runs the gate on the 4x line', () => {
    const ci = readFileSync(join(ROOT, 'ci/plat.gitlab-ci.yml'), 'utf8');
    expect(ci).toMatch(/for s in [^\n]*verify-import-side-effects\.js/);
  });
});
