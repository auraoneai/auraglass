/* CMP-341 compat: useToast (4.x) (4.x) -> useToast (5.0) (5.0).
   warnDeprecated fires at call time, once per page load per symbol; unmappable
   props drop with a single warning; never throws. Mapping per §10.2/metas. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { useToast as useToast5 } from '../../../components/toast';
import type { ToastData } from '../../../components/toast';
import { toastType } from './GlassToast';

const DEP = 'DEP-C0118';

export interface GlassToastOptions {
  message?: React.ReactNode;
  title?: React.ReactNode;
  type?: string;
  duration?: number;
}

export interface UseToastCompatReturn {
  toast: (opts: GlassToastOptions | string) => string;
  addToast: (opts: GlassToastOptions) => string;
  dismiss: (id: string) => void;
  removeToast: (id: string) => void;
  success: (t: Omit<ToastData, 'intent'>) => string;
  error: (t: Omit<ToastData, 'intent'>) => string;
}

const toData = (o: GlassToastOptions | string): ToastData => {
  if (typeof o === 'string') return { title: o };
  return {
    ...(o.title !== undefined ? { title: o.title } : {}),
    ...(o.message !== undefined ? { description: o.message } : {}),
    intent: toastType(o.type),
    ...(o.duration !== undefined ? { timeout: o.duration } : {}),
  };
};

/** @deprecated useToast DEP-C0118 since 4.3.0, removed in 5.0.0. {@link useToast} */
export function useToast(): UseToastCompatReturn {
  const api = useToast5();
  const ref = React.useRef(api);
  ref.current = api;
  React.useMemo(() => warnDeprecated(DEP), []);
  /* Stable return object — 4.x callers pass it into effect deps; a fresh object
     per render would re-fire those effects forever. */
  return React.useMemo(() => ({
    toast: (o) => ref.current.add(toData(o)),
    addToast: (o) => ref.current.add(toData(o)),
    dismiss: (id) => ref.current.close(id),
    removeToast: (id) => ref.current.close(id),
    success: (t) => ref.current.success(t),
    error: (t) => ref.current.error(t),
  }), []);
}
