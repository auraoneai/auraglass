/* Server TopBar (SURF-019): chrome material header with exactly one MAT
   ScrollEdge at edge=top; scrollEdge prop maps to its edgeStyle (SC-22). No
   explicit role (a header nested in the shell is not the banner landmark). */

import * as React from 'react';
import type { PartProps } from '../contracts/components';
import { partElement } from './_internal/partElement';
import { ScrollEdge, Surface } from '../material';

export type TopBarRootProps = PartProps<'header'> & {
  placement?: 'inline' | 'overlay';
  /** MAT seam: maps to ScrollEdge edgeStyle. 'none' renders no edge. */
  scrollEdge?: 'soft' | 'hard' | 'none';
  labels?: { topBar?: string } | undefined;
};

const seenScrollEdges = new Set<string>();

function TopBarRoot({
  placement = 'inline',
  scrollEdge = 'soft',
  labels,
  children,
  render,
  ...rest
}: TopBarRootProps) {
  if (process.env['NODE_ENV'] === 'development' && scrollEdge !== 'none') {
    if (seenScrollEdges.has('top')) {
      console.warn(
        '[auraglass] TopBar: a second ScrollEdge edge="top" was rendered for the same scroll container.',
      );
    } else {
      seenScrollEdges.add('top');
    }
  }
  return (
    <Surface
      layer="chrome"
      variant="regular"
      render={partElement('header', {
        render,
        'data-ag-slot': 'top',
        'data-ag-part': 'top-bar',
        className: 'ag-top-bar',
        ...(labels?.topBar !== undefined ? { 'aria-label': labels.topBar } : {}),
        'data-ag-placement': placement,
        ...rest,
        children: (
          <>
            {children}
            {scrollEdge === 'none' ? null : <ScrollEdge edge="top" edgeStyle={scrollEdge} />}
          </>
        ),
      })}
    />
  );
}
TopBarRoot.displayName = 'TopBar.Root';

function TopBarLeading({ children, render, ...rest }: PartProps<'div'>) {
  return partElement('div', { render, 'data-ag-part': 'top-bar-leading', ...rest, children });
}
TopBarLeading.displayName = 'TopBar.Leading';

function TopBarTitle({ children, render, ...rest }: PartProps<'div'>) {
  return partElement('div', {
    render,
    'data-ag-part': 'top-bar-title',
    className: 'ag-top-bar__title',
    ...rest,
    children,
  });
}
TopBarTitle.displayName = 'TopBar.Title';

export type TopBarCenterProps = PartProps<'div'> & {
  /** Keep the center slot visible below the compact breakpoint. */
  keepCenter?: boolean;
};

function TopBarCenter({ keepCenter, children, render, ...rest }: TopBarCenterProps) {
  return partElement('div', {
    render,
    'data-ag-part': 'top-bar-center',
    className: 'ag-top-bar__center',
    ...(keepCenter ? { 'data-ag-keep-center': '' } : {}),
    ...rest,
    children,
  });
}
TopBarCenter.displayName = 'TopBar.Center';

function TopBarTrailing({ children, render, ...rest }: PartProps<'div'>) {
  return partElement('div', { render, 'data-ag-part': 'top-bar-trailing', ...rest, children });
}
TopBarTrailing.displayName = 'TopBar.Trailing';

export const TopBar = {
  Root: TopBarRoot,
  Leading: TopBarLeading,
  Title: TopBarTitle,
  Center: TopBarCenter,
  Trailing: TopBarTrailing,
};
