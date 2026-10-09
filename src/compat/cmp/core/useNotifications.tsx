/* CMP-131 compat: useNotifications (4.x) -> useToast (5.0). */
'use client';
import { warnDeprecated } from '../../../internal';
import { useToast } from '../../../components/toast';

const DEP = 'DEP-C0297';

export function useNotifications() {
  warnDeprecated(DEP);
  return useToast();
}
