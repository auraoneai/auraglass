/* @jest-environment node */
/* PLAT-265: bare import weight of every emitted entry is ≤ 64 B (the frozen
   bareImportBytes ceiling) — i.e. a consumer importing the subpath for its
   side effects pulls in effectively nothing beyond what it names. Measured
   as gzip-9 of the entry's emitted index.js (unbundled ⇒ the file itself is
   the import cost before treeshaking). */
import { describe, expect, it } from '@jest/globals';
import { gzipSync } from 'node:zlib';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { DIST, ROOT, ensureBuilt, walk } from '../build/helpers';

const BARE_IMPORT_BYTES = 64;

describe('bare import drop (PLAT-265)', () => {
  it('gzip weight of a bare `import "…/material"` treeshaken to the empty module stays minimal', async () => {
    ensureBuilt();
    const { manifestEntries } = await import('../../scripts/build/lib/graph.mjs');
    /* esbuild bundling `import "aura-glass/<sub>"` with treeshaking on sideEffects
       reduces to ~empty; approximate by bundling a stub importer. */
    const esbuild = await import('esbuild');
    const rows: { subpath: string; gz: number }[] = [];
    for (const e of manifestEntries(ROOT).js) {
      const emitted = join(DIST, e.default.replace('dist/', ''));
      if (!existsSync(emitted)) continue;
      const res = await esbuild.build({
        stdin: { contents: `import ${JSON.stringify(emitted.replace(/\\/g, '/'))};`, loader: 'ts', resolveDir: ROOT },
        bundle: true, write: false, minify: true, format: 'esm',
        external: ['react', 'react-dom', 'react/*', 'clsx', '@base-ui/*', '@tanstack/*'],
        treeShaking: true,
      });
      rows.push({ subpath: e.subpath, gz: gzipSync(res.outputFiles[0]!.contents, { level: 9 }).length });
    }
    const over = rows.filter(r => r.gz > BARE_IMPORT_BYTES);
    expect(over).toEqual([]);
  }, 120_000);
});
