/** @jest-environment jsdom */
// media-viewer block test (SURF-503, REQ-SURF-171): compositional shape —
// Backdrop root, consumer-owned video + captions track, MediaControls,
// ImageViewer triggers, NowPlayingBar and CarouselRail — against the real
// library sources. Library subpaths are aliased virtually because the root
// config has no self-specifier map yet (REQ-FIN-09 / contract C-4, FIN-A).
import { describe, expect, it, jest } from '@jest/globals';
import { render } from '@testing-library/react';
import * as React from 'react';

jest.mock('aura-glass/backdrops', () => jest.requireActual('../../../../src/backdrops/index'), { virtual: true });
jest.mock('aura-glass/media', () => jest.requireActual('../../../../src/media/index'), { virtual: true });

import { MediaViewer } from '../index';
import { ITEM_IMAGES } from '../fixtures';

describe('media-viewer block (SURF-503)', () => {
  it('renders the video + controls + gallery + now-playing + carousel inside a Backdrop', () => {
    const { container } = render(<MediaViewer />);
    expect(container.querySelector('[data-ag-backdrop-preset="photo"]')).toBeTruthy();
    expect(container.querySelector('video[playsinline]')).toBeTruthy();
    expect(container.querySelector('track[kind="captions"]')).toBeTruthy();
    expect(container.querySelector('[data-ag-part="media-controls"]')).toBeTruthy();
    expect(container.querySelectorAll('[data-ag-part="image-viewer-trigger"]')).toHaveLength(ITEM_IMAGES.length);
    expect(container.querySelector('[data-ag-part="now-playing"]')).toBeTruthy();
    expect(container.querySelectorAll('[data-ag-part="carousel-slide"]')).toHaveLength(ITEM_IMAGES.length);
  });
});
