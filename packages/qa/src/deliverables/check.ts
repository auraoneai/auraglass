/* packages/qa/src/deliverables/check.ts — REQ-QUAL-71 flagship deliverables (G-04; contract §6.2 row G-04, FIN-442).
 *
 * For each of the 44 flagships (ComponentMeta.flagship, contract S-31 range 1..44) it verifies the architecture §11.3
 * definition of done, reading only metas, fragments, artifacts and file existence:
 *
 *   meta            a meta declares the number, its owner is the stream that owns the number (contract §1:
 *                   CMP 1–13 and 15–21, SURF 14 and 22–44), and the meta is a static literal
 *   parts           rendered parts (QUAL artifact RENDERED_PARTS) equal meta.parts; meta.parts valid kebab names
 *   selectors       every meta.migration row has a non-empty `selectors` table (the 4.x → 5.0 selector change table)
 *   registry        at least one registry block or item imports a member of the flagship
 *   apg             an APG spec under tests/a11y/apg/<owner>/ for the member
 *   size-budget     a fragments/size-budgets row for the member
 *   perf-grade      perf grade ≥ C in REPORTS.perf (.artifacts/qual/perf-report.json) for every profile reported
 *   l7-baselines    certification/baselines/linux/<engine>/<subject>/*.png for chromium, webkit and firefox
 *   codemod-fixture a fixture under fragments/codemods/<owner>/fixtures/ naming every absorbed 4.x name
 *                   (meta.migration[].from)
 *
 * A flagship number may group several metas of the same owner (architecture §11.2 composite flagships, e.g. 14 =
 * DateField/TimeField/DatePicker/DateRangePicker); per-member items are evaluated for the T1 members (all members
 * when none is T1), `registry` for any member.
 *
 * Status per item: `pass`; otherwise `pending` before RC-1 and `fail` at RC-1/GA (REQ-QUAL-71). Structural offenders
 * (missing number, owner outside the number's range, number outside 1..44, non-literal meta) fail immediately unless
 * recorded in the expiring baseline (certification/deliverables-baseline.json, written only by `--write-baseline`,
 * every row `expires: "RC-1"`); a baselined offender is `pending` until RC-1, then `fail`.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { parse } from '@typescript-eslint/parser';

export const FLAGSHIP_COUNT = 44; // contract S-31: `flagship?: number; // 1..44 (architecture §11.2)`
export const PART_NAME_RE = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/; // contract S-30 PART_NAME_RE (copied: this file runs under node type-stripping)
export const PERF_REPORT = '.artifacts/qual/perf-report.json'; // contract REPORTS.perf
/** QUAL-internal artifact written by the L5 behaviour lane: rendered `data-ag-part` values per subject. */
export const RENDERED_PARTS = '.artifacts/qual/rendered-parts.json';
export const BASELINE_FILE = 'certification/deliverables-baseline.json';
export const L7_ENGINES = ['chromium', 'webkit', 'firefox'] as const;
export const ITEM_IDS = ['meta', 'parts', 'selectors', 'registry', 'apg', 'size-budget', 'perf-grade', 'l7-baselines', 'codemod-fixture'] as const;

export type ItemId = (typeof ITEM_IDS)[number];
export type Status = 'pass' | 'pending' | 'fail';
export type Phase = 'pre-rc' | 'rc';
export type Owner = 'CMP' | 'SURF' | 'MAT';

