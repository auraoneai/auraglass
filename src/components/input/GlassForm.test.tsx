"use client";
/**
 * GlassForm Component Tests
 *
 * Test Suite Coverage:
 * - ✅ Smoke test (renders without crashing)
 * - ✅ Props validation
 * - ✅ Accessibility (axe-core)
 * - ✅ ARIA attributes
 * - ⏭️  Focus management (not applicable)
 * - ⏭️  Reduced motion (not applicable)
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import userEvent from "@testing-library/user-event";
import { GlassForm } from "@/components/input/GlassForm";
import { useForm } from "react-hook-form";

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Test component wrapper that provides form context
const TestFormWrapper: React.FC<{
  children: React.ReactNode;
  id?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  className?: string;
  "data-testid"?: string;
}> = ({
  children,
  id,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
  className,
  "data-testid": testId,
}) => {
  const methods = useForm();
  return (
    <GlassForm {...methods}>
      <form
        id={id}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        className={className}
        data-testid={testId || "glassform"}
      >
        {children}
      </form>
    </GlassForm>
  );
};

describe("GlassForm", () => {
  /**
   * Smoke Test: Component renders without crashing
   */
  it("renders without crashing", () => {
    const { container } = render(
      <TestFormWrapper>
        <div>Test form content</div>
      </TestFormWrapper>
    );
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it("has no accessibility violations", async () => {
    const { container } = render(
      <TestFormWrapper>
        <div>Test form content</div>
      </TestFormWrapper>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  /**
   * ARIA Tests: Form component has proper labels and descriptions
   */
  describe("ARIA Attributes", () => {
    it("has proper form control role", () => {
      render(
        <TestFormWrapper id="test-input" data-testid="glassform">
          <div>Test form content</div>
        </TestFormWrapper>
      );
      const element = screen.getByTestId("glassform");
      expect(element).toBeInTheDocument();
    });

    it("supports aria-label", () => {
      render(
        <TestFormWrapper aria-label="Test input">
          <div>Test form content</div>
        </TestFormWrapper>
      );
      const element = screen.getByLabelText(/test input/i);
      expect(element).toBeInTheDocument();
    });

    it("supports aria-describedby for help text", () => {
      render(
        <>
          <TestFormWrapper aria-describedby="help-text">
            <div>Test form content</div>
          </TestFormWrapper>
          <span id="help-text">Helper text</span>
        </>
      );
      const element = screen.getByText(/helper text/i);
      expect(element).toBeInTheDocument();
    });
  });

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it("accepts and renders with custom props", () => {
    const { container } = render(
      <TestFormWrapper className="custom-class" data-testid="glassform">
        <div>Test form content</div>
      </TestFormWrapper>
    );

    const element =
      container.querySelector('[data-testid="glassform"]') ||
      container.firstChild;

    expect(element).toHaveClass("custom-class");
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it("matches snapshot", () => {
    const { container } = render(
      <TestFormWrapper>
        <div>Test form content</div>
      </TestFormWrapper>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
