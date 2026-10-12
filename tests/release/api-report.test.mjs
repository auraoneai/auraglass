/* @jest-environment node */
/* tests/release/api-report.test.ts — REQ-PLAT-22 (PLAT-175/176): 4x-mode report
   set (47 keys, 40 with types), the slug rule, manifest.json, unanalysable rows. */
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from '@jest/globals';
import {
  EXTRACTOR_VERSION, extractCssApi, extractDtsNames, exportsKeysWithTypes,
  reportFiles, run4x, slugify,
} from '../../scripts/build/api-report.mjs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const pkgJson = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8'));

function fixtureRoot() {
  const root = mkdtempSync(join(tmpdir(), 'api4x-'));
  const exportsField = {};
  for (let i = 0; i < 47; i++) {
    const key = i === 0 ? '.' : `./e${i}`;
    if (i < 40) {
      const dts = `dist/e${i}.d.ts`;
      mkdirSync(join(root, 'dist'), { recursive: true });
      writeFileSync(join(root, dts), `export declare const Name${i}: number;\nexport interface I${i} { a: 1 }\n`);
      exportsField[key] = { types: dts, default: `dist/e${i}.js` };
    } else exportsField[key] = { css: `dist/e${i}.css` };
  }
  writeFileSync(join(root, 'package.json'), JSON.stringify({ name: 'aura-glass', version: '4.1.0', exports: exportsField }));
  return root;
}

describe('api-report 4x mode', () => {
  it('emits one report per exports key with a types condition (40 of 47) + manifest', () => {
    const root = fixtureRoot();
    try {
      const { files, manifest } = run4x({ root });
      expect(manifest.keys).toHaveLength(40);
      expect(manifest.keys).toContain('.');
      const apiMds = Object.keys(files).filter((f) => f.endsWith('.api.md'));
      expect(apiMds).toHaveLength(40);
      expect(files['etc/api/index.api.md']).toBeDefined();
      expect(files['etc/api/manifest.json']).toBeDefined();
      expect(apiMds).not.toContain('etc/api/e45.api.md');
    } finally { rmSync(root, { recursive: true, force: true }); }
  });
  it('records an unanalysable key when its types target is missing', () => {
    const root = fixtureRoot();
    try {
      const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
      pkg.exports['./e1'].types = 'dist/gone.d.ts';
      writeFileSync(join(root, 'package.json'), JSON.stringify(pkg));
      const { manifest } = run4x({ root });
      expect(manifest.unanalysable).toContain('./e1');
    } finally { rmSync(root, { recursive: true, force: true }); }
  });
});

describe('slug + helper units', () => {
  it.each([['.', 'index'], ['./a', 'a'], ['./a/b', 'a-b'], ['./material', 'material'], ['./css/material', 'css-material']])(
    'slugify(%s) === %s', (k, want) => expect(slugify(k)).toBe(want));
  it('exportsKeysWithTypes filters the condition', () => {
    expect(exportsKeysWithTypes({ exports: { '.': { types: 'a.d.ts' }, './css': { css: 'a.css' } } })).toEqual(['.']);
  });
  it('real package.json exports with types are a strict subset of all keys', () => {
    const all = Object.keys(pkgJson.exports ?? {});
    const typed = exportsKeysWithTypes(pkgJson);
    expect(typed.length).toBeGreaterThan(0);
    for (const k of typed) expect(all).toContain(k);
  });
  it('extractDtsNames reads export declarations', () => {
    expect(extractDtsNames('export declare const A: 1;\nexport { B as C } from \'./x\';\nexport default {}', ''))
      .toEqual(['A', 'C', 'default']);
  });
  it('extractCssApi collects --ag- vars uniquely', () => {
    const f = join(mkdtempSync(join(tmpdir(), 'css-')), 'x.css');
    writeFileSync(f, ':root{--ag-blur:1;--ag-blur:2;--ag-alpha:.5}');
    expect(extractCssApi(f)).toEqual(['--ag-alpha', '--ag-blur']);
  });
  it('reportFiles is deterministic', () => {
    const a = reportFiles('a-cmp.button', ['B', 'A'], { unanalysable: [] });
    expect(a.exportsJson).toContain('"exports": [\n  "A",\n  "B"');
    expect(a.apiMd).toContain('aura-glass a-cmp.button');
  });
  it('repo pins API Extractor 7.59.4', () => {
    expect(pkgJson.devDependencies['@microsoft/api-extractor']).toMatch(/7\.59\.4/);
    expect(EXTRACTOR_VERSION).toBe('7.59.4');
    const resolved = require.resolve('@microsoft/api-extractor/package.json');
    expect(JSON.parse(readFileSync(resolved, 'utf8')).version).toBe('7.59.4');
  });
});

/* REQ-PLAT-22 bracket cases: 4x writes <slug>.exports.json and records the
   unanalysable error; an @/ alias is 'unanalysable' (exit 0) in 4x and a
   failure in 5x from 5.0.0-alpha.1; an added export is C-E and a removed one
   C-B through classify-change. */
import { jest } from '@jest/globals';
import { main as apiMain, run4x as run4xAgain, unresolvedAliases } from '../../scripts/build/api-report.mjs';
import { classify, diffApiReports } from '../../scripts/release/classify-change.mjs';

const quiet = async (fn) => {
  const e = jest.spyOn(console, 'error').mockImplementation(() => {});
  const l = jest.spyOn(console, 'log').mockImplementation(() => {});
  try { return await fn(); } finally { e.mockRestore(); l.mockRestore(); }
};