export interface MetaRecord {
  file: string;
  name: string;
  owner: Owner;
  tier: string;
  flagship: number | undefined;
  parts: readonly string[];
  migration: ReadonlyArray<{ from: string; selectors?: Record<string, string> }>;
  /** non-contract top-level `selectors` some metas carry (reported, never accepted in place of migration[].selectors) */
  topLevelSelectors: number;
  literal: boolean;
}
export interface Inputs {
  metas: MetaRecord[];
  sizeBudgetIds: Set<string>;
  registryImports: Map<string, string[]>; // imported name -> registry files
  apgSpecs: Record<string, Array<{ file: string; content: string }>>; // owner dir -> specs
  codemodFixtures: Record<string, Array<{ file: string; content: string }>>; // owner dir -> fixture files
  baselinePngs: Map<string, number>; // `${engine}/${subject}` -> png count
  perfReport: { subjects: Array<{ subject: string; profile: string; grade: string }> } | null;
  renderedParts: { subjects: Record<string, readonly string[]> } | null;
}
export interface Offender { kind: 'missing' | 'owner-range' | 'out-of-range' | 'non-literal'; flagship: number; owner: string; metas: string[] }
export interface BaselineRow extends Offender { expires: 'RC-1' }
export interface Baseline { version: 1; gate: 'REQ-QUAL-71'; rows: BaselineRow[] }
export interface ItemResult { status: Status; detail: string }
export interface FlagshipResult {
  flagship: number;
  owner: string;
  subjects: string[];
  metas: string[];
  status: Status;
  items: Record<ItemId, ItemResult>;
}
export interface DeliverablesReport {
  version: 1;
  gate: 'REQ-QUAL-71';
  phase: Phase;
  flagshipCount: number;
  flagships: FlagshipResult[];
  offenders: Array<Offender & { baselined: boolean; status: Status }>;
  staleBaselineRows: BaselineRow[];
  byOwner: Record<string, { pass: number; pending: number; fail: number; offenders: number }>;
  ok: boolean;
}

/** Owning stream of a flagship number (contract §1 stream table). */
export function rangeOwner(n: number): Owner {
  return n === 14 || n >= 22 ? 'SURF' : 'CMP';
}

// ---------------------------------------------------------------- static literal reading

const NON_LITERAL = Symbol('non-literal');
type Lit = string | number | boolean | null | undefined | Lit[] | { [k: string]: Lit } | typeof NON_LITERAL;

function literal(node: any, scope?: Map<string, any>): Lit {
  if (!node) return undefined;
  switch (node.type) {
    case 'TSAsExpression': case 'TSSatisfiesExpression': case 'TSNonNullExpression': case 'TSTypeAssertion':
      return literal(node.expression, scope);
    case 'Literal': return node.value as Lit;
    case 'TemplateLiteral': return node.expressions.length === 0 ? node.quasis.map((q: any) => q.value.cooked).join('') : NON_LITERAL;
    case 'UnaryExpression': {
      const v = literal(node.argument, scope);
      return node.operator === '-' && typeof v === 'number' ? -v : NON_LITERAL;
    }
    case 'Identifier':
      if (node.name === 'undefined') return undefined;
      return scope?.has(node.name) ? literal(scope.get(node.name), scope) : NON_LITERAL;
    case 'ArrayExpression': {
      const out: Lit[] = [];
      for (const e of node.elements) {
        if (e && e.type === 'SpreadElement') {
          const v = literal(e.argument, scope);
          if (!Array.isArray(v)) return NON_LITERAL;
          out.push(...v);
          continue;
        }
        const v = literal(e, scope);
        if (v === NON_LITERAL) return NON_LITERAL;
        out.push(v);
      }
      return out;
    }
    case 'ObjectExpression': {
      const out: Record<string, Lit> = {};
      for (const p of node.properties) {
        if (p.type !== 'Property' || p.computed) return NON_LITERAL;
        const key = p.key.type === 'Identifier' ? p.key.name : String(p.key.value);
        const v = literal(p.value, scope);
        if (v === NON_LITERAL) return NON_LITERAL;
        out[key] = v;
      }
      return out;
    }
    default: return NON_LITERAL;
  }
}

