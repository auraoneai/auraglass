/* CMP-131 compat: GlassNotificationProvider (4.x) -> Toast.Provider (5.0).
   warnDeprecated once per symbol per page load; props pass through unmolested. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Toast } from '../../../components/toast';
import { __compatWrap as wrap } from './_shared';

const DEP = 'DEP-C0121';

export function GlassNotificationProvider(props: React.ComponentProps<typeof Toast.Provider>) {
  warnDeprecated(DEP);
  return wrap('GlassNotificationProvider', <Toast.Provider {...props} />);
}
