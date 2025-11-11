'use client';
import React from "react";
import { OptimizedGlass } from "../../primitives";
import { cn } from "../../lib/utilsComprehensive";

export interface MentionItem {
  id: string;
  label: string;
  meta?: string;
}
export interface GlassMentionListProps {
  items: MentionItem[];
  onSelect: (id: string) => void;
  className?: string;
}

export function GlassMentionList({
  items: incomingItems = [],
  onSelect = () => {},
  className,
}: GlassMentionListProps) {
  const items = Array.isArray(incomingItems) ? incomingItems : [];

  return (
    <OptimizedGlass
      data-glass-component
      elevation={"level2"}
      className={cn(
        "glass-radius-lg glass-p-1 border border-white/15",
        className
      )}
    >
      <ul className='max-h-60 overflow-auto'>
        {items.length === 0 ? (
          <li className='glass-text-sm glass-text-secondary glass-py-3 text-center'>
            No mentions available.
          </li>
        ) : (
          items.map((it: any) => (
            <li key={it.id}>
              <button
                onClick={() => onSelect(it.id)}
                className='glass-w-full text-left glass-px-3 glass-py-2 glass-radius-md hover:glass-surface-subtle/10 glass-focus glass-touch-target'
              >
                <div className='glass-text-sm text-primary'>{it.label}</div>
                {it.meta && (
                  <div className='glass-text-xs text-primary/60'>{it.meta}</div>
                )}
              </button>
            </li>
          ))
        )}
      </ul>
    </OptimizedGlass>
  );
}

export default GlassMentionList;
