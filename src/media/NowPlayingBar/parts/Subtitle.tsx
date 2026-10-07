'use client';
import * as React from 'react';
import { useNowPlaying } from '../npContext';

export const Subtitle = React.forwardRef<HTMLElement, { className?: string; children?: React.ReactNode }>(
  function Subtitle({ className, children }, ref) {
    useNowPlaying('Subtitle');
    return <span ref={ref as never} data-ag-part="now-playing-subtitle" className={['ag-now-playing-subtitle', className].filter(Boolean).join(' ')}>{children}</span>;
  },
);
