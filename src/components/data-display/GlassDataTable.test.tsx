"use client";
/**
 * GlassDataTable Component Tests
 *
 * Test Suite Coverage:
 * - ✅ Smoke test (renders without crashing)
 * - ✅ Props validation
 * - ✅ Accessibility (axe-core)
 * - ✅ ARIA attributes
 * - ⏭️  Focus management (not applicable)
 * - ⏭️  Reduced motion (not applicable)
 */

import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import userEvent from "@testing-library/user-event";
import { GlassDataTable } from "@/components/data-display/GlassDataTable";

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe("GlassDataTable", () => {
  /**
   * Smoke Test: Component renders without crashing
   */
  it("renders without crashing", () => {
    const { container } = render(<GlassDataTable columns={[]} data={[]} />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it("has no accessibility violations", async () => {
    const { container } = render(<GlassDataTable columns={[]} data={[]} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  /**
   * ARIA Tests: Component has accessible name and description
   */
  describe("ARIA Attributes", () => {
    it("supports aria-label", () => {
      const { container } = render(
        <GlassDataTable columns={[]} data={[]} aria-label="Test component" />
      );
      const element = container.querySelector('[aria-label="Test component"]');
      expect(element).toBeInTheDocument();
    });
  });

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it("accepts and renders with custom props", () => {
    const { container } = render(
      <GlassDataTable
        columns={[]}
        data={[]}
        className="custom-class"
        data-testid="glassdatatable"
      />
    );

    const element =
      container.querySelector('[data-testid="glassdatatable"]') ||
      container.firstChild;

    expect(element).toHaveClass("custom-class");
  });

  it("does not sort a column that explicitly opts out of sorting", () => {
    render(
      <GlassDataTable
        columns={[
          {
            header: "Name",
            accessorKey: "name",
            sortable: false,
          },
        ]}
        data={[{ name: "Bravo" }, { name: "Alpha" }]}
        sortable
        pagination={false}
        searchable={false}
      />
    );

    const header = screen.getByText("Name").closest("th");
    fireEvent.click(screen.getByText("Name"));

    expect(header).toHaveAttribute("aria-sort", "none");
  });

  it("sorts selectable rows and reports selection changes", () => {
    const onSelectionChange = jest.fn();
    render(
      <GlassDataTable
        columns={[{ header: "Name", accessorKey: "name", id: "name" }]}
        data={[
          { id: "b", name: "Bravo" },
          { id: "a", name: "Alpha" },
        ]}
        getRowId={(row) => String(row.id)}
        selectable
        selectedRows={[]}
        onSelectionChange={onSelectionChange}
        searchable={false}
        pagination={false}
      />
    );

    fireEvent.click(screen.getByText("Name"));
    expect(screen.getByText("Name").closest("th")).toHaveAttribute(
      "aria-sort",
      "ascending"
    );

    const rowCheckboxes = screen.getAllByRole("checkbox");
    fireEvent.click(rowCheckboxes[1]);
    expect(onSelectionChange).toHaveBeenCalledWith(["a"]);
  });

  it("renders loading, empty, row actions, and pagination states", () => {
    const { rerender, unmount } = render(
      <GlassDataTable
        columns={[{ header: "Name", accessorKey: "name", id: "name" }]}
        data={[]}
        loading
        searchable={false}
      />
    );

    expect(screen.getByRole("status")).toHaveTextContent("Loading...");

    rerender(
      <GlassDataTable
        columns={[{ header: "Name", accessorKey: "name", id: "name" }]}
        data={[]}
        emptyMessage="No customers"
        actions={<button type="button">New customer</button>}
      />
    );

    expect(screen.getByText("No customers")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "New customer" })
    ).toBeInTheDocument();
    unmount();

    const paginated = render(
      <GlassDataTable
        columns={[{ header: "Name", accessorKey: "name", id: "name" }]}
        data={[{ name: "A" }, { name: "B" }, { name: "C" }]}
        initialPageSize={2}
        pageSizeOptions={[2]}
        searchable={false}
      />
    );

    expect(screen.getByRole("status")).toHaveTextContent("Showing 1 to 2 of 3");
    fireEvent.click(screen.getByRole("button", { name: "Next page" }));
    expect(screen.getByRole("status")).toHaveTextContent("Showing 3 to 3 of 3");
    paginated.unmount();
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it("matches snapshot", () => {
    const { container } = render(<GlassDataTable columns={[]} data={[]} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
