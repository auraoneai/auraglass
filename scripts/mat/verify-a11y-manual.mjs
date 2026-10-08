#!/usr/bin/env node
/* MAT-316/318/324: validates tests/a11y/manual/records/**/*.json against
   sr-record.schema.json. Rejects missing fields and, when --sha <sha> is
   passed, any record whose sha does not match the release SHA being certified.
   Usage: node scripts/mat/verify-a11y-manual.mjs [--sha <sha>] [dir]
   Exits non-zero on any invalid record. */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const argv = process.argv.slice(2);
const shaIdx = argv.indexOf('--sha');
const wantSha = shaIdx >= 0 ? argv[shaIdx + 1] : null;
const dir = argv.find((a) => !a.startsWith('--') && a !== wantSha)
  ?? 'tests/a11y/manual/records';
const SCHEMA = JSON.parse(fs.readFileSync('tests/a11y/manual/sr-record.schema.json', 'utf8'));
const CELLS = new Set(SCHEMA.properties.cell.enum);
const ATS = new Set(SCHEMA.properties.at.enum);
const REQUIRED_STEP = SCHEMA.properties.steps.items.required;

const files = fs.existsSync(dir)
  ? walk(dir).filter((f) => f.endsWith('.json'))
  : [];
function walk(d) {
  return fs.readdirSync(d, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
}

const failures = [];
if (!files.length) failures.push(`no records found under ${dir}`);
for (const f of files) {
  let rec;
  try { rec = JSON.parse(fs.readFileSync(f, 'utf8')); }
  catch (e) { failures.push(`${f}: invalid JSON: ${e.message}`); continue; }
  for (const k of SCHEMA.required) {
    if (rec[k] === undefined || rec[k] === null || rec[k] === '') failures.push(`${f}: missing ${k}`);
  }
  if (rec.sha !== undefined && wantSha && rec.sha !== wantSha) {
    failures.push(`${f}: sha ${rec.sha} != ${wantSha}`);
  }
  if (rec.sha !== undefined && !/^[0-9a-f]{7,40}$/.test(rec.sha)) failures.push(`${f}: bad sha ${rec.sha}`);
  if (rec.cell !== undefined && !CELLS.has(rec.cell)) failures.push(`${f}: bad cell ${rec.cell}`);
  if (rec.at !== undefined && !ATS.has(rec.at)) failures.push(`${f}: bad at ${rec.at}`);
  if (['SR-2', 'SR-4'].includes(rec.cell) && !rec.device) failures.push(`${f}: cell ${rec.cell} requires device`);
  const touch = rec.cell === 'SR-2' || rec.cell === 'SR-4' || /touch|ios|android|ipad|phone/i.test(rec.device ?? '');
  (rec.steps ?? []).forEach((s, i) => {
    for (const k of REQUIRED_STEP) {
      if (s[k] === undefined) failures.push(`${f}: step[${i}] missing ${k}`);
    }
    if (touch && (!s.gesture || !s.nonDragAlternative)) {
      failures.push(`${f}: step[${i}] touch record needs gesture + nonDragAlternative`);
    }
    if (s.pass !== undefined && typeof s.pass !== 'boolean') failures.push(`${f}: step[${i}].pass not boolean`);
  });
  for (const k of Object.keys(rec)) {
    if (!Object.keys(SCHEMA.properties).includes(k)) failures.push(`${f}: unexpected key ${k}`);
  }
}

for (const f of failures) console.error(`FAIL ${f}`);
if (failures.length) process.exit(1);
console.log(`a11y manual records: ${files.length} valid${wantSha ? ` (sha ${wantSha})` : ''}`);
