"use client";
/**
 * GlassWipeSlider Component Tests
 *
 * Test Suite Coverage:
 * - ✅ Smoke test (renders without crashing)
 * - ✅ Props validation
 * - ✅ Accessibility (axe-core)
 * - ✅ ARIA attributes
 * - ✅ Focus management
 * - ⏭️  Reduced motion (not applicable)
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import userEvent from "@testing-library/user-event";
import { GlassWipeSlider } from "@/components/website-components/GlassWipeSlider";

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe("GlassWipeSlider", () => {
  /**
   * Smoke Test: Component renders without crashing
   */
  it("renders without crashing", () => {
    const { container } = render(
      <GlassWipeSlider
        beforeContent={<div>Before content</div>}
        afterContent={<div>After content</div>}
      />
    );
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it("has no accessibility violations", async () => {
    const { container } = render(
      <GlassWipeSlider
        beforeContent={<div>Before content</div>}
        afterContent={<div>After content</div>}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  /**
   * ARIA Tests: Component has accessible name and description
   */
  describe("ARIA Attributes", () => {
    it("supports aria-label", () => {
      const { container } = render(
        <GlassWipeSlider
          aria-label="Test component"
          beforeContent={<div>Before content</div>}
          afterContent={<div>After content</div>}
        />
      );
      const element = container.querySelector('[aria-label="Test component"]');
      expect(element).toBeInTheDocument();
    });
  });

  /**
   * Focus Management Tests
   */
  describe("Focus Management", () => {
    it("can receive focus", () => {
      render(
        <GlassWipeSlider
          beforeContent={<div>Before content</div>}
          afterContent={<div>After content</div>}
        />
      );
      const element =
        document.querySelector("[tabindex]") ||
        document.querySelector("button, a, input, select, textarea");

      if (element) {
        (element as HTMLElement).focus();
        expect(element).toHaveFocus();
      }
    });

    it("shows visible focus indicator", () => {
      const { container } = render(
        <GlassWipeSlider
          beforeContent={<div>Before content</div>}
          afterContent={<div>After content</div>}
        />
      );
      const element =
        container.querySelector("[tabindex]") ||
        container.querySelector("button, a, input, select, textarea");

      if (element) {
        (element as HTMLElement).focus();
        // Check for focus-visible class or focus styles
        const hasFocusIndicator =
          element.classList.contains("focus-visible") ||
          window.getComputedStyle(element).outline !== "none";
        expect(hasFocusIndicator).toBe(true);
      }
    });
  });

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it("accepts and renders with custom props", () => {
    const { container } = render(
      <GlassWipeSlider
        beforeContent={<div>Before content</div>}
        afterContent={<div>After content</div>}
        className="custom-class"
        data-testid="glasswipeslider"
      />
    );

    const element =
      container.querySelector('[data-testid="glasswipeslider"]') ||
      container.firstChild;

    expect(element).toHaveClass("custom-class");
  });

  it("renders compact slider inside a bounded preview surface", () => {
    const { container } = render(
      <GlassWipeSlider
        compact
        contained
        maxHeight={220}
        maxWidth={320}
        beforeContent={<div>Before content</div>}
        afterContent={<div>After content</div>}
        data-testid="glasswipeslider"
      />
    );

    const element =
      container.querySelector('[data-testid="glasswipeslider"]') ||
      container.firstChild;

    expect(element).toHaveStyle({
      height: "180px",
      maxHeight: "220px",
      maxWidth: "320px",
    });
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it("matches snapshot", () => {
    const { container } = render(
      <GlassWipeSlider
        beforeContent={<div>Before content</div>}
        afterContent={<div>After content</div>}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
