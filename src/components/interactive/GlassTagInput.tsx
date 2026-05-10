"use client";
import React from "react";
import { cn } from "../../lib/utilsComprehensive";
import { GlassButton } from "../button/GlassButton";
import { OptimizedGlass } from "../../primitives";

export interface GlassTagInputProps {
  value?: string[];
  onChange?: (tags: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
  className?: string;
}

export function GlassTagInput({
  value = [],
  onChange = () => {},
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
      intensity="subtle"
      animation="none"
      className={cn(
        "glass-radius-xl glass-p-2 glass-flex glass-flex-wrap glass-items-center glass-gap-2 glass-w-full glass-min-w-0 glass-border glass-border-white/10",
        className
      )}
      style={{
        background:
          '/* Use createGlassStyle({ intent: "primary", elevation: "level3" }) */',
        border: "1px solid rgba(148, 163, 184, 0.2)",
        boxShadow:
          "0 8px 22px rgba(2, 6, 23, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
      }}
    >
      {value.map((t) => (
        <span
          key={t}
          className="glass-inline-flex glass-items-center glass-gap-1 glass-px-2 glass-py-1 glass-text-sm glass-radius-lg glass-surface-dark/40 glass-border glass-border-white/10 glass-text-primary"
        >
          {t}
          <button
            onClick={(e) => remove(t)}
            className="glass-text-primary-glass-opacity-60 glass-bg-transparent glass-border-0 glass-cursor-pointer glass-focus glass-touch-target glass-contrast-guard"
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
        className="glass-flex-1 glass-min-w-120px glass-bg-transparent glass-border-0 glass-outline-none glass-text-sm glass-text-primary glass-placeholder-text-primary-opacity-50 glass-focus glass-touch-target glass-contrast-guard"
      />
      {!!suggestions.length && input && (
        <div className="glass-w-full glass--mb-1">
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
