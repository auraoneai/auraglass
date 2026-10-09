/* CMP-131 compat: GlassTabs (4.x) -> Tabs.Root (5.0).
   warnDeprecated once per symbol per page load; props pass through unmolested. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Tabs } from '../../../components/tabs/Tabs';
import { __compatWrap as wrap } from './_shared';

const DEP = 'DEP-C0287';

export function GlassTabs(props: React.ComponentProps<typeof Tabs.Root>) {
  warnDeprecated(DEP);
  return wrap('GlassTabs', <Tabs.Root {...props} />);
}
