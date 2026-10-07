import React from 'react';
import { useState, useEffect } from 'react';

export interface ResponsiveState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  width: number;
  height: number;
}

const useResponsive = (breakpoints = { mobile: 768, tablet: 1024 }): ResponsiveState => {
  const [state, setState] = useState<ResponsiveState>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  useEffect(() => {
    const updateState = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setState({
        isMobile: width < breakpoints.mobile,
        isTablet: width >= breakpoints.mobile && width < breakpoints.tablet,
        isDesktop: width >= breakpoints.tablet,
        width,
        height,
      });
    };

    updateState();
    window.addEventListener('resize', updateState);

    return () => window.removeEventListener('resize', updateState);
  }, [breakpoints.mobile, breakpoints.tablet]);

  return state;
};

export default useResponsive;
