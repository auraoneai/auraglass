'use client';
/* FocusScope (CMP-029): ref-as-prop, data-ag-part='root' on the container,
   trapped/loop semantics unchanged, no Glass* alias. Focus manager for owned
   components (Sheet detents, ResizablePanels, Tour) only. */
import * as React from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]:not([disabled])',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
  'audio[controls]',
  'video[controls]',
  'details>summary:first-of-type',
].join(',');

const getFocusableElements = (container: HTMLElement | null): HTMLElement[] => {
  if (!container) return [];
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter((element) => {
    const style = window.getComputedStyle(element);
    return (
      style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      !element.hasAttribute('disabled') &&
      element.getAttribute('aria-hidden') !== 'true'
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
  ref?: React.Ref<HTMLDivElement>;
}

export function FocusScope({
  trapped = false,
  loop = false,
  autoFocus = false,
  restoreFocus = true,
  onMountAutoFocus,
  onUnmountAutoFocus,
  children,
  ref,
  ...props
}: FocusScopeProps): React.ReactElement {
  const localRef = React.useRef<HTMLDivElement | null>(null);
  const previousFocusRef = React.useRef<HTMLElement | null>(null);

  const setRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      localRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
    },
    [ref],
  );

  React.useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement | null;

    if (autoFocus) {
      const event = new Event('focusScope.autoFocus', { cancelable: true });
      onMountAutoFocus?.(event);
      if (!event.defaultPrevented) {
        window.setTimeout(() => getFocusableElements(localRef.current)[0]?.focus(), 0);
      }
    }

    return () => {
      const event = new Event('focusScope.restoreFocus', { cancelable: true });
      onUnmountAutoFocus?.(event);
      if (restoreFocus && !event.defaultPrevented) {
        previousFocusRef.current?.focus();
      }
    };
  }, [autoFocus, onMountAutoFocus, onUnmountAutoFocus, restoreFocus]);

  /* REQ-FIN-07 (REQ-CMP-12): no document listeners. Tab cycling and the
     trapped-focus pull are element-level handlers on the scope container. */
  const { onKeyDown, onBlur } = props;
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    onKeyDown?.(event);
    if (event.defaultPrevented || (!trapped && !loop) || event.key !== 'Tab') return;
    const focusables = getFocusableElements(localRef.current);
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (first === undefined || last === undefined) return;
    const active = document.activeElement as HTMLElement | null;

    if (!event.shiftKey && (active === last || !localRef.current?.contains(active))) {
      event.preventDefault();
      first.focus();
    } else if (event.shiftKey && (active === first || !localRef.current?.contains(active))) {
      event.preventDefault();
      last.focus();
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>): void => {
    onBlur?.(event);
    if (!trapped) return;
    const next = event.relatedTarget as Node | null;
    if (next && localRef.current?.contains(next)) return;
    getFocusableElements(localRef.current)[0]?.focus();
  };

  return (
    <div
      ref={setRef}
      data-ag-part="root"
      data-focus-scope=""
      {...props}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
    >
      {children}
    </div>
  );
}

FocusScope.displayName = 'FocusScope';
