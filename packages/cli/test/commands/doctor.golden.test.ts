/** PLAT-88: frozen doctor-v5 fixture deep-equal + goldens for audit deps/imports
 *  and migrate icons; perf bounds (fixture ≤5 s, 2,000-file case ≤30 s). */
import { describe, expect, it, jest } from '@jest/globals';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { runChecks } from '../../src/doctor/checks.js';
import { runV5 } from '../../src/doctor/v5.js';
import { auditCommand } from '../../src/commands/audit.js';
import { migrateCommand } from '../../src/commands/migrate.js';

const FIXTURE = 'test/fixtures/doctor-v5';
const cap = () => { const b: string[] = []; const s = jest.spyOn(process.stdout, 'write').mockImplementation(((x: unknown) => { b.push(String(x)); return true; }) as never); return { b, stop: () => s.mockRestore() }; };

describe('doctor golden', () => {
  it('frozen fixture deep-equals doctor-v5.expected.json (≤5 s)', () => {
    const t0 = Date.now();
    const expected = JSON.parse(fs.readFileSync('test/fixtures/doctor-v5.expected.json', 'utf8'));
    const actual = { checks: runChecks(FIXTURE), v5: runV5(FIXTURE) };
    /* normalize machine-dependent fields before deep-equal */
    for (const c of actual.checks) if (c.id === 'node-version') c.message = 'node <ver>';
    for (const c of expected.checks) if (c.id === 'node-version') c.message = 'node <ver>';
    expect(actual).toEqual(expected);
    expect(Date.now() - t0).toBeLessThan(5000);
  });

  it('audit deps|imports + migrate icons match their goldens byte-for-byte', async () => {
    for (const [name, fn] of [
      ['audit-deps', () => auditCommand(['deps'], { cwd: FIXTURE, json: true, silent: true })],
      ['audit-imports', () => auditCommand(['imports'], { cwd: FIXTURE, json: true, silent: true })],
      ['migrate-icons-lucide', () => migrateCommand(['icons'], { cwd: FIXTURE, from: 'lucide', json: true, silent: true })],
    ] as const) {
      const c = cap();
      try { await fn(); } finally { c.stop(); }
      const golden = fs.readFileSync(`test/fixtures/golden-${name}.json`, 'utf8');
      expect(c.b.join('')).toBe(golden);
    }
  });

  it('mui-present and radix-present are info — Coexists with AuraGlass; not required', () => {
    const checks = runChecks(FIXTURE);
    const mui = checks.find((c) => c.id === 'mui-present')!;
    const radix = checks.find((c) => c.id === 'radix-present')!;
    expect(mui.status).toBe('info');
    expect(radix.status).toBe('info');
    expect(mui.message).toBe('Coexists with AuraGlass; not required');
    expect(radix.message).toBe('Coexists with AuraGlass; not required');
    /* no check fails on the shadcn/Radix fixture */
    expect(checks.filter((c) => c.status === 'fail')).toEqual([]);
  });

  it('duplicate-react fails when >1 resolved copy exists', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'agdup-'));
    fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ dependencies: { react: '19.0.0' } }));
    fs.mkdirSync(path.join(dir, 'node_modules', 'react'), { recursive: true });
    fs.mkdirSync(path.join(dir, 'node_modules', 'other-lib', 'node_modules', 'react'), { recursive: true });
    const dup = runChecks(dir).find((c) => c.id === 'duplicate-react')!;
    expect(dup.status).toBe('fail');
  });

  it('--v5 summary buckets findings {automatic,needsReview,manual}', () => {
    const { findings, byCodemod } = runV5(FIXTURE);
    const summary = { automatic: 0, needsReview: 0, manual: 0 };
    for (const f of findings) summary[f.automation] += 1;
    expect(summary.automatic + summary.needsReview + summary.manual).toBe(findings.length);
    expect(findings.every((f) => ['automatic', 'needsReview', 'manual'].includes(f.automation))).toBe(true);
    expect(Object.keys(byCodemod).length).toBeGreaterThan(0);
  });

  it('2,000-file perf case completes under 30 s', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'agperf-'));
    fs.mkdirSync(path.join(dir, 'src'), { recursive: true });
    for (let i = 0; i < 2000; i++) {
      fs.writeFileSync(path.join(dir, 'src', `f${i}.tsx`), `export const x${i} = ${i};\n`);
    }
    const t0 = Date.now();
    runV5(dir);
    expect(Date.now() - t0).toBeLessThan(30000);
  });
});
