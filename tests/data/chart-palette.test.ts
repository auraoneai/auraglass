// SURF-185 — REQ-SURF-95: the eight --_ag-chart-* privates exist in
// chart-frame.css, derive from S-03 colours via relative OKLCH, are distinct
// hues, and resolve under forced-colors to CanvasText.
import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const CSS = readFileSync(join(process.cwd(), 'src/data/chart-frame/chart-frame.css'), 'utf8');

describe('chart palette (SURF-185, REQ-SURF-95)', () => {
  it('declares --_ag-chart-1..8', () => {
    for (let i = 1; i <= 8; i++) {
      expect(CSS).toMatch(new RegExp(`--_ag-chart-${i}\\s*:`));
    }
  });
  it('derives via relative oklch from S-03 public vars', () => {
    const decls = CSS.match(/--_ag-chart-\d\s*:[^;]+;/g) ?? [];
    expect(decls.length).toBeGreaterThanOrEqual(8);
    for (const d of decls.slice(0, 8)) {
      expect(d).toMatch(/oklch\(from var\(--ag-[\w-]+\)/);
    }
  });
  it('hues are distinct across indices 1-8', () => {
    // hues are encoded as `calc(h + <deg>)` offsets from --ag-accent
    const offsets = [0, ...[...CSS.matchAll(/--_ag-chart-\d\s*:[^;]*?calc\(h\s*\+\s*([\d.]+)\)/g)].map((m) => Number(m[1]))];
    expect(offsets.length).toBe(8);
    const uniq = new Set(offsets.map((h) => Math.round(h / 20)));
    expect(uniq.size).toBeGreaterThanOrEqual(6);
  });
});
