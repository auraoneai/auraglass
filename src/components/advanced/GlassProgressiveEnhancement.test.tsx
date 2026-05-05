"use client";
/**
 * GlassProgressiveEnhancement Component Tests
 *
 * Test Suite Coverage:
 * - ✅ Smoke test (renders without crashing)
 * - ✅ Props validation
 * - ✅ Accessibility (axe-core)
 * - ⏭️  ARIA attributes (not applicable)
 * - ⏭️  Focus management (not applicable)
 * - ✅ Reduced motion support
 */

import React from "react";
import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import userEvent from "@testing-library/user-event";
import { GlassProgressiveEnhancement } from "@/components/advanced/GlassProgressiveEnhancement";

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe("GlassProgressiveEnhancement", () => {
  /**
   * Smoke Test: Component renders without crashing
   */
  it("renders without crashing", () => {
    const { container } = render(
      <GlassProgressiveEnhancement autoDetect={false} />
    );
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it("has no accessibility violations", async () => {
    const { container } = render(
      <GlassProgressiveEnhancement autoDetect={false} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
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

      const { container } = render(
        <GlassProgressiveEnhancement autoDetect={false} />
      );

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
      <GlassProgressiveEnhancement
        autoDetect={false}
        className="custom-class"
        data-testid="glassprogressiveenhancement"
      />
    );

    const element =
      container.querySelector('[data-testid="glassprogressiveenhancement"]') ||
      container.firstChild;

    expect(element).toHaveClass("custom-class");
  });

  /**
   * Debug Overlay: Renders quality/fps debug panel
   */
  it("applies the current quality tier to the document body", () => {
    render(
      <GlassProgressiveEnhancement autoDetect={false} forcedTier="basic" />
    );

    expect(document.body).toHaveClass("glass-tier-basic");
  });

  it("cancels the performance monitor frame on unmount", () => {
    const requestSpy = jest
      .spyOn(window, "requestAnimationFrame")
      .mockReturnValue(42);
    const cancelSpy = jest.spyOn(window, "cancelAnimationFrame");

    const { unmount } = render(
      <GlassProgressiveEnhancement autoDetect={false} monitorPerformance>
        <div>content</div>
      </GlassProgressiveEnhancement>
    );

    unmount();

    expect(requestSpy).toHaveBeenCalled();
    expect(cancelSpy).toHaveBeenCalledWith(42);

    requestSpy.mockRestore();
    cancelSpy.mockRestore();
  });
});
