/* REQ-CMP-49: Slider track/thumb size grid + transient-thumb rules. */
import { describe, expect, it } from '@jest/globals';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { CONTROL_FAMILIES } from './families';
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

/* REQ-CMP-52: checkbox/radio indicator size grid 14/16/20. */
describe('checkbox indicator grid (REQ-CMP-52)', () => {
  const CB = readFileSync(join(process.cwd(), 'src/components/checkbox/Checkbox.css'), 'utf8');
  it('sm box = 14px via calc(space-1 * 3.5)', () => {
    expect(CB).toMatch(/data-ag-size='sm'\][^\n]*\[data-ag-part='indicator'\][^}]*inline-size:\s*calc\(var\(--ag-space-1\)\s*\*\s*3\.5\)/);
  });
  it('md = 16px (space-4), lg = 20px (space-5)', () => {
    expect(CB).toMatch(/data-ag-size='md'\][^\n]*\[data-ag-part='indicator'\][^}]*inline-size:\s*var\(--ag-space-4\)/);
    expect(CB).toMatch(/data-ag-size='lg'\][^\n]*\[data-ag-part='indicator'\][^}]*inline-size:\s*var\(--ag-space-5\)/);
  });
});

/* REQ-CMP-54: checked = opaque accent fill + contrast-color() icon inside
   @supports, with the --ag-color-on-accent fallback outside it; the unchecked
   edge is the border-token rim (see the REQ text for why not --ag-surface-rim). */
describe('checkbox/radio box fill + icon colour (REQ-CMP-54)', () => {
  const CB = readFileSync(join(process.cwd(), 'src/components/checkbox/Checkbox.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const CHECKED = /\.ag-checkbox\[data-checked\] \[data-ag-part='indicator'\],\s*\.ag-checkbox\[data-indeterminate\] \[data-ag-part='indicator'\],\s*\.ag-radio-group \[data-checked\] \[data-ag-part='indicator'\]\s*\{([^}]*)\}/g;
  const supportsAt = CB.indexOf('@supports (color: contrast-color(red))');
  const blocks = [...CB.matchAll(CHECKED)].map((m) => ({ at: m.index!, body: m[1]! }));

  it('fallback rule (outside @supports): accent fill, --ag-color-on-accent icon', () => {
    const fallback = blocks.filter((b) => b.at < supportsAt);
    expect(fallback).toHaveLength(1);
    expect(fallback[0]!.body).toMatch(/background:\s*var\(--ag-color-accent\);/);
    expect(fallback[0]!.body).toMatch(/color:\s*var\(--_ag-on-accent, var\(--ag-color-on-accent\)\);/);
  });

  it('@supports (color: contrast-color(red)) sets color: contrast-color(var(--ag-color-accent))', () => {
    expect(supportsAt).toBeGreaterThan(-1);
    const inside = blocks.filter((b) => b.at > supportsAt);
    expect(inside).toHaveLength(1);
    // the rule really sits inside the @supports block
    const supportsBody = CB.slice(supportsAt, CB.indexOf('}\n  }', supportsAt) + 1);
    expect(supportsBody).toContain(inside[0]!.body);
    expect(inside[0]!.body.trim()).toBe('color: contrast-color(var(--ag-color-accent));');
  });

  it('unchecked box: content-sunken fill and a border-token rim scaled from --ag-focus-width', () => {
    const base = CB.match(/\.ag-checkbox \[data-ag-part='indicator'\],\s*\.ag-radio-group \[data-ag-part='indicator'\]\s*\{([^}]*)\}/)![1]!;
    expect(base).toMatch(/background:\s*color-mix\(in oklab, var\(--ag-color-canvas\), var\(--ag-color-on-surface\) var\(--_ag-content-sunken-alpha, 4%\)\);/);
    expect(base).toMatch(/box-shadow:\s*inset 0 0 0 calc\(var\(--ag-focus-width\) \* 0\.75\) var\(--ag-color-border\);/);
    expect(base).not.toMatch(/backdrop-filter/);
  });
});

/* REQ-CMP-61 (TextField chrome grid) is covered by
   tests/controls/text-field-chrome.test.tsx: it resolves the shell's padding
   and height through the MAT comp tokens instead of matching source text. */

/* REQ-CMP-55: ring always mounted (unchecked renders the indicator part);
   dot sizes 6/8/10px per size. */
describe('radio ring + dot grid (REQ-CMP-55)', () => {
  const RG = readFileSync(join(process.cwd(), 'src/components/radio-group/RadioGroup.css'), 'utf8');
  it('dot sizes are px-based per size, not 40%', () => {
    expect(RG).not.toMatch(/::after\s*{[^}]*inline-size:\s*40%/);
    expect(RG).toMatch(/size='sm'[\s\S]*?::after\s*{[^}]*inline-size:\s*calc\(var\(--ag-space-1\)\s*\*\s*1\.5\)/);
    expect(RG).toMatch(/size='lg'[\s\S]*?::after\s*{[^}]*inline-size:\s*calc\(var\(--ag-space-1\)\s*\*\s*2\.5\)/);
    expect(RG).toMatch(/inline-size:\s*calc\(var\(--ag-space-1\)\s*\*\s*2\)/); /* md/base */
  });
  it('indicator part present on unchecked render', () => {
    expect(RG).toMatch(/data-ag-part='indicator'/);
  });
});

const COMP_ROOT = join(__dirname, '..', '..', 'src', 'components');
const LITERAL_RE = /#[0-9a-fA-F]{3,8}\b|(?<!-)\brgba?\(|(?<!-)\bhsla?\(/;

describe('controls css gate', () => {
  it.each(CONTROL_FAMILIES.map((f) => [f.name, f] as const))('%s: css contract', (_name, { family }) => {
    const dir = join(COMP_ROOT, family);
    if (!existsSync(dir)) return; // shared css lives in a sibling (checkbox.css covers radio)
    const cssFiles = readdirSync(dir).filter((f) => f.endsWith('.css'));
    for (const file of cssFiles) {
      const src = readFileSync(join(dir, file), 'utf8');
      if (!src.includes('@layer ag.components')) {
        throw new Error(`${file}: missing @layer ag.components`);
      }
      if (LITERAL_RE.test(src)) throw new Error(`${file}: raw color literal`);
      if (/!important/.test(src)) throw new Error(`${file}: !important`);
      if (/transition:\s*all/.test(src)) throw new Error(`${file}: transition: all`);
      if (/:root\b/.test(src)) throw new Error(`${file}: :root selector`);
      const noComments = src.replace(/\/\*[\s\S]*?\*\//g, '');
      if (/backdrop-filter/.test(noComments)) throw new Error(`${file}: backdrop-filter (REQ-CMP-54)`);
    }
  });
});
