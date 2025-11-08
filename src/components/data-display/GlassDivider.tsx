'use client';
import React, { forwardRef } from "react";
import { OptimizedGlass } from "../../primitives";
import { Motion } from "../../primitives";
import { cn } from "../../lib/utilsComprehensive";
import { useA11yId } from "../../utils/a11y";
import { useMotionPreference } from "../../hooks/useMotionPreference";
import {
  ContrastGuard,
  TextWithContrast,
} from "@/components/accessibility/ContrastGuard";

export interface GlassDividerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Orientation of the divider */
  orientation?: "horizontal" | "vertical";
  /** Visual variant */
  variant?: "default" | "gradient" | "dashed" | "dotted" | "glow" | "double";
  /** Size/thickness of the divider */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Label/content to display in the middle */
  label?: React.ReactNode;
  /** Position of the label */
  labelPosition?: "left" | "center" | "right" | "top" | "bottom";
  /** Color scheme */
  color?: "default" | "primary" | "secondary" | "muted" | "accent";
  /** Opacity level */
  opacity?: "light" | "medium" | "strong";
  /** Animation style */
  animation?: "none" | "pulse" | "shimmer" | "glow";
  /** Margin spacing */
  spacing?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  /** Custom decorative elements */
  startDecorator?: React.ReactNode;
  endDecorator?: React.ReactNode;
  /** Respect user's motion preferences */
  respectMotionPreference?: boolean;
}

