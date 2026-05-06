"use client";
import React from "react";
import { useRef, useEffect, useCallback, useState } from "react";

export interface GlassFocusOptions {
  /** Enable glass focus ring */
  enabled?: boolean;
  /** Focus ring color */
  color?: string;
  /** Focus ring width */
  width?: number;
  /** Focus ring blur */
  blur?: number;
  /** Focus ring spread */
  spread?: number;
  /** Animation duration */
  duration?: number;
  /** Focus ring offset */
  offset?: number;
  /** Focus ring position */
  position?: string;
  /** Custom focus styles */
  customStyles?: React.CSSProperties;
  /** Enable keyboard navigation */
  keyboardNavigation?: boolean;
  /** Auto-focus on mount */
  autoFocus?: boolean;
  /** Focus trap behavior */
  focusTrap?: boolean;
  /** Restore focus on unmount */
  restoreFocus?: boolean;
}

export interface GlassFocusState {
  isFocused: boolean;
  isKeyboardFocused: boolean;
  focusOrigin: "mouse" | "keyboard" | "programmatic" | null;
  focusRingVisible: boolean;
  previousFocusedElement: Element | null;
}

const DEFAULT_OPTIONS: Required<GlassFocusOptions> = {
  enabled: true,
  color: "var(--glass-color-primary, 0.5)",
  width: 2,
  blur: 4,
  spread: 2,
  duration: 200,
  offset: 2,
  position: "relative",
  customStyles: {},
  keyboardNavigation: true,
  autoFocus: false,
  focusTrap: false,
  restoreFocus: false,
};

export function useGlassFocus(options: GlassFocusOptions = {}) {
  const elementRef = useRef<HTMLElement>(null);
  const previousFocusedElementRef = useRef<Element | null>(null);
  const focusOriginRef = useRef<"mouse" | "keyboard" | "programmatic" | null>(
    null
  );

  const [focusState, setFocusState] = useState<GlassFocusState>({
    isFocused: false,
    isKeyboardFocused: false,
    focusOrigin: null,
    focusRingVisible: false,
    previousFocusedElement: null,
  });

  const finalOptions = { ...DEFAULT_OPTIONS, ...options };

  // Base inline styles only (no pseudo-selectors here)
  const baseStyle = useCallback((): React.CSSProperties => {
    if (!finalOptions.enabled) return {};
    return {
      outline: "none",
      position: "relative",
      // pseudo-element styles are applied by CSS-in-JS in the wrapper component
    } as React.CSSProperties;
  }, [finalOptions.enabled]);

  // Handle focus events
  const handleFocus = useCallback(
    (event: FocusEvent) => {
      const target = event.target as HTMLElement;

      // Determine focus origin
      if (event.relatedTarget) {
        focusOriginRef.current = "keyboard";
      } else if (focusOriginRef.current === null) {
        focusOriginRef.current = "programmatic";
      }

      setFocusState((prev) => ({
        ...prev,
        isFocused: true,
        isKeyboardFocused: focusOriginRef.current === "keyboard",
        focusOrigin: focusOriginRef.current,
        focusRingVisible:
          finalOptions.enabled && focusOriginRef.current === "keyboard",
      }));

      // Apply focus styles
      if (target && finalOptions.enabled) {
        target.classList.add("glass-focus-visible");

        if (focusOriginRef.current === "keyboard") {
          target.classList.add("glass-focus-keyboard");
        }
      }
    },
    [finalOptions.enabled]
  );

  const handleBlur = useCallback((event: FocusEvent) => {
    const target = event.target as HTMLElement;

    setFocusState((prev) => ({
      ...prev,
      isFocused: false,
      isKeyboardFocused: false,
      focusOrigin: null,
      focusRingVisible: false,
    }));

    // Remove focus styles
    if (target) {
      target.classList.remove("glass-focus-visible", "glass-focus-keyboard");
    }
  }, []);

  // Handle mouse down to detect mouse focus
  const handleMouseDown = useCallback(() => {
    focusOriginRef.current = "mouse";
  }, []);

  // Handle key down to detect keyboard focus
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (
      [
        "Tab",
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "Enter",
        " ",
      ].includes(event.key)
    ) {
      focusOriginRef.current = "keyboard";
    }
  }, []);

  // Programmatic focus methods
  const focus = useCallback(() => {
    if (elementRef.current && finalOptions.enabled) {
      focusOriginRef.current = "programmatic";
      elementRef.current.focus();
    }
  }, [finalOptions.enabled]);

  const blur = useCallback(() => {
    if (elementRef.current) {
      elementRef.current.blur();
    }
  }, []);

  // Focus trap implementation
  const setupFocusTrap = useCallback(() => {
    if (!finalOptions.focusTrap || !elementRef.current) return;

    const element = elementRef.current;
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Tab") {
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
      }
    };

    element.addEventListener("keydown", handleKeyDown);

    return () => {
      element.removeEventListener("keydown", handleKeyDown);
    };
  }, [finalOptions.focusTrap]);

  // Setup event listeners
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Store previous focused element for restoration
    if (finalOptions.restoreFocus) {
      previousFocusedElementRef.current = document.activeElement;
    }

    // Add event listeners
    element.addEventListener("focus", handleFocus);
    element.addEventListener("blur", handleBlur);
    element.addEventListener("mousedown", handleMouseDown);

    if (finalOptions.keyboardNavigation) {
      element.addEventListener("keydown", handleKeyDown);
    }

    // Setup focus trap
    const cleanupFocusTrap = setupFocusTrap();

    // Auto-focus if enabled
    if (finalOptions.autoFocus) {
      setTimeout(() => focus(), 0);
    }

    return () => {
      element.removeEventListener("focus", handleFocus);
      element.removeEventListener("blur", handleBlur);
      element.removeEventListener("mousedown", handleMouseDown);

      if (finalOptions.keyboardNavigation) {
        element.removeEventListener("keydown", handleKeyDown);
      }

      cleanupFocusTrap?.();

      // Restore focus if enabled
      if (finalOptions.restoreFocus && previousFocusedElementRef.current) {
        setTimeout(() => {
          (previousFocusedElementRef.current as HTMLElement)?.focus?.();
        }, 0);
      }
    };
  }, [
    handleFocus,
    handleBlur,
    handleMouseDown,
    handleKeyDown,
    setupFocusTrap,
    finalOptions.autoFocus,
    finalOptions.keyboardNavigation,
    finalOptions.restoreFocus,
  ]);

  return {
    ref: elementRef,
    focusState,
    baseStyle: baseStyle(),
    focus,
    blur,
    options: finalOptions,
  };
}

