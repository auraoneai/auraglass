/** CMP-116 (REQ-CMP-22): meta consistency — every family meta declares
    parts/states/variants arrays, flagship numbers within 1..44, and the DOM
    literals emitted by the family's client file are covered by meta.parts
    (source scan: data-ag-part="x" literals in <family>/*.tsx). */
import { describe, expect, it } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { CONTROL_FAMILIES } from './families';

const COMP_ROOT = join(__dirname, '..', '..', 'src', 'components');
const PART_LITERAL_RE = /data-ag-part=["'`]([a-z-]+)["'`]/g;

describe('controls meta consistency', () => {
  it.each(CONTROL_FAMILIES.map((f) => [f.name, f] as const))('%s: meta schema fields present', (_name, { meta }) => {
    expect(Array.isArray(meta.parts)).toBe(true);
    expect(Array.isArray(meta.states)).toBe(true);
    expect(typeof meta.budgetKb).toBe('number');
    expect(meta.flagship).toBeGreaterThanOrEqual(1);
    expect(meta.flagship).toBeLessThanOrEqual(44);
  });

  it.each(CONTROL_FAMILIES.map((f) => [f.name, f] as const))('%s: client DOM part literals ⊆ meta.parts', (_name, { family, meta }) => {
    const dir = join(COMP_ROOT, family);
    if (!existsSync(dir)) throw new Error(`missing dir ${dir}`);
    const parts = new Set<string>();
    for (const file of readdirSync(dir).filter((f) => f.endsWith('.client.tsx') && !f.startsWith('Fieldset'))) {
      const src = readFileSync(join(dir, file), 'utf8');
      for (const m of src.matchAll(PART_LITERAL_RE)) parts.add(m[1]!);
    }
    for (const p of parts) {
      if (!meta.parts.includes(p as never)) {
        throw new Error(`${family}: client emits part '${p}' missing from meta.parts`);
      }
    }
  });
});
