/* @jest-environment node */
import { describe, expect, it } from '@jest/globals';
/* REQ-CMP-133: fragments/codemods/cmp.ts props rows are generated from metas —
   for every CMP meta migration row, migration.props deep-equals the fragment
   rows for that component, and no value lands outside the target component's
   variant enum. */
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import * as ts from 'typescript';

/* ---- static literal eval (mirror of scripts/cmp/gen-fragments.mjs) -------- */
const evalExpr = (node: ts.Expression): unknown => {
  if (ts.isStringLiteral(node)) return node.text;
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (node.kind === ts.SyntaxKind.NullKeyword) return null;
  if (ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isPrefixUnaryExpression(node) && node.operator === ts.SyntaxKind.MinusToken) return -(evalExpr(node.operand) as number);
  if (ts.isAsExpression(node) || ts.isSatisfiesExpression(node) || ts.isParenthesizedExpression(node) || ts.isNonNullExpression(node)) {
    return evalExpr(node.expression);
  }
  if (ts.isPropertyAccessExpression(node) && ts.isIdentifier(node.expression)) {
    return `${evalExpr(node.expression)}.${node.name.text}`;
  }
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(evalExpr);
  if (ts.isObjectLiteralExpression(node)) {
    const out: Record<string, unknown> = {};
    for (const p of node.properties) {
      if (!ts.isPropertyAssignment(p)) throw new Error(`non-literal member: ${p.getText()}`);
      const key = ts.isComputedPropertyName(p.name) ? evalExpr(p.name.expression) as string : p.name.text;
      out[key] = evalExpr(p.initializer);
    }
    return out;
  }
  /* S-44: metas spell budgetKb as limitBytes / 1024 (e.g. `10000 / 1024`);
     fold numeric arithmetic over literal operands only. */
  if (ts.isBinaryExpression(node)) {
    const l = evalExpr(node.left), r = evalExpr(node.right);
    if (typeof l === 'number' && typeof r === 'number') {
      switch (node.operatorToken.kind) {
        case ts.SyntaxKind.SlashToken: return l / r;
        case ts.SyntaxKind.AsteriskToken: return l * r;
        case ts.SyntaxKind.PlusToken: return l + r;
        case ts.SyntaxKind.MinusToken: return l - r;
      }
    }
  }
  if (ts.isIdentifier(node) && node.text === 'undefined') return undefined;
  throw new Error(`non-literal expression: ${node.getText().slice(0, 80)}`);
};

const readDefaultExport = (file: string): unknown => {
  const sf = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const consts = new Map<string, ts.Expression>();
  const unwrap = (e: ts.Expression): ts.Expression => {
    if (ts.isCallExpression(e)) {
      const firstArgument = e.arguments[0];
      if (!firstArgument) throw new Error(`${file}: expected a wrapper argument`);
      return firstArgument;
    }
    if (ts.isIdentifier(e) && consts.has(e.text)) return consts.get(e.text)!;
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
    if (ts.isExportAssignment(st) && !st.isExportEquals) return evalExpr(unwrap(st.expression));
  }
  for (const st of sf.statements) {
    const exported = ts.canHaveModifiers(st) && ts.getModifiers(st)?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
    if (ts.isVariableStatement(st) && exported) {
      for (const d of st.declarationList.declarations) {
        if (ts.isIdentifier(d.name) && d.initializer) return evalExpr(unwrap(d.initializer));
      }
    }
  }
  throw new Error(`${file}: no export literal`);
};

const ROOT = process.cwd();
const metaFiles = () => execSync("find src -name '*.meta.ts' | sort", { cwd: ROOT, encoding: 'utf8' })
  .trim().split('\n').filter(Boolean).map((f) => join(ROOT, f));

interface PropRow { component: string; from: string; to: string | null; values?: Record<string, unknown>; todo?: string }
type MetaVal = string | { to: string; values?: Record<string, unknown> } | null;
interface Meta {
  name: string; owner?: string; variants?: Record<string, string[]>;
  migration?: Array<{ from: string; props?: Record<string, MetaVal> }>;
}

const fragment = readDefaultExport(join(ROOT, 'fragments/codemods/cmp.ts')) as {
  props?: PropRow[];
  renames?: Array<{ from: string; fromEntry: string; to: string; toEntry: string; compatOnly?: boolean }>;
  removed?: Array<{ symbol: string }>;
};
const metas = metaFiles().map(readDefaultExport).filter((m) => (m as Meta)?.owner === 'CMP' && Array.isArray((m as Meta).migration)) as Meta[];

const rowToMetaVal = (r: PropRow): MetaVal => {
  if (r.to === null) return null;
  if (r.values) return { to: r.to, values: r.values };
  return r.to;
};

