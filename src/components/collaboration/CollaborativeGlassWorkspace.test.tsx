/**
 * CollaborativeGlassWorkspace Component Tests
 *
 * Test Suite Coverage:
 * - ✅ Smoke test (renders without crashing)
 * - ✅ Props validation
 * - ✅ Accessibility (axe-core)
 * - ✅ ARIA attributes
 * - ⏭️  Focus management (not applicable)
 * - ⏭️  Reduced motion (not applicable)
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import userEvent from '@testing-library/user-event';
import { CollaborativeGlassWorkspace } from '@/components/collaboration/CollaborativeGlassWorkspace';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe('CollaborativeGlassWorkspace', () => {
  /**
   * Smoke Test: Component renders without crashing
   */
  it('renders without crashing', () => {
    const { container } = render(<CollaborativeGlassWorkspace />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it('has no accessibility violations', async () => {
    const { container } = render(<CollaborativeGlassWorkspace />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  
  /**
   * ARIA Tests: Component has accessible name and description
   */
  describe('ARIA Attributes', () => {
    it('supports aria-label', () => {
      const { container } = render(<CollaborativeGlassWorkspace aria-label="Test component" />);
      const element = container.querySelector('[aria-label="Test component"]');
      expect(element).toBeInTheDocument();
    });
  });

  

  

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it('accepts and renders with custom props', () => {
    const { container } = render(
      <CollaborativeGlassWorkspace
        className="custom-class"
        data-testid="collaborativeglassworkspace"
      />
    );

    const element = container.querySelector('[data-testid="collaborativeglassworkspace"]')
      || container.firstChild;

    expect(element).toHaveClass('custom-class');
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it('matches snapshot', () => {
    const { container } = render(<CollaborativeGlassWorkspace />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
