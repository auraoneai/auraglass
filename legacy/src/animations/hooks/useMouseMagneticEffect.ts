import React from 'react';
import { useRef, useEffect, useCallback, useState } from 'react';

export interface MagneticEffectConfig {
  strength?: number;
  range?: number;
  scale?: number;
  rotation?: number;
  easing?: string;
  duration?: number;
  enabled?: boolean;
  resetOnLeave?: boolean;
}

export interface MagneticEffectState {
  isActive: boolean;
  distance: number;
  intensity: number;
  transform: {
    x: number;
    y: number;
    scale: number;
    rotation: number;
  };
}

const DEFAULT_CONFIG: Required<MagneticEffectConfig> = {
  strength: 0.3,
  range: 100,
  scale: 1.1,
  rotation: 5,
  easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
  duration: 300,
  enabled: true,
  resetOnLeave: true,
};

export function useMouseMagneticEffect(
  config: MagneticEffectConfig = {}
) {
  const elementRef = useRef<HTMLElement>(null);
  const [state, setState] = useState<MagneticEffectState>({
    isActive: false,
    distance: 0,
    intensity: 0,
    transform: {
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
    },
  });

  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  const calculateMagneticEffect = useCallback((
    mouseX: number,
    mouseY: number,
    elementRect: DOMRect
  ): MagneticEffectState => {
    const centerX = elementRect.left + elementRect.width / 2;
    const centerY = elementRect.top + elementRect.height / 2;

    const deltaX = mouseX - centerX;
    const deltaY = mouseY - centerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance > finalConfig.range) {
      return {
        isActive: false,
        distance,
        intensity: 0,
        transform: {
          x: 0,
          y: 0,
          scale: 1,
          rotation: 0,
        },
      };
    }

    const intensity = Math.max(0, 1 - distance / finalConfig.range);
    const strength = finalConfig.strength * intensity;

    const transform = {
      x: deltaX * strength,
      y: deltaY * strength,
      scale: 1 + (finalConfig.scale - 1) * intensity,
      rotation: (deltaX / distance) * finalConfig.rotation * intensity,
    };

    return {
      isActive: true,
      distance,
      intensity,
      transform,
    };
  }, [finalConfig]);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!elementRef.current || !finalConfig.enabled) return;

    const elementRect = elementRef.current.getBoundingClientRect();
    const newState = calculateMagneticEffect(
      event.clientX,
      event.clientY,
      elementRect
    );

    setState(newState);

    // Apply transform directly to element
    if (elementRef.current) {
      const { transform } = newState;
      elementRef.current.style.transform = `
        translate(${transform.x}px, ${transform.y}px)
        scale(${transform.scale})
        rotate(${transform.rotation}deg)
      `;
      elementRef.current.style.transition = finalConfig.duration > 0
        ? `transform ${finalConfig.duration}ms ${finalConfig.easing}`
        : 'none';
    }
  }, [calculateMagneticEffect, finalConfig]);

  const handleMouseLeave = useCallback(() => {
    if (!finalConfig.resetOnLeave || !elementRef.current) return;

    setState({
      isActive: false,
      distance: 0,
      intensity: 0,
      transform: {
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
      },
    });

    // Reset transform
    elementRef.current.style.transform = 'translate(0, 0) scale(1) rotate(0deg)';
  }, [finalConfig.resetOnLeave]);

  const reset = useCallback(() => {
    if (!elementRef.current) return;

    setState({
      isActive: false,
      distance: 0,
      intensity: 0,
      transform: {
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
      },
    });

    elementRef.current.style.transform = 'translate(0, 0) scale(1) rotate(0deg)';
  }, []);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || !finalConfig.enabled) return;

    // Add event listeners
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave, finalConfig.enabled]);

  return {
    ref: elementRef,
    state,
    reset,
    config: finalConfig,
  };
}

