/* CMP-131 compat: GlassStepper (4.x) -> owned <ol aria-current="step"> (5.0).
   Per REQ-CMP-131 this is an owned renderer — it must NOT delegate to
   NumberField or any stepper input. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';

const DEP = 'DEP-C0298';

export interface GlassStepperProps extends React.OlHTMLAttributes<HTMLOListElement> {
  steps?: readonly React.ReactNode[];
  current?: number;
}

export function GlassStepper({ steps, current = 0, children, ...rest }: GlassStepperProps) {
  warnDeprecated(DEP);
  const items = steps ?? React.Children.toArray(children);
  return (
    <ol {...rest} data-ag-compat="GlassStepper" className="ag-steps">
      {items.map((s, i) => (
        <li key={i} aria-current={i === current ? 'step' : undefined} data-ag-part="item" data-ag-status={i === current ? 'current' : i < current ? 'complete' : 'upcoming'}>
          {s}
        </li>
      ))}
    </ol>
  );
}
