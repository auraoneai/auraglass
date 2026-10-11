import { existsSync, globSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { build } from 'esbuild';
async function loadTs(file) {
 const res = await build({ entryPoints: [file], bundle: true, write: false, format: 'esm', platform: 'node', logLevel: 'silent' });
 return import(`data:text/javascript;base64,${Buffer.from(res.outputFiles[0].text).toString('base64')}`);
}
/** First line of every failed test's last error (Playwright JSON report). */
export function failureMessages(report) {
  const out = [];
  const walk = (suite) => {
    for (const spec of suite.specs ?? []) for (const t of spec.tests ?? []) {
      if (t.status !== 'unexpected') continue;
      const last = (t.results ?? []).at(-1);
      out.push({ title: spec.title, message: String(last?.error?.message ?? last?.errors?.[0]?.message ?? '').split('\n')[0] });
    }
    for (const s of suite.suites ?? []) walk(s);
  };
  for (const s of report.suites ?? []) walk(s);
  return out;
}

/** Rows of `<dir>/<prefix>-*.jsonl`; a retried test appends again, so the last row per key wins. */
export function readJsonlRows(dir, prefix, key) {
  if (!existsSync(dir)) return [];
  const byKey = new Map();
  for (const f of globSync(`${prefix}-*.jsonl`, { cwd: dir }).sort()) {
    for (const l of readFileSync(join(dir, f), 'utf8').split('\n').filter(Boolean)) { const row = JSON.parse(l); byKey.set(row[key], row); }
  }
  return [...byKey.values()];
}

const L7_DIFF_RE = /(^|[\s:])(l7-changed|l7-no-baseline): /;
const PENDING_RE = /(^|[\s:])pending: /;

/** REQ-QUAL-25: the L7 row state from the regression cells and the branch (packages/qa/src/evidence/regression.ts l7Verdict).
    A failure that is neither a baseline diff, a missing baseline nor a `pending:` producer is a plain lane failure. */
export async function l7RowResult({ report, status, evidenceDir, scope, branch, root }, deps = null) {
  const failures = failureMessages(report);
  const other = failures.filter((f) => !L7_DIFF_RE.test(f.message) && !PENDING_RE.test(f.message));
  if (status !== 0 && failures.length === 0) return { state: 'fail', reason: `exit ${status} with no failed test in the report` };
  if (other.length) return { state: 'fail', reason: `exit ${status}: ${other.length} failed test(s): ${other.slice(0, 3).map((f) => f.message).join(' | ')}` };
  const { l7Verdict, readPassingL14 } = deps ?? { ...(await loadTs(join(root, 'packages/qa/src/evidence/regression.ts'))),
    ...(await loadTs(join(root, 'packages/qa/src/evidence/l14Records.ts'))) };
  const cells = readJsonlRows(join(evidenceDir, 'regression'), 'cells', 'id');
  const diffs = failures.filter((f) => L7_DIFF_RE.test(f.message)).length;
  const recorded = cells.filter((c) => c.outcome !== 'match').length;
  if (recorded !== diffs) return { state: 'fail', reason: `regression evidence has ${recorded} changed/no-baseline cell row(s) for ${diffs} failed diff test(s)` };
  const l14 = readPassingL14(root);
  const v = l7Verdict({ scope, branch, cells, l14: l14.passing });
  const pending = [...new Set(failures.filter((f) => PENDING_RE.test(f.message)).map((f) => f.message.slice(f.message.search(PENDING_RE)).trim()))];
  const l7 = { changed: v.changed, noBaseline: v.noBaseline, ...(v.missingL14.length ? { missingL14: v.missingL14 } : {}), ...(l14.problems.length ? { l14Problems: l14.problems } : {}) };
  if (v.state === 'fail') return { state: 'fail', reason: v.reason, l7 };
  if (pending.length) return { state: scope === 'release' ? 'fail' : 'pending', reason: [...pending, ...(v.reason ? [v.reason] : [])].join(' | '), l7 };
  return { state: v.state, ...(v.reason ? { reason: v.reason } : {}), l7 };
}

/** REQ-QUAL-26: REPORTS.visualClass from the L7 rows, only when every planned visual-class cell has a merge-base/head row.
    Returns the lane result entry for the report (pass, or pending/fail with the reason; never a partial file). */
export async function writeVisualClass({ root, evidenceDir, scope, sha }, deps = null) {
  const dir = join(evidenceDir, 'regression');
  const entry = { lane: 'L7', stream: 'qual', kind: 'node-script', path: '.artifacts/qual/visual-class.json', scope, source: 'certification/run.mjs' };
  const notWritten = (reason) => ({ ...entry, state: scope === 'release' ? 'fail' : 'pending', reason: `visual-class.json not written: ${reason}` });
  if (!existsSync(join(dir, 'plan.json'))) return notWritten('no L7 plan (regression.spec.ts did not plan any cell)');
  const plan = JSON.parse(readFileSync(join(dir, 'plan.json'), 'utf8'));
  if (plan.shard) return notWritten(`L7 ran sharded (${plan.shard.index}/${plan.shard.total}); the report needs every cell in one job`);
  if (!plan.base || plan.base.error || !/^[0-9a-f]{40}$/.test(plan.base.sha ?? '')) return notWritten(`no merge-base Storybook (${plan.base?.error ?? 'AG_L7_BASE not prepared'})`);
  if (!/^[0-9a-f]{40}$/.test(sha ?? '')) return notWritten(`head sha unknown (${sha})`);
  const rows = readJsonlRows(dir, 'visual-class', 'cell');
  const have = new Set(rows.map((r) => r.cell));
  const missing = (plan.visualClassCells ?? []).filter((c) => !have.has(c));
  if (missing.length) {
    const errors = readJsonlRows(dir, 'vc-errors', 'cell').filter((e) => missing.includes(e.cell));
    return notWritten(`${missing.length} visual-class cell(s) without a merge-base/head comparison, e.g. ${missing.slice(0, 3).join(', ')}`
      + (errors.length ? `; merge-base render error: ${errors[0].error}` : ''));
  }
  const planned = new Set(plan.visualClassCells ?? []);
  const { buildVisualClassReport, writeVisualClassReport } = deps ?? await loadTs(join(root, 'packages/qa/src/evidence/visualClass.ts'));
  const report = buildVisualClassReport({ sha, base: plan.base.sha, cells: rows.filter((r) => planned.has(r.cell)) });
  const file = writeVisualClassReport(root, report);
  return { ...entry, state: 'pass', reason: `${report.cells.length} cell(s), changedCount ${report.changedCount}, base ${report.base}`, file: file.slice(root.length + 1) };
}


export function blockingExit(results) { return results.some(r => r.state === 'fail') ? 1 : 0; }
