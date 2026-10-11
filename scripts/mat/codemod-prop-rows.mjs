#!/usr/bin/env node
/* scripts/mat/codemod-prop-rows.mjs — REQ-MAT-67 / D.3-22 (REQ-FIN-57).
 *
 * Generates fragments/codemods/mat/props.generated.ts: the `props` rows of
 * fragments/codemods/mat.ts for the motion prop removals of MAT PRD §9
 * ("Props respectMotionPreference, motionPolicy, initialMotionPolicy, motion
 * preset/animationPreset, animate, disableAnimation, whileHover/whileTap
 * pass-through" — 4.x DEP-M0901..M0907, codemod motion-props, removed in 5.0).
 *
 * prop-grammar rows are component-scoped, so the rows are derived from the
 * 4.x source itself (no hand-written component list):
 *   1. read every non-test .ts/.tsx under src/ at --ref (default
 *      origin/release/4.x) with `git cat-file --batch` (syntax only, no type
 *      checker, nothing is written to the work tree);
 *   2. collect the direct members of every interface / object type alias and
 *      the types it extends (`extends`, `&`, Partial/Required/Readonly/Pick/
 *      Omit — Pick/Omit honour string-literal keys), then close over bases;
 *   3. find each React component declaration (function X(props: T),
 *      const X = (props: T) => …, const X: FC<T>, forwardRef<E, T>(…),
 *      memo(forwardRef<…>(…)), forwardRef((props: T, ref) => …)) and its
 *      props type T;
 *   4. keep components exported from the package root (src/index.ts,
 *      following `export *` / `export { a as b } from` chains) whose props
 *      type carries a removed prop. `preset` counts only when its declared
 *      type names AnimationPreset/MotionPreset (the motion preset, not the
 *      material/houdini/fluid presets).
 * Each row is { component, from, to: null } — the prop is deleted silently,
 * exactly as the motion-props transform does (fixtures motion-props/*).
 *
 * Usage: node scripts/mat/codemod-prop-rows.mjs [--ref <git-ref>]
 * The output header records the resolved commit; re-run to refresh.
 */
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const OUT = 'fragments/codemods/mat/props.generated.ts';
const argRef = process.argv.indexOf('--ref');
const REF = argRef > -1 ? process.argv[argRef + 1] : 'origin/release/4.x';

/* MAT PRD §9 row "Props …" -> 4.x DEP ids (fragments/deprecations/mat.ts on release/4.x). */
const REMOVED = {
  respectMotionPreference: 'DEP-M0901',
  motionPolicy: 'DEP-M0902',
  initialMotionPolicy: 'DEP-M0903',
  animationPreset: 'DEP-M0904',
  preset: 'DEP-M0904',
  animate: 'DEP-M0905',
  disableAnimation: 'DEP-M0906',
  whileHover: 'DEP-M0907',
  whileTap: 'DEP-M0907',
};
const MOTION_PRESET_TYPE = /\b(AnimationPreset|MotionPreset)\b/;

