/* REQ-CMP-49: Slider track/thumb size grid + transient-thumb rules. */
import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const CSS = readFileSync(join(process.cwd(), 'src/components/slider/Slider.css'), 'utf8');

describe('slider css grid (REQ-CMP-49)', () => {
  it('track block-size sm/md/lg = 4/6/8px', () => {
    /* sm = --ag-space-1 (4px) */
    expect(CSS).toMatch(/data-ag-size='sm'\][^\n]*\[data-ag-part='track'\][^}]*block-size:\s*var\(--ag-space-1\)/);
    /* md (+ unset default) = 6px via calc(space-1 * 1.5) */
    expect(CSS).toMatch(/data-ag-size='md'\][^\n]*\[data-ag-part='track'\][^}]*block-size:\s*calc\(var\(--ag-space-1\)\s*\*\s*1\.5\)/);
    /* lg = --ag-space-2 (8px) */
    expect(CSS).toMatch(/data-ag-size='lg'\][^\n]*\[data-ag-part='track'\][^}]*block-size:\s*var\(--ag-space-2\)/);
  });

  it('thumb sm/md/lg = 16/20/24px', () => {
    expect(CSS).toMatch(/data-ag-size='sm'\][^\n]*\[data-ag-part='thumb'\][^}]*inline-size:\s*var\(--ag-space-4\)/);
    /* md + :not([data-ag-size]) default = --ag-space-5 (20px) */
    expect(CSS).toMatch(/data-ag-size='md'\][^\n]*\[data-ag-part='thumb'\][^}]*inline-size:\s*var\(--ag-space-5\)/);
    expect(CSS).toMatch(/:not\(\[data-ag-size\]\)[^\n]*\[data-ag-part='thumb'\][^}]*inline-size:\s*var\(--ag-space-5\)/);
    expect(CSS).toMatch(/data-ag-size='lg'\][^\n]*\[data-ag-part='thumb'\][^}]*inline-size:\s*var\(--ag-space-6\)/);
  });

  it('thumb carries no scale/transform — BU drag owns transform only inline', () => {
    const thumbBlock = CSS.split("[data-ag-part='thumb'] {")[1]?.split('}')[0] ?? '';
    expect(thumbBlock).not.toMatch(/\bscale\b/);
    expect(thumbBlock).not.toMatch(/transform:/);
    /* transition must not target transform */
    expect(thumbBlock).not.toMatch(/transition:[^;]*transform/);
  });

  it('[data-dragging] raises --ag-specular (valid custom property)', () => {
    const drag = CSS.match(/\.ag-slider\[data-dragging\][^{]*\{[^}]*\}/s)?.[0] ?? '';
    expect(drag).toContain('--ag-specular: 1');
  });
});
