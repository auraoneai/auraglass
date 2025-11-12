"use client";
/**
 * GlassPrismComparison Component Tests
 *
 * Test Suite Coverage:
 * - ✅ Smoke test (renders without crashing)
 * - ✅ Props validation
 * - ✅ Accessibility (axe-core)
 * - ⏭️  ARIA attributes (not applicable)
 * - ⏭️  Focus management (not applicable)
 * - ⏭️  Reduced motion (not applicable)
 */

"use client";
/**
 * GlassPrismComparison Component Tests
 *
 * Test Suite Coverage:
 * - ✅ Smoke test (renders without crashing)
 * - ✅ Props validation
 * - ✅ Accessibility (axe-core)
 * - ⏭️  ARIA attributes (not applicable)
 * - ⏭️  Focus management (not applicable)
 * - ⏭️  Reduced motion (not applicable)
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import userEvent from "@testing-library/user-event";

// Mock framer-motion motion components to avoid CSS parsing issues
jest.mock("framer-motion", () => {
  const actualReact = jest.requireActual("react");
  return {
    motion: new Proxy({}, {
      get: (_target, prop) => {
        const Component = actualReact.forwardRef((props: any, ref: any) => {
          const { animate, transition, whileInView, viewport, ...restProps } = props;
          return actualReact.createElement(prop as string, { ref, ...restProps }, props.children);
        });
        Component.displayName = `motion.${String(prop)}`;
        return Component;
      },
    }),
    useMotionValue: jest.fn(() => ({ get: () => 0, set: jest.fn() })),
    useSpring: jest.fn(() => ({ get: () => 0, set: jest.fn() })),
    useTransform: jest.fn(() => ({ get: () => 0, set: jest.fn() })),
  };
});

import { GlassPrismComparison } from "@/components/website-components/GlassPrismComparison";

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe("GlassPrismComparison", () => {
  /**
   * Smoke Test: Component renders without crashing
   */
  it("renders without crashing", () => {
    const { container } = render(<GlassPrismComparison />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it("has no accessibility violations", async () => {
    const { container } = render(<GlassPrismComparison />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it("accepts and renders with custom props", () => {
    const { container } = render(
      <GlassPrismComparison
        className="custom-class"
        data-testid="glassprismcomparison"
      />
    );

    const element =
      container.querySelector('[data-testid="glassprismcomparison"]') ||
      container.firstChild;

    expect(element).toHaveClass("custom-class");
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it("matches snapshot", () => {
    const { container } = render(<GlassPrismComparison />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
