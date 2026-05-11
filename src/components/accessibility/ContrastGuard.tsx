"use client";
/**
 * ContrastGuard Component
 * A React wrapper component that ensures WCAG contrast compliance
 */

import React, {
  useRef,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  useContrastGuard,
  applyContrastAdjustment,
  type ContrastLevel,
} from "../../utils/contrastGuard";
import type { LiquidGlassMaterial, MaterialVariant } from "../../tokens/glass";
import { cn } from "../../lib/utilsComprehensive";
import { createGlassStyle } from "../../core/mixins/glassMixins";

type ContrastGuardElement = keyof HTMLElementTagNameMap;

export interface ContrastGuardProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Content to be rendered with contrast protection
   */
  children?: React.ReactNode;

  /**
   * Target WCAG compliance level
   * @default 'AA'
   */
  level?: ContrastLevel;

  /**
   * Minimum contrast ratio
   * @default 4.5
   */
  minContrast?: number;

  /**
   * Fallback text color if contrast cannot be met
   */
  fallbackColor?: string;

  /**
   * Background color to test against
   */
  backgroundColor?: string;

  /**
   * Text color
   * @default 'var(--glass-text-primary)'
   */
  textColor?: string;

  /**
   * Glass material type
   */
  material?: LiquidGlassMaterial;

  /**
   * Material variant
   */
  variant?: MaterialVariant;

  /**
   * Whether to automatically adjust contrast
   * @default true
   */
  autoAdjust?: boolean;

  /**
   * Custom className
   */
  className?: string;

  /**
   * Element type to render
   * @default 'span'
   */
  as?: ContrastGuardElement;

  /**
   * Callback when contrast adjustment is applied
   */
  onAdjustment?: (meetsRequirement: boolean, ratio: number) => void;

  /**
   * Show a small contrast status indicator. Useful in docs, previews, and
   * audit tooling where the component's behavior should be visible.
   */
  showIndicator?: boolean;

  /**
   * Optional package-owned demo backdrop for docs/previews. Normal app usage
   * should leave this as `none`.
   * @default 'none'
   */
  demoBackdrop?: "none" | "busy-light" | "busy-dark";
}

function demoBackdropStyle(
  demoBackdrop: NonNullable<ContrastGuardProps["demoBackdrop"]>
): React.CSSProperties {
  if (demoBackdrop === "busy-light") {
    return {
      ...createGlassStyle({
        intent: "info",
        elevation: "level1",
        tier: "high",
      }),
      display: "inline-flex",
      alignItems: "center",
      gap: "0.5rem",
      padding: "0.65rem 0.75rem",
      borderRadius: "0.75rem",
      color: "#0f172a",
    };
  }

  if (demoBackdrop === "busy-dark") {
    return {
      ...createGlassStyle({
        intent: "neutral",
        elevation: "level3",
        tier: "high",
      }),
      display: "inline-flex",
      alignItems: "center",
      gap: "0.5rem",
      padding: "0.65rem 0.75rem",
      borderRadius: "0.75rem",
      color: "#f8fafc",
    };
  }

  return {};
}

/**
 * ContrastGuard wrapper component
 * Ensures text content meets WCAG contrast requirements
 */
export const ContrastGuard = forwardRef<HTMLElement | null, ContrastGuardProps>(
  (
    {
      children,
      level = "AA",
      minContrast = 4.5,
      fallbackColor = "var(--glass-text-primary)",
      backgroundColor,
      textColor = "var(--glass-text-primary)",
      material = "liquid",
      variant = "regular",
      autoAdjust = true,
      className,
      as: Component = "span",
      onAdjustment,
      showIndicator = false,
      demoBackdrop = "none",
      style,
      ...rest
    },
    forwardedRef: React.ForwardedRef<HTMLElement | null>
  ) => {
    const elementRef = useRef<HTMLElement | null>(null);
    const [appliedStyles, setAppliedStyles] = useState<React.CSSProperties>({});

    useImperativeHandle<HTMLElement | null, HTMLElement | null>(
      forwardedRef,
      () => elementRef.current,
      []
    );

    // Use ContrastGuard hook if autoAdjust is enabled
    const adjustment = useContrastGuard(
      elementRef,
      autoAdjust
        ? {
            targetLevel: level,
            material,
            variant,
            textColor,
            onAdjustment: (adj) => {
              if (elementRef.current) {
                applyContrastAdjustment(elementRef.current, adj);
              }
              onAdjustment?.(adj.meetsRequirement, adj.adjustedContrast);

              // Apply styles dynamically
              const styles: React.CSSProperties = {};
              if (adj.modifications.fallbackMode && fallbackColor) {
                styles.color = fallbackColor;
              }
              setAppliedStyles(styles);
            },
          }
        : undefined
    );

    const indicator = showIndicator
      ? React.createElement(
          "span",
          {
            "aria-hidden": true,
            className: "contrast-guard__indicator",
            style: {
              marginLeft: "0.5rem",
              padding: "0.12rem 0.4rem",
              borderRadius: "999px",
              fontSize: "0.64rem",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: adjustment?.meetsRequirement ? "#052e16" : "#451a03",
              background: adjustment?.meetsRequirement
                ? "rgba(134,239,172,0.92)"
                : "rgba(253,186,116,0.92)",
            },
          },
          adjustment?.meetsRequirement ? "AA" : "Check"
        )
      : null;

    return React.createElement(
      Component,
      {
        "data-glass-component": true,
        ref: elementRef,
        className: cn(
          "contrast-guard",
          adjustment?.meetsRequirement && "contrast-guard--compliant",
          adjustment?.modifications.fallbackMode && "contrast-guard--fallback",
          className
        ),
        style: {
          ...demoBackdropStyle(demoBackdrop),
          ...style,
          ...appliedStyles,
          ...(backgroundColor && { backgroundColor }),
        },
        "data-contrast-level": level,
        "data-contrast-ratio": adjustment?.adjustedContrast?.toFixed(2),
        "data-meets-wcag": adjustment?.meetsRequirement,
        "data-demo-backdrop":
          demoBackdrop === "none" ? undefined : demoBackdrop,
        ...rest,
      },
      indicator
        ? React.createElement(React.Fragment, null, children, indicator)
        : children
    );
  }
);

/**
 * Simpler text wrapper with contrast protection
 */
export interface TextWithContrastProps
  extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  level?: "AA" | "AAA";
  className?: string;
  as?: ContrastGuardElement;
}

export const TextWithContrast: React.FC<TextWithContrastProps> = ({
  children,
  level = "AA",
  className,
  as: Component = "span",
  ...rest
}) => {
  return (
    <ContrastGuard
      level={level}
      minContrast={level === "AAA" ? 7.0 : 4.5}
      as={Component}
      className={className}
      {...rest}
    >
      {children}
    </ContrastGuard>
  );
};

/**
 * High contrast mode wrapper for critical UI elements
 */
export const HighContrastText: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <ContrastGuard
      level="AAA"
      minContrast={7.0}
      fallbackColor="var(--glass-text-primary)"
      className={className}
    >
      {children}
    </ContrastGuard>
  );
};

export default ContrastGuard;
