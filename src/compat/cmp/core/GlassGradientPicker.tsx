/* REQ-CMP-131 compat: GlassGradientPicker (4.x) -> ColorPicker.Root (5.0).
   warnDeprecated('DEP-C0258') fires at call time, once per page load, dev only.
   The 5.0 meta lists no prop changes for this name, so props pass through. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { ColorPicker } from '../../../components/color-picker';
import { __compatWrap as wrap } from '../overlays/_shared';

const DEP = 'DEP-C0258';

export function GlassGradientPicker(props: React.ComponentProps<typeof ColorPicker.Root>) {
  warnDeprecated(DEP);
  return wrap('GlassGradientPicker', <ColorPicker.Root {...props} />);
}
