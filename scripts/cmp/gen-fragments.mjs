#!/usr/bin/env node
/* scripts/cmp/gen-fragments.mjs — CMP codemod-fragment generator (REQ-CMP-133).

   Reads every CMP-owned *.meta.ts via a TS-AST literal walk, extracts
   migration[] rows, and syncs fragments/codemods/cmp.ts:

     --props    print generated props rows (flat fragment grammar) as JSON
     --renames  print rename rows for meta `from`s missing from the fragment
     --write    rewrite the <generated> props block and append missing
                renames inside fragments/codemods/cmp.ts
     (default)  --write plus a summary

   Grammar mapping (meta value -> fragment row):
     null            -> { component, from: key, to: null }
     'target'        -> { component, from: key, to: 'target' }
     { to, values? } -> { component, from: key, to: val.to, values? }
   `key` is either a prop name or `prop:value` (value-scoped) — both pass
   through verbatim as the row's `from`. */
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const ROOT = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const FRAGMENT = join(ROOT, 'fragments/codemods/cmp.ts');

/* ---- static literal evaluator -------------------------------------------
   Evaluates the object/array/string/number/boolean/null literals used in
   metas and fragments. Throws on anything non-literal so callers fail loud. */
const evalExpr = (node) => {
  if (!node) throw new Error('missing node');
  if (ts.isStringLiteral(node) || ts.isNumericLiteral(node)) {
    return ts.isNumericLiteral(node) ? Number(node.text) : node.text;
  }
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (node.kind === ts.SyntaxKind.NullKeyword) return null;
  if (ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isPrefixUnaryExpression(node) && node.operator === ts.SyntaxKind.MinusToken) return -evalExpr(node.operand);
  if (ts.isAsExpression(node) || ts.isSatisfiesExpression(node) || ts.isParenthesizedExpression(node) || ts.isNonNullExpression(node)) {
    return evalExpr(node.expression);
  }
  if (ts.isPropertyAccessExpression(node) && ts.isIdentifier(node.expression)) {
    return `${evalExpr(node.expression)}.${node.name.text}`;
  }
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(evalExpr);
  if (ts.isObjectLiteralExpression(node)) {
    const out = {};
    for (const p of node.properties) {
      if (!ts.isPropertyAssignment(p)) throw new Error(`non-literal member in object: ${p.getText()}`);
      const key = ts.isComputedPropertyName(p.name) ? evalExpr(p.name.expression) : p.name.text;
      out[key] = evalExpr(p.initializer);
    }
    return out;
  }
  if (ts.isIdentifier(node) && node.text === 'undefined') return undefined;
  throw new Error(`non-literal expression: ${node.getText().slice(0, 80)}`);
};

/** value of `export default <expr>` (unwraps defineMeta({...}) style calls;
   resolves a bare `export default ident` through the file's consts). */
export const readDefaultExport = (file, kind = ts.ScriptKind.TS) => {
  const sf = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, kind);
  const consts = new Map();
  const unwrap = (e) => {
    if (ts.isCallExpression(e)) return e.arguments[0];
    if (ts.isIdentifier(e) && consts.has(e.text)) return consts.get(e.text);
    if (ts.isAsExpression(e) || ts.isSatisfiesExpression(e)) return unwrap(e.expression);
    return e;
  };
  for (const st of sf.statements) {
    if (ts.isVariableStatement(st)) {
      for (const d of st.declarationList.declarations) {
        if (ts.isIdentifier(d.name) && d.initializer) consts.set(d.name.text, unwrap(d.initializer));
      }
    }
  }
  for (const st of sf.statements) {
    if (ts.isExportAssignment(st) && !st.isExportEquals) {
      return evalExpr(unwrap(st.expression));
    }
  }
  // `export const XMeta = defineMeta({...})` — no default export
  for (const st of sf.statements) {
    const exported = st.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
    if (ts.isVariableStatement(st) && exported) {
      for (const d of st.declarationList.declarations) {
        if (ts.isIdentifier(d.name) && d.initializer) return evalExpr(unwrap(d.initializer));
      }
    }
  }
  throw new Error(`${file}: no export literal`);
};

export const listMetaFiles = () => execSync(
  "find src -name '*.meta.ts' | sort", { cwd: ROOT, encoding: 'utf8' },
).trim().split('\n').filter(Boolean).map((f) => join(ROOT, f));

export const loadMeta = (file) => readDefaultExport(file);
export const loadFragment = () => readDefaultExport(FRAGMENT);

/** fragment parsed with the generated-renames marker block stripped, so
   generation is idempotent — emitted rows never count as "existing". */
