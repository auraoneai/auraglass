"use client";
import { cn } from "../../lib/utilsComprehensive";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Check, ChevronRight } from "lucide-react";
import React, { forwardRef } from "react";
import { OptimizedGlass } from "../../primitives";
import { Motion } from "../../primitives";

// DropdownMenu Root component
export interface GlassDropdownMenuProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Root> {
  className?: string;
  "data-testid"?: string;
}

export const GlassDropdownMenu = React.forwardRef<
  HTMLDivElement,
  GlassDropdownMenuProps
>(({ className, "data-testid": dataTestId, children, ...props }, ref) => {
  return (
    <div ref={ref} className={className} data-testid={dataTestId}>
      <DropdownMenuPrimitive.Root {...props}>
        {children}
      </DropdownMenuPrimitive.Root>
    </div>
  );
});

GlassDropdownMenu.displayName = "GlassDropdownMenu";

// DropdownMenuTrigger component
export interface GlassDropdownMenuTriggerProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Trigger> {
  variant?: "default" | "outline" | "ghost" | "minimal";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

export const GlassDropdownMenuTrigger = forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Trigger>,
  GlassDropdownMenuTriggerProps
>(
  (
    {
      className,
      variant = "outline",
      size = "md",
      asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    const sizeStyles = {
      sm: "h-8 glass-px-3 glass-text-xs",
      md: "h-10 glass-px-4 glass-text-sm",
      lg: "h-12 glass-px-6 glass-text-base",
    };

    const variantStyles = {
      default:
        "glass-surface-primary glass-text-primary hover:glass-surface-primary/90",
      outline:
        "glass-border glass-border-glass-border glass-surface-transparent hover:glass-surface-subtle hover:glass-text-primary",
      ghost: "hover:glass-surface-subtle hover:glass-text-primary",
      minimal: "glass-text-secondary hover:glass-text-primary",
    };

    const baseStyles = cn(
      "glass-inline-flex glass-items-center glass-justify-center glass-gap-2",
      "glass-whitespace-nowrap glass-radius-lg glass-font-medium",
      "glass-transition-all glass-duration-200",
      "focus-visible:outline-none focus-visible:ring-2",
      "focus-visible:ring-primary focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      sizeStyles?.[size],
      variantStyles?.[variant],
      className
    );

    return (
      <DropdownMenuPrimitive.Trigger
        data-glass-component
        ref={ref}
        className={baseStyles}
        asChild={asChild}
        aria-haspopup="menu"
        {...props}
      >
        {children}
      </DropdownMenuPrimitive.Trigger>
    );
  }
);

GlassDropdownMenuTrigger.displayName = "GlassDropdownMenuTrigger";

// DropdownMenuContent component
export interface GlassDropdownMenuContentProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content> {
  align?: "start" | "center" | "end";
  sideOffset?: number;
  portalContainer?: HTMLElement | null;
  portalled?: boolean;
  positionStrategy?: "fixed" | "absolute" | "contained";
  contained?: boolean;
}

export const GlassDropdownMenuContent = forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  GlassDropdownMenuContentProps
>(
  (
    {
      className,
      align = "end",
      sideOffset = 4,
      children,
      portalContainer,
      portalled = true,
      positionStrategy = "fixed",
      contained = false,
      style,
      ...props
    },
    ref
  ) => {
    const isContained = contained || positionStrategy === "contained";
    const renderContent = (
      <Motion preset="scaleIn">
        <DropdownMenuPrimitive.Content
          ref={ref}
          align={align}
          sideOffset={isContained ? 0 : sideOffset}
          data-position-strategy={isContained ? "contained" : positionStrategy}
          className={cn(
            "glass-z-50 glass-min-w-[8rem] glass-overflow-hidden glass-radius-xl glass-p-1",
            "glass-shadow-lg glass-border glass-border-glass-border/20",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
            "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            isContained && "glass-w-full glass-max-w-full",
            className
          )}
          style={{
            ...(isContained
              ? {
                  position: "absolute",
                  left: 0,
                  top: "calc(100% + 0.25rem)",
                  transform: "none",
                  width: "max-content",
                  minWidth: "12rem",
                  maxWidth: "min(16rem, calc(100vw - 1rem))",
                }
              : undefined),
            ...(style as React.CSSProperties | undefined),
          }}
          {...props}
        >
          <OptimizedGlass
            intent="neutral"
            elevation="level2"
            intensity="medium"
            depth={2}
            tint="neutral"
            border="subtle"
            animation="none"
            performanceMode="medium"
            className="glass-p-0 glass-radial-reveal glass-lift"
          >
            {children}
          </OptimizedGlass>
        </DropdownMenuPrimitive.Content>
      </Motion>
    );

    if (!portalled || isContained) {
      return renderContent;
    }

    return (
      <DropdownMenuPrimitive.Portal container={portalContainer ?? undefined}>
        {renderContent}
      </DropdownMenuPrimitive.Portal>
    );
  }
);

GlassDropdownMenuContent.displayName = "GlassDropdownMenuContent";

// DropdownMenuItem component
export interface GlassDropdownMenuItemProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> {
  variant?: "default" | "destructive";
  icon?: React.ReactNode;
  shortcut?: string;
}

export const GlassDropdownMenuItem = forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  GlassDropdownMenuItemProps
>(
  (
    { className, variant = "default", icon, shortcut, children, ...props },
    ref
  ) => {
    const variantStyles = {
      default:
        "glass-text-primary focus:glass-surface-subtle focus:glass-text-primary",
      destructive:
        "glass-text-danger focus:glass-surface-danger/10 focus:glass-text-danger",
    };

    return (
      <DropdownMenuPrimitive.Item
        ref={ref}
        className={cn(
          "glass-relative glass-flex glass-cursor-default glass-select-none glass-items-center glass-radius-lg glass-px-3 glass-py-2 glass-text-sm glass-outline-none",
          "glass-transition-all glass-duration-200 glass-hover--translate-y-0-5",
          "focus:glass-surface-subtle focus:glass-text-primary glass-ring-0",
          "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          variantStyles?.[variant],
          className
        )}
        {...props}
      >
        {icon && (
          <span className="glass-mr-3 glass-flex glass-h-4 glass-w-4 glass-items-center glass-justify-center">
            {icon}
          </span>
        )}
        <span className="glass-flex-1">{children}</span>
        {shortcut && (
          <span className="glass-ml-auto glass-text-xs glass-text-secondary">
            {shortcut}
          </span>
        )}
      </DropdownMenuPrimitive.Item>
    );
  }
);

GlassDropdownMenuItem.displayName = "GlassDropdownMenuItem";

// DropdownMenuCheckboxItem component
export interface GlassDropdownMenuCheckboxItemProps
  extends React.ComponentPropsWithoutRef<
    typeof DropdownMenuPrimitive.CheckboxItem
  > {
  checked?: boolean | "indeterminate";
  icon?: React.ReactNode;
}

export const GlassDropdownMenuCheckboxItem = forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  GlassDropdownMenuCheckboxItemProps
>(({ className, checked, icon, children, ...props }, ref) => {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      ref={ref}
      className={cn(
        "glass-relative glass-flex glass-cursor-default glass-select-none glass-items-center",
        "glass-radius-lg glass-px-3 glass-py-2 glass-text-sm outline-none",
        "glass-transition-colors glass-duration-200",
        "focus:glass-surface-subtle focus:glass-text-primary",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      checked={checked}
      {...props}
    >
      <DropdownMenuPrimitive.ItemIndicator className="glass-absolute glass-left-2 glass-flex glass-h-3-5 glass-w-3-5 glass-items-center glass-justify-center">
        <Check className="glass-h-3 glass-w-3" />
      </DropdownMenuPrimitive.ItemIndicator>
      {icon && (
        <span className="glass-ml-6 glass-mr-3 glass-flex glass-h-4 glass-w-4 glass-items-center glass-justify-center">
          {icon}
        </span>
      )}
      <span className="glass-flex-1">{children}</span>
    </DropdownMenuPrimitive.CheckboxItem>
  );
});

GlassDropdownMenuCheckboxItem.displayName = "GlassDropdownMenuCheckboxItem";

// DropdownMenuRadioGroup component
export const GlassDropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

// DropdownMenuRadioItem component
export interface GlassDropdownMenuRadioItemProps
  extends React.ComponentPropsWithoutRef<
    typeof DropdownMenuPrimitive.RadioItem
  > {
  icon?: React.ReactNode;
}

export const GlassDropdownMenuRadioItem = forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  GlassDropdownMenuRadioItemProps
>(({ className, icon, children, ...props }, ref) => {
  return (
    <DropdownMenuPrimitive.RadioItem
      ref={ref}
      className={cn(
        "glass-relative glass-flex glass-cursor-default glass-select-none glass-items-center",
        "glass-radius-lg glass-px-3 glass-py-2 glass-text-sm outline-none",
        "glass-transition-colors glass-duration-200",
        "focus:glass-surface-subtle focus:glass-text-primary",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      <DropdownMenuPrimitive.ItemIndicator className="glass-absolute glass-left-2 glass-flex glass-h-3-5 glass-w-3-5 glass-items-center glass-justify-center">
        <div className="glass-h-2 glass-w-2 glass-radius-full glass-bg-transparent" />
      </DropdownMenuPrimitive.ItemIndicator>
      {icon && (
        <span className="glass-ml-6 glass-mr-3 glass-flex glass-h-4 glass-w-4 glass-items-center glass-justify-center">
          {icon}
        </span>
      )}
      <span className="glass-flex-1">{children}</span>
    </DropdownMenuPrimitive.RadioItem>
  );
});

GlassDropdownMenuRadioItem.displayName = "GlassDropdownMenuRadioItem";

// DropdownMenuLabel component
export interface GlassDropdownMenuLabelProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> {
  inset?: boolean;
}

export const GlassDropdownMenuLabel = forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  GlassDropdownMenuLabelProps
>(({ className, inset = false, ...props }, ref) => {
  return (
    <DropdownMenuPrimitive.Label
      ref={ref}
      className={cn(
        "glass-px-2 glass-py-1.5 glass-text-sm glass-font-semibold glass-text-primary",
        inset && "pl-8",
        className
      )}
      {...props}
    />
  );
});

GlassDropdownMenuLabel.displayName = "GlassDropdownMenuLabel";

// DropdownMenuSeparator component
export interface GlassDropdownMenuSeparatorProps
  extends React.ComponentPropsWithoutRef<
    typeof DropdownMenuPrimitive.Separator
  > {}

export const GlassDropdownMenuSeparator = forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  GlassDropdownMenuSeparatorProps
>(({ className, ...props }, ref) => {
  return (
    <DropdownMenuPrimitive.Separator
      ref={ref}
      className={cn(
        "-glass-mx-1 glass-my-1 glass-h-px glass-surface-subtle/20",
        className
      )}
      {...props}
    />
  );
});

GlassDropdownMenuSeparator.displayName = "GlassDropdownMenuSeparator";

// DropdownMenuShortcut component (for keyboard shortcuts)
export interface GlassDropdownMenuShortcutProps
  extends React.HTMLAttributes<HTMLSpanElement> {}

export const GlassDropdownMenuShortcut = forwardRef<
  HTMLSpanElement,
  GlassDropdownMenuShortcutProps
>(({ className, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn(
        "glass-ml-auto glass-text-xs glass-tracking-widest glass-text-secondary",
        className
      )}
      {...props}
    />
  );
});

GlassDropdownMenuShortcut.displayName = "GlassDropdownMenuShortcut";

// DropdownMenuSub component
export const GlassDropdownMenuSub = DropdownMenuPrimitive.Sub;

// DropdownMenuSubTrigger component
export interface GlassDropdownMenuSubTriggerProps
  extends React.ComponentPropsWithoutRef<
    typeof DropdownMenuPrimitive.SubTrigger
  > {
  icon?: React.ReactNode;
}

export const GlassDropdownMenuSubTrigger = forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  GlassDropdownMenuSubTriggerProps
>(({ className, icon, children, ...props }, ref) => {
  return (
    <DropdownMenuPrimitive.SubTrigger
      ref={ref}
      className={cn(
        "glass-flex glass-cursor-default glass-select-none glass-items-center glass-radius-lg glass-px-3 glass-py-2 glass-text-sm glass-outline-none",
        "focus:glass-surface-subtle focus:glass-text-primary",
        "data-[state=open]:glass-surface-subtle data-[state=open]:glass-text-primary",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      {icon && (
        <span className="glass-mr-3 glass-flex glass-h-4 glass-w-4 glass-items-center glass-justify-center">
          {icon}
        </span>
      )}
      <span className="glass-flex-1">{children}</span>
      <ChevronRight className="glass-ml-auto glass-h-4 glass-w-4" />
    </DropdownMenuPrimitive.SubTrigger>
  );
});

GlassDropdownMenuSubTrigger.displayName = "GlassDropdownMenuSubTrigger";

// DropdownMenuSubContent component
export interface GlassDropdownMenuSubContentProps
  extends React.ComponentPropsWithoutRef<
    typeof DropdownMenuPrimitive.SubContent
  > {
  portalContainer?: HTMLElement | null;
  portalled?: boolean;
  positionStrategy?: "fixed" | "absolute" | "contained";
  contained?: boolean;
}

export const GlassDropdownMenuSubContent = forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  GlassDropdownMenuSubContentProps
>(
  (
    {
      className,
      children,
      portalContainer,
      portalled = true,
      positionStrategy = "fixed",
      contained = false,
      sideOffset,
      style,
      ...props
    },
    ref
  ) => {
    const isContained = contained || positionStrategy === "contained";
    const renderContent = (
      <DropdownMenuPrimitive.SubContent
        ref={ref}
        sideOffset={isContained ? 0 : sideOffset}
        data-position-strategy={isContained ? "contained" : positionStrategy}
        className={cn(
          "glass-z-50 glass-min-w-[8rem] glass-overflow-hidden glass-radius-xl glass-p-1",
          "glass-shadow-lg glass-border glass-border-glass-border/20",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
          "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          isContained && "glass-w-full glass-max-w-full",
          className
        )}
        style={{
          ...(isContained
            ? {
                position: "absolute",
                left: 0,
                top: "calc(100% + 0.25rem)",
                transform: "none",
                width: "max-content",
                minWidth: "12rem",
                maxWidth: "min(16rem, calc(100vw - 1rem))",
              }
            : undefined),
          ...(style as React.CSSProperties | undefined),
        }}
        {...props}
      >
        <OptimizedGlass
          intent="neutral"
          elevation={"level2"}
          intensity="medium"
          depth={2}
          tint="neutral"
          border="subtle"
          animation="none"
          performanceMode="medium"
          className="glass-p-0 glass-radial-reveal glass-lift"
        >
          {children}
        </OptimizedGlass>
      </DropdownMenuPrimitive.SubContent>
    );

    if (!portalled || isContained) {
      return renderContent;
    }

    return (
      <DropdownMenuPrimitive.Portal container={portalContainer ?? undefined}>
        {renderContent}
      </DropdownMenuPrimitive.Portal>
    );
  }
);

GlassDropdownMenuSubContent.displayName = "GlassDropdownMenuSubContent";

// Export all components for convenience
export { DropdownMenuPrimitive as DropdownMenu };
