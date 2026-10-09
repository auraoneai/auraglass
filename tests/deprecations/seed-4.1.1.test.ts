/* REQ-PLAT-55: the 4.1.1 deprecation seed — every entry announced in the
   trust patch carries a declared exception + evidence, none is scheduled
   under a 4.2.0 minor that does not exist on this line, and every
   export-kind symbol is a real root export of the package. */
import { describe, it, expect } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(__dirname, '..', '..');
const EVAL = (code) =>
  execFileSync('node', ['--input-type=module', '-e',
    `const m = await import('${join(ROOT, 'src/contracts/load-fragments.mjs')}'); ${code}`],
    { cwd: ROOT, encoding: 'utf8' });

describe('seed-4.1.1 (REQ-PLAT-55)', () => {
  it('has at least 19 entries since 4.1.1, each with a declared exception and evidence', () => {
    const out = EVAL(`const r = await m.loadFragments('deprecations','${ROOT}');
      const rows = r.flatMap(x => Array.isArray(x?.value) ? x.value : Array.isArray(x) ? x : [x]);
      const t = rows.filter(e => e && e.since === '4.1.1');
      console.log(JSON.stringify({ n: t.length, noExc: t.filter(e => !e.exception).map(e => e.id), noEv: t.filter(e => !e.evidence).map(e => e.id) }))`);
    const r = JSON.parse(out.trim());
    expect(r.n).toBeGreaterThanOrEqual(19);
    expect(r.noExc).toEqual([]);
    expect(r.noEv).toEqual([]);
  });
  it('the PLAT seed has no entry scheduled under the non-existent 4.2.0 minor', () => {
    // The 4.1.1 patch line announces its own deprecations at since='4.1.1';
    // since='4.2.0' rows are other streams' forward-scheduled train entries
    // (mat/surf) and may not appear in the PLAT seed.
    const out = EVAL(`const m2 = await import('fs');
      const s = m2.readFileSync('${join(ROOT, 'fragments/deprecations/plat.ts')}', 'utf8');
      console.log((s.match(/since: '4\\.2\\.0'/g) || []).length)`);
    expect(Number(out.trim())).toBe(0);
  });
  it('every export-kind symbol is a real root export (etc/api/index.exports.json)', () => {
    const api = JSON.parse(readFileSync(join(ROOT, 'etc/api/index.exports.json'), 'utf8'));
    const rootExports = new Set(api.exports);
    const out = EVAL(`const r = await m.loadFragments('deprecations','${ROOT}');
      const rows = r.flatMap(x => Array.isArray(x?.value) ? x.value : Array.isArray(x) ? x : [x]);
      const t = rows.filter(e => e && e.since === '4.1.1' && e.kind === 'export');
      console.log(t.map(e => e.symbol).join('\\n'))`);
    const missing = out.trim().split('\n').filter(Boolean).filter((s) => !rootExports.has(s));
    expect(missing).toEqual([]);
  });
});
