/* CMP-131 compat: GlassMenu (4.x) -> Menu.Root (5.0).
   warnDeprecated once per symbol per page load; props pass through unmolested. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Menu } from '../../../components/menu';
import { __compatWrap as wrap } from './_shared';

const DEP = 'DEP-C0275';

export function GlassMenu(props: React.ComponentProps<typeof Menu.Root>) {
  warnDeprecated(DEP);
  return wrap('GlassMenu', <Menu.Root {...props} />);
}
