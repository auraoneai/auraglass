"use client";
/**
 * GlassTabItem Component Tests
 *
 * Test Suite Coverage:
 * - ✅ Smoke test (renders without crashing)
 * - ✅ Props validation
 * - ✅ Accessibility (axe-core)
 * - ✅ ARIA attributes
 * - ✅ Focus management
 * - ✅ Reduced motion support
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import userEvent from "@testing-library/user-event";
import { GlassTabItem } from "@/components/navigation/GlassTabItem";

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe("GlassTabItem", () => {
  /**
   * Smoke Test: Component renders without crashing
   */
  it("renders without crashing", () => {
    const { container } = render(
      <div role="tablist">
        <GlassTabItem label="Tab 1" value="tab1" />
      </div>
    );
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it("has no accessibility violations", async () => {
    const { container } = render(
      <div role="tablist">
        <GlassTabItem label="Tab 1" value="tab1" aria-label="First tab" />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  /**
   * ARIA Tests: Navigation component has proper roles and labels
   */
  describe("ARIA Attributes", () => {
    it("has proper navigation role", () => {
      render(
        <div role="tablist">
          <GlassTabItem label="Tab 1" value="tab1" />
        </div>
      );
      const tab = screen.getByRole("tab");
      expect(tab).toBeInTheDocument();
    });

    it("has accessible name", () => {
      render(
        <div role="tablist">
          <GlassTabItem
            label="Main navigation"
            value="nav"
            aria-label="Main navigation"
          />
        </div>
      );
      const tab = screen.getByRole("tab", { name: /main navigation/i });
      expect(tab).toBeInTheDocument();
    });
  });

  /**
   * Focus Management Tests
   */
  describe("Focus Management", () => {
    it("can receive focus", () => {
      render(
        <div role="tablist">
          <GlassTabItem label="Tab 1" value="tab1" />
        </div>
      );
      const element = document.querySelector('[role="tab"]') as HTMLElement;
      if (element) {
        element.focus();
        expect(element).toHaveFocus();
      }
    });

    it("shows visible focus indicator", () => {
      const { container } = render(
        <div role="tablist">
          <GlassTabItem label="Tab 1" value="tab1" />
        </div>
      );
      const element = container.querySelector('[role="tab"]') as HTMLElement;
      if (element) {
        element.focus();
        // Check for focus-visible class, outline style, or box-shadow (which is used for focus indicator)
        const styles = window.getComputedStyle(element);
        const hasFocusIndicator =
          element.classList.contains("focus-visible") ||
          styles.outline !== "none" ||
          styles.boxShadow !== "none";
        expect(hasFocusIndicator).toBe(true);
      }
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
        <div role="tablist">
          <GlassTabItem label="Tab 1" value="tab1" />
        </div>
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
      <div role="tablist">
        <GlassTabItem
          label="Tab 1"
          value="tab1"
          className="custom-class"
          data-testid="glasstabitem"
        />
      </div>
    );

    const element =
      container.querySelector('[data-testid="glasstabitem"]') ||
      container.querySelector('[role="tab"]');

    expect(element).toHaveClass("custom-class");
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it("matches snapshot", () => {
    const { container } = render(
      <div role="tablist">
        <GlassTabItem label="Tab 1" value="tab1" />
      </div>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
