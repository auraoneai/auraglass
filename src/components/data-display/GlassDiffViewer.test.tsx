"use client";
/**
 * GlassDiffViewer Component Tests
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
import { GlassDiffViewer } from "@/components/data-display/GlassDiffViewer";

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe("GlassDiffViewer", () => {
  /**
   * Smoke Test: Component renders without crashing
   */
  it("renders without crashing", () => {
    const { container } = render(<GlassDiffViewer />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it("has no accessibility violations", async () => {
    const { container } = render(<GlassDiffViewer />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it("accepts and renders with custom props", () => {
    const { container } = render(
      <GlassDiffViewer className="custom-class" data-testid="glassdiffviewer" />
    );

    const element =
      container.querySelector('[data-testid="glassdiffviewer"]') ||
      container.firstChild;

    expect(element).toHaveClass("custom-class");
  });

  it("renders semantic added and removed diff rows", () => {
    render(
      <GlassDiffViewer
        left={'const enabled = false;\nconst label = "Old";\n'}
        right={'const enabled = true;\nconst label = "New";\n'}
      />
    );

    expect(
      screen.getByRole("table", { name: /code diff/i })
    ).toBeInTheDocument();
    expect(screen.getAllByLabelText(/removed line/i).length).toBeGreaterThan(0);
    expect(screen.getAllByLabelText(/added line/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/enabled = true/)).toBeInTheDocument();
  });

  it("supports compact bounded rendering", () => {
    const { container } = render(
      <GlassDiffViewer
        compact
        maxHeight={180}
        left={"alpha\nbeta\n"}
        right={"alpha\ngamma\n"}
      />
    );

    const root = container.querySelector(
      "[data-glass-component]"
    ) as HTMLElement;
    expect(root).toHaveStyle({ maxHeight: "180px", overflow: "auto" });
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it("matches snapshot", () => {
    const { container } = render(<GlassDiffViewer />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
