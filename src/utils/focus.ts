/**
 * AuraGlass Focus Utilities
 * Keyboard navigation and focus management helpers
 */

import { RefObject, KeyboardEvent } from 'react';

/**
 * Focus trap configuration
 */
export interface FocusTrapOptions {
  initialFocus?: RefObject<HTMLElement>;
  returnFocus?: boolean;
  allowOutsideClick?: boolean;
  escapeDeactivates?: boolean;
}

/**
 * Get all focusable elements within a container
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableSelectors = [
    'a[href]:not([disabled])',
    'button:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
    'audio[controls]',
    'video[controls]',
    'details > summary',
  ].join(', ');
  
  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelectors))
    .filter((el: any) => {
      // Check if element is visible
      const styles = window.getComputedStyle(el);
      return styles.display !== 'none' && 
             styles.visibility !== 'hidden' && 
             styles.opacity !== '0';
    });
}

/**
 * Trap focus within a container
 */
export function trapFocus(container: HTMLElement, options: FocusTrapOptions = {}) {
  const focusableElements = getFocusableElements(container);
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];
  
  // Store previously focused element
  const previouslyFocused = document.activeElement as HTMLElement;
  
  // Set initial focus
  if (options.initialFocus?.current) {
    options.initialFocus.current.focus();
  } else if (firstFocusable) {
    firstFocusable.focus();
  }
  
  // Handle tab navigation
  const handleKeyDown = (e: globalThis.KeyboardEvent) => {
    if (e.key === 'Tab') {
      if (focusableElements.length === 0) {
        e.preventDefault();
        return;
      }
      
      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable?.focus();
        }
      }
    }
    
    // Handle escape
    if (options.escapeDeactivates && e.key === 'Escape') {
      releaseFocus();
    }
  };
  
  // Handle clicks outside
  const handleClickOutside = (e: MouseEvent) => {
    if (!options.allowOutsideClick && !container.contains(e.target as Node)) {
      e.preventDefault();
      e.stopPropagation();
      firstFocusable?.focus();
    }
  };
  
  // Add event listeners
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('mousedown', handleClickOutside);
  
  // Release function
  const releaseFocus = () => {
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('mousedown', handleClickOutside);
    
    if (options.returnFocus && previouslyFocused) {
      previouslyFocused.focus();
    }
  };
  
  return releaseFocus;
}

/**
 * Roving tabindex for lists and menus
 */
export class RovingTabIndex {
  private elements: HTMLElement[];
  private currentIndex: number = 0;
  
  constructor(container: HTMLElement, selector = '[role="menuitem"], [role="option"]') {
    this.elements = Array.from(container.querySelectorAll<HTMLElement>(selector));
    this.init();
  }
  
  private init() {
    this.elements.forEach((el, index) => {
      el.tabIndex = index === 0 ? 0 : -1;
      el.addEventListener('keydown', this.handleKeyDown.bind(this));
      el.addEventListener('click', () => this.setFocus(index));
    });
  }
  
  private handleKeyDown(e: globalThis.KeyboardEvent) {
    const key = e.key;
    let nextIndex = this.currentIndex;
    
    switch (key) {
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault();
        nextIndex = (this.currentIndex + 1) % this.elements.length;
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        e.preventDefault();
        nextIndex = (this.currentIndex - 1 + this.elements.length) % this.elements.length;
        break;
      case 'Home':
        e.preventDefault();
        nextIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        nextIndex = this.elements.length - 1;
        break;
      default:
        return;
    }
    
    this.setFocus(nextIndex);
  }
  
  private setFocus(index: number) {
    // Update tabindex
    this.elements[this.currentIndex].tabIndex = -1;
    this.elements[index].tabIndex = 0;
    
    // Set focus
    this.elements[index].focus();
    
    // Update current index
    this.currentIndex = index;
  }
  
  public destroy() {
    this.elements.forEach((el: any) => {
      el.removeEventListener('keydown', this.handleKeyDown.bind(this));
    });
  }
}

/**
 * Focus ring styles for consistent appearance
 */
export function applyFocusRing(element: HTMLElement, color = 'var(--glass-focus-color)') {
  element.style.outline = `2px solid ${color}`;
  element.style.outlineOffset = '2px';
}

/**
 * Remove focus ring
 */
export function removeFocusRing(element: HTMLElement) {
  element.style.outline = 'none';
  element.style.outlineOffset = '';
}

/**
 * Check if element is focusable
 */
export function isFocusable(element: HTMLElement): boolean {
  if (element.tabIndex >= 0) return true;
  
  const focusableTags = ['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'A'];
  if (focusableTags.includes(element.tagName)) {
    return !(element as any).disabled;
  }
  
  return element.contentEditable === 'true';
}

/**
 * Focus the first focusable element in a container
 */
export function focusFirstElement(container: HTMLElement): boolean {
  const elements = getFocusableElements(container);
  if (elements.length > 0) {
    elements[0].focus();
    return true;
  }
  return false;
}

/**
 * Handle keyboard navigation for button-like elements
 */
export function handleButtonKeyDown(
  e: KeyboardEvent<HTMLElement>,
  onClick?: (e: any) => void
) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    onClick?.(e);
  }
}

/**
 * Create a focus scope that manages tab order
 */
export class FocusScope {
  private container: HTMLElement;
  private scopeId: string;
  
  constructor(container: HTMLElement) {
    this.container = container;
    this.scopeId = `focus-scope-${Date.now()}`;
    this.init();
  }
  
  private init() {
    this.container.setAttribute('data-focus-scope', this.scopeId);
    
    // Mark elements outside scope as inert
    const allFocusable = document.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    allFocusable.forEach((el: any) => {
      if (!this.container.contains(el)) {
        el.setAttribute('data-focus-disabled', 'true');
        el.setAttribute('tabindex', '-1');
      }
    });
  }
  
  public release() {
    // Restore focusability
    const disabled = document.querySelectorAll('[data-focus-disabled="true"]');
    disabled.forEach((el: any) => {
      el.removeAttribute('data-focus-disabled');
      el.removeAttribute('tabindex');
    });
    
    this.container.removeAttribute('data-focus-scope');
  }
}

/**
 * Announce content to screen readers
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.style.position = 'absolute';
  announcement.style.left = '-10000px';
  announcement.style.width = '1px';
  announcement.style.height = '1px';
  announcement.style.overflow = 'hidden';
  
  announcement.textContent = message;
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}