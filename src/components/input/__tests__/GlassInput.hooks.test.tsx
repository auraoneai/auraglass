/** REQ-PLAT-44 (PLAT-086/087): conditional prop combinations must not change
    hook order; toggling errorText on one mounted input keeps ARIA ids stable. */
import React from "react";
import { render } from "@testing-library/react";
import { GlassInput } from "../GlassInput";

describe("GlassInput hook order", () => {
  it("renders identically across conditional prop combos", () => {
    const combos = [
      {},
      { label: "Name" },
      { errorText: "Required" },
      { helperText: "Help" },
      { label: "Name", errorText: "Required", helperText: "Help" },
    ];
    for (const props of combos) {
      const { container, unmount } = render(<GlassInput {...props} />);
      expect(container.querySelector("input")).not.toBeNull();
      unmount();
    }
  });

  it("errorText rerender toggles keep hook order and stable ARIA ids", () => {
    const errors = jest.spyOn(console, "error").mockImplementation(() => {});
    try {
      const { container, rerender } = render(<GlassInput label="Name" helperText="Help" />);
      const input = () => container.querySelector("input")!;
      const ids = () => ({
        input: input().id,
        describedby: input().getAttribute("aria-describedby"),
        labelledby: input().getAttribute("aria-labelledby"),
      });
      const initial = ids();
      expect(initial.input).toBeTruthy();
      const seenErrorIds: (string | null)[] = [];
      for (let i = 0; i < 3; i++) {
        rerender(<GlassInput label="Name" helperText="Help" errorText="Required" />);
        expect(input().id).toBe(initial.input);
        expect(input().getAttribute("aria-invalid")).toBe("true");
        const describedby = input().getAttribute("aria-describedby");
        seenErrorIds.push(describedby);
        // every referenced id resolves to an element that carries the error text
        const refs = (describedby ?? "").split(/\s+/).filter(Boolean);
        expect(refs.length).toBeGreaterThan(0);
        for (const id of refs) expect(container.ownerDocument.getElementById(id)).not.toBeNull();
        expect(refs.map((id) => container.ownerDocument.getElementById(id)?.textContent).join(" ")).toContain("Required");
        rerender(<GlassInput label="Name" helperText="Help" />);
        expect(ids()).toEqual(initial);
      }
      // the error-state ids are the same on every toggle
      expect(new Set(seenErrorIds).size).toBe(1);
      expect(
        errors.mock.calls.filter((c) => /order of Hooks|Rendered (more|fewer) hooks/.test(String(c[0])))
      ).toEqual([]);
    } finally {
      errors.mockRestore();
    }
  });

  it("contains no conditional hook calls", () => {
    const src = require("fs").readFileSync(
      require("path").join(__dirname, "../GlassInput.tsx"),
      "utf8"
    );
    expect(src).not.toMatch(/\?\s*use[A-Z]\w+\(/);
    expect(src).not.toMatch(/&&\s*use[A-Z]\w+\(/);
  });
});
