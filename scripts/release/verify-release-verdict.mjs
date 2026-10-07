#!/usr/bin/env node
/* plat:publish:npm step 1 (§4.13.7). Reads ReleaseVerdict (S-55). For a 5.x GA tag it
   fails unless the file exists and ga === true. For pre-release tags and 4.x tags the
   verdict is advisory and a missing file is reported, not fatal. */
import { existsSync, readFileSync } from 'node:fs';

const arg = (n) => { const i = process.argv.indexOf(`--${n}`); return i >= 0 ? process.argv[i + 1] : null; };
const tag = arg('tag') ?? process.env.CI_COMMIT_TAG ?? '';
const line = arg('line') ?? process.env.AG_LINE ?? '5x';
const FILE = '.artifacts/qual/release-verdict.json';

const isGA = /^v5\.\d+\.\d+$/.test(tag);
if (!existsSync(FILE)) {
  if (isGA && line === '5x') {
    console.error(`verify-release-verdict FAIL: ${FILE} missing for GA tag ${tag}`);
    process.exit(1);
  }
  console.log(`verify-release-verdict: no verdict artifact (advisory for ${tag || 'non-GA'})`);
  process.exit(0);
}
const verdict = JSON.parse(readFileSync(FILE, 'utf8'));
if (isGA && line === '5x' && verdict.ga !== true) {
  const open = (verdict.items ?? []).filter((i) => i.status !== 'pass').map((i) => `${i.id}:${i.status}`);
  console.error(`verify-release-verdict FAIL: ga !== true for ${tag}. open items: ${open.join(', ') || 'none listed'}`);
  process.exit(1);
}
console.log(`verify-release-verdict OK (${tag || 'untagged'}, ga=${verdict.ga})`);
