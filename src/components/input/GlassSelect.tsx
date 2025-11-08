'use client';
import { GlassButton } from "../button/GlassButton";
import { GlassInput } from "./GlassInput";

import { cn } from "../../lib/utilsComprehensive";
import React, { forwardRef, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FocusTrap } from "../../primitives/focus/FocusTrap";
import { OptimizedGlass } from "../../primitives";
import { Motion } from "../../primitives";
import {
  createComboboxA11y,
  createListboxOptionA11y,
  useA11yId,
  announceToScreenReader,
  keyboardHandlers,
  focusUtils,
} from "../../utils/a11y";

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  group?: string;
}

export interface GlassSelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  /**
   * Select variant
   */
  variant?: "default" | "filled" | "outlined" | "minimal";
  /**
   * Select size
   */
  size?: "sm" | "md" | "lg";
  /**
   * Select state
   */
  state?: "default" | "error" | "warning" | "success";
  /**
   * Whether select is full width
   */
  fullWidth?: boolean;
  /**
   * Left icon
   */
  leftIcon?: React.ReactNode;
  /**
   * Helper text
   */
  helperText?: string;
  /**
   * Error text
   */
  errorText?: string;
  /**
   * Loading state
   */
  loading?: boolean;
  /**
   * Select options
   */
  options?: SelectOption[];
  /**
   * Placeholder text
   */
  placeholder?: string;
  /**
   * Whether select is searchable
   */
  searchable?: boolean;
  /**
   * Custom search function
   */
  onSearch?: (query: string) => void;
  /**
   * Multi-select mode
   */
  multiple?: boolean;
  /**
   * Max items for multi-select
   */
  maxItems?: number;
  /**
   * Custom option renderer
   */
  renderOption?: (option: SelectOption) => React.ReactNode;
  /**
   * Custom value renderer
   */
  renderValue?: (
    value: string | number | (string | number)[]
  ) => React.ReactNode;
  /**
   * Value change callback (preferred over onChange)
   */
  onValueChange?: (value: any) => void;

  // Accessibility props
  /**
   * Accessible label for the select
   */
  label?: string;
  /**
   * ID of element that labels the select
   */
  "aria-labelledby"?: string;
  /**
   * ID of element(s) that describe the select
   */
  "aria-describedby"?: string;
  /**
   * Whether the select is required
   */
  "aria-required"?: boolean;
  /**
   * Whether the select value is invalid
   */
  "aria-invalid"?: boolean;
  /**
   * ID of error message element
   */
  "aria-errormessage"?: string;
}

/**
 * GlassSelect component
 * A glassmorphism select field with advanced features
 * @deprecated Prefer the Radix-based compound Select exported from GlassSelectCompound
 */
