/* REQ-CMP-131 compat: GlassPortal (4.x) -> Portal (5.0).
   warnDeprecated('DEP-C0276') fires at call time, once per page load, dev only.
   Primitive alias with no provenance wrapper: a wrapper element would change
   what the primitive renders (Slot merges onto its child; Portal, FocusScope
   and DismissableLayer own their DOM placement). The 5.0 meta lists no prop
   changes for this name. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Portal } from '../../../primitives';

const DEP = 'DEP-C0276';

export function GlassPortal(props: React.ComponentProps<typeof Portal>) {
  warnDeprecated(DEP);
  return <Portal {...props} />;
}
