'use client';
/**
 * SpeedDialAction Component
 *
 * An action button for the SpeedDial component.
 */
import React, { forwardRef, useCallback, useState, useMemo } from 'react';
import styled, { css, useTheme } from 'styled-components';
import { cn } from '@/lib/utils';

import { AURA_GLASS } from '../../tokens/glass';
import { createThemeContext } from '../../core/themeContext';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { createGlassStyle } from '../../core/mixins/glassMixins';
import { usePhysicsInteraction, PhysicsInteractionOptions } from '../../hooks/usePhysicsInteraction';
import { useAnimationContext } from '../../contexts/AnimationContext';
import { SpringConfig, SpringPresets } from '../../animations/physics/springPhysics';

import { SpeedDialActionProps } from './types';

// Calculate the position based on direction
const getPosition = (
  direction: 'up' | 'down' | 'left' | 'right',
  index: number,
  totalActions: number,
  size: 'small' | 'medium' | 'large'
): { top?: string; right?: string; bottom?: string; left?: string } => {
  // Base spacing between buttons
  const spacing = size === 'small' ? 40 : size === 'large' ? 65 : 55;
  const offset = (index + 1) * spacing;

  switch (direction) {
    case 'up':
      return { bottom: `${offset}px` };
    case 'down':
      return { top: `${offset}px` };
    case 'left':
      return { right: `${offset}px` };
    case 'right':
      return { left: `${offset}px` };
    default:
      return { top: `${offset}px` };
  }
};

// Calculate the transition delay based on index and total actions
const getTransitionDelay = (index: number, totalActions: number, opening: boolean): number => {
  if (!opening) {
    // When closing, reverse the order
    return (totalActions - 1 - index) * 30;
  }
  return index * 30;
};

// Styled components
const ActionRoot = styled.div<{
  $position: { top?: string; right?: string; bottom?: string; left?: string };
  $visible: boolean;
  $glass: boolean;
  $disabled: boolean;
  $size: 'small' | 'medium' | 'large';
  $direction: 'up' | 'down' | 'left' | 'right';
  $index: number;
  $totalActions: number;
  $transition: boolean;
  $reducedMotion: boolean;
}>`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${props => props.$totalActions - props.$index};
  width: ${props => (props.$size === 'small' ? '32px' : props.$size === 'large' ? '48px' : '40px')};
  height: ${props =>
    props.$size === 'small' ? '32px' : props.$size === 'large' ? '48px' : '40px'};
  border-radius: 50%;
  background-color: ${props => (props.$glass ? 'var(--glass-bg-default)' : 'rgba(36, 36, 36, 0.85)')};
  color: ${AURA_GLASS.surfaces.neutral.level2.text.primary};
  box-shadow: var(--glass-elev-2);
  cursor: ${props => (props.$disabled ? 'default' : 'pointer')};
  opacity: ${props => (props.$visible ? 1 : 0)};
  transform: ${props => { if (props.$visible) return 'translate3d(0,0,0) scale(1)'; const d = 10; switch (props.$direction) { case 'up': return `translate3d(0, ${d}px, 0) scale(0.6)`; case 'down': return `translate3d(0, -${d}px, 0) scale(0.6)`; case 'left': return `translate3d(${d}px, 0, 0) scale(0.6)`; case 'right': return `translate3d(-${d}px, 0, 0) scale(0.6)`; default: return 'scale(0.6)'; } }};
  ${props => props.$position.top !== undefined && `top: ${props.$position.top};`}
  ${props => props.$position.right !== undefined && `right: ${props.$position.right};`}
  ${props => props.$position.bottom !== undefined && `bottom: ${props.$position.bottom};`}
  ${props => props.$position.left !== undefined && `left: ${props.$position.left};`}
  
  /* Glass styling */
  ${props =>
    props.$glass &&
    css`
      backdrop-filter: var(--glass-backdrop-blur);
      -webkit-backdrop-filter: var(--glass-backdrop-blur);
      border: 1px solid var(--glass-border-default);
    `}
  
  /* Transitions */
  ${props =>
    props.$transition &&
    !props.$reducedMotion &&
    `
    transition-property: transform, opacity, box-shadow, background-color;
    transition-duration: 220ms;
    transition-timing-function: cubic-bezier(0.2, 0.8, 0.2, 1);
    transition-delay: ${getTransitionDelay(props.$index, props.$totalActions, props.$visible)}ms;
  `}
  
  /* Disabled state */
  ${props =>
    props.$disabled &&
    `
    opacity: ${props.$visible ? 0.5 : 0};
    pointer-events: none;
  `}
  
  /* Hover effects */
  ${props =>
    !props.$disabled &&
    `
    &:hover {
      background-color: ${props.$glass ? 'var(--glass-bg-hover)' : 'rgba(48, 48, 48, 0.85)'};
      transform: translate3d(0,0,0) scale(1.02);
      box-shadow: var(--glass-elev-2);
    }
    &:active {
      transform: translate3d(0,0,0) scale(0.96);
      box-shadow: var(--glass-elev-2);
    }
  `}
`;

