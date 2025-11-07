import React from 'react';
import { CSSProperties } from 'react';
import styled from 'styled-components';

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
  placement: 'top' | 'bottom' | 'left' | 'right' | 'auto';
}

// Styled components for chart tooltips
export const GlassTooltipContainer = styled.div<{
  $theme?: 'light' | 'dark' | 'glass';
  $size?: 'small' | 'medium' | 'large';
  $position?: TooltipPosition;
  $animated?: boolean;
}>`
  position: absolute;
  z-index: 1000;
  pointer-events: none;
  font-family: system-ui, -apple-system, sans-serif;
  font-size: ${props => {
    const multiplier = props.$size === 'small' ? 0.8 : props.$size === 'large' ? 1.2 : 1;
    return `${12 * multiplier}px`;
  }};
  border-radius: ${props => {
    const multiplier = props.$size === 'small' ? 0.8 : props.$size === 'large' ? 1.2 : 1;
    return `${8 * multiplier}px`;
  }};
  box-shadow: ${props => props.$theme === 'glass'
    ? '0 8px 32px rgba(var(--glass-color-black) / var(--glass-opacity-30)), 0 0 0 1px rgba(var(--glass-color-white) / var(--glass-opacity-20))'
    : '0 4px 12px rgba(var(--glass-color-black) / var(--glass-opacity-15))'
  };
  backdrop-filter: ${props => props.$theme === 'glass' ? 'blur(var(--glass-blur-md))' : 'none'};
  background: ${props => {
    switch (props.$theme) {
      case 'glass':
        return 'rgba(0, 0, 0, 0.85)';
      case 'dark':
        return '#2a2a2a';
      default:
        return 'var(--glass-white)';
    }
  }};
  border: ${props => props.$theme === 'glass' 
    ? '1px solid rgba(var(--glass-color-white) / var(--glass-opacity-20))' 
    : '1px solid #e0e0e0'
  };
  color: ${props => props.$theme === 'light' ? '#1a1a1a' : 'var(--glass-white)'};
  padding: ${props => {
    const multiplier = props.$size === 'small' ? 0.8 : props.$size === 'large' ? 1.2 : 1;
    return `${8 * multiplier}px ${12 * multiplier}px`;
  }};
  min-width: ${props => {
    const multiplier = props.$size === 'small' ? 0.8 : props.$size === 'large' ? 1.2 : 1;
    return `${120 * multiplier}px`;
  }};
  max-width: ${props => {
    const multiplier = props.$size === 'small' ? 0.8 : props.$size === 'large' ? 1.2 : 1;
    return `${280 * multiplier}px`;
  }};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: ${props => props.$animated ? 'all 0.2s ease' : 'none'};
  opacity: ${props => props.$animated ? 1 : 1};
  transform: ${props => props.$position 
    ? `translate(${props.$position.x}px, ${props.$position.y}px)`
    : 'translate(-50%, -100%)'
  };

  &::before {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid;
    border-top-color: ${props => {
      switch (props.$theme) {
        case 'glass':
          return 'rgba(0, 0, 0, 0.85)';
        case 'dark':
          return '#2a2a2a';
        default:
          return 'var(--glass-white)';
      }
    }};
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%);
  }
`;

export const TooltipHeader = styled.div<{ $theme?: 'light' | 'dark' | 'glass'; $size?: 'small' | 'medium' | 'large' }>`
  font-size: ${props => {
    const multiplier = props.$size === 'small' ? 0.8 : props.$size === 'large' ? 1.2 : 1;
    return `${14 * multiplier}px`;
  }};
  font-weight: 600;
  margin-bottom: ${props => {
    const multiplier = props.$size === 'small' ? 0.8 : props.$size === 'large' ? 1.2 : 1;
    return `${4 * multiplier}px`;
  }};
  color: ${props => props.$theme === 'light' ? '#1a1a1a' : 'var(--glass-white)'};
  border-bottom: ${props => props.$theme === 'glass'
    ? '1px solid rgba(var(--glass-color-white) / var(--glass-opacity-20))'
    : '1px solid #e0e0e0'
  };
  padding-bottom: ${props => {
    const multiplier = props.$size === 'small' ? 0.8 : props.$size === 'large' ? 1.2 : 1;
    return `${4 * multiplier}px`;
  }};
`;

