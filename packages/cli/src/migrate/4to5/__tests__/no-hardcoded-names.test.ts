// No hard-coded component-name literals in transforms: every Glass* name in a
// transform must come from the compiled mappings (renames from/to, removed symbols,
// subpath entries, or known area-transform source names).
import { describe, expect, it } from '@jest/globals';
import fs from 'node:fs';
import path from 'node:path';
import { loadCompiledMappings } from '../index.js';
const dir = path.join(__dirname, '..', 'transforms');
const m = loadCompiledMappings();
const allowed = new Set<string>([
  ...Object.keys(m.components),
  ...Object.values(m.components).map((c: any) => c.to),
  ...Object.keys(m.removed),
  ...Object.values(m.subpaths ?? {}).flatMap((v: any) => (Array.isArray(v) ? v : [v])).map(String),
  ...m.names,
]);
describe('no-hardcoded-names', () => {
  for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.ts') && !f.startsWith('shared') && f !== 'strip.ts')) {
    it(`${f}: Glass* literals all come from mappings or documented spec names`, () => {
      const src = fs.readFileSync(path.join(dir, f), 'utf8');
      const hits = src.match(/Glass[A-Z][A-Za-z]+/g) ?? [];
      for (const h of hits) {
        expect(allowed.has(h)).toBe(true);
      }
    });
  }
});
