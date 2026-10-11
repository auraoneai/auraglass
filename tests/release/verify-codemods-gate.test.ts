/* @jest-environment node */
/* REQ-PLAT-62 / REQ-FIN-45 (FIN-C C.3-15, v4.3.0): verify-codemods-gate.mjs —
   the step the v4.3.* tag pipeline runs before publishing @auraglass/cli@0.x.
   Fragments are evaluated through the contract loader in a temp root; the
   migrate dry-run check is exercised against small CLI scripts that stand in
   for the built CLI's process contract (exit code + JSON report on stdout).
   The real built CLI runs in the tag pipeline itself. */
import { execFileSync, spawnSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const ROOT = process.cwd();
const EVAL = (body: string) =>
  execFileSync('node', ['--input-type=module', '-e',
    `const m = await import('${ROOT}/scripts/release/verify-codemods-gate.mjs'); ${body}`],
  { cwd: ROOT, encoding: 'utf8' });
const json = (body: string) => JSON.parse(EVAL(`console.log(JSON.stringify(${body}))`));

const EMPTY = "import type { CodemodMappingFragment } from '../../src/contracts/fragments';\nexport default {} satisfies CodemodMappingFragment;\n";
const ROWS = (from: string) =>
  `import type { CodemodMappingFragment } from '../../src/contracts/fragments';\nexport default { renames: [{ from: '${from}', fromEntry: '.', to: '${from}2', toEntry: '.' }] } satisfies CodemodMappingFragment;\n`;

function root({ mat = EMPTY, cmp = EMPTY, surf = EMPTY, qual = EMPTY, record = true, cliVersion = '0.1.0' } = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'cg-'));
  mkdirSync(join(dir, 'fragments/codemods'), { recursive: true });
  mkdirSync(join(dir, 'src/contracts'), { recursive: true });
  mkdirSync(join(dir, 'packages/cli'), { recursive: true });
  mkdirSync(join(dir, 'docs/release/decisions'), { recursive: true });
  mkdirSync(join(dir, 'fixture/src'), { recursive: true });
  copyFileSync(join(ROOT, 'src/contracts/load-fragments.mjs'), join(dir, 'src/contracts/load-fragments.mjs'));
  copyFileSync(join(ROOT, 'src/contracts/fragments.ts'), join(dir, 'src/contracts/fragments.ts'));
  symlinkSync(join(ROOT, 'node_modules'), join(dir, 'node_modules'));
  writeFileSync(join(dir, 'package.json'), JSON.stringify({ name: 'aura-glass', version: '4.3.0' }));
  writeFileSync(join(dir, 'packages/cli/package.json'), JSON.stringify({ name: '@auraglass/cli', version: cliVersion }));
  for (const [s, src] of Object.entries({ mat, cmp, surf, qual })) writeFileSync(join(dir, `fragments/codemods/${s}.ts`), src);
  if (record) writeFileSync(join(dir, 'docs/release/decisions/operator-codemods-qual.md'), '# QUAL declares no codemods\n');
  writeFileSync(join(dir, 'fixture/src/App.tsx'), "import { GlassButton } from 'aura-glass';\n");
  return dir;
}

/** A CLI stand-in: prints `report` as JSON and exits with `code`; with
 *  `touch`, it also writes into --cwd (what a broken --dry-run would do). */
function cli(dir: string, { report, code = 0, touch = false }: { report: unknown; code?: number; touch?: boolean }) {
  const p = join(dir, `cli-${Math.random().toString(36).slice(2)}.mjs`);
  writeFileSync(p, [
    "import { writeFileSync } from 'node:fs';",
    "const a = process.argv.slice(2); const cwd = a[a.indexOf('--cwd') + 1];",
    "if (a.join(' ') !== `migrate 4to5 --dry-run --json --allow-todo --cwd ${cwd}`) { console.error('bad argv ' + a.join(' ')); process.exit(2); }",
    touch ? "writeFileSync(cwd + '/src/App.tsx', 'changed');" : '',
    `process.stdout.write(${JSON.stringify(JSON.stringify(report))});`,
    `process.exit(${code});`,
  ].join('\n'));
  return p;
}
const GOOD = { dryRun: true, summary: { filesChanged: 1, changes: 2, todos: 0 }, files: [] };
/** main() in a child process; stdout and stderr (the FAIL lines) together. */
const RUN = (dir: string, argv: string[]) => {
  const res = spawnSync('node', ['--input-type=module', '-e',
    `const m = await import('${ROOT}/scripts/release/verify-codemods-gate.mjs');
     const code = await m.main(${JSON.stringify(argv)}, { root: ${JSON.stringify(dir)} }); console.log('EXIT=' + code)`],
  { cwd: ROOT, encoding: 'utf8' });
  const out = `${res.stdout}${res.stderr}`;
  return { code: Number(/EXIT=(\d+)/.exec(out)![1]), out };
};

