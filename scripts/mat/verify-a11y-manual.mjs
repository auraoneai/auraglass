#!/usr/bin/env node
/* REQ-FIN-110 (C-16) / REQ-MAT-66 / REQ-QUAL-72 (was MAT-316/318/324):
   validates every SrRecord JSON under tests/a11y/manual/records (or [dir])
   against the single SrRecord schema.

   Usage: node scripts/mat/verify-a11y-manual.mjs [--sha <sha>] [dir]

   Exit 1 when: the record set is empty or [dir] does not exist; --sha is given
   without a value; a record fails the schema; a record's sha != --sha; a
   record's file is not at <stream>/<subject>-<at>.json (motion passes:
   <stream>/<subject>-<at>-motion.json, so they do not collide with the SR pass
   of the same subject/AT); two records share (subject, at, pass).
   Prints the total count and a per-stream count.

   Schema validation is an in-file validator for exactly the keywords the
   schema uses (ajv is not a direct dependency on next; FIN-H does not own
   package.json). Any other keyword in the schema is a hard error, so the
   validator cannot silently ignore a constraint. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
// The one SrRecord schema. C-16 (contract/v1.2-final, FIN-463) moves it to
// contracts/schemas/sr-record.schema.json; this constant and the deleted
// tests/ copy are the only change needed once that merges.
export const SCHEMA_PATH = path.join(REPO, 'tests/a11y/manual/sr-record.schema.json');
const DEFAULT_DIR = 'tests/a11y/manual/records';

const ANNOTATIONS = new Set(['$schema', '$id', 'title', 'description']);
const KEYWORDS = new Set([
  'type', 'enum', 'const', 'pattern', 'minLength', 'minimum', 'minItems', 'format',
  'required', 'properties', 'additionalProperties', 'items', 'allOf', 'anyOf', 'if', 'then',
]);

function typeOf(v) {
  if (v === null) return 'null';
  if (Array.isArray(v)) return 'array';
  if (typeof v === 'number') return Number.isInteger(v) ? 'integer' : 'number';
  return typeof v;
}

function typeMatches(want, v) {
  const t = typeOf(v);
  return want === t || (want === 'number' && t === 'integer');
}

function isIsoDate(s) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return false;
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  return d.getUTCFullYear() === +m[1] && d.getUTCMonth() === +m[2] - 1 && d.getUTCDate() === +m[3];
}

/** Returns a list of "<pointer>: <message>" errors for value against schema. */
export function validate(schema, value, at = '') {
  const errs = [];
  const where = at || '(root)';
  for (const k of Object.keys(schema)) {
    if (!KEYWORDS.has(k) && !ANNOTATIONS.has(k)) throw new Error(`schema keyword "${k}" at ${where} is not supported by the verifier`);
  }
  if (schema.type !== undefined) {
    const types = Array.isArray(schema.type) ? schema.type : [schema.type];
    if (!types.some((t) => typeMatches(t, value))) {
      errs.push(`${where}: expected ${types.join('|')}, got ${typeOf(value)}`);
      return errs; // later keywords assume the type
    }
  }
  if (schema.enum && !schema.enum.some((e) => e === value)) errs.push(`${where}: ${JSON.stringify(value)} not in ${schema.enum.join('|')}`);
  if ('const' in schema && schema.const !== value) errs.push(`${where}: ${JSON.stringify(value)} !== ${JSON.stringify(schema.const)}`);
  if (typeof value === 'string') {
    if (schema.pattern && !new RegExp(schema.pattern, 'u').test(value)) errs.push(`${where}: "${value}" does not match ${schema.pattern}`);
    if (schema.minLength !== undefined && [...value].length < schema.minLength) errs.push(`${where}: shorter than ${schema.minLength}`);
    if (schema.format !== undefined) {
      if (schema.format !== 'date') throw new Error(`schema format "${schema.format}" at ${where} is not supported by the verifier`);
      if (!isIsoDate(value)) errs.push(`${where}: "${value}" is not an ISO date (YYYY-MM-DD)`);
    }
  }
  if (typeof value === 'number' && schema.minimum !== undefined && value < schema.minimum) errs.push(`${where}: ${value} < ${schema.minimum}`);
  if (Array.isArray(value)) {
    if (schema.minItems !== undefined && value.length < schema.minItems) errs.push(`${where}: fewer than ${schema.minItems} items`);
    if (schema.items) value.forEach((v, i) => errs.push(...validate(schema.items, v, `${at}/${i}`)));
  }
  if (typeOf(value) === 'object') {
    for (const k of schema.required ?? []) {
      if (!(k in value)) errs.push(`${where}: missing required "${k}"`);
    }
    const props = schema.properties ?? {};
    for (const [k, v] of Object.entries(value)) {
      if (k in props) errs.push(...validate(props[k], v, `${at}/${k}`));
      else if (schema.additionalProperties === false) errs.push(`${where}: unexpected property "${k}"`);
    }
  }
  for (const sub of schema.allOf ?? []) errs.push(...validate(sub, value, at));
  if (schema.anyOf && !schema.anyOf.some((sub) => validate(sub, value, at).length === 0)) {
    errs.push(`${where}: matches none of anyOf`);
  }
  if (schema.if && schema.then && validate(schema.if, value, at).length === 0) errs.push(...validate(schema.then, value, at));
  return errs;
}