// Hook for managing focus within a group of elements
export function useGlassFocusGroup(
  options: GlassFocusOptions & {
    elements: HTMLElement[];
    loop?: boolean;
  } = { elements: [] }
) {
  const { elements, loop = true, ...focusOptions } = options;
  const [currentFocusIndex, setCurrentFocusIndex] = useState(-1);

  const moveFocus = useCallback(
    (direction: "next" | "previous" | "first" | "last") => {
      if (elements.length === 0) return;

      let newIndex: number;

      switch (direction) {
        case "first":
          newIndex = 0;
          break;
        case "last":
          newIndex = elements.length - 1;
          break;
        case "next":
          newIndex = loop
            ? (currentFocusIndex + 1) % elements.length
            : Math.min(currentFocusIndex + 1, elements.length - 1);
          break;
        case "previous":
          newIndex = loop
            ? (currentFocusIndex - 1 + elements.length) % elements.length
            : Math.max(currentFocusIndex - 1, 0);
          break;
      }

      setCurrentFocusIndex(newIndex);
      elements[newIndex]?.focus();
    },
    [elements, currentFocusIndex, loop]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowRight":
        case "ArrowDown":
          event.preventDefault();
          moveFocus("next");
          break;
        case "ArrowLeft":
        case "ArrowUp":
          event.preventDefault();
          moveFocus("previous");
          break;
        case "Home":
          event.preventDefault();
          moveFocus("first");
          break;
        case "End":
          event.preventDefault();
          moveFocus("last");
          break;
      }
    },
    [moveFocus]
  );

  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if (elements.includes(event.target as HTMLElement)) {
        handleKeyDown(event);
      }
    };

    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => document.removeEventListener("keydown", handleGlobalKeyDown);
  }, [elements, handleKeyDown]);

  return {
    currentFocusIndex,
    moveFocus,
    focusOptions,
  };
}

// Hook for skip links (accessibility)
export function useSkipLinks(
  links: Array<{ id: string; label: string; targetId: string }>
) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Tab" && !visible) {
        setVisible(true);
      }
    };

    const handleClick = () => {
      setVisible(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleClick);
    };
  }, [visible]);

  const skipTo = useCallback((targetId: string) => {
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setVisible(false);
  }, []);

  return {
    visible,
    links,
    skipTo,
  };
}
