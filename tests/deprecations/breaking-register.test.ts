/* REQ-PLAT-29: breaking register — every B-id referenced by an entry, all 21
   #b-N anchors present in the generated migration guide, notice-kind rule. */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const EVAL = (body: string) =>
  execFileSync('node', ['--input-type=module', '-e',
    `const m = await import('${ROOT}/scripts/release/verify-breaking-register.mjs'); ${body}`],
  { cwd: ROOT, encoding: 'utf8' });

describe('breaking register', () => {
  it('all 21 B-ids referenced + anchored', () => {
    const out = EVAL(`process.exitCode = await m.main(['--guide',
      '${join(ROOT, 'apps/docs/generated/migration/deprecations.md')}']); console.log('done')`);
    expect(out.trim()).toContain('done');
  });
  it('guide has all 21 anchors', () => {
    const guide = readFileSync(join(ROOT, 'apps/docs/generated/migration/deprecations.md'), 'utf8');
    const anchors = new Set([...guide.matchAll(/id="b-(\d+)"/g)].map((m) => `B${m[1]}`));
    expect(anchors.size).toBe(21);
  });
  it('checkRegister flags an unreferenced B-id', () => {
    const out = EVAL(`const errs = m.checkRegister([{id:'B99',title:'x'}], [], '');
      console.log(JSON.stringify(errs));`);
    expect(JSON.parse(out).length).toBeGreaterThan(0);
  });
  it('notice B-ids require peer|engine|behavior kind + codemod null', () => {
    const out = EVAL(`const errs = m.checkRegister([{id:'B1',title:'x'}],
      [{id:'DEP-P1',kind:'export',breaking:'B1',codemod:'imports-subpaths'}], '');
      console.log(JSON.stringify(errs));`);
    expect(JSON.parse(out).some((e: string) => e.includes('notice'))).toBe(true);
  });
  it('anchorsOf parses b-N and dep-dep-* ids', () => {
    const out = EVAL(`const a = m.anchorsOf('x id="b-7" y id="dep-dep-c0001"');
      console.log(JSON.stringify([...a]));`);
    expect(JSON.parse(out)).toEqual(['b-7', 'dep-dep-c0001']);
  });
});