const TooltipWrapper = styled.div<{
  $direction: 'up' | 'down' | 'left' | 'right';
  $visible: boolean;
  $showTooltip: boolean;
  $reducedMotion: boolean;
}>`
  position: absolute;
  pointer-events: none;
  background: var(--glass-overlay-bg);
  color: ${AURA_GLASS.surfaces.neutral.level2.text.primary};
  font-size: 0.75rem;
  padding: 4px 8px;
  border-radius: 4px;
  white-space: nowrap;
  box-shadow: var(--glass-elev-2);
  transition: ${props => (!props.$reducedMotion ? 'opacity 0.2s, transform 0.2s' : 'none')};
  opacity: ${props => (props.$visible && props.$showTooltip ? 1 : 0)};

  /* Position the tooltip based on the direction */
  ${props => {
    switch (props.$direction) {
      case 'up':
        return `
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(${
            props.$visible && props.$showTooltip ? '-8px' : '0'
          });
          margin-bottom: 4px;
        `;
      case 'down':
        return `
          top: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(${
            props.$visible && props.$showTooltip ? '8px' : '0'
          });
          margin-top: 4px;
        `;
      case 'left':
        return `
          right: 100%;
          top: 50%;
          transform: translateY(-50%) translateX(${
            props.$visible && props.$showTooltip ? '-8px' : '0'
          });
          margin-right: 4px;
        `;
      case 'right':
        return `
          left: 100%;
          top: 50%;
          transform: translateY(-50%) translateX(${
            props.$visible && props.$showTooltip ? '8px' : '0'
          });
          margin-left: 4px;
        `;
      default:
        return '';
    }
  }}

  /* Tooltip arrow */
  &::after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border: 4px solid transparent;

    ${props => {
      switch (props.$direction) {
        case 'up':
          return `
            top: 100%;
            left: 50%;
            margin-left: -4px;
            border-top-color: var(--glass-overlay-bg);
          `;
        case 'down':
          return `
            bottom: 100%;
            left: 50%;
            margin-left: -4px;
            border-bottom-color: var(--glass-overlay-bg);
          `;
        case 'left':
          return `
            left: 100%;
            top: 50%;
            margin-top: -4px;
            border-left-color: var(--glass-overlay-bg);
          `;
        case 'right':
          return `
            right: 100%;
            top: 50%;
            margin-top: -4px;
            border-right-color: var(--glass-overlay-bg);
          `;
        default:
          return '';
      }
    }}
  }
`;

/**
 * SpeedDialAction Component Implementation
 */
