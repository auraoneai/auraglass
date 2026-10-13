import { describe, expect, it, jest } from '@jest/globals';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import * as mappings from '../../src/migrate/4to5/mappings.js';
import { runV5 } from '../../src/doctor/v5.js';

describe('doctor --v5 finding order', () => {
  it('orders duplicate symbol matches independently of mapping assembly order', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'agt-doctor-order-'));
    const rows = [
      { entry: '.', codemod: null, automation: 'manual', message: 'manual' },
      { entry: '.', codemod: 'canonical-names', automation: 'full', message: 'first' },
      { entry: '.', codemod: 'canonical-names', automation: 'full', message: 'second' },
      { entry: '.', codemod: 'canonical-names', automation: 'manual', message: 'review' },
      { entry: 'aura-glass/compat', codemod: 'canonical-names', automation: 'full', message: 'compat' },
    ].map((row) => ({ ...row, symbol: 'GlassExample', kind: 'export', status: 'active', removeIn: '5.0.0' }));
    const compiled: mappings.CompiledMappings = {
      components: {}, removed: {}, cssVars: {}, deps: [], subpaths: {},
      deprecations: rows, areaSpecs: {}, names: new Set(),
    };
    const loader = jest.spyOn(mappings, 'loadCompiledMappings').mockReturnValue(compiled);
    try {
      fs.writeFileSync(path.join(dir, 'example.ts'), "import { GlassExample } from 'aura-glass/compat';\n");
      const expected = runV5(dir);
      expect(expected.findings.map((finding) => finding.message)).toEqual(['manual', 'first', 'second', 'review', 'compat']);
      loader.mockReturnValue({ ...compiled, deprecations: [...rows].reverse() });
      expect(runV5(dir)).toEqual(expected);
    } finally {
      loader.mockRestore();
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
});
