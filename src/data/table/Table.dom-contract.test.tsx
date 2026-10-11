/** @jest-environment jsdom */
// SURF-159 / REQ-SURF-75: inline snapshot of the table's data-ag-part set for
// the base, loading and empty variants. This snapshot IS the DOM contract:
// any change is a C-B (breaking) diff for the L3 change-class lane.
// Parts owned by composed CMP components (Checkbox, Skeleton, IconButton —
// root/hit-area/indicator/icon/…) belong to those components' contracts and
// are excluded; only `table-*` parts are frozen here.
import { describe, expect, it } from "@jest/globals";
import { render } from "@testing-library/react";
import * as React from "react";
import { Table } from "./Table";
import type { TableColumnDef } from "./types";

// jsdom lacks PointerEvent; BU Checkbox dispatches it on activation.
if (typeof window.PointerEvent !== "function") {
  (window as unknown as { PointerEvent: typeof MouseEvent }).PointerEvent =
    MouseEvent;
}

type Row = { id: string; name: string; qty: number };
const DATA: Row[] = [{ id: "a", name: "Atlas", qty: 3 }];
const COLS: TableColumnDef<Row>[] = [
  { accessorKey: "name", header: "Name", meta: { headerLabel: "Name" } },
  {
    accessorKey: "qty",
    header: "Qty",
    meta: { headerLabel: "Qty", numeric: true },
  },
];

/** The 13 parts REQ-SURF-75 freezes. */
const SPEC_PARTS = [
  "table-root",
  "table-scroller",
  "table-header",
  "table-header-cell",
  "table-sort-trigger",
  "table-resize-handle",
  "table-body",
  "table-row",
  "table-cell",
  "table-selection-cell",
  "table-empty",
  "table-loading",
  "table-column-menu",
];

const tableParts = (container: HTMLElement) =>
  [...container.querySelectorAll("[data-ag-part]")]
    .map((el) => el.getAttribute("data-ag-part")!)
    .filter((p) => p.startsWith("table-"));

function renderVariant(props: Partial<Parameters<typeof Table<Row>>[0]>) {
  return render(
    <Table
      data={DATA}
      columns={COLS}
      getRowId={(r) => r.id}
      caption="Orders"
      selectionMode="multiple"
      enableColumnResizing
      enableColumnReordering
      {...props}
    />
  ).container;
}

describe("Table DOM contract (SURF-159, REQ-SURF-75)", () => {
  it("base: part attributes match the frozen set", () => {
    expect(tableParts(renderVariant({}))).toMatchInlineSnapshot(`
      [
        "table-root",
        "table-scroller",
        "table-header",
        "table-header-cell",
        "table-header-cell",
        "table-sort-trigger",
        "table-column-menu",
        "table-resize-handle",
        "table-header-cell",
        "table-sort-trigger",
        "table-column-menu",
        "table-resize-handle",
        "table-body",
        "table-row",
        "table-selection-cell",
        "table-cell",
        "table-cell",
      ]
    `);
  });

  it("loading: rows keep their parts, 8 table-loading rows follow", () => {
    expect(tableParts(renderVariant({ loading: true }))).toMatchInlineSnapshot(`
      [
        "table-root",
        "table-scroller",
        "table-header",
        "table-header-cell",
        "table-header-cell",
        "table-sort-trigger",
        "table-column-menu",
        "table-resize-handle",
        "table-header-cell",
        "table-sort-trigger",
        "table-column-menu",
        "table-resize-handle",
        "table-body",
        "table-row",
        "table-selection-cell",
        "table-cell",
        "table-cell",
        "table-loading",
        "table-cell",
        "table-cell",
        "table-cell",
        "table-loading",
        "table-cell",
        "table-cell",
        "table-cell",
        "table-loading",
        "table-cell",
        "table-cell",
        "table-cell",
        "table-loading",
        "table-cell",
        "table-cell",
        "table-cell",
        "table-loading",
        "table-cell",
        "table-cell",
        "table-cell",
        "table-loading",
        "table-cell",
        "table-cell",
        "table-cell",
        "table-loading",
        "table-cell",
        "table-cell",
        "table-cell",
        "table-loading",
        "table-cell",
        "table-cell",
        "table-cell",
      ]
    `);
  });

  it("empty: one table-empty cell", () => {
    expect(tableParts(renderVariant({ data: [] }))).toMatchInlineSnapshot(`
      [
        "table-root",
        "table-scroller",
        "table-header",
        "table-header-cell",
        "table-header-cell",
        "table-sort-trigger",
        "table-column-menu",
        "table-resize-handle",
        "table-header-cell",
        "table-sort-trigger",
        "table-column-menu",
        "table-resize-handle",
        "table-body",
        "table-empty",
      ]
    `);
  });

  it("the three variants together emit exactly the 13 spec parts", () => {
    const all = new Set([
      ...tableParts(renderVariant({})),
      ...tableParts(renderVariant({ loading: true })),
      ...tableParts(renderVariant({ data: [] })),
    ]);
    expect([...all].sort()).toEqual([...SPEC_PARTS].sort());
  });

  it("no part repeats within a row except table-cell (one per column)", () => {
    const container = renderVariant({ loading: true });
    const rows = container.querySelectorAll("tr");
    expect(rows.length).toBeGreaterThan(0);
    rows.forEach((tr) => {
      const parts = [...tr.querySelectorAll("[data-ag-part]")]
        .map((el) => el.getAttribute("data-ag-part")!)
        .filter(
          (p) =>
            p.startsWith("table-") &&
            p !== "table-cell" &&
            p !== "table-header-cell" &&
            p !== "table-sort-trigger" &&
            p !== "table-resize-handle" &&
            p !== "table-column-menu"
        );
      expect(new Set(parts).size).toBe(parts.length);
    });
  });

  it("row + header state attributes", () => {
    const container = renderVariant({
      loading: true,
      defaultRowSelection: { a: true },
      defaultSorting: [{ id: "qty", desc: true }],
    });
    const tr = container.querySelector('tr[data-ag-part="table-row"]')!;
    expect(tr.getAttribute("data-row-id")).toBe("a");
    expect(tr.hasAttribute("data-selected")).toBe(true);
    expect(tr.getAttribute("data-state")).toBe("loading");
    expect(
      container.querySelector('th[data-sorted="desc"]')!.textContent
    ).toContain("Qty");
  });
});