const norm = (v: MetaVal): MetaVal =>
  (v && typeof v === 'object' && Object.keys(v).every((k) => k === 'to') ? (v as { to: string }).to : v);

describe('REQ-CMP-133 fragment props == meta migration.props', () => {
  it('every CMP meta migration.props deep-equals its fragment rows', () => {
    const byComponent = new Map<string, Record<string, MetaVal>>();
    for (const row of fragment.props ?? []) {
      if (!byComponent.has(row.component)) byComponent.set(row.component, {});
      byComponent.get(row.component)![row.from] = rowToMetaVal(row);
    }
    /* expected per-component union mirrors the generator's merge: later rows
       override, preferring non-null `to` and value maps. */
    const expectedByComponent = new Map<string, Record<string, MetaVal>>();
    const preferE = (a: MetaVal | undefined, b: MetaVal): MetaVal => {
      if (a === undefined) return b;
      if (a === null && b !== null) return b;
      if (!(a && typeof a === 'object' && 'values' in a) && b && typeof b === 'object' && 'values' in b) return b;
      return a;
    };
    for (const meta of metas) {
      for (const row of meta.migration!) {
        if (!row.props || !Object.keys(row.props).length) continue;
        if (!expectedByComponent.has(row.from)) expectedByComponent.set(row.from, {});
        const tgt = expectedByComponent.get(row.from)!;
        for (const [k, v] of Object.entries(row.props)) tgt[k] = preferE(tgt[k], norm(v));
      }
    }
    const mismatches: string[] = [];
    for (const [component, expected] of expectedByComponent) {
      const got = byComponent.get(component);
      if (!got) { mismatches.push(`${component}: no fragment rows`); continue; }
      try { expect(got).toEqual(expected); } catch { mismatches.push(`${component}: props differ`); }
    }
    expect(mismatches).toEqual([]);
  });

  it('no generated value lands outside the target component variant enum', () => {
    const targetOf = new Map<string, Meta>();
    for (const m of metas) for (const r of m.migration ?? []) targetOf.set(r.from, m);
    const bad: string[] = [];
    for (const row of fragment.props ?? []) {
      const meta = targetOf.get(row.component);
      if (!meta?.variants) continue;
      const check = (prop: string, val: unknown) => {
        const enumVals = meta.variants?.[prop];
        if (enumVals && typeof val === 'string' && !enumVals.includes(val)) {
          bad.push(`${row.component}.${row.from}: '${val}' not in ${meta.name}.${prop} enum`);
        }
      };
      if (typeof row.to === 'string' && row.to.includes(':')) {
        const separator = row.to.indexOf(':');
        check(row.to.slice(0, separator), row.to.slice(separator + 1));
      }
      for (const v of Object.values(row.values ?? {})) {
        if (typeof v === 'string' && typeof row.to === 'string') {
          if (row.to.includes(':')) { check(row.to.slice(0, row.to.indexOf(':')), v); }
          else check(row.to, v);
        }
      }
    }
    expect(bad).toEqual([]);
  });

  it('every CMP meta migration `from` has a renames or removed row', () => {
    const renamed = new Set((fragment.renames ?? []).map((r) => r.from));
    const removed = new Set((fragment.removed ?? []).map((r) => r.symbol));
    const missing: string[] = [];
    for (const m of metas) for (const r of m.migration ?? []) {
      if (!renamed.has(r.from) && !removed.has(r.from)) missing.push(r.from);
    }
    expect(missing).toEqual([]);
  });

  /* REQ-CMP-133: mappings never guess. A root rename must land on a real 5.0 root export (ROOT_EXPORTS); a name
     with no root target (GlassStepper: Steps is not a 5.0 export) routes to its compat adapter, which makes the
     engine write TODO_MARKER, and the routing is decided by the import path (fromEntry), not by the name alone. */
  it('root renames target ROOT_EXPORTS; GlassStepper routes to compat by import path', async () => {
    const { ROOT_EXPORTS } = await import('../../src/contracts/entries');
    const root = new Set<string>(Object.values(ROOT_EXPORTS).flat() as string[]);
    const bad = (fragment.renames ?? [])
      .filter((r) => r.from !== '*' && r.toEntry === '.' && !r.compatOnly && !root.has(r.to.split('.')[0]!))
      .map((r) => `${r.fromEntry}:${r.from} -> ${r.to}`);
    expect(bad).toEqual([]);
    expect((fragment.renames ?? []).filter((r) => r.from === 'GlassStepper'))
      .toEqual([{ from: 'GlassStepper', fromEntry: '.', to: 'GlassStepper', toEntry: '.', compatOnly: true }]);
    const compat = readFileSync(join(ROOT, 'src/compat/cmp/index.ts'), 'utf8');
    expect(compat).toMatch(/export \* from '\.\/core\/GlassStepper';/);
  });
});