/** Shallow read of an object literal that tolerates non-literal values (marks the record non-literal). */
function looseObject(node: any): { value: Record<string, Lit>; literal: boolean } | null {
  let n = node;
  while (n && (n.type === 'TSAsExpression' || n.type === 'TSSatisfiesExpression')) n = n.expression;
  if (!n || n.type !== 'ObjectExpression') return null;
  const value: Record<string, Lit> = {};
  let ok = true;
  for (const p of n.properties) {
    if (p.type !== 'Property' || p.computed) { ok = false; continue; }
    const key = p.key.type === 'Identifier' ? p.key.name : String(p.key.value);
    const v = literal(p.value);
    if (v === NON_LITERAL) ok = false;
    value[key] = v;
  }
  return { value, literal: ok };
}

function parseModule(code: string, file: string): any {
  return parse(code, { jsx: file.endsWith('.tsx'), loc: true, range: true, sourceType: 'module', ecmaVersion: 'latest' });
}

/** Every meta object exported by a `*.meta.ts` file: `export default defineMeta({...})` and exported const literals
 *  carrying name + owner + parts. */
export function readMetaSource(code: string, file: string): MetaRecord[] {
  const ast = parseModule(code, file);
  const objects: Array<{ value: Record<string, Lit>; literal: boolean }> = [];
  const take = (expr: any) => {
    let e = expr;
    while (e && (e.type === 'TSAsExpression' || e.type === 'TSSatisfiesExpression')) e = e.expression;
    if (e && e.type === 'CallExpression' && e.callee.type === 'Identifier' && e.callee.name === 'defineMeta') e = e.arguments[0];
    const o = looseObject(e);
    if (o && typeof o.value.name === 'string' && typeof o.value.owner === 'string' && 'parts' in o.value) objects.push(o);
  };
  // top-level `const meta = defineMeta({...}); export default meta;` and `export { meta as default }`
  const consts = new Map<string, any>();
  for (const st of ast.body) {
    const decl = st.type === 'VariableDeclaration' ? st : st.type === 'ExportNamedDeclaration' && st.declaration?.type === 'VariableDeclaration' ? st.declaration : null;
    if (decl) for (const d of decl.declarations) if (d.id.type === 'Identifier') consts.set(d.id.name, d.init);
  }
  const seen = new Set<any>();
  const takeOnce = (expr: any) => {
    const e = expr && expr.type === 'Identifier' ? consts.get(expr.name) : expr;
    if (!e || seen.has(e)) return;
    seen.add(e);
    take(e);
  };
  for (const st of ast.body) {
    if (st.type === 'ExportDefaultDeclaration') takeOnce(st.declaration);
    if (st.type === 'ExportNamedDeclaration' && st.declaration?.type === 'VariableDeclaration') {
      for (const d of st.declaration.declarations) takeOnce(d.init);
    }
    if (st.type === 'ExportNamedDeclaration' && !st.declaration && !st.source) {
      for (const s of st.specifiers) if (s.local.type === 'Identifier') takeOnce(s.local);
    }
  }
  return objects.map(({ value: v, literal: ok }) => ({
    file,
    name: v.name as string,
    owner: v.owner as Owner,
    tier: typeof v.tier === 'string' ? v.tier : '',
    flagship: typeof v.flagship === 'number' ? v.flagship : undefined,
    parts: Array.isArray(v.parts) ? (v.parts as Lit[]).filter((p): p is string => typeof p === 'string') : [],
    migration: Array.isArray(v.migration)
      ? (v.migration as Lit[]).filter((r): r is Record<string, Lit> => !!r && typeof r === 'object' && !Array.isArray(r))
        .map((r) => ({
          from: String(r.from ?? ''),
          ...(r.selectors && typeof r.selectors === 'object' && !Array.isArray(r.selectors) ? { selectors: r.selectors as Record<string, string> } : {}),
        }))
      : [],
    topLevelSelectors: Array.isArray(v.selectors) ? v.selectors.length : 0,
    literal: ok,
  }));
}

