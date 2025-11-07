'use client';

import { cn } from '../../lib/utilsComprehensive';
import React, { forwardRef, useState } from 'react';
import { useMotionPreference } from '../../hooks/useMotionPreference';
import { Motion, OptimizedGlass } from '../../primitives';
import { useA11yId } from '../../utils/a11y';
import { useGlassSound } from '../../utils/soundDesign';
import { ContrastGuard, TextWithContrast } from '@/components/accessibility/ContrastGuard';

export interface GlassChipProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** Chip content */
  children: React.ReactNode;
  /** Visual variant */
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'outline' | 'filled';
  /** Size of the chip */
  size?: 'xs' | 'sm' | 'md' | 'lg';
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
  // TODO: Integrate ContrastGuard for table cells, list items, badges, card titles, and other text content for WCAG AA compliance

      children,
      variant = 'default',
      size = 'md',
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
    const chipId = useA11yId('glass-chip');

    const sizeConfig = {
      xs: {
        height: 'h-6',
        padding: 'glass-px-2',
        text: 'glass-text-xs',
        iconSize: 'w-3 h-3',
        avatarSize: 'w-4 h-4',
        gap: 'glass-gap-1',
      },
      sm: {
        height: 'h-7',
        padding: 'glass-px-2.5',
        text: 'glass-text-sm',
        iconSize: 'w-3.5 h-3.5',
        avatarSize: 'w-5 h-5',
        gap: 'glass-gap-1.5',
      },
      md: {
        height: 'h-8',
        padding: 'glass-px-3',
        text: 'glass-text-sm',
        iconSize: 'w-4 h-4',
        avatarSize: 'w-6 h-6',
        gap: 'glass-gap-2',
      },
      lg: {
        height: 'h-10',
        padding: 'glass-px-4',
        text: 'glass-text-base',
        iconSize: 'w-5 h-5',
        avatarSize: 'w-7 h-7',
        gap: 'glass-gap-2',
      },
    };

    const variantConfig = {
      default: {
        base: 'bg-background/50 border-border/20 text-foreground',
        selected: 'bg-primary/20 border-primary/40 text-primary',
        hover: 'hover:bg-background/70',
      },
      primary: {
        base: 'bg-primary/10 border-primary/20 text-primary',
        selected: 'bg-primary/90 border-primary text-primary-foreground',
        hover: 'hover:bg-primary/20',
      },
      secondary: {
        base: 'bg-secondary/10 border-secondary/20 text-secondary',
        selected: 'bg-secondary/90 border-secondary text-secondary-foreground',
        hover: 'hover:bg-secondary/20',
      },
      success: {
        base: 'glass-surface-success/10 glass-border/20 glass-text-success',
        selected: 'glass-surface-success/90 glass-surface-success glass-text-primary',
        hover: 'hover:glass-surface-success/20',
      },
      warning: {
        base: 'glass-surface-warning/10 glass-border/20 glass-text-primary',
        selected: 'glass-surface-warning/90 glass-surface-warning glass-text-primary',
        hover: 'hover:glass-surface-warning/20',
      },
      error: {
        base: 'glass-surface-danger/10 glass-border/20 glass-text-danger',
        selected: 'glass-surface-danger/90 glass-surface-danger glass-text-primary',
        hover: 'hover:glass-surface-danger/20',
      },
      info: {
        base: 'glass-surface-info/10 glass-border/20 glass-text-primary',
        selected: 'glass-surface-info/90 glass-surface-info glass-text-primary',
        hover: 'hover:glass-surface-info/20',
      },
      outline: {
        base: 'bg-transparent border-border text-foreground',
        selected: 'bg-primary/10 border-primary text-primary',
        hover: 'hover:bg-background/10',
      },
      filled: {
        base: 'bg-muted border-muted glass-text-secondary',
        selected: 'bg-primary border-primary text-primary-foreground',
        hover: 'hover:bg-muted/80',
      },
    };

    const config = sizeConfig[size];
    const colors = variantConfig[variant];

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return;

      if (onSelect) {
        onSelect(!selected);
        play(selected ? 'deselect' : 'select');
      }

      if (clickable) {
        onClick?.(event);
        play('click');
      }
    };

    const handleRemove = (event: React.MouseEvent) => {
      if (disabled) return;
      
      event.stopPropagation();
      onRemove?.(event);
      play('remove');
    };

    const defaultRemoveIcon = (
      <svg
        className="w-full h-full"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    );

    const chipContent = (
      <>
        {/* Avatar */}
        {avatar && (
          <div className={cn('flex-shrink-0 glass-radius-full overflow-hidden', config.avatarSize)}>
            {avatar}
          </div>
        )}

        {/* Icon */}
        {icon && !avatar && (
          <div className={cn('flex-shrink-0', config.iconSize)}>
            {icon}
          </div>
        )}

        {/* Content */}
        <span className="flex-1 min-w-0 truncate font-medium">
          {children}
        </span>

        {/* Remove button */}
        {removable && (
          <button
            type="button"
            onClick={handleRemove}
            disabled={disabled}
            className={cn(
              'flex-shrink-0 glass-ml-1 glass-radius-full transition-colors',
              'hover:bg-current/20 focus:outline-none focus:ring-1 focus:ring-current',
              'flex items-center justify-center',
              config.iconSize,
              disabled && 'opacity-50 cursor-not-allowed'
            )}
            aria-label="Remove chip"
          >
            {removeIcon || defaultRemoveIcon}
          </button>
        )}

        {/* Glass overlay effect */}
        <div className="absolute inset-0 glass-radius-full glass-gradient-primary glass-gradient-primary via-transparent glass-gradient-primary pointer-events-none" />
      </>
    );

    const isInteractive = clickable || onSelect || removable;

    return (
      <Motion data-glass-component
        preset={shouldAnimate && respectMotionPreference ? "scaleIn" : "none"}
      >
        <OptimizedGlass
          ref={ref}
          id={chipId}
          elevation="level1"
          intensity="medium"
          depth={variant === 'filled' ? 2 : 1}
          tint={selected ? 'primary' : 'neutral'}
          border={variant === 'outline' ? 'strong' : 'subtle'}
          animation={shouldAnimate && respectMotionPreference ? "shimmer" : "none"}
          performanceMode="high"
          liftOnHover={isInteractive && !disabled}
        press={isInteractive ? true : false}
        className={cn(
          'glass-chip relative inline-flex items-center glass-radius-full border backdrop-blur-md',
          'transition-all duration-200 select-none',
          config.height,
          config.padding,
          config.text,
          config.gap,
          selected ? colors.selected : colors.base,
          isInteractive && !disabled && 'cursor-pointer',
          isInteractive && !disabled && colors.hover,
          isInteractive && !disabled && 'hover:scale-105 active:scale-95',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        onClick={isInteractive ? handleClick : undefined}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        role={onSelect ? 'checkbox' : clickable ? 'button' : 'status'}
        tabIndex={isInteractive && !disabled ? 0 : -1}
        aria-checked={onSelect ? selected : undefined}
        aria-disabled={disabled}
        onKeyDown={(e: React.KeyboardEvent) => {
          if ((e.key === 'Enter' || e.key === ' ') && isInteractive && !disabled) {
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

GlassChip.displayName = 'GlassChip';

// Chip Group Component
export interface GlassChipGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
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
  selectionMode?: 'none' | 'single' | 'multiple';
  /** Selected values */
  selectedValues?: string[];
  /** Default selected values */
  defaultSelectedValues?: string[];
  /** Selection change handler */
  onChange?: (selectedValues: string[]) => void;
  /** Chip remove handler */
  onRemove?: (chipId: string) => void;
  /** Chip size */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** Chip variant */
  variant?: GlassChipProps['variant'];
  /** Spacing between chips */
  spacing?: 'tight' | 'normal' | 'relaxed';
  /** Whether chips should wrap */
  wrap?: boolean;
  /** Respect user's motion preferences */
  respectMotionPreference?: boolean;
}

export const GlassChipGroup = forwardRef<HTMLDivElement, GlassChipGroupProps>(
  (
    {
      chips,
      selectionMode = 'none',
      selectedValues,
      defaultSelectedValues = [],
      onChange,
      onRemove,
      size = 'md',
      variant = 'default',
      spacing = 'normal',
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

    const currentSelected = selectedValues !== undefined ? selectedValues : internalSelected;

    const spacingConfig = {
      tight: 'glass-gap-1',
      normal: 'glass-gap-2',
      relaxed: 'glass-gap-3',
    };

    const handleChipSelect = (chipId: string, value: string, selected: boolean) => {
      let newSelected: string[];

      if (selectionMode === 'single') {
        newSelected = selected ? [value] : [];
      } else if (selectionMode === 'multiple') {
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
          'glass-chip-group flex items-center',
          spacingConfig[spacing],
          wrap && 'flex-wrap',
          className
        )}
        role={selectionMode !== 'none' ? 'group' : undefined}
        {...props}
      >
        {chips.map((chip, index) => {
          const chipValue = chip.value || chip.id;
          const isSelected = selectionMode !== 'none' && currentSelected.includes(chipValue);

          return (
            <Motion
              key={chip.id}
              preset={shouldAnimate && respectMotionPreference ? "slideIn" : "none"}
              delay={index * 50}
            >
              <GlassChip
                size={size}
                variant={variant}
                selected={isSelected}
                disabled={chip.disabled}
                clickable={selectionMode !== 'none'}
                removable={chip.removable}
                avatar={chip.avatar}
                icon={chip.icon}
                respectMotionPreference={respectMotionPreference}
                onSelect={
                  selectionMode !== 'none'
                    ? (selected) => handleChipSelect(chip.id, chipValue, selected)
                    : undefined
                }
                onRemove={
                  chip.removable
                    ? () => handleChipRemove(chip.id)
                    : undefined
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

GlassChipGroup.displayName = 'GlassChipGroup';

export default GlassChip;