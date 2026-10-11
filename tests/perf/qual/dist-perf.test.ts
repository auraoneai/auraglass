/**
 * @jest-environment node
 */
/* REQ-QUAL-46 (REQ-FIN-105, FIN-446): dist JS scans + per-export bytes — scripts/qual/verify-dist-perf.mjs. */
import { describe, expect, test } from '@jest/globals';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import {
  applyBaseline, baselineRows, expiryPassed, ownerOf, run, scanSource, transitionProperties, RULES,
} from '../../../scripts/qual/lib/dist-perf.cjs';

const ROOT = resolve(__dirname, '../../..');
const FIX = join(ROOT, 'tests/perf/qual/fixtures/dist-perf');
const rules = (src: string, file = 'dist/x.js') => scanSource(src, file).map((h: { rule: string }) => h.rule);
const emptyBaseline = () => {
  const f = join(mkdtempSync(join(tmpdir(), 'ag-dp-')), 'baseline.json');
  writeFileSync(f, '[]\n');
  return f;
};

describe('static scan rules (one invalid and one valid case per rule)', () => {
  const cases: Array<[string, string, string]> = [
    ['chartjs-register', 'import { Chart as ChartJS } from "chart.js"; ChartJS.register(a, b);', 'const registry = { register() {} }; registry.register(1);'],
    ['chart-defaults', 'Chart.defaults.font.size = 12;', 'const opts = { defaults: 1 }; opts.defaults;'],
    ['defaults-plugins', 'ChartJS.defaults.plugins.legend.display = false;', 'const plugins = [1]; plugins.push(2);'],
    ['window-global-write', 'window.__ag = 1;', 'export function f() { window.__ag = 1; }'],
    ['window-global-write', 'window["agStore"] ||= {};', 'const o = { m() { window.x = 1; } };'],
    ['animate-banned-prop', 'el.animate([{ backdropFilter: "blur(0px)" }, { backdropFilter: "blur(20px)" }], 200);', 'el.animate([{ opacity: 0 }, { opacity: 1 }], 200);'],
    ['animate-banned-prop', 'const K = { width: ["0px", "10px"] }; el.animate(K, 200);', 'const K = { transform: ["none", "scale(1.02)"] }; el.animate(K, 200);'],
    ['animate-banned-prop', 'el.animate({ "--_ag-blur": ["0px", "12px"] }, 120);', 'el.animate({ opacity: [0, 1], offset: [0, 1] }, 120);'],
    ['transition-banned-prop', 'el.style.transition = "backdrop-filter 200ms ease";', 'el.style.transition = "opacity 0.14s";'],
    ['transition-banned-prop', 'node.style.transition = `filter ${ms}ms, opacity ${ms}ms`;', 'node.style.transition = `opacity ${ms}ms`;'],
    ['transition-banned-prop', 'el.style.setProperty("transition", "height 120ms");', 'el.style.setProperty("transition", "transform 120ms");'],
    ['transition-banned-prop', 'jsx("div", { style: { transition: "width 200ms, opacity 200ms" } });', 'jsx("div", { style: { transition: "opacity 200ms" } });'],
    ['transition-banned-prop', 'el.style.transitionProperty = "--_ag-blur";', 'el.style.transitionProperty = "opacity";'],
    ['elements-from-point', 'const hits = document.elementsFromPoint(x, y);', 'const hit = document.elementFromPoint(x, y);'],
    ['mutation-observer', 'const mo = new MutationObserver(cb);', 'const ro = new ResizeObserver(cb);'],
    ['mutation-observer', 'const mo = new window.MutationObserver(cb);', 'if (typeof MutationObserver === "undefined") {}'],
    ['fe-turbulence', 'jsx("feTurbulence", { baseFrequency: 0.9 });', '/* feTurbulence in a comment */ jsx("feGaussianBlur", {});'],
    ['fe-turbulence', 'el.innerHTML = `<filter><feturbulence type="noise"/></filter>`;', 'el.innerHTML = `<filter><feGaussianBlur/></filter>`;'],
  ];
  test.each(cases)('%s: invalid hits, valid does not', (rule, bad, good) => {
    expect(rules(bad)).toContain(rule);
    expect(rules(good)).not.toContain(rule);
  });

  test('every scan rule has an invalid case', () => {
    const scanRules = RULES.filter((r: string) => r !== 'banned-module' && r !== 'bundle-failed');
    expect(new Set(cases.map((c) => c[0]))).toEqual(new Set(scanRules));
  });

  test('MutationObserver is allowed only in primitives/DismissableLayer* and Base UI internals', () => {
    const src = 'const mo = new MutationObserver(cb);';
    expect(rules(src, 'dist/primitives/DismissableLayer.js')).toEqual([]);
    expect(rules(src, 'dist/primitives/DismissableLayer.client.js')).toEqual([]);
    expect(rules(src, 'node_modules/@base-ui/react/esm/utils/useMutation.js')).toEqual([]);
    expect(rules(src, 'dist/primitives/FocusScope.js')).toEqual(['mutation-observer']);
  });

  test('a violation reports its line', () => {
    const [hit] = scanSource('const a = 1;\n\nChartJS.register(x);\n', 'dist/c.js');
    expect(hit).toMatchObject({ rule: 'chartjs-register', line: 3 });
  });

  test('transition values are split into property names per comma segment', () => {
    expect(transitionProperties('opacity 0.2s, backdrop-filter 1s ease-in')).toEqual(['opacity', 'backdrop-filter']);
    expect(transitionProperties('maxHeight 1s')).toEqual(['max-height']);
  });
});

