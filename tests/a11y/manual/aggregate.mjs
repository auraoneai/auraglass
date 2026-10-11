#!/usr/bin/env node
/* tests/a11y/manual/aggregate.mjs — L13 manual a11y records aggregator
   (REQ-FIN-110 -> FIN-G ReleaseVerdict REQ-FIN-103; REQ-QUAL-72; FIN-H task H3-4).

   Usage:
     node tests/a11y/manual/aggregate.mjs --sha <sha>
       [--records tests/a11y/manual/records]
       [--out .artifacts/qual/a11y-manual-<sha>.json]
       [--template tests/a11y/manual/sr-matrix.template.json]

   Joins the tester-committed SrRecords against the generated matrix
   (sr-matrix.template.json, gen-matrix.mjs) and writes one JSON summary that
   FIN-G's `qual:certify:verdict` consumes. Output shape (owned by FIN-H):
     { sha, generatedAt, template, recordsDir, required, recorded, passed, failed,
       missing[], failures[], invalid[], excluded[],
       byStream{mat,cmp,surf}, byPass{sr,touch,motion}, minimums[], verdict }
   byStream / byPass entries are { required, recorded, passed, failed, missing }.

   Records go through the H3-1 validation (the SrRecord schema validator and
   the <stream>/<subject>-<at>[-motion].json path rule exported by
   scripts/mat/verify-a11y-manual.mjs) plus the join rules below:
     - a record whose sha != --sha is excluded (listed in excluded[]) and its
       row counts as missing: only records bound to the tested SHA count;
     - a schema-invalid, misplaced, duplicate or unmatched record (no template
       row for its (subject, pass, at), or a stream/flagship that disagrees
       with the row) is listed in invalid[] and makes the verdict "fail".
   Verdict:
     "fail"       any invalid record, or any matched record with result "fail";
     "incomplete" otherwise, when a required row has no record on the SHA or a
                  minimum below is not met;
     "pass"       every required row has a result "pass" record on the SHA and
                  every minimum holds.
   Minimums (AC-FIN-110 / PRD-F REQ-FIN-110 / issue #16), counted from passing
   records only, so a shrunk template can never yield "pass":
     flagships       every flagship number 1..44 has >= 5 passing records
                     (4 SR platforms + touch) on one of its subjects; >= 44x5 total
     mat             >= 10 passing MAT records
     surf-flagships  >= 24 SURF flagship subjects with 5 passes each; >= 24x5 total
     ai              >= 3 AI subjects (meta entry './ai') with 5 passes each
     motion          >= 4 passing reduced-motion records, one per SR platform
   Exit 0 only on verdict "pass"; 1 on "fail"/"incomplete"; 64 on usage errors
   (no output written). */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SCHEMA_PATH, expectedName, validate } from '../../../scripts/mat/verify-a11y-manual.mjs';
import { FLAGSHIP_RANGE, SR_AT, TEMPLATE_PATH, TOUCH_AT, kebab, loadMetas } from './gen-matrix.mjs';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
export const DEFAULT_RECORDS = 'tests/a11y/manual/records';
export const STREAMS = ['mat', 'cmp', 'surf'];
export const PASSES = ['sr', 'touch', 'motion'];
export const MIN = { flagshipPasses: 5, mat: 10, surfFlagships: 24, ai: 3, motion: 4 };
const AI_ENTRY = './ai';

const key = (subject, pass, at) => `${subject}|${pass}|${at}`;

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
}

/** Subject ids (kebab) whose ComponentMeta lives in the AI entry point. */
export async function aiSubjects(root = ROOT) {
  return new Set((await loadMetas(root)).filter((m) => m.entry === AI_ENTRY).map((m) => kebab(m.name)));
}

/** Five passes for one subject: all 4 SR platforms plus touch on at least one device. */
function fivePasses(passedAts) {
  return SR_AT.every((at) => passedAts.has(`sr|${at}`)) && TOUCH_AT.some((at) => passedAts.has(`touch|${at}`));
}

/**
 * Pure aggregation. `records` is [{file, rel, rec}] (rec = parsed JSON or a
 * parse error string); `rows` are the template rows; `ai` the AI subject ids.
 */
