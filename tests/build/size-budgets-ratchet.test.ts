/* @jest-environment node */
/* PLAT-284/285 / REQ-PLAT-76: size-budget gate behaviour on fixture trees —
   a broken import fails, a raise without the trailer fails, a not-yet-public
   subpath is pending only when a producer is named, compat rows are derived
   (target + 2048 B) and reported separately. */
import { describe, expect, it } from '@jest/globals';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { loadFragments } from '../../src/contracts/load-fragments.mjs';
import { ratchetProblems as ratchet } from '../../scripts/ci/size-budget-rules.mjs';
import { ROOT } from './helpers';

type Row = { id: string; import: string; limitBytes: number; kind: 'js' | 'css' };

/* A minimal built tree: one public entry ('.') emitting `tiny`, and a PLAT
   size-budget fragment holding the rows under test. */
function fixture(rows: Row[], files: Record<string, string> = {}): string {
  const dir = mkdtempSync(join(tmpdir(), 'ag-size-'));
  const write = (rel: string, text: string) => { mkdirSync(dirname(join(dir, rel)), { recursive: true }); writeFileSync(join(dir, rel), text); };
  write('build/exports.manifest.json', JSON.stringify({
    version: 1,
    entries: [
      { subpath: '.', source: 'src/index.ts', types: 'dist/index.d.ts', default: 'dist/index.js', css: 'dist/styles.css' },
      { subpath: './tailwind.css', source: 'build:css', default: 'dist/tailwind.css', css: 'dist/tailwind.css' },
    ],
  }));
  write('src/index.ts', 'export const tiny = 1;\n');
  write('dist/index.js', 'export const tiny = 1;\nexport const other = "x".repeat(10);\n');
  write('fragments/size-budgets/plat.ts', `export default ${JSON.stringify(rows)};\n`);
  for (const [rel, text] of Object.entries(files)) write(rel, text);
  return dir;
}

function verify(dir: string) {
  const out = spawnSync(process.execPath, [join(ROOT, 'scripts/ci/verify-size-budgets.mjs')], {
    cwd: dir, encoding: 'utf8', env: { ...process.env, AG_SIZE_ROOT: dir },
  });
  const aggPath = join(dir, 'docs', 'size-budgets.json');
  const agg = existsSync(aggPath) ? JSON.parse(readFileSync(aggPath, 'utf8')) : null;
  return { status: out.status, text: `${out.stdout}${out.stderr}`, agg };
}

const ok: Row = { id: 'fixture:tiny', import: "{ tiny } from 'aura-glass'", limitBytes: 4096, kind: 'js' };

