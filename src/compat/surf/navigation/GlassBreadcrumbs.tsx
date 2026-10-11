/* GlassBreadcrumbs — 4.x compat adapter (CMP-131, SURF-owned per FIN-F): (4.x) -> Breadcrumbs.Root (5.0).
   warnDeprecated once per symbol per page load; props pass through unmolested. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Breadcrumbs } from '../../../components/breadcrumbs/Breadcrumbs';
import { __compatWrap as wrap } from '../../cmp/core/_shared';

export function GlassBreadcrumbs(props: React.ComponentProps<typeof Breadcrumbs.Root>) {
  warnDeprecated('GlassBreadcrumbs');
  return wrap('GlassBreadcrumbs', <Breadcrumbs.Root {...props} />);
}
