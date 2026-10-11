/* REQ-MAT-26 (REQ-FIN-55, FIN D.3-17): structural attribute -> var mapping.
   A fresh token build (into a temp dir, never the repo) must emit, inside
   @layer ag.tokens, exactly one mapping rule per SpaceToken / RadiusToken:
     [data-ag-group][data-ag-spacing=N]                     --_ag-group-spacing: var(--ag-space-N)
     [data-ag-part=concentric-frame][data-ag-radius=r]      --ag-radius-outer:  var(--ag-radius-r)
     [data-ag-part=concentric-frame][data-ag-inset=N]       --ag-inset:         var(--ag-space-N)
     [data-ag-radius=r]:not([data-ag-part=concentric-frame]) --_ag-fallback-radius: var(--ag-radius-r)
     [data-ag-shape=concentric]:not([data-ag-radius])       --_ag-fallback-radius: var(--ag-radius-md)
   and the selectors must match the DOM the components actually render (jsdom
   Element.matches), so a renamed attribute or part fails here. The computed
   gap / radius / ScrollEdge background are measured by the remote L5 spec
   tests/e2e/mat/material/group.spec.ts. */
import { beforeAll, describe, expect, it } from '@jest/globals';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import postcss from 'postcss';
import * as React from 'react';
import { render } from '@testing-library/react';
import { PUBLIC_CSS_VARS } from '../../src/contracts/tokens';
import { SurfaceGroup } from '../../src/material/SurfaceGroup';
import { ConcentricFrame } from '../../src/material/ConcentricFrame';
import { Surface } from '../../src/material/Surface';

const ROOT = join(__dirname, '../..');
const EMITTER = join(ROOT, 'scripts/tokens/formats/css-layered.mjs');
const SPACE = PUBLIC_CSS_VARS.space.map((v) => v.replace('--ag-space-', ''));
const RADIUS = PUBLIC_CSS_VARS.radius.map((v) => v.replace('--ag-radius-', ''));
const FRAME = '[data-ag-part="concentric-frame"]';

/** selector -> declarations of every style rule directly under @layer ag.tokens. */
let tokenRules: Map<string, Array<[string, string]>>;

beforeAll(() => {
  const out = mkdtempSync(join(tmpdir(), 'ag-css-contract-'));
  try {
    const build = pathToFileURL(join(ROOT, 'scripts/tokens/build.mjs')).href;
    execFileSync(process.execPath, ['--input-type=module', '-e',
      `const { runBuild } = await import(${JSON.stringify(build)}); await runBuild({ outRoot: ${JSON.stringify(out)}, quiet: true });`],
    { cwd: ROOT, stdio: 'pipe' });
    const css = readFileSync(join(out, 'dist/tokens.css'), 'utf8');
    tokenRules = new Map();
    postcss.parse(css).walkRules((r) => {
      const p = r.parent;
      if (p?.type !== 'atrule' || (p as postcss.AtRule).name !== 'layer' || (p as postcss.AtRule).params.trim() !== 'ag.tokens') return;
      const decls: Array<[string, string]> = [];
      r.each((n) => { if (n.type === 'decl') decls.push([n.prop, n.value]); });
      tokenRules.set(r.selector, [...(tokenRules.get(r.selector) ?? []), ...decls]);
    });
  } finally {
    rmSync(out, { recursive: true, force: true });
  }
}, 120_000);

const expectRule = (selector: string, prop: string, value: string): void => {
  expect({ selector, decls: tokenRules.get(selector) ?? null }).toEqual({ selector, decls: [[prop, value]] });
};

/** Mapping selectors (the five families above) that `el` matches. */
const matchedMappings = (el: Element): string[] =>
  [...tokenRules.keys()].filter((s) => /data-ag-(spacing|radius|inset|shape)/.test(s) && el.matches(s));

