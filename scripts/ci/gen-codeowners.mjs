#!/usr/bin/env node
/* Generates .github/CODEOWNERS from contracts/ownership.json (A05).
   CODEOWNERS is last-match-wins; the ownership table is first-match-wins, so rows
   are emitted in reverse. All five stream-owner approvals resolve to @gchahal1982. */
import { readFileSync, writeFileSync } from 'node:fs';

const OWNER = '@gchahal1982';
const rows = JSON.parse(readFileSync('contracts/ownership.json', 'utf8')).rows;
const expandBraces = (pat) => {
  const m = /\{([^{}]+)\}/.exec(pat);
  if (!m) return [pat];
  return m[1].split(',').flatMap((alt) => expandBraces(pat.slice(0, m.index) + alt + pat.slice(m.index + m[0].length)));
};
const anchor = (g) => (g.startsWith('/') ? g : '/' + g);

const out = [
  '# Generated from contracts/ownership.json by scripts/ci/gen-codeowners.mjs — do not edit by hand.',
  '# All five stream-owner approvals resolve to ' + OWNER + ' (sole maintainer); CONTRACT rows need all five.',
  '# CODEOWNERS semantics are last-match-wins, so rows emit in reverse of the first-match-wins ownership table.',
  '',
];
for (const r of [...rows].reverse()) {
  if (r.lines && r.lines.length === 1 && r.lines[0] === '4x') {
    out.push(`# ${r.id} ${r.glob} -> ${r.owner} (release/4.x only)`);
    continue;
  }
  for (const pat of expandBraces(r.glob)) {
    if (r.owner === 'NONE') { out.push(`# ${r.id} ${pat} -> NONE (unowned; contract:ownership rejects)`); continue; }
    const tag = r.owner === 'CONTRACT' ? 'contract' : r.owner.toLowerCase();
    out.push(`# ${r.id} owner=${tag}`);
    out.push(`${anchor(pat)} ${OWNER}`);
  }
}
writeFileSync('.github/CODEOWNERS', out.join('\n') + '\n');
console.log('wrote .github/CODEOWNERS');
