/* Server StatusBar (SURF-020): thin sunken content bar with NO role — a
   footer inside the shell is not a landmark. StatusBar.Live (client part in
   its own module) announces changes through the MAT announcer. */

import * as React from 'react';
import type { PartProps } from '../contracts/components';
import { partElement } from './_internal/partElement';
import { Surface } from '../material';
import { StatusBarLive } from './StatusBar.Live';

function StatusBarRoot({ children, render, ...rest }: PartProps<'div'>) {
  return (
    <Surface
      layer="content"
      content="content-sunken"
      render={partElement('div', {
        render,
        'data-ag-slot': 'status',
        'data-ag-part': 'status-bar',
        className: 'ag-status-bar',
        ...rest,
        children,
      })}
    />
  );
}

function StatusBarItem({ children, render, ...rest }: PartProps<'div'>) {
  return partElement('div', { render, 'data-ag-part': 'status-bar-item', ...rest, children });
}

export const StatusBar = {
  Root: StatusBarRoot,
  Item: StatusBarItem,
  Live: StatusBarLive,
};
