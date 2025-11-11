"use client";
/**
 * GlassMobileNav Component Tests
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
import { GlassMobileNav } from "@/components/navigation/GlassMobileNav";

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe("GlassMobileNav", () => {
  /**
   * Smoke Test: Component renders without crashing
   */
  it("renders without crashing", () => {
    const { container } = render(<GlassMobileNav items={[]} />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it("has no accessibility violations", async () => {
    const { container } = render(<GlassMobileNav items={[]} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  /**
   * ARIA Tests: Navigation component has proper roles and labels
   */
  describe("ARIA Attributes", () => {
    it("has proper navigation role", () => {
      render(<GlassMobileNav items={[]} />);
      const nav =
        screen.queryByRole("navigation") ||
        screen.queryByRole("menu") ||
        screen.queryByRole("menubar");
      expect(nav).toBeInTheDocument();
    });

    it("has accessible name", () => {
      const { container } = render(
        <GlassMobileNav items={[]} aria-label="Main navigation" />
      );
      // aria-label is on the wrapper div, not the nav element
      const element = container.querySelector('[aria-label="Main navigation"]');
      expect(element).toBeInTheDocument();
    });
  });

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it("accepts and renders with custom props", () => {
    const { container } = render(
      <GlassMobileNav
        items={[]}
        className="custom-class"
        data-testid="glassmobilenav"
      />
    );

    const element =
      container.querySelector('[data-testid="glassmobilenav"]') ||
      container.firstChild;

    expect(element).toHaveClass("custom-class");
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it("matches snapshot", () => {
    const { container } = render(<GlassMobileNav items={[]} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
