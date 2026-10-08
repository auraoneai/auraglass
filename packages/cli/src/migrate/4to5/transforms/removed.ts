/**
 * removed (B3/B14): imports and usages of 4.x symbols with no 5.0 successor.
 * Specifiers are removed when a `replacement` exists; otherwise the import is
 * annotated with a TODO pointing at the registry item / LTS pointer and left
 * in place. `allow-todo` keeps exit 0 when the only output is TODOs.
 */
import { j, type FileUnit, type Transform, type TransformCtx, type TransformResult } from './shared.js';
import { todoLine } from '../todo.js';

const DOC = 'docs/auraglass-5/migrate/5.md#removed';

function applyCode(source: string, ctx: TransformCtx): TransformResult {
  const removed = ctx.mappings.removed;
  const root = j(source);
  const changes: TransformResult['changes'] = [];
  const todos: TransformResult['todos'] = [];
  const removedLocals = new Map<string, { reason: string; doc?: string; registryItem?: string }>();

  root.find(j.ImportDeclaration).forEach((p: any) => {
    const src = String((p.node.source as { value?: unknown }).value ?? '');
    const isAura = /^(aura-glass|@auraglass\/)/.test(src);
    if (isAura && src !== 'aura-glass' && removed[src]) {
      const row = removed[src]!;
      todos.push({ transform: 'removed', reason: `${src}: ${row.reason}`, doc: row.doc ?? DOC });
      return;
    }
    const kept: typeof p.node.specifiers = [];
    for (const s of p.node.specifiers ?? []) {
      let name: string | undefined;
      if (s.type === 'ImportSpecifier') name = ((s.imported as { name?: string }).name ?? (s.imported as { value?: unknown }).value) as string;
      else if (s.type === 'ImportDefaultSpecifier' || s.type === 'ImportNamespaceSpecifier') name = (s.local as { name?: string })?.name;
      if (isAura && name && removed[name]) {
        const row = removed[name]!;
        if ((row as { replacement?: string }).replacement) {
          changes.push({ transform: 'removed', description: `drop ${name} (${(row as { replacement?: string }).replacement})` });
          continue; // remove the specifier entirely
        }
        removedLocals.set((s.local as { name?: string })?.name ?? name, { reason: row.reason, doc: row.doc, registryItem: row.registryItem ?? '' });
      }
      kept.push(s);
    }
    p.node.specifiers = kept as never;
    if (isAura && kept.length === 0) j(p).remove();
  });

  // For kept-but-removed locals, annotate each usage line region once.
  for (const [, row] of removedLocals) {
    const pointer = row.registryItem ? `registry item '${row.registryItem}'` : (row.doc ?? DOC);
    todos.push({ transform: 'removed', reason: `removed in 5.0 (${pointer})`, doc: row.doc ?? DOC });
  }

  let out = changes.length ? root.toSource({ quote: 'single', reuseWhitespace: true }) : source;
  for (const t of todos) {
    const marker = todoLine(t.reason, t.doc);
    if (!out.includes(marker)) out = `${marker}\n${out}`;
  }
  return { source: out, changes, todos };
}

export const removed: Transform = {
  id: 'removed',
  run(unit: FileUnit, ctx: TransformCtx): TransformResult {
    if (unit.kind !== 'code') return { source: unit.source, changes: [], todos: [] };
    return applyCode(unit.source, ctx);
  },
};
