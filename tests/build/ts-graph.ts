/* REQ-PLAT-65/66: TypeScript-compiler-API scans over src/ and dist/ shared by the
   tests/build gates. Parsing (not regex) keeps type-only imports, comments and
   strings from producing false module edges. */
import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import ts from 'typescript';
import { ROOT, SRC } from './helpers';

const RUNTIME_EXTS = ['.ts', '.tsx', '.js', '.mjs', '.jsx'];

/** PRD REQ-PLAT-65 exclusions: tests, stories and the contract seed/testing modules. */
export const EXCLUDED_SRC = new Set(
  ['seed.tsx', 'testing.ts', 'fragments.ts', 'load-fragments.mjs'].map((f) => join(SRC, 'contracts', f)),
);
export function isExcludedSource(file: string): boolean {
  return EXCLUDED_SRC.has(file) || /(\.test|\.spec|\.stories)\.[cm]?[jt]sx?$|\/__tests__\//.test(file);
}

const parsed = new Map<string, ts.SourceFile>();
export function parse(file: string): ts.SourceFile {
  let sf = parsed.get(file);
  if (!sf) {
    const kind = /\.tsx$/.test(file) ? ts.ScriptKind.TSX : /\.[cm]?jsx?$/.test(file) ? ts.ScriptKind.JS : ts.ScriptKind.TS;
    sf = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, kind);
    parsed.set(file, sf);
  }
  return sf;
}

/** Resolve a src-internal runtime specifier (relative or @/ alias) to a file, else null. */
export function resolveSrc(spec: string, from: string): string | null {
  let base: string;
  if (spec.startsWith('@/')) base = join(SRC, spec.slice(2));
  else if (spec.startsWith('.')) base = resolve(dirname(from), spec);
  else return null;
  if (/\.css$/.test(base)) return null;
  for (const e of RUNTIME_EXTS) if (existsSync(base + e)) return base + e;
  for (const e of RUNTIME_EXTS) if (existsSync(join(base, 'index' + e))) return join(base, 'index' + e);
  if (existsSync(base) && statSync(base).isFile() && RUNTIME_EXTS.some((e) => base.endsWith(e))) return base;
  return null;
}

const hasModifier = (s: ts.Node, kind: ts.SyntaxKind) =>
  !!(ts.canHaveModifiers(s) && ts.getModifiers(s)?.some((m) => m.kind === kind));

/** A statement that emits no JavaScript of its own (types, re-exports, imports, directives, `export {}`). */
export function isTypeOrForwardingStatement(s: ts.Statement): boolean {
  if (ts.isImportDeclaration(s) || ts.isImportEqualsDeclaration(s)) return true;
  if (ts.isExportDeclaration(s)) return true; // `export {..} from`, `export *`, `export { local }`, `export {}`
  if (ts.isInterfaceDeclaration(s) || ts.isTypeAliasDeclaration(s)) return true;
  if (ts.isModuleDeclaration(s) || hasModifier(s, ts.SyntaxKind.DeclareKeyword)) return true;
  if (ts.isExpressionStatement(s) && ts.isStringLiteral(s.expression)) return true; // directive prologue
  if (ts.isEmptyStatement(s)) return true;
  return false;
}

type Binding = [file: string, name: string];
interface ModuleShape {
  /** top-level runtime statements: the local names each declares and the identifiers it references. */
  stmts: { declares: string[]; refs: Set<string>; effect: boolean }[];
  /** local name -> index into stmts. */
  declaredAt: Map<string, number>;
  /** exported name -> local name. */
  exportsLocal: Map<string, string>;
  /** exported name -> forwarded binding (re-export, or import-then-export). */
  forwards: Map<string, Binding>;
  /** `export * from` targets. */
  stars: string[];
  /** imported local binding -> source binding. */
  imported: Map<string, Binding>;
  /** dynamic import() targets (followed once the module emits). */
  dynamic: string[];
}

