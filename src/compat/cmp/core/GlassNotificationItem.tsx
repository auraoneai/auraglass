/* REQ-CMP-131 compat: GlassNotificationItem (4.x) -> owned notification row (5.0).
   A Toast.Root needs a manager-created toast context, so the standalone 4.x
   item renders its own title/description/intent markup instead.
   warnDeprecated('DEP-C0284') fires at call time, once per page load, dev only. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';

const DEP = 'DEP-C0284';

export interface GlassNotificationItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  message?: React.ReactNode;
  description?: React.ReactNode;
  /** 4.x notification type; `error` maps to the 5.0 `danger` intent */
  type?: 'info' | 'success' | 'warning' | 'error';
  intent?: 'info' | 'success' | 'warning' | 'danger';
}

export function GlassNotificationItem({ title, message, description, type, intent, children, ...rest }: GlassNotificationItemProps) {
  warnDeprecated(DEP);
  const ag = intent ?? (type === 'error' ? 'danger' : type) ?? 'info';
  const body = message ?? description;
  return (
    <div {...rest} data-ag-compat="GlassNotificationItem" data-ag-part="root" data-ag-intent={ag} role="status">
      {title ? <p data-ag-part="title">{title}</p> : null}
      {body ? <p data-ag-part="description">{body}</p> : null}
      {children}
    </div>
  );
}