/** Rows of a `fragments/size-budgets/<stream>.ts` default-exported array literal. */
export function readSizeBudgetSource(code: string, file: string): Array<{ id: string; import: string }> {
  const ast = parseModule(code, file);
  const scope = new Map<string, any>();
  for (const st of ast.body) {
    if (st.type === 'VariableDeclaration' && st.kind === 'const') for (const d of st.declarations) if (d.id.type === 'Identifier') scope.set(d.id.name, d.init);
  }
  for (const st of ast.body) {
    if (st.type !== 'ExportDefaultDeclaration') continue;
    const v = literal(st.declaration, scope);
    if (!Array.isArray(v)) throw new Error(`deliverables: ${file} default export is not a static array literal (size-budgets rows must be readable without executing the fragment)`);
    return v.filter((r): r is Record<string, Lit> => !!r && typeof r === 'object' && !Array.isArray(r))
      .map((r) => ({ id: String(r.id ?? ''), import: String(r.import ?? '') }));
  }
  return [];
}

/** Value names imported by a registry source (type-only imports excluded). */
export function readImportedNames(code: string, file: string): string[] {
  const ast = parseModule(code, file);
  const names: string[] = [];
  for (const st of ast.body) {
    if (st.type !== 'ImportDeclaration' || st.importKind === 'type') continue;
    const src = String(st.source.value);
    if (src.startsWith('./')) continue; // the block's own files
    for (const s of st.specifiers) {
      if (s.type === 'ImportSpecifier' && s.importKind !== 'type') names.push(s.imported.type === 'Identifier' ? s.imported.name : String(s.imported.value));
    }
  }
  return names;
}

// ---------------------------------------------------------------- filesystem inputs

function walkFiles(root: string, dir: string, pred: (rel: string) => boolean): string[] {
  const abs = join(root, dir);
  if (!existsSync(abs)) return [];
  const out: string[] = [];
  const stack = [abs];
  while (stack.length) {
    const d = stack.pop() as string;
    for (const e of readdirSync(d)) {
      if (e === 'node_modules' || e.startsWith('.')) continue;
      const p = join(d, e);
      if (statSync(p).isDirectory()) stack.push(p);
      else { const rel = relative(root, p).split(sep).join('/'); if (pred(rel)) out.push(rel); }
    }
  }
  return out.sort();
}
const readJson = (p: string): any => (existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : null);

export function collectInputs(root: string, opts: { artifactsDir?: string } = {}): Inputs {
  const artifacts = opts.artifactsDir ?? root;
  const metas = walkFiles(root, 'src', (f) => f.endsWith('.meta.ts'))
    .flatMap((f) => readMetaSource(readFileSync(join(root, f), 'utf8'), f));
  const sizeBudgetIds = new Set<string>();
  for (const f of walkFiles(root, 'fragments/size-budgets', (x) => /\.(ts|mts)$/.test(x) && !x.includes('.test.'))) {
    for (const r of readSizeBudgetSource(readFileSync(join(root, f), 'utf8'), f)) {
      sizeBudgetIds.add(r.id);
      const m = /^\{\s*([^}]*)\}/.exec(r.import);
      if (m) for (const n of (m[1] as string).split(',')) { const t = n.trim().split(/\s+as\s+/)[0]; if (t) sizeBudgetIds.add(t); }
    }
  }
  const registryImports = new Map<string, string[]>();
  for (const f of walkFiles(root, 'registry', (x) => /^registry\/(blocks|items)\//.test(x) && /\.(tsx?|mts)$/.test(x) && !/\.(test|spec|stories)\./.test(x))) {
    for (const n of readImportedNames(readFileSync(join(root, f), 'utf8'), f)) registryImports.set(n, [...(registryImports.get(n) ?? []), f]);
  }
  const byOwnerDir = (base: (owner: string) => string, pred: (rel: string) => boolean) => {
    const out: Record<string, Array<{ file: string; content: string }>> = {};
    for (const o of ['cmp', 'surf', 'mat']) {
      out[o] = walkFiles(root, base(o), pred).map((file) => ({ file, content: readFileSync(join(root, file), 'utf8') }));
    }
    return out;
  };
  const apgSpecs = byOwnerDir((o) => `tests/a11y/apg/${o}`, (f) => f.endsWith('.apg.spec.ts'));
  const codemodFixtures = byOwnerDir((o) => `fragments/codemods/${o}/fixtures`, () => true);
  const baselinePngs = new Map<string, number>();
  for (const f of walkFiles(root, 'certification/baselines/linux', (x) => x.endsWith('.png'))) {
    const [, , , engine, subject] = f.split('/');
    if (engine && subject) baselinePngs.set(`${engine}/${subject}`, (baselinePngs.get(`${engine}/${subject}`) ?? 0) + 1);
  }
  return {
    metas, sizeBudgetIds, registryImports, apgSpecs, codemodFixtures, baselinePngs,
    perfReport: readJson(join(artifacts, PERF_REPORT)),
    renderedParts: readJson(join(artifacts, RENDERED_PARTS)),
  };
}

