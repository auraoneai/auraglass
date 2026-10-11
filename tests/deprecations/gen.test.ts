/* @jest-environment node */
/* tests/deprecations/gen.test.ts — REQ-PLAT-24 (PLAT-179..182), AC-FIN-33.
   - deprecations.json is untracked + git-ignored, generated at prepack
   - outputs: sorted json without internals, runtime-kinds table, docs anchors
     titled from the breaking register
   - CLI on a temp root: --check exits 0 on a fresh tree with no
     deprecations.json, exits 1 after a one-character hand edit of
     src/internal/deprecations.generated.ts, and --schema --check equals the
     committed schema (regeneration equality)
   - the schema is derived from src/contracts/fragments.ts by the checker */
import { execFileSync, spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { createRequire } from 'node:module';
import { docsMd, genSchema, jsonOut, tsTable } from '../../scripts/release/gen-deprecations.mjs';

const REPO = process.cwd();
const GEN = join(REPO, 'scripts/release/gen-deprecations.mjs');
const E = (o: Record<string, unknown> = {}) => ({
  id: 'DEP-P0001', kind: 'export', status: 'active', entry: '.', symbol: 'Old',
  since: '4.2.0', removeIn: '5.0.0', replacement: 'New', codemod: 'canonical-names',
  automation: 'full', breaking: 'B4', message: 'use New', doc: '#dep-dep-p0001',
  stream: 'plat', file: 'fragments/deprecations/plat.ts', ...o,
});

describe('deprecations.json is a build product (REQ-PLAT-24)', () => {
  it('is untracked and git-ignored', () => {
    expect(execFileSync('git', ['ls-files', 'deprecations.json'], { encoding: 'utf8' }).trim()).toBe('');
    expect(spawnSync('git', ['check-ignore', '-q', 'deprecations.json']).status).toBe(0);
  });
  it('is generated at prepack and shipped in files', () => {
    const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
    expect(pkg.scripts.prepack).toBe('node scripts/release/gen-deprecations.mjs');
    expect(pkg.scripts['gen:deprecations']).toMatch(/^node scripts\/release\/gen-deprecations\.mjs\b/);
    expect(pkg.files).toContain('deprecations.json');
  });
});

describe('gen-deprecations outputs', () => {
  it('deprecations.json: $schema + version + sorted entries without internals', () => {
    const j = JSON.parse(jsonOut([E({ id: 'DEP-P0002' }), E({ id: 'DEP-P0009' }), E()]));
    expect(j.$schema).toBe('./docs/schemas/deprecations.schema.json');
    expect(j.version).toBe(1);
    expect(j.entries.map((e: { id: string }) => e.id)).toEqual(['DEP-P0001', 'DEP-P0002', 'DEP-P0009']);
    expect(j.entries[0].file).toBeUndefined();
    expect(j.entries[0].stream).toBeUndefined();
  });
  it('generated .ts table contains only active runtime kinds', () => {
    const ts = tsTable([
      E(), E({ id: 'DEP-P0002', status: 'planned' }),
      E({ id: 'DEP-P0003', kind: 'subpath' }), E({ id: 'DEP-P0004', kind: 'cli' }),
    ]);
    const table = ts.slice(ts.indexOf('export const DEPRECATIONS'), ts.indexOf('export const deprecations'));
    expect(table).toContain('"DEP-P0001":');
    expect(table).not.toContain('"DEP-P0002":');
    expect(table).not.toContain('"DEP-P0003":');
    expect(table).toContain('"DEP-P0004":');
    expect(ts).toContain('do not edit');
    expect(tsTable([E({ codemod: null })])).toContain('codemod: null');
  });
  it('docs output groups by breaking id with register titles and #dep- anchors', () => {
    const md = docsMd([E({ breaking: 'B9' }), E({ id: 'DEP-P0002', breaking: 'B4' })],
      [{ id: 'B4', title: 'Removed subpaths' }]);
    expect(md).toContain('<h2 id="b-4">B4 — Removed subpaths</h2>');
    expect(md).toContain('<h2 id="b-9">B9</h2>');
    expect(md).toContain('<h3 id="dep-dep-p0001">');
    expect(md).toContain('--transform canonical-names');
    expect(md.indexOf('b-4')).toBeLessThan(md.indexOf('b-9'));
  });
});

describe('schema derived through the type checker', () => {
  const ts = createRequire(join(REPO, 'package.json'))('typescript');
  const dir = mkdtempSync(join(tmpdir(), 'ag-gen-schema-'));
  afterAll(() => rmSync(dir, { recursive: true, force: true }));
  const contract = readFileSync(join(REPO, 'src/contracts/fragments.ts'), 'utf8');
  const items = (s: string) => JSON.parse(s).properties.entries.items;

  it('kind/codemod enums follow the contract aliases (no hard-coded copy)', () => {
    const f = join(dir, 'fragments.ts');
    writeFileSync(f, contract
      .replace("| 'data-attr' | 'asset';", "| 'data-attr' | 'asset' | 'token';")
      .replace("'motion-props': 'mat' }", "'motion-props': 'mat', 'qual-x': 'qual' }"));
    const s = items(genSchema(ts, { contractsFile: f }));
    expect(s.properties.kind.enum).toContain('token');
    expect(s.properties.codemod.anyOf[0].enum).toContain('qual-x');
    expect(s.properties.codemod.anyOf[1]).toEqual({ type: 'null' });
  });
  it('template-literal patterns come from the checker', () => {
    const s = items(genSchema(ts, { contractsFile: join(REPO, 'src/contracts/fragments.ts') }));
    const re = (k: string) => new RegExp(s.properties[k].pattern);
    expect(re('id').test('DEP-S0632')).toBe(true);
    expect(re('id').test('DEP-X0001')).toBe(false);
    expect(re('since').test('4.3.0')).toBe(true);
    expect(re('since').test('5.0.0')).toBe(false);
    expect(re('breaking').test('B21')).toBe(true);
    expect(re('doc').test('#dep-dep-c0001')).toBe(true);
    expect(s.properties.replacement.anyOf).toEqual([{ type: 'string' }, { type: 'null' }]);
    expect(s.required).not.toContain('compat');
    expect(s.additionalProperties).toBe(false);
  });
});

describe('gen-deprecations CLI on a temp tree', () => {
  let root = '';
  beforeAll(() => {
    // realpath: the CLI's is-main guard compares argv[1] with import.meta.url,
    // and macOS tmpdir() is a /var → /private/var symlink
    root = realpathSync(mkdtempSync(join(tmpdir(), 'ag-gen-cli-')));
    for (const p of ['src/contracts/load-fragments.mjs', 'src/contracts/fragments.ts', 'docs/schemas/deprecations.schema.json', 'docs/release/breaking-changes.json']) {
      mkdirSync(join(root, p, '..'), { recursive: true });
      cpSync(join(REPO, p), join(root, p));
    }
    mkdirSync(join(root, 'scripts/release/lib'), { recursive: true });
    cpSync(join(REPO, 'scripts/release/lib'), join(root, 'scripts/release/lib'), { recursive: true });
    cpSync(GEN, join(root, 'scripts/release/gen-deprecations.mjs'));
    symlinkSync(join(REPO, 'node_modules'), join(root, 'node_modules'), 'dir');
    mkdirSync(join(root, 'fragments/deprecations'), { recursive: true });
    writeFileSync(join(root, 'fragments/deprecations/plat.ts'), `export default [
  { id: 'DEP-P0002', kind: 'export', status: 'active', entry: '.', symbol: 'GlassOld', since: '4.2.0', removeIn: '5.0.0',
    replacement: 'New', codemod: 'canonical-names', automation: 'full', breaking: 'B5', message: 'GlassOld is New in 5.0.', doc: '#dep-dep-p0002' },
  { id: 'DEP-P0001', kind: 'subpath', status: 'planned', entry: './old', symbol: './old', since: '4.3.0', removeIn: '5.0.0',
    replacement: null, codemod: null, automation: 'none', breaking: 'B4', message: './old is removed in 5.0.', doc: '#dep-dep-p0001' },
];
`);
  });
  afterAll(() => rmSync(root, { recursive: true, force: true }));
  // the CLI resolves paths from its own location, so run the temp copy
  const GEN_TMP = () => join(root, 'scripts/release/gen-deprecations.mjs');
  const runTmp = (...args: string[]) => spawnSync('node', [GEN_TMP(), ...args], { cwd: root, encoding: 'utf8' });

  it('writes the committed table and the git-ignored json', () => {
    const r = runTmp('--schema');
    expect(r.stdout).toMatch(/gen-deprecations: 2 entries -> 3 target\(s\) written/);
    expect(r.stderr).toBe('');
    expect(r.status).toBe(0);
    const j = JSON.parse(readFileSync(join(root, 'deprecations.json'), 'utf8'));
    expect(j.entries.map((e: { id: string }) => e.id)).toEqual(['DEP-P0001', 'DEP-P0002']);
    expect(readFileSync(join(root, 'src/internal/deprecations.generated.ts'), 'utf8')).toContain('"DEP-P0002": { id: "DEP-P0002"');
  });
  it('--check passes without deprecations.json (clean CI checkout)', () => {
    rmSync(join(root, 'deprecations.json'));
    const r = runTmp('--check');
    expect(r.status).toBe(0);
    expect(existsSync(join(root, 'deprecations.json'))).toBe(false);
  });
  it('--schema --check equals the regenerated schema', () => {
    expect(runTmp('--schema', '--check').status).toBe(0);
    expect(readFileSync(join(root, 'docs/schemas/deprecations.schema.json'), 'utf8'))
      .toBe(readFileSync(join(REPO, 'docs/schemas/deprecations.schema.json'), 'utf8'));
  });
  it('--check exits 1 after a one-character hand edit of the generated table', () => {
    const p = join(root, 'src/internal/deprecations.generated.ts');
    const orig = readFileSync(p, 'utf8');
    writeFileSync(p, orig.replace('GlassOld is New', 'GlassOld is Mew'));
    const r = runTmp('--check');
    expect(r.status).toBe(1);
    expect(r.stderr).toMatch(/--check FAIL.*deprecations\.generated\.ts/);
    writeFileSync(p, orig);
    expect(runTmp('--check').status).toBe(0);
  });
  it('--schema --check exits 1 after a hand edit of the schema', () => {
    const p = join(root, 'docs/schemas/deprecations.schema.json');
    writeFileSync(p, readFileSync(p, 'utf8').replace('"asset"', '"assets"'));
    expect(runTmp('--schema', '--check').status).toBe(1);
  });
  it('the repo tree passes --schema --check', () => {
    const r = spawnSync('node', [GEN, '--schema', '--check'], { cwd: REPO, encoding: 'utf8' });
    expect(r.stderr).toBe('');
    expect(r.status).toBe(0);
  });
});
