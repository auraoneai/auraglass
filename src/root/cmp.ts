/* Root barrel for the CMP stream (REQ-CMP-22/23): re-exports of exactly
   ROOT_EXPORTS.cmp names that are code-complete (no seed marker), plus the
   public change-details types. Value-export set is kept in lockstep with
   ROOT_EXPORTS.cmp in src/contracts/entries.ts. */
export type { ChangeDetails } from '../contracts/components';
export type { ValueChangeHandler } from '../foundation/types';

export { VisuallyHidden } from '../primitives/VisuallyHidden';
export type { VisuallyHiddenProps } from '../primitives/VisuallyHidden';
