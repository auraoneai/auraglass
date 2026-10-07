"use client";
/**
 * RippleButton Component Tests
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
import RippleButton from "@/components/visual-feedback/RippleButton";

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe("RippleButton", () => {
  /**
   * Smoke Test: Component renders without crashing
   */
  it("renders without crashing", () => {
    const { container } = render(
      <RippleButton aria-label="Button">Click me</RippleButton>
    );
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it("has no accessibility violations", async () => {
    const { container } = render(
      <RippleButton aria-label="Button">Click me</RippleButton>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  /**
   * ARIA Tests: Button has proper role and accessible name
   */
  describe("ARIA Attributes", () => {
    it("has button role", () => {
      render(<RippleButton>Click me</RippleButton>);
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("has accessible name from content", () => {
      render(<RippleButton>Click me</RippleButton>);
      const button = screen.getByRole("button", { name: /click me/i });
      expect(button).toBeInTheDocument();
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

      const { container } = render(
        <RippleButton aria-label="Button">Click me</RippleButton>
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
      <RippleButton
        className="custom-class"
        data-testid="ripplebutton"
        aria-label="Button"
      >
        Click me
      </RippleButton>
    );

    const element =
      container.querySelector('[data-testid="ripplebutton"]') ||
      container.firstChild;

    expect(element).toHaveClass("custom-class");
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it("matches snapshot", () => {
    const { container } = render(
      <RippleButton aria-label="Button">Click me</RippleButton>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
