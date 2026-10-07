"use client";
import { cn } from "../../lib/utilsComprehensive";
import React, { forwardRef, useState } from "react";
import { useMotionPreference } from "../../hooks/useMotionPreference";
import { Motion, OptimizedGlass } from "../../primitives";
import { useA11yId } from "../../utils/a11y";
import { useGlassSound } from "../../utils/soundDesign";
import {
  ContrastGuard,
  TextWithContrast,
} from "@/components/accessibility/ContrastGuard";
import { ANIMATION } from "../../tokens/designConstants";
import { useReducedMotion } from "../../hooks/useReducedMotion";

export interface GlassChipProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onSelect"
> {
  /** Chip content */
  children: React.ReactNode;
  /** Visual variant */
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "error"
    | "info"
    | "outline"
    | "filled";
  /** Size of the chip */
  size?: "xs" | "sm" | "md" | "lg";
  /** Whether the chip is removable */
  removable?: boolean;
  /** Whether the chip is selected/active */
  selected?: boolean;
  /** Whether the chip is disabled */
  disabled?: boolean;
  /** Whether the chip is clickable */
  clickable?: boolean;
  /** Left icon or avatar */
  avatar?: React.ReactNode;
  /** Left icon */
  icon?: React.ReactNode;
  /** Custom remove icon */
  removeIcon?: React.ReactNode;
  /** Remove handler */
  onRemove?: (event: React.MouseEvent) => void;
  /** Selection handler */
  onSelect?: (selected: boolean) => void;
  /** Click handler */
  onClick?: (event: React.MouseEvent) => void;
  /** Respect user's motion preferences */
  respectMotionPreference?: boolean;
}

