"use client";

import { cn } from "../../lib/utilsComprehensive";
import {
  DismissableLayer,
  FocusScope,
  Portal,
  Positioner,
  Slot,
} from "../../primitives";
import { Check, ChevronRight } from "../../icons";
import React, { forwardRef } from "react";
import { OptimizedGlass } from "../../primitives";
import { Motion } from "../../primitives";

type MenuSelectEvent = Event & { currentTarget?: EventTarget | null };

type DropdownMenuContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLElement>;
  contentId: string;
};

const DropdownMenuContext =
  React.createContext<DropdownMenuContextValue | null>(null);

const useDropdownMenu = () => {
  const context = React.useContext(DropdownMenuContext);
  if (!context) {
    throw new Error(
      "GlassDropdownMenu components must be used within GlassDropdownMenu"
    );
  }
  return context;
};

const useControllableOpen = ({
  open,
  defaultOpen,
  onOpenChange,
}: {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(
    defaultOpen ?? false
  );
  const isControlled = open !== undefined;
  const resolvedOpen = isControlled ? open : uncontrolledOpen;

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange]
  );

  return [resolvedOpen ?? false, setOpen] as const;
};

const composeRefs = <T,>(
  ...refs: Array<React.Ref<T> | undefined>
): React.RefCallback<T> => {
  return (node) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        (ref as React.MutableRefObject<T | null>).current = node;
      }
    });
  };
};

const getFocusableMenuItems = (root: HTMLElement | null) =>
  Array.from(
    root?.querySelectorAll<HTMLElement>(
      '[role="menuitem"]:not([aria-disabled="true"]), [role="menuitemcheckbox"]:not([aria-disabled="true"]), [role="menuitemradio"]:not([aria-disabled="true"])'
    ) ?? []
  );

// DropdownMenu Root component
export interface GlassDropdownMenuProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onOpenChange"> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
}

export const GlassDropdownMenu = React.forwardRef<
  HTMLDivElement,
  GlassDropdownMenuProps
>(
  (
    {
      className,
      "data-testid": dataTestId,
      children,
      open,
      defaultOpen,
      onOpenChange,
      modal: _modal,
      ...props
    },
    ref
  ) => {
    const [resolvedOpen, setOpen] = useControllableOpen({
      open,
      defaultOpen,
      onOpenChange,
    });
    const triggerRef = React.useRef<HTMLElement>(null);
    const contentId = React.useId();

    const value = React.useMemo(
      () => ({
        open: resolvedOpen,
        setOpen,
        triggerRef,
        contentId,
      }),
      [contentId, resolvedOpen, setOpen]
    );

    return (
      <DropdownMenuContext.Provider value={value}>
        <div
          ref={ref}
          className={className}
          data-testid={dataTestId}
          {...props}
        >
          {children}
        </div>
      </DropdownMenuContext.Provider>
    );
  }
);

GlassDropdownMenu.displayName = "GlassDropdownMenu";

// DropdownMenuTrigger component
export interface GlassDropdownMenuTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "minimal";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

export const GlassDropdownMenuTrigger = forwardRef<
  HTMLButtonElement,
  GlassDropdownMenuTriggerProps
>(
  (
    {
      className,
      variant = "outline",
      size = "md",
      asChild = false,
      children,
      onClick,
      onKeyDown,
      disabled,
      ...props
    },
    ref
  ) => {
    const { open, setOpen, triggerRef, contentId } = useDropdownMenu();
    const Comp = asChild ? Slot : "button";

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

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (!event.defaultPrevented && !disabled) {
        setOpen(!open);
      }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented || disabled) return;

      if (
        event.key === "Enter" ||
        event.key === " " ||
        event.key === "ArrowDown"
      ) {
        event.preventDefault();
        setOpen(true);
      }
    };

    return (
      <Comp
        data-glass-component
        ref={composeRefs(ref, triggerRef as React.Ref<HTMLButtonElement>)}
        type={asChild ? undefined : "button"}
        className={cn(
          "glass-inline-flex glass-items-center glass-justify-center glass-gap-2",
          "glass-whitespace-nowrap glass-radius-lg glass-font-medium",
          "glass-transition-all glass-duration-200",
          "focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-primary focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          sizeStyles?.[size],
          variantStyles?.[variant],
          className
        )}
        disabled={disabled}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? contentId : undefined}
        data-state={open ? "open" : "closed"}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

