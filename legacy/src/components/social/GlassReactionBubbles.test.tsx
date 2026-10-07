"use client";
/**
 * GlassReactionBubbles Component Tests
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
import { render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import userEvent from "@testing-library/user-event";
import { GlassReactionBubbles } from "@/components/social/GlassReactionBubbles";

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe("GlassReactionBubbles", () => {
  /**
   * Smoke Test: Component renders without crashing
   */
  it("renders without crashing", () => {
    const { container } = render(<GlassReactionBubbles />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it("has no accessibility violations", async () => {
    const { container } = render(<GlassReactionBubbles />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it("accepts and renders with custom props", () => {
    const { container } = render(
      <GlassReactionBubbles
        className="custom-class"
        data-testid="glassreactionbubbles"
      />
    );

    const element =
      container.querySelector('[data-testid="glassreactionbubbles"]') ||
      container.firstChild;

    expect(element).toHaveClass("custom-class");
  });

  it("renders a visible package-owned demo state by default", () => {
    render(<GlassReactionBubbles compact />);

    expect(screen.getByText("🎉")).toBeInTheDocument();
    expect(screen.getByText("✨")).toBeInTheDocument();
    expect(screen.getByText("💎")).toBeInTheDocument();
  });

  it("can render an intentionally idle empty field", () => {
    const { queryByText } = render(
      <GlassReactionBubbles demoState="idle" compact />
    );

    expect(queryByText("🎉")).not.toBeInTheDocument();
    expect(queryByText("✨")).not.toBeInTheDocument();
    expect(queryByText("💎")).not.toBeInTheDocument();
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it("matches snapshot", () => {
    const { container } = render(<GlassReactionBubbles />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
