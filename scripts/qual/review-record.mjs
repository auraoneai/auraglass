#!/usr/bin/env node
/* scripts/qual/review-record.mjs — L14 human visual review tooling (REQ-QUAL-73 / REQ-FIN-111; QUAL, G-16).
   Run by the manual GitLab job qual:certify:review-record on the RC pipeline. It never writes, edits or scores a
   record: records under certification/review/records/ are the design reviewer's (FIN-H).

   node --experimental-strip-types scripts/qual/review-record.mjs composites --inputs <review-inputs.json> [--out <dir>]
     Builds one composite PNG per review item (packages/qa/src/evidence/composite.ts) from the lane captures listed in
     review-inputs.json and writes <out>/<item>.png + <out>/index.json ({ version, sha, items: [{ item, file, sha256,
     width, height, tiles, diffRatio }] }). Default out: $AURAGLASS_EVIDENCE_DIR/qual/<job-slug>/composites.

   node --experimental-strip-types scripts/qual/review-record.mjs validate [--sha <sha>] [--records <dir>]
        [--composites <dir>] [--changed <changed-subjects.json>] [--out <file>]
     Validates every record against certification/schemas/review-record.schema.json, the RC SHA (default
     CI_COMMIT_SHA), the composites the reviewer saw (when --composites is given) and the required item list (every
     flagship subject-state, the T0 matrix, the six S1 showcases, every subject changed by a baseline refresh), then
     writes the summary (default $AURAGLASS_EVIDENCE_DIR/qual/<job-slug>/review-record.json).

   Exit: 0 composites written / every required record passes (all criteria ≥3) · 1 fail or incomplete ·
         64 usage error (bad arguments); any other error exits 1. */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadComponentMetas } from '../../packages/qa/src/resolve/componentMetas.ts';
import { decodePng } from '../../packages/qa/src/evidence/png.ts';
import { buildComposite, CompositeInputError } from '../../packages/qa/src/evidence/composite.ts';
import { loadRecords, requiredItems, summarizeReview, REVIEW_RECORDS_DIR } from '../../packages/qa/src/evidence/reviewRecord.ts';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const EXIT = { ok: 0, fail: 1, usage: 64 };

function parse(argv) {
  const [mode, ...rest] = argv;
  const opts = {};
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i];
    if (!a.startsWith('--') || rest[i + 1] === undefined) throw new Error(`bad argument ${a}`);
    opts[a.slice(2)] = rest[++i];
  }
  if (!['composites', 'validate'].includes(mode)) throw new Error(`mode must be composites|validate (got ${mode ?? 'none'})`);
  const allowed = mode === 'composites' ? ['inputs', 'out'] : ['sha', 'records', 'composites', 'changed', 'out'];
  const bad = Object.keys(opts).filter((k) => !allowed.includes(k));
  if (bad.length) throw new Error(`unknown option(s) for ${mode}: ${bad.map((b) => `--${b}`).join(', ')}`);
  return { mode, opts };
}

const jobDir = (env) => join(ROOT, env.AURAGLASS_EVIDENCE_DIR || '.artifacts', 'qual', env.CI_JOB_NAME_SLUG || 'qual-certify-review-record');

