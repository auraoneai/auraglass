'use client';
/**
 * GlassComponentPalette Component Tests
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
import { screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import userEvent from '@testing-library/user-event';
import { GlassComponentPalette } from '@/components/cms/GlassComponentPalette';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe('GlassComponentPalette', () => {
  /**
   * Smoke Test: Component renders without crashing
   */
  it('renders without crashing', () => {
    const { container } = renderWithProviders(<GlassComponentPalette />, {
      providers: { dragDrop: true },
    });
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it('has no accessibility violations', async () => {
    const { container } = renderWithProviders(<GlassComponentPalette />, {
      providers: { dragDrop: true },
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  

  

  

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it('accepts and renders with custom props', () => {
    const { container } = renderWithProviders(
      <GlassComponentPalette
        className="custom-class"
        data-testid="glasscomponentpalette"
      />,
      { providers: { dragDrop: true } }
    );

    const element = container.querySelector('[data-testid="glasscomponentpalette"]')
      || container.firstChild;

    expect(element).toHaveClass('custom-class');
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it('matches snapshot', () => {
    const { container } = renderWithProviders(<GlassComponentPalette />, {
      providers: { dragDrop: true },
    });
    expect(container.firstChild).toMatchSnapshot();
  });
});
