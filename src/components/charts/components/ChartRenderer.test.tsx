'use client';
/**
 * ChartRenderer Component Tests
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
import { ChartRenderer } from '@/components/charts/components/ChartRenderer';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe('ChartRenderer', () => {
  const mockDatasets = [
    {
      name: 'Dataset 1',
      data: [
        { x: 0, y: 10 },
        { x: 1, y: 20 },
        { x: 2, y: 15 },
      ],
      color: '#FF6B6B',
    },
  ];

  /**
   * Smoke Test: Component renders without crashing
   */
  it('renders without crashing', () => {
    const { container } = render(
      <ChartRenderer chartType="line" datasets={mockDatasets} />
    );
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it('has no accessibility violations', async () => {
    const { container } = render(
      <ChartRenderer chartType="line" datasets={mockDatasets} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  

  

  

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it('accepts and renders with custom props', () => {
    const { container } = render(
      <ChartRenderer
        chartType="line"
        datasets={mockDatasets}
        className="custom-class"
        data-testid="chartrenderer"
      />
    );

    const element = container.querySelector('[data-testid="chartrenderer"]')
      || container.firstChild;

    expect(element).toHaveClass('custom-class');
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it('matches snapshot', () => {
    const { container } = render(
      <ChartRenderer chartType="line" datasets={mockDatasets} />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});