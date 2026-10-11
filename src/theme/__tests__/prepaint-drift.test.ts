/* REQ-MAT-59 (FIN-D D.3-35): pre-paint drift.
   1. Source drift — esbuild rebuilds prepaint.ts (+ resolve.ts, engine.ts) in
      memory through scripts/mat/build-prepaint-script.mjs and the result must
      equal the committed PREPAINT_IMPL byte for byte.
   2. Behaviour drift — the emitted body, executed against fake windows, must
      stamp exactly what the shared TypeScript sources resolve (resolvePaint +
      detectEngine) across a deterministic matrix of OS signals, capability
      signals, persisted records, app defaults and engines. */
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import {
  PREPAINT_IMPL, PREPAINT_BYTES, PREPAINT_LIMIT, PREPAINT_SPEC_LIMIT,
} from '../generated/prepaint-script';
import { resolvePaint } from '../preferences/resolve';
import { detectEngine } from '../preferences/engine';
import type { CapabilitySignals, OsSignals, PreferenceInput } from '../preferences/types';

const ROOT = join(__dirname, '..', '..', '..');
const BUILD = join(ROOT, 'scripts/mat/build-prepaint-script.mjs');
const runBuild = (mode: string): string =>
  execFileSync(process.execPath, [BUILD, mode], { cwd: ROOT, encoding: 'utf8' });

describe('prepaint source drift', () => {
  it('in-memory esbuild output equals the committed PREPAINT_IMPL', () => {
    const fresh = JSON.parse(runBuild('--print')) as { body: string; bytes: number };
    expect(fresh.body).toBe(PREPAINT_IMPL);
    expect(fresh.bytes).toBe(PREPAINT_BYTES);
    expect(PREPAINT_BYTES).toBe(Buffer.byteLength(PREPAINT_IMPL, 'utf8'));
  });

  it('--check passes on the committed generated module (gate + in-sync)', () => {
    expect(runBuild('--check')).toContain('generated module in sync');
  });

  it('enforces the ceiling and keeps the REQ-MAT-59 budget at 1536 B', () => {
    expect(PREPAINT_SPEC_LIMIT).toBe(1536);
    expect(PREPAINT_BYTES).toBeLessThanOrEqual(PREPAINT_LIMIT);
  });
});

type Prep = (w: unknown, d: Document, a: Record<string, unknown>) => void;
const loadImpl = (): Prep => {
  // Test-side evaluation of the generated artifact only; production carries no eval.
  (0, eval)(PREPAINT_IMPL);
  return (globalThis as { __agP?: Prep }).__agP!;
};

const MQ: Record<keyof OsSignals, string> = {
  forcedColors: '(forced-colors: active)',
  contrastMore: '(prefers-contrast: more)',
  reducedTransparency: '(prefers-reduced-transparency: reduce)',
  reducedMotion: '(prefers-reduced-motion: reduce)',
  schemeDark: '(prefers-color-scheme: dark)',
  coarsePointer: '(pointer: coarse)',
};
const OS_KEYS = Object.keys(MQ) as (keyof OsSignals)[];

