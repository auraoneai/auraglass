'use client';
/**
 * AtmosphericEffects Component Tests
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
import { AtmosphericEffects } from '@/components/charts/components/AtmosphericEffects';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe('AtmosphericEffects', () => {
  /**
   * Smoke Test: Component renders without crashing
   */
  it('renders without crashing', () => {
    const { container } = render(<AtmosphericEffects />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it('has no accessibility violations', async () => {
    const { container } = render(<AtmosphericEffects />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  

  

  

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it('accepts and renders with custom props', () => {
    const { container } = render(
      <AtmosphericEffects
        className="custom-class"
        data-testid="atmosphericeffects"
      />
    );

    const element = container.querySelector('[data-testid="atmosphericeffects"]')
      || container.firstChild;

    expect(element).toHaveClass('custom-class');
  });

  /**
   * Snapshot Test: Matches snapshot
   * Note: Mocking Math.random to ensure deterministic particle positions
   */
  it('matches snapshot', () => {
    // Mock Math.random to return deterministic values for snapshot testing
    const originalRandom = Math.random;
    let callCount = 0;
    Math.random = jest.fn(() => {
      callCount++;
      // Return deterministic sequence: 0.1, 0.2, 0.3, ... wrapping at 1.0
      return ((callCount - 1) % 10) / 10 + 0.1;
    });

    const { container } = render(<AtmosphericEffects />);
    
    // Snapshot should be deterministic now with mocked Math.random
    expect(container.firstChild).toMatchSnapshot();
    
    // Restore original Math.random
    Math.random = originalRandom;
  });
});