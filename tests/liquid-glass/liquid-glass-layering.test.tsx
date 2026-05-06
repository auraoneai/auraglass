import React from "react";
import { render } from "@testing-library/react";
import { LiquidGlassEffectGroup } from "../../src/primitives/LiquidGlassEffectGroup";
import { LiquidGlassMaterial } from "../../src/primitives/LiquidGlassMaterial";

it("allows grouped liquid glass surfaces", () => {
  const warn = jest.spyOn(console, "warn").mockImplementation(() => undefined);
  render(
    <LiquidGlassEffectGroup>
      <LiquidGlassMaterial material="liquid">A</LiquidGlassMaterial>
      <LiquidGlassMaterial material="liquid">B</LiquidGlassMaterial>
    </LiquidGlassEffectGroup>
  );
  expect(warn).not.toHaveBeenCalled();
  warn.mockRestore();
});
