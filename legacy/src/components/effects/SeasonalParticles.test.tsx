"use client";
/**
 * SeasonalParticles Component Tests
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
import { SeasonalParticles } from "@/components/effects/SeasonalParticles";

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe("SeasonalParticles", () => {
  /**
   * Smoke Test: Component renders without crashing
   */
  it("renders without crashing", () => {
    const { container } = render(<SeasonalParticles />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it("has no accessibility violations", async () => {
    const { container } = render(<SeasonalParticles />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it("accepts and renders with custom props", () => {
    const { container } = render(
      <SeasonalParticles
        className="custom-class"
        data-testid="seasonalparticles"
      />
    );

    const element =
      container.querySelector('[data-testid="seasonalparticles"]') ||
      container.firstChild;

    expect(element).toHaveClass("custom-class");
  });

  /**
   * Fallback Behavior: Renders non-3D container when three effects are disabled
   */
  it("renders fallback container when three effects are disabled", () => {
    const { container } = render(
      <SeasonalParticles
        className="custom-class"
        data-testid="seasonalparticles"
      >
        <div>Content</div>
      </SeasonalParticles>
    );

    const element =
      (container.querySelector(
        '[data-testid="seasonalparticles"]'
      ) as HTMLElement | null) || (container.firstChild as HTMLElement | null);

    expect(element).toBeInTheDocument();
    expect(element).toHaveClass("seasonal-particles");
    expect(element).toHaveClass("custom-class");
  });
});
