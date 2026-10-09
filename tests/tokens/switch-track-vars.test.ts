/* REQ-CMP-45: switch track geometry lives in tokens/comp and the component
   CSS consumes the emitted public vars. */
import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const COMP = JSON.parse(
  readFileSync(join(process.cwd(), 'tokens/comp/comp.tokens.json'), 'utf8'),
) as { comp: { switch: Record<string, { $value?: string; $extensions?: Record<string, unknown> }> } };

const CSS = readFileSync(
  join(process.cwd(), 'src/components/switch/Switch.css'), 'utf8',
);

const EXPECTED: Record<string, string> = {
  'track-w-sm': '32px', 'track-h-sm': '18px',
  'track-w-md': '40px', 'track-h-md': '22px',
  'track-w-lg': '52px', 'track-h-lg': '30px',
  'thumb-inset': '2px',
};

describe('REQ-CMP-45 switch track tokens', () => {
  it.each(Object.entries(EXPECTED))('comp.switch.%s = %s as public cssVar', (key, px) => {
    const leaf = COMP.comp.switch[key];
    expect(leaf).toBeDefined();
    expect(leaf.$value).toBe(px);
    const ext = leaf.$extensions ?? {};
    expect(ext['ag.cssVar']).toBe(`--ag-switch-${key.replace('track-w','track-w').replace('track-h','track-h')}`);
  });

  it('component CSS consumes the emitted vars for every size + inset', () => {
    for (const size of ['sm', 'md', 'lg']) {
      expect(CSS).toContain(`var(--ag-switch-track-w-${size}`);
      expect(CSS).toContain(`var(--ag-switch-track-h-${size}`);
    }
    expect(CSS).toContain('var(--ag-switch-thumb-inset');
  });

  it('resolved sizes match the spec grid (computed value check)', () => {
    const grid: Record<string, [number, number]> = { sm: [32, 18], md: [40, 22], lg: [52, 30] };
    for (const [size, [w, h]] of Object.entries(grid)) {
      expect(parseInt(COMP.comp.switch[`track-w-${size}`].$value ?? '')).toBe(w);
      expect(parseInt(COMP.comp.switch[`track-h-${size}`].$value ?? '')).toBe(h);
    }
  });
});
