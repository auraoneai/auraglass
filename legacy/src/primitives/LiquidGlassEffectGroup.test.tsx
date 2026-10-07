import React from "react";
import { render, screen } from "@testing-library/react";
import { LiquidGlassEffectGroup, useLiquidGlassEffectGroup } from "./LiquidGlassEffectGroup";

function Probe() {
  const group = useLiquidGlassEffectGroup();
  return <span data-testid="probe">{group?.samplingStrategy}</span>;
}

it("provides shared grouping context", () => {
  render(
    <LiquidGlassEffectGroup samplingStrategy="shared">
      <Probe />
    </LiquidGlassEffectGroup>
  );
  expect(screen.getByTestId("probe")).toHaveTextContent("shared");
});
