/* REQ-PLAT-69 staged rollout (G-05). Outside PLAT globs the PLAT rules are
   `warn` until RC-1, then `error`; inside PLAT globs they are always `error`
   (_strict.cjs). The line is at RC-1 when the package version is a 5.x RC or
   GA (5.y.z-rc.n / 5.y.z), or the pipeline builds such a tag
   (CI_COMMIT_TAG, same test as scripts/qual/lint-tests.mjs phaseFromEnv).
   Not a rule module (leading underscore: skipped by the plugin loader). */
const fs = require('node:fs');
const path = require('node:path');

const RC_OR_GA = /^v?5\.\d+\.\d+(-rc\.\d+)?$/;

function phase({ env = process.env, version } = {}) {
  if (RC_OR_GA.test(env.CI_COMMIT_TAG ?? '')) return 'rc';
  let v = version;
  if (v === undefined) {
    try { v = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../package.json'), 'utf8')).version; } catch { v = ''; }
  }
  return RC_OR_GA.test(v ?? '') ? 'rc' : 'pre-rc';
}

/** Base (repo-wide) severity of a PLAT rule for the current phase. */
const rolloutSeverity = (opts) => (phase(opts) === 'rc' ? 'error' : 'warn');

module.exports = { phase, rolloutSeverity, RC_OR_GA };
