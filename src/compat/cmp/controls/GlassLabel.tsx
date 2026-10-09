/* CMP-028 compat: GlassLabel (4.x) -> Label (5.0).
   warnDeprecated fires at call time, once per page load per symbol; props map
   1:1 onto Label (required/disabled/htmlFor passthrough). */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Label } from '../../../primitives/Label';

const DEP = 'DEP-C0221';

export interface GlassLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  disabled?: boolean;
}

export function GlassLabel(props: GlassLabelProps) {
  warnDeprecated(DEP);
  return <Label {...props} />;
}
