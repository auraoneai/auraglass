import React from "react";
import { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { ANIMATION, BORDER_RADIUS } from "../../../tokens/designConstants";

import styles from "./TooltipStyles.module.css";

export interface TooltipStyles {
  container: CSSProperties;
  header: CSSProperties;
  body: CSSProperties;
  footer: CSSProperties;
  label: CSSProperties;
  value: CSSProperties;
  separator: CSSProperties;
  arrow: CSSProperties;
}

export interface TooltipPosition {
  x: number;
  y: number;
  placement: "top" | "bottom" | "left" | "right" | "auto";
}

const getSizeMultiplier = (size: "small" | "medium" | "large") => {
  switch (size) {
    case "small":
      return 0.8;
    case "large":
      return 1.2;
    default:
      return 1;
  }
};

const getThemeBackground = (theme: "light" | "dark" | "glass") => {
  switch (theme) {
    case "glass":
      return "color-mix(in srgb, var(--aura-color-glass-overlay) 92%, color-mix(in srgb, var(--glass-black) 82%, transparent))";
    case "dark":
      return "var(--glass-gray-800)";
    default:
      return "var(--aura-color-global-surface)";
  }
};

const getThemeBorder = (theme: "light" | "dark" | "glass") =>
  theme === "glass"
    ? "1px solid color-mix(in srgb, var(--aura-color-global-border-soft) 70%, transparent)"
    : "1px solid color-mix(in srgb, var(--aura-color-global-border-strong) 65%, transparent)";

const getThemeShadow = (theme: "light" | "dark" | "glass") =>
  theme === "glass"
    ? "0 20px 48px color-mix(in srgb, var(--glass-black) 32%, transparent)"
    : "0 12px 32px color-mix(in srgb, var(--glass-black) 22%, transparent)";

interface GlassTooltipContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  $theme?: "light" | "dark" | "glass";
  $size?: "small" | "medium" | "large";
  $position?: TooltipPosition;
  $animated?: boolean;
}

export const GlassTooltipContainer: React.FC<GlassTooltipContainerProps> = ({
  $theme = "glass",
  $size = "medium",
  $position,
  $animated = true,
  className,
  style,
  children,
  ...rest
}) => {
  const multiplier = getSizeMultiplier($size);
  const transform = $position
    ? `translate(${$position.x}px, ${$position.y}px)`
    : "translate(-50%, -100%)";

  return (
    <div
      className={cn(styles.tooltip, className)}
      style={{
        fontSize: `${12 * multiplier}px`,
        padding: `${8 * multiplier}px ${12 * multiplier}px`,
        borderRadius: `${8 * multiplier}px`,
        minWidth: `${120 * multiplier}px`,
        maxWidth: `${280 * multiplier}px`,
        background: getThemeBackground($theme),
        border: getThemeBorder($theme),
        boxShadow: getThemeShadow($theme),
        transform,
        transition: $animated ? undefined : "none",
        ...style,
      }}
      {...rest}
    >
      {children}
      <span
        className={styles.tooltipArrow}
        style={{ borderTopColor: getThemeBackground($theme) }}
      />
    </div>
  );
};

interface TooltipHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  $theme?: "light" | "dark" | "glass";
  $size?: "small" | "medium" | "large";
}

export const TooltipHeader: React.FC<TooltipHeaderProps> = ({
  $theme = "glass",
  $size = "medium",
  className,
  style,
  ...props
}) => {
  const multiplier = getSizeMultiplier($size);
  return (
    <div
      className={cn(styles.tooltipHeader, className)}
      style={{
        fontSize: `${14 * multiplier}px`,
        color:
          $theme === "light"
            ? "var(--glass-gray-900)"
            : "var(--aura-color-global-text-inverse)",
        ...style,
      }}
      {...props}
    />
  );
};

interface TooltipBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  $size?: "small" | "medium" | "large";
}

export const TooltipBody: React.FC<TooltipBodyProps> = ({
  $size = "medium",
  className,
  style,
  ...props
}) => {
  const multiplier = getSizeMultiplier($size);
  return (
    <div
      className={cn(styles.tooltipBody, className)}
      style={{ gap: `${4 * multiplier}px`, ...style }}
      {...props}
    />
  );
};

export const TooltipItem: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => <div className={cn(styles.tooltipItem, className)} {...props} />;

interface TooltipLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  $theme?: "light" | "dark" | "glass";
  $size?: "small" | "medium" | "large";
}

