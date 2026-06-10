"use client";

import React from "react";
import { Check, ChevronDown, ChevronUp } from "../../icons";
import { DismissableLayer, Motion, Portal, Positioner } from "../../primitives";
import { cn } from "@/lib/utils";

type SelectContextValue = {
  value?: string;
  selectedLabel?: React.ReactNode;
  open: boolean;
  disabled?: boolean;
  triggerRef: React.MutableRefObject<HTMLButtonElement | null>;
  contentId: string;
  setOpen: (open: boolean) => void;
  setValue: (value: string, label: React.ReactNode) => void;
  registerItem: (value: string, label: React.ReactNode) => void;
  selectByTextPrefix: (prefix: string) => boolean;
};

const SelectContext = React.createContext<SelectContextValue | null>(null);

const useSelectContext = () => {
  const context = React.useContext(SelectContext);
  if (!context) {
    throw new Error("GlassSelect components must be used within GlassSelect");
  }
  return context;
};

const useControllableState = <T,>({
  prop,
  defaultProp,
  onChange,
}: {
  prop?: T;
  defaultProp?: T;
  onChange?: (value: T) => void;
}) => {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultProp);
  const isControlled = prop !== undefined;
  const value = isControlled ? prop : uncontrolledValue;

  const setValue = React.useCallback(
    (nextValue: T) => {
      if (!isControlled) {
        setUncontrolledValue(nextValue);
      }
      onChange?.(nextValue);
    },
    [isControlled, onChange]
  );

  return [value, setValue] as const;
};

const getTextFromNode = (node: React.ReactNode): string => {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(getTextFromNode).join("");
  }
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return getTextFromNode(node.props.children);
  }
  return "";
};

// Main Select Root
export interface GlassSelectProps {
  children?: React.ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  "data-testid"?: string;
}

const GlassSelect = ({
  children,
  value,
  defaultValue,
  onValueChange,
  open,
  defaultOpen,
  onOpenChange,
  disabled,
  required,
  name,
  "data-testid": dataTestId,
}: GlassSelectProps) => {
  const [resolvedValue, setResolvedValue] = useControllableState<string>({
    prop: value,
    defaultProp: defaultValue,
    onChange: onValueChange,
  });
  const [resolvedOpen = false, setResolvedOpen] = useControllableState<boolean>(
    {
      prop: open,
      defaultProp: defaultOpen ?? false,
      onChange: onOpenChange,
    }
  );
  const [selectedLabel, setSelectedLabel] = React.useState<React.ReactNode>();
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const contentId = React.useId();
  const labelsRef = React.useRef<Map<string, React.ReactNode>>(new Map());

  const setValue = React.useCallback(
    (nextValue: string, label: React.ReactNode) => {
      setSelectedLabel(label);
      setResolvedValue(nextValue);
    },
    [setResolvedValue]
  );

  const registerItem = React.useCallback(
    (itemValue: string, label: React.ReactNode) => {
      labelsRef.current.set(itemValue, label);
      if (itemValue === resolvedValue) {
        setSelectedLabel(label);
      }
    },
    [resolvedValue]
  );

  const selectByTextPrefix = React.useCallback(
    (prefix: string) => {
      const normalizedPrefix = prefix.trim().toLowerCase();
      if (!normalizedPrefix) return false;

      for (const [itemValue, itemLabel] of labelsRef.current.entries()) {
        const label = getTextFromNode(itemLabel).toLowerCase();
        if (label.startsWith(normalizedPrefix)) {
          setValue(itemValue, itemLabel);
          return true;
        }
      }

      return false;
    },
    [setValue]
  );

  const context = React.useMemo(
    () => ({
      value: resolvedValue,
      selectedLabel:
        selectedLabel ?? labelsRef.current.get(resolvedValue ?? ""),
      open: resolvedOpen,
      disabled,
      triggerRef,
      contentId,
      setOpen: setResolvedOpen,
      setValue,
      registerItem,
      selectByTextPrefix,
    }),
    [
      contentId,
      disabled,
      registerItem,
      resolvedOpen,
      resolvedValue,
      selectedLabel,
      setResolvedOpen,
      setValue,
      selectByTextPrefix,
    ]
  );

  return (
    <SelectContext.Provider value={context}>
      <>
        {name && (
          <input
            type="hidden"
            name={name}
            value={resolvedValue ?? ""}
            required={required}
            disabled={disabled}
          />
        )}
        {children}
      </>
    </SelectContext.Provider>
  );
};

