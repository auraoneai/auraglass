#!/usr/bin/env node
/* scripts/qual/perf/pw-verdict.mjs — L10 Playwright verdict with the lane runner's pending rule (QUAL).
   Classifies a Playwright JSON report with certification/run.mjs `classifyPlaywrightReport`: exit 0 when every test
   passed; exit 0 and print PENDING when every failure is a `pending:` producer error AND scope is not release
   (PRD-F §4.3 rule 2); exit 1 otherwise (incl. 0 tests or a missing report). Never turns a real failure into a pass.
   `--exit <n>` is Playwright's own exit code: a non-zero exit with an all-pass report (e.g. a webServer or worker
   crash after the tests) is a failure.
   Usage: node scripts/qual/perf/pw-verdict.mjs <playwright-report.json> [--scope <scope>] [--exit <code>] */
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { classifyPlaywrightReport } from '../../../packages/qa/src/evidence/playwrightReport.mjs';

export function verdict(report, scope, exitCode = 0) {
  const c = classifyPlaywrightReport(report);
  if (c.total === 0) return { code: 1, line: 'FAIL 0 tests' };
  if (c.failed === 0) return exitCode === 0 ? { code: 0, line: `PASS ${c.total} test(s)` } : { code: 1, line: `FAIL playwright exited ${exitCode} with ${c.total} passing test(s)` };
  if (c.pendingOnly && scope !== 'release') return { code: 0, line: `PENDING ${c.pendingReasons.join(' | ')}` };
  return { code: 1, line: `FAIL ${c.failed} of ${c.total} test(s)${c.pendingOnly ? ' (pending is a failure at release scope)' : ''}` };
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(new URL(import.meta.url).pathname)) {
  const [file, ...rest] = process.argv.slice(2);
  const opt = (k) => { const i = rest.indexOf(k); return i >= 0 ? rest[i + 1] : undefined; };
  const scope = opt('--scope') ?? process.env.AG_SCOPE ?? 'pr';
  const exitCode = Number(opt('--exit') ?? 0);
  if (!file || !existsSync(file)) { process.stdout.write(`FAIL no Playwright report at ${file}\n`); process.exitCode = 1; }
  else {
    const v = verdict(JSON.parse(readFileSync(file, 'utf8')), scope, exitCode);
    process.stdout.write(`${file}: ${v.line}\n`);
    process.exitCode = v.code;
  }
}
