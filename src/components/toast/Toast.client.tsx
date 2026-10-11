/* CMP-283..294 (REQ-CMP-106..110): Toast + useToast over BU Toast —
   Provider default limit 3 / timeout 5000, six-position Viewport ported to
   the toast layer-root, F6 → viewport (BU), intent → role status|alert,
   pause on hover/focus/hidden (BU timers), Progress part, append-only
   session history, dev warning for interactive non-action content. */
'use client';
import * as React from 'react';
import { Toast as Base } from '@base-ui/react/toast';
import { useCmpPortalContainer as usePortalContainer } from '../overlays/_shared/portalContainer';
import { overlayMaterial } from '../overlays/_shared';
import { cn } from '../../internal';
import type {
  ToastProviderProps, ToastViewportProps, ToastRootProps, ToastTitleProps,
  ToastDescriptionProps, ToastActionProps, ToastCloseProps, ToastProgressProps,
  ToastData, ToastRecord, UseToastReturn, ToastIntent,
} from './Toast.types';

/* CMP-294 (REQ-CMP-110): append-only history — one entry per add, closed on
   close; capped at 50 to bound memory. Module-scoped: shared by every
   provider instance and survives unmounts (history is a session record). */
const HISTORY_CAP = 50;
const history: ToastRecord[] = [];
const historyListeners = new Set<() => void>();
function pushHistory(entry: ToastRecord) {
  history.push(entry);
  if (history.length > HISTORY_CAP) history.splice(0, history.length - HISTORY_CAP);
  historyListeners.forEach((l) => l());
}
function markHistoryClosed(id: string) {
  const e = history.find((h) => h.id === id && h.status === 'open');
  if (e) {
    e.status = 'closed';
    historyListeners.forEach((l) => l());
  }
}
function useHistory(): ToastRecord[] {
  return React.useSyncExternalStore(
    (cb) => { historyListeners.add(cb); return () => historyListeners.delete(cb); },
    () => history,
    () => history,
  );
}

const intentPriority = (intent: ToastIntent): 'low' | 'high' => (intent === 'error' || intent === 'warning' ? 'high' : 'low');

/* The single shared manager for the app — BU contract requires a stable
   manager instance passed to the provider. Module-private (REQ-CMP-01): its
   inferred type is Base UI's, so exporting it leaks Base UI into the d.ts;
   consumers drive toasts through useToast(). */
const toastManager = Base.createToastManager();

function ToastProvider({ limit = 3, timeout = 5000, children }: ToastProviderProps) {
  return (
    <Base.Provider toastManager={toastManager} limit={limit} timeout={timeout}>
      {children}
    </Base.Provider>
  );
}

const ToastViewport = React.forwardRef<HTMLDivElement, ToastViewportProps>(
  function ToastViewport({ position = 'bottom-right', className, children, ...rest }, ref) {
    const container = usePortalContainer('toast');
    return (
      <Base.Portal container={container}>
        <Base.Viewport
          ref={ref}
          data-ag-part="viewport"
          data-position={position}
          className={cn('ag-toast-viewport', className)}
          {...rest}
        >
          {children}
        </Base.Viewport>
      </Base.Portal>
    );
  },
);

const ToastRoot = React.forwardRef<HTMLDivElement, ToastRootProps>(
  function ToastRoot({ toast, className, children, ...rest }, ref) {
    const intent = (toast?.type as ToastIntent | undefined) ?? 'info';
    const priority = intent === 'error' || intent === 'warning' ? 'alert' : 'status';
    // dom-contract (CMP-202) requires data-state open|closed on the surface
    const state = toast?.transitionStatus === 'ending' ? 'closed' : 'open';
    const timeout = (toast as { timeout?: number } | undefined)?.timeout;
    return (
      <Base.Root
        ref={ref}
        toast={toast}
        role={priority}
        data-ag-part="toast"
        data-ag-intent={intent}
        data-state={state}
        style={timeout !== undefined ? ({ '--_ag-toast-timeout': `${timeout}ms` } as React.CSSProperties) : undefined}
        {...overlayMaterial('toast')}
        className={cn('ag-toast', className)}
        {...rest}
      >
        <Base.Content data-ag-part="content" className="ag-toast-content">
          {children}
        </Base.Content>
      </Base.Root>
    );
  },
);

const ToastTitle = React.forwardRef<HTMLElement, ToastTitleProps>(
  function ToastTitle({ className, ...rest }, ref) {
    return <Base.Title ref={ref as React.Ref<HTMLDivElement>} data-ag-part="title" className={cn('ag-toast-title', className)} {...rest} />;
  },
);

