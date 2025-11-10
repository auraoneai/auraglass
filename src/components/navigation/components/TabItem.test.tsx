'use client';
/**
 * TabItem Component Tests
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
import { TabItem } from '@/components/navigation/components/TabItem';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe('TabItem', () => {
  const baseProps = {
    id: 'overview',
    label: 'Overview',
    onClick: jest.fn(),
  };

  /**
   * Smoke Test: Component renders without crashing
   */
  it('renders without crashing', () => {
    const { container } = render(<TabItem {...baseProps} />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it('has no accessibility violations', async () => {
    const { container } = render(
      <div role="tablist">
        <TabItem {...baseProps} />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  

  

  

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it('accepts and renders with custom props', () => {
    render(
      <TabItem
        {...baseProps}
        data-testid="tabitem"
        className="custom-class"
      />
    );

    const element = screen.getByTestId('tabitem');

    expect(element).toHaveClass('custom-class');
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it('matches snapshot', () => {
    const { container } = render(<TabItem {...baseProps} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});