#!/usr/bin/env node
/* scripts/qual/lint-tests.mjs — REQ-QUAL-31 vacuous-assertion gate (QUAL, contract row E03).
 *
 * AST pass (via @typescript-eslint/parser, pinned in package.json) over every tracked `*.test.ts(x)` outside
 * `legacy/**`. It flags assertions that cannot fail, and the "missing subject returns" early-return pattern
 * (REQ-FIN-08, PRD-F §12 rule 1):
 *
 *   container-in-document      expect(container).toBeInTheDocument()
 *   expect-in-if               expect(...) inside an `if` consequent with no failing `else`
 *   unguarded-query-loop       a loop over querySelectorAll(...) with no preceding length assertion
 *   jsdom-animation-duration   getComputedStyle(...).animationDuration read in a jsdom test
 *   dom-snapshot-under-src     toMatchSnapshot()/toMatchInlineSnapshot() on DOM in a test under src/**
 *   jsdom-color-contrast       colour-contrast assertions in jsdom (axe 'color-contrast' rule, or a contrast
 *                              computation over getComputedStyle values)
 *   missing-subject-return     inside a test body, `if (...) return;` (optionally after console.*) — a missing
 *                              subject must fail, never return
 *
 * Severity (REQ-QUAL-31): `error` on QUAL-owned paths (contracts/ownership.json, first match wins), report-only
 * on other streams' paths until RC-1, `error` everywhere from RC-1. The phase comes from `--phase pre-rc|rc`,
 * else from CI_COMMIT_TAG (a `-rc.N` or stable 5.x tag is `rc`), else `pre-rc`.
 *
 * When the contract adds `no-vacuous-assertions` to QUAL's row (CC-Q1) this logic moves unchanged to
 * lint/rules/qual/no-vacuous-assertions.cjs.
 *
 * CLI: node scripts/qual/lint-tests.mjs [--phase pre-rc|rc] [--json <file>] [--quiet] [<path prefix> ...]
 *   exit 0  no error-severity diagnostic
 *   exit 1  at least one error-severity diagnostic (including a test file that does not parse on a QUAL path)
 *   exit 2  usage error
 * The JSON report (default `${AURAGLASS_EVIDENCE_DIR:-.artifacts}/qual/${CI_JOB_NAME_SLUG:-local}/lint-tests.json`)
 * lists every diagnostic grouped by owner.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parse } from '@typescript-eslint/parser';
import picomatch from 'picomatch';

export const RULE_IDS = /** @type {const} */ ([
  'container-in-document',
  'expect-in-if',
  'unguarded-query-loop',
  'jsdom-animation-duration',
  'dom-snapshot-under-src',
  'jsdom-color-contrast',
  'missing-subject-return',
]);

const MESSAGES = {
  'container-in-document': 'expect(container).toBeInTheDocument() always passes: render() attaches container to the document. Assert a part, role or text instead.',
  'expect-in-if': 'expect() inside an `if` with no failing `else` passes vacuously when the condition is false. Assert the condition, or add an `else` that fails.',
  'unguarded-query-loop': 'loop over querySelectorAll() with no preceding length assertion passes when nothing matches. Assert the length (expect(x.length).toBeGreaterThan(0) / toHaveLength(n)) before the loop.',
  'jsdom-animation-duration': 'getComputedStyle().animationDuration in jsdom reads only inline styles, never the stylesheet cascade. Move the assertion to the L9 motion lane (browser).',
  'dom-snapshot-under-src': 'toMatchSnapshot() on DOM under src/** cannot fail meaningfully (snapshots are rewritten with -u). Assert parts, states and roles explicitly.',
  'jsdom-color-contrast': 'colour contrast cannot be computed in jsdom (no layout, no cascade, no backdrop). Use the browser axe lane (L5) or the token contrast matrix (L4).',
  'missing-subject-return': 'a missing subject must fail (throw / test.fail()), never `return`. Pending states are reported by the lane runner only.',
};

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');

// ---------------------------------------------------------------- AST helpers

