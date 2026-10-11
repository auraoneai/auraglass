/* CMP-131 compat: GlassAccordion (4.x) -> Accordion.Root (5.0).
   warnDeprecated once per symbol per page load; props pass through unmolested. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Accordion } from '../../../components/accordion';
import { __compatWrap as wrap } from './_shared';

const DEP = 'DEP-C0251';

export function GlassAccordion(props: React.ComponentProps<typeof Accordion.Root>) {
  warnDeprecated(DEP);
  return wrap('GlassAccordion', <Accordion.Root {...props} />);
}
