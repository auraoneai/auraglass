import React, { useRef, useState, useCallback, useEffect, forwardRef, CSSProperties } from 'react';
import { cn } from '@/lib/utils';
import { GlassButton, GlassButtonProps } from './GlassButton';
import { Slot } from '@radix-ui/react-slot';
import { Motion } from '../../primitives';
import { announceToScreenReader } from '../../utils/a11y';
import { getSafeWindow, isBrowser, safeMatchMedia } from '../../utils/env';

export interface MagneticButtonProps extends GlassButtonProps {
  /**
   * Strength of the magnetic effect. Higher values mean stronger pull.
   * @default 0.5
   */
  magneticStrength?: number;
  /**
   * Radius in pixels within which the magnetic effect is active.
   * @default 150
   */
  magneticRadius?: number;
  /**
   * Damping factor for the return-to-center movement (0 to 1). Lower values are slower/smoother.
   * @default 0.8
   */
  magneticDampingFactor?: number; // Note: This is not directly used in the current calculation logic
  /**
   * Custom styles to apply to the button, merged with magnetic transform.
   */
  style?: CSSProperties;
  /**
   * If true, the component will render its child element and pass relevant props
   * (styles, event handlers) down to it, instead of rendering its own button element.
   * @default false
   */
  asChild?: boolean;
  /**
   * Whether to announce magnetic interactions to screen readers (for users who navigate with voice control)
   * @default false
   */
  announceInteractions?: boolean;
  /**
   * Whether to reduce magnetic effect when user prefers reduced motion
   * @default true
   */
  respectReducedMotion?: boolean;
}

/**
 * A GlassButton with a magnetic effect that attracts the button towards the cursor on hover.
 */
