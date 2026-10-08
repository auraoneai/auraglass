#!/usr/bin/env node
// MAT-059 gate literals — the only literal ratchet (SC-17).
// Runs the auraglass/no-raw-design-values matchers programmatically over all
// of src (ts/tsx/css/js) with no directory exclusions and compares per-file
// {category: count} to scripts/tokens/gates/literals-baseline.json.
// Fails if any file/category count rises or a new file has > 0.
// --update rewrites the baseline ONLY downward and refuses any increase (exit 1).
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { ROOT, rel, walkFiles } from './_util.mjs';

const require = createRequire(join(ROOT, 'lint/rules/mat/noop.js'));
const { scanText, isExempt } = require('./_literals.cjs');

const arg = (n) => { const i = process.argv.indexOf(n); return i >= 0 ? process.argv[i + 1] : undefined; };
const BASELINE = arg('--baseline') ?? join(ROOT, 'scripts/tokens/gates/literals-baseline.json');
const FRAGMENT = join(ROOT, 'fragments/literals-baseline/mat.json');
const update = process.argv.includes('--update');
const quiet = process.argv.includes('--quiet');
const srcRoot = arg('--src');

/** Count literals over the whole src/ tree. */
export function measure(root = ROOT) {
  const files = {};
  for (const f of walkFiles(join(root, 'src'), ['.ts', '.tsx', '.css', '.js', '.jsx'])) {
    const r = f.replace(`${root}/`, '');
    if (isExempt(r)) continue;
    const hits = scanText(readFileSync(f, 'utf8'), r);
    if (!hits.length) continue;
    const byCat = {};
    for (const h of hits) byCat[h.category] = (byCat[h.category] ?? 0) + 1;
    files[r] = byCat;
  }
  return files;
}

const isMain = process.argv[1] && process.argv[1].endsWith('literals.mjs');
if (isMain) {
  const measured = measure(srcRoot ?? ROOT);
  const baseline = existsSync(BASELINE)
    ? JSON.parse(readFileSync(BASELINE, 'utf8'))
    : { version: 1, files: {} };

  const increases = [];
  const removes = [];
  for (const [file, cats] of Object.entries(measured)) {
    for (const [cat, n] of Object.entries(cats)) {
      const base = baseline.files[file]?.[cat] ?? 0;
      if (n > base) increases.push(`${file}: ${cat} ${base} -> ${n}`);
    }
    if (!(file in baseline.files)) removes.push(file);
  }

  if (update) {
    // genesis: no baseline yet -> any non-empty measurement is the seed, not an increase
    if (!existsSync(BASELINE)) {
      const next = { version: 1, files: Object.fromEntries(Object.entries(measured).sort(([a], [b]) => a.localeCompare(b))) };
      writeFileSync(BASELINE, JSON.stringify(next, null, 2) + '\n');
      const total = Object.values(measured).reduce((s, c) => s + Object.values(c).reduce((a, b) => a + b, 0), 0);
      console.log(`literals: baseline created (${total} hits across ${Object.keys(measured).length} files)`);
      process.exit(0);
    }
    if (increases.length) {
      for (const i of increases) console.error(`literals: increase refused: ${i}`);
      process.exit(1);
    }
    const next = { version: 1, files: Object.fromEntries(Object.entries(measured).sort(([a], [b]) => a.localeCompare(b))) };
    writeFileSync(BASELINE, JSON.stringify(next, null, 2) + '\n');
    if (existsSync(FRAGMENT)) writeFileSync(FRAGMENT, JSON.stringify(next, null, 2) + '\n');
    const total = Object.values(measured).reduce((s, c) => s + Object.values(c).reduce((a, b) => a + b, 0), 0);
    console.log(`literals: baseline updated downward (${total} hits across ${Object.keys(measured).length} files)`);
    process.exit(0);
  }

  const missing = increases.filter((i) => {
    const [file] = i.split(':');
    return true;
  });
  if (missing.length) {
    for (const m of missing) console.error(`literals: ${m}`);
    process.exit(1);
  }
  if (!quiet) {
    const total = Object.values(measured).reduce((s, c) => s + Object.values(c).reduce((a, b) => a + b, 0), 0);
    console.log(`literals: 0 increases (${total} measured hits, baseline ${Object.keys(baseline.files).length} files)`);
  }
}
