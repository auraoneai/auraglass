/** @jest-environment node */
/* REQ-QUAL-11 (FIN-449): the shared determinism init script. Run exactly as Playwright runs it —
   serialised with Function#toString and evaluated in a fresh realm — so a closure over module scope
   (which addInitScript would silently drop) fails here. */
import { describe, expect, it } from '@jest/globals';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import vm from 'node:vm';
import { DEFAULT_SEED, FIXED_EPOCH_ISO, FIXED_EPOCH_MS, determinismInit } from '../../certification/lanes/_fixtures/determinism-init';

const ROOT = join(__dirname, '..', '..');

function realm(opts = { epochMs: FIXED_EPOCH_MS, seed: DEFAULT_SEED }) {
  const ctx = vm.createContext({});
  vm.runInContext(`(${determinismInit.toString()})(${JSON.stringify(opts)});`, ctx);
  return (code: string): unknown => vm.runInContext(code, ctx);
}

describe('determinism init (REQ-QUAL-11)', () => {
  it('freezes Date.now and new Date() at 2026-03-02T09:30:00Z', () => {
    const run = realm();
    expect(FIXED_EPOCH_ISO).toBe('2026-03-02T09:30:00Z');
    expect(run('Date.now()')).toBe(Date.parse('2026-03-02T09:30:00Z'));
    expect(run('new Date().toISOString()')).toBe('2026-03-02T09:30:00.000Z');
    expect(run('(() => { const a = Date.now(); for (let i = 0; i < 1e5; i++); return Date.now() - a; })()')).toBe(0);
  });

  it('keeps explicit dates, Date statics and instanceof working', () => {
    const run = realm();
    expect(run("new Date('2020-01-01T00:00:00Z').getTime()")).toBe(Date.UTC(2020, 0, 1));
    expect(run('new Date(0).getTime()')).toBe(0);
    expect(run('new Date(2021, 5, 1) instanceof Date')).toBe(true);
    expect(run("Date.parse('2026-03-02T09:30:00Z')")).toBe(FIXED_EPOCH_MS);
    expect(run('Date.UTC(2026, 2, 2, 9, 30)')).toBe(FIXED_EPOCH_MS);
    expect(run('typeof Date()')).toBe('string');
  });

  it('seeds Math.random: same seed → same stream in [0, 1); other seed → different stream', () => {
    const draw = (seed: number) => realm({ epochMs: FIXED_EPOCH_MS, seed })('Array.from({ length: 8 }, () => Math.random())') as number[];
    const a = draw(DEFAULT_SEED);
    expect(draw(DEFAULT_SEED)).toEqual(a);
    expect(draw(DEFAULT_SEED + 1)).not.toEqual(a);
    expect(a.every((x) => x >= 0 && x < 1)).toBe(true);
    expect(new Set(a).size).toBe(a.length);
  });

  it('is idempotent when the init script runs twice in one page', () => {
    const run = realm();
    const first = run('Math.random()');
    run(`(${determinismInit.toString()})(${JSON.stringify({ epochMs: 0, seed: 1 })});`);
    expect(run('Date.now()')).toBe(FIXED_EPOCH_MS);
    expect(run('Math.random()')).not.toBe(first);
  });

  it('the shared lane fixture installs it through page.addInitScript', () => {
    const walk = (d: string): string[] => readdirSync(d).flatMap((n) => (statSync(join(d, n)).isDirectory() ? walk(join(d, n)) : [join(d, n)]));
    const users = walk(join(ROOT, 'certification', 'lanes'))
      .filter((f) => /addInitScript\(\s*determinismInit/.test(readFileSync(f, 'utf8')))
      .map((f) => relative(ROOT, f));
    expect(users).toEqual([join('certification', 'lanes', '_fixtures', 'determinism.ts')]);
  });
});
