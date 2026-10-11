#!/usr/bin/env node
// scripts/qual/lint-stories.mjs — REQ-QUAL-55 "zero story-supplied glass" (REQ-FIN-106, FIN-451), L1 built-in.
//
// Six AST checks over every story-like file: `**/*.stories.tsx`, `**/*.mdx`, `showcase/**`, `certification/scenes/**`,
// `.storybook/**` (tracked files only; `legacy/**` excluded, see LEGACY_DECISION):
//   story-no-optics            backdropFilter / WebkitBackdropFilter / filter / mixBlendMode in a `style` object, the
//                              same declarations in CSS-in-JS / CSS files, and any `backdrop-filter` string
//   story-no-important         `!important` in a string, template or CSS declaration
//   story-no-ink-override      `color`, `--ag-on-surface*`, `--glass-text-*` in the style of a library component or of
//                              a JSX ancestor (wrapper) of one
//   story-no-tone-class        className tokens /^glass(-on-|-contrast|-neutral-|-level)/ or `liquid-glass-*`, and the
//                              same names as CSS class selectors
//   story-no-stage-background  `background*` in the style of a JSX ancestor of a library component (except Environment)
//   story-no-private-vars      `--_ag-*` anywhere outside `.storybook/lab/**`
// "Library component" = a JSX tag whose root identifier is bound by an import whose specifier matches `^aura-glass(/|$)`
// or a relative import that resolves into `src/**`. Ancestry is same-tree JSX. Comments are never read, so inline
// disable comments have no effect.
//
// Parsers are frozen by the lockfile: TypeScript (package.json devDependency `typescript`, exact pin) for TS/TSX/JS,
// Storybook's own MDX compiler (`@storybook/addon-docs/mdx-loader`, `storybook` exact pin) with `jsx: true` for MDX,
// PostCSS for CSS files and CSS-in-JS template strings.
//
// Severity (PRD-QUAL §5.8, PRD-F §4.3 rule 3): QUAL paths (contracts/ownership.json) are errors. Other streams' files
// are report-only for the offences recorded in the expiring baseline `certification/baselines-gates/story-glass.json`
// (per-stream counts go to the lane manifest via AG_LANE_REPORT); an offence not in the baseline (a new offender or a
// higher count) fails, a baseline row whose file no longer offends fails (stale), and from RC-1 every row fails.
//
// CLI: node scripts/qual/lint-stories.mjs [--root <dir>] [--json <file>] [--init-baseline | --prune-baseline]
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, posix, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import ts from 'typescript';
import picomatch from 'picomatch';

const require = createRequire(import.meta.url);
export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');

export const CHECKS = ['story-no-optics', 'story-no-important', 'story-no-ink-override', 'story-no-tone-class',
  'story-no-stage-background', 'story-no-private-vars'];
export const BASELINE_PATH = 'certification/baselines-gates/story-glass.json';
/** Recorded exclusion decision (REQ-QUAL-55 remaining work): legacy/** is not a Storybook root (.storybook/main.ts),
    is not shipped, is excluded by every 5.x test runner and is deleted by FIN-C (`legacy/**` deletion row). */
export const LEGACY_DECISION = 'legacy/** excluded: not a .storybook/main.ts story root, not shipped, deleted by FIN-C';
/** `apps/docs/**` MDX is the Next.js docs site (PLAT, remark heading-id syntax such as `## B1 {#b-1}`), not Storybook
    content; it renders no library story and is covered by PLAT's docs gates. */
