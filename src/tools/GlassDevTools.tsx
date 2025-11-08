import React, { useState, useEffect, useCallback } from "react";
import { usePerformance } from "../hooks/usePerformance";
import { useAccessibility } from "../hooks/useAccessibility";
import { Glass } from "../primitives";
import { cn } from "../lib/utilsComprehensive";

interface DevToolsProps {
  enabled?: boolean;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  defaultTab?: "performance" | "accessibility" | "inspector" | "console";
}

export const GlassDevTools: React.FC<DevToolsProps> = ({
  enabled = process.env.NODE_ENV === "development",
  position = "bottom-right",
  defaultTab = "performance",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(
    null
  );
  const [consoleLogs, setConsoleLogs] = useState<
    Array<{ type: string; message: string; timestamp: number }>
  >([]);

  const performance = usePerformance({ enableDevtools: enabled });
  const accessibility = useAccessibility();

  // Don't render if not enabled
  if (!enabled) return null;

  // Console interceptor
  useEffect(() => {
    const originalConsole = {
      log: console.log,
      warn: console.warn,
      error: console.error,
    };

    const interceptConsole =
      (type: string) =>
      (message: any, ...args: any[]) => {
        setConsoleLogs((prev: any) => [
          ...prev.slice(-99),
          {
            // Keep last 100 logs
            type,
            message:
              typeof message === "string" ? message : JSON.stringify(message),
            timestamp: Date.now(),
          },
        ]);
        originalConsole[type as keyof typeof originalConsole](message, ...args);
      };

    console.log = interceptConsole("log");
    console.warn = interceptConsole("warn");
    console.error = interceptConsole("error");

    return () => {
      Object.assign(console, originalConsole);
    };
  }, []);

  // Element inspector
  useEffect(() => {
    if (activeTab !== "inspector" || !isOpen) return;

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && !target.closest("[data-devtools]")) {
        target.style.outline = "2px solid #007acc";
        target.style.outlineOffset = "2px";
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target) {
        target.style.outline = "";
        target.style.outlineOffset = "";
      }
    };

    const handleClick = (e: MouseEvent) => {
      e.preventDefault();
      const target = e.target as HTMLElement;
      if (target && !target.closest("[data-devtools]")) {
        setSelectedElement(target);
        target.style.outline = "3px solid #007acc";
      }
    };

    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      document.removeEventListener("click", handleClick);
    };
  }, [activeTab, isOpen]);

  const getPositionClasses = () => {
    const positions = {
      "bottom-right": "bottom-4 right-4",
      "bottom-left": "bottom-4 left-4",
      "top-right": "top-4 right-4",
      "top-left": "top-4 left-4",
    };
    return positions[position];
  };

  const renderPerformanceTab = () => (
    <div className="space-y-4 glass-text-sm">
      <div className="glass-grid glass-grid-cols-2 glass-gap-4">
        <div className="space-y-2">
          <div className="font-semibold text-blue-600">Performance Score</div>
          <div
            className={cn(
              "text-2xl font-bold",
              performance.getGrade() === "A" && "text-green-600",
              performance.getGrade() === "B" && "text-blue-600",
              performance.getGrade() === "C" && "text-yellow-600",
              performance.getGrade() === "D" && "text-orange-600",
              performance.getGrade() === "F" && "text-red-600"
            )}
          >
            {performance.getPerformanceScore()}/100 ({performance.getGrade()})
          </div>
        </div>
        <div className="space-y-2">
          <div className="font-semibold">Status</div>
          <div
            className={cn(
              "px-2 py-1 rounded text-xs font-medium",
              performance.isMonitoring
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            )}
          >
            {performance.isMonitoring ? "Monitoring" : "Stopped"}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="font-semibold">Runtime Metrics</div>
        <div className="glass-grid glass-grid-cols-2 glass-gap-2 glass-text-xs">
          <div>
            FPS: <span className="font-mono">{performance.metrics.fps}</span>
          </div>
          <div>
            Memory:{" "}
            <span className="font-mono">
              {performance.metrics.memoryUsage}MB
            </span>
          </div>
          <div>
            DOM Elements:{" "}
            <span className="font-mono">{performance.metrics.domElements}</span>
          </div>
          <div>
            Network:{" "}
            <span className="font-mono">
              {performance.metrics.networkLatency}ms
            </span>
          </div>
        </div>
      </div>

      {performance.alerts.length > 0 && (
        <div className="space-y-2">
          <div className="font-semibold text-red-600">Alerts</div>
          <div className="space-y-1">
            {performance.alerts.slice(-5).map((alert, index) => (
              <div
                key={index}
                className="glass-text-xs bg-red-50 text-red-700 glass-px-2 glass-py-1 glass-radius"
              >
                {alert}
              </div>
            ))}
          </div>
          <button
            onClick={performance.clearAlerts}
            className="glass-text-xs text-red-600 hover:text-red-800 glass-focus glass-touch-target glass-contrast-guard"
          >
            Clear Alerts
          </button>
        </div>
      )}

      <div className="space-y-2">
        <div className="font-semibold">Recommendations</div>
        <div className="space-y-1">
          {performance.getRecommendations().map((rec, index) => (
            <div
              key={index}
              className="glass-text-xs bg-blue-50 text-blue-700 glass-px-2 glass-py-1 glass-radius"
            >
              💡 {rec}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAccessibilityTab = () => (
    <div className="space-y-4 glass-text-sm">
      <div className="space-y-3">
        <div className="font-semibold">Current Settings</div>
        <div className="glass-grid glass-grid-cols-2 glass-gap-2 glass-text-xs">
          <div>
            Font Size:{" "}
            <span className="font-mono">{accessibility.settings.fontSize}</span>
          </div>
          <div>
            Contrast:{" "}
            <span className="font-mono">{accessibility.settings.contrast}</span>
          </div>
          <div>
            Reduce Motion:{" "}
            <span className="font-mono">
              {accessibility.settings.reduceMotion ? "Yes" : "No"}
            </span>
          </div>
          <div>
            Focus Mode:{" "}
            <span className="font-mono">
              {accessibility.settings.focusIndicators}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="font-semibold">Quick Actions</div>
        <div className="space-y-1">
          <button
            onClick={() => accessibility.updateSettings({ contrast: "high" })}
            className="glass-text-xs glass-surface-primary glass-text-primary glass-px-2 glass-py-1 glass-radius hover:bg-blue-600 mr-2 glass-focus glass-touch-target glass-contrast-guard"
          >
            High Contrast
          </button>
          <button
            onClick={() => accessibility.updateSettings({ fontSize: "large" })}
            className="glass-text-xs glass-surface-success glass-text-primary glass-px-2 glass-py-1 glass-radius hover:bg-green-600 mr-2 glass-focus glass-touch-target glass-contrast-guard"
          >
            Large Text
          </button>
          <button
            onClick={() => accessibility.updateSettings({ reduceMotion: true })}
            className="glass-text-xs bg-purple-500 glass-text-primary glass-px-2 glass-py-1 glass-radius hover:bg-purple-600 mr-2 glass-focus glass-touch-target glass-contrast-guard"
          >
            Reduce Motion
          </button>
          <button
            onClick={accessibility.resetSettings}
            className="glass-text-xs glass-surface-subtle0 glass-text-primary glass-px-2 glass-py-1 glass-radius hover:bg-gray-600 glass-focus glass-touch-target glass-contrast-guard"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="font-semibold">Accessibility Classes</div>
        <div className="glass-text-xs font-mono glass-surface-muted glass-p-2 glass-radius">
          {accessibility.getAccessibilityClasses() || "No special classes"}
        </div>
      </div>

      <div className="space-y-2">
        <div className="font-semibold">Test Announcements</div>
        <div className="space-y-1">
          <button
            onClick={() =>
              accessibility.announce("Test announcement", "polite")
            }
            className="glass-text-xs glass-surface-primary glass-text-primary glass-px-2 glass-py-1 glass-radius hover:bg-blue-600 mr-2 glass-focus glass-touch-target glass-contrast-guard"
          >
            Polite
          </button>
          <button
            onClick={() =>
              accessibility.announce("Urgent announcement", "assertive")
            }
            className="glass-text-xs glass-surface-danger glass-text-primary glass-px-2 glass-py-1 glass-radius hover:bg-red-600 glass-focus glass-touch-target glass-contrast-guard"
          >
            Assertive
          </button>
        </div>
      </div>
    </div>
  );

  const renderInspectorTab = () => (
    <div className="space-y-4 glass-text-sm">
      <div className="text-blue-600 font-semibold">
        Click on any element to inspect it
      </div>

      {selectedElement && (
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="font-semibold">Selected Element</div>
            <div className="glass-text-xs font-mono glass-surface-muted glass-p-2 glass-radius">
              {selectedElement.tagName.toLowerCase()}
              {selectedElement.id && `#${selectedElement.id}`}
              {selectedElement.className &&
                `.${selectedElement.className.split(" ").join(".")}`}
            </div>
          </div>

          <div className="space-y-2">
            <div className="font-semibold">Computed Styles</div>
            <div className="glass-text-xs space-y-1">
              {(() => {
                const styles = getComputedStyle(selectedElement);
                return [
                  ["display", styles.display],
                  ["position", styles.position],
                  ["width", styles.width],
                  ["height", styles.height],
                  ["color", styles.color],
                  ["background", styles.backgroundColor],
                ].map(([prop, value]) => (
                  <div key={prop} className="glass-flex glass-justify-between">
                    <span className="glass-text-secondary">{prop}:</span>
                    <span className="font-mono">{value}</span>
                  </div>
                ));
              })()}
            </div>
          </div>

          <div className="space-y-2">
            <div className="font-semibold">Accessibility</div>
            <div className="glass-text-xs space-y-1">
              <div>Role: {selectedElement.getAttribute("role") || "none"}</div>
              <div>
                Aria Label:{" "}
                {selectedElement.getAttribute("aria-label") || "none"}
              </div>
              <div>
                Tabindex:{" "}
                {selectedElement.getAttribute("tabindex") || "default"}
              </div>
              <div>
                Focusable: {selectedElement.tabIndex >= 0 ? "Yes" : "No"}
              </div>
            </div>
          </div>

          <button
            onClick={() => setSelectedElement(null)}
            className="glass-text-xs glass-surface-subtle0 glass-text-primary glass-px-2 glass-py-1 glass-radius hover:bg-gray-600 glass-focus glass-touch-target glass-contrast-guard"
          >
            Clear Selection
          </button>
        </div>
      )}
    </div>
  );

  const renderConsoleTab = () => (
    <div className="space-y-4 glass-text-sm">
      <div className="glass-flex glass-justify-between glass-items-center">
        <div className="font-semibold">Console ({consoleLogs.length})</div>
        <button
          onClick={() => setConsoleLogs([])}
          className="glass-text-xs glass-surface-subtle0 glass-text-primary glass-px-2 glass-py-1 glass-radius hover:bg-gray-600 glass-focus glass-touch-target glass-contrast-guard"
        >
          Clear
        </button>
      </div>

      <div className="space-y-1 max-h-60 overflow-y-auto">
        {consoleLogs.slice(-20).map((log, index) => (
          <div
            key={index}
            className={cn(
              "text-xs p-2 rounded font-mono",
              log.type === "error" && "bg-red-50 text-red-800",
              log.type === "warn" && "bg-yellow-50 text-yellow-800",
              log.type === "log" && "bg-gray-50 text-gray-800"
            )}
          >
            <div className="glass-flex glass-justify-between glass-text-xs opacity-60 mb-1">
              <span>{log.type}</span>
              <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
            </div>
            <div>{log.message}</div>
          </div>
        ))}
        {consoleLogs.length === 0 && (
          <div className="glass-text-secondary glass-text-xs text-center glass-py-4">
            No console messages
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Accessibility announcer */}
      <div
        id="accessibility-announcer"
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      />

      {/* Toggle button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={cn(
            "fixed z-50 w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all",
            "flex items-center justify-center text-lg font-bold",
            "glass-focus glass-touch-target glass-contrast-guard",
            getPositionClasses()
          )}
          data-devtools
          title="Open DevTools"
        >
          🔧
        </button>
      )}

      {/* DevTools panel */}
      {isOpen && (
        <Glass
          className={cn(
            "fixed z-50 w-96 max-h-96 bg-white shadow-2xl rounded-lg overflow-hidden",
            getPositionClasses()
          )}
          data-devtools
        >
          {/* Header */}
          <div className="glass-flex glass-items-center glass-justify-between glass-p-3 glass-surface-subtle glass-border-b">
            <h3 className="font-semibold text-gray-900">Glass DevTools</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="glass-text-secondary hover:text-gray-700 glass-focus glass-touch-target glass-contrast-guard"
            >
              ✕
            </button>
          </div>

          {/* Tabs */}
          <div className="glass-flex glass-border-b glass-surface-subtle">
            {[
              { id: "performance", label: "⚡ Perf", title: "Performance" },
              { id: "accessibility", label: "♿ A11y", title: "Accessibility" },
              {
                id: "inspector",
                label: "🔍 Inspector",
                title: "Element Inspector",
              },
              { id: "console", label: "📝 Console", title: "Console" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "px-3 py-2 text-xs font-medium transition-colors",
                  "glass-focus glass-touch-target glass-contrast-guard",
                  activeTab === tab.id
                    ? "bg-white text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                )}
                title={tab.title}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="glass-p-4 max-h-80 overflow-y-auto">
            {activeTab === "performance" && renderPerformanceTab()}
            {activeTab === "accessibility" && renderAccessibilityTab()}
            {activeTab === "inspector" && renderInspectorTab()}
            {activeTab === "console" && renderConsoleTab()}
          </div>
        </Glass>
      )}
    </>
  );
};

export default GlassDevTools;
