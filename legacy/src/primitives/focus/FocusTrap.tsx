"use client";
import React, { useEffect, useRef, useCallback } from "react";

export interface FocusTrapProps {
  children: React.ReactNode;
  /**
   * Whether the focus trap is active
   */
  active?: boolean;
  /**
   * Whether to restore focus when trap is deactivated
   */
  restoreFocus?: boolean;
  /**
   * Whether to focus the first element when trap is activated
   */
  autoFocus?: boolean;
  /**
   * Whether to allow escape key to deactivate trap
   */
  allowEscape?: boolean;
  /**
   * Callback when escape is pressed
   */
  onEscape?: () => void;
  /**
   * Elements to exclude from focus trap
   */
  exclude?: string[];
  /**
   * Whether to lock scroll when trap is active
   */
  lockScroll?: boolean;
  /**
   * Custom selector for focusable elements
   */
  focusableSelector?: string;
}

const DEFAULT_FOCUSABLE_SELECTOR = [
  "a[href]:not([disabled])",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
  "audio[controls]",
  "video[controls]",
  "details>summary:first-of-type",
  "details",
].join(",");

/**
 * FocusTrap component
 * Traps focus within a container for accessibility
 */
export function FocusTrap({
  children,
  active = true,
  restoreFocus = true,
  autoFocus = true,
  allowEscape = true,
  onEscape,
  exclude = [],
  lockScroll = false,
  focusableSelector = DEFAULT_FOCUSABLE_SELECTOR,
}: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const sentinelStartRef = useRef<HTMLDivElement>(null);
  const sentinelEndRef = useRef<HTMLDivElement>(null);

  // Get all focusable elements within the container
  const getFocusableElements = useCallback(() => {
    if (!containerRef.current) return [];

    const elements = Array.from(
      containerRef.current.querySelectorAll<HTMLElement>(focusableSelector)
    );

    // Filter out excluded elements
    if (exclude.length > 0) {
      return elements.filter((el: any) => {
        return !exclude.some((selector) => el.matches(selector));
      });
    }

    return elements.filter((el: any) => {
      // Check if element is visible and not hidden. Avoid offsetParent here:
      // fixed-position dialogs and jsdom both commonly report null.
      const style = window.getComputedStyle(el);
      return (
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        style.opacity !== "0" &&
        !el.hasAttribute("hidden") &&
        el.getAttribute("aria-hidden") !== "true"
      );
    });
  }, [focusableSelector, exclude]);

  // Focus the first focusable element
  const focusFirst = useCallback(() => {
    const elements = getFocusableElements();
    if (elements.length > 0) {
      elements[0].focus();
    }
  }, [getFocusableElements]);

  // Focus the last focusable element
  const focusLast = useCallback(() => {
    const elements = getFocusableElements();
    if (elements.length > 0) {
      elements[elements.length - 1].focus();
    }
  }, [getFocusableElements]);

  // Handle tab key navigation
  const handleTabKey = useCallback(
    (event: KeyboardEvent) => {
      if (!active || !containerRef.current) return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement as HTMLElement;

      // Tab forward
      if (!event.shiftKey) {
        if (
          activeElement === lastElement ||
          !containerRef.current.contains(activeElement)
        ) {
          event.preventDefault();
          firstElement.focus();
        }
      }
      // Tab backward
      else {
        if (
          activeElement === firstElement ||
          !containerRef.current.contains(activeElement)
        ) {
          event.preventDefault();
          lastElement.focus();
        }
      }
    },
    [active, getFocusableElements]
  );

  // Handle escape key
  const handleEscapeKey = useCallback(
    (event: KeyboardEvent) => {
      if (!active || !allowEscape) return;

      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        onEscape?.();
      }
    },
    [active, allowEscape, onEscape]
  );

  // Handle sentinel focus (for screen readers)
  const handleSentinelFocus = useCallback(
    (position: "start" | "end") => {
      if (!active) return;

      if (position === "start") {
        focusLast();
      } else {
        focusFirst();
      }
    },
    [active, focusFirst, focusLast]
  );

  // Lock scroll when active
  useEffect(() => {
    if (!lockScroll) return;

    if (active) {
      const scrollY = window.scrollY;
      const body = document.body;
      const previousPosition = body.style.position;
      const previousTop = body.style.top;
      const previousWidth = body.style.width;
      const previousOverflow = body.style.overflow;

      body.style.position = "fixed";
      body.style.top = `-${scrollY}px`;
      body.style.width = "100%";
      body.style.overflow = "hidden";

      return () => {
        body.style.position = previousPosition;
        body.style.top = previousTop;
        body.style.width = previousWidth;
        body.style.overflow = previousOverflow;
        window.scrollTo(0, scrollY);
      };
    }
  }, [active, lockScroll]);

  // Set up focus trap
  useEffect(() => {
    if (!active) return;

    // Store current focus
    if (restoreFocus) {
      previousFocusRef.current = document.activeElement as HTMLElement;
    }

    // Auto focus first element
    if (autoFocus) {
      // Use setTimeout to ensure DOM is ready
      setTimeout(() => {
        focusFirst();
      }, 0);
    }

    // Add event listeners
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Tab") {
        handleTabKey(event);
      } else if (event.key === "Escape") {
        handleEscapeKey(event);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);

      // Restore focus
      if (restoreFocus && previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [
    active,
    autoFocus,
    restoreFocus,
    focusFirst,
    handleTabKey,
    handleEscapeKey,
  ]);

  // Handle focus outside of trap
  useEffect(() => {
    if (!active) return;

    const handleFocusIn = (event: FocusEvent) => {
      const target = event.target as HTMLElement;

      // Check if focus moved outside the container
      if (containerRef.current && !containerRef.current.contains(target)) {
        event.preventDefault();
        event.stopPropagation();
        focusFirst();
      }
    };

    // Use capture phase to intercept focus before it reaches the target
    document.addEventListener("focusin", handleFocusIn, true);

    return () => {
      document.removeEventListener("focusin", handleFocusIn, true);
    };
  }, [active, focusFirst]);

  if (!active) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Start sentinel for screen readers */}
      <div
        ref={sentinelStartRef}
        tabIndex={0}
        onFocus={() => handleSentinelFocus("start")}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 1,
          height: 0,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      />

      <div ref={containerRef} data-focus-trap="true">
        {children}
      </div>

      {/* End sentinel for screen readers */}
      <div
        ref={sentinelEndRef}
        tabIndex={0}
        onFocus={() => handleSentinelFocus("end")}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 1,
          height: 0,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      />
    </>
  );
}

