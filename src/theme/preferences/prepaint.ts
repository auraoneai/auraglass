/* MAT-273: the pre-paint routine. Bundled + minified by
   scripts/mat/build-prepaint-script.mjs into src/theme/generated/prepaint-script.ts
   and inlined by <AuraGlassScript/> — kept at the semantic minimum so the
   emitted body fits the 1 536 B budget. Reads the persisted record, the OS
   media queries and CSS.supports, resolves floors via resolve.ts, and stamps
   data-ag-* + --ag-glass-opacity + data-ag-engine on <html> before first
   paint. data-ag-tier is written only when it resolves to 'lightweight'
   (saveData, deviceMemory <= 2 with a coarse pointer, or a persisted/app
   value). The legacy 4.x key is migrated by the preference store, not here. */
import { resolvePaint } from './resolve';
import type { OsSignals, CapabilitySignals, PreferenceInput } from './types';

export interface PrepaintArgs {
  storageKey?: string;
  defaults?: PreferenceInput;
}

type W = Window & {
  matchMedia?: (q: string) => { matches?: boolean } | null;
  CSS?: { supports?: (q: string) => boolean };
  navigator?: Window['navigator'] & {
    userAgentData?: { brands?: readonly { brand: string }[] } | null;
    deviceMemory?: number; connection?: { saveData?: boolean } | null;
  };
};

export const auraGlassPrepaint = (w: W, d: Document, a: PrepaintArgs = {}): void => {
  try {
    const mq = (q: string): boolean => {
      try { return w.matchMedia?.(q)?.matches === true; } catch { return false; }
    };
    const os: OsSignals = {
      forcedColors: mq('(forced-colors: active)'),
      contrastMore: mq('(prefers-contrast: more)'),
      reducedTransparency: mq('(prefers-reduced-transparency: reduce)'),
      reducedMotion: mq('(prefers-reduced-motion: reduce)'),
      schemeDark: mq('(prefers-color-scheme: dark)'),
      coarsePointer: mq('(pointer: coarse)'),
    };
    const nav = (w.navigator ?? {}) as NonNullable<W['navigator']>;
    let bf = false;
    try {
      bf = w.CSS?.supports?.('(backdrop-filter: blur(1px))') === true
        || w.CSS?.supports?.('(-webkit-backdrop-filter: blur(1px))') === true;
    } catch { /* no CSS.supports */ }
    const cap: CapabilitySignals = {
      backdropFilter: bf,
      saveData: nav.connection?.saveData === true,
      deviceMemory: typeof nav.deviceMemory === 'number' ? nav.deviceMemory : null,
    };

    let rec = {} as PreferenceInput;
    try {
      const v = JSON.parse(w.localStorage?.getItem(a.storageKey ?? 'ag:prefs:v1') ?? 'null') as unknown;
      if (v !== null && typeof v === 'object' && !Array.isArray(v)) rec = v as PreferenceInput;
    } catch { /* unreadable storage */ }

    const r = resolvePaint(os, cap, a.defaults ?? {}, rec);
    const br = nav.userAgentData?.brands;
    const ua = nav.userAgent ?? '';
    const engine = Array.isArray(br) && br.length
      ? (br.some((b) => /chrom|edg|opera|brave|vivaldi|arc|samsung/i.test(b.brand)) ? 'chromium' : 'unknown')
      : /AppleWebKit/.test(ua) && !/Chrome|Chromium|Edg/.test(ua) ? 'webkit'
        : /Gecko\//.test(ua) && /Firefox/.test(ua) ? 'gecko' : 'unknown';

    const el = d.documentElement;
    const at = (k: string, v: string): void => { el.setAttribute(`data-ag-${k}`, v); };
    at('transparency', r.transparency);
    at('contrast', r.contrast);
    at('motion', r.motion);
    at('scheme', r.scheme);
    at('density', r.density);
    if (r.allowContinuous) at('continuous', 'on');
    at('engine', engine);
    if (r.tier === 'lightweight') at('tier', 'lightweight');
    el.style.setProperty('--ag-glass-opacity', String(r.glassOpacity));
  } catch {
    /* pre-paint must never throw: without attributes every rung still works */
  }
};
