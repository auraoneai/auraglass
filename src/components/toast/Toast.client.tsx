/* CMP-283..294 (REQ-CMP-106..110): Toast + useToast over BU Toast —
   Provider default limit 3 / timeout 5000, six-position Viewport ported to
   the toast layer-root, F6 → viewport (BU), intent → role status|alert,
   pause on hover/focus/hidden (BU timers), Progress part, append-only
   session history, dev warning for interactive non-action content. */
'use client';
import * as React from 'react';
import { Toast as Base } from '@base-ui/react/toast';
import { useCmpPortalContainer as usePortalContainer } from '../overlays/_shared/portalContainer';
import { useOverlayLayer } from '../overlays/_shared/useOverlayLayer';
import { overlayMaterial } from '../overlays/_shared';
import { cn } from '../../internal';
import type {
  ToastProviderProps, ToastViewportProps, ToastRootProps, ToastTitleProps,
  ToastDescriptionProps, ToastActionProps, ToastCloseProps, ToastProgressProps,
  ToastData, ToastRecord, UseToastReturn, ToastIntent, ToastHistory, ToastPosition, ToastLogicalPosition, ToastOptions,
  ToastPartAttributes,
} from './Toast.types';

const DEFAULT_HISTORY_CAP = 50;

const intentPriority = (intent: ToastIntent): 'low' | 'high' => (intent === 'danger' ? 'high' : 'low');

/* REQ-CMP-110: history lives in the Provider (React state — a NEW items array
   on every change so subscribers re-render). `history={false}` disables it and
   useToast returns history: null. The toast manager is also per-provider:
   creating it at module scope ran BU work on import (import-gate). */
interface HistoryStore {
  /** Stamps `at`/`createdAt` itself when the open is recorded (event time),
      so no clock is read on the useToast() render path (REQ-PLAT-69). */
  recordOpen: (entry: Omit<ToastRecord, 'at' | 'createdAt'>) => void;
  recordClosed: (id: string) => void;
  api: ToastHistory;
}
const ToastHistoryCtx = React.createContext<HistoryStore | null>(null);

const ToastProviderCtx = React.createContext<{ position: ToastPosition; timeout: number } | null>(null);
const ToastViewportCtx = React.createContext<ToastPosition>('bottom-right');
let warnedNestedProvider = false;
let warnedNoProvider = false;
/* BU's useToastManager throws without its provider, so useToast() cannot call it
   conditionally (rules of hooks, REQ-CMP-24). The provider bridges the manager into
   this context instead; outside a provider it is null and useToast() is a no-op. */
type BaseToastManager = ReturnType<typeof Base.useToastManager>;
const ToastManagerCtx = React.createContext<BaseToastManager | null>(null);
function ToastManagerBridge({ children }: { children?: React.ReactNode }) {
  const mgr = Base.useToastManager();
  return <ToastManagerCtx.Provider value={mgr}>{children}</ToastManagerCtx.Provider>;
}
const LOGICAL_TO_POSITION: Record<ToastLogicalPosition, ToastPosition> = {
  'top-start': 'top-left', 'top-center': 'top-center', 'top-end': 'top-right',
  'bottom-start': 'bottom-left', 'bottom-center': 'bottom-center', 'bottom-end': 'bottom-right',
};
const POSITION_SWIPE: Record<ToastPosition, ('up' | 'down' | 'left' | 'right')[]> = {
  'top-left': ['left', 'up'], 'top-center': ['up'], 'top-right': ['right', 'up'],
  'bottom-left': ['left', 'down'], 'bottom-center': ['down'], 'bottom-right': ['right', 'down'],
};

