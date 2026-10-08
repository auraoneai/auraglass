#!/usr/bin/env node
/* prepublishOnly guard (REQ-PLAT-12): publishing happens only inside
   plat:publish:npm on the GitLab mirror (project 87152036) for a real release
   tag, with OIDC id_tokens present. Any other publish context exits 1, so a
   laptop `npm publish` (or a stray prepublishOnly) can never ship. */
'use strict';

const ok =
  process.env.GITLAB_CI === 'true' &&
  process.env.CI_PROJECT_ID === '87152036' &&
  process.env.CI_JOB_NAME === 'plat:publish:npm' &&
  /^v\d+\.\d+\.\d+(-(alpha|beta|rc)\.\d+)?$/.test(process.env.CI_COMMIT_TAG ?? '') &&
  Boolean(process.env.NPM_ID_TOKEN);

if (!ok) {
  console.error(
    'require-ci-publish: publishing is restricted to the plat:publish:npm job ' +
      'of GitLab project 87152036 on a release tag (vX.Y.Z[-(alpha|beta|rc).N]) ' +
      'with OIDC id_tokens. This context is not that job.',
  );
  process.exit(1);
}
console.log('require-ci-publish: plat:publish:npm context confirmed');
