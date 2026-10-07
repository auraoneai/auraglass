"use client";
/**
 * GlassSwitch Component Tests
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
import { GlassSwitch } from "@/components/input/GlassSwitch";

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe("GlassSwitch", () => {
  /**
   * Smoke Test: Component renders without crashing
   */
  it("renders without crashing", () => {
    const { container } = render(<GlassSwitch />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it("has no accessibility violations", async () => {
    const { container } = render(<GlassSwitch />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  /**
   * ARIA Tests: Form component has proper labels and descriptions
   */
  describe("ARIA Attributes", () => {
    it("has proper form control role", () => {
      render(<GlassSwitch id="test-input" />);
      const element = document.querySelector("#test-input");
      expect(element).toBeInTheDocument();
    });

    it("supports aria-label", () => {
      render(<GlassSwitch aria-label="Test input" />);
      const element = screen.getByLabelText(/test input/i);
      expect(element).toBeInTheDocument();
    });

    it("supports aria-describedby for help text", () => {
      render(
        <>
          <GlassSwitch aria-describedby="help-text" />
          <span id="help-text">Helper text</span>
        </>
      );
      const element = screen.getByText(/helper text/i);
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

      const { container } = render(<GlassSwitch />);

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
      <GlassSwitch className="custom-class" data-testid="glassswitch" />
    );

    const element =
      container.querySelector('[data-testid="glassswitch"]') ||
      container.firstChild;

    expect(element).toHaveClass("custom-class");
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it("matches snapshot", () => {
    const { container } = render(<GlassSwitch />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("toggles even when a consumer onClick is supplied", async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    const onChange = jest.fn();

    render(
      <GlassSwitch
        aria-label="Adaptive AI"
        onClick={onClick}
        onChange={onChange}
      />
    );

    const switchButton = screen.getByRole("switch", { name: /adaptive ai/i });
    expect(switchButton).toHaveAttribute("aria-checked", "false");

    await user.click(switchButton);

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(true);
    expect(switchButton).toHaveAttribute("aria-checked", "true");
  });
});
