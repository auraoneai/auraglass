'use client';
import React from 'react';
import { MotionConfig } from 'framer-motion';

export interface ReducedMotionProviderProps {
  children: React.ReactNode;
}

export default function ReducedMotionProvider({ children }: ReducedMotionProviderProps) {
  const [reduced, setReduced] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === 'undefined' || !('matchMedia' in window)) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(!!mq.matches);
    update();
    if ('addEventListener' in mq) {
      mq.addEventListener('change', update);
      return () => mq.removeEventListener('change', update);
    } else {
      // @ts-ignore older Safari
      mq.addListener(update);
      // @ts-ignore older Safari
      return () => mq.removeListener(update);
    }
  }, []);

  return (
    <MotionConfig reducedMotion={reduced ? 'always' : 'never'}>
      {children}
    </MotionConfig>
  );
}