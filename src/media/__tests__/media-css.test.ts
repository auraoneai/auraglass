/* src/media/media.css structure: REQ-SURF-139 (NowPlayingBar 48/56 px),
   REQ-SURF-146 (CarouselRail numeric slidesPerView -> 1 below 480 px of its
   own width) and REQ-SURF-154 (media tone only picks glyph polarity). */
import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { AtRule, Declaration, Rule } from 'postcss';

const postcss = require('postcss') as typeof import('postcss');
const ast = postcss.parse(readFileSync(join(process.cwd(), 'src/media/media.css'), 'utf8'));

const SPACE_PX: Record<string, number> = { '--ag-space-1': 4, '--ag-space-2': 8, '--ag-space-12': 48 };

function rulesFor(selector: string, inAtRule?: (a: AtRule) => boolean): Rule[] {
  const out: Rule[] = [];
  ast.walkRules((r) => {
    if (!r.selectors.includes(selector)) return;
    const parent = r.parent as AtRule | undefined;
    const at = parent?.type === 'atrule' ? parent : undefined;
    if (inAtRule ? at && inAtRule(at) : !at || at.name === 'layer') out.push(r);
  });
  return out;
}
const decl = (rules: Rule[], prop: string): string | undefined => {
  let v: string | undefined;
  for (const r of rules) r.walkDecls(prop, (d: Declaration) => { v = d.value; });
  return v;
};
/** Resolves `var(--ag-space-<step>, …)` / calc(a + b) of space tokens to px. */
function px(value: string | undefined): number {
  if (!value) return Number.NaN;
  const terms = value.replace(/^calc\((.*)\)$/, '$1').split('+').map((t) => t.trim());
  return terms.reduce((sum, t) => {
    const m = /^var\((--ag-space-\d+)/.exec(t);
    return sum + (m ? SPACE_PX[m[1]!] ?? Number.NaN : Number.NaN);
  }, 0);
}

describe('NowPlayingBar height (REQ-SURF-139)', () => {
  const root = rulesFor('.ag-now-playing');
  it('48 px at a fine pointer: block-size from the height var, border-box', () => {
    expect(decl(root, 'block-size')).toBe('var(--_ag-now-playing-h)');
    expect(decl(root, 'box-sizing')).toBe('border-box');
    expect(px(decl(root, '--_ag-now-playing-h'))).toBe(48);
    expect(decl(root, 'min-block-size')).toBeUndefined();
  });
  it('56 px at a coarse pointer', () => {
    const coarse = rulesFor('.ag-now-playing', (a) => a.name === 'media' && a.params.includes('pointer: coarse'));
    expect(px(decl(coarse, '--_ag-now-playing-h'))).toBe(56);
  });
  it('fixed adds the bottom safe area to the height', () => {
    const fixed = rulesFor('.ag-now-playing[data-now-playing-fixed]');
    expect(decl(fixed, 'block-size')).toMatch(/var\(--_ag-now-playing-h\)\s*\+\s*env\(safe-area-inset-bottom/);
  });
  it('the progress hairline is drawn over the bottom edge, not in a grid row', () => {
    const progress = rulesFor('.ag-now-playing-progress');
    expect(decl(progress, 'position')).toBe('absolute');
    expect(decl(progress, 'inset-block-end')).toBe('0');
    expect(decl(progress, 'grid-row')).toBeUndefined();
    expect(decl(root, 'position')).toBe('relative');
  });
});

describe('CarouselRail container (REQ-SURF-146)', () => {
  it('.ag-carousel is the ag-carousel inline-size container', () => {
    expect(decl(rulesFor('.ag-carousel'), 'container')).toBe('ag-carousel / inline-size');
  });
  it('numeric slidesPerView becomes one slide per view below 480 px of carousel width', () => {
    const narrow = rulesFor(
      ".ag-carousel:not(.ag-carousel-auto) .ag-carousel-slide",
      (a) => a.name === 'container' && /^ag-carousel\s+\(max-width:\s*479\.98px\)$/.test(a.params),
    );
    expect(decl(narrow, 'inline-size')).toBe('100%');
    /* no unnamed query that would resolve against some other ancestor */
    let unnamed = 0;
    ast.walkAtRules('container', (a) => {
      if (/^\(/.test(a.params) && a.toString().includes('.ag-carousel')) unnamed += 1;
    });
    expect(unnamed).toBe(0);
  });
});

describe('media tone picks glyph polarity only (REQ-SURF-154)', () => {
  const toneRules: Rule[] = [];
  ast.walkRules((r) => { if (r.selector.includes('data-ag-media-tone')) toneRules.push(r); });

  it('every tone rule is keyed on [data-ag-backdrop=media][data-ag-media-tone=light|dark]', () => {
    expect(toneRules.length).toBeGreaterThan(0);
    for (const r of toneRules) {
      for (const tone of ['light', 'dark']) {
        expect(r.selector).toContain(`[data-ag-backdrop='media'][data-ag-media-tone='${tone}']`);
      }
    }
  });
  it('declares only glyph colour: never a floor, fill, filter or MAT private', () => {
    const props: string[] = [];
    for (const r of toneRules) r.walkDecls((d) => { props.push(d.prop); });
    expect(props.length).toBeGreaterThan(0);
    expect(new Set(props)).toEqual(new Set(['color']));
  });
  it('the picked ink is the surface on-surface ink the MAT floor is solved for', () => {
    const values: string[] = [];
    for (const r of toneRules) r.walkDecls('color', (d) => { values.push(d.value); });
    for (const v of values) expect(v).toMatch(/^var\(--ag-on-surface(-muted)?, var\(--ag-color-on-surface(-muted)?\)\)$/);
  });
});
