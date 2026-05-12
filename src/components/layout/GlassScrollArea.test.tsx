"use client";
/**
 * GlassScrollArea Component Tests
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
import { GlassScrollArea } from "@/components/layout/GlassScrollArea";

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe("GlassScrollArea", () => {
  /**
   * Smoke Test: Component renders without crashing
   */
  it("renders without crashing", () => {
    const { container } = render(<GlassScrollArea />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it("has no accessibility violations", async () => {
    const { container } = render(<GlassScrollArea />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  /**
   * ARIA Tests: Component has accessible name and description
   */
  describe("ARIA Attributes", () => {
    it("supports aria-label", () => {
      const { container } = render(
        <GlassScrollArea aria-label="Test component" />
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

      const { container } = render(<GlassScrollArea />);

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
      <GlassScrollArea className="custom-class" data-testid="glassscrollarea" />
    );

    const element =
      container.querySelector('[data-testid="glassscrollarea"]') ||
      container.firstChild;

    expect(element).toHaveClass("custom-class");
  });

  it("bounds compact contained content without letting rows spill outside", () => {
    const { container } = render(
      <GlassScrollArea compact contained maxHeight={180}>
        {Array.from({ length: 12 }, (_, index) => (
          <div key={index}>Item {index + 1}</div>
        ))}
      </GlassScrollArea>
    );

    const scrollArea = container.querySelector(
      '[aria-label="Scrollable content area"]'
    ) as HTMLElement;
    expect(scrollArea).toHaveStyle({ maxHeight: "180px", height: "180px" });
    expect(scrollArea).toHaveClass("glass-overflow-hidden");
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it("matches snapshot", () => {
    const { container } = render(<GlassScrollArea />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
