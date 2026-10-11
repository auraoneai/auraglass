// QUAL (REQ-QUAL-49..52; REQ-FIN-106; FIN-450): static reader for the Storybook story set.
// Parses CSF story files, `<Name>.meta.ts` files and `.storybook/main.ts` with the TypeScript compiler API
// (never by executing story code), so the title lint, the story-contract validator, the copy lint and the
// docs-page / Start Here checks all see the same facts. Story ids use Storybook's own `toId` /
// `storyNameFromExport`, so ids computed here equal the ids in `storybook-static/index.json`.
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import picomatch from 'picomatch';
import { toId, storyNameFromExport, isExportStory } from 'storybook/internal/csf';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
/** Marker for a value that cannot be evaluated statically (an identifier, a call, a template with expressions). */
export const UNKNOWN = Symbol.for('ag.story-static.unknown');

const posix = (p) => p.split(sep).join('/');
const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'storybook-static', '.artifacts', 'legacy']);

/** Every file under `dir` (repo-relative, posix), skipping generated and vendored trees. */
export function walk(root, dir = '') {
  const abs = join(root, dir);
  if (!existsSync(abs)) return [];
  return readdirSync(abs).flatMap((name) => {
    if (SKIP_DIRS.has(name)) return [];
    const rel = dir ? `${dir}/${name}` : name;
    return statSync(join(root, rel)).isDirectory() ? walk(root, rel) : [rel];
  });
}

