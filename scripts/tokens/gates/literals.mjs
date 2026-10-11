#!/usr/bin/env node
// MAT-059 gate literals — the only literal ratchet (SC-17, REQ-MAT-18, D.2-04).
// Runs the auraglass/no-raw-design-values matchers programmatically over all
// of src (ts/tsx/css/js) with no directory exclusions and compares per-file
// {category: count} with the owning stream's baseline fragment
// fragments/literals-baseline/<stream>.json (contract F `literals-baseline`,
// LiteralsBaseline shape). A file belongs to the stream that owns it in
// contracts/ownership.json (5x rows, first match wins).
//
// Usage:
//   literals.mjs --stream <s>        compare stream <s>'s files with <s>.json; exit 1 on any increase
//   literals.mjs                     every stream; non-MAT increases print as `pre-existing (<s>)`,
//                                    exit 1 only on MAT increases (L1 / mat:lint:literals)
//   --update                         with --stream or --baseline: rewrite that baseline ONLY
//                                    downward; any increase exits 1 and writes nothing
//   --baseline <file>                custom baseline (all files, or the --stream subset). The
//                                    repo fragments are never read or written in this mode.
//   --fragments <dir>                directory holding <stream>.json (default fragments/literals-baseline)
//   --src <root>                     measure <root>/src instead of the repo
//   --quiet                          no summary line on success
// Fails if any file/category count rises or a new file has > 0.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, resolve } from 'node:path';
import picomatch from 'picomatch';
import { ROOT, walkFiles } from './_util.mjs';

const require = createRequire(import.meta.url);
const { scanText, isExempt, CATEGORIES } = require('../../../lint/rules/mat/_literals.cjs');

export const STREAMS = ['plat', 'mat', 'cmp', 'surf', 'qual'];

/* Stream attribution through contracts/ownership.json (rows scoped to other
 * lines are skipped). Unmatched paths fall to PLAT, the `src/**` catch-all. */
const OWNERSHIP_ROWS = JSON.parse(readFileSync(join(ROOT, 'contracts/ownership.json'), 'utf8')).rows
  .filter((r) => !r.lines || r.lines.includes('5x'))
  .map((r) => ({ owner: r.owner, test: picomatch(r.glob, { dot: true }) }));

/** Owning stream (lower-case: plat, mat, cmp, surf, qual, contract, none) of a repo-relative path. */
export function streamOf(relPath) {
  const p = relPath.replace(/\\/g, '/');
  const row = OWNERSHIP_ROWS.find((r) => r.test(p));
  return (row ? row.owner : 'PLAT').toLowerCase();
}

/** Count literals over the whole src/ tree: { 'src/x.ts': { color: 2 } }. */
export function measure(root = ROOT) {
  const files = {};
  for (const f of walkFiles(join(root, 'src'), ['.ts', '.tsx', '.css', '.js', '.jsx'])) {
    const r = f.slice(root.length + 1).replace(/\\/g, '/');
    if (isExempt(r)) continue;
    const hits = scanText(readFileSync(f, 'utf8'), r);
    if (!hits.length) continue;
    const byCat = {};
    for (const h of hits) byCat[h.category] = (byCat[h.category] ?? 0) + 1;
    files[r] = byCat;
  }
  return files;
}

const show = (file) => (file.startsWith(`${ROOT}/`) ? file.slice(ROOT.length + 1) : file);
const sum = (files) => Object.values(files).reduce((s, c) => s + Object.values(c).reduce((a, b) => a + b, 0), 0);
const sorted = (files) => Object.fromEntries(Object.entries(files).sort(([a], [b]) => a.localeCompare(b)));

/** Read a LiteralsBaseline; a missing file is an empty baseline, a malformed one throws. */
export function readBaseline(file) {
  if (!existsSync(file)) return { version: 1, files: {}, missing: true };
  const v = JSON.parse(readFileSync(file, 'utf8'));
  const ok = v && typeof v === 'object' && v.version === 1 && v.files && typeof v.files === 'object'
    && Object.values(v.files).every((c) => c && typeof c === 'object'
      && Object.entries(c).every(([k, n]) => CATEGORIES.includes(k) && Number.isInteger(n) && n >= 0));
  if (!ok) throw new Error(`${show(file)}: not a LiteralsBaseline ({ version: 1, files: { <path>: { <category>: <count> } } })`);
  return v;
}

