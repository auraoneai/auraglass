import { useReducedMotion } from '@/hooks/useReducedMotion';
/**
 * AuraGlass Liquid Glass Transitions
 * Fluid morphing transitions between glass states
 */

import React, { useRef, useEffect, useState, useCallback, forwardRef } from 'react';
import { motion, useSpring, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { cn } from '../../lib/utilsComprehensive';
import { OptimizedGlass } from '../../primitives';

interface LiquidTransitionProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'morph' | 'flow' | 'ripple' | 'dissolve' | 'splash';
  duration?: number;
  stiffness?: number;
  damping?: number;
  tension?: number;
  mass?: number;
  interactive?: boolean;
  trigger?: 'hover' | 'click' | 'auto' | 'scroll';
  intensity?: number;
}

export const GlassLiquidTransition = forwardRef<HTMLDivElement, LiquidTransitionProps>(({
  const prefersReducedMotion = useReducedMotion();
  children,
  className,
  variant = 'morph',
  duration = 1000,
  stiffness = 100,
  damping = 10,
  tension = 200,
  mass = 1,
  interactive = true,
  trigger = 'hover',
  intensity = 1,
  ...restProps
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerElement, setContainerElement] = useState<HTMLDivElement | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Default values for missing props
  const containerId = `liquid-transition-${Math.random().toString(36).substr(2, 9)}`;
  const role = 'region';
  const ariaLabel = 'Liquid morphing container';
  const shouldAnimate = true;
  const morphAmount = isActive ? 1 : 0;
  const morphOnScroll = trigger === 'scroll';
  const morphIntensity = intensity;

  // Motion values for liquid effect
  const liquidX = useMotionValue(0);
  const liquidY = useMotionValue(0);
  const liquidScale = useMotionValue(1);
  const liquidRotate = useMotionValue(0);

  // Spring physics
  const springConfig = { stiffness, damping, mass };
  const smoothX = useSpring(liquidX, springConfig);
  const smoothY = useSpring(liquidY, springConfig);
  const smoothScale = useSpring(liquidScale, { ...springConfig, stiffness: stiffness * 2 });
  const smoothRotate = useSpring(liquidRotate, springConfig);

  // Transform values for different effects
  const morphX = useTransform(smoothX, [-1, 1], [-20 * intensity, 20 * intensity]);
  const morphY = useTransform(smoothY, [-1, 1], [-20 * intensity, 20 * intensity]);
  const flowScale = useTransform(smoothScale, [0.8, 1.2], [0.95, 1.05]);

  // Update containerElement from ref
  useEffect(() => {
    if (containerRef.current) {
      setContainerElement(containerRef.current);
    }
  }, []);

  // Handle mouse movement for interactive effects
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !containerElement) return;

    const rect = containerElement.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    setMousePos({ x, y });

    if (variant === 'morph' || variant === 'flow') {
      liquidX.set(x * 2);
      liquidY.set(y * 2);
    }

    if (variant === 'ripple') {
      const distance = Math.sqrt(x * x + y * y);
      liquidScale.set(1 + distance * 0.5);
      liquidRotate.set(Math.atan2(y, x) * 180 / Math.PI);
    }
  }, [interactive, variant, liquidX, liquidY, liquidScale, liquidRotate]);

  // Handle trigger events
  const handleTrigger = useCallback(() => {
    if (trigger === 'click') {
      setIsActive(!isActive);
    }
  }, [trigger, isActive]);

  // Auto trigger effect
  useEffect(() => {
    if (trigger === 'auto') {
      const interval = setInterval(() => {
        setIsActive((prev: any) => !prev);
      }, duration * 2);

      return () => clearInterval(interval);
    }
  }, [trigger, duration]);

  // Scroll trigger effect
  useEffect(() => {
    if (trigger === 'scroll') {
      const handleScroll = () => {
        const scrollProgress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
        liquidScale.set(1 + scrollProgress * 0.2);
        liquidRotate.set(scrollProgress * 360);
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [trigger, liquidScale, liquidRotate]);

  // Get variant-specific animation
  const getVariantAnimation = () => {
    switch (variant) {
      case 'morph':
        return {
          initial: {
            borderRadius: '12px',
            scale: 1,
          },
          animate: {
            borderRadius: isActive ? '50%' : '12px',
            scale: isActive ? 1.1 : 1,
          },
          transition: {
            type: 'spring',
            tension,
            friction: 20,
          },
          style: {
            x: morphX,
            y: morphY,
          },
        };

      case 'flow':
        return {
          initial: {
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          },
          animate: {
            clipPath: isActive
              ? 'polygon(5% 5%, 95% 10%, 90% 95%, 10% 90%)'
              : 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          },
          transition: {
            duration: duration / 1000,
            ease: 'easeInOut',
          },
          style: {
            scale: flowScale,
          },
        };

      case 'ripple':
        return {
          initial: { scale: 1, opacity: 1 },
          animate: {
            scale: [1, 1.2, 1],
            opacity: [1, 0.8, 1],
          },
          transition: {
            duration: duration / 1000,
            repeat: isActive ? Infinity : 0,
            ease: 'easeInOut',
          },
        };

      case 'dissolve':
        return {
          initial: {
            filter: 'blur(0px)',
            opacity: 1,
          },
          animate: {
            filter: isActive ? 'blur(var(--glass-blur-md))' : 'blur(0px)',
            opacity: isActive ? 0.7 : 1,
            scale: isActive ? 1.05 : 1,
          },
          transition: {
            duration: duration / 1000,
            ease: 'easeInOut',
          },
        };

      case 'splash':
        return {
          initial: {
            scale: 0,
            opacity: 0,
            rotate: 0,
          },
          animate: {
            scale: isActive ? [0, 1.5, 1] : 0,
            opacity: isActive ? [0, 1, 0.8] : 0,
            rotate: isActive ? [0, 180, 360] : 0,
          },
          transition: {
            duration: duration / 1000,
            times: [0, 0.5, 1],
            ease: 'easeOut',
          },
        };

      default:
        return {};
    }
  };

  const animationProps = getVariantAnimation();

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden",
        "transform-gpu will-change-transform",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => trigger === 'hover' && setIsActive(true)}
      onMouseLeave={() => trigger === 'hover' && setIsActive(false)}
      onClick={handleTrigger}
      {...animationProps}
    >
      {/* Liquid glass overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(
            circle at ${50 + mousePos.x * 50}% ${50 + mousePos.y * 50}%,
            rgba(var(--glass-color-primary) / 0.3) 0%,
            transparent 70%
          )`,
          x: smoothX,
          y: smoothY,
          scale: smoothScale,
          rotate: smoothRotate,
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Additional liquid effects */}
      {variant === 'ripple' && isActive && (
        <LiquidRipples
          x={mousePos.x}
          y={mousePos.y}
          intensity={intensity}
          duration={duration}
        />
      )}

      {variant === 'splash' && isActive && (
        <LiquidSplash
          x={mousePos.x}
          y={mousePos.y}
          intensity={intensity}
          duration={duration}
        />
      )}
    </motion.div>
  );
});

