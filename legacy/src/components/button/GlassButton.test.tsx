"use client";
/**
 * GlassButton Component Tests
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
import { GlassButton } from "@/components/button/GlassButton";

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe("GlassButton", () => {
  /**
   * Smoke Test: Component renders without crashing
   */
  it("renders without crashing", () => {
    const { container } = render(
      <GlassButton aria-label="Test button">Click me</GlassButton>
    );
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it("has no accessibility violations", async () => {
    const { container } = render(
      <GlassButton aria-label="Test button">Click me</GlassButton>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  /**
   * ARIA Tests: Button has proper role and accessible name
   */
  describe("ARIA Attributes", () => {
    it("has button role", () => {
      render(<GlassButton>Click me</GlassButton>);
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("has accessible name from content", () => {
      render(<GlassButton>Click me</GlassButton>);
      const button = screen.getByRole("button", { name: /click me/i });
      expect(button).toBeInTheDocument();
    });
  });

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it("accepts and renders with custom props", () => {
    const { container } = render(
      <GlassButton
        className="custom-class"
        data-testid="glassbutton"
        aria-label="Test button"
      >
        Click me
      </GlassButton>
    );

    const element =
      container.querySelector('[data-testid="glassbutton"]') ||
      container.firstChild;

    expect(element).toHaveClass("custom-class");
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it("matches snapshot", () => {
    const { container } = render(
      <GlassButton aria-label="Test button">Click me</GlassButton>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders the aurora variant with variant metadata and accessible state", () => {
    render(
      <GlassButton variant="aurora" aria-label="Start building">
        Start building
      </GlassButton>
    );

    const button = screen.getByRole("button", { name: /start building/i });
    expect(button).toHaveAttribute("data-button-variant", "aurora");
    expect(button).toHaveClass("glass-button-aurora");
    expect(button.querySelector(".glass-button-aurora-layer")).toBeTruthy();
  });
});
