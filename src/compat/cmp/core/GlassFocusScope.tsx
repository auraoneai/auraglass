/* REQ-CMP-131 compat: GlassFocusScope (4.x) -> FocusScope (5.0).
   warnDeprecated('DEP-C0277') fires at call time, once per page load, dev only.
   Primitive alias with no provenance wrapper: a wrapper element would change
   what the primitive renders (Slot merges onto its child; Portal, FocusScope
   and DismissableLayer own their DOM placement). The 5.0 meta lists no prop
   changes for this name. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { FocusScope } from '../../../primitives';

const DEP = 'DEP-C0277';

export function GlassFocusScope(props: React.ComponentProps<typeof FocusScope>) {
  warnDeprecated(DEP);
  return <FocusScope {...props} />;
}
