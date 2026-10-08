#!/usr/bin/env node
/* MAT-309: APG coverage gate. Reads tests/a11y/apg/mat/coverage.json (plus any
   sibling per-stream coverage.json) and fails when:
   - an interactive component has no spec file on disk ('provider missing'),
   - a spec never exercises a key listed in requiredKeys,
   - a spec file exists under apg/<stream> but is not in coverage.json.
   Ratchet mode reports; --enforce exits non-zero. */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const APG = path.join(root, 'tests/a11y/apg');
const enforce = process.argv.includes('--enforce');
const coverageArg = process.argv.find((a) => a.startsWith('--coverage='));

const coverageFiles = coverageArg
  ? [path.join(root, coverageArg.split('=')[1])]
  : fs.readdirSync(APG, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => path.join(APG, d.name, 'coverage.json'))
      .filter((p) => fs.existsSync(p));

const APG_KEYS = new Set([
  'ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'Tab', 'Shift+Tab',
  'Enter', ' ', 'Space', 'Escape', 'Home', 'End', 'PageUp', 'PageDown',
  'a', 'A', '*', 'Control+Home', 'Control+End', 'Control+ArrowLeft', 'Control+ArrowRight',
]);

const failures = [];
for (const file of coverageFiles) {
  const cov = JSON.parse(fs.readFileSync(file, 'utf8'));
  for (const [name, row] of Object.entries(cov.components ?? {})) {
    if (!row.spec) {
      if ((row.requiredKeys ?? []).length > 0) {
        failures.push(`provider missing: ${name} declares requiredKeys but has no spec`);
      }
      continue;
    }
    const specPath = path.join(root, row.spec);
    if (!fs.existsSync(specPath)) {
      failures.push(`provider missing: ${name} -> ${row.spec} not found`);
      continue;
    }
    const src = fs.readFileSync(specPath, 'utf8');
    for (const key of row.requiredKeys ?? []) {
      const lit = APG_KEYS.has(key) ? `'${key}'` : key;
      if (!src.includes(key)) {
        failures.push(`${name}: spec ${row.spec} never exercises required key ${key}`);
      }
      void lit;
    }
  }
}

// unregistered spec files under apg/<stream>/ must appear in coverage.json
for (const dir of fs.readdirSync(APG, { withFileTypes: true })) {
  if (!dir.isDirectory()) continue;
  const cov = path.join(APG, dir.name, 'coverage.json');
  if (!fs.existsSync(cov)) continue;
  const registered = new Set(
    Object.values(JSON.parse(fs.readFileSync(cov, 'utf8')).components ?? {})
      .map((r) => r.spec && path.basename(r.spec)),
  );
  for (const f of fs.readdirSync(path.join(APG, dir.name))) {
    if (/\.apg\.spec\.(ts|tsx)$/.test(f) && !registered.has(f)) {
      failures.push(`unregistered spec: tests/a11y/apg/${dir.name}/${f}`);
    }
  }
}

for (const f of failures) console.error(`FAIL ${f}`);
if (failures.length && enforce) process.exit(1);
if (!failures.length) console.log('apg coverage: ok');
else console.log(`apg coverage: ${failures.length} finding(s)${enforce ? '' : ' (ratchet — non-blocking)'}`);
