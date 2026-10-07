'use client';
/**
 * GlassDataTable Component Tests
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
import { GlassDataTable } from '@/components/templates/interactive/GlassDataTable';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe('GlassDataTable', () => {
  const mockData = [
    { id: '1', name: 'Item 1', value: 100 },
    { id: '2', name: 'Item 2', value: 200 },
    { id: '3', name: 'Item 3', value: 300 },
  ];

  const mockColumns = [
    { key: 'id' as const, label: 'ID', sortable: true },
    { key: 'name' as const, label: 'Name', sortable: true, filterable: true },
    { key: 'value' as const, label: 'Value', sortable: true },
  ];

  /**
   * Smoke Test: Component renders without crashing
   */
  it('renders without crashing', () => {
    const { container } = render(<GlassDataTable data={mockData} columns={mockColumns} />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it('has no accessibility violations', async () => {
    const { container } = render(<GlassDataTable data={mockData} columns={mockColumns} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  

  

  

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it('accepts and renders with custom props', () => {
    const { container } = render(
      <GlassDataTable
        data={mockData}
        columns={mockColumns}
        className="custom-class"
        data-testid="glassdatatable"
      />
    );

    const element = container.querySelector('[data-testid="glassdatatable"]')
      || container.firstChild;

    expect(element).toHaveClass('custom-class');
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it('matches snapshot', () => {
    const { container } = render(<GlassDataTable data={mockData} columns={mockColumns} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  /**
   * ARIA Test: supports aria-label
   */
  it('supports aria-label', () => {
    const { container } = render(
      <GlassDataTable 
        data={mockData} 
        columns={mockColumns} 
        aria-label="Test data table" 
      />
    );
    const element = container.querySelector('[aria-label="Test data table"]');
    expect(element).toBeInTheDocument();
  });
});