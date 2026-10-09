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
  ToastData, ToastRecord, ToastIntent, ToastPosition,
  UseToast, ToastOptions, ToastHistoryItem, Intent,
} from './Toast.types';

/* CMP-294 (REQ-CMP-110): append-only history — one entry per add, closed on
   close; capped at 50 to bound memory. Module-scoped: shared by every
   provider instance and survives unmounts (history is a session record). */
const HISTORY_CAP = 50;
let historyEnabled = true;
const history: ToastRecord[] = [];
const historyListeners = new Set<() => void>();
function pushHistory(entry: ToastRecord) {
  if (!historyEnabled) return;
  history.push(entry);
  if (history.length > HISTORY_CAP) history.splice(0, history.length - HISTORY_CAP);
  historyListeners.forEach((l) => l());
}
/* REQ-CMP-107: contract history surface — unread count + mark/clear ops. */
function historyMarkRead(id: string) {
  const e = history.find((h) => h.id === id);
  if (e && !e.read) { e.read = true; historyListeners.forEach((l) => l()); }
}
function historyMarkAllRead() {
  if (history.some((h) => !h.read)) { history.forEach((h) => { h.read = true; }); historyListeners.forEach((l) => l()); }
}
function historyClear() {
  if (history.length) { history.length = 0; historyListeners.forEach((l) => l()); }
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

let warnedHighNonDanger = false;
const intentPriority = (intent: ToastIntent): 'low' | 'high' =>
  (intent === 'danger' || intent === 'error' || intent === 'warning' ? 'high' : 'low');

/* The single shared manager for the app — BU contract requires a stable
   manager instance passed to the provider. */
export const toastManager = Base.createToastManager();

/* REQ-CMP-107: whether this provider records toast history — context so
   useToast can return history:null for a history={false} provider. */
const ToastHistoryOnCtx = React.createContext(true);

function ToastProvider({ limit = 3, timeout = 5000, history: historyProp, children }: ToastProviderProps) {
  const historyOn = historyProp !== false;
  React.useEffect(() => { historyEnabled = historyOn; }, [historyOn]);
  return (
    <ToastHistoryOnCtx.Provider value={historyOn}>
      <Base.Provider toastManager={toastManager} limit={limit} timeout={timeout}>
        {children}
      </Base.Provider>
    </ToastHistoryOnCtx.Provider>
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
          data-ag-layer-root="toast"
          aria-label="Notifications"
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
    /* REQ-CMP-107: role='alert' ONLY for high-priority danger toasts; other
       priorities announce politely. High-priority non-danger dev-warns once. */
    const high = (toast as { priority?: string } | null | undefined)?.priority === 'high';
    if (process.env.NODE_ENV !== 'production' && high && intent !== 'danger' && !warnedHighNonDanger) {
      warnedHighNonDanger = true;
      console.error('[aura-glass] Toast priority="high" only asserts for intent="danger"; use intent="danger" for alert semantics.');
    }
    const priority = high && intent === 'danger' ? 'alert' : 'status';
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

export function useToast(): ReturnType<UseToast> {
  const mgr = Base.useToastManager();
  const hist = useHistory();
  const historyOn = React.useContext(ToastHistoryOnCtx);
  /* REQ-CMP-107: the contract surface — toast/update/dismiss/promise/toasts/
     history. Intent is the contract union (incl 'danger'); BU carries the
     string in `type`. */
  const toast = React.useCallback((o: ToastOptions) => {
    const intent: ToastIntent = (o.intent as ToastIntent | undefined) ?? 'info';
    const { add: buAdd } = mgr;
    const id = buAdd({
      title: o.title,
      ...(o.description !== undefined ? { description: o.description } : {}),
      type: intent,
      priority: o.priority ?? intentPriority(intent),
      ...(o.duration !== undefined ? { timeout: o.duration } : {}),
      ...(o.action !== undefined ? { actionLabel: o.action.label, onAction: o.action.onClick } : {}),
    } as Parameters<typeof mgr.add>[0]);
    pushHistory({ id, intent, title: o.title ?? null, at: Date.now(), status: 'open', read: false });
    return id;
  }, [mgr]);
  const update = React.useCallback((id: string, o: Partial<ToastOptions>) => {
    mgr.update(id, {
      ...(o.title !== undefined ? { title: o.title } : {}),
      ...(o.description !== undefined ? { description: o.description } : {}),
      ...(o.intent !== undefined ? { type: o.intent, priority: o.priority ?? intentPriority(o.intent) } : {}),
      ...(o.priority !== undefined ? { priority: o.priority } : {}),
      ...(o.duration !== undefined ? { timeout: o.duration } : {}),
      ...(o.action !== undefined ? { actionLabel: o.action.label, onAction: o.action.onClick } : {}),
    });
  }, [mgr]);
  const dismiss = React.useCallback((id?: string) => {
    if (id === undefined) {
      mgr.toasts.forEach((tt: { id: string }) => { mgr.close(tt.id); markHistoryClosed(tt.id); });
    } else {
      mgr.close(id); markHistoryClosed(id);
    }
  }, [mgr]);
  const promise = React.useCallback(<V,>(p: Promise<V>, opts: { loading: ToastOptions; success: ToastOptions | ((v: V) => ToastOptions); error: ToastOptions | ((e: unknown) => ToastOptions) }) => {
    const toOpts = (o: ToastOptions, dflt: Intent) => ({
      title: o.title,
      ...(o.description !== undefined ? { description: o.description } : {}),
      type: o.intent ?? dflt,
      priority: (o.priority ?? intentPriority(o.intent ?? dflt)) as 'low' | 'high',
      ...(o.duration !== undefined ? { timeout: o.duration } : {}),
    });
    return mgr.promise(p, {
      loading: toOpts({ intent: 'info', ...opts.loading }, 'info'),
      success: (v: V) => toOpts({ intent: 'success', ...(typeof opts.success === 'function' ? opts.success(v) : opts.success) }, 'success'),
      error: (e: unknown) => toOpts({ intent: 'danger', ...(typeof opts.error === 'function' ? opts.error(e) : opts.error) }, 'danger'),
    });
  }, [mgr]);
  const toasts = React.useMemo(() => (mgr.toasts as Array<Record<string, unknown> & { id: string }>).map((tt) => ({
    id: tt.id,
    title: tt.title as React.ReactNode,
    ...(tt.description !== undefined ? { description: tt.description as React.ReactNode } : {}),
    intent: (tt.type as Intent | undefined) ?? 'neutral',
  })), [mgr.toasts]);
  const historyApi = React.useMemo(() => {
    if (!historyOn) return null;
    return {
      items: hist.map((h): ToastHistoryItem => ({
        id: h.id, title: h.title,
        ...(h.intent !== undefined ? { intent: h.intent as Intent } : {}),
        createdAt: h.at, read: !!h.read,
      })),
      unread: hist.filter((h) => !h.read).length,
      markRead: historyMarkRead,
      markAllRead: historyMarkAllRead,
      clear: historyClear,
    };
  }, [hist, historyOn]);
  return React.useMemo(() => ({ toast, update, dismiss, promise, toasts, history: historyApi }),
    [toast, update, dismiss, promise, toasts, historyApi]);
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
