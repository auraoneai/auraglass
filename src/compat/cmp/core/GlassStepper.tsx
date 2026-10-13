/* REQ-CMP-131 compat: GlassStepper (4.x root, interactive flow steps) -> an
   owned <ol> with aria-current="step" (PRD-3 §7; `Steps` is not a 5.0 export,
   CC-CMP-04 proposes it for 5.1). This must never delegate to NumberField or
   any stepper input. warnDeprecated('DEP-C0282') fires at call time, once per
   page load, dev only. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';

const DEP = 'DEP-C0282';

export interface GlassStepperProps extends React.OlHTMLAttributes<HTMLOListElement> {
  steps?: readonly React.ReactNode[];
  /** zero-based index of the current step */
  current?: number;
}

/** @deprecated since 4.3.0, removed in 6.0.0. Use {@link GlassStepper}. */
export function GlassStepper({ steps, current = 0, children, className, ...rest }: GlassStepperProps) {
  warnDeprecated(DEP);
  const items = steps ?? React.Children.toArray(children);
  return (
    <ol
      {...rest}
      data-compat="GlassStepper"
      className={className ? `ag-steps ag-steps-list ${className}` : 'ag-steps ag-steps-list'}
    >
      {items.map((s, i) => {
        const status = i === current ? 'current' : i < current ? 'complete' : 'upcoming';
        const labelNode =
          typeof s === 'object' && s !== null && !React.isValidElement(s) && 'label' in s
            ? (s as { label?: React.ReactNode }).label
            : s;
        return (
          <li
            key={i}
            className="ag-steps-item"
            aria-current={i === current ? 'step' : undefined}
            data-ag-part="item"
            data-status={status}
            data-active={i === current ? '' : undefined}
            data-completed={i < current ? '' : undefined}
          >
            <span data-ag-part="indicator" className="ag-steps-indicator" aria-hidden="true" />
            <span data-ag-part="label" className="ag-steps-label">
              {labelNode}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
