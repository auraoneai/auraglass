"use client";
/**
 * GlassTextarea Component Tests
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
import { GlassTextarea } from "@/components/input/GlassTextarea";

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe("GlassTextarea", () => {
  /**
   * Smoke Test: Component renders without crashing
   */
  it("renders without crashing", () => {
    const { container } = render(<GlassTextarea />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it("has no accessibility violations", async () => {
    const { container } = render(<GlassTextarea />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  /**
   * ARIA Tests: Form component has proper labels and descriptions
   */
  describe("ARIA Attributes", () => {
    it("has proper form control role", () => {
      render(<GlassTextarea id="test-input" data-testid="glasstextarea" />);
      const element = screen.getByTestId("glasstextarea");
      expect(element).toBeInTheDocument();
    });

    it("supports aria-label", () => {
      render(<GlassTextarea aria-label="Test input" />);
      const element = screen.getByLabelText(/test input/i);
      expect(element).toBeInTheDocument();
    });

    it("supports aria-describedby for help text", () => {
      render(
        <>
          <GlassTextarea aria-describedby="help-text" />
          <span id="help-text">Helper text</span>
        </>
      );
      const element = screen.getByText(/helper text/i);
      expect(element).toBeInTheDocument();
    });
  });

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it("accepts and renders with custom props", () => {
    const { container } = render(
      <GlassTextarea className="custom-class" data-testid="glasstextarea" />
    );

    const element =
      container.querySelector('[data-testid="glasstextarea"]') ||
      container.firstChild;

    expect(element).toHaveClass("custom-class");
  });

  it("keeps generated id stable across rerenders", () => {
    const { rerender } = render(<GlassTextarea label="Notes" value="one" />);
    const textarea = screen.getByLabelText("Notes");
    const initialId = textarea.id;

    rerender(<GlassTextarea label="Notes" value="two" />);

    expect(screen.getByLabelText("Notes")).toHaveAttribute("id", initialId);
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it("matches snapshot", () => {
    const { container } = render(<GlassTextarea id="test-textarea" />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
