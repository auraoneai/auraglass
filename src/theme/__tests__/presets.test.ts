/* MAT-248: the four presets are authored, each with light+dark canvases,
   contain no material.* refs, every opacity-floors cell for each preset passes
   its pair's threshold, and each preset cssText overrides only the ref.color.*,
   sys.color.{canvas,accent,on-accent,border} and radius xs..xl vars (allowlist). */
import { describe, expect, it } from '@jest/globals';
import fs from 'node:fs';
import { presets, presetCss, presetCssText } from '../presets';
import type { PresetId } from '../presets';
import { parseColor, wcagContrast, formatOklch } from '../color';
import { manifest } from '../../tokens/generated/manifest';

const FLOORS = JSON.parse(
  fs.readFileSync('tokens/generated/opacity-floors.json', 'utf8'),
) as { cells: Record<string, unknown> };

// opacity-floors cells carry only the non-text pairs today; text pairs land
// with the contrast-matrix solver (matrix-contract.json records both sets).
const TEXT_PAIRS = new Set(['on-surface', 'on-surface-muted', 'text', 'muted']);
const THRESHOLDS: Record<string, number> = {
  focus: 3,
  border: 3,
  'on-surface': 4.5,
  'on-surface-muted': 4.5,
  'border-strong': 3,
  icon: 3,
  'control-boundary': 3,
  'on-surface-disabled': 3,
};

const visitCells = (preset: string) => {
  const out: Array<{ path: string[]; cell: { apcaLc: number; floorAlpha: number; minRatio: number; pair: string } }> = [];
  const walk = (node: unknown, path: string[]) => {
    if (node && typeof node === 'object' && 'minRatio' in (node as Record<string, unknown>)) {
      out.push({ path, cell: node as never });
      return;
    }
    for (const [k, v] of Object.entries(node as Record<string, unknown>)) walk(v, [...path, k]);
  };
  walk((FLOORS.cells as Record<string, unknown>)[preset], []);
  return out;
};

const allowedVar = (v: string) =>
  /^ref\.color\./.test(v) || /^sys\.color\.(canvas|accent|on-accent|border)$/.test(v)
  || /^sys\.radius\.(xs|sm|md|lg|xl)$/.test(v);

describe('theme presets', () => {
  it('exactly 4 presets with light+dark canvases', () => {
    const ids = Object.keys(presets).sort();
    expect(ids).toEqual(['aura', 'daylight', 'graphite', 'midnight']);
    for (const id of ids) {
      const p = presets[id as PresetId];
      expect(p.id).toBe(id);
      expect(parseColor(p.canvas.light).l).toBeGreaterThan(0.5);
      expect(parseColor(p.canvas.dark).l).toBeLessThan(0.5);
      expect(() => parseColor(p.accent)).not.toThrow();
    }
  });

  it('no preset source mentions material.*', () => {
    for (const [id, p] of Object.entries(presets)) {
      expect(JSON.stringify(p)).not.toContain('material.');
    }
  });

  it('every opacity-floors cell for each preset passes its pair threshold', () => {
    const failures: string[] = [];
    let total = 0;
    for (const id of Object.keys(presets)) {
      for (const { path, cell } of visitCells(id)) {
        total += 1;
        const [scheme, contrast] = path;
        const need = contrast === 'more' && TEXT_PAIRS.has(cell.pair) ? 7 : (THRESHOLDS[cell.pair] ?? 4.5);
        if (cell.minRatio < need) failures.push(`${id}/${path.join('/')} ${cell.minRatio} < ${need}`);
        if (!(cell.floorAlpha > 0 && cell.floorAlpha <= 1)) failures.push(`${id}/${path.join('/')} floorAlpha ${cell.floorAlpha} out of (0,1]`);
      }
    }
    expect(total).toBeGreaterThan(0);
    expect(failures).toEqual([]);
  });

  it('preset cssText overrides only allowlisted vars', () => {
    // OD-16 C-2 fallback: presets ship as cssText scoped to [data-ag-root]
    // (no [data-ag-theme] in dist). Every overridden var maps to an allowlisted
    // manifest token: ref.color.*, sys.color.{canvas,accent,on-accent,border},
    // sys.radius.{xs..xl}.
    const byCssVar = new Map(
      (manifest.tokens as readonly { name: string; cssVar: string }[]).map((t) => [t.cssVar, t.name]),
    );
    for (const id of Object.keys(presets) as PresetId[]) {
      const css = presetCss(id);
      expect(css).toBe(presetCssText[id]);
      const vars = [...css!.matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1]!);
      expect(vars.length).toBeGreaterThan(0);
      for (const v of vars) {
        const name = byCssVar.get(v);
        if (name === undefined) throw new Error(`${id} overrides ${v}, which is not a manifest token`);
        if (!allowedVar(name)) throw new Error(`${id} overrides ${name}, which is not allowlisted`);
      }
    }
    expect(presetCss('not-a-preset')).toBeNull();
    // data-level check: a preset only carries canvas/accent/radius/neutralHue —
    // no other override surface exists.
    for (const [, p] of Object.entries(presets)) {
      expect(Object.keys(p).sort()).toEqual(
        ['accent', 'canvas', 'id', 'name', 'neutralHue', ...(p.radiusScale !== undefined ? ['radiusScale'] : [])].sort(),
      );
    }
  });

  it('each preset accent meets 3:1 on its own light canvas', () => {
    for (const p of Object.values(presets)) {
      const ratio = wcagContrast(formatOklch(parseColor(p.accent)), p.canvas.light);
      expect(ratio).toBeGreaterThanOrEqual(3);
    }
  });
});
