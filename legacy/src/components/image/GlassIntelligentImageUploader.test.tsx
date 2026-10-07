"use client";
/**
 * GlassIntelligentImageUploader Component Tests
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
import { GlassIntelligentImageUploader } from "@/components/image/GlassIntelligentImageUploader";
import { ImageProcessingProvider } from "@/components/image/GlassImageProcessingProvider";

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Test wrapper with provider
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ImageProcessingProvider>{children}</ImageProcessingProvider>
);

describe("GlassIntelligentImageUploader", () => {
  /**
   * Smoke Test: Component renders without crashing
   */
  it("renders without crashing", () => {
    const { container } = render(<GlassIntelligentImageUploader />, {
      wrapper: TestWrapper,
    });
    expect(container).toBeInTheDocument();
  });

  it("renders without an ImageProcessingProvider for standalone previews", () => {
    const { container } = render(<GlassIntelligentImageUploader />);
    expect(container).toBeInTheDocument();
    expect(screen.getByText(/Intelligent Image Uploader/)).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it("has no accessibility violations", async () => {
    const { container } = render(<GlassIntelligentImageUploader />, {
      wrapper: TestWrapper,
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  /**
   * ARIA Tests: Component has accessible name and description
   */
  describe("ARIA Attributes", () => {
    it("supports aria-label", () => {
      const { container } = render(
        <GlassIntelligentImageUploader aria-label="Test component" />,
        { wrapper: TestWrapper }
      );
      const element = container.querySelector('[aria-label="Test component"]');
      expect(element).toBeInTheDocument();
    });
  });

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it("accepts and renders with custom props", () => {
    const { container } = render(
      <GlassIntelligentImageUploader
        className="custom-class"
        data-testid="glassintelligentimageuploader"
      />,
      { wrapper: TestWrapper }
    );

    const element =
      container.querySelector(
        '[data-testid="glassintelligentimageuploader"]'
      ) || container.firstChild;

    expect(element).toHaveClass("custom-class");
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it("matches snapshot", () => {
    const { container } = render(<GlassIntelligentImageUploader />, {
      wrapper: TestWrapper,
    });
    expect(container.firstChild).toMatchSnapshot();
  });
});
