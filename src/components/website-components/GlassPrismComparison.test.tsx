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
import { GlassPrismComparison } from "@/components/website-components/GlassPrismComparison";

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe("GlassPrismComparison", () => {
  const mockItems = [
    { id: "1", label: "Item 1" },
    { id: "2", label: "Item 2" },
  ];

  /**
   * Smoke Test: Component renders without crashing
   */
  it("renders without crashing", () => {
    const { container } = render(<GlassPrismComparison items={mockItems} />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it("has no accessibility violations", async () => {
    const { container } = render(<GlassPrismComparison items={mockItems} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it("accepts and renders with custom props", () => {
    const { container } = render(
      <GlassPrismComparison
        items={mockItems}
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
    const { container } = render(<GlassPrismComparison items={mockItems} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
