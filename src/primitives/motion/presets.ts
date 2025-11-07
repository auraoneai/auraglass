/**
 * Animation presets for Motion component
 * Predefined animation configurations for common use cases
 */

export const animationPresets = {
  // Fade animations
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    duration: 300,
    easing: 'ease-out',
  },
  fadeOut: {
    initial: { opacity: 1 },
    animate: { opacity: 0 },
    exit: { opacity: 1 },
    duration: 300,
    easing: 'ease-in',
  },
  
  // Slide animations
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    duration: 400,
    easing: 'ease-out',
  },
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    duration: 400,
    easing: 'ease-out',
  },
  slideLeft: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    duration: 400,
    easing: 'ease-out',
  },
  slideRight: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    duration: 400,
    easing: 'ease-out',
  },
  
  // Scale animations
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    duration: 300,
    easing: 'spring',
  },
  scaleOut: {
    initial: { opacity: 0, scale: 1.1 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.1 },
    duration: 300,
    easing: 'spring',
  },
  
  // Rotate animations
  rotateIn: {
    initial: { opacity: 0, rotate: -10 },
    animate: { opacity: 1, rotate: 0 },
    exit: { opacity: 0, rotate: -10 },
    duration: 400,
    easing: 'spring',
  },
  
  // Bounce animations
  bounceIn: {
    initial: { opacity: 0, scale: 0.3 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: 'spring',
        damping: 10,
        stiffness: 200,
      },
    },
    exit: { opacity: 0, scale: 0.3 },
    duration: 600,
  },
  
  // Pulse animations
  pulseIn: {
    initial: { opacity: 0.5, scale: 1 },
    animate: { 
      opacity: 1, 
      scale: [1, 1.05, 1],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        repeatType: 'reverse',
      },
    },
    exit: { opacity: 0.5, scale: 1 },
    duration: 500,
  },
  
  // Blur animations
  blur: {
    initial: { opacity: 0, filter: 'blur(4px)' },
    animate: { opacity: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, filter: 'blur(4px)' },
    duration: 400,
    easing: 'ease-out',
  },
  
  // Complex animations
  dropIn: {
    initial: { 
      opacity: 0, 
      y: -100,
      scale: 0.9,
    },
    animate: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        damping: 15,
        stiffness: 150,
      },
    },
    exit: { 
      opacity: 0, 
      y: 100,
      scale: 0.9,
    },
    duration: 500,
  },
  
  flipIn: {
    initial: { 
      opacity: 0, 
      rotateY: -90,
    },
    animate: { 
      opacity: 1, 
      rotateY: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
    exit: { 
      opacity: 0, 
      rotateY: 90,
    },
    duration: 600,
  },
  
  // Stagger animations
  staggerChildren: {
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  },
  
  // List item animation
  listItem: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    duration: 300,
    easing: 'ease-out',
  },
  
  // Modal animations
  modalOverlay: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    duration: 200,
    easing: 'ease-out',
  },
  modalContent: {
    initial: { 
      opacity: 0, 
      scale: 0.95,
      y: 20,
    },
    animate: { 
      opacity: 1, 
      scale: 1,
      y: 0,
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      y: 20,
    },
    duration: 300,
    easing: 'spring',
  },
  
  // Drawer animations
  drawerLeft: {
    initial: { x: '-100%' },
    animate: { x: 0 },
    exit: { x: '-100%' },
    duration: 300,
    easing: 'ease-out',
  },
  drawerRight: {
    initial: { x: '100%' },
    animate: { x: 0 },
    exit: { x: '100%' },
    duration: 300,
    easing: 'ease-out',
  },
  drawerTop: {
    initial: { y: '-100%' },
    animate: { y: 0 },
    exit: { y: '-100%' },
    duration: 300,
    easing: 'ease-out',
  },
  drawerBottom: {
    initial: { y: '100%' },
    animate: { y: 0 },
    exit: { y: '100%' },
    duration: 300,
    easing: 'ease-out',
  },
  
  // Notification animations
  notificationSlide: {
    initial: { 
      opacity: 0, 
      x: 100,
      scale: 0.9,
    },
    animate: { 
      opacity: 1, 
      x: 0,
      scale: 1,
    },
    exit: { 
      opacity: 0, 
      x: 100,
      scale: 0.9,
    },
    duration: 400,
    easing: 'spring',
  },
  
  // Skeleton loading animation
  skeleton: {
    animate: {
      backgroundPosition: ['200% 0', '-200% 0'],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'linear',
      },
    },
  },
} as const;

export type AnimationPresetName = keyof typeof animationPresets;

/**
 * Get animation preset configuration
 */
export const getAnimationPreset = (name: AnimationPresetName) => {
  return animationPresets[name];
};

/**
 * Micro-interaction presets
 */
export const microInteractions = {
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1,
      ease: 'easeOut',
    },
  },
  focus: {
    scale: 1.01,
    boxShadow: '0 0 0 2px var(--glass-color-primary, 0.5)',
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
} as const;

/**
 * Page transition presets
 */
export const pageTransitions = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 },
  },
  slide: {
    initial: { x: '100%' },
    animate: { x: 0 },
    exit: { x: '-100%' },
    transition: { duration: 0.3, ease: 'easeInOut' },
  },
  scale: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.1 },
    transition: { duration: 0.3, ease: 'easeInOut' },
  },
} as const;