'use client';
/* StatusBar.Live (SURF-020/039): announces rendered text through the MAT
   announcer with a politeness setting and a 1000 ms debounce; never announces
   on first mount. The rendered div carries NO aria-live — announcements go
   through the shared announcer region only. The announce text comes from a
   `message` prop when given, else the element's textContent read in an
   effect (never render-phase). */

import * as React from 'react';
import { useAnnouncer } from '../theme';
import type { PartProps } from '../contracts/components';
import { partElement } from './_internal/partElement';

export interface StatusBarLiveProps extends PartProps<'div'> {
  politeness?: 'polite' | 'assertive';
  /** Explicit text to announce; defaults to the rendered textContent. */
  message?: string | undefined;
}

export function StatusBarLive({ politeness = 'polite', message, children, render, ...rest }: StatusBarLiveProps) {
  const { announce } = useAnnouncer();
  const ref = React.useRef<HTMLElement | null>(null);
  const mounted = React.useRef(false);
  const last = React.useRef<string>('');
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // No dep array: runs after every commit, reads the rendered text, and
  // announces only when it changed since the previous commit.
  React.useEffect(() => {
    const text = message !== undefined ? message : (ref.current?.textContent ?? '');
    if (!mounted.current) {
      mounted.current = true;
      last.current = text;
      return;
    }
    if (text === last.current || !text) return;
    last.current = text;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => announce(text, { politeness }), 1000);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  });

  return partElement('div', {
    render,
    ref: ref as React.Ref<HTMLElement>,
    'data-ag-part': 'status-bar-live',
    ...rest,
    children,
  });
}
