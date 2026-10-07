'use client';
/**
 * GlassKeyValueEditor Component Tests
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
import { GlassKeyValueEditor } from '@/components/interactive/GlassKeyValueEditor';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe('GlassKeyValueEditor', () => {
  const mockValue = [
    { key: 'key1', value: 'value1' },
    { key: 'key2', value: 'value2' },
  ];
  const mockOnChange = jest.fn();

  /**
   * Smoke Test: Component renders without crashing
   */
  it('renders without crashing', () => {
    const { container } = render(
      <GlassKeyValueEditor value={mockValue} onChange={mockOnChange} />
    );
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it('has no accessibility violations', async () => {
    const { container } = render(
      <GlassKeyValueEditor value={mockValue} onChange={mockOnChange} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  

  

  

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it('accepts and renders with custom props', () => {
    const { container } = render(
      <GlassKeyValueEditor
        value={mockValue}
        onChange={mockOnChange}
        className="custom-class"
        data-testid="glasskeyvalueeditor"
      />
    );

    const element = container.querySelector('[data-testid="glasskeyvalueeditor"]')
      || container.firstChild;

    expect(element).toHaveClass('custom-class');
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it('matches snapshot', () => {
    const { container } = render(
      <GlassKeyValueEditor value={mockValue} onChange={mockOnChange} />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});