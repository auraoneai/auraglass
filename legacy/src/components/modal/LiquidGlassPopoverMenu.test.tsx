import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LiquidGlassPopoverMenu } from "./LiquidGlassPopoverMenu";

it("selects menu items", async () => {
  const onSelect = jest.fn();
  render(<LiquidGlassPopoverMenu open items={[{ id: "copy", label: "Copy", onSelect }]} />);
  await userEvent.click(screen.getByRole("menuitem", { name: "Copy" }));
  expect(onSelect).toHaveBeenCalled();
});
