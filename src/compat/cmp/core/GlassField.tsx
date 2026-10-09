/* CMP-131 compat: GlassField (4.x) -> Field.Root (5.0).
   warnDeprecated once per symbol per page load; props pass through unmolested. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Field } from '../../../components/field';
import { __compatWrap as wrap } from './_shared';

const DEP = 'DEP-C0262';

export function GlassField(props: React.ComponentProps<typeof Field.Root>) {
  warnDeprecated(DEP);
  return wrap('GlassField', <Field.Root {...props} />);
}
