'use client';
/**
 * Glass360Viewer Component Tests
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
import { Glass360Viewer } from '@/components/immersive/Glass360Viewer';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe('Glass360Viewer', () => {
  const mockSource = {
    type: 'image' as const,
    url: 'https://example.com/360-image.jpg',
    projection: 'equirectangular' as const,
  };

  /**
   * Smoke Test: Component renders without crashing
   */
  it('renders without crashing', () => {
    const { container } = render(<Glass360Viewer source={mockSource} />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it('has no accessibility violations', async () => {
    const { container } = render(<Glass360Viewer source={mockSource} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  

  

  

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it('accepts and renders with custom props', () => {
    const { container } = render(
      <Glass360Viewer
        source={mockSource}
        className="custom-class"
        data-testid="glass360viewer"
      />
    );

    const element = container.querySelector('[data-testid="glass360viewer"]')
      || container.firstChild;

    expect(element).toHaveClass('custom-class');
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it('matches snapshot', () => {
    const { container } = render(<Glass360Viewer source={mockSource} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});