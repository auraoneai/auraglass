// REQ-SURF-13 acceptance, registry half: the DEP-S id map the compat tests
// assert against covers every aura-glass/compat SURF export (no adapter
// without a DEP-S id, no stale id), and every id is a SURF row of the
// generated deprecations table whose symbol is the 4.x name and whose
// `compat` field is the adapter's export name. The table on `next` is
// regenerated from release/4.x's fragments/deprecations/surf.ts by the
// REQ-FIN-13 sync PR (sync/fragments-deprecations-<yyyymmdd>); this test is
// the merge gate for that dependency (PRD-F FIN-F.3: merge after the SURF-12
// sync).
import { describe, expect, it } from '@jest/globals';
import * as compat from '../../src/compat/surf';
import { deprecations } from '../../src/internal/deprecations.generated';
import { COMPAT_IDS } from '../fixtures/consumer-4x/cases/surf/compat-ids';

const exported = Object.entries(compat)
  .filter(([, v]) => typeof v === 'function')
  .map(([k]) => k)
  .sort();

describe('compat/surf DEP-S registry (REQ-SURF-13)', () => {
  it('every compat export has exactly one DEP-S id and the map has no stale names', () => {
    expect(Object.keys(COMPAT_IDS).sort()).toEqual(exported);
    const ids = Object.values(COMPAT_IDS).map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^DEP-S\d{4}$/);
  });

  it('removed names have no adapter (GlassGallery → media-gallery registry item)', () => {
    expect(exported).not.toContain('GlassGallery');
    expect(exported).not.toContain('TreeView4x');
  });

  it.each(Object.entries(COMPAT_IDS))('%s → its DEP-S row in the generated table', (name, row) => {
    const entry = deprecations.find((e) => e.id === row.id);
    expect(entry).toBeDefined();
    expect(entry!.symbol).toBe(row.symbol);
    expect(entry!.entry).toBe(row.entry);
    expect(entry!.compat).toBe(name);
    expect(entry!.removeIn).toBe('5.0.0');
  });
});
