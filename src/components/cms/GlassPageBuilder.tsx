'use client';
import React, { useState, useCallback, useEffect } from "react";
import { Glass } from "../../primitives";
import { cn } from "../../lib/utilsComprehensive";
import { DragDropProvider, useDragDrop } from "./GlassDragDropProvider";
import { GlassComponentPalette } from "./GlassComponentPalette";
import { GlassCanvas } from "./GlassCanvas";
import { GlassPropertyPanel } from "./GlassPropertyPanel";
import { GlassPageStructure } from "./GlassPageStructure";

interface PageBuilderProps {
  className?: string;
  initialData?: any;
  onSave?: (data: any) => void;
  onPreview?: (data: any) => void;
  onPublish?: (data: any) => void;
}

const Toolbar: React.FC = () => {
  const {
    pageState,
    undo,
    redo,
    canUndo,
    canRedo,
    togglePreviewMode,
    setActiveBreakpoint,
    toggleGrid,
    toggleSnapToGrid,
    clearPage,
    exportPage,
    importPage,
  } = useDragDrop();

  const handleSave = useCallback(() => {
    const data = exportPage();
    localStorage.setItem("glass-page-builder-autosave", JSON.stringify(data));
    // You could also call an onSave prop here
  }, [exportPage]);

  const handleLoad = useCallback(() => {
    const saved = localStorage.getItem("glass-page-builder-autosave");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        importPage(data);
      } catch (error) {
        console.error("Error loading saved data:", error);
      }
    }
  }, [importPage]);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (pageState.components.length > 0) {
        handleSave();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [pageState.components.length, handleSave]);

  return (
    <div
      data-glass-component
      className="glass-flex glass-items-center glass-justify-between glass-p-4 glass-surface-subtle glass-border-b glass-border-subtle"
    >
      {/* Left Side - Main Actions */}
      <div className="glass-flex glass-items-center glass-gap-4">
        <div className="glass-flex glass-items-center glass-gap-2">
          <h1 className="glass-text-xl font-bold glass-text-secondary">
            Page Builder
          </h1>
          <span className="glass-text-xs glass-text-secondary glass-surface-subtle glass-px-2 glass-py-1 glass-radius">
            v1.0
          </span>
        </div>

        <div className="w-px h-6 glass-surface-subtle" />

        {/* File Actions */}
        <div className="glass-flex glass-items-center glass-gap-2">
          <button
            onClick={clearPage}
            className="glass-flex glass-items-center glass-gap-2 glass-px-3 glass-py-2 glass-text-sm glass-text-secondary hover:glass-surface-subtle glass-radius-md transition-colors glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard"
          >
            <span>🗑️</span>
            New
          </button>
          <button
            onClick={handleSave}
            className="glass-flex glass-items-center glass-gap-2 glass-px-3 glass-py-2 glass-text-sm glass-text-secondary hover:glass-surface-subtle glass-radius-md transition-colors glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard"
          >
            <span>💾</span>
            Save
          </button>
          <button
            onClick={handleLoad}
            className="glass-flex glass-items-center glass-gap-2 glass-px-3 glass-py-2 glass-text-sm glass-text-secondary hover:glass-surface-subtle glass-radius-md transition-colors glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard"
          >
            <span>📁</span>
            Load
          </button>
        </div>

        <div className="w-px h-6 glass-surface-subtle" />

        {/* Undo/Redo */}
        <div className="glass-flex glass-items-center glass-gap-1">
          <button
            onClick={undo}
            disabled={!canUndo()}
            className={cn(
              "p-2 rounded-md transition-colors",
              canUndo()
                ? "text-gray-700 hover:bg-gray-100"
                : "text-gray-400 cursor-not-allowed"
            )}
            title="Undo (Ctrl+Z)"
          >
            ↶
          </button>
          <button
            onClick={redo}
            disabled={!canRedo()}
            className={cn(
              "p-2 rounded-md transition-colors",
              canRedo()
                ? "text-gray-700 hover:bg-gray-100"
                : "text-gray-400 cursor-not-allowed"
            )}
            title="Redo (Ctrl+Y)"
          >
            ↷
          </button>
        </div>
      </div>

      {/* Center - Breakpoint Controls */}
      <div className="glass-flex glass-items-center glass-gap-2 glass-surface-subtle glass-radius-lg glass-p-1">
        {[
          { key: "desktop", icon: "🖥️", label: "Desktop" },
          { key: "tablet", icon: "📱", label: "Tablet" },
          { key: "mobile", icon: "📱", label: "Mobile" },
        ].map((breakpoint: any) => (
          <button
            key={breakpoint.key}
            onClick={() => setActiveBreakpoint(breakpoint.key as any)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors",
              pageState.activeBreakpoint === breakpoint.key
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            )}
            title={breakpoint.label}
          >
            <span>{breakpoint.icon}</span>
            {breakpoint.label}
          </button>
        ))}
      </div>

      {/* Right Side - View Options & Actions */}
      <div className="glass-flex glass-items-center glass-gap-4">
        {/* View Options */}
        <div className="glass-flex glass-items-center glass-gap-2">
          <button
            onClick={toggleGrid}
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors",
              pageState.showGrid
                ? "bg-blue-100 text-blue-700"
                : "text-gray-700 hover:bg-gray-100"
            )}
          >
            <span>⊞</span>
            Grid
          </button>
          <button
            onClick={toggleSnapToGrid}
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors",
              pageState.snapToGrid
                ? "bg-blue-100 text-blue-700"
                : "text-gray-700 hover:bg-gray-100"
            )}
          >
            <span>🧲</span>
            Snap
          </button>
        </div>

        <div className="w-px h-6 glass-surface-subtle" />

        {/* Preview & Publish */}
        <div className="glass-flex glass-items-center glass-gap-2">
          <button
            onClick={togglePreviewMode}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors",
              pageState.previewMode
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
          >
            <span>{pageState.previewMode ? "👁️" : "✏️"}</span>
            {pageState.previewMode ? "Exit Preview" : "Preview"}
          </button>
          <button
            onClick={() => {
              const data = exportPage();
              console.log("Publishing:", data);
              alert("Page published! (Demo - check console for data)");
            }}
            className="glass-flex glass-items-center glass-gap-2 glass-px-4 glass-py-2 glass-text-sm font-medium glass-surface-blue text-primary hover:glass-surface-blue glass-radius-md transition-colors"
          >
            <span>🚀</span>
            Publish
          </button>
        </div>
      </div>
    </div>
  );
};