/** Per-file/category increases of `measured` over `baseline.files`. */
export function increasesOf(measured, baseline) {
  const out = [];
  for (const [file, cats] of Object.entries(measured)) {
    for (const [cat, n] of Object.entries(cats)) {
      const base = baseline.files[file]?.[cat] ?? 0;
      if (n > base) out.push(`${file}: ${cat} ${base} -> ${n}`);
    }
  }
  return out;
}

const pick = (measured, stream) =>
  Object.fromEntries(Object.entries(measured).filter(([f]) => streamOf(f) === stream));

const isMain = process.argv[1] && resolve(process.argv[1]) === resolve(new URL(import.meta.url).pathname);
if (isMain) {
  const arg = (n) => { const i = process.argv.indexOf(n); return i >= 0 ? process.argv[i + 1] : undefined; };
  const update = process.argv.includes('--update');
  const quiet = process.argv.includes('--quiet');
  const stream = arg('--stream');
  const custom = arg('--baseline');
  const fragmentsDir = resolve(arg('--fragments') ?? join(ROOT, 'fragments/literals-baseline'));
  const srcRoot = resolve(arg('--src') ?? ROOT);
  if (stream !== undefined && !STREAMS.includes(stream)) {
    console.error(`literals: --stream must be one of ${STREAMS.join(', ')} (got ${stream})`);
    process.exit(2);
  }
  if (update && !stream && !custom) {
    // a stream writes only its own fragment (contract F literals-baseline)
    console.error('literals: --update needs --stream <s> (or --baseline <file>)');
    process.exit(2);
  }
  const all = measure(srcRoot);

  /** One comparison unit: { label, file, measured, failing }. */
  const units = custom
    ? [{ label: stream ?? 'custom', file: resolve(custom), measured: stream ? pick(all, stream) : all, failing: true }]
    : (stream ? [stream] : STREAMS).map((s) => ({
      label: s, file: join(fragmentsDir, `${s}.json`), measured: pick(all, s), failing: stream ? true : s === 'mat',
    }));

  // Files whose owner is not a stream (CONTRACT / NONE rows) are never silently dropped.
  const unowned = custom || stream ? [] : Object.keys(all).filter((f) => !STREAMS.includes(streamOf(f)));

  let failed = false;
  for (const u of units) {
    let baseline;
    try { baseline = readBaseline(u.file); } catch (e) {
      if (u.failing) { console.error(`literals: ${e.message}`); failed = true; }
      else console.log(`literals: pre-existing (${u.label}) ${e.message}`);
      continue;
    }
    const inc = increasesOf(u.measured, baseline);
    if (update) {
      if (inc.length) {
        for (const i of inc) console.error(`literals: increase refused (${u.label}): ${i}`);
        failed = true;
        continue;
      }
      writeFileSync(u.file, JSON.stringify({ version: 1, files: sorted(u.measured) }, null, 2) + '\n');
      console.log(`literals: ${u.label} baseline ${baseline.missing ? 'created' : 'updated downward'} (${sum(u.measured)} hits across ${Object.keys(u.measured).length} files) -> ${show(u.file)}`);
      continue;
    }
    for (const i of inc) {
      if (u.failing) console.error(`literals: ${u.label.toUpperCase()} ${i}`);
      else console.log(`literals: pre-existing (${u.label}) ${i}`);
    }
    if (inc.length && u.failing) failed = true;
    if (!quiet && !inc.length) console.log(`literals: ${u.label} 0 increases (${sum(u.measured)} measured hits in ${Object.keys(u.measured).length} files, baseline ${Object.keys(baseline.files).length} files)`);
  }
  for (const f of unowned) console.log(`literals: pre-existing (${streamOf(f)}) ${f}: ${JSON.stringify(all[f])} (no stream owns this path)`);
  process.exit(failed ? 1 : 0);
}
