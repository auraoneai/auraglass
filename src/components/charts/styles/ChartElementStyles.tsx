import React, { forwardRef } from "react";
import { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { BORDER_RADIUS } from "../../../tokens/designConstants";

import styles from "./ChartElementStyles.module.css";
import { createGlassStyle } from "../../../core/mixins/glassMixins";
export interface ChartElementStyles {
  line: CSSProperties;
  area: CSSProperties;
  bar: CSSProperties;
  pie: CSSProperties;
  scatter: CSSProperties;
  axis: {
    line: CSSProperties;
    text: CSSProperties;
    tick: CSSProperties;
  };
  dataPoint: CSSProperties;
  gradient: {
    start: string;
    end: string;
    stops: Array<{ offset: string; color: string }>;
  };
}

export const createChartElementStyles = (
  theme: "light" | "dark" | "glass" = "glass",
  colorScheme: string[] = [
    "var(--glass-color-primary)",
    "var(--glass-color-danger)",
    "var(--glass-color-success)",
    "var(--glass-color-warning)",
    "var(--glass-color-secondary)",
  ]
): ChartElementStyles => {
  const baseStyles: ChartElementStyles = {
    line: {
      strokeWidth: 2,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const,
      fill: "none",
    },
    area: {
      strokeWidth: 2,
      fillOpacity: 0.3,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const,
    },
    bar: {
      strokeWidth: 0,
      rx: parseFloat(BORDER_RADIUS.sm),
      ry: parseFloat(BORDER_RADIUS.sm),
    } as any,
    pie: {
      strokeWidth: 2,
      stroke:
        theme === "glass"
          ? "color-mix(in srgb, var(--glass-white) 20%, transparent)"
          : theme === "dark"
            ? "var(--glass-gray-700)"
            : "var(--glass-white)",
    },
    scatter: {
      r: 4,
      strokeWidth: 2,
      fillOpacity: 0.8,
    } as any,
    axis: {
      line: {
        stroke:
          theme === "dark" ? "var(--glass-gray-600)" : "var(--glass-gray-300)",
        strokeWidth: 1,
      },
      text: {
        fontSize: "12px",
        fontWeight: 400,
        fill:
          theme === "dark" ? "var(--glass-gray-300)" : "var(--glass-gray-600)",
      },
      tick: {
        stroke:
          theme === "dark" ? "var(--glass-gray-600)" : "var(--glass-gray-400)",
        strokeWidth: 1,
      },
    },
    dataPoint: {
      r: 3,
      strokeWidth: 2,
      fillOpacity: 0.9,
      cursor: "pointer",
    } as any,
    gradient: {
      start: "var(--glass-color-primary, 0.2)",
      end: "var(--glass-color-primary, 0.05)",
      stops: [
        { offset: "0%", color: "var(--glass-color-primary, 0.2)" },
        { offset: "100%", color: "var(--glass-color-primary, 0.05)" },
      ],
    },
  };

  // Apply theme-specific color adjustments
  if (theme === "glass") {
    baseStyles.line.stroke = colorScheme[0];
    baseStyles.area.fill = `url(#area-gradient-${theme})`;
    baseStyles.bar.fill = colorScheme[0];
    baseStyles.pie.fill = colorScheme[0];
    baseStyles.scatter.fill = colorScheme[0];
    baseStyles.scatter.stroke = "var(--glass-border-hover)";
    baseStyles.dataPoint.stroke = "var(--glass-border-hover)";
  } else if (theme === "dark") {
    baseStyles.line.stroke = colorScheme[0];
    baseStyles.area.fill = colorScheme[0];
    baseStyles.bar.fill = colorScheme[0];
    baseStyles.pie.fill = colorScheme[0];
    baseStyles.scatter.fill = colorScheme[0];
    baseStyles.scatter.stroke = "var(--glass-white)";
    baseStyles.dataPoint.stroke = "var(--glass-white)";
  } else {
    baseStyles.line.stroke = colorScheme[0];
    baseStyles.area.fill = colorScheme[0];
    baseStyles.bar.fill = colorScheme[0];
    baseStyles.pie.fill = colorScheme[0];
    baseStyles.scatter.fill = colorScheme[0];
    baseStyles.scatter.stroke = "var(--glass-white)";
    baseStyles.dataPoint.stroke = "var(--glass-white)";
  }

  return baseStyles;
};

// Toolbar primitives
export const ChartToolbar: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => <div className={cn(styles.toolbar, className)} {...props} />;

export const ChartTypeSelector: React.FC<
  React.HTMLAttributes<HTMLDivElement>
> = ({ className, ...props }) => (
  <div className={cn(styles.typeSelector, className)} {...props} />
);

interface TypeButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  $active?: boolean;
}

