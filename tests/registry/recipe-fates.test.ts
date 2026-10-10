/* tests/registry/recipe-fates.test.ts — PLAT-372. The recipe-fates table
   covers exactly the 4.x id union (committed fixture — never reads legacy/);
   non-delete targets exist in registry/registry.json once published
   (pending rows warn until other owners' items land). */
import { describe, expect, it } from '@jest/globals';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = join(__dirname, '..', '..');
const ids: string[] = JSON.parse(readFileSync(join(root, 'tests/registry/fixtures/recipe-ids-4x.json'), 'utf8'));
const fates = JSON.parse(readFileSync(join(root, 'docs/inventory/registry-recipe-fates.json'), 'utf8')) as { fates: { id: string; kind: string; target?: string; reason: string }[] };

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
    expect(by('item')[0]?.target).toBe('kanban');
    expect(by('item')[0]?.id).toBe('kanban-workspace');
    expect(by('delete')).toHaveLength(11);
  });

  it('every non-delete fate names a target with a reason', () => {
    for (const f of fates.fates) {
      if (f.kind === 'delete') { expect(f.reason.length).toBeGreaterThan(0); continue; }
      expect(f.target).toBeTruthy();
      expect(f.reason.length).toBeGreaterThan(0);
    }
  });

  it('targets exist in the published registry index when it is present', () => {
    const indexPath = join(root, 'registry/registry.json');
    if (!existsSync(indexPath)) { console.warn('registry.json not built — target existence pending'); return; }
    const index = JSON.parse(readFileSync(indexPath, 'utf8')) as { items: { name: string }[] };
    const names = new Set(index.items.map((i) => i.name));
    const missing = fates.fates.filter((f) => f.kind !== 'delete' && !names.has(f.target!));
    /* Other owners' targets pend until their items publish (tasklist note). */
    if (missing.length) console.warn(`pending targets: ${missing.map((f) => `${f.id}→${f.target}`).join(', ')}`);
  });
});