function ToastProvider({ limit = 3, timeout = 5000, history = true, position = 'bottom-end', children }: ToastProviderProps) {
  const parent = React.useContext(ToastProviderCtx);
  // Module-level once-flag is written in an effect, not during render (REQ-CMP-24).
  const nested = parent !== null;
  React.useEffect(() => {
    if (process.env.NODE_ENV !== 'production' && nested && !warnedNestedProvider) {
      warnedNestedProvider = true;
      console.error('[aura-glass] Toast.Provider must not be nested — use a single top-level provider.');
    }
  }, [nested]);
  const config = React.useMemo(() => ({ position: LOGICAL_TO_POSITION[position], timeout }), [position, timeout]);
  const [toastManager] = React.useState(() => Base.createToastManager());
  const historyEnabled = history !== false;
  const historyCap = (typeof history === 'object' && history !== null && history.limit !== undefined)
    ? history.limit : DEFAULT_HISTORY_CAP;
  const [items, setItems] = React.useState<ToastRecord[]>([]);
  const setItemsCapped = React.useCallback((entry: ToastRecord) => {
    setItems(previous => { const next = [...previous, entry]; return historyCap <= 0 ? [] : next.slice(-historyCap); });
  }, [historyCap]);
  const store = React.useMemo<HistoryStore | null>(() => {
    if (!historyEnabled) return null;
    const unread = items.filter((i) => !i.read).length;
    return {
      recordOpen: (entry) => {
        const now = Date.now();
        setItemsCapped({ ...entry, createdAt: now, at: now });
      },
      recordClosed: (id) => setItems(previous => previous.map((e) => (e.id === id && e.status === 'open' ? { ...e, status: 'closed' as const } : e))),
      api: {
        items,
        unread,
        markRead: (id) => setItems(previous => previous.map((e) => (e.id === id ? { ...e, read: true } : e))),
        markAllRead: () => setItems(previous => previous.map((e) => (e.read ? e : { ...e, read: true }))),
        clear: () => setItems([]),
      },
    };
  }, [historyEnabled, items, setItemsCapped]);
  return (
    <ToastProviderCtx.Provider value={config}><ToastHistoryCtx.Provider value={store}>
      <Base.Provider toastManager={toastManager} limit={limit} timeout={timeout}>
        <ToastManagerBridge>{children}</ToastManagerBridge>
      </Base.Provider>
    </ToastHistoryCtx.Provider></ToastProviderCtx.Provider>
  );
}

