/* REQ-CMP-131 compat: GlassLabelPrimitive (4.x) -> Label (5.0).
   warnDeprecated('DEP-C0279') fires at call time, once per page load, dev only.
   Primitive alias with no provenance wrapper: a wrapper element would change
   what the primitive renders (Slot merges onto its child; Portal, FocusScope
   and DismissableLayer own their DOM placement). The 5.0 meta lists no prop
   changes for this name. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Label } from '../../../primitives';

const DEP = 'DEP-C0279';

export function GlassLabelPrimitive(props: React.ComponentProps<typeof Label>) {
  warnDeprecated(DEP);
  return <Label {...props} />;
}