export const EXCLUDED = [/^legacy\//, /^apps\/docs\//, /\/node_modules\//];
/** REQ-FIN that removes an offender (PRD-F §5): MAT stories → REQ-FIN-59; CMP primitives → 71, other CMP → 70;
    SURF by area (app shell 81, data 83, date 84, AI 85, media 86), other SURF → 80; PLAT → REQ-FIN-43. */
const REQ_FIN_BY_PATH = [[/^stories\/cmp\/primitives\//, 'REQ-FIN-71'], [/^src\/app-shell\//, 'REQ-FIN-81'], [/^src\/data\//, 'REQ-FIN-83'],
  [/^src\/date\//, 'REQ-FIN-84'], [/^src\/ai\//, 'REQ-FIN-85'], [/^src\/(media|backdrops)\//, 'REQ-FIN-86']];
const REQ_FIN_BY_OWNER = { MAT: 'REQ-FIN-59', CMP: 'REQ-FIN-70', SURF: 'REQ-FIN-80', PLAT: 'REQ-FIN-43' };
export function reqFinFor(file, owner) {
  if (owner === 'MAT') return REQ_FIN_BY_OWNER.MAT;
  const hit = REQ_FIN_BY_PATH.find(([re]) => re.test(file));
  return hit ? hit[1] : (REQ_FIN_BY_OWNER[owner] ?? 'unassigned');
}

const SCAN_GLOBS = ['**/*.stories.tsx', '**/*.mdx', 'showcase/**', 'certification/scenes/**', '.storybook/**'];
const SOURCE_EXT = /\.(tsx|ts|jsx|js|mjs|cjs|mdx|css)$/;
const OPTIC_KEYS = new Set(['backdropFilter', 'WebkitBackdropFilter', 'filter', 'mixBlendMode',
  'backdrop-filter', '-webkit-backdrop-filter', 'mix-blend-mode']);
const OPTIC_CSS = new Set(['backdrop-filter', '-webkit-backdrop-filter', 'filter', 'mix-blend-mode']);
const TONE_TOKEN = /^(glass(-on-|-contrast|-neutral-|-level)|liquid-glass-)/;
const TONE_SELECTOR = /\.(glass(?:-on-|-contrast|-neutral-|-level)[\w-]*|liquid-glass-[\w-]+)/;
const IMPORTANT = /!\s*important\b/i;
/** Text that may be CSS: a rule block, or a `prop: value;` declaration list. */
const CSS_LIKE = /\{[^}]*:[^}]*\}|^\s*-{0,2}[a-z][\w-]*\s*:[^;{}]*;/im;
const PRIVATE_VAR = /--_ag-[\w-]+/;
const isInk = (k) => k === 'color' || k.startsWith('--ag-on-surface') || k.startsWith('--glass-text-');
const isBackground = (k) => /^background/i.test(k);

/** Paths where `--_ag-*` is allowed (Lab spec knobs write private overrides, REQ-QUAL-54). */
export const isLabPath = (file) => file.startsWith('.storybook/lab/');

// ---------------------------------------------------------------------------------------------------------------
// TS / TSX

function lineOf(sf, node) {
  return sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1;
}

const propName = (n) => {
  if (!n) return undefined;
  if (ts.isIdentifier(n) || ts.isStringLiteralLike(n) || ts.isNumericLiteral(n)) return n.text;
  if (ts.isComputedPropertyName(n) && ts.isStringLiteralLike(n.expression)) return n.expression.text;
  return undefined;
};

const unwrap = (n) => {
  while (n && (ts.isAsExpression(n) || ts.isSatisfiesExpression(n) || ts.isParenthesizedExpression(n)
    || ts.isTypeAssertionExpression(n) || ts.isNonNullExpression(n))) n = n.expression;
  return n;
};

/** Library bindings: local identifier → imported name, for imports from aura-glass or relative paths into src/. */
function libraryBindings(sf, file) {
  const out = new Map();
  for (const st of sf.statements) {
    if (!ts.isImportDeclaration(st) || !ts.isStringLiteral(st.moduleSpecifier) || !st.importClause) continue;
    if (st.importClause.isTypeOnly) continue;
    const spec = st.moduleSpecifier.text;
    let lib = /^aura-glass(\/|$)/.test(spec);
    if (!lib && spec.startsWith('.')) {
      const target = posix.normalize(posix.join(posix.dirname(file), spec));
      lib = target === 'src' || target.startsWith('src/');
    }
    if (!lib) continue;
    const c = st.importClause;
    if (c.name) out.set(c.name.text, 'default');
    if (c.namedBindings && ts.isNamespaceImport(c.namedBindings)) out.set(c.namedBindings.name.text, '*');
    if (c.namedBindings && ts.isNamedImports(c.namedBindings)) {
      for (const el of c.namedBindings.elements) if (!el.isTypeOnly) out.set(el.name.text, (el.propertyName ?? el.name).text);
    }
  }
  return out;
}

function tagRoot(tag) {
  let t = tag;
  while (t && ts.isPropertyAccessExpression(t)) t = t.expression;
  return t && ts.isIdentifier(t) ? t.text : undefined;
}
const tagLeaf = (tag) => (ts.isPropertyAccessExpression(tag) ? tag.name.text : ts.isIdentifier(tag) ? tag.text : undefined);

/** Map of `const name = <object literal>` declarations visible in the file (any scope; names are rarely reused). */
function objectConsts(sf) {
  const out = new Map();
  const visit = (n) => {
    if (ts.isVariableDeclaration(n) && ts.isIdentifier(n.name) && n.initializer) {
      const init = unwrap(n.initializer);
      if (init && ts.isObjectLiteralExpression(init)) out.set(n.name.text, init);
    }
    ts.forEachChild(n, visit);
  };
  visit(sf);
  return out;
}

/** Property keys (with their nodes) of a style expression: object literals, spreads and const references. */
function styleKeys(expr, consts, seen = new Set()) {
  const n = unwrap(expr);
  if (!n) return [];
  if (ts.isIdentifier(n)) {
    if (seen.has(n.text) || !consts.has(n.text)) return [];
    seen.add(n.text);
    return styleKeys(consts.get(n.text), consts, seen);
  }
  if (ts.isConditionalExpression(n)) return [...styleKeys(n.whenTrue, consts, seen), ...styleKeys(n.whenFalse, consts, seen)];
  if (ts.isBinaryExpression(n) && (n.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken
    || n.operatorToken.kind === ts.SyntaxKind.BarBarToken || n.operatorToken.kind === ts.SyntaxKind.QuestionQuestionToken)) {
    return [...styleKeys(n.left, consts, seen), ...styleKeys(n.right, consts, seen)];
  }
  if (!ts.isObjectLiteralExpression(n)) return [];
  const keys = [];
  for (const p of n.properties) {
    if (ts.isSpreadAssignment(p)) keys.push(...styleKeys(p.expression, consts, seen));
    else if (ts.isPropertyAssignment(p) || ts.isShorthandPropertyAssignment(p)) {
      const k = propName(p.name);
      if (k !== undefined) keys.push({ key: k, node: p });
    }
  }
  return keys;
}

function jsxAttr(attrs, name) {
  for (const a of attrs.properties) if (ts.isJsxAttribute(a) && propName(a.name) === name) return a;
  return undefined;
}
const attrExpr = (a) => (a?.initializer && ts.isJsxExpression(a.initializer) ? a.initializer.expression : a?.initializer);

/** Text of a string-ish literal (template expressions replaced by `0`, enough for CSS parsing). */
function literalText(n) {
  if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) return n.text;
  if (ts.isTemplateExpression(n)) return n.head.text + n.templateSpans.map((s) => `0${s.literal.text}`).join('');
  return undefined;
}

/** All string-ish literals under `node`. */
function literalsUnder(node) {
  const out = [];
  const visit = (n) => {
    if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n) || ts.isTemplateExpression(n)) {
      out.push(n);
      if (ts.isTemplateExpression(n)) n.templateSpans.forEach((s) => visit(s.expression));
      return;
    }
    ts.forEachChild(n, visit);
  };
  visit(node);
  return out;
}

