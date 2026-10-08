'use client';
/* StatusBar.Live (SURF-020): announces rendered text through the MAT
   announcer with a politeness setting and a 1000 ms debounce; never announces
   on first mount. */

import * as React from 'react';
import { useAnnouncer } from '../theme';
import type { PartProps } from '../contracts/components';
import { partElement } from './_internal/partElement';

export interface StatusBarLiveProps extends PartProps<'div'> {
  politeness?: 'polite' | 'assertive';
}

export function StatusBarLive({ politeness = 'polite', children, render, ...rest }: StatusBarLiveProps) {
  const { announce } = useAnnouncer();
  const text = typeof children === 'string' ? children : undefined;
  const mounted = React.useRef(false);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (!text) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => announce(text, { politeness }), 1000);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [text, politeness, announce]);

  return partElement('div', {
    render,
    'data-ag-part': 'status-bar-live',
    'aria-live': politeness,
    ...rest,
    children,
  });
}
