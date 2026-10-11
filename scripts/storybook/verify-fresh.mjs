#!/usr/bin/env node
/* REQ-QUAL-56 (REQ-FIN-106, FIN-452): refuse a stale or foreign Storybook build.
   Usage: node scripts/storybook/verify-fresh.mjs [--dir storybook-static] [--sha <sha>] [--require-clean|--allow-dirty]

   Exits non-zero unless <dir>/ag-build.json exists with every field, its `sha` equals the SHA under test
   (--sha, else $CI_COMMIT_SHA, else git HEAD), `dirty` is false (required in CI; --require-clean forces it),
   and `indexSha256` equals the sha256 of <dir>/index.json. Every QUAL consumer of a built Storybook
   (browser lanes, the storybook flow specs, the AWS bundle builder) runs this first. */
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expectedSha, isCi, parseArgs, verifyFreshDir } from './lib/storybook-build.mjs';

const ROOT = resolve(fileURLToPath(new URL('.', import.meta.url)), '..', '..');

export function main(argv = process.argv.slice(2), env = process.env) {
  const args = parseArgs(argv);
  const dir = resolve(String(args.dir ?? 'storybook-static'));
  const sha = expectedSha(ROOT, typeof args.sha === 'string' ? args.sha : undefined, env);
  const requireClean = args['allow-dirty'] ? false : Boolean(args['require-clean']) || isCi(env);
  const problems = verifyFreshDir({ dir, sha, requireClean });
  if (problems.length) {
    for (const p of problems) console.error(`verify-fresh: ${p}`);
    console.error(`verify-fresh: ${dir} is not a fresh build of ${sha}; rebuild with qual:build:storybook`);
    return 1;
  }
  console.log(`verify-fresh: ${dir} is a fresh build of ${sha}`);
  return 0;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exit(main());