function lintTsSource(code, file, { scriptKind } = {}) {
  const kind = scriptKind ?? (/\.(tsx|jsx|mdx)$/.test(file) ? ts.ScriptKind.TSX : /\.(js|mjs|cjs)$/.test(file) ? ts.ScriptKind.JS : ts.ScriptKind.TS);
  const sf = ts.createSourceFile(file, code, ts.ScriptTarget.Latest, true, kind);
  const lib = libraryBindings(sf, file);
  const consts = objectConsts(sf);
  const lab = isLabPath(file);
  const out = [];
  const add = (check, node, message) => out.push({ check, file, line: node ? lineOf(sf, node) : null, message });

  const isLibraryElement = (el) => {
    const tag = ts.isJsxElement(el) ? el.openingElement.tagName : el.tagName;
    const root = tagRoot(tag);
    return root !== undefined && lib.has(root);
  };
  const isEnvironment = (el) => {
    const tag = ts.isJsxElement(el) ? el.openingElement.tagName : el.tagName;
    const root = tagRoot(tag);
    if (root === undefined || !lib.has(root)) return false;
    const imported = lib.get(root);
    return (imported === '*' || ts.isPropertyAccessExpression(tag) ? tagLeaf(tag) : imported) === 'Environment';
  };
  const attributesOf = (el) => (ts.isJsxElement(el) ? el.openingElement.attributes : el.attributes);

  // Library components contained in a JSX subtree (same tree, not through local components).
  const containsLibrary = new Map();
  const hasLibraryDescendant = (el) => {
    if (containsLibrary.has(el)) return containsLibrary.get(el);
    let found = false;
    const visit = (n) => {
      if (found) return;
      if ((ts.isJsxElement(n) || ts.isJsxSelfClosingElement(n)) && n !== el && isLibraryElement(n)) { found = true; return; }
      ts.forEachChild(n, visit);
    };
    if (ts.isJsxElement(el)) el.children.forEach(visit);
    containsLibrary.set(el, found);
    return found;
  };

  // 1. JSX style / className checks.
  const visitJsx = (n) => {
    if (ts.isJsxElement(n) || ts.isJsxSelfClosingElement(n)) {
      const attrs = attributesOf(n);
      const style = attrExpr(jsxAttr(attrs, 'style'));
      if (style) {
        const library = isLibraryElement(n);
        const ancestor = hasLibraryDescendant(n);
        for (const { key, node } of styleKeys(style, consts)) {
          if (OPTIC_KEYS.has(key)) add('story-no-optics', node, `style.${key} supplies optics`);
          if (isInk(key) && (library || ancestor)) add('story-no-ink-override', node, `style.${key} overrides ink on a library component${library ? '' : ' wrapper'}`);
          if (isBackground(key) && ancestor && !isEnvironment(n)) add('story-no-stage-background', node, `style.${key} paints a stage behind a library component`);
        }
      }
      const cls = attrExpr(jsxAttr(attrs, 'className'));
      if (cls) {
        for (const lit of literalsUnder(cls)) {
          const text = literalText(lit) ?? '';
          for (const tok of text.split(/\s+/)) if (TONE_TOKEN.test(tok)) add('story-no-tone-class', lit, `className "${tok}" is a tone class`);
        }
      }
    }
    ts.forEachChild(n, visitJsx);
  };
  visitJsx(sf);

  // 2. Every string-ish literal: !important, backdrop-filter, private vars, CSS-in-JS declarations and selectors.
  const seen = new Set();
  const once = (check, node, message) => {
    const k = `${check}|${lineOf(sf, node)}|${message}`;
    if (!seen.has(k)) { seen.add(k); add(check, node, message); }
  };
  for (const lit of literalsUnder(sf)) {
    if (ts.isImportDeclaration(lit.parent) || ts.isExportDeclaration(lit.parent) || ts.isExternalModuleReference(lit.parent)) continue;
    if (ts.isCallExpression(lit.parent) && lit.parent.expression.kind === ts.SyntaxKind.ImportKeyword) continue;
    const text = literalText(lit);
    if (text === undefined) continue;
    if (!lab && PRIVATE_VAR.test(text)) once('story-no-private-vars', lit, `private variable ${PRIVATE_VAR.exec(text)[0]} outside .storybook/lab/**`);
    // CSS-in-JS text is checked declaration by declaration; anything else by its raw content.
    const css = CSS_LIKE.test(text) ? cssFindings(text, file) : null;
    if (css) {
      for (const v of css) if (v.check !== 'story-no-private-vars') once(v.check, lit, v.message);
      continue;
    }
    if (IMPORTANT.test(text)) once('story-no-important', lit, '`!important` in a string');
    if (/backdrop-filter/i.test(text)) once('story-no-optics', lit, '`backdrop-filter` string');
  }
  // 3. Style-object keys that are private vars (`{ '--_ag-x': 1 }`) anywhere in the file.
  if (!lab) {
    const visitKeys = (n) => {
      if (ts.isPropertyAssignment(n)) {
        const k = propName(n.name);
        if (k && k.startsWith('--_ag-')) once('story-no-private-vars', n, `private variable ${k} outside .storybook/lab/**`);
      }
      ts.forEachChild(n, visitKeys);
    };
    visitKeys(sf);
  }
  return out;
}