const loadFragmentNoGen = () => {
  const t = readFileSync(FRAGMENT, 'utf8').replace(
    /\n?    \/\/ <generated renames — do not hand-edit>\n(?:.*?\n)*?    \/\/ <\/generated>/, '');
  const sf = ts.createSourceFile(FRAGMENT, t, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  for (const st of sf.statements) {
    if (ts.isExportAssignment(st) && !st.isExportEquals) {
      const e = st.expression;
      return evalExpr(ts.isCallExpression(e) ? e.arguments[0] : e);
    }
  }
  throw new Error('cmp.ts: no default export literal');
};

export const propRows = (component, props = {}) =>
  Object.entries(props).map(([key, val]) => {
    if (val === null) return { component, from: key, to: null };
    if (typeof val === 'string') return { component, from: key, to: val };
    if (val && typeof val === 'object' && 'to' in val) {
      const row = { component, from: key, to: val.to };
      if (val.values) row.values = val.values;
      return row;
    }
    throw new Error(`${component}.${key}: unrecognized meta props value ${JSON.stringify(val)}`);
  });

export const cmpMetas = () =>
  listMetaFiles().map(loadMeta).filter((m) => m?.owner === 'CMP' && Array.isArray(m.migration));

/* Merge rule for multi-meta components (e.g. GlassModal in Dialog + AlertDialog
   metas): union of all migration rows' props, one row per (component, prop);
   on conflict prefer non-null `to`, then prefer a row carrying `values`. */
const prefer = (a, b) => {
  if (!a) return b;
  if (a.to === null && b.to !== null) return b;
  if (!a.values && b.values) return b;
  return a;
};

const genPropRows = (metas) => {
  const map = new Map();
  for (const m of metas) {
    for (const r of m.migration) {
      if (!r.props) continue;
      for (const row of propRows(r.from, r.props)) {
        const key = `${row.component} ${row.from}`;
        map.set(key, prefer(map.get(key), row));
      }
    }
  }
  return [...map.values()];
};

const genRenameRows = (metas, existing) => {
  const seen = new Set(existing.map((r) => `${r.fromEntry} ${r.from}`));
  const rows = [];
  for (const m of metas) {
    for (const r of m.migration) {
      const key = `. ${r.from}`;
      if (seen.has(key)) continue;
      seen.add(key);
      rows.push({ from: r.from, fromEntry: '.', to: m.name, toEntry: '.' });
    }
  }
  return rows.sort((a, b) => a.from.localeCompare(b.from));
};

const serialize = (v) => {
  let s = JSON.stringify(v);
  s = s.replace(/"([^"\n]+)":/g, '$1: ');
  s = s.replace(/"((?:[^"\\]|\\.)*)"/g, "'$1'");
  s = s.replace(/\{/g, '{ ').replace(/\}/g, ' }');
  return s;
};

const main = () => {
  const args = process.argv.slice(2);
  const metas = cmpMetas();

  if (args.includes('--props')) {
    console.log(JSON.stringify(genPropRows(metas), null, 2));
    return;
  }
  if (args.includes('--renames')) {
    console.log(JSON.stringify(genRenameRows(metas, loadFragmentNoGen().renames ?? []), null, 2));
    return;
  }

  const frag = loadFragmentNoGen();
  const props = genPropRows(metas);
  const renames = genRenameRows(metas, frag.renames ?? []);
  let t = readFileSync(FRAGMENT, 'utf8');

  const PROPS_RE = /  props: \[\n(?:.*?\n)*?  \],/;
  const propsBlock = `  props: [\n    // <generated by scripts/cmp/gen-fragments.mjs — do not hand-edit>\n${props.map((r) => `    ${serialize(r)},`).join('\n')}\n    // </generated>\n  ],`;
  if (!PROPS_RE.test(t)) throw new Error('props block not found in cmp.ts');
  t = t.replace(PROPS_RE, propsBlock);

  if (renames.length || /generated renames/.test(t)) {
    const GEN_RE = /    \/\/ <generated renames — do not hand-edit>\n(?:.*?\n)*?    \/\/ <\/generated>\n/;
    const block = `    // <generated renames — do not hand-edit>\n${renames.map((r) => `    ${serialize(r)},`).join('\n')}\n    // </generated>\n`;
    t = GEN_RE.test(t)
      ? t.replace(GEN_RE, block)
      : t.replace(/  \],\n  props:/, `${block}  ],\n  props:`);
  }

  writeFileSync(FRAGMENT, t);
  console.log(`gen-fragments: wrote ${props.length} props rows, ${renames.length} new renames into ${FRAGMENT.replace(ROOT + '/', '')}`);
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try { main(); } catch (e) { console.error(e); process.exit(1); }
}
