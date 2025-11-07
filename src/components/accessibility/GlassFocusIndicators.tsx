'use client';

import React from 'react';
import { cn } from '../../lib/utilsComprehensive';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useAccessibility } from './AccessibilityProvider';
import './GlassFocusIndicators.css';

interface FocusRingProps {
  element: HTMLElement;
  variant?: 'default' | 'interactive' | 'navigation' | 'form';
}

// Enhanced focus ring component
function FocusRing({ element, variant = 'default' }: FocusRingProps) {
  const [position, setPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!element) return;

    const updatePosition = () => {
      const rect = element.getBoundingClientRect();
      setPosition({
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY,
        width: rect.width,
        height: rect.height
      });
    };

    updatePosition();

    const observer = new ResizeObserver(updatePosition);
    observer.observe(element);

    window.addEventListener('scroll', updatePosition);
    window.addEventListener('resize', updatePosition);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [element]);

  const getVariantStyles = () => {
    switch (variant) {
      case 'interactive':
        return {
          ring: 'ring-4 ring-blue-400/60 ring-offset-2 ring-offset-slate-900',
          glow: 'shadow-[0_0_20px_rgba(96,165,250,0.6)]',
          background: 'bg-blue-400/10'
        };
      case 'navigation':
        return {
          ring: 'ring-3 ring-purple-400/60 ring-offset-2 ring-offset-slate-900',
          glow: 'shadow-[0_0_15px_rgba(167,139,250,0.6)]',
          background: 'bg-purple-400/10'
        };
      case 'form':
        return {
          ring: 'ring-3 ring-green-400/60 ring-offset-2 ring-offset-slate-900',
          glow: 'shadow-[0_0_15px_rgba(34,197,94,0.6)]',
          background: 'bg-green-400/10'
        };
      default:
        return {
          ring: 'ring-3 ring-blue-400/60 ring-offset-2 ring-offset-slate-900',
          glow: 'shadow-[0_0_15px_rgba(96,165,250,0.5)]',
          background: 'bg-blue-400/8'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <motion.div
      className={cn("glass-position-fixed glass-pointer-events-none glass-z-50 glass-radius-lg", styles.ring, styles.glow, styles.background)}
      style={{
        left: position.x - 4,
        top: position.y - 4,
        width: position.width + 8,
        height: position.height + 8
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: isVisible ? 1 : 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 25,
        opacity: { duration: 0.15 }
      }}
    >
      {/* Animated border */}
      <motion.div
        className={cn("glass-position-absolute glass-inset-0 glass-radius-lg glass-border-2 glass-border-transparent")}
        style={{
          background: `linear-gradient(45deg, ${variant === 'interactive' ? '#60A5FA' : variant === 'navigation' ? '#A78BFA' : variant === 'form' ? '#22C55E' : '#60A5FA'}, transparent, ${variant === 'interactive' ? '#60A5FA' : variant === 'navigation' ? '#A78BFA' : variant === 'form' ? '#22C55E' : '#60A5FA'})`,
          backgroundSize: '200% 200%'
        }}
        animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      />

      {/* Corner highlights */}
      {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((corner) => (
        <motion.div
          key={corner}
          className={cn(
            "glass-position-absolute glass-w-2 glass-h-2 glass-radius-full",
            variant === 'interactive' ? 'glass-surface-info' :
            variant === 'navigation' ? 'glass-surface-accent' :
            variant === 'form' ? 'bg-green-400' : 'bg-blue-400',
            corner === 'top-left' ? '-top-1 -left-1' :
            corner === 'top-right' ? '-top-1 -right-1' :
            corner === 'bottom-left' ? '-bottom-1 -left-1' :
            '-bottom-1 -right-1'
          )}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: corner === 'top-right' ? 0.2 : corner === 'bottom-right' ? 0.4 : corner === 'bottom-left' ? 0.6 : 0
          }}
        />
      ))}
    </motion.div>
  );
}