// Select Group
const GlassSelectGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => <div ref={ref} role="group" {...props} />);
GlassSelectGroup.displayName = "GlassSelectGroup";

// Select Value
export interface GlassSelectValueProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  placeholder?: React.ReactNode;
}

const GlassSelectValue = React.forwardRef<
  HTMLSpanElement,
  GlassSelectValueProps
>(({ placeholder, children, style, ...props }, ref) => {
  const { selectedLabel, value } = useSelectContext();
  const body = children ?? selectedLabel ?? value ?? placeholder;

  return (
    <span ref={ref} style={{ pointerEvents: "none", ...style }} {...props}>
      {body}
    </span>
  );
});
GlassSelectValue.displayName = "GlassSelectValue";

// Glass Select Trigger
export interface GlassSelectTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Visual variant */
  variant?: "default" | "filled" | "outlined" | "minimal";
  /** Error state */
  error?: boolean;
}

const GlassSelectTrigger = React.forwardRef<
  HTMLButtonElement,
  GlassSelectTriggerProps
>(
  (
    {
      className,
      children,
      size = "md",
      variant = "default",
      error = false,
      onClick,
      onKeyDown,
      disabled,
      ...props
    },
    ref
  ) => {
    const context = useSelectContext();

    const setRef = React.useCallback(
      (node: HTMLButtonElement | null) => {
        context.triggerRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLButtonElement | null>).current =
            node;
        }
      },
      [context.triggerRef, ref]
    );

    const sizeConfig = {
      sm: "h-8 glass-px-2 glass-py-1 glass-text-xs",
      md: "h-10 glass-px-3 glass-py-2 glass-text-sm",
      lg: "h-12 glass-px-4 glass-py-3 glass-text-base",
    };

    const variantConfig = {
      default: cn(
        "bg-background/50 border border-border/20",
        "focus:border-primary focus:ring-1 focus:ring-primary"
      ),
      filled: cn(
        "bg-muted/50 border border-transparent",
        "focus:bg-background/50 focus:border-primary"
      ),
      outlined: cn(
        "bg-transparent border-2 border-border/20",
        "focus:border-primary"
      ),
      minimal: cn(
        "bg-transparent border-0 border-b border-border/20 rounded-none",
        "focus:border-primary"
      ),
    };

    const isDisabled = disabled || context.disabled;

    return (
      <button
        data-glass-component
        ref={setRef}
        type="button"
        className={cn(
          "glass-select-trigger group flex w-full items-center justify-between",
          "glass-radius-lg glass-backdrop-blur-md transition-all duration-200",
          "text-foreground placeholder:glass-text-secondary",
          "focus:outline-none focus:ring-offset-2 focus:ring-offset-background",
          "glass-disabled-cursor-not-allowed disabled:opacity-50",
          "[&>span]:line-clamp-1",
          sizeConfig[size],
          variantConfig[variant],
          error && "border-red-400 focus:border-red-400 focus:ring-red-400",
          className
        )}
        aria-label="Select option"
        aria-autocomplete="none"
        aria-expanded={context.open}
        aria-controls={context.contentId}
        role="combobox"
        data-state={context.open ? "open" : "closed"}
        data-placeholder={context.value ? undefined : ""}
        dir="ltr"
        disabled={isDisabled}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented && !isDisabled) {
            context.setOpen(!context.open);
          }
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (event.defaultPrevented || isDisabled) return;

          if (
            event.key === "Enter" ||
            event.key === " " ||
            event.key === "ArrowDown"
          ) {
            event.preventDefault();
            context.setOpen(true);
          } else if (
            event.key.length === 1 &&
            !event.metaKey &&
            !event.ctrlKey
          ) {
            if (context.selectByTextPrefix(event.key)) {
              event.preventDefault();
            }
          }
        }}
        {...props}
      >
        {children}
        <ChevronDown className="glass-h-4 glass-w-4 glass-opacity-50 glass-transition-transform glass-group-data-[state=open]:rotate-180" />
      </button>
    );
  }
);
GlassSelectTrigger.displayName = "GlassSelectTrigger";

