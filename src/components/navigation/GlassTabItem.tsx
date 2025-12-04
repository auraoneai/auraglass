'use client';
/**
 * Glass Tab Item Component
 * Individual tab item with glassmorphic styling for tab navigation
 */

import React, { CSSProperties, forwardRef, ReactNode } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";

/**
 * Glass Tab Item Props
 */
export interface GlassTabItemProps {
  children?: ReactNode;
  label: string;
  value: string;
  active?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  badge?: string | number;
  onClick?: (value: string) => void;
  className?: string;
  style?: CSSProperties;
  href?: string;
  target?: string;
}

/**
 * Glass Tab Item Component
 */
export const GlassTabItem = forwardRef<HTMLButtonElement, GlassTabItemProps>(
  (
    {
      children,
      label,
      value,
      active = false,
      disabled = false,
      icon,
      badge,
      onClick,
      className="",
      style = {},
      href,
      target,
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion();

    const accentColor = "var(--glass-theme-accent-primary, #5ac8ff)";
    const textPrimary = "var(--glass-theme-text, var(--glass-text-primary))";
    const transitionDuration = prefersReducedMotion
      ? "0ms"
      : "var(--glass-theme-motion-hover, 180ms)";

    const handleClick = () => {
      if (!disabled && onClick) {
        onClick(value);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick();
      }
    };

    const tabStyles: CSSProperties = {
      position: "relative",
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      padding: "12px 20px",
      border: "none",
      borderRadius: "var(--glass-theme-button-radius, 12px)",
      background: active
        ? "color-mix(in srgb, var(--glass-theme-accent-primary, rgba(96, 165, 250, 0.65)) 24%, transparent)"
        : "transparent",
      // Use createGlassStyle() instead,
      color: textPrimary,
      fontSize: "14px",
      fontWeight: active ? 600 : 400,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : active ? 1 : 0.82,
      transition: prefersReducedMotion
        ? "none"
        : `all ${transitionDuration} cubic-bezier(0.4, 0, 0.2, 1)` ,
      textDecoration: "none",
      userSelect: "none",
      ...style,
    };

    const Component = href ? "a" : "button";

    return (
      <Component
        ref={ref as any}
        className={`glass-tab-item ${active ? "active" : ""} ${disabled ? "disabled" : ""} ${className}`}
        style={tabStyles}
        onClick={href ? undefined : handleClick}
        onKeyDown={href ? undefined : handleKeyDown}
        disabled={href ? undefined : disabled}
        href={href}
        target={target}
        role={href ? "tab" : "tab"}
        aria-selected={active}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
      >
        {/* Icon */}
        {icon && (
          <span className="glass-tab-item-icon" aria-hidden="true">
            {icon}
          </span>
        )}

        {/* Label */}
        <span className="glass-tab-item-label">{children || label}</span>

        {/* Badge */}
        {badge !== undefined && (
          <span
            className="glass-tab-item-badge"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: "20px",
              height: "20px",
              padding: "0 6px",
              borderRadius: "10px",
              background: accentColor,
              color: "var(--glass-theme-text, #05111d)",
              fontSize: "11px",
              fontWeight: 600,
            }}
          >
            {badge}
          </span>
        )}

        {/* Active Indicator */}
        {active && !prefersReducedMotion && (
          <span
            className="glass-tab-item-indicator"
            style={{
              position: "absolute",
              bottom: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: "80%",
              height: "2px",
              background: accentColor,
              borderRadius: "2px 2px 0 0",
            }}
            aria-hidden="true"
          />
        )}

        <style>{`
          .glass-tab-item:hover:not(.disabled) {
            background: var(
              --glass-theme-accent-primary,
              rgba(255, 255, 255, 0.08)
            ) !important;
            transform: translateY(-1px);
          }

          .glass-tab-item:active:not(.disabled) {
            transform: translateY(0);
          }

          .glass-tab-item:focus-visible {
            outline: none;
            box-shadow: var(
              --glass-theme-focus-ring,
              0 0 0 3px rgba(99, 102, 241, 0.3)
            );
          }

          .glass-tab-item-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
          }

          @media (prefers-reduced-motion: reduce) {
            .glass-tab-item,
            .glass-tab-item-indicator {
              transition: none !important;
              animation: none !important;
            }
            .glass-tab-item:hover:not(.disabled) {
              transform: none !important;
            }
          }
        `}</style>
      </Component>
    );
  }
);

GlassTabItem.displayName = "GlassTabItem";