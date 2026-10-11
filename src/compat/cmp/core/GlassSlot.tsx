/* REQ-CMP-131 compat: GlassSlot (4.x) -> Slot (5.0).
   warnDeprecated('DEP-C0275') fires at call time, once per page load, dev only.
   Primitive alias with no provenance wrapper: a wrapper element would change
   what the primitive renders (Slot merges onto its child; Portal, FocusScope
   and DismissableLayer own their DOM placement). The 5.0 meta lists no prop
   changes for this name. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Slot } from '../../../primitives';

const DEP = 'DEP-C0275';

export function GlassSlot(props: React.ComponentProps<typeof Slot>) {
  warnDeprecated(DEP);
  return <Slot {...props} />;
}
