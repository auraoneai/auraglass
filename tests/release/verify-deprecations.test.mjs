/* @jest-environment node */
/* tests/release/verify-deprecations.test.mjs — REQ-PLAT-25 (PLAT-184): each rule
   fails on a violating entry and passes on the valid fixture; append-only check. */
import { describe, expect, it } from '@jest/globals';
import { checkCompareBranch, checkEntries } from '../../scripts/release/verify-deprecations.mjs';

const OK = {
  id: 'DEP-P0001', kind: 'export', status: 'active', entry: '.', symbol: 'Old',
  since: '4.2.0', removeIn: '5.0.0', replacement: 'New', codemod: 'canonical-names',
  automation: 'full', breaking: 'B4', message: 'use New instead', doc: '#dep-dep-p0001',
};
const CTX = { entriesManifest: ['.'], rootExports: new Set(['Old']), breakingIds: new Set(['B4']) };

describe('checkEntries rule list', () => {
  it('accepts a fully valid entry', () => {
    expect(checkEntries([OK], CTX)).toEqual([]);
  });
  it.each([
    ['bad id', { id: 'DEP-X0001' }, /DEP-\[PMCSQ\]/],
    ['dup id', null, /duplicate id/],
    ['bad kind', { kind: 'module' }, /invalid kind/],
    ['bad status', { status: 'done' }, /invalid status/],
    ['unknown subpath', { entry: './nowhere' }, /not a 4\.x subpath/],
    ['non-root export symbol', { symbol: 'NotRoot' }, /not in ROOT_EXPORTS/],
    ['since not 4.x', { since: '5.0.0' }, /not a 4\.x\.y/],
    ['since before 4.2 removing in 5.0', { since: '4.1.0' }, />= 4\.2\.0/],
    ['removeIn invalid', { removeIn: '7.0.0' }, /5\.0\.0.*6\.0\.0|5\.0\.0' or '6\.0\.0/],
    ['codemod null but automation full', { codemod: null }, /automation is 'full'/],
    ['unknown codemod', { codemod: 'nope' }, /unknown codemod/],
    ['bad automation', { automation: 'magic' }, /invalid automation/],
    ['breaking not B-id', { breaking: 'BX' }, /must be B<n>/],
    ['breaking not in register', { breaking: 'B99' }, /not in docs\/release\/breaking-changes\.json/],
    ['message too long', { message: 'x'.repeat(201) }, /> 200/],
    ['doc not dep anchor', { doc: '#other' }, /#dep-\*/],
    ['bad exception', { exception: 'vibes', evidence: 'x' }, /invalid exception/],
    ['exception without evidence', { exception: 'security' }, /require evidence/],
  ])('%s fails', (_n, patch, re) => {
    const entries = patch === null ? [OK, { ...OK }] : [{ ...OK, ...patch }];
    expect(checkEntries(entries, CTX).join('\n')).toMatch(re);
  });
  it('exception entries may reference unknown subpaths/symbols', () => {
    const e = { ...OK, entry: './gone', symbol: 'Gone', exception: 'security', evidence: 'CVE-1' };
    expect(checkEntries([e], CTX)).toEqual([]);
  });
  it('manual automation allows codemod null', () => {
    expect(checkEntries([{ ...OK, codemod: null, automation: 'manual' }], CTX)).toEqual([]);
  });
});

describe('append-only vs compare branch', () => {
  it('flags removed ids and edited fields', () => {
    const base = [OK, { ...OK, id: 'DEP-P0002' }];
    expect(checkCompareBranch([OK], base).join('\n')).toMatch(/DEP-P0002: entry removed/);
    expect(checkCompareBranch([{ ...OK, since: '4.3.0' }], [OK]).join('\n')).toMatch(/field 'since' changed/);
  });
  it('allows pure additions', () => {
    expect(checkCompareBranch([OK, { ...OK, id: 'DEP-P0003' }], [OK])).toEqual([]);
  });
});
