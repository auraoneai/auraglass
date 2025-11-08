'use client';
/**
 * AtmosphericBackground Component
 *
 * A dynamic background component with atmospheric effects.
 */
import React, { forwardRef, useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { cn } from '@/lib/utils';

import { OptimizedGlass } from '../../primitives';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useMotionPreferenceContext } from '../../contexts/MotionPreferenceContext';
import { useA11yId } from '../../utils/a11y';
import { AtmosphericBackgroundProps } from './types';

// Animation keyframes
const gradientShift = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const cloudMove = keyframes`
  0% {
    transform: translateX(-5%) translateY(0);
  }
  50% {
    transform: translateX(5%) translateY(-3%);
  }
  100% {
    transform: translateX(-5%) translateY(0);
  }
`;

// Default gradient colors
const defaultGradientColors = [
  'var(--glass-color-primary, 0.5)', // Blue
  'rgba(99, 102, 241, 0.5)', // Indigo
  'rgba(139, 92, 246, 0.5)', // Purple
  'rgba(244, 114, 182, 0.5)', // Pink
];

// Styled components with OptimizedGlass integration
const BackgroundContainer = styled(OptimizedGlass).attrs<{
  $intent: string;
  $elevation: string;
  $tier: string;
}>(props => ({
  intent: props.$intent as any,
  elevation: props.$elevation as any,
  tier: props.$tier as any,
}))`
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
  
  /* Ensure background is accessible */
  &:focus {
    outline: 2px solid var(--glass-border-focus);
    outline-offset: 2px;
  }
` as React.ComponentType<any>;

const GradientLayer = styled.div<{
  $baseColor: string;
  $gradientColors: string[];
  $animate: boolean;
  $duration: number;
  $intensity: number;
  $reducedMotion: boolean;
  $interactive: boolean;
  $cursorX: number;
  $cursorY: number;
}>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${props => props.$baseColor};
  background-image: linear-gradient(125deg, ${props => props.$gradientColors.join(', ')});
  background-size: ${props => (props.$interactive ? '300% 300%' : '200% 200%')};
  background-position: ${props =>
    props.$interactive
      ? `${50 + (props.$cursorX - 50) * 0.2}% ${50 + (props.$cursorY - 50) * 0.2}%`
      : '0% 0%'};
  opacity: ${props => props.$intensity};

  /* Animation */
  ${props =>
    props.$animate &&
    !props.$reducedMotion &&
    !props.$interactive &&
    css`
      animation: ${css`${gradientShift} ${props.$duration}s ease infinite`};
    `}

  /* Interactive mode */
  ${props =>
    props.$interactive &&
    css`
      transition: background-position 0.3s ease;
    `}
`;

const AtmosphericEffect = styled.div<{
  $animate: boolean;
  $reducedMotion: boolean;
}>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600' width='600' height='600' opacity='0.15'%3E%3Cfilter id='a'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.005' numOctaves='5' stitchTiles='stitch' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23a)' opacity='0.15'/%3E%3C/svg%3E");
  background-size: cover;
  opacity: 0.4;
  mix-blend-mode: overlay;
  pointer-events: none;

  /* Animation */
  ${props =>
    props.$animate &&
    !props.$reducedMotion &&
    css`
      animation: ${css`${cloudMove} 30s ease infinite`};
    `}
`;

const BlurLayer = styled.div<{
  $blur: boolean;
  $blurAmount: number;
}>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  backdrop-filter: ${props => (props.$blur ? `blur(${props.$blurAmount}px)` : 'none')};
  -webkit-backdrop-filter: ${props => (props.$blur ? `blur(${props.$blurAmount}px)` : 'none')};
  pointer-events: none;
`;

const ContentLayer = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
`;

/**
 * AtmosphericBackground Component Implementation
 */
const AtmosphericBackgroundComponent = (
  props: AtmosphericBackgroundProps,
  ref: React.ForwardedRef<HTMLDivElement>
) => {
  const {
    children,
    className,
    style,
    baseColor = 'rgba(10, 10, 20, 0.8)',
    gradientColors = defaultGradientColors,
    intensity = 0.7,
    animate = true,
    animationDuration = 15,
    interactive = false,
    blur = false,
    blurAmount = 5,
    intent = 'neutral',
    elevation = 'level2',
    tier = 'medium',
    respectMotionPreference = true,
    ...rest
  } = props;

  // Accessibility and motion preferences
  const componentId = useA11yId('atmospheric-bg');
  const prefersReducedMotion = useReducedMotion();
  const { prefersReducedMotion: motionPrefersReduced } = useMotionPreferenceContext();
  
  // Determine if motion should be reduced based on all preferences
  const shouldReduceMotion = respectMotionPreference && (prefersReducedMotion || motionPrefersReduced);

  // State for mouse position
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  // Ref for background container
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle mouse movement for interactive mode
  useEffect(() => {
    if (!interactive || shouldReduceMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();

      // Calculate mouse position as percentage
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [interactive, shouldReduceMotion]);

  // Handle forwarded ref
  const setRefs = (element: HTMLDivElement) => {
    if (containerRef.current !== element) {
      (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = element;
    }

    // Handle the forwarded ref
    if (typeof ref === 'function') {
      ref(element);
    } else if (ref) {
      (ref as React.MutableRefObject<HTMLDivElement | null>).current = element;
    }
  };

  return (
    <BackgroundContainer 
      ref={setRefs} 
      className={cn('glass-atmospheric-background', className)} 
      style={style}
      $intent={intent}
      $elevation={elevation}
      $tier={tier}
      id={componentId}
      role="img"
      aria-label={`Atmospheric background with ${animate && !shouldReduceMotion ? 'animated' : 'static'} ${gradientColors.length} color gradient`}
      aria-hidden="true"
      tabIndex={interactive ? 0 : -1}
      {...rest}
    >
      <GradientLayer
        $baseColor={baseColor}
        $gradientColors={gradientColors}
        $animate={animate && !shouldReduceMotion}
        $duration={animationDuration}
        $intensity={intensity}
        $reducedMotion={shouldReduceMotion}
        $interactive={interactive && !shouldReduceMotion}
        $cursorX={mousePosition.x}
        $cursorY={mousePosition.y}
      />

      <AtmosphericEffect 
        $animate={animate && !shouldReduceMotion} 
        $reducedMotion={shouldReduceMotion} 
      />

      <BlurLayer $blur={blur} $blurAmount={blurAmount} />

      <ContentLayer>{children}</ContentLayer>
    </BackgroundContainer>
  );
};

/**
 * AtmosphericBackground Component
 *
 * A dynamic background component with atmospheric effects.
 */
const AtmosphericBackground = forwardRef(AtmosphericBackgroundComponent);
AtmosphericBackground.displayName = 'AtmosphericBackground';

export default AtmosphericBackground;
