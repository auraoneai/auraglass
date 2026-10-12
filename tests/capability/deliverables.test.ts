/** @jest-environment node */
// tests/capability/deliverables.test.ts — REQ-SURF-196 / AC-SURF-25 (W5 row).
// The 24 SURF flagships (14, 22–44) each carry the §11.3 deliverables:
// meta.ts with a data-ag-part contract + migration.selectors, registry
// usage, an APG script, a size-budget row, a perf row, L7 baselines and a
// codemod fixture per absorbed name, plus L13 records/scripts.
//
// Agent-owned deliverables are gated hard through QUAL's deliverables
// checker (packages/qa/src/deliverables/check.ts): meta, selectors, APG and
// size-budget must pass for every flagship, and codemod-fixture must pass
// for every absorbed name that has a codemod disposition. What an agent
// cannot produce is pinned as exact pending sets instead of passing
// silently — a set that grows fails here, and landing the deliverable means
// shrinking the set in the same change:
//   - parts / perf-grade / l7-baselines read remote-lane artifacts
//     (.artifacts/qual/*, certification baselines) that only the L5/L7/L10
//     browser lanes can produce;
//   - registry usage for 27/29/31/41/42 is owned by the registry work
//     (REQ-SURF-171..178), not this gate;
//   - L13 SR records are human-only (issue #16; agents never author them).
import { describe, expect, it } from '@jest/globals';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { collectInputs, evaluate, type FlagshipResult } from '../../packages/qa/src/deliverables/check';

const ROOT = join(__dirname, '../..');

// Flagship number → component name → source dir (PRD §4.1, §5.2–5.7), plus
// the subject slug its L13 manual script is filed under (SR matrix naming).
const FLAGSHIPS: Array<{ n: number; name: string; dir: string; script: string }> = [
  { n: 14, name: 'DateField', dir: 'src/date', script: 'date-field' },
  { n: 22, name: 'AppShell', dir: 'src/app-shell', script: 'app-shell' },
  { n: 23, name: 'Sidebar', dir: 'src/app-shell', script: 'sidebar' },
  { n: 24, name: 'TopBar', dir: 'src/app-shell', script: 'top-bar' },
  { n: 30, name: 'ResizablePanels', dir: 'src/app-shell', script: 'resizable-panels' },
  { n: 25, name: 'Tabs', dir: 'src/components/tabs', script: 'tabs' },
  { n: 26, name: 'TabBar', dir: 'src/components/tab-bar', script: 'tab-bar' },
  { n: 27, name: 'Breadcrumbs', dir: 'src/components/breadcrumbs', script: 'breadcrumbs' },
  { n: 28, name: 'Pagination', dir: 'src/components/pagination', script: 'pagination' },
  { n: 29, name: 'CommandPalette', dir: 'src/components/command-palette', script: 'command-palette' },
  { n: 31, name: 'SourceTransition', dir: 'src/components/source-transition', script: 'source-transition' },
  { n: 32, name: 'Table', dir: 'src/data', script: 'table' },
  { n: 33, name: 'TreeView', dir: 'src/data', script: 'tree-view' },
  { n: 34, name: 'FilterBar', dir: 'src/data', script: 'filter-bar' },
  { n: 35, name: 'StatCard', dir: 'src/data', script: 'stat-card' },
  { n: 36, name: 'Sparkline', dir: 'src/data', script: 'sparkline' },
  { n: 37, name: 'Timeline', dir: 'src/components/timeline', script: 'timeline' },
  { n: 38, name: 'Thread', dir: 'src/ai', script: 'ai-thread' },
  { n: 39, name: 'Message', dir: 'src/ai', script: 'ai-message' },
  { n: 40, name: 'Composer', dir: 'src/ai', script: 'ai-composer' },
  { n: 41, name: 'ToolCall', dir: 'src/ai', script: 'ai-tool-call' },
  { n: 42, name: 'SourceList', dir: 'src/ai', script: 'ai-source-list' },
  { n: 43, name: 'MediaControls', dir: 'src/media', script: 'media-controls' },
  { n: 44, name: 'CarouselRail', dir: 'src/media', script: 'carousel-rail' },
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
  expect(pending).toEqual([]);
});

it('all 24 flagships are enumerated', () => {
  const nums = FLAGSHIPS.map((f) => f.n).sort((a, b) => a - b);
  const expected = [14, ...Array.from({ length: 23 }, (_, i) => 22 + i)];
  expect(nums).toEqual(expected);
});

// ---------------------------------------------------------------- REQ-SURF-196 strict gate

const report = evaluate(collectInputs(ROOT), { phase: 'pre-rc', baseline: null });
const surf: FlagshipResult[] = report.flagships.filter((f) => f.owner === 'SURF');
const byFlagship = new Map(surf.map((f) => [f.flagship, f]));
const item = (n: number, id: keyof FlagshipResult['items']) => byFlagship.get(n)!.items[id];

/** New-in-5.0 components with no absorbed 4.x name (the 4.x chat names map
    to aura-glass/compat, never renamed onto these): the checker reports
    their selectors/codemod items pending for exactly this reason. */
