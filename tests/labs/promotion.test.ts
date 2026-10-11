// tests/labs/promotion.test.ts — REQ-SURF-169 (+ REQ-SURF-184 demand rules).
// A resident promoted to core keeps a one-minor re-export that warns once;
// promotion without the core export, past its one labs minor, or without
// demand fails the gate. The lane passes --manifest build/exports.manifest.json.
import { describe, expect, it, jest } from '@jest/globals';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { warnLabsPromoted, __resetWarned } from '../../packages/labs/src/_internal/warn-once';
import lanes from '../../fragments/lanes/surf';

const ROOT = join(__dirname, '../..');
const SCRIPT = join(ROOT, 'scripts/surf/verify-labs-admission.mjs');
const FX = join(ROOT, 'tests/labs/fixtures');
const REAL_MANIFEST = 'build/exports.manifest.json';

const gate = (fixture: string, manifest = join(FX, fixture, 'exports-manifest.json')) =>
  spawnSync(process.execPath, [SCRIPT, '--root', join(FX, fixture), '--manifest', manifest],
    { encoding: 'utf8', cwd: ROOT });

describe('labs promotion', () => {
  it('promoted resident absent from the exports manifest exits 1', () => {
    const r = gate('promoted-missing-core');
    expect(r.status).toBe(1);
    expect(r.stderr).toContain('promo: promotion promoted name promo absent from exports manifest entry .');
  });

  it("fixture 'promoted-stale' (promotedIn 0.1.0, labs 0.3.0) exits 1 naming promotion", () => {
    const r = gate('promoted-stale');
    expect(r.status).toBe(1);
    expect(r.stderr).toContain('promo: promotion stale promoted re-export: promoted in labs 0.1.0, labs is 0.3.0');
  });

  it('the one sanctioned re-export minor (promotedIn 0.1.0, labs 0.2.0) passes', () => {
    const r = gate('promoted-current');
    expect(`${r.stdout}${r.stderr}`).toContain('labs admission: 1 resident(s) ok');
    expect(r.status).toBe(0);
  });

  it('a promoted row without promotedIn fails', () => {
    const r = gate('promoted-missing-core');
    expect(r.stderr).toContain("promo: promotion row X-91 has form 'export' but no promotedIn labs version");
  });

  it('promotion with 9 distinct demand links fails (REQ-SURF-184: >=10)', () => {
    const r = gate('promoted-no-demand');
    expect(r.status).toBe(1);
    expect(r.stderr).toContain('promo: promotion row X-98 promotion needs >=10 distinct demand links, has 9');
  });

  it('a promoted resident without --manifest fails instead of skipping the core-export check', () => {
    const r = spawnSync(process.execPath, [SCRIPT, '--root', join(FX, 'promoted-current')],
      { encoding: 'utf8', cwd: ROOT });
    expect(r.status).toBe(1);
    expect(r.stderr).toContain('promo: promotion promoted resident needs --manifest');
  });

  it('enumerates core exports from the real build/exports.manifest.json entry source', () => {
    const ok = gate('promoted-real-manifest', REAL_MANIFEST); // Kbd is a root value export
    expect(`${ok.stdout}${ok.stderr}`).toContain('labs admission: 1 resident(s) ok');
    expect(ok.status).toBe(0);
    const missing = gate('promoted-current', REAL_MANIFEST); // Promo is not
    expect(missing.status).toBe(1);
    expect(missing.stderr).toContain('promo: promotion promoted name Promo absent from exports manifest entry .');
  });

  it('every registered labs admission lane passes --manifest build/exports.manifest.json', () => {
    const rows = lanes.filter((l) => l.path.split(/\s+/)[0] === 'scripts/surf/verify-labs-admission.mjs');
    expect(rows.map((r) => r.scope).sort()).toEqual(['pr', 'release']);
    for (const r of rows) {
      expect(r.path).toBe('scripts/surf/verify-labs-admission.mjs --manifest build/exports.manifest.json');
      expect(r).toMatchObject({ lane: 'L1', kind: 'node-script', failClosed: true });
    }
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
