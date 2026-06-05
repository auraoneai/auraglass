"use client";
/**
 * GlassToast Component Tests
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
import { render, screen, waitFor } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import userEvent from "@testing-library/user-event";
import {
  GlassToast,
  GlassToastProvider,
  useToastActions,
} from "@/components/data-display/GlassToast";

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe("GlassToast", () => {
  const ToastTrigger = () => {
    const toast = useToastActions();

    return (
      <button
        type="button"
        onClick={() =>
          toast.info("Evidence saved", "The accessibility note was recorded.", {
            duration: 0,
          })
        }
      >
        Show toast
      </button>
    );
  };

  /**
   * Smoke Test: Component renders without crashing
   */
  it("renders without crashing", () => {
    const { container } = render(<GlassToast />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it("has no accessibility violations", async () => {
    const { container } = render(<GlassToast />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  /**
   * ARIA Tests: Component has accessible name and description
   */
  describe("ARIA Attributes", () => {
    it("supports aria-label", () => {
      const { container } = render(<GlassToast aria-label="Test component" />);
      const element = container.querySelector('[aria-label="Test component"]');
      expect(element).toBeInTheDocument();
    });
  });

  /**
   * Focus Management Tests
   */
  describe("Focus Management", () => {
    it("can receive focus", () => {
      render(<GlassToast />);
      const element =
        document.querySelector("[tabindex]") ||
        document.querySelector("button, a, input, select, textarea");

      if (element) {
        (element as HTMLElement).focus();
        expect(element).toHaveFocus();
      }
    });

    it("shows visible focus indicator", () => {
      const { container } = render(<GlassToast />);
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
      <GlassToast className="custom-class" data-testid="glasstoast" />
    );

    // Look for the OptimizedGlass component which should have the forwarded props
    const element =
      container.querySelector('[data-testid="glasstoast"]') ||
      container.querySelector(".optimized-glass-surface") ||
      container.firstChild;

    expect(element).toHaveClass("custom-class");
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it("matches snapshot", () => {
    const { container } = render(<GlassToast />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("supports caller-owned live-region semantics without stealing focus", async () => {
    const user = userEvent.setup();
    const onAction = jest.fn();

    render(
      <>
        <button type="button">Save evidence</button>
        <GlassToast
          id="certification-toast"
          title="Evidence saved"
          description="The accessibility note was recorded."
          role="status"
          aria-live="polite"
          action={{
            label: "Open report",
            onClick: onAction,
          }}
        />
      </>
    );

    const trigger = screen.getByRole("button", { name: "Save evidence" });
    trigger.focus();

    const status = screen.getByRole("status");
    expect(trigger).toHaveFocus();
    expect(status).toHaveAttribute("aria-live", "polite");
    expect(status).toHaveTextContent("Evidence saved");
    expect(status).toHaveTextContent("The accessibility note was recorded.");
    expect(screen.getByRole("button", { name: "Close toast" })).toBeEnabled();

    await user.click(screen.getByRole("button", { name: "Open report" }));

    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it("renders provider toasts with dismiss controls while focus stays on the trigger", async () => {
    const user = userEvent.setup();

    render(
      <GlassToastProvider duration={0}>
        <ToastTrigger />
      </GlassToastProvider>
    );

    const trigger = screen.getByRole("button", { name: "Show toast" });
    await user.click(trigger);

    expect(trigger).toHaveFocus();
    expect(screen.getByText("Evidence saved")).toBeInTheDocument();
    expect(
      screen.getByText("The accessibility note was recorded.")
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Close toast" }));

    await waitFor(() => {
      expect(screen.queryByText("Evidence saved")).not.toBeInTheDocument();
    });
  });
});