describe('size-budgets gate (REQ-PLAT-76)', () => {
  it('measures a public import, writes its metafile, and passes', () => {
    const dir = fixture([ok]);
    try {
      const r = verify(dir);
      expect(r.status).toBe(0);
      const row = r.agg.rows.find((x: { id: string }) => x.id === ok.id);
      expect(row.status).toBe('pass');
      expect(row.measuredBytes).toBeGreaterThan(0);
      const meta = JSON.parse(readFileSync(join(dir, '.artifacts/plat/size/fixture_tiny.json'), 'utf8'));
      expect(Object.keys(meta.inputs).some((p) => p.endsWith('dist/index.js'))).toBe(true);
    } finally { rmSync(dir, { recursive: true, force: true }); }
  }, 60_000);

  it('a row importing a missing export fails (bundle failure is not pending)', () => {
    const dir = fixture([ok, { id: 'fixture:broken', import: "{ doesNotExist } from 'aura-glass'", limitBytes: 4096, kind: 'js' }]);
    try {
      const r = verify(dir);
      expect(r.status).toBe(1);
      expect(r.text).toContain('fixture:broken: bundle failed');
      expect(r.agg.rows.find((x: { id: string }) => x.id === 'fixture:broken').status).toBe('fail');
    } finally { rmSync(dir, { recursive: true, force: true }); }
  }, 60_000);

  it('a row naming a non-public subpath fails unless a producer is recorded for it', () => {
    const dir = fixture([
      { id: 'fixture:nosuch', import: "{ x } from 'aura-glass/nosuch'", limitBytes: 512, kind: 'js' },
      { id: 'plat:cn', import: "export { cn } from 'aura-glass/internal'", limitBytes: 512, kind: 'js' },
    ]);
    try {
      const r = verify(dir);
      expect(r.status).toBe(1);
      expect(r.text).toContain("fixture:nosuch: 'aura-glass/nosuch' is not a public entry");
      const cn = r.agg.rows.find((x: { id: string }) => x.id === 'plat:cn');
      expect(cn.status).toBe('pending');
      expect(cn.measuredBytes).toBeNull();
      expect(cn.pendingOn).toMatch(/FIN-A/);
    } finally { rmSync(dir, { recursive: true, force: true }); }
  }, 60_000);

  it('a manifest css asset missing from dist fails; present css is measured', () => {
    const dir = fixture([{ id: 'plat:tailwind-bridge', import: 'dist/tailwind.css', limitBytes: 6144, kind: 'css' }]);
    try {
      const missing = verify(dir);
      expect(missing.status).toBe(1);
      expect(missing.text).toContain('plat:tailwind-bridge: manifest css asset dist/tailwind.css missing from dist');
      writeFileSync(join(dir, 'dist/tailwind.css'), '.bg-canvas{background-color:var(--ag-color-canvas)}\n');
      const present = verify(dir);
      expect(present.status).toBe(0);
      expect(present.agg.rows[0].measuredBytes).toBeGreaterThan(0);
    } finally { rmSync(dir, { recursive: true, force: true }); }
  }, 60_000);

  it('raising a PLAT row above its floor without the trailer fails end to end', () => {
    const dir = fixture([{ id: 'plat:tailwind-bridge', import: 'dist/tailwind.css', limitBytes: 9000, kind: 'css' }], {
      'dist/tailwind.css': '.a{color:red}\n',
    });
    try {
      const r = verify(dir);
      expect(r.status).toBe(1);
      expect(r.text).toContain("without 'Perf-Budget-Raise: plat:tailwind-bridge' in an MR commit message");
      expect(r.text).toContain('without a docs/size-budgets.changelog.md row');
    } finally { rmSync(dir, { recursive: true, force: true }); }
  }, 60_000);

  it('compat rows are reported separately from the rows list', () => {
    const dir = fixture([ok, { id: 'plat:compat-Tiny', import: "export { tiny } from 'aura-glass'", limitBytes: 4096, kind: 'js' }]);
    try {
      const r = verify(dir);
      expect(r.status).toBe(0);
      expect(r.agg.rows.map((x: { id: string }) => x.id)).toEqual([ok.id]);
      expect(r.agg.compat.map((x: { id: string }) => x.id)).toEqual(['plat:compat-Tiny']);
      expect(r.text).toMatch(/compat 1\/1 rows within limits/);
    } finally { rmSync(dir, { recursive: true, force: true }); }
  }, 60_000);

  it('expiring baseline: covers a foreign failing row as baselined; stale, PLAT and malformed rows fail', () => {
    const broken: Row = { id: 'Steps', import: "{ Steps } from 'aura-glass'", limitBytes: 1500, kind: 'js' };
    const baseline = (rows: unknown[]) => ({ 'scripts/integration/baselines/size-budgets.json': JSON.stringify(rows) });
    const entry = { row: 'Steps', owner: 'CMP', reqFin: 'REQ-FIN-70', expires: 'RC-1' };
    const covered = fixture([ok, broken], baseline([entry]));
    const stale = fixture([ok], baseline([{ ...entry, row: ok.id }]));
    const plat = fixture([ok, { id: 'plat:cn', import: "{ nope } from 'aura-glass'", limitBytes: 512, kind: 'js' }],
      baseline([{ ...entry, row: 'plat:cn', owner: 'PLAT' }]));
    const malformed = fixture([ok, broken], baseline([{ ...entry, expires: 'GA' }]));
    try {
      const c = verify(covered);
      expect(c.status).toBe(0);
      expect(c.agg.rows.find((x: { id: string }) => x.id === 'Steps').status).toBe('baselined');
      expect(c.text).toMatch(/1 baselined/);
      const s = verify(stale);
      expect(s.status).toBe(1);
      expect(s.text).toContain('stale row fixture:tiny (now passes');
      const p = verify(plat);
      expect(p.status).toBe(1);
      expect(p.text).toContain('plat:cn is a PLAT floor row and cannot be baselined');
      const m = verify(malformed);
      expect(m.status).toBe(1);
      expect(m.text).toContain('malformed row');
    } finally {
      for (const d of [covered, stale, plat, malformed]) rmSync(d, { recursive: true, force: true });
    }
  }, 120_000);

  it('ratchet: raise-without-trailer fails; trailer+changelog pass; stricter always passes', () => {
    const base = new Map([['plat:cn', { limitBytes: 512 }], ['Button', { limitBytes: 10000 }]]);
    const cn: Row = { id: 'plat:cn', import: "export { cn } from 'aura-glass/internal'", limitBytes: 900, kind: 'js' };
    expect(ratchet([cn], base, '', '')).toHaveLength(2);
    expect(ratchet([cn], base, 'feat: x\n\nPerf-Budget-Raise: plat:cn', '| 2026-10-10 | Perf-Budget-Raise: plat:cn |')).toEqual([]);
    /* trailer alone (no changelog row) is not enough */
    expect(ratchet([cn], base, 'Perf-Budget-Raise: plat:cn', '')).toHaveLength(1);
    /* looser than the PLAT floor on a fresh base still needs the trailer */
    expect(ratchet([{ ...cn, limitBytes: 700 }], new Map(), '', '').length).toBeGreaterThan(0);
    /* any stream's row looser than base needs it too */
    expect(ratchet([{ id: 'Button', import: "{ Button } from 'aura-glass'", limitBytes: 10240, kind: 'js' }], base, '', '').length).toBeGreaterThan(0);
    /* stricter rows never need the trailer */
    expect(ratchet([{ ...cn, limitBytes: 400 }], base, '', '')).toEqual([]);
  });

  it('PLAT compat rows are each target row + 2048 B, derived from deprecation compat entries', async () => {
    const budgets = (await loadFragments('size-budgets', ROOT)) as Array<{ stream: string; value: Row[] }>;
    const deps = (await loadFragments('deprecations', ROOT)) as Array<{ value: Array<{ compat?: string; replacement: string | null }> }>;
    const plat = budgets.find((f) => f.stream === 'plat')!.value;
    const others = budgets.filter((f) => f.stream !== 'plat').flatMap((f) => f.value);
    const compat = plat.filter((r) => r.id.startsWith('plat:compat-') && r.id !== 'plat:compat-globals');
    expect(compat.length).toBeGreaterThan(0);
    const withCompat = new Map(deps.flatMap((f) => f.value).filter((d) => d.compat).map((d) => [d.compat!, d]));
    for (const row of compat) {
      const name = row.id.slice('plat:compat-'.length);
      expect(row.import).toBe(`export { ${name} } from 'aura-glass/compat'`);
      const dep = withCompat.get(name);
      expect(dep).toBeDefined();
      const target = /^[A-Za-z_$][\w$]*/.exec(dep!.replacement ?? '')![0];
      const targetRow = others.find((r) => r.kind === 'js'
        && new RegExp(`\\{[^}]*\\b${target}\\b[^}]*\\}`).test(r.import)
        && (r.id.split(/[-:]/).pop() ?? '').toLowerCase().split('+').includes(target.toLowerCase()));
      expect(targetRow).toBeDefined();
      expect(row.limitBytes).toBe(targetRow!.limitBytes + 2048);
    }
  });

  it('changelog exists with the raise-ledger header', () => {
    const c = readFileSync(join(ROOT, 'docs', 'size-budgets.changelog.md'), 'utf8');
    expect(c).toContain('Perf-Budget-Raise');
    expect(c).toContain('D-26');
  });
});
