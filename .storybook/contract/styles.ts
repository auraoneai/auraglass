/* REQ-QUAL-09 / REQ-QUAL-10 / REQ-FIN-05 transfer (FIN-449).
   Cert mode is `?ag-cert=1` on the preview iframe URL. In cert mode the preview loads exactly one
   stylesheet, the built `dist/styles.css`, so lanes see the shipped sheet set (never a `src/**\/*.css`
   glob); outside cert mode it loads the self-layered source sheets for fast iteration. Cert mode also
   neutralises every harness ancestor between <body> and [data-ag-story-content] so only the
   Environment (or the <body> background for body-painted scenes) paints the scene. */
import { BUILT_SHEETS, SOURCE_SHEETS } from './sheets';

export const CERT_PARAM = 'ag-cert';
export const BUILT_SHEET = '../../dist/styles.css';
export const CERT_STYLE_ATTR = 'data-ag-cert-style';

type SheetLoaders = Record<string, () => Promise<unknown>>;

export function isCertMode(search: string = typeof window === 'undefined' ? '' : window.location.search): boolean {
  return new URLSearchParams(search).get(CERT_PARAM) === '1';
}

/** The sheet loaders for a mode. Cert mode: exactly the built sheet, or an error when dist/ was not built. */
export function selectSheets(cert: boolean, built: SheetLoaders, source: SheetLoaders): Array<[string, () => Promise<unknown>]> {
  if (cert) {
    const load = built[BUILT_SHEET];
    if (!load) throw new Error(`ag-cert=1 needs the built ${BUILT_SHEET.replace('../../', '')}; run the dist build before qual:build:storybook`);
    return [[BUILT_SHEET, load]];
  }
  return Object.entries(source).sort(([a], [b]) => a.localeCompare(b));
}

/** Ancestor rules for cert mode (REQ-QUAL-09): transparent, unfiltered, opacity 1, scene-sized environment. */
export const CERT_CSS = [
  'html { background: transparent !important; }',
  'body { margin: 0 !important; padding: 0 !important; }',
  '#storybook-root, [data-ag-backdrop]:has(> [data-ag-story-content]) {',
  '  background-color: transparent !important; background-image: none !important;',
  '  backdrop-filter: none !important; -webkit-backdrop-filter: none !important;',
  '  filter: none !important; opacity: 1 !important;',
  '}',
  '[data-ag-backdrop]:has(> [data-ag-story-content]) { min-height: 100vh; width: 100%; box-sizing: border-box; }',
].join('\n');

function installCertStyle(doc: Document): void {
  if (doc.head.querySelector(`style[${CERT_STYLE_ATTR}]`)) return;
  const style = doc.createElement('style');
  style.setAttribute(CERT_STYLE_ATTR, '');
  style.textContent = CERT_CSS;
  doc.head.appendChild(style);
}

let loaded: Promise<void> | null = null;

/** Loads the mode's sheets once per preview iframe; used as the preview's single loader. */
export function loadStoryStyles(cert: boolean = isCertMode()): Promise<void> {
  if (!loaded) {
    const sheets = selectSheets(cert, BUILT_SHEETS, SOURCE_SHEETS);
    if (cert && typeof document !== 'undefined') installCertStyle(document);
    loaded = Promise.all(sheets.map(([, load]) => load())).then(() => undefined);
  }
  return loaded;
}
