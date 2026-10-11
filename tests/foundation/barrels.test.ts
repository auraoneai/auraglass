/* REQ-CMP-23 — barrels: root cmp exports == ROOT_EXPORTS.cmp exactly;
   primitives == the 6 contract names; forms == [FormField, useFormField]. */
import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT_EXPORTS } from '../../src/contracts/entries';
import * as rootCmp from '../../src/root/cmp';
import * as primitives from '../../src/primitives';
import * as forms from '../../src/forms';

const ROOT = join(__dirname, '..', '..');

function exportedNames(mod: Record<string, unknown>): string[] {
  return Object.keys(mod).filter((k) => k !== 'default').sort();
}

describe('REQ-CMP-23 barrels', () => {
  it('root cmp value exports == ROOT_EXPORTS.cmp exactly', () => {
    const names = exportedNames(rootCmp);
    expect(names).toEqual([...ROOT_EXPORTS.cmp].sort());
  });
  it('primitives exports the 6 contract names', () => {
    expect(exportedNames(primitives)).toEqual(
      ['DismissableLayer', 'FocusScope', 'Label', 'Portal', 'Slot', 'VisuallyHidden'].sort()
    );
  });
  it('forms exports [FormField, useFormField]', () => {
    expect(exportedNames(forms)).toEqual(['FormField', 'useFormField']);
  });
  it("package.json exports has '.', './primitives', './forms', './icons/*' + main/types", () => {
    const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
    for (const p of ['.', './primitives', './forms', './icons', './icons/*']) {
      expect(pkg.exports[p]).toBeDefined();
      expect(pkg.exports[p].default).toMatch(/^\.\/dist\//);
    }
    expect(pkg.main).toBe('./dist/index.js');
    expect(pkg.types).toBe('./dist/index.d.ts');
  });
});
