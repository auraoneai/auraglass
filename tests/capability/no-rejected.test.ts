// tests/capability/no-rejected.test.ts — REQ-SURF-179/185.
// Rejected rows stay status 'rejected' with rubric false and release 'never';
// their names never appear on a non-rejected row; and no story (title segment
// or story export) under src/**, registry/** or stories/** and no
// build/exports.manifest.json entry carries an X-R01..X-R13 name.
import { describe, expect, it } from '@jest/globals';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { tmpdir } from 'node:os';

const ROOT = join(__dirname, '../..');
const ledger = JSON.parse(
  readFileSync(join(__dirname, '../../docs/auraglass-5/capability-ledger.json'), 'utf8')
);
const BANNED = new Map<string, string>();
for (const r of ledger.rows) if (r.status === 'rejected') for (const n of r.names) BANNED.set(String(n).toLowerCase(), r.id);

function* walk(dir: string): Generator<string> {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name.startsWith('.')) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (/\.stories\.(ts|tsx|js|jsx|mdx)$/.test(name)) yield p;
  }
}

/** `<file>: <name> (<X-Rnn>)` for every story title segment or story export named after a rejected name. */
function rejectedStoryHits(root: string): string[] {
  const hits: string[] = [];
  for (const base of ['src', 'registry', 'stories']) {
    for (const f of walk(join(root, base))) {
      const text = readFileSync(f, 'utf8');
      const title = /\btitle:\s*['"]([^'"]+)['"]/.exec(text)?.[1] ?? '';
      const words = [...title.split('/'), ...[...text.matchAll(/^export\s+const\s+([A-Za-z_$][\w$]*)/gm)].map((m) => m[1]!)];
      for (const w of words) {
        const id = BANNED.get(w.trim().toLowerCase());
        if (id) hits.push(`${relative(root, f)}: ${w.trim()} (${id})`);
      }
    }
  }
  return hits;
}

describe('rejected names have no story and no manifest entry', () => {
  it('no story under src/**, registry/** or stories/** is named after a rejected name', () => {
    expect(rejectedStoryHits(ROOT)).toEqual([]);
  });
  it('a story titled GlassHologram is caught (X-R04)', () => {
    const dir = mkdtempSync(join(tmpdir(), 'no-rejected-'));
    mkdirSync(join(dir, 'src/legacy'), { recursive: true });
    writeFileSync(join(dir, 'src/legacy/Hologram.stories.tsx'),
      "export default { title: 'Legacy/GlassHologram' };\nexport const Default = {};\n");
    expect(rejectedStoryHits(dir)).toEqual(['src/legacy/Hologram.stories.tsx: GlassHologram (X-R04)']);
  });
  it('build/exports.manifest.json names no rejected symbol', () => {
    const text = readFileSync(join(ROOT, 'build/exports.manifest.json'), 'utf8');
    const hits = [...BANNED.keys()].filter((n) => new RegExp(`\\b${n}\\b`, 'i').test(text));
    expect(hits).toEqual([]);
  });
});

describe('rejected rows', () => {
  const rejected = ledger.rows.filter((r: any) => r.status === 'rejected');
  it('exactly X-R01..X-R13 are rejected', () => {
    expect(rejected.map((r: any) => r.id)).toEqual([
      'X-R01', 'X-R02', 'X-R03', 'X-R04', 'X-R05', 'X-R06', 'X-R07',
      'X-R08', 'X-R09', 'X-R10', 'X-R11', 'X-R12', 'X-R13',
    ]);
  });
  it('every rejected row has rubric false and release never', () => {
    for (const r of rejected) {
      expect(Object.values(r.rubric)).toEqual([false, false, false, false, false, false]);
      expect(r.release).toBe('never');
      expect(r.form).toEqual(['rejected']);
    }
  });
  it('no non-rejected row carries a rejected name (case-insensitive)', () => {
    const banned = new Map<string, string>();
    for (const r of rejected) for (const n of r.names) banned.set(String(n).toLowerCase(), r.id);
    const hits: string[] = [];
    for (const r of ledger.rows) {
      if (r.status === 'rejected') continue;
      for (const n of r.names) {
        if (banned.has(String(n).toLowerCase())) hits.push(`${r.id}:${n}(${banned.get(String(n).toLowerCase())})`);
      }
    }
    expect(hits).toEqual([]);
  });
});