describe('fixture dists', () => {
  test('a fixture dist with ChartJS.register fails', async () => {
    const report = await run({ pkg: join(FIX, 'chartjs'), mode: 'all', baseline: emptyBaseline() });
    expect(report.status).toBe('fail');
    expect(report.violations.map((v: { rule: string }) => v.rule)).toEqual(expect.arrayContaining(['chartjs-register', 'banned-module']));
    expect(report.problems.every((p: { kind: string }) => p.kind === 'new-offender')).toBe(true);
    expect(report.bundles.Chart?.bannedModules).toEqual(['chart.js']);
  });

  test('the clean fixture passes and records a min+gzip-9 bytes map keyed by every root value export', async () => {
    const report = await run({ pkg: join(FIX, 'clean'), mode: 'all', baseline: emptyBaseline() });
    expect(report.problems).toEqual([]);
    expect(report.status).toBe('pass');
    expect(report.exports).toEqual(['Alpha', 'Beta', 'DismissableLayer']);
    expect(Object.keys(report.bytes).sort()).toEqual(['Alpha', 'Beta', 'DismissableLayer']);
    for (const n of Object.values(report.bytes) as number[]) expect(Number.isInteger(n) && n > 0).toBe(true);
    // per-export tree shaking: Beta carries its 64-row table, Alpha does not
    expect(report.bytes.Alpha).not.toBe(report.bytes.Beta);
    expect(report.method).toMatchObject({ gzipLevel: 9, minify: true, format: 'esm' });
  });

  test('an export whose bundle reaches a banned module fails; a sibling export that does not stays clean', async () => {
    const report = await run({ pkg: join(FIX, 'banned-module'), mode: 'all', baseline: emptyBaseline() });
    expect(report.status).toBe('fail');
    expect(report.bundles.Fancy?.bannedModules).toEqual(['motion']);
    expect(report.bundles.Plain?.bannedModules).toEqual([]);
    expect(report.violations).toEqual([expect.objectContaining({ file: 'aura-glass#Fancy', rule: 'banned-module', detail: 'motion' })]);
  });

  test('scan mode (L1) runs no bundles', async () => {
    const report = await run({ pkg: join(FIX, 'chartjs'), mode: 'scan', baseline: emptyBaseline() });
    expect(report.bytes).toEqual({});
    expect(report.violations.map((v: { rule: string }) => v.rule)).toEqual(['chartjs-register']);
  });

  test('a package with no dist/ fails closed', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'ag-dp-nodist-'));
    writeFileSync(join(dir, 'package.json'), '{"name":"x","version":"5.0.0-alpha.0"}');
    const report = await run({ pkg: dir, mode: 'all', baseline: emptyBaseline() });
    expect(report.status).toBe('fail');
    expect(report.problems).toEqual([expect.objectContaining({ kind: 'missing-dist' })]);
  });

  test('the CLI writes the report and exits 1 on the ChartJS fixture, 0 on the clean one', () => {
    const out = join(mkdtempSync(join(tmpdir(), 'ag-dp-cli-')), 'dist-perf.json');
    const cli = (pkg: string) => {
      try {
        execFileSync(process.execPath, ['scripts/qual/verify-dist-perf.mjs', '--pkg', pkg, '--baseline', emptyBaseline(), '--out', out], { cwd: ROOT, stdio: 'pipe' });
        return 0;
      } catch (e) { return (e as { status: number }).status; }
    };
    expect(cli(join(FIX, 'chartjs'))).toBe(1);
    expect(JSON.parse(readFileSync(out, 'utf8')).violations.length).toBeGreaterThan(0);
    expect(cli(join(FIX, 'clean'))).toBe(0);
    expect(JSON.parse(readFileSync(out, 'utf8')).bytes).toHaveProperty('Alpha');
  });
});

