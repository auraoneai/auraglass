/* REQ-QUAL-01 (QUAL). Static reader for `parameters.ag` (S-41 StoryAgParameters) in CSF files.
   Storybook's index.json carries ids, titles, tags and import paths but not parameters, so the
   cert-manifest writer reads `parameters.ag` from the story source. Merge order follows Storybook:
   meta.parameters.ag, then the story's parameters.ag (deep merge of plain objects). */
import ts from 'typescript';
import { evaluate, objectProperty, parseSource, topLevelConsts, unwrap, type StaticValue } from './staticValue.ts';

export type AgValue = { [k: string]: StaticValue };

export interface CsfParameters {
  file: string;
  meta: { title?: string; id?: string; ag?: AgValue };
  /** per export: merged-later ag plus the story's pinned `parameters.__id` when it is a static string
      (Storybook's indexer honours `__id`, so the id in index.json need not derive from title + export). */
  stories: Map<string, { ag?: AgValue; id?: string }>;
}

function isObj(v: StaticValue): v is AgValue {
  return !!v && typeof v === 'object' && !Array.isArray(v);
}

export function mergeAg(base: AgValue | undefined, over: AgValue | undefined): AgValue | undefined {
  if (!base) return over;
  if (!over) return base;
  const out: AgValue = { ...base };
  for (const [k, v] of Object.entries(over)) {
    const prev = out[k];
    out[k] = isObj(prev) && isObj(v) ? (mergeAg(prev, v) as AgValue) : v;
  }
  return out;
}

function agOf(params: ts.Expression | null, sf: ts.SourceFile, consts: Map<string, ts.Expression>): AgValue | undefined {
  if (!params) return undefined;
  let p = unwrap(params);
  if (ts.isIdentifier(p) && consts.has(p.text)) p = unwrap(consts.get(p.text)!);
  if (!ts.isObjectLiteralExpression(p)) {
    // parameters exists but is not a literal: only fatal if it could carry `ag`.
    const v = evaluate(p, sf, consts);
    return isObj(v) && isObj(v.ag as StaticValue) ? (v.ag as AgValue) : undefined;
  }
  const ag = objectProperty(p, 'ag');
  if (!ag) {
    // `{ ...shared, layout }` style: a spread may carry ag, so it must be evaluable.
    if (p.properties.some(ts.isSpreadAssignment)) {
      const v = evaluate(p, sf, consts);
      return isObj(v) && isObj(v.ag as StaticValue) ? (v.ag as AgValue) : undefined;
    }
    return undefined;
  }
  const v = evaluate(ag, sf, consts);
  if (!isObj(v)) throw new Error(`invalid-ag: ${sf.fileName}: parameters.ag must be an object literal`);
  return v;
}

function literalOf(e: ts.Expression, consts: Map<string, ts.Expression>): ts.ObjectLiteralExpression | null {
  let n = unwrap(e);
  if (ts.isIdentifier(n) && consts.has(n.text)) n = unwrap(consts.get(n.text)!);
  if (ts.isCallExpression(n) && n.arguments[0]) {
    // CSF factories: meta({...}) / preview.meta({...}) / meta.story({...})
    const a = unwrap(n.arguments[0]);
    if (ts.isObjectLiteralExpression(a)) return a;
  }
  return ts.isObjectLiteralExpression(n) ? n : null;
}

/** The object literal a same-file factory returns: `const scene = (id) => ({...})` called as
    `scene('photo')`. Returns the literal plus consts extended with parameter → argument bindings,
    so `parameters.ag` templates over the parameters evaluate statically. Null when the callee is
    not a same-file function returning an object literal. */
function factoryLiteral(call: ts.CallExpression, sf: ts.SourceFile, consts: Map<string, ts.Expression>):
  { lit: ts.ObjectLiteralExpression; consts: Map<string, ts.Expression> } | null {
  if (!ts.isIdentifier(call.expression)) return null;
  let fn: ts.ArrowFunction | ts.FunctionExpression | ts.FunctionDeclaration | undefined;
  const init = consts.get(call.expression.text);
  if (init) {
    const u = unwrap(init);
    if (ts.isArrowFunction(u) || ts.isFunctionExpression(u)) fn = u;
  }
  if (!fn) {
    for (const st of sf.statements) {
      if (ts.isFunctionDeclaration(st) && st.name?.text === call.expression.text) { fn = st; break; }
    }
  }
  if (!fn?.body) return null;
  let lit: ts.ObjectLiteralExpression | null = null;
  if (ts.isBlock(fn.body)) {
    for (const st of fn.body.statements) {
      if (ts.isReturnStatement(st) && st.expression) {
        const u = unwrap(st.expression);
        if (ts.isObjectLiteralExpression(u)) { lit = u; break; }
      }
    }
  } else {
    const u = unwrap(fn.body);
    if (ts.isObjectLiteralExpression(u)) lit = u;
  }
  if (!lit) return null;
  const bound = new Map(consts);
  fn.parameters.forEach((p, i) => {
    if (ts.isIdentifier(p.name) && call.arguments[i]) bound.set(p.name.text, call.arguments[i]!);
  });
  return { lit, consts: bound };
}

