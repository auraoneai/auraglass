/* @jest-environment node */
/* REQ-SURF-34 (and REQ-CMP-127): one deprecation row per 4.x symbol, and every `compat` claim names a real
   aura-glass/compat export.
   - Within a stream fragment a (kind, entry, symbol) appears once: the duplicate GlassNavigation / GlassTopBar /
     GlassHeader rows (DEP-S0633..S0635 next to DEP-S0029/S0003/S0002) and the CMP+SURF GlassGallery pair
     (DEP-C0262 next to DEP-S0605) are the regressions this guards.
   - Across streams the only shared symbols are the listed ones (each stream's row describes its own surface; a
     new cross-stream duplicate fails until its owners settle it).
   - `compat: '<Name>'` must be exported by the stream's compat module. */
import { describe, expect, it } from '@jest/globals';
import type { DeprecationEntry } from '../../src/contracts/fragments';
import plat from '../../fragments/deprecations/plat';
import mat from '../../fragments/deprecations/mat';
import cmp from '../../fragments/deprecations/cmp';
import surf from '../../fragments/deprecations/surf';
import qual from '../../fragments/deprecations/qual';
import * as compatCmp from '../../src/compat/cmp';
import * as compatSurf from '../../src/compat/surf';

const FRAGMENTS: Record<string, readonly DeprecationEntry[]> = {
  plat: plat as readonly DeprecationEntry[], mat: mat as readonly DeprecationEntry[], cmp: cmp as readonly DeprecationEntry[],
  surf: surf as readonly DeprecationEntry[], qual: qual as readonly DeprecationEntry[],
};
const key = (r: DeprecationEntry) => `${r.kind}|${r.entry}|${r.symbol}`;

/** Cross-stream symbols present on next at the time of REQ-SURF-34 (shrink-only). */
const CROSS_STREAM = new Set([
  'export|.|useGalileoStateSpring', 'export|.|useLiquidGlassBackdrop', 'export|.|MagneticButton', 'export|.|RippleButton',
  'export|.|AIGlassThemeProvider', 'export|.|ImageList', 'export|.|ImageListItem', 'export|.|ImageListItemBar',
]);

describe('deprecation symbols (REQ-SURF-34)', () => {
  it.each(Object.keys(FRAGMENTS))('%s: each (kind, entry, symbol) has exactly one row', (stream) => {
    const seen = new Map<string, string[]>();
    for (const r of FRAGMENTS[stream]!) (seen.get(key(r)) ?? seen.set(key(r), []).get(key(r))!).push(r.id);
    expect([...seen].filter(([, ids]) => ids.length > 1)).toEqual([]);
  });

  it('cross-stream duplicates are only the listed, known ones (no new ones; none for GlassGallery/GlassNavigation)', () => {
    const owners = new Map<string, Set<string>>();
    for (const [stream, rows] of Object.entries(FRAGMENTS)) for (const r of rows) (owners.get(key(r)) ?? owners.set(key(r), new Set()).get(key(r))!).add(stream);
    const shared = [...owners].filter(([, s]) => s.size > 1).map(([k]) => k).sort();
    expect(shared.filter((k) => !CROSS_STREAM.has(k))).toEqual([]);
    expect([...CROSS_STREAM].filter((k) => !shared.includes(k))).toEqual([]); // stale allowlist row: delete it
  });

  it('GlassNavigation, GlassTopBar, GlassHeader and GlassGallery each have one row, and the right one', () => {
    const all = Object.values(FRAGMENTS).flat();
    const rowsOf = (s: string) => all.filter((r) => r.symbol === s && r.entry === '.').map((r) => ({ id: r.id, removeIn: r.removeIn, compat: r.compat ?? null }));
    expect(rowsOf('GlassNavigation')).toEqual([{ id: 'DEP-S0029', removeIn: '5.0.0', compat: null }]);
    expect(rowsOf('GlassTopBar')).toEqual([{ id: 'DEP-S0003', removeIn: '5.0.0', compat: 'GlassTopBar' }]);
    expect(rowsOf('GlassHeader')).toEqual([{ id: 'DEP-S0002', removeIn: '5.0.0', compat: 'GlassHeader' }]);
    expect(rowsOf('GlassGallery')).toEqual([{ id: 'DEP-S0605', removeIn: '5.0.0', compat: null }]);
  });

  it('every compat claim names an export of its stream compat module', () => {
    const missing = [
      ...FRAGMENTS.surf!.filter((r) => r.compat && !(r.compat in compatSurf)).map((r) => `${r.id}: ${r.compat}`),
      ...FRAGMENTS.cmp!.filter((r) => r.compat && !(r.compat in compatCmp)).map((r) => `${r.id}: ${r.compat}`),
    ];
    expect(missing).toEqual([]);
  });

  it('REQ-SURF-13: the 4.x source-transition family (Provider, Source, Destination) has adapters and rows', () => {
    for (const [name, id] of [['LiquidGlassTransitionProvider', 'DEP-S0024'], ['LiquidGlassSource', 'DEP-S0025'], ['LiquidGlassDestination', 'DEP-S0026']] as const) {
      expect({ name, adapter: typeof (compatSurf as Record<string, unknown>)[name] }).toEqual({ name, adapter: 'function' });
      expect(FRAGMENTS.surf!.filter((r) => r.symbol === name).map((r) => [r.id, r.compat])).toEqual([[id, name]]);
    }
  });
});
