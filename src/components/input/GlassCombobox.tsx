"use client";

import React, { forwardRef, useId, useMemo, useRef, useState } from "react";
import { ChevronDown, Search } from "../../icons";
import { cn } from "../../lib/utilsComprehensive";

export interface GlassComboboxOption {
  value: string;
  label: string;
  group?: string;
  disabled?: boolean;
}

export interface GlassComboboxProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  options: GlassComboboxOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string, option: GlassComboboxOption) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  emptyText?: string;
}

export const GlassCombobox = forwardRef<HTMLDivElement, GlassComboboxProps>(
  (
    {
      options,
      value,
      defaultValue,
      onChange,
      placeholder = "Search options",
      label = "Combobox",
      disabled,
      emptyText = "No options",
      className,
      ...props
    },
    ref
  ) => {
    const id = useId();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [activeIndex, setActiveIndex] = useState(0);
    const [internalValue, setInternalValue] = useState(defaultValue ?? "");
    const selectedValue = value ?? internalValue;
    const selectedOption = options.find(
      (option) => option.value === selectedValue
    );

    const filteredOptions = useMemo(() => {
      const normalized = query.trim().toLowerCase();
      if (!normalized) return options;
      return options.filter((option) =>
        option.label.toLowerCase().includes(normalized)
      );
    }, [options, query]);

    const enabledOptions = filteredOptions.filter((option) => !option.disabled);
    const activeOption = enabledOptions[activeIndex] ?? enabledOptions[0];

    const commit = (option: GlassComboboxOption | undefined) => {
      if (!option || option.disabled) return;
      if (value === undefined) setInternalValue(option.value);
      setQuery(option.label);
      setOpen(false);
      onChange?.(option.value, option);
    };

    const groupedOptions = useMemo(() => {
      const groups = new Map<string, GlassComboboxOption[]>();
      filteredOptions.forEach((option) => {
        const key = option.group ?? "";
        groups.set(key, [...(groups.get(key) ?? []), option]);
      });
      return Array.from(groups.entries());
    }, [filteredOptions]);

    return (
      <div
        ref={ref}
        data-glass-component
        className={cn("glass-relative glass-space-y-2", className)}
        {...props}
      >
        <label
          htmlFor={`${id}-input`}
          className="glass-block glass-text-sm glass-font-medium glass-text-primary"
        >
          {label}
        </label>
        <div className="glass-relative">
          <Search
            aria-hidden="true"
            className="glass-pointer-events-none glass-absolute glass-left-3 glass-top-1/2 glass-h-4 glass-w-4 -glass-translate-y-1/2 glass-text-secondary"
          />
          <input
            ref={inputRef}
            id={`${id}-input`}
            role="combobox"
            aria-expanded={open}
            aria-controls={`${id}-listbox`}
            aria-activedescendant={
              activeOption ? `${id}-option-${activeOption.value}` : undefined
            }
            aria-autocomplete="list"
            disabled={disabled}
            value={query || selectedOption?.label || ""}
            placeholder={placeholder}
            className="glass-h-10 glass-w-full glass-rounded-lg glass-border glass-border-white/15 glass-bg-white/8 glass-px-9 glass-text-sm glass-text-primary glass-outline-none focus:glass-border-primary"
            onFocus={() => setOpen(true)}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
              setOpen(true);
            }}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                setOpen(true);
                setActiveIndex((current) =>
                  Math.min(current + 1, Math.max(enabledOptions.length - 1, 0))
                );
              }
              if (event.key === "ArrowUp") {
                event.preventDefault();
                setActiveIndex((current) => Math.max(current - 1, 0));
              }
              if (event.key === "Enter") {
                event.preventDefault();
                commit(activeOption);
              }
              if (event.key === "Escape") {
                setOpen(false);
              }
            }}
          />
          <ChevronDown
            aria-hidden="true"
            className="glass-pointer-events-none glass-absolute glass-right-3 glass-top-1/2 glass-h-4 glass-w-4 -glass-translate-y-1/2 glass-text-secondary"
          />
        </div>
        {open ? (
          <div
            id={`${id}-listbox`}
            role="listbox"
            className="glass-absolute glass-z-50 glass-mt-1 glass-max-h-72 glass-w-full glass-overflow-auto glass-rounded-lg glass-border glass-border-white/15 glass-bg-slate-950/95 glass-p-1 glass-shadow-xl"
          >
            {filteredOptions.length === 0 ? (
              <div className="glass-px-3 glass-py-2 glass-text-sm glass-text-secondary">
                {emptyText}
              </div>
            ) : (
              groupedOptions.map(([group, groupOptions]) => (
                <div
                  key={group || "ungrouped"}
                  role="group"
                  aria-label={group || undefined}
                >
                  {group ? (
                    <div className="glass-px-3 glass-py-1 glass-text-xs glass-font-semibold glass-uppercase glass-tracking-wide glass-text-secondary">
                      {group}
                    </div>
                  ) : null}
                  {groupOptions.map((option) => {
                    const enabledIndex = enabledOptions.findIndex(
                      (item) => item.value === option.value
                    );
                    const active = enabledIndex === activeIndex;
                    return (
                      <button
                        key={option.value}
                        id={`${id}-option-${option.value}`}
                        type="button"
                        role="option"
                        aria-selected={option.value === selectedValue}
                        disabled={option.disabled}
                        className={cn(
                          "glass-flex glass-w-full glass-items-center glass-rounded-md glass-px-3 glass-py-2 glass-text-left glass-text-sm glass-text-primary",
                          active && "glass-bg-white/12",
                          option.disabled &&
                            "glass-cursor-not-allowed glass-opacity-45"
                        )}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => commit(option)}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        ) : null}
      </div>
    );
  }
);

GlassCombobox.displayName = "GlassCombobox";
