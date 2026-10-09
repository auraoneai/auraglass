/**
 * prop-grammar (B6): per-component prop renames/removals/value maps from the
 * merged fragment `props` rows. `to: null` removes the prop (reason in `todo`
 * lands as a marker); unmapped literals + dynamic values stay unchanged with
 * a TODO. Spread props are never touched. Rows may be keyed by the 4.x name
 * (cmp) or the 5.0 name (surf/mat) — both match.
 */
import { j, type FileUnit, type Transform, type TransformCtx, type TransformResult } from './shared.js';
import { todoLine } from '../todo.js';
import type { PropRow } from '../mappings.js';

const DOC = 'docs/auraglass-5/migrate/5.md#b-6';

type Attr = {
  type?: string;
  name?: { name?: string };
  value?: {
    type?: string; value?: unknown;
    expression?: { type?: string; value?: unknown };
  };
};

function literalOf(a: Attr): { static: true; value: string } | { static: false } | null {
  const v = a.value;
  if (v === undefined) return { static: true, value: 'true' }; // bare attr = true
  if (v === null) return { static: true, value: 'true' };
  if (v.type === 'Literal' || v.type === 'StringLiteral') return { static: true, value: String(v.value) };
  if (v.type === 'JSXExpressionContainer' && v.expression) {
    const e = v.expression;
    if (e.type === 'Literal' || e.type === 'StringLiteral') return { static: true, value: String(e.value) };
    return { static: false };
  }
  return { static: false };
}

