/* CMP-131 compat: GlassBreadcrumbs (4.x) -> Breadcrumbs.Root (5.0).
   warnDeprecated once per symbol per page load; props pass through unmolested. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Breadcrumbs } from '../../../components/breadcrumbs/Breadcrumbs';
import { __compatWrap as wrap } from './_shared';

const DEP = 'DEP-C0248';

export function GlassBreadcrumbs(props: React.ComponentProps<typeof Breadcrumbs.Root>) {
  warnDeprecated(DEP);
  return wrap('GlassBreadcrumbs', <Breadcrumbs.Root {...props} />);
}