const isRefPosition = (n: ts.Identifier): boolean => {
  const p = n.parent;
  if (!p) return true;
  if (ts.isPropertyAccessExpression(p) && p.name === n) return false;
  if ((ts.isPropertyAssignment(p) || ts.isMethodDeclaration(p) || ts.isPropertyDeclaration(p)
    || ts.isGetAccessorDeclaration(p) || ts.isSetAccessorDeclaration(p) || ts.isEnumMember(p)) && p.name === n) return false;
  if (ts.isJsxAttribute(p) && p.name === n) return false;
  if (ts.isImportSpecifier(p) || ts.isExportSpecifier(p) || ts.isImportClause(p) || ts.isNamespaceImport(p)) return false;
  if (ts.isLabeledStatement(p) || ts.isBreakOrContinueStatement(p)) return false;
  return true;
};

function collectRefs(node: ts.Node, into: Set<string>): void {
  const visit = (n: ts.Node): void => {
    if (ts.isTypeNode(n) || ts.isInterfaceDeclaration(n) || ts.isTypeAliasDeclaration(n)) return;
    if (ts.isIdentifier(n)) { if (isRefPosition(n)) into.add(n.text); return; }
    if (ts.isShorthandPropertyAssignment(n)) into.add(n.name.text);
    ts.forEachChild(n, visit);
  };
  visit(node);
}

function bindingNames(n: ts.BindingName, out: string[]): string[] {
  if (ts.isIdentifier(n)) out.push(n.text);
  else for (const el of n.elements) if (!ts.isOmittedExpression(el)) bindingNames(el.name, out);
  return out;
}

const shapes = new Map<string, ModuleShape>();
export function shapeOf(file: string): ModuleShape {
  const hit = shapes.get(file);
  if (hit) return hit;
  const sf = parse(file);
  const shape: ModuleShape = {
    stmts: [], declaredAt: new Map(), exportsLocal: new Map(), forwards: new Map(), stars: [], imported: new Map(), dynamic: [],
  };
  const localExports: [string, string][] = [];
  const pushStmt = (declares: string[], refs: Set<string>) => {
    for (const d of declares) refs.delete(d);
    const idx = shape.stmts.length;
    shape.stmts.push({ declares, refs, effect: declares.length === 0 });
    for (const d of declares) shape.declaredAt.set(d, idx);
  };
  for (const s of sf.statements) {
    if (ts.isImportDeclaration(s)) {
      const target = ts.isStringLiteral(s.moduleSpecifier) ? resolveSrc(s.moduleSpecifier.text, file) : null;
      const c = s.importClause;
      if (!target || !c || c.isTypeOnly) continue; // external, bare (moduleSideEffects:false) or type-only
      if (c.name) shape.imported.set(c.name.text, [target, 'default']);
      if (c.namedBindings && ts.isNamespaceImport(c.namedBindings)) shape.imported.set(c.namedBindings.name.text, [target, '*']);
      if (c.namedBindings && ts.isNamedImports(c.namedBindings)) {
        for (const el of c.namedBindings.elements) if (!el.isTypeOnly) shape.imported.set(el.name.text, [target, (el.propertyName ?? el.name).text]);
      }
      continue;
    }
    if (ts.isExportDeclaration(s)) {
      if (s.isTypeOnly) continue;
      const target = s.moduleSpecifier && ts.isStringLiteral(s.moduleSpecifier) ? resolveSrc(s.moduleSpecifier.text, file) : null;
      if (s.moduleSpecifier && !target) continue; // external re-export
      if (!s.exportClause) { shape.stars.push(target!); continue; }
      if (ts.isNamespaceExport(s.exportClause)) { shape.forwards.set(s.exportClause.name.text, [target!, '*']); continue; }
      for (const el of s.exportClause.elements) {
        if (el.isTypeOnly) continue;
        const from = (el.propertyName ?? el.name).text;
        if (target) shape.forwards.set(el.name.text, [target, from]);
        else localExports.push([el.name.text, from]);
      }
      continue;
    }
    if (ts.isExportAssignment(s)) {
      if (ts.isIdentifier(s.expression)) { localExports.push(['default', s.expression.text]); continue; }
      const refs = new Set<string>();
      collectRefs(s.expression, refs);
      pushStmt(['*default*'], refs);
      shape.exportsLocal.set('default', '*default*');
      continue;
    }
    if (isTypeOrForwardingStatement(s)) continue;
    const declares: string[] = [];
    if (ts.isVariableStatement(s)) for (const d of s.declarationList.declarations) bindingNames(d.name, declares);
    else if ((ts.isFunctionDeclaration(s) || ts.isClassDeclaration(s) || ts.isEnumDeclaration(s)) && s.name) declares.push(s.name.text);
    else if ((ts.isFunctionDeclaration(s) || ts.isClassDeclaration(s)) && hasModifier(s, ts.SyntaxKind.DefaultKeyword)) declares.push('*default*');
    const refs = new Set<string>();
    collectRefs(s, refs);
    pushStmt(declares, refs);
    if (hasModifier(s, ts.SyntaxKind.ExportKeyword)) {
      if (hasModifier(s, ts.SyntaxKind.DefaultKeyword)) shape.exportsLocal.set('default', declares[0] ?? '*default*');
      else for (const d of declares) shape.exportsLocal.set(d, d);
    }
  }
  for (const [exported, local] of localExports) {
    const imp = shape.imported.get(local);
    if (imp && !shape.declaredAt.has(local)) shape.forwards.set(exported, imp);
    else shape.exportsLocal.set(exported, local);
  }
  const dyn = (n: ts.Node): void => {
    if (ts.isCallExpression(n) && n.expression.kind === ts.SyntaxKind.ImportKeyword) {
      const a = n.arguments[0];
      const t = a && ts.isStringLiteral(a) ? resolveSrc(a.text, file) : null;
      if (t) shape.dynamic.push(t);
    }
    ts.forEachChild(n, dyn);
  };
  dyn(sf);
  shapes.set(file, shape);
  return shape;
}