describe('api-report 4x: exports.json + unanalysable errors', () => {
  it('writes etc/api/<slug>.exports.json next to every .api.md', () => {
    const root = fixtureRoot();
    try {
      const { files, manifest } = run4xAgain({ root });
      expect(JSON.parse(files['etc/api/index.exports.json'])).toEqual({ entry: '.', exports: ['I0', 'Name0'], unanalysable: [] });
      expect(Object.keys(files).filter((f) => f.endsWith('.exports.json'))).toHaveLength(40);
      expect(manifest.entries.find((e) => e.key === '.')).toEqual({ key: '.', slug: 'index', apiReport: 'ok' });
    } finally { rmSync(root, { recursive: true, force: true }); }
  });
  it('an unresolved @/ alias is recorded unanalysable with its error, exit 0 in 4x', async () => {
    const root = fixtureRoot();
    try {
      writeFileSync(join(root, 'dist/e2.d.ts'), "export { Thing } from '@/components/thing';\nexport declare const Name2: number;\n");
      const { manifest, files } = run4xAgain({ root });
      expect(manifest.unanalysable).toEqual(['./e2']);
      const row = manifest.entries.find((e) => e.key === './e2');
      expect(row.apiReport).toBe('unanalysable');
      expect(row.error).toMatch(/@\/components\/thing/);
      expect(JSON.parse(files['etc/api/e2.exports.json']).unanalysable[0]).toMatch(/unresolved path alias/);
      expect(await quiet(() => apiMain(['--line', '4x'], { root }))).toBe(0);
      expect(JSON.parse(readFileSync(join(root, 'etc/api/manifest.json'), 'utf8')).entries.find((e) => e.key === './e2').apiReport).toBe('unanalysable');
    } finally { rmSync(root, { recursive: true, force: true }); }
  });
  it('a missing types file records its error', () => {
    const root = fixtureRoot();
    try {
      const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
      pkg.exports['./e1'].types = 'dist/gone.d.ts';
      writeFileSync(join(root, 'package.json'), JSON.stringify(pkg));
      expect(run4xAgain({ root }).manifest.entries.find((e) => e.key === './e1').error).toMatch(/dist\/gone\.d\.ts does not exist/);
    } finally { rmSync(root, { recursive: true, force: true }); }
  });
  it('unresolvedAliases finds from/import specifiers only', () => {
    expect(unresolvedAliases("import type { A } from '@/a';\nexport * from \"@/b\";\nexport type C = import('@/c').C;\nconst x = '@/not-an-import';"))
      .toEqual(['@/a', '@/b', '@/c']);
  });
});

describe('api-report 5x: @/ alias fails from 5.0.0-alpha.1', () => {
  const root5x = (version) => {
    const root = mkdtempSync(join(tmpdir(), 'api5x-'));
    const w = (rel, text) => { mkdirSync(join(root, rel, '..'), { recursive: true }); writeFileSync(join(root, rel), text); };
    w('package.json', JSON.stringify({ name: 'aura-glass', version, type: 'module' }));
    w('tsconfig.json', JSON.stringify({ compilerOptions: { baseUrl: '.', paths: { '@/*': ['./src/*'] } } }));
    w('build/exports.manifest.json', JSON.stringify({ entries: [{ subpath: './a', source: 'src/a/index.ts' }] }));
    w('src/a/index.ts', "export { Missing } from '@/nowhere/missing';\nexport const A1 = 1;\n");
    return root;
  };
  it.each([['5.0.0-alpha.1', 1], ['5.0.0-alpha.0', 0]])('version %s -> exit %s, unanalysable recorded', async (version, code) => {
    const root = root5x(version);
    try {
      expect(await quiet(() => apiMain(['--entry', 'a'], { root }))).toBe(code);
      expect(JSON.parse(readFileSync(join(root, 'etc/api/a.exports.json'), 'utf8')).unanalysable[0]).toMatch(/src\/a\/index\.ts/);
    } finally { rmSync(root, { recursive: true, force: true }); }
  });
});

describe('api-report diffs classify (added -> C-E, removed -> C-B)', () => {
  const setup = (baseNames, headNames) => {
    const fixture = mkdtempSync(join(tmpdir(), 'api-diff-'));
    const head = mkdtempSync(join(tmpdir(), 'api-head-'));
    mkdirSync(join(fixture, 'base/etc/api'), { recursive: true }); mkdirSync(join(head, 'etc/api'), { recursive: true });
    writeFileSync(join(fixture, 'base/etc/api/forms.exports.json'), reportFiles('./forms', baseNames).exportsJson);
    writeFileSync(join(head, 'etc/api/forms.exports.json'), reportFiles('./forms', headNames).exportsJson);
    const diffs = diffApiReports('base', ['etc/api/forms.exports.json'], fixture, { cwd: head });
    rmSync(fixture, { recursive: true, force: true }); rmSync(head, { recursive: true, force: true });
    return diffs;
  };
  const M = { hasBang: false, hasBreaking: false, multiFamily: [] };
  it('unchanged report -> C-I', () => {
    expect(classify({ apiDiffs: setup(['Field', 'Form'], ['Field', 'Form']), markers: M }).class).toBe('C-I');
  });
  it('added export -> C-E', () => {
    const d = setup(['Field'], ['Field', 'Form']);
    expect(d.forms).toEqual({ added: ['Form'], removed: [] });
    expect(classify({ apiDiffs: d, markers: M }).class).toBe('C-E');
  });
  it('removed export -> C-B', () => {
    const d = setup(['Field', 'Form'], ['Field']);
    expect(d.forms).toEqual({ added: [], removed: ['Form'] });
    expect(classify({ apiDiffs: d, markers: { ...M, hasBang: true } }).class).toBe('C-B');
  });
});