export const GlassChip = forwardRef<HTMLDivElement, GlassChipProps>(
  (
    {
      // ContrastGuard text coverage is tracked in the manual accessibility QA report.

      children,
      variant = "default",
      size = "md",
      removable = false,
      selected = false,
      disabled = false,
      clickable = false,
      avatar,
      icon,
      removeIcon,
      onRemove,
      onSelect,
      onClick,
      respectMotionPreference = true,
      className,
      ...props
    },
    ref
  ) => {
    const { shouldAnimate } = useMotionPreference();
    const { play } = useGlassSound();
    const [isHovered, setIsHovered] = useState(false);
    const chipId = useA11yId("glass-chip");

    const sizeConfig = {
      xs: {
        minHeight: 28,
        padding: "glass-px-2",
        text: "glass-text-xs",
        iconSize: "glass-w-3 glass-h-3",
        avatarSize: "glass-w-4 glass-h-4",
        gap: "glass-gap-1",
      },
      sm: {
        minHeight: 34,
        padding: "glass-px-3",
        text: "glass-text-sm",
        iconSize: "glass-w-4 glass-h-4",
        avatarSize: "glass-w-5 glass-h-5",
        gap: "glass-gap-1.5",
      },
      md: {
        minHeight: 36,
        padding: "glass-px-3",
        text: "glass-text-sm",
        iconSize: "glass-w-4 glass-h-4",
        avatarSize: "glass-w-6 glass-h-6",
        gap: "glass-gap-2",
      },
      lg: {
        minHeight: 42,
        padding: "glass-px-4",
        text: "glass-text-base",
        iconSize: "glass-w-5 glass-h-5",
        avatarSize: "w-7 glass-h-8",
        gap: "glass-gap-2",
      },
    };

    // Semantic variants retain their meaning through labels and icons. The
    // shell remains neutral so chips do not turn into opaque, chromatic pills.
    const variantConfig = {
      default: {
        base: "glass-border-black/10",
        selected: "glass-border-black/20",
        hover: "hover:glass-border-black/20",
      },
      primary: {
        base: "glass-border-black/10",
        selected: "glass-border-black/20",
        hover: "hover:glass-border-black/20",
      },
      secondary: {
        base: "glass-border-black/10",
        selected: "glass-border-black/20",
        hover: "hover:glass-border-black/20",
      },
      success: {
        base: "glass-border-black/10",
        selected: "glass-border-black/20",
        hover: "hover:glass-border-black/20",
      },
      warning: {
        base: "glass-border-black/10",
        selected: "glass-border-black/20",
        hover: "hover:glass-border-black/20",
      },
      error: {
        base: "glass-border-black/10",
        selected: "glass-border-black/20",
        hover: "hover:glass-border-black/20",
      },
      info: {
        base: "glass-border-black/10",
        selected: "glass-border-black/20",
        hover: "hover:glass-border-black/20",
      },
      outline: {
        base: "bg-transparent glass-border-black/15",
        selected: "glass-border-black/25",
        hover: "hover:glass-border-black/25",
      },
      filled: {
        base: "glass-border-black/10",
        selected: "glass-border-black/20",
        hover: "hover:glass-border-black/20",
      },
    };

    const config = sizeConfig[size];
    const colors = variantConfig[variant];

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return;

      if (onSelect) {
        onSelect(!selected);
        play(selected ? "deselect" : "select");
      }

      if (clickable) {
        onClick?.(event);
        play("click");
      }
    };

    const handleRemove = (event: React.MouseEvent) => {
      if (disabled) return;

      event.stopPropagation();
      onRemove?.(event);
      play("remove");
    };

    const defaultRemoveIcon = (
      <svg
        className="glass-w-full glass-h-full"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    );

    const chipContent = (
      <>
        {/* Avatar */}
        {avatar && (
          <div
            className={cn(
              "glass-flex-shrink-0 glass-radius-full glass-overflow-hidden",
              config.avatarSize
            )}
          >
            {avatar}
          </div>
        )}

        {/* Icon */}
        {icon && !avatar && (
          <div className={cn("glass-flex-shrink-0", config.iconSize)}>
            {icon}
          </div>
        )}

        {/* Content */}
        <span className="glass-flex-1 glass-min-w-0 glass-whitespace-nowrap glass-font-medium">
          {children}
        </span>

        {/* Remove button */}
        {removable && (
          <button
            type="button"
            onClick={handleRemove}
            disabled={disabled}
            className={cn(
              "glass-flex-shrink-0 glass-ml-1 glass-radius-full transition-colors glass-p-0",
              "hover:bg-current/20 focus:outline-none focus:ring-1 focus:ring-current",
              "glass-flex glass-items-center glass-justify-center",
              "glass-w-5 glass-h-5",
              disabled && "opacity-50 cursor-not-allowed",
              "glass-focus glass-contrast-guard"
            )}
            aria-label="Remove chip"
          >
            {removeIcon || defaultRemoveIcon}
          </button>
        )}

      </>
    );

    const isInteractive = clickable || onSelect || removable;

    return (
      <Motion
        data-glass-component
        preset={shouldAnimate && respectMotionPreference ? "scaleIn" : "none"}
      >
        <OptimizedGlass
          ref={ref}
          id={chipId}
          elevation="level1"
          intensity="medium"
          depth={variant === "filled" ? 2 : 1}
          tint="neutral"
          border={variant === "outline" ? "strong" : "subtle"}
          animation="none"
          performanceMode="high"
          liftOnHover={isInteractive && !disabled}
          press={isInteractive ? true : false}
          className={cn(
            "glass-chip glass-relative glass-inline-flex glass-items-center glass-radius-full glass-border glass-backdrop-blur-md",
            "transition-all duration-200 select-none",
            config.padding,
            config.text,
            config.gap,
            selected ? colors.selected : colors.base,
            isInteractive && !disabled && "glass-cursor-pointer",
            isInteractive && !disabled && colors.hover,
            isInteractive &&
              !disabled &&
              "glass-hover-scale-105 active:scale-95",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
          style={
            {
              minHeight: config.minHeight,
              paddingTop: 4,
              paddingBottom: 4,
              "--glass-theme-text": "rgba(15, 23, 42, 0.92)",
              color: "var(--glass-theme-text, var(--glass-text-primary))",
            } as React.CSSProperties
          }
          onClick={isInteractive ? handleClick : undefined}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          role={onSelect ? "checkbox" : clickable ? "button" : "status"}
          tabIndex={isInteractive && !disabled ? 0 : -1}
          aria-checked={onSelect ? selected : undefined}
          aria-disabled={disabled}
          onKeyDown={(e: React.KeyboardEvent) => {
            if (
              (e.key === "Enter" || e.key === " ") &&
              isInteractive &&
              !disabled
            ) {
              e.preventDefault();
              handleClick(e as any);
            }
          }}
          {...props}
        >
          {chipContent}
        </OptimizedGlass>
      </Motion>
    );
  }
);

GlassChip.displayName = "GlassChip";

// Chip Group Component
export interface GlassChipGroupProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  /** Array of chip data */
  chips: Array<{
    id: string;
    label: React.ReactNode;
    value?: string;
    removable?: boolean;
    disabled?: boolean;
    avatar?: React.ReactNode;
    icon?: React.ReactNode;
  }>;
  /** Selection mode */
  selectionMode?: "none" | "single" | "multiple";
  /** Selected values */
  selectedValues?: string[];
  /** Default selected values */
  defaultSelectedValues?: string[];
  /** Selection change handler */
  onChange?: (selectedValues: string[]) => void;
  /** Chip remove handler */
  onRemove?: (chipId: string) => void;
  /** Chip size */
  size?: "xs" | "sm" | "md" | "lg";
  /** Chip variant */
  variant?: GlassChipProps["variant"];
  /** Spacing between chips */
  spacing?: "tight" | "normal" | "relaxed";
  /** Whether chips should wrap */
  wrap?: boolean;
  /** Respect user's motion preferences */
  respectMotionPreference?: boolean;
}

