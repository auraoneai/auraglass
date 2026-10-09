/* CMP-341 compat: GlassToastProvider (4.x) -> Toast.Provider (+Viewport position) (5.0).
   warnDeprecated fires at call time, once per page load per symbol; unmappable
   props drop with a single warning; never throws. Mapping per §10.2/metas. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Toast } from '../../../components/toast';

import { __compatToastList, __compatWrap as wrap } from './_shared';

const DEP = 'DEP-C0116';

export interface GlassToastProviderProps {
  position?: string;
  duration?: number;
  limit?: number;
  children?: React.ReactNode;
}

const POSITION_MAP: Record<string, 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'> = {
  top: 'top-center', bottom: 'bottom-center',
  'top-left': 'top-left', 'top-center': 'top-center', 'top-right': 'top-right',
  'bottom-left': 'bottom-left', 'bottom-center': 'bottom-center', 'bottom-right': 'bottom-right',
};

export function toastPosition(p?: string): 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right' | undefined {
  return p !== undefined ? (POSITION_MAP[p] ?? 'bottom-right') : undefined;
}

/** @deprecated GlassToastProvider DEP-C0116 since 4.3.0, removed in 5.0.0. {@link Toast.Provider} */
export function GlassToastProvider({ position, duration, limit, children }: GlassToastProviderProps) {
  warnDeprecated(DEP);
  const pos = toastPosition(position);
  return wrap('GlassToastProvider', (
    <Toast.Provider
      {...(limit !== undefined ? { limit } : {})}
      {...(duration !== undefined ? { timeout: duration } : {})}
    >
      {children}
      <Toast.Viewport {...(pos !== undefined ? { position: pos } : {})}><__compatToastList /></Toast.Viewport>
    </Toast.Provider>
  ));
}