GlassLiquidTransition.displayName = 'GlassLiquidTransition';

// Liquid ripple effect component
interface LiquidRipplesProps {
  x: number;
  y: number;
  intensity: number;
  duration: number;
}

function LiquidRipples({ x, y, intensity, duration }: LiquidRipplesProps): JSX.Element {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    const ripple = { id: Date.now(), x, y };
    setRipples((prev: any) => [...prev, ripple]);

    setTimeout(() => {
      setRipples((prev: any) => prev.filter((r: any) => r.id !== ripple.id));
    }, duration);
  }, [x, y, duration]);

  return (
    <AnimatePresence>
      {ripples.map((ripple: any) => (
        <motion.div
          key={ripple.id}
          className="absolute pointer-events-none"
          initial={{ scale: 0, opacity: 1 }}
          animate={prefersReducedMotion ? {} : { scale: 3 * intensity, opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: duration / 1000, ease: 'easeOut'  }}
          style={{
            left: `${50 + ripple.x * 50}%`,
            top: `${50 + ripple.y * 50}%`,
            x: '-50%',
            y: '-50%',
          }}
        >
          <OptimizedGlass intensity="medium" blur="strong" className="w-32 h-32 glass-radius-full border-2 border-white/30" />
        </motion.div>
      ))}
    </AnimatePresence>
  );
}

