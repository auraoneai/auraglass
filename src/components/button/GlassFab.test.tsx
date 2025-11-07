/**
 * GlassFab Component Tests
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
import { GlassFab } from '@/components/button/GlassFab';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe('GlassFab', () => {
  /**
   * Smoke Test: Component renders without crashing
   */
  it('renders without crashing', () => {
    const { container } = render(<GlassFab />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it('has no accessibility violations', async () => {
    const { container } = render(<GlassFab />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  
  /**
   * ARIA Tests: Button has proper role and accessible name
   */
  describe('ARIA Attributes', () => {
    it('has button role', () => {
      render(<GlassFab>Click me</GlassFab>);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('has accessible name from content', () => {
      render(<GlassFab>Click me</GlassFab>);
      const button = screen.getByRole('button', { name: /click me/i });
      expect(button).toBeInTheDocument();
    });
  });

  

  

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it('accepts and renders with custom props', () => {
    const { container } = render(
      <GlassFab
        className="custom-class"
        data-testid="glassfab"
      />
    );

    const element = container.querySelector('[data-testid="glassfab"]')
      || container.firstChild;

    expect(element).toHaveClass('custom-class');
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it('matches snapshot', () => {
    const { container } = render(<GlassFab />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
