"use client";
/**
 * HoudiniGlassCard Component Tests
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
import { HoudiniGlassCard } from "@/components/houdini/HoudiniGlassCard";
import { HoudiniGlassProvider } from "@/components/houdini/HoudiniGlassProvider";

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe("HoudiniGlassCard", () => {
  /**
   * Smoke Test: Component renders without crashing
   */
  it("renders without crashing", () => {
    const { container } = render(
      <HoudiniGlassProvider>
        <HoudiniGlassCard>
          <div>Test content</div>
        </HoudiniGlassCard>
      </HoudiniGlassProvider>
    );
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it("has no accessibility violations", async () => {
    const { container } = render(
      <HoudiniGlassProvider>
        <HoudiniGlassCard>
          <div>Test content</div>
        </HoudiniGlassCard>
      </HoudiniGlassProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it("accepts and renders with custom props", () => {
    const { container } = render(
      <HoudiniGlassProvider>
        <HoudiniGlassCard
          className="custom-class"
          data-testid="houdiniglasscard"
        >
          <div>Custom content</div>
        </HoudiniGlassCard>
      </HoudiniGlassProvider>
    );

    const element = container.querySelector('[data-testid="houdiniglasscard"]');
    expect(element).toBeInTheDocument();
    expect(element).toHaveClass("custom-class");
  });

  it("renders without a HoudiniGlassProvider", () => {
    render(
      <HoudiniGlassCard data-testid="standalone-houdini-card">
        <div>Standalone content</div>
      </HoudiniGlassCard>
    );

    expect(screen.getByTestId("standalone-houdini-card")).toBeInTheDocument();
    expect(screen.getByText("Standalone content")).toBeInTheDocument();
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it("matches snapshot", () => {
    const { container } = render(
      <HoudiniGlassProvider>
        <HoudiniGlassCard>
          <div>Test content</div>
        </HoudiniGlassCard>
      </HoudiniGlassProvider>
    );
    // Get the card element, not the provider wrapper
    const cardElement =
      container.querySelector("[data-glass-component]") ||
      container.firstChild?.firstChild;
    expect(cardElement).toMatchSnapshot();
  });
});
