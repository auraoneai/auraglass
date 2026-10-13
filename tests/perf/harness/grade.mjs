#!/usr/bin/env node
/* tests/perf/harness/grade.mjs — REQ-QUAL-37 (QUAL). PRD-named location of the perf grader CLI; the
   implementation lives in scripts/qual/perf/grade.mjs (logic in packages/qa/src/perf/grade.ts) next to the
   other L10 perf CLIs the qual:certify jobs call. This module only re-exports it, so both paths run the
   identical grader:

     node tests/perf/harness/grade.mjs --results <file|glob>[,...] [--scope main|nightly|release] ... */
import { resolve } from 'node:path';
import { gradeCli } from '../../../scripts/qual/perf/grade.mjs';

export { GRADE_JOB, GRADE_JOB_SLUG, gradeCli, parseArgs, previousTag } from '../../../scripts/qual/perf/grade.mjs';

if (process.argv[1] && resolve(process.argv[1]) === resolve(new URL(import.meta.url).pathname)) {
  gradeCli().then((c) => { process.exitCode = c; }, (e) => { process.stderr.write(`${e?.stack ?? e}\n`); process.exitCode = 1; });
}