function walk(node, visit, parent = null) {
  if (!node || typeof node.type !== 'string') return;
  visit(node, parent);
  for (const key of Object.keys(node)) {
    if (key === 'parent' || key === 'loc' || key === 'range' || key === 'tokens' || key === 'comments') continue;
    const v = node[key];
    if (Array.isArray(v)) { for (const c of v) if (c && typeof c.type === 'string') walk(c, visit, node); }
    else if (v && typeof v.type === 'string') walk(v, visit, node);
  }
}

const isFn = (n) => n && (n.type === 'ArrowFunctionExpression' || n.type === 'FunctionExpression' || n.type === 'FunctionDeclaration');
const propName = (m) => (m.type === 'MemberExpression'
  ? (!m.computed && m.property.type === 'Identifier' ? m.property.name
    : m.property.type === 'Literal' && typeof m.property.value === 'string' ? m.property.value : null)
  : null);
const unwrap = (n) => {
  let x = n;
  while (x && (x.type === 'TSAsExpression' || x.type === 'TSNonNullExpression' || x.type === 'TSSatisfiesExpression'
    || x.type === 'TSTypeAssertion' || x.type === 'AwaitExpression' || x.type === 'ChainExpression')) x = x.expression ?? x.argument;
  return x;
};

/** Root `expect(arg)` call of an assertion chain `expect(arg).not.toBe(...)`, or null. */
function expectRoot(call) {
  let x = call.callee;
  while (x) {
    x = unwrap(x);
    if (x.type === 'MemberExpression') { x = x.object; continue; }
    if (x.type === 'CallExpression') {
      const c = unwrap(x.callee);
      if (c.type === 'Identifier' && c.name === 'expect') return x;
      if (c.type === 'MemberExpression' && unwrap(c.object).type === 'Identifier' && unwrap(c.object).name === 'expect'
        && propName(c) === 'soft') return x;
      x = c; continue;
    }
    return null;
  }
  return null;
}
/** Matcher name of an assertion call (`toBe` in expect(a).not.toBe(b)). */
const matcherOf = (call) => (unwrap(call.callee).type === 'MemberExpression' ? propName(unwrap(call.callee)) : null);
const isAssertionCall = (n) => n.type === 'CallExpression' && unwrap(n.callee).type === 'MemberExpression' && expectRoot(n) !== null;
const isBareExpect = (n) => n.type === 'CallExpression' && unwrap(n.callee).type === 'Identifier' && unwrap(n.callee).name === 'expect';

function contains(node, pred) {
  let found = false;
  walk(node, (n) => { if (!found && pred(n)) found = true; });
  return found;
}

function calleeName(call) {
  const c = unwrap(call.callee);
  if (c.type === 'Identifier') return c.name;
  if (c.type === 'MemberExpression') return propName(c);
  return null;
}
const isQsaCall = (n) => n && n.type === 'CallExpression' && calleeName(n) === 'querySelectorAll';
const isGcsCall = (n) => n && n.type === 'CallExpression' && calleeName(n) === 'getComputedStyle';

/** Test-callback detection: it(...), test(...), it.each(...)(...), test.concurrent(...), it.only/skip (still a test body). */
function isTestCall(call) {
  let c = unwrap(call.callee);
  if (c.type === 'CallExpression') c = unwrap(c.callee); // it.each(table)(name, fn)
  while (c.type === 'MemberExpression') c = unwrap(c.object);
  return c.type === 'Identifier' && (c.name === 'it' || c.name === 'test');
}

// ---------------------------------------------------------------- rules

