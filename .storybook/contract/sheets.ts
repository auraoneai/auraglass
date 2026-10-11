/// <reference types="vite/client" />
/* REQ-QUAL-10 / REQ-FIN-05 transfer: the two stylesheet sets the preview can load, as lazy Vite globs.
   Kept in its own module so the Jest config tests can substitute it (import.meta.glob is Vite-only).
   Nothing is imported eagerly: `styles.ts` picks one set at runtime from the `ag-cert` URL flag.
   The source set includes the generated dist/tokens.css (`npm run tokens:build`, run by storybook:build):
   no src/**\/*.css declares the token layer, so without it every --ag-* token (colour, radius, space,
   type, shadow, motion) was undefined in the default, non-cert preview. */
export const BUILT_SHEETS: Record<string, () => Promise<unknown>> = import.meta.glob('../../dist/styles.css');
export const SOURCE_SHEETS: Record<string, () => Promise<unknown>> = import.meta.glob(['../../dist/tokens.css', '../../src/**/*.css']);

/* REQ-QUAL-56: `true` in the AG_STORYBOOK_DIST=1 build (Vite `define` from .storybook/build/aura-glass-resolve.ts).
   That build is dist-backed end to end, so it loads the built sheet set in every mode, never the source sheets. */
declare const __AG_STORYBOOK_DIST__: boolean | undefined;
export const DIST_BUILD: boolean = typeof __AG_STORYBOOK_DIST__ !== 'undefined' && __AG_STORYBOOK_DIST__ === true;
