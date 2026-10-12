import { describe, expect, it } from '@jest/globals';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { loadCompiledMappings } from '../src/migrate/4to5/mappings.js';

describe('cross-stream compatibility mappings', () => {
  it.each([false, true])('preserves explicit compat routing regardless of stream order (%s)', (compatFirst) => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ag-mappings-'));
    const generic = { from: 'GlassMobileNav', fromEntry: '.', to: 'Sheet', toEntry: '.' };
    const compat = { from: 'GlassMobileNav', fromEntry: '.', to: 'GlassMobileNav', toEntry: './compat', compatOnly: true };
    try {
      const rows = compatFirst ? [compat, generic] : [generic, compat];
      rows.forEach((row, i) => fs.writeFileSync(path.join(dir, `${i}.json`), JSON.stringify({ renames: [row] })));
      expect(loadCompiledMappings(dir).components.GlassMobileNav).toEqual({
        to: 'GlassMobileNav', toEntry: 'aura-glass/compat', compatOnly: true,
      });
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
});
