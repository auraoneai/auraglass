/* Slot (CMP-025): merges the parent's props onto a single child element.
   React ^19 only — reads child.props.ref (never element.ref), composes refs with
   cleanup-returning callbacks, className via cn (child last), style shallow (child
   wins), handlers child-first then slot's. */
import * as React from 'react';
import { cn } from '../internal/index';

export interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  ref?: React.Ref<HTMLElement>;
}

type AnyProps = Record<string, unknown>;

const isHandler = (key: string): boolean => /^on[A-Z]/.test(key);

type RefValue<T> = T | null;
type CleanupFn = () => void;

function callRef<T>(ref: React.Ref<T> | undefined, value: RefValue<T>): void | CleanupFn {
  if (typeof ref === 'function') return ref(value) as void | CleanupFn;
  if (ref) {
    (ref as React.RefObject<RefValue<T>>).current = value;
  }
  return undefined;
}

/** Composes two refs; supports React 19 cleanup-returning ref callbacks. */
export function composeRefs<T>(a: React.Ref<T> | undefined, b: React.Ref<T> | undefined): React.RefCallback<T> | undefined {
  if (!a && !b) return undefined;
  return (node) => {
    const ca = callRef(a, node);
    const cb = callRef(b, node);
    if (typeof ca === 'function' || typeof cb === 'function') {
      return () => {
        if (typeof ca === 'function') ca(); else callRef(a, null);
        if (typeof cb === 'function') cb(); else callRef(b, null);
      };
    }
    return undefined;
  };
}

const childRefOf = (child: React.ReactElement): React.Ref<HTMLElement> | undefined =>
  (child.props as { ref?: React.Ref<HTMLElement> } | undefined)?.ref;

export function Slot({ children, ref: slotRef, ...slotProps }: SlotProps): React.ReactElement | null {
  if (!React.isValidElement(children)) {
    if (process.env.NODE_ENV !== 'production' && children != null) {
      // eslint-disable-next-line no-console
      console.error('aura-glass: <Slot> expects exactly one element child.');
    }
    return null;
  }

  const childProps = (children.props ?? {}) as AnyProps;
  const merged: AnyProps = { ...(slotProps as AnyProps) };

  for (const key of Object.keys(childProps)) {
    const childVal = childProps[key];
    const slotVal = merged[key];
    if (isHandler(key) && typeof slotVal === 'function' && typeof childVal === 'function') {
      merged[key] = (...args: unknown[]) => {
        (childVal as (...a: unknown[]) => void)(...args);
        (slotVal as (...a: unknown[]) => void)(...args);
      };
    } else if (key === 'className') {
      merged[key] = cn(slotVal as string | undefined, childVal as string | undefined) || undefined;
    } else if (key === 'style' && slotVal && childVal) {
      merged[key] = { ...(slotVal as React.CSSProperties), ...(childVal as React.CSSProperties) };
    } else {
      merged[key] = childVal;
    }
  }

  const composedRef = composeRefs<HTMLElement>(slotRef, childRefOf(children));
  if (composedRef) merged.ref = composedRef;
  else if (childProps.ref) merged.ref = childProps.ref;

  return React.cloneElement(children, merged);
}

Slot.displayName = 'Slot';
