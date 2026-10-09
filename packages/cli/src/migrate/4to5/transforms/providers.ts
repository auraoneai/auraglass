/**
 * providers (B21): collapse 4.x provider wrappers (GlassProvider,
 * ThemeProvider, MotionPreferenceProvider, ToastProvider, …) into
 * `AuraGlassProvider` from 'aura-glass' and `AuraGlassScript` for Next
 * layouts. Nested providers collapse inside-out; already-migrated files are
 * left byte-identical.
 */
import { j, type FileUnit, type Transform, type TransformCtx, type TransformResult } from './shared.js';
import type { CompiledMappings } from '../index.js';
import { todoLine } from '../todo.js';

const DOC = 'docs/auraglass-5/migrate/5.md#b-21';

function providerNames(m: CompiledMappings): Set<string> {
  // 4.x provider wrappers that collapse into AuraGlassProvider (or other 5.0
  // providers) — Glass* names come from the compiled mappings (lint: no
  // hard-coded Glass* literals); the un-prefixed 4.x provider names are
  // spec-listed and not component names in the mappings.
  const s = new Set<string>();
  for (const [from, c] of Object.entries(m.components)) {
    if (from === 'AuraGlassProvider') continue;
    // A Glass*Provider with a real 5.0 mapping (e.g. GlassToastProvider ->
    // Toast.Provider) is a component provider the renames transform rewrites —
    // it must not be unwrapped. Only providers mapping to AuraGlassProvider or
    // unmapped legacy Glass*Provider names collapse.
    if (c.to === 'AuraGlassProvider' || (from.startsWith('Glass') && from.endsWith('Provider') && !c.to)) {
      s.add(from);
    }
  }
  for (const n of ['AuraGlassProvider4', 'ThemeProvider', 'MotionProvider', 'ToastProvider', 'TooltipProvider', 'DensityProvider', 'PersonaProvider']) s.add(n);
  return s;
}