export const TooltipLabel: React.FC<TooltipLabelProps> = ({
  $theme = "glass",
  $size = "medium",
  className,
  style,
  ...props
}) => {
  const multiplier = getSizeMultiplier($size);
  return (
    <span
      className={cn(styles.tooltipLabel, className)}
      style={{
        fontSize: `${11 * multiplier}px`,
        color:
          $theme === "light"
            ? "var(--glass-gray-600)"
            : "var(--glass-gray-300)",
        ...style,
      }}
      {...props}
    />
  );
};

interface TooltipValueProps extends React.HTMLAttributes<HTMLSpanElement> {
  $theme?: "light" | "dark" | "glass";
  $size?: "small" | "medium" | "large";
  $color?: string;
}

export const TooltipValue: React.FC<TooltipValueProps> = ({
  $theme = "glass",
  $size = "medium",
  $color,
  className,
  style,
  ...props
}) => {
  const multiplier = getSizeMultiplier($size);
  return (
    <span
      className={cn(styles.tooltipValue, className)}
      style={{
        fontSize: `${13 * multiplier}px`,
        color:
          $color ||
          ($theme === "light"
            ? "var(--glass-gray-900)"
            : "var(--aura-color-global-text-inverse)"),
        ...style,
      }}
      {...props}
    />
  );
};

interface TooltipSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  $theme?: "light" | "dark" | "glass";
  $size?: "small" | "medium" | "large";
}

export const TooltipSeparator: React.FC<TooltipSeparatorProps> = ({
  $theme = "glass",
  $size = "medium",
  className,
  style,
  ...props
}) => {
  const multiplier = getSizeMultiplier($size);
  const background =
    $theme === "glass"
      ? "color-mix(in srgb, var(--aura-color-global-border-soft) 65%, transparent)"
      : $theme === "dark"
        ? "var(--glass-gray-600)"
        : "var(--glass-gray-300)";
  return (
    <div
      className={cn(styles.tooltipSeparator, className)}
      style={{
        background,
        margin: `${6 * multiplier}px 0`,
        ...style,
      }}
      {...props}
    />
  );
};

interface TooltipFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  $theme?: "light" | "dark" | "glass";
  $size?: "small" | "medium" | "large";
}

export const TooltipFooter: React.FC<TooltipFooterProps> = ({
  $theme = "glass",
  $size = "medium",
  className,
  style,
  ...props
}) => {
  const multiplier = getSizeMultiplier($size);
  return (
    <div
      className={cn(styles.tooltipFooter, className)}
      style={{
        fontSize: `${10 * multiplier}px`,
        color:
          $theme === "light"
            ? "var(--glass-gray-600)"
            : "var(--glass-gray-300)",
        ...style,
      }}
      {...props}
    />
  );
};

