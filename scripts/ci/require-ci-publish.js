/* require-ci-publish.js (PLAT-244) — prepublishOnly guard.
   Publishing happens only from the GitLab tag pipeline (§4.13.7). A human running
   `npm publish` from a workstation must fail here. */
'use strict';
if (!process.env.GITLAB_CI && !process.env.CI_JOB_ID) {
  console.error('aura-glass publishes only from the GitLab tag pipeline (plat:publish:npm).');
  console.error('Tag on GitHub (v5.0.0-<pre>.N); the mirror delivers the tag and CI publishes.');
  process.exit(1);
}