function applyCode(source: string, isNextLayout: boolean, mappings: CompiledMappings): TransformResult {
  const PROVIDER_4X = providerNames(mappings);
  const root = j(source);
  const changes: TransformResult['changes'] = [];
  const todos: TransformResult['todos'] = [];
  const locals = new Set<string>();

  // Track provider local names (imported or aliased).
  root.find(j.ImportDeclaration).forEach((p: any) => {
    const src = String((p.node.source as { value?: unknown }).value ?? '');
    if (!/^(aura-glass|@auraglass\/)/.test(src)) return;
    for (const s of p.node.specifiers ?? []) {
      const imp = s.type === 'ImportSpecifier'
        ? (((s.imported as { name?: string }).name ?? (s.imported as { value?: unknown }).value) as string)
        : undefined;
      const local = (s.local as { name?: string })?.name;
      if (imp && local && PROVIDER_4X.has(imp)) locals.add(local);
      if (imp === 'AuraGlassProvider') locals.add('__migrated__');
    }
  });
  if (locals.has('__migrated__') && [...locals].filter((l) => l !== '__migrated__').length === 0) {
    return { source, changes: [], todos: [] };
  }
  const providerLocals = new Set([...locals].filter((l) => l !== '__migrated__'));

  if (providerLocals.size === 0) {
    // No provider imports — nothing to do.
    return { source, changes: [], todos: [] };
  }

  // Collapse provider JSX tags: <X.Provider props>{children}</X.Provider> or <Provider>{children}</Provider>
  // Strategy: innermost-first unwrap each 4.x provider element to its children.
  const tagName = (n: unknown): string | undefined => {
    const t = n as { type?: string; name?: string; object?: { name?: string }; property?: { name?: string } };
    if (t.type === 'JSXIdentifier') return t.name;
    if (t.type === 'JSXMemberExpression' && t.object?.name && t.property?.name) return `${t.object.name}.${t.property.name}`;
    return undefined;
  };
  const isProviderTag = (name: string | undefined): boolean => {
    if (!name) return false;
    const base = name.split('.').pop()!;
    return providerLocals.has(name) || providerLocals.has(base) || PROVIDER_4X.has(base);
  };

  let replaced = 0;
  const unwrap = () => {
    let did = false;
    root.find(j.JSXElement).forEach((p: any) => {
      const name = tagName(p.node.openingElement?.name);
      if (!isProviderTag(name)) return;
      const children = (p.node.children ?? []).filter((c: any) => (c as { type?: string }).type !== 'JSXText' || ((c as { value?: string }).value ?? '').trim() !== '');
      if (children.length === 1) {
        j(p).replaceWith(children[0] as never);
      } else {
        j(p).replaceWith(j.jsxFragment(j.jsxOpeningFragment(), j.jsxClosingFragment(), p.node.children ?? []) as never);
      }
      did = true;
      replaced += 1;
    });
    return did;
  };
  // Unwrap innermost first.
  let guard = 0;
  while (unwrap() && guard < 20) guard += 1;
  if (replaced > 0) changes.push({ transform: 'providers', description: `unwrapped ${replaced} 4.x provider(s)` });

  // Swap imports: remove provider specifiers, ensure AuraGlassProvider (+ AuraGlassScript for layouts).
  // Insert each name at most once across the file: several `aura-glass` import
  // statements can coexist (e.g. after a subpath collapsed to root), and
  // pushing the specifier into every one would duplicate the declaration.
  let addedProvider = false;
  let addedScript = false;
  root.find(j.ImportDeclaration).forEach((p: any) => {
    const src = String((p.node.source as { value?: unknown }).value ?? '');
    if (!/^(aura-glass|@auraglass\/)/.test(src)) return;
    const hasProviderSpec = (p.node.specifiers ?? []).some((s: any) => {
      const imp = s.type === 'ImportSpecifier' ? (((s.imported as { name?: string }).name ?? (s.imported as { value?: unknown }).value) as string) : undefined;
      return imp === 'AuraGlassProvider';
    });
    const kept = (p.node.specifiers ?? []).filter((s: any) => {
      const imp = s.type === 'ImportSpecifier' ? (((s.imported as { name?: string }).name ?? (s.imported as { value?: unknown }).value) as string) : undefined;
      const local = (s.local as { name?: string })?.name;
      return !(imp && PROVIDER_4X.has(imp)) && !(local && PROVIDER_4X.has(local));
    });
    if (src === 'aura-glass' || src === 'aura-glass/react') {
      if (!hasProviderSpec && !addedProvider) {
        kept.unshift(j.importSpecifier(j.identifier('AuraGlassProvider')) as never);
        addedProvider = true;
      }
      if (isNextLayout && !addedScript) {
        kept.unshift(j.importSpecifier(j.identifier('AuraGlassScript')) as never);
        addedScript = true;
      }
    }
    p.node.specifiers = kept as never;
    if (kept.length === 0) j(p).remove();
    else if ((p.node.specifiers?.length ?? 0) !== 0) changes.push({ transform: 'providers', description: 'provider imports -> AuraGlassProvider' });
  });

  // Insert <AuraGlassProvider> around top-level JSX returned by the module when
  // the file clearly rendered a provider tree (heuristic: file had providers).
  if (replaced > 0) {
    const t = { transform: 'providers', reason: 'wrap your root with <AuraGlassProvider> (and <AuraGlassScript> in Next layouts)', doc: DOC };
    todos.push(t);
    const out0 = root.toSource({ quote: 'single', reuseWhitespace: true });
    if (!out0.includes(todoLine(t.reason, t.doc))) {
      return { source: `${todoLine(t.reason, t.doc)}\n${out0}`, changes, todos };
    }
    return { source: out0, changes, todos };
  }
  return { source: root.toSource({ quote: 'single', reuseWhitespace: true }), changes, todos };
}

export const providers: Transform = {
  id: 'providers',
  run(unit: FileUnit, ctx: TransformCtx): TransformResult {
    if (unit.kind !== 'code') return { source: unit.source, changes: [], todos: [] };
    if (!/Provider/.test(unit.source)) return { source: unit.source, changes: [], todos: [] };
    const isNextLayout = /(^|\/)(layout|_document|_app)\.[jt]sx?$/.test(unit.path);
    return applyCode(unit.source, isNextLayout, ctx.mappings);
  },
};
