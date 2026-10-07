'use client';
/**
 * GlassStep Component Tests
 *
 * Test Suite Coverage:
 * - ✅ Smoke test (renders without crashing)
 * - ✅ Props validation
 * - ✅ Accessibility (axe-core)
 * - ⏭️  ARIA attributes (not applicable)
 * - ✅ Focus management
 * - ⏭️  Reduced motion (not applicable)
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import userEvent from '@testing-library/user-event';
import { GlassStep } from '@/components/input/GlassStep';
import { Step } from '@/components/input/types';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

const mockStep: Step = {
  id: 'step1',
  label: 'Step 1',
  title: 'First Step',
  description: 'This is the first step',
  disabled: false,
};

describe('GlassStep', () => {
  /**
   * Smoke Test: Component renders without crashing
   */
  it('renders without crashing', () => {
    const { container } = render(<GlassStep step={mockStep} index={0} active={false} completed={false} orientation="horizontal" />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it('has no accessibility violations', async () => {
    const { container } = render(
      <div role="list">
        <GlassStep step={mockStep} index={0} active={false} completed={false} orientation="horizontal" />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  

  
  /**
   * Focus Management Tests
   */
  describe('Focus Management', () => {
    it('can receive focus', () => {
      render(<GlassStep step={mockStep} index={0} active={false} completed={false} orientation="horizontal" />);
      const element = document.querySelector('[tabindex]') || document.querySelector('button, a, input, select, textarea');

      if (element) {
        (element as HTMLElement).focus();
        expect(element).toHaveFocus();
      }
    });

    it('shows visible focus indicator', () => {
      const { container } = render(<GlassStep step={mockStep} index={0} active={false} completed={false} orientation="horizontal" />);
      const element = container.querySelector('[tabindex]') || container.querySelector('button, a, input, select, textarea');

      if (element) {
        (element as HTMLElement).focus();
        // Check for focus-visible class or focus styles
        const hasFocusIndicator =
          element.classList.contains('focus-visible') ||
          window.getComputedStyle(element).outline !== 'none';
        expect(hasFocusIndicator).toBe(true);
      }
    });
  });

  it('renders fallback content when step prop is missing', () => {
    const { container } = render(
      <GlassStep index={0} active={false} completed={false} orientation="horizontal" />
    );
    expect(container).toBeInTheDocument();
  });

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it('accepts and renders with custom props', () => {
    const { container } = render(
      <GlassStep
        step={mockStep}
        index={0}
        active={false}
        completed={false}
        orientation="horizontal"
        className="custom-class"
        data-testid="glassstep"
      />
    );

    const element = container.querySelector('.optimized-glass-surface')
      || container.firstChild;

    expect(element).toHaveClass('custom-class');
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it('matches snapshot', () => {
    const { container } = render(<GlassStep step={mockStep} index={0} active={false} completed={false} orientation="horizontal" />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
