/* CMP-131 compat: GlassSearchInput (4.x) -> SearchField (5.0).
   warnDeprecated once per symbol per page load; props pass through unmolested. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { SearchField } from '../../../components/search-field';
import { __compatWrap as wrap } from './_shared';

const DEP = 'DEP-C0281';

export function GlassSearchInput(props: React.ComponentProps<typeof SearchField>) {
  warnDeprecated(DEP);
  return wrap('GlassSearchInput', <SearchField {...props} />);
}
