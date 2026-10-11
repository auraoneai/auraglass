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

export function GlassStepper({ steps, current = 0, children, className, ...rest }: GlassStepperProps) {
  warnDeprecated(DEP);
  const items = steps ?? React.Children.toArray(children);
  return (
    <ol {...rest} data-ag-compat="GlassStepper" className={className ? `ag-steps ${className}` : 'ag-steps'}>
      {items.map((s, i) => (
        <li
          key={i}
          aria-current={i === current ? 'step' : undefined}
          data-ag-part="item"
          data-ag-status={i === current ? 'current' : i < current ? 'complete' : 'upcoming'}
        >
          {s}
        </li>
      ))}
    </ol>
  );
}
