#!/usr/bin/env node
/* packages/mcp/scripts/build.mjs — REQ-PLAT-106 (REQ-FIN-44). Build
   @auraglass/mcp from the monorepo:
     1. data/mcp-data.json   ← scripts/docs/gen-mcp-data.mjs (repo sources)
     2. type-check src/       (tsc --noEmit, tsconfig.json)
     3. dist/server.js        ← esbuild bundle of src/server.ts with the SDK
                                and zod inlined, so the server reads nothing
                                outside its own package directory and runs
                                under `node --permission --allow-fs-read=<pkg>`.
   Runs on `npm run build`, `prepack` and `pretest`. */
import { execFileSync } from 'node:child_process';
import { chmodSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const PKG = join(dirname(fileURLToPath(import.meta.url)), '..');
const REPO = join(PKG, '..', '..');
const DATA_MAX = 5 * 1024 * 1024;
const require = createRequire(join(REPO, 'package.json'));

execFileSync(process.execPath, [join(REPO, 'scripts/docs/gen-mcp-data.mjs'), '--out', join(PKG, 'data/mcp-data.json')], { stdio: 'inherit' });
const dataBytes = statSync(join(PKG, 'data/mcp-data.json')).size;
if (dataBytes > DATA_MAX) throw new Error(`data/mcp-data.json is ${dataBytes}B > 5 MB`);

execFileSync(process.execPath, [require.resolve('typescript/bin/tsc'), '-p', join(PKG, 'tsconfig.json'), '--noEmit'], { stdio: 'inherit' });

await build({
  entryPoints: [join(PKG, 'src/server.ts')],
  outfile: join(PKG, 'dist/server.js'),
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node20.19',
  legalComments: 'none',
  /* 'error': esbuild otherwise repeats root package.json export-condition
     ordering warnings (FIN-A's `exports` key) that do not affect this bundle. */
  logLevel: 'error',
  /* CJS dependencies of the SDK (ajv) call require() for node builtins. */
  banner: { js: "import { createRequire as __agCreateRequire } from 'node:module'; const require = __agCreateRequire(import.meta.url);" },
});
chmodSync(join(PKG, 'dist/server.js'), 0o755);
console.log(`@auraglass/mcp: dist/server.js ${statSync(join(PKG, 'dist/server.js')).size}B, data ${dataBytes}B`);
