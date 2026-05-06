import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LiquidGlassSegmentedControl } from "./LiquidGlassSegmentedControl";

it("emits selected segment", async () => {
  const onValueChange = jest.fn();
  render(<LiquidGlassSegmentedControl segments={[{ id: "a", label: "A" }]} onValueChange={onValueChange} />);
  await userEvent.click(screen.getByRole("button", { name: "A" }));
  expect(onValueChange).toHaveBeenCalledWith("a");
});
