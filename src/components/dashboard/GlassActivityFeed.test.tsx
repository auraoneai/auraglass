"use client";
/**
 * GlassActivityFeed Component Tests
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
import { GlassActivityFeed } from "@/components/dashboard/GlassActivityFeed";

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe("GlassActivityFeed", () => {
  /**
   * Smoke Test: Component renders without crashing
   */
  it("renders without crashing", () => {
    const { container } = render(<GlassActivityFeed />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it("has no accessibility violations", async () => {
    const { container } = render(<GlassActivityFeed />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it("accepts and renders with custom props", () => {
    const { container } = render(
      <GlassActivityFeed
        className="custom-class"
        data-testid="glassactivityfeed"
      />
    );

    const element =
      container.querySelector('[data-testid="glassactivityfeed"]') ||
      container.firstChild;

    expect(element).toHaveClass("custom-class");
  });

  it("caps compact contained feeds to two visible activities", () => {
    const now = new Date();
    render(
      <GlassActivityFeed
        compact
        contained
        maxHeight={180}
        data-testid="compact-activity-feed"
        activities={[
          {
            id: "1",
            type: "success",
            title: "Deployment finished",
            timestamp: now,
          },
          { id: "2", type: "user", title: "Aurora joined", timestamp: now },
          { id: "3", type: "info", title: "Report generated", timestamp: now },
        ]}
      />
    );

    const root = screen.getByTestId("compact-activity-feed");
    expect(root).toHaveStyle({ maxHeight: "180px", overflow: "hidden" });
    expect(screen.getByText("Deployment finished")).toBeInTheDocument();
    expect(screen.getByText("Aurora joined")).toBeInTheDocument();
    expect(screen.queryByText("Report generated")).not.toBeInTheDocument();
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it("matches snapshot", () => {
    const { container } = render(<GlassActivityFeed />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