export const TypeButton: React.FC<TypeButtonProps> = ({
  $active,
  className,
  ...props
}) => (
  <button
    className={cn(
      styles.typeButton,
      $active && styles.typeButtonActive,
      className
    )}
    {...props}
  />
);

export const ToolbarButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ className, ...props }) => (
  <button className={cn(styles.toolbarButton, className)} {...props} />
);

export const EnhancedExportButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ className, children, ...props }) => (
  <button
    className={cn(styles.toolbarButton, styles.toolbarButtonExport, className)}
    {...props}
  >
    <span aria-hidden="true" role="img">
      📥
    </span>
    {children}
  </button>
);

interface ChartLegendProps extends React.HTMLAttributes<HTMLDivElement> {
  $position?: "top" | "bottom" | "left" | "right";
  $style?: "default" | "compact" | "minimal";
  $glassEffect?: boolean;
}

export const ChartLegend = forwardRef<HTMLDivElement, ChartLegendProps>(
  (
    { $position, $style, $glassEffect, className, style: styleProp, ...props },
    ref
  ) => {
    const layoutStyle: React.CSSProperties = { ...(styleProp || {}) };
    switch ($position) {
      case "top":
        layoutStyle.marginBottom = "var(--aura-space-4)";
        layoutStyle.marginTop = "0";
        layoutStyle.justifyContent = "center";
        break;
      case "bottom":
        layoutStyle.marginTop = "var(--aura-space-4)";
        layoutStyle.justifyContent = "center";
        break;
      case "left":
        layoutStyle.flexDirection = "column";
        layoutStyle.marginRight = "var(--aura-space-4)";
        break;
      case "right":
        layoutStyle.flexDirection = "column";
        layoutStyle.marginLeft = "var(--aura-space-4)";
        break;
      default:
        layoutStyle.marginTop = layoutStyle.marginTop || "var(--aura-space-4)";
        break;
    }

    return (
      <div
        ref={ref}
        className={cn(
          styles.legend,
          $glassEffect && styles.legendGlass,
          className
        )}
        style={{ ...layoutStyle }}
        {...props}
      />
    );
  }
);
ChartLegend.displayName = "ChartLegend";

interface LegendItemProps extends React.HTMLAttributes<HTMLDivElement> {
  $color?: string;
  $style?: "default" | "compact" | "minimal";
  $active?: boolean;
}

export const LegendItem: React.FC<LegendItemProps> = ({
  $active = true,
  $style,
  $color,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        styles.legendItem,
        !$active && styles.legendInactive,
        className
      )}
      {...props}
    />
  );
};

interface LegendColorProps extends React.HTMLAttributes<HTMLDivElement> {
  $color?: string;
  $active?: boolean;
}

export const LegendColor: React.FC<LegendColorProps> = ({
  $color,
  $active = true,
  className,
  style,
  ...props
}) => {
  return (
    <div
      className={cn(styles.legendColor, className)}
      style={{
        background: $color || "var(--glass-color-primary)",
        opacity: $active ? 1 : 0.5,
        ...style,
      }}
      {...props}
    />
  );
};

interface LegendLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  $active?: boolean;
}

export const LegendLabel: React.FC<LegendLabelProps> = ({
  $active = true,
  className,
  style,
  ...props
}) => {
  return (
    <span
      className={cn(styles.legendLabel, className)}
      style={{ opacity: $active ? 1 : 0.6, ...style }}
      {...props}
    />
  );
};

export const getColorPalette = (
  theme: "light" | "dark" | "glass" = "glass"
): string[] => {
  if (theme === "glass") {
    return [
      "var(--glass-color-primary)", // Blue
      "var(--glass-color-danger)", // Red
      "var(--glass-color-success)", // Green
      "var(--glass-color-warning)", // Yellow
      "var(--glass-color-secondary)", // Purple
      "var(--glass-color-danger)", // Pink
      "var(--glass-color-info)", // Cyan
      "var(--glass-color-success)", // Lime
    ];
  } else if (theme === "dark") {
    return [
      "var(--glass-color-primary-light)", // Light blue
      "var(--glass-color-danger-light)", // Light red
      "var(--glass-color-success-light)", // Light green
      "var(--glass-color-warning-light)", // Light yellow
      "var(--glass-color-secondary)", // Light purple
      "var(--glass-color-danger)", // Light pink
      "var(--glass-color-info)", // Light cyan
      "var(--glass-color-success)", // Light lime
    ];
  } else {
    return [
      "var(--glass-color-primary-dark)", // Dark blue
      "var(--glass-color-danger-dark)", // Dark red
      "var(--glass-color-success-dark)", // Dark green
      "var(--glass-color-warning-dark)", // Dark yellow
      "var(--glass-color-secondary)", // Dark purple
      "var(--glass-color-danger)", // Dark pink
      "var(--glass-color-info)", // Dark cyan
      "var(--glass-color-success)", // Dark lime
    ];
  }
};