function analyse(ast, src, file) {
  const out = [];
  const report = (rule, node) => out.push({ rule, line: node.loc.start.line, column: node.loc.start.column + 1, message: MESSAGES[rule] });
  const text = (n) => src.slice(n.range[0], n.range[1]).replace(/\s+/g, '');

  // parent links + scope-free bindings (name -> initializer), good enough for test files.
  const parents = new Map();
  const bindings = new Map();
  walk(ast, (n, p) => {
    parents.set(n, p);
    if (n.type === 'VariableDeclarator' && n.init) {
      if (n.id.type === 'Identifier') bindings.set(n.id.name, unwrap(n.init));
      if (n.id.type === 'ObjectPattern') for (const pr of n.id.properties) {
        if (pr.type === 'Property' && pr.key.type === 'Identifier') bindings.set(`{${pr.key.name}}`, unwrap(n.init));
      }
    }
  });
  const initOf = (n) => (n && n.type === 'Identifier' ? bindings.get(n.name) ?? null : null);
  const isGcsValue = (n) => { const u = unwrap(n); return isGcsCall(u) || isGcsCall(initOf(u)); };
  const underSrc = file.startsWith('src/');

  // 1 container-in-document
  walk(ast, (n) => {
    if (n.type !== 'CallExpression' || matcherOf(n) !== 'toBeInTheDocument') return;
    const root = expectRoot(n);
    const arg = root && root.arguments[0] && unwrap(root.arguments[0]);
    if (!arg) return;
    if ((arg.type === 'Identifier' && arg.name === 'container') || (arg.type === 'MemberExpression' && propName(arg) === 'container')) report('container-in-document', root);
  });

  // 2 expect-in-if: one diagnostic per offending `if`.
  const failingBranch = (alt) => {
    if (!alt) return false;
    if (alt.type === 'IfStatement') return contains(alt.consequent, (x) => isBareExpect(x) || x.type === 'ThrowStatement') && failingBranch(alt.alternate);
    return contains(alt, (x) => isBareExpect(x) || x.type === 'ThrowStatement'
      || (x.type === 'CallExpression' && unwrap(x.callee).type === 'Identifier' && unwrap(x.callee).name === 'fail'));
  };
  const flaggedIfs = new Set();
  walk(ast, (n) => {
    if (!isBareExpect(n)) return;
    let child = n; let p = parents.get(n);
    while (p) {
      // an `if` outside the test body only decides whether a test is registered, not whether it asserts
      if (isFn(child) && p.type === 'CallExpression' && isTestCall(p)) return;
      if (p.type === 'IfStatement' && p.consequent === child) {
        if (!failingBranch(p.alternate) && !flaggedIfs.has(p)) { flaggedIfs.add(p); report('expect-in-if', p); }
        return;
      }
      child = p; p = parents.get(p);
    }
  });

  // 3 unguarded-query-loop
  const qsaKey = (expr) => {
    const u = unwrap(expr);
    if (!u) return null;
    if (isQsaCall(u)) return { key: text(u), node: u };
    if (u.type === 'Identifier' && (isQsaCall(initOf(u)) || isQsaOfArrayFrom(initOf(u)) || isQsaSpread(initOf(u)))) return { key: u.name, node: u };
    if (isQsaOfArrayFrom(u)) return { key: text(u.arguments[0]), node: u };
    if (isQsaSpread(u)) return { key: text(u.elements[0].argument), node: u };
    return null;
  };
  function isQsaOfArrayFrom(n) { return !!n && n.type === 'CallExpression' && calleeName(n) === 'from' && isQsaCall(unwrap(n.arguments[0])); }
  function isQsaSpread(n) { return !!n && n.type === 'ArrayExpression' && n.elements.length === 1 && n.elements[0]?.type === 'SpreadElement' && isQsaCall(unwrap(n.elements[0].argument)); }
  const lengthAsserted = (loop, key) => {
    // any assertion that ends before the loop starts, inside the same enclosing function (or program)
    let scope = parents.get(loop);
    while (scope && !isFn(scope) && scope.type !== 'Program') scope = parents.get(scope);
    let ok = false;
    walk(scope, (x) => {
      if (ok || !isAssertionCall(x) || x.range[1] > loop.range[0]) return;
      const root = expectRoot(x);
      const a = root.arguments[0] && unwrap(root.arguments[0]);
      if (!a) return;
      const t = text(a);
      const matcher = matcherOf(x);
      if (t === `${key}.length` || (t === key && matcher === 'toHaveLength')) ok = true;
      // Array.from(key).length / [...key].length
      if (t === `Array.from(${key}).length` || t === `[...${key}].length`) ok = true;
    });
    return ok;
  };
  walk(ast, (n) => {
    let target = null;
    if (n.type === 'ForOfStatement') target = qsaKey(n.right);
    else if (n.type === 'CallExpression' && calleeName(n) === 'forEach' && unwrap(n.callee).type === 'MemberExpression') target = qsaKey(unwrap(n.callee).object);
    else if (n.type === 'CallExpression' && (calleeName(n) === 'every' || calleeName(n) === 'some') && unwrap(n.callee).type === 'MemberExpression') {
      // expect(list.every(fn)).toBe(true) is vacuous on an empty NodeList
      const p = parents.get(n);
      if (p && isBareExpect(p) && p.arguments[0] === n) target = qsaKey(unwrap(n.callee).object);
    }
    else if (n.type === 'ForStatement' && n.test && n.test.type === 'BinaryExpression' && unwrap(n.test.right).type === 'MemberExpression'
      && propName(unwrap(n.test.right)) === 'length') target = qsaKey(unwrap(n.test.right).object);
    if (!target) return;
    // a loop matters only when it carries assertions (for-of / for / forEach bodies containing expect)
    const body = n.type === 'CallExpression' && calleeName(n) === 'forEach' ? n.arguments[0] : n.type === 'CallExpression' ? null : n.body;
    if (body && !contains(body, isBareExpect)) return;
    if (!lengthAsserted(n, target.key)) report('unguarded-query-loop', n);
  });

  // 4 jsdom-animation-duration (jest *.test.ts(x) run in jsdom unless the docblock selects node)
  const nodeEnv = /@jest-environment\s+node\b/.test(src.slice(0, 2000));
  if (!nodeEnv) walk(ast, (n) => {
    if (n.type === 'MemberExpression' && propName(n) === 'animationDuration' && isGcsValue(n.object)) report('jsdom-animation-duration', n);
    if (n.type === 'VariableDeclarator' && n.id.type === 'ObjectPattern' && n.init && isGcsValue(n.init)
      && n.id.properties.some((pr) => pr.type === 'Property' && pr.key.type === 'Identifier' && pr.key.name === 'animationDuration')) report('jsdom-animation-duration', n);
  });

  // 5 dom-snapshot-under-src
  const DOM_IDS = new Set(['container', 'baseElement', 'fragment']);
  const DOM_PROPS = new Set(['container', 'baseElement', 'firstChild', 'firstElementChild', 'lastChild', 'lastElementChild',
    'body', 'documentElement', 'innerHTML', 'outerHTML', 'parentElement']);
  const DOM_CALLS = /^(asFragment|querySelector|closest|getElementById|(get|query|find)(All)?By\w+)$/;
  const isDomValue = (a, depth = 0) => {
    const u = unwrap(a);
    if (!u) return false;
    if (u.type === 'Identifier') {
      if (DOM_IDS.has(u.name)) return true;
      const init = initOf(u);
      return depth === 0 && !!init && ((init.type === 'CallExpression' && calleeName(init) === 'render') || isDomValue(init, 1));
    }
    if (u.type === 'MemberExpression') return DOM_PROPS.has(propName(u) ?? '');
    if (u.type === 'CallExpression') return DOM_CALLS.test(calleeName(u) ?? '');
    return false;
  };
  if (underSrc) walk(ast, (n) => {
    if (n.type !== 'CallExpression') return;
    const m = matcherOf(n);
    if (m !== 'toMatchSnapshot' && m !== 'toMatchInlineSnapshot') return;
    const root = expectRoot(n);
    if (root && isDomValue(root.arguments[0])) report('dom-snapshot-under-src', root);
  });

  // 6 jsdom-color-contrast
  if (!nodeEnv) walk(ast, (n) => {
    // axe rule enabled: { 'color-contrast': { enabled: true } }
    if (n.type === 'Property' && n.key.type === 'Literal' && n.key.value === 'color-contrast'
      && n.value.type === 'ObjectExpression' && n.value.properties.some((pr) => pr.type === 'Property'
        && ((pr.key.type === 'Identifier' && pr.key.name === 'enabled') || (pr.key.type === 'Literal' && pr.key.value === 'enabled'))
        && pr.value.type === 'Literal' && pr.value.value === true)) { report('jsdom-color-contrast', n); return; }
    // runOnly / withRules(['color-contrast'])
    if (n.type === 'ArrayExpression' && n.elements.some((e) => e && e.type === 'Literal' && e.value === 'color-contrast')) {
      const p = parents.get(n);
      const viaRunOnly = p && p.type === 'Property' && ((p.key.type === 'Identifier' && (p.key.name === 'runOnly' || p.key.name === 'values')) || (p.key.type === 'Literal' && p.key.value === 'runOnly'));
      const viaCall = p && p.type === 'CallExpression' && ['withRules', 'runOnly'].includes(calleeName(p) ?? '');
      if (viaRunOnly || viaCall) report('jsdom-color-contrast', n);
      return;
    }
    // contrast(getComputedStyle(a).color, getComputedStyle(b).backgroundColor) style computations
    if (n.type === 'CallExpression' && /contrast/i.test(calleeName(n) ?? '') && n.arguments.some((a) => {
      const u = unwrap(a);
      if (!u) return false;
      if (isGcsValue(u)) return true;
      if (u.type === 'MemberExpression' && isGcsValue(u.object)) return true;
      if (u.type === 'Identifier') { const init = initOf(u); return !!init && (isGcsValue(init) || (init.type === 'MemberExpression' && isGcsValue(init.object))); }
      return false;
    })) report('jsdom-color-contrast', n);
  });

  // 7 missing-subject-return: `if (...) return;` / `if (...) { console.warn(...); return; }` directly in a test body
  const isBailout = (stmt) => {
    if (!stmt) return false;
    if (stmt.type === 'ReturnStatement') return stmt.argument === null || (stmt.argument.type === 'Identifier' && stmt.argument.name === 'undefined');
    if (stmt.type === 'BlockStatement' && stmt.body.length > 0) {
      const last = stmt.body[stmt.body.length - 1];
      const rest = stmt.body.slice(0, -1);
      return isBailout(last) && rest.every((s) => s.type === 'ExpressionStatement' && s.expression.type === 'CallExpression'
        && unwrap(s.expression.callee).type === 'MemberExpression' && unwrap(unwrap(s.expression.callee).object).type === 'Identifier'
        && unwrap(unwrap(s.expression.callee).object).name === 'console');
    }
    return false;
  };
  walk(ast, (n) => {
    if (n.type !== 'CallExpression' || !isTestCall(n)) return;
    const body = n.arguments.find(isFn);
    if (!body || body.body.type !== 'BlockStatement') return;
    walk(body.body, (s) => {
      if (s.type === 'IfStatement' && isBailout(s.consequent) && !s.alternate) {
        // only statements of the test body itself (not nested helper functions)
        let p = parents.get(s);
        while (p && p !== body) { if (isFn(p)) return; p = parents.get(p); }
        report('missing-subject-return', s);
      }
    });
  });

  out.sort((a, b) => a.line - b.line || a.column - b.column);
  return out;
}