// Glass Select Content
export interface GlassSelectContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Content variant */
  variant?: "default" | "minimal";
  /** Optional portal container. */
  portalContainer?: HTMLElement | null;
  /** Whether to portal content. Defaults to true. */
  portalled?: boolean;
  /** Overlay positioning strategy. */
  positionStrategy?: "fixed" | "absolute" | "contained";
  /** Render content without a portal for constrained surfaces. */
  contained?: boolean;
  position?: "popper" | "item-aligned";
  sideOffset?: number;
}

const GlassSelectContent = React.forwardRef<
  HTMLDivElement,
  GlassSelectContentProps
>(
  (
    {
      className,
      children,
      position = "popper",
      variant: _variant = "default",
      portalContainer,
      portalled = true,
      positionStrategy = "fixed",
      contained = false,
      sideOffset = 4,
      ...props
    },
    ref
  ) => {
    const context = useSelectContext();
    const isContained =
      contained || portalled === false || positionStrategy === "contained";

    if (!context.open) return null;

    const content = (
      <Motion preset="scaleIn">
        <Positioner
          anchorRef={context.triggerRef}
          side="bottom"
          align="start"
          sideOffset={isContained ? 0 : sideOffset}
          contained={isContained}
          strategy={positionStrategy === "absolute" ? "absolute" : "fixed"}
        >
          <DismissableLayer
            ref={ref}
            id={context.contentId}
            role="listbox"
            onDismiss={() => context.setOpen(false)}
            className={cn(
              "glass-select-content relative z-50 max-h-96 min-w-[8rem] overflow-hidden",
              "glass-backdrop-blur-lg bg-white/10 ring-1 ring-white/15",
              "glass-radius-xl shadow-2xl shadow-black/40",
              "text-foreground",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
              "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
              "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
              "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
              position === "popper" && [
                "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1",
                "data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
              ],
              className
            )}
            data-state="open"
            data-side="bottom"
            data-position-strategy={
              isContained ? "contained" : positionStrategy
            }
            {...props}
          >
            <GlassSelectScrollUpButton />
            <div
              className={cn(
                "glass-p-1",
                position === "popper" && [
                  "h-[var(--radix-select-trigger-height)] w-full",
                  "min-w-[var(--radix-select-trigger-width)]",
                ]
              )}
            >
              {children}
            </div>
            <GlassSelectScrollDownButton />
          </DismissableLayer>
        </Positioner>
      </Motion>
    );

    if (isContained) return content;
    return <Portal container={portalContainer}>{content}</Portal>;
  }
);
GlassSelectContent.displayName = "GlassSelectContent";

// Glass Select Item
export interface GlassSelectItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Item variant */
  variant?: "default" | "ghost";
  value: string;
  disabled?: boolean;
  textValue?: string;
}

