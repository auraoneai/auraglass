/** @jest-environment node */
// MAT-034: environment/elevation — exact @property rules; z-scale 0/100/1000/1100/1200;
// no 'elevation' token; shadows for 4 layers x 3 thicknesses x 2 schemes; scrim.clear 0.35.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import postcss from 'postcss';
import { ROOT } from '../../scripts/tokens/validate.mjs';

const css = readFileSync(join(ROOT, 'dist/css/tokens.css'), 'utf8');
const propsCss = readFileSync(join(ROOT, 'src/material/css/generated/properties.css'), 'utf8');
const root = postcss.parse(propsCss);

describe('environment/elevation (MAT-034)', () => {
  test('@property rules have syntax/inherits/initial-value', () => {
    const props: string[] = [];
    root.walkAtRules('property', (r) => {
      const name = r.params.trim();
      const decls: Record<string, string> = {};
      r.walkDecls((d) => { decls[d.prop] = d.value; });
      expect(decls.syntax).toMatch(/^['"].*['"]$/);
      expect(decls.inherits).toMatch(/^(true|false)$/);
      expect(decls['initial-value']).toBeTruthy();
      props.push(name);
    });
    expect(props.length).toBeGreaterThanOrEqual(14);
    console.log(`@property registrations: ${props.length}`);
  });

  test('z-scale is exactly 0/100/1000/1100/1200', () => {
    const z = [...css.matchAll(/--ag-z-([a-z]+):\s*(\d+)/g)].map((m) => +m[2]).sort((a, b) => a - b);
    expect(z).toEqual([0, 100, 1000, 1100, 1200]);
  });

  test('no elevation token', () => {
    expect(css).not.toMatch(/--_?ag-elev(?:ation)?-/);
  });

  test('shadows: 4 layers x 3 thicknesses x 2 schemes', () => {
    const vars = new Set([...css.matchAll(/--_ag-shadow-(content|chrome|overlay|transient)-(thin|regular|thick)/g)].map((m) => `${m[1]}-${m[2]}`));
    expect(vars.size).toBe(12);
    // each shadow is a scheme mode-table: both light + dark cells must appear
    const darkBlock = css.slice(css.indexOf('[data-ag-scheme="dark"]'), css.indexOf('@media (prefers-color-scheme: dark)'));
    for (const v of vars) expect(darkBlock).toContain(`--_ag-shadow-${v}:`);
  });

  test('scrim.clear = 0.35', () => {
    expect(css).toMatch(/--ag-scrim-clear:\s*0\.35/);
  });
});
