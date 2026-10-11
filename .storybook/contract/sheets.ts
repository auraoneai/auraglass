/// <reference types="vite/client" />
/* REQ-QUAL-10 / REQ-FIN-05 transfer: the two stylesheet sets the preview can load, as lazy Vite globs.
   Kept in its own module so the Jest config tests can substitute it (import.meta.glob is Vite-only).
   Nothing is imported eagerly: `styles.ts` picks one set at runtime from the `ag-cert` URL flag.
   The source set includes the generated dist/tokens.css (`npm run tokens:build`, run by storybook:build):
   no src/**\/*.css declares the token layer, so without it every --ag-* token (colour, radius, space,
   type, shadow, motion) was undefined in the default, non-cert preview. */
export const BUILT_SHEETS: Record<string, () => Promise<unknown>> = import.meta.glob('../../dist/styles.css');
export const SOURCE_SHEETS: Record<string, () => Promise<unknown>> = import.meta.glob(['../../dist/tokens.css', '../../src/**/*.css']);