// Hook for applying magnetic effect to multiple elements
export function useMagneticField(
  config: MagneticEffectConfig = {}
) {
  const containerRef = useRef<HTMLElement>(null);
  const elementsRef = useRef<Map<string, HTMLElement>>(new Map());
  const [activeElement, setActiveElement] = useState<string | null>(null);

  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  const registerElement = useCallback((id: string, element: HTMLElement) => {
    elementsRef.current.set(id, element);
    return () => {
      elementsRef.current.delete(id);
    };
  }, []);

  const unregisterElement = useCallback((id: string) => {
    elementsRef.current.delete(id);
    if (activeElement === id) {
      setActiveElement(null);
    }
  }, [activeElement]);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!finalConfig.enabled) return;

    let closestElement: string | null = null;
    let minDistance = Infinity;

    elementsRef.current.forEach((element, id) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distance = Math.sqrt(
        Math.pow(event.clientX - centerX, 2) +
        Math.pow(event.clientY - centerY, 2)
      );

      if (distance < minDistance && distance <= finalConfig.range) {
        minDistance = distance;
        closestElement = id;
      }
    });

    if (closestElement !== activeElement) {
      // Reset previous active element
      if (activeElement && elementsRef.current.has(activeElement)) {
        const prevElement = elementsRef.current.get(activeElement)!;
        prevElement.style.transform = 'translate(0, 0) scale(1) rotate(0deg)';
      }

      setActiveElement(closestElement);

      // Apply effect to new active element
      if (closestElement && elementsRef.current.has(closestElement)) {
        const element = elementsRef.current.get(closestElement)!;
        const rect = element.getBoundingClientRect();
        const intensity = Math.max(0, 1 - minDistance / finalConfig.range);

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = event.clientX - centerX;
        const deltaY = event.clientY - centerY;

        const transform = {
          x: deltaX * finalConfig.strength * intensity,
          y: deltaY * finalConfig.strength * intensity,
          scale: 1 + (finalConfig.scale - 1) * intensity,
          rotation: (deltaX / minDistance) * finalConfig.rotation * intensity,
        };

        element.style.transform = `
          translate(${transform.x}px, ${transform.y}px)
          scale(${transform.scale})
          rotate(${transform.rotation}deg)
        `;
        element.style.transition = finalConfig.duration > 0
          ? `transform ${finalConfig.duration}ms ${finalConfig.easing}`
          : 'none';
      }
    }
  }, [activeElement, finalConfig]);

  const resetAll = useCallback(() => {
    elementsRef.current.forEach((element) => {
      element.style.transform = 'translate(0, 0) scale(1) rotate(0deg)';
    });
    setActiveElement(null);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !finalConfig.enabled) return;

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', resetAll);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', resetAll);
    };
  }, [handleMouseMove, resetAll, finalConfig.enabled]);

  return {
    containerRef,
    registerElement,
    unregisterElement,
    activeElement,
    resetAll,
    config: finalConfig,
  };
}

// Utility hook for magnetic buttons
export function useMagneticButton(
  config: MagneticEffectConfig & {
    onClick?: () => void;
    disabled?: boolean;
  } = {}
) {
  const { onClick, disabled, ...magneticConfig } = config;
  const magnetic = useMouseMagneticEffect(magneticConfig);

  const handleClick = useCallback(() => {
    if (!disabled && onClick) {
      // Add click feedback animation
      if (magnetic.ref.current) {
        magnetic.ref.current.style.animation = 'magnetic-click 0.2s ease-out';
        setTimeout(() => {
          if (magnetic.ref.current) {
            magnetic.ref.current.style.animation = '';
          }
        }, 200);
      }
      onClick();
    }
  }, [disabled, onClick, magnetic.ref]);

  useEffect(() => {
    const element = magnetic.ref.current;
    if (!element) return;

    if (disabled) {
      element.style.pointerEvents = 'none';
      element.style.opacity = '0.5';
    } else {
      element.style.pointerEvents = 'auto';
      element.style.opacity = '1';
    }
  }, [disabled, magnetic.ref]);

  return {
    ...magnetic,
    handleClick,
    disabled: disabled || false,
  };
}
