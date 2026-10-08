/**
 * imports-subpaths: rewrite aura-glass module specifiers per compiled subpath
 * table (B4 removed subpaths, B17/B18/B19 asset renames). Unmapped specifiers
 * stay unchanged and get a TODO — never guessed.
 */
import { j, type FileUnit, type Transform, type TransformCtx, type TransformResult, docRef } from './shared.js';
import { todoLine } from '../todo.js';

const DOC = 'docs/auraglass-5/migrate/5.md#b-4';

function rewriteSpecifier(spec: string, ctx: TransformCtx): { spec: string; changed: boolean; unmappedRemoved?: string; deepComponent?: string; iconCategory?: string } {
  const map = ctx.mappings.subpaths;
  if (map[spec] !== undefined) return { spec: map[spec]!, changed: map[spec] !== spec };
  const removed = ctx.mappings.removed;
  if (spec !== 'aura-glass' && spec !== '@auraglass' && removed[spec] !== undefined) return { spec, changed: false, unmappedRemoved: spec };
  // longest-prefix match for directory-level rewrites (./primitives/<name>, ./icons/<category>).
  const aura = spec.startsWith('aura-glass') ? 'aura-glass' : spec.startsWith('@auraglass') ? spec.split('/').slice(0, 2).join('/') : null;
  if (aura) {
    const sub = '/' + spec.slice(aura.length + 1);
    if (sub === '/') return { spec, changed: false };
    let best: string | null = null;
    for (const from of Object.keys(map)) {
      const fsub = '/' + from.slice(aura.length + 1);
      if (sub === fsub || sub.startsWith(fsub + '/')) {
        if (!best || fsub.length > ('/' + best.slice(aura.length + 1)).length) best = from;
      }
    }
    if (best) {
      const fromSub = '/' + best.slice(aura.length + 1);
      return { spec: aura + map[best]!.slice(aura.length) + sub.slice(fromSub.length), changed: true };
    }
    for (const [sym] of Object.entries(removed)) {
      const fsub = '/' + sym.slice(aura.length + 1);
      if (sub === fsub || sub.startsWith(fsub + '/')) return { spec, changed: false, unmappedRemoved: spec };
    }
    // Deep component path not in the map: collapse to the owning barrel
    // (B18 ./primitives/<name> -> ./primitives, B19 ./icons/<category>/<name> ->
    // ./icons, legacy aura-glass/components/<name> -> root) and rename the
    // imported specifier per the canonical component map via deepComponent.
    const tail = sub.split('/').pop() ?? '';
    if (/^aura-glass\/(components|primitives|icons)\//.test(spec) && /^[A-Z]/.test(tail)) {
      const target = spec.startsWith('aura-glass/primitives/')
        ? 'aura-glass/primitives'
        : spec.startsWith('aura-glass/icons/')
          ? 'aura-glass/icons'
          : aura;
      return { spec: target, changed: true, deepComponent: tail };
    }
    if (/^aura-glass\/icons\//.test(spec)) {
      return { spec, changed: false, iconCategory: spec };
    }
  }
  return { spec, changed: false };
}

