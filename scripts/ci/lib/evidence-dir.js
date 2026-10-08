'use strict';

// CI evidence root. All pipeline evidence lives under
//   $AURAGLASS_EVIDENCE_DIR  (default: <repo root>/.artifacts)
// and is collected as GitLab artifacts; nothing is committed to the repo
// (reports/ is untracked and gitignored).

const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..', '..', '..');

/**
 * Resolve (and create) the evidence directory for an optional subdirectory.
 * @param {string} [subdir]
 * @returns {string} absolute path
 */
function evidenceDir(subdir) {
  const base = process.env.AURAGLASS_EVIDENCE_DIR
    ? path.resolve(process.env.AURAGLASS_EVIDENCE_DIR)
    : path.join(repoRoot, '.artifacts');
  const dir = path.join(base, subdir ?? '');
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

module.exports = { evidenceDir };
