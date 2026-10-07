'use client';
/**
 * GlassFormStepper Component Tests
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
import { GlassFormStepper } from '@/components/input/GlassFormStepper';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe('GlassFormStepper', () => {
  const mockSteps = [
    { id: '1', title: 'Step 1', description: 'First step' },
    { id: '2', title: 'Step 2', description: 'Second step' },
    { id: '3', title: 'Step 3', description: 'Third step' },
  ];

  /**
   * Smoke Test: Component renders without crashing
   */
  it('renders without crashing', () => {
    const { container } = render(<GlassFormStepper steps={mockSteps} />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it('has no accessibility violations', async () => {
    const { container } = render(<GlassFormStepper steps={mockSteps} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  

  

  

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it('accepts and renders with custom props', () => {
    const { container } = render(
      <GlassFormStepper
        steps={mockSteps}
        className="custom-class"
        data-testid="glassformstepper"
      />
    );

    const element = container.querySelector('[data-testid="glassformstepper"]') ||
      screen.getByRole('navigation');

    expect(element).toHaveClass('custom-class');
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it('matches snapshot', () => {
    const { container } = render(<GlassFormStepper steps={mockSteps} />);
    const navElement = screen.getByRole('navigation');
    expect(navElement).toMatchSnapshot();
  });
});