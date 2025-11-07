import { useReducedMotion } from '@/hooks/useReducedMotion';
'use client';

import { cn } from '../../lib/utilsComprehensive';
import {
    AnimatePresence,
    motion,
    PanInfo
} from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { easings } from './AdvancedAnimations';

// Glass transition variants
const glassTransitionVariants = {
  // Shatter transition
  shatter: {
    initial: {
      scale: 1,
      opacity: 1,
      filter: 'blur(0px)'
    },
    exit: {
      scale: [1, 1.02, 0.98, 1.1, 0],
      opacity: [1, 0.8, 0.6, 0.3, 0],
      filter: ['blur(0px)', 'blur(1px)', 'blur(3px)', 'blur(var(--glass-blur-md))', 'blur(15px)'],
      rotate: [0, -2, 4, -8, 15],
      transition: {
        duration: 0.8,
        times: [0, 0.2, 0.4, 0.7, 1],
        ease: easings.easeOutExpo
      }
    },
    enter: {
      scale: [0, 0.8, 1.05, 1],
      opacity: [0, 0.3, 0.8, 1],
      filter: ['blur(15px)', 'blur(var(--glass-blur-md))', 'blur(2px)', 'blur(0px)'],
      rotate: [15, -5, 2, 0],
      transition: {
        duration: 0.8,
        times: [0, 0.3, 0.7, 1],
        ease: easings.easeOutBack
      }
    }
  },

  // Liquid transition
  liquid: {
    initial: {
      clipPath: 'inset(0% 0% 0% 0% round 16px)',
      scale: 1,
      opacity: 1
    },
    exit: {
      clipPath: [
        'inset(0% 0% 0% 0% round 16px)',
        'inset(10% 5% 10% 5% round 32px)',
        'inset(30% 20% 30% 20% round 50%)',
        'inset(50% 50% 50% 50% round 50%)'
      ],
      scale: [1, 0.95, 0.8, 0.5],
      opacity: [1, 0.8, 0.4, 0],
      transition: {
        duration: 0.6,
        ease: easings.easeInOutCubic
      }
    },
    enter: {
      clipPath: [
        'inset(50% 50% 50% 50% round 50%)',
        'inset(30% 20% 30% 20% round 50%)',
        'inset(10% 5% 10% 5% round 32px)',
        'inset(0% 0% 0% 0% round 16px)'
      ],
      scale: [0.5, 0.8, 0.95, 1],
      opacity: [0, 0.4, 0.8, 1],
      transition: {
        duration: 0.6,
        ease: easings.easeOutExpo
      }
    }
  },

  // Ripple transition
  ripple: {
    initial: {
      scale: 1,
      opacity: 1,
      borderRadius: '16px'
    },
    exit: {
      scale: [1, 1.5, 0],
      opacity: [1, 0.3, 0],
      borderRadius: ['16px', '50%', '50%'],
      transition: {
        duration: 0.5,
        ease: easings.easeInOutCubic
      }
    },
    enter: {
      scale: [0, 1.2, 1],
      opacity: [0, 0.6, 1],
      borderRadius: ['50%', '50%', '16px'],
      transition: {
        duration: 0.5,
        ease: easings.easeOutBack
      }
    }
  },

  // Morph transition
  morph: {
    initial: {
      borderRadius: '16px',
      scaleX: 1,
      scaleY: 1,
      opacity: 1
    },
    exit: {
      borderRadius: ['16px', '50px 16px 30px 40px', '20px 60px 40px 20px', '50%'],
      scaleX: [1, 0.8, 1.2, 0],
      scaleY: [1, 1.2, 0.8, 0],
      opacity: [1, 0.7, 0.3, 0],
      transition: {
        duration: 0.7,
        ease: easings.easeInOutCubic
      }
    },
    enter: {
      borderRadius: ['50%', '20px 60px 40px 20px', '50px 16px 30px 40px', '16px'],
      scaleX: [0, 1.2, 0.8, 1],
      scaleY: [0, 0.8, 1.2, 1],
      opacity: [0, 0.3, 0.7, 1],
      transition: {
        duration: 0.7,
        ease: easings.easeOutExpo
      }
    }
  },

  // Frost transition
  frost: {
    initial: {
      scale: 1,
      opacity: 1,
      filter: 'blur(0px) brightness(1)'
    },
    exit: {
      scale: [1, 1.1, 0.9, 0],
      opacity: [1, 0.8, 0.4, 0],
      filter: [
        'blur(0px) brightness(1)',
        'blur(2px) brightness(1.2)',
        'blur(var(--glass-blur-md)) brightness(0.8)',
        'blur(var(--glass-blur-lg)) brightness(0.5)'
      ],
      transition: {
        duration: 0.8,
        ease: easings.easeInOutCubic
      }
    },
    enter: {
      scale: [0, 0.9, 1.1, 1],
      opacity: [0, 0.4, 0.8, 1],
      filter: [
        'blur(var(--glass-blur-lg)) brightness(0.5)',
        'blur(var(--glass-blur-md)) brightness(0.8)',
        'blur(2px) brightness(1.2)',
        'blur(0px) brightness(1)'
      ],
      transition: {
        duration: 0.8,
        ease: easings.easeOutExpo
      }
    }
  }
};

