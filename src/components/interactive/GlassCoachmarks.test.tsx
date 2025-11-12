'use client';
/**
 * GlassCoachmarks Component Tests
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
import { GlassCoachmarks } from '@/components/interactive/GlassCoachmarks';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe('GlassCoachmarks', () => {
  /**
   * Smoke Test: Component renders without crashing
   */
  it('renders without crashing', () => {
    const { container } = render(<GlassCoachmarks />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it('has no accessibility violations', async () => {
    const { container } = render(<GlassCoachmarks />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  

  

  

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it('accepts and renders with custom props', () => {
    const steps = [{ id: '1', content: 'Test step' }];
    const { container } = render(
      <GlassCoachmarks
        steps={steps}
        current={0}
        onNext={() => {}}
        onPrev={() => {}}
        onClose={() => {}}
        className="custom-class"
        data-testid="glasscoachmarks"
      />
    );

    const element = container.querySelector('[data-testid="glasscoachmarks"]')
      || container.firstChild;

    expect(element).toHaveClass('custom-class');
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it('matches snapshot', () => {
    const { container } = render(<GlassCoachmarks />);
    expect(container.firstChild).toMatchSnapshot();
  });
});