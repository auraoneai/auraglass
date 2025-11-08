import React, { useEffect, useRef } from 'react';
import { cn } from '../../lib/utilsComprehensive';

export interface Step { id: string; label: string; optional?: boolean }
export interface GlassStepperProps { steps: Step[]; active: string; onChange?: (id:string)=>void; className?: string }

export function GlassStepper({ steps, active, onChange, className }: GlassStepperProps) {
  const lastActiveRef = useRef<string | null>(null);

  useEffect(() => {
    lastActiveRef.current = active;
  }, [active]);

  return (
    <div data-glass-component className={cn('flex items-center glass-gap-3', className)}>
      {steps.map((s, i) => {
        const isActive = s.id === active;
        const wasJustActivated = isActive && lastActiveRef.current !== active;
        return (
          <div key={s.id} className="flex items-center gap-3">
            <button
              type="button"
              aria-current={isActive ? 'step' : undefined}
              className={cn(
                'glass-px-3 glass-py-1.5 glass-radius-full glass-text-sm transition-all duration-200',
                'ring-1 ring-white/10 bg-glass-fill hover:-translate-y-0.5 glass-press glass-ripple',
                isActive ? 'glass-text-primary' : 'glass-text-primary/80',
              )}
              onClick={(e) => onChange?.(s.id)}
            >
              <span className={cn('relative', wasJustActivated && 'glass-pulse-ring')}>
                {s.label}
              </span>
            </button>
            {i < steps.length - 1 && <div className="w-8 h-px glass-surface-subtle/15" />}
          </div>
        );
      })}
    </div>
  );
}

export default GlassStepper;
