'use client';
/**
 * GlassFormTable Component Tests
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
import { fireEvent, render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { GlassFormTable, GlassFormTableProps } from "@/components/input/GlassFormTable";

expect.extend(toHaveNoViolations);

interface Row {
  name: string;
  email: string;
}

const baseProps: GlassFormTableProps<Row> = {
  columns: [
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
  ],
  rows: [
    { name: "John Doe", email: "john@example.com" },
    { name: "Jane Smith", email: "jane@example.com" },
  ],
  onChange: jest.fn(),
};

const renderTable = (overrides: Partial<GlassFormTableProps<Row>> = {}) => {
  const props = { ...baseProps, ...overrides };
  return render(<GlassFormTable {...props} />);
};

describe("GlassFormTable", () => {
  beforeEach(() => {
    (baseProps.onChange as jest.Mock).mockClear();
  });

  it("renders provided columns and rows", () => {
    renderTable();
    expect(screen.getByRole("columnheader", { name: "Name" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Name for row 1" })).toHaveValue("John Doe");
  });

  it("invokes onChange when a cell is edited", () => {
    const onChange = jest.fn();
    renderTable({ onChange });

    const emailInput = screen.getByRole("textbox", { name: "Email for row 1" });
    fireEvent.change(emailInput, { target: { value: "updated@example.com" } });

    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenLastCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ email: "updated@example.com" }),
      ])
    );
  });

  it("adds a new row when the add button is pressed", () => {
    const onChange = jest.fn();
    renderTable({ onChange });

    fireEvent.click(screen.getByRole("button", { name: "Add new row" }));

    expect(onChange).toHaveBeenCalled();
    const nextRows = onChange.mock.calls[0][0];
    expect(nextRows).toHaveLength(baseProps.rows.length + 1);
  });

  it("removes a row when the remove action is triggered", () => {
    const onChange = jest.fn();
    renderTable({ onChange });

    fireEvent.click(screen.getByRole("button", { name: "Remove row 1" }));

    expect(onChange).toHaveBeenCalled();
    const nextRows = onChange.mock.calls[0][0];
    expect(nextRows).toHaveLength(baseProps.rows.length - 1);
  });

  it("applies custom className and data-testid", () => {
    renderTable({ className: "custom-class", "data-testid": "glass-form-table" });
    const wrapper = screen.getByTestId("glass-form-table");
    expect(wrapper).toHaveClass("custom-class");
  });

  it("has no accessibility violations", async () => {
    const { container } = renderTable();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});