/** @jest-environment node */
// REQ-SURF-04 — peer isolation: esbuild a consumer bundle for
// `import { Button } from 'aura-glass'` and `import { Table } from
// 'aura-glass/data'` with metafile:true, and assert the date/heavy peers
// (react-aria-components, @internationalized/date, d3-*) and the SURF trees
// never enter the bundle. Fail-closed, never skipped: on a built dist the
// consumer resolves the real package.json exports map; without dist it
// bundles the src entries (the same files the jest moduleNameMapper maps the
// subpaths to). AG_REQUIRE_DIST=1 (job surf:test:peer-isolation, after
// plat:build:dist) makes a missing dist a failure instead of the src leg.
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const ROOT = process.cwd();
const BUILT = existsSync(join(ROOT, 'dist', 'index.js')) && existsSync(join(ROOT, 'dist', 'data', 'index.js'));
const REQUIRE_DIST = process.env['AG_REQUIRE_DIST'] === '1';
const BANNED = /react-aria-components|@internationalized[\\/]date|[\\/]d3-/;
const SURF_TREES = BUILT
  ? /[\\/]dist[\\/](?:data|date|ai|media|charts)[\\/]/
  : /(?:^|[\\/])src[\\/](?:data|date|ai|media|charts)[\\/]/;
const SRC_ENTRY: Record<string, string> = { 'aura-glass': 'src/index.ts', 'aura-glass/data': 'src/data/index.ts' };

/* The honest measure of what a consumer bundle ships: the metafile's
   output.inputs — the modules surviving tree-shaking — not the scanned
   graph (metafile.inputs lists every resolved file incl. pruned ones). */
const bundleMeta = (spec: string, named: string): string[] => {
  const dir = mkdtempSync(join(tmpdir(), 'ag-peer-'));
  try {
    const target = BUILT ? spec : join(ROOT, SRC_ENTRY[spec]!);
    writeFileSync(join(dir, 'in.js'), `import { ${named} } from ${JSON.stringify(target)}; console.log(${named});`);
    writeFileSync(join(dir, 'package.json'), '{"type":"module"}');
    /* node_modules/aura-glass symlink -> repo root: real exports-map
       resolution, no aliasing. */
    mkdirSync(join(dir, 'node_modules'));
    symlinkSync(ROOT, join(dir, 'node_modules', 'aura-glass'));
    writeFileSync(
      join(dir, 'build.cjs'),
      `const e=require(${JSON.stringify(join(ROOT, 'node_modules', 'esbuild'))});e.build({entryPoints:['in.js'],bundle:true,metafile:true,write:false,format:'esm',platform:'node',logLevel:'silent',outfile:'out.js',external:['react','react-dom','react/*','react-dom/*'],loader:{'.css':'empty'},absWorkingDir:${JSON.stringify(dir)},mainFields:['exports','main']}).then(r=>require('fs').writeFileSync('meta.json',JSON.stringify(Object.keys(r.metafile.outputs['out.js'].inputs))));`,
    );
    execFileSync('node', ['build.cjs'], { cwd: dir, stdio: 'pipe' });
    return JSON.parse(readFileSync(join(dir, 'meta.json'), 'utf8'));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
};

describe('peer isolation (REQ-SURF-04)', () => {
  it('runs on the built dist when the gate requires it (AG_REQUIRE_DIST=1)', () => {
    expect({ requiredDistMissing: REQUIRE_DIST && !BUILT }).toEqual({ requiredDistMissing: false });
  });
  it("import { Button } from 'aura-glass' pulls no date/heavy peers", () => {
    const inputs = bundleMeta('aura-glass', 'Button');
    expect(inputs.length).toBeGreaterThan(0);
    const hits = inputs.filter((i) => BANNED.test(i));
    expect({ hits }).toEqual({ hits: [] });
  });
  it("'aura-glass' Button bundle contains no SURF tree inputs", () => {
    const inputs = bundleMeta('aura-glass', 'Button');
    const hits = inputs.filter((i) => SURF_TREES.test(i));
    expect({ hits }).toEqual({ hits: [] });
  });
  it("import { Table } from 'aura-glass/data' pulls no date/heavy peers", () => {
    const inputs = bundleMeta('aura-glass/data', 'Table');
    // Positive control: the leg really bundled the Table source.
    expect(inputs.some((i) => /[\\/]data[\\/]table[\\/]Table\.(?:tsx|js)$/.test(i))).toBe(true);
    const hits = inputs.filter((i) => BANNED.test(i));
    expect({ hits }).toEqual({ hits: [] });
  });
});
