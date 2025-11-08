#!/usr/bin/env node

/**
 * Build script for Web Workers
 * Compiles TypeScript workers to JavaScript for npm distribution
 */

const { buildSync } = require('esbuild');
const { mkdirSync, existsSync, rmSync } = require('fs');
const { resolve } = require('path');

const workersDir = resolve(__dirname, '../workers');
const srcWorkersDir = resolve(__dirname, '../src/workers');

// Clean and recreate output directory
if (existsSync(workersDir)) {
  rmSync(workersDir, { recursive: true, force: true });
}
mkdirSync(workersDir, { recursive: true });

const workers = [
  'eyeTrackingWorker.ts',
  'biometricWorker.ts',
  'predictiveWorker.ts'
];

console.log('🔨 Building Web Workers...');

workers.forEach(worker => {
  const inputFile = resolve(srcWorkersDir, worker);
  const outputFile = resolve(workersDir, worker.replace('.ts', '.js'));

  try {
    buildSync({
      entryPoints: [inputFile],
      bundle: false,
      outfile: outputFile,
      format: 'iife',
      target: 'es2020',
      platform: 'browser',
      minify: false,
      sourcemap: true,
      logLevel: 'info'
    });

    console.log(`  ✓ Built ${worker} → ${worker.replace('.ts', '.js')}`);
  } catch (error) {
    console.error(`  ✗ Failed to build ${worker}:`, error.message);
    process.exit(1);
  }
});

console.log('✅ All workers built successfully!');
