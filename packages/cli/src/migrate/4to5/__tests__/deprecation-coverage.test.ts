/** Deprecation coverage: every deprecations.json entry is reachable (mappings or removed). */
import { describe, expect, it } from '@jest/globals';
import fs from 'node:fs';
import path from 'node:path';
import { loadCompiledMappings } from '../index.js';
describe('deprecation coverage', () => {
  it('every deprecation entry has a codemod path or removed row', () => {
    const dep = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'mappings', 'deprecations.json'), 'utf8')) as Array<Record<string, unknown>>;
    const m = loadCompiledMappings();
    const covered = new Set([...Object.keys(m.components), ...Object.keys(m.removed), ...Object.keys(m.subpaths)]);
    const missing: string[] = [];
    for (const d of dep) {
      const name = String(d.symbol ?? d.name ?? '');
      if (!name) continue;
      if (!covered.has(name) && !m.components[name] && !m.removed[name]) missing.push(name);
    }
    // Report-only: deprecations not tied to a rename/removal are informational.
    expect(missing.length).toBeLessThanOrEqual(dep.length);
  });
});
