import React from 'react';
'use client';
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { Motion } from '../../primitives';
import { cn } from "@/lib/utils";

// Main Select Root
const GlassSelect = SelectPrimitive.Root;

// Select Group  
const GlassSelectGroup = SelectPrimitive.Group;

// Select Value
const GlassSelectValue = SelectPrimitive.Value;

// Glass Select Trigger
export interface GlassSelectTriggerProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> {
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Visual variant */
  variant?: 'default' | 'filled' | 'outlined' | 'minimal';
  /** Error state */
  error?: boolean;
}

const GlassSelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  GlassSelectTriggerProps
>(({ className, children, size = 'md', variant = 'default', error = false, ...props }, ref) => {
  const sizeConfig = {
    sm: 'h-8 glass-px-2 glass-py-1 glass-text-xs',
    md: 'h-10 glass-px-3 glass-py-2 glass-text-sm', 
    lg: 'h-12 glass-px-4 glass-py-3 glass-text-base',
  };

  const variantConfig = {
    default: cn(
      'bg-background/50 border border-border/20',
      'focus:border-primary focus:ring-1 focus:ring-primary'
    ),
    filled: cn(
      'bg-muted/50 border border-transparent',
      'focus:bg-background/50 focus:border-primary'
    ),
    outlined: cn(
      'bg-transparent border-2 border-border/20',
      'focus:border-primary'
    ),
    minimal: cn(
      'bg-transparent border-0 border-b border-border/20 rounded-none',
      'focus:border-primary'
    ),
  };

  return (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        // Base styles
        'glass-select-trigger group flex w-full items-center justify-between',
        'glass-radius-lg backdrop-blur-md transition-all duration-200',
        'text-foreground placeholder:glass-text-secondary',
        'focus:outline-none focus:ring-offset-2 focus:ring-offset-background',
        'disabled:cursor-not-allowed disabled:opacity-50',
        '[&>span]:line-clamp-1',
        
        // Size
        sizeConfig[size],
        
        // Variant
        variantConfig[variant],
        
        // Error state
        error && 'border-red-400 focus:border-red-400 focus:ring-red-400',
        
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="h-4 w-4 opacity-50 transition-transform group-data-[state=open]:rotate-180" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
});
GlassSelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

// Glass Select Content
export interface GlassSelectContentProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> {
  /** Content variant */
  variant?: 'default' | 'minimal';
}

const GlassSelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  GlassSelectContentProps
>(({ className, children, position = "popper", variant = 'default', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <Motion preset="scaleIn">
      <SelectPrimitive.Content
        ref={ref}
        className={cn(
          // Base styles
          'glass-select-content relative z-50 max-h-96 min-w-[8rem] overflow-hidden',
          // Darker, more legible surface for options
          'backdrop-blur-md bg-black/70 ring-1 ring-white/12',
          'glass-radius-xl shadow-2xl shadow-black/40',
          'text-foreground',
          
          // Animations
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
          'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          
          // Position adjustments
          position === "popper" && [
            'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1',
            'data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1'
          ],
          
          className
        )}
        position={position}
        {...props}
      >
        <GlassSelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            'glass-p-1',
            position === "popper" && [
              'h-[var(--radix-select-trigger-height)] w-full',
              'min-w-[var(--radix-select-trigger-width)]'
            ]
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <GlassSelectScrollDownButton />
      </SelectPrimitive.Content>
    </Motion>
  </SelectPrimitive.Portal>
));
GlassSelectContent.displayName = SelectPrimitive.Content.displayName;

// Glass Select Item
export interface GlassSelectItemProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> {
  /** Item variant */
  variant?: 'default' | 'ghost';
}

const GlassSelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  GlassSelectItemProps
>(({ className, children, variant = 'default', ...props }, ref) => {
  const variantStyles = {
    default: cn(
      'focus:bg-muted/50 focus:text-foreground',
      'data-[highlighted]:bg-muted/50 data-[highlighted]:text-foreground'
    ),
    ghost: cn(
      'focus:bg-primary/10 focus:text-primary',
      'data-[highlighted]:bg-primary/10 data-[highlighted]:text-primary'
    ),
  };

  return (
    <SelectPrimitive.Item
      ref={ref}
      className={cn(
        // Base styles
        'glass-select-item relative flex w-full cursor-pointer select-none items-center',
        'glass-radius-lg glass-py-2 pl-8 pr-2 glass-text-sm outline-none transition-all duration-150',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        
        // Variant styles
        variantStyles[variant],
        
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check className="h-4 w-4" />
        </SelectPrimitive.ItemIndicator>
      </span>

      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
});
GlassSelectItem.displayName = SelectPrimitive.Item.displayName;

// Glass Select Label
const GlassSelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn(
      'glass-select-label glass-py-1.5 pl-8 pr-2 glass-text-sm font-semibold glass-text-secondary',
      className
    )}
    {...props}
  />
));
GlassSelectLabel.displayName = SelectPrimitive.Label.displayName;

// Glass Select Separator
const GlassSelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn(
      'glass-select-separator -glass-mx-1 glass-my-1 h-px bg-border/20',
      className
    )}
    {...props}
  />
));
GlassSelectSeparator.displayName = SelectPrimitive.Separator.displayName;

// Glass Select Scroll Buttons
const GlassSelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      'glass-select-scroll-up flex cursor-default items-center justify-center glass-py-1',
      'glass-text-secondary hover:text-foreground transition-colors',
      className
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
));
GlassSelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const GlassSelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      'glass-select-scroll-down flex cursor-default items-center justify-center glass-py-1',
      'glass-text-secondary hover:text-foreground transition-colors',
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
));
GlassSelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;

// Export all components
export {
  GlassSelect,
  GlassSelectGroup,
  GlassSelectValue,
  GlassSelectTrigger,
  GlassSelectContent,
  GlassSelectLabel,
  GlassSelectItem,
  GlassSelectSeparator,
  GlassSelectScrollUpButton,
  GlassSelectScrollDownButton,
};

// Re-export as compound component for easier usage
export {
  GlassSelect as Select,
  GlassSelectGroup as SelectGroup,
  GlassSelectValue as SelectValue,
  GlassSelectTrigger as SelectTrigger,
  GlassSelectContent as SelectContent,
  GlassSelectLabel as SelectLabel,
  GlassSelectItem as SelectItem,
  GlassSelectSeparator as SelectSeparator,
  GlassSelectScrollUpButton as SelectScrollUpButton,
  GlassSelectScrollDownButton as SelectScrollDownButton,
};

export default GlassSelect;
