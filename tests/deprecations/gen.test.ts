/* @jest-environment node */
/* tests/deprecations/gen.test.ts — REQ-PLAT-24 (4.x side, REQ-FIN-33 / AC-FIN-33).
   scripts/release/gen-deprecations.mjs: deterministic outputs, the committed
   generated table and schema are in sync with the fragments (`--check`,
   `--schema --check`), `--check` fails after a one-character hand edit, the
   schema is derived from the contract types (not a hand-kept enum list), and
   deprecations.json is an untracked prepack output. Hermetic cases run the
   script's main() against a temp copy of the repo inputs. */
import { describe, expect, it, afterAll } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

const ROOT = join(__dirname, '..', '..');
const GEN = join(ROOT, 'scripts/release/gen-deprecations.mjs');

/** Runs an ES module snippet with `m` bound to gen-deprecations.mjs; returns the parsed JSON of its last stdout line. */
const esm = (body: string): any => JSON.parse(execFileSync('node', ['--input-type=module', '-e',
  `const m = await import(${JSON.stringify(GEN)}); ${body}`], { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
  .trim().split('\n').at(-1) as string);

const temps: string[] = [];
afterAll(() => { for (const t of temps) rmSync(t, { recursive: true, force: true }); });

/** Temp root with the real fragments, contracts, register and committed generated outputs. */
function tempRoot(): string {
  const t = mkdtempSync(join(tmpdir(), 'ag-gen-dep-'));
  temps.push(t);
  for (const rel of ['fragments/deprecations', 'src/contracts', 'docs/release/breaking-changes.json',
    'docs/schemas/deprecations.schema.json', 'src/internal/deprecations.generated.ts']) {
    mkdirSync(dirname(join(t, rel)), { recursive: true });
    cpSync(join(ROOT, rel), join(t, rel), { recursive: true });
  }
  symlinkSync(join(ROOT, 'node_modules'), join(t, 'node_modules'));
  return t;
}
const mainIn = (root: string, args: string[]): number =>
  esm(`console.log(JSON.stringify(await m.main(${JSON.stringify(args)}, { root: ${JSON.stringify(root)} })));`);

const E = (o: Record<string, unknown> = {}) => ({
  id: 'DEP-P0001', kind: 'export', status: 'active', entry: '.', symbol: 'Old',
  since: '4.2.0', removeIn: '5.0.0', replacement: 'New', codemod: 'canonical-names',
  automation: 'full', breaking: 'B4', message: 'use New', doc: '#dep-dep-p0001',
  stream: 'plat', file: 'fragments/deprecations/plat.ts', ...o,
});

describe('gen-deprecations outputs', () => {
  it('deprecations.json: $schema + version + id-sorted entries without loader internals', () => {
    const j = JSON.parse(esm(`console.log(JSON.stringify(m.jsonOut(${JSON.stringify([E({ id: 'DEP-P0002' }), E({ id: 'DEP-P0009' }), E()])})));`));
    expect(j.$schema).toBe('./docs/schemas/deprecations.schema.json');
    expect(j.version).toBe(1);
    expect(j.entries.map((e: any) => e.id)).toEqual(['DEP-P0001', 'DEP-P0002', 'DEP-P0009']);
    expect(j.entries[0].file).toBeUndefined();
    expect(j.entries[0].stream).toBeUndefined();
  });

  it('the generated table lists only active entries of runtime kinds', () => {
    const ts: string = esm(`console.log(JSON.stringify(m.tsTable(${JSON.stringify([
      E(), E({ id: 'DEP-P0002', status: 'planned' }), E({ id: 'DEP-P0003', kind: 'subpath' }),
      E({ id: 'DEP-P0004', kind: 'cli' }), E({ id: 'DEP-P0005', kind: 'css-var' }),
    ])})));`);
    const table = ts.slice(ts.indexOf('DEPRECATIONS'), ts.indexOf('export const deprecations'));
    expect(table).toContain('"DEP-P0001":');
    expect(table).toContain('"DEP-P0004":');
    expect(table).not.toContain('"DEP-P0002":');
    expect(table).not.toContain('"DEP-P0003":');
    expect(table).not.toContain('"DEP-P0005":');
    expect(ts).toContain('do not edit');
  });

  it('the guide groups entries under #b-<n> headings titled from the register', () => {
    const md: string = esm(`console.log(JSON.stringify(m.docsMd(${JSON.stringify([E({ breaking: 'B9' }), E({ id: 'DEP-P0002', breaking: 'B4' })])},
      [{ id: 'B4', title: 'Re-exports' }])));`);
    expect(md).toContain('<h2 id="b-4">B4 — Re-exports</h2>');
    expect(md).toContain('<h2 id="b-9">B9</h2>');
    expect(md).toContain('<h3 id="dep-dep-p0001">');
    expect(md).toContain('--transform canonical-names');
    expect(md.indexOf('id="b-4"')).toBeLessThan(md.indexOf('id="b-9"'));
  });

  it('main --docs passes the breaking register titles into the guide', () => {
    const t = tempRoot();
    expect(mainIn(t, ['--docs'])).toBe(0);
    const register = JSON.parse(readFileSync(join(t, 'docs/release/breaking-changes.json'), 'utf8'));
    const guide = readFileSync(join(t, 'apps/docs/generated/migration/deprecations.md'), 'utf8');
    const titled = (register.items ?? register.changes).filter((b: any) => guide.includes(`<h2 id="b-${b.id.slice(1)}">${b.id} — ${b.title}</h2>`));
    expect(titled.length).toBeGreaterThan(0);
  });
});

describe('gen-deprecations --check on this line', () => {
  it('--check and --schema --check exit 0 on the committed tree', () => {
    const run = (args: string[]) => {
      try { execFileSync('node', [GEN, ...args], { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' }); return 0; } catch (e: any) { return e.status ?? 1; }
    };
    expect(run(['--check'])).toBe(0);
    expect(run(['--schema', '--check'])).toBe(0);
  });

  it('--check exits 1 after editing one character of src/internal/deprecations.generated.ts', () => {
    const t = tempRoot();
    expect(mainIn(t, ['--check'])).toBe(0);
    const p = join(t, 'src/internal/deprecations.generated.ts');
    const text = readFileSync(p, 'utf8');
    const i = text.indexOf('do not edit');
    writeFileSync(p, `${text.slice(0, i)}Do not edit${text.slice(i + 'do not edit'.length)}`);
    expect(mainIn(t, ['--check'])).toBe(1);
    expect(mainIn(t, [])).toBe(0);
    expect(readFileSync(p, 'utf8')).toBe(text);
  });

  it('--schema --check exits 1 after a hand edit of the schema', () => {
    const t = tempRoot();
    const p = join(t, 'docs/schemas/deprecations.schema.json');
    writeFileSync(p, readFileSync(p, 'utf8').replace('"asset"', '"assets"'));
    expect(mainIn(t, ['--schema', '--check'])).toBe(1);
  });

  it('deprecations.json carries exactly the loaded fragment entries and is byte-stable', () => {
    const t = tempRoot();
    expect(mainIn(t, [])).toBe(0);
    const first = readFileSync(join(t, 'deprecations.json'), 'utf8');
    const loaded: number = esm(`console.log(JSON.stringify((await m.loadEntries(${JSON.stringify(t)})).length));`);
    expect(JSON.parse(first).entries).toHaveLength(loaded);
    expect(loaded).toBeGreaterThan(0);
    expect(mainIn(t, [])).toBe(0);
    expect(readFileSync(join(t, 'deprecations.json'), 'utf8')).toBe(first);
  });
});

describe('schema is derived from the contract types', () => {
  it('regenerating from src/contracts/fragments.ts equals the committed schema', () => {
    const fresh: string = esm(`const { createRequire } = await import('node:module');
      const ts = createRequire(${JSON.stringify(GEN)})('typescript');
      console.log(JSON.stringify(m.genSchema(ts, { contractsFile: ${JSON.stringify(join(ROOT, 'src/contracts/fragments.ts'))} })));`);
    expect(fresh).toBe(readFileSync(join(ROOT, 'docs/schemas/deprecations.schema.json'), 'utf8'));
  });

  it('a new DeprecationKind / CodemodId literal and id prefix flow into the schema', () => {
    const t = tempRoot();
    const p = join(t, 'src/contracts/fragments.ts');
    const src = readFileSync(p, 'utf8')
      .replace("export type DeprecationKind = 'export'", "export type DeprecationKind = 'zz-kind' | 'export'")
      .replace("'motion-imports': 'mat'", "'motion-imports': 'mat', 'zz-codemod': 'mat'")
      .replace("`DEP-${'P' | 'M' | 'C' | 'S' | 'Q'}${number}`", "`DEP-${'P' | 'M' | 'C' | 'S' | 'Q' | 'Z'}${number}`");
    expect(src).not.toBe(readFileSync(p, 'utf8'));
    writeFileSync(p, src);
    const schema = JSON.parse(esm(`const { createRequire } = await import('node:module');
      const ts = createRequire(${JSON.stringify(GEN)})('typescript');
      console.log(JSON.stringify(m.genSchema(ts, { contractsFile: ${JSON.stringify(p)} })));`));
    const props = schema.properties.entries.items.properties;
    expect(props.kind.enum).toContain('zz-kind');
    expect(props.codemod.anyOf[0].enum).toContain('zz-codemod');
    expect(props.codemod.anyOf[1]).toEqual({ type: 'null' });
    expect(props.id.pattern).toBe('^DEP-[PMCSQZ]\\d+$');
    expect(props.since.pattern).toBe('^4\\.\\d+\\.\\d+$');
  });
});

describe('deprecations.json is a prepack output on this line', () => {
  it('is untracked and git-ignored', () => {
    expect(execFileSync('git', ['ls-files', 'deprecations.json'], { cwd: ROOT, encoding: 'utf8' }).trim()).toBe('');
    expect(readFileSync(join(ROOT, '.gitignore'), 'utf8')).toMatch(/^\/?deprecations\.json$/m);
  });

  it('prepack runs the release generator and the second implementation is gone', () => {
    const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
    expect(pkg.scripts.prepack).toMatch(/node scripts\/release\/gen-deprecations\.mjs/);
    expect(pkg.files).toContain('deprecations.json');
    expect(existsSync(join(ROOT, 'scripts/ci/gen-deprecations.mjs'))).toBe(false);
  });
});
