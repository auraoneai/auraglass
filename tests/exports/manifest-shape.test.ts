/* @jest-environment node */
/* REQ-PLAT-67 (PLAT-254/257): build/exports.manifest.json is verbatim from
   ENTRIES, and the package.json it generates has the 5.0 shape: "type":
   "module", no main/module/browser/bin, top-level types (node10 tools only),
   each JS entry exactly { types, default } in that order (C-5: no `css`
   condition), CSS entries strings, ./icons/* the only wildcard. */
import { describe, expect, it } from '@jest/globals';
import { ENTRIES } from '../../src/contracts/entries';
import { read } from '../build/helpers';

const manifest = JSON.parse(read('build/exports.manifest.json'));
const pkg = JSON.parse(read('package.json'));

describe('exports manifest shape (REQ-PLAT-67)', () => {
  it('is { $schema, version: 1, entries } with one row per ENTRIES subpath, in ENTRIES order', () => {
    expect(Object.keys(manifest)).toEqual(['$schema', 'version', 'entries']);
    expect(manifest.version).toBe(1);
    expect(manifest.entries.map((e: { subpath: string }) => e.subpath)).toEqual(ENTRIES.map((e) => e.subpath));
  });
  it('each row copies source/css from ENTRIES and derives types/default from the dist layout', () => {
    for (const [i, spec] of ENTRIES.entries()) {
      const row = manifest.entries[i];
      expect(row.source).toBe(spec.source);
      if (spec.css) expect(row.css).toBe(spec.css);
      if (spec.source.startsWith('src/')) {
        const base = spec.source.replace(/^src\//, 'dist/').replace(/\.tsx?$/, '');
        expect([row.types, row.default]).toEqual([`${base}.d.ts`, `${base}.js`]);
      } else {
        expect(row.types).toBeUndefined();
        expect(typeof row.default).toBe('string');
      }
    }
  });
});

describe('package.json shape (REQ-PLAT-67)', () => {
  it('"type": "module" with no main, module, browser or bin; types only for node10', () => {
    expect(pkg.type).toBe('module');
    for (const k of ['main', 'module', 'browser', 'bin']) expect(pkg).not.toHaveProperty(k);
    expect(pkg.types).toBe(pkg.exports['.'].types);
  });
  it('every JS entry is exactly { types, default } in that order; CSS/JSON entries are strings', () => {
    const bad: string[] = [];
    for (const [sub, cond] of Object.entries<unknown>(pkg.exports)) {
      if (typeof cond === 'string') {
        if (!/\.(css|json)$/.test(sub)) bad.push(`${sub}: string target for a non-CSS/JSON subpath`);
        continue;
      }
      const keys = Object.keys(cond as object);
      if (JSON.stringify(keys) !== '["types","default"]') bad.push(`${sub}: keys ${keys.join(',')}`);
    }
    expect(bad).toEqual([]);
  });
  it('no `css` condition anywhere (contract §4.7 C-5)', () => {
    expect(JSON.stringify(pkg.exports)).not.toMatch(/"css":/);
  });
  it('./icons/* is the only wildcard', () => {
    const wild = Object.entries<unknown>(pkg.exports)
      .filter(([k, v]) => k.includes('*') || JSON.stringify(v).includes('*'))
      .map(([k]) => k);
    expect(wild).toEqual(['./icons/*']);
  });
});
