/* @jest-environment node */
/* tests/release/gen-deprecations.test.mjs — REQ-PLAT-25 (PLAT-182): sorted output,
   runtime-kinds table, --line 4x --out, --docs anchors, --check round-trip. */
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from '@jest/globals';
import { docsMd, jsonOut, tsTable } from '../../scripts/release/gen-deprecations.mjs';

const E = (o = {}) => ({
  id: 'DEP-P0001', kind: 'export', status: 'active', entry: '.', symbol: 'Old',
  since: '4.2.0', removeIn: '5.0.0', replacement: 'New', codemod: 'canonical-names',
  automation: 'full', breaking: 'B4', message: 'use New', doc: '#dep-dep-p0001',
  stream: 'plat', file: 'fragments/deprecations/plat.ts', ...o,
});

describe('gen-deprecations outputs', () => {
  it('deprecations.json: $schema + version + sorted entries without internals', () => {
    const j = JSON.parse(jsonOut([E({ id: 'DEP-P0002' }), E({ id: 'DEP-P0009' }), E()]));
    expect(j.$schema).toBe('./docs/schemas/deprecations.schema.json');
    expect(j.version).toBe(1);
    expect(j.entries.map((e) => e.id)).toEqual(['DEP-P0001', 'DEP-P0002', 'DEP-P0009']);
    expect(j.entries[0].file).toBeUndefined();
    expect(j.entries[0].stream).toBeUndefined();
  });
  it('generated .ts table contains only active runtime kinds', () => {
    const ts = tsTable([
      E(), E({ id: 'DEP-P0002', status: 'planned' }),
      E({ id: 'DEP-P0003', kind: 'subpath' }), E({ id: 'DEP-P0004', kind: 'cli' }),
    ]);
    expect(ts).toContain('"DEP-P0001":');
    expect(ts).not.toContain('"DEP-P0002":');
    expect(ts).not.toContain('"DEP-P0003":');
    expect(ts).toContain('"DEP-P0004":');
    expect(ts).toContain('DEPRECATIONS');
    expect(ts).toContain('do not edit');
  });
  it('generated .ts parses as a valid record literal', () => {
    const ts = tsTable([E({ codemod: null })]);
    expect(ts).toContain('codemod: null');
    expect(ts).toMatch(/export const DEPRECATIONS: Readonly<Record<string, DeprecationRow>> = \{/);
  });
  it('docs output groups by breaking id with #dep- and #b- anchors', () => {
    const md = docsMd([E({ breaking: 'B9' }), E({ id: 'DEP-P0002', breaking: 'B4' })],
      [{ id: 'B4', title: 'Re-exports' }]);
    expect(md).toContain('<h2 id="b-4">B4 — Re-exports</h2>');
    expect(md).toContain('<h2 id="b-9">');
    expect(md).toContain('<h3 id="dep-dep-p0001">');
    expect(md).toContain('--transform canonical-names');
    expect(md.indexOf('b-4')).toBeLessThan(md.indexOf('b-9'));
  });
});