/** Lint one test source. `file` is repo-relative (posix). Returns diagnostics without severity. */
export function lintTestSource(code, file) {
  let ast;
  try {
    ast = parse(code, { jsx: file.endsWith('.tsx'), loc: true, range: true, comment: false, sourceType: 'module', ecmaVersion: 'latest' });
  } catch (e) {
    return [{ rule: 'parse-error', line: e.lineNumber ?? 1, column: e.column ?? 1, message: `test file does not parse: ${e.message}` }];
  }
  return analyse(ast, code, file);
}

// ---------------------------------------------------------------- ownership + severity

export function loadOwnership(root = REPO_ROOT) {
  const rows = JSON.parse(readFileSync(join(root, 'contracts', 'ownership.json'), 'utf8')).rows;
  return rows.map((r) => ({ owner: r.owner, match: picomatch(r.glob, { dot: true }) }));
}
/** First match wins (contract §3.2). */
export function ownerOf(file, rows) {
  for (const r of rows) if (r.match(file)) return r.owner;
  return 'UNOWNED';
}
export function phaseFromEnv(env = process.env) {
  const tag = env.CI_COMMIT_TAG ?? '';
  if (/^v?5\.\d+\.\d+-rc\.\d+$/.test(tag) || /^v?5\.\d+\.\d+$/.test(tag)) return 'rc';
  return 'pre-rc';
}
export function severityFor(owner, phase) {
  return phase === 'rc' || owner === 'QUAL' ? 'error' : 'report';
}

