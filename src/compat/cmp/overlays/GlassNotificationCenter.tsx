/* CMP-341 compat: GlassNotificationCenter + useNotifications (4.x) -> Popover + Toast history (5.0).
   warnDeprecated fires at call time, once per page load per symbol; unmappable
   props drop with a single warning; never throws. Mapping per §10.2/metas. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Popover } from '../../../components/popover';
import { useToast } from '../../../components/toast';
import type { ToastData } from '../../../components/toast';
import { __compatWrap as wrap } from './_shared';

const DEP = 'DEP-C0119';

export interface GlassNotification {
  id?: string;
  title?: React.ReactNode;
  message?: React.ReactNode;
  description?: React.ReactNode;
  time?: React.ReactNode;
  type?: 'info' | 'success' | 'warning' | 'error';
  read?: boolean;
  unread?: boolean;
}

export interface GlassNotificationCenterProps {
  notifications?: readonly GlassNotification[];
  onMarkAllRead?: () => void;
  trigger?: React.ReactNode;
  className?: string;
}

/** @deprecated since 4.2.0, removed in 6.0.0. Use {@link Popover}. */
export function GlassNotificationCenter({ notifications, onMarkAllRead, trigger, className }: GlassNotificationCenterProps) {
  warnDeprecated(DEP);
  const hasNotifications = Boolean(notifications && notifications.length > 0);
  const listContent = (
    <div className="ag-notification-center-panel" data-ag-part="panel">
      <ul
        data-compat="notification-list"
        className="ag-notification-list"
        style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 'var(--ag-space-2, 0.5rem)' }}
      >
        {notifications?.map((n, i) => {
          const isUnread = n.unread ?? (n.read !== undefined ? !n.read : false);
          const body = n.message ?? n.description;
          return (
            <li
              key={n.id ?? i}
              className="ag-notification-item"
              data-notification-type={n.type ?? 'info'}
              data-unread={isUnread ? '' : undefined}
              data-read={!isUnread ? '' : undefined}
              style={{ display: 'grid', gap: 'var(--ag-space-1, 0.25rem)' }}
            >
              <div
                className="ag-notification-item-header"
                style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 'var(--ag-space-2, 0.5rem)' }}
              >
                {n.title !== undefined ? <strong className="ag-notification-title">{n.title}</strong> : null}
                {n.time !== undefined ? <span className="ag-notification-time">{n.time}</span> : null}
              </div>
              {body !== undefined ? <div className="ag-notification-message">{body}</div> : null}
            </li>
          );
        })}
      </ul>
      {onMarkAllRead !== undefined ? (
        <button type="button" onClick={onMarkAllRead}>Mark all read</button>
      ) : null}
    </div>
  );
  return wrap(
    'GlassNotificationCenter',
    <div
      className={className ? `ag-notification-center ${className}` : 'ag-notification-center'}
      style={{ display: 'grid', gap: 'var(--ag-space-2, 0.5rem)' }}
    >
      <Popover.Root>
        <Popover.Trigger>{trigger ?? 'Notifications'}</Popover.Trigger>
        {!hasNotifications ? (
          <Popover.Content {...(className !== undefined ? { className } : {})}>
            {listContent}
          </Popover.Content>
        ) : null}
      </Popover.Root>
      {hasNotifications ? listContent : null}
    </div>,
  );
}

export interface UseNotificationsCompatReturn {
  notifications: readonly GlassNotification[];
  addNotification: (n: GlassNotification) => string;
}

/** 4.x useNotifications() -> 5.0 useToast() provider history (REQ-CMP-110).
   `notifications` reads the provider's history items (read flag included).
   History is opt-in in 5.0 (REQ-CMP-106: `<Toast.Provider history>`; the
   default `false` leaves it null and the list empty) and holds toasts once
   they are dismissed or expire. addNotification still routes through
   useToast().add.
   @deprecated since 4.2.0, removed in 6.0.0. Use {@link useToast}. */
export function useNotifications(): UseNotificationsCompatReturn {
  const api = useToast();
  const ref = React.useRef(api);
  ref.current = api;
  React.useMemo(() => warnDeprecated('DEP-C0122'), []);
  /* Stable return — 4.x callers hold it in effect deps, so a fresh object on
     every history change loops addNotification forever. `notifications` is a
     getter: the object identity never changes but each read maps the latest
     provider history (new items array per mutation). */
  return React.useMemo<UseNotificationsCompatReturn>(() => ({
    get notifications() {
      return (ref.current.history?.items ?? []).map((e) => ({
        id: e.id,
        title: e.title,
        message: e.description,
        type: e.intent === 'danger' ? 'error' as const : e.intent === 'neutral' ? 'info' as const : e.intent,
        read: e.read,
      }));
    },
    addNotification: (n: GlassNotification) => {
      const t: ToastData = {
        ...(n.title !== undefined ? { title: n.title } : {}),
        ...(n.message !== undefined ? { description: n.message } : {}),
        ...(n.type !== undefined ? { intent: n.type } : {}),
      };
      return ref.current.add(t);
    },
  }), []);
}
