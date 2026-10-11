/* REQ-CMP-131 compat: GlassAccordion (4.x) -> Accordion.Root (5.0).
   warnDeprecated('DEP-C0251') fires at call time, once per page load, dev only.
   The 5.0 meta lists no prop changes for this name, so props pass through. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Accordion } from '../../../components/accordion';
import { __compatWrap as wrap } from '../overlays/_shared';

const DEP = 'DEP-C0251';

export function GlassAccordion(props: React.ComponentProps<typeof Accordion.Root>) {
  warnDeprecated(DEP);
  return wrap('GlassAccordion', <Accordion.Root {...props} />);
}
