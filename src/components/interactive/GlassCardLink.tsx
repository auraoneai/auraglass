"use client";
import React, { forwardRef } from "react";
import { cn } from "../../lib/utilsComprehensive";
import { OptimizedGlass, Motion } from "../../primitives";
import { useA11yId } from "../../utils/a11y";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import {
  ContrastGuard,
  TextWithContrast,
} from "@/components/accessibility/ContrastGuard";

export interface GlassCardLinkProps {
  /** Icon to display in the card */
  icon?: React.ReactNode;
  /** Card title */
  title: string;
  /** Card description */
  description: string;
  /** URL to navigate to when clicked */
  link: string;
  /** Button text for the call to action */
  buttonText?: string;
  /** Additional class name */
  className?: string;
  /** Custom content to display in the card */
  customPreview?: React.ReactNode;
  /** Glass variant styling */
  glassVariant?: "clear" | "frosted" | "tinted" | "luminous";
  /** Click handler (optional - will use link navigation if not provided) */
  onClick?: (e: React.MouseEvent) => void;
  /** Optional children to render instead of default content */
  children?: React.ReactNode;
  /** Respect user's motion preferences */
  respectMotionPreference?: boolean;
  /** Custom ID */
  id?: string;
  /** Custom ARIA label */
  "aria-label"?: string;
}

/**
 * GlassCardLink Component
 *
 * An enhanced card with 3D transform effects and link functionality.
 * Features physics-inspired animations and intuitive hover states.
 * Modernized to use OptimizedGlass architecture.
 */
export const GlassCardLink = forwardRef<HTMLAnchorElement, GlassCardLinkProps>(
  (
    {
      // TODO: Integrate ContrastGuard for table cells, list items, badges, card titles, and other text content for WCAG AA compliance

      icon,
      title,
      description,
      link,
      buttonText = "Learn more",
      className = "",
      customPreview,
      glassVariant = "frosted",
      onClick,
      children,
      respectMotionPreference = true,
      id,
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion();
    const componentId = id || useA11yId("card-link");

    const handleClick = (e: React.MouseEvent) => {
      if (onClick) {
        onClick(e);
        e.preventDefault();
      }
    };

    const defaultAriaLabel =
      ariaLabel || `${title}. ${description}. ${buttonText}.`;

    const ArrowIcon = () => (
      <svg
        className="glass-w-4 glass-h-4 glass-ml-1 glass-transition-transform glass-duration-300 glass-group-hover:translate-x-1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="5" y1="12" x2="19" y2="12"></line>
        <polyline points="12 5 19 12 12 19"></polyline>
      </svg>
    );

    // Map glass variants to OptimizedGlass props
    const variantMap = {
      clear: { intensity: "subtle" as const, tint: "neutral" as const },
      frosted: { intensity: "medium" as const, tint: "neutral" as const },
      tinted: { intensity: "medium" as const, tint: "cool" as const },
      luminous: { intensity: "strong" as const, tint: "warm" as const },
    };

    const variant = variantMap[glassVariant];

    // Render card content
    const renderCardContent = () => {
      if (children) return children;

      return (
        <>
          {/* Header */}
          {icon && (
            <div className="glass-relative glass-z-10 glass-mb-6 glass-transition-all glass-duration-300 glass-group-hover:-translate-y-1 glass-group-glass-hover-scale-105">
              <div className="glass-relative">
                {icon}
                {/* Glow effect */}
                <div className="glass-absolute glass-inset-0 glass--inset-2 glass-radius-lg glass-bg-gradient-radial glass-gradient-primary glass-via-blue-glass-opacity-10 glass-gradient-primary glass-opacity-0 glass-transition-opacity glass-duration-400 glass-group-glass-hover-opacity-100" />
              </div>
            </div>
          )}

          {/* Content */}
          <div className="glass-relative glass-z-10 glass-mb-6">
            <h3 className="glass-mb-2 glass-text-xl glass-font-semibold glass-text-primary glass-transition-colors glass-duration-200">
              {title}
            </h3>
            <p className="glass-mb-4 glass-text-sm glass-text-primary-opacity-70 glass-transition-colors glass-duration-200">
              {description}
            </p>

            {customPreview && (
              <div className="custom-preview-container">{customPreview}</div>
            )}
          </div>

          {/* Footer */}
          <div className="glass-relative glass-z-10 glass-mt-auto glass-pt-4 glass-border-t glass-border-white/10">
            <div className="glass-flex glass-items-center glass-justify-between">
              <div
                className="glass-flex glass-items-center glass-text-sm glass-font-medium glass-text-primary-glass-opacity-90 glass-group glass-transition-colors glass-duration-300 glass-group-hover:glass-text-primary"
                aria-hidden="true"
              >
                <span>{buttonText}</span>
                <ArrowIcon />
              </div>
            </div>
          </div>
        </>
      );
    };

    return (
      <Motion preset="fadeIn" className="glass-group glass-block">
        <a
          ref={ref}
          id={componentId}
          href={link}
          onClick={handleClick}
          aria-label={defaultAriaLabel}
          aria-describedby={`${componentId}-description`}
          className="glass-block glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard"
        >
          <OptimizedGlass
            intent="neutral"
            elevation="level2"
            intensity={variant.intensity}
            depth={3}
            tint={variant.tint}
            border="subtle"
            animation="float"
            performanceMode="medium"
            liftOnHover
            press
            className={cn(
              // Base styles
              "group relative block overflow-hidden glass-radius-xl glass-p-6 text-decoration-none",
              "transform-gpu transition-all duration-500 ease-out",
              "perspective-1000 transform-style-preserve-3d",

              // Hover effects
              "hover:-translate-y-2 glass-hover-scale-1-01 hover:rotate-x-1",
              "hover:shadow-2xl hover:shadow-blue-500/20",

              // Glass overlay effect
              "before:absolute before:inset-0 before:z-0",
              "before:bg-gradient-to-br before:from-white/10 before:via-transparent before:to-transparent",
              "before:opacity-0 before:transition-opacity before:duration-500",
              "hover:before:opacity-100",

              // Focus styles
              "focus:outline-none focus:ring-2 glass-focus-ring-white-opacity-30 focus:ring-offset-2 focus:ring-offset-transparent",

              className
            )}
            style={{
              ...{
                transformStyle: "preserve-3d",
              },
            }}
            {...props}
          >
            <div id={`${componentId}-description`} className="glass-sr-only">
              Interactive card link: {title}. {description}
            </div>
            <div className="glass-relative glass-z-10 glass-flex glass-h-full glass-min-h-200px glass-flex-col">
              {renderCardContent()}
            </div>
          </OptimizedGlass>
        </a>
      </Motion>
    );
  }
);

GlassCardLink.displayName = "GlassCardLink";

export default GlassCardLink;
