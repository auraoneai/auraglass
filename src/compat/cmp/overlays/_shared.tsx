/* Lane 3h shared compat helpers — display:contents wrapper marking the
   compat provenance for tests and diagnostics. */
'use client';
import * as React from 'react';
import { Toast, useToast } from '../../../components/toast';

export const __compatWrap = (compat: string, children: React.ReactNode) => (
  <div data-compat={compat} data-ag-part="root" style={{ display: 'contents' }}>{children}</div>
);

/** 4.x / early-5.0 detent values: fractions plus the 'content' and 'full'
    keywords. The 5.0 Sheet takes `detents?: number[]` (REQ-CMP-94). */
export type CompatSheetDetent = number | 'content' | 'full';

/** Maps legacy detents onto Sheet's number[]: 'full' -> 1; 'content' is the
    Sheet default (detents omitted), so it drops; an all-content list maps to
    undefined (content height). */
export function __compatDetents(d: readonly CompatSheetDetent[] | undefined): number[] | undefined {
  if (d === undefined) return undefined;
  const out = d.flatMap((v) => (v === 'full' ? [1] : v === 'content' ? [] : [v]));
  return out.length > 0 ? out : undefined;
}

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
