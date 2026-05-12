"use client";

import React from "react";
import { fireEvent, render } from "@testing-library/react";
import { AuroraOrb } from "./AuroraOrb";

describe("AuroraOrb", () => {
  it("renders with size, palette, glow, and tilt props", () => {
    const { container } = render(
      <AuroraOrb
        size={128}
        palette="prism"
        glow="strong"
        tiltX={6}
        tiltY={-4}
        data-testid="orb"
      />
    );
    const orb = container.querySelector('[data-testid="orb"]');

    expect(orb).toHaveAttribute("data-ag-palette", "prism");
    expect(orb).toHaveAttribute("data-glow", "strong");
    expect(orb).toHaveStyle({
      "--ag-orb-size": "128px",
      "--ag-tilt-x": "6deg",
      "--ag-tilt-y": "-4deg",
    });
  });

  it("updates tilt variables when interactive pointer tracking is enabled", () => {
    const { container } = render(<AuroraOrb interactive data-testid="orb" />);
    const orb = container.querySelector('[data-testid="orb"]') as HTMLElement;

    Object.defineProperty(orb, "getBoundingClientRect", {
      value: () => ({
        left: 0,
        top: 0,
        width: 100,
        height: 100,
        right: 100,
        bottom: 100,
      }),
    });

    fireEvent(
      orb,
      new MouseEvent("pointermove", {
        bubbles: true,
        clientX: 100,
        clientY: 0,
      })
    );

    expect(orb.style.getPropertyValue("--ag-tilt-y")).toBe("6.00deg");
    expect(orb.style.getPropertyValue("--ag-tilt-x")).toBe("6.00deg");
  });
});
