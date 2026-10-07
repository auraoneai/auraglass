"use client";
/**
 * GlassSelectCompound Component Tests
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
import GlassSelectCompound, {
  GlassSelectTrigger,
  GlassSelectValue,
  GlassSelectContent,
  GlassSelectItem,
} from "@/components/input/GlassSelectCompound";

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe("GlassSelectCompound", () => {
  /**
   * Smoke Test: Component renders without crashing
   */
  it("renders without crashing", () => {
    const { container } = render(
      <GlassSelectCompound>
        <GlassSelectTrigger>
          <GlassSelectValue placeholder="Select an option" />
        </GlassSelectTrigger>
        <GlassSelectContent>
          <GlassSelectItem value="option1">Option 1</GlassSelectItem>
          <GlassSelectItem value="option2">Option 2</GlassSelectItem>
        </GlassSelectContent>
      </GlassSelectCompound>
    );
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it("has no accessibility violations", async () => {
    const { container } = render(
      <GlassSelectCompound>
        <GlassSelectTrigger>
          <GlassSelectValue placeholder="Select an option" />
        </GlassSelectTrigger>
        <GlassSelectContent>
          <GlassSelectItem value="option1">Option 1</GlassSelectItem>
          <GlassSelectItem value="option2">Option 2</GlassSelectItem>
        </GlassSelectContent>
      </GlassSelectCompound>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it("accepts and renders with custom props", () => {
    const { container } = render(
      <GlassSelectCompound data-testid="glassselectcompound">
        <GlassSelectTrigger className="custom-class">
          <GlassSelectValue placeholder="Select an option" />
        </GlassSelectTrigger>
        <GlassSelectContent>
          <GlassSelectItem value="option1">Option 1</GlassSelectItem>
          <GlassSelectItem value="option2">Option 2</GlassSelectItem>
        </GlassSelectContent>
      </GlassSelectCompound>
    );

    const element =
      container.querySelector("[data-glass-component]") || container.firstChild;

    expect(element).toHaveClass("custom-class");
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it("matches snapshot", () => {
    const { container } = render(
      <GlassSelectCompound>
        <GlassSelectTrigger>
          <GlassSelectValue placeholder="Select an option" />
        </GlassSelectTrigger>
        <GlassSelectContent>
          <GlassSelectItem value="option1">Option 1</GlassSelectItem>
          <GlassSelectItem value="option2">Option 2</GlassSelectItem>
        </GlassSelectContent>
      </GlassSelectCompound>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("supports contained content without portalling to document.body", () => {
    const { container } = render(
      <GlassSelectCompound defaultOpen defaultValue="option1">
        <GlassSelectTrigger>
          <GlassSelectValue placeholder="Select an option" />
        </GlassSelectTrigger>
        <GlassSelectContent contained data-testid="contained-select">
          <GlassSelectItem value="option1">Option 1</GlassSelectItem>
          <GlassSelectItem value="option2">Option 2</GlassSelectItem>
        </GlassSelectContent>
      </GlassSelectCompound>
    );

    const content = screen.getByTestId("contained-select");
    expect(container).toContainElement(content);
    expect(content).toHaveAttribute("data-position-strategy", "contained");
  });

  it("updates controlled values when an item is selected", async () => {
    const user = userEvent.setup();
    const onValueChange = jest.fn();

    render(
      <GlassSelectCompound
        value="option1"
        onValueChange={onValueChange}
        defaultOpen
      >
        <GlassSelectTrigger>
          <GlassSelectValue placeholder="Select an option" />
        </GlassSelectTrigger>
        <GlassSelectContent portalled={false}>
          <GlassSelectItem value="option1">Option 1</GlassSelectItem>
          <GlassSelectItem value="option2">Option 2</GlassSelectItem>
        </GlassSelectContent>
      </GlassSelectCompound>
    );

    await user.click(screen.getByRole("option", { name: "Option 2" }));
    expect(onValueChange).toHaveBeenCalledWith("option2");
  });

  it("stores uncontrolled values in the hidden form field", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <form>
        <GlassSelectCompound name="density" defaultValue="compact" defaultOpen>
          <GlassSelectTrigger>
            <GlassSelectValue placeholder="Select density" />
          </GlassSelectTrigger>
          <GlassSelectContent portalled={false}>
            <GlassSelectItem value="compact">Compact</GlassSelectItem>
            <GlassSelectItem value="comfortable">Comfortable</GlassSelectItem>
          </GlassSelectContent>
        </GlassSelectCompound>
      </form>
    );

    await user.click(screen.getByRole("option", { name: "Comfortable" }));
    expect(container.querySelector('input[name="density"]')).toHaveValue(
      "comfortable"
    );
  });

  it("supports trigger typeahead against registered option labels", () => {
    const onValueChange = jest.fn();

    render(
      <GlassSelectCompound defaultOpen onValueChange={onValueChange}>
        <GlassSelectTrigger>
          <GlassSelectValue placeholder="Select a team" />
        </GlassSelectTrigger>
        <GlassSelectContent portalled={false}>
          <GlassSelectItem value="alpha">Alpha</GlassSelectItem>
          <GlassSelectItem value="billing">Billing</GlassSelectItem>
        </GlassSelectContent>
      </GlassSelectCompound>
    );

    const trigger = screen.getByRole("combobox");
    fireEvent.keyDown(trigger, { key: "b" });
    expect(onValueChange).toHaveBeenCalledWith("billing");
  });

  it("keeps content constrained for mobile and collision-sensitive surfaces", () => {
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: 360,
    });

    render(
      <GlassSelectCompound defaultOpen defaultValue="option1">
        <GlassSelectTrigger>
          <GlassSelectValue placeholder="Select an option" />
        </GlassSelectTrigger>
        <GlassSelectContent
          contained
          positionStrategy="contained"
          data-testid="mobile-select"
        >
          <GlassSelectItem value="option1">Option 1</GlassSelectItem>
          <GlassSelectItem value="option2">Option 2</GlassSelectItem>
        </GlassSelectContent>
      </GlassSelectCompound>
    );

    expect(screen.getByTestId("mobile-select")).toHaveAttribute(
      "data-position-strategy",
      "contained"
    );
  });
});
