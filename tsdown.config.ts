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
import { buildableEntries, distChunkStem, internalCompositionEntries, patternEntries, seamReexportTarget } from './scripts/build/lib/graph.mjs';

/* REQ-CMP-01: an import of a Base UI seam module (src/foundation/base-ui/<part>.ts,
   a single same-name `export { X } from '@base-ui/react/<part>'`) is resolved to its
   external target, so dist never carries a seam module whose declaration would be a
   bare Base UI re-export (graph.mjs seamReexportTarget). */
const baseUiSeam = {
  name: 'ag:base-ui-seam',
  async resolveId(this: any, source: string, importer: string | undefined, options: any) {
    if (!importer || !source.startsWith('.') || !source.includes('base-ui')) return null;
    const resolved = await this.resolve(source, importer, { ...options, skipSelf: true });
    const target = resolved && !resolved.external ? seamReexportTarget(resolved.id.split('?')[0]) : null;
    return target ? { id: target, external: true } : null;
  },
};

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
// Pattern rows (./icons/* -> dist/icons/<cat>.js) resolve to modules the manifest does
// not list; rolldown folds pure re-export barrels into their importer, so each pattern
// target is an entry of its own (REQ-PLAT-67). In-repo composition modules
// (internalCompositionEntries) are likewise entries so their in-repo-only
// exports (SourceScope, ComboboxLoading) survive tree-shaking in the dist twin
// the dist-backed Storybook build resolves to (REQ-QUAL-56).
for (const e of [...keep, ...patternEntries(keep), ...internalCompositionEntries(keep)]) entries[e.source.replace(/^src\//, '').replace(/\.tsx?$/, '')] = e.source;
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
  plugins: [baseUiSeam],
  // dist/contracts stays declaration-only and dist/foundation is never emitted:
  // runtime contract constants land in dist/internal/contracts, the private CMP
  // foundation runtime in dist/internal/cmp (graph.mjs distChunkStem, REQ-PLAT-66).
  outputOptions: {
    entryFileNames: (chunk: { name: string }) => `${distChunkStem(chunk.name)}.js`,
    chunkFileNames: (chunk: { name: string }) => `${distChunkStem(chunk.name)}.js`,
  },
});
