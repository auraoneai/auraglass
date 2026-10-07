/** @jest-environment node */
import { describe, test, expect } from '@jest/globals';
// MAT-041: material transform — exactly 3 variants x 3 thicknesses; every blur
// <= 32px; -webkit-backdrop-filter literal count = variants_with_blur x
// thicknesses x tiers (18); materialSpec carries no intent/elevation keys;
// a 40px blur fixture exits 1.
import { cpSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ROOT } from '../../scripts/tokens/validate.mjs';

// CJS require: the generated module has no .d.ts (jest transforms it)
const { materialSpec } = require('../../src/tokens/generated/material-spec.ts');

const LADDERS = readFileSync(join(ROOT, 'src/material/css/generated/ladders.css'), 'utf8');

const VARIANTS = ['regular', 'clear', 'identity'];
const THICKNESS = ['thin', 'regular', 'thick'];
const TIERS = ['lightweight', 'standard', 'enhanced'];

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

  test('-webkit-backdrop-filter literal count = 18', () => {
    const n = (LADDERS.match(/-webkit-backdrop-filter:/g) ?? []).length;
    console.log(`-webkit-backdrop-filter literals: ${n} (variants_with_blur x thickness x tiers)`);
    expect(n).toBe(18);
    // every webkit line is immediately followed by the unprefixed declaration
    const lines = LADDERS.split('\n');
    for (let i = 0; i < lines.length; i++)
      if (lines[i]!.includes('-webkit-backdrop-filter:'))
        expect(lines[i + 1]!).toContain('backdrop-filter:');
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
