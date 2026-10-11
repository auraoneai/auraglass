'use client';
import * as React from 'react';
import { useNowPlaying } from '../npContext';

export const Subtitle = function Subtitle({className, children, ref}: { className?: string; children?: React.ReactNode } & { ref?: React.Ref<HTMLElement> }) {
    useNowPlaying('Subtitle');
    return <span ref={ref as never} data-ag-part="now-playing-subtitle" className={['ag-now-playing-subtitle', className].filter(Boolean).join(' ')}>{children}</span>;
  };
