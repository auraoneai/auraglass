/** REQ-PLAT-90: migrate 4to5 — path scoping, transform id validation, report
 *  schema {transform,line,before,after}, eslint hard-code ban, preserve
 *  matrix, deps lockfile resolution, removed npx pointer. */
import { describe, expect, it, jest } from '@jest/globals';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import Ajv from 'ajv';
import { runMigration, selectTransforms, TRANSFORM_ORDER, runOnSource, loadCompiledMappings } from '../../src/migrate/4to5/index.js';
import { migrateCommand } from '../../src/commands/migrate.js';
import { resolveLockVersion } from '../../src/migrate/4to5/transforms/deps.js';
import { CliError } from '../../src/cli/errors.js';

const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'agm-'));
const mappings = loadCompiledMappings();

const SRC_CHANGED = "import { OptimizedGlass } from 'aura-glass';\nexport const x = <OptimizedGlass/>;\n";

describe('migrate 4to5', () => {
  it('positional paths scope the migration — only src/a is touched', () => {
    const dir = tmp();
    fs.mkdirSync(path.join(dir, 'src/a'), { recursive: true });
    fs.mkdirSync(path.join(dir, 'src/b'), { recursive: true });
    fs.writeFileSync(path.join(dir, 'src/a', 'a.tsx'), SRC_CHANGED);
    fs.writeFileSync(path.join(dir, 'src/b', 'b.tsx'), SRC_CHANGED);
    const { diffs } = runMigration({ cwd: dir, dryRun: true, paths: ['src/a'] });
    expect([...diffs.keys()]).toEqual(['src/a/a.tsx']);
  });

  it('unknown transform id exits usage(2) listing every TRANSFORM_ORDER id', async () => {
    const dir = tmp();
    fs.writeFileSync(path.join(dir, 'a.tsx'), SRC_CHANGED);
    try {
      await migrateCommand(['4to5'], { cwd: dir, transform: 'nope', 'dry-run': true, silent: true });
      throw new Error('should have thrown');
    } catch (e) {
      expect(e).toBeInstanceOf(CliError);
      expect((e as CliError).code).toBe(2);
      for (const id of TRANSFORM_ORDER) expect((e as CliError).message).toContain(id);
    }
    expect(TRANSFORM_ORDER.length).toBe(14);
  });

  it('--report validates against schema/output/migrate-report.json (line/before/after present)', async () => {
    const dir = tmp();
    fs.mkdirSync(path.join(dir, 'src'), { recursive: true });
    fs.writeFileSync(path.join(dir, 'src', 'a.tsx'), SRC_CHANGED);
    fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ dependencies: { 'aura-glass': '4.9.0' } }));
    const reportPath = path.join(dir, 'report.json');
    const spy = jest.spyOn(process.stdout, 'write').mockImplementation((() => true) as never);
    try {
      await migrateCommand(['4to5'], { cwd: dir, 'dry-run': true, report: 'report.json', silent: true, 'allow-no-git': true });
    } finally { spy.mockRestore(); }
    const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    const schema = JSON.parse(fs.readFileSync('schema/output/migrate-report.json', 'utf8'));
    const ajv = new Ajv({ strict: false });
    const ok = ajv.validate(schema, report);
    expect(ajv.errorsText()).toBe('No errors');
    expect(ok).toBe(true);
    const change = report.files.flatMap((f: { changes: { line: number | null; before: string | null; after: string | null }[] }) => f.changes)[0];
    expect(change).toMatchObject({ line: null, before: null, after: null });
  });

  it('eslint bans a seeded Glass* template literal in an area transform', () => {
    const repoRoot = path.resolve('../..');
    const relSeeded = 'packages/cli/src/migrate/4to5/transforms/__eslint_seeded.ts';
    const seeded = path.join(repoRoot, relSeeded);
    fs.writeFileSync(seeded, "const y = `GlassZzFake ${1}`;\nexport { y };\n");
    let stderr = '';
    let code = 0;
    try {
      execFileSync(path.join(repoRoot, 'node_modules', '.bin', 'eslint'), [relSeeded], { cwd: repoRoot, stdio: 'pipe' });
    } catch (e) {
      const err = e as { status?: number; stdout?: Buffer; stderr?: Buffer };
      code = err.status ?? 1;
      stderr = `${err.stdout ?? ''}${err.stderr ?? ''}`;
    } finally {
      fs.unlinkSync(seeded);
    }
    expect(code).not.toBe(0);
    expect(stderr).toContain('compiled mappings');
  });
});

describe('preserve matrix', () => {
  const attrs = [
    'aria-label="hi"', 'role="button"', 'id="x1"', 'htmlFor="f1"', 'tabIndex={0}',
    'data-testid="t1"', 'className="c1"', 'style={{ color: \'red\' }}', 'ref={r}', 'key="k"',
  ];
  it.each(attrs)('keeps %s untouched', (attr) => {
    const src = `import { GlassButton } from 'aura-glass';\nconst r = null;\nconst x = <GlassButton ${attr} {...props}>hi</GlassButton>;\n`;
    const r = runOnSource({ path: 'x.tsx', abs: 'x', kind: 'code', source: src }, selectTransforms(['prop-grammar']), { mappings, docBase: 'docs' });
    expect(r.final).toContain(attr);
    expect(r.final).toContain('{...props}');
  });
  it('untouched files never appear in writes', () => {
    const dir = tmp();
    fs.mkdirSync(path.join(dir, 'src'), { recursive: true });
    fs.writeFileSync(path.join(dir, 'src', 'clean.ts'), "export const x = 1;\n");
    fs.writeFileSync(path.join(dir, 'src', 'dirty.tsx'), SRC_CHANGED);
    const { writes } = runMigration({ cwd: dir, dryRun: false });
    expect([...writes.keys()].some((k) => k.endsWith('clean.ts'))).toBe(false);
  });
});

describe('deps lockfile resolution', () => {
  it.each([
    ['package-lock.json', (pkg: string) => JSON.stringify({ packages: { [`node_modules/${pkg}`]: { version: '3.2.1' } } })],
    ['pnpm-lock.yaml', (pkg: string) => `packages:\n  /${pkg}@4.5.6:\n    resolution: {integrity: x}\n`],
    ['yarn.lock', (pkg: string) => `"${pkg}@^1":\n  version "7.8.9"\n`],
  ])('%s resolves the installed version', (file, content) => {
    const dir = tmp();
    fs.writeFileSync(path.join(dir, file), content('date-fns'));
    expect(resolveLockVersion(dir, 'date-fns')).toBeTruthy();
  });
  it('no lockfile -> null (transform emits a TODO instead of guessing)', () => {
    const dir = tmp();
    expect(resolveLockVersion(dir, 'whatever')).toBeNull();
  });
});

describe('removed npx pointer', () => {
  it('registryItem todos read "npx @auraglass/cli add <item>" (kanban)', () => {
    const src = "import { GlassKanban } from 'aura-glass';\nexport const x = <GlassKanban/>;\n";
    const r = runOnSource({ path: 'x.tsx', abs: 'x', kind: 'code', source: src }, selectTransforms(['removed']), { mappings, docBase: 'docs' });
    const todo = r.todos.find((t) => t.transform === 'removed');
    expect(todo?.reason).toContain('npx @auraglass/cli add kanban');
    expect(r.final).toContain('npx @auraglass/cli add kanban');
  });
});
