"use client";

import React from "react";
import { render, screen } from "@testing-library/react";
import { MultiUserGlassEditor } from "@/components/collaboration/MultiUserGlassEditor";

describe("MultiUserGlassEditor", () => {
  it("renders without crashing", () => {
    const { container } = render(<MultiUserGlassEditor />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders compact editor chrome inside a bounded preview surface", () => {
    const { container } = render(
      <MultiUserGlassEditor
        compact
        contained
        maxHeight={220}
        maxWidth={320}
        defaultValue="Drafting a compact collaborative note."
      />
    );

    const editor = container.firstChild as HTMLElement;
    expect(editor).toHaveStyle({ maxHeight: "220px", maxWidth: "320px" });
    expect(
      screen.getByDisplayValue("Drafting a compact collaborative note.")
    ).toHaveStyle({
      minHeight: "92px",
    });
  });
});
