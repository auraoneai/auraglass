"use client";
/**
 * GlassFilterPanel Component Tests
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
import { GlassFilterPanel } from "@/components/interactive/GlassFilterPanel";

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe("GlassFilterPanel", () => {
  /**
   * Smoke Test: Component renders without crashing
   */
  it("renders without crashing", () => {
    const { container } = render(<GlassFilterPanel />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it("has no accessibility violations", async () => {
    const { container } = render(<GlassFilterPanel />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it("accepts and renders with custom props", () => {
    const { container } = render(
      <GlassFilterPanel
        className="custom-class"
        data-testid="glassfilterpanel"
      />
    );

    const element =
      container.querySelector('[data-testid="glassfilterpanel"]') ||
      container.firstChild;

    expect(element).toHaveClass("custom-class");
  });

  it("keeps compact panels bounded and limits visible options", () => {
    render(
      <GlassFilterPanel
        variant="compact"
        contained
        maxHeight={180}
        data-testid="compact-filter-panel"
        filters={[
          {
            id: "category",
            label: "Category",
            type: "checkbox",
            options: [
              { id: "a", label: "A", value: "a" },
              { id: "b", label: "B", value: "b" },
              { id: "c", label: "C", value: "c" },
              { id: "d", label: "D", value: "d" },
              { id: "e", label: "E", value: "e" },
            ],
          },
        ]}
      />
    );

    const root = screen.getByTestId("compact-filter-panel");
    expect(root).toHaveStyle({ maxHeight: "180px", overflow: "hidden" });
    expect(screen.getByText("Apply")).toBeInTheDocument();
    expect(screen.queryByText("Apply Filters")).not.toBeInTheDocument();
    expect(screen.getByText("+2 more")).toBeInTheDocument();
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it("matches snapshot", () => {
    const { container } = render(<GlassFilterPanel />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
