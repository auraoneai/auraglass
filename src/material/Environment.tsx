/* MAT-138 — Environment: declares the ambient backdrop. 'auto' with an
   image/video resolves to 'media'. The media element sits behind children and
   is aria-hidden; no pixel operations here. */
import * as React from 'react';
import type { Backdrop, EnvironmentProps } from './types';

export function Environment({ backdrop, image, video, children, className }: EnvironmentProps) {
  const resolved: Backdrop = backdrop === 'auto' && (image || video) ? 'media' : backdrop;
  const media = resolved === 'media' && image
    ? React.createElement('img', {
      src: image, decoding: 'async', alt: '', 'aria-hidden': 'true',
      'data-ag-part': 'backdrop-media',
    })
    : resolved === 'media' && video
      ? React.createElement('video', {
        src: video, muted: true, playsInline: true, 'aria-hidden': 'true',
        'data-ag-part': 'backdrop-media',
      })
      : null;
  return React.createElement('div', {
    'data-ag-backdrop': resolved,
    className,
  }, media, children);
}
