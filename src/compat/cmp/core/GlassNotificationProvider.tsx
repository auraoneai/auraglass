/* REQ-CMP-131 compat: GlassNotificationProvider (4.x) -> Toast.Provider (5.0).
   warnDeprecated('DEP-C0121') fires at call time, once per page load, dev only.
   The 5.0 meta lists no prop changes for this name, so props pass through. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Toast } from '../../../components/toast';
import { __compatWrap as wrap } from '../overlays/_shared';

const DEP = 'DEP-C0121';

export function GlassNotificationProvider(props: React.ComponentProps<typeof Toast.Provider>) {
  warnDeprecated(DEP);
  return wrap('GlassNotificationProvider', <Toast.Provider {...props} />);
}
