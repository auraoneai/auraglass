'use client';

import React from 'react';
import { GlassButton } from '../button/GlassButton';
import { cn } from '../../lib/utilsComprehensive';

export interface Pair { key: string; value: string }
export interface GlassKeyValueEditorProps {
  value: Pair[];
  onChange: (pairs: Pair[]) => void;
  className?: string;
}

export function GlassKeyValueEditor({ value, onChange, className }: GlassKeyValueEditorProps) {
  const update = (i: number, patch: Partial<Pair>) => {
    const next = value.slice();
    next[i] = { ...next[i], ...patch };
    onChange(next);
  };
  const add = () => onChange([...value, { key: '', value: '' }]);
  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));

  return (
    <div className={cn('glass-gap-2', className)}>
      {value.map((p, i) => (
        <div key={i} className="flex gap-2">
          <input value={p.key} onChange={(e) => update(i, { key: e.target.value })} placeholder="Key" className="flex-1 bg-transparent border border-white/20 glass-radius-lg px-2 py-1 text-sm outline-none" />
          <input value={p.value} onChange={(e) => update(i, { value: e.target.value })} placeholder="Value" className="flex-1 bg-transparent border border-white/20 glass-radius-lg px-2 py-1 text-sm outline-none" />
          <GlassButton size="sm" variant="ghost" onClick={(e) => remove(i)}>Remove</GlassButton>
        </div>
      ))}
      <GlassButton size="sm" variant="secondary" onClick={add}>Add</GlassButton>
    </div>
  );
}

export default GlassKeyValueEditor;

