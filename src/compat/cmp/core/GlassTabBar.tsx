/* CMP-131 compat: GlassTabBar (4.x) -> TabBar.Root (5.0).
   warnDeprecated once per symbol per page load; props pass through unmolested. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { TabBar } from '../../../components/tab-bar/TabBar';
import { __compatWrap as wrap } from './_shared';

const DEP = 'DEP-C0286';

export function GlassTabBar(props: React.ComponentProps<typeof TabBar.Root>) {
  warnDeprecated(DEP);
  return wrap('GlassTabBar', <TabBar.Root {...props} />);
}
