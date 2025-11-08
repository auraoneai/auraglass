import { cn } from '@/lib/utils';

import React from 'react';
import { GlassButton } from '../button/GlassButton';

export interface Reaction { key: string; label: string; count: number }
export interface GlassReactionBarProps { reactions: Reaction[]; onReact?: (key:string)=>void; className?: string }

export function GlassReactionBar({ reactions, onReact, className }: GlassReactionBarProps) {
  return (
    <div data-glass-component className={className}>
      <div className="flex gap-2">
        {reactions.map((r: any) => (
          <GlassButton key={r.key} variant="ghost" size="sm" onClick={(e) =>onReact?.(r.key)}>
            <span className="glass-mr-1">{r.label}</span>
            <span className="text-primary/70">{r.count}</span>
          </GlassButton>
        ))}
      </div>
    </div>
  );
}

export default GlassReactionBar;