/**
 * Statement-level reachability from the build entries (each entry demands every export),
 * mirroring the bundler's `treeshake.moduleSideEffects: false`. Returns
 *   reachable — every src module touched by a live import edge;
 *   emitting  — the subset with live runtime code of its own, plus the entries; each must
 *               emit exactly one dist js.
 * Pure forwarding barrels and type-only modules are reachable but own no code, and
 * `skip(file)` modules (excluded sources, external seams) are never followed.
 */
export function bindingGraph(entries: string[], skip: (file: string) => boolean): { reachable: Set<string>; emitting: Set<string> } {
  const demanded = new Map<string, Set<string>>();
  const live = new Map<string, Set<number>>();
  const reachable = new Set<string>();
  const emitting = new Set<string>();
  const queue: Binding[] = entries.map((e) => [e, '*']);
  const entrySet = new Set(entries);
  const markLocal = (file: string, sh: ModuleShape, local: string): void => {
    const idx = sh.declaredAt.get(local);
    if (idx !== undefined) liveStmt(file, sh, idx);
    else { const imp = sh.imported.get(local); if (imp) queue.push(imp); }
  };
  const liveStmt = (file: string, sh: ModuleShape, idx: number): void => {
    let set = live.get(file);
    if (!set) live.set(file, (set = new Set()));
    if (set.has(idx)) return;
    set.add(idx);
    if (!emitting.has(file)) {
      emitting.add(file);
      // an emitted module keeps its top-level effect statements and dynamic imports
      sh.stmts.forEach((st, i) => { if (st.effect) liveStmt(file, sh, i); });
      for (const d of sh.dynamic) queue.push([d, '*']);
    }
    for (const r of sh.stmts[idx]!.refs) markLocal(file, sh, r);
  };
  while (queue.length) {
    const [file, name] = queue.pop()!;
    if (skip(file)) continue;
    reachable.add(file);
    let seen = demanded.get(file);
    if (!seen) demanded.set(file, (seen = new Set()));
    if (seen.has(name) || seen.has('*')) continue;
    seen.add(name);
    const sh = shapeOf(file);
    if (entrySet.has(file)) emitting.add(file);
    if (name === '*') {
      for (const local of sh.exportsLocal.values()) markLocal(file, sh, local);
      for (const f of sh.forwards.values()) queue.push(f);
      for (const s of sh.stars) queue.push([s, '*']);
    } else if (sh.exportsLocal.has(name)) markLocal(file, sh, sh.exportsLocal.get(name)!);
    else if (sh.forwards.has(name)) queue.push(sh.forwards.get(name)!);
    else for (const s of sh.stars) queue.push([s, name]);
  }
  return { reachable, emitting };
}

