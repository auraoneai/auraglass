'use client';
import React from "react";
import { cn } from "../../lib/utilsComprehensive";
import { GlassButton } from "../button/GlassButton";
import { OptimizedGlass } from "../../primitives";

export interface GlassTagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
  className?: string;
}

export function GlassTagInput({
  value,
  onChange,
  placeholder = "Add tag…",
  suggestions = [],
  className,
}: GlassTagInputProps) {
  const [input, setInput] = React.useState("");
  const add = (t: string) => {
    const tag = t.trim();
    if (!tag) return;
    if (!value.includes(tag)) onChange([...value, tag]);
    setInput("");
  };
  const remove = (tag: string) => onChange(value.filter((v: any) => v !== tag));

  return (
    <OptimizedGlass
      data-glass-component
      elevation={"level1"}
      className={cn(
        "glass-radius-xl glass-p-2 flex flex-wrap glass-gap-2",
        className
      )}
    >
      {value.map((t) => (
        <span
          key={t}
          className="glass-inline-flex glass-items-center glass-gap-1 glass-px-2 glass-py-1 glass-text-sm glass-radius-lg glass-surface-subtle/10 glass-border glass-border-white/20"
        >
          {t}
          <button
            onClick={(e) => remove(t)}
            className="text-primary/60 hover:text-primary glass-focus glass-touch-target glass-contrast-guard"
          >
            ×
          </button>
        </span>
      ))}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            add(input);
          } else if (e.key === "Backspace" && !input && value.length) {
            remove(value[value.length - 1]);
          }
        }}
        placeholder={placeholder}
        className="glass-flex-1 min-w-[120px] bg-transparent outline-none glass-text-sm placeholder:text-primary/50 glass-focus glass-touch-target glass-contrast-guard"
      />
      {!!suggestions.length && input && (
        <div className="glass-w-full -mb-1">
          <div className="glass-mt-1 glass-radius-lg glass-border glass-border-white/15 glass-surface-dark/20 glass-p-1">
            {suggestions
              .filter((s: any) => s.toLowerCase().includes(input.toLowerCase()))
              .slice(0, 6)
              .map((s: any) => (
                <GlassButton
                  key={s}
                  variant="ghost"
                  size="sm"
                  className="glass-w-full glass-justify-start"
                  onClick={(e) => add(s)}
                >
                  {s}
                </GlassButton>
              ))}
          </div>
        </div>
      )}
    </OptimizedGlass>
  );
}

export default GlassTagInput;