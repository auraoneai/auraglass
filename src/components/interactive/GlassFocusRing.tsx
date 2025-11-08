'use client';
import { cn } from '@/lib/utils';
import React from 'react';
import styled from 'styled-components';
import { useGlassFocus } from '../../hooks/extended/useGlassFocus';
import type { GlassFocusRingProps } from '../interactive/types';
import { ACCESSIBILITY } from '../../tokens/designConstants';

const FocusWrapper = styled.div<{
  $color: string;
  $width: number;
  $blur: number;
  $offset: number;
  $spread: number;
  $duration: number;
  $borderRadius?: number;
}>`
  position: relative;
  outline: none;
  ${p => (p.$borderRadius != null ? `border-radius: ${p.$borderRadius}px;` : '')}
  &::before {
    content: '';
    position: absolute;
    top: -${p => p.$offset}px;
    left: -${p => p.$offset}px;
    right: -${p => p.$offset}px;
    bottom: -${p => p.$offset}px;
    border-radius: inherit;
    border: ${p => p.$width}px solid ${p => p.$color};
    filter: blur(${p => p.$blur}px);
    opacity: 0;
    pointer-events: none;
    transition: opacity ${p => p.$duration}ms ease;
    z-index: -1;
  }
  &.glass-focus-visible::before {
    opacity: 1;
  }
  &.glass-focus-keyboard::before {
    box-shadow: 0 0 ${p => p.$spread}px ${p => p.$color};
  }
`;
// No longer need mergeRefs if attaching ref to wrapper div
// import { mergeRefs } from '../../utils/refUtils'; 

/**
 * A component that wraps a focusable element to provide an animated,
 * glass-styled focus indicator ring.
 */
export const GlassFocusRing: React.FC<GlassFocusRingProps> = ({
  children,
  color,
  ringStyle,
  offset,
  thickness,
  borderRadius,
  disabled,
  className,
  // Extract other potential UseGlassFocusOptions if needed
}) => {
  const child = React.Children.only(children);

  // Determine effective color (fallback to accessibility token)
  const effectiveColor = color ?? ACCESSIBILITY.focusRing.color;

  // Hook manages focus classes and state; attach its ref to our wrapper
  const { ref, options } = useGlassFocus({
    color: effectiveColor,
    width: thickness ?? 2,
    offset,
    keyboardNavigation: true,
    enabled: !disabled,
  });

  return (
    // Wrapper div to capture focus and position the ring
    <FocusWrapper
      ref={ref as React.RefObject<HTMLDivElement>}
      className={cn('glass-relative glass-inline-block glass-outline-none', className)}
      $color={options.color}
      $width={options.width}
      $blur={options.blur}
      $offset={options.offset}
      $spread={options.spread}
      $duration={options.duration}
      $borderRadius={borderRadius}
      // Make wrapper focusable only if not disabled
      tabIndex={disabled ? -1 : 0}
    >
      {child}
    </FocusWrapper>
  );
};

// Add default export if this is the main export of the file
// export default GlassFocusRing; 
