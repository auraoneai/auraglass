// Merges autopsy/inventory/shard-*.json into component-inventory.json + component-inventory.csv.
// Usage: node docs/auraglass-5/tools/merge-inventory.mjs
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dir = join(root, 'autopsy', 'inventory');
const SCORE_KEYS = ['visual', 'material', 'usability', 'api', 'responsive', 'a11y', 'motion', 'consistency', 'performance', 'docs', 'storybook', 'production'];

const shards = readdirSync(dir).filter((f) => /^shard-\d+\.json$/.test(f)).sort();
const records = [];
for (const f of shards) {
  const raw = JSON.parse(readFileSync(join(dir, f), 'utf8'));
  const list = Array.isArray(raw) ? raw : raw.components ?? [];
  for (const r of list) records.push({ ...r, shard: f });
}

// De-duplicate by name+file (shards are disjoint by file, but be safe).
const seen = new Map();
for (const r of records) seen.set(`${r.name}::${r.file}`, r);
const all = [...seen.values()].sort((a, b) => a.file.localeCompare(b.file) || a.name.localeCompare(b.name));

const esc = (v) => {
  const s = v == null ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const cols = ['name', 'file', 'lines', 'category', 'exported_from_root', 'disposition', 'target', 'flagship_candidate', 'overall', ...SCORE_KEYS, 'justification'];
const csv = [cols.join(',')]
  .concat(all.map((r) => cols.map((c) => esc(SCORE_KEYS.includes(c) ? r.scores?.[c] : r[c])).join(',')))
  .join('\n');

writeFileSync(join(root, 'component-inventory.json'), JSON.stringify(all, null, 1));
writeFileSync(join(root, 'component-inventory.csv'), csv + '\n');

const by = (k) => all.reduce((m, r) => ((m[r[k]] = (m[r[k]] || 0) + 1), m), {});
console.log(JSON.stringify({ shards: shards.length, components: all.length, dispositions: by('disposition'), flagship: all.filter((r) => r.flagship_candidate).length }, null, 1));
