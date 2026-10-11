#!/usr/bin/env node
// QUAL (S-41; REQ-QUAL-49..51; REQ-FIN-106; FIN-450): run every story gate against the expiring baseline.
//
//   node scripts/storybook/story-contract.mjs            exit 1 on any violation not in the baseline (printed per owner)
//   node scripts/storybook/story-contract.mjs --init     create certification/baselines-gates/story-contract.json (refuses if it exists)
//   node scripts/storybook/story-contract.mjs --prune    drop baseline rows that no longer reproduce (never adds a row)
//
// Checks: story-contract (lib/story-contract.mjs), story-copy (lint-story-copy.mjs), story-titles (lint-titles.mjs,
// on the story set computed from source; CI also runs lint-titles on the built index) and docs-pages.
import { pathToFileURL } from 'node:url';
import { ROOT, loadMetas, staticIndex } from './lib/story-static.mjs';
import { CHECKS, compare, formatByOwner, initBaseline, loadBaseline, packageVersion, pruneBaseline } from './lib/baseline.mjs';
import { validateRepository, docsPageViolations } from './lib/story-contract.mjs';
import { lintAllCopy } from './lint-story-copy.mjs';
import { lintTitles } from './lint-titles.mjs';

export function allStoryViolations(root = ROOT) {
  const metas = loadMetas(root);
  return [...validateRepository(root), ...lintAllCopy(root), ...lintTitles(staticIndex(root).entries, metas), ...docsPageViolations(metas)];
}

function main(argv) {
  const violations = allStoryViolations(ROOT);
  if (argv.includes('--init')) { console.log(`story-contract: baseline created with ${initBaseline(violations)} rows`); return 0; }
  if (argv.includes('--prune')) { console.log(`story-contract: pruned ${pruneBaseline(violations, CHECKS)} stale rows`); return 0; }
  const r = compare(violations, loadBaseline(ROOT), { checks: CHECKS, version: packageVersion(ROOT) });
  console.log(`story-contract: ${violations.length} violations (${r.baselined.length} baselined, ${r.introduced.length} introduced, ${r.stale.length} stale baseline rows${r.expired ? ', baseline expired at RC-1' : ''})`);
  if (r.introduced.length) { console.error(`FAIL introduced, per owner:\n${formatByOwner(r.introduced)}`); return 1; }
  return 0;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) process.exit(main(process.argv.slice(2)));
