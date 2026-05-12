"use client";
/**
 * GlassDataGrid Component Tests
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
import { render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import userEvent from "@testing-library/user-event";
import { GlassDataGrid } from "@/components/data-display/GlassDataGrid";

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe("GlassDataGrid", () => {
  const columns = [
    {
      id: "name",
      key: "name",
      label: "Name",
      header: "Name",
      accessorKey: "name",
      sortable: true,
    },
    {
      id: "status",
      key: "status",
      label: "Status",
      header: "Status",
      accessorKey: "status",
    },
  ];
  const data = [
    { id: "1", name: "Aurora", status: "Active" },
    { id: "2", name: "Prism", status: "Queued" },
  ];

  /**
   * Smoke Test: Component renders without crashing
   */
  it("renders without crashing", () => {
    const { container } = render(<GlassDataGrid />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it("has no accessibility violations", async () => {
    const { container } = render(<GlassDataGrid />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  /**
   * ARIA Tests: Component has accessible name and description
   */
  describe("ARIA Attributes", () => {
    it("supports aria-label", () => {
      const { getByRole } = render(
        <GlassDataGrid aria-label="Test component" />
      );
      const region = getByRole("region", { name: /test component/i });
      expect(region).toBeInTheDocument();
    });
  });

  /**
   * Focus Management Tests
   */
  describe("Focus Management", () => {
    it("can receive focus", () => {
      render(<GlassDataGrid />);
      const element =
        document.querySelector("[tabindex]") ||
        document.querySelector("button, a, input, select, textarea");

      if (element) {
        (element as HTMLElement).focus();
        expect(element).toHaveFocus();
      }
    });

    it("shows visible focus indicator", () => {
      const { container } = render(<GlassDataGrid />);
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
      <GlassDataGrid className="custom-class" data-testid="glassdatagrid" />
    );

    const element =
      container.querySelector('[data-testid="glassdatagrid"]') ||
      container.firstChild;

    expect(element).toHaveClass("custom-class");
  });

  it("renders typed column labels and key-based cell values", () => {
    render(<GlassDataGrid columns={columns} data={data} />);

    expect(
      screen.getByRole("columnheader", { name: "Column Name" })
    ).toBeInTheDocument();
    expect(screen.getByText("Aurora")).toBeInTheDocument();
    expect(screen.getByText("Queued")).toBeInTheDocument();
  });

  it("honors compact contained sizing without requiring website wrappers", () => {
    const { container } = render(
      <GlassDataGrid
        columns={columns}
        data={data}
        compact
        contained
        maxHeight={180}
        maxWidth={320}
      />
    );

    const surface = container.firstElementChild as HTMLElement;
    const table = screen.getByRole("table");

    expect(surface).toHaveStyle({
      maxHeight: "180px",
      maxWidth: "320px",
      overflowY: "auto",
    });
    expect(table).toBeInTheDocument();
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it("matches snapshot", () => {
    const { container } = render(<GlassDataGrid />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
