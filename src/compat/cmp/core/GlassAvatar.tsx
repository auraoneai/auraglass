/* CMP-131 compat: GlassAvatar (4.x) -> Avatar.Root (5.0).
   warnDeprecated once per symbol per page load; props pass through unmolested. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Avatar } from '../../../components/avatar';
import { __compatWrap as wrap } from './_shared';

const DEP = 'DEP-C0245';

export function GlassAvatar(props: React.ComponentProps<typeof Avatar.Root>) {
  warnDeprecated(DEP);
  return wrap('GlassAvatar', <Avatar.Root {...props} />);
}
