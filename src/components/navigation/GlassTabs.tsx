'use client';
import { GlassButton } from "../button/GlassButton";

import { cn } from "../../lib/utilsComprehensive";
import React, { createContext, forwardRef, useContext, useState } from "react";
import { OptimizedGlass } from "../../primitives";
import { Motion } from "../../primitives";

// Context for tab management
interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
  orientation: "horizontal" | "vertical";
  variant: "default" | "pills" | "underline" | "minimal";
  activationMode: "automatic" | "manual";
  registerTrigger: (value: string, el: HTMLButtonElement | null) => void;
  listRef: React.RefObject<HTMLDivElement>;
  ink: { left: number; width: number };
}

const TabsContext = createContext<TabsContextValue | null>(null);

const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error(
      "Tabs components must be used within a GlassTabs component"
    );
  }
  return context;
};

// Main Tabs component
export interface GlassTabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: "horizontal" | "vertical";
  variant?: "default" | "pills" | "underline" | "minimal";
  activationMode?: "automatic" | "manual";
}

export const GlassTabs = forwardRef<HTMLDivElement, GlassTabsProps>(
  (
    {
      value,
      defaultValue,
      onValueChange,
      orientation = "horizontal",
      variant = "default",
      activationMode = "automatic",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(defaultValue || "");
    const currentValue = value ?? internalValue;
    const listRef = React.useRef<HTMLDivElement>(null);
    const triggerMapRef = React.useRef(new Map<string, HTMLButtonElement>());
    const [ink, setInk] = React.useState<{ left: number; width: number }>({
      left: 0,
      width: 0,
    });

    const registerTrigger = (val: string, el: HTMLButtonElement | null) => {
      const map = triggerMapRef.current;
      if (el) map.set(val, el);
      else map.delete(val);
      // Update ink when triggers mount/unmount
      requestAnimationFrame(() => {
        if (!listRef.current) return;
        const active = map.get(currentValue);
        if (!active) return;
        const lr = listRef.current.getBoundingClientRect();
        const ar = active.getBoundingClientRect();
        setInk({ left: ar.left - lr.left, width: ar.width });
      });
    };

    React.useEffect(() => {
      const map = triggerMapRef.current;
      if (!listRef.current) return;
      const active = map.get(currentValue);
      if (!active) return;
      const lr = listRef.current.getBoundingClientRect();
      const ar = active.getBoundingClientRect();
      setInk({ left: ar.left - lr.left, width: ar.width });
    }, [currentValue]);

    React.useEffect(() => {
      const handle = () => {
        const map = triggerMapRef.current;
        if (!listRef.current) return;
        const active = map.get(currentValue);
        if (!active) return;
        const lr = listRef.current.getBoundingClientRect();
        const ar = active.getBoundingClientRect();
        setInk({ left: ar.left - lr.left, width: ar.width });
      };
      window.addEventListener("resize", handle);
      return () => window.removeEventListener("resize", handle);
    }, [currentValue]);

    const handleValueChange = (newValue: string) => {
      if (!value) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
    };

    const contextValue: TabsContextValue = {
      value: currentValue,
      onValueChange: handleValueChange,
      orientation,
      variant,
      activationMode,
      registerTrigger,
      listRef,
      ink,
    };

    return (
      <TabsContext.Provider data-glass-component value={contextValue}>
        <div
          ref={ref}
          className={cn(
            "glass-tabs",
            orientation === "vertical" ? "flex glass-gap-6" : "w-full",
            className
          )}
          data-orientation={orientation}
          {...props}
        >
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);

GlassTabs.displayName = "GlassTabs";

// TabsList component
export interface GlassTabsListProps
  extends React.HTMLAttributes<HTMLDivElement> {
  loop?: boolean;
}

export const GlassTabsList = forwardRef<HTMLDivElement, GlassTabsListProps>(
  ({ className, loop = true, children, ...props }, ref) => {
    const { orientation, variant, listRef, ink } = useTabsContext();

    const variantStyles = {
      default: cn("glass-tabs-list", "glass-radius-xl glass-p-1 glass-gap-2"),
      pills: cn("glass-tabs-list-pills", "rounded-2xl glass-p-1.5 glass-gap-1"),
      underline: cn(
        "glass-tabs-list-underline",
        "border-b border-border/20",
        "gap-8 glass-px-1"
      ),
      minimal: cn("glass-tabs-list-minimal", "glass-gap-4"),
    };

    const shouldUseGlass = variant === "default" || variant === "pills";

    const commonA11y = {
      role: "tablist" as const,
      "aria-orientation": orientation,
      onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => {
        const isHorizontal = orientation === "horizontal";
        const prevKey = isHorizontal ? "ArrowLeft" : "ArrowUp";
        const nextKey = isHorizontal ? "ArrowRight" : "ArrowDown";
        if (
          e.key !== prevKey &&
          e.key !== nextKey &&
          e.key !== "Home" &&
          e.key !== "End"
        )
          return;
        const container = e.currentTarget;
        const tabs = Array.from(
          container.querySelectorAll<HTMLButtonElement>('[role="tab"]')
        );
        if (tabs.length === 0) return;
        const current = document.activeElement as HTMLButtonElement | null;
        let index = Math.max(
          0,
          tabs.findIndex((t) => t === current)
        );
        if (e.key === prevKey)
          index = index > 0 ? index - 1 : loop ? tabs.length - 1 : 0;
        if (e.key === nextKey)
          index =
            index < tabs.length - 1 ? index + 1 : loop ? 0 : tabs.length - 1;
        if (e.key === "Home") index = 0;
        if (e.key === "End") index = tabs.length - 1;
        const next = tabs[index];
        next?.focus();
        e.preventDefault();
      },
    };

    return shouldUseGlass ? (
      <OptimizedGlass
        ref={(node) => {
          (listRef as any).current = node as HTMLDivElement | null;
          if (typeof ref === "function") ref(node as any);
          else if (ref)
            (ref as React.MutableRefObject<HTMLDivElement | null>).current =
              node as any;
        }}
        variant="ethereal"
        elevation={"level1"}
        intensity="subtle"
        depth={1}
        tint="neutral"
        border="subtle"
        animation="none"
        performanceMode="medium"
        className={cn(
          "inline-flex items-center justify-start",
          orientation === "horizontal" ? "flex-row" : "flex-col",
          variantStyles[variant],
          variant === "pills" ? "rounded-2xl" : "glass-radius-xl",
          className
        )}
        {...(commonA11y as any)}
        {...props}
      >
        {variant === ("underline" as typeof variant) &&
          orientation === "horizontal" && (
            <div className="absolute bottom-0 left-0 right-0 h-0-5">
              <div
                className="absolute glass-h-full glass-surface-primary transition-all duration-200"
                style={{ left: ink.left, width: ink.width }}
              />
            </div>
          )}
        {children}
      </OptimizedGlass>
    ) : (
      <div
        ref={(node) => {
          (listRef as any).current = node as HTMLDivElement | null;
          if (typeof ref === "function") ref(node as any);
          else if (ref)
            (ref as React.MutableRefObject<HTMLDivElement | null>).current =
              node as any;
        }}
        className={cn(
          "inline-flex items-center justify-start",
          orientation === "horizontal" ? "flex-row" : "flex-col",
          variantStyles[variant],
          className
        )}
        {...(commonA11y as any)}
        {...props}
      >
        <div className="relative glass-w-full" />
        {children}
      </div>
    );
  }
);

GlassTabsList.displayName = "GlassTabsList";

// TabsTrigger component
export interface GlassTabsTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  icon?: React.ReactNode;
  badge?: string | number;
  disabled?: boolean;
}

export const GlassTabsTrigger = forwardRef<
  HTMLButtonElement,
  GlassTabsTriggerProps
>(
  (
    {
      value,
      icon,
      badge,
      disabled = false,
      className,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const {
      value: selectedValue,
      onValueChange,
      variant,
      activationMode,
      registerTrigger,
    } = useTabsContext();
    const isSelected = selectedValue === value;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled) {
        onValueChange(value);
        onClick?.(event);
      }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
      const tabButton = event.currentTarget;
      const tablist = tabButton.closest(
        '[role="tablist"]'
      ) as HTMLDivElement | null;
      if (!tablist) return;
      const isHorizontal =
        tablist.getAttribute("aria-orientation") !== "vertical";
      const prevKey = isHorizontal ? "ArrowLeft" : "ArrowUp";
      const nextKey = isHorizontal ? "ArrowRight" : "ArrowDown";
      const tabs = Array.from(
        tablist.querySelectorAll<HTMLButtonElement>('[role="tab"]')
      );
      const index = Math.max(
        0,
        tabs.findIndex((t) => t === tabButton)
      );
      let targetIndex = index;
      if (event.key === prevKey)
        targetIndex = index > 0 ? index - 1 : tabs.length - 1;
      if (event.key === nextKey)
        targetIndex = index < tabs.length - 1 ? index + 1 : 0;
      if (event.key === "Home") targetIndex = 0;
      if (event.key === "End") targetIndex = tabs.length - 1;
      if (targetIndex !== index) {
        const next = tabs[targetIndex];
        next?.focus();
        if (activationMode === "automatic") {
          onValueChange(next?.getAttribute("data-value") || "");
        }
        event.preventDefault();
      }
      if ((event.key === "Enter" || event.key === " ") && !disabled) {
        onValueChange(value);
        event.preventDefault();
      }
    };

    const baseStyles = cn(
      "inline-flex items-center justify-center glass-gap-2",
      "whitespace-nowrap glass-radius-lg glass-px-3 glass-py-2",
      "glass-text-sm font-medium transition-all duration-200",
      "focus-visible:outline-none focus-visible:ring-2",
      "focus-visible:ring-primary focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50"
    );

    const variantStyles = {
      default: cn(
        isSelected
          ? "bg-background/90 text-foreground shadow-md border border-border/20"
          : "glass-text-secondary hover:text-foreground hover:bg-muted/50"
      ),
      pills: cn(
        isSelected
          ? "bg-primary text-primary-foreground shadow-lg"
          : "glass-text-secondary hover:text-foreground hover:bg-background/50"
      ),
      underline: cn(
        "relative glass-px-1 glass-py-3 rounded-none",
        isSelected
          ? "text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary"
          : "glass-text-secondary hover:text-foreground"
      ),
      minimal: cn(
        "glass-px-2 glass-py-1 glass-radius-md",
        isSelected
          ? "text-primary bg-primary/10"
          : "glass-text-secondary hover:text-foreground hover:bg-muted/30"
      ),
    };

    // Convert Booleanish ARIA attributes to boolean
    const buttonProps = {
      ...props,
      "aria-pressed":
        props["aria-pressed"] === "true"
          ? true
          : props["aria-pressed"] === "false"
            ? false
            : props["aria-pressed"] === "mixed"
              ? undefined
              : props["aria-pressed"],
      "aria-expanded":
        props["aria-expanded"] === "true"
          ? true
          : props["aria-expanded"] === "false"
            ? false
            : props["aria-expanded"],
    };

    return (
      <Motion preset="scaleIn" className="relative">
        <GlassButton
          ref={(node: any) => {
            if (typeof ref === "function") ref(node);
            else if (ref)
              (
                ref as React.MutableRefObject<HTMLButtonElement | null>
              ).current = node;
            registerTrigger(value, node as HTMLButtonElement | null);
          }}
          role="tab"
          id={`trigger-${value}`}
          aria-selected={!!isSelected}
          aria-controls={`content-${value}`}
          data-value={value}
          data-state={isSelected ? "active" : "inactive"}
          className={cn(baseStyles, variantStyles[variant], className)}
          disabled={disabled}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          {...buttonProps}
        >
          {icon && <span className="shrink-0">{icon}</span>}

          {children && <span className="truncate">{children}</span>}

          {badge && (
            <span
              className={cn(
                "glass-ml-2 glass-radius-full glass-px-2 glass-py-0.5 glass-text-xs",
                isSelected
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-background/50 glass-text-secondary"
              )}
            >
              {badge}
            </span>
          )}

          {/* Active indicator for underline variant */}
          {variant === ("underline" as typeof variant) && isSelected && (
            <Motion
              preset="slideUp"
              className="absolute bottom-0 left-0 right-0 h-0-5 glass-surface-primary"
            />
          )}
        </GlassButton>
      </Motion>
    );
  }
);

GlassTabsTrigger.displayName = "GlassTabsTrigger";

// TabsContent component
export interface GlassTabsContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  forceMount?: boolean;
}

export const GlassTabsContent = forwardRef<
  HTMLDivElement,
  GlassTabsContentProps
>(({ value, forceMount = false, className, children, ...props }, ref) => {
  const { value: selectedValue } = useTabsContext();
  const isSelected = selectedValue === value;

  if (!isSelected && !forceMount) {
    return null;
  }

  return (
    <Motion
      preset="fadeIn"
      className={cn(
        "glass-tabs-content",
        "mt-6 focus-visible:outline-none",
        "focus-visible:ring-2 focus-visible:ring-primary",
        "focus-visible:ring-offset-2",
        !isSelected && "hidden",
        className
      )}
    >
      <div
        ref={ref}
        role="tabpanel"
        aria-labelledby={`trigger-${value}`}
        id={`content-${value}`}
        tabIndex={0}
        data-state={isSelected ? "active" : "inactive"}
        {...props}
      >
        {children}
      </div>
    </Motion>
  );
});

GlassTabsContent.displayName = "GlassTabsContent";

// Export all components
export {
  GlassTabs as Tabs,
  GlassTabsContent as TabsContent,
  GlassTabsList as TabsList,
  GlassTabsTrigger as TabsTrigger,
};