/**
 * Glass Tab Item Component
 * Individual tab item with glassmorphic styling for tab navigation
 */

import React, { CSSProperties, forwardRef, ReactNode } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

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
      className = '',
      style = {},
      href,
      target,
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion();

    const handleClick = () => {
      if (!disabled && onClick) {
        onClick(value);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick();
      }
    };

    const tabStyles: CSSProperties = {
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 20px',
      border: 'none',
      borderRadius: '8px',
      background: active
        ? 'var(--aura-glass-bg-active, rgba(255, 255, 255, 0.15))'
        : 'transparent',
      backdropFilter: active ? 'var(--aura-glass-blur-md, blur(10px))' : 'none',
      color: active
        ? 'var(--aura-text-primary, #ffffff)'
        : 'var(--aura-text-secondary, rgba(255, 255, 255, 0.7))',
      fontSize: '14px',
      fontWeight: active ? 600 : 400,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      transition: prefersReducedMotion
        ? 'none'
        : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      textDecoration: 'none',
      userSelect: 'none',
      ...style,
    };

    const Component = href ? 'a' : 'button';

    return (
      <Component
        ref={ref as any}
        className={`glass-tab-item ${active ? 'active' : ''} ${disabled ? 'disabled' : ''} ${className}`}
        style={tabStyles}
        onClick={href ? undefined : handleClick}
        onKeyDown={href ? undefined : handleKeyDown}
        disabled={href ? undefined : disabled}
        href={href}
        target={target}
        role={href ? 'tab' : 'tab'}
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
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '20px',
              height: '20px',
              padding: '0 6px',
              borderRadius: '10px',
              background: 'var(--aura-accent-color, #00d4ff)',
              color: 'var(--aura-text-on-accent, #000000)',
              fontSize: '11px',
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
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '80%',
              height: '2px',
              background: 'var(--aura-accent-color, #00d4ff)',
              borderRadius: '2px 2px 0 0',
            }}
            aria-hidden="true"
          />
        )}

        <style>{`
          .glass-tab-item:hover:not(.disabled) {
            background: var(
              --aura-glass-bg-hover,
              rgba(255, 255, 255, 0.08)
            ) !important;
            transform: translateY(-1px);
          }

          .glass-tab-item:active:not(.disabled) {
            transform: translateY(0);
          }

          .glass-tab-item:focus-visible {
            outline: 2px solid var(--aura-accent-color, #00d4ff);
            outline-offset: 2px;
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

GlassTabItem.displayName = 'GlassTabItem';