describe('expiring baseline (PRD-F §4.3 rule 3)', () => {
  const v = (file: string, rule = 'mutation-observer') => ({ file, rule, owner: 'MAT', reqFin: 'REQ-FIN-55' });
  const row = (file: string, extra = {}) => ({ file, rule: 'mutation-observer', owner: 'MAT', reqFin: 'REQ-FIN-55', expires: 'RC-1', ...extra });

  test('a baselined offender passes; a new offender, a stale row, an expired row and a malformed row fail', () => {
    expect(applyBaseline([v('src/a.ts')], [row('src/a.ts')], { version: '5.0.0-alpha.0' })).toEqual([]);
    expect(applyBaseline([v('src/a.ts'), v('src/b.ts')], [row('src/a.ts')], { version: '5.0.0-alpha.0' }).map((p: { kind: string }) => p.kind)).toEqual(['new-offender']);
    expect(applyBaseline([], [row('src/a.ts')], { version: '5.0.0-alpha.0' }).map((p: { kind: string }) => p.kind)).toEqual(['stale-baseline-row']);
    expect(applyBaseline([v('src/a.ts')], [row('src/a.ts')], { version: '5.0.0-rc.1' }).map((p: { kind: string }) => p.kind)).toEqual(['expired-baseline-row']);
    expect(applyBaseline([v('src/a.ts')], [row('src/a.ts', { reqFin: 'x' })], { version: '5.0.0-alpha.0' }).map((p: { kind: string }) => p.kind)).toEqual(['malformed-baseline-row', 'new-offender']);
  });

  test('RC-1 and ISO expiry semantics', () => {
    expect(expiryPassed('RC-1', '5.0.0-alpha.3')).toBe(false);
    expect(expiryPassed('RC-1', '5.0.0-beta.1')).toBe(false);
    expect(expiryPassed('RC-1', '5.0.0-rc.1')).toBe(true);
    expect(expiryPassed('RC-1', '5.0.0')).toBe(true);
    expect(expiryPassed('2026-12-01', '5.0.0-alpha.0', new Date('2026-11-30T12:00:00Z'))).toBe(false);
    expect(expiryPassed('2026-12-01', '5.0.0-alpha.0', new Date('2026-12-02T00:00:00Z'))).toBe(true);
    expect(expiryPassed('soon', '5.0.0-alpha.0')).toBe(true);
  });

  test('baselineRows never baselines bundle failures and dedupes per file+rule', () => {
    const rows = baselineRows([
      { ...v('src/a.ts'), line: 1 }, { ...v('src/a.ts'), line: 9 },
      { file: 'aura-glass#X', rule: 'bundle-failed', owner: 'PLAT', reqFin: 'REQ-FIN-37' },
    ]);
    expect(rows).toEqual([row('src/a.ts')]);
  });

  test('the committed baseline is well-formed and owned by other streams (shrink-only, rows name an owner REQ-FIN)', () => {
    const committed = JSON.parse(readFileSync(join(ROOT, 'scripts/qual/baselines/dist-perf.json'), 'utf8'));
    expect(Array.isArray(committed)).toBe(true);
    for (const r of committed) {
      expect(Object.keys(r).sort()).toEqual(['expires', 'file', 'owner', 'reqFin', 'rule']);
      expect(RULES).toContain(r.rule);
      expect(r.expires).toBe('RC-1');
      expect(r.owner).not.toBe('QUAL');
      expect(ownerOf(r.file.startsWith('aura-glass#') ? 'src/index.ts' : r.file)).toMatchObject({ owner: r.owner, reqFin: r.reqFin });
    }
  });
});