/**
 * Hook to create a focus trap programmatically
 */
export function useFocusTrap(
  containerRef: React.RefObject<HTMLElement>,
  options: Omit<FocusTrapProps, "children"> = {}
) {
  const {
    active = true,
    restoreFocus = true,
    autoFocus = true,
    allowEscape = true,
    onEscape,
    exclude = [],
    focusableSelector = DEFAULT_FOCUSABLE_SELECTOR,
  } = options;

  const previousFocusRef = useRef<HTMLElement | null>(null);

  const getFocusableElements = useCallback(() => {
    if (!containerRef.current) return [];

    const elements = Array.from(
      containerRef.current.querySelectorAll<HTMLElement>(focusableSelector)
    );

    if (exclude.length > 0) {
      return elements.filter((el: any) => {
        return !exclude.some((selector) => el.matches(selector));
      });
    }

    return elements.filter((el: any) => {
      const style = window.getComputedStyle(el);
      return (
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        style.opacity !== "0" &&
        !el.hasAttribute("hidden") &&
        el.getAttribute("aria-hidden") !== "true"
      );
    });
  }, [containerRef, focusableSelector, exclude]);

  const focusFirst = useCallback(() => {
    const elements = getFocusableElements();
    if (elements.length > 0) {
      elements[0].focus();
    }
  }, [getFocusableElements]);

  const focusLast = useCallback(() => {
    const elements = getFocusableElements();
    if (elements.length > 0) {
      elements[elements.length - 1].focus();
    }
  }, [getFocusableElements]);

  useEffect(() => {
    if (!active || !containerRef.current) return;

    if (restoreFocus) {
      previousFocusRef.current = document.activeElement as HTMLElement;
    }

    if (autoFocus) {
      setTimeout(() => {
        focusFirst();
      }, 0);
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!containerRef.current) return;

      if (event.key === "Tab") {
        const focusableElements = getFocusableElements();
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        const activeElement = document.activeElement as HTMLElement;

        if (!event.shiftKey) {
          if (activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        } else {
          if (activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        }
      } else if (event.key === "Escape" && allowEscape) {
        event.preventDefault();
        onEscape?.();
      }
    };

    const handleFocusIn = (event: FocusEvent) => {
      const target = event.target as HTMLElement;

      if (containerRef.current && !containerRef.current.contains(target)) {
        event.preventDefault();
        focusFirst();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("focusin", handleFocusIn, true);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("focusin", handleFocusIn, true);

      if (restoreFocus && previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [
    active,
    containerRef,
    restoreFocus,
    autoFocus,
    allowEscape,
    onEscape,
    focusFirst,
    getFocusableElements,
  ]);

  return {
    focusFirst,
    focusLast,
    getFocusableElements,
  };
}
