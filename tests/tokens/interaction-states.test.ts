/** @jest-environment node */
// MAT-033: interaction states — all 8 states have standard + contrast=more +
// transparency=solid values; disabled dims via --_ag-surface-alpha channel (never a
// host 'opacity:' declaration); selected/drop-target carry rim or weight tokens.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from '../../scripts/tokens/validate.mjs';

const css = readFileSync(join(ROOT, 'dist/css/tokens.css'), 'utf8');

const block = (sel: string) => {
  const i = css.indexOf(sel);
  if (i < 0) return '';
  const start = css.indexOf('{', i);
  let depth = 0, end = start;
  for (; end < css.length; end++) {
    if (css[end] === '{') depth++;
    if (css[end] === '}' && --depth === 0) break;
  }
  return css.slice(start, end);
};

const std = block('@layer ag.tokens');           // base block contains defaults
const more = block('[data-ag-contrast="more"]');
const solid = block('[data-ag-transparency="solid"]');

const STATES: Record<string, string[]> = {
  hover: ['--ag-state-hover-specular', '--_ag-state-hover-floor'],
  press: ['--ag-state-press-glow', '--_ag-state-press-floor'],
  selected: ['--_ag-state-selected-tint', '--_ag-state-selected-rim-width'],
  disabled: ['--ag-state-disabled-alpha', '--_ag-state-disabled-surface-alpha'],
  focus: ['--ag-focus-width'],
  'drop-target': ['--_ag-state-drop-target-fill', '--_ag-state-drop-target-rim'],
  dragging: ['--_ag-state-dragging-lift', '--_ag-state-dragging-specular'],
  loading: ['--_ag-state-loading-alpha'],
};

describe('interaction states (MAT-033)', () => {
  for (const [state, vars] of Object.entries(STATES)) {
    test(`${state}: standard + contrast=more + transparency=solid`, () => {
      for (const v of vars) {
        expect(std).toContain(`${v}:`);
        expect(more).toContain(`${v}:`);
        expect(solid).toContain(`${v}:`);
      }
    });
  }

  test('disabled dims via surface-alpha channel, no host opacity:', () => {
    expect(std).toContain('--_ag-state-disabled-surface-alpha:');
    // no host-level 'opacity:' declaration in emitted token css
    expect(css).not.toMatch(/^\s*opacity\s*:/m);
  });

  test('selected + drop-target include rim/weight, not colour-only', () => {
    expect(std).toContain('--_ag-state-selected-rim-width:');
    expect(std).toContain('--_ag-state-selected-tint:');
    expect(std).toContain('--_ag-state-drop-target-rim:');
    expect(std).toContain('--_ag-state-drop-target-fill:');
  });
});
