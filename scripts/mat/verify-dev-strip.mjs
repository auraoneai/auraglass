#!/usr/bin/env node
/* scripts/mat/verify-dev-strip.mjs — REQ-MAT-38: a production consumer bundle
 * of the provider + Surface contains neither src/material/dev/surfaceCounter
 * nor src/material/dev/warnings (bundle grep for `surfaceCounter` = 0).
 *
 * Bundles `import { AuraGlassProvider } from 'aura-glass/theme'` and
 * `import { Surface } from 'aura-glass/material'` with esbuild the way a
 * consumer's production build does (define process.env.NODE_ENV, tree shaking,
 * syntax minification; identifiers are kept so the grep is meaningful) and
 * greps the output for the dev-module markers. The development bundle is the
 * control: it must contain every marker, otherwise the grep proves nothing.
 *
 * Usage: node scripts/mat/verify-dev-strip.mjs [--src] [--root <dir>] [--out <dir>]
 *   default  bundles the built package (dist/theme/public.js, dist/material/index.js);
 *            fails closed when dist is absent (it never builds dist itself)
 *   --src    bundles src/theme/public.ts + src/material/index.ts (unit test, no build)
 * Exit 0 = OK, 1 = a marker in the production bundle / control failed.
 */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { isMain } from './_is-main.mjs';

/** Strings only the dev modules carry (module path, export names, messages). */
export const DEV_MARKERS = [
  'surfaceCounter',
  'startSurfaceCounter',
  'warnSurface',
  'live backdrop filters in the viewport',
  'requires a declared backdrop',
];

const ENTRIES = {
  dist: { theme: 'dist/theme/public.js', material: 'dist/material/index.js' },
  src: { theme: 'src/theme/public.ts', material: 'src/material/index.ts' },
};

/**
 * @param {{ root: string, mode: 'dist' | 'src', nodeEnv: 'production' | 'development' }} opts
 * @returns {Promise<string>} the bundled JS
 */
export async function bundleConsumer({ root, mode, nodeEnv }) {
  const { build } = await import('esbuild');
  const entry = ENTRIES[mode];
  for (const p of Object.values(entry)) {
    if (!existsSync(join(root, p))) throw new Error(`[dev-strip] missing ${p} (mode ${mode})`);
  }
  const result = await build({
    stdin: {
      contents: [
        `import { AuraGlassProvider } from './${entry.theme}';`,
        `import { Surface } from './${entry.material}';`,
        'export { AuraGlassProvider, Surface };',
      ].join('\n'),
      resolveDir: root,
      sourcefile: 'consumer-entry.js',
      loader: 'js',
    },
    absWorkingDir: root,
    bundle: true,
    write: false,
    format: 'esm',
    platform: 'browser',
    target: 'es2022',
    packages: 'external',
    jsx: 'automatic',
    loader: { '.css': 'empty', '.png': 'dataurl' },
    define: { 'process.env.NODE_ENV': JSON.stringify(nodeEnv) },
    treeShaking: true,
    minifySyntax: true,
    minifyWhitespace: false,
    minifyIdentifiers: false,
    legalComments: 'none',
    logLevel: 'silent',
  });
  return result.outputFiles[0].text;
}

/** @param {string} code */
export const markersIn = (code) => DEV_MARKERS.filter((m) => code.includes(m));

/**
 * @param {{ root: string, mode: 'dist' | 'src' }} opts
 */
export async function verifyDevStrip({ root, mode }) {
  const prod = await bundleConsumer({ root, mode, nodeEnv: 'production' });
  const dev = await bundleConsumer({ root, mode, nodeEnv: 'development' });
  const leaked = markersIn(prod);
  const devFound = markersIn(dev);
  const missingInDev = DEV_MARKERS.filter((m) => !devFound.includes(m));
  return {
    mode,
    ok: leaked.length === 0 && missingInDev.length === 0,
    production: { bytes: prod.length, leaked, surfaceCounterHits: prod.split('surfaceCounter').length - 1 },
    development: { bytes: dev.length, missing: missingInDev },
  };
}

if (isMain(import.meta.url)) {
  const argv = process.argv.slice(2);
  const arg = (name) => { const i = argv.indexOf(name); return i >= 0 ? argv[i + 1] : undefined; };
  const root = resolve(arg('--root') ?? process.cwd());
  const mode = argv.includes('--src') ? 'src' : 'dist';
  const out = arg('--out');
  try {
    const report = await verifyDevStrip({ root, mode });
    if (out) {
      mkdirSync(out, { recursive: true });
      writeFileSync(join(out, 'dev-strip.json'), `${JSON.stringify(report, null, 2)}\n`);
    }
    if (!report.ok) {
      if (report.production.leaked.length)
        console.error(`[dev-strip] production bundle carries dev markers: ${report.production.leaked.join(', ')}`);
      if (report.development.missing.length)
        console.error(`[dev-strip] control failed: development bundle lacks ${report.development.missing.join(', ')}`);
      process.exit(1);
    }
    console.log(`[dev-strip] OK (${mode}): surfaceCounter hits in production bundle = ${report.production.surfaceCounterHits}`);
  } catch (e) {
    console.error(String(e instanceof Error ? e.message : e));
    process.exit(1);
  }
}