const PageBuilderCore: React.FC<PageBuilderProps> = ({
  className,
  initialData,
  onSave,
  onPreview,
  onPublish,
}) => {
  const { importPage } = useDragDrop();

  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);
  const [activeLeftPanel, setActiveLeftPanel] = useState<
    "components" | "structure"
  >("components");

  // Load initial data
  useEffect(() => {
    if (initialData) {
      importPage(initialData);
    } else {
      // Try to load from localStorage
      const saved = localStorage.getItem("glass-page-builder-autosave");
      if (saved) {
        try {
          const data = JSON.parse(saved);
          importPage(data);
        } catch (error) {
          console.error("Error loading saved data:", error);
        }
      }
    }
  }, [initialData, importPage]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey && !e.altKey) {
        switch (e.key) {
          case "z":
            e.preventDefault();
            // undo() would be called here if we had access to it
            break;
          case "y":
            e.preventDefault();
            // redo() would be called here if we had access to it
            break;
          case "s":
            e.preventDefault();
            if (onSave) {
              // Call onSave prop
            }
            break;
          case "p":
            e.preventDefault();
            if (onPreview) {
              // Call onPreview prop
            }
            break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onSave, onPreview]);

  return (
    <div
      className={cn(
        "h-screen flex flex-col overflow-hidden bg-gray-100",
        className
      )}
    >
      {/* Toolbar */}
      <Toolbar />

      {/* Main Content */}
      <div className="glass-flex-1 glass-flex overflow-hidden">
        {/* Left Panels */}
        <div className="glass-flex">
          {/* Left Panel Tabs */}
          {!leftPanelCollapsed && (
            <div className="w-12 glass-surface-subtle glass-border-r glass-border-subtle glass-flex glass-flex-col">
              <button
                onClick={() => setActiveLeftPanel("components")}
                className={cn(
                  "flex flex-col items-center gap-1 p-3 text-xs transition-colors",
                  activeLeftPanel === "components"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                )}
                title="Components"
              >
                <span className="glass-text-lg">📦</span>
                Comp
              </button>
              <button
                onClick={() => setActiveLeftPanel("structure")}
                className={cn(
                  "flex flex-col items-center gap-1 p-3 text-xs transition-colors",
                  activeLeftPanel === "structure"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                )}
                title="Structure"
              >
                <span className="glass-text-lg">🌳</span>
                Tree
              </button>
            </div>
          )}

          {/* Active Left Panel */}
          <div className="glass-border-r glass-border-subtle">
            {activeLeftPanel === "components" ? (
              <GlassComponentPalette
                collapsed={leftPanelCollapsed}
                onToggleCollapse={() =>
                  setLeftPanelCollapsed(!leftPanelCollapsed)
                }
              />
            ) : (
              <GlassPageStructure
                collapsed={leftPanelCollapsed}
                onToggleCollapse={() =>
                  setLeftPanelCollapsed(!leftPanelCollapsed)
                }
              />
            )}
          </div>
        </div>

        {/* Canvas */}
        <GlassCanvas />

        {/* Right Panel - Properties */}
        <div className="glass-border-l glass-border-subtle">
          <GlassPropertyPanel
            collapsed={rightPanelCollapsed}
            onToggleCollapse={() =>
              setRightPanelCollapsed(!rightPanelCollapsed)
            }
          />
        </div>
      </div>

      {/* Status Bar */}
      <div className="h-6 glass-surface-primary text-gray-300 glass-text-xs glass-flex glass-items-center glass-justify-between glass-px-4">
        <div className="glass-flex glass-items-center glass-gap-4">
          <span>🟢 Ready</span>
          <span>Auto-save: ON</span>
        </div>
        <div className="glass-flex glass-items-center glass-gap-4">
          <span>Zoom: 100%</span>
          <span>Grid: {`${false ? "ON" : "OFF"}`}</span>
        </div>
      </div>
    </div>
  );
};

export const GlassPageBuilder: React.FC<PageBuilderProps> = (props) => {
  return (
    <DragDropProvider>
      <PageBuilderCore {...props} />
    </DragDropProvider>
  );
};