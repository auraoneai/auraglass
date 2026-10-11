/* @jest-environment node */
/* PLAT-265: bare import weight of every emitted entry is ≤ 64 B (the frozen
   bareImportBytes ceiling) — i.e. a consumer importing the subpath for its
   side effects pulls in effectively nothing beyond what it names. Measured
   as gzip-9 of the entry's emitted index.js (unbundled ⇒ the file itself is
   the import cost before treeshaking). */
import { describe, expect, it } from '@jest/globals';
import { gzipSync } from 'node:zlib';
import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { DIST, ROOT, ensureBuilt, walk } from '../build/helpers';

const BARE_IMPORT_BYTES = 64;

const EXTERNALS = ['react', 'react-dom', 'react/*', 'clsx', '@base-ui/*', '@tanstack/*'];

const entries = async () => {
  const { manifestEntries } = await import('../../scripts/build/lib/graph.mjs');
  return manifestEntries(ROOT).js
    .map(e => ({ subpath: e.subpath, emitted: join(DIST, e.default.replace('dist/', '')) }))
    .filter(e => existsSync(e.emitted));
};

describe('bare import drop (REQ-PLAT-70)', () => {
  it('esbuild: gzip weight of every bare entry import ≤ 64 B', async () => {
    ensureBuilt();
    const esbuild = await import('esbuild');
    const rows: { subpath: string; gz: number }[] = [];
    for (const e of await entries()) {
      const res = await esbuild.build({
        stdin: { contents: `import ${JSON.stringify(e.emitted.replace(/\\/g, '/'))};`, loader: 'ts', resolveDir: ROOT },
        bundle: true, write: false, minify: true, format: 'esm',
        external: EXTERNALS, treeShaking: true,
      });
      rows.push({ subpath: e.subpath, gz: gzipSync(res.outputFiles[0]!.contents, { level: 9 }).length });
    }
    expect(rows.filter(r => r.gz > BARE_IMPORT_BYTES)).toEqual([]);
  }, 120_000);

  it('rolldown: gzip weight of every bare entry import ≤ 64 B', async () => {
    ensureBuilt();
    const { rolldown } = await import('rolldown');
    /* the entry file itself can never be treeshaken — model the consumer with
       a stub importer, exactly like the esbuild leg's stdin. */
    const stubDir = join(ROOT, '.artifacts', 'rolldown-stubs');
    mkdirSync(stubDir, { recursive: true });
    const rows: { subpath: string; gz: number }[] = [];
    for (const e of await entries()) {
      const stub = join(stubDir, `${e.subpath.replace(/\W+/g, '_')}.mjs`);
      writeFileSync(stub, `import ${JSON.stringify(e.emitted)};\n`);
      const b = await rolldown({
        input: stub,
        external: (id: string) => EXTERNALS.some(x => x.endsWith('/*') ? id.startsWith(x.slice(0, -1)) : id === x || id.startsWith(`${x}/`)),
        treeshake: true, logLevel: 'silent',
      });
      const { output } = await b.generate({ format: 'esm', minify: true, sourcemapIgnoreList: false });
      const code = output.map((o: any) => o.code ?? '').join('\n');
      rows.push({ subpath: e.subpath, gz: gzipSync(Buffer.from(code), { level: 9 }).length });
    }
    expect(rows.filter(r => r.gz > BARE_IMPORT_BYTES)).toEqual([]);
  }, 120_000);
});
