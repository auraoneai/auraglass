#!/usr/bin/env node
/* post.mjs (PLAT-243, REQ-PLAT-64) — post-bundle pipeline, in this exact order:
   1. tsc -p tsconfig.build.json --emitDeclarationOnly, then rewrite-dts-aliases.mjs
   2. CSS assembly (scripts/build/lib/css.mjs) + tailwind bridge
   3. generate-exports.mjs --write
   4. gen-deprecations.mjs (1c's; skipped-pending when absent) + build/css-ownership.json
      + build/server-safe-exports.json
   5. verify-artifact.mjs  (hard gate — fails the build) */
import { execFileSync } from 'node:child_process';
import { existsSync, writeFileSync, mkdirSync, readdirSync, renameSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { ROOT, DIST, buildableEntries } from './lib/graph.mjs';
import { assembleAllCss, LAYER_CONTENT_OWNER } from './lib/css.mjs';
import { rewriteAll } from './rewrite-dts-aliases.mjs';
import { generateServerSafeExports } from './server-safe.mjs';

const step = (n, s) => console.log(`\n== post.mjs ${n}: ${s}`);

step(1, 'declarations');
// Emit d.ts only for entries whose src closure is seed-free (the same filter as tsdown):
// pending entries keep their seed status and do not ship declarations.
const { keep, pending: pendingEntries } = buildableEntries();
for (const e of pendingEntries) console.log(`   pending entry ${e.subpath}: ${e.reason}`);
const emitConfig = join(ROOT, 'build', '.tsconfig.emit.json');
writeFileSync(emitConfig, JSON.stringify({ extends: '../tsconfig.build.json', include: [], files: keep.map(e => '../' + e.source) }, null, 2) + '\n');
// REQ-PLAT-66: typecheck the full emit set before emitting — a type error must
// fail the build, never emit partial declarations.
execFileSync('npx', ['tsc', '-p', emitConfig, '--noEmit'], { cwd: ROOT, stdio: 'inherit' });
execFileSync('npx', ['tsc', '-p', emitConfig, '--outDir', 'dist'], { cwd: ROOT, stdio: 'inherit' });
const rw = rewriteAll();
console.log(`   d.ts rewritten: ${rw.rewritten}/${rw.files}`);

step(2, 'css assembly');
const css = await assembleAllCss(ROOT, { lower: true });
console.log(`   wrote ${css.written.join(', ')}`);
for (const p of css.pending) console.log(`   pending: ${p}`);
execFileSync('node', ['scripts/build/gen-tailwind-bridge.mjs'], { cwd: ROOT, stdio: 'inherit' });

step(3, 'package exports');
execFileSync('node', ['scripts/build/generate-exports.mjs', '--write'], { cwd: ROOT, stdio: 'inherit' });

step('3b', 'sourcemap staging');
/* PLAT-296: **\/\*.map is tarball-denied; CI packages dist-maps.tgz separately.
   Stage maps beside dist/ so the packed dist/ is map-free. */
const MAP_STAGE = join(ROOT, 'dist-maps');
const collectMaps = (dir, rel = '') => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) collectMaps(p, join(rel, e.name));
    else if (e.name.endsWith('.map')) {
      const dest = join(MAP_STAGE, rel, e.name);
      mkdirSync(dirname(dest), { recursive: true });
      renameSync(p, dest);
    }
  }
};
collectMaps(DIST);
console.log(`   staged sourcemaps -> dist-maps/`);

step(4, 'records');
if (existsSync(join(ROOT, 'scripts/release/gen-deprecations.mjs'))) {
  execFileSync('node', ['scripts/release/gen-deprecations.mjs'], { cwd: ROOT, stdio: 'inherit' });
} else console.log('   pending: scripts/release/gen-deprecations.mjs (lane 1c) — deprecations.json passes through as committed');
mkdirSync(join(ROOT, 'build'), { recursive: true });
writeFileSync(join(ROOT, 'build/css-ownership.json'), JSON.stringify({ version: 1, layers: LAYER_CONTENT_OWNER }, null, 2) + '\n');
const sse = generateServerSafeExports(ROOT);
writeFileSync(join(ROOT, 'build/server-safe-exports.json'), JSON.stringify(sse, null, 2) + '\n');
console.log(`   build/css-ownership.json, build/server-safe-exports.json (${sse.entries.length} entries)`);

step(5, 'verify-artifact');
execFileSync('node', ['scripts/build/verify-artifact.mjs'], { cwd: ROOT, stdio: 'inherit' });
console.log('\npost.mjs: done');