export function aggregate({ sha, rows, records, schema, ai, generatedAt = new Date().toISOString() }) {
  const required = rows.filter((r) => r.required);
  const byKey = new Map(required.map((r) => [key(r.subject, r.pass, r.at), r]));
  const invalid = [];
  const excluded = [];
  const matched = new Map(); // row key -> {row, rec, rel}

  for (const { rel, rec, parseError } of records) {
    if (parseError) { invalid.push({ record: rel, errors: [`invalid JSON: ${parseError}`] }); continue; }
    if (rec === null || typeof rec !== 'object' || Array.isArray(rec)) {
      invalid.push({ record: rel, errors: ['record is not a JSON object'] });
      continue;
    }
    if (rec.sha !== sha) { excluded.push({ record: rel, reason: `sha ${rec.sha} != ${sha}` }); continue; }
    const errors = validate(schema, rec);
    const parts = rel.split('/');
    if (parts.length !== 2 || parts[0] !== rec.stream || parts[1] !== expectedName(rec)) {
      errors.push(`must be at <records>/${rec.stream}/${expectedName(rec)}`);
    }
    const k = key(rec.subject, rec.pass, rec.at);
    const row = byKey.get(k);
    if (!row) errors.push(`no required template row for (subject, pass, at) = (${rec.subject}, ${rec.pass}, ${rec.at})`);
    else {
      if (rec.stream !== row.stream) errors.push(`stream ${rec.stream} != template stream ${row.stream}`);
      if (rec.flagship !== row.flagship) errors.push(`flagship ${rec.flagship} != template flagship ${row.flagship}`);
      if (matched.has(k)) errors.push(`duplicate (subject, pass, at) = (${rec.subject}, ${rec.pass}, ${rec.at}); first in ${matched.get(k).rel}`);
    }
    if (errors.length) { invalid.push({ record: rel, errors }); continue; }
    matched.set(k, { row, rec, rel });
  }

  const bucket = () => ({ required: 0, recorded: 0, passed: 0, failed: 0, missing: 0 });
  const byStream = Object.fromEntries(STREAMS.map((s) => [s, bucket()]));
  const byPass = Object.fromEntries(PASSES.map((p) => [p, bucket()]));
  const missing = [];
  const failures = [];
  let passed = 0;
  let failed = 0;
  for (const row of required) {
    const m = matched.get(key(row.subject, row.pass, row.at));
    const buckets = [byStream[row.stream], byPass[row.pass]];
    for (const b of buckets) b.required++;
    if (!m) {
      missing.push({ subject: row.subject, stream: row.stream, flagship: row.flagship, pass: row.pass, at: row.at, record: row.record, script: row.script });
      for (const b of buckets) b.missing++;
      continue;
    }
    for (const b of buckets) b.recorded++;
    if (m.rec.result === 'pass') {
      passed++;
      for (const b of buckets) b.passed++;
    } else {
      failed++;
      for (const b of buckets) b.failed++;
      failures.push({
        subject: row.subject, stream: row.stream, flagship: row.flagship, pass: row.pass, at: row.at,
        record: m.rel, tester: m.rec.tester, date: m.rec.date,
        failedSteps: m.rec.steps.map((s, i) => ({ step: i + 1, ...s })).filter((s) => s.pass !== true)
          .map(({ step, action, expected, announced }) => ({ step, action, expected, announced })),
        notes: m.rec.notes ?? null,
      });
    }
  }

  // Minimums over passing matched records.
  const passing = [...matched.values()].filter((m) => m.rec.result === 'pass').map((m) => m.row);
  const atsBySubject = new Map();
  for (const r of passing) {
    if (r.pass === 'motion') continue;
    const s = atsBySubject.get(r.subject) ?? new Set();
    s.add(`${r.pass}|${r.at}`);
    atsBySubject.set(r.subject, s);
  }
  const fullSubjects = new Set([...atsBySubject].filter(([, ats]) => fivePasses(ats)).map(([s]) => s));
  const flagshipRows = passing.filter((r) => r.flagship !== null && r.pass !== 'motion');
  const flagshipNumbers = [];
  for (let n = FLAGSHIP_RANGE[0]; n <= FLAGSHIP_RANGE[1]; n++) flagshipNumbers.push(n);
  const coveredFlagships = flagshipNumbers.filter((n) =>
    flagshipRows.some((r) => r.flagship === n && fullSubjects.has(r.subject)));
  const surfFlagshipRows = flagshipRows.filter((r) => r.stream === 'surf');
  const surfFull = new Set(surfFlagshipRows.filter((r) => fullSubjects.has(r.subject)).map((r) => r.subject));
  const aiFull = [...fullSubjects].filter((s) => ai.has(s)).sort();
  const motionRows = passing.filter((r) => r.pass === 'motion');
  const motionAts = new Set(motionRows.map((r) => r.at));
  const nFlagships = flagshipNumbers.length;
  const minimums = [
    { id: 'flagships', need: `${nFlagships} flagship numbers x ${MIN.flagshipPasses} passes (>= ${nFlagships * MIN.flagshipPasses} records)`,
      have: { flagships: coveredFlagships.length, records: flagshipRows.length,
        uncovered: flagshipNumbers.filter((n) => !coveredFlagships.includes(n)) },
      ok: coveredFlagships.length === nFlagships && flagshipRows.length >= nFlagships * MIN.flagshipPasses },
    { id: 'mat', need: `>= ${MIN.mat} passing MAT records`,
      have: { records: passing.filter((r) => r.stream === 'mat').length },
      ok: passing.filter((r) => r.stream === 'mat').length >= MIN.mat },
    { id: 'surf-flagships', need: `>= ${MIN.surfFlagships} SURF flagship subjects x ${MIN.flagshipPasses} passes (>= ${MIN.surfFlagships * MIN.flagshipPasses} records)`,
      have: { subjects: surfFull.size, records: surfFlagshipRows.length },
      ok: surfFull.size >= MIN.surfFlagships && surfFlagshipRows.length >= MIN.surfFlagships * MIN.flagshipPasses },
    { id: 'ai', need: `>= ${MIN.ai} AI subjects (meta entry '${AI_ENTRY}') x ${MIN.flagshipPasses} passes`,
      have: { subjects: aiFull },
      ok: aiFull.length >= MIN.ai },
    { id: 'motion', need: `>= ${MIN.motion} passing reduced-motion records covering ${SR_AT.join(', ')}`,
      have: { records: motionRows.length, at: SR_AT.filter((a) => motionAts.has(a)) },
      ok: motionRows.length >= MIN.motion && SR_AT.every((a) => motionAts.has(a)) },
  ];

  let verdict = 'pass';
  if (invalid.length || failed) verdict = 'fail';
  else if (missing.length || minimums.some((m) => !m.ok) || required.length === 0) verdict = 'incomplete';

  return {
    sha, generatedAt,
    required: required.length, recorded: matched.size, passed, failed,
    missing, failures, invalid, excluded,
    byStream, byPass, minimums, verdict,
  };
}