// ---------------------------------------------------------------------------------------------------------------
// CSS (files and CSS-in-JS strings)

let postcss = null;
function parseCss(text) {
  postcss ??= require('postcss');
  try { return postcss.parse(text); } catch { return null; }
}

/** Checks on CSS text; null when the text does not parse as CSS with at least one declaration or rule. */
function cssFindings(text, file) {
  const root = parseCss(text);
  if (!root) return null;
  let nodes = 0;
  root.walk((n) => { if (n.type === 'decl' || n.type === 'rule') nodes += 1; });
  if (!nodes) return null;
  const out = [];
  const lab = isLabPath(file);
  root.walkDecls((d) => {
    const line = d.source?.start?.line ?? null;
    const prop = d.prop.toLowerCase();
    // `none` removes optics (e.g. the cert-mode ancestor reset, REQ-QUAL-09); every other value supplies them.
    if (OPTIC_CSS.has(prop) && d.value.trim().toLowerCase() !== 'none') out.push({ check: 'story-no-optics', file, line, message: `CSS ${prop}: ${d.value} supplies optics` });
    if (d.important) out.push({ check: 'story-no-important', file, line, message: `CSS ${d.prop}: … !important` });
    if (!lab && (prop.startsWith('--_ag-') || PRIVATE_VAR.test(d.value))) {
      out.push({ check: 'story-no-private-vars', file, line, message: `private variable ${prop.startsWith('--_ag-') ? prop : PRIVATE_VAR.exec(d.value)[0]} outside .storybook/lab/**` });
    }
  });
  root.walkRules((r) => {
    const m = TONE_SELECTOR.exec(r.selector);
    if (m) out.push({ check: 'story-no-tone-class', file, line: r.source?.start?.line ?? null, message: `CSS selector .${m[1]} is a tone class` });
  });
  return out;
}