// Liquid splash effect component
interface LiquidSplashProps {
  x: number;
  y: number;
  intensity: number;
  duration: number;
}

function LiquidSplash({ x, y, intensity, duration }: LiquidSplashProps): JSX.Element {
  const particleCount = Math.floor(8 * intensity);

  return (
    <AnimatePresence>
      {Array.from({ length: particleCount }).map((_: any, i: any) => {
        const angle = (i / particleCount) * Math.PI * 2;
        const distance = 100 * intensity;

        return (
          <motion.div
            key={i}
            className="absolute pointer-events-none"
            initial={{
              x: `${50 + x * 50}%`,
              y: `${50 + y * 50}%`,
              scale: 0,
              opacity: 1,
            }}
            animate={{
              x: `${50 + x * 50 + Math.cos(angle) * distance}%`,
              y: `${50 + y * 50 + Math.sin(angle) * distance}%`,
              scale: [0, 1, 0],
              opacity: [1, 0.5, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 
              duration: duration / 1000,
              ease: 'easeOut',
             }}
            style={{
              translateX: '-50%',
              translateY: '-50%',
            }}
          >
            <div className="w-4 h-4 glass-radius-full glass-surface-primary" />
          </motion.div>
        );
      })}
    </AnimatePresence>
  );
}

// Liquid morph container
interface GlassLiquidContainerProps {
  children: React.ReactNode;
  className?: string;
  morphOnScroll?: boolean;
  morphIntensity?: number;
}

export const GlassLiquidContainer = React.forwardRef<HTMLDivElement, GlassLiquidContainerProps>(({
  children,
  className,
  morphOnScroll = false,
  morphIntensity = 1,
  ...restProps
}, ref): JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerElement, setContainerElement] = useState<HTMLDivElement | null>(null);
  const [morphAmount, setMorphAmount] = useState(0);

  // Default values for missing props
  const containerId = `liquid-container-${Math.random().toString(36).substr(2, 9)}`;
  const role = 'region';
  const ariaLabel = 'Liquid morphing container';
  const shouldAnimate = true;

  useEffect(() => {
    if (!morphOnScroll) return;

    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const elementCenter = rect.top + rect.height / 2;
      const distanceFromCenter = Math.abs(viewportHeight / 2 - elementCenter);
      const maxDistance = viewportHeight / 2;

      const morph = Math.max(0, 1 - distanceFromCenter / maxDistance);
      setMorphAmount(morph * morphIntensity);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll);
  }, [morphOnScroll, morphIntensity, containerRef]);

  return (
    <motion.div
      ref={(node) => {
        // Handle forwarded ref
        if (ref) {
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref && 'current' in ref && Object.getOwnPropertyDescriptor(ref, 'current')?.writable !== false) {
            (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
          }
        }
        // Update internal state
        setContainerElement(node);
      }}
      className={cn("relative", className)}
      id={containerId}
      role={role}
      aria-label={ariaLabel}
      style={shouldAnimate ? {
        borderRadius: `${12 + morphAmount * 38}px`,
        transform: `scale(${1 + morphAmount * 0.05})`,
      } : {}}
      transition={shouldAnimate ? { type: 'spring', stiffness: 100, damping: 20 } : {}}
      {...restProps}
    >
      <OptimizedGlass
        intensity="subtle"
        blur="medium"
        className="w-full h-full"
      >
        {children}
      </OptimizedGlass>
    </motion.div>
  );
});

GlassLiquidContainer.displayName = 'GlassLiquidContainer';

// Preset liquid transitions
export const liquidPresets = {
  water: {
    variant: 'flow' as const,
    stiffness: 50,
    damping: 8,
    intensity: 0.8,
  },
  honey: {
    variant: 'morph' as const,
    stiffness: 20,
    damping: 15,
    intensity: 1.2,
  },
  mercury: {
    variant: 'ripple' as const,
    stiffness: 200,
    damping: 5,
    intensity: 0.6,
  },
  gel: {
    variant: 'dissolve' as const,
    stiffness: 80,
    damping: 12,
    intensity: 1,
  },
  plasma: {
    variant: 'splash' as const,
    stiffness: 150,
    damping: 10,
    intensity: 1.5,
  },
};