GlassDropdownMenuTrigger.displayName = "GlassDropdownMenuTrigger";

// DropdownMenuContent component
export interface GlassDropdownMenuContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  align?: "start" | "center" | "end";
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  portalContainer?: HTMLElement | null;
  portalled?: boolean;
  positionStrategy?: "fixed" | "absolute" | "contained";
  contained?: boolean;
  forceMount?: boolean;
}

export const GlassDropdownMenuContent = forwardRef<
  HTMLDivElement,
  GlassDropdownMenuContentProps
>(
  (
    {
      className,
      align = "end",
      side = "bottom",
      sideOffset = 4,
      children,
      portalContainer,
      portalled = true,
      positionStrategy = "fixed",
      contained = false,
      forceMount = false,
      style,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    const { open, setOpen, triggerRef, contentId } = useDropdownMenu();
    const isContained = contained || positionStrategy === "contained";

    if (!open && !forceMount) {
      return null;
    }

    const renderContent = (
      <Motion preset="scaleIn">
        <Positioner
          anchorRef={triggerRef}
          side={side}
          align={align}
          sideOffset={isContained ? 0 : sideOffset}
          contained={isContained}
          strategy={positionStrategy === "absolute" ? "absolute" : "fixed"}
        >
          <DismissableLayer
            ref={ref}
            id={contentId}
            role="menu"
            tabIndex={-1}
            aria-orientation="vertical"
            data-state={open ? "open" : "closed"}
            data-side={side}
            data-position-strategy={
              isContained ? "contained" : positionStrategy
            }
            onDismiss={() => setOpen(false)}
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
            onKeyDown={(event) => {
              onKeyDown?.(event);
              if (event.defaultPrevented) return;

              const items = getFocusableMenuItems(event.currentTarget);
              if (items.length === 0) return;
              const activeIndex = items.indexOf(
                document.activeElement as HTMLElement
              );

              if (event.key === "ArrowDown") {
                event.preventDefault();
                items[(activeIndex + 1 + items.length) % items.length]?.focus();
              } else if (event.key === "ArrowUp") {
                event.preventDefault();
                items[(activeIndex - 1 + items.length) % items.length]?.focus();
              } else if (event.key === "Home") {
                event.preventDefault();
                items[0]?.focus();
              } else if (event.key === "End") {
                event.preventDefault();
                items[items.length - 1]?.focus();
              } else if (event.key === "Escape") {
                event.preventDefault();
                setOpen(false);
                triggerRef.current?.focus();
              }
            }}
            {...props}
          >
            <FocusScope loop>
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
            </FocusScope>
          </DismissableLayer>
        </Positioner>
      </Motion>
    );

    if (!portalled || isContained) {
      return renderContent;
    }

    return <Portal container={portalContainer}>{renderContent}</Portal>;
  }
);

GlassDropdownMenuContent.displayName = "GlassDropdownMenuContent";

// DropdownMenuItem component
export interface GlassDropdownMenuItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  variant?: "default" | "destructive";
  icon?: React.ReactNode;
  shortcut?: string;
  disabled?: boolean;
  onSelect?: (event: MenuSelectEvent) => void;
}

export const GlassDropdownMenuItem = forwardRef<
  HTMLDivElement,
  GlassDropdownMenuItemProps