function applyCode(source: string, ctx: TransformCtx): TransformResult {
  const root = j(source);
  const changes: TransformResult['changes'] = [];
  const todos: TransformResult['todos'] = [];
  const specNodes = root
    .find(j.ImportDeclaration)
    .paths().map((p: any) => p.node.source as unknown as { value?: unknown; cooked?: unknown })
    .concat(
      root
        .find(j.ExportNamedDeclaration, { source: { type: 'Literal' } })
        .paths().map((p: any) => p.node.source as unknown as { value?: unknown }),
      root
        .find(j.ExportAllDeclaration)
        .paths().map((p: any) => p.node.source as unknown as { value?: unknown }),
    );
  const done = new Set<object>();
  const visit = (p: { node: { source?: { value?: unknown } } }) => {
    const src = p.node.source as { value?: unknown; cooked?: unknown } | undefined;
    if (!src || typeof src.value !== 'string' || done.has(src)) return;
    done.add(src);
    const oldSpec = src.value;
    const r = rewriteSpecifier(oldSpec, ctx);
    if (r.changed) {
      src.value = r.spec;
      src.cooked = undefined;
      changes.push({ transform: 'imports-subpaths', description: `${oldSpec} -> ${r.spec}` });
      if (r.deepComponent && p.node && 'specifiers' in (p.node as object)) {
        const comp = ctx.mappings.components[r.deepComponent];
        const newName = comp?.to ?? r.deepComponent;
        for (const sp of (p.node as { specifiers?: unknown[] }).specifiers ?? []) {
          const s = sp as { type?: string; imported?: { name?: string }; local?: { name?: string } };
          const impName = s.type === 'ImportSpecifier' ? s.imported?.name : s.type === 'ImportDefaultSpecifier' ? 'default' : undefined;
          if (impName === 'default' || impName === r.deepComponent || s.local?.name === r.deepComponent) {
            if (s.type === 'ImportSpecifier') (s.imported as { name: string }).name = newName;
            else if (s.type === 'ImportDefaultSpecifier' && s.local) s.local.name = newName;
            changes.push({ transform: 'imports-subpaths', description: `${r.deepComponent} -> ${newName}` });
          }
        }
      }
    } else if (r.unmappedRemoved) {
      todos.push({ transform: 'imports-subpaths', reason: `removed subpath '${oldSpec}' has no 5.0 equivalent`, doc: DOC });
    } else if (r.iconCategory) {
      todos.push({ transform: 'imports-subpaths', reason: `icon category subpath '${oldSpec}' is gone in 5.0; import the glyph by name from 'aura-glass/icons'`, doc: DOC });
    }
  };
  root.find(j.ImportDeclaration).forEach(visit as never);
  root.find(j.ExportNamedDeclaration).forEach((p: any) => { if (p.node.source) visit(p as never); });
  root.find(j.ExportAllDeclaration).forEach(visit as never);
  // require('...') / import('...') literal specifiers.
  root.find(j.CallExpression, { callee: { name: 'require' } }).forEach((p: any) => {
    const [arg] = p.node.arguments as Array<{ type?: string; value?: unknown }>;
    if (arg && arg.type === 'Literal' && typeof arg.value === 'string') {
      const r = rewriteSpecifier(arg.value, ctx);
      if (r.changed) { arg.value = r.spec; changes.push({ transform: 'imports-subpaths', description: `require ${arg.value}` }); }
    }
  });
  let out = changes.length ? root.toSource({ quote: 'single', reuseWhitespace: true }) : source;
  for (const t of todos) {
    out = `${todoLine(t.reason, t.doc)}\n${out}`;
  }
  return { source: out, changes, todos };
}

function applyCss(source: string, ctx: TransformCtx): TransformResult {
  const changes: TransformResult['changes'] = [];
  const out = source.replace(/(@import\s+(?:url\()?)(['"])([^'"]+)\2/g, (m, pre: string, q: string, spec: string) => {
    const r = rewriteSpecifier(spec, ctx);
    if (!r.changed) return m;
    changes.push({ transform: 'imports-subpaths', description: `${spec} -> ${r.spec}` });
    return `${pre}${q}${r.spec}${q}`;
  });
  return { source: out, changes, todos: [] };
}

export const importsSubpaths: Transform = {
  id: 'imports-subpaths',
  run(unit: FileUnit, ctx: TransformCtx): TransformResult {
    if (unit.kind === 'code') {
      if (!/aura-glass|@auraglass/.test(unit.source)) return { source: unit.source, changes: [], todos: [] };
      return applyCode(unit.source, ctx);
    }
    if (unit.kind === 'css') return applyCss(unit.source, ctx);
    return { source: unit.source, changes: [], todos: [] };
  },

};