export const GlassDivider = forwardRef<HTMLDivElement, GlassDividerProps>(
  (
    {
      // TODO: Integrate ContrastGuard for table cells, list items, badges, card titles, and other text content for WCAG AA compliance

      orientation = "horizontal",
      variant = "default",
      size = "sm",
      label,
      labelPosition = "center",
      color = "default",
      opacity = "medium",
      animation = "none",
      spacing = "md",
      startDecorator,
      endDecorator,
      respectMotionPreference = true,
      className,
      role = "separator",
      ...props
    },
    ref
  ) => {
    const { shouldAnimate } = useMotionPreference();
    const dividerId = useA11yId("glass-divider");

    const sizeConfig = {
      xs: {
        horizontal: "h-px",
        vertical: "w-px",
        label: "glass-text-xs glass-px-2",
      },
      sm: {
        horizontal: "h-0.5",
        vertical: "w-0.5",
        label: "glass-text-sm glass-px-3",
      },
      md: {
        horizontal: "h-1",
        vertical: "w-1",
        label: "glass-text-sm glass-px-4",
      },
      lg: {
        horizontal: "h-1.5",
        vertical: "w-1.5",
        label: "glass-text-base glass-px-4",
      },
      xl: {
        horizontal: "h-2",
        vertical: "w-2",
        label: "glass-text-lg glass-px-6",
      },
    };

    const colorConfig = {
      default: {
        base: "border-border/30 bg-border/20",
        gradient: "from-transparent via-border/40 to-transparent",
        glow: "shadow-border/20",
        text: "text-foreground",
      },
      primary: {
        base: "border-primary/30 bg-primary/20",
        gradient: "from-transparent via-primary/40 to-transparent",
        glow: "shadow-primary/20",
        text: "text-primary",
      },
      secondary: {
        base: "border-secondary/30 bg-secondary/20",
        gradient: "from-transparent via-secondary/40 to-transparent",
        glow: "shadow-secondary/20",
        text: "text-secondary",
      },
      muted: {
        base: "border-muted/30 bg-muted/20",
        gradient: "from-transparent via-muted/40 to-transparent",
        glow: "shadow-muted/20",
        text: "glass-text-secondary",
      },
      accent: {
        base: "border-accent/30 bg-accent/20",
        gradient: "from-transparent via-accent/40 to-transparent",
        glow: "shadow-accent/20",
        text: "text-accent-foreground",
      },
    };

    const opacityConfig = {
      light: "opacity-30",
      medium: "opacity-50",
      strong: "opacity-80",
    };

    const spacingConfig = {
      none: "",
      xs: "glass-my-1",
      sm: "glass-my-2",
      md: "glass-my-4",
      lg: "my-6",
      xl: "my-8",
    };

    const config = sizeConfig[size];
    const colors = colorConfig[color];

    const getDividerClass = () => {
      const baseClass = orientation === "horizontal" ? "w-full" : "h-full";
      const sizeClass =
        orientation === "horizontal" ? config.horizontal : config.vertical;

      switch (variant) {
        case "gradient":
          return cn(
            baseClass,
            sizeClass,
            "bg-gradient-to-r",
            colors.gradient,
            opacityConfig[opacity]
          );
        case "dashed":
          return cn(
            baseClass,
            orientation === "horizontal"
              ? "border-t border-dashed"
              : "border-l border-dashed",
            colors.base,
            opacityConfig[opacity]
          );
        case "dotted":
          return cn(
            baseClass,
            orientation === "horizontal"
              ? "border-t border-dotted border-2"
              : "border-l border-dotted border-2",
            colors.base,
            opacityConfig[opacity]
          );
        case "glow":
          return cn(
            baseClass,
            sizeClass,
            colors.base,
            "shadow-lg",
            colors.glow,
            opacityConfig[opacity]
          );
        case "double":
          return cn(
            baseClass,
            orientation === "horizontal"
              ? "border-t-4 border-double"
              : "border-l-4 border-double",
            colors.base,
            opacityConfig[opacity]
          );
        default:
          return cn(
            baseClass,
            sizeClass,
            colors.base,
            "glass-backdrop-blur-sm",
            opacityConfig[opacity]
          );
      }
    };

    const animationClass = {
      none: "",
      pulse: shouldAnimate && respectMotionPreference ? "animate-pulse" : "",
      shimmer:
        shouldAnimate && respectMotionPreference ? "animate-shimmer" : "",
      glow: shouldAnimate && respectMotionPreference ? "animate-glow" : "",
    };

    // Simple divider without label
    if (!label && !startDecorator && !endDecorator) {
      return (
        <Motion
          data-glass-component
          as="div"
          ref={ref}
          id={dividerId}
          preset={shouldAnimate && respectMotionPreference ? "fadeIn" : "none"}
          className={cn(
            "glass-divider",
            getDividerClass(),
            animationClass[animation],
            spacingConfig[spacing],
            className
          )}
          role={role}
          aria-orientation={orientation}
          {...props}
        />
      );
    }

    // Divider with label or decorators
    const isHorizontal = orientation === "horizontal";

    const renderDividerLine = (key: string) => (
      <div
        key={key}
        className={cn("flex-1", getDividerClass(), animationClass[animation])}
      />
    );

    const renderLabel = () => {
      if (!label) return null;

      return (
        <OptimizedGlass
          elevation="level1"
          intensity="subtle"
          depth={0.5}
          tint="neutral"
          border="subtle"
          className={cn(
            "glass-divider-label flex-shrink-0 glass-radius-full glass-backdrop-blur-md",
            "bg-background/50 border border-border/20",
            config.label,
            colors.text,
            "font-medium"
          )}
        >
          {label}
        </OptimizedGlass>
      );
    };

    if (isHorizontal) {
      // Horizontal layout
      return (
        <Motion
          as="div"
          ref={ref}
          id={dividerId}
          preset={shouldAnimate && respectMotionPreference ? "fadeIn" : "none"}
          className={cn(
            "glass-divider flex items-center",
            spacingConfig[spacing],
            className
          )}
          role={role}
          aria-orientation={orientation}
          {...props}
        >
          {startDecorator && (
            <div className="glass-flex-shrink-0 mr-3">{startDecorator}</div>
          )}

          {labelPosition === "left" && renderLabel()}
          {(labelPosition === "left" || labelPosition === "center") &&
            renderDividerLine("left")}
          {labelPosition === "center" && renderLabel()}
          {(labelPosition === "center" || labelPosition === "right") &&
            renderDividerLine("right")}
          {labelPosition === "right" && renderLabel()}

          {!label && renderDividerLine("full")}

          {endDecorator && (
            <div className="glass-flex-shrink-0 ml-3">{endDecorator}</div>
          )}
        </Motion>
      );
    } else {
      // Vertical layout
      return (
        <Motion
          as="div"
          ref={ref}
          id={dividerId}
          preset={shouldAnimate && respectMotionPreference ? "fadeIn" : "none"}
          className={cn(
            "glass-divider flex flex-col items-center",
            "glass-mx-4", // Default horizontal spacing for vertical dividers
            className
          )}
          role={role}
          aria-orientation={orientation}
          {...props}
        >
          {startDecorator && (
            <div className="glass-flex-shrink-0 mb-3">{startDecorator}</div>
          )}

          {labelPosition === "top" && renderLabel()}
          {(labelPosition === "top" || labelPosition === "center") &&
            renderDividerLine("top")}
          {labelPosition === "center" && renderLabel()}
          {(labelPosition === "center" || labelPosition === "bottom") &&
            renderDividerLine("bottom")}
          {labelPosition === "bottom" && renderLabel()}

          {!label && renderDividerLine("full")}

          {endDecorator && (
            <div className="glass-flex-shrink-0 mt-3">{endDecorator}</div>
          )}
        </Motion>
      );
    }
  }
);

GlassDivider.displayName = "GlassDivider";

// Specialized divider variants
export const GlassTextDivider = forwardRef<
  HTMLDivElement,
  Omit<GlassDividerProps, "variant"> & { text: string }
>(({ text, ...props }, ref) => (
  <GlassDivider ref={ref} variant="gradient" label={text} {...props} />
));

GlassTextDivider.displayName = "GlassTextDivider";

export const GlassIconDivider = forwardRef<
  HTMLDivElement,
  Omit<GlassDividerProps, "variant"> & { icon: React.ReactNode }
>(({ icon, ...props }, ref) => (
  <GlassDivider ref={ref} variant="gradient" label={icon} {...props} />
));

GlassIconDivider.displayName = "GlassIconDivider";

export default GlassDivider;