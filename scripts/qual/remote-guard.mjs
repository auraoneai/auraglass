/* scripts/qual/remote-guard.mjs — REQ-QUAL-67 remote-only guard (QUAL, FIN-425).

   No QUAL script launches a browser unless it runs on GitLab CI (`CI=true`) or the gated remote runner
   (`AG_REMOTE_RUNNER=1`, set by the root `.ag-playwright` template and by scripts/qual/remote/worker-entry.sh). A local
   run prints the remote command and exits 2, unless the operator sets `AG_CERT_ALLOW_LOCAL=1` for explicit local
   debugging. Every browser-launching QUAL entry point imports this module (packages/qa/test/remote-guard.test.ts
   enumerates them): certification/run.mjs (through packages/qa/src/evidence/laneRunner.ts),
   certification/playwright.cert.config.ts, tests/perf/qual/playwright.config.ts and tests/perf/harness/run-perf.mjs.

   Dependency-free on purpose: it is loaded by node scripts, by esbuild bundles and by Playwright's config loader. */

export const REMOTE_EXIT = 2;

/** The env assignments that allow a browser launch (any one). */
export const REMOTE_ENV = Object.freeze(['CI=true', 'AG_REMOTE_RUNNER=1', 'AG_CERT_ALLOW_LOCAL=1']);

/** true when this process may launch a browser. */
export function remoteAllowed(env = process.env) {
  return env.CI === 'true' || env.AG_REMOTE_RUNNER === '1' || env.AG_CERT_ALLOW_LOCAL === '1';
}

/** The command to run instead, on the remote runner (exact argv preserved). */
export function remoteCommand(command) {
  return `AG_REMOTE_RUNNER=1 ${command}`;
}

/** The message a refused local run prints (stderr). */
export function remoteMessage(command, what = 'QUAL certification') {
  return [
    `remote-only: ${what} launches browsers and runs only on GitLab CI or the gated remote runner (REQ-QUAL-67, machine policy).`,
    `Remote command: ${command}`,
    `Run it through the mirrored branch's GitLab pipeline, or on the gated AWS runner as: ${remoteCommand(command)}`,
    '(offline bundle: node scripts/qual/remote/build-bundle.mjs, then scripts/qual/remote/worker-entry.sh on the worker).',
    'Explicit local debugging only: AG_CERT_ALLOW_LOCAL=1.',
  ].join('\n');
}

/** Returns null when allowed; otherwise the refusal (message + exit code). Never exits by itself. */
export function checkRemote({ command, env = process.env, what } = {}) {
  if (remoteAllowed(env)) return null;
  return { code: REMOTE_EXIT, message: remoteMessage(command ?? defaultCommand(), what) };
}

/** Script entry points: print the remote command and exit 2 when not allowed. */
export function guardRemote({ command, env = process.env, what } = {}) {
  const refusal = checkRemote({ command, env, what });
  if (!refusal) return;
  process.stderr.write(`${refusal.message}\n`);
  process.exit(refusal.code);
}

function defaultCommand() {
  const [, script, ...args] = process.argv;
  const rel = script && script.startsWith(process.cwd()) ? script.slice(process.cwd().length + 1) : script;
  return ['node', rel, ...args].filter(Boolean).join(' ');
}
