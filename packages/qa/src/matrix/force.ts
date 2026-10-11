/* REQ-QUAL-12 (QUAL, FIN-429). How a cell is forced onto the page (PRD-QUAL §4.3): the preview globals (S-20 keys, frozen
   names), the expected `data-ag-*` values on <html> (S-01) that the lane reads back, Playwright `emulateMedia` options and
   the browser-context options (viewport, explicit DPR, touch). No runtime heuristic picks anything (D-10). */
import { VIEWPORTS, type Cell, type MatrixEngine } from './axes';

export interface ForcedGlobals {
  scene: Cell['scene'];
  scheme: Cell['scheme'];
  contrast: 'standard' | 'more';
  transparency: Cell['transparency'];
  motion: 'full' | 'none';
  tier: Cell['tier'];
}

export interface ForcedMedia {
  colorScheme: 'light' | 'dark';
  reducedMotion: 'reduce' | 'no-preference';
  forcedColors: 'active' | 'none';
  contrast: 'more' | 'no-preference';
}

export interface ForcedContext {
  viewport: { width: number; height: number };
  deviceScaleFactor: number;
  hasTouch: boolean;
  /** Firefox has no mobile emulation in Playwright; `isMobile` is set only where supported */
  isMobile?: boolean;
}

export interface Forcing {
  globals: ForcedGlobals;
  /** values the lane asserts on <html> after `data-ag-cert-ready` (a mismatch fails, never re-labels) */
  html: Record<'data-ag-scheme' | 'data-ag-contrast' | 'data-ag-transparency' | 'data-ag-motion' | 'data-ag-tier', string>;
  media: ForcedMedia;
  context: ForcedContext;
}

const MOBILE_EMULATION: Record<MatrixEngine, boolean> = { chromium: true, webkit: true, firefox: false };

export function forceFor(cell: Cell): Forcing {
  const contrast = cell.preference === 'contrast-more' ? 'more' : 'standard';
  const motion = cell.preference === 'reduced-motion' ? 'none' : 'full';
  const globals: ForcedGlobals = { scene: cell.scene, scheme: cell.scheme, contrast, transparency: cell.transparency, motion, tier: cell.tier };
  const vp = VIEWPORTS[cell.viewport];
  const context: ForcedContext = { viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: vp.deviceScaleFactor, hasTouch: vp.touch };
  if (vp.touch && MOBILE_EMULATION[cell.engine]) context.isMobile = true;
  return {
    globals,
    html: {
      'data-ag-scheme': cell.scheme, 'data-ag-contrast': contrast, 'data-ag-transparency': cell.transparency,
      'data-ag-motion': motion, 'data-ag-tier': cell.tier,
    },
    media: {
      colorScheme: cell.scheme,
      reducedMotion: cell.preference === 'reduced-motion' ? 'reduce' : 'no-preference',
      forcedColors: cell.preference === 'forced-colors' ? 'active' : 'none',
      contrast: cell.preference === 'contrast-more' ? 'more' : 'no-preference',
    },
    context,
  };
}

/** Storybook globals URL value: `key:value;key:value` in a fixed key order. */
export function globalsParam(g: ForcedGlobals): string {
  return (['scene', 'scheme', 'contrast', 'transparency', 'motion', 'tier'] as const).map((k) => `${k}:${g[k]}`).join(';');
}

/** The preview iframe URL for a story in cert mode (`ag-cert=1`) with the cell's globals. */
export function storyUrl(baseUrl: string, storyId: string, cell: Cell): string {
  const base = baseUrl.replace(/\/+$/, '');
  const q = new URLSearchParams({ id: storyId, viewMode: 'story', 'ag-cert': '1', globals: globalsParam(forceFor(cell).globals) });
  return `${base}/iframe.html?${q.toString()}`;
}
