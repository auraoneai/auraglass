/* AuraGlass 5.0 build (PLAT-242, REQ-PLAT-64/65).
   tsdown (rolldown) in unbundle mode: every reachable src file maps 1:1 to dist/<path>.js,
   no shared chunks. Entries come from build/exports.manifest.json verbatim; the
   pre-release filter drops entries whose import graph carries @ag-contract-seed
   (they stay out of the tarball until the owning stream lands the real module). */
import { defineConfig } from 'tsdown';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

// ESM file that mirrors scripts/build/lib/graph.mjs's filter without importing TS.
// tsdown loads this config with its own toolchain, so keep imports node-only.
const manifest = JSON.parse(readFileSync(new URL('./build/exports.manifest.json', import.meta.url), 'utf8'));

const externals = [
  /^react(\/.*)?$/, /^react-dom(\/.*)?$/,
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.peerDependencies ?? {}),
  /^node:/,
  // src-internal aliases stay internal; tsdown resolves them through tsconfig paths
];

// Seed filter: same rule as scripts/build/lib/graph.mjs (duplicated in plain JS so the
// config never needs the build lib compiled first).
import { existsSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
const SRC = new URL('./src/', import.meta.url).pathname;
const IMPORT_RE = /(?:import|export)[\s\S]*?from\s*['"]([^'"]+)['"]|import\s*\(\s*['"]([^'"]+)['"]\s*\)|import\s+['"]([^'"]+)['"]/g;
const EXTS = ['.ts', '.tsx', '.js', '.mjs', '.jsx', '.css'];
function resolveSpec(spec: string, fromFile: string): string | null {
  if (spec.startsWith('@/')) spec = './' + spec.slice(2);
  let base: string;
  if (spec.startsWith('.')) base = resolve(dirname(fromFile), spec);
  else if (spec === 'aura-glass') base = join(SRC, 'index.ts');
  else if (spec.startsWith('aura-glass/')) base = join(SRC, spec.slice('aura-glass/'.length), 'index.ts');
  else return null;
  for (const ext of EXTS) if (existsSync(base + ext)) return base + ext;
  for (const ext of EXTS) if (existsSync(join(base, 'index' + ext))) return join(base, 'index' + ext);
  if (existsSync(base) && statSync(base).isFile()) return base;
  return null;
}
function hasSeed(entry: string): boolean {
  const seen = new Set<string>();
  const stack = [resolve(new URL('.', import.meta.url).pathname, entry)];
  while (stack.length) {
    const f = stack.pop()!;
    if (seen.has(f)) continue;
    seen.add(f);
    let text = '';
    try { text = readFileSync(f, 'utf8'); } catch { continue; }
    if (text.includes('@ag-contract-seed')) return true;
    for (const m of text.matchAll(IMPORT_RE)) {
      const r = resolveSpec((m[1] ?? m[2] ?? m[3]) as string, f);
      if (r && r.startsWith(SRC)) stack.push(r);
    }
  }
  return false;
}

const entries: Record<string, string> = {};
const pending: string[] = [];
for (const e of manifest.entries) {
  if (e.source === 'build:css' || e.source === 'build:deprecations' || e.source === 'package.json') continue;
  if (!existsSync(resolve(new URL('.', import.meta.url).pathname, e.source))) { pending.push(`${e.subpath} (missing)`); continue; }
  if (hasSeed(e.source)) { pending.push(`${e.subpath} (@ag-contract-seed in graph)`); continue; }
  // entry name = dist path without .js (src/index.ts -> index, src/x/y.ts -> x/y)
  const name = e.source.replace(/^src\//, '').replace(/\.tsx?$/, '');
  entries[name] = e.source;
}
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
