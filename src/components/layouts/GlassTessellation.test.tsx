"use client";
/**
 * GlassTessellation Component Tests
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
import { GlassTessellation } from "@/components/layouts/GlassTessellation";

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe("GlassTessellation", () => {
  /**
   * Smoke Test: Component renders without crashing
   */
  it("renders without crashing", () => {
    const { container } = render(<GlassTessellation />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it("has no accessibility violations", async () => {
    const { container } = render(<GlassTessellation />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  /**
   * ARIA Tests: Component has accessible name and description
   */
  describe("ARIA Attributes", () => {
    it("supports aria-label", () => {
      const { container } = render(
        <GlassTessellation aria-label="Test component" />
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

      const { container } = render(<GlassTessellation />);

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
      <GlassTessellation
        className="custom-class"
        data-testid="glasstessellation"
      />
    );

    const element =
      container.querySelector('[data-testid="glasstessellation"]') ||
      container.firstChild;

    expect(element).toHaveClass("custom-class");
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it("matches snapshot", () => {
    const { container } = render(<GlassTessellation />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("honors tile colors and readable foreground in compact mode", () => {
    const { container } = render(
      <GlassTessellation
        compact
        contained
        maxHeight={180}
        tileSize={42}
        tiles={[
          { id: "dark", shape: "hexagon", content: "D", color: "#07111f" },
          { id: "light", shape: "hexagon", content: "L", color: "#f8fafc" },
        ]}
        data-testid="tessellation"
      />
    );

    const root = container.querySelector(
      '[data-testid="tessellation"]'
    ) as HTMLElement;
    const paths = Array.from(container.querySelectorAll("path"));
    const labels = Array.from(
      container.querySelectorAll("foreignObject div")
    ) as HTMLElement[];

    expect(root).toHaveStyle({ height: "180px", maxHeight: "180px" });
    expect(paths.some((path) => path.getAttribute("fill") === "#07111f")).toBe(
      true
    );
    expect(paths.some((path) => path.getAttribute("fill") === "#f8fafc")).toBe(
      true
    );
    expect(
      labels.some((label) => label.style.color === "rgba(248, 250, 252, 0.96)")
    ).toBe(true);
    expect(
      labels.some((label) => label.style.color === "rgba(8, 13, 24, 0.92)")
    ).toBe(true);
  });
});
