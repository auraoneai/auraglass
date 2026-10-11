/* Server MobileShell preset (SURF-021): AppShell.Root layout="mobile" with
   overlay TopBar, Main, and tab-bar slots. 100dvh + bottom scroll padding
   come from app-shell.css ([data-ag-layout='mobile'] rules). */

import * as React from 'react';
import type { PartProps } from '../contracts/components';
import { AppShell } from './AppShell';
import { TopBar } from './TopBar';

export interface MobileShellProps extends Omit<PartProps<'div'>, 'title'> {
  /** Content for the overlay top bar. */
  topBar?: React.ReactNode;
  /** Content for the bottom tab bar. */
  tabBar?: React.ReactNode;
  persistKey?: string | undefined;
}

export function MobileShell({ topBar, tabBar, children, persistKey, ...rest }: MobileShellProps) {
  return (
    <AppShell.Root layout="mobile" defaultSidebar="collapsed" defaultInspector="closed" persistKey={persistKey} {...rest}>
      {topBar !== undefined ? (
        <TopBar.Root placement="overlay">{topBar}</TopBar.Root>
      ) : null}
      <AppShell.Main>{children}</AppShell.Main>
      {tabBar !== undefined ? <div data-ag-slot="tabbar">{tabBar}</div> : null}
    </AppShell.Root>
  );
}
