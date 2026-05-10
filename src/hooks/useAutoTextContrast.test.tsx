"use client";

import React, { useRef } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { useAutoTextContrast } from "./useAutoTextContrast";

function AutoContrastSurface() {
  const ref = useRef<HTMLDivElement>(null);
  useAutoTextContrast(ref, { observe: false });

  return (
    <div style={{ backgroundColor: "rgb(0, 0, 0)" }}>
      <div
        ref={ref}
        data-testid="surface"
        style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
      >
        Label
      </div>
    </div>
  );
}

describe("useAutoTextContrast", () => {
  it("composites translucent surfaces over ancestor backgrounds", async () => {
    render(<AutoContrastSurface />);

    await waitFor(() => {
      expect(screen.getByTestId("surface")).toHaveAttribute("data-bg", "dark");
    });
  });
});
