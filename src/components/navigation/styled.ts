import React from 'react';
import styled, { css } from 'styled-components';
import { createGlassStyle } from '../../utils/createGlassStyle';

export const TabBarContainer = styled.div<{
  $orientation?: 'horizontal' | 'vertical';
  $variant?: 'default' | 'pills' | 'underline';
  $glassVariant?: 'frosted' | 'dynamic' | 'clear' | 'tinted' | 'luminous';
  $blurStrength?: 'none' | 'light' | 'standard' | 'heavy';
  $elevated?: boolean;
  $background?: boolean;
  $color?: string;
  $width?: string | number;
  $height?: string | number;
  $borderRadius?: string | number;
  $iconPosition?: 'top' | 'left' | 'right';
  $verticalDisplayMode?: 'expanded' | 'compact';
  $placement?: 'top' | 'bottom' | 'left' | 'right';
  $isResponsive?: boolean;
}>`
  display: flex;
  align-items: center;
  position: relative;
  background: ${props => props.$background !== false ? 'var(--glass-bg-default)' : 'transparent'};
  backdrop-filter: ${props => {
    switch (props.$blurStrength) {
      case 'none': return 'none';
      case 'light': return 'blur(var(--glass-blur-sm))';
      case 'standard': return 'blur(var(--glass-blur-md))';
      case 'heavy': return 'blur(var(--glass-blur-lg))';
      default: return 'blur(var(--glass-blur-md))';
    }
  }};
  ...createGlassStyle({ elev: 1 });
  border-radius: ${props => typeof props.$borderRadius === 'number' ? `${props.$borderRadius}px` : props.$borderRadius || '8px'};
  padding: 4px;
  overflow: hidden;
  flex-direction: ${props => props.$orientation === 'vertical' ? 'column' : 'row'};
  ${props => props.$width && `width: ${typeof props.$width === 'number' ? `${props.$width}px` : props.$width};`}
  ${props => props.$height && `height: ${typeof props.$height === 'number' ? `${props.$height}px` : props.$height};`}
  ${props => props.$elevated && (() => {
    const glassStyles = createGlassStyle({ elev: 2 });
    return Object.entries(glassStyles)
      .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}:${value};`)
      .join('');
  })()}
`;

export const TabSelector = styled.div<{ $position: number; $width: number }>`
  position: absolute;
  height: calc(100% - 8px);
  left: ${props => props.$position}px;
  width: ${props => props.$width}px;
  border-radius: 8px;
  transition: transform 220ms ease, width 220ms ease, left 220ms ease, opacity 180ms ease;
  will-change: transform, left, width, opacity;

  /* Glassy highlight with subtle glow and local blur */
  background: linear-gradient(180deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.16) 100%);
  ${(() => {
    const glassStyles = createGlassStyle({ elev: 2 });
    return Object.entries(glassStyles)
      .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}:${value};`)
      .join('');
  })()}
  box-shadow: inset 0 1px 0 var(--glass-border-hover);
  backdrop-filter: blur(var(--glass-blur-md)) saturate(120%);
  -webkit-backdrop-filter: blur(var(--glass-blur-md)) saturate(120%);

  /* Specular sheen */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(120% 60% at 20% 0%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 40%);
    mix-blend-mode: overlay;
    border-radius: inherit;
  }
`;
