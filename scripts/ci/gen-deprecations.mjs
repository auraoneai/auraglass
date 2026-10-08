#!/usr/bin/env node
/* PLAT-137/152 — emits deprecations.json for the package tarball from the
   committed deprecation fragments (all streams). */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DIR = path.join(ROOT, 'fragments', 'deprecations');
const out = [];

for (const name of readdirSync(DIR).filter((n) => n.endsWith('.ts') || n.endsWith('.js'))) {
  const src = readFileSync(path.join(DIR, name), 'utf8');
  // Transpile-free extraction: compile via the repo's tsx loader when present,
  // else parse the object literals. The fragments are data, so evaluate with esbuild if available.
  try {
    const code = execFileSync(
      'npx',
      ['tsx', '-e',
        `import f from ${JSON.stringify('./fragments/deprecations/' + name)}; process.stdout.write(JSON.stringify(f.default ?? f));`],
      { cwd: ROOT, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 },
    );
    const entries = JSON.parse(code);
    for (const e of entries) out.push(e);
  } catch (e) {
    console.error(`gen-deprecations: cannot load ${name}: ${e.message}`);
    process.exit(1);
  }
}

writeFileSync(
  path.join(ROOT, 'deprecations.json'),
  JSON.stringify({ version: 1, generated: new Date().toISOString(), entries: out }, null, 2) + '\n',
);
console.log(`gen-deprecations: ${out.length} entries -> deprecations.json`);
