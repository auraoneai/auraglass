/* CMP-131 compat: GlassMagneticButton (4.x) -> Button (5.0).
   warnDeprecated once per symbol per page load; props pass through unmolested. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Button } from '../../../components/button';
import { __compatWrap as wrap } from './_shared';

const DEP = 'DEP-C0273';

export function GlassMagneticButton(props: React.ComponentProps<typeof Button>) {
  warnDeprecated(DEP);
  return wrap('GlassMagneticButton', <Button {...props} />);
}
