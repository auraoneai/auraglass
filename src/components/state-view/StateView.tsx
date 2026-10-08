/* CMP-039: StateView internals for EmptyState / ErrorState / LoadingState.
   Server-first leaf components (no hooks, no effects): title, description, icon,
   actions. ErrorState escalates to role='alert' only when `urgent`; LoadingState
   is aria-busy with a VisuallyHidden role='status' live region (default 'Loading'). */
import * as React from 'react';
import { cn } from '../../internal/index';
import { VisuallyHidden } from '../../primitives/VisuallyHidden';

export interface StateViewAction {
  label: string;
  onPress?: () => void;
  href?: string;
}

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actions?: readonly StateViewAction[];
}

export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actions?: readonly StateViewAction[];
  /** When true, escalates to role='alert'. Default renders a neutral region. */
  urgent?: boolean;
}

export interface LoadingStateProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visible description next to the indicator. */
  description?: string;
  icon?: React.ReactNode;
  /** Live-region text; defaults to 'Loading'. */
  label?: string;
}

function Actions({ actions }: { actions: readonly StateViewAction[] }) {
  return (
    <div data-ag-part="actions" className="ag-state-view-actions">
      {actions.map((a) =>
        a.href ? (
          <a key={a.label} data-ag-part="action" className="ag-state-view-action" href={a.href} onClick={a.onPress}>
            {a.label}
          </a>
        ) : (
          <button
            key={a.label}
            data-ag-part="action"
            className="ag-state-view-action"
            type="button"
            onClick={a.onPress}
          >
            {a.label}
          </button>
        ),
      )}
    </div>
  );
}

interface BaseProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actions?: readonly StateViewAction[];
  role?: 'status' | 'alert' | undefined;
  ref?: React.Ref<HTMLDivElement> | undefined;
}

function Base({ title, description, icon, actions, role, className, ...rest }: BaseProps) {
  return (
    <div
      {...rest}
      data-ag-part="root"
      role={role}
      className={cn('ag-state-view', className)}
    >
      {icon ? (
        <span data-ag-part="icon" className="ag-state-view-icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <h3 data-ag-part="title" className="ag-state-view-title">
        {title}
      </h3>
      {description ? (
        <p data-ag-part="description" className="ag-state-view-description">
          {description}
        </p>
      ) : null}
      {actions && actions.length > 0 ? <Actions actions={actions} /> : null}
    </div>
  );
}

export function EmptyState({ className, ref, ...props }: EmptyStateProps & { ref?: React.Ref<HTMLDivElement> | undefined }) {
  return <Base {...props} ref={ref} role="status" className={className} />;
}

export function ErrorState({ urgent, ref, ...props }: ErrorStateProps & { ref?: React.Ref<HTMLDivElement> | undefined }) {
  return <Base {...props} ref={ref} role={urgent ? 'alert' : undefined} />;
}

export function LoadingState({
  description,
  icon,
  label = 'Loading',
  className,
  ref,
  ...rest
}: LoadingStateProps & { ref?: React.Ref<HTMLDivElement> | undefined }) {
  return (
    <div {...rest} ref={ref} data-ag-part="root" aria-busy="true" className={cn('ag-state-view', className)}>
      {icon ? (
        <span data-ag-part="icon" className="ag-state-view-icon ag-state-view-spinner" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      {description ? (
        <p data-ag-part="description" className="ag-state-view-description">
          {description}
        </p>
      ) : null}
      <VisuallyHidden>
        <span data-ag-part="status" role="status">
          {label}
        </span>
      </VisuallyHidden>
    </div>
  );
}