describe('codemods gate: row counting and scope', () => {
  it('counts mapping rows in every row key and ignores fixtures', () => {
    expect(json(`m.countRows({ renames: [1, 2], props: [1], cssVars: { '--glass-a': '--ag-a', '--glass-b': null },
      removed: [1], deps: [1], areaTransforms: [1], fixtures: ['x', 'y'] })`)).toBe(8);
    expect(json('m.countRows({})')).toBe(0);
    expect(json("m.countRows({ fixtures: ['a'] })")).toBe(0);
    expect(json('m.countRows([])')).toBe(0);
  });
  it('gates 4.3.x only', () => {
    expect(json("['v4.3.0', '4.3.1', '4.3.0-rc.1', 'v4.2.0', '4.1.1', 'v5.0.0-alpha.1', '4.30.0'].map(m.gated)"))
      .toEqual([true, true, true, false, false, false, false]);
  });
  it('a tag outside 4.3.x exits 0 without checking', () => {
    const dir = root();
    const r = RUN(dir, ['--tag', 'v4.2.0']);
    expect(r.code).toBe(0);
    expect(r.out).toContain('4.2.0 is not a 4.3.x release; not gated');
  });
  it('a malformed --tag is a usage error', () => {
    expect(RUN(root(), ['--tag', 'latest']).code).toBe(2);
  });
});

describe('codemods gate: v4.3.0 checks (REQ-PLAT-62)', () => {
  it('fails while mat/cmp/surf are the empty 4.x placeholders and names each file', () => {
    const dir = root();
    const r = RUN(dir, ['--tag', 'v4.3.0', '--cli', cli(dir, { report: GOOD }), '--fixture', join(dir, 'fixture')]);
    expect(r.code).toBe(1);
    const report = JSON.parse(readFileSync(join(dir, '.artifacts/plat/codemods-gate.json'), 'utf8'));
    const frag = report.checks.find((c: { id: string }) => c.id === 'fragments');
    expect(frag.ok).toBe(false);
    expect(frag.rows).toEqual({ mat: 0, cmp: 0, surf: 0 });
    for (const s of ['mat', 'cmp', 'surf']) expect(frag.message).toContain(`fragments/codemods/${s}.ts`);
  });
  it('fails when only some streams have rows', () => {
    const dir = root({ mat: ROWS('GlassA'), cmp: ROWS('GlassB') });
    const r = RUN(dir, ['--tag', 'v4.3.0', '--cli', cli(dir, { report: GOOD }), '--fixture', join(dir, 'fixture')]);
    expect(r.code).toBe(1);
    expect(r.out).toContain('FAIL fragments: empty codemod fragment(s): fragments/codemods/surf.ts');
    expect(r.out).not.toContain('fragments/codemods/mat.ts');
  });
  it('passes with rows in mat/cmp/surf, an empty qual.ts, the operator record, a 0.x CLI and a clean dry-run', () => {
    const dir = root({ mat: ROWS('GlassA'), cmp: ROWS('GlassB'), surf: ROWS('GlassC') });
    const r = RUN(dir, ['--tag', 'v4.3.0', '--cli', cli(dir, { report: GOOD }), '--fixture', join(dir, 'fixture')]);
    expect(r.code).toBe(0);
    const report = JSON.parse(readFileSync(join(dir, '.artifacts/plat/codemods-gate.json'), 'utf8'));
    expect(report.ok).toBe(true);
    expect(report.checks.map((c: { id: string; ok: boolean }) => [c.id, c.ok])).toEqual([
      ['fragments', true], ['qual', true], ['cli-version', true], ['migrate-dry-run', true]]);
    expect(report.checks[0].rows).toEqual({ mat: 1, cmp: 1, surf: 1 });
  });
  it('fails when qual.ts gains rows or the operator record is missing', () => {
    const full = { mat: ROWS('GlassA'), cmp: ROWS('GlassB'), surf: ROWS('GlassC') };
    let dir = root({ ...full, qual: ROWS('GlassQ') });
    let r = RUN(dir, ['--tag', 'v4.3.0', '--cli', cli(dir, { report: GOOD }), '--fixture', join(dir, 'fixture')]);
    expect(r.code).toBe(1);
    expect(r.out).toContain('FAIL qual: fragments/codemods/qual.ts has 1 row(s)');
    dir = root({ ...full, record: false });
    r = RUN(dir, ['--tag', 'v4.3.0', '--cli', cli(dir, { report: GOOD }), '--fixture', join(dir, 'fixture')]);
    expect(r.code).toBe(1);
    expect(r.out).toContain('operator-codemods-qual.md is missing');
  });
  it('fails on a CLI version outside 0.x', () => {
    const dir = root({ mat: ROWS('GlassA'), cmp: ROWS('GlassB'), surf: ROWS('GlassC'), cliVersion: '1.0.0' });
    const r = RUN(dir, ['--tag', 'v4.3.0', '--cli', cli(dir, { report: GOOD }), '--fixture', join(dir, 'fixture')]);
    expect(r.code).toBe(1);
    expect(r.out).toContain('FAIL cli-version: @auraglass/cli@1.0.0 is not a 0.x version');
  });
});

