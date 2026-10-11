#!/usr/bin/env node
/* REQ-PLAT-11 (REQ-FIN-31 producer, wired by FIN-B B3-9 / REQ-FIN-22):
   builds pack-record.json { <package name>: { file, integrity } } for
   plat:package:pack from the `npm pack --json` reports of that job.

     node ci/plat/pack-record.mjs --pack-dir .artifacts/pack \
       --out "$AURAGLASS_EVIDENCE_DIR/pack-record.json" <npm-pack-report.json>...

   Fails closed (exit 1) when a report is not npm's JSON array, when an entry
   has no name / filename / sha512 integrity, when a packed file is missing or
   its sha512 differs from what npm reported, when a package name repeats, or
   when <pack-dir> holds a .tgz no report accounts for (plat:publish:npm
   publishes every .tgz in that dir, so each one must be recorded). */
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';

const argv = process.argv.slice(2);
const opt = (n) => {
  const i = argv.indexOf(`--${n}`);
  if (i < 0) return null;
  const v = argv[i + 1];
  argv.splice(i, 2);
  return v ?? null;
};
const packDir = opt('pack-dir');
const out = opt('out');
const reports = argv;
if (!packDir || !out || reports.length === 0) {
  console.error('usage: pack-record.mjs --pack-dir <dir> --out <pack-record.json> <npm-pack-report.json>...');
  process.exit(2);
}

const fail = (msg) => {
  console.error(`pack-record: ${msg}`);
  process.exit(1);
};
const sha512 = (f) => 'sha512-' + createHash('sha512').update(readFileSync(f)).digest('base64');

const record = {};
for (const report of reports) {
  if (!existsSync(report)) fail(`${report}: npm pack --json report missing`);
  let entries;
  try {
    entries = JSON.parse(readFileSync(report, 'utf8'));
  } catch (e) {
    fail(`${report}: not npm pack --json output (${e.message})`);
  }
  if (!Array.isArray(entries) || entries.length === 0) fail(`${report}: npm pack --json reported no package`);
  for (const e of entries) {
    const { name, filename, integrity } = e ?? {};
    if (typeof name !== 'string' || !name) fail(`${report}: entry without a package name`);
    if (typeof filename !== 'string' || !filename) fail(`${report}: ${name} has no filename`);
    if (typeof integrity !== 'string' || !integrity.startsWith('sha512-')) fail(`${report}: ${name} has no sha512 integrity`);
    if (record[name]) fail(`${name} packed twice (${record[name].file}, ${filename})`);
    const file = join(packDir, basename(filename));
    if (!existsSync(file)) fail(`${name}: ${file} not found in ${packDir}`);
    const got = sha512(file);
    if (got !== integrity) fail(`${name}: ${file} sha512 ${got} != npm pack integrity ${integrity}`);
    record[name] = { file, integrity };
  }
}

const recorded = new Set(Object.values(record).map((r) => basename(r.file)));
const stray = readdirSync(packDir).filter((f) => f.endsWith('.tgz') && !recorded.has(f));
if (stray.length) fail(`${packDir} holds tarballs no npm pack report records: ${stray.join(', ')}`);

writeFileSync(out, JSON.stringify(record, null, 2) + '\n');
console.log(`pack-record: ${Object.keys(record).length} tarball(s) -> ${out}`);
