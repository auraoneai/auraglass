/* REQ-CMP-131 compat: GlassAvatarGroup (4.x) -> AvatarGroup (5.0).
   warnDeprecated('DEP-C0240') fires at call time, once per page load, dev only.
   The 5.0 meta lists no prop changes for this name, so props pass through. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { AvatarGroup } from '../../../components/avatar';
import { __compatWrap as wrap } from '../overlays/_shared';

const DEP = 'DEP-C0240';

export function GlassAvatarGroup(props: React.ComponentProps<typeof AvatarGroup>) {
  warnDeprecated(DEP);
  return wrap('GlassAvatarGroup', <AvatarGroup {...props} />);
}
