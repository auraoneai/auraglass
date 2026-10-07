'use client';
/**
 * GlassFoldableSupport Component Tests
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
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { GlassFoldableSupport } from '@/components/advanced/GlassFoldableSupport';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe('GlassFoldableSupport', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockReturnValue({
        matches: false,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }),
    });

    (window as any).CSS = (window as any).CSS || {
      supports: jest.fn().mockReturnValue(false),
    };
  });

  /**
   * Smoke Test: Component renders without crashing
   */
  it('renders without crashing', () => {
    const { container } = render(
      <GlassFoldableSupport>
        <div>content</div>
      </GlassFoldableSupport>
    );
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it('has no accessibility violations', async () => {
    const { container } = render(
      <GlassFoldableSupport>
        <div>content</div>
      </GlassFoldableSupport>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  

  

  

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it('accepts and renders with custom props', () => {
    const { container } = render(
      <GlassFoldableSupport className="custom-class">
        <div>content</div>
      </GlassFoldableSupport>
    );

    const element = container.firstChild as HTMLElement;

    expect(element).toHaveClass('custom-class');
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it('matches snapshot', () => {
    const { container } = render(
      <GlassFoldableSupport>
        <div>content</div>
      </GlassFoldableSupport>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});