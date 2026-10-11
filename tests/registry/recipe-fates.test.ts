/* tests/registry/recipe-fates.test.ts — PLAT-372 + REQ-PLAT-98. The
   recipe-fates table covers exactly the 4.x id union; the exact id→target
   map is encoded here and every non-delete target MUST exist on disk
   (registry/{blocks,items}/<target>/registry-item.json) and in the built
   registry.json when present. */
import { describe, expect, it } from '@jest/globals';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = join(__dirname, '..', '..');
const ids: string[] = JSON.parse(readFileSync(join(root, 'tests/registry/fixtures/recipe-ids-4x.json'), 'utf8'));
const fates = JSON.parse(readFileSync(join(root, 'docs/inventory/registry-recipe-fates.json'), 'utf8')) as { fates: { id: string; kind: string; target?: string; also?: { kind: string; target: string }[]; reason: string }[] };

/* The REQ-PLAT-98 table (PLAT.json): 16 block + 1 item + 11 delete. */
const EXPECTED: Record<string, { kind: string; target?: string; also?: { kind: string; target: string }[] }> = {
  'saas-dashboard': { kind: 'block', target: 'app-frame' },
  'saas-admin-shell': { kind: 'block', target: 'app-frame' },
  'ai-command-center': { kind: 'block', target: 'ai-workspace' },
  'ai-product-console': { kind: 'block', target: 'ai-workspace' },
  'ai-ops-control-room': { kind: 'block', target: 'ai-workspace', also: [{ kind: 'item', target: 'ai-trace-tree' }] },
  'media-player-surface': { kind: 'block', target: 'media-viewer' },
  'media-review-workspace': { kind: 'block', target: 'media-viewer' },
  'analytics-overview': { kind: 'block', target: 'analytics-dashboard' },
  'analytics-command-center': { kind: 'block', target: 'analytics-dashboard' },
  'settings-billing': { kind: 'block', target: 'settings' },
  'settings-and-billing-suite': { kind: 'block', target: 'settings' },
  'admin-data-table': { kind: 'block', target: 'data-workspace' },
  'release-command-center': { kind: 'block', target: 'data-workspace' },
  'customer-support-console': { kind: 'block', target: 'support-inbox' },
  'support-triage-workspace': { kind: 'block', target: 'support-inbox' },
  'semantic-search-console': { kind: 'block', target: 'overlay-flows' },
  'kanban-workspace': { kind: 'item', target: 'kanban' },
  'ecommerce-product-panel': { kind: 'delete' },
  'team-collaboration-hub': { kind: 'delete' },
  'collaborative-workspace': { kind: 'delete' },
  'commerce-operations-panel': { kind: 'delete' },
  'calendar-schedule': { kind: 'delete' },
  'creator-studio-dashboard': { kind: 'delete' },
  'vision-review-workbench': { kind: 'delete' },
  'collaboration-room-console': { kind: 'delete' },
  'developer-docs-portal': { kind: 'delete' },
  'marketing-launch-kit': { kind: 'delete' },
  'calendar-operations-board': { kind: 'delete' },
};

describe('registry recipe fates', () => {
  it('covers every 4.x recipe id exactly once', () => {
    expect(fates.fates).toHaveLength(28);
    expect(new Set(fates.fates.map((f) => f.id))).toEqual(new Set(ids));
    expect(ids).toHaveLength(28);
  });

  it('has exactly 16 block fates, 1 kanban item and 11 deletes (REQ-PLAT-98)', () => {
    const by = (k: string) => fates.fates.filter((f) => f.kind === k);
    expect(by('block')).toHaveLength(16);
    expect(by('item')).toHaveLength(1);
    expect(by('item')[0].target).toBe('kanban');
    expect(by('item')[0].id).toBe('kanban-workspace');
    expect(by('delete')).toHaveLength(11);
  });

  it('every row matches the REQ-PLAT-98 table exactly', () => {
    for (const f of fates.fates) {
      const e = EXPECTED[f.id];
      expect(e).toBeDefined();
      expect(f.kind).toBe(e.kind);
      expect(f.target ?? null).toBe(e.target ?? null);
      expect(f.also ?? null).toEqual(e.also ?? null);
      expect(f.reason.length).toBeGreaterThan(0);
    }
  });

  it('every non-delete target exists on disk', () => {
    const missing: string[] = [];
    const check = (kind: string, target: string, id: string) => {
      const p = join(root, 'registry', kind === 'block' ? 'blocks' : 'items', target, 'registry-item.json');
      if (!existsSync(p)) missing.push(`${id} -> ${kind}:${target} (${p})`);
    };
    for (const f of fates.fates) {
      if (f.kind === 'delete') continue;
      check(f.kind, f.target!, f.id);
      for (const a of f.also ?? []) check(a.kind, a.target, f.id);
    }
    expect(missing).toEqual([]);
  });

  it('targets exist in the built registry index when present', () => {
    const indexPath = join(root, 'registry/registry.json');
    if (!existsSync(indexPath)) { console.warn('registry.json not built — skipping index check'); return; }
    const names = new Set((JSON.parse(readFileSync(indexPath, 'utf8')) as { items: { name: string }[] }).items.map((i) => i.name));
    const missing = fates.fates.filter((f) => f.kind !== 'delete' && !names.has(f.target!));
    expect(missing.map((f) => `${f.id}→${f.target}`)).toEqual([]);
  });
});
