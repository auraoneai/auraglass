#!/usr/bin/env node

const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const { builtinModules } = require('node:module');
const path = require('node:path');
const esbuild = require('esbuild');

const ensureHeapFlag = () => {
  const existing = process.env.NODE_OPTIONS ? process.env.NODE_OPTIONS.trim() : '';
  if (existing.includes('--max-old-space-size')) {
    return;
  }
  const flag = '--max-old-space-size=8192';
  process.env.NODE_OPTIONS = existing ? `${existing} ${flag}` : flag;
};

const run = (command, args, options = {}) => {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    env: options.env ?? process.env,
    cwd: options.cwd,
    shell: options.shell ?? false,
  });

  if (result.status !== 0) {
    const code = result.status ?? 1;
    process.exit(code);
  }
};

ensureHeapFlag();

const projectRoot = path.resolve(__dirname, '..');
const nodeBin = process.execPath;
const tscBin = path.resolve(projectRoot, 'node_modules', 'typescript', 'bin', 'tsc');
const distDir = path.resolve(projectRoot, 'dist');
const packageJson = require(path.resolve(projectRoot, 'package.json'));

const peerNames = Object.keys(packageJson.peerDependencies ?? {});
const peerExternals = peerNames.flatMap((name) => [name, `${name}/*`]);
const builtinExternals = builtinModules.flatMap((name) => [name, `node:${name}`]);
const external = [
  ...peerExternals,
  ...builtinExternals,
  'react',
  'react/*',
  'react-dom',
  'react-dom/*',
  'next/*',
  'three',
  'three/*',
  '@react-three/*',
  'framer-motion',
  'framer-motion/*',
  'clsx',
  'tailwind-merge',
  'chart.js',
  'chart.js/*',
  'react-chartjs-2',
  'socket.io-client',
  'openai',
  '@tensorflow/tfjs',
  'date-fns',
  'date-fns/*',
  'bcryptjs',
  'redis',
  'zod',
  'react-hook-form',
  '@google-cloud/vision',
  '@pinecone-database/pinecone',
  '@sentry/react',
  '@sentry/*',
];

const entrypoints = [
  ['src/index.ts', 'dist/index'],
  ['src/icons/index.ts', 'dist/icons/index'],
  ['src/icons/action.ts', 'dist/icons/action'],
  ['src/icons/navigation.ts', 'dist/icons/navigation'],
  ['src/icons/status.ts', 'dist/icons/status'],
  ['src/icons/media.ts', 'dist/icons/media'],
  ['src/icons/data.ts', 'dist/icons/data'],
  ['src/icons/commerce.ts', 'dist/icons/commerce'],
  ['src/icons/collaboration.ts', 'dist/icons/collaboration'],
  ['src/icons/ai.ts', 'dist/icons/ai'],
  ['src/primitives/index.ts', 'dist/primitives/index'],
  ['src/forms/index.ts', 'dist/forms/index'],
  ['src/data/index.ts', 'dist/data/index'],
  ['src/app-shell/index.ts', 'dist/app-shell/index'],
  ['src/workspace/index.tsx', 'dist/workspace/index'],
  ['src/theme/index.ts', 'dist/theme/index'],
  ['src/registry/index.ts', 'dist/registry/index'],
  ['src/ssr/index.ts', 'dist/ssr/index'],
  ['src/server/index.ts', 'dist/server/index'],
  ['src/three/index.ts', 'dist/three/index'],
];

const esmSubpathEntrypoints = [
  ['src/core/mixins/glassMixins.ts', 'dist/esm/core/mixins/glassMixins.js'],
  ['src/primitives/Slot.tsx', 'dist/esm/primitives/Slot.js'],
  ['src/primitives/Portal.tsx', 'dist/esm/primitives/Portal.js'],
  ['src/primitives/FocusScope.tsx', 'dist/esm/primitives/FocusScope.js'],
  ['src/primitives/DismissableLayer.tsx', 'dist/esm/primitives/DismissableLayer.js'],
  ['src/primitives/RovingFocusGroup.tsx', 'dist/esm/primitives/RovingFocusGroup.js'],
  ['src/primitives/Positioner.tsx', 'dist/esm/primitives/Positioner.js'],
  ['src/utils/env.ts', 'dist/esm/utils/env.js'],
  ['src/hooks/useGlassProbes.ts', 'dist/esm/hooks/useGlassProbes.js'],
  ['src/services/ai/openai-service.ts', 'dist/esm/services/ai/openai-service.js'],
  ['src/services/ai/vision-service.ts', 'dist/esm/services/ai/vision-service.js'],
  ['src/services/websocket/collaboration-service.ts', 'dist/esm/services/websocket/collaboration-service.js'],
];

const cjsSubpathEntrypoints = [
  ['src/hooks/useGlassProbes.ts', 'dist/cjs/hooks/useGlassProbes.js'],
  ['src/primitives/Slot.tsx', 'dist/cjs/primitives/Slot.js'],
  ['src/primitives/Portal.tsx', 'dist/cjs/primitives/Portal.js'],
  ['src/primitives/FocusScope.tsx', 'dist/cjs/primitives/FocusScope.js'],
  ['src/primitives/DismissableLayer.tsx', 'dist/cjs/primitives/DismissableLayer.js'],
  ['src/primitives/RovingFocusGroup.tsx', 'dist/cjs/primitives/RovingFocusGroup.js'],
  ['src/primitives/Positioner.tsx', 'dist/cjs/primitives/Positioner.js'],
];

