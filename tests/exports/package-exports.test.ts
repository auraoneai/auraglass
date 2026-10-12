/* @jest-environment node */
/* REQ-PLAT-67 (PLAT-257): package-exports order and wildcard. Every exported
   key is an ENTRIES subpath, the ./icons/* pattern hung off ./icons, or the
   CSS subpath of an entry's css bundle; JS targets live under dist/ and follow
   the source layout; the wildcard maps one-for-one onto src/icons/<name>. */
import { describe, expect, it } from '@jest/globals';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { ENTRIES } from '../../src/contracts/entries';
import { ROOT, read } from '../build/helpers';

const pkg = JSON.parse(read('package.json'));
const keys = Object.keys(pkg.exports);
const entrySubpaths = new Set(ENTRIES.map((e) => e.subpath));
const cssSubOf = (css: string) => './' + css.replace(/^dist\//, '');

describe('package exports (REQ-PLAT-67)', () => {
  it("'.' is first and './package.json' is last", () => {
    expect(keys[0]).toBe('.');
    expect(keys[keys.length - 1]).toBe('./package.json');
  });
  it('every key is an ENTRIES subpath, the icons pattern, or an entry css subpath', () => {
    const derivedCss = new Set(ENTRIES.filter((e) => e.css).map((e) => cssSubOf(e.css!)));
    const unknown = keys.filter((k) => !entrySubpaths.has(k) && k !== './icons/*' && !derivedCss.has(k));
    expect(unknown).toEqual([]);
  });
  it('ENTRIES order is preserved', () => {
    const order = keys.filter((k) => entrySubpaths.has(k));
    expect(order).toEqual(ENTRIES.map((e) => e.subpath).filter((s) => order.includes(s)));
  });
  it('JS targets mirror the entry source under dist/', () => {
    for (const e of ENTRIES) {
      const cond = pkg.exports[e.subpath];
      if (!cond || !e.source.startsWith('src/')) continue;
      const base = './' + e.source.replace(/^src\//, 'dist/').replace(/\.tsx?$/, '');
      expect([e.subpath, cond]).toEqual([e.subpath, { types: `${base}.d.ts`, default: `${base}.js` }]);
    }
  });
  it('each shipped entry with a css bundle exposes it as a string subpath', () => {
    for (const e of ENTRIES) {
      if (!e.css || !pkg.exports[e.subpath]) continue;
      expect([e.subpath, pkg.exports[cssSubOf(e.css)]]).toEqual([e.subpath, './' + e.css]);
    }
  });
  it('./icons/* follows ./icons and maps one-for-one onto src/icons/<name>', () => {
    expect(keys.indexOf('./icons/*')).toBe(keys.indexOf('./icons') + 1);
    expect(pkg.exports['./icons/*']).toEqual({ types: './dist/icons/*.d.ts', default: './dist/icons/*.js' });
    const names = readdirSync(join(ROOT, 'src/icons')).filter((n) => /\.tsx?$/.test(n) && !/\.test\./.test(n));
    expect(names.length).toBeGreaterThan(0);
  });
});
