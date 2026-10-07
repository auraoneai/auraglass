"use client";
/**
 * GlassWebGLShader Component Tests
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
import { GlassWebGLShader } from "@/components/advanced/GlassWebGLShader";

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe("GlassWebGLShader", () => {
  /**
   * Smoke Test: Component renders without crashing
   */
  it("renders without crashing", () => {
    const { container } = render(<GlassWebGLShader />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it("has no accessibility violations", async () => {
    const { container } = render(<GlassWebGLShader />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it("accepts and renders with custom props", () => {
    const { container } = render(
      <GlassWebGLShader
        className="custom-class"
        data-testid="glasswebglshader"
      />
    );

    const element =
      container.querySelector('[data-testid="glasswebglshader"]') ||
      container.firstChild;

    expect(element).toHaveClass("custom-class");
  });

  it("renders a CSS fallback without creating a WebGL canvas when renderMode is css", () => {
    const { container } = render(
      <GlassWebGLShader renderMode="css" variant="prism" />
    );

    expect(container.querySelector("canvas")).toBeNull();
    expect(screen.getByText("prism glass field")).toBeInTheDocument();
    expect(
      screen.getByText("Lightweight preview mode active.")
    ).toBeInTheDocument();
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it("matches snapshot", () => {
    const { container } = render(<GlassWebGLShader />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
