"use client";
/**
 * GlassChartWidget Component Tests
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
import { GlassChartWidget } from "@/components/dashboard/GlassChartWidget";

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe("GlassChartWidget", () => {
  /**
   * Smoke Test: Component renders without crashing
   */
  it("renders without crashing", () => {
    const { container } = render(<GlassChartWidget />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it("has no accessibility violations", async () => {
    const { container } = render(<GlassChartWidget />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it("accepts and renders with custom props", () => {
    const { container } = render(
      <GlassChartWidget
        className="custom-class"
        data-testid="glasschartwidget"
      />
    );

    const element =
      container.querySelector('[data-testid="glasschartwidget"]') ||
      container.firstChild;

    expect(element).toHaveClass("custom-class");
  });

  it("honors compact contained sizing without dropping header or children", () => {
    const { container } = render(
      <GlassChartWidget
        title="Sessions"
        subtitle="Last 16 hours"
        compact
        contained
        height={120}
        maxHeight={200}
        showRefresh
      >
        <svg aria-label="sessions sparkline" viewBox="0 0 100 40">
          <path d="M 0 30 L 50 10 L 100 28" />
        </svg>
      </GlassChartWidget>
    );

    const card = container.querySelector(
      '[data-compact="true"]'
    ) as HTMLElement;
    expect(card).toBeInTheDocument();
    expect(card).toHaveStyle({ maxHeight: "200px", overflow: "hidden" });
    expect(screen.getByText("Sessions")).toBeInTheDocument();
    expect(screen.getByText("Last 16 hours")).toBeInTheDocument();
    expect(screen.getByLabelText("sessions sparkline")).toBeInTheDocument();
    expect(container.querySelector(".card-content > div")).toHaveStyle({
      height: "120px",
      overflow: "hidden",
    });
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it("matches snapshot", () => {
    const { container } = render(<GlassChartWidget />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
