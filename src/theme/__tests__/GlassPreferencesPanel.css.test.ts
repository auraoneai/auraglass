/* @jest-environment node */
/* REQ-MAT-60: "Single column at coarse pointer, full-width controls". The
   GlassPreferencesPanel sheet's @media (pointer: coarse) block makes the
   panel one column, stacks the options one per row and gives every option
   row and the slider the full inline size; logical properties only. */
import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import postcss from 'postcss';

const CSS = readFileSync(join(__dirname, '../preferences-panel/GlassPreferencesPanel.css'), 'utf8');
const root = postcss.parse(CSS);

const coarseDecls = (selector: string): Record<string, string> => {
  const out: Record<string, string> = {};
  root.walkAtRules('media', (m) => {
    if (!/\(pointer:\s*coarse\)/.test(m.params)) return;
    m.walkRules((r) => {
      if (!(r.selectors ?? [r.selector]).includes(selector)) return;
      r.walkDecls((d) => { out[d.prop] = d.value; });
    });
  });
  return out;
};

describe('GlassPreferencesPanel coarse pointer (REQ-MAT-60)', () => {
  it('the panel is a single column', () => {
    expect(coarseDecls('.ag-preferences-panel')['grid-template-columns']).toBe('1fr');
  });
  it('options stack one per row at full width', () => {
    const d = coarseDecls('.ag-preferences-panel [data-ag-part="options"]');
    expect(d['flex-direction']).toBe('column');
    expect(d['inline-size']).toBe('100%');
  });
  it('every option row (radio and switch) is full width with a coarse target block size', () => {
    const d = coarseDecls('.ag-preferences-panel [data-ag-part="option"]');
    expect(d['inline-size']).toBe('100%');
    expect(d['min-block-size']).toBe('var(--ag-target-coarse)');
  });
  it('the slider stays full width (base rule) with a coarse target block size', () => {
    let base = '';
    root.walkRules('.ag-preferences-panel [data-ag-part="slider"]', (r) => {
      if (r.parent?.type === 'atrule' && (r.parent as postcss.AtRule).name === 'media') return;
      r.walkDecls('inline-size', (d) => { base = d.value; });
    });
    expect(base).toBe('100%');
    expect(coarseDecls('.ag-preferences-panel [data-ag-part="slider"]')['min-block-size']).toBe('var(--ag-target-coarse)');
  });
  it('uses logical sizing only (no width/height/left/right)', () => {
    const physical: string[] = [];
    root.walkDecls((d) => {
      if (/^(width|height|min-width|min-height|max-width|max-height|left|right|margin-left|margin-right|padding-left|padding-right)$/.test(d.prop)) physical.push(d.prop);
    });
    expect(physical).toEqual([]);
  });
});
