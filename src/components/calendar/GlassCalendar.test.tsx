"use client";
/**
 * GlassCalendar Component Tests
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
import { GlassCalendar } from "@/components/calendar/GlassCalendar";

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe("GlassCalendar", () => {
  /**
   * Smoke Test: Component renders without crashing
   */
  it("renders without crashing", () => {
    const { container } = render(<GlassCalendar />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it("has no accessibility violations", async () => {
    const { container } = render(<GlassCalendar />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it("accepts and renders with custom props", () => {
    const { container } = render(
      <GlassCalendar className="custom-class" data-testid="glasscalendar" />
    );

    const element =
      container.querySelector('[data-testid="glasscalendar"]') ||
      container.firstChild;

    expect(element).toHaveClass("custom-class");
  });

  /**
   * Structure Test: Renders interactive date cells
   */
  it("renders interactive date cells", () => {
    render(<GlassCalendar />);

    const dateButtons = screen.getAllByRole("button", {
      name: /Select date/i,
    });

    expect(dateButtons.length).toBeGreaterThan(0);
  });
});
