'use client';
/**
 * GlassMultiSelect Component
 * 
 * A glass-styled multi-select component with physics-based animations,
 * token-based selected items, advanced filtering, and virtualization.
 */

// Typography tokens available via typography.css (imported in index.css)
import React, { useState, useRef, useEffect, useCallback, useMemo, forwardRef, memo } from 'react';
import { createPortal } from 'react-dom';
import styled, { css, keyframes } from 'styled-components';
import { cn } from '@/lib/utils';

// Physics-related imports
import { useGalileoStateSpring } from '../../hooks/useGalileoStateSpring';
import { SpringPresets, SpringConfig } from '../../animations/physics/springPhysics';

// Add snappy preset if not available
const extendedSpringPresets = {
  ...SpringPresets,
  snappy: { stiffness: 300, damping: 20, mass: 1 },
};

// Core styling imports
import { useAnimationContext } from '../../contexts/AnimationContext';

import { createThemeContext } from '../../core/themeUtils';
import { useAccessibilitySettings } from '../../hooks/useAccessibilitySettings';

// Add missing type definitions
interface StaggerAnimationStage {
  id: string;
  type: 'stagger';
  targets: string;
  from: Record<string, any>;
  properties: Record<string, any>;
  duration: number;
  staggerDelay: number;
  easing: string;
}

interface AnimationSequenceConfig {
  id: string;
  stages: StaggerAnimationStage[];
  autoplay: boolean;
}

interface SequenceControls {
  play: () => void;
}

// Hooks and utilities
import ClearIcon from '../icons/ClearIcon';

// Types
import {
  MultiSelectOption,
  OptionGroup,
  MultiSelectProps,
} from './types';
import { AnimationProps } from '../../types/animations';

// Animation keyframes
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Styled components
const MultiSelectRoot = styled.div<{
  $fullWidth: boolean;
  $width?: string | number;
  $animate: boolean;
  $reducedMotion: boolean;
}>`
  display: flex;
  flex-direction: column;
  width: ${props => props.$fullWidth 
    ? '100%' 
    : props.$width 
      ? (typeof props.$width === 'number' ? `${props.$width}px` : props.$width) 
      : '300px'
  };
  position: relative;
  font-family: inherit;
  
  /* Animation on mount */
  ${props => props.$animate && !props.$reducedMotion && css`
    animation: ${fadeIn} 0.4s ease-out;
  `}
`;

const InputContainer = styled.div<{
  $size: 'small' | 'medium' | 'large';
  $focused: boolean;
  $disabled: boolean;
  $hasError: boolean;
}>`
  position: relative;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  gap: 6px;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'text'};
  
  /* Size variations */
  ${props => {
    switch (props.$size) {
      case 'small':
        return `
          min-height: 36px;
          padding: 4px 8px;
        `;
      case 'large':
        return `
          min-height: 48px;
          padding: 8px 16px;
        `;
      default:
        return `
          min-height: 40px;
          padding: 6px 12px;
        `;
    }
  }}
  
  /* Enhanced glass styling */
  background: var(--glass-bg-default);
  backdrop-filter: var(--glass-backdrop-blur);
  -webkit-backdrop-filter: var(--glass-backdrop-blur);
  border: 1px solid var(--glass-border-default);
  
  border-radius: 8px;
  border: 1px solid ${props => 
    props.$hasError 
      ? 'rgba(240, 82, 82, 0.8)' 
      : props.$focused 
        ? 'rgba(99, 102, 241, 0.8)' 
        : 'rgba(255, 255, 255, 0.12)'
  };
  background: var(--glass-bg-default);
  transition: all 0.2s ease;
  
  /* Focused state */
  ${props => props.$focused && css`
    border-color: rgba(99, 102, 241, 0.8);
    box-shadow: var(--glass-elev-2);
  `}
  
  /* Error state */
  ${props => props.$hasError && css`
    border-color: rgba(240, 82, 82, 0.8);
    box-shadow: var(--glass-elev-2);
  `}
  
  /* Disabled state */
  ${props => props.$disabled && css`
    opacity: 0.6;
    cursor: not-allowed;
    background: var(--glass-bg-default);
  `}
`;

const TokensContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  flex: 1;
`;

const Token = styled.div<{
  $isDisabled: boolean;
  $translateX: number;
  $translateY: number;
  $scale: number;
  $isDragging: boolean;
  $initialOpacity?: number;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px 8px;
  border-radius: 16px;
  font-size: 0.85rem;
  gap: 6px;
  max-width: 200px;
  background: var(--glass-bg-default);
  backdrop-filter: var(--glass-backdrop-blur);
  border: 1px solid var(--glass-border-default);
  color: var(--glass-text-primary);
  transition: background-color 0.2s ease;
  user-select: none;
  transform: translate(${props => props.$translateX}px, ${props => props.$translateY}px)
             scale(${props => props.$scale});
  will-change: transform, opacity;
  opacity: ${props => props.$initialOpacity ?? 1};
  
  /* Dragging state */
  ${props => props.$isDragging && css`
    opacity: 0.8;
    z-index: 10;
    cursor: grabbing;
  `}
  
  /* Hover styles */
  &:hover {
    background: var(--glass-bg-default);
    
    /* Only show the remove button hover effect when not disabled */
    ${props => !props.$isDisabled && css`
      .remove-button {
        background: var(--glass-bg-default);
        
        &:hover {
          background: var(--glass-bg-default);
        }
      }
    `}
  }
  
  /* Disabled state */
  ${props => props.$isDisabled && css`
    opacity: 0.5;
    cursor: not-allowed;
  `}
`;

const TokenLabel = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const RemoveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: none;
  padding: 0;
  background-color: transparent;
  color: rgba(var(--glass-color-white) / var(--glass-opacity-80));
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:focus {
    outline: none;
    box-shadow: var(--glass-elev-2);
  }
  
  /* Icon sizing */
  svg {
    width: 12px;
    height: 12px;
  }
  
  /* Disabled state inherited from parent */
`;

const Input = styled.input<{ $size: 'small' | 'medium' | 'large' }>`
  flex: 1;
  min-width: 50px;
  border: none;
  outline: none;
  background: transparent;
  color: rgba(var(--glass-color-white) / var(--glass-opacity-90));
  font-size: ${props => 
    props.$size === 'small' 
      ? '0.85rem' 
      : props.$size === 'large' 
        ? '1.05rem' 
        : '0.95rem'
  };
  
  &::placeholder {
    color: var(--glass-border-hover);
  }
  
  &:disabled {
    cursor: not-allowed;
  }
`;

const DropdownContainer = styled.div<{
  $width: number;
  $maxHeight: string | number;
  $openUp: boolean;
  $popperWidth?: string;
}>`
  position: absolute;
  width: ${props => props.$popperWidth || `${props.$width}px`};
  max-height: ${props => 
    typeof props.$maxHeight === 'number' 
      ? `${props.$maxHeight}px` 
      : props.$maxHeight
  };
  overflow-y: auto;
  z-index: 1000;
  ${props => props.$openUp ? 'bottom: 100%;' : 'top: 100%;'}
  left: 0;
  margin-top: ${props => props.$openUp ? '0' : '4px'};
  margin-bottom: ${props => props.$openUp ? '4px' : '0'};
  
  /* Enhanced glass styling */
  background: var(--glass-bg-default);
  backdrop-filter: var(--glass-backdrop-blur);
  -webkit-backdrop-filter: var(--glass-backdrop-blur);
  border: 1px solid var(--glass-border-default);
  
  border-radius: 8px;
  border: 1px solid var(--glass-border-default);
  will-change: transform, opacity;
  transform-origin: ${props => props.$openUp ? 'bottom center' : 'top center'};
