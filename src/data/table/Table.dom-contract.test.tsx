/** @jest-environment jsdom */
// SURF-159: inline snapshot of the data-ag-part attribute set.
import { describe, expect, it } from "@jest/globals";
import { render } from "@testing-library/react";
import * as React from "react";
import { Table } from "./Table";
import type { TableColumnDef } from "./types";

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

describe("Table DOM contract (SURF-159, REQ-SURF-75)", () => {
  it("part attributes match the frozen set", () => {
    const { container } = render(
      <Table
        data={DATA}
        columns={COLS}
        getRowId={(r) => r.id}
        caption="Orders"
        selectionMode="multiple"
        enableColumnResizing
      />
    );
    const parts = [...container.querySelectorAll("[data-ag-part]")].map((el) =>
      el.getAttribute("data-ag-part")
    );
    expect(parts).toMatchInlineSnapshot(`
      [
        "table-root",
        "table-scroller",
        "table-header",
        "table-header-cell",
        "table-selection-all",
        "table-header-cell",
        "table-sort-trigger",
        "table-resize-handle",
        "table-header-cell",
        "table-sort-trigger",
        "table-resize-handle",
        "table-body",
        "table-row",
        "table-selection-cell",
        "table-selection-cell",
        "table-cell",
        "table-cell",
      ]
    `);
  });
});
