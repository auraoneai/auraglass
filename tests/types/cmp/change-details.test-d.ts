/* CMP-012: ChangeDetails / ValueChangeHandler type test. */
import type { ChangeDetails, ValueChangeHandler } from '../../../src/foundation/types';
import type { ChangeDetails as PublicChangeDetails } from '../../../src/root/cmp';

// ValueChangeHandler<string> accepts (v, d) => d.reason
export const handler: ValueChangeHandler<string> = (v, d) => {
  const _reason: string = d.reason;
  const _event: Event | undefined = d.event;
  void _reason; void _event; void v;
};

// a handler typed against a Base UI event-details shape (non-optional event)
// is not assignable: our details.event is Event | undefined
// @ts-expect-error — details.event must accept undefined
export const strictHandler: ValueChangeHandler<string> = (v: string, d: { event: Event; reason: string }) => {
  void v; void d;
};

// ChangeDetails is importable from the public cmp surface ('aura-glass' root types)
export const publicDetails: PublicChangeDetails = { event: undefined, reason: 'imperative' };
export const details: ChangeDetails = publicDetails;
