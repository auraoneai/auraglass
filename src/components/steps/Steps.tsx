/* CMP-040: Steps — non-interactive stepper. <ol> of Steps.Item; per-item status
   complete|current|upcoming|error; aria-current='step' on the current item;
   complete/error carry visually hidden status text; horizontal at >=480px inline
   size, vertical below (CSS container query). Server component. */
import * as React from 'react';
import { cn } from '../../internal/index';
import { VisuallyHidden } from '../../primitives/VisuallyHidden';

export interface StepsProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export interface StepsItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  status?: 'complete' | 'current' | 'upcoming' | 'error';
  /** Overrides the ordinal indicator. */
  indicator?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
}

export function Steps({ className, children, ref, ...rest }: StepsProps & { ref?: React.Ref<HTMLDivElement> | undefined }) {
  return (
    <div {...rest} ref={ref} data-ag-part="root" className={cn('ag-steps', className)}>
      <ol data-ag-part="list" className="ag-steps-list">
        {children}
      </ol>
    </div>
  );
}

function StepsItem({
  status = 'upcoming',
  indicator,
  description,
  children,
  className,
  ...rest
}: StepsItemProps) {
  return (
    <li
      {...rest}
      data-ag-part="item"
      data-status={status}
      aria-current={status === 'current' ? 'step' : undefined}
      className={cn('ag-steps-item', className)}
    >
      <span data-ag-part="indicator" className="ag-steps-indicator" aria-hidden="true">
        {indicator}
      </span>
      <span data-ag-part="label" className="ag-steps-label">
        {children}
        {status === 'complete' ? <VisuallyHidden>complete</VisuallyHidden> : null}
        {status === 'error' ? <VisuallyHidden>error</VisuallyHidden> : null}
      </span>
      {description ? (
        <span data-ag-part="description" className="ag-steps-description">
          {description}
        </span>
      ) : null}
    </li>
  );
}

Steps.Item = StepsItem;
