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
  'lucide-react',
  'lucide-react/*',
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
  ['src/registry/index.ts', 'dist/registry/index'],
  ['src/ssr/index.ts', 'dist/ssr/index'],
  ['src/server/index.ts', 'dist/server/index'],
  ['src/three/index.ts', 'dist/three/index'],
];

const esmSubpathEntrypoints = [
  ['src/core/mixins/glassMixins.ts', 'dist/esm/core/mixins/glassMixins.js'],
  ['src/utils/env.ts', 'dist/esm/utils/env.js'],
  ['src/services/ai/openai-service.ts', 'dist/esm/services/ai/openai-service.js'],
  ['src/services/ai/vision-service.ts', 'dist/esm/services/ai/vision-service.js'],
  ['src/services/websocket/collaboration-service.ts', 'dist/esm/services/websocket/collaboration-service.js'],
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

for (const [entryPoint, outputBase] of entrypoints) {
  esbuild.buildSync({
    ...sharedBuildOptions,
    entryPoints: [path.resolve(projectRoot, entryPoint)],
    outfile: path.resolve(projectRoot, `${outputBase}.mjs`),
    format: 'esm',
  });

  esbuild.buildSync({
    ...sharedBuildOptions,
    entryPoints: [path.resolve(projectRoot, entryPoint)],
    outfile: path.resolve(projectRoot, `${outputBase}.js`),
    format: 'cjs',
  });
}

esbuild.buildSync({
  entryPoints: [path.resolve(projectRoot, 'src/styles/index.css')],
  outfile: path.resolve(projectRoot, 'dist/styles/index.css'),
  bundle: true,
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
