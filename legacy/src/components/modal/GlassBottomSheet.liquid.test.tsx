import React from "react";
import { render, screen } from "@testing-library/react";
import { GlassBottomSheet } from "./GlassBottomSheet";

it("bridges to LiquidGlassAdaptiveSheet when material is liquid", () => {
  render(
    <GlassBottomSheet open onOpenChange={() => undefined} material="liquid" title="Liquid Sheet">
      Body
    </GlassBottomSheet>
  );
  expect(screen.getByRole("dialog", { name: "Liquid Sheet" })).toBeInTheDocument();
  expect(screen.getByText("Body")).toBeInTheDocument();
});
