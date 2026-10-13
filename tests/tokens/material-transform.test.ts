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
    const all: { selector: string; value: string; coarse: boolean; media: string | null }[] = [];
    css.walkDecls('-webkit-backdrop-filter', (decl) => {
      const rule = decl.parent as Rule;
      const parent = rule.parent as AtRule;
      const media = parent.type === 'atrule' && parent.name === 'media' ? parent.params : null;
      all.push({ selector: rule.selector, value: decl.value, coarse: media === '(pointer: coarse)', media });
    });
    // contrast=more rows (REQ-MAT-32: saturation 1) are checked below; the
    // standard ladder is everything else
    const isMore = (r: { selector: string; media: string | null }) =>
      r.selector.includes('data-ag-contrast') || (r.media ?? '').includes('prefers-contrast');
    const rows = all.filter((r) => !isMore(r));
    expect(rows).toHaveLength(15);
    // fail-safe rows are the ones carrying the declared-backdrop condition;
    // every literal row also carries a zero-specificity :where() exclusion
    // (shared-backdrop kills), so ':where(' no longer discriminates them
    const base = rows.filter((r) => !r.coarse && !r.selector.includes('[data-ag-backdrop='));
    const failSafe = rows.filter((r) => !r.coarse && r.selector.includes('[data-ag-backdrop='));
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
      // shared-backdrop kills (REQ-MAT-26/31): group children and nested
      // surfaces must not receive a constant literal either — on WebKit it
      // would outrank the material.css kill rules
      expect(row.selector).toMatch(/:where\(\s*:not\(\s*\[data-ag-group\]\s*>\s*\*\s*,\s*\[data-ag-surface\]\s+\*:not\(\[data-ag-allow-nested\]\)\s*\)\s*\)/);
      expect(row.selector).not.toContain('[data-ag-variant="identity"]');
      expect(row.value).not.toContain('var(');
      expect(row.value).toMatch(/^blur\([\d.]+px\) saturate\([\d.]+\) brightness\([\d.]+\)$/);
    }
    for (const row of coarse) {
      expect(row.selector).toContain('[data-ag-thickness="thick"]');
      expect(row.value).toMatch(/^blur\(20px\)/);
    }
    // contrast=more (REQ-MAT-32): every base cell row has an attribute row and an
    // OS-mirror row with saturate(1) and the same blur; the coarse thick rows keep 20px.
    const more = all.filter(isMore);
    expect(more).toHaveLength(2 * 8 + 2 * 2);
    for (const r of more) {
      expect(r.value).toMatch(/^blur\([\d.]+px\) saturate\(1\) brightness\([\d.]+\)$/);
      expect(r.selector).toMatch(/::before$/);
      expect(r.selector).not.toContain('[data-ag-variant="identity"]');
      expect(r.selector).toMatch(/:not\(\s*\[data-ag-tier="lightweight"\]\s*,\s*\[data-ag-tier="lightweight"\]\s+\*\s*\)/);
      expect(r.selector).toMatch(/:where\(\s*:not\(\s*\[data-ag-group\]\s*>\s*\*\s*,\s*\[data-ag-surface\]\s+\*:not\(\[data-ag-allow-nested\]\)\s*\)\s*\)/);
    }
    const norm = (sel: string) => sel.replace(/\s+/g, ' ');
    for (const b of base) {
      const cellKey = norm(b.selector).split(':not(')[0];
      const attr = more.filter((r) => !r.media && norm(r.selector).startsWith(`${cellKey}:not(`) && r.selector.includes('[data-ag-contrast="more"]'));
      const os = more.filter((r) => r.media === '(prefers-contrast: more)' && norm(r.selector).startsWith(`${cellKey}:not(`));
      expect({ cell: cellKey, attr: attr.length, os: os.length }).toEqual({ cell: cellKey, attr: 1, os: 1 });
      const blur = (v: string) => /^blur\(([\d.]+)px\)/.exec(v)?.[1];
      expect(blur(attr[0]!.value)).toBe(blur(b.value));
      expect(blur(os[0]!.value)).toBe(blur(b.value));
    }
    const coarseMore = more.filter((r) => r.coarse || r.media === '(pointer: coarse) and (prefers-contrast: more)');
    expect(coarseMore).toHaveLength(4);
    for (const r of coarseMore) expect(r.value).toMatch(/^blur\(20px\) saturate\(1\)/);
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
    // REQ-MAT-02: build.mjs runs guards.mjs's blur-cap guard right after alias resolution,
    // naming the offending token path, before the material transform runs.
    expect(stderr).toMatch(/guard blur-cap: material\.material\.variants\.regular\.regular\.blur: blur 40px exceeds the 32px cap/);
  });
});