/** Reads every *.json under dir as [{file, rel, rec|parseError}] (rel uses '/'). */
export function readRecords(dir) {
  return walk(dir).filter((f) => f.endsWith('.json')).sort().map((file) => {
    const rel = path.relative(dir, file).split(path.sep).join('/');
    try { return { file, rel, rec: JSON.parse(fs.readFileSync(file, 'utf8')) }; }
    catch (e) { return { file, rel, parseError: e.message }; }
  });
}

function parseArgs(argv) {
  const opts = {};
  const names = { '--sha': 'sha', '--records': 'records', '--out': 'out', '--template': 'template' };
  for (let i = 0; i < argv.length; i++) {
    const name = names[argv[i]];
    if (!name) return { error: `unknown argument ${argv[i]}` };
    const v = argv[i + 1];
    if (v === undefined || v === '' || v.startsWith('--')) return { error: `${argv[i]} requires a value` };
    if (name in opts) return { error: `${argv[i]} given twice` };
    opts[name] = v;
    i++;
  }
  if (!opts.sha) return { error: '--sha <sha> is required' };
  if (!/^[0-9a-f]{7,40}$/.test(opts.sha)) return { error: `--sha ${opts.sha} is not a git SHA` };
  return { opts };
}

export async function main(argv, { cwd = process.cwd(), root = ROOT } = {}) {
  const { opts, error } = parseArgs(argv);
  if (error) { console.error(`aggregate: ${error}`); return 64; }
  const recordsDir = path.resolve(cwd, opts.records ?? path.join(root, DEFAULT_RECORDS));
  const templatePath = path.resolve(cwd, opts.template ?? path.join(root, TEMPLATE_PATH));
  const out = path.resolve(cwd, opts.out ?? path.join('.artifacts', 'qual', `a11y-manual-${opts.sha}.json`));
  if (!fs.existsSync(recordsDir) || !fs.statSync(recordsDir).isDirectory()) {
    console.error(`aggregate: records directory ${recordsDir} does not exist`);
    return 64;
  }
  let template;
  try { template = JSON.parse(fs.readFileSync(templatePath, 'utf8')); }
  catch (e) { console.error(`aggregate: cannot read template ${templatePath}: ${e.message}`); return 64; }
  if (!Array.isArray(template.rows)) { console.error(`aggregate: template ${templatePath} has no rows[]`); return 64; }

  const schema = JSON.parse(fs.readFileSync(SCHEMA_PATH, 'utf8'));
  const result = aggregate({
    sha: opts.sha, rows: template.rows, records: readRecords(recordsDir), schema, ai: await aiSubjects(root),
  });
  const summary = {
    sha: result.sha, generatedAt: result.generatedAt,
    template: path.relative(root, templatePath).split(path.sep).join('/'),
    recordsDir: path.relative(root, recordsDir).split(path.sep).join('/'),
    ...Object.fromEntries(Object.entries(result).filter(([k]) => k !== 'sha' && k !== 'generatedAt')),
  };
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, `${JSON.stringify(summary, null, 2)}\n`);

  for (const i of result.invalid) for (const e of i.errors) console.error(`aggregate: INVALID ${i.record}: ${e}`);
  for (const f of result.failures) console.error(`aggregate: FAIL ${f.record} (${f.subject} ${f.pass} ${f.at})`);
  for (const m of result.minimums.filter((x) => !x.ok)) console.error(`aggregate: MINIMUM ${m.id} not met: need ${m.need}, have ${JSON.stringify(m.have)}`);
  console.log(`aggregate: ${result.verdict} — ${result.passed}/${result.required} required rows passed, ${result.failed} failed, `
    + `${result.missing.length} missing, ${result.invalid.length} invalid, ${result.excluded.length} excluded (other SHA); sha ${opts.sha}; wrote ${path.relative(cwd, out)}`);
  return result.verdict === 'pass' ? 0 : 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).then((code) => { process.exitCode = code; }, (err) => {
    console.error(`aggregate: ${err?.stack ?? err}`);
    process.exitCode = 1;
  });
}
