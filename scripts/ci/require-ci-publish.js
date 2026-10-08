#!/usr/bin/env node
/* PLAT-137 — publish guard: refuse any publish that did not originate
   from CI with the release tag. Prepublish hook, runs first. */
const required = ['CI', 'GITLAB_CI'];
const missing = required.filter((v) => !process.env[v]);
if (missing.length) {
  console.error(
    `require-ci-publish: refusing publish outside CI (missing ${missing.join(', ')}). ` +
      'Releases publish from the GitLab tag pipeline only.',
  );
  process.exit(1);
}
if (!process.env.CI_COMMIT_TAG) {
  console.error('require-ci-publish: refusing publish without CI_COMMIT_TAG — tag pipelines only.');
  process.exit(1);
}
console.log(`require-ci-publish: ok (${process.env.CI_COMMIT_TAG})`);
