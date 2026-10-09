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
  type?: 'info' | 'success' | 'warning' | 'error';
  read?: boolean;
}

export interface GlassNotificationCenterProps {
  notifications?: readonly GlassNotification[];
  onMarkAllRead?: () => void;
  trigger?: React.ReactNode;
  className?: string;
}

export function GlassNotificationCenter({ notifications, onMarkAllRead, trigger, className }: GlassNotificationCenterProps) {
  warnDeprecated(DEP);
  return wrap('GlassNotificationCenter', (
    <Popover.Root>
      <Popover.Trigger>{trigger ?? 'Notifications'}</Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner>
          <Popover.Popup {...(className !== undefined ? { className } : {})}>
        <ul data-ag-compat="notification-list">
          {notifications?.map((n, i) => (
            <li key={n.id ?? i} data-ag-notification-type={n.type ?? 'info'}>
              {n.title}
              {n.message}
            </li>
          ))}
        </ul>
        {onMarkAllRead !== undefined ? (
          <button type="button" onClick={onMarkAllRead}>Mark all read</button>
        ) : null}
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  ));
}

export interface UseNotificationsCompatReturn {
  notifications: readonly GlassNotification[];
  addNotification: (n: GlassNotification) => string;
}

/** 4.x useNotifications() -> 5.0 useToast() provider history (REQ-CMP-110).
   `notifications` reads the provider's history items (read flag included);
   addNotification still routes through useToast().add. */
export function useNotifications(): UseNotificationsCompatReturn {
  const api = useToast();
  const ref = React.useRef(api);
  ref.current = api;
  React.useMemo(() => warnDeprecated(`${DEP}.hook`), []);
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
        type: e.intent,
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
