/** @jest-environment node */
// REQ-SURF-66 — "Row models are imported per feature so unused ones
// tree-shake". esbuild bundles a consumer of `import { Table } from
// 'aura-glass/data'` (the src entry the jest moduleNameMapper resolves the
// subpath to) without minification, so TanStack's row-model factories keep
// their names, and asserts which ones survive tree-shaking: the core and
// sorted models (sorting is on by default) are in; pagination is a page
// slice inside Table, so getPaginationRowModel is out, as are the filtered /
// expanded / grouped / faceted models Table never uses.
import { describe, expect, it } from '@jest/globals';
import { build } from 'esbuild';
import { join } from 'node:path';

const ROOT = process.cwd();

const bundleText = async (entry: string, named: string): Promise<string> => {
  const r = await build({
    stdin: {
      contents: `import { ${named} } from ${JSON.stringify(join(ROOT, entry))}; console.log(${named});`,
      resolveDir: ROOT,
      loader: 'js',
    },
    bundle: true,
    write: false,
    format: 'esm',
    platform: 'browser',
    logLevel: 'silent',
    outfile: 'out.js',
    external: ['react', 'react-dom', 'react/*', 'react-dom/*'],
    loader: { '.css': 'empty' },
    define: { 'process.env.NODE_ENV': '"production"' },
  });
  return r.outputFiles[0]!.text;
};

const defines = (text: string, fn: string): boolean => new RegExp(`function ${fn}\\(`).test(text);

describe('Table row models tree-shake per feature (REQ-SURF-66)', () => {
  it("a minimal { Table } from 'aura-glass/data' bundle excludes getPaginationRowModel", async () => {
    const text = await bundleText('src/data/index.ts', 'Table');
    // Positive control: the factories are recognisable in this bundle.
    expect({ core: defines(text, 'getCoreRowModel'), sorted: defines(text, 'getSortedRowModel') }).toEqual({
      core: true,
      sorted: true,
    });
    const unused = ['getPaginationRowModel', 'getFilteredRowModel', 'getExpandedRowModel', 'getGroupedRowModel', 'getFacetedRowModel'];
    expect(unused.filter((fn) => defines(text, fn))).toEqual([]);
  }, 60_000);
});