const NO_ABSORBED = new Map([
  [39, 'Message'],
  [40, 'Composer'],
  [41, 'ToolCall'],
  [42, 'Citation'],
]);
/** Registry usage still owned by REQ-SURF-171..178 work, not this gate. */
const REGISTRY_PENDING = [27, 29, 31, 41, 42];
/** Absorbed names with no codemod fragment disposition yet (no renames or
    removed row in fragments/codemods/surf.ts), so no fixture can be written
    against the engine. */
const CODEMOD_NO_DISPOSITION = new Map([[30, 'GlassResizablePanels']]);

describe('REQ-SURF-196 agent deliverables (24/24, no silent pending)', () => {
  it('evaluates all 24 SURF flagships with no structural offenders', () => {
    expect(surf.map((f) => f.flagship)).toEqual([14, ...Array.from({ length: 23 }, (_, i) => 22 + i)]);
    expect(report.offenders.filter((o) => o.owner === 'SURF')).toEqual([]);
  });

  it.each(FLAGSHIPS.map((f) => [f.n, f] as const))('%i: meta, APG script and size-budget row pass', (n) => {
    for (const id of ['meta', 'apg', 'size-budget'] as const) {
      expect({ flagship: n, item: id, ...item(n, id) }).toEqual({ flagship: n, item: id, status: 'pass', detail: item(n, id).detail });
    }
  });

  it.each(FLAGSHIPS.map((f) => [f.n, f] as const))('%i: every migration row carries a selectors table', (n) => {
    const got = item(n, 'selectors');
    if (NO_ABSORBED.has(n)) {
      expect(got.status).toBe('pending');
      expect(got.detail).toContain('declares no absorbed 4.x names');
    } else {
      expect({ flagship: n, ...got }).toEqual({ flagship: n, status: 'pass', detail: got.detail });
    }
  });

  it.each(FLAGSHIPS.map((f) => [f.n, f] as const))('%i: a codemod fixture names every absorbed name with a disposition', (n) => {
    const got = item(n, 'codemod-fixture');
    if (NO_ABSORBED.has(n)) {
      expect(got.status).toBe('pending');
      expect(got.detail).toContain('declares no absorbed 4.x names');
    } else if (CODEMOD_NO_DISPOSITION.has(n)) {
      expect(got.status).toBe('pending');
      expect(got.detail).toContain(CODEMOD_NO_DISPOSITION.get(n)!);
    } else {
      expect({ flagship: n, ...got }).toEqual({ flagship: n, status: 'pass', detail: got.detail });
    }
  });

  it('registry usage is pending for exactly the REQ-SURF-171..178 flagships', () => {
    const pendingRegistry = surf.filter((f) => f.items.registry.status !== 'pass').map((f) => f.flagship);
    expect(pendingRegistry).toEqual(REGISTRY_PENDING);
  });

  it('remote-lane items (rendered parts, perf grade, L7 baselines) never fail here and name their artifact', () => {
    for (const f of surf) {
      for (const id of ['parts', 'perf-grade', 'l7-baselines'] as const) {
        const got = f.items[id];
        expect(['pass', 'pending']).toContain(got.status);
        if (got.status === 'pending') {
          expect(got.detail).toMatch(/not present|no L7 baselines|no rendered parts|rendered parts differ/);
        }
      }
    }
  });

  it.each(FLAGSHIPS.map((f) => [f.n, f] as const))('%i: an L13 manual script is filed under tests/a11y/manual/scripts/surf/', (n, f) => {
    const script = join(ROOT, 'tests/a11y/manual/scripts/surf', `${f.script}.md`);
    expect(existsSync(script)).toBe(true);
    const text = readFileSync(script, 'utf8');
    for (const at of ['VoiceOver macOS', 'VoiceOver iOS', 'NVDA', 'TalkBack']) {
      expect(text).toContain(at);
    }
    expect(text).toContain(`${f.script}-voiceover-macos.json`);
  });

  it('L13 SR records: human-only, pending for exactly the 24 flagship subjects (issue #16)', () => {
    const recordsDir = join(ROOT, 'tests/a11y/manual/records/surf');
    const records = readdirSync(recordsDir).filter((f) => f.endsWith('.json'));
    // Any record a human lands must be one the generated matrix asks for.
    const matrix = JSON.parse(readFileSync(join(ROOT, 'tests/a11y/manual/sr-matrix.template.json'), 'utf8')) as {
      rows: Array<{ stream: string; subject: string; record: string; required: boolean }>;
    };
    const wanted = new Set(matrix.rows.filter((r) => r.stream === 'surf' && r.required).map((r) => r.record.split('/').pop()!));
    expect(records.filter((r) => !wanted.has(r))).toEqual([]);
    // Subjects (of the 24 flagship scripts) with no record at all yet: the
    // exact human backlog. Completing one means removing it here.
    const recordedSubjects = new Set(records.map((r) => FLAGSHIPS.find((f) => r.startsWith(`${f.script}-`))?.script).filter(Boolean));
    const unrecorded = FLAGSHIPS.map((f) => f.script).filter((s) => !recordedSubjects.has(s)).sort();
    expect(unrecorded).toEqual(FLAGSHIPS.map((f) => f.script).sort());
  });
});
