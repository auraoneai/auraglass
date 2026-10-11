/* CMP-306: Alert — flat server banner. intent info|success|warning|danger
   (SC-24 → data-ag-intent); `urgent` escalates to role='alert', otherwise the
   banner is a polite role='status' region. parts
   [root, icon, title, description, actions]. */
import * as React from 'react';
import { cn } from '../../internal/index';

export interface AlertAction {
  label: string;
  onPress?: () => void;
  href?: string;
}

export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  intent?: 'info' | 'success' | 'warning' | 'danger';
  /** Urgent alerts announce assertively via role='alert'. */
  urgent?: boolean;
  title?: React.ReactNode;
  icon?: React.ReactNode;
  actions?: readonly AlertAction[];
}

export function Alert({
  intent = 'info',
  urgent,
  title,
  icon,
  actions,
  children,
  className,
  ref,
  ...rest
}: AlertProps & { ref?: React.Ref<HTMLDivElement> | undefined }) {
  return (
    <div
      {...rest}
      ref={ref}
      data-ag-part="root"
      data-ag-intent={intent}
      role={urgent ? 'alert' : 'status'}
      className={cn('ag-alert', className)}
    >
      {icon ? (
        <span data-ag-part="icon" className="ag-alert-icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <div className="ag-alert-body">
        {title ? (
          <p data-ag-part="title" className="ag-alert-title">
            {title}
          </p>
        ) : null}
        {children ? (
          <div data-ag-part="description" className="ag-alert-description">
            {children}
          </div>
        ) : null}
      </div>
      {actions && actions.length > 0 ? (
        <div data-ag-part="actions" className="ag-alert-actions">
          {actions.map((a) => (
            <button key={a.label} type="button" data-ag-part="action" className="ag-alert-action" onClick={a.onPress}>
              {a.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