export const createTooltipStyles = (
  theme: "light" | "dark" | "glass" = "glass",
  size: "small" | "medium" | "large" = "medium"
): TooltipStyles => {
  const sizeMultipliers = {
    small: 0.8,
    medium: 1,
    large: 1.2,
  };

  const multiplier = sizeMultipliers[size];

  const baseStyles: TooltipStyles = {
    container: {
      position: "absolute" as const,
      zIndex: 1000,
      pointerEvents: "none",
      fontFamily: "system-ui, -apple-system, sans-serif",
      fontSize: `${12 * multiplier}px`,
      borderRadius: `${8 * multiplier}px`,
      boxShadow:
        theme === "glass"
          ? "0 8px 32px color-mix(in srgb, var(--glass-black) var(--glass-opacity-30), transparent), 0 0 0 1px color-mix(in srgb, var(--glass-white) var(--glass-opacity-20), transparent)"
          : "0 4px 12px color-mix(in srgb, var(--glass-black) var(--glass-opacity-15), transparent)",
      // Use createGlassStyle() instead,
      background:
        theme === "glass"
          ? "color-mix(in srgb, var(--glass-black) 85%, transparent)"
          : theme === "dark"
            ? "var(--glass-gray-800)"
            : "var(--glass-white)",
      border:
        theme === "glass"
          ? "1px solid color-mix(in srgb, var(--glass-white) 20%, transparent)"
          : "1px solid var(--glass-gray-300)",
      color: theme === "dark" ? "var(--glass-white)" : "var(--glass-gray-900)",
      padding: `${8 * multiplier}px ${12 * multiplier}px`,
      minWidth: `${120 * multiplier}px`,
      maxWidth: `${280 * multiplier}px`,
      whiteSpace: "nowrap" as const,
      overflow: "hidden",
      textOverflow: "ellipsis",
      transform: "translate(-50%, -100%)",
      marginTop: `-${8 * multiplier}px`,
    },
    header: {
      fontSize: `${14 * multiplier}px`,
      fontWeight: 600,
      marginBottom: `${4 * multiplier}px`,
      color:
        theme === "glass"
          ? "var(--glass-white)"
          : theme === "dark"
            ? "var(--glass-white)"
            : "var(--glass-gray-900)",
      borderBottom:
        theme === "glass"
          ? "1px solid color-mix(in srgb, var(--glass-white) var(--glass-opacity-20), transparent)"
          : "1px solid var(--glass-gray-300)",
      paddingBottom: `${4 * multiplier}px`,
    },
    body: {
      display: "flex",
      flexDirection: "column" as const,
      gap: `${4 * multiplier}px`,
    },
    footer: {
      marginTop: `${8 * multiplier}px`,
      paddingTop: `${4 * multiplier}px`,
      borderTop:
        theme === "glass"
          ? "1px solid color-mix(in srgb, var(--glass-white) var(--glass-opacity-20), transparent)"
          : "1px solid var(--glass-gray-300)",
      fontSize: `${10 * multiplier}px`,
      color:
        theme === "dark" ? "var(--glass-gray-300)" : "var(--glass-gray-600)",
      textAlign: "center" as const,
    },
    label: {
      fontSize: `${11 * multiplier}px`,
      color:
        theme === "dark" ? "var(--glass-gray-300)" : "var(--glass-gray-600)",
      marginBottom: `${2 * multiplier}px`,
      fontWeight: 500,
    },
    value: {
      fontSize: `${13 * multiplier}px`,
      fontWeight: 600,
      color:
        theme === "glass"
          ? "var(--glass-white)"
          : theme === "dark"
            ? "var(--glass-white)"
            : "var(--glass-gray-900)",
    },
    separator: {
      height: "1px",
      background:
        theme === "glass"
          ? "color-mix(in srgb, var(--glass-white) 20%, transparent)"
          : theme === "dark"
            ? "var(--glass-gray-600)"
            : "var(--glass-gray-300)",
      margin: `${6 * multiplier}px 0`,
    },
    arrow: {
      position: "absolute" as const,
      width: 0,
      height: 0,
      borderLeft: `${6 * multiplier}px solid transparent`,
      borderRight: `${6 * multiplier}px solid transparent`,
      borderTop: `${6 * multiplier}px solid`,
      borderTopColor:
        theme === "glass"
          ? "color-mix(in srgb, var(--glass-black) 85%, transparent)"
          : theme === "dark"
            ? "var(--glass-gray-800)"
            : "var(--glass-white)",
      bottom: `-${6 * multiplier}px`,
      left: "50%",
      transform: "translateX(-50%)",
    },
  };

  return baseStyles;
};

export const calculateTooltipPosition = (
  mouseX: number,
  mouseY: number,
  tooltipWidth: number,
  tooltipHeight: number,
  containerRect: DOMRect,
  offset: number = ANIMATION.DURATION.fast / 15
): TooltipPosition => {
  const centerX = mouseX;
  const centerY = mouseY;

  let x = centerX;
  let y = centerY - tooltipHeight - offset;
  let placement: "top" | "bottom" | "left" | "right" | "auto" = "top";

  // Check if tooltip fits above
  if (y < containerRect.top) {
    y = centerY + offset;
    placement = "bottom";
  }

  // Check horizontal bounds
  if (x - tooltipWidth / 2 < containerRect.left) {
    x = containerRect.left + tooltipWidth / 2;
  } else if (x + tooltipWidth / 2 > containerRect.right) {
    x = containerRect.right - tooltipWidth / 2;
  }

  return { x, y, placement };
};

export const formatTooltipValue = (
  value: number | string,
  format: "number" | "currency" | "percentage" | "string" = "number",
  options?: Intl.NumberFormatOptions
): string => {
  if (typeof value === "string") return value;

  switch (format) {
    case "currency":
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        ...options,
      }).format(value);

    case "percentage":
      return new Intl.NumberFormat("en-US", {
        style: "percent",
        minimumFractionDigits: 1,
        maximumFractionDigits: 2,
        ...options,
      }).format(value / 100);

    case "number":
      return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
        ...options,
      }).format(value);

    default:
      return String(value);
  }
};
