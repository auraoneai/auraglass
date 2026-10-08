/** PLAT-086/087: conditional prop combinations must not change hook order. */
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

  it("contains no conditional hook calls", () => {
    const src = require("fs").readFileSync(
      require("path").join(__dirname, "../GlassInput.tsx"),
      "utf8"
    );
    expect(src).not.toMatch(/\?\s*use[A-Z]\w+\(/);
    expect(src).not.toMatch(/&&\s*use[A-Z]\w+\(/);
  });
});