export const TooltipBody = styled.div<{ $size?: 'small' | 'medium' | 'large' }>`
  display: flex;
  flex-direction: column;
  gap: ${props => {
    const multiplier = props.$size === 'small' ? 0.8 : props.$size === 'large' ? 1.2 : 1;
    return `${4 * multiplier}px`;
  }};
`;

export const TooltipItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
`;

export const TooltipLabel = styled.span<{ $theme?: 'light' | 'dark' | 'glass'; $size?: 'small' | 'medium' | 'large' }>`
  font-size: ${props => {
    const multiplier = props.$size === 'small' ? 0.8 : props.$size === 'large' ? 1.2 : 1;
    return `${11 * multiplier}px`;
  }};
  color: ${props => props.$theme === 'light' ? '#666666' : '#cccccc'};
  font-weight: 500;
`;

export const TooltipValue = styled.span<{ $theme?: 'light' | 'dark' | 'glass'; $size?: 'small' | 'medium' | 'large'; $color?: string }>`
  font-size: ${props => {
    const multiplier = props.$size === 'small' ? 0.8 : props.$size === 'large' ? 1.2 : 1;
    return `${13 * multiplier}px`;
  }};
  font-weight: 600;
  color: ${props => props.$color || (props.$theme === 'light' ? '#1a1a1a' : 'var(--glass-white)')};
`;

export const TooltipSeparator = styled.div<{ $theme?: 'light' | 'dark' | 'glass'; $size?: 'small' | 'medium' | 'large' }>`
  height: 1px;
  background: ${props => {
    switch (props.$theme) {
      case 'glass':
        return 'rgba(var(--glass-color-white) / var(--glass-opacity-20))';
      case 'dark':
        return '#555555';
      default:
        return '#e0e0e0';
    }
  }};
  margin: ${props => {
    const multiplier = props.$size === 'small' ? 0.8 : props.$size === 'large' ? 1.2 : 1;
    return `${6 * multiplier}px 0`;
  }};
`;

export const TooltipFooter = styled.div<{ $theme?: 'light' | 'dark' | 'glass'; $size?: 'small' | 'medium' | 'large' }>`
  margin-top: ${props => {
    const multiplier = props.$size === 'small' ? 0.8 : props.$size === 'large' ? 1.2 : 1;
    return `${8 * multiplier}px`;
  }};
  padding-top: ${props => {
    const multiplier = props.$size === 'small' ? 0.8 : props.$size === 'large' ? 1.2 : 1;
    return `${4 * multiplier}px`;
  }};
  border-top: ${props => props.$theme === 'glass'
    ? '1px solid rgba(var(--glass-color-white) / var(--glass-opacity-20))'
    : '1px solid #e0e0e0'
  };
  font-size: ${props => {
    const multiplier = props.$size === 'small' ? 0.8 : props.$size === 'large' ? 1.2 : 1;
    return `${10 * multiplier}px`;
  }};
  color: ${props => props.$theme === 'light' ? '#666666' : '#cccccc'};
  text-align: center;
