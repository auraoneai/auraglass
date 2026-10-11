/**
 * css-vars (B9): --glass-* -> --ag-* per the merged cssVars map (null = deleted
 * token -> TODO). Covers .css files (declarations + var() + custom property
 * definitions), CSS modules, inline style objects, template literals and
 * computed names. Computed/dynamic names stay unchanged with a TODO.
 */
import postcss, { type Declaration } from 'postcss';
import { j, type FileUnit, type Transform, type TransformCtx, type TransformResult } from './shared.js';
import { cssTodoLine, todoLine } from '../todo.js';

const DOC = 'docs/auraglass-5/migrate/5.md#b-9';

function mapVar(name: string, ctx: TransformCtx): string | null | undefined {
  if (name in ctx.mappings.cssVars) return ctx.mappings.cssVars[name] ?? null;
  return undefined; // unmapped
}

function applyCss(source: string, ctx: TransformCtx): TransformResult {
  const changes: TransformResult['changes'] = [];
  const todos: TransformResult['todos'] = [];
  const root = postcss.parse(source, { from: unitPath(ctx) });
  function unitPath(c: TransformCtx): string | undefined { return c.file.path; }
  root.walkDecls((decl: Declaration) => {
    if (decl.prop.startsWith('--glass-')) {
      const mapped = mapVar(decl.prop, ctx);
      if (mapped === null) {
        todos.push({ transform: 'css-vars', reason: `token ${decl.prop} was deleted in 5.0`, doc: DOC });
        decl.replaceWith(postcss.comment({ text: ` TODO(aura-glass 5): token ${decl.prop} deleted, see ${DOC} ` }));
      } else if (mapped) {
        decl.prop = mapped;
        changes.push({ transform: 'css-vars', description: `${decl.prop} decl -> ${mapped}` });
      } else {
        todos.push({ transform: 'css-vars', reason: `unmapped token ${decl.prop}`, doc: DOC });
        decl.replaceWith(postcss.comment({ text: ` TODO(aura-glass 5): unmapped ${decl.prop}, see ${DOC} ` }));
      }
    }
    decl.value = decl.value.replace(/var\(\s*(--glass-[\w-]+)/g, (m, name: string) => {
      const mapped = mapVar(name, ctx);
      if (mapped === null) {
        todos.push({ transform: 'css-vars', reason: `deleted token ${name} referenced via var()`, doc: DOC });
        return m;
      }
      if (mapped) {
        changes.push({ transform: 'css-vars', description: `var(${name}) -> var(${mapped})` });
        return m.replace(name, mapped);
      }
      todos.push({ transform: 'css-vars', reason: `unmapped token ${name} referenced via var()`, doc: DOC });
      return m;
    });
  });
  const out = root.toString();
  return { source: out, changes, todos };
}

function applyCode(source: string, ctx: TransformCtx): TransformResult {
  const changes: TransformResult['changes'] = [];
  const todos: TransformResult['todos'] = [];
  const root = j(source);
  // String literals: 'var(--glass-x)' or '--glass-x' anywhere in code.
  root.find(j.Literal).forEach((p: any) => {
    const v = p.node.value;
    if (typeof v !== 'string' || !v.includes('--glass-')) return;
    const next = v.replace(/--glass-[\w-]+/g, (name) => {
      const mapped = mapVar(name, ctx);
      if (mapped === null) {
        todos.push({ transform: 'css-vars', reason: `token ${name} was deleted in 5.0`, doc: DOC });
        return name;
      }
      if (mapped) {
        changes.push({ transform: 'css-vars', description: `${name} -> ${mapped}` });
        return mapped;
      }
      todos.push({ transform: 'css-vars', reason: `unmapped token ${name}`, doc: DOC });
      return name;
    });
    if (next !== v) p.node.value = next;
  });
  // Template literals: `--glass-${x}` computed names are NOT rewritten — TODO.
  root.find(j.TemplateLiteral).forEach((p: any) => {
    const hasGlass = (p.node.quasis ?? []).some((q: any) => ((q.value as { cooked?: string }).cooked ?? '').includes('--glass-'));
    if (!hasGlass) return;
    if ((p.node.expressions ?? []).length > 0) {
      todos.push({ transform: 'css-vars', reason: 'computed --glass-* token name — resolve to the mapped --ag-* token', doc: DOC });
      return;
    }
    for (const q of p.node.quasis ?? []) {
      const raw = (q.value as { cooked?: string; raw?: string });
      const next = (raw.cooked ?? '').replace(/--glass-[\w-]+/g, (name) => {
        const mapped = mapVar(name, ctx);
        if (mapped) {
          changes.push({ transform: 'css-vars', description: `${name} -> ${mapped}` });
          return mapped;
        }
        todos.push({ transform: 'css-vars', reason: mapped === null ? `token ${name} was deleted in 5.0` : `unmapped token ${name}`, doc: DOC });
        return name;
      });
      if (raw.cooked) raw.cooked = next;
      if (raw.raw) raw.raw = next;
    }
  });
  let out = changes.length || todos.length ? root.toSource({ quote: 'single', reuseWhitespace: true }) : source;
  if (todos.length && !out.includes(todoLine('', ''))) {
    for (const t of todos) {
      const marker = todoLine(t.reason, t.doc);
      if (!out.includes(marker)) out = `${marker}\n${out}`;
    }
  }
  return { source: out, changes, todos };
}

export const cssVars: Transform = {
  id: 'css-vars',
  run(unit: FileUnit, ctx: TransformCtx): TransformResult {
    if (!/--glass-/.test(unit.source)) return { source: unit.source, changes: [], todos: [] };
    if (unit.kind === 'css') return applyCss(unit.source, ctx);
    if (unit.kind === 'code') return applyCode(unit.source, ctx);
    return { source: unit.source, changes: [], todos: [] };
  },
};

export const _cssTodo = cssTodoLine;
