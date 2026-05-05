"use client";
/**
 * GlassDialog Component Tests
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
import { GlassDialog } from "@/components/modal/GlassDialog";

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe("GlassDialog", () => {
  afterEach(() => {
    document.body.removeAttribute("style");
  });

  /**
   * Smoke Test: Component renders without crashing
   */
  it("renders without crashing", () => {
    const { container } = render(<GlassDialog />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it("has no accessibility violations", async () => {
    const { container } = render(<GlassDialog />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  /**
   * ARIA Tests: Component has accessible name and description
   */
  describe("ARIA Attributes", () => {
    it("supports aria-label", () => {
      const { container } = render(
        <GlassDialog aria-label="Test component" open={true} />
      );
      const element = container.querySelector('[aria-label="Test component"]');
      expect(element).toBeInTheDocument();
    });
  });

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it("accepts and renders with custom props", () => {
    const { container } = render(
      <GlassDialog
        open={true}
        className="custom-class"
        data-testid="glassdialog"
      />
    );

    const element =
      container.querySelector('[data-testid="glassdialog"]') ||
      container.firstChild;

    expect(element).toHaveClass("custom-class");
  });

  it("uses inline z-index so custom overlay layers are not purged", () => {
    const { container } = render(<GlassDialog open={true} zIndex={240} />);
    const dialog = container.querySelector('[role="dialog"]') as HTMLElement;

    expect(dialog).toHaveStyle({ zIndex: "240" });
    expect(dialog.className).not.toContain("z-240");
  });

  it("calls close handlers when Escape is pressed", async () => {
    const user = userEvent.setup();
    const onOpenChange = jest.fn();
    const onClose = jest.fn();

    render(
      <GlassDialog open={true} onOpenChange={onOpenChange} onClose={onClose} />
    );

    await user.keyboard("{Escape}");

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it("matches snapshot", () => {
    const { container } = render(<GlassDialog />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
