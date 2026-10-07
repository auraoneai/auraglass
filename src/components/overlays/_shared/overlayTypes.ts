/* CMP-209/219 (REQ-CMP-78): shared overlay open-change vocabulary. Contract-level
   types only — this module never imports @base-ui. */
import type { ChangeDetails } from '../../../contracts/components';

/** Kinds recognised by the overlay layer stack + material thickness table. */
export type OverlayKind =
  | 'dialog' | 'alert-dialog' | 'sheet'
  | 'popover' | 'menu' | 'tooltip' | 'toast';

/** The five reasons callers see (contract §10.1); anything else collapses to 'imperative'. */
export type OverlayOpenReason =
  | 'trigger-press'
  | 'outside-press'
  | 'escape-key'
  | 'close-press'
  | 'imperative';

export interface OverlayOpenChangeDetails extends ChangeDetails {
  reason: OverlayOpenReason;
}

const KNOWN = new Set<string>([
  'trigger-press', 'outside-press', 'escape-key', 'close-press', 'imperative',
]);

/** Normalises a Base UI change-details reason into the contract's five-value union. */
export function toOverlayReason(reason: unknown): OverlayOpenReason {
  if (reason === 'imperative-action') return 'imperative';
  return typeof reason === 'string' && KNOWN.has(reason)
    ? (reason as OverlayOpenReason)
    : 'imperative';
}
