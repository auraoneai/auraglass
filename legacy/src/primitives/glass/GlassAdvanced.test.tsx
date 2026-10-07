"use client";

import React from "react";
import { render } from "@testing-library/react";
import { GlassAdvanced } from "./GlassAdvanced";

describe("GlassAdvanced", () => {
  it("renders a visible glass surface by default", () => {
    const { container } = render(<GlassAdvanced>Advanced glass</GlassAdvanced>);
    const surface = container.firstElementChild;

    expect(surface).toBeInTheDocument();
    expect(surface).toHaveStyle({
      position: "relative",
      overflow: "hidden",
    });
    expect(surface).toHaveClass("glass-foundation-complete");
    expect(surface).toHaveClass("glass-elev-2");
  });

  it("supports preview and compact sizing", () => {
    const { container } = render(
      <GlassAdvanced preview compact>
        Compact advanced glass
      </GlassAdvanced>
    );
    const surface = container.firstElementChild;

    expect(surface).toHaveStyle({ minHeight: "96px" });
  });

  it("allows callers to override minHeight and style", () => {
    const { container } = render(
      <GlassAdvanced preview minHeight={144} style={{ background: "red" }}>
        Custom advanced glass
      </GlassAdvanced>
    );
    const surface = container.firstElementChild;

    expect(surface).toHaveStyle({ minHeight: "144px", background: "red" });
  });
});
