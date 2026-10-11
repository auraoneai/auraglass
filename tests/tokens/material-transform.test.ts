/** @jest-environment node */
import { describe, test, expect } from '@jest/globals';
// MAT-041: material transform — exactly 3 variants x 3 thicknesses; every blur
// <= 32px; WebKit literals cover explicit/default thickness, clear fail-safe
// and coarse-pointer overrides, excluding lightweight; no intent/elevation keys;
// a 40px blur fixture exits 1.
import { cpSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ROOT } from '../../scripts/tokens/validate.mjs';
import postcss, { type Rule, type AtRule } from 'postcss';

// CJS require: the generated module has no .d.ts (jest transforms it)
const { materialSpec } = require('../../src/tokens/generated/material-spec.ts');

const LADDERS = readFileSync(join(ROOT, 'src/material/css/generated/ladders.css'), 'utf8');

const VARIANTS = ['regular', 'clear', 'identity'];
const THICKNESS = ['thin', 'regular', 'thick'];

describe('material transform (MAT-041)', () => {
  test('exactly 3 variants x 3 thicknesses', () => {
    expect(Object.keys(materialSpec.variants).sort()).toEqual([...VARIANTS].sort());
    for (const v of VARIANTS)
      expect(Object.keys(materialSpec.variants[v]).sort()).toEqual([...THICKNESS].sort());
  });

  test('every blur <= 32px', () => {
    for (const v of VARIANTS)
      for (const t of THICKNESS)
        expect(materialSpec.variants[v][t].blur.value).toBeLessThanOrEqual(32);
    // emitted css contains no blur >32 either
    for (const m of LADDERS.matchAll(/blur\((\d+)px\)/g))
      expect(Number(m[1])).toBeLessThanOrEqual(32);
  });

  test('WebKit literals cover each non-lightweight cell, fail-safe and coarse override', () => {
    // REQ-FIN-03 replaces 2 variants x 3 thicknesses x 3 tiers with a shared
    // non-lightweight selector. Identity and lightweight never get a literal.
    // 8 cell rows (2 variants x [3 explicit + 1 default thickness]),
    // 4 clear fail-safe rows and 3 coarse overrides (regular, clear, fail-safe).
    const css = postcss.parse(LADDERS);
    const rows: { selector: string; value: string; coarse: boolean }[] = [];
    css.walkDecls('-webkit-backdrop-filter', (decl) => {
      const rule = decl.parent as Rule;
      const parent = rule.parent as AtRule;
      rows.push({ selector: rule.selector, value: decl.value,
        coarse: parent.type === 'atrule' && parent.name === 'media' && parent.params === '(pointer: coarse)' });
    });
    expect(rows).toHaveLength(15);
    const base = rows.filter((r) => !r.coarse && !r.selector.includes(':where('));
    const failSafe = rows.filter((r) => !r.coarse && r.selector.includes(':where('));
    const coarse = rows.filter((r) => r.coarse);
    expect(base).toHaveLength(8);
    expect(failSafe).toHaveLength(4);
    expect(coarse).toHaveLength(3);
    for (const variant of ['regular', 'clear']) {
      const cells = base.filter((r) => r.selector.includes(`[data-ag-variant="${variant}"]`));
      expect(cells).toHaveLength(4);
      for (const thickness of THICKNESS)
        expect(cells.filter((r) => r.selector.includes(`[data-ag-thickness="${thickness}"]`))).toHaveLength(1);
      expect(cells.filter((r) => r.selector.includes(':not([data-ag-thickness])'))).toHaveLength(1);
    }
    for (const row of rows) {
      expect(row.selector).toContain('[data-ag-surface]');
      expect(row.selector).toMatch(/::before$/);
      // Formatting may wrap :not() arguments. Keep the descendant whitespace
      // before `*` mandatory while permitting whitespace around punctuation.
      expect(row.selector).toMatch(/:not\(\s*\[data-ag-tier="lightweight"\]\s*,\s*\[data-ag-tier="lightweight"\]\s+\*\s*\)/);
      expect(row.selector).not.toContain('[data-ag-variant="identity"]');
      expect(row.value).not.toContain('var(');
      expect(row.value).toMatch(/^blur\([\d.]+px\) saturate\([\d.]+\) brightness\([\d.]+\)$/);
    }
    for (const row of coarse) {
      expect(row.selector).toContain('[data-ag-thickness="thick"]');
      expect(row.value).toMatch(/^blur\(20px\)/);
    }
    // The generic unprefixed filter belongs to the material engine, not the
    // generated WebKit literal override layer (REQ-MAT-34/-35).
    const unprefixed: string[] = [];
    css.walkDecls('backdrop-filter', (decl) => { unprefixed.push(decl.value); });
    expect(unprefixed).toEqual([]);
  });

  test('materialSpec has no intent/elevation keys', () => {
    const text = JSON.stringify(materialSpec);
    expect(text).not.toMatch(/"intent"/);
    expect(text).not.toMatch(/"elevation"/);
  });

  test('a 40px blur fixture exits 1', () => {
    const dir = mkdtempSync(join(tmpdir(), 'ag-blur40-'));
    const tokenDir = join(dir, 'tokens');
    cpSync(join(ROOT, 'tokens'), tokenDir, { recursive: true });
    const matFile = join(tokenDir, 'material', 'material.tokens.json');
    const mat = JSON.parse(readFileSync(matFile, 'utf8'));
    mat.material.material.$value.variants.regular.regular.blur = { value: 40, unit: 'px' };
    writeFileSync(matFile, JSON.stringify(mat, null, 2));
    let stderr = '';
    try {
      execFileSync('node', [join(ROOT, 'scripts/tokens/build.mjs'), '--fixtures', tokenDir, '--out', dir], {
        encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
      });
    } catch (e: any) {
      stderr = `${e.stderr ?? ''}${e.stdout ?? ''}`;
    }
    expect(stderr).toMatch(/blur > 32px/);
  });
});
