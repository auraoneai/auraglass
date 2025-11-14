"use client";
/**
 * EnhancedGlassButton Component Tests
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
import { EnhancedGlassButton } from "@/components/button/EnhancedGlassButton";

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe("EnhancedGlassButton", () => {
  /**
   * Smoke Test: Component renders without crashing
   */
  it("renders without crashing", () => {
    const { container } = render(
      <EnhancedGlassButton>Test Button</EnhancedGlassButton>
    );
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it("has no accessibility violations", async () => {
    const { container } = render(
      <EnhancedGlassButton aria-label="Test Button">
        Click Me
      </EnhancedGlassButton>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it("accepts and renders with custom props", () => {
    const { container } = render(
      <EnhancedGlassButton
        className="custom-class"
        data-testid="enhancedglassbutton"
      >
        Custom Button
      </EnhancedGlassButton>
    );

    const element =
      container.querySelector('[data-testid="enhancedglassbutton"]') ||
      container.firstChild;

    expect(element).toHaveClass("custom-class");
  });

  /**
   * Debug Overlay: Renders animation debug info overlay
   */
  it("renders animation debug overlay", () => {
    const { container } = render(
      <EnhancedGlassButton>Snapshot Button</EnhancedGlassButton>
    );

    const debug = container.querySelector(
      ".animation-debug-info"
    ) as HTMLElement | null;

    expect(debug).toBeInTheDocument();
    expect(debug?.textContent || "").toContain("Emotion");
  });
});
