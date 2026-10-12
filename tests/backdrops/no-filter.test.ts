/** @jest-environment node */
// tests/backdrops/no-filter.test.ts — REQ-SURF-156: aurora/mesh (and every
// other preset sheet) are pure gradient stacks on one element — no `filter`
// or `backdrop-filter` declaration may appear in src/backdrops/presets/*.css.
// This is the stylelint declaration ban, exercised as a Jest test so it runs
// on L1 with the other backdrop suites (tests/backdrops/**).
import { describe, expect, it } from '@jest/globals';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const PRESETS = join(process.cwd(), 'src', 'backdrops', 'presets');

/** Filter declarations in a sheet, with comments stripped so prose such as
 *  "no filter" in a header comment never counts. A custom property whose
 *  name merely ends in `-filter` is not a declaration of the property. */
export function filterDeclarations(css: string): string[] {
  const stripped = css.replace(/\/\*[\s\S]*?\*\//g, '');
  return [...stripped.matchAll(/(^|[^-])((?:backdrop-)?filter\s*:)/g)].map((m) => m[2]!.trim());
}

const sheets = readdirSync(PRESETS).filter((f) => f.endsWith('.css')).sort();

describe('backdrop presets ban filter (REQ-SURF-156)', () => {
  it('finds the preset sheets, aurora and mesh included', () => {
    expect(sheets).toContain('aurora.css');
    expect(sheets).toContain('mesh.css');
    expect(sheets.length).toBeGreaterThan(2);
  });

  it.each(sheets)('%s declares no filter / backdrop-filter', (file) => {
    const css = readFileSync(join(PRESETS, file), 'utf8');
    expect(filterDeclarations(css)).toEqual([]);
  });

  it('mutation: a planted filter: blur(1px) is caught', () => {
    // eslint-disable-next-line auraglass/no-optics-outside-material -- negative control: planted declaration the detector must catch (REQ-SURF-156); CSS text input, never rendered
    expect(filterDeclarations('.x { filter: blur(1px); }')).toEqual(['filter:']);
    // eslint-disable-next-line auraglass/no-optics-outside-material -- negative control: planted declaration the detector must catch (REQ-SURF-156); CSS text input, never rendered
    expect(filterDeclarations('.x { backdrop-filter: blur(1px); }')).toEqual(['backdrop-filter:']);
  });

  it('mutation: filter mentioned only in a comment is not a declaration', () => {
    expect(filterDeclarations('/* no filter: here */ .x { color: red; }')).toEqual([]);
  });
});
