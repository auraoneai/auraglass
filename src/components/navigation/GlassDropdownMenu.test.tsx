"use client";
/**
 * GlassDropdownMenu Component Tests
 *
 * Test Suite Coverage:
 * - ✅ Smoke test (renders without crashing)
 * - ✅ Props validation
 * - ✅ Accessibility (axe-core)
 * - ⏭️  ARIA attributes (not applicable)
 * - ⏭️  Focus management (not applicable)
 * - ⏭️  Reduced motion (not applicable)
 */

import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import userEvent from "@testing-library/user-event";
import {
  GlassDropdownMenu,
  GlassDropdownMenuCheckboxItem,
  GlassDropdownMenuContent,
  GlassDropdownMenuItem,
  GlassDropdownMenuRadioGroup,
  GlassDropdownMenuRadioItem,
  GlassDropdownMenuSub,
  GlassDropdownMenuSubContent,
  GlassDropdownMenuSubTrigger,
  GlassDropdownMenuTrigger,
} from "@/components/navigation/GlassDropdownMenu";

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe("GlassDropdownMenu", () => {
  /**
   * Smoke Test: Component renders without crashing
   */
  it("renders without crashing", () => {
    const { container } = render(<GlassDropdownMenu />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it("has no accessibility violations", async () => {
    const { container } = render(<GlassDropdownMenu />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it("accepts and renders with custom props", () => {
    const { container } = render(
      <GlassDropdownMenu
        className="custom-class"
        data-testid="glassdropdownmenu"
      />
    );

    const element =
      container.querySelector('[data-testid="glassdropdownmenu"]') ||
      container.firstChild;

    expect(element).toHaveClass("custom-class");
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it("matches snapshot", () => {
    const { container } = render(<GlassDropdownMenu />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("supports contained content without portalling to document.body", () => {
    const { container } = render(
      <GlassDropdownMenu defaultOpen>
        <GlassDropdownMenuTrigger>Open menu</GlassDropdownMenuTrigger>
        <GlassDropdownMenuContent
          portalled={false}
          contained
          data-testid="contained-menu"
        >
          <GlassDropdownMenuItem>Contained action</GlassDropdownMenuItem>
        </GlassDropdownMenuContent>
      </GlassDropdownMenu>
    );

    const content = screen.getByTestId("contained-menu");
    expect(container).toContainElement(content);
    expect(content).toHaveAttribute("data-position-strategy", "contained");
  });

  it("supports contained submenu content parity", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <GlassDropdownMenu defaultOpen>
        <GlassDropdownMenuTrigger>Open menu</GlassDropdownMenuTrigger>
        <GlassDropdownMenuContent portalled={false} contained>
          <GlassDropdownMenuSub defaultOpen>
            <GlassDropdownMenuSubTrigger>More</GlassDropdownMenuSubTrigger>
            <GlassDropdownMenuSubContent
              portalled={false}
              contained
              data-testid="contained-submenu"
            >
              <GlassDropdownMenuItem>Nested action</GlassDropdownMenuItem>
            </GlassDropdownMenuSubContent>
          </GlassDropdownMenuSub>
        </GlassDropdownMenuContent>
      </GlassDropdownMenu>
    );

    await user.hover(screen.getByText("More"));
    const content = await screen.findByTestId("contained-submenu");
    expect(container).toContainElement(content);
    expect(content).toHaveAttribute("data-position-strategy", "contained");
  });

  it("supports keyboard navigation through menu items", async () => {
    render(
      <GlassDropdownMenu defaultOpen>
        <GlassDropdownMenuTrigger>Open menu</GlassDropdownMenuTrigger>
        <GlassDropdownMenuContent portalled={false}>
          <GlassDropdownMenuItem>First</GlassDropdownMenuItem>
          <GlassDropdownMenuItem>Second</GlassDropdownMenuItem>
          <GlassDropdownMenuItem>Third</GlassDropdownMenuItem>
        </GlassDropdownMenuContent>
      </GlassDropdownMenu>
    );

    const menu = screen.getByRole("menu");
    fireEvent.keyDown(menu, { key: "ArrowDown" });
    expect(screen.getByRole("menuitem", { name: "First" })).toHaveFocus();
    fireEvent.keyDown(menu, { key: "ArrowDown" });
    expect(screen.getByRole("menuitem", { name: "Second" })).toHaveFocus();
    fireEvent.keyDown(menu, { key: "End" });
    expect(screen.getByRole("menuitem", { name: "Third" })).toHaveFocus();
    fireEvent.keyDown(menu, { key: "Home" });
    expect(screen.getByRole("menuitem", { name: "First" })).toHaveFocus();
  });

  it("handles checkbox and radio menu item selection", async () => {
    const user = userEvent.setup();
    const onCheckedChange = jest.fn();
    const onValueChange = jest.fn();

    render(
      <GlassDropdownMenu defaultOpen>
        <GlassDropdownMenuTrigger>Open menu</GlassDropdownMenuTrigger>
        <GlassDropdownMenuContent portalled={false}>
          <GlassDropdownMenuCheckboxItem
            checked={false}
            onCheckedChange={onCheckedChange}
          >
            Show grid
          </GlassDropdownMenuCheckboxItem>
          <GlassDropdownMenuRadioGroup
            value="day"
            onValueChange={onValueChange}
          >
            <GlassDropdownMenuRadioItem value="day">
              Day
            </GlassDropdownMenuRadioItem>
            <GlassDropdownMenuRadioItem value="week">
              Week
            </GlassDropdownMenuRadioItem>
          </GlassDropdownMenuRadioGroup>
        </GlassDropdownMenuContent>
      </GlassDropdownMenu>
    );

    await user.click(
      screen.getByRole("menuitemcheckbox", { name: "Show grid" })
    );
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    await user.click(screen.getByRole("menuitemradio", { name: "Week" }));
    expect(onValueChange).toHaveBeenCalledWith("week");
  });

  it("opens submenus from the keyboard", () => {
    render(
      <GlassDropdownMenu defaultOpen>
        <GlassDropdownMenuTrigger>Open menu</GlassDropdownMenuTrigger>
        <GlassDropdownMenuContent portalled={false}>
          <GlassDropdownMenuSub>
            <GlassDropdownMenuSubTrigger>More</GlassDropdownMenuSubTrigger>
            <GlassDropdownMenuSubContent
              portalled={false}
              data-testid="keyboard-submenu"
            >
              <GlassDropdownMenuItem>Nested action</GlassDropdownMenuItem>
            </GlassDropdownMenuSubContent>
          </GlassDropdownMenuSub>
        </GlassDropdownMenuContent>
      </GlassDropdownMenu>
    );

    const trigger = screen.getByRole("menuitem", { name: "More" });
    fireEvent.keyDown(trigger, { key: "ArrowRight" });
    expect(screen.getByTestId("keyboard-submenu")).toBeInTheDocument();
  });
});
