#!/usr/bin/env node
/**
 * Ensures the publishable tarball does not include nested node_modules or bundled
 * React runtimes. Packs to a temp directory, extracts, and scans dist artifacts for
 * duplicate React signatures.
 */

const { execSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const run = (command, options = {}) =>
  execSync(command, { stdio: ['ignore', 'pipe', 'inherit'], encoding: 'utf8', ...options });

const walkFiles = (root) => {
  const files = [];
  const stack = [root];

  while (stack.length > 0) {
    const current = stack.pop();
    const stat = fs.statSync(current);

    if (stat.isDirectory()) {
      const children = fs.readdirSync(current);
      children.forEach((child) => stack.push(path.join(current, child)));
    } else if (stat.isFile()) {
      files.push(current);
    }
  }

  return files;
};

const collectExportTypePaths = (exportsField) => {
  const typePaths = new Set();

  const visit = (value) => {
    if (!value) {
      return;
    }

    if (typeof value === 'string') {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }

    if (typeof value === 'object') {
      if (typeof value.types === 'string') {
        typePaths.add(value.types.replace(/^\.\//, ''));
      }

      Object.entries(value).forEach(([key, child]) => {
        if (key !== 'types') {
          visit(child);
        }
      });
    }
  };

  visit(exportsField);
  return typePaths;
};

const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'auraglass-pack-'));

try {
  const packOutput = run(
    `npm pack --dry-run=false --ignore-scripts --json --pack-destination "${tmpRoot}"`
  );
  const jsonStart = packOutput.indexOf('[');
  const [packResult] = JSON.parse(
    jsonStart >= 0 ? packOutput.slice(jsonStart) : packOutput
  );

  if (!packResult || !Array.isArray(packResult.files) || !packResult.filename) {
    throw new Error('Unexpected npm pack output.');
  }

  const tarballPath = path.join(tmpRoot, packResult.filename);
  const extractionRoot = path.join(tmpRoot, 'unpacked');
  fs.mkdirSync(extractionRoot, { recursive: true });

  execSync(`tar -xf "${tarballPath}" -C "${extractionRoot}"`, { stdio: ['ignore', 'inherit', 'inherit'] });

  const packageRoot = path.join(extractionRoot, 'package');
  const distRoot = path.join(packageRoot, 'dist');
  const packedPackageJsonPath = path.join(packageRoot, 'package.json');

  if (!fs.existsSync(distRoot)) {
    throw new Error('Dist directory missing from packed artifact.');
  }

  if (!fs.existsSync(packedPackageJsonPath)) {
    throw new Error('package.json missing from packed artifact.');
  }

  const packedPackageJson = JSON.parse(fs.readFileSync(packedPackageJsonPath, 'utf8'));
  const packedPaths = new Set(packResult.files.map(({ path: filePath }) => filePath));
  const requiredDeclarationPaths = new Set([
    packedPackageJson.types,
    ...collectExportTypePaths(packedPackageJson.exports),
  ]);
  const missingDeclarationPaths = [...requiredDeclarationPaths]
    .filter(Boolean)
    .map((filePath) => filePath.replace(/^\.\//, ''))
    .filter((filePath) => !packedPaths.has(filePath));

  if (missingDeclarationPaths.length > 0) {
    console.error('❌ npm pack is missing declaration files referenced by package metadata:');
    missingDeclarationPaths.forEach((filePath) => console.error(` - ${filePath}`));
    process.exit(1);
  }

  const offendingFiles = packResult.files.filter(({ path: filePath }) =>
    filePath.includes('node_modules/') || /node_modules\\/.test(filePath)
  );

  if (offendingFiles.length > 0) {
    console.error('❌ npm pack contains nested node_modules entries:');
    offendingFiles.forEach(({ path: filePath }) => console.error(` - ${filePath}`));
    process.exit(1);
  }

  const reactRuntimeFiles = packResult.files.filter(({ path: filePath }) =>
    /node_modules\/(react|react-dom)\//.test(filePath) || /node_modules\\(react|react-dom)\\/.test(filePath)
  );

  if (reactRuntimeFiles.length > 0) {
    console.error('❌ npm pack still includes React runtime files:');
    reactRuntimeFiles.forEach(({ path: filePath }) => console.error(` - ${filePath}`));
    process.exit(1);
  }

  const styledRuntimeFiles = packResult.files.filter(({ path: filePath }) =>
    /node_modules\/styled-components\//.test(filePath) || /node_modules\\styled-components\\/.test(filePath)
  );

  if (styledRuntimeFiles.length > 0) {
    console.error('❌ npm pack still includes styled-components runtime files:');
    styledRuntimeFiles.forEach(({ path: filePath }) => console.error(` - ${filePath}`));
    process.exit(1);
  }

  const testArtifacts = packResult.files.filter(
    ({ path: filePath }) =>
      /^dist\/tests\//.test(filePath) ||
      /\/__tests__\//.test(filePath) ||
      /\.(?:test|spec)\.[cm]?[jt]sx?$/.test(filePath)
  );

  if (testArtifacts.length > 0) {
    console.error('❌ npm pack includes test artifacts:');
    testArtifacts.forEach(({ path: filePath }) => console.error(` - ${filePath}`));
    process.exit(1);
  }

  const files = walkFiles(distRoot);
  const dispatcherHits = [];
  let reactRequireCount = 0;

  files.forEach((file) => {
    const content = fs.readFileSync(file, 'utf8');

    if (content.includes('ReactCurrentDispatcher')) {
      dispatcherHits.push(path.relative(distRoot, file));
    }

    const requireMatches = content.match(/require\(['"]react/g);
    if (requireMatches) {
      reactRequireCount += requireMatches.length;
    }
  });

  if (dispatcherHits.length > 0) {
    console.error('❌ React dispatcher detected in dist artifacts:');
    dispatcherHits.forEach((file) => console.error(` - ${file}`));
    process.exit(1);
  }

  console.log('✅ npm pack clean: no nested node_modules, React runtimes, or dispatcher artifacts.');
  console.log(`ℹ️ external require('react') occurrences: ${reactRequireCount}`);
} catch (error) {
  if (error && typeof error.status === 'number' && error.status === 1) {
    process.exit(1);
  }

  console.error('Failed to verify npm pack output.');
  if (error && error.message) {
    console.error(error.message);
  }
  process.exit(1);
} finally {
  try {
    fs.rmSync(tmpRoot, { recursive: true, force: true });
  } catch (cleanupError) {
    console.warn('Warning: failed to clean up temp directory', cleanupError);
  }
}
