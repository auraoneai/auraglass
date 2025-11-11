"use client";
import React, { useEffect, useRef } from "react";
import { cn } from "../../lib/utilsComprehensive";

export interface Step {
  id: string;
  label: string;
  optional?: boolean;
}
export interface GlassStepperProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    keyof { steps: any; active: any; onChange: any }
  > {
  steps?: Step[];
  active?: string;
  onChange?: (id: string) => void;
}

const DEFAULT_STEPS: Step[] = [
  { id: "step1", label: "Step 1" },
  { id: "step2", label: "Step 2" },
  { id: "step3", label: "Step 3" },
];

export function GlassStepper({
  steps = DEFAULT_STEPS,
  active = DEFAULT_STEPS[0].id,
  onChange,
  className,
  ...htmlProps
}: GlassStepperProps) {
  const lastActiveRef = useRef<string | null>(null);

  useEffect(() => {
    lastActiveRef.current = active;
  }, [active]);

  return (
    <div
      data-glass-component
      className={cn("flex items-center glass-gap-3", className)}
      {...htmlProps}
    >
      {steps.map((s, i) => {
        const isActive = s.id === active;
        const wasJustActivated = isActive && lastActiveRef.current !== active;
        return (
          <div key={s.id} className="glass-flex glass-items-center glass-gap-3">
            <button
              type="button"
              aria-current={isActive ? "step" : undefined}
              aria-label={`Go to ${s.label}${isActive ? " (current step)" : ""}`}
              className={cn(
                "glass-px-3 glass-py-1.5 glass-radius-full glass-text-sm transition-all duration-200",
                "ring-1 ring-white/10 bg-glass-fill hover:-translate-y-0.5 glass-press glass-ripple",
                "glass-focus glass-touch-target glass-contrast-guard",
                isActive ? "glass-text-primary" : "glass-text-primary/80"
              )}
              onClick={(e) => onChange?.(s.id)}
            >
              <span
                className={cn(
                  "relative",
                  wasJustActivated && "glass-pulse-ring"
                )}
              >
                {s.label}
              </span>
            </button>
            {i < steps.length - 1 && (
              <div className='w-8 h-px glass-surface-subtle/15' />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default GlassStepper;