/** Checks on a CSS file (showcase/**, .storybook/**). */
export function lintCssText(text, file) {
  return cssFindings(text, file) ?? [];
}

// ---------------------------------------------------------------------------------------------------------------
// MDX

/** MDX → JSX-preserving JS with Storybook's MDX compiler (the one the Storybook build uses). */
export function compileMdx(code, file) {
  const loader = require('@storybook/addon-docs/mdx-loader');
  // The loader logs "Error loading: <file>" before failing; the failure itself is reported as a `parse` finding.
  const log = console.error;
  console.error = () => {};
  return new Promise((resolvePromise, reject) => {
    loader.call({
      async: () => (err, out) => { console.error = log; return err ? reject(err) : resolvePromise(out); },
      getOptions: () => ({ mdxCompileOptions: { jsx: true } }),
      resourcePath: file,
    }, code);
  });
}

// ---------------------------------------------------------------------------------------------------------------
// Public API

/** Lint one source. `file` is repo-relative (posix) and decides the language and the lab allowance. */
export async function lintSource(code, file) {
  if (file.endsWith('.css')) return lintCssText(code, file);
  if (file.endsWith('.mdx')) {
    const js = await compileMdx(code, file);
    // Positions are in the compiled output; MDX findings report the file without a line.
    return lintTsSource(js, file, { scriptKind: ts.ScriptKind.TSX }).map((v) => ({ ...v, line: null }));
  }
  return lintTsSource(code, file);
}