describe('REQ-MAT-26 structural mapping rules in dist/tokens.css', () => {
  it('the contract scales are non-empty (guards a vacuous loop)', () => {
    expect(SPACE).toEqual(['0', '1', '2', '3', '4', '5', '6', '8', '10', '12', '16']);
    expect(RADIUS).toEqual(['xs', 'sm', 'md', 'lg', 'xl', 'full']);
  });

  it.each(SPACE)('SurfaceGroup spacing=%s maps to --_ag-group-spacing', (n) => {
    expectRule(`[data-ag-group][data-ag-spacing="${n}"]`, '--_ag-group-spacing', `var(--ag-space-${n})`);
  });

  it.each(RADIUS)('ConcentricFrame radius=%s maps to --ag-radius-outer', (r) => {
    expectRule(`${FRAME}[data-ag-radius="${r}"]`, '--ag-radius-outer', `var(--ag-radius-${r})`);
  });

  it.each(SPACE)('ConcentricFrame inset=%s maps to --ag-inset', (n) => {
    expectRule(`${FRAME}[data-ag-inset="${n}"]`, '--ag-inset', `var(--ag-space-${n})`);
  });

  it.each(RADIUS)('surface fallbackRadius=%s (outside a frame) maps to --_ag-fallback-radius', (r) => {
    expectRule(`[data-ag-radius="${r}"]:not(${FRAME})`, '--_ag-fallback-radius', `var(--ag-radius-${r})`);
  });

  it('a concentric surface with no fallbackRadius falls back to md', () => {
    expectRule('[data-ag-shape="concentric"]:not([data-ag-radius])', '--_ag-fallback-radius', 'var(--ag-radius-md)');
  });

  it('no mapping rule exists for a value outside the contract scales', () => {
    const allowed = new Set([
      ...SPACE.map((n) => `[data-ag-group][data-ag-spacing="${n}"]`),
      ...RADIUS.map((r) => `${FRAME}[data-ag-radius="${r}"]`),
      ...SPACE.map((n) => `${FRAME}[data-ag-inset="${n}"]`),
      ...RADIUS.map((r) => `[data-ag-radius="${r}"]:not(${FRAME})`),
      '[data-ag-shape="concentric"]:not([data-ag-radius])',
    ]);
    const extra = [...tokenRules.keys()].filter((s) => /data-ag-(spacing|radius|inset)=/.test(s) && !allowed.has(s));
    expect(extra).toEqual([]);
  });
});

describe('REQ-MAT-26 mapping selectors match the rendered components', () => {
  it('SurfaceGroup spacing=4 matches only the spacing-4 rule', () => {
    const { container } = render(React.createElement(SurfaceGroup, { spacing: '4', children: 'x' }));
    expect(matchedMappings(container.firstElementChild!)).toEqual(['[data-ag-group][data-ag-spacing="4"]']);
  });

  it('ConcentricFrame radius=lg inset=3 matches the frame radius and inset rules, never the fallback', () => {
    const { container } = render(React.createElement(ConcentricFrame, { radius: 'lg', inset: '3', children: 'x' }));
    expect(matchedMappings(container.firstElementChild!).sort()).toEqual(
      [`${FRAME}[data-ag-inset="3"]`, `${FRAME}[data-ag-radius="lg"]`].sort(),
    );
  });

  it('a concentric Surface with fallbackRadius=lg matches only the lg fallback rule', () => {
    const { container } = render(React.createElement(Surface, { shape: 'concentric', fallbackRadius: 'lg', children: 'x' }));
    expect(matchedMappings(container.firstElementChild!)).toEqual([`[data-ag-radius="lg"]:not(${FRAME})`]);
  });

  it('a concentric Surface with no fallbackRadius matches only the md default rule', () => {
    const { container } = render(React.createElement(Surface, { shape: 'concentric', children: 'x' }));
    expect(matchedMappings(container.firstElementChild!)).toEqual(['[data-ag-shape="concentric"]:not([data-ag-radius])']);
  });
});

describe('structuralMappingRules fails closed', () => {
  const run = (cells: unknown[]) => spawnSync(process.execPath, ['--input-type=module', '-e',
    `const m = await import(${JSON.stringify(pathToFileURL(EMITTER).href)}); m.structuralMappingRules(${JSON.stringify(cells)});`],
  { cwd: ROOT, encoding: 'utf8' });

  it('dies when no space tokens are emitted', () => {
    const r = run([{ cssVar: '--ag-radius-md' }]);
    expect(r.status).toBe(1);
    expect(r.stderr).toContain('structural mapping: no --ag-space-* tokens emitted');
  });

  it('dies when the md fallback radius is not emitted', () => {
    const r = run([{ cssVar: '--ag-space-2' }, { cssVar: '--ag-radius-lg' }]);
    expect(r.status).toBe(1);
    expect(r.stderr).toContain('fallback default --ag-radius-md is not emitted');
  });
});
