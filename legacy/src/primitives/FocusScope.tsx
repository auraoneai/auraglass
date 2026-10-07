"use client";

import React from "react";

const FOCUSABLE_SELECTOR = [
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
].join(",");

const getFocusableElements = (container: HTMLElement | null) => {
  if (!container) return [];

  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
  ).filter((element) => {
    const style = window.getComputedStyle(element);
    return (
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      !element.hasAttribute("disabled") &&
      element.getAttribute("aria-hidden") !== "true"
    );
  });
};

export interface FocusScopeProps extends React.HTMLAttributes<HTMLDivElement> {
  trapped?: boolean;
  loop?: boolean;
  autoFocus?: boolean;
  restoreFocus?: boolean;
  onMountAutoFocus?: (event: Event) => void;
  onUnmountAutoFocus?: (event: Event) => void;
}

export const FocusScope = React.forwardRef<HTMLDivElement, FocusScopeProps>(
  (
    {
      trapped = false,
      loop = false,
      autoFocus = false,
      restoreFocus = true,
      onMountAutoFocus,
      onUnmountAutoFocus,
      children,
      ...props
    },
    forwardedRef
  ) => {
    const localRef = React.useRef<HTMLDivElement | null>(null);
    const previousFocusRef = React.useRef<HTMLElement | null>(null);

    const setRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        localRef.current = node;
        if (typeof forwardedRef === "function") {
          forwardedRef(node);
        } else if (forwardedRef) {
          (
            forwardedRef as React.MutableRefObject<HTMLDivElement | null>
          ).current = node;
        }
      },
      [forwardedRef]
    );

    React.useEffect(() => {
      previousFocusRef.current = document.activeElement as HTMLElement | null;

      if (autoFocus) {
        const event = new Event("focusScope.autoFocus", { cancelable: true });
        onMountAutoFocus?.(event);
        if (!event.defaultPrevented) {
          window.setTimeout(
            () => getFocusableElements(localRef.current)[0]?.focus(),
            0
          );
        }
      }

      return () => {
        const event = new Event("focusScope.restoreFocus", {
          cancelable: true,
        });
        onUnmountAutoFocus?.(event);

        if (restoreFocus && !event.defaultPrevented) {
          previousFocusRef.current?.focus();
        }
      };
    }, [autoFocus, onMountAutoFocus, onUnmountAutoFocus, restoreFocus]);

    React.useEffect(() => {
      if (!trapped && !loop) return;

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key !== "Tab") return;

        const focusables = getFocusableElements(localRef.current);
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement | null;

        if (
          !event.shiftKey &&
          (active === last || !localRef.current?.contains(active))
        ) {
          event.preventDefault();
          first.focus();
        } else if (
          event.shiftKey &&
          (active === first || !localRef.current?.contains(active))
        ) {
          event.preventDefault();
          last.focus();
        }
      };

      const handleFocusIn = (event: FocusEvent) => {
        if (!trapped) return;
        const target = event.target as Node | null;
        if (!target || localRef.current?.contains(target)) return;

        event.preventDefault();
        getFocusableElements(localRef.current)[0]?.focus();
      };

      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("focusin", handleFocusIn, true);

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        document.removeEventListener("focusin", handleFocusIn, true);
      };
    }, [loop, trapped]);

    return (
      <div ref={setRef} data-focus-scope="" {...props}>
        {children}
      </div>
    );
  }
);

FocusScope.displayName = "FocusScope";

export const GlassFocusScope = FocusScope;

export default FocusScope;
