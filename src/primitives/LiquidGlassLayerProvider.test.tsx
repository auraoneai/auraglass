import React from "react";
import { render, screen } from "@testing-library/react";
import { LiquidGlassLayerProvider, useLiquidGlassLayer } from "./LiquidGlassLayerProvider";

function Probe() {
  const layer = useLiquidGlassLayer();
  return <span data-testid="layer">{layer.performanceLevel}</span>;
}

it("provides layer policy defaults", () => {
  render(
    <LiquidGlassLayerProvider performanceLevel="efficient">
      <Probe />
    </LiquidGlassLayerProvider>
  );
  expect(screen.getByTestId("layer")).toHaveTextContent("efficient");
});
