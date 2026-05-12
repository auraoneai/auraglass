"use client";
/**
 * GlassVirtualTable Component Tests
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
import { GlassVirtualTable } from "@/components/data-display/GlassVirtualTable";

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe("GlassVirtualTable", () => {
  /**
   * Smoke Test: Component renders without crashing
   */
  it("renders without crashing", () => {
    const { container } = render(<GlassVirtualTable />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it("has no accessibility violations", async () => {
    const { container } = render(<GlassVirtualTable />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it("accepts and renders with custom props", () => {
    const { container } = render(
      <GlassVirtualTable
        className="custom-class"
        data-testid="glassvirtualtable"
      />
    );

    const element =
      container.querySelector('[data-testid="glassvirtualtable"]') ||
      container.firstChild;

    expect(element).toHaveClass("custom-class");
  });

  it("passes compact contained sizing through to the table surface", () => {
    const { container } = render(
      <GlassVirtualTable
        compact
        contained
        maxHeight={220}
        maxWidth={320}
        columns={[
          { id: "name", header: "Name", accessorKey: "name" },
          { id: "status", header: "Status", accessorKey: "status" },
        ]}
        rows={[{ id: "1", name: "Aurora", status: "Active" }]}
      />
    );

    const surface = container.querySelector(".glass-overflow-hidden");
    expect(surface).toHaveStyle({
      maxHeight: "220px",
      maxWidth: "320px",
    });
    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it("matches snapshot", () => {
    const { container } = render(<GlassVirtualTable />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
