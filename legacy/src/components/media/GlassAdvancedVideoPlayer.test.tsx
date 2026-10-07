'use client';
/**
 * GlassAdvancedVideoPlayer Component Tests
 *
 * Test Suite Coverage:
 * - ✅ Smoke test (renders without crashing)
 * - ✅ Props validation
 * - ✅ Accessibility (axe-core)
 * - ⏭️  ARIA attributes (not applicable)
 * - ⏭️  Focus management (not applicable)
 * - ⏭️  Reduced motion (not applicable)
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import userEvent from '@testing-library/user-event';
import { GlassAdvancedVideoPlayer } from '@/components/media/GlassAdvancedVideoPlayer';
import { MediaProvider } from '@/components/media/GlassMediaProvider';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe('GlassAdvancedVideoPlayer', () => {
  const mockMediaFile = {
    id: 'test-video',
    type: 'video' as const,
    src: 'https://example.com/video.mp4',
    title: 'Test Video',
    size: 1000000,
    format: 'mp4',
  };

  /**
   * Smoke Test: Component renders without crashing
   */
  it('renders without crashing', () => {
    const { container } = render(
      <MediaProvider>
        <GlassAdvancedVideoPlayer mediaFile={mockMediaFile} />
      </MediaProvider>
    );
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it('has no accessibility violations', async () => {
    const { container } = render(
      <MediaProvider>
        <GlassAdvancedVideoPlayer mediaFile={mockMediaFile} />
      </MediaProvider>
    );
    const results = await axe(container, {
      timeout: 15000, // Increase timeout for complex video player component
    });
    expect(results).toHaveNoViolations();
  }, 20000); // Increase Jest timeout to 20 seconds

  

  

  

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it('accepts and renders with custom props', () => {
    const { container } = render(
      <MediaProvider>
        <GlassAdvancedVideoPlayer
          mediaFile={mockMediaFile}
          className="custom-class"
          data-testid="glassadvancedvideoplayer"
        />
      </MediaProvider>
    );

    const element = container.querySelector('[data-testid="glassadvancedvideoplayer"]')
      || container.firstChild;

    expect(element).toHaveClass('custom-class');
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it('matches snapshot', () => {
    const { container } = render(
      <MediaProvider>
        <GlassAdvancedVideoPlayer mediaFile={mockMediaFile} />
      </MediaProvider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});