"use client";
/**
 * GlassContextAware Component Tests
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
import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import userEvent from "@testing-library/user-event";
import { GlassContextAware } from "@/components/advanced/GlassContextAware";

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe("GlassContextAware", () => {
  /**
   * Smoke Test: Component renders without crashing
   */
  it("renders without crashing", () => {
    const { container } = render(
      <GlassContextAware>
        <div>content</div>
      </GlassContextAware>
    );
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it("has no accessibility violations", async () => {
    const { container } = render(
      <GlassContextAware>
        <div>content</div>
      </GlassContextAware>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it("accepts and renders with custom props", () => {
    const { container } = render(
      <GlassContextAware
        className="custom-class"
        data-testid="glasscontextaware"
      >
        <div>content</div>
      </GlassContextAware>
    );

    const element =
      container.querySelector('[data-testid="glasscontextaware"]') ||
      container.firstChild;

    expect(element).toHaveClass("custom-class");
  });

  it("renders children inside the adaptive glass surface", () => {
    render(
      <GlassContextAware>
        <div>content</div>
      </GlassContextAware>
    );

    expect(document.body).toHaveTextContent("content");
  });

  it("renders on the server without browser globals", () => {
    const { renderToString } = require("react-dom/server.node");
    const originalWindow = global.window;
    const originalDocument = global.document;
    const originalNavigator = global.navigator;
    const originalConsoleError = console.error;
    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation((...args: unknown[]) => {
        const message = String(args[0] ?? "");
        if (message.includes("useLayoutEffect does nothing on the server")) {
          return;
        }
        originalConsoleError(...args);
      });

    Object.defineProperty(global, "window", {
      configurable: true,
      value: undefined,
    });
    Object.defineProperty(global, "document", {
      configurable: true,
      value: undefined,
    });
    Object.defineProperty(global, "navigator", {
      configurable: true,
      value: undefined,
    });

    try {
      expect(() =>
        renderToString(
          <GlassContextAware>
            <div>content</div>
          </GlassContextAware>
        )
      ).not.toThrow();
    } finally {
      Object.defineProperty(global, "window", {
        configurable: true,
        value: originalWindow,
      });
      Object.defineProperty(global, "document", {
        configurable: true,
        value: originalDocument,
      });
      Object.defineProperty(global, "navigator", {
        configurable: true,
        value: originalNavigator,
      });
      consoleError.mockRestore();
    }
  });
});
