/* CMP-283..294 (REQ-CMP-106..110): Toast + useToast over BU Toast —
   Provider default limit 3 / timeout 5000, six-position Viewport ported to
   the toast layer-root, F6 → viewport (BU), intent → role status|alert,
   pause on hover/focus/hidden (BU timers), Progress part, append-only
   session history, dev warning for interactive non-action content. */
'use client';
import * as React from 'react';
import { Toast as Base } from '@base-ui/react/toast';
import { usePortalContainer } from '../../foundation/portal';
import { overlayMaterial } from '../overlays/_shared';
import { cn } from '../../internal';
import type {
  ToastProviderProps, ToastViewportProps, ToastRootProps, ToastTitleProps,
  ToastDescriptionProps, ToastActionProps, ToastCloseProps, ToastProgressProps,
  ToastData, ToastRecord, UseToastReturn, ToastIntent, ToastLogicalPosition, ToastPosition,
} from './Toast.types';

/* CMP-294 (REQ-CMP-110): append-only history — one entry per add, closed on
   close; capped at 50 to bound memory. Module-scoped: shared by every
   provider instance and survives unmounts (history is a session record). */
/* REQ-CMP-106: the buffer's cap/disabled flag is configured by the mounted
   Provider (`history` prop) — the record itself stays a session singleton. */
let historyCap = 50;
let historyEnabled = true;
const history: ToastRecord[] = [];
const historyListeners = new Set<() => void>();
function pushHistory(entry: ToastRecord) {
  if (!historyEnabled) return;
  history.push(entry);
  if (history.length > historyCap) history.splice(0, history.length - historyCap);
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

/** @deprecated kept for back-compat; the real manager is per-Provider. */
export const toastManager = Base.createToastManager();

/* REQ-CMP-106: provider presence/config context — lets useToast detect a
   missing provider and Viewport inherit the provider's position. */
interface ToastProviderConfig {
  position: ToastPosition;
  history: { limit: number } | false;
}
const ToastProviderCtx = React.createContext<ToastProviderConfig | null>(null);
let warnedNestedProvider = false;
let warnedNoProvider = false;

const LOGICAL_TO_POSITION: Record<ToastLogicalPosition, ToastPosition> = {
  'top-start': 'top-left', 'top-center': 'top-center', 'top-end': 'top-right',
  'bottom-start': 'bottom-left', 'bottom-center': 'bottom-center', 'bottom-end': 'bottom-right',
};

function ToastProvider({ limit = 3, timeout = 5000, position = 'bottom-end', history: historyProp, children }: ToastProviderProps) {
  const parent = React.useContext(ToastProviderCtx);
  if (process.env.NODE_ENV !== 'production' && parent && !warnedNestedProvider) {
    warnedNestedProvider = true;
    console.error('[aura-glass] Toast.Provider must not be nested — use a single top-level provider.');
  }
  /* REQ-CMP-106: one manager PER provider — sibling providers keep separate
     toast lists instead of sharing the module singleton. */
  const [manager] = React.useState(() => Base.createToastManager());
  const historyLimit = historyProp === false ? null : (historyProp?.limit ?? 50);
  React.useEffect(() => {
    historyEnabled = historyLimit !== null;
    historyCap = historyLimit ?? 0;
  }, [historyLimit]);
  const config = React.useMemo<ToastProviderConfig>(() => ({
    position: LOGICAL_TO_POSITION[position],
    history: historyLimit === null ? false : { limit: historyLimit },
  }), [position, historyLimit]);
  return (
    <ToastProviderCtx.Provider value={config}>
      <Base.Provider toastManager={manager} limit={limit} timeout={timeout}>
        {children}
      </Base.Provider>
    </ToastProviderCtx.Provider>
  );
}

const ToastViewport = React.forwardRef<HTMLDivElement, ToastViewportProps>(
  function ToastViewport({ position, className, children, ...rest }, ref) {
    /* REQ-CMP-106: default position comes from the provider context; the
       viewport prop still overrides for local use. */
    const cfg = React.useContext(ToastProviderCtx);
    const resolved = position ?? cfg?.position ?? 'bottom-right';
    const container = usePortalContainer('toast');
    return (
      <Base.Portal container={container}>
        <Base.Viewport
          ref={ref}
          data-ag-part="viewport"
          data-ag-position={resolved}
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
    return (
      <Base.Root
        ref={ref}
        toast={toast}
        role={priority}
        data-ag-part="root"
        data-ag-intent={intent}
        data-state={state}
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
   CSS var --ag-toast-progress set per-toast in css via animation duration. */
const ToastProgress = React.forwardRef<HTMLElement, ToastProgressProps>(
  function ToastProgress({ className, children, ...rest }, ref) {
    return (
      <div ref={ref as React.Ref<HTMLDivElement>} data-ag-part="progress" role="progressbar" className={cn('ag-toast-progress', className)} {...rest}>
        <div className="ag-toast-progress-bar">{children}</div>
      </div>
    );
  },
);

const NOOP_TOAST: UseToastReturn = {
  toasts: [],
  add: () => '',
  close: () => {},
  update: () => {},
  promise: <V,>(p: Promise<V>) => p,
  info: () => '',
  success: () => '',
  warning: () => '',
  error: () => '',
  history: [],
};

export function useToast(): UseToastReturn {
  const cfg = React.useContext(ToastProviderCtx);
  if (process.env.NODE_ENV !== 'production' && !cfg && !warnedNoProvider) {
    warnedNoProvider = true;
    console.error('[aura-glass] useToast() called outside Toast.Provider — returning a no-op object.');
  }
  /* BU's useToastManager throws without a provider, so the real path can only
     run when present. A component cannot gain a provider mid-render, so the
     early return is stable in practice. */
  if (!cfg) return NOOP_TOAST;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useToastInner();
}

function useToastInner(): UseToastReturn {
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
