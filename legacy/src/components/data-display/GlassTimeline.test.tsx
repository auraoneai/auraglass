'use client';
/**
 * GlassTimeline Component Tests
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
import { GlassTimeline } from '@/components/data-display/GlassTimeline';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe('GlassTimeline', () => {
  const mockItems = [
    { id: '1', title: 'Event 1', subtitle: 'Description 1', time: '2024-01-01' },
    { id: '2', title: 'Event 2', subtitle: 'Description 2', time: '2024-01-02' },
    { id: '3', title: 'Event 3', subtitle: 'Description 3', time: '2024-01-03' },
  ];

  /**
   * Smoke Test: Component renders without crashing
   */
  it('renders without crashing', () => {
    const { container } = render(<GlassTimeline items={mockItems} />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it('has no accessibility violations', async () => {
    const { container } = render(<GlassTimeline items={mockItems} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  
  /**
   * ARIA Tests: Component has accessible name and description
   */
  describe('ARIA Attributes', () => {
    it('supports aria-label', () => {
      const { container } = render(<GlassTimeline items={mockItems} aria-label="Test component" />);
      const element = container.querySelector('[aria-label="Test component"]');
      expect(element).toBeInTheDocument();
    });
  });

  

  

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it('accepts and renders with custom props', () => {
    const { container } = render(
      <GlassTimeline
        items={mockItems}
        className="custom-class"
        data-testid="glasstimeline"
      />
    );

    const element = container.querySelector('[data-testid="glasstimeline"]')
      || container.firstChild;

    expect(element).toHaveClass('custom-class');
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it('matches snapshot', () => {
    const { container } = render(<GlassTimeline items={mockItems} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});