import { Variants } from 'framer-motion';

export const createMotionAwareVariants = {
  fadeInScale: (prefersReducedMotion: boolean) => ({
    hidden: prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 },
    visible: prefersReducedMotion ? { opacity: 1, scale: 1, transition: { duration: 0 } } : { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
  }),

  slideIn: (direction: 'left' | 'right' | 'up' | 'down', prefersReducedMotion: boolean) => {
    const directionMap = {
      left: { x: -50 },
      right: { x: 50 },
      up: { y: -50 },
      down: { y: 50 },
    };

    return {
      hidden: prefersReducedMotion ? { opacity: 1, ...directionMap[direction] } : { opacity: 0, ...directionMap[direction] },
      visible: prefersReducedMotion ? { opacity: 1, x: 0, y: 0, transition: { duration: 0 } } : { opacity: 1, x: 0, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
    };
  },

  fadeInUp: (prefersReducedMotion: boolean) => ({
    hidden: prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    visible: prefersReducedMotion ? { opacity: 1, y: 0, transition: { duration: 0 } } : { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  }),
};

export const createMotionAwareInteractive = {
  button: (prefersReducedMotion: boolean) => ({
    whileHover: prefersReducedMotion ? {} : { scale: 1.02 },
    whileTap: prefersReducedMotion ? {} : { scale: 0.98 },
    transition: prefersReducedMotion ? { duration: 0 } : { duration: 0.2 },
  }),

  card: (prefersReducedMotion: boolean) => ({
    whileHover: prefersReducedMotion ? {} : { y: -2, scale: 1.01 },
    transition: prefersReducedMotion ? { duration: 0 } : { duration: 0.2 },
  }),
};
