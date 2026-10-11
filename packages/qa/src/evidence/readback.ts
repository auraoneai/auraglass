/* REQ-QUAL-17 labels from pixels (QUAL, FIN-430). Every result field naming scheme, preference, engine, tier or
   transparency is read back from the page — `documentElement` data-ag-* (S-01), `matchMedia`, the user agent — never
   copied from the request. A requested value the page does not show fails `label-mismatch`, including a forced-colors
   emulation that silently did nothing (`matchMedia('(forced-colors: active)')` false). */
import type { GateResult } from '../pixel/gate';

export type LabelEngine = 'chromium' | 'webkit' | 'firefox';
export type LabelPreference = 'default' | 'contrast-more' | 'forced-colors' | 'reduced-motion';

export interface RequestedLabels {
  scheme: 'light' | 'dark';
  preference: LabelPreference;
  engine: LabelEngine;
  tier: 'lightweight' | 'standard' | 'enhanced';
  transparency: 'glass' | 'tinted' | 'solid';
}

export interface Readback {
  dataset: { scheme: string | null; contrast: string | null; transparency: string | null; motion: string | null; tier: string | null; engine: string | null };
  media: { dark: boolean; contrastMore: boolean; forcedColors: boolean; reducedMotion: boolean };
  userAgent: string;
}

/** In-page (self-contained): the page's own view of the cell. */
export function readBack(): Readback {
  const h = document.documentElement;
  const mq = (q: string): boolean => window.matchMedia(q).matches;
  return {
    dataset: {
      scheme: h.getAttribute('data-ag-scheme'), contrast: h.getAttribute('data-ag-contrast'), transparency: h.getAttribute('data-ag-transparency'),
      motion: h.getAttribute('data-ag-motion'), tier: h.getAttribute('data-ag-tier'), engine: h.getAttribute('data-ag-engine'),
    },
    media: { dark: mq('(prefers-color-scheme: dark)'), contrastMore: mq('(prefers-contrast: more)'), forcedColors: mq('(forced-colors: active)'), reducedMotion: mq('(prefers-reduced-motion: reduce)') },
    userAgent: navigator.userAgent,
  };
}

/** Engine from the UA string (Playwright builds: Chrome/Chromium, WebKit Safari, Firefox). Null when unrecognised. */
export function engineFromUa(ua: string): LabelEngine | null {
  if (/Firefox\/\d/.test(ua)) return 'firefox';
  if (/(?:Chrome|Chromium|HeadlessChrome)\/\d/.test(ua)) return 'chromium';
  if (/AppleWebKit\/\d/.test(ua) && /Safari\/\d|Version\/\d/.test(ua)) return 'webkit';
  return null;
}

/** S-01 `data-ag-engine` values use `gecko` for Firefox. */
const DATASET_ENGINE: Record<LabelEngine, string> = { chromium: 'chromium', webkit: 'webkit', firefox: 'gecko' };

/** The labels a result row records: derived only from the read-back page state. */
export function labelsFrom(rb: Readback): { scheme: string | null; preference: LabelPreference | 'mixed'; engine: LabelEngine | null; tier: string | null; transparency: string | null } {
  const prefs: LabelPreference[] = [];
  if (rb.media.forcedColors) prefs.push('forced-colors');
  if (rb.media.contrastMore || rb.dataset.contrast === 'more') prefs.push('contrast-more');
  if (rb.media.reducedMotion || rb.dataset.motion === 'none') prefs.push('reduced-motion');
  return {
    scheme: rb.dataset.scheme,
    preference: prefs.length === 0 ? 'default' : prefs.length === 1 ? prefs[0]! : 'mixed',
    engine: engineFromUa(rb.userAgent),
    tier: rb.dataset.tier,
    transparency: rb.dataset.transparency,
  };
}

/** Compares the requested cell with the read-back page state; any difference fails `label-mismatch`. */
export function compareLabels(req: RequestedLabels, rb: Readback): GateResult & { mismatches: string[] } {
  const m: string[] = [];
  const ua = engineFromUa(rb.userAgent);
  if (ua !== req.engine) m.push(`engine: requested ${req.engine}, user agent reads ${ua ?? 'unrecognised'}`);
  if (rb.dataset.engine !== null && rb.dataset.engine !== 'unknown' && rb.dataset.engine !== DATASET_ENGINE[req.engine]) {
    m.push(`engine: requested ${req.engine}, <html data-ag-engine> reads ${rb.dataset.engine}`);
  }
  if (rb.dataset.scheme !== req.scheme) m.push(`scheme: requested ${req.scheme}, <html data-ag-scheme> reads ${rb.dataset.scheme}`);
  if (rb.media.dark !== (req.scheme === 'dark')) m.push(`scheme: requested ${req.scheme}, prefers-color-scheme: dark reads ${rb.media.dark}`);
  if (rb.dataset.tier !== req.tier) m.push(`tier: requested ${req.tier}, <html data-ag-tier> reads ${rb.dataset.tier}`);
  if (rb.dataset.transparency !== req.transparency) m.push(`transparency: requested ${req.transparency}, <html data-ag-transparency> reads ${rb.dataset.transparency}`);
  const wantMore = req.preference === 'contrast-more';
  if (rb.media.contrastMore !== wantMore) m.push(`preference: requested ${req.preference}, prefers-contrast: more reads ${rb.media.contrastMore}`);
  if ((rb.dataset.contrast === 'more') !== wantMore) m.push(`preference: requested ${req.preference}, <html data-ag-contrast> reads ${rb.dataset.contrast}`);
  const wantForced = req.preference === 'forced-colors';
  if (rb.media.forcedColors !== wantForced) {
    m.push(wantForced ? 'preference: forced-colors emulation requested but (forced-colors: active) reads false — the emulation did nothing'
      : `preference: requested ${req.preference}, (forced-colors: active) reads true`);
  }
  const wantReduced = req.preference === 'reduced-motion';
  if (rb.media.reducedMotion !== wantReduced) m.push(`preference: requested ${req.preference}, prefers-reduced-motion: reduce reads ${rb.media.reducedMotion}`);
  if ((rb.dataset.motion === 'none') !== wantReduced) m.push(`preference: requested ${req.preference}, <html data-ag-motion> reads ${rb.dataset.motion}`);
  return { gate: 'label-mismatch', status: m.length ? 'fail' : 'pass', value: m.length, limit: 0,
    detail: m.length ? `label-mismatch: ${m.join('; ')}` : 'every requested label reads back', mismatches: m };
}
