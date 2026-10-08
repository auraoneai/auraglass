/** @jest-environment jsdom */
// media-viewer block test (SURF-503): compositional shape — Backdrop root,
// consumer-owned video + captions track, MediaControls, ImageViewer triggers.
// Library subpaths are virtual here (root config has no self-specifier map).
import { describe, expect, it, jest } from '@jest/globals';
import { render } from '@testing-library/react';
import * as React from 'react';

jest.mock('aura-glass/backdrops', () => {
  const R = require('react') as typeof import('react');
  return {
    Backdrop: ({ children, ...rest }: Record<string, unknown>) =>
      R.createElement('div', { className: 'ag-backdrop', ...rest }, children as never),
  };
}, { virtual: true });

jest.mock('aura-glass/media', () => {
  const R = require('react') as typeof import('react');
  return {
    useMediaElement: () => ({ state: { paused: true }, play: async () => {}, pause: () => {}, seek: () => {} }),
    MediaControls: {
      Root: ({ children }: Record<string, unknown>) => R.createElement('div', { 'data-ag-part': 'media-controls' }, children as never),
      PlayButton: () => R.createElement('button', { 'data-ag-part': 'media-play' }),
      Scrubber: () => R.createElement('div', { 'data-ag-part': 'media-scrubber' }),
      Time: () => R.createElement('span', { 'data-ag-part': 'media-time' }),
      Spacer: () => R.createElement('span'),
      Volume: () => R.createElement('div'),
      Mute: () => R.createElement('button'),
      Fullscreen: () => R.createElement('button'),
    },
    ImageViewer: {
      Root: ({ children }: Record<string, unknown>) => R.createElement('div', {}, children as never),
      Trigger: ({ children, ...rest }: Record<string, unknown>) =>
        R.createElement('button', { 'data-ag-part': 'image-viewer-trigger', ...rest }, children as never),
      Popup: () => null,
    },
  };
}, { virtual: true });

import { MediaViewer } from '../index';

describe('media-viewer block (SURF-503)', () => {
  it('renders the video + controls + gallery inside a Backdrop', () => {
    const { container } = render(<MediaViewer />);
    expect(container.querySelector('.ag-backdrop')).toBeTruthy();
    expect(container.querySelector('video[playsinline]')).toBeTruthy();
    expect(container.querySelector('track[kind="captions"]')).toBeTruthy();
    expect(container.querySelector('[data-ag-part="media-controls"]')).toBeTruthy();
    expect(container.querySelectorAll('[data-ag-part="image-viewer-trigger"]')).toHaveLength(3);
  });
});
