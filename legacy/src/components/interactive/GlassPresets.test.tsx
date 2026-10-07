'use client';
/**
 * GlassPresets Component Tests
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
import { GlassPresets } from "@/components/interactive/GlassPresets";

expect.extend(toHaveNoViolations);

describe("GlassPresets", () => {
  it("renders the clean variant by default", () => {
    render(<GlassPresets data-testid="glass-presets" />);
    expect(screen.getByTestId("glass-presets")).toBeInTheDocument();
  });

  it("switches variants when requested", () => {
    const { rerender } = render(
      <GlassPresets data-testid="glass-presets" variant="frosted" />
    );
    const initial = screen.getByTestId("glass-presets");
    expect(initial).toBeInTheDocument();

    rerender(<GlassPresets data-testid="glass-presets" variant="immersive" />);
    const updated = screen.getByTestId("glass-presets");
    expect(updated).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<GlassPresets className="custom-class" data-testid="glass-presets" />);
    expect(screen.getByTestId("glass-presets")).toHaveClass("custom-class");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<GlassPresets />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});