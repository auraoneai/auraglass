"use client";
/**
 * GlassActionSheet Component Tests
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
import { GlassActionSheet } from "@/components/mobile/GlassActionSheet";

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe("GlassActionSheet", () => {
  /**
   * Smoke Test: Component renders without crashing
   */
  it("renders without crashing", () => {
    const { container } = render(
      <GlassActionSheet open={false} onClose={() => {}} actions={[]} />
    );
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it("has no accessibility violations", async () => {
    const { container } = render(
      <GlassActionSheet open={false} onClose={() => {}} actions={[]} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  /**
   * ARIA Tests: Component has accessible name and description
   */
  describe("ARIA Attributes", () => {
    it("supports aria-label", () => {
      const { container } = render(
        <GlassActionSheet
          open={true}
          onClose={() => {}}
          actions={[]}
          aria-label="Test component"
        />
      );
      // Component uses createPortal, so query document.body instead of container
      const element = document.body.querySelector('[aria-label="Test component"]');
      expect(element).toBeInTheDocument();
    });
  });

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it("accepts and renders with custom props", () => {
    const { container } = render(
      <GlassActionSheet
        open={true}
        onClose={() => {}}
        actions={[]}
        className="custom-class"
        data-testid="glassactionsheet"
      />
    );

    // Component uses createPortal, so query document.body instead of container
    const element =
      document.body.querySelector('[data-testid="glassactionsheet"]') ||
      document.body.querySelector('[role="dialog"]');

    expect(element).toHaveClass("custom-class");
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it("matches snapshot", () => {
    const { container } = render(
      <GlassActionSheet open={false} onClose={() => {}} actions={[]} />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