/** The `stories` globs of `.storybook/main.ts`, read statically (strings only). */
export function storyGlobs(root = ROOT) {
  const src = readFileSync(join(root, '.storybook', 'main.ts'), 'utf8');
  const sf = ts.createSourceFile('main.ts', src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  let globs = null;
  const visit = (n) => {
    if (ts.isPropertyAssignment(n) && propName(n.name) === 'stories' && ts.isArrayLiteralExpression(n.initializer)) {
      globs = n.initializer.elements.filter(ts.isStringLiteralLike).map((e) => e.text);
    }
    ts.forEachChild(n, visit);
  };
  visit(sf);
  if (!globs || globs.length === 0) throw new Error('story-static: .storybook/main.ts has no static `stories` array');
  return globs;
}

/** Repo-relative story/MDX files matched by the main.ts globs, each with the specifier directory that matched it. */
export function storyFiles(root = ROOT) {
  const specs = storyGlobs(root).map((g) => {
    const rel = posix(relative(root, join(root, '.storybook', g)));
    const segs = rel.split('/');
    const firstGlob = segs.findIndex((s) => /[*@(]/.test(s));
    return { glob: rel, directory: segs.slice(0, firstGlob).join('/'), match: picomatch(rel, { dot: true }) };
  });
  const dirs = [...new Set(specs.map((s) => s.directory.split('/')[0]))];
  const out = [];
  for (const d of dirs) {
    for (const f of walk(root, d)) {
      const spec = specs.find((s) => s.match(f));
      if (spec) out.push({ file: f, directory: spec.directory });
    }
  }
  return out.sort((a, b) => a.file.localeCompare(b.file));
}

function propName(n) {
  if (!n) return undefined;
  if (ts.isIdentifier(n) || ts.isStringLiteralLike(n) || ts.isNumericLiteral(n)) return n.text;
  return undefined;
}

const unwrap = (n) => {
  while (n && (ts.isAsExpression(n) || ts.isSatisfiesExpression(n) || ts.isParenthesizedExpression(n) || ts.isTypeAssertionExpression(n))) n = n.expression;
  return n;
};

/** Evaluate a literal-ish expression; identifiers resolve through `consts` (top-level `const` initialisers). */
export function staticValue(node, consts = new Map(), depth = 0) {
  const n = unwrap(node);
  if (!n || depth > 20) return UNKNOWN;
  if (ts.isStringLiteralLike(n)) return n.text;
  if (ts.isNumericLiteral(n)) return Number(n.text);
  if (n.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (n.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (n.kind === ts.SyntaxKind.NullKeyword) return null;
  if (ts.isPrefixUnaryExpression(n) && n.operator === ts.SyntaxKind.MinusToken && ts.isNumericLiteral(n.operand)) return -Number(n.operand.text);
  if (ts.isArrayLiteralExpression(n)) {
    const out = [];
    for (const e of n.elements) {
      if (ts.isSpreadElement(e)) {
        const v = staticValue(e.expression, consts, depth + 1);
        if (!Array.isArray(v)) return UNKNOWN;
        out.push(...v);
      } else out.push(staticValue(e, consts, depth + 1));
    }
    return out;
  }
  if (ts.isObjectLiteralExpression(n)) {
    const out = {};
    for (const p of n.properties) {
      if (ts.isPropertyAssignment(p)) {
        const k = propName(p.name);
        if (k === undefined) return UNKNOWN;
        out[k] = staticValue(p.initializer, consts, depth + 1);
      } else if (ts.isShorthandPropertyAssignment(p)) {
        out[p.name.text] = consts.has(p.name.text) ? staticValue(consts.get(p.name.text), consts, depth + 1) : UNKNOWN;
      } else if (ts.isSpreadAssignment(p)) {
        const v = staticValue(p.expression, consts, depth + 1);
        if (!v || typeof v !== 'object' || Array.isArray(v)) return UNKNOWN;
        Object.assign(out, v);
      } else if (ts.isMethodDeclaration(p)) {
        const k = propName(p.name);
        if (k !== undefined) out[k] = UNKNOWN;
      }
    }
    return out;
  }
  if (ts.isIdentifier(n) && consts.has(n.text)) return staticValue(consts.get(n.text), consts, depth + 1);
  return UNKNOWN;
}

/** Top-level `const x = <init>` declarations of a source file. */
function topConsts(sf) {
  const m = new Map();
  for (const st of sf.statements) {
    if (ts.isVariableStatement(st) && (st.declarationList.flags & ts.NodeFlags.Const)) {
      for (const d of st.declarationList.declarations) if (ts.isIdentifier(d.name) && d.initializer) m.set(d.name.text, d.initializer);
    }
  }
  return m;
}

const lineOf = (sf, node) => sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1;

/** Storybook's auto-title for a file without `title` (path below the specifier directory, `.stories` dropped, duplicate leaf collapsed). */
export function autoTitle(file, directory) {
  const rel = posix(relative(directory || '.', file)).replace(/\.(stories|story)\.[jt]sx?$/, '').replace(/\.mdx$/, '');
  const parts = rel.split('/').filter(Boolean);
  if (parts.length > 1 && parts[parts.length - 1].toLowerCase() === parts[parts.length - 2].toLowerCase()) parts.pop();
  if (parts[parts.length - 1] === 'index') parts.pop();
  return parts.join('/');
}

/**
 * Parse one CSF file. Returns the default-export meta (title, component identifier, tags, parameters.ag), every
 * story export (id, name, tags, parameters.ag, play), import specifiers, `any` usages and the static copy strings
 * the story renders (JSX text, JSX string attributes, string `args`), each with its line.
 */
export function parseStoryFile(file, source, { directory } = {}) {
  const kind = /\.tsx$/.test(file) ? ts.ScriptKind.TSX : /\.ts$/.test(file) ? ts.ScriptKind.TS : /\.jsx$/.test(file) ? ts.ScriptKind.JSX : ts.ScriptKind.JS;
  const sf = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, kind);
  const consts = topConsts(sf);
  const imports = [];
  const anyUsages = [];
  const copy = [];
  let metaNode = null;
  const exportsList = [];

  for (const st of sf.statements) {
    if (ts.isImportDeclaration(st) && ts.isStringLiteralLike(st.moduleSpecifier)) imports.push({ from: st.moduleSpecifier.text, line: lineOf(sf, st) });
    if (ts.isExportAssignment(st) && !st.isExportEquals) {
      const e = unwrap(st.expression);
      metaNode = ts.isIdentifier(e) && consts.has(e.text) ? unwrap(consts.get(e.text)) : e;
    }
    if (ts.isVariableStatement(st) && st.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) {
      for (const d of st.declarationList.declarations) if (ts.isIdentifier(d.name)) exportsList.push({ name: d.name.text, init: d.initializer ? unwrap(d.initializer) : null, node: d });
    }
    if (ts.isFunctionDeclaration(st) && st.name && st.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) {
      exportsList.push({ name: st.name.text, init: st, node: st });
    }
    if (ts.isExportDeclaration(st) && st.exportClause && ts.isNamedExports(st.exportClause)) {
      for (const el of st.exportClause.elements) {
        const local = (el.propertyName ?? el.name).text;
        exportsList.push({ name: el.name.text, init: consts.has(local) ? unwrap(consts.get(local)) : null, node: el });
      }
    }
  }

  // `any` in story code (REQ-QUAL-50: args type-check under strict/noImplicitAny, no `as any` / `: any`)
  const visitAny = (n) => {
    if (n.kind === ts.SyntaxKind.AnyKeyword) anyUsages.push({ line: lineOf(sf, n), text: n.parent ? n.parent.getText(sf).slice(0, 80) : 'any' });
    ts.forEachChild(n, visitAny);
  };
  visitAny(sf);

  // Rendered copy: JSX text, string JSX attribute values / expression containers, and string values under `args`.
  const visitCopy = (n, inArgs = false, inParams = false) => {
    if (ts.isImportDeclaration(n)) return;
    if (ts.isPropertyAssignment(n)) {
      const k = propName(n.name);
      if (k === 'parameters' || k === 'tags' || k === 'title' || k === 'id' || k === 'component' || k === 'argTypes') return;
      if (k === 'args') { ts.forEachChild(n, (c) => visitCopy(c, true, inParams)); return; }
    }
    if (ts.isJsxText(n)) {
      const t = n.text.replace(/\s+/g, ' ').trim();
      if (t) copy.push({ text: t, line: lineOf(sf, n), where: 'jsx-text' });
    } else if (ts.isJsxAttribute(n) && n.initializer) {
      const attr = n.name.getText(sf);
      if (!/^(className|class|id|key|href|src|role|type|name|htmlFor|data-[\w-]+|value|defaultValue|variant|size|intent|appearance|side|orientation|align|dir|lang|style|ref|for|target|rel|method|action|autoComplete|inputMode|pattern)$/.test(attr)) {
        const init = n.initializer;
        const v = ts.isStringLiteral(init) ? init.text : ts.isJsxExpression(init) && init.expression && ts.isStringLiteralLike(init.expression) ? init.expression.text : null;
        if (v && v.trim()) copy.push({ text: v.trim(), line: lineOf(sf, n), where: `attr:${attr}` });
      }
      return;
    } else if (ts.isJsxExpression(n) && n.expression && ts.isStringLiteralLike(n.expression) && n.parent && (ts.isJsxElement(n.parent) || ts.isJsxFragment(n.parent))) {
      const t = n.expression.text.trim();
      if (t) copy.push({ text: t, line: lineOf(sf, n), where: 'jsx-expression' });
    } else if (inArgs && ts.isPropertyAssignment(n) && ts.isStringLiteralLike(n.initializer)) {
      const t = n.initializer.text.trim();
      if (t) copy.push({ text: t, line: lineOf(sf, n), where: `args.${propName(n.name)}` });
    }
    ts.forEachChild(n, (c) => visitCopy(c, inArgs, inParams));
  };
  visitCopy(sf);

  const meta = metaNode && ts.isObjectLiteralExpression(metaNode) ? staticValue(metaNode, consts) : metaNode ? UNKNOWN : null;
  const metaObj = meta && meta !== UNKNOWN ? meta : {};
  let component = null;
  if (metaNode && ts.isObjectLiteralExpression(metaNode)) {
    for (const p of metaNode.properties) {
      if (ts.isPropertyAssignment(p) && propName(p.name) === 'component') component = unwrap(p.initializer).getText(sf);
    }
  }
  const explicitTitle = typeof metaObj.title === 'string' ? metaObj.title : null;
  const title = explicitTitle ?? (directory !== undefined ? autoTitle(file, directory) : null);
  const metaId = typeof metaObj.id === 'string' ? metaObj.id : null;
  const include = metaObj.includeStories;
  const exclude = metaObj.excludeStories;
  const stories = [];
  for (const ex of exportsList) {
    if (ex.name === 'default' || ex.name === '__namedExportsOrder') continue;
    if (!isExportStory(ex.name, { includeStories: Array.isArray(include) ? include : undefined, excludeStories: Array.isArray(exclude) ? exclude : undefined })) continue;
    const isFn = ex.init && (ts.isArrowFunction(ex.init) || ts.isFunctionExpression(ex.init) || ts.isFunctionDeclaration(ex.init));
    const obj = ex.init && ts.isObjectLiteralExpression(ex.init) ? staticValue(ex.init, consts) : {};
    if (!ex.init || (!isFn && !ts.isObjectLiteralExpression(ex.init))) {
      // e.g. `export const X = Template.bind({})` or a non-story constant: Storybook still treats it as a story.
      if (ex.init && !ts.isCallExpression(ex.init)) continue;
    }
    const name = typeof obj.name === 'string' ? obj.name : typeof obj.storyName === 'string' ? obj.storyName : storyNameFromExport(ex.name);
    let hasPlay = false;
    if (ex.init && ts.isObjectLiteralExpression(ex.init)) hasPlay = ex.init.properties.some((p) => propName(p.name) === 'play');
    stories.push({
      exportName: ex.name,
      name,
      id: title ? toId(metaId || title, storyNameFromExport(ex.name)) : null,
      tags: Array.isArray(obj.tags) ? obj.tags : [],
      ag: obj.parameters && obj.parameters !== UNKNOWN && obj.parameters.ag !== undefined ? obj.parameters.ag : undefined,
      hasPlay,
      line: lineOf(sf, ex.node),
    });
  }
  return {
    file,
    title,
    explicitTitle,
    metaId,
    component,
    metaTags: Array.isArray(metaObj.tags) ? metaObj.tags : [],
    metaAg: metaObj.parameters && metaObj.parameters !== UNKNOWN ? metaObj.parameters.ag : meta === UNKNOWN ? UNKNOWN : undefined,
    metaParsed: meta !== UNKNOWN && meta !== null,
    stories,
    imports,
    anyUsages,
    copy,
  };
}

/** Every `src/**\/*.meta.ts`, evaluated statically from its `defineMeta({...})` / default-export object. */
export function loadMetas(root = ROOT) {
  const out = [];
  for (const file of walk(root, 'src').filter((f) => f.endsWith('.meta.ts'))) {
    const src = readFileSync(join(root, file), 'utf8');
    if (!/\bdefineMeta\s*\(/.test(src)) continue; // e.g. src/material/stories/matrix.meta.ts: story data, not a ComponentMeta
    const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
    const consts = topConsts(sf);
    let value = UNKNOWN;
    const evalMeta = (expr) => {
      let e = unwrap(expr);
      if (ts.isIdentifier(e) && consts.has(e.text)) e = unwrap(consts.get(e.text));
      if (ts.isCallExpression(e) && e.arguments[0]) e = unwrap(e.arguments[0]);
      return staticValue(e, consts);
    };
    for (const st of sf.statements) {
      if (ts.isExportAssignment(st)) value = evalMeta(st.expression);
    }
    if (value === UNKNOWN) {
      // named form: `export const XMeta = defineMeta({...})`
      for (const st of sf.statements) {
        if (!ts.isVariableStatement(st) || !st.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) continue;
        for (const d of st.declarationList.declarations) {
          const init = d.initializer && unwrap(d.initializer);
          if (init && ts.isCallExpression(init) && init.expression.getText(sf) === 'defineMeta' && value === UNKNOWN) value = evalMeta(init);
        }
      }
    }
    if (value === UNKNOWN || typeof value.name !== 'string') throw new Error(`story-static: ${file} has no statically readable ComponentMeta`);
    out.push({ ...value, file });
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}

/** Flagship metas in `ComponentMeta.flagship` order (ties by name, so duplicate numbers sort deterministically). */
export function flagshipOrder(metas) {
  return metas.filter((m) => typeof m.flagship === 'number').sort((a, b) => a.flagship - b.flagship || a.name.localeCompare(b.name));
}

let ownershipRows = null;
/** Owning stream of a repo path (contracts/ownership.json, first matching 5.x row; the verify-ownership.mjs rule). */
export function ownerOf(path, root = ROOT) {
  if (!ownershipRows) {
    const rows = JSON.parse(readFileSync(join(root, 'contracts', 'ownership.json'), 'utf8')).rows;
    ownershipRows = rows.filter((r) => !r.lines || r.lines.includes('5x')).map((r) => ({ ...r, test: picomatch(r.glob, { dot: true }) }));
  }
  const r = ownershipRows.find((x) => x.test(path));
  return r ? r.owner : 'PLAT';
}

/**
 * The story set as Storybook would index it, computed from source: one record per story with
 * id, title, name, importPath, tags (meta ∪ story), subject/kind from parameters.ag and the owning stream.
 */
export function staticIndex(root = ROOT) {
  const files = storyFiles(root).filter((f) => !f.file.endsWith('.mdx'));
  const parsed = files.map(({ file, directory }) => parseStoryFile(file, readFileSync(join(root, file), 'utf8'), { directory }));
  const entries = [];
  for (const p of parsed) {
    for (const s of p.stories) {
      const ag = { ...(isPlainObject(p.metaAg) ? p.metaAg : {}), ...(isPlainObject(s.ag) ? s.ag : {}) };
      entries.push({
        type: 'story', id: s.id, title: p.title, name: s.name, exportName: s.exportName, importPath: `./${p.file}`,
        tags: [...new Set([...p.metaTags, ...s.tags])], subject: typeof ag.subject === 'string' ? ag.subject : undefined,
        kind: typeof ag.kind === 'string' ? ag.kind : undefined, owner: ownerOf(p.file, root), hasPlay: s.hasPlay,
      });
    }
  }
  return { parsed, entries };
}

export const isPlainObject = (v) => !!v && typeof v === 'object' && !Array.isArray(v);

/** Read a built `storybook-static/index.json` and join each story with the subject/kind/owner its source declares. */
export function builtIndex(indexPath, root = ROOT) {
  const idx = JSON.parse(readFileSync(indexPath, 'utf8'));
  const { entries: src } = staticIndex(root);
  const byId = new Map(src.map((e) => [e.id, e]));
  const entries = Object.values(idx.entries ?? idx.stories ?? {}).map((e) => {
    const s = byId.get(e.id);
    const importPath = String(e.importPath ?? '').replace(/^\.\//, '');
    return { ...e, subject: s?.subject, kind: s?.kind, owner: s?.owner ?? ownerOf(importPath, root), exportName: s?.exportName };
  });
  return { index: idx, entries };
}