require('node:fs').rmSync(distDir, { recursive: true, force: true });

run(nodeBin, [path.resolve(projectRoot, 'scripts', 'build-workers.js')], {
  cwd: projectRoot,
});

run(nodeBin, [path.resolve(projectRoot, 'scripts', 'build-tokens.js')], {
  cwd: projectRoot,
});

const sharedBuildOptions = {
  bundle: true,
  sourcemap: true,
  platform: 'browser',
  target: ['es2020'],
  jsx: 'automatic',
  external,
  logLevel: 'info',
};

// REQ-PLAT-57 — side-effect report mode: AG_SIDE_EFFECT_REPORT=1 (or
// --side-effects) writes .artifacts/plat/side-effects.json with, per output,
// every bundled input + byte cost — the review surface for tree-shaking
// losses and unexpected inclusions.
const sideEffectReport = process.env.AG_SIDE_EFFECT_REPORT === '1' || process.argv.includes('--side-effects');
const builtOutputs = {};

for (const [entryPoint, outputBase] of entrypoints) {
  // REQ-PLAT-60 — dist/material/index emits its CJS build as .cjs.
  const cjsExt = outputBase === 'dist/material/index' ? 'cjs' : 'js';
  for (const [fmt, ext] of [['esm', 'mjs'], ['cjs', cjsExt]]) {
    const result = esbuild.buildSync({
      ...sharedBuildOptions,
      entryPoints: [path.resolve(projectRoot, entryPoint)],
      outfile: path.resolve(projectRoot, `${outputBase}.${ext}`),
      format: fmt,
      metafile: sideEffectReport,
    });
    if (sideEffectReport) {
      const inputs = Object.entries(result.metafile.inputs).map(([file, info]) => ({
        file: path.relative(projectRoot, file).split('\\').join('/'),
        bytes: info.bytes,
      }));
      builtOutputs[`${outputBase}.${ext}`] = inputs;
    }
  }
}

esbuild.buildSync({
  entryPoints: [path.resolve(projectRoot, 'src/styles/index.css')],
  outfile: path.resolve(projectRoot, 'dist/styles/index.css'),
  assetNames: 'fonts/[name]',
  bundle: true,
  loader: {
    '.woff2': 'file',
  },
  minify: true,
  sourcemap: true,
  logLevel: 'info',
});

const rootCssPath = path.resolve(projectRoot, 'dist/index.css');
const stylesCssPath = path.resolve(projectRoot, 'dist/styles/index.css');
if (fs.existsSync(rootCssPath)) {
  fs.appendFileSync(
    stylesCssPath,
    `\n/* Component CSS bundled from library entrypoints. */\n${fs.readFileSync(rootCssPath, 'utf8')}`,
  );
  fs.rmSync(rootCssPath, { force: true });
  fs.rmSync(`${rootCssPath}.map`, { force: true });
}

run(nodeBin, [tscBin, '--project', 'tsconfig.build.json', '--outDir', 'dist/esm', '--noEmit', 'false', '--declaration', 'false', '--declarationMap', 'false'], {
  cwd: projectRoot,
});

for (const [entryPoint, outputFile] of esmSubpathEntrypoints) {
  esbuild.buildSync({
    ...sharedBuildOptions,
    entryPoints: [path.resolve(projectRoot, entryPoint)],
    outfile: path.resolve(projectRoot, outputFile),
    format: 'esm',
  });
}

for (const [entryPoint, outputFile] of cjsSubpathEntrypoints) {
  esbuild.buildSync({
    ...sharedBuildOptions,
    entryPoints: [path.resolve(projectRoot, entryPoint)],
    outfile: path.resolve(projectRoot, outputFile),
    format: 'cjs',
  });
}

// REQ-PLAT-60 — dist css targets for the 4.3 bridge export map.
for (const [src, dest] of [
  ['src/styles/v5.css', 'dist/styles/v5.css'],
  ['src/compat/tokens.css', 'dist/compat/tokens.css'],
  ['src/compat/css/globals.css', 'dist/compat/globals.css'],
]) {
  const from = path.resolve(projectRoot, src);
  const to = path.resolve(projectRoot, dest);
  if (fs.existsSync(from)) {
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.copyFileSync(from, to);
  }
}

fs.writeFileSync(
  path.resolve(projectRoot, 'dist/esm/package.json'),
  `${JSON.stringify({ type: 'module' }, null, 2)}\n`,
);

run(nodeBin, [tscBin, '--project', 'tsconfig.build.json', '--emitDeclarationOnly', '--declaration', '--declarationMap', '--outDir', 'dist', '--noEmit', 'false'], {
  cwd: projectRoot,
});

run(nodeBin, [path.resolve(projectRoot, 'scripts', 'postbuild-client.js')], {
  cwd: projectRoot,
});

if (sideEffectReport) {
  const reportDir = path.resolve(projectRoot, '.artifacts/plat');
  fs.mkdirSync(reportDir, { recursive: true });
  fs.writeFileSync(
    path.join(reportDir, 'side-effects.json'),
    `${JSON.stringify({ generatedBy: 'build-all --side-effects', outputs: builtOutputs }, null, 2)}\n`,
  );
  console.log(`side-effect report: .artifacts/plat/side-effects.json (${Object.keys(builtOutputs).length} outputs)`);
}
