'use client';
/**
 * glass-card-link Component Tests
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
import { GlassCardLink } from '@/components/card/glass-card-link';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe('GlassCardLink', () => {
  /**
   * Smoke Test: Component renders without crashing
   */
  it('renders without crashing', () => {
    const { container } = render(
      <GlassCardLink href="#">Example</GlassCardLink>
    );
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it('has no accessibility violations', async () => {
    const { container } = render(
      <GlassCardLink href="#">Example</GlassCardLink>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  

  

  

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it('accepts and renders with custom props', () => {
    const { container } = render(
      <GlassCardLink
        className="custom-class"
        data-testid="glass-card-link"
        href="#"
      >
        Custom link
      </GlassCardLink>
    );

    const element = container.querySelector('[data-testid="glass-card-link"]')
      || container.firstChild;

    expect(element).toHaveClass('custom-class');
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it('matches snapshot', () => {
    const { container } = render(
      <GlassCardLink href="#">Example</GlassCardLink>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});