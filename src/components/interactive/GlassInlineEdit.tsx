'use client';
import React from "react";
import { GlassButton } from "../button/GlassButton";
import { cn } from "../../lib/utilsComprehensive";

export interface GlassInlineEditProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}

export function GlassInlineEdit({
  value,
  onChange,
  placeholder = "Edit…",
  className,
}: GlassInlineEditProps) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(value);
  React.useEffect(() => setDraft(value), [value]);
  return (
    <div
      data-glass-component
      className={cn("inline-flex items-center glass-gap-2", className)}
      role="group"
      aria-label="Inline editable field"
    >
      {editing ? (
        <>
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onChange(draft);
                setEditing(false);
              }
              if (e.key === "Escape") {
                setDraft(value);
                setEditing(false);
              }
            }}
            placeholder={placeholder}
            aria-label={placeholder}
            className='bg-transparent glass-border glass-border-white/20 glass-radius-lg glass-px-2 glass-py-1 glass-text-sm outline-none glass-focus glass-touch-target glass-contrast-guard'
          />
          <GlassButton
            size="sm"
            variant="primary"
            onClick={(e) => {
              onChange(draft);
              setEditing(false);
            }}
            aria-label="Save changes"
            className="glass-focus glass-touch-target"
          >
            Save
          </GlassButton>
          <GlassButton
            size="sm"
            variant="ghost"
            onClick={(e) => {
              setDraft(value);
              setEditing(false);
            }}
            aria-label="Cancel editing"
            className="glass-focus glass-touch-target"
          >
            Cancel
          </GlassButton>
        </>
      ) : (
        <button
          className='glass-px-2 glass-py-1 glass-radius-lg hover:glass-surface-subtle/10 glass-text-sm glass-focus glass-touch-target glass-contrast-guard'
          onClick={(e) => setEditing(true)}
          aria-label={`Edit ${value || placeholder}`}
        >
          {value || <span className='text-primary/60'>{placeholder}</span>}
        </button>
      )}
    </div>
  );
}

export default GlassInlineEdit;