// Main focus indicator system
export function GlassFocusIndicators() {
  const { settings } = useAccessibility();
  const [focusedElement, setFocusedElement] = useState<HTMLElement | null>(null);
  const [focusVariant, setFocusVariant] = useState<'default' | 'interactive' | 'navigation' | 'form'>('default');
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!settings.focusIndicators) return;

    const handleFocus = (event: FocusEvent) => {
      const target = event.target as HTMLElement;
      if (!target || target === document.body) return;

      // Determine focus variant based on element type and attributes
      let variant: 'default' | 'interactive' | 'navigation' | 'form' = 'default';

      if (target.matches('button, [role="button"], [role="menuitem"], [role="tab"]')) {
        variant = 'interactive';
      } else if (target.matches('a, [role="link"], nav a, [role="navigation"] *')) {
        variant = 'navigation';
      } else if (target.matches('input, textarea, select, [role="textbox"], [role="combobox"], [role="listbox"]')) {
        variant = 'form';
      }

      setFocusedElement(target);
      setFocusVariant(variant);
      lastFocusedRef.current = target;

      // Announce focus change to screen readers
      if (settings.screenReaderOptimized && (window as any).announceToScreenReader) {
        const elementType = target.tagName.toLowerCase();
        const elementText = target.textContent || target.getAttribute('aria-label') || target.getAttribute('aria-labelledby') || target.getAttribute('title') || '';
        const roleText = target.getAttribute('role') || elementType;

        (window as any).announceToScreenReader(`Focused on ${roleText}${elementText ? ': ' + elementText.slice(0, 50) : ''}`);
      }
    };

    const handleBlur = (event: FocusEvent) => {
      // Small delay to prevent flicker when focus moves between elements
      setTimeout(() => {
        if (document.activeElement === document.body || !document.activeElement) {
          setFocusedElement(null);
        }
      }, 10);
    };

    // Enhanced keyboard navigation
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!settings.keyboardNavigation) return;

      const { key, ctrlKey, altKey, shiftKey } = event;

      // Skip navigation (Alt + S)
      if (altKey && key === 's') {
        event.preventDefault();
        const mainContent = document.getElementById('main-content') || document.querySelector('main');
        if (mainContent) {
          (mainContent as HTMLElement).focus();
          mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }

      // Focus landmarks (Alt + L)
      if (altKey && key === 'l') {
        event.preventDefault();
        const landmarks = document.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], header, nav, main, footer');
        if (landmarks.length > 0) {
          const currentIndex = Array.from(landmarks).findIndex(el => el === document.activeElement);
          const nextIndex = (currentIndex + 1) % landmarks.length;
          (landmarks[nextIndex] as HTMLElement).focus();
        }
      }

      // Focus headings (Alt + H)
      if (altKey && key === 'h') {
        event.preventDefault();
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        if (headings.length > 0) {
          const currentIndex = Array.from(headings).findIndex(el => el === document.activeElement);
          const nextIndex = (currentIndex + 1) % headings.length;
          (headings[nextIndex] as HTMLElement).focus();
        }
      }

      // Escape key to blur current element
      if (key === 'Escape' && focusedElement && focusedElement !== document.body) {
        focusedElement.blur();
        (document.body as HTMLElement).focus();
      }
    };

    // Add event listeners
    document.addEventListener('focusin', handleFocus, true);
    document.addEventListener('focusout', handleBlur, true);
    document.addEventListener('keydown', handleKeyDown);

    // Focus visible elements on page load
    const autoFocusElement = document.querySelector('[autofocus]') as HTMLElement;
    if (autoFocusElement) {
      setTimeout(() => autoFocusElement.focus(), 100);
    }

    return () => {
      document.removeEventListener('focusin', handleFocus, true);
      document.removeEventListener('focusout', handleBlur, true);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [settings.focusIndicators, settings.keyboardNavigation, settings.screenReaderOptimized, focusedElement]);

  // Add focus trap for modals and overlays
  useEffect(() => {
    const handleFocusTrap = () => {
      const modals = document.querySelectorAll('[role="dialog"], [aria-modal="true"], .modal, .overlay');

      modals.forEach((modal: any) => {
        const focusableElements = modal.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), [role="button"], [role="link"]'
        );

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        const handleTabKey = (event: KeyboardEvent) => {
          if (event.key !== 'Tab') return;

          if (event.shiftKey) {
            if (document.activeElement === firstElement) {
              event.preventDefault();
              lastElement.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              event.preventDefault();
              firstElement.focus();
            }
          }
        };

        modal.addEventListener('keydown', handleTabKey as EventListener);
      });
    };

    if (settings.keyboardNavigation) {
      handleFocusTrap();
    }
  }, [settings.keyboardNavigation, focusedElement]);

  if (!settings.focusIndicators || !focusedElement) {
    return null;
  }

  return (
    <AnimatePresence>
      <FocusRing element={focusedElement} variant={focusVariant} />
    </AnimatePresence>
  );
}

