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
import { render, screen } from "@testing-library/react";
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
});
