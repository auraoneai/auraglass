'use client';
/**
 * GlassImageViewer Component Tests
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
import { GlassImageViewer, ImageViewerImage } from '@/components/interactive/GlassImageViewer';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

const mockImages: ImageViewerImage[] = [
  {
    src: 'https://via.placeholder.com/800x600.png?text=Image+1',
    alt: 'Image 1',
    title: 'Image 1 Title',
    description: 'Image 1 Description',
  },
  {
    src: 'https://via.placeholder.com/800x600.png?text=Image+2',
    alt: 'Image 2',
    title: 'Image 2 Title',
    description: 'Image 2 Description',
  },
];

describe('GlassImageViewer', () => {
  /**
   * Smoke Test: Component renders without crashing
   */
  it('renders without crashing', () => {
    const { container } = render(<GlassImageViewer images={mockImages} />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it('has no accessibility violations', async () => {
    const { container } = render(<GlassImageViewer images={mockImages} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  

  

  

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it('accepts and renders with custom props', () => {
    const { container } = render(
      <GlassImageViewer
        images={mockImages}
        className="custom-class"
        data-testid="glassimageviewer"
      />
    );

    const element = container.querySelector('[data-testid="glassimageviewer"]')
      || container.firstChild;

    expect(element).toHaveClass('custom-class');
  });

  it('renders compact contained mode without viewport fullscreen controls', () => {
    const { container } = render(
      <GlassImageViewer
        images={mockImages}
        contained
        compact
        height={240}
        maxHeight={280}
        data-testid="contained-viewer"
      />
    );

    const viewer = container.querySelector('[data-testid="contained-viewer"]') as HTMLElement;

    expect(viewer).toBeInTheDocument();
    expect(viewer).toHaveClass('glass-contained');
    expect(viewer).toHaveClass('glass-compact');
    expect(viewer).toHaveStyle({ height: '240px', maxHeight: '280px' });
    expect(screen.queryByRole('button', { name: /toggle fullscreen/i })).not.toBeInTheDocument();
    expect(screen.queryByText('Image 1 Title')).not.toBeInTheDocument();
    expect(screen.getByAltText('Image 1')).toBeInTheDocument();
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it('matches snapshot', () => {
    const { container } = render(<GlassImageViewer images={mockImages} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
