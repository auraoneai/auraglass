"use client";
import React, { forwardRef, useState, useCallback } from "react";
import { Glass } from "../../../primitives";
import { Motion } from "../../../primitives";
import { GlassGrid, GlassGridItem } from "../../layout/GlassGrid";
import { GlassCard } from "../../card/GlassCard";
import { GlassButton, IconButton } from "../../button/GlassButton";
import { PageHeader } from "../../layout/GlassAppShell";
import { VStack, HStack } from "../../layout/GlassStack";
import { cn } from "@/lib/utils";

export interface DashboardTableRow {
  name?: React.ReactNode;
  value?: React.ReactNode;
}

export interface DashboardWidgetData extends Record<string, unknown> {
  value?: React.ReactNode;
  label?: React.ReactNode;
  change?: number;
  title?: React.ReactNode;
  chartType?: string;
  rows?: DashboardTableRow[];
  content?: React.ReactNode;
}

export interface DashboardWidget {
  id: string;
  title: string;
  type: "metric" | "chart" | "table" | "text" | "custom";
  size: {
    cols: 1 | 2 | 3 | 4 | 6 | 12;
    rows: 1 | 2 | 3 | 4;
  };
  position: {
    x: number;
    y: number;
  };
  data?: DashboardWidgetData;
  config?: Record<string, unknown>;
  component?: React.ComponentType<DashboardWidgetRendererProps>;
  editable?: boolean;
  removable?: boolean;
  resizable?: boolean;
}

export interface DashboardWidgetRendererProps {
  widget: DashboardWidget;
}

export interface DashboardLayout {
  id: string;
  name: string;
  widgets: DashboardWidget[];
  cols: number;
  gap: "sm" | "md" | "lg";
}

export interface GlassDashboardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Dashboard title
   */
  title?: string;
  /**
   * Dashboard description
   */
  description?: string;
  /**
   * Dashboard layout
   */
  layout?: DashboardLayout;
  /**
   * Available widget types for adding
   */
  availableWidgets?: Array<{
    type: string;
    title: string;
    icon: React.ReactNode;
    defaultSize: DashboardWidget["size"];
  }>;
  /**
   * Whether dashboard is in edit mode
   */
  editMode?: boolean;
  /**
   * Edit mode change handler
   */
  onEditModeChange?: (editMode: boolean) => void;
  /**
   * Layout change handler
   */
  onLayoutChange?: (layout: DashboardLayout) => void;
  /**
   * Widget add handler
   */
  onWidgetAdd?: (widget: Partial<DashboardWidget>) => void;
  /**
   * Widget remove handler
   */
  onWidgetRemove?: (widgetId: string) => void;
  /**
   * Widget update handler
   */
  onWidgetUpdate?: (
    widgetId: string,
    updates: Partial<DashboardWidget>
  ) => void;
  /**
   * Drag and drop enabled
   */
  dragEnabled?: boolean;
  /**
   * Custom widget renderers
   */
  widgetRenderers?: Record<
    string,
    React.ComponentType<DashboardWidgetRendererProps>
  >;
  /**
   * Dashboard actions
   */
  actions?: React.ReactNode;
  /**
   * Loading state
   */
  loading?: boolean;
  /**
   * Empty state component
   */
  emptyState?: React.ReactNode;
  /**
   * Compact rendering for constrained cards and docs previews.
   */
  compact?: boolean;
  /**
   * Keep the dashboard bounded inside its parent instead of assuming a page-scale layout.
   */
  contained?: boolean;
  /**
   * Whether to render the dashboard header.
   */
  showHeader?: boolean;
  /**
   * Whether to render actions in the header.
   */
  showActions?: boolean;
  /**
   * Whether to render edit toolbar controls.
   */
  showToolbar?: boolean;
  /**
   * Explicit dashboard height for embedded layouts.
   */
  height?: React.CSSProperties["height"];
  /**
   * Explicit dashboard width for embedded layouts.
   */
  width?: React.CSSProperties["width"];
  /**
   * Maximum dashboard height for embedded layouts.
   */
  maxHeight?: React.CSSProperties["maxHeight"];
}