describe('codemods gate: migrate 4to5 --dry-run on the consumer fixture', () => {
  const full = () => root({ mat: ROWS('GlassA'), cmp: ROWS('GlassB'), surf: ROWS('GlassC') });
  const dryRun = (dir: string, c: Parameters<typeof cli>[1]) =>
    json(`m.checkMigrateDryRun({ cli: ${JSON.stringify(cli(dir, c))}, fixture: ${JSON.stringify(join(dir, 'fixture'))} })`);

  it('fails when the CLI is not built', () => {
    const dir = full();
    const r = RUN(dir, ['--tag', 'v4.3.0', '--cli', join(dir, 'missing/bin.js'), '--fixture', join(dir, 'fixture')]);
    expect(r.code).toBe(1);
    expect(r.out).toMatch(/FAIL migrate-dry-run: .*missing\/bin\.js is missing; build the CLI first/);
  });
  it('fails on a non-zero exit', () => {
    expect(dryRun(full(), { report: GOOD, code: 1 }).message).toMatch(/^exit 1/);
  });
  it('fails when stdout is not a JSON report', () => {
    const dir = full();
    const p = join(dir, 'text-cli.mjs');
    writeFileSync(p, "console.log('3 file(s) would change'); process.exit(0);");
    const c = json(`m.checkMigrateDryRun({ cli: ${JSON.stringify(p)}, fixture: ${JSON.stringify(join(dir, 'fixture'))} })`);
    expect(c.ok).toBe(false);
    expect(c.message).toContain('stdout is not a JSON report');
  });
  it('fails when the report is not a dry-run or changes nothing', () => {
    const dir = full();
    expect(dryRun(dir, { report: { ...GOOD, dryRun: false } }).message).toContain('report.dryRun is not true');
    expect(dryRun(dir, { report: { dryRun: true, summary: { filesChanged: 0, changes: 0, todos: 0 } } }).message)
      .toContain('report.summary.filesChanged is 0');
  });
  it('fails when --dry-run writes into the fixture copy, and never touches the source fixture', () => {
    const dir = full();
    const c = dryRun(dir, { report: GOOD, touch: true });
    expect(c.ok).toBe(false);
    expect(c.unchanged).toBe(false);
    expect(c.message).toContain('the fixture copy changed during --dry-run');
    expect(readFileSync(join(dir, 'fixture/src/App.tsx'), 'utf8')).toBe("import { GlassButton } from 'aura-glass';\n");
  });
  it('treeHash covers paths and bytes', () => {
    const dir = full();
    const h1 = json(`m.treeHash(${JSON.stringify(join(dir, 'fixture'))})`);
    writeFileSync(join(dir, 'fixture/src/Other.tsx'), '');
    const h2 = json(`m.treeHash(${JSON.stringify(join(dir, 'fixture'))})`);
    expect(h1).toMatch(/^[0-9a-f]{64}$/);
    expect(h2).not.toBe(h1);
  });
});