export const MagneticButton = forwardRef<HTMLElement, MagneticButtonProps>(function MagneticButton(
  {
    magneticStrength = 0.5,
    magneticRadius = 150,
    magneticDampingFactor = 0.8,
    style: propStyle,
    onPointerEnter,
    onPointerLeave,
    asChild = false,
    announceInteractions = false,
    respectReducedMotion = true,
    children,
    ...restProps
  },
  ref
) {
  const Comp = asChild ? Slot : GlassButton;

  const elementRef = useRef<HTMLElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const animationFrame = useRef<number | null>(null);

  // Check if user prefers reduced motion
  const prefersReducedMotion = useCallback(() => {
    if (!respectReducedMotion) return false;
    return safeMatchMedia('(prefers-reduced-motion: reduce)')?.matches ?? true;
  }, [respectReducedMotion]);

  // Accessibility: Announce when magnetic interaction becomes available
  const announceInteractionRef = useRef(false);
  useEffect(() => {
    if (!isBrowser()) return;
    if (announceInteractions && !announceInteractionRef.current && !prefersReducedMotion()) {
      announceToScreenReader('Interactive magnetic button available', 'polite');
      announceInteractionRef.current = true;
    }
  }, [announceInteractions, prefersReducedMotion]);

  const combinedRef = useCallback(
    (node: HTMLElement | null) => {
      if (elementRef.current !== node) {
        (elementRef as React.MutableRefObject<HTMLElement | null>).current = node;
      }
      if (ref) {
        if (typeof ref === 'function') {
          ref(node);
        } else {
          (ref as React.MutableRefObject<HTMLElement | null>).current = node;
        }
      }
    },
    [ref]
  );

  const calculateMagneticAttraction = useCallback((distanceX: number, distanceY: number, rect: DOMRect) => {
      // Disable magnetic effect if user prefers reduced motion
      if (prefersReducedMotion()) {
          return { x: 0, y: 0 };
      }

      const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

      if (distance > magneticRadius || !rect) {
          return { x: 0, y: 0 };
      }

      // Smoother falloff using cosine easing
      const normalizedDistance = distance / magneticRadius;
      const pullFactor = (Math.cos(normalizedDistance * Math.PI) + 1) / 2; // Cosine easing
      const attraction = pullFactor * magneticStrength;

      // Avoid division by zero if distance is zero
      if (distance === 0) return { x: 0, y: 0 };

      // Scale pull relative to button size (pull towards edge, not just center proportional)
      const pullToX = (distanceX / distance) * (rect.width / 2) * attraction;
      const pullToY = (distanceY / distance) * (rect.height / 2) * attraction;

      return {
          x: pullToX,
          y: pullToY,
      };
  }, [magneticRadius, magneticStrength, prefersReducedMotion]);

  const handlePointerMove = useCallback((e: PointerEvent) => {
      if (!isBrowser() || !elementRef.current || !isHovered) return;

      const rect = elementRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;

      const attraction = calculateMagneticAttraction(distanceX, distanceY, rect);

      // Directly set position based on attraction
      setPosition({
          x: attraction.x,
          y: attraction.y
      });

  }, [isHovered, calculateMagneticAttraction]);

  const returnToCenter = useCallback(() => {
      const win = getSafeWindow();
      if (!win) return;

      if (!isHovered && elementRef.current && (Math.abs(position.x) > 0.01 || Math.abs(position.y) > 0.01)) {
          // Smoother damping towards center
          const dampFactor = 0.15; // Controls speed of return (higher is faster damping)
          const nextX = position.x * (1 - dampFactor);
          const nextY = position.y * (1 - dampFactor);

          setPosition({ x: nextX, y: nextY });
          animationFrame.current = win.requestAnimationFrame(returnToCenter);
      } else if (!isHovered) {
          // Snap to center when close enough
          setPosition({ x: 0, y: 0 });
          if (animationFrame.current !== null) {
              win.cancelAnimationFrame(animationFrame.current);
              animationFrame.current = null;
          }
      } else {
          // If hovered, ensure no return animation is running
           if (animationFrame.current !== null) {
              win.cancelAnimationFrame(animationFrame.current);
              animationFrame.current = null;
          }
      }
  }, [isHovered, position.x, position.y]);

  useEffect(() => {
    if (!isBrowser()) {
      return;
    }

    const win = getSafeWindow();
    if (!win) return;

    win.addEventListener('pointermove', handlePointerMove, { capture: false, passive: true });
    return () => {
      win.removeEventListener('pointermove', handlePointerMove, { capture: false });
      if (animationFrame.current !== null) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [handlePointerMove]);

  useEffect(() => {
      // Stop any ongoing return animation if we start hovering
      if (isHovered && animationFrame.current !== null) {
          const win = getSafeWindow();
          if (win && animationFrame.current !== null) {
              win.cancelAnimationFrame(animationFrame.current);
          }
          animationFrame.current = null;
      }
      // Start return animation if we stop hovering
      else if (!isHovered) {
          // Ensure previous animation frame is cancelled before starting a new one
           if (animationFrame.current !== null) {
               cancelAnimationFrame(animationFrame.current);
           }
          const win = getSafeWindow();
          if (win) {
              animationFrame.current = win.requestAnimationFrame(returnToCenter);
          }
      }

      // Cleanup function for the effect
      return () => {
          const win = getSafeWindow();
          if (win && animationFrame.current !== null) {
              win.cancelAnimationFrame(animationFrame.current);
          }
      };
  }, [isHovered, returnToCenter]);

  const handlePointerEnter = (e: React.PointerEvent<HTMLElement>) => {
    setIsHovered(true);
    if (onPointerEnter) {
      onPointerEnter(e as any);
    }
  };

  const handlePointerLeave = (e: React.PointerEvent<HTMLElement>) => {
    setIsHovered(false);
    if (onPointerLeave) {
      onPointerLeave(e as any);
    }
  };

  const combinedStyle: CSSProperties = {
    ...propStyle,
    transform: prefersReducedMotion() ? 'none' : `translate3d(${position.x}px, ${position.y}px, 0)`,
    transition: prefersReducedMotion() 
      ? 'none'
      : isHovered 
        ? 'transform 0.05s linear' 
        : 'transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
    willChange: prefersReducedMotion() ? 'auto' : 'transform',
  };

  return (
    <Motion
      preset="none"
      className={cn('glass-inline-block')}
    >
      <Comp
        ref={combinedRef}
        style={combinedStyle}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        {...restProps}
      >
        {children}
      </Comp>
    </Motion>
  );
}
);

MagneticButton.displayName = 'MagneticButton';

export default MagneticButton; 