/** Tracked files in scope (`git ls-files`), minus EXCLUDED (LEGACY_DECISION and the docs-site MDX). */
export function scanFiles(root = ROOT) {
  const specs = SCAN_GLOBS.map((g) => `:(glob)${g}`);
  const files = execFileSync('git', ['ls-files', '-z', '--', ...specs], { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
    .split('\0').filter(Boolean);
  return [...new Set(files)].filter((f) => !EXCLUDED.some((re) => re.test(f)) && SOURCE_EXT.test(f)).sort();
}

let ownershipCache = null;
/** Owning stream of a repo path: first matching 5.x row of contracts/ownership.json (the verify-ownership rule). */
export function ownerOf(path, root = ROOT) {
  if (!ownershipCache || ownershipCache.root !== root) {
    const rows = JSON.parse(readFileSync(join(root, 'contracts', 'ownership.json'), 'utf8')).rows
      .filter((r) => !r.lines || r.lines.includes('5x')).map((r) => ({ ...r, test: picomatch(r.glob, { dot: true }) }));
    ownershipCache = { root, rows };
  }
  const r = ownershipCache.rows.find((x) => x.test(path));
  if (!r) throw new Error(`lint-stories: ${path} matches no contracts/ownership.json row`);
  return r.owner;
}

export async function lintRepo(root = ROOT, files = scanFiles(root)) {
  const violations = [];
  for (const file of files) {
    const code = readFileSync(join(root, file), 'utf8');
    let found;
    try { found = await lintSource(code, file); } catch (e) {
      found = [{ check: 'parse', file, line: null, message: `cannot parse: ${e.message.split('\n')[0]}` }];
    }
    const owner = ownerOf(file, root);
    violations.push(...found.map((v) => ({ ...v, owner })));
  }
  return { files, violations };
}

// ---------------------------------------------------------------------------------------------------------------
// Expiring baseline (PRD-F §4.3 rule 3)

/** True once package.json is a 5.x release candidate or GA (`expires: "RC-1"`). */
export function baselineExpired(version) {
  const m = /^(\d+)\.(\d+)\.(\d+)(?:-([a-z]+)\.(\d+))?$/.exec(String(version));
  if (!m) throw new Error(`lint-stories: unparseable package version ${version}`);
  if (Number(m[1]) < 5) return false;
  return m[4] === undefined || m[4] === 'rc';
}

export function loadBaseline(root = ROOT) {
  const abs = join(root, BASELINE_PATH);
  if (!existsSync(abs)) return null;
  const b = JSON.parse(readFileSync(abs, 'utf8'));
  if (b.version !== 1 || b.gate !== 'story-glass' || b.expires !== 'RC-1' || !Array.isArray(b.rows)) {
    throw new Error(`lint-stories: ${BASELINE_PATH} must be { version: 1, gate: "story-glass", expires: "RC-1", rows: [] }`);
  }
  for (const r of b.rows) {
    if (!CHECKS.includes(r.check) || typeof r.file !== 'string' || typeof r.owner !== 'string' || r.owner === 'QUAL'
      || typeof r.reqFin !== 'string' || !Number.isInteger(r.count) || r.count < 1) {
      throw new Error(`lint-stories: malformed baseline row ${JSON.stringify(r)} (QUAL paths are never baselined)`);
    }
  }
  return b;
}

const rowKey = (r) => `${r.check}|${r.file}`;

/** Count violations per (check, file). */
function tally(violations) {
  const m = new Map();
  for (const v of violations) {
    const k = rowKey(v);
    const cur = m.get(k) ?? { check: v.check, file: v.file, owner: v.owner, count: 0 };
    cur.count += 1;
    m.set(k, cur);
  }
  return m;
}

/**
 * Classify violations. Returns { errors, reported, stale, expiredRows, perStream }.
 * - QUAL-owned (and parse failures) → errors.
 * - other streams: within the baseline count → reported; above it or absent → errors (new offender).
 * - baseline rows with no current offence → stale (error); after RC-1 every row is an error.
 */
export function classify(violations, baseline, version) {
  const expired = baselineExpired(version);
  const rows = new Map((baseline?.rows ?? []).map((r) => [rowKey(r), r]));
  const errors = [];
  const reported = [];
  const counts = tally(violations.filter((v) => v.owner !== 'QUAL' && v.check !== 'parse'));
  for (const v of violations) {
    if (v.owner === 'QUAL' || v.check === 'parse') { errors.push({ ...v, why: v.check === 'parse' ? 'parse' : 'qual-path' }); continue; }
    const row = rows.get(rowKey(v));
    const n = counts.get(rowKey(v)).count;
    if (!expired && row && n <= row.count) reported.push(v);
    else errors.push({ ...v, why: expired ? 'baseline-expired' : row ? `count ${n} > baseline ${row.count}` : 'new-offender' });
  }
  const stale = [...rows.values()].filter((r) => !counts.has(rowKey(r)));
  const perStream = {};
  for (const v of violations) {
    perStream[v.owner] ??= Object.fromEntries(CHECKS.map((c) => [c, 0]));
    if (v.check !== 'parse') perStream[v.owner][v.check] += 1;
  }
  return { expired, errors, reported, stale, expiredRows: expired ? [...rows.values()] : [], perStream };
}

function baselineRows(violations) {
  const rows = [...tally(violations.filter((v) => v.owner !== 'QUAL' && v.check !== 'parse')).values()]
    .map((r) => ({ check: r.check, file: r.file, owner: r.owner, reqFin: reqFinFor(r.file, r.owner), count: r.count }));
  return rows.sort((a, b) => a.owner.localeCompare(b.owner) || a.file.localeCompare(b.file) || a.check.localeCompare(b.check));
}

/** Create the baseline from the current non-QUAL offenders. Refuses to overwrite: the baseline only shrinks. */
export function initBaseline(violations, root = ROOT) {
  const abs = join(root, BASELINE_PATH);
  if (existsSync(abs)) throw new Error(`lint-stories: ${BASELINE_PATH} exists; it only shrinks (use --prune-baseline)`);
  mkdirSync(dirname(abs), { recursive: true });
  const rows = baselineRows(violations);
  writeFileSync(abs, `${JSON.stringify({
    $comment: 'Expiring baseline (PRD-F §4.3 rule 3) for the story-glass gate scripts/qual/lint-stories.mjs (REQ-QUAL-55, REQ-FIN-106). Written by --init-baseline; shrinks only (--prune-baseline). Each row is the owning stream\'s fix (reqFin). Empty at RC-1.',
    version: 1, gate: 'story-glass', reqFin: 'REQ-FIN-106', expires: 'RC-1', legacy: LEGACY_DECISION, rows,
  }, null, 2)}\n`);
  return rows.length;
}

/** Drop stale rows and lower counts to the current value. Never adds a row or raises a count. */
export function pruneBaseline(violations, root = ROOT) {
  const b = loadBaseline(root);
  if (!b) throw new Error(`lint-stories: ${BASELINE_PATH} does not exist`);
  const now = tally(violations.filter((v) => v.owner !== 'QUAL' && v.check !== 'parse'));
  const before = JSON.stringify(b.rows);
  b.rows = b.rows.filter((r) => now.has(rowKey(r))).map((r) => ({ ...r, count: Math.min(r.count, now.get(rowKey(r)).count) }));
  writeFileSync(join(root, BASELINE_PATH), `${JSON.stringify(b, null, 2)}\n`);
  return before !== JSON.stringify(b.rows);
}

// ---------------------------------------------------------------------------------------------------------------
// CLI

function parseArgs(argv) {
  const a = { root: ROOT, json: null, init: false, prune: false };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--root') a.root = resolve(argv[++i]);
    else if (argv[i] === '--json') a.json = argv[++i];
    else if (argv[i] === '--init-baseline') a.init = true;
    else if (argv[i] === '--prune-baseline') a.prune = true;
    else throw new Error(`lint-stories: unknown argument ${argv[i]}`);
  }
  return a;
}

export async function main(argv = process.argv.slice(2), env = process.env) {
  const args = parseArgs(argv);
  const { files, violations } = await lintRepo(args.root);
  if (args.init) { console.log(`lint-stories: baseline written with ${initBaseline(violations, args.root)} row(s)`); return 0; }
  if (args.prune) { console.log(`lint-stories: baseline ${pruneBaseline(violations, args.root) ? 'pruned' : 'unchanged'}`); return 0; }
  const version = JSON.parse(readFileSync(join(args.root, 'package.json'), 'utf8')).version;
  const baseline = loadBaseline(args.root);
  const r = classify(violations, baseline, version);
  const report = {
    gate: 'story-glass', reqs: ['REQ-QUAL-55'], files: files.length, legacy: LEGACY_DECISION, baselineExpired: r.expired,
    perStream: r.perStream, errors: r.errors.length, reported: r.reported.length, stale: r.stale.length,
    violations: [...r.errors.map((v) => ({ ...v, severity: 'error' })), ...r.reported.map((v) => ({ ...v, severity: 'report' }))],
    staleRows: r.stale,
  };
  for (const out of [args.json, env.AG_LANE_REPORT].filter(Boolean)) {
    mkdirSync(dirname(resolve(args.root, out)), { recursive: true });
    writeFileSync(resolve(args.root, out), `${JSON.stringify(report, null, 2)}\n`);
  }
  console.log(`lint-stories: scanned ${files.length} files (${LEGACY_DECISION})`);
  for (const [stream, counts] of Object.entries(r.perStream).sort()) {
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    console.log(`  ${stream.padEnd(5)} ${String(total).padStart(4)}  ${CHECKS.map((c) => `${c.replace('story-no-', '')}=${counts[c]}`).join(' ')}`);
  }
  for (const v of r.reported) console.log(`  report  [${v.check}] ${v.file}${v.line ? `:${v.line}` : ''} (${v.owner}) ${v.message}`);
  for (const v of r.errors) console.error(`  ERROR   [${v.check}] ${v.file}${v.line ? `:${v.line}` : ''} (${v.owner}, ${v.why}) ${v.message}`);
  for (const s of r.stale) console.error(`  ERROR   stale baseline row [${s.check}] ${s.file} (${s.owner}): no longer offends; delete it (--prune-baseline)`);
  const failed = r.errors.length + r.stale.length;
  if (failed) console.error(`lint-stories: ${failed} blocking finding(s)`);
  return failed ? 1 : 0;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  main().then((code) => process.exit(code), (e) => { console.error(e); process.exit(1); });
}

