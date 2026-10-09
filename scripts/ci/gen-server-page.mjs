#!/usr/bin/env node
/* PLAT-288: regenerate canaries/{next16,next15}/app/plat/server/page.tsx from
   build/server-safe-exports.json at integration time. Only subpaths the map
   marks safe:true are imported — a server-safe entry that regresses drops
   out of the page (asserted on by the rsc spec) rather than breaking SSR. */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';

const ROOT = process.cwd();
const map = JSON.parse(readFileSync(join(ROOT, 'build/server-safe-exports.json'), 'utf8'));
const safe = map.entries.filter((e) => e.safe === true && e.subpath !== '.');
const skipped = map.entries.filter((e) => e.safe !== true);

const imports = safe
  .map((e) => `import * as mod_${e.subpath.replace(/[^a-zA-Z0-9]/g, '_')} from 'aura-glass/${e.subpath.replace(/^\.\//, '')}';`)
  .join('\n');
const entries = safe
  .map((e) => `  '${e.subpath.replace(/^\.\//, '')}': mod_${e.subpath.replace(/[^a-zA-Z0-9]/g, '_')},`)
  .join('\n');

const page = `/* GENERATED at integration time by scripts/ci/gen-server-page.mjs — do
   not edit by hand. Renders every server-safe export count so the rsc spec
   can assert the payload carries no client reference. Server Component. */
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

for (const canary of ['next16', 'next15']) {
  const out = join(ROOT, 'canaries', canary, 'app', 'plat', 'server', 'page.tsx');
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, page);
  console.log(`${canary}: regenerated app/plat/server/page.tsx (${safe.length} safe, ${skipped.length} skipped)`);
}