// ---------------------------------------------------------------- CLI

export function listTestFiles(root = REPO_ROOT, prefixes = []) {
  const out = execFileSync('git', ['ls-files', '-z', '--', '*.test.ts', '*.test.tsx'], { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  return out.split('\0').filter(Boolean)
    .filter((f) => !f.startsWith('legacy/'))
    .filter((f) => prefixes.length === 0 || prefixes.some((p) => f === p || f.startsWith(p.endsWith('/') ? p : `${p}/`)))
    .sort();
}

export function run({ root = REPO_ROOT, phase = phaseFromEnv(), prefixes = [], files } = {}) {
  const rows = loadOwnership(root);
  const list = files ?? listTestFiles(root, prefixes);
  const diagnostics = [];
  for (const file of list) {
    const owner = ownerOf(file, rows);
    const severity = severityFor(owner, phase);
    for (const d of lintTestSource(readFileSync(join(root, file), 'utf8'), file)) diagnostics.push({ file, owner, severity, ...d });
  }
  const byOwner = {};
  for (const d of diagnostics) {
    const o = (byOwner[d.owner] ??= { error: 0, report: 0, rules: {}, files: {} });
    o[d.severity] += 1;
    o.rules[d.rule] = (o.rules[d.rule] ?? 0) + 1;
    o.files[d.file] = (o.files[d.file] ?? 0) + 1;
  }
  const errors = diagnostics.filter((d) => d.severity === 'error').length;
  return { version: 1, gate: 'REQ-QUAL-31', phase, filesScanned: list.length, errors, reports: diagnostics.length - errors, byOwner, diagnostics };
}

function main(argv) {
  const args = argv.slice(2);
  let phase = phaseFromEnv();
  let json = join(process.env.AURAGLASS_EVIDENCE_DIR || '.artifacts', 'qual', process.env.CI_JOB_NAME_SLUG || 'local', 'lint-tests.json');
  let quiet = false;
  const prefixes = [];
  for (let i = 0; i < args.length; i += 1) {
    const a = args[i];
    if (a === '--phase') { phase = args[++i]; if (phase !== 'rc' && phase !== 'pre-rc') { console.error(`lint-tests: --phase must be rc|pre-rc, got ${phase}`); return 2; } }
    else if (a === '--json') { json = args[++i]; if (!json) { console.error('lint-tests: --json needs a path'); return 2; } }
    else if (a === '--quiet') quiet = true;
    else if (a.startsWith('--')) { console.error(`lint-tests: unknown option ${a}`); return 2; }
    else prefixes.push(a.replace(/^\.\//, '').replace(/\/\*\*.*$/, ''));
  }
  const result = run({ phase, prefixes });
  mkdirSync(dirname(resolve(REPO_ROOT, json)), { recursive: true });
  writeFileSync(resolve(REPO_ROOT, json), `${JSON.stringify(result, null, 2)}\n`);
  if (!quiet) for (const d of result.diagnostics) {
    console.log(`${d.severity === 'error' ? 'error ' : 'report'} ${d.file}:${d.line}:${d.column} [${d.owner}] ${d.rule}: ${d.message}`);
  }
  console.log(`lint-tests (REQ-QUAL-31, phase ${phase}): ${result.filesScanned} files, ${result.errors} error(s), ${result.reports} report-only`);
  for (const [owner, o] of Object.entries(result.byOwner).sort()) {
    console.log(`  ${owner}: ${o.error} error, ${o.report} report-only — ${Object.entries(o.rules).map(([r, c]) => `${r}=${c}`).join(', ')}`);
  }
  console.log(`  report: ${json}`);
  return result.errors > 0 ? 1 : 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) process.exitCode = main(process.argv);
