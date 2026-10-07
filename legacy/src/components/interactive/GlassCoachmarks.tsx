"use client";
import React from "react";
import { cn } from "../../lib/utilsComprehensive";

export interface CoachmarkStep {
  id: string;
  content: React.ReactNode;
}
export interface GlassCoachmarksProps {
  steps: CoachmarkStep[];
  current: number;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
  className?: string;
  "data-testid"?: string;
}

export function GlassCoachmarks({
  steps: incomingSteps = [],
  current = 0,
  onNext = () => {},
  onPrev = () => {},
  onClose = () => {},
  className,
  "data-testid": dataTestId,
  ...props
}: GlassCoachmarksProps) {
  const steps = Array.isArray(incomingSteps) ? incomingSteps : [];
  const step = steps[current];
  if (!step) {
    return null;
  }
  return (
    <div
      data-glass-component
      className={cn("fixed inset-0 z-[2000]", className)}
      data-testid={dataTestId}
      {...props}
    >
      <div
        className="glass-absolute glass-inset-0 glass-surface-dark/45"
        onClick={onClose}
      />
      <div className="glass-absolute glass-inset-x-0 glass-bottom-10 glass-mx-auto glass-w-full glass-max-w-xl">
        <div className="glass-radius-2xl glass-surface-overlay glass-border glass-border-subtle glass-p-4 glass-mx-4 glass-text-primary glass-contrast-guard">
          <div className="glass-mb-3">{step.content}</div>
          <div className="glass-flex glass-flex-wrap glass-items-center glass-justify-between glass-gap-2">
            <button
              type="button"
              className="glass-px-3 glass-py-1 glass-radius-md glass-surface-subtle/10 glass-focus glass-touch-target glass-contrast-guard"
              onClick={onPrev}
              disabled={current === 0}
            >
              Back
            </button>
            <div className="glass-flex glass-flex-wrap glass-gap-2">
              <button
                type="button"
                className="glass-px-3 glass-py-1 glass-radius-md glass-surface-subtle/10 glass-focus glass-touch-target glass-contrast-guard"
                onClick={onClose}
              >
                Close
              </button>
              <button
                type="button"
                className="glass-px-3 glass-py-1 glass-radius-md glass-surface-blue glass-text-primary glass-focus glass-touch-target glass-contrast-guard"
                onClick={onNext}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GlassCoachmarks;
