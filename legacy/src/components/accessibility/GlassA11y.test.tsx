"use client";
/**
 * GlassA11y Component Tests
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
import { GlassA11y } from "@/components/accessibility/GlassA11y";

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe("GlassA11y", () => {
  /**
   * Smoke Test: Component renders without crashing
   */
  it("renders without crashing", () => {
    const { container } = render(<GlassA11y />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it("has no accessibility violations", async () => {
    const { container } = render(<GlassA11y />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  /**
   * ARIA Tests: Component has accessible name and description
   */
  describe("ARIA Attributes", () => {
    it("supports aria-label", () => {
      const { container } = render(<GlassA11y aria-label="Test component" />);
      const element = container.querySelector('[aria-label="Test component"]');
      expect(element).toBeInTheDocument();
    });
  });

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it("accepts and renders with custom props", () => {
    const { container } = render(
      <GlassA11y className="custom-class" data-testid="glassa11y" />
    );

    const element =
      container.querySelector('[data-testid="glassa11y"]') ||
      container.firstChild;

    expect(element).toHaveClass("custom-class");
  });

  it("renders a bounded compact controller for previews", () => {
    const { container } = render(
      <GlassA11y
        compact
        contained
        defaultOpen
        maxHeight={220}
        maxWidth={320}
        data-testid="glassa11y"
      />
    );

    const root = screen.getByTestId("glassa11y");
    expect(root).toHaveStyle({ maxHeight: "220px", maxWidth: "320px" });
    expect(container.querySelector(".glass-top-11")).toBeInTheDocument();
    expect(
      container.querySelector('[data-glass-a11y-placement="popover"]')
    ).toBeInTheDocument();
  });

  it("keeps the open panel in document flow for relative mode", () => {
    render(
      <GlassA11y
        position="relative"
        defaultOpen
        data-testid="glassa11y-relative"
      />
    );

    const panel = document.querySelector<HTMLElement>(
      '[data-glass-a11y-panel][data-glass-a11y-placement="flow"]'
    );
    expect(panel).toBeInTheDocument();
    expect(panel).toHaveStyle({
      position: "relative",
      top: "auto",
      marginLeft: "auto",
    });
    expect(panel).toHaveClass("glass-mt-3", "glass-flex", "glass-flex-col");
    expect(
      panel?.querySelector("[data-glass-a11y-scroll-region]")
    ).toHaveStyle({ minHeight: 0 });
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it("matches snapshot", () => {
    const { container } = render(<GlassA11y />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
