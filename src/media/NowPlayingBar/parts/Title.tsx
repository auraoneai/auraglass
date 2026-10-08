'use client';
import * as React from 'react';
import { useNowPlaying } from '../npContext';

export const Title = React.forwardRef<HTMLElement, { className?: string; children?: React.ReactNode }>(
  function Title({ className, children }, ref) {
    useNowPlaying('Title');
    return <span ref={ref as never} data-ag-part="now-playing-title" className={['ag-now-playing-title', className].filter(Boolean).join(' ')}>{children}</span>;
  },
);
