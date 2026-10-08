import { describe, expect, it } from '@jest/globals';
import {
  collapsePanel,
  expandPanel,
  resizePanels,
  toPercent,
  type PanelConstraint,
} from './resizePanels';

const C = (min = 10, max = 90): PanelConstraint => ({ min, max });

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

describe('resizePanels', () => {
  it('sum stays 100', () => {
    const out = resizePanels([30, 40, 30], [C(), C(), C()], 0, 5);
    expect(out.reduce((a, b) => a + b, 0)).toBeCloseTo(100, 2);
  });

  it('clamps at min/max and pushes the neighbour', () => {
    // Left panel wants +10 but is capped at 40: it takes 10 from panel 1,
    // which pushes what it cannot lose to panel 2.
    const out = resizePanels([30, 40, 30], [C(10, 40), C(35, 90), C()], 0, 10);
    expect(out[0]).toBe(40);
    expect(out.reduce((a, b) => a + b, 0)).toBeCloseTo(100, 2);
    expect(out[1]).toBe(35); // clamped at min, remainder pushed right
    expect(out[2]).toBe(25);
  });

  it('collapse snap below half min', () => {
    const cons = [{ collapsible: true, min: 20, collapsedSize: 0 }, C(), C()];
    const out = collapsePanel([30, 40, 30], cons, 0);
    expect(out[0]).toBe(0);
    expect(out[1]).toBe(70);
  });

  it('expand restores expandedSize from the same neighbour', () => {
    const cons = [{ collapsible: true, min: 10, collapsedSize: 0, expandedSize: 25 }, C(), C()];
    const collapsed = collapsePanel([30, 40, 30], cons, 0);
    const out = expandPanel(collapsed, cons, 0);
    expect(out[0]).toBe(25);
    expect(out.reduce((a, b) => a + b, 0)).toBeCloseTo(100, 2);
  });

  it('no-ops on bad handles', () => {
    const l = [50, 50];
    expect(resizePanels(l, [C(), C()], -1, 10)).toEqual(l);
    expect(resizePanels(l, [C(), C()], 1, 10)).toEqual(l);
    expect(resizePanels(l, [C(), C()], 0, Number.NaN)).toEqual(l);
  });

  it('toPercent converts px and lands on 100 exactly', () => {
    expect(toPercent([300, 500, 200], 1000)).toEqual([30, 50, 20]);
    const odd = toPercent([1, 2], 3);
    expect(odd.reduce((a, b) => a + b, 0)).toBeCloseTo(100, 10);
  });

  it('property: 1,000 seeded random drags keep sum 100 and bounds', () => {
    const seed = 0x5eed1234;
    const rand = mulberry32(seed);
    let layout = [25, 25, 25, 25];
    const cons = [C(5, 60), C(10, 80), C(0, 100), C(15, 50)];
    for (let i = 0; i < 1000; i++) {
      const handle = Math.floor(rand() * 3);
      const delta = (rand() - 0.5) * 30;
      const prevSum = layout.reduce((a, b) => a + b, 0);
      layout = resizePanels(layout, cons, handle, delta);
      const newSum = layout.reduce((a, b) => a + b, 0);
      if (Math.abs(newSum - 100) > 0.01) {
        throw new Error(`seed ${seed} drag ${i}: sum ${newSum} (was ${prevSum})`);
      }
      layout.forEach((v, pi) => {
        const c = cons[pi]!;
        if (v < c.min! - 0.01 || v > c.max! + 0.01) {
          throw new Error(`seed ${seed} drag ${i}: panel ${pi}=${v} outside [${c.min},${c.max}]`);
        }
      });
    }
  });
});
