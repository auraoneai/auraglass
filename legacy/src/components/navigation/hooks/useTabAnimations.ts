import React from 'react';
import { useState, useCallback } from 'react';

export interface TabAnimationState {
  activeIndex: number;
  isAnimating: boolean;
  selectorPosition: number;
  selectorWidth: number;
}

const useTabAnimations = (initialIndex = 0) => {
  const [state, setState] = useState<TabAnimationState>({
    activeIndex: initialIndex,
    isAnimating: false,
    selectorPosition: 0,
    selectorWidth: 0,
  });

  const animateToTab = useCallback((index: number, position: number, width: number) => {
    setState((prev: any) => ({
      ...prev,
      activeIndex: index,
      isAnimating: true,
      selectorPosition: position,
      selectorWidth: width,
    }));

    // Simulate animation end
    setTimeout(() => {
      setState((prev: any) => ({
        ...prev,
        isAnimating: false,
      }));
    }, 300);
  }, []);

  const setActiveTab = useCallback((index: number) => {
    setState((prev: any) => ({
      ...prev,
      activeIndex: index,
    }));
  }, []);

  return {
    ...state,
    animateToTab,
    setActiveTab,
  };
};

export default useTabAnimations;
