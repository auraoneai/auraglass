/** @jest-environment node */
// MAT-071: shadcn interop — a var() resolver over the emitted tokens.css.
// Without [data-ag-shadcn-source], --primary resolves to the --ag-color-accent
// value; with the attribute and a consumer-provided --primary, --ag-color-accent
// resolves to it; no cycle in either mode; a cycle fixture fails the resolver.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import postcss from 'postcss';
import { ROOT } from '../../scripts/tokens/validate.mjs';

const CSS = readFileSync(join(ROOT, 'dist/css/tokens.css'), 'utf8');

/** Collect declarations per selector-scope ('source' attr vs default) from :root-ish rules. */
const collectScopes = () => {
  const root = postcss.parse(CSS);
  const scopeDefault = new Map<string, string>();
  const scopeSource = new Map<string, string>();
  root.walkRules((rule) => {
    const sel = rule.selector.replace(/\s+/g, ' ').trim();
    const isSource = sel === ':root[data-ag-shadcn-source]';
    const isDefault = sel === ':where(:root:not([data-ag-shadcn-source]))';
    if (!isSource && !isDefault) return;
    const map = isSource ? scopeSource : scopeDefault;
    rule.walkDecls((d) => map.set(d.prop, d.value));
  });
  return { scopeDefault, scopeSource };
};

/** Resolve a var(--x, fallback) chain to a final non-var value; throws on cycle. */
const resolveVar = (name: string, maps: Map<string, string>[], seen = new Set<string>()): string => {
  if (seen.has(name)) throw new Error(`cycle: ${[...seen, name].join(' -> ')}`);
  seen.add(name);
  for (const m of maps) {
    const raw = m.get(name);
    if (raw === undefined) continue;
    const v = raw.replace(/\s+/g, ' ').trim();
    const varCall = /^var\(\s*(--[a-zA-Z0-9-]+)\s*(?:,\s*(.+))?\)$/.exec(v);
    if (!varCall) return v;
    try {
      return resolveVar(varCall[1]!, maps, seen);
    } catch (e: any) {
      if (varCall[2]) return varCall[2];
      throw e;
    }
  }
  throw new Error(`unresolved ${name}`);
};

describe('shadcn interop (MAT-071)', () => {
  const { scopeDefault, scopeSource } = collectScopes();

  // global :root decls apply in both modes
  const globalMap = (() => {
    const root = postcss.parse(CSS);
    const m = new Map<string, string>();
    root.walkRules((rule) => {
      if (rule.selector.trim() === ':root') rule.walkDecls((d) => m.set(d.prop, d.value));
    });
    return m;
  })();

  test('default mode: --primary resolves to the --ag-color-accent value', () => {
    const primary = resolveVar('--primary', [scopeDefault, globalMap]);
    const accent = resolveVar('--ag-color-accent', [globalMap]);
    expect(primary).toBe(accent);
    console.log(`default: --primary -> ${primary}`);
  });

  test('source mode: --ag-color-accent resolves to consumer --primary', () => {
    const consumer = new Map([['--primary', 'oklch(0.6 0.2 30)']]);
    const accent = resolveVar('--ag-color-accent', [consumer, scopeSource, globalMap]);
    expect(accent).toBe('oklch(0.6 0.2 30)');
  });

  test('no var cycle in either mode', () => {
    for (const name of ['--primary', '--background', '--foreground', '--radius', '--ring'])
      expect(() => resolveVar(name, [scopeDefault, globalMap])).not.toThrow();
    for (const name of ['--ag-color-accent', '--ag-color-canvas', '--ag-radius-md'])
      expect(() => resolveVar(name, [new Map([['--primary', 'oklch(0.6 0.2 30)']]), scopeSource, globalMap])).not.toThrow();
  });

  test('a cycle fixture fails the resolver', () => {
    const cycle = new Map([
      ['--primary', 'var(--ag-color-accent)'],
      ['--ag-color-accent', 'var(--primary)'],
    ]);
    expect(() => resolveVar('--primary', [cycle])).toThrow(/cycle/);
  });
});
