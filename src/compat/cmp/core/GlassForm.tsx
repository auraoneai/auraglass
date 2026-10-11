/* REQ-CMP-131 compat: GlassForm (4.x) -> Form (5.0).
   warnDeprecated('DEP-C0283') fires at call time, once per page load, dev only.
   The 5.0 meta lists no prop changes for this name, so props pass through. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Form } from '../../../components/field';
import { __compatWrap as wrap } from '../overlays/_shared';

const DEP = 'DEP-C0283';

export function GlassForm(props: React.ComponentProps<typeof Form>) {
  warnDeprecated(DEP);
  return wrap('GlassForm', <Form {...props} />);
}