`;

const OptionsList = styled.ul`
  margin: 0;
  padding: 6px 0;
  list-style: none;
`;

const OptionItem = styled.li<{ 
  $isSelected: boolean; 
  $isFocused: boolean; 
  $isDisabled: boolean;
  $size: 'small' | 'medium' | 'large';
}>`
  padding: ${props => 
    props.$size === 'small' 
      ? '6px 10px' 
      : props.$size === 'large' 
        ? '10px 16px' 
        : '8px 12px'
  };
  cursor: ${props => (props.$isDisabled ? 'not-allowed' : 'pointer')};
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.15s ease;
  position: relative;
  
  /* Text styling */
  color: rgba(255, 255, 255, ${props => props.$isDisabled ? '0.5' : '0.9'});
  
  /* Selected state */
  ${props => props.$isSelected && css`
    background: var(--glass-bg-default);
    font-weight: var(--typography-subheading-weight);
    
    &::after {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background: var(--glass-bg-default);
    }
  `}
  
  /* Focus state */
  ${props => props.$isFocused && !props.$isDisabled && css`
    background: var(--glass-bg-default);
  `}
  
  /* Hover state - only when not disabled */
  ${props => !props.$isDisabled && css`
    &:hover {
      background: var(--glass-bg-default);
    }
  `}
  
  /* Disabled state */
  ${props => props.$isDisabled && css`
    opacity: 0.6;
  `}
`;

const GroupHeader = styled.div<{ $size: 'small' | 'medium' | 'large' }>`
  padding: ${props => 
    props.$size === 'small' 
      ? '6px 10px' 
      : props.$size === 'large' 
        ? '10px 16px' 
        : '8px 12px'
  };
  font-size: 0.8rem;
  font-weight: var(--typography-heading-weight);
  text-transform: uppercase;
  color: rgba(var(--glass-color-white) / var(--glass-opacity-60));
  background: var(--glass-bg-default);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  letter-spacing: 0.5px;
`;

const NoOptions = styled.div`
  padding: 12px;
  color: var(--glass-border-hover);
  text-align: center;
  font-style: italic;
`;

const ClearButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  padding: 4px;
  margin-left: 4px;
  color: var(--glass-border-hover);
  cursor: pointer;
  transition: color 0.2s ease;
  
  &:hover {
    color: rgba(var(--glass-color-white) / var(--glass-opacity-80));
  }
  
  &:focus {
    outline: none;
    color: rgba(var(--glass-color-white) / var(--glass-opacity-80));
  }
  
  /* Icon sizing */
  svg {
    width: 16px;
    height: 16px;
  }
`;

const LoadingIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  color: rgba(var(--glass-color-white) / var(--glass-opacity-70));
  
  /* Simple loading spinner */
  .spinner {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid rgba(99, 102, 241, 0.3);
    border-top-color: rgba(99, 102, 241, 0.8);
    animation: spin 0.8s linear infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  color: rgba(240, 82, 82, 0.9);
  font-size: 0.8rem;
  margin-top: 4px;
  padding-left: 4px;
`;

const HelperText = styled.div`
  color: rgba(var(--glass-color-white) / var(--glass-opacity-60));
  font-size: 0.8rem;
  margin-top: 4px;
  padding-left: 4px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 6px;
  font-size: 0.9rem;
  font-weight: var(--typography-subheading-weight);
  color: rgba(var(--glass-color-white) / var(--glass-opacity-80));
`;

// Interface for the wrapper props
interface AnimatedTokenWrapperProps<T extends string | number> {
  option: MultiSelectOption<T>;
  onRemove: (id: string | number) => void; // Callback to actually remove from state
  removeConfig: Partial<SpringConfig>;
  isDisabled?: boolean;
  reducedMotion?: boolean;
  // Add renderToken prop if custom rendering needs animation applied
  renderToken?: (option: MultiSelectOption<T>, onRemove: (value: T) => void) => React.ReactNode;
  // Need original remove handler for custom renderToken
  originalOnRemoveHandler: (e: React.MouseEvent, option: MultiSelectOption<T>) => void;
}

// Memoized internal component to handle exit animation for each token
const AnimatedTokenWrapper = memo(<T extends string | number = string | number>({
  option, 
  onRemove, 
  removeConfig, 
  isDisabled, 
  reducedMotion,
  renderToken,
  originalOnRemoveHandler
}: AnimatedTokenWrapperProps<T>) => {
  const [isExiting, setIsExiting] = useState(false);

  // Animation for opacity and scale
  const { value: animProgress } = useGalileoStateSpring(isExiting ? 0 : 1, {
    ...removeConfig,
    immediate: reducedMotion
  });

  // Memoize the trigger exit handler
  const triggerExit = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isDisabled) {
      setIsExiting(true);
    }
  }, [isDisabled]);

  // Handle animation completion
  useEffect(() => {
    if (isExiting) {
      // Trigger actual removal after animation
      const timeout = setTimeout(() => {
        onRemove(option.value);
      }, 300); // Match animation duration
      return () => clearTimeout(timeout);
    }
  }, [isExiting, onRemove, option.value]);

  // Memoize animated styles
  const animatedStyle = useMemo(() => ({
    opacity: animProgress,
    transform: `scale(${0.8 + animProgress * 0.2})`, // Scale from 1 down to 0.8
  }), [animProgress]);

  // If using custom renderer, wrap it
  if (renderToken) {
      const handleRemove = useCallback(() => onRemove(option.value), [onRemove, option.value]);
      return (
          <div style={animatedStyle} className={cn('galileo-multiselect-token-wrapper')}>
              {renderToken(option, handleRemove)}
          </div>
      );
  }

  // Default rendering using original Token component
  return (
    <div style={animatedStyle} className={cn('galileo-multiselect-token-wrapper')}>
      <Token
        className={cn('galileo-multiselect-token')} // Keep class for entrance animation targetting
        $isDisabled={!!isDisabled} // Pass disabled state
        // Static transform props, animation is handled by wrapper style
        $translateX={0}
        $translateY={0}
        $scale={1} 
        $isDragging={false}
        // $initialOpacity={1} // Opacity handled by wrapper
      >
        <TokenLabel>{option.label}</TokenLabel>
        {!(isDisabled) && (
          <RemoveButton
            className={cn('remove-button')}
            onClick={triggerExit} // Call triggerExit here
            aria-label={`Remove ${option.label}`}
          >
            <ClearIcon />
          </RemoveButton>
        )}
      </Token>
    </div>
  );
});

// Memoized helper function for deep equality comparison of options arrays
const areOptionsEqual = memo(<T extends string | number>(a: MultiSelectOption<T>[], b: MultiSelectOption<T>[]): boolean => {
  if (a.length !== b.length) return false;
  
  for (let i = 0; i < a.length; i++) {
    const aOption = a[i];
    const bOption = b[i];
    if (aOption.id !== bOption.id || aOption.label !== bOption.label) {
      return false;
    }
  }
  
  return true;
});

// Define the actual component function that accepts props and ref
const GlassMultiSelectInternal = <T extends string | number = string | number>(
  props: MultiSelectProps<T> & AnimationProps,
  ref: React.ForwardedRef<HTMLDivElement>
) => {
  return <div>Test</div>;
};

// Forward Ref and Export with proper typing
export const GlassMultiSelect = forwardRef(GlassMultiSelectInternal) as <T extends string | number = string | number>(
  props: MultiSelectProps<T> & AnimationProps & { ref?: React.ForwardedRef<HTMLDivElement> }
) => React.ReactElement;

// Add display name
(GlassMultiSelect as any).displayName = 'GlassMultiSelect';

export default GlassMultiSelect;
