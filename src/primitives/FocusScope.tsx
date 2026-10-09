/* FocusScope (CMP-029): ref-as-prop, data-ag-part='root' on the container,
   trapped/loop semantics unchanged, no Glass* alias. Focus manager for owned
   components (Sheet detents, ResizablePanels, Tour) only. */
import * as React from 'react';
import { layerInputFor } from '../theme/layerInput';

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

  React.useEffect(() => {
    if (!trapped && !loop) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
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

    const handleFocusIn = (event: FocusEvent) => {
      if (!trapped) return;
      const target = event.target as Node | null;
      if (!target || localRef.current?.contains(target)) return;
      event.preventDefault();
      getFocusableElements(localRef.current)[0]?.focus();
    };

    const input = layerInputFor(document);
    const offKey = input.on('keydown', handleKeyDown);
    const offFocus = input.on('focusin', handleFocusIn);
    return () => {
      offKey();
      offFocus();
    };
  }, [loop, trapped]);

  return (
    <div ref={setRef} data-ag-part="root" data-focus-scope="" {...props}>
      {children}
    </div>
  );
}

FocusScope.displayName = 'FocusScope';
