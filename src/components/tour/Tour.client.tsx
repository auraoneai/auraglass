/* CMP-320: Tour — seeded from GlassCoachmarks (absorbs GlassSpotlight). steps
   [{target: selector|RefObject, title, description}]; each step renders as a
   non-modal overlay card anchored to its target via an element anchor (BU
   positioner). parts [root, step]. */
'use client';
import * as React from 'react';
import { cn } from '../../internal/index';
import { Popover } from '../popover';
import { Button } from '../button';
import { FocusScope } from '../../primitives/FocusScope';

export interface TourStepDef {
  target: string | React.RefObject<Element | null>;
  title: React.ReactNode;
  description?: React.ReactNode;
}

export interface TourProps extends React.HTMLAttributes<HTMLDivElement> {
  steps?: readonly TourStepDef[] | undefined;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, details: unknown) => void;
  step?: number;
  defaultStep?: number;
  onStepChange?: (index: number) => void;
  /** Labels for the nav buttons. */
  labels?: { next?: string; prev?: string; done?: string; skip?: string; dismiss?: string };
}

function resolveTarget(t: TourStepDef['target']): Element | null {
  if (typeof t === 'string') return document.querySelector(t);
  return t.current ?? null;
}

export const Tour = {
  Root: function Root({
    steps = [],
    open,
    defaultOpen,
    onOpenChange,
    step,
    defaultStep = 0,
    onStepChange,
    labels,
    className,
    ref,
    ...rest
  }: TourProps & { ref?: React.Ref<HTMLDivElement> | undefined }) {
    const [uncontrolledStep, setUncontrolledStep] = React.useState(defaultStep);
    const index = Math.min(steps.length - 1, Math.max(0, step ?? uncontrolledStep));
    const current = steps[index];
    const [anchor, setAnchor] = React.useState<Element | null>(null);

    React.useLayoutEffect(() => {
      if (!current) return;
      setAnchor(resolveTarget(current.target));
    }, [index, current]);

    const goto = (i: number) => {
      const clamped = Math.min(steps.length - 1, Math.max(0, i));
      if (step === undefined) setUncontrolledStep(clamped);
      onStepChange?.(clamped);
    };
    const [internalOpen, setInternalOpen] = React.useState<boolean>(defaultOpen ?? false);
  const isOpen = open ?? internalOpen;
  // REQ-CMP-128: capture the element that had focus when the tour opened and
  // restore it on close (any reason).
  const restoreRef = React.useRef<HTMLElement | null>(null);
  const wasOpenRef = React.useRef(isOpen);
  React.useLayoutEffect(() => {
    if (isOpen && !wasOpenRef.current) {
      restoreRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    } else if (!isOpen && wasOpenRef.current && restoreRef.current) {
      restoreRef.current.focus();
      restoreRef.current = null;
    }
    wasOpenRef.current = isOpen;
  }, [isOpen]);
  const handleOpenChange = (next: boolean, details: unknown) => {
    if (open === undefined) setInternalOpen(next);
    onOpenChange?.(next, details);
  };
  const dismiss = (reason = 'dismiss') => {
    if (open === undefined) setInternalOpen(false);
    onOpenChange?.(false, { reason });
  };

    if (!current) return null;
    return (
      <div {...rest} ref={ref} data-ag-part="root" className={cn('ag-tour', className)}>
        <Popover.Root open={isOpen} onOpenChange={handleOpenChange}>
          <Popover.Portal>
            <Popover.Positioner anchor={anchor ?? undefined} sideOffset={8} collisionPadding={8} className="ag-tour-positioner">
              <Popover.Popup>
                <FocusScope autoFocus={false} restoreFocus={false}>
                <TourStep
                  title={current.title}
                  description={current.description}
                  index={index}
                  total={steps.length}
                  labels={labels}
                  onPrev={index > 0 ? () => goto(index - 1) : undefined}
                  onNext={() => goto(index + 1)}
                  onDone={() => dismiss('done')}
                  onSkip={() => dismiss('skip')}
                />
                </FocusScope>
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>
      </div>
    );
  },
  Step: function Step({
    className,
    ref,
    ...rest
  }: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> | undefined }) {
    return <div {...rest} ref={ref} data-ag-part="step" className={cn('ag-tour-step', className)} />;
  },
};

interface TourStepProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  index: number;
  total: number;
  labels?: TourProps['labels'];
  onPrev?: (() => void) | undefined;
  onNext: () => void;
  onDone: () => void;
  onSkip?: () => void;
}

function TourStep({ title, description, index, total, labels, onPrev, onNext, onDone, onSkip }: TourStepProps) {
  const last = index === total - 1;
  const titleId = React.useId();
  return (
    <Tour.Step role="dialog" aria-labelledby={titleId}>
      <div className="ag-tour-step-count" aria-hidden="true">
        {index + 1} / {total}
      </div>
      <h4 className="ag-tour-title" id={titleId}>
        {title}
      </h4>
      {description ? <p className="ag-tour-description">{description}</p> : null}
      <div className="ag-tour-actions">
        {onSkip ? (
          <Button variant="clear" className="ag-tour-skip" onClick={onSkip}>
            {labels?.skip ?? 'Skip'}
          </Button>
        ) : null}
        {onPrev ? (
          <Button variant="clear" className="ag-tour-prev" onClick={onPrev}>
            {labels?.prev ?? 'Back'}
          </Button>
        ) : null}
        {last ? (
          <Button className="ag-tour-done" onClick={onDone}>
            {labels?.done ?? 'Done'}
          </Button>
        ) : (
          <Button className="ag-tour-next" onClick={onNext}>
            {labels?.next ?? 'Next'}
          </Button>
        )}
      </div>
    </Tour.Step>
  );
}
