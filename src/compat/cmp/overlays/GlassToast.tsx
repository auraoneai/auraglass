/* CMP-341 compat: GlassToast (4.x) -> Toast (5.0).
   warnDeprecated fires at call time, once per page load per symbol; unmappable
   props drop with a single warning; never throws. Mapping per §10.2/metas. */
'use client';
import * as React from 'react';
import { cn, warnDeprecated } from '../../../internal';
import { useToast } from '../../../components/toast';
import type { ToastIntent } from '../../../components/toast';
import { overlayMaterial } from '../../../components/overlays/_shared';
import { __compatWrap as wrap } from './_shared';

const DEP = 'DEP-C0115';

export interface GlassToastProps {
  message?: React.ReactNode;
  description?: React.ReactNode;
  title?: React.ReactNode;
  type?: 'info' | 'success' | 'warning' | 'error' | 'danger';
  variant?: 'info' | 'success' | 'warning' | 'error' | 'danger';
  duration?: number;
  onClose?: () => void;
  id?: string;
  className?: string;
  children?: React.ReactNode;
}

const TYPE_MAP: Record<string, ToastIntent> = {
  info: 'info', success: 'success', warning: 'warning', error: 'error', danger: 'error',
};

export function toastType(t?: string): ToastIntent {
  return t !== undefined ? (TYPE_MAP[t] ?? 'info') : 'info';
}

/** @deprecated since 4.3.0, removed in 6.0.0. Use {@link useToast}. */
export function GlassToast({
  message,
  description,
  title,
  type,
  variant,
  duration,
  onClose,
  className,
  children,
}: GlassToastProps) {
  warnDeprecated(DEP);
  const api = useToast();
  const intent = toastType(type ?? variant);
  const desc = description ?? message;
  React.useEffect(() => {
    const id = api.add({
      ...(title !== undefined ? { title } : {}),
      ...(desc !== undefined ? { description: desc } : title !== undefined ? {} : { title: desc }),
      intent,
      ...(duration !== undefined ? { timeout: duration } : {}),
    });
    return () => { api.close(id); onClose?.(); };
    // mount-once semantics: one toast per adapter mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (title === undefined && desc === undefined && children === undefined) {
    return null;
  }
  return wrap(
    'GlassToast',
    <div
      role="status"
      data-ag-component="toast"
      data-ag-part="toast"
      data-ag-intent={intent}
      {...overlayMaterial('toast')}
      className={cn('ag-toast', className)}
    >
      <div data-ag-part="content" className="ag-toast-content">
        {title !== undefined ? (
          <div data-ag-part="title" className="ag-toast-title">
            {title}
          </div>
        ) : null}
        {desc !== undefined ? (
          <div data-ag-part="description" className="ag-toast-description">
            {desc}
          </div>
        ) : null}
        {children}
      </div>
    </div>,
  );
}

/** Programmatic form: GlassToast({message, type}) as a function call is
    unsupported in 5.0 — consumers migrate to useToast().add. The component
    form above is the adapter. */
export default GlassToast;
