/* REQ-FIN-37 / REQ-PLAT-72: shared logic for the React 19 gates
   (tests/react19/*.test.ts and scripts/ci/verify-compiler.mjs).

   The gates scan ALL of src/ (no stream path filter). Offenders that other
   work packages still have to fix are listed in the expiring cross-stream
   baseline scripts/integration/baselines/react19.json (PRD-F §4.3 rule 3;
   the file is FIN-A's, it is never edited from a FIN-C branch). Row shape:
     { "rule": "forwardRef" | "compiler", "file": "src/...", "count": <n>,
       "owner": "FIN-x", "reqFin": "REQ-FIN-nn", "expires": "RC-1" }
   A new offender, a row whose count no longer matches (stale: lower it or
   drop it), or a malformed row fails the gate. A missing baseline file is
   an empty baseline. */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import ts from 'typescript';

export const BASELINE_REL = 'scripts/integration/baselines/react19.json';
export const RULES = ['forwardRef', 'compiler'];

const posixRel = (root, file) => relative(root, file).split(sep).join('/');

/* PRD-F §6 owner of a src path for the react19 rows (most specific first). */
const OWNERS = [
  [/^src\/theme\/(AuraGlassProvider\.tsx|providerMounts\.ts|mounts\.ts|index\.ts)$|^src\/internal\/warnDeprecated\.ts$/, 'FIN-A', 'REQ-FIN-04'],
  [/^src\/theme\/(portal\.ts|layers\/)|^src\/foundation\/portal\.ts$|^src\/components\/overlays\/_shared\/useOverlayLayer\.ts$|^src\/primitives\/(DismissableLayer|FocusScope)\.tsx$/, 'FIN-A', 'REQ-FIN-07'],
  [/^src\/components\/overlays\/_shared\/(overlaySurface|overlayTypes)\.ts$|^src\/material\/dev\/warnings\.ts$/, 'FIN-A', 'REQ-FIN-02'],
  [/^src\/theme\/preferences\/store\.ts$/, 'FIN-A', 'REQ-FIN-12'],
  [/^src\/(app-shell|data|date|ai|media|backdrops|charts|three)\/|^src\/root\/surf\.ts$|^src\/components\/(tabs|tab-bar|breadcrumbs|pagination|command-palette|source-transition|timeline)\/|^src\/compat\/surf\//, 'FIN-F', 'REQ-FIN-80'],
  [/^src\/(components|primitives|icons|foundation|forms)\/|^src\/compat\/cmp\//, 'FIN-E', 'REQ-FIN-70'],
  [/^src\/(material|motion|theme|a11y|tokens)\/|^src\/compat\/mat\//, 'FIN-D', 'REQ-FIN-55'],
];
export function ownerOf(file) {
  for (const [re, owner, reqFin] of OWNERS) if (re.test(file)) return { owner, reqFin };
  return { owner: 'FIN-C', reqFin: 'REQ-FIN-37' };
}

export function walkFiles(dir, filter = () => true, out = []) {
  if (!existsSync(dir)) return out;
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    let st;
    try { st = statSync(p); } catch { continue; }
    if (st.isDirectory()) walkFiles(p, filter, out);
    else if (filter(p)) out.push(p);
  }
  return out.sort();
}

export const srcFiles = (root) =>
  walkFiles(join(root, 'src'), (p) => /\.(ts|tsx|mts|cts)$/.test(p) && !p.endsWith('.d.ts'));

/** dist/<rel>.js|.d.ts → src/<rel>.{tsx,ts,...} (tsdown runs in unbundle mode). */
export function srcCounterpart(root, distFile) {
  const rel = posixRel(join(root, 'dist'), distFile).replace(/\.d\.ts$|\.(js|mjs|cjs)$/, '');
  for (const ext of ['.tsx', '.ts', '.mts', '.cts', '.jsx', '.js']) {
    const cand = join(root, 'src', rel + ext);
    if (existsSync(cand)) return cand;
  }
  return null;
}

const scriptKind = (f) => (f.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);

/** Occurrences of the identifier `forwardRef` (code only; comments and strings ignored). */
export function countForwardRefIdentifiers(fileName, text) {
  const sf = ts.createSourceFile(fileName, text, ts.ScriptTarget.Latest, true, scriptKind(fileName));
  let n = 0;
  const visit = (node) => {
    if (ts.isIdentifier(node) && node.text === 'forwardRef') n += 1;
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return n;
}

/** Map<relFile, count> of forwardRef identifiers across src/. */
export function forwardRefOffenders(root) {
  const out = new Map();
  for (const f of srcFiles(root)) {
    const n = countForwardRefIdentifiers(f, readFileSync(f, 'utf8'));
    if (n) out.set(posixRel(root, f), n);
  }
  return out;
}

/** Named imports of feature-detected/unstable React APIs (break the 19.0.0 floor). */
export const BANNED_REACT_NAMED_IMPORT =
  /import\s*(?:type\s+)?\{[^}]*\b(unstable_ViewTransition|experimental_useEffectEvent|unstable_getCacheForType|unstable_Activity)\b[^}]*\}\s*from\s*['"]react(?:\/[^'"]*)?['"]/;

/* ---- element.ref reads (React ≤18 API), type-checked ---- */

const compilerOptions = (root) => {
  const cfg = ts.getParsedCommandLineOfConfigFile(join(root, 'tsconfig.json'), {}, {
    ...ts.sys, onUnRecoverableConfigFileDiagnostic: () => {},
  });
  return { ...(cfg?.options ?? {}), noEmit: true };
};

const isElementLike = (checker, type) => {
  if (type.flags & (ts.TypeFlags.Any | ts.TypeFlags.Unknown)) return true;
  const parts = type.isUnion() ? type.types : [type];
  return parts.some((t) => {
    const names = [t.getSymbol()?.getName(), t.aliasSymbol?.getName()];
    if (names.includes('ReactElement') || names.includes('ReactPortal')) return true;
    return /^(React\.)?(ReactElement|JSX\.Element|ReactPortal)\b/.test(checker.typeToString(t));
  });
};

/** Reads of `.ref` / `['ref']` whose object is a React element (or untyped any/unknown). */
export function elementRefReads(root, files, options = compilerOptions(root)) {
  const program = ts.createProgram(files, options);
  const checker = program.getTypeChecker();
  const wanted = new Set(files);
  const hits = [];
  for (const sf of program.getSourceFiles()) {
    if (!wanted.has(sf.fileName)) continue;
    const visit = (node) => {
      let obj = null;
      if (ts.isPropertyAccessExpression(node) && node.name.text === 'ref') obj = node.expression;
      else if (ts.isElementAccessExpression(node) && ts.isStringLiteralLike(node.argumentExpression)
        && node.argumentExpression.text === 'ref') obj = node.expression;
      if (obj) {
        const p = node.parent;
        const isWrite = ts.isBinaryExpression(p) && p.left === node
          && p.operatorToken.kind >= ts.SyntaxKind.FirstAssignment
          && p.operatorToken.kind <= ts.SyntaxKind.LastAssignment;
        if (!isWrite && isElementLike(checker, checker.getTypeAtLocation(obj))) {
          const { line } = sf.getLineAndCharacterOfPosition(node.getStart(sf));
          hits.push(`${posixRel(root, sf.fileName)}:${line + 1} ${node.getText(sf)}`);
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(sf);
  }
  return hits;
}

/* ---- expiring baseline ---- */

export function loadBaseline(root) {
  const p = join(root, BASELINE_REL);
  if (!existsSync(p)) return [];
  const rows = JSON.parse(readFileSync(p, 'utf8'));
  if (!Array.isArray(rows)) throw new Error(`${BASELINE_REL} must be a JSON array`);
  return rows;
}

const validRow = (r) => r && typeof r === 'object'
  && RULES.includes(r.rule)
  && typeof r.file === 'string' && r.file.startsWith('src/')
  && Number.isInteger(r.count) && r.count > 0
  && typeof r.owner === 'string' && /^FIN-[A-H]$/.test(r.owner)
  && typeof r.reqFin === 'string' && /^REQ-FIN-\d+$/.test(r.reqFin)
  && r.expires === 'RC-1';

/**
 * Compare current offenders (Map<file, count>) of one rule with its baseline rows.
 * fresh: offender without a row, or with more occurrences than its row allows.
 * stale: row whose file no longer offends or now offends less (lower/remove it).
 */
export function diffBaseline(rule, offenders, rows) {
  const malformed = rows.filter((r) => !validRow(r)).map((r) => JSON.stringify(r));
  const mine = rows.filter((r) => validRow(r) && r.rule === rule);
  const byFile = new Map();
  const duplicate = [];
  for (const r of mine) {
    if (byFile.has(r.file)) duplicate.push(`${rule} ${r.file}`);
    byFile.set(r.file, r);
  }
  const fresh = [];
  for (const [file, count] of offenders) {
    const row = byFile.get(file);
    if (!row) fresh.push(`${file} (${count}, no baseline row)`);
    else if (count > row.count) fresh.push(`${file} (${count} > baseline ${row.count})`);
  }
  const stale = [];
  for (const [file, row] of byFile) {
    const count = offenders.get(file) ?? 0;
    if (count < row.count) stale.push(`${file} (baseline ${row.count}, now ${count})`);
  }
  return { fresh, stale, malformed: [...malformed, ...duplicate] };
}

/** Rows for the current offenders, for the baseline owner to commit (tool output, never hand-written). */
export function rowsFor(rule, offenders) {
  return [...offenders].sort(([a], [b]) => a.localeCompare(b))
    .map(([file, count]) => ({ rule, file, count, ...ownerOf(file), expires: 'RC-1' }));
}
