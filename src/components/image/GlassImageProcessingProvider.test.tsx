"use client";
/**
 * GlassImageProcessingProvider Component Tests
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
  GlassImageProcessingProvider,
  useImageProcessing,
} from "@/components/image/GlassImageProcessingProvider";

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe("GlassImageProcessingProvider", () => {
  const StandaloneHookProbe = () => {
    const { images, autoOptimize, getOptimizationStats } = useImageProcessing();
    const stats = getOptimizationStats();

    return (
      <div>
        <span data-testid="image-count">{images.length}</span>
        <span data-testid="auto-optimize">{String(autoOptimize)}</span>
        <span data-testid="processed-count">{stats.imagesProcessed}</span>
      </div>
    );
  };

  /**
   * Smoke Test: Component renders without crashing
   */
  it("renders without crashing", () => {
    const { container } = render(
      <GlassImageProcessingProvider>
        <div>Test content</div>
      </GlassImageProcessingProvider>
    );
    expect(container).toBeInTheDocument();
  });

  it("provides a default no-op hook context outside the provider", () => {
    render(<StandaloneHookProbe />);

    expect(screen.getByTestId("image-count")).toHaveTextContent("0");
    expect(screen.getByTestId("auto-optimize")).toHaveTextContent("false");
    expect(screen.getByTestId("processed-count")).toHaveTextContent("0");
  });

  /**
   * Accessibility Test: No axe violations
   */
  it("has no accessibility violations", async () => {
    const { container } = render(
      <GlassImageProcessingProvider>
        <div>Test content</div>
      </GlassImageProcessingProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it("accepts and renders with custom props", () => {
    const { container } = render(
      <GlassImageProcessingProvider
        className="custom-class"
        data-testid="glassimageprocessingprovider"
      >
        <div>Test content</div>
      </GlassImageProcessingProvider>
    );

    const element =
      container.querySelector('[data-testid="glassimageprocessingprovider"]') ||
      container.firstChild;

    expect(element).toHaveClass("custom-class");
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it("matches snapshot", () => {
    const { container } = render(
      <GlassImageProcessingProvider>
        <div>Test content</div>
      </GlassImageProcessingProvider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