export function readBaseline(root: string): Baseline | null {
  return readJson(join(root, BASELINE_FILE));
}

// ---------------------------------------------------------------- evaluation

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
const offenderKey = (o: Offender) => `${o.kind}|${o.flagship}|${o.owner}|${[...o.metas].sort().join(',')}`;
const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function findOffenders(metas: readonly MetaRecord[]): Offender[] {
  const out: Offender[] = [];
  for (const m of metas) {
    if (m.flagship === undefined) continue;
    if (!Number.isInteger(m.flagship) || m.flagship < 1 || m.flagship > FLAGSHIP_COUNT) {
      out.push({ kind: 'out-of-range', flagship: m.flagship, owner: m.owner, metas: [`${m.file}#${m.name}`] });
      continue;
    }
    if (m.owner !== rangeOwner(m.flagship)) out.push({ kind: 'owner-range', flagship: m.flagship, owner: m.owner, metas: [`${m.file}#${m.name}`] });
    if (!m.literal) out.push({ kind: 'non-literal', flagship: m.flagship, owner: m.owner, metas: [`${m.file}#${m.name}`] });
  }
  for (let n = 1; n <= FLAGSHIP_COUNT; n += 1) {
    if (!metas.some((m) => m.flagship === n)) out.push({ kind: 'missing', flagship: n, owner: rangeOwner(n), metas: [] });
  }
  return out.sort((a, b) => a.flagship - b.flagship || a.kind.localeCompare(b.kind));
}

