'use client';
/**
 * ContrastGuard Component
 * A React wrapper component that ensures WCAG contrast compliance
 */

import React, { useRef, useEffect, useState } from 'react';
import { useContrastGuard, applyContrastAdjustment, type ContrastLevel } from '../../utils/contrastGuard';
import type { LiquidGlassMaterial, MaterialVariant } from '../../tokens/glass';
import { cn } from '../../lib/utilsComprehensive';

export interface ContrastGuardProps {
  /**
   * Content to be rendered with contrast protection
   */
  children: React.ReactNode;

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
  as?: keyof JSX.IntrinsicElements;

  /**
   * Callback when contrast adjustment is applied
   */
  onAdjustment?: (meetsRequirement: boolean, ratio: number) => void;
}

/**
 * ContrastGuard wrapper component
 * Ensures text content meets WCAG contrast requirements
 */
export const ContrastGuard: React.FC<ContrastGuardProps> = ({
  children,
  level = 'AA',
  minContrast = 4.5,
  fallbackColor = 'var(--glass-text-primary)',
  backgroundColor,
  textColor = 'var(--glass-text-primary)',
  material = 'liquid',
  variant = 'regular',
  autoAdjust = true,
  className,
  as: Component = 'span',
  onAdjustment,
}) => {
  const elementRef = useRef<HTMLElement>(null);
  const [appliedStyles, setAppliedStyles] = useState<React.CSSProperties>({});

  // Use ContrastGuard hook if autoAdjust is enabled
  const adjustment = useContrastGuard(
    elementRef,
    autoAdjust ? {
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
    } : undefined
  );

  return (
    <Component data-glass-component
      {...{
        ref: elementRef as any,
        className: cn(
          'contrast-guard',
          adjustment?.meetsRequirement && 'contrast-guard--compliant',
          adjustment?.modifications.fallbackMode && 'contrast-guard--fallback',
          className
        ),
        style: {
          ...appliedStyles,
          ...(backgroundColor && { backgroundColor }),
        },
        'data-contrast-level': level,
        'data-contrast-ratio': adjustment?.adjustedContrast?.toFixed(2),
        'data-meets-wcag': adjustment?.meetsRequirement,
        children,
      } as any}
    />
  );
};

/**
 * Simpler text wrapper with contrast protection
 */
export interface TextWithContrastProps {
  children: React.ReactNode;
  level?: 'AA' | 'AAA';
  className?: string;
}

export const TextWithContrast: React.FC<TextWithContrastProps> = ({
  children,
  level = 'AA',
  className,
}) => {
  return (
    <ContrastGuard
      level={level}
      minContrast={level === 'AAA' ? 7.0 : 4.5}
      className={className}
    >
      {children}
    </ContrastGuard>
  );
};

/**
 * High contrast mode wrapper for critical UI elements
 */
export const HighContrastText: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
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