/* MAT-292: the polite + assertive live regions. Rendered inside the portal
   root's [data-ag-announcer] element by the provider (part of
   PORTAL_ROOT_MARKUP). */
'use client';
import * as React from 'react';

export function AnnouncerRegions(): React.ReactElement {
  return React.createElement(
    'div',
    { 'data-ag-announcer': '' },
    React.createElement('div', { 'aria-live': 'polite', 'aria-atomic': 'true' }),
    React.createElement('div', { 'aria-live': 'assertive', 'aria-atomic': 'true' }),
  );
}
