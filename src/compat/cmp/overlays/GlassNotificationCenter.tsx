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
        <ul data-compat="notification-list">
          {notifications?.map((n, i) => (
            <li key={n.id ?? i} data-notification-type={n.type ?? 'info'}>
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

/** 4.x useNotifications().addNotification -> 5.0 useToast().add with history. */
export function useNotifications(): UseNotificationsCompatReturn {
  const api = useToast();
  const ref = React.useRef(api);
  ref.current = api;
  const pushed = React.useRef<GlassNotification[]>([]);
  React.useMemo(() => warnDeprecated(`${DEP}.hook`), []);
  /* Stable return — see useToast.tsx; a fresh object each render loops forever
     for 4.x callers that hold it in effect deps. */
  return React.useMemo(() => ({
    notifications: pushed.current,
    addNotification: (n) => {
      pushed.current = [...pushed.current, n];
      const t: ToastData = {
        ...(n.title !== undefined ? { title: n.title } : {}),
        ...(n.message !== undefined ? { description: n.message } : {}),
      };
      return ref.current.add(t);
    },
  }), []);
}
