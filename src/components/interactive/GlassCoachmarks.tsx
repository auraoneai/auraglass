'use client';

import React from 'react';
import { cn } from '../../lib/utilsComprehensive';

export interface CoachmarkStep { id: string; content: React.ReactNode }
export interface GlassCoachmarksProps { steps: CoachmarkStep[]; current: number; onNext: ()=>void; onPrev: ()=>void; onClose: ()=>void }

export function GlassCoachmarks({ steps, current, onNext, onPrev, onClose }: GlassCoachmarksProps) {
  const step = steps[current];
  if (!step) return null;
  return (
    <div className="fixed inset-0 z-[2000]">
      <div className="absolute inset-0 glass-surface-dark/60" onClick={onClose} />
      <div className="absolute inset-x-0 bottom-10 mx-auto w-full max-w-xl">
        <div className="glass-radius-2xl glass-surface-subtle/10 border border-white/20 p-4 mx-4 text-primary">
          <div className="mb-3">{step.content}</div>
          <div className="flex justify-between">
            <button className="px-3 py-1 glass-radius-md glass-surface-subtle/10" onClick={onPrev} disabled={current===0}>Back</button>
            <div className="gap-2">
              <button className="px-3 py-1 glass-radius-md glass-surface-subtle/10" onClick={onClose}>Close</button>
              <button className="px-3 py-1 glass-radius-md glass-surface-blue text-primary" onClick={onNext}>Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GlassCoachmarks;

