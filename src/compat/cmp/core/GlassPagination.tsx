/* CMP-131 compat: GlassPagination (4.x) -> Pagination.Root (5.0).
   warnDeprecated once per symbol per page load; props pass through unmolested. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Pagination } from '../../../components/pagination/Pagination';
import { __compatWrap as wrap } from './_shared';

const DEP = 'DEP-C0277';

export function GlassPagination(props: React.ComponentProps<typeof Pagination.Root>) {
  warnDeprecated(DEP);
  return wrap('GlassPagination', <Pagination.Root {...props} />);
}
