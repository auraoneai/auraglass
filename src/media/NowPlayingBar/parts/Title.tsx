'use client';
import * as React from 'react';
import { useNowPlaying } from '../npContext';

export const Title = (function ({ ref, className, children }: { className?: string; children?: React.ReactNode } & { ref?: React.Ref<HTMLElement> }) {
    useNowPlaying('Title');
    return <span ref={ref as never} data-ag-part="now-playing-title" className={['ag-now-playing-title', className].filter(Boolean).join(' ')}>{children}</span>;
  }
);
