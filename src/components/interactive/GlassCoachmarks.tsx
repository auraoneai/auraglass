'use client';
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
}

export function GlassCoachmarks({
  steps: incomingSteps = [],
  current = 0,
  onNext = () => {},
  onPrev = () => {},
  onClose = () => {},
}: GlassCoachmarksProps) {
  const steps = Array.isArray(incomingSteps) ? incomingSteps : [];
  const step = steps[current];
  if (!step) {
    return null;
  }
  return (
    <div data-glass-component className='fixed inset-0 z-[2000]'>
      <div
        className='absolute inset-0 glass-surface-dark/60'
        onClick={onClose}
      />
      <div className='absolute inset-x-0 bottom-10 glass-mx-auto glass-w-full max-w-xl'>
        <div className='glass-radius-2xl glass-surface-subtle/10 glass-border glass-border-white/20 glass-p-4 glass-mx-4 text-primary'>
          <div className='mb-3'>{step.content}</div>
          <div className="glass-flex glass-justify-between">
            <button
              className="glass-px-3 glass-py-1 glass-radius-md glass-surface-subtle/10 glass-focus glass-touch-target glass-contrast-guard"
              onClick={onPrev}
              disabled={current === 0}
            >
              Back
            </button>
            <div className="glass-gap-2">
              <button
                className="glass-px-3 glass-py-1 glass-radius-md glass-surface-subtle/10 glass-focus glass-touch-target glass-contrast-guard"
                onClick={onClose}
              >
                Close
              </button>
              <button
                className='glass-px-3 glass-py-1 glass-radius-md glass-surface-blue text-primary glass-focus glass-touch-target glass-contrast-guard'
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