// Skip links component
export function SkipLinks() {
  const { settings } = useAccessibility();

  if (!settings.keyboardNavigation) return null;

  const skipLinks = [
    { href: '#main-content', text: 'Skip to main content' },
    { href: '#navigation', text: 'Skip to navigation' },
    { href: '#footer', text: 'Skip to footer' }
  ];

  return (
    <div className="skip-links">
      {skipLinks.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className={cn(
            "skip-link glass-sr-only focus:glass-not-sr-only focus:glass-position-absolute",
            "focus:glass-top-4 focus:glass-left-4 focus:glass-z-50 focus:glass-px-4 focus:glass-py-2",
            "focus:glass-surface-info focus:glass-text-primary focus:glass-radius-lg focus:glass-shadow-lg focus:glass-no-underline"
          )}
          onFocus={() => {
            if ((window as any).announceToScreenReader) {
              (window as any).announceToScreenReader(`Skip link: ${link.text}`);
            }
          }}
        >
          {link.text}
        </a>
      ))}

    </div>
  );
}

// Landmark announcer for screen readers
export function LandmarkAnnouncer() {
  const { settings } = useAccessibility();

  useEffect(() => {
    if (!settings.screenReaderOptimized) return;

    // Auto-announce page landmarks on load
    const announceLandmarks = () => {
      const landmarks = document.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], header, nav, main, footer');

      if (landmarks.length > 0 && (window as any).announceToScreenReader) {
        const landmarksList = Array.from(landmarks).map((el: any) => {
          const role = el.getAttribute('role') || el.tagName.toLowerCase();
          const label = el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || '';
          return label ? `${role}: ${label}` : role;
        }).join(', ');

        setTimeout(() => {
          (window as any).announceToScreenReader(`Page landmarks: ${landmarksList}`);
        }, 1000);
      }
    };

    // Announce after page load
    if (document.readyState === 'complete') {
      announceLandmarks();
    } else {
      window.addEventListener('load', announceLandmarks);
      return () => window.removeEventListener('load', announceLandmarks);
    }
  }, [settings.screenReaderOptimized]);

  return null;
}

// Enhanced keyboard shortcuts helper
export function KeyboardShortcutsHelper() {
  const { settings } = useAccessibility();
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    if (!settings.keyboardNavigation) return;

    const handleHelpToggle = (event: KeyboardEvent) => {
      if (event.altKey && event.key === '?') {
        event.preventDefault();
        setShowHelp(!showHelp);
      }
    };

    document.addEventListener('keydown', handleHelpToggle);
    return () => document.removeEventListener('keydown', handleHelpToggle);
  }, [settings.keyboardNavigation, showHelp]);

  const shortcuts = [
    { key: 'Alt + S', description: 'Skip to main content' },
    { key: 'Alt + L', description: 'Navigate between landmarks' },
    { key: 'Alt + H', description: 'Navigate between headings' },
    { key: 'Alt + ?', description: 'Toggle this help' },
    { key: 'Escape', description: 'Close current focus/modal' },
    { key: 'Tab', description: 'Navigate forward' },
    { key: 'Shift + Tab', description: 'Navigate backward' },
    { key: 'Enter/Space', description: 'Activate focused element' }
  ];

  if (!settings.keyboardNavigation) return null;

  return (
    <AnimatePresence>
      {showHelp && (
        <motion.div
          className="fixed bottom-4 right-4 z-50 max-w-sm"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
        >
          <div className={cn("glass-foundation-complete glass-surface-overlay glass-border-subtle glass-radius-xl glass-p-4 glass-shadow-2xl")}>
            <div className="flex items-center justify-between mb-3">
              <h3 className={cn("glass-font-semibold glass-text-primary")}>Keyboard Shortcuts</h3>
              <button
                onClick={() => setShowHelp(false)}
                className={cn("glass-p-1 hover:glass-surface-hover glass-radius-lg glass-transition glass-text-secondary")}
              >
                ×
              </button>
            </div>

            <div className="space-y-2">
              {shortcuts.map((shortcut) => (
                <div key={shortcut.key} className="flex justify-between items-center text-sm">
                  <kbd className={cn("glass-px-2 glass-py-1 glass-surface-secondary glass-border-subtle glass-radius glass-text-primary glass-font-mono glass-text-xs")}>
                    {shortcut.key}
                  </kbd>
                  <span className={cn("glass-text-secondary glass-ml-3 glass-text-xs")}>{shortcut.description}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default GlassFocusIndicators;
