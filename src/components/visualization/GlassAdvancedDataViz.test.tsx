/**
 * GlassAdvancedDataViz Component Tests
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
import { GlassAdvancedDataViz } from '@/components/visualization/GlassAdvancedDataViz';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe('GlassAdvancedDataViz', () => {
  /**
   * Smoke Test: Component renders without crashing
   */
  it('renders without crashing', () => {
    const { container } = render(<GlassAdvancedDataViz />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it('has no accessibility violations', async () => {
    const { container } = render(<GlassAdvancedDataViz />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  

  

  

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it('accepts and renders with custom props', () => {
    const { container } = render(
      <GlassAdvancedDataViz
        className="custom-class"
        data-testid="glassadvanceddataviz"
      />
    );

    const element = container.querySelector('[data-testid="glassadvanceddataviz"]')
      || container.firstChild;

    expect(element).toHaveClass('custom-class');
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it('matches snapshot', () => {
    const { container } = render(<GlassAdvancedDataViz />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
