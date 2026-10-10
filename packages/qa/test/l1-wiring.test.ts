/* REQ-QUAL-27 L1 Static: every gate is registered on L1 (or reported pending with its producing work item), every
   stream's L1 node-script row is selected, the zero-`!important` gate and the showcase stylelint gate behave. */
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { PENDING_EXIT, loadRegistrations, selectRows } from '../src/evidence/laneRunner.ts';
import { REPO, cleanupRepos, makeRepo } from './helpers/laneFixture.ts';

afterAll(cleanupRepos);

/** QUAL-27's L1 gate list: path → producing work item. */
const L1_GATES: Record<string, string> = {
  'certification/gates/lint.mjs': 'npm run lint',
  'certification/gates/stylelint-showcase.mjs': 'stylelint.showcase.config.mjs on showcase/**/*.css',
  'certification/gates/no-important.mjs': 'zero !important',
  'packages/qa/test/no-committed-evidence.test.ts': 'REQ-QUAL-60 (G-01)',
  'scripts/qual/lint-tests.mjs': 'REQ-QUAL-31 (G-19)',
  'scripts/qual/verify-css-perf.mjs': 'REQ-QUAL-44 (G-23)',
  'scripts/qual/verify-dist-perf.mjs': 'REQ-QUAL-46 (G-24)',
  'scripts/qual/lint-stories.mjs': 'REQ-QUAL-55 (G-10)',
};

describe('L1 registry on this repository', () => {
  let regs: Awaited<ReturnType<typeof loadRegistrations>>;
  beforeAll(async () => { regs = await loadRegistrations(REPO); });

  it('has no wiring problems (a landed producer whose gate is not registered)', () => {
    expect(regs.problems).toEqual([]);
  });

  it.each(Object.keys(L1_GATES))('%s is registered on L1 at pr scope or pending with its producer', (gate) => {
    const registered = selectRows(regs.rows, 'L1', 'pr').some((r) => r.path.split(/\s+/)[0] === gate);
    const pending = regs.pending.find((p) => p.lane === 'L1' && p.path === gate);
    expect({ gate, registered: registered || !!pending }).toEqual({ gate, registered: true });
    if (pending) expect(pending.producer).toMatch(/^G-\d+/);
  });

  it('runs every stream L1 node-script fragment row at its scope (and every wider scope)', () => {
    const l1 = regs.rows.filter((r) => r.lane === 'L1' && r.kind === 'node-script' && r.source.startsWith('fragments/'));
    for (const r of l1) {
      for (const scope of ['pr', 'main', 'nightly', 'release'] as const) {
        const rank = ['pr', 'main', 'nightly', 'release'];
        if (rank.indexOf(scope) < rank.indexOf(r.scope)) continue;
        expect(selectRows(regs.rows, 'L1', scope).some((s) => s.path === r.path && s.kind === r.kind)).toBe(true);
      }
    }
  });

  it('registers the inventory gate (REQ-QUAL-02) and the exemptions validator (REQ-QUAL-68)', () => {
    const paths = selectRows(regs.rows, 'L1', 'pr').map((r) => r.path);
    expect(paths).toEqual(expect.arrayContaining(['scripts/qual/write-inventory.mjs', 'certification/gates/exemptions.mjs']));
  });

  it('attributes the lint gate to PLAT (eslint config owner) and QUAL gates to QUAL', () => {
    const byPath = new Map(regs.rows.map((r) => [r.path, r.stream]));
    expect(byPath.get('certification/gates/lint.mjs')).toBe('plat');
    expect(byPath.get('certification/gates/no-important.mjs')).toBe('qual');
  });
});

function gitRepo(files: Record<string, string>): string {
  const root = makeRepo();
  for (const [rel, text] of Object.entries(files)) { mkdirSync(dirname(join(root, rel)), { recursive: true }); writeFileSync(join(root, rel), text); }
  execFileSync('git', ['init', '-q'], { cwd: root });
  execFileSync('git', ['add', '-A'], { cwd: root });
  return root;
}
const gate = (root: string, script: string) => spawnSync(process.execPath, [join(REPO, script)], { cwd: root, encoding: 'utf8' });

describe('zero !important (D-24)', () => {
  it('passes on clean stories, showcases and Storybook shell', () => {
    const root = gitRepo({ 'src/components/a/A.stories.tsx': "export const A = { args: { style: { color: 'var(--ag-x)' } } };\n", '.storybook/preview.tsx': 'export default {};\n' });
    expect(gate(root, 'certification/gates/no-important.mjs').status).toBe(0);
  });
  it.each([
    ['src/components/a/A.stories.tsx', "export const A = () => <div style={{ color: 'red !important' }} />;\n"],
    ['stories/qual/B.stories.tsx', 'const css = `.x { margin: 0 !important; }`;\n'],
    ['showcase/ops-console/ops.module.css', '.grid { display: grid !important; }\n'],
    ['.storybook/preview.css', 'body { padding: 0 ! important }\n'],
  ])('fails when %s contains !important', (file, text) => {
    const r = gate(gitRepo({ [file]: text }), 'certification/gates/no-important.mjs');
    expect(r.status).toBe(1);
    expect(r.stderr).toContain(`${file}:1:`);
  });
});

describe('showcase stylelint (stylelint.showcase.config.mjs)', () => {
  it(`is pending (exit ${PENDING_EXIT}) while no showcase CSS is tracked`, () => {
    expect(gate(gitRepo({ 'README.md': 'x\n' }), 'certification/gates/stylelint-showcase.mjs').status).toBe(PENDING_EXIT);
  });

  const lint = (css: string) => {
    const root = makeRepo({ files: { 'a.module.css': css } });
    return spawnSync(process.execPath, [join(REPO, 'node_modules/stylelint/bin/stylelint.mjs'), '--config', join(REPO, 'stylelint.showcase.config.mjs'), join(root, 'a.module.css')], { cwd: root, encoding: 'utf8' });
  };
  it('accepts layout-only CSS', () => {
    expect(lint('.g { display: grid; grid-template-columns: 1fr 2fr; gap: var(--ag-space-4); padding: 0; min-inline-size: 0; inset-block-start: 0; position: sticky; overflow: auto; container-type: inline-size; }\n').status).toBe(0);
  });
  it.each([
    ['a non-layout property', '.g { background: var(--ag-x); }', 'property-allowed-list'],
    ['!important', '.g { display: grid !important; }', 'declaration-no-important'],
    ['a hex colour', '.g { --x: #fff; }', 'color-no-hex'],
    ['a colour function', '.g { --x: rgb(0 0 0); }', 'function-disallowed-list'],
    ['a [data-ag-part] selector', '.g [data-ag-part="root"] { display: block; }', 'selector-disallowed-list'],
  ])('rejects %s', (_label, css, rule) => {
    const r = lint(`${css}\n`);
    expect(r.status).not.toBe(0);
    expect(`${r.stdout}${r.stderr}`).toContain(rule);
  });
});