function walk(d) {
  return fs.readdirSync(d, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
}

/** Expected file name for a record (relative to its stream directory). */
export function expectedName(rec) {
  return `${rec.subject}-${rec.at}${rec.pass === 'motion' ? '-motion' : ''}.json`;
}

function main(argv) {
  const failures = [];
  let wantSha = null;
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--sha') {
      const v = argv[i + 1];
      if (v === undefined || v.startsWith('--') || v === '') {
        console.error('FAIL --sha requires a value');
        return 1;
      }
      wantSha = v;
      i++;
    } else if (a.startsWith('--')) {
      console.error(`FAIL unknown option ${a}`);
      return 1;
    } else positional.push(a);
  }
  if (positional.length > 1) {
    console.error(`FAIL expected at most one records directory, got ${positional.join(' ')}`);
    return 1;
  }
  const dir = positional[0] ?? DEFAULT_DIR;
  const schema = JSON.parse(fs.readFileSync(SCHEMA_PATH, 'utf8'));

  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
    console.error(`FAIL records directory ${dir} does not exist`);
    return 1;
  }
  const files = walk(dir).filter((f) => f.endsWith('.json')).sort();
  if (!files.length) failures.push(`no records found under ${dir}`);

  const seen = new Map();
  const byStream = { mat: 0, cmp: 0, surf: 0 };
  for (const f of files) {
    let rec;
    try { rec = JSON.parse(fs.readFileSync(f, 'utf8')); }
    catch (e) { failures.push(`${f}: invalid JSON: ${e.message}`); continue; }
    const errs = validate(schema, rec);
    for (const e of errs) failures.push(`${f}: ${e}`);
    if (typeOf(rec) !== 'object') continue;
    if (wantSha && rec.sha !== wantSha) failures.push(`${f}: sha ${rec.sha} != ${wantSha}`);
    const parent = path.basename(path.dirname(f));
    if (parent !== rec.stream || path.basename(f) !== expectedName(rec)) {
      failures.push(`${f}: must be at <records>/${rec.stream}/${expectedName(rec)}`);
    }
    const key = `${rec.subject}|${rec.at}|${rec.pass}`;
    if (seen.has(key)) failures.push(`${f}: duplicate (subject, at, pass) = (${rec.subject}, ${rec.at}, ${rec.pass}); first in ${seen.get(key)}`);
    else seen.set(key, f);
    if (errs.length === 0 && rec.stream in byStream) byStream[rec.stream]++;
  }

  for (const f of failures) console.error(`FAIL ${f}`);
  const counts = Object.entries(byStream).map(([s, n]) => `${s}=${n}`).join(' ');
  console.log(`a11y manual records: ${files.length} total, ${failures.length ? 'INVALID' : 'valid'}; per stream (schema-valid): ${counts}${wantSha ? `; sha ${wantSha}` : ''}`);
  return failures.length ? 1 : 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2));
}
