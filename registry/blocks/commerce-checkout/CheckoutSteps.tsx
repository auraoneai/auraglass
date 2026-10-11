// registry/blocks/commerce-checkout/CheckoutSteps.tsx — SURF-589 (AC-SURF-26),
// REQ-SURF-177. Step indicator: an ordered list, exactly one step
// aria-current="step"; completed steps are buttons that go back to them via
// onValueChange. Below 768 px of viewport width (or with `compact`) the rail
// collapses to a 'Step n of m' trigger that opens the list in a CMP Sheet.
'use client';
import * as React from 'react';
import { Sheet, VisuallyHidden } from 'aura-glass';
import type { CheckoutStepState } from './steps';

export interface CheckoutStepsProps {
  steps: readonly CheckoutStepState[];
  /** Id of the current step. */
  value: string;
  onValueChange: (id: string) => void;
  /** Force the compact (Sheet) layout; default: viewport below 768 px. */
  compact?: boolean | undefined;
}

export const COMPACT_QUERY = '(max-width: 767.98px)';

/** matchMedia subscription; the server snapshot is the wide layout. */
function useMatchMedia(query: string): boolean {
  const subscribe = React.useCallback((cb: () => void) => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return () => {};
    const mql = window.matchMedia(query);
    mql.addEventListener('change', cb);
    return () => mql.removeEventListener('change', cb);
  }, [query]);
  return React.useSyncExternalStore(
    subscribe,
    () => typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia(query).matches,
    () => false,
  );
}

function StepList({ steps, value, onValueChange }: Omit<CheckoutStepsProps, 'compact'>) {
  return (
    <ol className="ag-commerce-checkout__steps">
      {steps.map((s, i) => {
        const current = s.id === value;
        return (
          <li key={s.id} data-ag-part="step" data-state={s.status} aria-current={current ? 'step' : undefined}>
            {s.status === 'complete' && !current ? (
              <button type="button" className="ag-commerce-checkout__step-button" onClick={() => onValueChange(s.id)}>
                <span aria-hidden="true">{i + 1}. </span>{s.label}<VisuallyHidden> (completed)</VisuallyHidden>
              </button>
            ) : (
              <span><span aria-hidden="true">{i + 1}. </span>{s.label}</span>
            )}
          </li>
        );
      })}
    </ol>
  );
}

export function CheckoutSteps({ steps, value, onValueChange, compact }: CheckoutStepsProps) {
  const narrow = useMatchMedia(COMPACT_QUERY);
  const isCompact = compact ?? narrow;
  const [open, setOpen] = React.useState(false);
  const n = Math.max(1, steps.findIndex((s) => s.id === value) + 1);
  if (!isCompact) {
    return (
      <nav data-ag-part="steps" data-layout="inline" aria-label="Checkout steps">
        <StepList steps={steps} value={value} onValueChange={onValueChange} />
      </nav>
    );
  }
  return (
    <nav data-ag-part="steps" data-layout="sheet" aria-label="Checkout steps">
      <Sheet.Root open={open} onOpenChange={(o) => setOpen(o)} side="bottom">
        <Sheet.Trigger className="ag-commerce-checkout__step-trigger" data-ag-part="step-count">
          {`Step ${n} of ${steps.length}`}
        </Sheet.Trigger>
        <Sheet.Content>
          <Sheet.Header>
            <Sheet.Title>Checkout steps</Sheet.Title>
          </Sheet.Header>
          <Sheet.Body>
            <StepList steps={steps} value={value} onValueChange={(id) => { setOpen(false); onValueChange(id); }} />
          </Sheet.Body>
          <Sheet.Footer>
            <Sheet.Close>Close</Sheet.Close>
          </Sheet.Footer>
        </Sheet.Content>
      </Sheet.Root>
    </nav>
  );
}

export default CheckoutSteps;
