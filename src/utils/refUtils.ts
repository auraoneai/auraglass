import React from 'react';
import { RefCallback, MutableRefObject, ForwardedRef } from 'react';

/**
 * Merge multiple refs into a single ref callback
 */
export function mergeRefs<T>(...refs: (ForwardedRef<T> | undefined)[]): RefCallback<T> {
  return (value: T) => {
    refs.forEach((ref: any) => {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref && 'current' in ref) {
        (ref as MutableRefObject<T | null>).current = value;
      }
    });
  };
}

/**
 * Merge physics ref with forwarded ref
 */
export function mergePhysicsRef<T>(
  forwardedRef: ForwardedRef<T>,
  physicsRef: MutableRefObject<T | null>
): RefCallback<T> {
  return (value: T) => {
    // Update physics ref
    physicsRef.current = value;

    // Update forwarded ref
    if (typeof forwardedRef === 'function') {
      forwardedRef(value);
    } else if (forwardedRef && 'current' in forwardedRef) {
      forwardedRef.current = value;
    }
  };
}
