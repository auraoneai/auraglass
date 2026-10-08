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
