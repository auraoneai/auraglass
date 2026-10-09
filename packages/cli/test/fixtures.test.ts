/**
 * PLAT-338/339 + §12.2: every fixture dir under fragments/codemods/<stream>/fixtures/
 * is discovered and run with byte-equality; 'pending' files declare expected gaps.
 */
import { describe, expect, it } from '@jest/globals';
import fs from 'node:fs';
import path from 'node:path';

import { discoverFixtures } from './helpers/fixture-discovery.js';


describe('codemod fixtures (all streams + cli __fixtures__)', () => {
  const cases = discoverFixtures();
  it('discovers fixtures', () => {
    expect(cases.length).toBeGreaterThan(0);
  });
  it(`case count covers cmp+mat+plat+surf (>=120 discovered)`, () => {
    const streams = new Set(cases.map((c) => c.stream));
    for (const s of ['cmp', 'mat', 'plat', 'surf']) expect(streams.has(s)).toBe(true);
    expect(cases.length).toBeGreaterThanOrEqual(120);
  });
  for (const c of cases.filter((c) => c.pending)) {
    // Pending fixtures are reported individually (not silently skipped): each
    // declares a documented gap reason and stays out of byte-equality until the
    // owning transform covers the golden shape.
    it(`${c.stream}/${c.group}/${c.name} [pending]`, () => {
      expect(c.pending!.length).toBeGreaterThan(0);
      expect(fs.existsSync(c.input)).toBe(true);
      expect(fs.existsSync(c.output)).toBe(true);
    });
  }
  for (const c of cases.filter((c) => !c.pending)) {
    const label = `${c.stream}/${c.group}/${c.name}`;
    it(label, async () => {
      const { runOnSource, selectTransforms, loadCompiledMappings } = await import('../src/migrate/4to5/index.js');
      const mappings = loadCompiledMappings();
      const source = fs.readFileSync(c.input, 'utf8');
      const kind = c.input.endsWith('.css') ? 'css' : c.input.endsWith('.json') ? 'json' : 'code';
      const r = runOnSource(
        { path: path.basename(c.input), abs: c.input, kind, source },
        selectTransforms([c.transform]),
        { mappings, docBase: 'docs' },
      );
      const gold = fs.readFileSync(c.output, 'utf8');
      // idempotence: transform(output) === output
      const r2 = runOnSource(
        { path: path.basename(c.output), abs: c.output, kind, source: gold },
        selectTransforms([c.transform]),
        { mappings, docBase: 'docs' },
      );
      expect(r2.final).toBe(gold);
      expect(r.final).toBe(gold);
    });
  }
});
