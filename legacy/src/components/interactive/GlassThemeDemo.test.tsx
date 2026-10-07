"use client";
/**
 * GlassThemeDemo Component Tests
 *
 * Test Suite Coverage:
 * - ✅ Smoke test (renders without crashing)
 * - ✅ Props validation
 * - ✅ Accessibility (axe-core)
 * - ✅ ARIA attributes
 * - ⏭️  Focus management (not applicable)
 * - ✅ Reduced motion support
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import userEvent from "@testing-library/user-event";
import { GlassThemeDemo } from "@/components/interactive/GlassThemeDemo";

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe("GlassThemeDemo", () => {
  /**
   * Smoke Test: Component renders without crashing
   */
  it("renders without crashing", () => {
    const { container } = render(<GlassThemeDemo />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it("has no accessibility violations", async () => {
    const { container } = render(<GlassThemeDemo />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  /**
   * ARIA Tests: Component has accessible name and description
   */
  describe("ARIA Attributes", () => {
    it("supports aria-label", () => {
      const { container } = render(
        <GlassThemeDemo aria-label="Test component" />
      );
      const element = container.querySelector('[aria-label="Test component"]');
      expect(element).toBeInTheDocument();
    });
  });

  /**
   * Reduced Motion Tests
   */
  describe("Reduced Motion Support", () => {
    it("respects prefers-reduced-motion", () => {
      // Mock matchMedia for reduced motion
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: jest.fn().mockImplementation((query) => ({
          matches: query === "(prefers-reduced-motion: reduce)",
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      const { container } = render(<GlassThemeDemo />);

      // Check that animations are disabled or reduced
      const animatedElements = container.querySelectorAll(
        '[class*="animate"], [class*="transition"]'
      );
      animatedElements.forEach((element) => {
        const styles = window.getComputedStyle(element);
        const animationDuration = parseFloat(styles.animationDuration || "0");
        const transitionDuration = parseFloat(styles.transitionDuration || "0");

        // Animations should be instant or very short (< 0.1s)
        expect(animationDuration).toBeLessThan(0.1);
        expect(transitionDuration).toBeLessThan(0.1);
      });
    });
  });

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it("accepts and renders with custom props", () => {
    const { container } = render(
      <GlassThemeDemo className="custom-class" data-testid="glassthemedemo" />
    );

    const element =
      container.querySelector('[data-testid="glassthemedemo"]') ||
      container.firstChild;

    expect(element).toHaveClass("custom-class");
  });

  it("renders a compact theme sample inside a bounded preview surface", () => {
    const { container } = render(
      <GlassThemeDemo compact contained maxHeight={220} data-testid="demo" />
    );

    const demo =
      container.querySelector('[data-testid="demo"]') || container.firstChild;
    expect(demo).toHaveStyle({ maxHeight: "220px" });
    expect(
      container.querySelector(".glass-theme-demo--compact")
    ).toBeInTheDocument();
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it("matches snapshot", () => {
    const { container } = render(<GlassThemeDemo />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
