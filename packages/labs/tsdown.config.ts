/* @auraglass/labs build (REQ-SURF-166). tsdown, ESM + .d.ts, one entry per
   resident: package.json exports `./<kebab>` -> src/<kebab>/index.ts(x) ->
   dist/<kebab>/index.js. src/index.ts (the package barrel) always builds, so the
   packed dist/ is never empty. Peers (react, react-dom, aura-glass) stay
   external. Runs as `npm run build -w packages/labs` and from `prepack`, so
   `npm pack -w packages/labs` (plat:package:pack) always packs a fresh dist/. */
import { defineConfig } from 'tsdown';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(here, 'package.json'), 'utf8')) as { exports?: Record<string, unknown> };

const entry: Record<string, string> = { index: 'src/index.ts' };
for (const key of Object.keys(pkg.exports ?? {})) {
  if (key === './package.json') continue;
  const resident = key.replace(/^\.\//, '');
  const src = ['ts', 'tsx'].map((ext) => `src/${resident}/index.${ext}`).find((p) => existsSync(join(here, p)));
  if (!src) throw new Error(`@auraglass/labs build: exports ${key} has no src/${resident}/index.ts(x)`);
  entry[`${resident}/index`] = src;
}

export default defineConfig({
  entry,
  format: ['esm'],
  outExtensions: () => ({ js: '.js', dts: '.d.ts' }),
  dts: true,
  sourcemap: false,
  clean: true,
  outDir: 'dist',
  platform: 'neutral',
});
