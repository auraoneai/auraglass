'use client';
import React from 'react';
import { useState } from 'react';
import { springConfig } from '../animations/physics/springPhysics';
import { warnDeprecated } from '../utils/warnDeprecated';

export interface GalileoStateSpringOptions {
  stiffness?: number;
  damping?: number;
  mass?: number;
  immediate?: boolean;
}

/**
 * State holder kept for 4.x compatibility (also exported as `useAuraStateSpring`).
 * It never animated: `setValue` sets state immediately and `isAnimating` is always false.
 * @deprecated since 4.2.0, removed in 5.0.0; use {@link aura-glass/motion springs} (codemod: motion-imports). DEP-P0107.
 */
export function useGalileoStateSpring<T>(initialValue: T, options?: GalileoStateSpringOptions) {
  warnDeprecated('DEP-P0107');
  const [value, setValue] = useState(initialValue);

  const setSpringValue = (newValue: T) => {
    // Spring animation implementation - integrates with physics system
    setValue(newValue);
  };

  return {
    value,
    setValue: setSpringValue,
    isAnimating: false
  };
}