>(
  (
    {
      className,
      variant = "default",
      icon,
      shortcut,
      children,
      disabled = false,
      onClick,
      onSelect,
      ...props
    },
    ref
  ) => {
    const { setOpen } = useDropdownMenu();
    const variantStyles = {
      default:
        "glass-text-primary focus:glass-surface-subtle focus:glass-text-primary",
      destructive:
        "glass-text-danger focus:glass-surface-danger/10 focus:glass-text-danger",
    };

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
      onClick?.(event);
      if (event.defaultPrevented || disabled) return;

      const selectEvent = new Event("glassDropdownMenu.select", {
        cancelable: true,
      }) as MenuSelectEvent;
      Object.defineProperty(selectEvent, "currentTarget", {
        configurable: true,
        value: event.currentTarget,
      });
      onSelect?.(selectEvent);

      if (!selectEvent.defaultPrevented) {
        setOpen(false);
      }
    };

    return (
      <div
        ref={ref}
        role="menuitem"
        tabIndex={disabled ? undefined : -1}
        aria-disabled={disabled || undefined}
        data-disabled={disabled ? "" : undefined}
        className={cn(
          "glass-relative glass-flex glass-cursor-default glass-select-none glass-items-center glass-radius-lg glass-px-3 glass-py-2 glass-text-sm glass-outline-none",
          "glass-transition-all glass-duration-200 glass-hover--translate-y-0-5",
          "focus:glass-surface-subtle focus:glass-text-primary glass-ring-0",
          "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          variantStyles?.[variant],
          className
        )}
        onClick={handleClick}
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
      </div>
    );
  }
);

GlassDropdownMenuItem.displayName = "GlassDropdownMenuItem";

// DropdownMenuCheckboxItem component
export interface GlassDropdownMenuCheckboxItemProps
  extends Omit<GlassDropdownMenuItemProps, "checked"> {
  checked?: boolean | "indeterminate";
  onCheckedChange?: (checked: boolean) => void;
}

export const GlassDropdownMenuCheckboxItem = forwardRef<
  HTMLDivElement,
  GlassDropdownMenuCheckboxItemProps
>(
  (
    {
      className,
      checked = false,
      icon,
      children,
      onCheckedChange,
      onSelect,
      ...props
    },
    ref
  ) => {
    const isChecked = checked === true;

    return (
      <GlassDropdownMenuItem
        ref={ref}
        role="menuitemcheckbox"
        aria-checked={checked === "indeterminate" ? "mixed" : isChecked}
        className={cn(
          "glass-relative glass-flex glass-cursor-default glass-select-none glass-items-center",
          "glass-radius-lg glass-px-3 glass-py-2 glass-text-sm outline-none",
          "glass-transition-colors glass-duration-200",
          "focus:glass-surface-subtle focus:glass-text-primary",
          "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          className
        )}
        onSelect={(event) => {
          onSelect?.(event);
          if (!event.defaultPrevented) {
            onCheckedChange?.(!isChecked);
          }
        }}
        {...props}
      >
        <span className="glass-absolute glass-left-2 glass-flex glass-h-3-5 glass-w-3-5 glass-items-center glass-justify-center">
          {isChecked && <Check className="glass-h-3 glass-w-3" />}
        </span>
        {icon && (
          <span className="glass-ml-6 glass-mr-3 glass-flex glass-h-4 glass-w-4 glass-items-center glass-justify-center">
            {icon}
          </span>
        )}
        <span className="glass-flex-1">{children}</span>
      </GlassDropdownMenuItem>
    );
  }
);

GlassDropdownMenuCheckboxItem.displayName = "GlassDropdownMenuCheckboxItem";

type RadioGroupContextValue = {
  value?: string;
  onValueChange?: (value: string) => void;
};

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(
  null
);

export interface GlassDropdownMenuRadioGroupProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  onValueChange?: (value: string) => void;
}

export const GlassDropdownMenuRadioGroup = forwardRef<
  HTMLDivElement,
  GlassDropdownMenuRadioGroupProps
