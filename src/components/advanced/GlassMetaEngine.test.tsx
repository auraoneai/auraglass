"use client";
/**
 * GlassMetaEngine Component Tests
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
  GlassMetaEngine,
  GlassMetaEngineProvider,
} from "@/components/advanced/GlassMetaEngine";

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe("GlassMetaEngine", () => {
  /**
   * Smoke Test: Component renders without crashing
   */
  it("renders without crashing", () => {
    const { container } = render(
      <GlassMetaEngineProvider>
        <GlassMetaEngine />
      </GlassMetaEngineProvider>
    );
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it("has no accessibility violations", async () => {
    const { container } = render(
      <GlassMetaEngineProvider>
        <GlassMetaEngine />
      </GlassMetaEngineProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it("accepts and renders with custom props", () => {
    const { container } = render(
      <GlassMetaEngineProvider>
        <GlassMetaEngine
          className="custom-class"
          data-testid="glassmetaengine"
        />
      </GlassMetaEngineProvider>
    );

    const element =
      container.querySelector('[data-testid="glassmetaengine"]') ||
      container.firstChild;

    expect(element).toHaveClass("custom-class");
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it("matches snapshot", () => {
    const { container } = render(
      <GlassMetaEngineProvider>
        <GlassMetaEngine />
      </GlassMetaEngineProvider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
