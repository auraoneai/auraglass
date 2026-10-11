/* REQ-CMP-131 compat: GlassInlineEdit (4.x) -> InlineEdit (5.0).
   warnDeprecated('DEP-C0254') fires at call time, once per page load, dev only.
   The 5.0 meta lists no prop changes for this name, so props pass through. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { InlineEdit } from '../../../components/inline-edit';
import { __compatWrap as wrap } from '../overlays/_shared';

const DEP = 'DEP-C0254';

export function GlassInlineEdit(props: React.ComponentProps<typeof InlineEdit>) {
  warnDeprecated(DEP);
  return wrap('GlassInlineEdit', <InlineEdit {...props} />);
}
