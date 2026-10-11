#!/usr/bin/env node
// QUAL (REQ-QUAL-52; REQ-FIN-106; FIN-450): build-time check of the Start Here page.
//
//   node scripts/storybook/verify-start-here.mjs --index storybook-static/index.json
//
// Fails (exit 1) when: the built index has no Start Here docs entry; a `?path=` link in stories/qual/StartHere.{mdx,tsx}
// or a computed group link does not resolve to an index entry; a computed count is not a number; either file carries a
// version literal (the only version shown is package.json's, read at build time).
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROOT, loadMetas } from './lib/story-static.mjs';
import { START_HERE_ID, VERSION_LITERAL_RE, brokenPathLinks, computeStartHere, entryPath } from './lib/start-here.mjs';

export const START_HERE_FILES = ['stories/qual/StartHere.mdx', 'stories/qual/StartHere.tsx'];

/** Problems with the Start Here page for a given index. `sources`: { [file]: text }. */
export function verifyStartHere({ index, sources, metas, version }) {
  const problems = [];
  if (!index?.entries?.[START_HERE_ID]) problems.push(`index has no ${START_HERE_ID} entry`);
  for (const [file, text] of Object.entries(sources)) {
    for (const t of brokenPathLinks(text, index)) problems.push(`${file}: ?path=${t} is not in the index`);
    const v = VERSION_LITERAL_RE.exec(text);
    if (v) problems.push(`${file}: version literal "${v[0]}" (read the version from package.json)`);
  }
  const data = computeStartHere({ index, metas, version });
  const valid = new Set(Object.values(index?.entries ?? {}).map(entryPath));
  for (const g of data.groups) if (g.path && !valid.has(g.path)) problems.push(`computed link for ${g.name} (${g.path}) is not in the index`);
  for (const [k, n] of Object.entries(data.counts)) if (!Number.isInteger(n) || n < 0) problems.push(`count ${k} is ${n}`);
  return { problems, data };
}

function main(argv) {
  const i = argv.indexOf('--index');
  const indexPath = i >= 0 ? argv[i + 1] : 'storybook-static/index.json';
  if (!existsSync(indexPath)) { console.error(`verify-start-here: ${indexPath} does not exist (build Storybook first)`); return 1; }
  const index = JSON.parse(readFileSync(indexPath, 'utf8'));
  const sources = Object.fromEntries(START_HERE_FILES.map((f) => [f, readFileSync(join(ROOT, f), 'utf8')]));
  const version = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')).version;
  const { problems, data } = verifyStartHere({ index, sources, metas: loadMetas(ROOT), version });
  console.log(`verify-start-here: ${JSON.stringify(data.counts)}; links ${data.groups.filter((g) => g.path).map((g) => g.name).join(', ') || 'none'}`);
  if (problems.length) { console.error(`FAIL\n${problems.map((p) => `  ${p}`).join('\n')}`); return 1; }
  return 0;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) process.exit(main(process.argv.slice(2)));
