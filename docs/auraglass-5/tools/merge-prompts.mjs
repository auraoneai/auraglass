// Folds each stream's index prompt + lane prompts into ONE prompt file per PRD.
// Usage: node docs/auraglass-5/tools/merge-prompts.mjs
import { readFileSync, readdirSync, writeFileSync, unlinkSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dir = join(root, 'prompts');
const files = readdirSync(dir).filter((f) => /^PROMPT_[1-5][a-z]?_.+\.md$/.test(f)).sort();
const laneRe = /PROMPT_([1-5])([a-z])_[A-Z0-9_]+\.md/g;
const label = (n, l) => `Work package ${n}${l}`;
const relink = (s) => s.replace(laneRe, (_, n, l) => label(n, l));
// Demote headings so lane content nests under its work-package heading.
const demote = (s) => s.replace(/^(#{1,4}) /gm, (_, h) => `${h}## `);

const merged = [];
for (const n of ['1', '2', '3', '4', '5']) {
  const index = files.find((f) => new RegExp(`^PROMPT_${n}_[A-Z]+\\.md$`).test(f));
  const lanes = files.filter((f) => new RegExp(`^PROMPT_${n}[a-z]_`).test(f));
  const out = [
    relink(readFileSync(join(dir, index), 'utf8')).trimEnd(),
    '',
    '---',
    '',
    '## How to run this prompt',
    '',
    `This is the only prompt for this PRD. Give the whole file to one agent. The ${lanes.length} work packages below touch disjoint files and none waits on another, so an agent that can spawn subagents should run them in parallel (one subagent per work package). Otherwise do them in the order listed. The stream is done when every work package's exit criteria are met.`,
    '',
  ];
  for (const f of lanes) {
    const l = f.match(/^PROMPT_[1-5]([a-z])_/)[1];
    const name = f.replace(/^PROMPT_[1-5][a-z]_[A-Z0-9]+_/, '').replace(/\.md$/, '').replace(/_/g, ' ');
    out.push('---', '', `## ${label(n, l)}: ${name}`, '', demote(relink(readFileSync(join(dir, f), 'utf8'))).trimEnd(), '');
  }
  writeFileSync(join(dir, index), out.join('\n') + '\n');
  for (const f of lanes) unlinkSync(join(dir, f));
  merged.push(`${index} (${lanes.length} work packages)`);
}

// Re-point references elsewhere in the planning set.
for (const f of ['AURAGLASS_5_MASTER_PRD.md', 'README.md']) {
  const p = join(root, f);
  writeFileSync(p, relink(readFileSync(p, 'utf8')));
}
console.log(merged.join('\n'));
