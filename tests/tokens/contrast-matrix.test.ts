/** @jest-environment node */
// MAT-049: contrast matrix — re-solve every cell and deep-equal
// dist/contrast-matrix.json; cellCount === 2160; emitted floors are the max per
// key; busy reference has exactly 9 samples; a tampered fixture fails; solve
// <= 10 s.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from '../../scripts/tokens/validate.mjs';
import { solveContrastMatrix, matrixJson } from '../../scripts/tokens/contrast-solve.mjs';

const DIST = JSON.parse(readFileSync(join(ROOT, 'dist/contrast-matrix.json'), 'utf8'));

// build.mjs has a top-level await (require() cannot load it) — import lazily.
const solve = async () => {
  const { loadTokens, resolveAliases } = await import('../../scripts/tokens/build.mjs');
  const records = loadTokens(join(ROOT, 'tokens'));
  const resolved = resolveAliases(records);
  return solveContrastMatrix(records, resolved);
};

const walkCells = (cells: any, path: string[] = [], out: Array<[string[], any]> = []) => {
  for (const [k, v] of Object.entries<any>(cells)) {
    if (v && typeof v === 'object' && 'floorAlpha' in v) out.push([[...path, k], v]);
    else walkCells(v, [...path, k], out);
  }
  return out;
};

describe('contrast matrix (MAT-049)', () => {
  test('re-solve deep-equals dist/contrast-matrix.json (sans inputSha256)', async () => {
    const t0 = Date.now();
    const m = await solve();
    const elapsed = Date.now() - t0;
    console.log(`solve: ${elapsed}ms`);
    expect(elapsed).toBeLessThanOrEqual(10_000);
    expect({ ...m, inputSha256: null }).toEqual({ ...DIST, inputSha256: null });
  }, 30_000);

  test('cellCount === 2160 and cells walk to 2160 leaves', () => {
    expect(DIST.cellCount).toBe(2160);
    expect(walkCells(DIST.cells).length).toBe(2160);
  });

  test('emitted floors = max floorAlpha per key', () => {
    const max: Record<string, number> = {};
    for (const [path, cell] of walkCells(DIST.cells)) {
      // path = preset/scheme/contrast/transparency/variant/thickness/backdrop
      const [, , contrast, tr, , th, bd] = path;
      const key = contrast === 'more' ? `more.${th}.${bd}` : `${tr}.${th}.${bd}`;
      max[key] = Math.max(max[key] ?? 0, cell.floorAlpha);
    }
    const floors = { ...DIST.tintFloors };
    // tintFloorsMore is keyed {thickness: {backdrop}} (2 levels)
    for (const [th, m2] of Object.entries<any>(DIST.tintFloorsMore))
      for (const [bd, v] of Object.entries<any>(m2))
        floors[`more.${th}.${bd}`] = v;
    for (const [tr, m] of Object.entries<any>(DIST.tintFloors))
      for (const [th, m2] of Object.entries<any>(m))
        for (const [bd, v] of Object.entries<any>(m2))
          floors[`${tr}.${th}.${bd}`] = v;
    const mismatched: string[] = [];
    for (const [k, v] of Object.entries(max))
      if (Math.abs((floors[k] ?? 0) - v) > 1e-9) mismatched.push(`${k}: emitted ${floors[k]} vs computed max ${v}`);
    expect(mismatched).toEqual([]);
  });

  test('busy reference has exactly the 9 ordered samples', () => {
    const spec = JSON.parse(readFileSync(join(ROOT, 'tokens/contrast/contrast-matrix.tokens.json'), 'utf8'));
    const samples = spec.contrast.matrix.samples.$value;
    const hexes = samples.filter((s: string) => s.startsWith('#'));
    expect(hexes).toEqual(['#777777', '#ff3b30', '#34c759', '#0a84ff', '#ffcc00', '#af52de', '#ff9500', '#5ac8fa', '#8e8e93']);
  });

  test('tampered matrix (one floor lowered 0.005) fails the floors check', () => {
    // lower the floorAlpha of a cell that carries the max for its key
    const entries = walkCells(DIST.cells);
    // pick a key whose max is carried by exactly one cell (a strict unique carrier)
    let pick: [string[], any] | null = null;
    for (const e of entries) {
      const [, , contrast, tr, , th, bd] = e[0];
      const key = contrast === 'more' ? `more.${th}.${bd}` : `${tr}.${th}.${bd}`;
      const siblings = entries.filter(([p]) => {
        const [, , c2, t2, , th2, bd2] = p;
        return (c2 === 'more' ? `more.${th2}.${bd2}` : `${t2}.${th2}.${bd2}`) === key;
      });
      const sorted = siblings.map(([, c]) => c.floorAlpha).sort((a, b) => b - a);
      if (sorted[0] === e[1].floorAlpha && (sorted[1] ?? -1) < e[1].floorAlpha) { pick = e; break; }
    }
    expect(pick).not.toBeNull();
    const [path, cell] = pick!;
    const tampered = JSON.parse(JSON.stringify(DIST));
    let node = tampered.cells;
    for (const k of path) node = node[k];
    node.floorAlpha = Math.round((cell.floorAlpha - 0.005) * 1000) / 1000;
    // recompute max per key over the tampered tree
    const max: Record<string, number> = {};
    for (const [p, c] of walkCells(tampered.cells)) {
      const [, , contrast, tr, , th, bd] = p;
      const key = contrast === 'more' ? `more.${th}.${bd}` : `${tr}.${th}.${bd}`;
      max[key] = Math.max(max[key] ?? 0, c.floorAlpha);
    }
    const [, , contrast2, tr2, , th2, bd2] = path;
    const key = contrast2 === 'more' ? `more.${th2}.${bd2}` : `${tr2}.${th2}.${bd2}`;
    const emitted = contrast2 === 'more'
      ? (DIST.tintFloorsMore as any)[th2][bd2]
      : (DIST.tintFloors as any)[tr2][th2][bd2];
    expect(Math.abs((max[key] ?? 0) - emitted)).toBeGreaterThan(0.0001);
  }, 30_000);
});