/* REQ-CMP-110: rendered history list — ul/li with title/description/time. */
function ToastHistoryList({ className, children, ...rest }: ToastPartAttributes<React.HTMLAttributes<HTMLUListElement>>) {
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

function ToastViewport({ position, className, children, ref, ...rest }: ToastViewportProps & { ref?: React.Ref<HTMLDivElement> | undefined }) {
    const cfg = React.useContext(ToastProviderCtx);
    const resolved = position ?? cfg?.position ?? 'bottom-right';
    const container = usePortalContainer('toast');
    /* REQ-CMP-108: mirrors BU's hidden-page timer pause for the CSS layer. */
    const [paused, setPaused] = React.useState(false);
    React.useEffect(() => {
      const onVis = () => setPaused(document.hidden);
      onVis();
      document.addEventListener('visibilitychange', onVis);
      return () => document.removeEventListener('visibilitychange', onVis);
    }, []);
    return (
      <Base.Portal container={container}>
        <Base.Viewport
          ref={ref}
          data-ag-part="viewport"
          data-position={resolved}
          aria-label="Notifications"
          {...(paused ? { 'data-paused': '' } : {})}
          className={cn('ag-toast-viewport', className)}
          {...rest}
        >
          <ToastViewportCtx.Provider value={resolved}>{children}</ToastViewportCtx.Provider>
        </Base.Viewport>
      </Base.Portal>
    );
  }

function ToastRoot({ toast, limit, className, children, ref, ...rest }: ToastRootProps & { ref?: React.Ref<HTMLDivElement> | undefined }) {
    const intent = (toast?.type as ToastIntent | undefined) ?? 'info';
    const priority = toast?.priority === 'high' && intent === 'danger' ? 'alert' : 'status';
    // dom-contract (CMP-202) requires data-state open|closed on the surface
    const state = toast?.transitionStatus === 'ending' ? 'closed' : 'open';
    /* REQ-CMP-12: register the toast as a stack entry so Escape (topmost
       toast) routes through the LayerStack's single dispatcher. */
    const mgr = Base.useToastManager();
    const toastId = (toast as { id?: string } | undefined)?.id;
    const [rootEl, setRootEl] = React.useState<HTMLElement | null>(null);
    const refCb = React.useCallback((node: HTMLDivElement | null) => {
      setRootEl(node);
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
    }, [ref]);
    useOverlayLayer({
      kind: 'toast',
      modal: false,
      open: state === 'open',
      element: rootEl,
      onOpenChange: (o) => { if (!o && toastId) mgr.close(toastId); },
    });
    const timeout = (toast as { timeout?: number } | undefined)?.timeout;
    const position = React.useContext(ToastViewportCtx);
    const providerTimeout = React.useContext(ToastProviderCtx)?.timeout ?? 5000;
    const effectiveTimeout = timeout ?? providerTimeout;
    const style = { ...rest.style, ...(effectiveTimeout > 0
      ? { '--_ag-toast-timeout': `${effectiveTimeout}ms` }
      : { '--_ag-toast-progress-display': 'none' }) } as React.CSSProperties;
    React.useLayoutEffect(() => {
      if (!rootEl?.parentElement) return;
      const siblings = Array.from(rootEl.parentElement.children).filter((n) => n.classList.contains('ag-toast'));
      const index = Math.max(0, siblings.indexOf(rootEl));
      rootEl.style.setProperty('--toast-index', String(index));
      // S-30 root prop `limit`: hide this toast past the given stack depth (Base UI owns data-limited otherwise).
      if (limit !== undefined && index >= limit) rootEl.setAttribute('data-limited', '');
    }, [rootEl, mgr.toasts, limit]);
    return (
      <Base.Root
        ref={refCb}
        toast={toast}
        swipeDirection={POSITION_SWIPE[position]}
        role={priority}
        data-ag-part="toast"
        data-ag-intent={intent}
        data-state={state}
        {...overlayMaterial('toast')}
        className={cn('ag-toast', className)}
        {...rest}
        style={style}
      >
        <Base.Content data-ag-part="content" className="ag-toast-content">
          {children}
        </Base.Content>
      </Base.Root>
    );
  }

function ToastTitle({ className, ref, ...rest }: ToastTitleProps & { ref?: React.Ref<HTMLElement> | undefined }) {
    return <Base.Title ref={ref as React.Ref<HTMLDivElement>} data-ag-part="title" className={cn('ag-toast-title', className)} {...rest} />;
  }

function ToastDescription({ className, ref, ...rest }: ToastDescriptionProps & { ref?: React.Ref<HTMLElement> | undefined }) {
    return <Base.Description ref={ref as React.Ref<HTMLDivElement>} data-ag-part="description" className={cn('ag-toast-description', className)} {...rest} />;
  }

function ToastAction({ className, ref, ...rest }: ToastActionProps & { ref?: React.Ref<HTMLButtonElement> | undefined }) {
    return <Base.Action ref={ref} data-ag-part="action" className={cn('ag-toast-action', className)} {...rest} />;
  }

function ToastClose({ className, children, ref, ...rest }: ToastCloseProps & { ref?: React.Ref<HTMLButtonElement> | undefined }) {
    return (
      <Base.Close ref={ref} data-ag-part="close" aria-label={rest['aria-label'] ?? 'Dismiss'} className={cn('ag-toast-close', className)} {...rest}>
        {children}
      </Base.Close>
    );
  }

/* REQ-CMP-109: decorative intent icon — tinted by --_ag-toast-accent in css. */
function ToastIcon({ className, children, ...rest }: ToastPartAttributes<React.HTMLAttributes<HTMLSpanElement>>) {
  return (
    <span data-ag-part="icon" aria-hidden="true" className={cn('ag-toast-icon', className)} {...rest}>
      {children}
    </span>
  );
}

/* CMP-292: optional progress bar — BU exposes remaining time via swipe/timeout
   state on the toast object; we render a track whose bar is driven by the
   CSS var --_ag-toast-progress set per-toast in css via animation duration. */
function ToastProgress({ className, children, ref, ...rest }: ToastProgressProps & { ref?: React.Ref<HTMLElement> | undefined }) {
    return (
      <div ref={ref as React.Ref<HTMLDivElement>} data-ag-part="progress" aria-hidden="true" className={cn('ag-toast-progress', className)} {...rest}>
        <div className="ag-toast-progress-bar">{children}</div>
      </div>
    );
  }

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
  history: null,
  toast: () => '',
  dismiss: () => {},
};