/**
 * GlassDashboard component
 * Drag-and-drop dashboard with glassmorphism widgets
 */
// Default layout for when no layout is provided
const DEFAULT_LAYOUT: DashboardLayout = {
  id: "default",
  name: "Default Dashboard",
  widgets: [],
  cols: 4,
  gap: "md",
};

export const GlassDashboard = forwardRef<HTMLDivElement, GlassDashboardProps>(
  (
    {
      title = "Dashboard",
      description,
      layout = DEFAULT_LAYOUT,
      availableWidgets = [],
      editMode = false,
      onEditModeChange,
      onLayoutChange,
      onWidgetAdd,
      onWidgetRemove,
      onWidgetUpdate,
      dragEnabled = true,
      widgetRenderers = {},
      actions,
      loading = false,
      emptyState,
      compact = false,
      contained = false,
      showHeader = true,
      showActions = true,
      showToolbar = true,
      height,
      width,
      maxHeight,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const [draggedWidget, setDraggedWidget] = useState<string | null>(null);
    const [dragOverPosition, setDragOverPosition] = useState<{
      x: number;
      y: number;
    } | null>(null);
    const isBounded =
      compact || contained || height !== undefined || maxHeight !== undefined;
    const gridCols = compact ? Math.min(layout.cols, 2) : layout.cols;
    const gridMinHeightClass = isBounded
      ? "glass-min-glass-h-0"
      : "glass-min-glass-h-96";
    const dashboardStyle: React.CSSProperties = {
      ...style,
      width,
      height,
      maxHeight: maxHeight ?? (compact || contained ? 420 : undefined),
      overflow: isBounded ? "hidden" : style?.overflow,
    };

    // Handle drag start
    const handleDragStart = useCallback(
      (widgetId: string) => {
        if (!editMode || !dragEnabled) return;
        setDraggedWidget(widgetId);
      },
      [editMode, dragEnabled]
    );

    // Handle drag end
    const handleDragEnd = useCallback(() => {
      setDraggedWidget(null);
      setDragOverPosition(null);
    }, []);

    // Handle drop
    const handleDrop = useCallback(
      (position: { x: number; y: number }) => {
        if (!draggedWidget || !onWidgetUpdate) return;

        onWidgetUpdate(draggedWidget, {
          position,
        });

        handleDragEnd();
      },
      [draggedWidget, onWidgetUpdate, handleDragEnd]
    );

    // Add new widget
    const handleAddWidget = useCallback(
      (widgetType: string) => {
        const widgetTemplate = availableWidgets.find(
          (w) => w.type === widgetType
        );
        if (!widgetTemplate || !onWidgetAdd) return;

        // Find empty position
        const usedPositions = new Set(
          layout.widgets.map((w) => `${w.position.x},${w.position.y}`)
        );

        let position = { x: 0, y: 0 };
        for (let y = 0; y < 10; y++) {
          for (let x = 0; x < layout.cols; x++) {
            const posKey = `${x},${y}`;
            if (!usedPositions.has(posKey)) {
              position = { x, y };
              break;
            }
          }
          if (position.x !== 0 || position.y !== 0) break;
        }

        onWidgetAdd({
          title: widgetTemplate.title,
          type: widgetTemplate.type as
            | "metric"
            | "chart"
            | "table"
            | "text"
            | "custom",
          size: widgetTemplate.defaultSize,
          position,
        });
      },
      [availableWidgets, layout.widgets, layout.cols, onWidgetAdd]
    );

    // Default widget renderers
    const defaultWidgetRenderers = {
      metric: ({ widget }: DashboardWidgetRendererProps) => (
        <VStack space="md">
          <div className="glass-text-2xl glass-font-bold glass-text-primary">
            {widget.data?.value || "0"}
          </div>
          <div className="glass-text-sm glass-text-secondary">
            {widget.data?.label || "Metric"}
          </div>
          {widget.data?.change && (
            <div
              className={cn(
                "glass-text-xs font-medium",
                widget.data?.change > 0 ? "text-success" : "text-destructive"
              )}
            >
              {widget.data?.change > 0 ? "+" : ""}
              {widget.data?.change}%
            </div>
          )}
        </VStack>
      ),
      chart: ({ widget }: DashboardWidgetRendererProps) => (
        <VStack space="md">
          <div className="glass-text-sm glass-font-medium glass-text-primary">
            {widget.data?.title || "Chart"}
          </div>
          <div className="glass-h-32 glass-surface-subtle glass-radius-md glass-flex glass-items-center glass-justify-center">
            <span className="glass-text-secondary">
              {widget.data?.chartType
                ? `${widget.data?.chartType} Chart`
                : "Chart Widget"}
            </span>
          </div>
        </VStack>
      ),
      table: ({ widget }: DashboardWidgetRendererProps) => (
        <VStack space="md">
          <div className="glass-text-sm glass-font-medium glass-text-primary">
            {widget.data?.title || "Table"}
          </div>
          <div className="glass-auto-gap glass-auto-gap-sm">
            {(widget.data?.rows || []).slice(0, 3).map((row, index) => (
              <div
                key={index}
                className="glass-flex glass-justify-between glass-text-sm"
              >
                <span className="glass-text-primary">{row.name}</span>
                <span className="glass-text-secondary">{row.value}</span>
              </div>
            ))}
          </div>
        </VStack>
      ),
      text: ({ widget }: { widget: DashboardWidget }) => (
        <div className="glass-text-sm glass-text-primary">
          {widget.data?.content || widget.data?.title || "Text Widget"}
        </div>
      ),
    };

    // Render widget
    const renderWidget = (widget: DashboardWidget) => {
      const WidgetRenderer =
        widgetRenderers?.[widget.type] ||
        defaultWidgetRenderers?.[
          widget.type as keyof typeof defaultWidgetRenderers
        ] ||
        widget.component;

      if (!WidgetRenderer) {
        return (
          <div
            data-glass-component
            className="glass-h-full glass-flex glass-items-center glass-justify-center glass-text-secondary"
          >
            Unknown widget type: {widget.type}
          </div>
        );
      }

      return <WidgetRenderer widget={widget} />;
    };

    // Render add widget menu
    const renderAddWidgetMenu = () => {
      if (!editMode || (availableWidgets?.length || 0) === 0) return null;

      return (
        <div className="glass-grid glass-grid-cols-2 glass-gap-2 glass-p-2">
          {availableWidgets.map((widgetType) => (
            <GlassButton
              key={widgetType.type}
              variant="ghost"
              size="sm"
              leftIcon={widgetType.icon}
              onClick={(e) => handleAddWidget(widgetType.type)}
              className="glass-justify-start glass-focus glass-touch-target"
            >
              {widgetType.title}
            </GlassButton>
          ))}
        </div>
      );
    };

    if (loading) {
      return (
        <div className="glass-flex glass-items-center glass-justify-center glass-h-64">
          <div className="glass-w-8 glass-h-8 glass-border-2 glass-border-primary glass-border-t-transparent glass-radius-full glass-animate-spin" />
        </div>
      );
    }

    if ((layout.widgets?.length || 0) === 0 && emptyState) {
      return emptyState;
    }

    return (
      <div
        ref={ref}
        className={cn(
          "w-full glass-auto-gap",
          compact ? "glass-auto-gap-md" : "glass-auto-gap-2xl",
          contained && "glass-contained",
          className
        )}
        style={dashboardStyle}
        data-glass-component
        {...props}
      >
        {/* Header */}
        {showHeader && (
          <PageHeader
            title={title}
            description={compact ? undefined : description}
            actions={
              showActions ? (
                <HStack space="sm">
                  {actions}
                  {showToolbar && (availableWidgets?.length || 0) > 0 && (
                    <GlassButton
                      variant={editMode ? "primary" : "outline"}
                      size="sm"
                      leftIcon={editMode ? "✓" : "Edit"}
                      onClick={(e) => onEditModeChange?.(!editMode)}
                      className="glass-focus glass-touch-target"
                    >
                      {editMode ? "Done" : "Edit"}
                    </GlassButton>
                  )}
                </HStack>
              ) : undefined
            }
          />
        )}

        {/* Add widget section */}
        {showToolbar && editMode && (availableWidgets?.length || 0) > 0 && (
          <Motion preset="slideDown">
            <Glass className="glass-p-4 glass-radius-lg">
              <VStack space="sm">
                <h3 className="glass-text-sm glass-font-medium glass-text-primary">
                  Add Widget
                </h3>
                {renderAddWidgetMenu()}
              </VStack>
            </Glass>
          </Motion>
        )}

        {/* Dashboard grid */}
        <GlassGrid
          cols={gridCols as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12}
          gap={layout.gap}
          className={cn(
            gridMinHeightClass,
            isBounded && "glass-overflow-y-auto glass-pr-1"
          )}
        >
          {layout.widgets.map((widget) => (
            <GlassGridItem
              key={widget.id}
              colSpan={
                compact
                  ? (Math.min(
                      widget.size.cols,
                      gridCols
                    ) as DashboardWidget["size"]["cols"])
                  : widget.size.cols
              }
              rowSpan={
                compact
                  ? (Math.min(
                      widget.size.rows,
                      2
                    ) as DashboardWidget["size"]["rows"])
                  : widget.size.rows
              }
              className={cn(
                "transition-all duration-200",
                draggedWidget === widget.id && "opacity-50 scale-95",
                editMode && dragEnabled && "cursor-move"
              )}
              draggable={editMode && dragEnabled}
              onDragStart={() => handleDragStart(widget.id)}
              onDragEnd={handleDragEnd}
            >
              <GlassCard
                variant="default"
                className={cn(
                  "h-full relative group",
                  editMode && "hover:ring-2 hover:ring-primary/50"
                )}
              >
                {/* Widget header */}
                <div className="glass-flex glass-items-center glass-justify-between glass-mb-4">
                  <h2 className="glass-text-sm glass-font-medium glass-text-primary glass-truncate">
                    {widget.title}
                  </h2>
                  {editMode && (
                    <HStack
                      space="xs"
                      className="glass-opacity-0 glass-group-glass-hover-opacity-100 glass-transition-opacity"
                    >
                      {widget.removable !== false && (
                        <IconButton
                          icon="🗑️"
                          variant="ghost"
                          size="xs"
                          onClick={(e) => onWidgetRemove?.(widget.id)}
                          aria-label="Remove widget"
                          className="glass-focus glass-touch-target glass-contrast-guard"
                        />
                      )}
                      <IconButton
                        icon="⚙️"
                        variant="ghost"
                        size="xs"
                        onClick={(e) => {
                          // Handle widget configuration
                        }}
                        aria-label="Configure widget"
                        className="glass-focus glass-touch-target glass-contrast-guard"
                      />
                    </HStack>
                  )}
                </div>

                {/* Widget content */}
                <div className="glass-flex-1">{renderWidget(widget)}</div>
              </GlassCard>
            </GlassGridItem>
          ))}

          {/* Drop zones for empty grid positions */}
          {editMode && draggedWidget && (
            <>
              {Array.from({ length: layout.cols * 4 }, (_, index) => {
                const x = index % layout.cols;
                const y = Math.floor(index / layout.cols);
                const isOccupied = layout.widgets.some(
                  (w) => w.position.x === x && w.position.y === y
                );

                if (isOccupied) return null;

                return (
                  <GlassGridItem
                    key={`drop-zone-${x}-${y}`}
                    colSpan={1}
                    rowSpan={1}
                    className="glass-min-glass-h-24"
                    style={{ gridColumnStart: x + 1, gridRowStart: y + 1 }}
                  >
                    <div
                      className="glass-h-full glass-border-2 glass-border-dashed glass-border-primary/30 glass-radius-lg glass-surface-primary/5 glass-flex glass-items-center glass-justify-center glass-transition-colors hover:glass-border-primary/50 hover:glass-surface-primary/10"
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOverPosition({ x, y });
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        handleDrop({ x, y });
                      }}
                    >
                      <span className="glass-text-xs glass-text-primary-glass-opacity-60">
                        Drop here
                      </span>
                    </div>
                  </GlassGridItem>
                );
              })}
            </>
          )}
        </GlassGrid>
      </div>
    );
  }
);

GlassDashboard.displayName = "GlassDashboard";