const SpeedDialActionComponent = (
  props: SpeedDialActionProps,
  ref: React.ForwardedRef<HTMLDivElement>
) => {
  // Unified glass styles
  const glassStyles = createGlassStyle({ intent: 'neutral', elevation: 'level2', tier: 'high' });

  const {
    className,
    style,
    icon,
    tooltipTitle,
    disabled = false,
    onClick,
    glass = false,
    index = 0,
    totalActions = 1,
    direction = 'up',
    transition = true,
    showTooltip = true,
    size = 'medium',
    animationConfig,
    disableAnimation,
    motionSensitivity,
    ...rest
  } = props;

  const theme = useTheme();

  const prefersReducedMotion = useReducedMotion();
  const { defaultSpring } = useAnimationContext();
  const finalDisableAnimation = disableAnimation ?? prefersReducedMotion;
  const usePhysics = !finalDisableAnimation && !disabled;

  // Calculate final physics interaction config
  const finalInteractionConfig = useMemo<Partial<PhysicsInteractionOptions>>(() => {
    const baseOptions: Partial<PhysicsInteractionOptions> = {
      scale: 1.02,
      stiffness: SpringPresets.default.stiffness,
      damping: SpringPresets.default.damping,
      mass: SpringPresets.default.mass,
    };
    
    let contextResolvedConfig: Partial<SpringConfig> = {};
    if (typeof defaultSpring === 'string' && defaultSpring in SpringPresets) {
      contextResolvedConfig = SpringPresets[defaultSpring as keyof typeof SpringPresets];
    } else if (typeof defaultSpring === 'object' && defaultSpring !== null) {
      contextResolvedConfig = defaultSpring;
    }
    
    let propResolvedConfig: Partial<PhysicsInteractionOptions> = {}; // Use PhysicsInteractionOptions here
    const configProp = animationConfig;
    if (typeof configProp === 'string' && configProp in SpringPresets) {
      const preset = SpringPresets[configProp as keyof typeof SpringPresets];
      propResolvedConfig = {
        stiffness: preset.stiffness,
        damping: preset.damping,
        mass: preset.mass
      };
    } else if (typeof configProp === 'object' && configProp !== null) {
        if ('stiffness' in configProp || 'damping' in configProp || 'mass' in configProp) {
           propResolvedConfig = configProp as Partial<PhysicsInteractionOptions>;
        }
    }

    const finalStiffness = propResolvedConfig.stiffness ?? contextResolvedConfig.stiffness ?? baseOptions.stiffness;
    const finalMass = propResolvedConfig.mass ?? contextResolvedConfig.mass ?? baseOptions.mass;
    const finalDamping = propResolvedConfig.damping ?? contextResolvedConfig.damping ?? baseOptions.damping;

    return {
      ...baseOptions,
      stiffness: finalStiffness,
      damping: finalDamping,
      mass: finalMass,
    };
  }, [defaultSpring, animationConfig, motionSensitivity]);

  const {
    ref: physicsRef,
    physicsState,
    isInteracting,
    startInteraction,
    endInteraction,
  } = usePhysicsInteraction(finalInteractionConfig);

  const position = getPosition(direction, index, totalActions, size);
  const visible = !!(props as any).open;

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    if (!disabled && onClick) {
      onClick(event);
    }
  };

  const combinedRef = useCallback((node: HTMLDivElement | null) => {
    (physicsRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  }, [ref, physicsRef]);

  return (
    <ActionRoot
      ref={combinedRef}
      className={cn('glass-speed-dial-action', className)}
      style={style}
      onClick={handleClick}
      $position={position}
      $visible={visible}
      $glass={glass}
      $disabled={disabled}
      $size={size}
      $direction={direction}
      $index={index}
      $totalActions={totalActions}
      $transition={transition}
      $reducedMotion={finalDisableAnimation}
      role="button"
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      {...rest}
    >
      {icon}

      {tooltipTitle && (
        <TooltipWrapper
          $direction={direction}
          $visible={visible}
          $showTooltip={showTooltip}
          $reducedMotion={finalDisableAnimation}
        >
          {tooltipTitle}
        </TooltipWrapper>
      )}
    </ActionRoot>
  );
};

/**
 * SpeedDialAction Component
 *
 * An action button for the SpeedDial component.
 */
const SpeedDialAction = forwardRef(SpeedDialActionComponent);
SpeedDialAction.displayName = 'SpeedDialAction';

export default SpeedDialAction;