export function evaluate(inputs: Inputs, opts: { phase: Phase; baseline?: Baseline | null }): DeliverablesReport {
  const { phase } = opts;
  const notYet: Status = phase === 'rc' ? 'fail' : 'pending';
  const baselineKeys = new Map((opts.baseline?.rows ?? []).map((r) => [offenderKey(r), r] as const));
  const offenders = findOffenders(inputs.metas).map((o) => {
    const baselined = baselineKeys.has(offenderKey(o));
    return { ...o, baselined, status: (baselined && phase !== 'rc' ? 'pending' : 'fail') as Status };
  });
  const liveKeys = new Set(offenders.map(offenderKey));
  const staleBaselineRows = (opts.baseline?.rows ?? []).filter((r) => !liveKeys.has(offenderKey(r)));

  const ok = (detail: string): ItemResult => ({ status: 'pass', detail });
  const no = (detail: string): ItemResult => ({ status: notYet, detail });
  const worst = (rs: ItemResult[]): ItemResult => {
    const bad = rs.filter((r) => r.status !== 'pass');
    if (bad.length === 0) return ok(rs.map((r) => r.detail).join('; '));
    const s: Status = bad.some((r) => r.status === 'fail') ? 'fail' : 'pending';
    return { status: s, detail: bad.map((r) => r.detail).join('; ') };
  };

  const flagships: FlagshipResult[] = [];
  for (let n = 1; n <= FLAGSHIP_COUNT; n += 1) {
    const members = inputs.metas.filter((m) => m.flagship === n);
    const t1 = members.filter((m) => m.tier === 'T1');
    const primary = t1.length > 0 ? t1 : members;
    const mine = offenders.filter((o) => o.flagship === n);
    const items = {} as Record<ItemId, ItemResult>;

    // meta
    if (members.length === 0) {
      const o = mine.find((x) => x.kind === 'missing');
      items.meta = { status: o?.status ?? 'fail', detail: `no meta declares flagship ${n} (owner ${rangeOwner(n)})${o?.baselined ? ' [baselined until RC-1]' : ''}` };
    } else if (mine.length > 0) {
      items.meta = worst(mine.map((o) => ({ status: o.status, detail: `${o.kind}: ${o.metas.join(', ')} (owner ${o.owner}, number owned by ${rangeOwner(n)})${o.baselined ? ' [baselined until RC-1]' : ''}` })));
    } else {
      items.meta = ok(members.map((m) => `${m.name} (${m.file})`).join(', '));
    }

    if (members.length === 0) {
      for (const id of ITEM_IDS) if (id !== 'meta') items[id] = no('no meta: item cannot be evaluated');
    } else {
      // parts
      items.parts = worst(primary.map((m) => {
        const bad = m.parts.filter((p) => !PART_NAME_RE.test(p));
        const dup = m.parts.filter((p, i) => m.parts.indexOf(p) !== i);
        if (m.parts.length === 0) return no(`${m.name}: meta.parts is empty`);
        if (bad.length || dup.length) return { status: 'fail', detail: `${m.name}: invalid meta.parts ${[...bad, ...dup].join(', ')}` };
        const rendered = inputs.renderedParts?.subjects?.[m.name];
        if (!inputs.renderedParts) return no(`${m.name}: ${RENDERED_PARTS} not present (L5 behaviour lane artifact)`);
        if (!rendered) return no(`${m.name}: no rendered parts recorded`);
        const want = [...new Set(m.parts)].sort(); const got = [...new Set(rendered)].sort();
        const missing = want.filter((p) => !got.includes(p)); const extra = got.filter((p) => !want.includes(p));
        return missing.length || extra.length
          ? no(`${m.name}: rendered parts differ (missing ${missing.join(',') || '-'}; extra ${extra.join(',') || '-'})`)
          : ok(`${m.name}: ${want.length} parts rendered`);
      }));
      // selectors
      items.selectors = worst(primary.map((m) => {
        if (m.migration.length === 0) {
          return no(`${m.name}: meta.migration declares no absorbed 4.x names${m.topLevelSelectors ? ` (has ${m.topLevelSelectors} top-level selectors outside migration rows)` : ''}`);
        }
        const empty = m.migration.filter((r) => !r.selectors || Object.keys(r.selectors).length === 0).map((r) => r.from);
        return empty.length
          ? no(`${m.name}: migration rows without a selectors table: ${empty.join(', ')}${m.topLevelSelectors ? ` (top-level \`selectors\` is not S-31 migration[].selectors)` : ''}`)
          : ok(`${m.name}: ${m.migration.length} migration row(s) with selectors`);
      }));
      // registry (any member)
      const reg = members.flatMap((m) => (inputs.registryImports.get(m.name) ?? []).map((f) => `${m.name} in ${f}`));
      items.registry = reg.length ? ok(reg.slice(0, 3).join(', ')) : no(`no registry block or item imports ${members.map((m) => m.name).join('/')}`);
      // apg
      items.apg = worst(primary.map((m) => {
        const dir = m.owner.toLowerCase();
        const specs = inputs.apgSpecs[dir] ?? [];
        const subjectRe = new RegExp(`subject:\\s*['"]${escapeRe(m.name)}['"]`);
        const hit = specs.find((s) => norm((s.file.split('/').pop() as string).replace(/\.apg\.spec\.ts$/, '')) === norm(m.name) || subjectRe.test(s.content));
        return hit ? ok(`${m.name}: ${hit.file}`) : no(`${m.name}: no APG spec under tests/a11y/apg/${dir}/`);
      }));
      // size-budget
      items['size-budget'] = worst(primary.map((m) => (inputs.sizeBudgetIds.has(m.name) ? ok(`${m.name}: row present`) : no(`${m.name}: no fragments/size-budgets row`))));
      // perf-grade
      items['perf-grade'] = worst(primary.map((m) => {
        if (!inputs.perfReport) return no(`${m.name}: ${PERF_REPORT} not present (L10 artifact)`);
        const rows = (inputs.perfReport.subjects ?? []).filter((s) => s.subject === m.name);
        if (rows.length === 0) return no(`${m.name}: not graded in perf-report.json`);
        const low = rows.filter((r) => !['A', 'B', 'C'].includes(r.grade));
        return low.length ? no(`${m.name}: grade below C (${low.map((r) => `${r.profile}=${r.grade}`).join(', ')})`) : ok(`${m.name}: ${rows.map((r) => `${r.profile}=${r.grade}`).join(', ')}`);
      }));
      // l7-baselines
      items['l7-baselines'] = worst(primary.map((m) => {
        const missing = L7_ENGINES.filter((e) => !inputs.baselinePngs.get(`${e}/${m.name}`));
        return missing.length ? no(`${m.name}: no L7 baselines for ${missing.join(', ')}`) : ok(`${m.name}: baselines in ${L7_ENGINES.length} engines`);
      }));
      // codemod-fixture
      items['codemod-fixture'] = worst(primary.map((m) => {
        const froms = [...new Set(m.migration.map((r) => r.from).filter(Boolean))];
        if (froms.length === 0) return no(`${m.name}: meta.migration declares no absorbed 4.x names`);
        const fixtures = inputs.codemodFixtures[m.owner.toLowerCase()] ?? [];
        const missing = froms.filter((f) => !fixtures.some((x) => new RegExp(`\\b${escapeRe(f)}\\b`).test(x.content)));
        return missing.length
          ? no(`${m.name}: no fixture in fragments/codemods/${m.owner.toLowerCase()}/fixtures/ for ${missing.join(', ')}`)
          : ok(`${m.name}: fixtures for ${froms.join(', ')}`);
      }));
    }
    const statuses = ITEM_IDS.map((id) => items[id].status);
    flagships.push({
      flagship: n,
      owner: rangeOwner(n),
      subjects: members.map((m) => m.name),
      metas: members.map((m) => m.file),
      status: statuses.includes('fail') ? 'fail' : statuses.includes('pending') ? 'pending' : 'pass',
      items,
    });
  }

  const byOwner: DeliverablesReport['byOwner'] = {};
  for (const f of flagships) {
    const o = (byOwner[f.owner] ??= { pass: 0, pending: 0, fail: 0, offenders: 0 });
    o[f.status] += 1;
  }
  for (const o of offenders) (byOwner[o.owner] ??= { pass: 0, pending: 0, fail: 0, offenders: 0 }).offenders += 1;
  return {
    version: 1, gate: 'REQ-QUAL-71', phase, flagshipCount: flagships.length, flagships,
    offenders, staleBaselineRows, byOwner,
    ok: flagships.every((f) => f.status !== 'fail'),
  };
}

/** The baseline the tool writes (`--write-baseline`): today's offenders, each expiring at RC-1. */
export function baselineFrom(metas: readonly MetaRecord[]): Baseline {
  return { version: 1, gate: 'REQ-QUAL-71', rows: findOffenders(metas).map((o) => ({ ...o, expires: 'RC-1' as const })) };
}
