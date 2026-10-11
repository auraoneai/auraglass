// fixtures.ts — deterministic sample data for ai-eval-dashboard (no clocks, no randomness,
// no network — contract §3.3 file contract). Stories and showcases import it.
import type { EvalRun } from './EvalDashboard';
import data from './fixtures/runs.json';

/** The recorded eval-run sample ({ runs }), shipped as fixtures/runs.json. */
export const EVAL_RUNS = data;

export const EVAL_RUN_ROWS: readonly EvalRun[] = data.runs;
