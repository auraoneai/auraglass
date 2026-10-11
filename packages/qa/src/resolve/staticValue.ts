/* REQ-QUAL-01/-02 (QUAL). Static evaluation of literal TypeScript expressions.
   Used to read `parameters.ag` from CSF files and ComponentMeta object literals from
   `src/**\/*.meta.ts` without executing them. Anything that is not a literal (or a
   same-file `const` bound to a literal) is reported as NonStatic, never guessed. */
import ts from 'typescript';

export class NonStaticExpression extends Error {
  readonly file: string;
  readonly line: number;
  constructor(file: string, line: number, text: string) {
    super(`non-static-expression: ${file}:${line} \`${text.slice(0, 80)}\` cannot be evaluated statically`);
    this.name = 'NonStaticExpression';
    this.file = file;
    this.line = line;
  }
}

export type StaticValue = string | number | boolean | null | undefined | StaticValue[] | { [k: string]: StaticValue };

export function parseSource(file: string, text: string): ts.SourceFile {
  const kind = file.endsWith('.tsx') || file.endsWith('.jsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  return ts.createSourceFile(file, text, ts.ScriptTarget.ES2022, true, kind);
}

/** Strips `as`, `satisfies`, `!`, parentheses and `<T>x` wrappers. */
export function unwrap(node: ts.Expression): ts.Expression {
  let n: ts.Expression = node;
  for (;;) {
    if (ts.isParenthesizedExpression(n) || ts.isAsExpression(n) || ts.isSatisfiesExpression(n)
      || ts.isNonNullExpression(n) || ts.isTypeAssertionExpression(n)) n = n.expression;
    else return n;
  }
}

/** Top-level `const x = <expr>` bindings of a source file. */
export function topLevelConsts(sf: ts.SourceFile): Map<string, ts.Expression> {
  const out = new Map<string, ts.Expression>();
  for (const st of sf.statements) {
    if (!ts.isVariableStatement(st)) continue;
    if (!(st.declarationList.flags & ts.NodeFlags.Const)) continue;
    for (const d of st.declarationList.declarations) {
      if (ts.isIdentifier(d.name) && d.initializer) out.set(d.name.text, d.initializer);
    }
  }
  return out;
}

export function propertyName(name: ts.PropertyName): string | null {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)
    || ts.isNoSubstitutionTemplateLiteral(name)) return name.text;
  return null;
}

export function evaluate(node: ts.Expression, sf: ts.SourceFile, consts = topLevelConsts(sf), seen = new Set<string>()): StaticValue {
  const n = unwrap(node);
  const fail = (): never => {
    const { line } = sf.getLineAndCharacterOfPosition(n.getStart(sf));
    throw new NonStaticExpression(sf.fileName, line + 1, n.getText(sf));
  };
  if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) return n.text;
  if (ts.isNumericLiteral(n)) return Number(n.text);
  if (n.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (n.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (n.kind === ts.SyntaxKind.NullKeyword) return null;
  if (ts.isIdentifier(n)) {
    if (n.text === 'undefined') return undefined;
    const init = consts.get(n.text);
    if (!init || seen.has(n.text)) return fail();
    return evaluate(init, sf, consts, new Set([...seen, n.text]));
  }
  if (ts.isPrefixUnaryExpression(n) && n.operator === ts.SyntaxKind.MinusToken && ts.isNumericLiteral(n.operand)) {
    return -Number(n.operand.text);
  }
  if (ts.isArrayLiteralExpression(n)) {
    const arr: StaticValue[] = [];
    for (const el of n.elements) {
      if (ts.isSpreadElement(el)) {
        const v = evaluate(el.expression, sf, consts, seen);
        if (!Array.isArray(v)) return fail();
        arr.push(...v);
      } else arr.push(evaluate(el, sf, consts, seen));
    }
    return arr;
  }
  if (ts.isObjectLiteralExpression(n)) {
    const obj: { [k: string]: StaticValue } = {};
    for (const p of n.properties) {
      if (ts.isPropertyAssignment(p)) {
        const k = propertyName(p.name);
        if (k === null) return fail();
        obj[k] = evaluate(p.initializer, sf, consts, seen);
      } else if (ts.isShorthandPropertyAssignment(p)) {
        obj[p.name.text] = evaluate(p.name, sf, consts, seen);
      } else if (ts.isSpreadAssignment(p)) {
        const v = evaluate(p.expression, sf, consts, seen);
        if (!v || typeof v !== 'object' || Array.isArray(v)) return fail();
        Object.assign(obj, v);
      } else return fail();
    }
    return obj;
  }
  return fail();
}

/** Reads one property of an object literal without evaluating the others. */
export function objectProperty(obj: ts.ObjectLiteralExpression, key: string): ts.Expression | null {
  for (const p of obj.properties) {
    if (ts.isPropertyAssignment(p) && propertyName(p.name) === key) return p.initializer;
    if (ts.isShorthandPropertyAssignment(p) && p.name.text === key) return p.name;
  }
  return null;
}
