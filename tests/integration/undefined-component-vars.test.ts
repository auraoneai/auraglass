/** @jest-environment node */
/* REQ-FIN-11 (REQ-CMP-19): token-name seam between MAT and CMP/SURF.
   - the undefined-component-vars gate (CLI + pure evaluator) and its RC-1 baseline;
   - the comp tokens MAT emits for CMP (contract C-7): 9 control heights, 6 switch-track sizes;
   - the OD-19 app-shell move (tokens/sys → tokens/comp, private --_ag-app-shell-*). */
import { describe, it, expect, beforeAll } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import postcss from 'postcss';

const ROOT = join(__dirname, '../..');
const GATE = join(ROOT, 'scripts/tokens/gates/undefined-component-vars.mjs');
const BASELINE = join(ROOT, 'scripts/integration/baselines/undefined-component-vars.json');

const run = (args: string[]) => {
  try {
    return { code: 0, out: execFileSync('node', [GATE, ...args], { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' }) };
  } catch (e: any) {
    return { code: e.status ?? 1, out: String(e.stderr ?? '') + String(e.stdout ?? '') };
  }
};

type Gate = {
  evaluate: (o: {
    files: { file: string; css: string }[]; allowed: Set<string>; baseline: unknown[];
    today?: string | null; rc1Date?: string | null; atRc?: boolean;
  }) => { findings: string[]; baselined: number };
  varUses: (css: string) => { name: string; line: number }[];
  manifestVars: () => Set<string>;
  REPLACEMENTS: Record<string, string>;
};
let gate: Gate;
beforeAll(async () => { gate = (await import('../../scripts/tokens/gates/undefined-component-vars.mjs')) as unknown as Gate; });

const row = (file: string, vars: string[], extra: Record<string, unknown> = {}) =>
  ({ file, owner: 'CMP', reqFin: 'REQ-FIN-70', expires: 'RC-1', vars, ...extra });

describe('REQ-FIN-11 undefined-component-vars gate (CLI)', () => {
  it('fails a fixture using var(--ag-space-7) and prints the replacement table', () => {
    const r = run(['--file', 'tests/integration/fixtures/undef-vars.bad.css']);
    expect(r.code).toBe(1);
    expect(r.out).toContain('tests/integration/fixtures/undef-vars.bad.css:2: var(--ag-space-7) is not declared');
    expect(r.out).toContain('use --ag-space-8');
    expect(r.out).toContain('var(--ag-accent) is not declared');
    expect(r.out).toContain('use --ag-color-accent');
    expect(r.out).toContain('var(--ag-control-h-sm) is not declared');
    expect(r.out).toContain('--ag-comp-control-height-{sm,md,lg}-{compact,default,spacious}');
    expect(r.out).toContain('replacement table (REQ-FIN-11):');
    expect(r.out).toContain('--ag-focus-inner → --ag-focus-width');
    expect(r.out).toContain('--ag-color-focus-ring → --ag-focus-outer');
    expect(r.out).toContain('--ag-tint-* →');
  });

  it('exits 0 on src/**/*.css with the committed RC-1 baseline', () => {
    const r = run([]);
    expect(r.out).toMatch(/undefined-component-vars: clean \(\d+ files/);
    expect(r.code).toBe(0);
  });

  it('every baseline row names its owner, REQ-FIN, RC-1 expiry and the exact offending vars', () => {
    const rows = JSON.parse(readFileSync(BASELINE, 'utf8')) as Array<Record<string, unknown>>;
    for (const r of rows) {
      expect(r).toEqual({
        file: expect.stringMatching(/^src\/.+\.css$/), owner: expect.stringMatching(/^(MAT|CMP|SURF)$/),
        reqFin: expect.stringMatching(/^REQ-FIN-\d+$/), expires: 'RC-1', vars: expect.arrayContaining([expect.stringMatching(/^--ag-/)]),
      });
    }
  });
});

describe('REQ-FIN-11 gate evaluator', () => {
  const allowed = new Set(['--ag-space-8', '--ag-color-accent']);

  it('ignores names inside comments and reports the line of a real use', () => {
    const uses = gate.varUses('/* var(--ag-space-7) */\n.a {\n  padding: var(--ag-space-7, 4px);\n}');
    expect(uses).toEqual([{ name: '--ag-space-7', line: 3 }]);
  });

  it('a fallback does not excuse an undefined name', () => {
    const { findings } = gate.evaluate({ files: [{ file: 'src/x.css', css: '.a{padding:var(--ag-space-7, var(--ag-space-8))}' }], allowed, baseline: [] });
    expect(findings).toHaveLength(1);
    expect(findings[0]).toContain('var(--ag-space-7) is not declared');
  });

  it('a new undefined name in a baselined file fails (shrink-only per var)', () => {
    const css = '.a{padding:var(--ag-space-7);margin:var(--ag-space-9)}';
    const { findings } = gate.evaluate({ files: [{ file: 'src/x.css', css }], allowed, baseline: [row('src/x.css', ['--ag-space-7'])] });
    expect(findings).toEqual([expect.stringContaining('var(--ag-space-9) is not declared')]);
  });

  it('a row for a clean file, or a listed var no longer used, is stale', () => {
    const files = [{ file: 'src/clean.css', css: '.a{padding:var(--ag-space-8)}' }, { file: 'src/x.css', css: '.a{padding:var(--ag-space-7)}' }];
    const { findings } = gate.evaluate({
      files, allowed, baseline: [row('src/clean.css', ['--ag-space-7']), row('src/x.css', ['--ag-space-7', '--ag-space-9'])],
    });
    expect(findings).toEqual(expect.arrayContaining([
      expect.stringContaining('src/clean.css: baseline row is STALE'),
      expect.stringContaining('src/x.css: baseline var --ag-space-9 is STALE'),
    ]));
    expect(findings).toHaveLength(2);
  });

  it('a malformed or duplicate row fails', () => {
    const files = [{ file: 'src/x.css', css: '.a{padding:var(--ag-space-7)}' }];
    expect(gate.evaluate({ files, allowed, baseline: [row('src/x.css', ['--ag-space-7'], { expires: '2099-01-01' })] }).findings)
      .toEqual(expect.arrayContaining([expect.stringContaining('baseline row malformed')]));
    expect(gate.evaluate({ files, allowed, baseline: [row('src/x.css', ['--ag-space-7']), row('src/x.css', ['--ag-space-7'])] }).findings)
      .toEqual([expect.stringContaining('duplicate baseline row')]);
  });

  it('rows expire at RC-1 (an -rc.N version, or after AG_RC1_DATE)', () => {
    const files = [{ file: 'src/x.css', css: '.a{padding:var(--ag-space-7)}' }];
    const baseline = [row('src/x.css', ['--ag-space-7'])];
    expect(gate.evaluate({ files, allowed, baseline }).findings).toEqual([]);
    expect(gate.evaluate({ files, allowed, baseline, atRc: true }).findings).toEqual([expect.stringContaining('EXPIRED')]);
    expect(gate.evaluate({ files, allowed, baseline, today: '2027-02-02', rc1Date: '2027-02-01' }).findings)
      .toEqual([expect.stringContaining('EXPIRED (RC-1 = 2027-02-01')]);
    expect(gate.evaluate({ files, allowed, baseline, today: '2027-01-31', rc1Date: '2027-02-01' }).findings).toEqual([]);
  });

  it('every plain --ag-* replacement target is itself emitted by the token manifest', () => {
    const manifest = gate.manifestVars();
    const targets = Object.values(gate.REPLACEMENTS).flatMap((t) => t.match(/--ag-[a-z0-9-]+(?![a-z0-9{-])/g) ?? []);
    expect(targets.length).toBeGreaterThan(5);
    for (const t of targets) expect([t, manifest.has(t)]).toEqual([t, true]);
  });
});

describe('REQ-FIN-11 comp tokens and OD-19 app-shell move (fresh token build)', () => {
  let decls: Map<string, string[]>;
  let tokensCss: string;
  beforeAll(async () => {
    const out = mkdtempSync(join(tmpdir(), 'ag-fin11-'));
    const { runBuild } = await import('../../scripts/tokens/build.mjs');
    await runBuild({ outRoot: out, quiet: true });
    tokensCss = readFileSync(join(out, 'dist/tokens.css'), 'utf8');
    decls = new Map();
    postcss.parse(tokensCss).walkDecls((d) => {
      if (!decls.has(d.prop)) decls.set(d.prop, []);
      decls.get(d.prop)!.push(d.value.trim());
    });
  }, 120000);

  // CMP PRD `size` row: compact 24/32/44, default 28/36/44, spacious 32/40/48 (sm/md/lg).
  const HEIGHTS: Record<string, [number, number, number]> = { compact: [24, 32, 44], default: [28, 36, 44], spacious: [32, 40, 48] };
  it.each(['sm', 'md', 'lg'].flatMap((s, i) => Object.entries(HEIGHTS).map(([d, v]) => [`--ag-comp-control-height-${s}-${d}`, `${v[i]}px`])))(
    'dist/tokens.css declares %s: %s', (name, value) => {
      expect(decls.get(name)).toEqual([value]);
    });

  // REQ-CMP-45 tracks 32x18, 40x22, 52x30 (contract C-7 PUBLIC_CSS_VARS.switchTrack).
  const TRACK: Record<string, [number, number]> = { sm: [32, 18], md: [40, 22], lg: [52, 30] };
  it.each(Object.entries(TRACK).flatMap(([s, [w, h]]) => [[`--ag-switch-track-w-${s}`, `${w}px`], [`--ag-switch-track-h-${s}`, `${h}px`]]))(
    'dist/tokens.css declares %s: %s', (name, value) => {
      expect(decls.get(name)).toEqual([value]);
    });

  it('the switch thumb inset is private', () => {
    expect(decls.get('--_ag-switch-thumb-inset')).toEqual(['2px']);
    expect(decls.has('--ag-switch-thumb-inset')).toBe(false);
  });

  it('app-shell tokens live in tokens/comp as private --_ag-app-shell-* and no public --ag-app-shell* is emitted', () => {
    expect(existsSync(join(ROOT, 'tokens/sys/app-shell.tokens.json'))).toBe(false);
    const src = readFileSync(join(ROOT, 'tokens/comp/app-shell.tokens.json'), 'utf8');
    expect(src).not.toMatch(/"--ag-app-shell/);
    expect(JSON.parse(src).comp['app-shell']).toBeDefined();
    expect([...decls.keys()].filter((k) => k.startsWith('--_ag-app-shell-')).sort()).toEqual([
      '--_ag-app-shell-bp-compact', '--_ag-app-shell-bp-expanded', '--_ag-app-shell-bp-wide', '--_ag-app-shell-gap',
      '--_ag-app-shell-inspector-width', '--_ag-app-shell-rail-width', '--_ag-app-shell-sidebar-width',
      '--_ag-app-shell-tabbar-height', '--_ag-app-shell-topbar-height',
    ]);
    expect(tokensCss).not.toMatch(/--ag-app-shell/);
    for (const f of ['manifest.ts', 'tokens.ts', 'tokens.d.ts'])
      expect(readFileSync(join(ROOT, 'src/tokens/generated', f), 'utf8')).not.toMatch(/--ag-app-shell/);
  });
});