/** A story's static `parameters.__id`, when the parameters object is a readable literal. */
function pinnedIdOf(lit: ts.ObjectLiteralExpression, sf: ts.SourceFile, consts: Map<string, ts.Expression>): string | undefined {
  const params = objectProperty(lit, 'parameters');
  if (!params) return undefined;
  let p = unwrap(params);
  if (ts.isIdentifier(p) && consts.has(p.text)) p = unwrap(consts.get(p.text)!);
  if (!ts.isObjectLiteralExpression(p)) return undefined;
  const id = objectProperty(p, '__id');
  if (!id) return undefined;
  try {
    const v = evaluate(id, sf, consts);
    return typeof v === 'string' && v ? v : undefined;
  } catch { return undefined; }
}

function stringField(obj: ts.ObjectLiteralExpression, key: string, sf: ts.SourceFile, consts: Map<string, ts.Expression>): string | undefined {
  const e = objectProperty(obj, key);
  if (!e) return undefined;
  const v = evaluate(e, sf, consts);
  if (typeof v !== 'string') throw new Error(`invalid-meta: ${sf.fileName}: default export ${key} must be a string literal`);
  return v;
}

export function readCsfParameters(file: string, text: string): CsfParameters {
  const sf = parseSource(file, text);
  const consts = topLevelConsts(sf);
  const out: CsfParameters = { file, meta: {}, stories: new Map() };
  const assigned = new Map<string, ts.Expression>();   // Story.parameters = {...}

  for (const st of sf.statements) {
    if (ts.isExportAssignment(st) && !st.isExportEquals) {
      const lit = literalOf(st.expression, consts);
      if (lit) {
        const title = stringField(lit, 'title', sf, consts);
        const id = stringField(lit, 'id', sf, consts);
        const ag = agOf(objectProperty(lit, 'parameters'), sf, consts);
        if (title !== undefined) out.meta.title = title;
        if (id !== undefined) out.meta.id = id;
        if (ag) out.meta.ag = ag;
      }
    } else if (ts.isVariableStatement(st) && st.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) {
      for (const d of st.declarationList.declarations) {
        if (!ts.isIdentifier(d.name)) continue;
        let lit = d.initializer ? literalOf(d.initializer, consts) : null;
        let effConsts = consts;
        if (!lit && d.initializer) {
          const init = unwrap(d.initializer);
          if (ts.isCallExpression(init)) {
            const f = factoryLiteral(init, sf, consts);
            if (f) { lit = f.lit; effConsts = f.consts; }
          }
        }
        const ag = lit ? agOf(objectProperty(lit, 'parameters'), sf, effConsts) : undefined;
        const id = lit ? pinnedIdOf(lit, sf, effConsts) : undefined;
        out.stories.set(d.name.text, { ...(ag ? { ag } : {}), ...(id ? { id } : {}) });
      }
    } else if (ts.isFunctionDeclaration(st) && st.name && st.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
      && !st.modifiers.some((m) => m.kind === ts.SyntaxKind.DefaultKeyword)) {
      out.stories.set(st.name.text, {});
    } else if (ts.isExpressionStatement(st) && ts.isBinaryExpression(st.expression)
      && st.expression.operatorToken.kind === ts.SyntaxKind.EqualsToken) {
      const left = st.expression.left;
      if (ts.isPropertyAccessExpression(left) && ts.isIdentifier(left.expression) && left.name.text === 'parameters') {
        assigned.set(left.expression.text, st.expression.right);
      }
    }
  }
  for (const [name, expr] of assigned) {
    const s = out.stories.get(name);
    if (!s) continue;
    const ag = agOf(expr, sf, consts);
    if (ag) s.ag = mergeAg(s.ag, ag) ?? ag;
  }
  return out;
}

/** The effective `parameters.ag` of one story export (meta merged with story). */
export function storyAg(csf: CsfParameters, exportName: string): AgValue | undefined {
  const s = csf.stories.get(exportName);
  if (!s) throw new Error(`unknown-story-export: ${csf.file} has no story export '${exportName}'`);
  return mergeAg(csf.meta.ag, s.ag);
}
