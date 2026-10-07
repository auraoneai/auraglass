"use client";
/**
 * GlassDrawer Component Tests
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
import { GlassDrawer } from "@/components/modal/GlassDrawer";

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe("GlassDrawer", () => {
  afterEach(() => {
    document.body.removeAttribute("style");
  });

  /**
   * Smoke Test: Component renders without crashing
   */
  it("renders without crashing", () => {
    const { container } = render(<GlassDrawer />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it("has no accessibility violations", async () => {
    const { container } = render(<GlassDrawer />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  /**
   * ARIA Tests: Component has accessible name and description
   */
  describe("ARIA Attributes", () => {
    it("supports aria-label", () => {
      const { container } = render(<GlassDrawer aria-label="Test component" />);
      const element = container.querySelector('[aria-label="Test component"]');
      expect(element).toBeInTheDocument();
    });
  });

  /**
   * Focus Management Tests
   */
  describe("Focus Management", () => {
    it("can receive focus", () => {
      render(<GlassDrawer />);
      const element =
        document.querySelector("[tabindex]") ||
        document.querySelector("button, a, input, select, textarea");

      if (element) {
        (element as HTMLElement).focus();
        expect(element).toHaveFocus();
      }
    });

    it("shows visible focus indicator", () => {
      const { container } = render(<GlassDrawer />);
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
      <GlassDrawer className="custom-class" data-testid="glassdrawer" />
    );

    const element =
      container.querySelector('[data-testid="glassdrawer"]') ||
      container.firstChild;

    expect(element).toHaveClass("custom-class");
  });

  it("uses inline z-index so custom overlay layers are not purged", () => {
    const { container } = render(<GlassDrawer zIndex={240} />);
    const drawer = container.querySelector('[role="dialog"]') as HTMLElement;

    expect(drawer).toHaveStyle({ zIndex: "240" });
    expect(drawer.className).not.toContain("z-240");
  });

  it("preserves existing body overflow after close", () => {
    document.body.style.overflow = "auto";

    const { unmount } = render(<GlassDrawer />);

    expect(document.body.style.overflow).toBe("hidden");

    unmount();

    expect(document.body.style.overflow).toBe("auto");
  });

  it("renders contained mode without locking body scroll or using fixed overlay semantics", () => {
    document.body.style.overflow = "auto";

    const { container } = render(
      <div data-testid="card-host">
        <GlassDrawer
          contained
          compact
          title="Embedded drawer"
          data-testid="contained-drawer"
          style={{ width: 360, height: 280, maxHeight: 340 }}
        >
          Drawer preview content
        </GlassDrawer>
      </div>
    );

    const root = screen.getByTestId("contained-drawer");
    const content = container.querySelector(
      '[data-consciousness-content="true"]'
    ) as HTMLElement;

    expect(document.body.style.overflow).toBe("auto");
    expect(root).toHaveAttribute("data-contained", "true");
    expect(root).toHaveClass("relative");
    expect(root).not.toHaveClass("fixed");
    expect(root).toHaveAttribute("aria-modal", "false");
    expect(
      container.querySelector('[data-consciousness-backdrop="true"]')
    ).not.toBeInTheDocument();
    expect(content).toHaveClass("relative");
    expect(content).not.toHaveClass("absolute");
    expect(content).not.toHaveClass("fixed");
    expect(content).toHaveStyle({
      width: "360px",
      height: "280px",
      maxHeight: "340px",
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
        <GlassDrawer open={true} title={`Stable ${tick}`} onClose={() => {}}>
          Stable content
        </GlassDrawer>
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
    const { container } = render(<GlassDrawer />);
    const drawer = container.firstChild as HTMLElement;

    // Remove dynamic data attributes for snapshot testing
    if (drawer) {
      drawer.removeAttribute("data-interaction-count");
      drawer.querySelectorAll("[id]").forEach((element) => {
        element.removeAttribute("id");
      });
      const contentDiv = drawer.querySelector("[data-time-spent]");
      if (contentDiv) {
        contentDiv.removeAttribute("data-time-spent");
        contentDiv.removeAttribute("data-modal-complexity");
      }
    }

    expect(drawer).toMatchSnapshot();
  });
});