const NAVS = [
  { brands: [{ brand: 'Chromium' }, { brand: 'Google Chrome' }], ua: '' },
  { brands: null, ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15' },
  { brands: null, ua: 'Mozilla/5.0 (X11; Linux x86_64; rv:124.0) Gecko/20100101 Firefox/124.0' },
  { brands: null, ua: 'curl/8.4.0' },
] as const;

const RECORDS: PreferenceInput[] = [
  {},
  { transparency: 'solid' },
  { transparency: 'glass', glassOpacity: 0.7, motion: 'full', allowContinuous: true },
  { contrast: 'more', scheme: 'dark', density: 'compact', tier: 'enhanced' },
  { contrast: 'less', motion: 'calm', tier: 'standard', allowContinuous: true },
  { transparency: 'system', scheme: 'system', motion: 'none', tier: 'lightweight' },
  { tier: 'auto', glassOpacity: 0.4 },
  { transparency: 'bogus', contrast: 'x', density: 'x', tier: 'x' } as unknown as PreferenceInput,
];
const DEFAULTS: PreferenceInput[] = [
  {},
  { transparency: 'tinted', allowContinuous: true },
  { scheme: 'light', density: 'compact', tier: 'standard', motion: 'calm' },
  { tier: 'enhanced', contrast: 'more' },
];

/** Deterministic PRNG so the matrix is the same on every run. */
const prng = (seed: number) => () => {
  seed = (seed * 1103515245 + 12345) & 0x7fffffff;
  return seed / 0x7fffffff;
};

const expected = (
  os: OsSignals, cap: CapabilitySignals, def: PreferenceInput, rec: PreferenceInput, nav: typeof NAVS[number],
): Record<string, string> => {
  const r = resolvePaint(os, cap, def, rec);
  const engine = detectEngine({ userAgent: nav.ua, userAgentData: nav.brands ? { brands: nav.brands } : null });
  const attrs: Record<string, string> = {
    'data-ag-transparency': r.transparency,
    'data-ag-contrast': r.contrast,
    'data-ag-motion': r.motion,
    'data-ag-scheme': r.scheme,
    'data-ag-density': r.density,
    'data-ag-engine': engine,
    style: `--ag-glass-opacity: ${r.glassOpacity};`,
  };
  if (r.allowContinuous && r.motion === 'full') attrs['data-ag-continuous'] = 'on';
  // REQ-MAT-59 tier rule: heuristic lightweight, or any persisted/app value;
  // otherwise unset. An unknown engine caps the tier at standard.
  const explicit = [rec.tier, def.tier].some((t) => t === 'standard' || t === 'enhanced' || t === 'lightweight');
  if (explicit || r.tier === 'lightweight') {
    attrs['data-ag-tier'] = engine === 'unknown' && r.tier === 'enhanced' ? 'standard' : r.tier;
  }
  return attrs;
};

describe('prepaint behaviour drift (emitted body vs shared sources)', () => {
  const impl = loadImpl();
  const rand = prng(59);
  const cases: { os: OsSignals; cap: CapabilitySignals; def: PreferenceInput; rec: PreferenceInput; nav: typeof NAVS[number] }[] = [];
  for (let i = 0; i < 2000; i += 1) {
    const os = Object.fromEntries(OS_KEYS.map((k) => [k, rand() < 0.3])) as unknown as OsSignals;
    const cap: CapabilitySignals = {
      backdropFilter: rand() < 0.85,
      saveData: rand() < 0.15,
      deviceMemory: [null, 1, 2, 4, 8][Math.floor(rand() * 5)]!,
    };
    cases.push({
      os, cap,
      def: DEFAULTS[Math.floor(rand() * DEFAULTS.length)]!,
      rec: RECORDS[Math.floor(rand() * RECORDS.length)]!,
      nav: NAVS[Math.floor(rand() * NAVS.length)]!,
    });
  }

  it('covers every engine, every record and every defaults row', () => {
    for (const nav of NAVS) expect(cases.some((c) => c.nav === nav)).toBe(true);
    for (const rec of RECORDS) expect(cases.some((c) => c.rec === rec)).toBe(true);
    for (const def of DEFAULTS) expect(cases.some((c) => c.def === def)).toBe(true);
  });

  it('stamps exactly the attributes the shared resolver and engine detector produce (2000 cases)', () => {
    const mismatches: string[] = [];
    for (const c of cases) {
      const doc = document.implementation.createHTMLDocument();
      const store: Record<string, string> = { 'ag:prefs:v1': JSON.stringify(c.rec) };
      const win = {
        matchMedia: (q: string) => ({ matches: OS_KEYS.some((k) => MQ[k] === q && c.os[k]) }),
        CSS: { supports: (p: string, v: string) => c.cap.backdropFilter && v === 'none' && /backdrop-filter$/.test(p) },
        navigator: {
          userAgent: c.nav.ua,
          userAgentData: c.nav.brands ? { brands: c.nav.brands } : undefined,
          connection: { saveData: c.cap.saveData },
          deviceMemory: c.cap.deviceMemory ?? undefined,
        },
        localStorage: { getItem: (k: string) => store[k] ?? null },
      };
      impl(win, doc, { storageKey: 'ag:prefs:v1', defaults: c.def });
      const el = doc.documentElement;
      const got = Object.fromEntries(el.getAttributeNames().map((n) => [n, el.getAttribute(n)!]));
      const want = expected(c.os, c.cap, c.def, c.rec, c.nav);
      if (JSON.stringify(Object.entries(got).sort()) !== JSON.stringify(Object.entries(want).sort())) {
        mismatches.push(JSON.stringify({ case: c, got, want }));
      }
    }
    expect(mismatches.slice(0, 3)).toEqual([]);
    expect(mismatches).toHaveLength(0);
  });
});