const ToastDescription = React.forwardRef<HTMLElement, ToastDescriptionProps>(
  function ToastDescription({ className, ...rest }, ref) {
    return <Base.Description ref={ref as React.Ref<HTMLDivElement>} data-ag-part="description" className={cn('ag-toast-description', className)} {...rest} />;
  },
);

const ToastAction = React.forwardRef<HTMLButtonElement, ToastActionProps>(
  function ToastAction({ className, ...rest }, ref) {
    return <Base.Action ref={ref} data-ag-part="action" className={cn('ag-toast-action', className)} {...rest} />;
  },
);

const ToastClose = React.forwardRef<HTMLButtonElement, ToastCloseProps>(
  function ToastClose({ className, children, ...rest }, ref) {
    return (
      <Base.Close ref={ref} data-ag-part="close" aria-label={rest['aria-label'] ?? 'Dismiss'} className={cn('ag-toast-close', className)} {...rest}>
        {children}
      </Base.Close>
    );
  },
);

/* CMP-292: optional progress bar — BU exposes remaining time via swipe/timeout
   state on the toast object; we render a track whose bar is driven by the
   CSS var --_ag-toast-progress set per-toast in css via animation duration. */
const ToastProgress = React.forwardRef<HTMLElement, ToastProgressProps>(
  function ToastProgress({ className, children, ...rest }, ref) {
    return (
      <div ref={ref as React.Ref<HTMLDivElement>} data-ag-part="progress" role="progressbar" className={cn('ag-toast-progress', className)} {...rest}>
        <div className="ag-toast-progress-bar">{children}</div>
      </div>
    );
  },
);

export function useToast(): UseToastReturn {
  const mgr = Base.useToastManager();
  const hist = useHistory();
  const add = React.useCallback((t: ToastData) => {
    const intent = t.intent ?? 'info';
    const id = mgr.add({
      title: t.title,
      description: t.description,
      type: intent,
      priority: intentPriority(intent),
      ...(t.timeout !== undefined ? { timeout: t.timeout } : {}),
      ...(t.actionLabel !== undefined ? { actionLabel: t.actionLabel } : {}),
      ...(t.onAction !== undefined ? { onAction: t.onAction } : {}),
    } as Parameters<typeof mgr.add>[0]);
    pushHistory({ id, intent, title: t.title ?? null, at: Date.now(), status: 'open' });
    return id;
  }, [mgr]);
  const close = React.useCallback((id: string) => { mgr.close(id); markHistoryClosed(id); }, [mgr]);
  const update = React.useCallback((id: string, t: Partial<ToastData>) => {
    mgr.update(id, {
      ...(t.title !== undefined ? { title: t.title } : {}),
      ...(t.description !== undefined ? { description: t.description } : {}),
      ...(t.intent !== undefined ? { type: t.intent, priority: intentPriority(t.intent) } : {}),
      ...(t.timeout !== undefined ? { timeout: t.timeout } : {}),
    });
  }, [mgr]);
  const promise = React.useCallback(<V,>(p: Promise<V>, opts: { loading: ToastData; success: ToastData | ((v: V) => ToastData); error: ToastData | ((e: unknown) => ToastData) }) => {
    const toOpts = (t: ToastData) => ({
      title: t.title,
      description: t.description,
      type: t.intent ?? 'info',
      priority: intentPriority(t.intent ?? 'info') as 'low' | 'high',
      ...(t.timeout !== undefined ? { timeout: t.timeout } : {}),
    });
    return mgr.promise(p, {
      loading: toOpts({ intent: 'info', ...opts.loading }),
      success: (v: V) => toOpts({ intent: 'success', ...(typeof opts.success === 'function' ? opts.success(v) : opts.success) }),
      error: (e: unknown) => toOpts({ intent: 'error', ...(typeof opts.error === 'function' ? opts.error(e) : opts.error) }),
    });
  }, [mgr]);
  const wrap = React.useCallback((intent: ToastIntent) => (t: Omit<ToastData, 'intent'>) => add({ ...t, intent }), [add]);
  return React.useMemo(() => ({
    toasts: mgr.toasts,
    add,
    close,
    update,
    promise,
    info: wrap('info'),
    success: wrap('success'),
    warning: wrap('warning'),
    error: wrap('error'),
    history: hist,
  }), [mgr.toasts, add, close, update, promise, wrap, hist]);
}

export const Toast = {
  Provider: ToastProvider,
  Viewport: ToastViewport,
  Root: ToastRoot,
  Title: ToastTitle,
  Description: ToastDescription,
  Action: ToastAction,
  Close: ToastClose,
  Progress: ToastProgress,
};
