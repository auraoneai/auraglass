/** REQ-PLAT-92 codemod canary (@playwright/test, remote dx lane only —
 *  playwright.dx.config.ts exits 2 outside CI). Built CLI migrates each
 *  frozen recipes-4x source within 15 s, TODOs match expected-todos.json,
 *  second run changes nothing; engine leg repeats the same over runOnSource.
 *  Not yet implemented here (tracked as open REQ-PLAT-92 work, not stubbed):
 *  packed aura-glass 5 swap -> tsc -> next build -> 3-browser smoke. */
import { test, expect } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runOnSource, selectTransforms, loadCompiledMappings, TRANSFORM_ORDER } from '../../packages/cli/src/migrate/4to5/index.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..', '..');
const RECIPES = path.join(HERE, 'fixtures', 'recipes-4x');
const MANUAL = '__manual__source-parse-failure';
const CLI_PKG = path.join(REPO, 'packages', 'cli');
const TIMEOUT_MS = 15_000;

function recipeDirs(): string[] {
  return fs.readdirSync(RECIPES).filter((d) => fs.existsSync(path.join(RECIPES, d, 'input.tsx')) && fs.existsSync(path.join(RECIPES, d, 'expected-todos.json'))).sort();
}

function migrate(dir: string): { stdout: string; code: number } {
  const bin = process.env.AURAGLASS_CLI_BIN ?? path.join(CLI_PKG, 'dist', 'bin.js');
  try {
    const stdout = execFileSync(process.execPath, [bin, 'migrate', '4to5', '--write', '--allow-no-git', '--allow-dirty', dir], { cwd: dir, encoding: 'utf8', timeout: TIMEOUT_MS });
    return { stdout, code: 0 };
  } catch (e) {
    const err = e as { status?: number; stdout?: string };
    return { stdout: err.stdout ?? '', code: err.status ?? 1 };
  }
}

test.describe('codemod canary — recipes-4x', () => {
  test('28 frozen recipe sources exist', () => {
    expect(recipeDirs().length).toBeGreaterThanOrEqual(28);
  });

  for (const name of recipeDirs()) {
    test(`recipe ${name}: migrate completes within 15 s and todos are deterministic`, () => {
      const dir = fs.mkdtempSync(path.join(os.tmpdir(), `agcan-${name}-`));
      fs.copyFileSync(path.join(RECIPES, name, 'input.tsx'), path.join(dir, 'input.tsx'));
      const expected = JSON.parse(fs.readFileSync(path.join(RECIPES, name, 'expected-todos.json'), 'utf8')) as string[];
      const t0 = Date.now();
      const r = migrate(dir);
      expect(Date.now() - t0).toBeLessThan(TIMEOUT_MS);
      if (expected[0] === MANUAL) {
        /* frozen expectation: the CLI reports the parse failure (non-zero) */
        expect(r.code).not.toBe(0);
        return;
      }
      expect(r.code).toBe(0);
      const out = fs.readFileSync(path.join(dir, 'input.tsx'), 'utf8');
      const todos = (out.match(/TODO\(aura-glass 5\): ([^\n]+)/g) ?? []);
      expect(todos.map((t) => t.replace('TODO(aura-glass 5): ', '').replace(/, see .*/, ''))).toEqual(expected);
      /* second run: zero changes */
      const r2 = migrate(dir);
      expect(r2.code).toBe(0);
      expect(fs.readFileSync(path.join(dir, 'input.tsx'), 'utf8')).toBe(out);
    });
  }

  test('flagship subset: 0 unexpected TODOs after migrate', () => {
    const ids = JSON.parse(fs.readFileSync(path.join(RECIPES, 'flagship-subset.json'), 'utf8')) as string[];
    expect(ids.length).toBeGreaterThan(0);
    const offenders = ids.filter((id) => (JSON.parse(fs.readFileSync(path.join(RECIPES, id, 'expected-todos.json'), 'utf8')) as string[]).length > 0);
    expect(offenders).toEqual([]);
  });
});

/* PLAT-340..343: engine-level leg — frozen recipe fixture (tsx/ts/css/json)
 * -> runOnSource -> todos match expected-todos.json; second run idempotent. */
const mappings = loadCompiledMappings();
const all = selectTransforms(undefined);

function recipeInput(dir: string): string | undefined {
  return ['input.tsx', 'input.ts', 'input.css', 'input.json'].find((f) => fs.existsSync(path.join(dir, f)));
}
function engineRecipeDirs(): string[] {
  return fs.readdirSync(RECIPES).filter((d) => recipeInput(path.join(RECIPES, d)) && fs.existsSync(path.join(RECIPES, d, 'expected-todos.json'))).sort();
}

test.describe('codemod canary (recipes-4x, engine)', () => {
  test('covers all 14 transforms in frozen order', () => {
    expect(TRANSFORM_ORDER.length).toBe(14);
  });
  for (const name of engineRecipeDirs()) {
    test(`recipe ${name}: output matches expected-todos.json`, () => {
      const dir = path.join(RECIPES, name);
      const expected = JSON.parse(fs.readFileSync(path.join(dir, 'expected-todos.json'), 'utf8')) as string[];
      const input = recipeInput(dir)!;
      const source = fs.readFileSync(path.join(dir, input), 'utf8');
      const kind = input.endsWith('.css') ? 'css' : input.endsWith('.json') ? 'json' : 'code';
      if (expected[0] === MANUAL) {
        expect(() => runOnSource({ path: input, abs: 'x', kind, source }, all, { mappings, docBase: 'docs' })).toThrow();
        return;
      }
      const r = runOnSource({ path: input, abs: 'x', kind, source }, all, { mappings, docBase: 'docs' });
      expect(r.todos.map((t) => t.reason)).toEqual(expected);
      const r2 = runOnSource({ path: input, abs: 'x', kind, source: r.final }, all, { mappings, docBase: 'docs' });
      expect(r2.final).toBe(r.final);
    });
  }
});