// Glass transition component
interface GlassTransitionProps {
  children: React.ReactNode;
  variant?: keyof typeof glassTransitionVariants;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function GlassTransition({
  children,
  variant = 'liquid',
  duration,
  className,
  style
}: GlassTransitionProps) {
  const prefersReducedMotion = useReducedMotion();
  const transitionVariant = glassTransitionVariants[variant];

  // Override duration if provided
  const customVariant = duration ? {
    ...transitionVariant,
    exit: {
      ...transitionVariant.exit,
      transition: {
        ...transitionVariant.exit.transition,
        duration
      }
    },
    enter: {
      ...transitionVariant.enter,
      transition: {
        ...transitionVariant.enter.transition,
        duration
      }
    }
  } : transitionVariant;

  return (
    <motion.div
      className={cn('glass-transition-container', className)}
      style={style}
      variants={customVariant}
      initial="initial"
      animate="initial"
      exit="exit"
    >
      {children}
    </motion.div>
  );
}

// Page transition manager
interface GlassPageTransitionProps {
  children: React.ReactNode;
  variant?: keyof typeof glassTransitionVariants;
  duration?: number;
  className?: string;
}

export function GlassPageTransition({
  children,
  variant = 'morph',
  duration = 0.6,
  className
}: GlassPageTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <GlassTransition
        variant={variant}
        duration={duration}
        className={className}
      >
        {children}
      </GlassTransition>
    </AnimatePresence>
  );
}

// Swipeable glass cards with transitions
interface SwipeableGlassCardsProps {
  cards: Array<{
    id: string;
    content: React.ReactNode;
    background?: string;
  }>;
  onSwipe?: (direction: 'left' | 'right', cardId: string) => void;
  className?: string;
}

export function SwipeableGlassCards({
  cards,
  onSwipe,
  className
}: SwipeableGlassCardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('left');

  const handleDragEnd = (info: PanInfo) => {
    const threshold = 100;
    const velocity = info.velocity.x;
    const offset = info.offset.x;

    if (Math.abs(velocity) > 500 || Math.abs(offset) > threshold) {
      const swipeDirection = velocity > 0 || offset > 0 ? 'right' : 'left';
      setDirection(swipeDirection);

      const newIndex = swipeDirection === 'left'
        ? Math.min(currentIndex + 1, cards.length - 1)
        : Math.max(currentIndex - 1, 0);

      if (newIndex !== currentIndex) {
        setCurrentIndex(newIndex);
        onSwipe?.(swipeDirection, cards[currentIndex].id);
      }
    }
  };

  const slideVariants = {
    enter: (direction: string) => ({
      x: direction === 'left' ? 300 : -300,
      opacity: 0,
      scale: 0.8,
      rotateY: direction === 'left' ? 45 : -45
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        duration: 0.5,
        ease: easings.easeOutExpo
      }
    },
    exit: (direction: string) => ({
      x: direction === 'left' ? -300 : 300,
      opacity: 0,
      scale: 0.8,
      rotateY: direction === 'left' ? -45 : 45,
      transition: {
        duration: 0.3,
        ease: easings.easeInOutCubic
      }
    })
  };

  return (
    <div className={cn('glass-relative glass-overflow-hidden', className)}>
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.3}
          onDragEnd={(_, info) => handleDragEnd(info)}
          className={cn("glass-foundation-complete glass-surface-primary glass-border glass-border-primary glass-radius-xl glass-p-6 glass-cursor-grab active:glass-cursor-grabbing")}
          style={{
            background: cards[currentIndex].background || 'var(--glass-bg-default)'
          }}
        >
          {cards[currentIndex].content}
        </motion.div>
      </AnimatePresence>

      {/* Indicators */}
      <div className={cn("glass-flex glass-justify-center glass-mt-4 glass-gap-2")}>
        {cards.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 'left' : 'right');
              setCurrentIndex(index);
            }}
            className={cn(
              'glass-w-2 glass-h-2 glass-radius-full glass-transition-all glass-duration-300',
              index === currentIndex
                ? 'glass-surface-white glass-scale-125'
                : 'glass-surface-muted hover:glass-surface-secondary'
            )}
          />
        ))}
      </div>
    </div>
  );
}

// Accordion with glass transitions
interface GlassAccordionProps {
  items: Array<{
    id: string;
    title: string;
    content: React.ReactNode;
    icon?: React.ReactNode;
  }>;
  allowMultiple?: boolean;
  className?: string;
}

