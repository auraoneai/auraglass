"use client";
/**
 * GlassContextualEngine Component Tests
 *
 * Test Suite Coverage:
 * - ✅ Smoke test (renders without crashing)
 * - ✅ Props validation
 * - ✅ Accessibility (axe-core)
 * - ⏭️  ARIA attributes (not applicable)
 * - ⏭️  Focus management (not applicable)
 * - ⏭️  Reduced motion (not applicable)
 */

import React from "react";
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import userEvent from "@testing-library/user-event";
import {
  GlassContextualDashboard,
  GlassContextualEngine,
  GlassContextualEngineProvider,
} from "@/components/advanced/GlassContextualEngine";

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe("GlassContextualEngine", () => {
  /**
   * Smoke Test: Component renders without crashing
   */
  it("renders without crashing", () => {
    const { container } = render(<GlassContextualEngine />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it("has no accessibility violations", async () => {
    const { container } = render(<GlassContextualEngine />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it("accepts and renders with custom props", () => {
    const { container } = render(
      <GlassContextualEngine
        className="custom-class"
        data-testid="glasscontextualengine"
      />
    );

    const element =
      container.querySelector('[data-testid="glasscontextualengine"]') ||
      container.firstChild;

    expect(element).toHaveClass("custom-class");
  });

  it("portals the dashboard to the viewport and exposes a working close affordance", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <div style={{ transform: "scale(0.8)" }}>
        <GlassContextualEngineProvider>
          <GlassContextualDashboard />
        </GlassContextualEngineProvider>
      </div>
    );

    await user.click(
      screen.getByRole("button", {
        name: "Toggle contextual engine dashboard",
      })
    );

    const dialog = await screen.findByRole("dialog", {
      name: "Contextual engine dashboard",
    });
    expect(dialog).toHaveClass("glass-fixed");
    expect(container).not.toContainElement(dialog);
    expect(dialog).toHaveStyle({
      boxSizing: "border-box",
      width: "min(20rem, calc(100vw - 2rem))",
      maxHeight: "calc(100dvh - 6rem)",
    });

    const closeButton = screen.getByRole("button", {
      name: "Close contextual engine dashboard",
    });
    expect(closeButton).toHaveClass("glass-touch-target");
    await user.click(closeButton);
    await waitForElementToBeRemoved(dialog);
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it("matches snapshot", () => {
    const { container } = render(<GlassContextualEngine />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
