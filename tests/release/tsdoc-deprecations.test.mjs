/* @jest-environment node */
/* tests/release/tsdoc-deprecations.test.mjs — REQ-PLAT-27 (PLAT-189): TSDoc tag
   presence/format and the reverse check, over fixture sources. */
import { describe, expect, it } from '@jest/globals';
import { checkEntry, checkReverse, deprecatedTags } from '../../scripts/release/check-tsdoc-deprecated.mjs';

const SRC = `
/**
 * Use NewThing instead.
 * @deprecated since 4.2.0, removed in 5.0.0; {@link NewThing}
 */
export declare const OldThing: number;
export declare const Other: number;
`;

const entry = { id: 'DEP-P0001', kind: 'export', symbol: 'OldThing', since: '4.2.0', removeIn: '5.0.0', replacement: 'NewThing' };
const readFile = () => SRC;
const findFiles = () => ['src/x.ts'];

describe('check-tsdoc-deprecated', () => {
  it('passes when the declaration carries a matching tag', () => {
    expect(checkEntry({ entry, readFile, findFiles })).toEqual([]);
  });
  it('fails when since/removeIn mismatch', () => {
    const e = { ...entry, since: '4.3.0' };
    expect(checkEntry({ entry: e, readFile, findFiles }).join()).toMatch(/lacks 'since 4\.3\.0, removed in 5\.0\.0'/);
  });
  it('fails when replacement link missing', () => {
    const e = { ...entry, replacement: 'Different' };
    expect(checkEntry({ entry: e, readFile, findFiles }).join()).toMatch(/\{@link Different\}/);
  });
  it('fails when no declaration is found', () => {
    expect(checkEntry({ entry, readFile, findFiles: () => [] }).join()).toMatch(/no source declaration/);
  });
  it('ignores kinds outside export|prop|prop-value', () => {
    expect(checkEntry({ entry: { ...entry, kind: 'css-var' }, readFile, findFiles: () => [] })).toEqual([]);
  });
  it('deprecatedTags parses declarations', () => {
    const tags = deprecatedTags(SRC);
    expect(tags).toHaveLength(1);
    expect(tags[0].symbol).toBe('OldThing');
  });
  it('reverse: a removed-in tag without an entry fails', () => {
    const errs = checkReverse(['src/x.ts'], [entry], { readFile });
    expect(errs).toEqual([]);
    const other = () => '/** @deprecated since 4.2.0, removed in 5.0.0 */\nexport declare const Ghost: 1;';
    const errs2 = checkReverse(['src/y.ts'], [entry], { readFile: other });
    expect(errs2.join()).toMatch(/'Ghost' has no deprecation entry/);
  });
});
