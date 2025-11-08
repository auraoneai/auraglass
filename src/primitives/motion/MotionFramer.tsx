import React, { forwardRef, HTMLAttributes, useEffect, useMemo, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { cn } from '@/design-system/utilsCore';

export type AnimationPreset =
  | 'fadeIn'
  | 'slideIn'
  | 'slideDown'
  | 'slideUp'
  | 'slideLeft'
  | 'slideRight'
  | 'scaleIn'
  | 'rotateIn'
  | 'bounceIn'
  | 'pulseIn'
  | 'none';

export type AnimationEasing = 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'spring';

export interface MotionProps extends HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  preset?: AnimationPreset;
  type?: 'fade' | 'slide' | 'scale' | 'bounce' | 'rotate' | 'pulse';
  direction?: 'up' | 'down' | 'left' | 'right' | 'center';
  duration?: number;
  delay?: number;
  easing?: AnimationEasing;
  animateOnMount?: boolean;
  animateOnHover?: boolean;
  animateOnScroll?: boolean;
}

// --- Utilities to avoid non-animatable background warnings ---
function isSimpleColor(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  const v = value.trim();
  if (v === 'transparent') return true;
  // rgb/rgba
  if (/^rgba?\(/i.test(v)) return true;
  // hsl/hsla
  if (/^hsla?\(/i.test(v)) return true;
  // hex
  if (/^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(v)) return true;
  // CSS variable (often colors in this lib)
  if (/^var\(/i.test(v)) return true;
  return false;
}

function coerceBackgroundKey(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj;
  // Copy to avoid mutating user objects
  const copy: any = Array.isArray(obj) ? obj.map((v) => v) : { ...obj };
  for (const key of Object.keys(copy)) {
    const val = (copy as any)[key];
    if (key === 'background') {
      if (isSimpleColor(val)) {
        // Move to backgroundColor to make it animatable
        (copy as any).backgroundColor = val === 'transparent' ? 'rgba(0, 0, 0, 0)' : val;
        delete (copy as any).background;
      }
    } else if (typeof val === 'object' && val) {
      (copy as any)[key] = coerceBackgroundKey(val);
    }
  }
  return copy;
}

// Normalize easing values to what Framer Motion expects
function normalizeEasingValue(value: any): any {
  if (typeof value === 'string') {
    const e = value.trim().toLowerCase();
    if (e === 'ease-in') return 'easeIn';
    if (e === 'ease-out') return 'easeOut';
    if (e === 'ease-in-out' || e === 'ease') return 'easeInOut';
    if (e === 'linear') return 'linear';
    if (e.startsWith('cubic-bezier(') && e.endsWith(')')) {
      const nums = e
        .slice('cubic-bezier('.length, -1)
        .split(',')
        .map((n) => parseFloat(n.trim()))
        .filter((n) => Number.isFinite(n));
      if (nums.length === 4) return nums as unknown as number[];
    }
  }
  return value;
}

// Recursively walk an object and normalize any transition.easing/ease occurrences
function normalizeTransitions(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj;
  const copy: any = Array.isArray(obj) ? obj.map((v) => normalizeTransitions(v)) : { ...obj };
  for (const key of Object.keys(copy)) {
    const val = copy[key];
    if (key === 'transition') {
      if (typeof val === 'string') {
        // Strings are not valid for Framer transitions; drop to avoid runtime errors
        delete copy[key];
        continue;
      }
      if (val && typeof val === 'object') {
        const t = { ...val };
        if ('easing' in t && !('ease' in t)) {
          t.ease = normalizeEasingValue((t as any).easing);
          delete (t as any).easing;
        } else if ('ease' in t) {
          t.ease = normalizeEasingValue((t as any).ease);
        }
        copy[key] = t;
      }
    } else if (typeof val === 'object' && val) {
      copy[key] = normalizeTransitions(val);
    }
  }
  return copy;
}

function getVariants(preset: AnimationPreset): Variants {
  switch (preset) {
    case 'fadeIn':
      return { initial: { opacity: 0 }, animate: { opacity: 1 } };
    case 'slideIn':
      return { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };
    case 'slideDown':
      return { initial: { opacity: 0, y: -12 }, animate: { opacity: 1, y: 0 } };
    case 'slideUp':
      return { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };
    case 'slideLeft':
      return { initial: { opacity: 0, x: 12 }, animate: { opacity: 1, x: 0 } };
    case 'slideRight':
      return { initial: { opacity: 0, x: -12 }, animate: { opacity: 1, x: 0 } };
    case 'scaleIn':
      return { initial: { opacity: 0, scale: 0.96 }, animate: { opacity: 1, scale: 1 } };
    case 'rotateIn':
      return { initial: { opacity: 0, rotate: -8 }, animate: { opacity: 1, rotate: 0 } };
    case 'bounceIn':
      return {
        initial: { opacity: 0, scale: 0.3 },
        animate: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 330, damping: 20 } },
      };
    case 'pulseIn':
      return {
        initial: { opacity: 0.8, scale: 1.04 },
        animate: { opacity: 1, scale: 1 },
      };
    default:
      return { initial: {}, animate: {} };
  }
}

export const MotionFramer = forwardRef<HTMLDivElement, MotionProps>(
  (
    {
      preset = 'none',
      duration = 300,
      delay = 0,
      easing = 'ease-in-out',
      animateOnMount = true,
      animateOnHover = false,
      animateOnScroll = false,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const [reduced, setReduced] = useState(false);
    useEffect(() => {
      if (typeof window === 'undefined' || !('matchMedia' in window)) return;
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      const update = () => setReduced(!!mq.matches);
      update();
      if ('addEventListener' in mq) {
        mq.addEventListener('change', update);
        return () => mq.removeEventListener('change', update);
      } else {
        // @ts-ignore older Safari
        mq.addListener(update);
        // @ts-ignore older Safari
        return () => mq.removeListener(update);
      }
    }, []);

    const effectivePreset = reduced ? 'none' : preset;
    const variants = useMemo(() => getVariants(effectivePreset), [effectivePreset]);
    const easingMap: Record<string, any> = {
      linear: 'linear',
      ease: 'easeInOut',
      'ease-in': 'easeIn',
      'ease-out': 'easeOut',
      'ease-in-out': 'easeInOut',
    };
    const transition: any = reduced ? { duration: 0.0001, delay: 0 } : { duration: duration / 1000, delay: delay / 1000 };
    if (easing === 'spring') {
      transition.type = 'spring';
    } else if (easing) {
      transition.ease = easingMap[easing] || 'easeInOut';
    }

    const baseProps: any = {
      ref,
      className: cn('motion-primitive', className),
      style,
      initial: reduced ? undefined : (animateOnMount || animateOnScroll ? 'initial' : undefined),
      animate: reduced ? undefined : 'animate',
      variants,
      transition,
    };

    if (!reduced && animateOnScroll) {
      baseProps.initial = 'initial';
      baseProps.whileInView = 'animate';
      baseProps.viewport = { once: true, amount: 0.2 };
    }

    if (!reduced && animateOnHover) {
      baseProps.whileHover = { scale: 1.015 };
    }

    // Sanitize incoming motion props to avoid animating unsupported CSS shorthands like `background`
    // and to normalize easing names in transition objects passed by callers.
    let sanitizedProps: any = { ...props };
    // Strip non-DOM custom flags that might leak
    if ('consciousness' in sanitizedProps) delete sanitizedProps.consciousness;
    const coerce = (obj: any) => normalizeTransitions(coerceBackgroundKey(obj));
    if (sanitizedProps.animate && typeof sanitizedProps.animate === 'object') {
      sanitizedProps.animate = coerce(sanitizedProps.animate);
    }
    if (sanitizedProps.initial && typeof sanitizedProps.initial === 'object') {
      sanitizedProps.initial = coerce(sanitizedProps.initial);
    }
    if (sanitizedProps.exit && typeof sanitizedProps.exit === 'object') {
      sanitizedProps.exit = coerce(sanitizedProps.exit);
    }
    if (sanitizedProps.whileHover && typeof sanitizedProps.whileHover === 'object') {
      sanitizedProps.whileHover = coerce(sanitizedProps.whileHover);
    }
    if (sanitizedProps.whileInView && typeof sanitizedProps.whileInView === 'object') {
      sanitizedProps.whileInView = coerce(sanitizedProps.whileInView);
    }
    if (sanitizedProps.variants && typeof sanitizedProps.variants === 'object') {
      sanitizedProps.variants = coerce(sanitizedProps.variants);
    }
    if (sanitizedProps.transition) {
      sanitizedProps = normalizeTransitions(sanitizedProps);
    }
    if (sanitizedProps.style && typeof sanitizedProps.style === 'object' && 'background' in sanitizedProps.style) {
      const bg = sanitizedProps.style.background;
      if (isSimpleColor(bg)) {
        sanitizedProps.style = { ...sanitizedProps.style, backgroundColor: bg === 'transparent' ? 'rgba(0, 0, 0, 0)' : bg };
        delete sanitizedProps.style.background;
      }
    }

    return (
      <motion.div {...baseProps} {...sanitizedProps}>
        {children}
      </motion.div>
    );
  }
);

MotionFramer.displayName = 'MotionFramer';