`;

export const createTooltipStyles = (
  theme: 'light' | 'dark' | 'glass' = 'glass',
  size: 'small' | 'medium' | 'large' = 'medium'
): TooltipStyles => {
  const sizeMultipliers = {
    small: 0.8,
    medium: 1,
    large: 1.2,
  };

  const multiplier = sizeMultipliers[size];

  const baseStyles: TooltipStyles = {
    container: {
      position: 'absolute' as const,
      zIndex: 1000,
      pointerEvents: 'none',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: `${12 * multiplier}px`,
      borderRadius: `${8 * multiplier}px`,
      boxShadow: theme === 'glass'
        ? '0 8px 32px rgba(var(--glass-color-black) / var(--glass-opacity-30)), 0 0 0 1px rgba(var(--glass-color-white) / var(--glass-opacity-20))'
        : '0 4px 12px rgba(var(--glass-color-black) / var(--glass-opacity-15))',
      // Use createGlassStyle() instead,
      background: theme === 'glass'
        ? 'rgba(0, 0, 0, 0.85)'
        : theme === 'dark'
          ? '#2a2a2a'
          : 'var(--glass-white)',
      border: theme === 'glass' ? '1px solid rgba(var(--glass-color-white) / var(--glass-opacity-20))' : '1px solid #e0e0e0',
      color: theme === 'dark' ? 'var(--glass-white)' : '#1a1a1a',
      padding: `${8 * multiplier}px ${12 * multiplier}px`,
      minWidth: `${120 * multiplier}px`,
      maxWidth: `${280 * multiplier}px`,
      whiteSpace: 'nowrap' as const,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      transform: 'translate(-50%, -100%)',
      marginTop: `-${8 * multiplier}px`,
    },
    header: {
      fontSize: `${14 * multiplier}px`,
      fontWeight: 600,
      marginBottom: `${4 * multiplier}px`,
      color: theme === 'glass' ? 'var(--glass-white)' : theme === 'dark' ? 'var(--glass-white)' : '#1a1a1a',
      borderBottom: theme === 'glass'
        ? '1px solid rgba(var(--glass-color-white) / var(--glass-opacity-20))'
        : '1px solid #e0e0e0',
      paddingBottom: `${4 * multiplier}px`,
    },
    body: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: `${4 * multiplier}px`,
    },
    footer: {
      marginTop: `${8 * multiplier}px`,
      paddingTop: `${4 * multiplier}px`,
      borderTop: theme === 'glass'
        ? '1px solid rgba(var(--glass-color-white) / var(--glass-opacity-20))'
        : '1px solid #e0e0e0',
      fontSize: `${10 * multiplier}px`,
      color: theme === 'dark' ? '#cccccc' : '#666666',
      textAlign: 'center' as const,
    },
    label: {
      fontSize: `${11 * multiplier}px`,
      color: theme === 'dark' ? '#cccccc' : '#666666',
      marginBottom: `${2 * multiplier}px`,
      fontWeight: 500,
    },
    value: {
      fontSize: `${13 * multiplier}px`,
      fontWeight: 600,
      color: theme === 'glass' ? 'var(--glass-white)' : theme === 'dark' ? 'var(--glass-white)' : '#1a1a1a',
    },
    separator: {
      height: '1px',
      background: theme === 'glass'
        ? 'rgba(var(--glass-color-white) / var(--glass-opacity-20))'
        : theme === 'dark'
          ? '#555555'
          : '#e0e0e0',
      margin: `${6 * multiplier}px 0`,
    },
    arrow: {
      position: 'absolute' as const,
      width: 0,
      height: 0,
      borderLeft: `${6 * multiplier}px solid transparent`,
      borderRight: `${6 * multiplier}px solid transparent`,
      borderTop: `${6 * multiplier}px solid`,
      borderTopColor: theme === 'glass'
        ? 'rgba(0, 0, 0, 0.85)'
        : theme === 'dark'
          ? '#2a2a2a'
          : 'var(--glass-white)',
      bottom: `-${6 * multiplier}px`,
      left: '50%',
      transform: 'translateX(-50%)',
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
  offset: number = 10
): TooltipPosition => {
  const centerX = mouseX;
  const centerY = mouseY;

  let x = centerX;
  let y = centerY - tooltipHeight - offset;
  let placement: 'top' | 'bottom' | 'left' | 'right' | 'auto' = 'top';

  // Check if tooltip fits above
  if (y < containerRect.top) {
    y = centerY + offset;
    placement = 'bottom';
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
  format: 'number' | 'currency' | 'percentage' | 'string' = 'number',
  options?: Intl.NumberFormatOptions
): string => {
  if (typeof value === 'string') return value;

  switch (format) {
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        ...options,
      }).format(value);

    case 'percentage':
      return new Intl.NumberFormat('en-US', {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 2,
        ...options,
      }).format(value / 100);

    case 'number':
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
        ...options,
      }).format(value);

    default:
      return String(value);
  }
};
