// REQ-SURF-189 (static half): forced-colours and contrast-more rules in the
// SURF sheets. The rendered half (0 visible backdrop filters per story,
// pixel diffs, system-colour focus) is tests/e2e/surf/app-shell/forced-colors.spec.ts
// and tests/e2e/surf/data/preferences.spec.ts on the remote lane.
import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import cmpCss from '../../../fragments/css/cmp';
import surfCss from '../../../fragments/css/surf';
import type { CssFragment } from '../../../src/contracts/fragments';

const cssFragments: readonly CssFragment[] = [...cmpCss, ...surfCss];
const read = (file: string) => {
  const base = cssFragments.find((fragment) => fragment.file === file);
  // Inspect the shipped pair: an on-disk companion alone does not prove that
  // its accessibility rules reach the same bundle as the component styles.
  const companion = base && cssFragments.find((fragment) =>
    fragment.file === file.replace(/\.css$/, '.a11y.css') &&
    fragment.layer === 'ag.a11y' && fragment.bundle === base.bundle);
  return [file, ...(companion ? [companion.file] : [])]
    .map((path) => readFileSync(join(process.cwd(), path), 'utf8'))
    .join('\n')
    .replace(/\/\*[\s\S]*?\*\//g, '');
};

interface Rule { selectors: string[]; decls: Map<string, string>; media: string[] }

/** Style rules with their @media ancestry (dependency-free brace scan). */
function rules(src: string): Rule[] {
  const out: Rule[] = [];
  const stack: { header: string; decls: Map<string, string> }[] = [];
  let buf = '';
  for (const ch of src) {
    if (ch === '{') {
      stack.push({ header: buf.trim(), decls: new Map() });
      buf = '';
    } else if (ch === '}' || ch === ';') {
      const text = buf.trim();
      buf = '';
      const top = stack[stack.length - 1];
      if (text && top && text.includes(':') && !text.startsWith('@')) {
        const i = text.indexOf(':');
        top.decls.set(text.slice(0, i).trim(), text.slice(i + 1).trim());
      }
      if (ch === '}') {
        const done = stack.pop();
        if (done && !done.header.startsWith('@')) {
          out.push({
            selectors: splitTop(done.header),
            decls: done.decls,
            media: stack.map((s) => s.header).filter((h) => h.startsWith('@media')),
          });
        }
      }
    } else {
      buf += ch;
    }
  }
  return out;
}
function splitTop(list: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let cur = '';
  for (const ch of list) {
    if (ch === '(' || ch === '[') depth++;
    else if (ch === ')' || ch === ']') depth--;
    if (ch === ',' && depth === 0) { parts.push(cur.trim()); cur = ''; } else cur += ch;
  }
  parts.push(cur.trim());
  return parts.map((s) => s.replace(/\s+/g, ' '));
}

const FORCED = '@media (forced-colors: active)';
const forcedRule = (file: string, selector: string) =>
  rules(read(file)).find((r) => r.media.includes(FORCED) && r.selectors.includes(selector));
const nonColourCue = (r: Rule | undefined) =>
  r !== undefined && (/\bsolid\b/.test(r.decls.get('outline') ?? '') || /underline/.test(r.decls.get('text-decoration-line') ?? ''));

describe('REQ-SURF-189 forced colours (static)', () => {
  it.each([
    ['src/app-shell/app-shell.css', ".ag-sidebar__item[aria-current='page']"],
    ['src/components/tab-bar/TabBar.css', '.ag-tab-bar__item[aria-current]'],
    ['src/components/tabs/Tabs.css', ".ag-tabs__tab[data-state='active']"],
    ['src/components/breadcrumbs/Breadcrumbs.css', '.ag-breadcrumbs__current'],
    ['src/components/pagination/Pagination.css', ".ag-pagination__link[aria-current='page']"],
  ])('%s: the current item (%s) has a non-colour cue besides Highlight', (file, selector) => {
    const r = forcedRule(file, selector);
    expect(r?.decls.get('color')).toBe('Highlight');
    expect(nonColourCue(r)).toBe(true);
  });

  /* REQ-MAT-61: named SURF chrome renders data-ag-part and inherits the
     shared focus rule. Untagged app-shell descendants use the fallback;
     checking obsolete per-component selectors misses this actual coverage. */
  it.each([
    ":where( [data-ag-focusable], .ag-focusable, [data-ag-part]:not(:is([data-ag-part='control-shell'], [data-ag-part='input-shell']) :is([data-ag-part='control'], [data-ag-part='input'])) ):focus-visible",
    ":where([data-ag-part='control-shell'], [data-ag-part='input-shell']):focus-within",
    ':where(.ag-app-shell) :where(:not([data-ag-focusable], .ag-focusable, [data-ag-part])):focus-visible',
  ])('src/a11y/css/focus.css: forced-colours focus (%s) is outline 2px solid Highlight', (selector) => {
    const rule = forcedRule('src/a11y/css/focus.css', selector);
    expect(rule?.decls.get('outline')).toBe('2px solid Highlight');
    expect(rule?.decls.get('box-shadow')).toBe('none');
  });

  it('shell chrome paints on system colours', () => {
    const r = forcedRule('src/app-shell/app-shell.css', '.ag-app-shell :is(.ag-top-bar, .ag-sidebar, .ag-inspector, .ag-status-bar)');
    expect({ bg: r?.decls.get('background-color'), fg: r?.decls.get('color') }).toEqual({ bg: 'Canvas', fg: 'CanvasText' });
  });

  it('sliders use CanvasText / Highlight (CMP Slider and the media scrubber)', () => {
    expect(forcedRule('src/components/slider/Slider.css', ".ag-slider [data-ag-part='track']")?.decls.get('border')).toMatch(/CanvasText$/);
    expect(forcedRule('src/components/slider/Slider.css', ".ag-slider [data-ag-part='range']")?.decls.get('background')).toBe('Highlight');
    expect(forcedRule('src/components/slider/Slider.css', ".ag-slider [data-ag-part='thumb']")?.decls.get('background')).toBe('Highlight');
    expect(forcedRule('src/media/media.css', ".ag-media-scrubber .ag-slider [data-ag-part='track']")?.decls.get('border')).toBe('1px solid CanvasText');
    expect(forcedRule('src/media/media.css', ".ag-media-scrubber .ag-slider [data-ag-part='range']")?.decls.get('background')).toBe('Highlight');
  });

  it('legend and tooltip swatches keep their series fill and gain a CanvasText border', () => {
    for (const [file, sel] of [
      ['src/data/chart-frame/chart-frame.css', '.ag-chart-frame__swatch'],
      ['src/charts/charts.css', '.ag-chart__tooltip-swatch'],
    ] as const) {
      const r = forcedRule(file, sel);
      expect({ adjust: r?.decls.get('forced-color-adjust'), border: r?.decls.get('border') }).toEqual({ adjust: 'none', border: '1px solid CanvasText' });
    }
  });

  it('SURF sheets never set backdrop-filter under forced colours (MAT removes it from every surface)', () => {
    for (const f of ['src/app-shell/app-shell.css', 'src/media/media.css', 'src/ai/ai.css', 'src/components/tabs/Tabs.css', 'src/components/tab-bar/TabBar.css']) {
      expect(read(f)).not.toMatch(/(?:^|[^-])backdrop-filter\s*:/m);
    }
    const mat = rules(read('src/material/css/material.css')).find((r) => r.media.includes(FORCED) && r.selectors.includes('[data-ag-surface]::before'));
    // eslint-disable-next-line auraglass/no-optics-outside-material -- reads MAT's declaration back for an assertion, emits nothing
    expect(mat?.decls.get('backdrop-filter')).toBe('none');
  });
});

describe('REQ-SURF-189 contrast more (static)', () => {
  const shell = rules(read('src/app-shell/app-shell.css'));
  const find = (sel: string, media?: string) =>
    shell.find((r) => r.selectors.includes(sel) && (media ? r.media.includes(media) : r.media.length === 0));

  it('explicit [data-ag-contrast=more] draws structural TopBar / Sidebar edges', () => {
    expect(find(":where([data-ag-contrast='more']) .ag-top-bar")?.decls.get('border-block-end')).toMatch(/solid var\(--ag-color-on-surface\)$/);
    expect(find(":where([data-ag-contrast='more']) .ag-sidebar")?.decls.get('border-inline-end')).toMatch(/solid var\(--ag-color-on-surface\)$/);
  });

  it('the OS preference applies the same unless contrast is explicitly standard', () => {
    const media = '@media (prefers-contrast: more)';
    const top = find(".ag-top-bar:not(:where([data-ag-contrast='standard'], [data-ag-contrast='standard'] *))", media);
    expect(top?.decls.get('border-block-end')).toMatch(/solid var\(--ag-color-on-surface\)$/);
    const side = find(".ag-sidebar:not(:where([data-ag-contrast='standard'], [data-ag-contrast='standard'] *))", media);
    expect(side?.decls.get('border-inline-end')).toMatch(/solid var\(--ag-color-on-surface\)$/);
  });

  it('the current sidebar item gets a heavier indicator and an underline', () => {
    const r = find(":where([data-ag-contrast='more']) .ag-app-shell .ag-sidebar__item[aria-current='page']");
    expect(r?.decls.get('text-decoration-line')).toBe('underline');
    expect(r?.decls.get('box-shadow')).toContain('var(--ag-color-accent)');
  });
});
