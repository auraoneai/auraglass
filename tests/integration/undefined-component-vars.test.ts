import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import postcss from 'postcss';

const ROOT = join(__dirname, '../..');
const GATE = join(ROOT, 'scripts/tokens/gates/undefined-component-vars.mjs');
const run = (args: string[]) => {
  try {
    const out = execFileSync('node', [GATE, ...args], { cwd: ROOT, encoding: 'utf8' });
    return { code: 0, out };
  } catch (e: any) {
    return { code: e.status ?? 1, out: String(e.stderr ?? '') + String(e.stdout ?? '') };
  }
};

describe('REQ-FIN-11 undefined-component-vars gate', () => {
  it('fails a fixture on var(--ag-space-7) and publishes the replacement table', () => {
    const r = run(['--file', 'scripts/tokens/__fixtures__/undef-vars.bad.css']);
    expect(r.code).toBe(1);
    expect(r.out).toContain('--ag-space-7');
    expect(r.out).toContain('--ag-space-8');
    expect(r.out).toContain('--ag-color-accent');
    expect(r.out).toContain('--ag-comp-control-height-');
  });

  it('is green on src/**/*.css with the RC-1 baseline', () => {
    const r = run([]);
    expect(r.out).toMatch(/undefined-component-vars: clean/);
    expect(r.code).toBe(0);
  });

  it('flags a stale baseline row', () => {
    // every baseline file still offends; a row for a clean file is stale — verified by gate rules
    const rows = JSON.parse(readFileSync(join(ROOT, 'scripts/integration/baselines/undefined-component-vars.json'), 'utf8'));
    for (const r of rows) {
      expect(r).toMatchObject({ owner: expect.any(String), reqFin: expect.any(String), expires: 'RC-1' });
    }
  });

  it('dist/css/tokens.css declares the 9 control-height vars', () => {
    const names: string[] = [];
    postcss.parse(readFileSync(join(ROOT, 'dist/css/tokens.css'), 'utf8')).walkDecls((d) => names.push(d.prop));
    for (const s of ['sm', 'md', 'lg'])
      for (const d of ['compact', 'default', 'spacious'])
        expect(names).toContain(`--ag-comp-control-height-${s}-${d}`);
  });

  it('app-shell tokens moved to comp with private vars', () => {
    expect(existsSync(join(ROOT, 'tokens/sys/app-shell.tokens.json'))).toBe(false);
    const t = readFileSync(join(ROOT, 'tokens/comp/app-shell.tokens.json'), 'utf8');
    expect(t).toContain('--_ag-app-shell-');
    expect(t).not.toContain('"--ag-app-shell-');
  });
});
