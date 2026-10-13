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
    if (e.type === 'Literal' || e.type === 'StringLiteral' || e.type === 'BooleanLiteral') return { static: true, value: String(e.value) };
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
  const compatLocals = new Set<string>(); // locals bound from an aura-glass compat entry
  root.find(j.ImportDeclaration).forEach((p: any) => {
    const src = String((p.node.source as { value?: unknown }).value ?? '');
    if (!/^(aura-glass|@auraglass\/)/.test(src)) return;
    for (const s of p.node.specifiers ?? []) {
      const sAny = s as { type?: string; imported?: { name?: string; value?: unknown }; local?: { name?: string } };
      let local: string | undefined;
      if (sAny.type === 'ImportSpecifier') {
        const imp = (sAny.imported?.name ?? sAny.imported?.value) as string;
        local = sAny.local?.name ?? imp;
        exported.set(local, imp);
      } else if (sAny.local?.name) {
        local = sAny.local.name;
        exported.set(local, local);
      }
      if (local && src.endsWith('/compat')) compatLocals.add(local);
    }
  });

  const pushTodo = (reason: string, doc: string = DOC) => {
    const key = `${reason}|${doc}`;
    if (seenTodos.has(key)) return;
    seenTodos.add(key);
    todos.push({ transform: 'prop-grammar', reason, doc });
  };

  /** Writes a mapped static value: 'true' -> bare attribute, 'false' -> {false}. */
  const setValue = (attr: Attr, v: string): void => {
    if (v === 'true') attr.value = null as never;
    else if (v === 'false') attr.value = j.jsxExpressionContainer(j.booleanLiteral(false)) as never;
    else attr.value = { type: 'Literal', value: v };
  };

  /** `prop:value` (value-scoped key, S-39 props grammar via the meta generator) -> [prop, value]. */
  const splitScoped = (key: string): [string, string | undefined] => {
    const i = key.indexOf(':');
    return i < 0 ? [key, undefined] : [key.slice(0, i), key.slice(i + 1)];
  };

  /** A row `to` that is not a prop name (or `prop:value`) is a migration note
   * from the meta grammar ('error (node) or invalid via Field.Root'): never
   * write it as an attribute name — keep the prop and mark it. */
  const isPropTarget = (to: string): boolean => /^[A-Za-z_$][\w$-]*(?::[^\s]+)?$/.test(to);

  /**
   * 4.x `onChange(event)` -> 5.0 `on<Value|Checked>Change(value)`: the new
   * callback receives the value, not the event. An inline handler that only
   * reads `e.target.value` / `e.target.checked` is rewritten to take the value;
   * anything else (a handler reference, other event use) is marked.
   */
  const VALUE_OF: Record<string, string> = { onValueChange: 'value', onCheckedChange: 'checked' };
  const EVENT_MEMBERS = new Set(['target', 'currentTarget', 'preventDefault', 'stopPropagation', 'nativeEvent', 'persist']);
  const adaptHandler = (attr: Attr, localName: string, to: string): void => {
    const field = VALUE_OF[to];
    if (!field) return;
    const expr = (attr.value as { type?: string; expression?: any } | undefined)?.expression;
    const fn = expr && (expr.type === 'ArrowFunctionExpression' || expr.type === 'FunctionExpression') ? expr : null;
    const param = fn?.params?.length === 1 && fn.params[0].type === 'Identifier' ? fn.params[0] : null;
    // Only an inline one-argument handler is provably event-shaped (it reads
    // `e.target.*`); handler references and other arities may already take
    // the value on the 4.x component (date pickers, tabs) — left as written.
    if (!param) return;
    const name = param.name as string;
    let other = false;
    const reads: any[] = [];
    j.types.visit(fn.body, {
      visitMemberExpression(p: any) {
        const n = p.node;
        const target = n.object;
        if (
          target?.type === 'MemberExpression' && target.object?.type === 'Identifier' && target.object.name === name
          && !target.computed && (target.property?.name === 'target' || target.property?.name === 'currentTarget')
          && !n.computed && n.property?.name === field
        ) {
          reads.push(p);
          return false;
        }
        this.traverse(p);
        return undefined;
      },
      visitIdentifier(p: any) {
        // Event-style access the rewrite cannot carry over (`e.preventDefault()`,
        // `e.target.name`). A bare use (`(checked) => set(checked)`) means the
        // 4.x callback already passed the value — nothing to adapt.
        const parent = p.parent?.node;
        if (
          p.node.name === name && parent?.type === 'MemberExpression' && parent.object === p.node && !parent.computed
          && EVENT_MEMBERS.has(parent.property?.name)
        ) other = true;
        this.traverse(p);
        return undefined;
      },
    });
    if (other || reads.length === 0) {
      if (other) pushTodo(`${localName}.${to}: receives the ${field}, not the change event — adapt the handler`);
      return;
    }
    for (const p of reads) p.replace(j.identifier(name));
    changes.push({ transform: 'prop-grammar', description: `${localName}.${to} handler takes the ${field}` });
  };

  // A row todo about handler signatures (Tabs: "an index handler
  // onChange(event, index) must map the index to the tab value") only applies
  // when the handler can actually be event/index-shaped. An inline
  // single-parameter value handler `(id) => set(id)` already matches the 5.0
  // signature, so it renames cleanly with no marker.
  const INDEXY_PARAMS = new Set(['event', 'e', 'ev', 'index', 'i', 'idx']);
  const handlerNeedsSignatureTodo = (attr: Attr): boolean => {
    const expr = (attr.value as { type?: string; expression?: any } | undefined)?.expression;
    const fn = expr && (expr.type === 'ArrowFunctionExpression' || expr.type === 'FunctionExpression') ? expr : null;
    if (!fn) return true; // handler reference: arity unknown, keep the review marker
    const params = (fn.params ?? []) as Array<{ type?: string; name?: string }>;
    if (params.length !== 1) return true;
    const only = params[0];
    return !(only?.type === 'Identifier' && only.name !== undefined && !INDEXY_PARAMS.has(only.name));
  };

  /** Renames the element (opening + closing tag) and its unaliased import. */
  const renameElementAndImport = (openPath: any, fromLocal: string, toName: string): boolean => {
    const nameNode = openPath.node.name as { type?: string; name?: string };
    if (nameNode.type !== 'JSXIdentifier') return false;
    let spec: { imported?: { name?: string }; local?: { name?: string } } | undefined;
    root.find(j.ImportSpecifier).forEach((sp: any) => {
      if ((sp.node.local as { name?: string })?.name === fromLocal) spec = sp.node;
    });
    if (!spec?.imported || !spec.local) return false;
    const aliased = spec.local.name !== spec.imported.name;
    spec.imported.name = toName;
    if (!aliased) {
      spec.local.name = toName;
      nameNode.name = toName;
      const closing = (openPath.parent?.node as { closingElement?: { name?: { name?: string } } } | undefined)?.closingElement;
      if (closing?.name) closing.name.name = toName;
    }
    return true;
  };

  root.find(j.JSXOpeningElement).forEach((p: any) => {
    const nameNode = p.node.name as { type?: string; name?: string; object?: { name?: string }; property?: { name?: string } };
    let localName: string | undefined;
    if (nameNode.type === 'JSXIdentifier') localName = nameNode.name;
    else if (nameNode.type === 'JSXMemberExpression' && nameNode.object?.name && nameNode.property?.name) {
      localName = `${nameNode.object.name}.${nameNode.property.name}`;
    }
    if (!localName) return;
    const headLocal = localName.split('.')[0]!;
    // Only aura-glass bindings migrate. Compat-routed names keep the 4.x prop
    // surface through the aura-glass/compat adapter, so no row fires on them.
    if (!exported.has(headLocal) || compatLocals.has(headLocal)) return;
    const exportName = exported.get(localName) ?? localName;
    if (ctx.mappings.components[exportName]?.compatOnly) return;
    const mappedTo = ctx.mappings.components[exportName]?.to;
    // Rows keyed on the element's own export name (4.x name when canonical-names
    // did not run, or 5.0-keyed surf/mat rows), on its rename target, and on the
    // 4.x names canonical-names renamed onto this element in this run. Rows of
    // other 4.x aliases of the same 5.0 name never fire: on already-migrated
    // code `Button` is the 5.0 export and must stay untouched.
    const origins = ctx.renamedFrom?.get(localName) ?? new Set<string>();
    const rows = [...new Set([
      ...(ctx.mappings.components[exportName]?.props ?? []),
      ...(mappedTo && mappedTo !== exportName ? (ctx.mappings.components[mappedTo]?.props ?? []) : []),
      ...[...origins].flatMap((o) => ctx.mappings.components[o]?.props ?? []),
    ])];
    if (!rows.length) return;

    const attrs = (p.node.attributes ?? []) as Attr[];
    const removeIdx = new Set<Attr>();
    const extraAttrs: Attr[] = [];
    const handled = new Set<Attr>();

    // 1. Value-scoped rows (`variant:secondary`): fire only on that literal and
    //    take precedence over the prop's unscoped row.
    const scoped = rows.filter((r) => r.from.includes(':'));
    for (const attr of attrs) {
      if (attr.type !== 'JSXAttribute' || !attr.name?.name || !scoped.length) continue;
      const prop = attr.name.name;
      const got = literalOf(attr);
      if (!got || !got.static) continue;
      const row = scoped.find((r) => {
        const [rp, rv] = splitScoped(r.from);
        return rp === prop && rv === got.value;
      });
      if (!row) continue;
      handled.add(attr);
      const v = got.value;
      if (row.to === null) {
        removeIdx.add(attr);
        changes.push({ transform: 'prop-grammar', description: `remove ${localName}.${prop}="${v}"` });
        pushTodo(`${localName} ${row.from}: ${row.todo ?? `no 5.0 equivalent for ${prop}="${v}"; pick the 5.0 value by hand`}`);
        continue;
      }
      if (row.to.includes('.') || !isPropTarget(row.to)) {
        pushTodo(`${localName} ${row.from} -> ${row.to}${row.todo ? `: ${row.todo}` : ''}`);
        continue;
      }
      const [toProp, toVal] = splitScoped(row.to);
      const next = toVal ?? row.values?.[v] ?? v;
      if (typeof next !== 'string') {
        pushTodo(`${localName}.${toProp}="${v}" needs structured migration${row.todo ? ` — ${row.todo}` : ''}`);
        continue;
      }
      (attr.name as { name: string }).name = toProp;
      setValue(attr, next);
      changes.push({ transform: 'prop-grammar', description: `${localName}.${prop}="${v}" -> ${toProp}="${next}"` });
      if (row.todo) pushTodo(`${localName}.${toProp}: ${row.todo}`);
    }

    // Values the rows themselves produce, per target prop: an attribute that
    // already carries one is migrated output and must be left alone (keeps a
    // re-run idempotent, e.g. variant="regular" is not a 4.x GlassButton value).
    const produced = new Map<string, Set<string>>();
    const addProduced = (prop: string, v: unknown): void => {
      if (typeof v !== 'string') return;
      (produced.get(prop) ?? produced.set(prop, new Set()).get(prop)!).add(v);
    };
    for (const r of rows) {
      if (r.to === null || !isPropTarget(r.to)) continue;
      const [toProp, toVal] = splitScoped(r.to);
      if (toVal !== undefined) addProduced(toProp, toVal);
      for (const v of Object.values(r.values ?? {})) addProduced(toProp, v);
    }

    // 2. Unscoped rows.
    for (const row of rows) {
      if (row.from.includes(':')) continue;
      const attr = attrs.find((a: any) => a.type === 'JSXAttribute' && a.name?.name === row.from && !handled.has(a) && !removeIdx.has(a));
      if (!attr) continue;
      if (row.to === null && row.from === 'mode' && ctx.mappings.components[exportName]?.to === 'DatePicker' && literalOf(attr)?.static && (literalOf(attr) as { value: string }).value === 'range') {
        const target = Object.entries(ctx.mappings.components).find(([name, mapping]) => name !== 'DateRangePicker' && mapping.to === 'DateRangePicker')?.[0];
        if (!target) { pushTodo(`${localName} range mode requires DateRangePicker`); continue; }
        const localTarget = localName === exportName ? target : localName;
        nameNode.name = localTarget;
        const closing = p.parent.node.closingElement;
        if (closing) closing.name.name = localTarget;
        root.find(j.ImportSpecifier).forEach((ip: any) => {
          if (ip.node.imported.name === exportName && (ip.node.local?.name ?? exportName) === localName) {
            ip.node.imported.name = target;
            if (localName === exportName && ip.node.local) ip.node.local.name = target;
          }
        });
        removeIdx.add(attr);
        changes.push({ transform: 'prop-grammar', description: `${exportName} mode=range -> ${target}` });
        continue;
      }
      if (row.to === null) {
        // A todo of the shape `mode="range" -> DateRangePicker` is a
        // value-triggered component split, not a manual step: on that literal
        // the element and its import rename to the split component (the 4.x
        // name whose canonical target it is, when canonical-names has not run
        // yet) and the selecting prop drops with no marker.
        const split = row.todo ? /^(\w+)="([^"]+)"\s*->\s*(\w+)$/.exec(row.todo.trim()) : null;
        if (split && split[1] === row.from) {
          const got = literalOf(attr);
          if (got?.static && got.value === split[2]) {
            const target = split[3]!;
            const legacy = Object.keys(ctx.mappings.components).find((k) => ctx.mappings.components[k]?.to === target);
            const newName = /^Glass[A-Z]/.test(localName) ? (legacy ?? target) : target;
            if (renameElementAndImport(p, localName, newName)) {
              removeIdx.add(attr);
              changes.push({ transform: 'prop-grammar', description: `${localName} ${row.from}="${split[2]}" -> ${newName}` });
              continue;
            }
          }
        }
        removeIdx.add(attr);
        changes.push({ transform: 'prop-grammar', description: `remove ${localName}.${row.from}` });
        if (row.todo) pushTodo(`${localName} ${row.from}: ${row.todo}`);
        continue;
      }
      if (row.to.includes('.') || !isPropTarget(row.to)) {
        pushTodo(`${localName} ${row.from} -> ${row.to}${row.todo ? `: ${row.todo}` : ''}`);
        continue;
      }
      const rename = (): void => {
        if (row.to === row.from) return;
        (attr.name as { name: string }).name = row.to!;
        changes.push({ transform: 'prop-grammar', description: `${localName}.${row.from} -> ${row.to}` });
      };
      if (row.values) {
        const got = literalOf(attr);
        if (!got || !got.static) {
          // A boolean-valued row (values {true, false}) over a dynamic
          // expression rewrites mechanically to a ternary — the row todo
          // spells the rewrite out (`collapsed={x} -> defaultSidebar={x ?
          // 'rail' : 'expanded'}`), so it needs no review marker.
          const whenTrue = row.values['true'];
          const whenFalse = row.values['false'];
          const expr = (attr.value as { type?: string; expression?: any } | undefined)?.expression;
          if (typeof whenTrue === 'string' && typeof whenFalse === 'string' && expr) {
            rename();
            attr.value = j.jsxExpressionContainer(
              j.conditionalExpression(expr, j.literal(whenTrue), j.literal(whenFalse)),
            ) as never;
            changes.push({ transform: 'prop-grammar', description: `${localName}.${row.to} dynamic boolean -> ternary` });
            continue;
          }
          rename();
          pushTodo(`${localName}.${row.to} value is dynamic${row.todo ? ` — ${row.todo}` : ''}`);
          continue;
        }
        const gotV = got.value;
        if (row.to !== row.from && produced.get(row.from)?.has(gotV)) continue;
        const mapped = row.values[gotV];
        const already = Object.values(row.values).some((v) => v === gotV || (typeof v === 'string' && v.split(':').pop() === gotV));
        if (already && mapped === undefined) {
          rename();
          continue;
        }
        if (typeof mapped === 'string' && mapped.startsWith('intent:')) {
          removeIdx.add(attr);
          extraAttrs.push({ type: 'JSXAttribute', name: { name: 'intent' }, value: { type: 'Literal', value: mapped.slice('intent:'.length) } });
          changes.push({ transform: 'prop-grammar', description: `${localName}.${row.from}="${gotV}" -> intent="${mapped.slice(7)}"` });
        } else if (typeof mapped === 'string') {
          rename();
          setValue(attr, mapped);
          changes.push({ transform: 'prop-grammar', description: `${localName}.${row.to}="${gotV}" -> "${mapped}"` });
        } else if (mapped === undefined) {
          // Unmapped literal: leave the attribute exactly as written.
          pushTodo(`${localName}.${row.from}="${gotV}" unmapped${row.todo ? ` — ${row.todo}` : ''}`);
        } else {
          pushTodo(`${localName}.${row.from}="${gotV}" needs structured migration${row.todo ? ` — ${row.todo}` : ''}`);
        }
      } else {
        rename();
        if (row.from === 'onChange') adaptHandler(attr, localName, row.to);
        if (row.todo && (row.from !== 'onChange' || handlerNeedsSignatureTodo(attr))) {
          pushTodo(`${localName}.${row.to}: ${row.todo}`);
        }
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
