#!/usr/bin/env node
/* plat:publish:npm step 1 (§4.13.7, REQ-PLAT-10). Reads ReleaseVerdict (S-55)
   produced by qual:certify:release at .artifacts/qual/release-verdict.json.
   For a 5.x.y GA tag the publish fails unless the verdict exists, its sha equals
   CI_COMMIT_SHA and ga === true. For pre-release and 4.x tags the verdict is
   advisory: a missing file is reported, not fatal. */
import { existsSync, readFileSync } from 'node:fs';

const arg = (n) => {
  const i = process.argv.indexOf(`--${n}`);
  return i >= 0 ? process.argv[i + 1] : null;
};
const tag = arg('tag') ?? process.env.CI_COMMIT_TAG ?? '';
const line = arg('line') ?? process.env.AG_LINE ?? '5x';
const sha = arg('sha') ?? process.env.CI_COMMIT_SHA ?? '';
const FILE = '.artifacts/qual/release-verdict.json';

const isGA = /^v5\.\d+\.\d+$/.test(tag);
if (!existsSync(FILE)) {
  if (isGA) {
    console.error(`verify-release-verdict FAIL: ${FILE} missing for GA tag ${tag}`);
    process.exit(1);
  }
  console.log(`verify-release-verdict: no verdict artifact (advisory for ${tag || 'non-GA'})`);
  process.exit(0);
}
const verdict = JSON.parse(readFileSync(FILE, 'utf8'));
if (isGA) {
  // REQ-PLAT-11: the verdict must be bound to this exact commit — a verdict
  // without `sha`, or a pipeline without CI_COMMIT_SHA, is a failure.
  if (!sha) {
    console.error('verify-release-verdict FAIL: CI_COMMIT_SHA (or --sha) is required for a GA tag');
    process.exit(1);
  }
  if (!verdict.sha) {
    console.error(`verify-release-verdict FAIL: ${FILE} has no sha for GA tag ${tag}`);
    process.exit(1);
  }
  if (verdict.sha !== sha) {
    console.error(`verify-release-verdict FAIL: verdict sha ${verdict.sha} != CI_COMMIT_SHA ${sha}`);
    process.exit(1);
  }
  if (verdict.ga !== true) {
    const open = (verdict.items ?? [])
      .filter((i) => i.status !== 'pass')
      .map((i) => `${i.id}:${i.status}`);
    console.error(
      `verify-release-verdict FAIL: ga !== true for ${tag}. open items: ${open.join(', ') || 'none listed'}`,
    );
    process.exit(1);
  }
}
console.log(`verify-release-verdict OK (${tag || 'untagged'}, line ${line}, ga=${verdict.ga})`);