const git = (args, input) => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 512 * 1024 * 1024, input });
const commit = git(['rev-parse', '--verify', `${REF}^{commit}`]).trim();
const files = git(['ls-tree', '-r', '--name-only', commit, '--', 'src'])
  .split('\n')
  .filter((f) => /\.(ts|tsx)$/.test(f) && !/\.d\.ts$/.test(f))
  .filter((f) => !/(\.(stories|test|spec)\.tsx?$)|\/__tests__\/|\/stories\//.test(f));

/* git cat-file --batch: "<sha> blob <size>\n<content>\n" per request. */
const batch = execFileSync('git', ['cat-file', '--batch'], {
  input: files.map((f) => `${commit}:${f}`).join('\n') + '\n',
  maxBuffer: 512 * 1024 * 1024,
});
const sources = new Map();
{
  let off = 0;
  for (const f of files) {
    const nl = batch.indexOf(10, off);
    const header = batch.subarray(off, nl).toString('utf8');
    const size = Number(header.split(' ')[2]);
    if (!Number.isFinite(size)) throw new Error(`git cat-file: unexpected header for ${f}: ${header}`);
    sources.set(f, batch.subarray(nl + 1, nl + 1 + size).toString('utf8'));
    off = nl + 1 + size + 1;
  }
}

const parsed = new Map();
for (const [f, text] of sources) {
  parsed.set(f, ts.createSourceFile(f, text, ts.ScriptTarget.Latest, true, f.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS));
}

/* ---- 2. type members (global by name; same-named types are merged) ---- */
const types = new Map(); // name -> { props: Map<prop, typeText>, bases: Array<{ name, omit?: Set, pick?: Set }> }
const typeRec = (name) => types.get(name) ?? (types.set(name, { props: new Map(), bases: [] }), types.get(name));
const literalKeys = (node) => {
  const out = new Set();
  const visit = (n) => {
    if (ts.isLiteralTypeNode(n) && ts.isStringLiteral(n.literal)) out.add(n.literal.text);
    else if (ts.isUnionTypeNode(n)) n.types.forEach(visit);
  };
  if (node) visit(node);
  return out;
};
function collectTypeNode(rec, node, sf) {
  if (!node) return;
  if (ts.isParenthesizedTypeNode(node)) return collectTypeNode(rec, node.type, sf);
  if (ts.isTypeLiteralNode(node)) {
    for (const m of node.members) {
      if (ts.isPropertySignature(m) && m.name && (ts.isIdentifier(m.name) || ts.isStringLiteral(m.name))) {
        rec.props.set(m.name.text, m.type ? m.type.getText(sf) : '');
      }
    }
    return;
  }
  if (ts.isIntersectionTypeNode(node) || ts.isUnionTypeNode(node)) {
    node.types.forEach((t) => collectTypeNode(rec, t, sf));
    return;
  }
  if (ts.isTypeReferenceNode(node)) collectRef(rec, node.typeName.getText(sf), node.typeArguments ?? [], sf);
}
/* A reference `Name<args>` (type position or interface `extends`). */
function collectRef(rec, fullName, args, sf) {
  const name = fullName.split('.').pop();
  if (['Partial', 'Required', 'Readonly'].includes(name) && args[0]) return collectTypeNode(rec, args[0], sf);
  if ((name === 'Omit' || name === 'Pick') && args[0]) {
    const inner = { props: new Map(), bases: [] };
    collectTypeNode(inner, args[0], sf);
    const keys = literalKeys(args[1]);
    for (const [k, v] of inner.props) if (name === 'Omit' ? !keys.has(k) : keys.has(k)) rec.props.set(k, v);
    for (const b of inner.bases) rec.bases.push({ ...b, [name === 'Omit' ? 'omit' : 'pick']: keys });
    return;
  }
  rec.bases.push({ name });
}
for (const sf of parsed.values()) {
  const visit = (n) => {
    if (ts.isInterfaceDeclaration(n)) {
      const rec = typeRec(n.name.text);
      for (const m of n.members) {
        if (ts.isPropertySignature(m) && m.name && (ts.isIdentifier(m.name) || ts.isStringLiteral(m.name))) {
          rec.props.set(m.name.text, m.type ? m.type.getText(sf) : '');
        }
      }
      for (const h of n.heritageClauses ?? []) {
        for (const t of h.types) collectRef(rec, t.expression.getText(sf), t.typeArguments ?? [], sf);
      }
    } else if (ts.isTypeAliasDeclaration(n)) {
      collectTypeNode(typeRec(n.name.text), n.type, sf);
    }
    ts.forEachChild(n, visit);
  };
  visit(sf);
}

const resolvedCache = new Map();
function resolveProps(name, stack = new Set()) {
  if (resolvedCache.has(name)) return resolvedCache.get(name);
  const rec = types.get(name);
  const out = new Map();
  if (!rec || stack.has(name)) return out;
  stack.add(name);
  for (const b of rec.bases) {
    for (const [k, v] of resolveProps(b.name, stack)) {
      if (b.omit?.has(k)) continue;
      if (b.pick && !b.pick.has(k)) continue;
      out.set(k, v);
    }
  }
  for (const [k, v] of rec.props) out.set(k, v);
  stack.delete(name);
  resolvedCache.set(name, out);
  return out;
}

/* ---- 3. component declarations -> props type ---- */
const isPascal = (s) => /^[A-Z][A-Za-z0-9]*$/.test(s);
/* Props of a component's props type node: a named type, an inline literal, an
   intersection or a Partial/Omit/PropsWithChildren wrapper — resolved through
   the same member/base tables as named types. */
const propsOfNode = (t, sf) => {
  if (!t) return null;
  if (ts.isTypeReferenceNode(t) && t.typeName.getText(sf).split('.').pop() === 'PropsWithChildren' && t.typeArguments?.[0]) {
    return propsOfNode(t.typeArguments[0], sf);
  }
  const rec = { props: new Map(), bases: [] };
  collectTypeNode(rec, t, sf);
  if (rec.props.size === 0 && rec.bases.length === 0) return null;
  const out = new Map();
  for (const b of rec.bases) {
    for (const [k, v] of resolveProps(b.name)) {
      if (b.omit?.has(k)) continue;
      if (b.pick && !b.pick.has(k)) continue;
      out.set(k, v);
    }
  }
  for (const [k, v] of rec.props) out.set(k, v);
  return out;
};
const paramType = (fn, sf) => (fn && fn.parameters?.[0]?.type ? propsOfNode(fn.parameters[0].type, sf) : null);
function propsTypeOfInit(init, sf) {
  if (!init) return null;
  if (ts.isParenthesizedExpression(init) || ts.isAsExpression(init) || ts.isSatisfiesExpression?.(init)) return propsTypeOfInit(init.expression, sf);
  if (ts.isArrowFunction(init) || ts.isFunctionExpression(init)) return paramType(init, sf);
  if (ts.isCallExpression(init)) {
    const callee = init.expression.getText(sf).split('.').pop();
    if (callee === 'forwardRef') {
      if (init.typeArguments?.[1]) return propsOfNode(init.typeArguments[1], sf);
      return propsTypeOfInit(init.arguments[0], sf);
    }
    if (callee === 'memo') {
      if (init.typeArguments?.[0]) return propsOfNode(init.typeArguments[0], sf);
      return propsTypeOfInit(init.arguments[0], sf);
    }
  }
  return null;
}
const components = new Map(); // `${file}#${local}` -> Map<prop, declared type text>
for (const [f, sf] of parsed) {
  for (const st of sf.statements) {
    if (ts.isFunctionDeclaration(st) && st.name && isPascal(st.name.text)) {
      const t = paramType(st, sf);
      if (t) components.set(`${f}#${st.name.text}`, t);
    } else if (ts.isVariableStatement(st)) {
      for (const d of st.declarationList.declarations) {
        if (!ts.isIdentifier(d.name) || !isPascal(d.name.text)) continue;
        let t = null;
        if (d.type && ts.isTypeReferenceNode(d.type)) {
          const nm = d.type.typeName.getText(sf).split('.').pop();
          if (['FC', 'FunctionComponent', 'VFC', 'ForwardRefExoticComponent', 'MemoExoticComponent'].includes(nm) && d.type.typeArguments?.[0]) {
            t = propsOfNode(d.type.typeArguments[0], sf);
          }
        }
        t ??= propsTypeOfInit(d.initializer, sf);
        if (t) components.set(`${f}#${d.name.text}`, t);
      }
    }
  }
}

/* ---- 4. names exported from the package root ---- */
const resolveModule = (from, spec) => {
  const base = path.posix.normalize(path.posix.join(path.posix.dirname(from), spec));
  for (const c of [`${base}.ts`, `${base}.tsx`, `${base}/index.ts`, `${base}/index.tsx`]) if (parsed.has(c)) return c;
  return null;
};
const exportCache = new Map();
function exportsOf(file, stack = new Set()) {
  if (exportCache.has(file)) return exportCache.get(file);
  const out = new Map(); // exported name -> `${file}#${local}`
  const sf = parsed.get(file);
  if (!sf || stack.has(file)) return out;
  stack.add(file);
  const localExport = new Set();
  for (const st of sf.statements) {
    const mods = ts.canHaveModifiers(st) ? ts.getModifiers(st) ?? [] : [];
    const exported = mods.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
    if (exported && ts.isFunctionDeclaration(st) && st.name) out.set(st.name.text, `${file}#${st.name.text}`);
    if (exported && ts.isVariableStatement(st)) {
      for (const d of st.declarationList.declarations) if (ts.isIdentifier(d.name)) out.set(d.name.text, `${file}#${d.name.text}`);
    }
    if (ts.isExportAssignment(st) && ts.isIdentifier(st.expression)) localExport.add(st.expression.text);
    if (ts.isExportDeclaration(st) && !st.isTypeOnly) {
      const spec = st.moduleSpecifier && ts.isStringLiteral(st.moduleSpecifier) ? st.moduleSpecifier.text : null;
      const target = spec && spec.startsWith('.') ? resolveModule(file, spec) : null;
      if (!st.exportClause) {
        if (target) for (const [k, v] of exportsOf(target, stack)) if (k !== 'default' && !out.has(k)) out.set(k, v);
      } else if (ts.isNamedExports(st.exportClause)) {
        for (const el of st.exportClause.elements) {
          if (el.isTypeOnly) continue;
          const local = (el.propertyName ?? el.name).text;
          const name = el.name.text;
          if (target) {
            const inner = exportsOf(target, stack);
            if (local === 'default') {
              const d = inner.get('default');
              if (d) out.set(name, d);
            } else if (inner.has(local)) out.set(name, inner.get(local));
          } else if (!spec) out.set(name, `${file}#${local}`);
        }
      }
    }
  }
  for (const l of localExport) out.set('default', `${file}#${l}`);
  stack.delete(file);
  exportCache.set(file, out);
  return out;
}
const rootExports = exportsOf('src/index.ts');
if (rootExports.size === 0) throw new Error(`src/index.ts at ${commit} exports nothing — wrong --ref?`);

const rows = [];
for (const [exportName, key] of [...rootExports].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))) {
  if (!isPascal(exportName)) continue;
  const props = components.get(key);
  if (!props) continue;
  for (const prop of Object.keys(REMOVED)) {
    if (!props.has(prop)) continue;
    if (prop === 'preset' && !MOTION_PRESET_TYPE.test(props.get(prop))) continue;
    rows.push({ component: exportName, from: prop, dep: REMOVED[prop] });
  }
}

const body = rows.map((r) => `  { component: '${r.component}', from: '${r.from}', to: null }, // ${r.dep}`);
const comps = new Set(rows.map((r) => r.component));
const text = [
  '/* @generated by `node scripts/mat/codemod-prop-rows.mjs` — do not edit by hand.',
  ` * Source: ${REF} @ ${commit} (src/**, root exports of src/index.ts).`,
  ` * ${rows.length} rows over ${comps.size} components: MAT PRD §9 motion prop removals`,
  ' * (DEP-M0901..M0907, codemod motion-props); `to: null` deletes the prop. */',
  "import type { CodemodMappingFragment } from '../../../src/contracts/fragments';",
  '',
  "export const props: NonNullable<CodemodMappingFragment['props']> = [",
  ...body,
  '];',
  '',
].join('\n');
writeFileSync(OUT, text);
console.log(`codemod-prop-rows: wrote ${OUT} (${rows.length} rows, ${comps.size} components) from ${REF}@${commit.slice(0, 9)}`);
