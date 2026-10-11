/* CMP-131 compat: GlassNotificationItem (4.x) -> owned notification row (5.0).
   A Toast.Root needs a manager-created toast context, so the standalone 4.x
   item renders its own title/description/intent markup instead. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';

const DEP = 'DEP-C0284';

export interface GlassNotificationItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  message?: React.ReactNode;
  description?: React.ReactNode;
  type?: 'info' | 'success' | 'warning' | 'error' | string;
  intent?: 'info' | 'success' | 'warning' | 'danger' | string;
}

export function GlassNotificationItem({ title, message, description, type, intent, children, ...rest }: GlassNotificationItemProps) {
  warnDeprecated(DEP);
  const ag = intent ?? (type === 'error' ? 'danger' : type) ?? 'info';
  return (
    <div {...rest} data-ag-compat="GlassNotificationItem" data-ag-part="root" data-ag-intent={ag} role="status" className="ag-toast-item">
      {title ? <p data-ag-part="title" className="ag-toast-title">{title}</p> : null}
      {message || description ? <p data-ag-part="description" className="ag-toast-description">{message ?? description}</p> : null}
      {children}
    </div>
  );
}
