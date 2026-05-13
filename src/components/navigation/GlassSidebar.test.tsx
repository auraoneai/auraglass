"use client";
/**
 * GlassSidebar Component Tests
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
import { GlassSidebar } from "@/components/navigation/GlassSidebar";

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe("GlassSidebar", () => {
  /**
   * Smoke Test: Component renders without crashing
   */
  it("renders without crashing", () => {
    const { container } = render(<GlassSidebar items={[]} />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it("has no accessibility violations", async () => {
    const { container } = render(<GlassSidebar items={[]} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  /**
   * ARIA Tests: Navigation component has proper roles and labels
   */
  describe("ARIA Attributes", () => {
    it("has proper navigation role", () => {
      render(<GlassSidebar items={[]} />);
      const nav =
        screen.queryByRole("navigation") ||
        screen.queryByRole("menu") ||
        screen.queryByRole("menubar");
      expect(nav).toBeInTheDocument();
    });

    it("has accessible name", () => {
      render(<GlassSidebar items={[]} aria-label="Main navigation" />);
      const nav = screen.getByRole("navigation", { name: /main navigation/i });
      expect(nav).toBeInTheDocument();
    });
  });

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it("accepts and renders with custom props", () => {
    const { container } = render(
      <GlassSidebar
        items={[]}
        className="custom-class"
        data-testid="glasssidebar"
      />
    );

    const element =
      container.querySelector('[data-testid="glasssidebar"]') ||
      container.firstChild;

    expect(element).toHaveClass("custom-class");
  });

  it("renders overlay variant as a contained bounded sidebar", () => {
    const { container } = render(
      <GlassSidebar
        items={[{ id: "home", label: "Home" }]}
        variant="overlay"
        contained
        height={320}
        maxHeight={360}
        data-testid="bounded-sidebar"
      />
    );

    const sidebar = container.querySelector(
      '[data-testid="bounded-sidebar"]'
    ) as HTMLElement;
    const toggle = screen.getByRole("button", { name: /collapse sidebar/i });

    expect(sidebar).toBeInTheDocument();
    expect(sidebar).toHaveStyle({ height: "320px", maxHeight: "360px" });
    expect(sidebar).toHaveClass("glass-contained");
    expect(toggle).toBeInTheDocument();
    expect(sidebar.contains(toggle)).toBe(true);
    expect(document.body.querySelector('[class*="glass-inset-0"]')).toBeNull();
    expect(document.body.querySelector('[class*="glass-fixed"]')).toBeNull();
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it("matches snapshot", () => {
    const { container } = render(<GlassSidebar items={[]} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
