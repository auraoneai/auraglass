/**
 * AuraGlass Accessibility Testing Framework
 * Automated accessibility testing utilities for WCAG 2.1 AA compliance
 */

export interface A11yTestResult {
  element: HTMLElement;
  rule: string;
  level: "error" | "warning" | "info";
  message: string;
  suggestion?: string;
  wcagReference?: string;
}

export interface A11yTestSuite {
  name: string;
  description: string;
  tests: A11yTest[];
}

export interface A11yTest {
  name: string;
  rule: string;
  test: (element: HTMLElement) => A11yTestResult[];
  selector?: string;
}

/**
 * Color contrast utilities
 */
export const ColorContrast = {
  /**
   * Convert hex color to RGB
   */
  hexToRgb(hex: string): [number, number, number] | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? [
          parseInt(result[1], 16),
          parseInt(result[2], 16),
          parseInt(result[3], 16),
        ]
      : null;
  },

  /**
   * Calculate relative luminance
   */
  getLuminance(r: number, g: number, b: number): number {
    const [rs, gs, bs] = [r, g, b].map((c: any) => {
      const sRGB = c / 255;
      return sRGB <= 0.03928
        ? sRGB / 12.92
        : Math.pow((sRGB + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  },

  /**
   * Calculate contrast ratio between two colors
   */
  getContrastRatio(color1: string, color2: string): number {
    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);

    if (!rgb1 || !rgb2) return 1;

    const lum1 = this.getLuminance(...rgb1);
    const lum2 = this.getLuminance(...rgb2);

    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);

    return (lighter + 0.05) / (darker + 0.05);
  },

  /**
   * Check if contrast ratio meets WCAG standards
   */
  meetsWCAG(
    ratio: number,
    level: "AA" | "AAA" = "AA",
    textSize: "normal" | "large" = "normal"
  ): boolean {
    if (level === "AAA") {
      return textSize === "large" ? ratio >= 4.5 : ratio >= 7;
    }
    return textSize === "large" ? ratio >= 3 : ratio >= 4.5;
  },
};

/**
 * Focus management tests
 */
export const FocusTests: A11yTestSuite = {
  name: "Focus Management",
  description: "Tests for proper focus management and keyboard navigation",
  tests: [
    {
      name: "Focusable Elements Have Visible Focus Indicator",
      rule: "focus-visible-indicator",
      selector:
        'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])',
      test: (element) => {
        const results: A11yTestResult[] = [];
        const computedStyle = window.getComputedStyle(element, ":focus");

        // Check for focus outline, box-shadow, or background change
        const hasOutline =
          computedStyle.outline !== "none" && computedStyle.outline !== "";
        const hasBoxShadow = computedStyle.boxShadow !== "none";
        const hasBorder = computedStyle.borderWidth !== "0px";

        if (!hasOutline && !hasBoxShadow && !hasBorder) {
          results.push({
            element,
            rule: "focus-visible-indicator",
            level: "error",
            message: "Focusable element lacks visible focus indicator",
            suggestion:
              "Add CSS focus styles with outline, box-shadow, or border",
            wcagReference: "WCAG 2.1 2.4.7 Focus Visible",
          });
        }

        return results;
      },
    },
    {
      name: "Tab Order is Logical",
      rule: "logical-tab-order",
      test: (element) => {
        const results: A11yTestResult[] = [];
        const focusableElements = Array.from(
          element.querySelectorAll<HTMLElement>(
            'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        );

        focusableElements.forEach((el, index) => {
          const tabIndex = parseInt(el.getAttribute("tabindex") || "0");
          const nextEl = focusableElements[index + 1];

          if (nextEl && tabIndex > 0) {
            const nextTabIndex = parseInt(
              nextEl.getAttribute("tabindex") || "0"
            );
            if (nextTabIndex > 0 && tabIndex > nextTabIndex) {
              results.push({
                element: el,
                rule: "logical-tab-order",
                level: "warning",
                message: "Tab order may not be logical",
                suggestion:
                  "Ensure tabindex values create logical navigation order",
                wcagReference: "WCAG 2.1 2.4.3 Focus Order",
              });
            }
          }
        });

        return results;
      },
    },
  ],
};

/**
 * ARIA tests
 */
export const AriaTests: A11yTestSuite = {
  name: "ARIA Attributes",
  description: "Tests for proper ARIA implementation",
  tests: [
    {
      name: "ARIA Labels and Descriptions",
      rule: "aria-labeling",
      selector: "[aria-label], [aria-labelledby], [aria-describedby]",
      test: (element) => {
        const results: A11yTestResult[] = [];

        const ariaLabel = element.getAttribute("aria-label");
        const ariaLabelledBy = element.getAttribute("aria-labelledby");
        const ariaDescribedBy = element.getAttribute("aria-describedby");

        // Check if referenced elements exist
        if (ariaLabelledBy) {
          const ids = ariaLabelledBy.split(" ");
          ids.forEach((id: any) => {
            if (!document.getElementById(id.trim())) {
              results.push({
                element,
                rule: "aria-labeling",
                level: "error",
                message: `Referenced element with id "${id}" not found`,
                suggestion: "Ensure all referenced IDs exist in the document",
                wcagReference: "WCAG 2.1 4.1.2 Name, Role, Value",
              });
            }
          });
        }

        if (ariaDescribedBy) {
          const ids = ariaDescribedBy.split(" ");
          ids.forEach((id: any) => {
            if (!document.getElementById(id.trim())) {
              results.push({
                element,
                rule: "aria-labeling",
                level: "error",
                message: `Referenced description element with id "${id}" not found`,
                suggestion:
                  "Ensure all referenced description IDs exist in the document",
                wcagReference: "WCAG 2.1 4.1.2 Name, Role, Value",
              });
            }
          });
        }

        // Check for empty labels
        if (ariaLabel === "") {
          results.push({
            element,
            rule: "aria-labeling",
            level: "error",
            message: "aria-label is empty",
            suggestion:
              "Provide meaningful aria-label text or remove the attribute",
            wcagReference: "WCAG 2.1 4.1.2 Name, Role, Value",
          });
        }

        return results;
      },
    },
    {
      name: "Interactive Elements Have Accessible Names",
      rule: "interactive-accessible-name",
      selector: "button, a, input, select, textarea",
      test: (element) => {
        const results: A11yTestResult[] = [];

        const tagName = element.tagName.toLowerCase();
        const type = element.getAttribute("type");
        const ariaLabel = element.getAttribute("aria-label");
        const ariaLabelledBy = element.getAttribute("aria-labelledby");
        const textContent = element.textContent?.trim();
        const altText = element.getAttribute("alt");
        const title = element.getAttribute("title");
        const placeholder = element.getAttribute("placeholder");

        // Skip certain input types that don't need accessible names
        if (
          tagName === "input" &&
          ["hidden", "submit", "reset", "button"].includes(type || "")
        ) {
          return results;
        }

        const hasAccessibleName =
          ariaLabel ||
          ariaLabelledBy ||
          textContent ||
          altText ||
          title ||
          (tagName === "input" && placeholder);

        if (!hasAccessibleName) {
          results.push({
            element,
            rule: "interactive-accessible-name",
            level: "error",
            message: "Interactive element lacks accessible name",
            suggestion:
              "Add aria-label, visible text content, or associated label",
            wcagReference: "WCAG 2.1 4.1.2 Name, Role, Value",
          });
        }

        return results;
      },
    },
    {
      name: "ARIA States and Properties",
      rule: "aria-states-properties",
      selector:
        "[aria-expanded], [aria-checked], [aria-selected], [aria-pressed]",
      test: (element) => {
        const results: A11yTestResult[] = [];

        const ariaExpanded = element.getAttribute("aria-expanded");
        const ariaChecked = element.getAttribute("aria-checked");
        const ariaSelected = element.getAttribute("aria-selected");
        const ariaPressed = element.getAttribute("aria-pressed");

        // Validate boolean values
        const booleanAttrs = [
          { attr: "aria-expanded", value: ariaExpanded },
          { attr: "aria-checked", value: ariaChecked },
          { attr: "aria-selected", value: ariaSelected },
          { attr: "aria-pressed", value: ariaPressed },
        ];

        booleanAttrs.forEach(({ attr, value }) => {
          if (value !== null && !["true", "false", "mixed"].includes(value)) {
            results.push({
              element,
              rule: "aria-states-properties",
              level: "error",
              message: `Invalid ${attr} value: "${value}"`,
              suggestion: `Use "true", "false", or "mixed" for ${attr}`,
              wcagReference: "WCAG 2.1 4.1.2 Name, Role, Value",
            });
          }
        });

        return results;
      },
    },
  ],
};

/**
 * Keyboard navigation tests
 */
export const KeyboardTests: A11yTestSuite = {
  name: "Keyboard Navigation",
  description: "Tests for keyboard accessibility",
  tests: [
    {
      name: "Custom Interactive Elements Have Proper Roles",
      rule: "custom-interactive-roles",
      selector:
        "[onclick]:not(button):not(a):not(input):not(select):not(textarea)",
      test: (element) => {
        const results: A11yTestResult[] = [];
        const role = element.getAttribute("role");
        const tabindex = element.getAttribute("tabindex");

        if (!role || !["button", "link", "menuitem", "tab"].includes(role)) {
          results.push({
            element,
            rule: "custom-interactive-roles",
            level: "error",
            message: "Custom interactive element lacks proper role",
            suggestion:
              "Add appropriate role attribute (button, link, menuitem, etc.)",
            wcagReference: "WCAG 2.1 4.1.2 Name, Role, Value",
          });
        }

        if (tabindex === null || parseInt(tabindex) < 0) {
          results.push({
            element,
            rule: "custom-interactive-roles",
            level: "error",
            message: "Custom interactive element not keyboard focusable",
            suggestion: 'Add tabindex="0" to make element focusable',
            wcagReference: "WCAG 2.1 2.1.1 Keyboard",
          });
        }

        return results;
      },
    },
  ],
};

/**
 * Color and contrast tests
 */
export const ColorContrastTests: A11yTestSuite = {
  name: "Color and Contrast",
  description: "Tests for sufficient color contrast and color accessibility",
  tests: [
    {
      name: "Text Color Contrast",
      rule: "text-contrast",
      selector: "p, span, div, h1, h2, h3, h4, h5, h6, button, a, label",
      test: (element) => {
        const results: A11yTestResult[] = [];
        const computedStyle = window.getComputedStyle(element);
        const color = computedStyle.color;
        const backgroundColor = computedStyle.backgroundColor;

        // Skip if colors are not in rgb format or transparent
        if (!color.startsWith("rgb") || !backgroundColor.startsWith("rgb")) {
          return results;
        }

        try {
          // Simple contrast check (would need more sophisticated implementation)
          const fontSize = parseFloat(computedStyle.fontSize);
          const fontWeight = computedStyle.fontWeight;
          const isLargeText =
            fontSize >= 18 ||
            (fontSize >= 14 &&
              (fontWeight === "bold" || parseInt(fontWeight) >= 700));

          // This is a simplified check - real implementation would need proper color parsing
          // For now, just check for obvious issues
          if (color === backgroundColor) {
            results.push({
              element,
              rule: "text-contrast",
              level: "error",
              message: "Text color is the same as background color",
              suggestion:
                "Ensure sufficient contrast between text and background",
              wcagReference: "WCAG 2.1 1.4.3 Contrast (Minimum)",
            });
          }
        } catch (error) {
          // Skip if we can't parse colors properly
        }

        return results;
      },
    },
  ],
};

/**
 * Form accessibility tests
 */
export const FormTests: A11yTestSuite = {
  name: "Form Accessibility",
  description: "Tests for accessible form implementation",
  tests: [
    {
      name: "Form Inputs Have Labels",
      rule: "form-input-labels",
      selector:
        'input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="reset"]), select, textarea',
      test: (element) => {
        const results: A11yTestResult[] = [];

        const id = element.getAttribute("id");
        const ariaLabel = element.getAttribute("aria-label");
        const ariaLabelledBy = element.getAttribute("aria-labelledby");
        const title = element.getAttribute("title");

        // Check for associated label
        let hasLabel = false;
        if (id) {
          const label = document.querySelector(`label[for="${id}"]`);
          hasLabel = !!label;
        }

        // Check if input is inside a label
        const parentLabel = element.closest("label");
        if (parentLabel) {
          hasLabel = true;
        }

        if (!hasLabel && !ariaLabel && !ariaLabelledBy && !title) {
          results.push({
            element,
            rule: "form-input-labels",
            level: "error",
            message: "Form input lacks accessible label",
            suggestion: "Add a <label> element, aria-label, or aria-labelledby",
            wcagReference: "WCAG 2.1 3.3.2 Labels or Instructions",
          });
        }

        return results;
      },
    },
    {
      name: "Required Fields Are Indicated",
      rule: "required-field-indication",
      selector: "input[required], select[required], textarea[required]",
      test: (element) => {
        const results: A11yTestResult[] = [];

        const ariaRequired = element.getAttribute("aria-required");
        const hasRequiredInLabel = !!element
          .closest("label")
          ?.textContent?.includes("*");
        const id = element.getAttribute("id");
        const externalLabel = id
          ? document.querySelector(`label[for="${id}"]`)
          : null;
        const hasRequiredInExternalLabel =
          !!externalLabel?.textContent?.includes("*");

        if (
          ariaRequired !== "true" &&
          !hasRequiredInLabel &&
          !hasRequiredInExternalLabel
        ) {
          results.push({
            element,
            rule: "required-field-indication",
            level: "warning",
            message: "Required field lacks clear indication for screen readers",
            suggestion:
              'Add aria-required="true" or include "required" in the label text',
            wcagReference: "WCAG 2.1 3.3.2 Labels or Instructions",
          });
        }

        return results;
      },
    },
  ],
};

/**
 * Main accessibility testing function
 */
export class A11yTester {
  private testSuites: A11yTestSuite[] = [
    FocusTests,
    AriaTests,
    KeyboardTests,
    ColorContrastTests,
    FormTests,
  ];

  /**
   * Add custom test suite
   */
  addTestSuite(testSuite: A11yTestSuite) {
    this.testSuites.push(testSuite);
  }

  /**
   * Run all tests on a container element
   */
  runTests(container: HTMLElement = document.body): A11yTestResult[] {
    const results: A11yTestResult[] = [];

    this.testSuites.forEach((suite: any) => {
      suite.tests.forEach((test: any) => {
        if (test.selector) {
          // Run test on elements matching selector
          const elements = container.querySelectorAll<HTMLElement>(
            test.selector
          );
          elements.forEach((element: any) => {
            const testResults = test.test(element);
            results.push(...testResults);
          });
        } else {
          // Run test on container
          const testResults = test.test(container);
          results.push(...testResults);
        }
      });
    });

    return results;
  }

  /**
   * Run specific test by rule name
   */
  runTestByRule(
    rule: string,
    container: HTMLElement = document.body
  ): A11yTestResult[] {
    const results: A11yTestResult[] = [];

    this.testSuites.forEach((suite: any) => {
      const test = suite.tests.find((t: any) => t.rule === rule);
      if (test) {
        if (test.selector) {
          const elements = container.querySelectorAll<HTMLElement>(
            test.selector
          );
          elements.forEach((element: any) => {
            const testResults = test.test(element);
            results.push(...testResults);
          });
        } else {
          const testResults = test.test(container);
          results.push(...testResults);
        }
      }
    });

    return results;
  }

  /**
   * Generate accessibility report
   */
  generateReport(results: A11yTestResult[]): string {
    const errors = results.filter((r: any) => r.level === "error");
    const warnings = results.filter((r: any) => r.level === "warning");
    const info = results.filter((r: any) => r.level === "info");

    let report = "# Accessibility Test Report\n\n";
    report += `- **Errors:** ${errors.length}\n`;
    report += `- **Warnings:** ${warnings.length}\n`;
    report += `- **Info:** ${info.length}\n`;
    report += `- **Total Issues:** ${results.length}\n\n`;

    if (errors.length > 0) {
      report += "## Errors\n\n";
      errors.forEach((error, index) => {
        report += `### ${index + 1}. ${error.message}\n`;
        report += `- **Rule:** ${error.rule}\n`;
        report += `- **Element:** ${error.element.tagName.toLowerCase()}`;
        if (error.element.id) report += `#${error.element.id}`;
        if (error.element.className)
          report += `.${error.element.className.replace(/\s+/g, ".")}`;
        report += "\n";
        if (error.suggestion)
          report += `- **Suggestion:** ${error.suggestion}\n`;
        if (error.wcagReference)
          report += `- **WCAG Reference:** ${error.wcagReference}\n`;
        report += "\n";
      });
    }

    if (warnings.length > 0) {
      report += "## Warnings\n\n";
      warnings.forEach((warning, index) => {
        report += `### ${index + 1}. ${warning.message}\n`;
        report += `- **Rule:** ${warning.rule}\n`;
        report += `- **Element:** ${warning.element.tagName.toLowerCase()}`;
        if (warning.element.id) report += `#${warning.element.id}`;
        if (warning.element.className)
          report += `.${warning.element.className.replace(/\s+/g, ".")}`;
        report += "\n";
        if (warning.suggestion)
          report += `- **Suggestion:** ${warning.suggestion}\n`;
        if (warning.wcagReference)
          report += `- **WCAG Reference:** ${warning.wcagReference}\n`;
        report += "\n";
      });
    }

    return report;
  }
}

/**
 * Global accessibility tester instance
 */
export const a11yTester = new A11yTester();

/**
 * Helper function to quickly test an element
 */
export function testA11y(element?: HTMLElement): A11yTestResult[] {
  return a11yTester.runTests(element);
}

/**
 * Helper function to log accessibility issues to console
 */
export function logA11yIssues(element?: HTMLElement) {
  const results = testA11y(element);
  const output = globalThis.console;

  if (results.length === 0) {
    output.log("✅ No accessibility issues found");
    return;
  }

  const errors = results.filter((r: any) => r.level === "error");
  const warnings = results.filter((r: any) => r.level === "warning");

  output.group("🔍 Accessibility Test Results");

  if (errors.length > 0) {
    output.group("❌ Errors");
    errors.forEach((error: any) => {
      output.error(error.message, error.element);
      if (error.suggestion) output.log("💡 Suggestion:", error.suggestion);
    });
    output.groupEnd();
  }

  if (warnings.length > 0) {
    output.group("⚠️ Warnings");
    warnings.forEach((warning: any) => {
      output.warn(warning.message, warning.element);
      if (warning.suggestion) output.log("💡 Suggestion:", warning.suggestion);
    });
    output.groupEnd();
  }

  output.groupEnd();
}

/**
 * Development-only automatic testing (only runs in development)
 */
export function enableA11yTesting() {
  if (process.env.NODE_ENV !== "development") return;

  // Test on DOM changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as HTMLElement;
            const results = testA11y(element);

            if (results.length > 0) {
              console.group("🔍 Accessibility issues detected in new content");
              logA11yIssues(element);
              console.groupEnd();
            }
          }
        });
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Add global testing function
  (window as any).testA11y = testA11y;
  (window as any).logA11yIssues = logA11yIssues;
}
