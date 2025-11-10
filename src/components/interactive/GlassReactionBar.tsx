'use client';
import { cn } from "@/lib/utils";

import React from "react";
import { GlassButton } from "../button/GlassButton";

export interface Reaction {
  key: string;
  label: string;
  count: number;
}
export interface GlassReactionBarProps {
  reactions: Reaction[];
  onReact?: (key: string) => void;
  className?: string;
}

export function GlassReactionBar({
  reactions: incomingReactions = [],
  onReact,
  className,
}: GlassReactionBarProps) {
  const reactions = Array.isArray(incomingReactions) ? incomingReactions : [];

  return (
    <div data-glass-component className={className}>
      <div className="glass-flex glass-gap-2">
        {reactions.length === 0 ? (
          <span className="glass-text-sm glass-text-secondary">
            No reactions yet.
          </span>
        ) : (
          reactions.map((r: any) => (
            <GlassButton
              key={r.key}
              variant="ghost"
              size="sm"
              onClick={() => onReact?.(r.key)}
            >
              <span className="glass-mr-1">{r.label}</span>
              <span className='text-primary/70'>{r.count}</span>
            </GlassButton>
          ))
        )}
      </div>
    </div>
  );
}

export default GlassReactionBar;
