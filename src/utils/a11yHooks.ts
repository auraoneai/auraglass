/**
 * AuraGlass Accessibility Hooks
 * Enhanced accessibility hooks for comprehensive WCAG 2.1 AA compliance
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useA11yId, announceToScreenReader, KEYS } from './a11y';

/**
 * Enhanced announcement hook with queuing and debouncing
 */
export function useScreenReaderAnnouncement() {
  const queueRef = useRef<Array<{ message: string; priority: 'polite' | 'assertive' }>>([]);
  const isProcessingRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    queueRef.current.push({ message, priority });
    processQueue();
  }, []);

  const processQueue = useCallback(async () => {
    if (isProcessingRef.current || queueRef.current.length === 0) return;

    isProcessingRef.current = true;
    const { message, priority } = queueRef.current.shift()!;

    announceToScreenReader(message, priority);

    // Wait before processing next announcement
    timeoutRef.current = setTimeout(() => {
      isProcessingRef.current = false;
      processQueue();
    }, priority === 'assertive' ? 1000 : 500);
  }, []);

  const clearQueue = useCallback(() => {
    queueRef.current = [];
    isProcessingRef.current = false;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  useEffect(() => {
    return () => {
      clearQueue();
    };
  }, [clearQueue]);

  return {
    announce,
    clearQueue,
  };
}

/**
 * Hook for managing keyboard navigation in collections
 */
export interface UseKeyboardNavigationOptions {
  items: Array<{ id: string; disabled?: boolean }>;
  orientation?: 'horizontal' | 'vertical' | 'both';
  loop?: boolean;
  homeEndKeys?: boolean;
  pageKeys?: boolean;
  onActivate?: (id: string) => void;
  onSelect?: (id: string) => void;
}

export function useKeyboardNavigation(options: UseKeyboardNavigationOptions) {
  const {
    items,
    orientation = 'vertical',
    loop = true,
    homeEndKeys = true,
    pageKeys = false,
    onActivate,
    onSelect,
  } = options;

  const [focusedIndex, setFocusedIndex] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const itemRefs = useRef<Map<string, HTMLElement>>(new Map());

  const enabledItems = items.filter((item: any) => !item.disabled);

  const focusItem = useCallback((index: number) => {
    if (index < 0 || index >= enabledItems.length) return;
    
    const item = enabledItems[index];
    const element = itemRefs.current.get(item.id);
    
    if (element) {
      element.focus();
      setFocusedIndex(index);
    }
  }, [enabledItems]);

  const moveNext = useCallback(() => {
    const nextIndex = focusedIndex + 1;
    if (nextIndex < enabledItems.length) {
      focusItem(nextIndex);
    } else if (loop) {
      focusItem(0);
    }
  }, [focusedIndex, enabledItems.length, loop, focusItem]);

  const movePrevious = useCallback(() => {
    const prevIndex = focusedIndex - 1;
    if (prevIndex >= 0) {
      focusItem(prevIndex);
    } else if (loop) {
      focusItem(enabledItems.length - 1);
    }
  }, [focusedIndex, enabledItems.length, loop, focusItem]);

  const moveToFirst = useCallback(() => {
    focusItem(0);
  }, [focusItem]);

  const moveToLast = useCallback(() => {
    focusItem(enabledItems.length - 1);
  }, [enabledItems.length, focusItem]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent | KeyboardEvent) => {
    const { key } = event;

    const isVertical = orientation === 'vertical' || orientation === 'both';
    const isHorizontal = orientation === 'horizontal' || orientation === 'both';

    switch (key) {
      case KEYS.ARROW_DOWN:
        if (isVertical) {
          event.preventDefault();
          moveNext();
        }
        break;
      case KEYS.ARROW_UP:
        if (isVertical) {
          event.preventDefault();
          movePrevious();
        }
        break;
      case KEYS.ARROW_RIGHT:
        if (isHorizontal) {
          event.preventDefault();
          moveNext();
        }
        break;
      case KEYS.ARROW_LEFT:
        if (isHorizontal) {
          event.preventDefault();
          movePrevious();
        }
        break;
      case KEYS.HOME:
        if (homeEndKeys) {
          event.preventDefault();
          moveToFirst();
        }
        break;
      case KEYS.END:
        if (homeEndKeys) {
          event.preventDefault();
          moveToLast();
        }
        break;
      case KEYS.PAGE_UP:
        if (pageKeys) {
          event.preventDefault();
          const jumpIndex = Math.max(0, focusedIndex - 10);
          focusItem(jumpIndex);
        }
        break;
      case KEYS.PAGE_DOWN:
        if (pageKeys) {
          event.preventDefault();
          const jumpIndex = Math.min(enabledItems.length - 1, focusedIndex + 10);
          focusItem(jumpIndex);
        }
        break;
      case KEYS.ENTER:
      case KEYS.SPACE:
        if (focusedIndex >= 0 && focusedIndex < enabledItems.length) {
          event.preventDefault();
          const item = enabledItems[focusedIndex];
          onActivate?.(item.id);
        }
        break;
    }
  }, [
    orientation,
    moveNext,
    movePrevious,
    moveToFirst,
    moveToLast,
    homeEndKeys,
    pageKeys,
    focusedIndex,
    enabledItems,
    focusItem,
    onActivate,
  ]);

  const registerItem = useCallback((id: string, element: HTMLElement | null) => {
    if (element) {
      itemRefs.current.set(id, element);
    } else {
      itemRefs.current.delete(id);
    }
  }, []);

  const selectItem = useCallback((id: string, multiSelect = false) => {
    setSelectedIds((prev: Set<string>) => {
      const newSelection = new Set(multiSelect ? prev : []);

      if (newSelection.has(id)) {
        newSelection.delete(id);
      } else {
        newSelection.add(id);
      }

      return newSelection;
    });

    onSelect?.(id);
  }, [onSelect]);

  return {
    focusedIndex,
    selectedIds,
    handleKeyDown,
    registerItem,
    focusItem,
    selectItem,
    moveNext,
    movePrevious,
    moveToFirst,
    moveToLast,
  };
}

