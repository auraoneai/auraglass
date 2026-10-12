/* AuraGlass 5.0 build (PLAT-242, REQ-PLAT-64/65).
   tsdown (rolldown) in unbundle mode: every reachable src file maps 1:1 to dist/<path>.js,
   no shared chunks. Entries come from build/exports.manifest.json verbatim; the
   pre-release filter drops entries whose import graph carries @ag-contract-seed
   (they stay out of the tarball until the owning stream lands the real module). */
import { defineConfig } from 'tsdown';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

// Entry filter: the one rule in scripts/build/lib/graph.mjs (plain node ESM, no build
// step) shared with post.mjs and generate-exports.mjs — line-1 @ag-contract-seed closures,
// missing sources and EntrySpec.ga gates (ga:'5.1' on 5.0.x) never reach dist/.
import { buildableEntries } from './scripts/build/lib/graph.mjs';

const externals = [
  /^react(\/.*)?$/, /^react-dom(\/.*)?$/,
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.peerDependencies ?? {}),
  /^node:/,
  // src-internal aliases stay internal; tsdown resolves them through tsconfig paths
];

const { keep, pending: pendingRows } = buildableEntries();
const entries: Record<string, string> = {};
// entry name = dist path without .js (src/index.ts -> index, src/x/y.ts -> x/y)
for (const e of keep) entries[e.source.replace(/^src\//, '').replace(/\.tsx?$/, '')] = e.source;
const pending = pendingRows.map((e: { subpath: string; reason: string }) => `${e.subpath} (${e.reason})`);
if (pending.length) console.log(`tsdown: pending entries (seed graph or missing): ${pending.join(', ')}`);

export default defineConfig({
  entry: entries,
  format: 'esm',
  unbundle: true,
  platform: 'neutral',
  target: 'es2022',
  outDir: 'dist',
  sourcemap: true,
  dts: false, // declarations come from `tsc -p tsconfig.build.json --emitDeclarationOnly` (post.mjs)
  external: externals,
  treeshake: { moduleSideEffects: false },
  minify: false,
  report: false,
});
