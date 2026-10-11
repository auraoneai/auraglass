/* MAT-273/REQ-MAT-59: the pre-paint routine. Bundled + minified by
   scripts/mat/build-prepaint-script.mjs into src/theme/generated/prepaint-script.ts
   and inlined by <AuraGlassScript/>; REQ-MAT-59 budgets the emitted body at
   1 536 B (the build enforces its ceiling, see build-prepaint-script.mjs), so
   this file is kept at the semantic minimum. Reads the persisted record, the
   six OS media queries and CSS.supports, resolves every axis through
   resolve.ts (resolvePaint, the same source the store uses), detects the
   engine through engine.ts (the store's detector), and stamps data-ag-* +
   --ag-glass-opacity on <html> before first paint.
   Tier: written when it resolves to 'lightweight' (saveData, deviceMemory <= 2
   with a coarse pointer, or a persisted/app value) or when a persisted/app
   value names 'standard'/'enhanced'; otherwise left unset. An 'unknown'
   engine caps the tier at 'standard'. The legacy 4.x key is migrated by the
   preference store, not here. */
import { detectEngine } from './engine';
import { resolvePaint } from './resolve';
import type { PreferenceInput } from './types';

export interface PrepaintArgs {
  storageKey?: string;
  defaults?: PreferenceInput;
}

type W = Window & {
  matchMedia?: (q: string) => { matches?: boolean } | null;
  CSS?: { supports?: (property: string, value: string) => boolean };
  navigator?: Window['navigator'] & {
    userAgentData?: { brands?: readonly { brand: string }[] } | null;
    deviceMemory?: number; connection?: { saveData?: boolean } | null;
  };
};

const AXES = ['transparency', 'contrast', 'motion', 'scheme', 'density'] as const;

export const auraGlassPrepaint = (w: W, d: Document, a: PrepaintArgs = {}): void => {
  try {
    // matchMedia/CSS.supports do not throw for these well-formed queries; a
    // missing API reads as false (no OS signal, no backdrop-filter => solid).
    const mq = (q: string): boolean => !!w.matchMedia?.(`(${q})`)?.matches;
    // Property-support probe (REQ-MAT-18): the two-argument form with the
    // keyword value carries no design literal.
    const sup = (p: string): boolean => !!w.CSS?.supports?.(p, 'none');
    const nav = (w.navigator ?? {}) as NonNullable<W['navigator']>;
    const def = a.defaults ?? {};
    let rec: PreferenceInput = {};
    try {
      rec = JSON.parse(w.localStorage.getItem(a.storageKey ?? 'ag:prefs:v1') as string) || {};
    } catch { /* unreadable storage */ }

    const r = resolvePaint({
      forcedColors: mq('forced-colors: active'),
      contrastMore: mq('prefers-contrast: more'),
      reducedTransparency: mq('prefers-reduced-transparency: reduce'),
      reducedMotion: mq('prefers-reduced-motion: reduce'),
      schemeDark: mq('prefers-color-scheme: dark'),
      coarsePointer: mq('pointer: coarse'),
    }, {
      backdropFilter: sup('backdrop-filter') || sup('-webkit-backdrop-filter'),
      saveData: !!nav.connection?.saveData,
      deviceMemory: nav.deviceMemory ?? null,
    }, def, rec);
    const engine = detectEngine(nav);

    const el = d.documentElement;
    const at = (k: string, v: string): void => el.setAttribute(`data-ag-${k}`, v);
    for (const k of AXES) at(k, r[k]);
    if (r.allowContinuous && r.motion === 'full') at('continuous', 'on');
    at('engine', engine);
    if (r.tier !== 'standard' || rec.tier === 'standard' || def.tier === 'standard') {
      at('tier', engine === 'unknown' && r.tier === 'enhanced' ? 'standard' : r.tier);
    }
    el.style.setProperty('--ag-glass-opacity', String(r.glassOpacity));
  } catch {
    /* pre-paint must never throw: without attributes every rung still works */
  }
};
