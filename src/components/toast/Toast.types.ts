/* CMP-283..294 (REQ-CMP-106/107/108/109/110): Toast prop + hook types. */
import type * as React from 'react';

export type ToastIntent = 'info' | 'success' | 'warning' | 'error';
export type ToastPosition =
  | 'top-left' | 'top-center' | 'top-right'
  | 'bottom-left' | 'bottom-center' | 'bottom-right';

/** logical viewport position — maps onto the physical six-region grid
    (start = inline-start). Default 'bottom-end'. */
export type ToastLogicalPosition =
  | 'top-start' | 'top-center' | 'top-end'
  | 'bottom-start' | 'bottom-center' | 'bottom-end';

export interface ToastProviderProps {
  /** default 3 — extra toasts are marked limited */
  limit?: number | undefined;
  /** default 5000ms */
  timeout?: number | undefined;
  /** REQ-CMP-106: viewport position lives on the provider — logical
      start/center/end resolved onto the six-region grid (default bottom-end). */
  position?: ToastLogicalPosition | undefined;
  /** REQ-CMP-106: history buffer config — {limit} caps the session record,
      false disables recording. Default { limit: 50 }. */
  history?: { limit: number } | false | undefined;
  children?: React.ReactNode;
}

export interface ToastViewportProps extends React.HTMLAttributes<HTMLDivElement> {
  /** one of six fixed regions — default 'bottom-right' */
  position?: ToastPosition | undefined;
  children?: React.ReactNode;
}

export interface ToastData extends Record<string, unknown> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** intent drives type, live-region priority and role mapping */
  intent?: ToastIntent;
  actionLabel?: React.ReactNode;
  onAction?: (() => void) | undefined;
  /** per-toast timeout override; 0 = sticky */
  timeout?: number | undefined;
}

export interface ToastRecord {
  id: string;
  intent: ToastIntent;
  title: React.ReactNode;
  at: number;
  status: 'open' | 'closed';
}

export interface ToastRootProps extends React.HTMLAttributes<HTMLDivElement> {
  toast: any;
  children?: React.ReactNode;
}

export interface ToastTitleProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

export interface ToastDescriptionProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

export interface ToastActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export interface ToastCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export interface ToastProgressProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

export interface UseToastReturn {
  toasts: any[];
  add: (t: ToastData) => string;
  close: (id: string) => void;
  update: (id: string, t: Partial<ToastData>) => void;
  promise: <V>(p: Promise<V>, opts: { loading: ToastData; success: ToastData | ((v: V) => ToastData); error: ToastData | ((e: unknown) => ToastData) }) => Promise<V>;
  info: (t: Omit<ToastData, 'intent'>) => string;
  success: (t: Omit<ToastData, 'intent'>) => string;
  warning: (t: Omit<ToastData, 'intent'>) => string;
  error: (t: Omit<ToastData, 'intent'>) => string;
  /** append-only toast history for the session (most recent last) */
  history: ToastRecord[];
}
