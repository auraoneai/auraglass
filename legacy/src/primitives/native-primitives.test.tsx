"use client";

import React from "react";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  DismissableLayer,
  FocusScope,
  Label,
  Portal,
  Positioner,
  RovingFocusGroup,
  Slot,
} from ".";

describe("native primitives", () => {
  it("Slot merges className, style, handlers, and refs into its child", async () => {
    const user = userEvent.setup();
    const slotHandler = jest.fn();
    const childHandler = jest.fn();
    const ref = React.createRef<HTMLButtonElement>();

    render(
      <Slot
        ref={ref}
        className="slot-class"
        style={{ color: "red" }}
        onClick={slotHandler}
      >
        <button
          className="child-class"
          style={{ backgroundColor: "blue" }}
          onClick={childHandler}
        >
          Save
        </button>
      </Slot>
    );

    const button = screen.getByRole("button", { name: "Save" });
    await user.click(button);

    expect(button).toHaveClass("slot-class", "child-class");
    expect(button).toHaveStyle({ color: "red", backgroundColor: "blue" });
    expect(childHandler).toHaveBeenCalledTimes(1);
    expect(slotHandler).toHaveBeenCalledTimes(1);
    expect(ref.current).toBe(button);
  });

  it("Label renders native htmlFor and nested input associations", () => {
    render(
      <>
        <Label htmlFor="email">Email</Label>
        <input id="email" />
        <Label>
          Name
          <input />
        </Label>
      </>
    );

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
  });

  it("Label preserves disabled control semantics and accessible name", () => {
    render(
      <Label htmlFor="billing-email">
        Billing email
        <input id="billing-email" disabled />
      </Label>
    );

    const input = screen.getByLabelText("Billing email");
    expect(input).toBeDisabled();
    expect(input).toHaveAccessibleName("Billing email");
  });

  it("Portal renders into the supplied container", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    render(
      <Portal container={container}>
        <div data-testid="portalled">Portalled</div>
      </Portal>
    );

    expect(container).toContainElement(screen.getByTestId("portalled"));
    container.remove();
  });

  it("DismissableLayer dismisses on outside pointer and escape", async () => {
    const user = userEvent.setup();
    const onDismiss = jest.fn();

    render(
      <>
        <DismissableLayer onDismiss={onDismiss}>
          <button>Inside</button>
        </DismissableLayer>
        <button>Outside</button>
      </>
    );

    await user.click(screen.getByRole("button", { name: "Outside" }));
    await user.keyboard("{Escape}");

    expect(onDismiss).toHaveBeenCalledTimes(2);
  });

  it("DismissableLayer supports outside focus and prevented dismissal", async () => {
    const user = userEvent.setup();
    const onDismiss = jest.fn();
    const onFocusOutside = jest.fn((event: FocusEvent) =>
      event.preventDefault()
    );

    render(
      <>
        <DismissableLayer onDismiss={onDismiss} onFocusOutside={onFocusOutside}>
          <button>Inside</button>
        </DismissableLayer>
        <button>Outside</button>
      </>
    );

    screen.getByRole("button", { name: "Inside" }).focus();
    await user.tab();

    expect(onFocusOutside).toHaveBeenCalledTimes(1);
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it("DismissableLayer treats nested layer content as inside the parent layer", async () => {
    const user = userEvent.setup();
    const onDismiss = jest.fn();

    render(
      <DismissableLayer onDismiss={onDismiss}>
        <button>Parent action</button>
        <DismissableLayer>
          <button>Nested action</button>
        </DismissableLayer>
      </DismissableLayer>
    );

    await user.click(screen.getByRole("button", { name: "Nested action" }));

    expect(onDismiss).not.toHaveBeenCalled();
  });

  it("FocusScope loops focus with tab", async () => {
    const user = userEvent.setup();

    render(
      <FocusScope loop>
        <button>First</button>
        <button>Second</button>
      </FocusScope>
    );

    screen.getByRole("button", { name: "Second" }).focus();
    await user.tab();

    expect(screen.getByRole("button", { name: "First" })).toHaveFocus();
  });

  it("FocusScope traps outside focus and restores focus on unmount", async () => {
    const user = userEvent.setup();
    const Fixture = ({ open }: { open: boolean }) => (
      <>
        <button>Trigger</button>
        {open ? (
          <FocusScope trapped restoreFocus>
            <button>Scoped</button>
          </FocusScope>
        ) : null}
        <button>Outside</button>
      </>
    );

    const { rerender } = render(<Fixture open={false} />);
    screen.getByRole("button", { name: "Trigger" }).focus();
    rerender(<Fixture open />);
    screen.getByRole("button", { name: "Scoped" }).focus();
    await user.click(screen.getByRole("button", { name: "Outside" }));

    expect(screen.getByRole("button", { name: "Scoped" })).toHaveFocus();

    rerender(<Fixture open={false} />);
    expect(screen.getByRole("button", { name: "Trigger" })).toHaveFocus();
  });

  it("RovingFocusGroup moves focus with arrow keys", async () => {
    const user = userEvent.setup();

    render(
      <RovingFocusGroup.Root orientation="horizontal" loop>
        <RovingFocusGroup.Item asChild>
          <button>One</button>
        </RovingFocusGroup.Item>
        <RovingFocusGroup.Item asChild>
          <button>Two</button>
        </RovingFocusGroup.Item>
      </RovingFocusGroup.Root>
    );

    screen.getByRole("button", { name: "One" }).focus();
    await user.keyboard("{ArrowRight}");

    expect(screen.getByRole("button", { name: "Two" })).toHaveFocus();
  });

  it("RovingFocusGroup supports Home, End, disabled items, and RTL arrows", async () => {
    const user = userEvent.setup();

    render(
      <RovingFocusGroup.Root orientation="horizontal" dir="rtl" loop>
        <RovingFocusGroup.Item asChild>
          <button>One</button>
        </RovingFocusGroup.Item>
        <RovingFocusGroup.Item asChild disabled>
          <button disabled>Two</button>
        </RovingFocusGroup.Item>
        <RovingFocusGroup.Item asChild>
          <button>Three</button>
        </RovingFocusGroup.Item>
      </RovingFocusGroup.Root>
    );

    screen.getByRole("button", { name: "One" }).focus();
    await user.keyboard("{End}");
    expect(screen.getByRole("button", { name: "Three" })).toHaveFocus();

    await user.keyboard("{Home}");
    expect(screen.getByRole("button", { name: "One" })).toHaveFocus();

    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("button", { name: "Three" })).toHaveFocus();

    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("button", { name: "One" })).toHaveFocus();
  });

  it("Positioner annotates side and align", () => {
    const anchorRef = { current: document.createElement("button") };
    document.body.appendChild(anchorRef.current);

    render(
      <Positioner anchorRef={anchorRef} side="top" align="end" contained>
        Positioned
      </Positioner>
    );

    const positioner = screen.getByText("Positioned");
    expect(positioner).toHaveAttribute("data-side", "top");
    expect(positioner).toHaveAttribute("data-align", "end");
    anchorRef.current.remove();
  });

  it("Positioner clamps floating content within viewport collision padding", () => {
    const anchor = document.createElement("button");
    document.body.appendChild(anchor);
    jest.spyOn(anchor, "getBoundingClientRect").mockReturnValue({
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: 24,
      bottom: 24,
      width: 24,
      height: 24,
      toJSON: () => ({}),
    });

    const { getByText } = render(
      <Positioner
        anchorRef={{ current: anchor }}
        side="top"
        align="start"
        collisionPadding={12}
      >
        Clamped
      </Positioner>
    );

    const positioner = getByText("Clamped");
    jest.spyOn(positioner, "getBoundingClientRect").mockReturnValue({
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: 120,
      bottom: 64,
      width: 120,
      height: 64,
      toJSON: () => ({}),
    });
    act(() => {
      window.dispatchEvent(new Event("resize"));
    });

    expect(positioner).toHaveStyle({ top: "12px", left: "12px" });
    anchor.remove();
  });
});