/**
 * Hook for managing expanded/collapsed state with keyboard navigation
 */
export function useExpandableNavigation() {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const isExpanded = useCallback((id: string) => {
    return expandedIds.has(id);
  }, [expandedIds]);

  const toggleExpanded = useCallback((id: string) => {
    setExpandedIds((prev: Set<string>) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const expandItem = useCallback((id: string) => {
    setExpandedIds((prev: Set<string>) => new Set([...prev, id]));
  }, []);

  const collapseItem = useCallback((id: string) => {
    setExpandedIds((prev: Set<string>) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  }, []);

  const expandAll = useCallback((ids: string[]) => {
    setExpandedIds(new Set(ids));
  }, []);

  const collapseAll = useCallback(() => {
    setExpandedIds(new Set());
  }, []);

  return {
    expandedIds,
    isExpanded,
    toggleExpanded,
    expandItem,
    collapseItem,
    expandAll,
    collapseAll,
  };
}

/**
 * Hook for managing live region announcements
 */
export function useLiveRegion() {
  const regionRef = useRef<HTMLDivElement>();
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Create live region if it doesn't exist
    if (!regionRef.current) {
      const region = document.createElement('div');
      region.setAttribute('aria-live', 'polite');
      region.setAttribute('aria-atomic', 'true');
      region.className = 'sr-only';
      region.style.cssText = `
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
      `;
      document.body.appendChild(region);
      regionRef.current = region;
    }

    return () => {
      if (regionRef.current && document.body.contains(regionRef.current)) {
        document.body.removeChild(regionRef.current);
      }
    };
  }, []);

  const announce = useCallback((newMessage: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (regionRef.current) {
      regionRef.current.setAttribute('aria-live', priority);
      setMessage(newMessage);
      
      // Clear message after announcement
      setTimeout(() => {
        setMessage('');
      }, 1000);
    }
  }, []);

  useEffect(() => {
    if (regionRef.current) {
      regionRef.current.textContent = message;
    }
  }, [message]);

  return { announce };
}

/**
 * Hook for managing form field accessibility
 */
export interface UseFormFieldA11yOptions {
  id?: string;
  label?: string;
  required?: boolean;
  error?: string;
  description?: string;
  disabled?: boolean;
}

export function useFormFieldA11y(options: UseFormFieldA11yOptions) {
  const {
    id: providedId,
    label,
    required = false,
    error,
    description,
    disabled = false,
  } = options;

  const fieldId = useA11yId(providedId || 'form-field');
  const labelId = label ? useA11yId('label') : undefined;
  const errorId = error ? useA11yId('error') : undefined;
  const descriptionId = description ? useA11yId('description') : undefined;

  // Build describedby string
  const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined;

  const fieldProps = {
    id: fieldId,
    'aria-required': required || undefined,
    'aria-invalid': Boolean(error) || undefined,
    'aria-describedby': describedBy,
    'aria-labelledby': labelId,
    disabled,
  };

  const labelProps = {
    id: labelId,
    htmlFor: fieldId,
  };

  const errorProps = error ? {
    id: errorId,
    role: 'alert' as const,
    'aria-live': 'polite' as const,
  } : {};

  const descriptionProps = description ? {
    id: descriptionId,
  } : {};

  const { announce } = useScreenReaderAnnouncement();

  // Announce error changes
  useEffect(() => {
    if (error) {
      announce(`Field error: ${error}`, 'assertive');
    }
  }, [error, announce]);

  return {
    fieldId,
    labelId,
    errorId,
    descriptionId,
    fieldProps,
    labelProps,
    errorProps,
    descriptionProps,
    isInvalid: Boolean(error),
    announce,
  };
}

/**
 * Hook for managing focus restoration
 */
export function useFocusRestore() {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const saveFocus = useCallback(() => {
    previousFocusRef.current = document.activeElement as HTMLElement;
  }, []);

  const restoreFocus = useCallback(() => {
    if (previousFocusRef.current) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, []);

  return {
    saveFocus,
    restoreFocus,
  };
}

/**
 * Hook for managing tab navigation between elements
 */
export function useTabNavigation() {
  const containerRef = useRef<HTMLElement>(null);

  const trapFocus = useCallback((event: React.KeyboardEvent) => {
    if (event.key !== 'Tab' || !containerRef.current) return;

    const focusableElements = containerRef.current.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    }
  }, []);

  return {
    containerRef,
    trapFocus,
  };
}

/**
 * Hook for managing modal accessibility
 */
export function useModalA11y() {
  const modalRef = useRef<HTMLElement>(null);
  const { saveFocus, restoreFocus } = useFocusRestore();
  const { announce } = useScreenReaderAnnouncement();

  const openModal = useCallback((title?: string) => {
    saveFocus();
    
    // Announce modal opening
    if (title) {
      announce(`${title} dialog opened`, 'assertive');
    }

    // Focus first focusable element
    setTimeout(() => {
      if (modalRef.current) {
        const firstFocusable = modalRef.current.querySelector<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        firstFocusable?.focus();
      }
    }, 0);
  }, [saveFocus, announce]);

  const closeModal = useCallback((title?: string) => {
    // Announce modal closing
    if (title) {
      announce(`${title} dialog closed`, 'polite');
    }

    restoreFocus();
  }, [restoreFocus, announce]);

  const handleEscape = useCallback((onClose: () => void) => (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  }, []);

  return {
    modalRef,
    openModal,
    closeModal,
    handleEscape,
  };
}

/**
 * Hook for managing loading state accessibility
 */
export function useLoadingA11y(isLoading: boolean, loadingText = 'Loading...') {
  const { announce } = useScreenReaderAnnouncement();

  useEffect(() => {
    if (isLoading) {
      announce(loadingText, 'polite');
    }
  }, [isLoading, loadingText, announce]);

  const loadingProps = {
    'aria-busy': isLoading || undefined,
    'aria-live': isLoading ? 'polite' as const : undefined,
    'aria-label': isLoading ? loadingText : undefined,
  };

  return { loadingProps, announce };
}

/**
 * Hook for managing validation state accessibility
 */
export interface UseValidationA11yOptions {
  isValid?: boolean;
  errors?: string[];
  warnings?: string[];
  validMessage?: string;
}

export function useValidationA11y(options: UseValidationA11yOptions) {
  const { isValid, errors = [], warnings = [], validMessage } = options;
  const { announce } = useScreenReaderAnnouncement();

  const prevErrorsRef = useRef<string[]>([]);
  const prevWarningsRef = useRef<string[]>([]);

  // Announce new errors
  useEffect(() => {
    const newErrors = errors.filter((error: any) => !prevErrorsRef.current.includes(error));
    if (newErrors.length > 0) {
      announce(`Validation errors: ${newErrors.join(', ')}`, 'assertive');
    }
    prevErrorsRef.current = errors;
  }, [errors, announce]);

  // Announce new warnings
  useEffect(() => {
    const newWarnings = warnings.filter((warning: any) => !prevWarningsRef.current.includes(warning));
    if (newWarnings.length > 0) {
      announce(`Validation warnings: ${newWarnings.join(', ')}`, 'polite');
    }
    prevWarningsRef.current = warnings;
  }, [warnings, announce]);

  // Announce validation success
  useEffect(() => {
    if (isValid && validMessage) {
      announce(validMessage, 'polite');
    }
  }, [isValid, validMessage, announce]);

  const validationProps = {
    'aria-invalid': errors.length > 0 || undefined,
    'aria-describedby': [...errors, ...warnings].length > 0 ? 'validation-messages' : undefined,
  };

  return {
    validationProps,
    hasErrors: errors.length > 0,
    hasWarnings: warnings.length > 0,
    announce,
  };
}