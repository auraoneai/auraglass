/* REQ-FIN-14 (MAT-19 + CMP-09): the css-files gate. Fixtures are mini repos;
   the verifier runs with cwd=<fixture> so src/, fragments/css/,
   contracts/ownership.json and the integration baseline all resolve there.
   The last cases run it on the real repo: every src css file and every
   fragment row, passing only with the expiring baseline (AC-FIN-14). */
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const REPO = resolve(__dirname, '../..');
const FIX = resolve(__dirname, 'fixtures/css-files');
const SCRIPT = resolve(REPO, 'scripts/build/verify-css-files.mjs');

const run = (cwd: string, env: Record<string, string> = {}) => {
  const e = { ...process.env, ...env };
  delete e.CI_COMMIT_TAG;
  if (!env.AG_RELEASE_VERSION) delete e.AG_RELEASE_VERSION;
  try {
    const out = execFileSync(process.execPath, [SCRIPT], { cwd, env: e, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    return { code: 0, out };
  } catch (err: any) {
    return { code: err.status ?? 1, out: `${err.stdout ?? ''}${err.stderr ?? ''}` };
  }
};

describe('REQ-FIN-14 verify-css-files gate', () => {
  it('a compliant mini repo exits 0', () => {
    const r = run(join(FIX, 'good'));
    expect(r.out).toContain('0 violation(s)');
    expect(r.code).toBe(0);
  });

  describe('the bad fixture fails with a named message per rule', () => {
    const r = run(join(FIX, 'bad'));
    it('exits 1', () => expect(r.code).toBe(1));
    it.each([
      ['missing statement', 'FAIL src/components/Button.css layer-order-statement'],
      ['banned layer', 'FAIL src/components/Button.css banned-layer @layer media'],
      ['!important', 'FAIL src/components/Button.css no-important'],
      [':root outside ag.tokens/ag.compat', 'FAIL src/components/Button.css no-root'],
      ['same file in two fragment rows', 'FAIL src/components/Button.css double-inclusion registered twice'],
      ['registered and @import-ed', 'FAIL src/components/Bundle.css double-inclusion @import-s src/components/Part.css'],
      ['@import of a file that does not exist', 'FAIL src/components/Bundle.css missing-import @import of src/components/missing-part.css'],
      ['fragment row for a missing file', 'FAIL src/components/Ghost.css missing-file'],
      ['wrong layer', 'FAIL src/components/Wrong.css layer-mismatch file declares @layer ag.a11y but fragments/css/cmp.ts registers ag.components'],
      ['unregistered file', 'FAIL src/components/Unregistered.css unregistered'],
      ['stale baseline row', 'FAIL stale baseline row: src/components/NotOffending.css'],
    ])('%s', (_name, line) => {
      expect(r.out).toContain(line);
    });
  });

  it('a baselined offender passes before RC-1 and fails once RC-1 is being built', () => {
    const before = run(join(FIX, 'expiring'), { AG_RELEASE_VERSION: '5.0.0-beta.3' });
    expect(before.out).toContain('BASELINED src/components/Button.css layer-order-statement');
    expect(before.code).toBe(0);
    const at = run(join(FIX, 'expiring'), { AG_RELEASE_VERSION: '5.0.0-rc.1' });
    expect(at.out).toContain('FAIL verify-css-files: expired baseline row src/components/Button.css (expires RC-1, building 5.0.0-rc.1)');
    expect(at.code).toBe(1);
  });

  it('the real repo (every src css file + every fragment row) passes with the expiring baseline', () => {
    const r = run(REPO, { AG_RELEASE_VERSION: '5.0.0-alpha.0' });
    expect(r.out).not.toMatch(/^FAIL /m);
    expect(r.code).toBe(0);
  });

  it('the repo baseline rows are well-formed and carry no FIN-A REQ-FIN-05/-14 file', () => {
    const p = resolve(REPO, 'scripts/integration/baselines/css-files.json');
    expect(existsSync(p)).toBe(true);
    const rows = JSON.parse(readFileSync(p, 'utf8'));
    for (const r of rows) {
      expect(typeof r.file).toBe('string');
      expect(typeof r.owner).toBe('string');
      expect(r.reqFin).toMatch(/^REQ-FIN-\d+$/);
      expect(['REQ-FIN-05', 'REQ-FIN-14']).not.toContain(r.reqFin);
      expect(r.expires).toBe('RC-1');
    }
  });
});
