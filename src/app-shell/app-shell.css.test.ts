import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const CSS_PATH = join(__dirname, 'app-shell.css');
const css = readFileSync(CSS_PATH, 'utf8');
const stripped = css.replace(/\/\*[\s\S]*?\*\//g, '');

interface CssRule {
  selector: string;
  ancestors: string[];
  declarations: Map<string, string>;
}
interface CssAtRule {
  name: string;
  params: string;
  ancestors: string[];
  hasBlock: boolean;
}

/** Dependency-free structural scan: tracks @-rule/rule nesting by braces. */
function scan(source: string): { rules: CssRule[]; atrules: CssAtRule[] } {
  const rules: CssRule[] = [];
  const atrules: CssAtRule[] = [];
  const stack: { header: string; isAt: boolean; decls: Map<string, string> }[] = [];
  const n = source.length;
  let i = 0;
  const readUntil = (stop: Set<string>): string => {
    const start = i;
    while (i < n && !stop.has(source[i]!)) i++;
    return source.slice(start, i).trim();
  };
  while (i < n) {
    const ch = source[i]!;
    if (/\s/.test(ch)) {
      i++;
      continue;
    }
    if (ch === '{') {
      i++;
      continue;
    }
    if (ch === '}') {
      const top = stack.pop();
      if (top && !top.isAt) {
        rules.push({ selector: top.header, ancestors: stack.map((s) => s.header), declarations: top.decls });
      }
      i++;
      continue;
    }
    const header = readUntil(new Set(['{', '}', ';']));
    const next = source[i];
    const isAt = header.startsWith('@');
    if (isAt) {
      const rest = header.slice(1).trim();
      const sp = rest.search(/\s/);
      atrules.push({
        name: sp === -1 ? rest : rest.slice(0, sp),
        params: sp === -1 ? '' : rest.slice(sp + 1).trim(),
        ancestors: stack.map((s) => s.header),
        hasBlock: next === '{',
      });
    }
    if (next === '{') {
      stack.push({ header, isAt, decls: new Map() });
      i++;
      continue;
    }
    if (!isAt && header.includes(':') && stack.length) {
      const idx = header.indexOf(':');
      stack[stack.length - 1]!.decls.set(header.slice(0, idx).trim(), header.slice(idx + 1).trim());
    }
    if (next === ';') i++;
    // '}' case: header was a declaration immediately before '}' — the pop
    // happens on the next loop iteration, so the decl above already landed.
  }
  return { rules, atrules };
}

const { rules, atrules } = scan(stripped);
const appShell = rules.find((r) => r.selector === '.ag-app-shell');

describe('app-shell.css structure (SURF-011)', () => {
  it('starts with the exact layer-order statement (SC-20)', () => {
    expect(css.startsWith('@layer ag.compat, ag.reset, ag.tokens, ag.material, ag.components, ag.a11y;')).toBe(
      true,
    );
    const statement = atrules.find((a) => a.name === 'layer' && a.params.includes(','));
    expect(statement?.hasBlock).toBe(false);
  });

  it('puts every rule inside @layer ag.components', () => {
    for (const rule of rules) {
      expect(rule.ancestors[0]).toBe('@layer ag.components');
    }
    const layerBlocks = atrules.filter((a) => a.name === 'layer' && a.hasBlock);
    expect(layerBlocks.map((b) => b.params)).toEqual(['ag.components']);
  });

  it('declares the named inline-size container on .ag-app-shell', () => {
    expect(appShell?.declarations.get('container')).toBe('ag-app-shell / inline-size');
  });

  it('has exactly three @container ag-app-shell conditions', () => {
    const queries = atrules.filter((a) => a.name === 'container').map((a) => a.params);
    expect(queries).toEqual([
      'ag-app-shell (width < 600px)',
      'ag-app-shell (600px <= width < 1024px)',
      'ag-app-shell (width >= 1440px)',
    ]);
  });

  it('uses the four-row named-area grid with a scroll-owning main and dvh sizing', () => {
    const areas = appShell?.declarations.get('grid-template-areas') ?? '';
    expect(areas).toContain("'skip skip skip'");
    expect(areas).toContain("'side top insp'");
    expect(areas).toContain("'side main insp'");
    expect(areas).toContain("'side status insp'");
    expect(appShell?.declarations.get('block-size')).toBe('100dvh');
    expect(appShell?.declarations.get('padding-inline')).toContain('env(safe-area-inset-left)');
    const main = rules.find((r) => r.selector === ".ag-app-shell [data-ag-slot='main']");
    expect(main?.declarations.get('overflow')).toBe('auto');
  });

  it('reveals the skip link only on :focus-visible of the link itself (SURF-18)', () => {
    const skipRules = rules.filter((r) => r.selector.includes("[data-ag-slot='skip']"));
    const reveal = skipRules.filter((r) => r.declarations.get('clip-path') === 'none');
    expect(reveal.map((r) => r.selector)).toEqual([".ag-app-shell [data-ag-slot='skip']:focus-visible"]);
    expect(skipRules.filter((r) => /:focus-within|:has\(/.test(r.selector))).toEqual([]);
  });

  it('main owns scroll; content parts scroll inside flex-column slots; four safe-area edges (SURF-19)', () => {
    const decl = (sel: string) => rules.find((r) => r.selector === sel)?.declarations;
    const main = decl(".ag-app-shell [data-ag-slot='main']");
    expect({
      overflow: main?.get('overflow'),
      overscroll: main?.get('overscroll-behavior'),
      start: main?.get('scroll-padding-block-start'),
      end: main?.get('scroll-padding-block-end'),
    }).toEqual({
      overflow: 'auto',
      overscroll: 'contain',
      start: 'var(--ag-scroll-padding-top, 0px)',
      end: 'var(--ag-scroll-padding-bottom, 0px)',
    });
    for (const slot of ['sidebar', 'inspector']) {
      const s = decl(`.ag-app-shell [data-ag-slot='${slot}']`);
      expect({ display: s?.get('display'), dir: s?.get('flex-direction') }).toEqual({ display: 'flex', dir: 'column' });
    }
    const content = rules.find((r) => r.selector.includes("[data-ag-part='sidebar-content']"));
    expect(content?.selector).toContain("[data-ag-part='inspector-content']");
    expect({
      overflow: content?.declarations.get('overflow'),
      overscroll: content?.declarations.get('overscroll-behavior'),
      minBlock: content?.declarations.get('min-block-size'),
    }).toEqual({ overflow: 'auto', overscroll: 'contain', minBlock: '0' });
    expect({
      inline: appShell?.declarations.get('padding-inline'),
      start: appShell?.declarations.get('padding-block-start'),
      end: appShell?.declarations.get('padding-block-end'),
    }).toEqual({
      inline: 'env(safe-area-inset-left) env(safe-area-inset-right)',
      start: 'env(safe-area-inset-top)',
      end: 'env(safe-area-inset-bottom)',
    });
    const overlay = rules.find((r) => r.selector.includes("[data-ag-slot='tabbar'][data-ag-placement='overlay']"));
    expect(overlay?.declarations.get('padding-block-end')).toBe('env(safe-area-inset-bottom)');
  });

  it('contains no !important, no transition:all, and promotes no layers (SURF-24)', () => {
    expect(css).not.toContain('!important');
    expect(stripped.replace(/\s+/g, ' ')).not.toContain('transition: all');
    const promoted: string[] = [];
    for (const rule of rules) {
      for (const prop of ['will-change', 'transform', 'translate', 'contain']) {
        if (rule.declarations.has(prop)) promoted.push(`${rule.selector} { ${prop} }`);
      }
      if (rule.selector.includes('data-ag-animating')) promoted.push(rule.selector);
    }
    expect(promoted).toEqual([]);
  });

  it('defines private --_ag-app-shell-* defaults and no public shell vars', () => {
    const defined = new Set<string>();
    for (const r of rules) for (const k of r.declarations.keys()) if (k.startsWith('--')) defined.add(k);
    for (const v of [
      '--_ag-app-shell-side',
      '--_ag-app-shell-rail',
      '--_ag-app-shell-insp',
      '--_ag-app-shell-top',
      '--_ag-app-shell-tabbar',
    ]) {
      expect(defined.has(v)).toBe(true);
    }
    for (const p of defined) {
      // any shell-namespaced var must be the private `--_` form
      if (p.includes('ag-app-shell')) expect(p.startsWith('--_ag-app-shell')).toBe(true);
    }
  });

  it('has no colour/blur/radius/duration literals (token purity)', () => {
    for (const r of rules) {
      for (const [prop, value] of r.declarations) {
        if (prop.startsWith('--') || prop === 'z-index') continue;
        expect(value).not.toMatch(
          /#[0-9a-fA-F]{3,8}\b|oklch|oklab|\brgba?\(|\bhsla?\(|backdrop-filter|blur\(|\bborder-radius\b|\dms\b|\b\d+(?:\.\d+)?s\b/,
        );
      }
    }
  });
  it('uses only --ag-* and --_ag-app-shell-* vars (SURF-25)', () => {
    // `_` is in the class so private --_ag-* reads are seen (and rejected).
    const vars = new Set([...stripped.matchAll(/var\((--[\w-]+)/g)].map((m) => m[1]!));
    expect(vars.size).toBeGreaterThan(10);
    const bad = [...vars].filter((v) => !v.startsWith('--ag-') && !v.startsWith('--_ag-app-shell-'));
    expect(bad).toEqual([]);
  });

  it('keys the nav indicator, focus ring and tab indicators on --ag-color-accent (SURF-25)', () => {
    const decl = (sel: string, prop: string) =>
      rules.find((r) => r.selector === sel || r.selector.split(/,\s*(?![^(]*\))/).map((x) => x.trim()).includes(sel))
        ?.declarations.get(prop);
    expect({
      nav: decl(".ag-app-shell [data-ag-part='sidebar-item'][aria-current='page']", 'box-shadow'),
      focus: decl('.ag-app-shell :is(a, button, [tabindex]):not([data-ag-focusable], .ag-focusable):focus-visible', 'outline'),
      tabs: decl('.ag-app-shell .ag-tabs__indicator', 'background'),
      tabbar: decl(".ag-app-shell .ag-tab-bar__item[aria-current='page']", 'box-shadow'),
    }).toEqual({
      nav: 'inset 3px 0 0 var(--ag-color-accent)',
      focus: 'var(--ag-focus-width, 2px) solid var(--ag-color-accent)',
      tabs: 'var(--ag-color-accent)',
      tabbar: 'inset 0 -2px 0 var(--ag-color-accent)',
    });
  });

  it('sidebar content owns its scroll and appearances have geometry (SURF-27)', () => {
    const has = (sel: string) => rules.filter((r) => r.selector.split(',').map((x) => x.trim()).includes(sel));
    const content = has('.ag-app-shell .ag-sidebar__content');
    expect(content.some((r) => r.declarations.get('overflow') === 'auto')).toBe(true);
    expect(content.some((r) => r.declarations.get('overscroll-behavior') === 'contain')).toBe(true);
    expect(has('.ag-app-shell .ag-sidebar')[0]?.declarations.get('flex-direction')).toBe('column');
    expect(has(".ag-app-shell .ag-sidebar[data-ag-appearance='floating']").some((r) => r.declarations.has('box-shadow'))).toBe(true);
    expect(has(".ag-app-shell .ag-sidebar[data-ag-appearance='inset']")[0]?.declarations.get('margin')).toBe('var(--ag-space-2, 0.5rem)');
  });

  it('page header wraps and actions take a full row under 600px (SURF-23)', () => {
    const row = rules.find((r) => r.selector === '.ag-app-shell .ag-page-header__row');
    expect(row?.declarations.get('flex-wrap')).toBe('wrap');
    const narrow = rules.find(
      (r) => r.selector === '.ag-app-shell .ag-page-header__actions' && r.ancestors.some((a) => a.includes('width < 600px')),
    );
    expect(narrow?.declarations.get('flex-basis')).toBe('100%');
  });
});
