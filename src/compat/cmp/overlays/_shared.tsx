/* Lane 3h shared compat helpers — display:contents wrapper marking the
   compat provenance for tests and diagnostics. */
'use client';
import * as React from 'react';
import { Toast, useToast } from '../../../components/toast';

export const __compatWrap = (compat: string, children: React.ReactNode) => (
  <div data-ag-compat={compat} data-ag-part="root" style={{ display: 'contents' }}>{children}</div>
);

/** Toast.Viewport does not auto-render manager toasts — compat viewports mount
   this child so a 4.x `position`-only prop keeps showing real toasts. */
export function __compatToastList() {
  const t = useToast();
  return (
    <>
      {t.toasts.map((toast) => (
        <Toast.Root key={toast.id} toast={toast}>
          <Toast.Title>{toast.title}</Toast.Title>
          <Toast.Description>{toast.description}</Toast.Description>
          <Toast.Close>×</Toast.Close>
          <Toast.Progress />
        </Toast.Root>
      ))}
    </>
  );
}
