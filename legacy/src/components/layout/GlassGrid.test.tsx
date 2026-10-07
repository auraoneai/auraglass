"use client";
/**
 * GlassGrid Component Tests
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
import { GlassGrid, GlassGridItem } from "@/components/layout/GlassGrid";

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe("GlassGrid", () => {
  /**
   * Smoke Test: Component renders without crashing
   */
  it("renders without crashing", () => {
    const { container } = render(<GlassGrid />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it("has no accessibility violations", async () => {
    const { container } = render(<GlassGrid />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  /**
   * ARIA Tests: Component has accessible name and description
   */
  describe("ARIA Attributes", () => {
    it("supports aria-label", () => {
      const { container } = render(<GlassGrid aria-label="Test component" />);
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

      const { container } = render(<GlassGrid />);

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
      <GlassGrid className="custom-class" data-testid="glassgrid" />
    );

    const element =
      container.querySelector('[data-testid="glassgrid"]') ||
      container.firstChild;

    expect(element).toHaveClass("custom-class");
  });

  it("emits package-owned grid layout styles without requiring Tailwind utilities", () => {
    render(
      <GlassGrid cols={12} gap="md" data-testid="grid">
        <GlassGridItem colSpan={4} data-testid="item">
          Item
        </GlassGridItem>
      </GlassGrid>
    );

    const grid = screen.getByTestId("grid");
    const item = screen.getByTestId("item");

    expect(grid).toHaveStyle({
      display: "grid",
      gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
    });
    expect(item).toHaveStyle({
      gridColumn: "span 4 / span 4",
      minWidth: "0",
    });
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it("matches snapshot", () => {
    const { container } = render(<GlassGrid />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
