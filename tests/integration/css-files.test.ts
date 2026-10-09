/* REQ-FIN-14 (MAT-19 + CMP-09): the css-files gate. Fixtures are mini repos;
   the verifier runs with cwd=<fixture> so src/, fragments/css/,
   contracts/ownership.json and the integration baseline all resolve there. */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const FIX = resolve(__dirname, 'fixtures/css-files');
const SCRIPT = resolve(__dirname, '../../scripts/build/verify-css-files.mjs');

const run = (dir: string) => {
  try {
    const out = execFileSync(process.execPath, [SCRIPT], { cwd: join(FIX, dir), encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    return { code: 0, out };
  } catch (e: any) {
    return { code: e.status ?? 1, out: `${e.stdout ?? ''}${e.stderr ?? ''}` };
  }
};

describe('REQ-FIN-14 verify-css-files gate', () => {
  it('a compliant mini repo exits 0', () => {
    const r = run('good');
    expect(r.code).toBe(0);
  });

  it('reports every rule on the bad fixture with named messages', () => {
    const r = run('bad');
    expect(r.code).toBe(1);
    expect(r.out).toContain('layer-order-statement');
    expect(r.out).toContain('banned-layer');
    expect(r.out).toContain('no-important');
    expect(r.out).toContain('no-root');
    expect(r.out).toContain('double-inclusion');
    expect(r.out).toContain('missing-file');
    expect(r.out).toContain('stale baseline row');
  });

  it('the repo baseline file parses and every row carries owner/reqFin/expires', () => {
    const p = resolve(__dirname, '../../scripts/integration/baselines/css-files.json');
    expect(existsSync(p)).toBe(true);
    const rows = JSON.parse(readFileSync(p, 'utf8'));
    for (const r of rows) {
      expect(typeof r.file).toBe('string');
      expect(typeof r.owner).toBe('string');
      expect(r.reqFin).toMatch(/^REQ-FIN-/);
      expect(r.expires).toBe('RC-1');
    }
  });
});