>(({ value, onValueChange, children, ...props }, ref) => (
  <RadioGroupContext.Provider value={{ value, onValueChange }}>
    <div ref={ref} role="group" {...props}>
      {children}
    </div>
  </RadioGroupContext.Provider>
));

GlassDropdownMenuRadioGroup.displayName = "GlassDropdownMenuRadioGroup";

// DropdownMenuRadioItem component
export interface GlassDropdownMenuRadioItemProps
  extends GlassDropdownMenuItemProps {
  value: string;
}

export const GlassDropdownMenuRadioItem = forwardRef<
  HTMLDivElement,
  GlassDropdownMenuRadioItemProps
>(({ className, icon, children, value, onSelect, ...props }, ref) => {
  const radioGroup = React.useContext(RadioGroupContext);
  const checked = radioGroup?.value === value;

  return (
    <GlassDropdownMenuItem
      ref={ref}
      role="menuitemradio"
      aria-checked={checked}
      className={cn(
        "glass-relative glass-flex glass-cursor-default glass-select-none glass-items-center",
        "glass-radius-lg glass-px-3 glass-py-2 glass-text-sm outline-none",
        "glass-transition-colors glass-duration-200",
        "focus:glass-surface-subtle focus:glass-text-primary",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      onSelect={(event) => {
        onSelect?.(event);
        if (!event.defaultPrevented) {
          radioGroup?.onValueChange?.(value);
        }
      }}
      {...props}
    >
      <span className="glass-absolute glass-left-2 glass-flex glass-h-3-5 glass-w-3-5 glass-items-center glass-justify-center">
        {checked && (
          <div className="glass-h-2 glass-w-2 glass-radius-full glass-bg-transparent" />
        )}
      </span>
      {icon && (
        <span className="glass-ml-6 glass-mr-3 glass-flex glass-h-4 glass-w-4 glass-items-center glass-justify-center">
          {icon}
        </span>
      )}
      <span className="glass-flex-1">{children}</span>
    </GlassDropdownMenuItem>
  );
});

GlassDropdownMenuRadioItem.displayName = "GlassDropdownMenuRadioItem";

// DropdownMenuLabel component
export interface GlassDropdownMenuLabelProps
  extends React.HTMLAttributes<HTMLDivElement> {
  inset?: boolean;
}

export const GlassDropdownMenuLabel = forwardRef<
  HTMLDivElement,
  GlassDropdownMenuLabelProps
>(({ className, inset = false, ...props }, ref) => {
  return (
    <div
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
  extends React.HTMLAttributes<HTMLDivElement> {}

export const GlassDropdownMenuSeparator = forwardRef<
  HTMLDivElement,
  GlassDropdownMenuSeparatorProps
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      role="separator"
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

type SubMenuContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLElement>;
};

const SubMenuContext = React.createContext<SubMenuContextValue | null>(null);

export interface GlassDropdownMenuSubProps {
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const GlassDropdownMenuSub = ({
  children,
  open,
  defaultOpen,
  onOpenChange,
}: GlassDropdownMenuSubProps) => {
  const [resolvedOpen, setOpen] = useControllableOpen({
    open,
    defaultOpen,
    onOpenChange,
  });
  const triggerRef = React.useRef<HTMLElement>(null);
  const value = React.useMemo(
    () => ({ open: resolvedOpen, setOpen, triggerRef }),
    [resolvedOpen, setOpen]
  );

  return (
    <SubMenuContext.Provider value={value}>{children}</SubMenuContext.Provider>
  );
};

GlassDropdownMenuSub.displayName = "GlassDropdownMenuSub";

// DropdownMenuSubTrigger component
export interface GlassDropdownMenuSubTriggerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  disabled?: boolean;
}

export const GlassDropdownMenuSubTrigger = forwardRef<
  HTMLDivElement,
  GlassDropdownMenuSubTriggerProps
>(
  (
    {
      className,
      icon,
      children,
      onPointerEnter,
      onFocus,
      onClick,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    const context = React.useContext(SubMenuContext);

    const openSubmenu = () => context?.setOpen(true);

    return (
      <div
        ref={composeRefs(ref, context?.triggerRef as React.Ref<HTMLDivElement>)}
        role="menuitem"
        aria-haspopup="menu"
        aria-expanded={context?.open}
        tabIndex={-1}
        className={cn(
          "glass-flex glass-cursor-default glass-select-none glass-items-center glass-radius-lg glass-px-3 glass-py-2 glass-text-sm glass-outline-none",
          "focus:glass-surface-subtle focus:glass-text-primary",
          "data-[state=open]:glass-surface-subtle data-[state=open]:glass-text-primary",
          "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          className
        )}
        data-state={context?.open ? "open" : "closed"}
        onPointerEnter={(event) => {
          onPointerEnter?.(event);
          if (!event.defaultPrevented) openSubmenu();
        }}
        onFocus={(event) => {
          onFocus?.(event);
          if (!event.defaultPrevented) openSubmenu();
        }}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) context?.setOpen(!context.open);
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (event.defaultPrevented) return;
          if (
            event.key === "ArrowRight" ||
            event.key === "Enter" ||
            event.key === " "
          ) {
            event.preventDefault();
            context?.setOpen(true);
          } else if (event.key === "ArrowLeft" || event.key === "Escape") {
            event.preventDefault();
            context?.setOpen(false);
          }
        }}
        {...props}
      >
        {icon && (
          <span className="glass-mr-3 glass-flex glass-h-4 glass-w-4 glass-items-center glass-justify-center">
            {icon}
          </span>
        )}
        <span className="glass-flex-1">{children}</span>
        <ChevronRight className="glass-ml-auto glass-h-4 glass-w-4" />
      </div>
    );
  }
);

GlassDropdownMenuSubTrigger.displayName = "GlassDropdownMenuSubTrigger";

// DropdownMenuSubContent component
export interface GlassDropdownMenuSubContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  portalContainer?: HTMLElement | null;
  portalled?: boolean;
  positionStrategy?: "fixed" | "absolute" | "contained";
  contained?: boolean;
  sideOffset?: number;
  forceMount?: boolean;
}

export const GlassDropdownMenuSubContent = forwardRef<
  HTMLDivElement,
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
      forceMount = false,
      style,
      ...props
    },
    ref
  ) => {
    const context = React.useContext(SubMenuContext);
    const isContained = contained || positionStrategy === "contained";
    const open = context?.open ?? false;

    if (!open && !forceMount) {
      return null;
    }

    const renderContent = (
      <Positioner
        anchorRef={context?.triggerRef}
        side="right"
        align="start"
        sideOffset={isContained ? 0 : (sideOffset ?? 4)}
        contained={isContained}
        strategy={positionStrategy === "absolute" ? "absolute" : "fixed"}
      >
        <DismissableLayer
          ref={ref}
          role="menu"
          data-state={open ? "open" : "closed"}
          data-side="right"
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
        </DismissableLayer>
      </Positioner>
    );

    if (!portalled || isContained) {
      return renderContent;
    }

    return <Portal container={portalContainer}>{renderContent}</Portal>;
  }
);

GlassDropdownMenuSubContent.displayName = "GlassDropdownMenuSubContent";

export const DropdownMenu = {
  Root: GlassDropdownMenu,
  Trigger: GlassDropdownMenuTrigger,
  Content: GlassDropdownMenuContent,
  Item: GlassDropdownMenuItem,
  CheckboxItem: GlassDropdownMenuCheckboxItem,
  RadioGroup: GlassDropdownMenuRadioGroup,
  RadioItem: GlassDropdownMenuRadioItem,
  Label: GlassDropdownMenuLabel,
  Separator: GlassDropdownMenuSeparator,
  Sub: GlassDropdownMenuSub,
  SubTrigger: GlassDropdownMenuSubTrigger,
  SubContent: GlassDropdownMenuSubContent,
  Portal,
};
