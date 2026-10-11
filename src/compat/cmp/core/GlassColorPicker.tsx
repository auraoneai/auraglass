/* CMP-131 compat: GlassColorPicker (4.x) -> ColorPicker.Root (5.0).
   warnDeprecated once per symbol per page load; props pass through unmolested. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { ColorPicker } from '../../../components/color-picker';
import { __compatWrap as wrap } from './_shared';

const DEP = 'DEP-C0256';

export function GlassColorPicker(props: React.ComponentProps<typeof ColorPicker.Root>) {
  warnDeprecated(DEP);
  return wrap('GlassColorPicker', <ColorPicker.Root {...props} />);
}