export const GlassSelect = forwardRef<HTMLSelectElement, GlassSelectProps>(
  (
    {
      variant = "default",
      size = "md",
      state = "default",
      fullWidth = false,
      leftIcon,
      helperText,
      errorText,
      loading = false,
      options = [],
      placeholder = "Select an option...",
      searchable = false,
      onSearch,
      multiple = false,
      maxItems,
      renderOption,
      renderValue,
      className,
      disabled,
      value,
      onChange,
      onValueChange,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [portalReady, setPortalReady] = useState(false);
    const [dropdownPos, setDropdownPos] = useState<{
      top: number;
      left: number;
      width: number;
    }>({ top: 0, left: 0, width: 0 });

    const sizeClasses = {
      sm: "h-8 glass-px-3 glass-text-sm",
      md: "h-10 glass-px-4 glass-text-sm",
      lg: "h-12 px-5 glass-text-base",
    };

    const variantClasses = {
      default: "bg-background/50 border border-border/30",
      filled: "bg-muted/50 border border-transparent",
      outlined: "bg-transparent border-2 border-border",
      minimal: "bg-transparent border-0 border-b border-border",
    };

    const stateClasses = {
      default: "border-border/30 focus:border-primary/50",
      error: "border-destructive/50 focus:border-destructive",
      warning: "border-warning/50 focus:border-warning",
      success: "border-success/50 focus:border-success",
    };

    const iconSize = {
      sm: "w-4 h-4",
      md: "w-4 h-4",
      lg: "w-5 h-5",
    };

    const currentState = errorText ? "error" : state;
    const displayHelperText = errorText || helperText;

    // Filter options based on search query
    const filteredOptions =
      searchable && searchQuery
        ? options.filter((option: any) =>
            option.label.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : options;

    // Group options
    const groupedOptions = filteredOptions.reduce(
      (groups, option) => {
        const group = option.group || "";
        if (!groups[group]) groups[group] = [];
        groups[group].push(option);
        return groups;
      },
      {} as Record<string, SelectOption[]>
    );

    // Get selected options
    const selectedOptions =
      multiple && Array.isArray(value)
        ? options.filter((opt: any) => value.includes(opt.value))
        : value !== undefined
          ? options.filter((opt: any) => opt.value === value)
          : [];

    // Handle option selection
    const handleOptionSelect = (option: SelectOption) => {
      if (option.disabled) return;

      if (multiple) {
        const currentValues = Array.isArray(value) ? value : [];
        const newValues = currentValues.includes(option.value)
          ? currentValues.filter((v: any) => v !== option.value)
          : maxItems && currentValues.length >= maxItems
            ? currentValues
            : [...currentValues, option.value];

        onValueChange?.(newValues);
      } else {
        onValueChange?.(option.value);
        setIsOpen(false);
      }
    };

    // Handle keyboard navigation
    const handleKeyDown = (event: React.KeyboardEvent) => {
      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else {
            setFocusedIndex((prev: any) =>
              prev < filteredOptions.length - 1 ? prev + 1 : 0
            );
          }
          break;
        case "ArrowUp":
          event.preventDefault();
          if (isOpen) {
            setFocusedIndex((prev: any) =>
              prev > 0 ? prev - 1 : filteredOptions.length - 1
            );
          }
          break;
        case "Enter":
          event.preventDefault();
          if (isOpen && focusedIndex >= 0) {
            handleOptionSelect(filteredOptions[focusedIndex]);
          } else {
            setIsOpen(!isOpen);
          }
          break;
        case "Escape":
          event.preventDefault();
          setIsOpen(false);
          break;
        case " ":
          if (!searchable) {
            event.preventDefault();
            setIsOpen(!isOpen);
          }
          break;
      }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          triggerRef.current &&
          !triggerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Reset search when closed
    useEffect(() => {
      if (!isOpen) {
        setSearchQuery("");
        setFocusedIndex(-1);
      } else if (searchable && searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, [isOpen, searchable]);

    // Prepare portal and compute dropdown position to avoid clipping by overflow-hidden parents
    useEffect(() => {
      setPortalReady(true);
    }, []);

    const updateDropdownPosition = () => {
      const el = triggerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // Add a small offset so the popup doesn't overlap the trigger border
      setDropdownPos({
        top: rect.bottom + 6,
        left: rect.left,
        width: rect.width,
      });
    };

    useEffect(() => {
      if (!isOpen) return;
      updateDropdownPosition();
      const onResize = () => updateDropdownPosition();
      const onScroll = () => updateDropdownPosition();
      window.addEventListener("resize", onResize);
      // Capture scroll from any scrollable ancestor
      window.addEventListener("scroll", onScroll, true);
      return () => {
        window.removeEventListener("resize", onResize);
        window.removeEventListener("scroll", onScroll, true);
      };
    }, [isOpen]);

    // Render selected value
    const renderSelectedValue = () => {
      if (renderValue) {
        return renderValue(
          Array.isArray(value) ? (Array.from(value) as any) : value || ""
        );
      }

      if (multiple && selectedOptions.length > 0) {
        if (selectedOptions.length === 1) {
          return selectedOptions[0].label;
        }
        return `${selectedOptions.length} items selected`;
      }

      if (!multiple && selectedOptions.length > 0) {
        return selectedOptions[0].label;
      }

      return placeholder;
    };

    return (
      <div
        data-glass-component
        className={cn("relative inline-block", { "w-full": fullWidth })}
      >
        {/* Hidden native select for form compatibility */}
        <select
          ref={ref}
          value={value}
          onChange={onChange}
          multiple={multiple}
          className="sr-only glass-touch-target glass-contrast-guard"
          {...props}
        >
          {options.map((option: any) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>

        {/* Custom select trigger */}
        {variant === "default" ? (
          <div
            className={cn(
              "relative inline-block",
              sizeClasses[size],
              disabled && "opacity-50",
              className
            )}
          >
            <GlassButton
              ref={triggerRef}
              type="button"
              className="glass-w-full glass-flex glass-items-center glass-justify-between glass-surface-dark/20 hover:glass-surface-dark/30 glass-border glass-border-white/20 hover:border-white/30 glass-radius-xl outline-none text-left text-primary/90 hover:text-primary glass-glass-glass-backdrop-blur-sm glass-focus glass-touch-target glass-contrast-guard"
              disabled={disabled || loading}
              onClick={(e) => setIsOpen(!isOpen)}
              onKeyDown={handleKeyDown}
              aria-haspopup="listbox"
              aria-expanded={isOpen}
              aria-busy={loading || undefined}
            >
              <div className="glass-flex glass-items-center glass-flex-1 glass-min-w-0">
                {leftIcon && (
                  <div
                    className={cn(
                      "flex items-center justify-center mr-3 glass-text-primary/70",
                      iconSize[size]
                    )}
                  >
                    {leftIcon}
                  </div>
                )}

                <span
                  className={cn(
                    "flex-1 truncate",
                    selectedOptions.length === 0
                      ? "glass-text-primary/60"
                      : "glass-text-primary/90"
                  )}
                >
                  {renderSelectedValue()}
                </span>
              </div>

              <div className="glass-flex glass-items-center glass-gap-2 glass-ml-2">
                {loading && (
                  <div
                    className={cn(
                      "animate-spin glass-radius-full border-2 border-current border-t-transparent",
                      iconSize[size]
                    )}
                  />
                )}

                <div
                  className={cn(
                    "transition-transform duration-200 glass-text-primary/70",
                    isOpen ? "rotate-180" : "rotate-0"
                  )}
                >
                  ▼
                </div>
              </div>
            </GlassButton>
          </div>
        ) : (
          <OptimizedGlass
            intent="neutral"
            elevation={isOpen ? "level3" : "level2"}
            intensity={"medium"}
            depth={2}
            tint={"neutral"}
            border={"subtle"}
            animation="none"
            performanceMode="medium"
            className={cn(
              "relative transition-all duration-200",
              sizeClasses[size],
              "glass-glass-backdrop-blur-md bg-glass-fill ring-1 ring-white/10 hover:bg-white/15 focus-within:bg-white/20 focus-within:ring-2 focus-within:ring-white/30 glass-contrast-guard",
              disabled && "opacity-50",
              isOpen && "bg-white/20 ring-2 ring-white/40 shadow-lg",
              className
            )}
          >
            <GlassButton
              ref={triggerRef}
              type="button"
              className="glass-w-full glass-flex glass-items-center glass-justify-between bg-transparent glass-border-0 outline-none text-left text-primary/90 hover:text-primary glass-focus glass-touch-target glass-contrast-guard"
              disabled={disabled || loading}
              onClick={(e) => setIsOpen(!isOpen)}
              onKeyDown={handleKeyDown}
              aria-haspopup="listbox"
              aria-expanded={isOpen}
              aria-busy={loading || undefined}
            >
              <div className="glass-flex glass-items-center glass-flex-1 glass-min-w-0">
                {leftIcon && (
                  <div
                    className={cn(
                      "flex items-center justify-center mr-3 glass-text-primary/70",
                      iconSize[size]
                    )}
                  >
                    {leftIcon}
                  </div>
                )}

                <span
                  className={cn(
                    "flex-1 truncate",
                    selectedOptions.length === 0
                      ? "glass-text-primary/60"
                      : "glass-text-primary/90"
                  )}
                >
                  {renderSelectedValue()}
                </span>
              </div>

              <div className="ml-3 glass-flex glass-items-center">
                {loading && (
                  <div
                    className={cn(
                      "animate-spin glass-radius-full border-2 border-current border-t-transparent",
                      iconSize[size]
                    )}
                  />
                )}

                <div
                  className={cn(
                    "transition-transform duration-200 glass-text-primary/70",
                    isOpen ? "rotate-180" : "rotate-0"
                  )}
                >
                  ▼
                </div>
              </div>
            </GlassButton>
          </OptimizedGlass>
        )}

        {/* Dropdown */}
        {isOpen &&
          portalReady &&
          createPortal(
            <Motion preset="slideDown" className="pointer-events-auto">
              <div
                style={{
                  position: "fixed",
                  top: dropdownPos.top,
                  left: dropdownPos.left,
                  width: dropdownPos.width,
                  zIndex: 10000,
                }}
              >
                <OptimizedGlass
                  intent="neutral"
                  elevation={"level3"}
                  intensity="strong"
                  depth={2}
                  tint="neutral"
                  border="subtle"
                  animation="none"
                  performanceMode="medium"
                  className={cn(
                    "max-h-60 overflow-hidden",
                    "glass-glass-backdrop-blur-md bg-black/20 border border-white/20 glass-contrast-guard",
                    "shadow-2xl shadow-black/50",
                    "ring-1 ring-white/10"
                  )}
                >
                  <FocusTrap active={isOpen}>
                    {searchable && (
                      <div className="glass-p-2 glass-border-b glass-border-glass-border/20">
                        <GlassInput
                          ref={searchInputRef}
                          type="text"
                          placeholder="Search options..."
                          value={searchQuery}
                          onChange={(e) => {
                            setSearchQuery(e.target.value);
                            onSearch?.(e.target.value);
                          }}
                          className={cn(
                            "w-full glass-px-3 glass-py-2 glass-radius-md outline-none",
                            "glass-glass-backdrop-blur-md bg-glass-fill ring-1 ring-white/10",
                            "glass-text-primary/90 placeholder-white/50",
                            "focus:ring-2 focus:ring-white/30 focus:bg-white/15",
                            "transition-all duration-200"
                          )}
                        />
                      </div>
                    )}

                    <ul
                      ref={listRef}
                      className="max-h-48 overflow-y-auto"
                      role="listbox"
                      aria-multiselectable={multiple}
                    >
                      {Object.entries(groupedOptions).map(
                        ([group, groupOptions]) => (
                          <React.Fragment key={group}>
                            {group && (
                              <li className="glass-px-3 glass-py-2 glass-text-xs font-medium text-primary/60 glass-surface-subtle/5 glass-border-b glass-border-white/10">
                                {group}
                              </li>
                            )}

                            {groupOptions.map((option, index) => {
                              const isSelected = multiple
                                ? Array.isArray(value) &&
                                  value.includes(option.value)
                                : value === option.value;
                              const isFocused =
                                filteredOptions.indexOf(option) ===
                                focusedIndex;

                              return (
                                <li
                                  key={option.value}
                                  className={cn(
                                    "glass-px-3 glass-py-2 cursor-pointer transition-all duration-200",
                                    "hover:bg-white/10 hover:glass-glass-backdrop-blur-md glass-contrast-guard",
                                    "glass-text-primary/90",
                                    "glass-focus glass-touch-target",
                                    {
                                      "bg-white/20 glass-text-primary shadow-md":
                                        isSelected,
                                      "bg-white/5 ring-1 ring-white/20":
                                        isFocused,
                                      "opacity-50 cursor-not-allowed hover:bg-transparent":
                                        option.disabled,
                                    }
                                  )}
                                  onClick={(e) => handleOptionSelect(option)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                      e.preventDefault();
                                      handleOptionSelect(option);
                                    }
                                  }}
                                  role="option"
                                  aria-selected={isSelected}
                                >
                                  <div className="glass-flex glass-items-center glass-justify-between">
                                    {renderOption ? (
                                      renderOption(option)
                                    ) : (
                                      <span className="glass-flex-1">
                                        {option.label}
                                      </span>
                                    )}

                                    {multiple && isSelected && (
                                      <span className="glass-ml-2 text-primary">
                                        ✓
                                      </span>
                                    )}
                                  </div>
                                </li>
                              );
                            })}
                          </React.Fragment>
                        )
                      )}

                      {filteredOptions.length === 0 && (
                        <li className="glass-px-3 glass-py-4 text-primary/50 text-center glass-text-sm">
                          No options found
                        </li>
                      )}
                    </ul>
                  </FocusTrap>
                </OptimizedGlass>
              </div>
            </Motion>,
            document.body
          )}

        {displayHelperText && (
          <p
            className={cn(
              "glass-mt-1 glass-text-xs",
              currentState === "error"
                ? "text-destructive"
                : currentState === "warning"
                  ? "text-warning"
                  : currentState === "success"
                    ? "text-success"
                    : "glass-text-secondary"
            )}
          >
            {displayHelperText}
          </p>
        )}
      </div>
    );
  }
);

GlassSelect.displayName = "GlassSelect";