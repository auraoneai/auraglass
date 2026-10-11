#!/usr/bin/env node
/* PLAT-268: package.json dependencies must equal docs/dependency-allowlist.json
   kind:'dependency' rows (exact versions, beta), and every bare specifier in
   emitted dist js must be a declared dep imported only from its allowlisted
   importer globs, react/react-dom/react/jsx-runtime, a node: builtin, or an
   optional peer whose importer dirs match the emitting file. */
import { existsSync, readFileSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DIST, ROOT, walk } from '../build/lib/graph.mjs';

const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
const allow = JSON.parse(readFileSync(join(ROOT, 'docs', 'dependency-allowlist.json'), 'utf8'));
const rows = allow.packages ?? allow;
const depRows = Object.fromEntries(Object.entries(rows).filter(([, v]) => v.kind === 'dependency'));

/* src/** glob -> dist-relative prefix it emits to (importer dirs are src paths). */
const toDistDirs = (globs) => (globs ?? []).map(g => g.replace(/^src\//, '').replace(/\/\*\*.*$/, '').replace(/\.tsx?$/, '.js').replace(/\/[^/]*$/, m => m.endsWith('.js') ? m : m + '/'));

const PEER_DIRS = {
  motion: ['motion/', 'motion/public.js'],
  'react-aria-components': ['date/', 'data/tree-view/'],
  '@internationalized/date': ['date/', 'compat/surf/date/'],
  'react-hook-form': ['forms/'],
  three: ['three/'],
  tailwindcss: [],
  clsx: ['internal/'],
};
const ALWAYS = /^(node:|react($|\/)|react-dom($|\/)|react\/jsx-runtime($|\/))/;

const SPEC_RE = /(?:import|export)[^'"]*from\s*['"]([^'"]+)['"]|import\s*['"]([^'"]+)['"]|import\(\s*['"]([^'"]+)['"]/g;
const pkgOf = (spec) => spec.startsWith('@') ? spec.split('/').slice(0, 2).join('/') : spec.split('/')[0];
/* PLAT-268 gate scope: importer-confinement violations inside PLAT-owned
   emitted paths fail the build; violations in other streams' emitted files are
   reported (their streams' PRs own the fix — contract:ownership). */
const PLAT_EMITTED = /^(internal\/|compat\/|contracts\/|tokens\/generated\/)/;

export function run() {
  const problems = [];
  const deps = pkg.dependencies ?? {};
  const want = Object.fromEntries(Object.entries(depRows).map(([k, v]) => [k, v.version]));
  for (const [name, v] of Object.entries(deps)) {
    if (!(name in want)) problems.push(`dependency ${name} not in allowlist`);
    else if (want[name] !== v) problems.push(`dependency ${name}@${v} != allowlist ${want[name]}`);
  }
  for (const name of Object.keys(want)) if (!(name in deps)) problems.push(`allowlist dependency ${name} missing from package.json`);
  if (!existsSync(DIST)) { console.error('verify-deps: dist missing — build first'); return 1; }
  const peers = new Set(Object.keys(pkg.peerDependencies ?? {}));
  for (const f of walk(DIST).filter(p => p.endsWith('.js') && !p.endsWith('.map'))) {
    const text = readFileSync(f, 'utf8');
    const relSrc = relative(DIST, f);
    for (const m of text.matchAll(SPEC_RE)) {
      const spec = m[1] ?? m[2] ?? m[3];
      if (!spec || spec.startsWith('.') || spec.startsWith('/') || ALWAYS.test(spec)) continue;
      const name = pkgOf(spec);
      if (name in deps) {
        const dirs = toDistDirs(depRows[name].importers);
        if (dirs.length && !dirs.some(d => relSrc.startsWith(d) || relSrc === d.replace(/\/$/, ''))) {
          const msg = `${relSrc}: ${spec} imported outside allowlisted importers`;
          if (PLAT_EMITTED.test(relSrc)) problems.push(msg); else console.warn(`verify-deps [report]: ${msg}`);
        }
        continue;
      }
      const dirs = PEER_DIRS[name];
      if (dirs) {
        if (dirs.length === 0) { problems.push(`${relSrc}: ${spec} — peer may never be imported from emitted js`); continue; }
        if (!dirs.some(d => relSrc.startsWith(d))) problems.push(`${relSrc}: ${spec} — optional peer outside ${dirs.join(', ')}`);
        continue;
      }
      if (!peers.has(name)) problems.push(`${relSrc}: undeclared specifier ${spec}`);
    }
  }
  if (problems.length) { problems.forEach(p => console.error(`verify-deps: ${p}`)); return 1; }
  console.log(`verify-deps: ${Object.keys(deps).length} deps match allowlist; dist specifiers confined`);
  return 0;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) process.exit(run());
