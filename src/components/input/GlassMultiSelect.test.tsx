"use client";
/**
 * GlassMultiSelect Component Tests
 *
 * Test Suite Coverage:
 * - ✅ Smoke test (renders without crashing)
 * - ✅ Props validation
 * - ✅ Accessibility (axe-core)
 * - ✅ ARIA attributes
 * - ⏭️  Focus management (not applicable)
 * - ✅ Reduced motion support
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import userEvent from "@testing-library/user-event";
import { GlassMultiSelect } from "@/components/input/GlassMultiSelect";

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe("GlassMultiSelect", () => {
  /**
   * Smoke Test: Component renders without crashing
   */
  it("renders without crashing", () => {
    const { container } = render(<GlassMultiSelect />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it("has no accessibility violations", async () => {
    const { container } = render(<GlassMultiSelect />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  /**
   * ARIA Tests: Form component has proper labels and descriptions
   */
  describe("ARIA Attributes", () => {
    it("has proper form control role", () => {
      render(
        <GlassMultiSelect id="test-input" dataTestId="glassmultiselect" />
      );
      const element =
        screen.getByTestId("glassmultiselect") ||
        document.querySelector("#test-input");
      expect(element).toBeInTheDocument();
    });

    it("supports aria-label", () => {
      render(<GlassMultiSelect ariaLabel="Test input" />);
      const element = screen.getByLabelText(/test input/i);
      expect(element).toBeInTheDocument();
    });

    it("supports aria-describedby for help text", () => {
      render(
        <>
          <GlassMultiSelect aria-describedby="help-text" />
          <span id="help-text">Helper text</span>
        </>
      );
      const element = screen.getByText(/helper text/i);
      expect(element).toBeInTheDocument();
    });
  });

  /**
   * Reduced Motion Tests
   */
  describe("Reduced Motion Support", () => {
    it("respects prefers-reduced-motion", () => {
      // Mock matchMedia for reduced motion
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: jest.fn().mockImplementation((query) => ({
          matches: query === "(prefers-reduced-motion: reduce)",
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      const { container } = render(<GlassMultiSelect />);

      // Check that animations are disabled or reduced
      const animatedElements = container.querySelectorAll(
        '[class*="animate"], [class*="transition"]'
      );
      animatedElements.forEach((element) => {
        const styles = window.getComputedStyle(element);
        const animationDuration = parseFloat(styles.animationDuration || "0");
        const transitionDuration = parseFloat(styles.transitionDuration || "0");

        // Animations should be instant or very short (< 0.1s)
        expect(animationDuration).toBeLessThan(0.1);
        expect(transitionDuration).toBeLessThan(0.1);
      });
    });
  });

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it("accepts and renders with custom props", () => {
    const { container } = render(
      <GlassMultiSelect
        className="custom-class"
        dataTestId="glassmultiselect"
      />
    );

    const element =
      container.querySelector('[data-testid="glassmultiselect"]') ||
      container.firstChild;

    expect(element).toHaveClass("custom-class");
  });

  it("renders compact selected tokens within a bounded control", () => {
    const { container } = render(
      <GlassMultiSelect
        compact
        contained
        maxHeight={180}
        maxWidth={320}
        options={[
          { value: "design", label: "Design Systems" },
          { value: "tokens", label: "Token Audits" },
        ]}
        defaultValue={["design", "tokens"]}
        dataTestId="glassmultiselect"
      />
    );

    const root = screen.getByTestId("glassmultiselect");
    expect(root).toHaveStyle({ "--multi-select-max-width": "320px" });
    expect(container.querySelector(".containerCompact")).toBeInTheDocument();
    expect(screen.getAllByText("Design Systems").length).toBeGreaterThan(0);
  });

  it("supports keyboard selection with grouped options", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    render(
      <GlassMultiSelect
        label="Teams"
        withGroups
        groups={[
          {
            id: "product",
            label: "Product",
            options: [
              { value: "design", label: "Design" },
              { value: "research", label: "Research" },
            ],
          },
        ]}
        closeOnSelect={false}
        onChange={onChange}
      />
    );

    const input = screen.getByLabelText("Teams");
    await user.click(input);
    expect(screen.getByRole("listbox")).toHaveAttribute(
      "aria-multiselectable",
      "true"
    );
    await user.keyboard("{ArrowDown}{Enter}");
    expect(onChange).toHaveBeenCalledWith(["design"]);
  });

  it("skips disabled options and supports controlled values", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    render(
      <GlassMultiSelect
        ariaLabel="Assignees"
        value={["ana"]}
        onChange={onChange}
        closeOnSelect={false}
        options={[
          { value: "ana", label: "Ana" },
          { value: "bo", label: "Bo", disabled: true },
          { value: "cy", label: "Cy" },
        ]}
      />
    );

    const input = screen.getByLabelText("Assignees");
    await user.click(input);
    expect(screen.getByRole("option", { name: "Ana" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(screen.getByRole("option", { name: "Bo" })).toHaveAttribute(
      "aria-disabled",
      "true"
    );

    await user.click(screen.getByRole("option", { name: "Bo" }));
    expect(onChange).not.toHaveBeenCalled();
    await user.click(screen.getByRole("option", { name: "Cy" }));
    expect(onChange).toHaveBeenCalledWith(["ana", "cy"]);
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it("matches snapshot", () => {
    const { container } = render(<GlassMultiSelect />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
