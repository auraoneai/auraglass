/* CMP-131 compat: GlassForm (4.x) -> Form (5.0).
   warnDeprecated once per symbol per page load; props pass through unmolested. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Form } from '../../../components/field';
import { __compatWrap as wrap } from './_shared';

const DEP = 'DEP-C0264';

export function GlassForm(props: React.ComponentProps<typeof Form>) {
  warnDeprecated(DEP);
  return wrap('GlassForm', <Form {...props} />);
}
