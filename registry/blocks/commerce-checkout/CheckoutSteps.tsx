// registry/blocks/commerce-checkout/CheckoutSteps.tsx — SURF-589 (AC-SURF-26).
// Step indicator rail: ordered list, current step aria-current="step",
// completed steps marked done. Pure render — step state arrives by props.
import type { CheckoutStep } from './steps';

export interface CheckoutStepsProps {
  steps: CheckoutStep[];
  current: CheckoutStep['id'];
}

export function CheckoutSteps({ steps, current }: CheckoutStepsProps) {
  const idx = steps.findIndex((s) => s.id === current);
  return (
    <nav data-ag-part="steps" aria-label="checkout steps">
      <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', gap: 12 }}>
        {steps.map((s, i) => (
          <li
            key={s.id}
            data-ag-part="step"
            data-state={i === idx ? 'active' : i < idx ? 'done' : 'todo'}
            aria-current={i === idx ? 'step' : undefined}
          >
            {s.label}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default CheckoutSteps;
