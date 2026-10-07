"use client";
/**
 * GlassSparkline Component Tests
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
import { GlassSparkline } from "@/components/data-display/GlassSparkline";

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe("GlassSparkline", () => {
  /**
   * Smoke Test: Component renders without crashing
   */
  it("renders without crashing", () => {
    const { container } = render(<GlassSparkline />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it("has no accessibility violations", async () => {
    const { container } = render(<GlassSparkline />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it("accepts and renders with custom props", () => {
    const { container } = render(
      <GlassSparkline className="custom-class" data-testid="glasssparkline" />
    );

    const element =
      container.querySelector('[data-testid="glasssparkline"]') ||
      container.firstChild;

    expect(element).toHaveClass("custom-class");
  });

  it("honors compact contained sizing without losing the chart path", () => {
    const { container } = render(
      <GlassSparkline
        data={[4, 8, 5, 12, 9]}
        compact
        contained
        maxHeight={24}
        data-testid="compact-sparkline"
      />
    );

    const svg = screen.getByTestId("compact-sparkline");
    expect(svg).toHaveAttribute("data-compact", "true");
    expect(svg).toHaveAttribute("width", "100%");
    expect(svg).toHaveAttribute("height", "24");
    expect(svg).toHaveStyle({ maxHeight: "24px", minWidth: "0" });
    expect(container.querySelector("path")).toHaveAttribute(
      "d",
      expect.stringContaining("M ")
    );
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it("matches snapshot", () => {
    const { container } = render(<GlassSparkline />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