function applyCode(source: string, ctx: TransformCtx): TransformResult {
  const root = j(source);
  const changes: TransformResult['changes'] = [];
  const todos: TransformResult['todos'] = [];
  const seenTodos = new Set<string>();

  const exported = new Map<string, string>(); // local JSX name -> aura export name
  root.find(j.ImportDeclaration).forEach((p: any) => {
    const src = String((p.node.source as { value?: unknown }).value ?? '');
    if (!/^(aura-glass|@auraglass\/)/.test(src)) return;
    for (const s of p.node.specifiers ?? []) {
      const sAny = s as { type?: string; imported?: { name?: string; value?: unknown }; local?: { name?: string } };
      if (sAny.type === 'ImportSpecifier') {
        const imp = (sAny.imported?.name ?? sAny.imported?.value) as string;
        exported.set(sAny.local?.name ?? imp, imp);
      } else if (sAny.local?.name) exported.set(sAny.local.name, sAny.local.name);
    }
  });

  const pushTodo = (reason: string, doc: string = DOC) => {
    const key = `${reason}|${doc}`;
    if (seenTodos.has(key)) return;
    seenTodos.add(key);
    todos.push({ transform: 'prop-grammar', reason, doc });
  };

  // new-name -> old names (renames may target dotted members like Toast.Provider)
  const byNewName = new Map<string, Set<string>>();
  for (const [old, c] of Object.entries(ctx.mappings.components)) {
    if (!c.to || c.to === old) continue;
    (byNewName.get(c.to) ?? byNewName.set(c.to, new Set()).get(c.to)!).add(old);
  }

  root.find(j.JSXOpeningElement).forEach((p: any) => {
    const nameNode = p.node.name as { type?: string; name?: string; object?: { name?: string }; property?: { name?: string } };
    let localName: string | undefined;
    if (nameNode.type === 'JSXIdentifier') localName = nameNode.name;
    else if (nameNode.type === 'JSXMemberExpression' && nameNode.object?.name && nameNode.property?.name) {
      localName = `${nameNode.object.name}.${nameNode.property.name}`;
    }
    if (!localName) return;
    const exportName = exported.get(localName) ?? localName;
    const compRow =
      ctx.mappings.components[exportName] ??
      [...(byNewName.get(exportName) ?? [])]
        .map((old) => ctx.mappings.components[old])
        .find(Boolean);
    // Compat-routed names keep the 4.x prop surface via the aura-glass/compat
    // adapter — prop rows (5.x renames/removals) must not fire on them.
    if (compRow?.compatOnly) return;
    const mappedTo = compRow?.to;
    // Prop rows are keyed on the 4.x (pre-rename) name — after canonical-names
    // rewrote the import, `exportName` is the 5.0 name, so resolve rows through
    // the reverse rename map (new name -> old name's rows) too.
    const rows = [
      ...(ctx.mappings.components[exportName]?.props ?? []),
      ...(mappedTo ? (ctx.mappings.components[mappedTo]?.props ?? []) : []),
      ...[...byNewName.get(exportName) ?? []].flatMap(
        (old) => ctx.mappings.components[old]?.props ?? [],
      ),
    ];
    if (!rows.length) return;

    const attrs = (p.node.attributes ?? []) as Attr[];
    const removeIdx = new Set<Attr>();
    const extraAttrs: Attr[] = [];
    for (const row of rows) {
      const attr = attrs.find((a: any) => a.type === 'JSXAttribute' && a.name?.name === row.from);
      if (!attr) continue;
      if (row.to === null) {
        removeIdx.add(attr);
        changes.push({ transform: 'prop-grammar', description: `remove ${localName}.${row.from}` });
        if (row.todo) pushTodo(`${localName} ${row.from}: ${row.todo}`);
        continue;
      }
      if (row.to.includes('.')) {
        pushTodo(`${localName} ${row.from} -> ${row.to}${row.todo ? `: ${row.todo}` : ''}`);
        continue;
      }
      if (row.to !== row.from) {
        (attr.name as { name: string }).name = row.to;
        changes.push({ transform: 'prop-grammar', description: `${localName}.${row.from} -> ${row.to}` });
      }
      if (row.values) {
        const got = literalOf(attr);
        if (!got || !got.static) {
          pushTodo(`${localName}.${row.to} value is dynamic${row.todo ? ` — ${row.todo}` : ''}`);
        } else {
          const gotV = got && got.static ? got.value : undefined;
          const mapped = gotV === undefined ? undefined : row.values[gotV];
          const already = gotV !== undefined && Object.values(row.values).some((v) => v === gotV || (typeof v === 'string' && v.split(':').pop() === gotV));
          if (already) continue;
          if (typeof mapped === 'string' && mapped.startsWith('intent:')) {
            removeIdx.add(attr);
            extraAttrs.push({ type: 'JSXAttribute', name: { name: 'intent' }, value: { type: 'Literal', value: mapped.slice('intent:'.length) } });
            changes.push({ transform: 'prop-grammar', description: `${localName}.${row.from}="${gotV}" -> intent="${mapped.slice(7)}"` });
          } else if (typeof mapped === 'string') {
            attr.value = { type: 'Literal', value: mapped };
            changes.push({ transform: 'prop-grammar', description: `${localName}.${row.to}="${gotV}" -> "${mapped}"` });
          } else if (mapped === undefined) {
            pushTodo(`${localName}.${row.to}="${gotV}" unmapped${row.todo ? ` — ${row.todo}` : ''}`);
          } else {
            pushTodo(`${localName}.${row.to}="${gotV}" needs structured migration${row.todo ? ` — ${row.todo}` : ''}`);
          }
        }
      } else if (row.todo) {
        pushTodo(`${localName}.${row.to}: ${row.todo}`);
      }
    }
    p.node.attributes = attrs.filter((a: any) => !removeIdx.has(a)).concat(extraAttrs) as never;
  });

  let out = changes.length || todos.length ? root.toSource({ quote: 'single', reuseWhitespace: true }) : source;
  for (const t of todos) {
    const marker = todoLine(t.reason, t.doc);
    if (!out.includes(marker)) out = `${marker}\n${out}`;
  }
  return { source: out, changes, todos };
}

export const propGrammar: Transform = {
  id: 'prop-grammar',
  run(unit: FileUnit, ctx: TransformCtx): TransformResult {
    if (unit.kind !== 'code') return { source: unit.source, changes: [], todos: [] };
    return applyCode(unit.source, ctx);
  },
};

export const _row = {} as PropRow;
