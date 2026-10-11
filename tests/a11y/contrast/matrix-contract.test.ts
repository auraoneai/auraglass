/* MAT-252: matrix-contract.json is complete (no auto cells) and consistent:
   every pair has a finite threshold, the solver step is 0.005, apca advisory,
   and the opacity-floors cells cover every axis the contract declares. */
import { describe, expect, it } from '@jest/globals';
import fs from 'node:fs';

const C = JSON.parse(fs.readFileSync('tests/a11y/contrast/matrix-contract.json', 'utf8'));

describe('contrast matrix contract (SC-18)', () => {
  it('declares every axis with no auto cells', () => {
    expect(Object.keys(C.axes)).toEqual(
      expect.arrayContaining(['preset', 'scheme', 'contrast', 'transparency', 'variant', 'thickness', 'backdrop']),
    );
    for (const values of Object.values<string[]>(C.axes)) {
      expect(values.length).toBeGreaterThanOrEqual(2);
      expect(values).not.toContain('auto');
    }
    expect(C.axes.preset).toEqual(['aura', 'graphite', 'daylight', 'midnight']);
    expect(C.axes.scheme).toEqual(['light', 'dark']);
    expect(C.axes.contrast).toEqual(['standard', 'more']);
    expect(C.axes.backdrop).toEqual(['light', 'dark', 'media']);
  });

  it('pair thresholds match the PRD table', () => {
    expect(C.pairs['on-surface'].threshold).toBe(4.5);
    expect(C.pairs['on-surface-muted'].threshold).toBe(4.5);
    expect(C.pairs['on-surface-muted'].thresholdLargeOnly).toBe(3);
    expect(C.pairs['on-surface-disabled'].threshold).toBe(3);
    for (const p of ['border-strong', 'icon', 'focus-inner', 'focus-outer', 'control-boundary']) {
      expect(C.pairs[p].threshold).toBe(3);
      expect(C.pairs[p].kind).toBe('non-text');
    }
    expect(C.contrastOverrides.more.text).toBe(7);
  });

  it('solver step 0.005, clear scrim 0.35, apca advisory', () => {
    expect(C.solver.step).toBe(0.005);
    expect(C.clearVariant.scrimAlpha).toBe(0.35);
    expect(C.solver.apca).toBe('advisory');
  });

  it('opacity-floors cells exist for every preset the contract names', () => {
    const floors = JSON.parse(fs.readFileSync('tokens/generated/opacity-floors.json', 'utf8'));
    for (const preset of C.axes.preset) {
      expect(floors.cells[preset]).toBeDefined();
      for (const scheme of C.axes.scheme) {
        expect(floors.cells[preset][scheme]).toBeDefined();
        for (const contrast of C.axes.contrast) {
          expect(floors.cells[preset][scheme][contrast]).toBeDefined();
          for (const transparency of C.axes.transparency) {
            expect(floors.cells[preset][scheme][contrast][transparency]).toBeDefined();
          }
        }
      }
    }
  });
});
