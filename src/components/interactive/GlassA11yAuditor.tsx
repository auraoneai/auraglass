import React, { useState, useEffect, useCallback, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { OptimizedGlass, Motion } from "../../primitives";
import { useA11yId } from "../../utils/a11y";
import { useReducedMotion } from "../../hooks/useReducedMotion";

export interface A11yIssue {
  id: string;
  type: "error" | "warning" | "info";
  rule: string;
  message: string;
  element?: string;
  line?: number;
  column?: number;
  code?: string;
  suggestion?: string;
  wcag?: string;
}

export interface A11yAuditResult {
  score: number;
  issues: A11yIssue[];
  summary: {
    errors: number;
    warnings: number;
    info: number;
  };
  timestamp: number;
}

export interface GlassA11yAuditorProps {
  /** Content to audit */
  children?: React.ReactNode;
  /** Whether to show audit panel */
  showPanel?: boolean;
  /** Whether to run audit automatically */
  autoAudit?: boolean;
  /** Audit rules to check */
  rules?: string[];
  /** Custom className */
  className?: string;
  /** Audit complete handler */
  onAuditComplete?: (result: A11yAuditResult) => void;
  /** Issue click handler */
  onIssueClick?: (issue: A11yIssue) => void;
  /** Respect user's motion preferences */
  respectMotionPreference?: boolean;
  /** Custom ID */
  id?: string;
}

const defaultRules = [
  "img-alt",
  "heading-order",
  "color-contrast",
  "aria-label",
  "keyboard-navigation",
  "focus-visible",
  "semantic-html",
  "lang-attribute",
  "aria-describedby",
  "aria-labelledby",
];

export const GlassA11yAuditor = forwardRef<
  HTMLDivElement,
  GlassA11yAuditorProps
>(
  (
    {
      children,
      showPanel = true,
      autoAudit = false,
      rules = defaultRules,
      className = "",
      onAuditComplete,
      onIssueClick,
      respectMotionPreference = true,
      id,
      ...props
    },
    ref
  ) => {
    const [isAuditing, setIsAuditing] = useState(false);
    const [auditResult, setAuditResult] = useState<A11yAuditResult | null>(
      null
    );
    const [selectedIssue, setSelectedIssue] = useState<A11yIssue | null>(null);
    const [filter, setFilter] = useState<"all" | "error" | "warning" | "info">(
      "all"
    );
    const [highlightedElement, setHighlightedElement] =
      useState<Element | null>(null);
    const prefersReducedMotion = useReducedMotion();
    const componentId = id || useA11yId("a11y-auditor");

    // Run accessibility audit
    const runAudit = useCallback(async () => {
      setIsAuditing(true);

      try {
        const issues: A11yIssue[] = [];

        // Check images for alt text
        if (rules.includes("img-alt")) {
          const images = document.querySelectorAll("img");
          images.forEach((img, index) => {
            if (!img.getAttribute("alt") && !img.getAttribute("aria-label")) {
              issues.push({
                id: `img-alt-${index}`,
                type: "error",
                rule: "img-alt",
                message: "Image missing alt text",
                element: "img",
                code: img.outerHTML.substring(0, 100) + "...",
                suggestion: "Add alt attribute describing the image content",
                wcag: "1.1.1 Non-text Content",
              });
            }
          });
        }

        // Check heading hierarchy
        if (rules.includes("heading-order")) {
          const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
          let lastLevel = 0;

          headings.forEach((heading, index) => {
            const level = parseInt(heading.tagName.charAt(1));
            if (level > lastLevel + 1 && lastLevel !== 0) {
              issues.push({
                id: `heading-order-${index}`,
                type: "warning",
                rule: "heading-order",
                message: `Skipped heading level: went from H${lastLevel} to H${level}`,
                element: heading.tagName.toLowerCase(),
                code: heading.outerHTML,
                suggestion: "Ensure heading hierarchy is sequential",
                wcag: "1.3.1 Info and Relationships",
              });
            }
            lastLevel = level;
          });
        }

        // Check ARIA labels
        if (rules.includes("aria-label")) {
          const interactiveElements = document.querySelectorAll(
            "button, input, select, textarea, [role]"
          );
          interactiveElements.forEach((element, index) => {
            const hasLabel =
              element.getAttribute("aria-label") ||
              element.getAttribute("aria-labelledby") ||
              element.textContent?.trim() ||
              element.getAttribute("placeholder");

            if (!hasLabel && !element.getAttribute("aria-hidden")) {
              issues.push({
                id: `aria-label-${index}`,
                type: "error",
                rule: "aria-label",
                message: "Interactive element missing accessible label",
                element: element.tagName.toLowerCase(),
                code: element.outerHTML.substring(0, 100) + "...",
                suggestion: "Add aria-label, aria-labelledby, or visible text",
                wcag: "4.1.2 Name, Role, Value",
              });
            }
          });
        }

        // Check focus visibility
        if (rules.includes("focus-visible")) {
          const focusableElements = document.querySelectorAll(
            "button, input, select, textarea, a, [tabindex]"
          );
          focusableElements.forEach((element, index) => {
            const computedStyle = window.getComputedStyle(element);
            const hasVisibleFocus =
              computedStyle.outline !== "none" ||
              computedStyle.boxShadow !== "none" ||
              element.classList.contains("focus-visible");

            if (!hasVisibleFocus) {
              issues.push({
                id: `focus-visible-${index}`,
                type: "warning",
                rule: "focus-visible",
                message: "Element may not have visible focus indicator",
                element: element.tagName.toLowerCase(),
                code: element.outerHTML.substring(0, 100) + "...",
                suggestion:
                  "Ensure focus is visible when navigating with keyboard",
                wcag: "2.4.7 Focus Visible",
              });
            }
          });
        }

        // Check semantic HTML
        if (rules.includes("semantic-html")) {
          const divs = document.querySelectorAll("div[role]");
          divs.forEach((div, index) => {
            const role = div.getAttribute("role");
            const semanticAlternatives: Record<string, string> = {
              button: "button",
              heading: "h1-h6",
              list: "ul/ol",
              listitem: "li",
              navigation: "nav",
              main: "main",
              article: "article",
              section: "section",
            };

            if (role && semanticAlternatives[role]) {
              issues.push({
                id: `semantic-html-${index}`,
                type: "info",
                rule: "semantic-html",
                message: `Consider using semantic ${semanticAlternatives[role]} instead of div[role="${role}"]`,
                element: "div",
                code: div.outerHTML.substring(0, 100) + "...",
                suggestion: `Replace with <${semanticAlternatives[role]}> element`,
                wcag: "1.3.1 Info and Relationships",
              });
            }
          });
        }

        // Check language attribute
        if (rules.includes("lang-attribute")) {
          const html = document.documentElement;
          if (!html.getAttribute("lang")) {
            issues.push({
              id: "lang-attribute",
              type: "error",
              rule: "lang-attribute",
              message: "Missing lang attribute on html element",
              element: "html",
              suggestion: "Add lang attribute to specify document language",
              wcag: "3.1.1 Language of Page",
            });
          }
        }

        // Calculate score (0-100)
        const errorWeight = 10;
        const warningWeight = 5;
        const infoWeight = 1;

        const errors = issues.filter((i: any) => i.type === "error").length;
        const warnings = issues.filter((i: any) => i.type === "warning").length;
        const infos = issues.filter((i: any) => i.type === "info").length;

        const totalWeight =
          errors * errorWeight + warnings * warningWeight + infos * infoWeight;
        const score = Math.max(0, 100 - totalWeight);

        const result: A11yAuditResult = {
          score,
          issues,
          summary: { errors, warnings, info: infos },
          timestamp: Date.now(),
        };

        setAuditResult(result);
        onAuditComplete?.(result);
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error("A11y audit failed:", error);
        }
      } finally {
        setIsAuditing(false);
      }
    }, [rules, onAuditComplete]);

    // Auto-run audit
    useEffect(() => {
      if (autoAudit) {
        runAudit();
      }
    }, [autoAudit, runAudit]);

    // Filter issues
    const filteredIssues =
      auditResult?.issues.filter(
        (issue: any) => filter === "all" || issue.type === filter
      ) || [];

    // Handle issue selection
    const handleIssueClick = (issue: A11yIssue) => {
      setSelectedIssue(issue);
      onIssueClick?.(issue);

      // Try to highlight the element
      if (issue.element && issue.code) {
        // Element highlighting with scroll-to-view functionality
        const elements = document.querySelectorAll(issue.element);
        if (elements.length > 0) {
          setHighlightedElement(elements[0] as Element);
          elements[0].scrollIntoView({ behavior: "smooth", block: "center" });

          // Add temporary highlight
          elements[0].classList.add("a11y-highlight");
          setTimeout(() => {
            elements[0].classList.remove("a11y-highlight");
            setHighlightedElement(null);
          }, 3000);
        }
      }
    };

    // Get score color
    const getScoreColor = (score: number) => {
      if (score >= 90) return "text-green-400";
      if (score >= 70) return "text-yellow-400";
      return "text-red-400";
    };

    // Get issue type color
    const getIssueTypeColor = (type: A11yIssue["type"]) => {
      switch (type) {
        case "error":
          return "text-red-400 bg-red-500/10 border-red-500/20";
        case "warning":
          return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
        case "info":
          return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      }
    };

    if (!showPanel) {
      return <>{children}</>;
    }

    return (
      <Motion preset="fadeIn" className={`flex flex-col h-full ${className}`}>
        <div
          ref={ref}
          id={componentId}
          className="glass-flex glass-flex-col glass-h-full"
          role="application"
          aria-label="Accessibility auditing tool"
          aria-describedby={`${componentId}-description`}
          {...props}
        >
          <div id={`${componentId}-description`} className="sr-only">
            Accessibility audit tool for analyzing and improving web
            accessibility
          </div>
          {/* Audit Controls */}
          <OptimizedGlass
            className="glass-p-4 mb-4"
            intensity="medium"
            elevation="level1"
          >
            <div className="glass-flex glass-items-center glass-justify-between mb-4">
              <h3 className="glass-text-lg font-semibold text-primary">
                Accessibility Audit
              </h3>
              <button
                onClick={runAudit}
                disabled={isAuditing}
                className="glass-px-4 glass-py-2 glass-surface-blue/20 glass-text-secondary glass-radius-md hover:glass-surface-blue/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard"
                aria-label={
                  isAuditing
                    ? "Auditing accessibility issues"
                    : "Run accessibility audit"
                }
              >
                {isAuditing ? "Auditing..." : "Run Audit"}
              </button>
            </div>

            {/* Score Display */}
            {auditResult && (
              <div className="glass-grid glass-grid-cols-2 md:grid-cols-4 glass-gap-4">
                <div className="text-center">
                  <div
                    className={`glass-text-2xl font-bold ${getScoreColor(auditResult.score)}`}
                  >
                    {auditResult.score}
                  </div>
                  <div className="glass-text-sm text-primary/70">Score</div>
                </div>
                <div className="text-center">
                  <div className="glass-text-2xl font-bold text-primary">
                    {auditResult.summary.errors}
                  </div>
                  <div className="glass-text-sm text-primary/70">Errors</div>
                </div>
                <div className="text-center">
                  <div className="glass-text-2xl font-bold text-primary">
                    {auditResult.summary.warnings}
                  </div>
                  <div className="glass-text-sm text-primary/70">Warnings</div>
                </div>
                <div className="text-center">
                  <div className="glass-text-2xl font-bold text-primary">
                    {auditResult.summary.info}
                  </div>
                  <div className="glass-text-sm text-primary/70">Info</div>
                </div>
              </div>
            )}
          </OptimizedGlass>

          <div className="glass-flex glass-flex-1 glass-gap-4">
            {/* Issues List */}
            <OptimizedGlass
              className="glass-flex-1 glass-p-4"
              blur="medium"
              elevation={"level1"}
            >
              <div className="glass-flex glass-items-center glass-justify-between mb-4">
                <h4 className="text-md font-semibold text-primary">Issues</h4>
                <div className="glass-flex glass-gap-2">
                  {(["all", "error", "warning", "info"] as const).map(
                    (type: any) => (
                      <button
                        key={type}
                        onClick={(e) => setFilter(type)}
                        className={`glass-px-3 glass-py-1 glass-text-xs glass-radius-md capitalize transition-colors ${
                          filter === type
                            ? "bg-white/20 glass-text-primary"
                            : "glass-text-primary/70 hover:glass-text-primary hover:bg-white/10"
                        }`}
                      >
                        {type}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="glass-gap-2 max-h-96 overflow-y-auto">
                {filteredIssues.map((issue: any) => (
                  <button
                    key={issue.id}
                    onClick={(e) => handleIssueClick(issue)}
                    className={`w-full text-left glass-p-3 glass-radius-md border transition-colors ${getIssueTypeColor(
                      issue.type
                    )} ${selectedIssue?.id === issue.id ? "ring-2 ring-white/50" : ""}`}
                  >
                    <div className="glass-flex glass-items-start glass-justify-between">
                      <div className="glass-flex-1">
                        <div className="glass-flex glass-items-center glass-gap-2 mb-1">
                          <span className="glass-text-sm font-medium">
                            {issue.rule}
                          </span>
                          <span className="glass-text-xs opacity-70">
                            WCAG {issue.wcag}
                          </span>
                        </div>
                        <p className="glass-text-sm opacity-90">
                          {issue.message}
                        </p>
                        {issue.element && (
                          <code className="glass-text-xs opacity-70 glass-surface-dark/20 glass-px-1 glass-py-0.5 glass-radius-md glass-mt-1 inline-block">
                            {issue.element}
                          </code>
                        )}
                      </div>
                    </div>
                  </button>
                ))}

                {filteredIssues.length === 0 && (
                  <div className="text-center glass-py-8 text-primary/50">
                    {auditResult
                      ? "No issues found!"
                      : "Run audit to check accessibility"}
                  </div>
                )}
              </div>
            </OptimizedGlass>

            {/* Issue Details */}
            {selectedIssue && (
              <OptimizedGlass
                className="w-80 glass-p-4"
                blur="medium"
                elevation={"level1"}
              >
                <h4 className="text-md font-semibold text-primary mb-4">
                  Issue Details
                </h4>

                <div className="glass-gap-4">
                  <div>
                    <label className="block glass-text-sm text-primary/70 mb-1">
                      Rule
                    </label>
                    <div className="glass-text-sm font-medium text-primary">
                      {selectedIssue.rule}
                    </div>
                  </div>

                  <div>
                    <label className="block glass-text-sm text-primary/70 mb-1">
                      Type
                    </label>
                    <span
                      className={`glass-px-2 glass-py-1 glass-text-xs glass-radius-md capitalize ${getIssueTypeColor(selectedIssue.type)}`}
                    >
                      {selectedIssue.type}
                    </span>
                  </div>

                  <div>
                    <label className="block glass-text-sm text-primary/70 mb-1">
                      WCAG Guideline
                    </label>
                    <div className="glass-text-sm text-primary">
                      {selectedIssue.wcag}
                    </div>
                  </div>

                  <div>
                    <label className="block glass-text-sm text-primary/70 mb-1">
                      Message
                    </label>
                    <p className="glass-text-sm text-primary">
                      {selectedIssue.message}
                    </p>
                  </div>

                  {selectedIssue.suggestion && (
                    <div>
                      <label className="block glass-text-sm text-primary/70 mb-1">
                        Suggestion
                      </label>
                      <p className="glass-text-sm glass-text-secondary">
                        {selectedIssue.suggestion}
                      </p>
                    </div>
                  )}

                  {selectedIssue.code && (
                    <div>
                      <label className="block glass-text-sm text-primary/70 mb-1">
                        Element Code
                      </label>
                      <pre className="glass-text-xs glass-surface-dark/20 glass-p-2 glass-radius-md overflow-x-auto">
                        <code>{selectedIssue.code}</code>
                      </pre>
                    </div>
                  )}
                </div>
              </OptimizedGlass>
            )}
          </div>

          {/* Add CSS for element highlighting */}
          <style>
            {`
          .a11y-highlight {
            outline: 2px solid #ff6b6b !important;
            outline-offset: 2px !important;
            animation: a11y-pulse 1s ease-in-out infinite alternate;
          }

          @keyframes a11y-pulse {
            from { outline-color: #ff6b6b; }
            to { outline-color: #ff4444; }
          }
        `}
          </style>
        </div>
      </Motion>
    );
  }
);

GlassA11yAuditor.displayName = "GlassA11yAuditor";

// Hook for programmatic audit
export const useA11yAudit = () => {
  const [result, setResult] = useState<A11yAuditResult | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  const audit = useCallback(async (rules = defaultRules) => {
    setIsAuditing(true);

    try {
      // Simplified audit for programmatic use
      const issues: A11yIssue[] = [];

      // Programmatic accessibility checks
      const images = document.querySelectorAll("img");
      images.forEach((img, index) => {
        if (!img.getAttribute("alt")) {
          issues.push({
            id: `img-${index}`,
            type: "error",
            rule: "img-alt",
            message: "Image missing alt text",
            element: "img",
            wcag: "1.1.1",
          });
        }
      });

      const score = Math.max(0, 100 - issues.length * 10);

      const auditResult: A11yAuditResult = {
        score,
        issues,
        summary: {
          errors: issues.filter((i: any) => i.type === "error").length,
          warnings: issues.filter((i: any) => i.type === "warning").length,
          info: issues.filter((i: any) => i.type === "info").length,
        },
        timestamp: Date.now(),
      };

      setResult(auditResult);
      return auditResult;
    } finally {
      setIsAuditing(false);
    }
  }, []);

  return { result, isAuditing, audit };
};