export function useToast(): UseToastReturn {
  const cfg = React.useContext(ToastProviderCtx);
  const mgr = React.useContext(ToastManagerCtx);
  const hist = React.useContext(ToastHistoryCtx);
  const missing = !cfg || !mgr;
  React.useEffect(() => {
    if (process.env.NODE_ENV !== 'production' && missing && !warnedNoProvider) {
      warnedNoProvider = true;
      console.error('[aura-glass] useToast() called outside Toast.Provider — returning a no-op object.');
    }
  }, [missing]);
  if (!cfg || !mgr) return NOOP_TOAST;
  return toastApi(mgr, hist);
}

function toastApi(mgr: BaseToastManager, hist: React.ContextType<typeof ToastHistoryCtx>): UseToastReturn {
  const add = (t: ToastData) => {
    const intent = t.intent ?? 'info';
    /* REQ-CMP-108: a toast carrying an action never auto-dismisses — the user
       must get to decide. timeout explicit 0 (sticky) unless duration given. */
    const hasAction = t.actionLabel !== undefined || t.onAction !== undefined;
    const timeout = t.timeout !== undefined ? t.timeout : (hasAction ? 0 : undefined);
    const id = mgr.add({
      title: t.title,
      description: t.description,
      type: intent,
      priority: t.priority ?? intentPriority(intent),
      ...(timeout !== undefined ? { timeout } : {}),
      ...(t.actionLabel !== undefined ? { actionLabel: t.actionLabel } : {}),
      ...(t.onAction !== undefined ? { onAction: t.onAction } : {}),
    } as Parameters<typeof mgr.add>[0]);
    hist?.recordOpen({ id, intent: intent === 'error' ? 'danger' : intent, title: t.title ?? null, description: t.description, status: 'open', read: false });
    return id;
  };
  const close = (id: string) => { mgr.close(id); hist?.recordClosed(id); };
  const update = (id: string, t: Partial<ToastData>) => {
    mgr.update(id, {
      ...(t.title !== undefined ? { title: t.title } : {}),
      ...(t.description !== undefined ? { description: t.description } : {}),
      ...(t.intent !== undefined ? { type: t.intent, priority: intentPriority(t.intent) } : {}),
      ...((t.duration ?? t.timeout) !== undefined ? { timeout: t.duration ?? t.timeout } : {}),
      ...(t.priority !== undefined ? { priority: t.priority } : {}),
      ...(t.action !== undefined ? { actionLabel: t.action.label, onAction: t.action.onClick } : {}),
    });
  };
  const promise = <V,>(p: Promise<V>, opts: { loading: ToastData; success: ToastData | ((v: V) => ToastData); error: ToastData | ((e: unknown) => ToastData) }) => {
    const toOpts = (t: ToastData) => ({
      title: t.title,
      description: t.description,
      type: t.intent ?? 'info',
      priority: intentPriority(t.intent ?? 'info') as 'low' | 'high',
      ...((t.duration ?? t.timeout) !== undefined ? { timeout: t.duration ?? t.timeout } : {}),
      ...(t.priority !== undefined ? { priority: t.priority } : {}),
      ...(t.action !== undefined ? { actionLabel: t.action.label, onAction: t.action.onClick } : {}),
    });
    return mgr.promise(p, {
      loading: toOpts({ intent: 'info', ...opts.loading }),
      success: (v: V) => toOpts({ intent: 'success', ...(typeof opts.success === 'function' ? opts.success(v) : opts.success) }),
      error: (e: unknown) => toOpts({ intent: 'danger', ...(typeof opts.error === 'function' ? opts.error(e) : opts.error) }),
    });
  };
  const toast = (options: ToastOptions) => add({ ...options, timeout: options.duration, actionLabel: options.action?.label, onAction: options.action?.onClick });
  const dismiss = (id?: string) => { if (id !== undefined) close(id); else mgr.toasts.forEach(t => close(t.id)); };
  const wrap = (intent: ToastIntent) => (t: Omit<ToastData, 'intent'>) => add({ ...t, intent });
  return {
    toasts: mgr.toasts,
    add,
    close,
    toast,
    dismiss,
    update,
    promise,
    info: wrap('info'),
    success: wrap('success'),
    warning: wrap('warning'),
    error: wrap('danger'),
    history: hist?.api ?? null,
  };
}

/* S-30: the public compound is exactly the contract parts plus the pending
   History part; ToastIcon is not a contract part, so it stays a named export. */
export { ToastIcon };
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
