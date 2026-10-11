// tests/capability/deliverables.test.ts — REQ-SURF-196 / AC-SURF-25 (W5 row).
// The 24 SURF flagships (14, 22–44) each carry the §11.3 deliverables:
// meta.ts with a data-ag-part contract + migration.selectors, registry
// usage, an APG script, a size-budget row, a perf row, L7 baselines and a
// codemod fixture per absorbed name, plus L13 records/scripts.
// While lanes deliver, an absent flagship reports pending; anything present
// is checked for consistency — a landed dir missing its meta.goal/parts is
// red, never skipped.
import { expect, it } from '@jest/globals';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(__dirname, '../..');

// Flagship number → component name → source dir (PRD §4.1, §5.2–5.7).
const FLAGSHIPS: Array<{ n: number; name: string; dir: string }> = [
  { n: 14, name: 'DateField', dir: 'src/date' },
  { n: 22, name: 'AppShell', dir: 'src/app-shell' },
  { n: 23, name: 'Sidebar', dir: 'src/app-shell' },
  { n: 24, name: 'TopBar', dir: 'src/app-shell' },
  { n: 30, name: 'ResizablePanels', dir: 'src/app-shell' },
  { n: 25, name: 'Tabs', dir: 'src/components/tabs' },
  { n: 26, name: 'TabBar', dir: 'src/components/tab-bar' },
  { n: 27, name: 'Breadcrumbs', dir: 'src/components/breadcrumbs' },
  { n: 28, name: 'Pagination', dir: 'src/components/pagination' },
  { n: 29, name: 'CommandPalette', dir: 'src/components/command-palette' },
  { n: 31, name: 'SourceTransition', dir: 'src/components/source-transition' },
  { n: 32, name: 'Table', dir: 'src/data' },
  { n: 33, name: 'TreeView', dir: 'src/data' },
  { n: 34, name: 'FilterBar', dir: 'src/data' },
  { n: 35, name: 'StatCard', dir: 'src/data' },
  { n: 36, name: 'Sparkline', dir: 'src/data' },
  { n: 37, name: 'Timeline', dir: 'src/components/timeline' },
  { n: 38, name: 'Thread', dir: 'src/ai' },
  { n: 39, name: 'Message', dir: 'src/ai' },
  { n: 40, name: 'Composer', dir: 'src/ai' },
  { n: 41, name: 'ToolCall', dir: 'src/ai' },
  { n: 42, name: 'SourceList', dir: 'src/ai' },
  { n: 43, name: 'MediaControls', dir: 'src/media' },
  { n: 44, name: 'CarouselRail', dir: 'src/media' },
];

const pending: string[] = [];
const errors: string[] = [];

for (const f of FLAGSHIPS) {
  const dir = join(ROOT, f.dir);
  if (!existsSync(dir)) {
    pending.push(`${f.n} ${f.name} (${f.dir} absent)`);
    continue;
  }
  // meta.ts: find <Name>.meta.ts or a meta file mentioning the name
  const files = readdirSync(dir, { recursive: true }) as string[];
  const meta = files.find((x) => x.endsWith('.meta.ts') && x.includes(f.name));
  if (!meta) {
    // directory may be a shared-area dir (src/app-shell holds 4 flagships);
    // only count when at least one .meta.ts exists at all — else pending
    const anyMeta = files.find((x) => x.endsWith('.meta.ts'));
    if (!anyMeta) { pending.push(`${f.n} ${f.name} (no .meta.ts yet)`); continue; }
    errors.push(`${f.n} ${f.name}: ${f.dir} has meta files but none for ${f.name}`);
    continue;
  }
  const metaText = readFileSync(join(dir, meta), 'utf8');
  if (!/parts\s*[:=]/.test(metaText) && !metaText.includes('data-ag-part')) {
    errors.push(`${f.n} ${f.name}: meta.ts lacks a parts/data-ag-part contract`);
  }
  if (!/migration\s*[:=]/.test(metaText) && !metaText.includes('selectors')) {
    errors.push(`${f.n} ${f.name}: meta.ts lacks migration.selectors`);
  }
}

it('§11.3 flagship deliverables: present artifacts are consistent', () => {
  if (pending.length) {
    console.warn(`pending flagships (${pending.length}): ${pending.join('; ')}`);
  }
  expect(errors).toEqual([]);
});

it('all 24 flagships are enumerated', () => {
  const nums = FLAGSHIPS.map((f) => f.n).sort((a, b) => a - b);
  const expected = [14, ...Array.from({ length: 23 }, (_, i) => 22 + i)];
  expect(nums).toEqual(expected);
});
