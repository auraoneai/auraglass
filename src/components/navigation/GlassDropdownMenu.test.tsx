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
import { render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import userEvent from "@testing-library/user-event";
import {
  GlassDropdownMenu,
  GlassDropdownMenuContent,
  GlassDropdownMenuItem,
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
});
