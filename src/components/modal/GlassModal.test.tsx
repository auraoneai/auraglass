"use client";
/**
 * GlassModal Component Tests
 *
 * Test Suite Coverage:
 * - ✅ Smoke test (renders without crashing)
 * - ✅ Props validation
 * - ✅ Accessibility (axe-core)
 * - ✅ ARIA attributes
 * - ✅ Focus management
 * - ⏭️  Reduced motion (not applicable)
 */

import React, { useEffect, useState } from "react";
import { render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import userEvent from "@testing-library/user-event";
import { GlassModal } from "@/components/modal/GlassModal";

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe("GlassModal", () => {
  afterEach(() => {
    document.body.removeAttribute("style");
  });

  /**
   * Smoke Test: Component renders without crashing
   */
  it("renders without crashing", () => {
    const { container } = render(<GlassModal />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it("has no accessibility violations", async () => {
    const { container } = render(<GlassModal />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  /**
   * ARIA Tests: Component has accessible name and description
   */
  describe("ARIA Attributes", () => {
    it("supports aria-label", () => {
      const { container } = render(<GlassModal aria-label="Test component" />);
      const element = container.querySelector('[aria-label="Test component"]');
      expect(element).toBeInTheDocument();
    });
  });

  /**
   * Focus Management Tests
   */
  describe("Focus Management", () => {
    it("can receive focus", () => {
      render(<GlassModal />);
      const element = screen.getByRole("button", { name: "Close modal" });

      element.focus();
      expect(element).toHaveFocus();
    });

    it("shows visible focus indicator", () => {
      const { container } = render(<GlassModal />);
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
      <GlassModal className="custom-class" data-testid="glassmodal" />
    );

    const element =
      container.querySelector('[data-testid="glassmodal"]') ||
      container.firstChild;

    expect(element).toHaveClass("custom-class");
  });

  it("preserves existing body scroll styles after close", () => {
    document.body.style.position = "relative";
    document.body.style.overflow = "auto";

    const { unmount } = render(<GlassModal lockScroll />);

    expect(document.body.style.position).toBe("fixed");
    expect(document.body.style.overflow).toBe("hidden");

    unmount();

    expect(document.body.style.position).toBe("relative");
    expect(document.body.style.overflow).toBe("auto");
  });

  it("renders contained mode without locking body scroll or using fixed overlay semantics", () => {
    document.body.style.position = "relative";
    document.body.style.overflow = "auto";

    const { container } = render(
      <div data-testid="card-host">
        <GlassModal
          contained
          compact
          title="Embedded preview"
          data-testid="contained-modal"
          style={{ width: 420, height: 260, maxHeight: 320 }}
        >
          Preview content
        </GlassModal>
      </div>
    );

    const root = screen.getByTestId("contained-modal");
    const dialog = screen.getByRole("dialog", { name: "Embedded preview" });
    const content = container.querySelector(
      '[data-consciousness-content="true"]'
    ) as HTMLElement;

    expect(document.body.style.position).toBe("relative");
    expect(document.body.style.overflow).toBe("auto");
    expect(root).toHaveAttribute("data-contained", "true");
    expect(root).toHaveClass("relative");
    expect(root).not.toHaveClass("fixed");
    expect(
      container.querySelector('[aria-hidden="true"]')
    ).not.toBeInTheDocument();
    expect(dialog).not.toHaveAttribute("aria-modal", "true");
    expect(content).toHaveClass("relative");
    expect(content).not.toHaveClass("fixed");
    expect(content).toHaveStyle({
      width: "420px",
      height: "260px",
      maxHeight: "320px",
    });
  });

  it("does not re-run open lifecycle updates on controlled parent rerenders", () => {
    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    function ControlledHarness() {
      const [tick, setTick] = useState(0);

      useEffect(() => {
        setTick((value) => value + 1);
        setTick((value) => value + 1);
      }, []);

      return (
        <GlassModal open={true} title={`Stable ${tick}`} onClose={() => {}}>
          Stable content
        </GlassModal>
      );
    }

    render(<ControlledHarness />);

    expect(screen.getByText("Stable content")).toBeInTheDocument();
    expect(
      consoleError.mock.calls.some((call) =>
        call.join(" ").includes("Maximum update depth exceeded")
      )
    ).toBe(false);

    consoleError.mockRestore();
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it("matches snapshot", () => {
    const { container } = render(<GlassModal />);
    const modal = container.firstChild as HTMLElement;

    // Remove dynamic data attributes for snapshot testing
    if (modal) {
      modal.removeAttribute("data-interaction-count");
      modal.querySelectorAll("[id]").forEach((element) => {
        element.removeAttribute("id");
      });
      const contentDiv = modal.querySelector("[data-time-spent]");
      if (contentDiv) {
        contentDiv.removeAttribute("data-time-spent");
        contentDiv.removeAttribute("data-modal-complexity");
      }
    }

    expect(modal).toMatchSnapshot();
  });
});