const GlassSelectItem = React.forwardRef<HTMLDivElement, GlassSelectItemProps>(
  (
    {
      className,
      children,
      variant = "default",
      value,
      disabled = false,
      textValue,
      onClick,
      ...props
    },
    ref
  ) => {
    const context = useSelectContext();
    const selected = context.value === value;
    const label = textValue ?? getTextFromNode(children) ?? value;

    React.useEffect(() => {
      context.registerItem(value, label);
    }, [context, label, value]);

    const variantStyles = {
      default: cn(
        "focus:bg-muted/50 focus:text-foreground",
        "data-[highlighted]:bg-muted/50 data-[highlighted]:text-foreground"
      ),
      ghost: cn(
        "focus:bg-primary/10 focus:text-primary",
        "data-[highlighted]:bg-primary/10 data-[highlighted]:text-primary"
      ),
    };

    return (
      <div
        ref={ref}
        role="option"
        aria-selected={selected}
        aria-disabled={disabled || undefined}
        data-state={selected ? "checked" : "unchecked"}
        data-disabled={disabled ? "" : undefined}
        tabIndex={disabled ? undefined : -1}
        className={cn(
          "glass-select-item relative flex w-full cursor-pointer select-none items-center",
          "glass-radius-lg glass-py-2 pl-8 pr-2 glass-text-sm outline-none transition-all duration-150",
          "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          variantStyles[variant],
          className
        )}
        onClick={(event) => {
          onClick?.(event);
          if (event.defaultPrevented || disabled) return;
          context.setValue(value, label);
          context.setOpen(false);
          context.triggerRef.current?.focus();
        }}
        {...props}
      >
        <span className="glass-absolute glass-left-2 glass-flex glass-h-3-5 glass-w-3-5 glass-items-center glass-justify-center">
          {selected && <Check className="glass-h-4 glass-w-4" />}
        </span>

        <span>{children}</span>
      </div>
    );
  }
);
GlassSelectItem.displayName = "GlassSelectItem";

// Glass Select Label
const GlassSelectLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "glass-select-label glass-py-1.5 pl-8 pr-2 glass-text-sm font-semibold glass-text-secondary",
      className
    )}
    {...props}
  />
));
GlassSelectLabel.displayName = "GlassSelectLabel";

// Glass Select Separator
const GlassSelectSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="separator"
    className={cn(
      "glass-select-separator -glass-mx-1 glass-my-1 h-px bg-border/20",
      className
    )}
    {...props}
  />
));
GlassSelectSeparator.displayName = "GlassSelectSeparator";

// Glass Select Scroll Buttons
const GlassSelectScrollUpButton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    aria-hidden="true"
    className={cn(
      "glass-select-scroll-up flex cursor-default items-center justify-center glass-py-1",
      "glass-text-secondary hover:text-foreground transition-colors",
      className
    )}
    {...props}
  >
    <ChevronUp className="glass-h-4 glass-w-4" />
  </div>
));
GlassSelectScrollUpButton.displayName = "GlassSelectScrollUpButton";

const GlassSelectScrollDownButton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    aria-hidden="true"
    className={cn(
      "glass-select-scroll-down flex cursor-default items-center justify-center glass-py-1",
      "glass-text-secondary hover:text-foreground transition-colors",
      className
    )}
    {...props}
  >
    <ChevronDown className="glass-h-4 glass-w-4" />
  </div>
));
GlassSelectScrollDownButton.displayName = "GlassSelectScrollDownButton";

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

type GlassSelectCompoundType = typeof GlassSelect & {
  Trigger: typeof GlassSelectTrigger;
  Content: typeof GlassSelectContent;
  Item: typeof GlassSelectItem;
  Label: typeof GlassSelectLabel;
  Separator: typeof GlassSelectSeparator;
  ScrollUpButton: typeof GlassSelectScrollUpButton;
  ScrollDownButton: typeof GlassSelectScrollDownButton;
  Group: typeof GlassSelectGroup;
  Value: typeof GlassSelectValue;
};

const GlassSelectCompound = GlassSelect as GlassSelectCompoundType;
GlassSelectCompound.Trigger = GlassSelectTrigger;
GlassSelectCompound.Content = GlassSelectContent;
GlassSelectCompound.Item = GlassSelectItem;
GlassSelectCompound.Label = GlassSelectLabel;
GlassSelectCompound.Separator = GlassSelectSeparator;
GlassSelectCompound.ScrollUpButton = GlassSelectScrollUpButton;
GlassSelectCompound.ScrollDownButton = GlassSelectScrollDownButton;
GlassSelectCompound.Group = GlassSelectGroup;
GlassSelectCompound.Value = GlassSelectValue;

export { GlassSelectCompound };

export default GlassSelectCompound;
