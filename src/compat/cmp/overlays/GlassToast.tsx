/* CMP-341 compat: GlassToast (4.x) -> Toast (5.0).
   warnDeprecated fires at call time, once per page load per symbol; unmappable
   props drop with a single warning; never throws. Mapping per §10.2/metas. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Toast, useToast } from '../../../components/toast';
import type { ToastIntent } from '../../../components/toast';
import { __compatWrap as wrap } from './_shared';

const DEP = 'DEP-C0115';

export interface GlassToastProps {
  message?: React.ReactNode;
  title?: React.ReactNode;
  type?: 'info' | 'success' | 'warning' | 'error' | 'danger';
  duration?: number;
  onClose?: () => void;
  id?: string;
  className?: string;
}

const TYPE_MAP: Record<string, ToastIntent> = {
  info: 'info', success: 'success', warning: 'warning', error: 'error', danger: 'error',
};

export function toastType(t?: string): ToastIntent {
  return t !== undefined ? (TYPE_MAP[t] ?? 'info') : 'info';
}

export function GlassToast({ message, title, type, duration, onClose, className }: GlassToastProps) {
  warnDeprecated(DEP);
  const api = useToast();
  const intent = toastType(type);
  React.useEffect(() => {
    const id = api.toast({
      title: title ?? message ?? '',
      ...(title !== undefined && message !== undefined ? { description: message } : {}),
      intent: intent as 'info' | 'success' | 'warning' | 'danger' | 'neutral',
      ...(duration !== undefined ? { duration } : {}),
    });
    return () => { api.dismiss(id); onClose?.(); };
    // mount-once semantics: one toast per adapter mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

/** Programmatic form: GlassToast({message, type}) as a function call is
    unsupported in 5.0 — consumers migrate to useToast().toast. The component
    form above is the adapter. */
export default GlassToast;
