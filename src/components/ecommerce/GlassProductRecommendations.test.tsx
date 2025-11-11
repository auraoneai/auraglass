"use client";
/**
 * GlassProductRecommendations Component Tests
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
import { GlassProductRecommendations } from "@/components/ecommerce/GlassProductRecommendations";
import { EcommerceProvider } from "@/components/ecommerce/GlassEcommerceProvider";

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <EcommerceProvider>{children}</EcommerceProvider>
);

describe("GlassProductRecommendations", () => {
  const mockProducts = [{ id: "1", name: "Product 1", price: 99 }];

  /**
   * Smoke Test: Component renders without crashing
   */
  it("renders without crashing", () => {
    const { container } = render(
      <GlassProductRecommendations products={mockProducts} />,
      { wrapper: TestWrapper }
    );
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it("has no accessibility violations", async () => {
    const { container } = render(
      <GlassProductRecommendations products={mockProducts} />,
      { wrapper: TestWrapper }
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it("accepts and renders with custom props", () => {
    const { container } = render(
      <GlassProductRecommendations
        products={mockProducts}
        className="custom-class"
        data-testid="glassproductrecommendations"
      />,
      { wrapper: TestWrapper }
    );

    const element =
      container.querySelector('[data-testid="glassproductrecommendations"]') ||
      container.firstChild;

    expect(element).toHaveClass("custom-class");
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it("matches snapshot", () => {
    const { container } = render(
      <GlassProductRecommendations products={mockProducts} />,
      { wrapper: TestWrapper }
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
