/* REQ-CMP-131 compat: GlassDismissableLayer (4.x) -> DismissableLayer (5.0).
   warnDeprecated('DEP-C0278') fires at call time, once per page load, dev only.
   Primitive alias with no provenance wrapper: a wrapper element would change
   what the primitive renders (Slot merges onto its child; Portal, FocusScope
   and DismissableLayer own their DOM placement). The 5.0 meta lists no prop
   changes for this name. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { DismissableLayer } from '../../../primitives';

const DEP = 'DEP-C0278';

export function GlassDismissableLayer(props: React.ComponentProps<typeof DismissableLayer>) {
  warnDeprecated(DEP);
  return <DismissableLayer {...props} />;
}
