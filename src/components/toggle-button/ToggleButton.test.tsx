"use client";
/**
 * ToggleButton Component Tests
 *
 * Test Suite Coverage:
 * - ✅ Smoke test (renders without crashing)
 * - ✅ Props validation
 * - ✅ Accessibility (axe-core)
 * - ✅ ARIA attributes
 * - ⏭️  Focus management (not applicable)
 * - ⏭️  Reduced motion (not applicable)
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import userEvent from "@testing-library/user-event";
import { ToggleButton } from "@/components/toggle-button/ToggleButton";

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe("ToggleButton", () => {
  /**
   * Smoke Test: Component renders without crashing
   */
  it("renders without crashing", () => {
    const { container } = render(<ToggleButton>Click me</ToggleButton>);
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it("has no accessibility violations", async () => {
    const { container } = render(<ToggleButton>Click me</ToggleButton>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  /**
   * ARIA Tests: Button has proper role and accessible name
   */
  describe("ARIA Attributes", () => {
    it("has button role", () => {
      render(<ToggleButton>Click me</ToggleButton>);
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("has accessible name from content", () => {
      render(<ToggleButton>Click me</ToggleButton>);
      const button = screen.getByRole("button", { name: /click me/i });
      expect(button).toBeInTheDocument();
    });
  });

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it("accepts and renders with custom props", () => {
    const { container } = render(
      <ToggleButton className="custom-class" data-testid="togglebutton">
        Click me
      </ToggleButton>
    );

    const element =
      container.querySelector('[data-testid="togglebutton"]') ||
      container.firstChild;

    expect(element).toHaveClass("custom-class");
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it("matches snapshot", () => {
    const { container } = render(<ToggleButton>Click me</ToggleButton>);
    expect(container.firstChild).toMatchSnapshot();
  });
});
