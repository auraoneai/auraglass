/** @jest-environment node */
import { describe, test, expect } from '@jest/globals';
// REQ-MAT-67 / D.3-22 (REQ-FIN-57): fragments/codemods/mat.ts carries
//  - cssVars: exactly the --glass-* names of tokens/generated/compat-alias-map.json,
//    each -> a public 5.0 --ag-* variable or null, generated (not hand-edited);
//  - props: the §9 motion prop removals (DEP-M0901..M0907) as component rows;
//  - renames: unique `from` names.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import mat from '../../fragments/codemods/mat';

const ROOT = join(__dirname, '..', '..');
const MAP = JSON.parse(readFileSync(join(ROOT, 'tokens/generated/compat-alias-map.json'), 'utf8')) as Record<string, { successor: string | null }>;
const PUBLIC_AG = new Set<string>(
  ['src/tokens/generated/manifest.ts', 'src/contracts/tokens.ts'].flatMap((f) =>
    readFileSync(join(ROOT, f), 'utf8').match(/--ag-[a-z0-9-]*[a-z0-9]/g) ?? []),
);
const MOTION_PROPS = new Set([
  'respectMotionPreference', 'motionPolicy', 'initialMotionPolicy', 'animationPreset', 'preset',
  'animate', 'disableAnimation', 'whileHover', 'whileTap',
]);

describe('fragments/codemods/mat.ts (REQ-MAT-67)', () => {
  test('cssVars covers every --glass-* name of the compat alias map', () => {
    const glass = Object.keys(MAP).filter((k) => k.startsWith('--glass-')).sort();
    const keys = Object.keys(mat.cssVars ?? {}).sort();
    console.log(`cssVars: ${keys.length} keys; alias-map --glass-* names: ${glass.length}`);
    expect(keys.length).toBe(glass.length);
    expect(keys).toEqual(glass);
  });

  test('every cssVars value is null or a public 5.0 --ag-* variable', () => {
    const bad = Object.entries(mat.cssVars ?? {}).filter(([, v]) => v !== null && !PUBLIC_AG.has(v));
    expect(bad).toEqual([]);
    // A name with an alias-map successor is never mapped to null.
    const dropped = Object.entries(mat.cssVars ?? {}).filter(([k, v]) => v === null && MAP[k]?.successor);
    expect(dropped).toEqual([]);
  });

  test('cssVars module is the current generator output', () => {
    // exits 1 (throws here) when fragments/codemods/mat/css-vars.generated.ts is stale
    const out = execFileSync(process.execPath, ['scripts/mat/compat-alias-map.mjs', '--codemod', '--check'], { cwd: ROOT, encoding: 'utf8' });
    expect(out).toContain('current');
  });

  test('props rows delete §9 motion props only, one row per component/prop', () => {
    const rows = mat.props ?? [];
    expect(rows.length).toBeGreaterThan(0);
    const seen = new Set<string>();
    for (const r of rows) {
      expect(MOTION_PROPS.has(r.from)).toBe(true);
      expect(r.to).toBeNull();
      expect(r.component).toMatch(/^[A-Z][A-Za-z0-9]*$/);
      const key = `${r.component}.${r.from}`;
      expect(seen.has(key)).toBe(false);
      seen.add(key);
    }
    // The providers transform treats Glass*Provider component keys as provider
    // wrappers; prop rows must not introduce one.
    expect(rows.filter((r) => /^Glass.*Provider$/.test(r.component))).toEqual([]);
  });

  test('renames have unique from names', () => {
    const from = (mat.renames ?? []).map((r) => r.from);
    expect(new Set(from).size).toBe(from.length);
  });
});
