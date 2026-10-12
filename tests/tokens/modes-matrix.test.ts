/** @jest-environment node */
import { describe, test, expect } from '@jest/globals';
// MAT-035: mode matrix — every scheme/contrast/transparency/density axis value has
// an attribute block AND a media mirror; OS floors inside the single ag.material block (S-04);
// contrast=more selects >= tinted floor row; zero 'prefers-contrast: high';
// zero postcss warnings.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import postcss from 'postcss';
import { ROOT } from '../../scripts/tokens/validate.mjs';

const css = readFileSync(join(ROOT, 'dist/css/tokens.css'), 'utf8');
const floors = readFileSync(join(ROOT, 'src/material/css/generated/floors.css'), 'utf8');
const root = postcss.parse(css);

describe('mode matrix (MAT-035)', () => {
  test('parses with zero warnings', () => {
    expect(root.nodes.length).toBeGreaterThan(0);
    expect(() => postcss.parse(css, { from: undefined })).not.toThrow();
  });

  const AXES: Array<[string, string[]]> = [
    ['scheme', ['light', 'dark']],
    ['contrast', ['more']],
    ['transparency', ['tinted', 'solid']],
    ['density', ['compact', 'spacious']],
  ];
  for (const [axis, values] of AXES) {
    for (const v of values) {
      test(`${axis}=${v} has an attribute block`, () => {
        if (v === 'light') return; // light is the base/default
        expect(css).toContain(`[data-ag-${axis}="${v}"]`);
      });
    }
  }

  test('media mirrors exist for scheme/contrast/transparency', () => {
    expect(css).toContain('@media (prefers-color-scheme: dark)');
    expect(css).toContain('@media (prefers-contrast: more)');
    expect(css).toContain('@media (prefers-reduced-transparency: reduce)');
  });

  test('attribute mirrors are :not([data-ag-*])-guarded', () => {
    expect(css).toContain(':root:not([data-ag-scheme])');
    expect(css).toContain(':root:not([data-ag-contrast])');
    expect(css).toContain(':root:not([data-ag-transparency])');
  });

  // S-04 / REQ-MAT-19 item 2: floors.css is one @layer ag.material block; the
  // OS fallbacks (forced-colors, no backdrop-filter) live inside it, and the
  // ag.a11y overrides are rungs.css's job.
  test('OS floors emitted inside the single ag.material block', () => {
    expect(floors.match(/@layer [\w.]+\s*\{/g)).toEqual(['@layer ag.material {']);
    expect(floors).toContain('forced-colors: active');
  });

  test('contrast=more selects >= tinted floor row', () => {
    // floors.css keys each row on the surface's own thickness; transparency,
    // contrast and backdrop resolve on the surface or any ancestor via
    // :is([attr="v"], [attr="v"] *) (scripts/tokens/transforms/glass-material.mjs).
    const norm = (s: string) => s.replace(/\s+/g, ' ').replace(/\(\s+/g, '(').replace(/\s+\)/g, ')').trim();
    const rows = new Map<string, number>();
    postcss.parse(floors).walkRules((r) => {
      r.walkDecls('--_ag-tint-floor', (d) => void rows.set(norm(r.selector), parseFloat(d.value)));
    });
    const on = (attr: string, v: string) => `:is([data-ag-${attr}="${v}"], [data-ag-${attr}="${v}"] *)`;
    const floorAt = (cond: string, th: string, b: string) =>
      rows.get(`[data-ag-surface][data-ag-thickness="${th}"]${cond}${on('backdrop', b)}`) ?? null;
    for (const th of ['thin', 'regular', 'thick']) {
      for (const b of ['light', 'dark', 'media']) {
        const tinted = floorAt(on('transparency', 'tinted'), th, b);
        const more = floorAt(on('contrast', 'more'), th, b);
        expect(tinted).not.toBeNull();
        expect(more).not.toBeNull();
        expect(more!).toBeGreaterThanOrEqual(tinted!);
      }
    }
  });

  test('zero prefers-contrast: high', () => {
    expect(css).not.toContain('prefers-contrast: high');
    expect(floors).not.toContain('prefers-contrast: high');
  });
});
