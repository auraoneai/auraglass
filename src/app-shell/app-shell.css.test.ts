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

  it('contains no !important, no transition:all, no will-change outside animating', () => {
    expect(css).not.toContain('!important');
    expect(stripped.replace(/\s+/g, ' ')).not.toContain('transition: all');
    for (const rule of rules) {
      if (rule.declarations.has('will-change')) {
        expect(rule.selector + ' ' + rule.ancestors.join(' ')).toContain('[data-ag-animating');
      }
    }
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
      expect(p.startsWith('--ag-app-shell')).toBe(false);
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
    const vars = new Set([...css.matchAll(/var\((--[a-zA-Z0-9-]+)/g)].map((m) => m[1]));
    const bad = [...vars].filter((v) => !v.startsWith('--ag-') && !v.startsWith('--_ag-app-shell-'));
    expect(bad).toEqual([]);
  });
});
