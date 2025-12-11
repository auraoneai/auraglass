import React, { forwardRef } from "react";
import type { CSSProperties } from "react";
import { OptimizedGlassCore as OptimizedGlass } from "../../primitives";
import { cn } from "../../lib/utilsComprehensive";
import styles from "./GlassTabBar.module.css";

type Orientation = "horizontal" | "vertical";
type TabVariant = "default" | "pills" | "underline";
type GlassVariant = "frosted" | "dynamic" | "clear" | "tinted" | "luminous";
type BlurStrength = "none" | "light" | "standard" | "heavy";

const BLUR_MAP: Record<BlurStrength, string> = {
  none: "0px",
  light: "var(--glass-blur-sm, 6px)",
  standard: "var(--glass-blur-md, 12px)",
  heavy: "var(--glass-blur-lg, 20px)",
};

const toDimension = (value?: string | number): string | undefined => {
  if (value === undefined) return undefined;
  return typeof value === "number" ? `${value}px` : value;
};

export interface TabBarContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  $orientation?: Orientation;
  $variant?: TabVariant;
  $glassVariant?: GlassVariant;
  $blurStrength?: BlurStrength;
  $elevated?: boolean;
  $background?: boolean;
  $color?: string;
  $width?: string | number;
  $height?: string | number;
  $borderRadius?: string | number;
  $iconPosition?: "top" | "left" | "right";
  $verticalDisplayMode?: "expanded" | "compact";
  $placement?: "top" | "bottom" | "left" | "right";
  $isResponsive?: boolean;
}

export const TabBarContainer = forwardRef<HTMLDivElement, TabBarContainerProps>(
  (props, ref) => {
    const {
      children,
      className,
      style,
      $orientation = "horizontal",
      $variant = "default",
      $glassVariant,
      $blurStrength = "standard",
      $elevated = false,
      $background = true,
      $color,
      $width,
      $height,
      $borderRadius,
      $iconPosition,
      $verticalDisplayMode,
      $placement,
      $isResponsive,
      ...rest
    } = props;

    const inlineStyle: CSSProperties &
      Record<string, string | number | undefined> = {
      width: toDimension($width),
      height: toDimension($height),
      ...(typeof $borderRadius !== "undefined"
        ? { borderRadius: toDimension($borderRadius) }
        : {}),
      ...style,
    };

    inlineStyle["--ag-tabbar-blur"] =
      BLUR_MAP[$blurStrength] || BLUR_MAP.standard;

    if ($background === false) {
      inlineStyle.background = "transparent";
      inlineStyle.boxShadow = "none";
      inlineStyle.border = "none";
    }

    const containerClassName = cn(
      styles.container,
      $orientation === "vertical" ? styles.vertical : styles.horizontal,
      $elevated && styles.elevated,
      $background === false && styles.noBackground,
      className
    );

    return (
      <OptimizedGlass
        ref={ref}
        intent="neutral"
        elevation={$elevated ? "level2" : "level1"}
        tier="medium"
        border="subtle"
        className={containerClassName}
        data-orientation={$orientation}
        data-variant={$variant}
        data-glass-variant={$glassVariant}
        data-icon-position={$iconPosition}
        data-display-mode={$verticalDisplayMode}
        data-placement={$placement}
        data-responsive={$isResponsive ? "true" : "false"}
        data-color={$color}
        style={{ ...(inlineStyle || {}) }}
        {...rest}
      >
        {children}
      </OptimizedGlass>
    );
  }
);

TabBarContainer.displayName = "TabBarContainer";

export interface TabSelectorProps extends React.HTMLAttributes<HTMLDivElement> {
  left: number;
  top: number;
  width: number;
  height: number;
  variant?: TabVariant;
  orientation?: Orientation;
  disableAnimation?: boolean;
  offset?: { x: number; y: number };
}

export const TabSelector = forwardRef<HTMLDivElement, TabSelectorProps>(
  (
    {
      left,
      top,
      width,
      height,
      variant = "pills",
      orientation = "horizontal",
      disableAnimation = false,
      offset,
      className,
      style,
      ...rest
    },
    ref
  ) => {
    const selectorStyle: CSSProperties &
      Record<string, string | number | undefined> = {
      left,
      top,
      width,
      height,
      ...(offset
        ? {
            transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
          }
        : {}),
      ...(disableAnimation ? { transition: "none" } : {}),
      ...style,
    };

    selectorStyle["--ag-selector-blur"] =
      "var(--ag-tabbar-blur, var(--glass-blur-md, 12px))";

    if (variant === "underline") {
      selectorStyle.borderRadius = "9999px";
      if (orientation === "horizontal") {
        selectorStyle.height = Math.max(height, 2);
      } else {
        selectorStyle.width = Math.max(width, 2);
      }
    }

    return (
      <div
        ref={ref}
        role="presentation"
        aria-hidden="true"
        className={cn(
          styles.selectorBase,
          variant === "underline" && styles.selectorUnderline,
          className
        )}
        style={{ ...selectorStyle }}
        {...rest}
      />
    );
  }
);

TabSelector.displayName = "TabSelector";
