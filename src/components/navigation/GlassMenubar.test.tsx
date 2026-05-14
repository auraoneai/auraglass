"use client";
/**
 * GlassMenubar Component Tests
 *
 * Test Suite Coverage:
 * - ✅ Smoke test (renders without crashing)
 * - ✅ Props validation
 * - ✅ Accessibility (axe-core)
 * - ⏭️  ARIA attributes (not applicable)
 * - ✅ Focus management
 * - ⏭️  Reduced motion (not applicable)
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import userEvent from "@testing-library/user-event";
import { GlassMenubar } from "@/components/navigation/GlassMenubar";
import { GlassMenuPrimitiveRoot } from "@/components/navigation/GlassMenuPrimitive";

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe("GlassMenubar", () => {
  const items = [
    {
      id: "file",
      label: "File",
      children: [
        { id: "new", label: "New" },
        { id: "open", label: "Open" },
      ],
    },
  ];

  /**
   * Smoke Test: Component renders without crashing
   */
  it("renders without crashing", () => {
    const { container } = render(<GlassMenubar />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it("has no accessibility violations", async () => {
    const { container } = render(<GlassMenubar />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  /**
   * Focus Management Tests
   */
  describe("Focus Management", () => {
    it("can receive focus", () => {
      render(<GlassMenubar />);
      const element =
        document.querySelector("[tabindex]") ||
        document.querySelector("button, a, input, select, textarea");

      if (element) {
        (element as HTMLElement).focus();
        expect(element).toHaveFocus();
      }
    });

    it("shows visible focus indicator", () => {
      const { container } = render(<GlassMenubar />);
      const element =
        container.querySelector("[tabindex]") ||
        container.querySelector("button, a, input, select, textarea");

      if (element) {
        (element as HTMLElement).focus();
        // Check for focus-visible class or focus styles
        const hasFocusIndicator =
          element.classList.contains("focus-visible") ||
          window.getComputedStyle(element).outline !== "none";
        expect(hasFocusIndicator).toBe(true);
      }
    });
  });

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it("accepts and renders with custom props", () => {
    const { container } = render(
      <GlassMenubar className="custom-class" data-testid="glassmenubar" />
    );

    const element =
      container.querySelector('[data-testid="glassmenubar"]') ||
      container.firstChild;

    expect(element).toHaveClass("custom-class");
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it("matches snapshot", () => {
    const { container } = render(<GlassMenubar />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders submenu content as contained when requested", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <GlassMenubar items={items} contained data-testid="contained-menubar" />
    );

    await user.click(screen.getByRole("menuitem", { name: "File" }));

    const menubars = screen.getAllByRole("menubar", { name: "Menu bar" });
    const containedContent = container.querySelector(
      '[data-position-strategy="contained"]'
    );

    expect(menubars.length).toBeGreaterThan(1);
    expect(containedContent).toBeInTheDocument();
    expect(container).toContainElement(containedContent as HTMLElement);
  });

  it("is built on the shared GlassMenuPrimitive root", () => {
    render(<GlassMenubar items={items} data-testid="primitive-menubar" />);
    const menubar = screen.getByTestId("primitive-menubar");
    expect(menubar).toHaveAttribute("data-glass-component");
    expect(menubar).toHaveAttribute("role", "menubar");
  });

  it("supports arrow-key navigation between top-level items", async () => {
    const user = userEvent.setup();
    render(
      <GlassMenubar
        items={[
          { id: "file", label: "File" },
          { id: "edit", label: "Edit" },
          { id: "view", label: "View" },
        ]}
      />
    );

    const file = screen.getByRole("menuitem", { name: "File" });
    file.focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("menuitem", { name: "Edit" })).toHaveFocus();
    await user.keyboard("{End}");
    expect(screen.getByRole("menuitem", { name: "View" })).toHaveFocus();
  });

  it("exports the shared primitive root for composition", () => {
    render(<GlassMenuPrimitiveRoot aria-label="Primitive menu" />);
    expect(
      screen.getByRole("menubar", { name: "Primitive menu" })
    ).toBeInTheDocument();
  });
});
