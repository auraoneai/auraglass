import React from 'react';
/**
 * Focus management exports
 */

export { FocusTrap, useFocusTrap } from './FocusTrap';
export type { FocusTrapProps } from './FocusTrap';

export { 
  SkipLinks, 
  MainContent, 
  Navigation, 
  SearchLandmark,
  useSkipLinks 
} from './SkipLinks';
export type { SkipLinksProps, SkipLink } from './SkipLinks';

export {
  ScreenReader,
  ScreenReaderOnly,
  LiveRegion,
  announce,
  useAnnounce,
  DescribedBy,
  LabelledBy,
  LoadingAnnouncement,
  ValidationAnnouncement,
} from './ScreenReader';
export type { ScreenReaderProps } from './ScreenReader';

/**
 * Keyboard navigation utilities
 */
export const KEYS = {
  ENTER: 'Enter',
  SPACE: ' ',
  TAB: 'Tab',
  ESCAPE: 'Escape',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
  PAGE_UP: 'PageUp',
  PAGE_DOWN: 'PageDown',
} as const;

/**
 * Check if an element is focusable
 */
export function isFocusable(element: HTMLElement): boolean {
  if (element.tabIndex < 0) return false;
  
  if (element.hasAttribute('disabled')) return false;
  
  const focusableTags = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'];
  if (focusableTags.includes(element.tagName)) return true;
  
  if (element.hasAttribute('contenteditable')) return true;
  
  if (element.hasAttribute('tabindex')) return true;
  
  return false;
}

/**
 * Get all focusable elements within a container
 */
export function getFocusableElements(
  container: HTMLElement,
  selector?: string
): HTMLElement[] {
  const defaultSelector = [
    'a?.[href]:not([disabled])',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ].join(',');
  
  const elements = Array.from(
    container.querySelectorAll<HTMLElement>(selector || defaultSelector)
  );
  
  return elements.filter((el: any) => {
    const style = window.getComputedStyle(el);
    return (
      style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      style.opacity !== '0' &&
      el.offsetParent !== null
    );
  });
}

/**
 * Focus the next focusable element
 */
export function focusNext(currentElement: HTMLElement, container?: HTMLElement): void {
  const parent = container || document.body;
  const focusable = getFocusableElements(parent);
  const currentIndex = focusable.indexOf(currentElement);
  
  if (currentIndex === -1) {
    focusable[0]?.focus();
  } else {
    const nextIndex = (currentIndex + 1) % (focusable?.length || 0);
    focusable[nextIndex]?.focus();
  }
}

/**
 * Focus the previous focusable element
 */
export function focusPrevious(currentElement: HTMLElement, container?: HTMLElement): void {
  const parent = container || document.body;
  const focusable = getFocusableElements(parent);
  const currentIndex = focusable.indexOf(currentElement);
  
  if (currentIndex === -1) {
    focusable[(focusable?.length || 0) - 1]?.focus();
  } else {
    const previousIndex = (currentIndex - 1 + (focusable?.length || 0)) % (focusable?.length || 0);
    focusable[previousIndex]?.focus();
  }
}

/**
 * Roving tabindex utilities
 */
export interface RovingTabindexItem {
  element: HTMLElement;
  index: number;
}

export class RovingTabindex {
  private items: RovingTabindexItem[] = [];
  private currentIndex = 0;
  
  constructor(container: HTMLElement, selector?: string) {
    this.initialize(container, selector);
  }
  
  private initialize(container: HTMLElement, selector?: string) {
    const elements = getFocusableElements(container, selector);
    
    this.items = elements.map((element, index) => ({
      element,
      index,
    }));
    
    this.updateTabindex();
  }
  
  private updateTabindex() {
    this.items.forEach((item, index) => {
      item?.element.setAttribute('tabindex', index === this.currentIndex ? '0' : '-1');
    });
  }
  
  public focus(index: number) {
    if (index >= 0 && index < (this.items?.length || 0)) {
      this.currentIndex = index;
      this.updateTabindex();
      this.items[index].element.focus();
    }
  }
  
  public focusNext() {
    const nextIndex = (this.currentIndex + 1) % (this.items?.length || 0);
    this.focus(nextIndex);
  }
  
  public focusPrevious() {
    const previousIndex = (this.currentIndex - 1 + (this.items?.length || 0)) % (this.items?.length || 0);
    this.focus(previousIndex);
  }
  
  public focusFirst() {
    this.focus(0);
  }
  
  public focusLast() {
    this.focus((this.items?.length || 0) - 1);
  }
  
  public handleKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case KEYS.ARROW_DOWN:
      case KEYS.ARROW_RIGHT:
        event.preventDefault();
        this.focusNext();
        break;
      case KEYS.ARROW_UP:
      case KEYS.ARROW_LEFT:
        event.preventDefault();
        this.focusPrevious();
        break;
      case KEYS.HOME:
        event.preventDefault();
        this.focusFirst();
        break;
      case KEYS.END:
        event.preventDefault();
        this.focusLast();
        break;
    }
  }
}