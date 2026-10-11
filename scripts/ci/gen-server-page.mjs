#!/usr/bin/env node
/* PLAT-288 / REQ-PLAT-77 item 2: regenerate canaries/{next16,next15}/app/plat/server/page.tsx
   from build/server-safe-exports.json at integration time. Only subpaths the
   map marks safe:true AND that package.json actually exports are imported — a
   server-safe entry that regresses drops out of the page (the rsc spec asserts
   on the payload) rather than breaking SSR, and an internal-only entry (no
   `exports` row) is never imported by a consumer canary.

   Exit codes: 0 written; 2 usage error (build/server-safe-exports.json absent —
   run `npm run build` first) or no importable server-safe entry. */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const CANARIES = ['next16', 'next15'];

const ident = (subpath) => `mod_${subpath.replace(/[^a-zA-Z0-9]/g, '_')}`;
const bare = (subpath) => subpath.replace(/^\.\//, '');

/** Server-safe, consumer-exported subpaths (root '.' excluded: it is not server-safe by contract). */
export function importableSubpaths(map, exportsKeys) {
  const exported = new Set(exportsKeys);
  const safe = [];
  const skipped = [];
  for (const e of map.entries ?? []) {
    if (e.subpath === '.') continue;
    if (e.safe === true && exported.has(e.subpath)) safe.push(e.subpath);
    else skipped.push({ subpath: e.subpath, reason: e.safe === true ? 'not in package.json exports' : 'safe:false' });
  }
  return { safe, skipped };
}

export function renderServerPage(subpaths) {
  const imports = subpaths.map((s) => `import * as ${ident(s)} from 'aura-glass/${bare(s)}';`).join('\n');
  const entries = subpaths.map((s) => `  '${bare(s)}': ${ident(s)},`).join('\n');
  return `/* GENERATED at integration time by scripts/ci/gen-server-page.mjs from
   build/server-safe-exports.json — do not edit by hand. Renders every
   server-safe export count so the rsc spec can assert the payload carries no
   client reference. Server Component (no directive, no hooks). */
${imports}

const modules = {
${entries}
};

export default function PlatServerPage() {
  const counts = Object.entries(modules).map(([name, mod]) => \`\${name}:\${Object.keys(mod).length}\`).join(' ');
  return (
    <main data-ag-canary="plat-server">
      <h1>plat/server</h1>
      <p data-ag-canary="counts">{counts}</p>
    </main>
  );
}
`;
}

export function main(root = process.cwd()) {
  const mapPath = join(root, 'build/server-safe-exports.json');
  if (!existsSync(mapPath)) {
    console.error('gen-server-page: build/server-safe-exports.json missing — run `npm run build` (scripts/build/post.mjs writes it) first');
    return 2;
  }
  const map = JSON.parse(readFileSync(mapPath, 'utf8'));
  const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
  const { safe, skipped } = importableSubpaths(map, Object.keys(pkg.exports ?? {}));
  if (safe.length === 0) {
    console.error('gen-server-page: no server-safe exported subpath — refusing to write an empty server page');
    return 2;
  }
  const page = renderServerPage(safe);
  for (const canary of CANARIES) {
    const out = join(root, 'canaries', canary, 'app', 'plat', 'server', 'page.tsx');
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, page);
    console.log(`${canary}: regenerated app/plat/server/page.tsx (${safe.length} safe: ${safe.join(' ')}; ${skipped.length} skipped)`);
  }
  for (const s of skipped) console.log(`  skipped ${s.subpath}: ${s.reason}`);
  return 0;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) process.exit(main());