/** `/*#__PURE__*\/` (or `@__PURE__`) annotation directly before node `n`. */
function pureAnnotated(text: string, n: ts.Node): boolean {
  return /\/\*\s*[#@]__PURE__\s*\*\/\s*$/.test(text.slice(n.getFullStart(), n.getStart()));
}

/** Top-level statements of an emitted dist module that are not pure (REQ-PLAT-65):
 *  allowed are import/export, function/class declarations and variable declarations
 *  whose initialiser is a literal, a function, an alias, or a pure-annotated call.
 *  Each offender is reported by a stable key: `X.prop =` for a member assignment,
 *  `callee(` for a bare call, `name =` for a declaration. */
export function impureTopLevel(file: string): string[] {
  return impureTopLevelNodes(file).map(statementKey);
}

function statementKey(n: ts.Node): string {
  if (ts.isVariableDeclaration(n)) return `${n.name.getText()} =`;
  if (ts.isExpressionStatement(n)) {
    const e = n.expression;
    if (ts.isBinaryExpression(e) && e.operatorToken.kind === ts.SyntaxKind.EqualsToken) return `${e.left.getText()} =`;
    if (ts.isCallExpression(e)) return `${e.expression.getText()}(`;
  }
  return n.getText().split('\n')[0]!.slice(0, 80);
}

function impureTopLevelNodes(file: string): ts.Node[] {
  const sf = parse(file);
  const text = sf.getFullText();
  const bad: ts.Node[] = [];
  const bindings = new Set<string>();
  for (const s of sf.statements) {
    const c = ts.isImportDeclaration(s) ? s.importClause : undefined;
    if (c?.name) bindings.add(c.name.text);
    if (c?.namedBindings && ts.isNamespaceImport(c.namedBindings)) bindings.add(c.namedBindings.name.text);
    if (c?.namedBindings && ts.isNamedImports(c.namedBindings)) for (const el of c.namedBindings.elements) bindings.add(el.name.text);
    if (ts.isVariableStatement(s) && (s.declarationList.flags & ts.NodeFlags.Const)) {
      for (const d of s.declarationList.declarations) bindingNames(d.name, []).forEach((n) => bindings.add(n));
    }
  }
  const pureInit = (e: ts.Expression): boolean => {
    while (ts.isParenthesizedExpression(e) || ts.isAsExpression(e) || ts.isSatisfiesExpression(e) || ts.isNonNullExpression(e) || ts.isTypeAssertionExpression(e)) e = e.expression;
    if (ts.isLiteralExpression(e) || ts.isNoSubstitutionTemplateLiteral(e)) return true;
    if (e.kind === ts.SyntaxKind.TrueKeyword || e.kind === ts.SyntaxKind.FalseKeyword || e.kind === ts.SyntaxKind.NullKeyword) return true;
    if (ts.isIdentifier(e)) return true; // binding alias (`undefined`, another const)
    if (ts.isPrefixUnaryExpression(e)) return pureInit(e.operand);
    if (ts.isVoidExpression(e)) return ts.isLiteralExpression(e.expression); // `void 0` (emitted `undefined`)
    if (ts.isFunctionExpression(e) || ts.isArrowFunction(e) || ts.isClassExpression(e)) return true;
    if (ts.isArrayLiteralExpression(e)) return e.elements.every((x) => pureInit(ts.isSpreadElement(x) ? x.expression : x));
    if (ts.isObjectLiteralExpression(e)) {
      return e.properties.every((p) =>
        ts.isPropertyAssignment(p) ? !ts.isComputedPropertyName(p.name) && pureInit(p.initializer)
          : ts.isShorthandPropertyAssignment(p) || ts.isMethodDeclaration(p) || ts.isGetAccessorDeclaration(p)
            || ts.isSetAccessorDeclaration(p) || (ts.isSpreadAssignment(p) && pureInit(p.expression)));
    }
    if (ts.isTemplateExpression(e)) return e.templateSpans.every((s) => pureInit(s.expression));
    // `typeof window === 'undefined' ? a : b` — side-effect-free operators over pure operands
    if (ts.isTypeOfExpression(e)) return ts.isIdentifier(e.expression) || pureInit(e.expression);
    if (ts.isConditionalExpression(e)) return pureInit(e.condition) && pureInit(e.whenTrue) && pureInit(e.whenFalse);
    if (ts.isBinaryExpression(e)) {
      const op = e.operatorToken.kind;
      const assigns = op >= ts.SyntaxKind.FirstAssignment && op <= ts.SyntaxKind.LastAssignment;
      return !assigns && pureInit(e.left) && pureInit(e.right);
    }
    // a static member read of an import or module-scope const (`Collapsible.Root`, `ATTRS.scheme`):
    // these are frozen namespaces/compound objects with no getters, so the read runs no code
    if (ts.isPropertyAccessExpression(e)) {
      let root: ts.Expression = e;
      while (ts.isPropertyAccessExpression(root)) root = root.expression;
      return ts.isIdentifier(root) && bindings.has(root.text);
    }
    if ((ts.isCallExpression(e) || ts.isNewExpression(e)) && pureAnnotated(text, e)) return true;
    return false;
  };
  for (const s of sf.statements) {
    if (isTypeOrForwardingStatement(s)) continue; // imports/exports, directives, TS-only declarations
    if (ts.isFunctionDeclaration(s)) continue;
    if (ts.isClassDeclaration(s)) {
      if (s.members.some((m) => ts.isClassStaticBlockDeclaration(m))) bad.push(s);
      continue;
    }
    if (ts.isExportAssignment(s)) { if (!pureInit(s.expression)) bad.push(s); continue; }
    if (ts.isVariableStatement(s)) {
      for (const d of s.declarationList.declarations) if (d.initializer && !pureInit(d.initializer)) bad.push(d);
      continue;
    }
    bad.push(s);
  }
  return bad;
}

/** Top-level declarations whose initialiser calls `callee` (memo, createContext, …) or
 *  constructs a capitalised class (`new X(`) without a pure annotation. */
export function unannotatedTopLevelCalls(file: string, callee: RegExp): string[] {
  const sf = parse(file);
  const text = sf.getFullText();
  const out: string[] = [];
  for (const s of sf.statements) {
    if (!ts.isVariableStatement(s)) continue;
    for (const d of s.declarationList.declarations) {
      let e = d.initializer;
      while (e && (ts.isParenthesizedExpression(e) || ts.isAsExpression(e) || ts.isSatisfiesExpression(e))) e = e.expression;
      if (e && (ts.isCallExpression(e) || ts.isNewExpression(e)) && callee.test(`${ts.isNewExpression(e) ? 'new ' : ''}${e.expression.getText()}`) && !pureAnnotated(text, e)) {
        out.push(`${d.name.getText()} = ${e.expression.getText()}(`);
      }
    }
  }
  return out;
}

export { ROOT };
