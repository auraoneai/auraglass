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
  ToastData, ToastRecord, UseToastReturn, ToastIntent, ToastHistory,
} from './Toast.types';

const DEFAULT_HISTORY_CAP = 50;

const intentPriority = (intent: ToastIntent): 'low' | 'high' => (intent === 'error' || intent === 'warning' ? 'high' : 'low');

/* REQ-CMP-110: history lives in the Provider (React state — a NEW items array
   on every change so subscribers re-render). `history={false}` disables it and
   useToast returns history: null. The toast manager is also per-provider:
   creating it at module scope ran BU work on import (import-gate). */
interface HistoryStore {
  recordOpen: (entry: ToastRecord) => void;
  recordClosed: (id: string) => void;
  api: ToastHistory;
}
const ToastHistoryCtx = React.createContext<HistoryStore | null>(null);

function ToastProvider({ limit = 3, timeout = 5000, history = true, children }: ToastProviderProps) {
  const [toastManager] = React.useState(() => Base.createToastManager());
  const historyEnabled = history !== false;
  const historyCap = (typeof history === 'object' && history !== null && history.limit !== undefined)
    ? history.limit : DEFAULT_HISTORY_CAP;
  const [items, setItems] = React.useState<ToastRecord[]>([]);
  const itemsRef = React.useRef(items);
  itemsRef.current = items;
  const setItemsCapped = React.useCallback((next: ToastRecord[]) => {
    setItems(next.length > historyCap ? next.slice(next.length - historyCap) : next);
  }, [historyCap]);
  const store = React.useMemo<HistoryStore | null>(() => {
    if (!historyEnabled) return null;
    const unread = items.filter((i) => !i.read).length;
    return {
      recordOpen: (entry) => setItemsCapped([...itemsRef.current, entry]),
      recordClosed: (id) => setItems(itemsRef.current.map((e) => (e.id === id && e.status === 'open' ? { ...e, status: 'closed' as const } : e))),
      api: {
        items,
        unread,
        markRead: (id) => setItems(itemsRef.current.map((e) => (e.id === id ? { ...e, read: true } : e))),
        markAllRead: () => setItems(itemsRef.current.map((e) => (e.read ? e : { ...e, read: true }))),
        clear: () => setItems([]),
      },
    };
  }, [historyEnabled, items, setItemsCapped]);
  return (
    <ToastHistoryCtx.Provider value={store}>
      <Base.Provider toastManager={toastManager} limit={limit} timeout={timeout}>
        {children}
      </Base.Provider>
    </ToastHistoryCtx.Provider>
  );
}

/* REQ-CMP-110: rendered history list — ul/li with title/description/time. */
function ToastHistoryList({ className, children, ...rest }: React.HTMLAttributes<HTMLUListElement>) {
  const store = React.useContext(ToastHistoryCtx);
  const items = store?.api.items ?? [];
  return (
    <ul data-ag-part="history" className={cn('ag-toast-history', className)} {...rest}>
      {items.map((e) => (
        <li key={e.id} data-ag-intent={e.intent} {...(e.read ? {} : { 'data-unread': '' })}>
          <span className="ag-toast-history-title">{e.title}</span>
          {e.description !== undefined && e.description !== null ? <span className="ag-toast-history-desc">{e.description}</span> : null}
          <time className="ag-toast-history-time" dateTime={new Date(e.at).toISOString()}>{new Date(e.at).toLocaleTimeString()}</time>
          {children}
        </li>
      ))}
    </ul>
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
          data-ag-position={position}
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
        data-ag-part="root"
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
  const hist = React.useContext(ToastHistoryCtx);
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
    hist?.recordOpen({ id, intent, title: t.title ?? null, at: Date.now(), status: 'open', read: false });
    return id;
  }, [mgr, hist]);
  const close = React.useCallback((id: string) => { mgr.close(id); hist?.recordClosed(id); }, [mgr, hist]);
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
    history: hist?.api ?? null,
  }), [mgr.toasts, add, close, update, promise, wrap, hist]);
}

export const Toast = {
  History: ToastHistoryList,
  Provider: ToastProvider,
  Viewport: ToastViewport,
  Root: ToastRoot,
  Title: ToastTitle,
  Description: ToastDescription,
  Action: ToastAction,
  Close: ToastClose,
  Progress: ToastProgress,
};
