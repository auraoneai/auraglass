/* CMP-131 compat: GlassAvatarGroup (4.x) -> AvatarGroup (5.0).
   warnDeprecated once per symbol per page load; props pass through unmolested. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { AvatarGroup } from '../../../components/avatar';
import { __compatWrap as wrap } from './_shared';

const DEP = 'DEP-C0240';

export function GlassAvatarGroup(props: React.ComponentProps<typeof AvatarGroup>) {
  warnDeprecated(DEP);
  return wrap('GlassAvatarGroup', <AvatarGroup {...props} />);
}