export function GlassAccordion({
  items,
  allowMultiple = false,
  className
}: GlassAccordionProps) {
  const prefersReducedMotion = useReducedMotion();
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems((prev: any) => {
      if (prev.includes(id)) {
        return prev.filter((item: any) => item !== id);
      } else {
        return allowMultiple ? [...prev, id] : [id];
      }
    });
  };

  return (
    <div className={cn('glass-space-y-2', className)}>
      {items.map((item) => {
        const isOpen = openItems.includes(item.id);

        return (
          <motion.div
            key={item.id}
            className={cn("glass-foundation-complete glass-surface-subtle glass-border glass-border-subtle glass-radius-lg glass-overflow-hidden")}
            layout
          >
            <motion.button
              onClick={() => toggleItem(item.id)}
              className={cn("glass-w-full glass-p-4 glass-text-left glass-flex glass-items-center glass-justify-between hover:glass-surface-hover glass-transition-colors")}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className={cn("glass-flex glass-items-center glass-gap-3")}>
                {item.icon}
                <span className={cn("glass-font-medium glass-text-white")}>{item.title}</span>
              </div>
              <motion.div
                animate={prefersReducedMotion ? {} : { rotate: isOpen ? 180 : 0 }}
                transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3  }}
              >
                <svg className={cn("glass-w-5 glass-h-5 glass-text-secondary")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={prefersReducedMotion ? {} : { height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={prefersReducedMotion ? { duration: 0 } : {
    duration: 0.3,
    ease: easings.easeInOutCubic
                  }}
                  className={cn("glass-border-t glass-border-subtle")}
                >
                  <motion.div
                    initial={{ y: -10 }}
                    animate={prefersReducedMotion ? {} : { y: 0 }}
                    exit={{ y: -10 }}
                    className={cn("glass-p-4 glass-text-primary")}
                  >
                    {item.content}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}

// Modal with glass transitions
interface GlassModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  variant?: keyof typeof glassTransitionVariants;
  className?: string;
}

export function GlassModal({
  isOpen,
  onClose,
  children,
  variant = 'ripple',
  className
}: GlassModalProps) {
  const prefersReducedMotion = useReducedMotion();
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={prefersReducedMotion ? {} : { opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn("glass-fixed glass-inset-0 glass-z-50 glass-flex glass-items-center glass-justify-center glass-p-4")}
          onClick={onClose}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={prefersReducedMotion ? {} : { opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn("glass-absolute glass-inset-0 glass-surface-overlay")}
          />

          {/* Modal Content */}
          <GlassTransition
            variant={variant}
            className={cn(
              'glass-relative glass-max-w-lg glass-w-full glass-max-h-90vh glass-overflow-auto',
              'glass-foundation-complete glass-surface-primary glass-border glass-border-primary glass-radius-xl',
              className
            )}
          >
            <div onClick={(e) => e.stopPropagation()}>
              {children}
            </div>
          </GlassTransition>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Tab navigation with glass transitions
interface GlassTabsProps {
  tabs?: Array<{
    id: string;
    label: string;
    content: React.ReactNode;
    icon?: React.ReactNode;
  }>;
  children?: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
  defaultTab?: string;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  onTabChange?: (tabId: string) => void;
}

export function GlassTabs({
  tabs,
  defaultTab,
  orientation = 'horizontal',
  className,
  onTabChange
}: GlassTabsProps) {
  const prefersReducedMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState(defaultTab || tabs?.[0]?.id);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  return (
    <div className={cn(
      'glass-tabs',
      orientation === 'vertical' ? 'glass-flex glass-gap-6' : 'glass-space-y-4',
      className
    )}>
      {/* Tab List */}
      <div className={cn(
        'glass-foundation-complete glass-surface-subtle glass-border glass-border-subtle glass-radius-lg glass-p-1',
        orientation === 'vertical' ? 'glass-flex-col glass-w-48' : 'glass-flex',
        'glass-relative'
      )}>
        {tabs?.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={cn(
              'glass-relative glass-px-4 glass-py-2 glass-radius-md glass-transition-all glass-duration-300 glass-flex glass-items-center glass-gap-2',
              'glass-text-sm glass-font-medium glass-whitespace-nowrap',
              activeTab === tab.id
                ? 'glass-text-white glass-surface-subtle'
                : 'glass-text-secondary hover:glass-text-white hover:glass-surface-hover'
            )}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className={cn(
        'glass-flex-1 glass-foundation-complete glass-surface-subtle glass-border glass-border-subtle glass-radius-lg',
        'glass-min-h-200'
      )}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3, ease: easings.easeOutExpo  }}
            className={cn("glass-p-6")}
          >
            {tabs?.find(tab => tab.id === activeTab)?.content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default {
  GlassTransition,
  GlassPageTransition,
  SwipeableGlassCards,
  GlassAccordion,
  GlassModal,
  GlassTabs,
  glassTransitionVariants
};
