/** @jest-environment node */
// REQ-SURF-04 — peer isolation on the BUILT dist: esbuild a consumer bundle
// for `import { Button } from 'aura-glass'` and `import { Table } from
// 'aura-glass/data'` with metafile:true, and assert the date/heavy peers
// (react-aria-components, @internationalized/date, d3-*) and the SURF src
// trees never enter the main bundle. Gated on dist presence like the other
// pack-matrix legs (npm run build first in CI).
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const ROOT = process.cwd();
const BUILT = existsSync(join(ROOT, 'dist', 'index.js')) && existsSync(join(ROOT, 'dist', 'data', 'index.js'));
const BANNED = /react-aria-components|@internationalized\/date|d3-/;
const SURF_TREES = /[\\/]dist[\\/](?:data|date|ai|media|charts)[\\/]/;

/* The honest measure of what a consumer bundle ships: the metafile's
   output.inputs — the modules surviving tree-shaking — not the scanned
   graph (metafile.inputs lists every resolved file incl. pruned ones). */
const bundleMeta = (spec: string, named: string): string[] => {
  const dir = mkdtempSync(join(tmpdir(), 'ag-peer-'));
  writeFileSync(join(dir, 'in.js'), `import { ${named} } from '${spec}'; console.log(${named});`);
  writeFileSync(join(dir, 'package.json'), '{"type":"module"}');
  /* node_modules/aura-glass symlink -> repo root: real exports-map
     resolution, no aliasing. */
  mkdirSync(join(dir, 'node_modules'));
  symlinkSync(ROOT, join(dir, 'node_modules', 'aura-glass'));
  writeFileSync(
    join(dir, 'build.cjs'),
    `const e=require('${join(ROOT, 'node_modules', 'esbuild')}');e.build({entryPoints:['in.js'],bundle:true,metafile:true,format:'esm',platform:'node',logLevel:'silent',outfile:'out.js',external:['react','react-dom','react/*','react-dom/*'],absWorkingDir:'${dir.replace(/\\/g, '/')}',mainFields:['exports','main']}).then(r=>require('fs').writeFileSync('meta.json',JSON.stringify(Object.keys(r.metafile.outputs['out.js'].inputs))));`,
  );
  execFileSync('node', ['build.cjs'], { cwd: dir, stdio: 'pipe' });
  return JSON.parse(readFileSync(join(dir, 'meta.json'), 'utf8'));
};

const itBuilt = BUILT ? it : it.skip;

describe('peer isolation on built dist (REQ-SURF-04)', () => {
  itBuilt("import { Button } from 'aura-glass' pulls no date/heavy peers", () => {
    const inputs = bundleMeta('aura-glass', 'Button');
    const hits = inputs.filter((i) => BANNED.test(i));
    expect({ hits }).toEqual({ hits: [] });
  });
  itBuilt("'aura-glass' Button bundle contains no SURF tree inputs", () => {
    const inputs = bundleMeta('aura-glass', 'Button');
    const hits = inputs.filter((i) => SURF_TREES.test(i));
    expect({ hits }).toEqual({ hits: [] });
  });
  itBuilt("import { Table } from 'aura-glass/data' pulls no date/heavy peers", () => {
    const inputs = bundleMeta('aura-glass/data', 'Table');
    const hits = inputs.filter((i) => BANNED.test(i));
    expect({ hits }).toEqual({ hits: [] });
  });
});
