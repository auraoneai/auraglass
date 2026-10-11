// tests/capability/ledger-schema.test.ts — REQ-SURF-179/180.
// The ledger validates against capability-ledger.schema.json (embedded subset
// checker in the verifier), carries 58 capability + 13 rejected rows, every
// row carries all 20 archived fields (EXP §4.7), and the capability text is
// carried verbatim from the archived EXP PRD §4.2 / §4.4 (owner column aside).
import { describe, expect, it } from '@jest/globals';
import { mkdtempSync, readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const ROOT = join(__dirname, '../..');
const SCRIPT = join(ROOT, 'scripts/surf/verify-capability-ledger.mjs');
const LEDGER = join(ROOT, 'docs/auraglass-5/capability-ledger.json');
const SCHEMA = join(ROOT, 'docs/auraglass-5/capability-ledger.schema.json');
const EXP = join(ROOT, 'docs/auraglass-5/archive/v1-19-prd/prd/AURAGLASS_COMPONENT_EXPANSION_PRD.md');

// The 20 row fields of the archived EXP §4.7 CapabilityRow interface.
const ARCHIVED_FIELDS = [
  'id', 'capability', 'area', 'priority', 'owner', 'collaborators', 'form', 'names', 'subpath',
  'release', 'evidence', 'findings', 'rubric', 'exportDelta', 'budgetKb', 'reqRefs', 'status',
  'artifacts', 'demand', 'stories',
];

function typeOk(type: string, value: unknown) {
  switch (type) {
    case 'object': return value !== null && typeof value === 'object' && !Array.isArray(value);
    case 'array': return Array.isArray(value);
    case 'string': return typeof value === 'string';
    case 'integer': return Number.isInteger(value);
    case 'boolean': return typeof value === 'boolean';
    case 'null': return value === null;
    default: return false;
  }
}

function checkSchema(schema: any, value: any, path: string, errs: string[]) {
  if (schema.type) {
    const types: string[] = Array.isArray(schema.type) ? schema.type : [schema.type];
    if (!types.some((t) => typeOk(t, value))) { errs.push(`${path}: expected ${types.join('|')}`); return; }
    if (value === null) return;
  }
  if (schema.enum && !schema.enum.includes(value)) errs.push(`${path}: ${value} not in enum`);
  if (schema.pattern && !(typeof value === 'string' && new RegExp(schema.pattern).test(value))) {
    errs.push(`${path}: ${value} fails ${schema.pattern}`);
  }
  if (typeOk('object', value)) {
    for (const k of schema.required ?? []) if (!(k in value)) errs.push(`${path}: missing ${k}`);
    if (schema.additionalProperties === false) {
      const allowed = new Set(Object.keys(schema.properties ?? {}));
      for (const k of Object.keys(value)) if (!allowed.has(k)) errs.push(`${path}: unknown ${k}`);
    }
    for (const [k, sub] of Object.entries(schema.properties ?? {})) {
      if (k in value) checkSchema(sub, value[k], `${path}.${k}`, errs);
    }
  }
  if (Array.isArray(value)) {
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
  it('all 20 archived fields are present on all 71 rows', () => {
    expect(ledger.rows).toHaveLength(71);
    const missing: string[] = [];
    for (const r of ledger.rows) for (const f of ARCHIVED_FIELDS) if (!(f in r)) missing.push(`${r.id}.${f}`);
    expect(missing).toEqual([]);
  });
  it('schema requires all 20 archived fields', () => {
    expect([...schema.properties.rows.items.required].sort()).toEqual([...ARCHIVED_FIELDS].sort());
  });
  it('every row with an export form names its subpath', () => {
    const bad = ledger.rows.filter((r: any) => r.form.includes('export') && typeof r.subpath !== 'string');
    expect(bad.map((r: any) => r.id)).toEqual([]);
  });
  it('the verifier exits 0 on the committed ledger', () => {
    const r = spawnSync(process.execPath, [SCRIPT], { encoding: 'utf8' });
    expect(`${r.stdout}${r.stderr}`).toContain('capability-ledger: ok');
    expect(r.status).toBe(0);
  });
  it('a row with budgetKb deleted exits 1 naming the row', () => {
    const dir = mkdtempSync(join(tmpdir(), 'ledger-schema-'));
    const copy = JSON.parse(JSON.stringify(ledger));
    const row = copy.rows.find((r: any) => r.id === 'X-14');
    delete row.budgetKb;
    writeFileSync(join(dir, 'capability-ledger.json'), JSON.stringify(copy));
    copyFileSync(SCHEMA, join(dir, 'capability-ledger.schema.json'));
    const r = spawnSync(process.execPath, [SCRIPT, '--ledger', join(dir, 'capability-ledger.json')], { encoding: 'utf8', cwd: ROOT });
    expect(r.status).toBe(1);
    expect(r.stderr).toMatch(/X-14: missing "budgetKb"/);
  });
  it('a row whose budgetKb drifts from docs/size-budgets.json exits 1 naming the row', () => {
    const dir = mkdtempSync(join(tmpdir(), 'ledger-budget-'));
    const copy = JSON.parse(JSON.stringify(ledger));
    copy.rows.find((r: any) => r.id === 'X-05').budgetKb = 99;
    writeFileSync(join(dir, 'capability-ledger.json'), JSON.stringify(copy));
    const r = spawnSync(process.execPath, [SCRIPT, '--ledger', join(dir, 'capability-ledger.json')], { encoding: 'utf8', cwd: ROOT });
    expect(r.status).toBe(1);
    expect(r.stderr).toMatch(/X-05: budgetKb 99 != 5 derived from docs\/size-budgets\.json/);
  });
});

describe('rows are verbatim from the archived EXP PRD (owner column aside)', () => {
  const lines = readFileSync(EXP, 'utf8').split('\n');
  it('X-01..X-58 capability and priority equal EXP §4.2', () => {
    const diffs: string[] = [];
    let seen = 0;
    for (const line of lines) {
      const m = /^\| (X-\d\d) \| (.*?) \| (P\d) \| /.exec(line);
      if (!m) continue;
      seen++;
      const row = ledger.rows.find((r: any) => r.id === m[1]);
      if (!row) { diffs.push(`${m[1]}: missing`); continue; }
      if (row.capability !== m[2]) diffs.push(`${m[1]}: capability ${JSON.stringify(row.capability)} != ${JSON.stringify(m[2])}`);
      if (row.priority !== m[3]) diffs.push(`${m[1]}: priority ${row.priority} != ${m[3]}`);
    }
    expect(seen).toBe(58);
    expect(diffs).toEqual([]);
  });
  it('X-R01..X-R13 carry the EXP §4.4 family and its fails/reason', () => {
    const start = lines.findIndex((l) => l.startsWith('### 4.4'));
    const end = lines.findIndex((l, i) => i > start && l.startsWith('### 4.5'));
    const fam = lines.slice(start, end)
      .map((l) => /^\| (.+?) \| (.+?) \| (.+?) \|$/.exec(l))
      .filter((m): m is RegExpExecArray => !!m && m[1] !== 'Family (4.x evidence)' && !/^-+$/.test(m[1]!));
    expect(fam).toHaveLength(13);
    const diffs: string[] = [];
    fam.forEach((m, i) => {
      const id = `X-R${String(i + 1).padStart(2, '0')}`;
      const row = ledger.rows.find((r: any) => r.id === id);
      if (row.capability !== m[1]) diffs.push(`${id}: capability`);
      if (!row.evidence.includes(`exception:fails ${m[2]}: ${m[3]}`)) diffs.push(`${id}: reason`);
    });
    expect(diffs).toEqual([]);
  });
});
