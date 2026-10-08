// tests/capability/ledger-schema.test.ts — REQ-SURF-179/180.
// The ledger validates against capability-ledger.schema.json (embedded subset
// checker in the verifier) and carries 58 capability + 13 rejected rows.
import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

const ROOT = join(__dirname, '../..');
const LEDGER = join(ROOT, 'docs/auraglass-5/capability-ledger.json');
const SCHEMA = join(ROOT, 'docs/auraglass-5/capability-ledger.schema.json');

function checkSchema(schema: any, value: any, path: string, errs: string[]) {
  if (schema.type) {
    const ok =
      (schema.type === 'object' && value && typeof value === 'object' && !Array.isArray(value)) ||
      (schema.type === 'array' && Array.isArray(value)) ||
      (schema.type === 'string' && typeof value === 'string') ||
      (schema.type === 'integer' && Number.isInteger(value)) ||
      (schema.type === 'boolean' && typeof value === 'boolean');
    if (!ok) { errs.push(`${path}: expected ${schema.type}`); return; }
  }
  if (schema.enum && !schema.enum.includes(value)) errs.push(`${path}: ${value} not in enum`);
  if (schema.pattern && !(typeof value === 'string' && new RegExp(schema.pattern).test(value))) {
    errs.push(`${path}: ${value} fails ${schema.pattern}`);
  }
  if (schema.type === 'object' && value && typeof value === 'object') {
    for (const k of schema.required ?? []) if (!(k in value)) errs.push(`${path}: missing ${k}`);
    if (schema.additionalProperties === false) {
      const allowed = new Set(Object.keys(schema.properties ?? {}));
      for (const k of Object.keys(value)) if (!allowed.has(k)) errs.push(`${path}: unknown ${k}`);
    }
    for (const [k, sub] of Object.entries(schema.properties ?? {})) {
      if (k in value) checkSchema(sub, value[k], `${path}.${k}`, errs);
    }
  }
  if (schema.type === 'array' && Array.isArray(value)) {
    value.forEach((it, i) => checkSchema(schema.items ?? true, it, `${path}[${i}]`, errs));
  }
}

const ledger = JSON.parse(readFileSync(LEDGER, 'utf8'));
const schema = JSON.parse(readFileSync(SCHEMA, 'utf8'));

describe('capability ledger schema', () => {
  it('every row validates against the schema', () => {
    const errs: string[] = [];
    checkSchema(schema, ledger, '$', errs);
    expect(errs).toEqual([]);
  });
  it('has 58 capability + 13 rejected rows', () => {
    const live = ledger.rows.filter((r: any) => r.status !== 'rejected');
    const rejected = ledger.rows.filter((r: any) => r.status === 'rejected');
    expect(live).toHaveLength(58);
    expect(rejected).toHaveLength(13);
  });
  it('ids are unique and match X-(R)?NN', () => {
    const ids = ledger.rows.map((r: any) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^X-(R)?\d{2}$/);
  });
  it('the verifier exits 0 on the committed ledger', () => {
    const r = spawnSync(process.execPath, [join(ROOT, 'scripts/surf/verify-capability-ledger.mjs')], { encoding: 'utf8' });
    expect(r.status).toBe(0);
  });
});
