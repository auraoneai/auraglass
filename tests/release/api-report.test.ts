/* @jest-environment node */
/* tests/release/api-report.test.ts — REQ-PLAT-22 (4x port): 40-of-47 report
   set, slug rule, manifest.json, unanalysable rows. api-report.mjs is ESM so
   each check execs real node --input-type=module on a fixture root. */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from '@jest/globals';

const S = 'scripts/build/api-report.mjs';
const EVAL = (body: string, cwd = process.cwd()): any =>
  JSON.parse(execFileSync('node', ['--input-type=module', '-e',
    `const m = await import('./${S}');\n${body}`], { encoding: 'utf8', cwd }));

function fixtureRoot() {
  const root = mkdtempSync(join(tmpdir(), 'api4x-'));
  const exportsField: Record<string, any> = {};
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
const run4x = (root: string) => EVAL(`console.log(JSON.stringify(m.run4x({ root: '${root}' }).manifest))`);

describe('api-report 4x mode', () => {
  // REQ-PLAT-55: every package.json `exports` key gets a report at the cut
  // commit (47 of 47), not only the 40 keys with a `types` condition.
  it('emits one report per exports key (47 of 47) + manifest; targetless asset keys are unanalysable', () => {
    const root = fixtureRoot();
    const { files, manifest } = EVAL(`const r = m.run4x({ root: '${root}' }); console.log(JSON.stringify({ files: r.files, manifest: r.manifest }))`);
    expect(manifest.keys).toHaveLength(47);
    expect(manifest.keys).toContain('.');
    const apiMds = Object.keys(files).filter((f) => f.endsWith('.api.md'));
    const exportJsons = Object.keys(files).filter((f) => f.endsWith('.exports.json'));
    expect(apiMds).toHaveLength(47);
    expect(exportJsons).toHaveLength(47);
    expect(files['etc/api/index.api.md']).toBeDefined();
    expect(files['etc/api/manifest.json']).toBeDefined();
    expect(apiMds).toContain('etc/api/e45.api.md');
    expect(manifest.unanalysable).toEqual(['./e40', './e41', './e42', './e43', './e44', './e45', './e46']);
    expect(JSON.parse(files['etc/api/e1.exports.json']).exports).toEqual(['I1', 'Name1']);
  });
  it('records an unanalysable key when its types target is missing', () => {
    const root = fixtureRoot();
    const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
    pkg.exports['./e1'].types = 'dist/gone.d.ts';
    writeFileSync(join(root, 'package.json'), JSON.stringify(pkg));
    expect(run4x(root).unanalysable).toContain('./e1');
  });
  it('committed 4x reports verify clean (--line 4x --check)', () => {
    const r = (() => {
      try {
        const out = execFileSync('node', [S, '--line', '4x', '--check'], { encoding: 'utf8' });
        return { code: 0, out };
      } catch (e: any) { return { code: e.status ?? 1, out: `${e.stdout}${e.stderr}` }; }
    })();
    // committed etc/api reports match what the current tree would emit
    expect(r.out).not.toContain('--check FAIL');
  });
});

describe('slug + helper units', () => {
  it.each([['.', 'index'], ['./a', 'a'], ['./a/b', 'a-b'], ['./material', 'material'], ['./css/material', 'css-material']])(
    'slugify(%s) === %s', (k, want) => {
      expect(EVAL(`console.log(JSON.stringify(m.slugify('${k}')))`)).toBe(want);
    });
  it('exportsKeysWithTypes filters the condition', () => {
    expect(EVAL(`console.log(JSON.stringify(m.exportsKeysWithTypes({ exports: { '.': { types: 'a.d.ts' }, './css': { css: 'a.css' } } })))`)).toEqual(['.']);
  });
  it('extractDtsNames reads export declarations', () => {
    expect(EVAL(`console.log(JSON.stringify(m.extractDtsNames("export declare const A: 1;\\nexport { B as C } from './x';\\nexport default {}", '')))`))
      .toEqual(['A', 'C', 'default']);
  });
  it('extractDtsNames reads `export type { … }` lists', () => {
    expect(EVAL(`console.log(JSON.stringify(m.extractDtsNames("export type { P, Q as R } from './x';\\nexport type{S};", '')))`))
      .toEqual(['P', 'R', 'S']);
  });
  it('extractDtsNames follows relative `export *` through the emitted d.ts graph (no default, cycles ok)', () => {
    const dir = mkdtempSync(join(tmpdir(), 'dts-star-'));
    mkdirSync(join(dir, 'components'), { recursive: true });
    writeFileSync(join(dir, 'index.d.ts'), `export * from "./components";\nexport * as ns from "./leaf";\nexport declare const Top: 1;\n`);
    writeFileSync(join(dir, 'components', 'index.d.ts'), `export * from "./Shell";\nexport * from "../leaf.js";\nexport * from "../index";\n`);
    writeFileSync(join(dir, 'components', 'Shell.d.ts'), `export declare const Shell: 1;\nexport interface ShellProps { a: 1 }\nexport default Shell;\n`);
    writeFileSync(join(dir, 'leaf.d.ts'), `export type { LeafT } from './t';\nexport declare function leaf(): void;\n`);
    const names = EVAL(`import { readFileSync } from 'node:fs'; console.log(JSON.stringify(m.extractDtsNames(readFileSync('${join(dir, 'index.d.ts')}', 'utf8'), '${dir}')))`);
    expect(names).toEqual(['LeafT', 'Shell', 'ShellProps', 'Top', 'leaf', 'ns']);
  });
  it('an unresolvable `export *` makes the key unanalysable instead of a short list', () => {
    const root = fixtureRoot();
    writeFileSync(join(root, 'dist/e2.d.ts'), `export * from "./missing";\nexport declare const Kept: 1;\n`);
    const { manifest, e2 } = EVAL(`const r = m.run4x({ root: '${root}' }); console.log(JSON.stringify({ manifest: r.manifest, e2: JSON.parse(r.files['etc/api/e2.exports.json']) }))`);
    expect(manifest.unanalysable).toContain('./e2');
    expect(e2.unanalysable.join('\n')).toMatch(/cannot resolve `export \* from '\.\/missing'`/);
  });
  it('reportFiles is deterministic', () => {
    const a = EVAL(`console.log(JSON.stringify(m.reportFiles('a-cmp.button', ['B','A'], { unanalysable: [] })))`);
    expect(a.exportsJson).toContain('"exports": [\n  "A",\n  "B"');
    expect(a.apiMd).toContain('aura-glass a-cmp.button');
  });
  it('extractCssApi collects --ag- vars uniquely', () => {
    const f = join(mkdtempSync(join(tmpdir(), 'css-')), 'x.css');
    writeFileSync(f, ':root{--ag-blur:1;--ag-blur:2;--ag-alpha:.5}');
    expect(EVAL(`console.log(JSON.stringify(m.extractCssApi('${f}')))`)).toEqual(['--ag-alpha', '--ag-blur']);
  });
});