export function composites(opts, env = process.env) {
  if (!opts.inputs) throw new Error('composites needs --inputs <review-inputs.json>');
  const inputsFile = resolve(ROOT, opts.inputs);
  if (!existsSync(inputsFile)) {
    console.error(`review-record: ${opts.inputs} not found. It is written next to the L6/L7 captures (environment-visual / regression lanes); `
      + 'no composite can be built without the captured pixels.');
    return EXIT.fail;
  }
  const index = JSON.parse(readFileSync(inputsFile, 'utf8'));
  const base = dirname(inputsFile);
  const img = (p) => (p == null ? null : decodePng(readFileSync(join(base, p))));
  const out = resolve(ROOT, opts.out ?? join(jobDir(env), 'composites'));
  mkdirSync(out, { recursive: true });
  const items = [];
  const errors = [];
  for (const it of index.items ?? []) {
    try {
      const scenes = Object.fromEntries(Object.entries(it.scenes ?? {}).map(([k, v]) => [k, { light: img(v?.light), dark: img(v?.dark) }]));
      const c = buildComposite({ item: it.item, scenes, mobile: img(it.mobile), baseline: img(it.baseline ?? null), current: img(it.current) });
      writeFileSync(join(out, `${c.item}.png`), c.png);
      items.push({ item: c.item, file: `${c.item}.png`, sha256: c.sha256, width: c.width, height: c.height, tiles: c.tiles, diffRatio: c.diffRatio });
    } catch (e) {
      errors.push(`${it.item ?? '?'}: ${e instanceof CompositeInputError ? e.message : e?.message ?? e}`);
    }
  }
  writeFileSync(join(out, 'index.json'), `${JSON.stringify({ version: 1, sha: index.sha ?? null, items }, null, 2)}\n`);
  console.log(`review-record: ${items.length} composite(s) in ${out}`);
  if (!items.length && !errors.length) errors.push(`${opts.inputs} lists no review item`);
  if (errors.length) { console.error(`review-record: ${errors.length} item(s) without a composite:\n  ${errors.join('\n  ')}`); return EXIT.fail; }
  return EXIT.ok;
}

export function validate(opts, env = process.env) {
  const sha = opts.sha ?? env.CI_COMMIT_SHA;
  if (!sha || !/^[0-9a-f]{40}$/.test(sha)) throw new Error('validate needs --sha <40-hex RC SHA> (or CI_COMMIT_SHA)');
  const flagships = [...loadComponentMetas(ROOT).values()].flat().filter((m) => m.flagship !== undefined).map((m) => ({ name: m.name, states: m.states }));
  const showcasesFile = join(ROOT, 'showcase/showcases.json');
  const s1Showcases = existsSync(showcasesFile) ? (JSON.parse(readFileSync(showcasesFile, 'utf8')).showcases ?? []).filter((s) => s.tier === 'S1').map((s) => s.id) : [];
  const changedSubjects = opts.changed ? JSON.parse(readFileSync(resolve(ROOT, opts.changed), 'utf8')) : [];
  if (!Array.isArray(changedSubjects) || !changedSubjects.every((s) => typeof s === 'string')) throw new Error('--changed must be a JSON array of subject names');
  let composites;
  if (opts.composites) {
    const idx = JSON.parse(readFileSync(join(resolve(ROOT, opts.composites), 'index.json'), 'utf8'));
    composites = new Map((idx.items ?? []).map((i) => [i.item, i.sha256]));
  }
  const req = requiredItems({ flagships, s1Showcases, changedSubjects });
  const records = loadRecords(resolve(ROOT, opts.records ?? REVIEW_RECORDS_DIR));
  const summary = summarizeReview({ sha, records, required: req.items, requiredProblems: req.problems, ...(composites ? { composites } : {}) });
  const out = resolve(ROOT, opts.out ?? join(jobDir(env), 'review-record.json'));
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, `${JSON.stringify(summary, null, 2)}\n`);
  console.log(`review-record: ${summary.verdict} — ${summary.passed}/${summary.required} required item(s) pass, ${summary.recorded} recorded, `
    + `${summary.missing.length} missing, ${summary.failing.length} scored <3, ${summary.invalid.length} invalid, ${summary.unbound.length} not on ${sha}`);
  for (const f of summary.failing) console.error(`  ${f.item}: ${f.criteria.join(', ')} < 3 (${f.file})`);
  for (const i of summary.invalid) console.error(`  ${i.file}: ${i.problems.join('; ')}`);
  for (const p of summary.problems) console.error(`  ${p}`);
  return summary.verdict === 'pass' ? EXIT.ok : EXIT.fail;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  let parsed;
  try { parsed = parse(process.argv.slice(2)); } catch (e) { console.error(`review-record: ${e.message}`); process.exit(EXIT.usage); }
  try { process.exit(parsed.mode === 'composites' ? composites(parsed.opts) : validate(parsed.opts)); } catch (e) { console.error(`review-record: ${e.stack ?? e.message}`); process.exit(EXIT.fail); }
}
