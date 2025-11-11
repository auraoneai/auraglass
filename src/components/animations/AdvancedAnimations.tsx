'use client';
import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utilsComprehensive";
/**
 * Advanced Animation Easing Functions
 * Provides sophisticated easing curves for glassmorphism transitions
 */

// Cubic bezier easing functions for advanced animations
export const easings = {
  // Exponential easing functions
  easeOutExpo: (t: number): number => {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  },

  easeInExpo: (t: number): number => {
    return t === 0 ? 0 : Math.pow(2, 10 * (t - 1));
  },

  easeInOutExpo: (t: number): number => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    if (t < 0.5) return Math.pow(2, 20 * t - 10) / 2;
    return (2 - Math.pow(2, -20 * t + 10)) / 2;
  },

  // Back easing functions
  easeOutBack: (t: number): number => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },

  easeInBack: (t: number): number => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return c3 * t * t * t - c1 * t * t;
  },

  easeInOutBack: (t: number): number => {
    const c1 = 1.70158;
    const c2 = c1 * 1.525;

    if (t < 0.5) {
      return (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2;
    } else {
      return (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
    }
  },

  // Cubic easing functions
  easeInCubic: (t: number): number => {
    return t * t * t;
  },

  easeOutCubic: (t: number): number => {
    return 1 - Math.pow(1 - t, 3);
  },

  easeInOutCubic: (t: number): number => {
    if (t < 0.5) {
      return 4 * t * t * t;
    } else {
      return 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
  },

  // Elastic easing functions
  easeOutElastic: (t: number): number => {
    const c4 = (2 * Math.PI) / 3;

    if (t === 0) return 0;
    if (t === 1) return 1;
    return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },

  easeInElastic: (t: number): number => {
    const c4 = (2 * Math.PI) / 3;

    if (t === 0) return 0;
    if (t === 1) return 1;
    return -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4);
  },

  // Bounce easing
  easeOutBounce: (t: number): number => {
    const n1 = 7.5625;
    const d1 = 2.75;

    if (t < 1 / d1) {
      return n1 * t * t;
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75;
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375;
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
  },

  // Smooth step functions
  smoothStep: (t: number): number => {
    return t * t * (3 - 2 * t);
  },

  smootherStep: (t: number): number => {
    return t * t * t * (t * (6 * t - 15) + 10);
  },

  // Glass-specific easing for material physics
  glassEase: (t: number): number => {
    // Custom easing that mimics glass material behavior
    // Starts slow, accelerates, then gently settles
    if (t < 0.3) {
      return t * t * 3.333; // Ease in
    } else if (t < 0.7) {
      return 0.3 + (t - 0.3) * 1.428; // Linear acceleration
    } else {
      return 0.7 + (t - 0.7) * (t - 0.7) * 3.333; // Ease out
    }
  },

  // Shatter easing for glass break effects
  shatterEase: (t: number): number => {
    // Exponential decay with bounce for shattering glass
    const decay = Math.pow(1 - t, 2);
    const bounce = Math.sin(t * Math.PI * 4) * Math.pow(1 - t, 0.5) * 0.1;
    return decay + bounce;
  }
};

// Glass transition presets using the easing functions
export const glassTransitionPresets = {
  subtle: {
    duration: 0.3,
    ease: easings.easeOutCubic
  },
  smooth: {
    duration: 0.5,
    ease: easings.easeInOutCubic
  },
  dramatic: {
    duration: 0.8,
    ease: easings.easeOutBack
  },
  glass: {
    duration: 0.6,
    ease: easings.glassEase
  },
  shatter: {
    duration: 1.2,
    ease: easings.shatterEase
  }
};

export interface AdvancedAnimationsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  sampleCount?: number;
  children?: React.ReactNode;
}

const easingSampleKeys = [
  'subtle',
  'smooth',
  'dramatic',
  'glass',
  'shatter'
] as const;

export const AdvancedAnimations: React.FC<AdvancedAnimationsProps> = ({
  sampleCount = 4,
  className,
  children,
  ...rest
}) => {
  const keys = easingSampleKeys.slice(0, Math.max(1, sampleCount));

  return (
    <div
      className={cn(
        'glass-advanced-animations glass-space-y-6',
        className
      )}
      {...rest}
    >
      {children ?? (
        <div className='glass-grid sm:grid-cols-2 glass-gap-4'>
          {keys.map((key) => {
            const preset = glassTransitionPresets[key];
            return (
              <motion.div
                key={key}
                className="glass-surface-primary glass-radius-2xl glass-p-6 glass-space-y-3 glass-border glass-border-white/10"
                animate={{ y: [0, -8, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: preset.duration,
                  ease: preset.ease as any
                }}
              >
                <p className='glass-text-xs glass-text-tertiary uppercase tracking-wide'>
                  {key}
                </p>
                <h3 className='glass-text-xl glass-text-primary font-semibold'>
                  {key === 'glass' ? 'Material physics' : 'Easing preview'}
                </h3>
                <div className="glass-h-2 glass-rounded-full glass-surface-subtle">
                  <motion.div
                    className="glass-h-full glass-radius-full glass-gradient-primary"
                    animate={{ width: ['10%', '90%', '10%'] }}
                    transition={{
                      repeat: Infinity,
                      duration: preset.duration,
                      ease: preset.ease as any
                    }}
                  />
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  );
};

export default AdvancedAnimations;
