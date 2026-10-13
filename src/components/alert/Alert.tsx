/* CMP-306: Alert — flat server banner. intent info|success|warning|danger
   (SC-24 → data-ag-intent); `urgent` escalates to role='alert', otherwise the
   banner is a polite role='status' region. parts
   [root, icon, title, description, actions]. */
import * as React from 'react';
import { cn } from '../../internal/index';
import { materialProps } from '../../material/index';

export interface AlertAction {
  label: string;
  onPress?: () => void;
  /** href renders a real <a> (serializable across the RSC boundary). */
  href?: string;
}

export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Status of the alert; sets the tint and the default icon. */
  intent?: 'info' | 'success' | 'warning' | 'danger';
  /** Urgent alerts announce assertively via role='alert'. */
  urgent?: boolean;
  /** 'inline' (default) hugs content; 'banner' stretches inline-size:100%. */
  appearance?: 'inline' | 'banner';
  /** Alert heading. */
  title?: React.ReactNode;
  /** Explicit description slot (children still render as description). */
  description?: React.ReactNode;
  /** Overrides the default status icon (decorative). */
  icon?: React.ReactNode;
  /** Serializable actions (label+href/onPress) or arbitrary nodes. */
  actions?: readonly AlertAction[] | React.ReactNode;
}

function renderActions(actions: readonly AlertAction[] | React.ReactNode): React.ReactNode {
  if (!Array.isArray(actions)) return actions as React.ReactNode;
  return (actions as readonly AlertAction[]).map((a) =>
    a.href ? (
      <a key={a.label} href={a.href} data-ag-part="action" className="ag-alert-action">
        {a.label}
      </a>
    ) : (
      <button key={a.label} type="button" data-ag-part="action" className="ag-alert-action" onClick={a.onPress}>
        {a.label}
      </button>
    ),
  );
}

export function Alert({
  intent = 'info',
  urgent,
  appearance = 'inline',
  title,
  description,
  icon,
  actions,
  children,
  className,
  ref,
  ...rest
}: AlertProps & {
  /** Ref to the rendered root element. */
  ref?: React.Ref<HTMLDivElement> | undefined }) {
  const mat = materialProps({ layer: 'content', content: 'content-raised' });
  const body = description ?? children;
  return (
    <div
      {...rest}
      {...mat}
      ref={ref}
      data-ag-part="root"
      data-ag-intent={intent}
      data-ag-appearance={appearance}
      role={urgent ? 'alert' : 'status'}
      className={cn('ag-alert', className)}
    >
      {icon ? (
        <span data-ag-part="icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <div className="ag-alert-body">
        {title ? (
          <p data-ag-part="title" className="ag-alert-title">
            {title}
          </p>
        ) : null}
        {body ? (
          <div data-ag-part="description">
            {body}
          </div>
        ) : null}
      </div>
      {actions ? (
        <div data-ag-part="actions" className="ag-alert-actions">
          {renderActions(actions)}
        </div>
      ) : null}
    </div>
  );
}
