'use client';
/**
 * GlassDashboard Component Tests
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
import { GlassDashboard } from '@/components/templates/dashboard/GlassDashboard';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe('GlassDashboard', () => {
  /**
   * Smoke Test: Component renders without crashing
   */
  it('renders without crashing', () => {
    const { container } = render(<GlassDashboard />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it('has no accessibility violations', async () => {
    const { container } = render(<GlassDashboard />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  
  /**
   * ARIA Tests: Component has accessible name and description
   */
  describe('ARIA Attributes', () => {
    it('supports aria-label', () => {
      const { container } = render(<GlassDashboard aria-label="Test component" />);
      const element = container.querySelector('[aria-label="Test component"]');
      expect(element).toBeInTheDocument();
    });
  });

  

  

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it('accepts and renders with custom props', () => {
    const { container } = render(
      <GlassDashboard
        className="custom-class"
        data-testid="glassdashboard"
      />
    );

    const element = container.querySelector('[data-testid="glassdashboard"]')
      || container.firstChild;

    expect(element).toHaveClass('custom-class');
  });

  it('supports compact contained rendering controls for preview containers', () => {
    const layout = {
      id: 'preview',
      name: 'Preview',
      cols: 4,
      gap: 'sm' as const,
      widgets: [
        {
          id: 'revenue',
          title: 'Revenue',
          type: 'metric' as const,
          size: { cols: 4 as const, rows: 2 as const },
          position: { x: 0, y: 0 },
          data: { value: '$128k', label: 'MRR', change: 12 },
        },
      ],
    };

    const { container } = render(
      <GlassDashboard
        compact
        contained
        showHeader={false}
        showActions={false}
        height={320}
        layout={layout}
        data-testid="dashboard-preview"
      />
    );

    const element = container.querySelector('[data-testid="dashboard-preview"]') as HTMLElement;
    expect(element).toBeInTheDocument();
    expect(element.style.height).toBe('320px');
    expect(element.style.maxHeight).toBe('420px');
    expect(element).toHaveStyle({ overflow: 'hidden' });
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    expect(screen.getByText('$128k')).toBeInTheDocument();
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it('matches snapshot', () => {
    const { container } = render(<GlassDashboard />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
