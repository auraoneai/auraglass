/* CMP-028 compat: GlassLabel (4.x) -> Label (5.0).
   warnDeprecated fires at call time, once per page load per symbol; props map
   1:1 onto Label (required/disabled/htmlFor passthrough). */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Label } from '../../../primitives/Label';

/* DEP-C0280 is the GlassLabel row in fragments/deprecations/cmp.ts on
   release/4.x (#524, ex-#313); it reaches next through the REQ-FIN-13 sync. */
const DEP = 'DEP-C0280';

export interface GlassLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  disabled?: boolean;
}

export function GlassLabel(props: GlassLabelProps) {
  warnDeprecated(DEP);
  return <Label {...props} />;
}
