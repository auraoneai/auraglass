'use strict';

// Shared helpers for `npm pack --json` output across npm 10, 11 and 12.
//
// npm <= 11 prints a JSON array of pack results:
//   [ { id, name, filename, files: [...] } ]
// npm >= 12 prints an object keyed by package name:
//   { "aura-glass": { id, name, filename, files: [...] } }
// Both may also be preceded by lifecycle/log lines on stdout, so callers
// must never hand the whole buffer to JSON.parse or index [0] blindly.

const { execFileSync } = require('node:child_process');
const path = require('node:path');

/**
 * Parse `npm pack --json` stdout into a single pack result.
 * Returns { filename, files, ... } for exactly one packed package.
 * Throws on unparseable output and on 0 or >= 2 packages.
 *
 * @param {string} stdout
 * @returns {{ filename: string, files: Array<{ path: string }> } & Record<string, unknown>}
 */
function parsePackJson(stdout) {
  const text = String(stdout);
  // Start at the first line beginning with [ or { (skip lifecycle noise).
  const lines = text.split('\n');
  let start = -1;
  for (let i = 0; i < lines.length; i += 1) {
    const c = lines[i].trimStart().charAt(0);
    if (c === '[' || c === '{') {
      start = i;
      break;
    }
  }
  if (start === -1) {
    throw new Error('npm pack --json output contained no JSON payload.');
  }
  const parsed = JSON.parse(lines.slice(start).join('\n'));

  let info;
  if (Array.isArray(parsed)) {
    if (parsed.length !== 1) {
      throw new Error(
        `npm pack --json returned ${parsed.length} packages; expected exactly 1.`
      );
    }
    info = parsed[0];
  } else if (parsed && typeof parsed === 'object') {
    if (Array.isArray(parsed.files)) {
      info = parsed;
    } else {
      const values = Object.values(parsed);
      if (values.length !== 1) {
        throw new Error(
          `npm pack --json returned ${values.length} packages; expected exactly 1.`
        );
      }
      info = values[0];
    }
  } else {
    throw new Error('npm pack --json returned an unexpected payload.');
  }

  if (!info || typeof info.filename !== 'string' || !Array.isArray(info.files)) {
    throw new Error('npm pack --json result is missing filename or files.');
  }
  return info;
}

/**
 * Run `npm pack --json --ignore-scripts` in rootDir with an argument array
 * (no string interpolation) and return the parsed pack info plus the
 * tarball's absolute path inside destDir.
 *
 * @param {string} rootDir package directory to pack
 * @param {string} destDir existing directory that receives the tarball
 * @returns {{ filename: string, files: Array<{ path: string }>, tarballPath: string } & Record<string, unknown>}
 */
function packToDir(rootDir, destDir) {
  const stdout = execFileSync(
    'npm',
    ['pack', '--json', '--ignore-scripts', '--pack-destination', destDir],
    { cwd: rootDir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] }
  );
  const info = parsePackJson(stdout);
  return { ...info, tarballPath: path.join(destDir, info.filename) };
}

module.exports = { parsePackJson, packToDir };
