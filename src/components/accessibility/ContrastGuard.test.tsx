"use client";
/**
 * ContrastGuard Component Tests
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
import { ContrastGuard } from "@/components/accessibility/ContrastGuard";

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe("ContrastGuard", () => {
  /**
   * Smoke Test: Component renders without crashing
   */
  it("renders without crashing", () => {
    const { container } = render(<ContrastGuard />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it("has no accessibility violations", async () => {
    const { container } = render(<ContrastGuard />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it("accepts and renders with custom props", () => {
    const { container } = render(
      <ContrastGuard className="custom-class" data-testid="contrastguard" />
    );

    const element =
      container.querySelector('[data-testid="contrastguard"]') ||
      container.firstChild;

    expect(element).toHaveClass("custom-class");
  });

  it("renders a package-owned demo backdrop for previews", () => {
    render(
      <ContrastGuard data-testid="contrastguard" demoBackdrop="busy-light">
        Readable foreground
      </ContrastGuard>
    );

    const element = screen.getByTestId("contrastguard");
    expect(element).toHaveAttribute("data-demo-backdrop", "busy-light");
    expect(element).toHaveStyle({ display: "inline-flex" });
  });

  it("can render a visible contrast indicator", () => {
    render(<ContrastGuard showIndicator>Guarded text</ContrastGuard>);

    expect(screen.getByText(/AA|Check/)).toBeInTheDocument();
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it("matches snapshot", () => {
    const { container } = render(<ContrastGuard />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
