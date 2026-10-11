'use strict';
/* REQ-CMP-08 / REQ-FIN-70: the CMP-owned source set the literal ratchet and
   tests/lint/cmp/cmp-lint.test.ts sweep. PRD-F §6 (FIN-E "May touch"):
   src/{components,primitives,icons,foundation,forms}/** minus the SURF dirs
   under src/components (FIN-F, REQ-FIN-90 / SURF-190 sweep those). */
const { readdirSync } = require('node:fs');
const { join, relative, sep } = require('node:path');

const CMP_ROOTS = ['src/components', 'src/primitives', 'src/icons', 'src/foundation', 'src/forms'];
const SURF_DIRS = ['tabs', 'tab-bar', 'breadcrumbs', 'pagination', 'command-palette', 'source-transition', 'timeline']
  .map((d) => `src/components/${d}`);
const EXT = /\.(css|ts|tsx)$/;

const toPosix = (p) => p.split(sep).join('/');
const isSurf = (rel) => SURF_DIRS.some((d) => rel === d || rel.startsWith(`${d}/`));

/** Repo-relative POSIX paths of every CMP .css/.ts/.tsx file, sorted. */
function listCmpFiles(root = process.cwd()) {
  const out = [];
  const walk = (abs) => {
    for (const e of readdirSync(abs, { withFileTypes: true })) {
      const p = join(abs, e.name);
      const rel = toPosix(relative(root, p));
      if (e.isDirectory()) {
        if (!isSurf(rel)) walk(p);
      } else if (EXT.test(e.name)) {
        out.push(rel);
      }
    }
  };
  for (const r of CMP_ROOTS) walk(join(root, r));
  return out.sort((a, b) => a.localeCompare(b));
}

module.exports = { CMP_ROOTS, SURF_DIRS, listCmpFiles, isSurf };