export const GlassChipGroup = forwardRef<HTMLDivElement, GlassChipGroupProps>(
  (
    {
      chips,
      selectionMode = "none",
      selectedValues,
      defaultSelectedValues = [],
      onChange,
      onRemove,
      size = "md",
      variant = "default",
      spacing = "normal",
      wrap = true,
      respectMotionPreference = true,
      className,
      ...props
    },
    ref
  ) => {
    const { shouldAnimate } = useMotionPreference();
    const [internalSelected, setInternalSelected] = useState<string[]>(
      selectedValues || defaultSelectedValues
    );

    const currentSelected =
      selectedValues !== undefined ? selectedValues : internalSelected;

    const spacingConfig = {
      tight: "glass-gap-1",
      normal: "glass-gap-2",
      relaxed: "glass-gap-3",
    };

    const handleChipSelect = (
      chipId: string,
      value: string,
      selected: boolean
    ) => {
      let newSelected: string[];

      if (selectionMode === "single") {
        newSelected = selected ? [value] : [];
      } else if (selectionMode === "multiple") {
        if (selected) {
          newSelected = [...currentSelected, value];
        } else {
          newSelected = currentSelected.filter((v: any) => v !== value);
        }
      } else {
        return; // No selection mode
      }

      if (selectedValues === undefined) {
        setInternalSelected(newSelected);
      }
      onChange?.(newSelected);
    };

    const handleChipRemove = (chipId: string) => {
      onRemove?.(chipId);
    };

    return (
      <div
        ref={ref}
        className={cn(
          "glass-chip-group glass-flex glass-items-center",
          spacingConfig[spacing],
          wrap && "glass-flex-wrap",
          className
        )}
        role={selectionMode !== "none" ? "group" : undefined}
        {...props}
      >
        {chips.map((chip, index) => {
          const chipValue = chip.value || chip.id;
          const isSelected =
            selectionMode !== "none" && currentSelected.includes(chipValue);

          return (
            <Motion
              key={chip.id}
              preset={
                shouldAnimate && respectMotionPreference ? "slideIn" : "none"
              }
              delay={index * 50}
            >
              <GlassChip
                size={size}
                variant={variant}
                selected={isSelected}
                disabled={chip.disabled}
                clickable={selectionMode !== "none"}
                removable={chip.removable}
                avatar={chip.avatar}
                icon={chip.icon}
                respectMotionPreference={respectMotionPreference}
                onSelect={
                  selectionMode !== "none"
                    ? (selected) =>
                        handleChipSelect(chip.id, chipValue, selected)
                    : undefined
                }
                onRemove={
                  chip.removable ? () => handleChipRemove(chip.id) : undefined
                }
              >
                {chip.label}
              </GlassChip>
            </Motion>
          );
        })}
      </div>
    );
  }
);

GlassChipGroup.displayName = "GlassChipGroup";

export default GlassChip;
