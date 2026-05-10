"use client";
import { cn } from "@/lib/utils";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { OptimizedGlass } from "../../primitives";
import { COLORS, ANIMATION } from "../../tokens/designConstants";
import { ContrastGuard } from "../accessibility/ContrastGuard";
import { useReducedMotion } from "../../hooks/useReducedMotion";

export type DrawingTool =
  | "pen"
  | "eraser"
  | "rectangle"
  | "circle"
  | "line"
  | "text"
  | "select";

export type DrawingColor =
  | "var(--glass-white)"
  | "var(--glass-black)"
  | "var(--glass-color-danger)"
  | "var(--glass-color-success)"
  | "var(--glass-color-primary)"
  | "var(--glass-color-warning)"
  | "var(--glass-color-accent)"
  | "var(--glass-color-info)";

export interface DrawingPath {
  id: string;
  tool: DrawingTool;
  points: Array<{ x: number; y: number }>;
  color: DrawingColor;
  width: number;
  opacity: number;
  timestamp: number;
}

export interface DrawingShape {
  id: string;
  type: "rectangle" | "circle" | "line" | "text";
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color: DrawingColor;
  width: number;
  opacity: number;
  text?: string;
  timestamp: number;
}

export interface GlassWhiteboardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Initial drawing data */
  initialData?: Array<DrawingPath | DrawingShape>;
  /** Whether the whiteboard is collaborative */
  collaborative?: boolean;
  /** Current user's ID (for collaborative mode) */
  userId?: string;
  /** Drawing tools to enable */
  enabledTools?: DrawingTool[];
  /** Available colors */
  availableColors?: DrawingColor[];
  /** Canvas width */
  width?: number;
  /** Canvas height */
  height?: number;
  /** Background pattern */
  backgroundPattern?: "none" | "grid" | "dots" | "lines";
  /** Whether to show toolbar */
  showToolbar?: boolean;
  /** Whether to show mini-map */
  showMinimap?: boolean;
  /** Custom className */
  className?: string;
  /** Drawing change handler */
  onDrawingChange?: (data: Array<DrawingPath | DrawingShape>) => void;
  /** Tool change handler */
  onToolChange?: (tool: DrawingTool) => void;
  /** Color change handler */
  onColorChange?: (color: DrawingColor) => void;
  "data-testid"?: string;
  "aria-label"?: string;
}

const defaultColors: DrawingColor[] = [
  "var(--glass-white)",
  "var(--glass-black)",
  "var(--glass-color-danger)",
  "var(--glass-color-success)",
  "var(--glass-color-primary)",
  "var(--glass-color-warning)",
  "var(--glass-color-accent)",
  "var(--glass-color-info)",
];

const defaultTools: DrawingTool[] = [
  "pen",
  "eraser",
  "rectangle",
  "circle",
  "line",
  "text",
  "select",
];

const GlassWhiteboard = React.forwardRef<HTMLDivElement, GlassWhiteboardProps>(
  (
    {
      initialData = [],
      collaborative = false,
      userId = "user",
      enabledTools = defaultTools.slice(0, 4),
      availableColors = defaultColors,
      width = 480,
      height = 300,
      backgroundPattern = "grid",
      showToolbar = true,
      showMinimap = false,
      className = "",
      onDrawingChange,
      onToolChange,
      onColorChange,
      "data-testid": dataTestId,
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) => {
    const [currentTool, setCurrentTool] = useState<DrawingTool>("pen");
    const [currentColor, setCurrentColor] =
      useState<DrawingColor>("var(--glass-black)");
    const [brushSize, setBrushSize] = useState(2);
    const [opacity, setOpacity] = useState(1);
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentPath, setCurrentPath] = useState<DrawingPath | null>(null);
    const [currentShape, setCurrentShape] = useState<DrawingShape | null>(null);
    const [drawingData, setDrawingData] =
      useState<Array<DrawingPath | DrawingShape>>(initialData);
    const [selectedElements, setSelectedElements] = useState<Set<string>>(
      new Set()
    );
    const [isSelecting, setIsSelecting] = useState(false);
    const [selectionBox, setSelectionBox] = useState<{
      x: number;
      y: number;
      width: number;
      height: number;
    } | null>(null);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Update drawing data and notify parent
    const updateDrawingData = useCallback(
      (newData: Array<DrawingPath | DrawingShape>) => {
        setDrawingData(newData);
        onDrawingChange?.(newData);
      },
      [onDrawingChange]
    );

    // Handle tool change
    const handleToolChange = (tool: DrawingTool) => {
      setCurrentTool(tool);
      setSelectedElements(new Set());
      setIsSelecting(false);
      onToolChange?.(tool);
    };

    // Handle color change
    const handleColorChange = (color: DrawingColor) => {
      setCurrentColor(color);
      onColorChange?.(color);
    };

    // Get mouse/touch position relative to canvas
    const getCanvasPosition = useCallback(
      (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };

        const rect = canvas.getBoundingClientRect();
        const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
        const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

        return {
          x: clientX - rect.left,
          y: clientY - rect.top,
        };
      },
      []
    );

    // Start drawing
    const handleMouseDown = (e: React.MouseEvent) => {
      const pos = getCanvasPosition(e);
      setIsDrawing(true);

      if (currentTool === "select") {
        setIsSelecting(true);
        setSelectionBox({ x: pos.x, y: pos.y, width: 0, height: 0 });
        return;
      }

      if (currentTool === "pen" || currentTool === "eraser") {
        const newPath: DrawingPath = {
          id: `path-${Date.now()}-${Math.random()}`,
          tool: currentTool,
          points: [pos],
          color: currentTool === "eraser" ? "var(--glass-white)" : currentColor,
          width: brushSize,
          opacity,
          timestamp: Date.now(),
        };
        setCurrentPath(newPath);
      } else if (["rectangle", "circle", "line"].includes(currentTool)) {
        const newShape: DrawingShape = {
          id: `shape-${Date.now()}-${Math.random()}`,
          type: currentTool as "rectangle" | "circle" | "line",
          startX: pos.x,
          startY: pos.y,
          endX: pos.x,
          endY: pos.y,
          color: currentColor,
          width: brushSize,
          opacity,
          timestamp: Date.now(),
        };
        setCurrentShape(newShape);
      } else if (currentTool === "text") {
        const newShape: DrawingShape = {
          id: `text-${Date.now()}-${Math.random()}`,
          type: "text",
          startX: pos.x,
          startY: pos.y,
          endX: pos.x,
          endY: pos.y,
          color: currentColor,
          width: brushSize,
          opacity,
          text: "",
          timestamp: Date.now(),
        };
        setCurrentShape(newShape);
      }
    };

    // Continue drawing
    const handleMouseMove = useCallback(
      (e: React.MouseEvent) => {
        if (!isDrawing) return;

        const pos = getCanvasPosition(e);

        if (currentTool === "select" && isSelecting && selectionBox) {
          setSelectionBox({
            ...selectionBox,
            width: pos.x - selectionBox.x,
            height: pos.y - selectionBox.y,
          });
          return;
        }

        if (currentPath) {
          setCurrentPath({
            ...currentPath,
            points: [...currentPath.points, pos],
          });
        } else if (currentShape) {
          setCurrentShape({
            ...currentShape,
            endX: pos.x,
            endY: pos.y,
          });
        }
      },
      [
        isDrawing,
        currentTool,
        isSelecting,
        selectionBox,
        currentPath,
        currentShape,
        getCanvasPosition,
      ]
    );

    // Finish drawing
    const handleMouseUp = useCallback(() => {
      if (!isDrawing) return;

      setIsDrawing(false);

      if (currentTool === "select" && selectionBox && isSelecting) {
        // Find elements within selection box
        const selected = new Set<string>();
        const { x, y, width, height } = selectionBox;

        drawingData.forEach((item: any) => {
          if ("points" in item) {
            // Check if path intersects with selection box
            const intersects = item?.points.some(
              (point: any) =>
                point.x >= x &&
                point.x <= x + width &&
                point.y >= y &&
                point.y <= y + height
            );
            if (intersects) selected.add(item?.id);
          } else {
            // Check if shape intersects with selection box
            const intersects =
              (item?.startX >= x &&
                item?.startX <= x + width &&
                item?.startY >= y &&
                item?.startY <= y + height) ||
              (item?.endX >= x &&
                item?.endX <= x + width &&
                item?.endY >= y &&
                item?.endY <= y + height);
            if (intersects) selected.add(item?.id);
          }
        });

        setSelectedElements(selected);
        setSelectionBox(null);
        setIsSelecting(false);
        return;
      }

      if (currentPath) {
        updateDrawingData([...drawingData, currentPath]);
        setCurrentPath(null);
      } else if (currentShape) {
        updateDrawingData([...drawingData, currentShape]);
        setCurrentShape(null);
      }
    }, [
      isDrawing,
      currentTool,
      selectionBox,
      isSelecting,
      currentPath,
      currentShape,
      drawingData,
      updateDrawingData,
    ]);

    // Draw background pattern
    const drawBackground = useCallback(
      (ctx: CanvasRenderingContext2D) => {
        ctx.clearRect(0, 0, width, height);

        switch (backgroundPattern) {
          case "grid":
            ctx.strokeStyle = "var(--glass-white)10";
            ctx.lineWidth = 1;
            for (let x = 0; x < width; x += 20) {
              ctx.beginPath();
              ctx.moveTo(x, 0);
              ctx.lineTo(x, height);
              ctx.stroke();
            }
            for (let y = 0; y < height; y += 20) {
              ctx.beginPath();
              ctx.moveTo(0, y);
              ctx.lineTo(width, y);
              ctx.stroke();
            }
            break;
          case "dots":
            ctx.fillStyle = "var(--glass-white)20";
            for (let x = 20; x < width; x += 20) {
              for (let y = 20; y < height; y += 20) {
                ctx.beginPath();
                ctx.arc(x, y, 1, 0, Math.PI * 2);
                ctx.fill();
              }
            }
            break;
          case "lines":
            ctx.strokeStyle = "var(--glass-white)10";
            ctx.lineWidth = 1;
            for (let y = 0; y < height; y += 40) {
              ctx.beginPath();
              ctx.moveTo(0, y);
              ctx.lineTo(width, y);
              ctx.stroke();
            }
            break;
        }
      },
      [width, height, backgroundPattern]
    );

    // Draw all elements
    const drawElements = useCallback(
      (
        ctx: CanvasRenderingContext2D,
        elements: Array<DrawingPath | DrawingShape>
      ) => {
        elements.forEach((element: any) => {
          ctx.globalAlpha = element.opacity;

          if ("points" in element) {
            // Draw path
            if ((element.points?.length || 0) > 1) {
              ctx.strokeStyle = element.color;
              ctx.lineWidth = element.width;
              ctx.lineCap = "round";
              ctx.lineJoin = "round";

              ctx.beginPath();
              ctx.moveTo(element.points[0].x, element.points[0].y);

              for (let i = 1; i < (element.points?.length || 0); i++) {
                ctx.lineTo(element.points[i].x, element.points[i].y);
              }

              ctx.stroke();
            }
          } else {
            // Draw shape
            ctx.strokeStyle = element.color;
            ctx.lineWidth = element.width;
            ctx.fillStyle = element.color;

            const width = Math.abs(element.endX - element.startX);
            const height = Math.abs(element.endY - element.startY);
            const x = Math.min(element.startX, element.endX);
            const y = Math.min(element.startY, element.endY);

            switch (element.type) {
              case "rectangle":
                ctx.strokeRect(x, y, width, height);
                break;
              case "circle":
                const radius = Math.sqrt(width * width + height * height) / 2;
                const centerX = x + width / 2;
                const centerY = y + height / 2;
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                ctx.stroke();
                break;
              case "line":
                ctx.beginPath();
                ctx.moveTo(element.startX, element.startY);
                ctx.lineTo(element.endX, element.endY);
                ctx.stroke();
                break;
              case "text":
                if (element.text) {
                  ctx.font = `${element.width * 10}px Arial`;
                  ctx.fillStyle = element.color;
                  ctx.fillText(element.text, element.startX, element.startY);
                }
                break;
            }
          }

          ctx.globalAlpha = 1;
        });
      },
      []
    );

    // Draw selection highlights
    const drawSelection = useCallback(
      (ctx: CanvasRenderingContext2D) => {
        selectedElements.forEach((elementId: any) => {
          const element = drawingData.find(
            (item: any) => item?.id === elementId
          );
          if (!element) return;

          ctx.strokeStyle = "var(--glass-white)";
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 5]);

          if ("points" in element && (element.points?.length || 0) > 0) {
            const bounds = element.points.reduce(
              (acc, point) => ({
                minX: Math.min(acc.minX, point.x),
                maxX: Math.max(acc.maxX, point.x),
                minY: Math.min(acc.minY, point.y),
                maxY: Math.max(acc.maxY, point.y),
              }),
              {
                minX: Infinity,
                maxX: -Infinity,
                minY: Infinity,
                maxY: -Infinity,
              }
            );

            ctx.strokeRect(
              bounds.minX - 10,
              bounds.minY - 10,
              bounds.maxX - bounds.minX + 20,
              bounds.maxY - bounds.minY + 20
            );
          } else {
            const bounds = {
              minX: Math.min(
                (element as DrawingShape).startX,
                (element as DrawingShape).endX
              ),
              maxX: Math.max(
                (element as DrawingShape).startX,
                (element as DrawingShape).endX
              ),
              minY: Math.min(
                (element as DrawingShape).startY,
                (element as DrawingShape).endY
              ),
              maxY: Math.max(
                (element as DrawingShape).startY,
                (element as DrawingShape).endY
              ),
            };

            ctx.strokeRect(
              bounds.minX - 10,
              bounds.minY - 10,
              bounds.maxX - bounds.minX + 20,
              bounds.maxY - bounds.minY + 20
            );
          }

          ctx.setLineDash([]);
        });
      },
      [selectedElements, drawingData]
    );

    // Main render loop
    useEffect(() => {
      const canvas = canvasRef.current;
      const overlayCanvas = overlayCanvasRef.current;
      if (!canvas || !overlayCanvas) return;

      const ctx = canvas.getContext("2d");
      const overlayCtx = overlayCanvas.getContext("2d");
      if (!ctx || !overlayCtx) return;

      // Clear canvases
      ctx.clearRect(0, 0, width, height);
      overlayCtx.clearRect(0, 0, width, height);

      // Draw background
      drawBackground(ctx);

      // Draw all elements
      drawElements(ctx, drawingData);

      // Draw current path/shape being drawn
      if (currentPath) {
        drawElements(overlayCtx, [currentPath]);
      }
      if (currentShape) {
        drawElements(overlayCtx, [currentShape]);
      }

      // Draw selection
      drawSelection(ctx);

      // Draw selection box
      if (selectionBox && isSelecting) {
        overlayCtx.strokeStyle = "var(--glass-white)80";
        overlayCtx.lineWidth = 1;
        overlayCtx.setLineDash([5, 5]);
        overlayCtx.strokeRect(
          selectionBox.x,
          selectionBox.y,
          selectionBox.width,
          selectionBox.height
        );
        overlayCtx.setLineDash([]);
      }
    }, [
      drawingData,
      currentPath,
      currentShape,
      selectionBox,
      isSelecting,
      drawBackground,
      drawElements,
      drawSelection,
      width,
      height,
    ]);

    // Handle text input
    const handleTextInput = useCallback(
      (text: string) => {
        if (currentShape && currentShape.type === "text") {
          const updatedShape = { ...currentShape, text };
          setCurrentShape(updatedShape);
          updateDrawingData([...drawingData, updatedShape]);
          setCurrentShape(null);
        }
      },
      [currentShape, drawingData, updateDrawingData]
    );

    // Clear canvas
    const clearCanvas = () => {
      updateDrawingData([]);
      setSelectedElements(new Set());
    };

    // Delete selected elements
    const deleteSelected = () => {
      const newData = drawingData.filter(
        (item: any) => !selectedElements.has(item?.id)
      );
      updateDrawingData(newData);
      setSelectedElements(new Set());
    };

    // Export canvas as image
    const exportAsImage = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const link = document.createElement("a");
      link.download = `whiteboard-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    };

    return (
      <OptimizedGlass
        ref={ref}
        data-glass-component
        className={cn(
          "glass-relative glass-max-w-full glass-overflow-hidden",
          className
        )}
        style={{ maxHeight: "100%", minWidth: 0 }}
        intent="neutral"
        elevation="level1"
        data-testid={dataTestId}
        aria-label={ariaLabel || "Drawing whiteboard"}
        role="application"
        {...props}
      >
        {/* Toolbar */}
        {showToolbar && (
          <div
            className={cn(
              "glass-flex glass-flex-wrap glass-items-center glass-gap-2 glass-p-3 glass-border-b glass-border-white/10"
            )}
          >
            {/* Tools */}
            <div className={cn("glass-flex glass-gap-1")}>
              {enabledTools.map((tool: any) => (
                <button
                  key={tool}
                  onClick={(e) => handleToolChange(tool)}
                  className={cn(
                    "glass-px-2 glass-py-1.5 glass-radius-md glass-text-xs glass-font-medium glass-transition-colors",
                    "glass-focus glass-touch-target glass-contrast-guard",
                    currentTool === tool
                      ? "glass-surface-subtle/20 glass-text-primary"
                      : "glass-text-primary-opacity-70 hover:glass-text-primary hover:glass-surface-subtle/10"
                  )}
                >
                  {tool.charAt(0).toUpperCase() + tool.slice(1)}
                </button>
              ))}
            </div>

            {/* Colors */}
            <div className={cn("glass-flex glass-gap-1")}>
              {availableColors.map((color, i) => (
                <button
                  key={`${color}-${i}`}
                  onClick={(e) => handleColorChange(color)}
                  className={cn(
                    "glass-w-7 glass-h-7 glass-radius-md glass-border glass-transition-all",
                    "glass-focus glass-touch-target glass-contrast-guard",
                    currentColor === color
                      ? "glass-border-white"
                      : "glass-border-white/20 hover:glass-border-white/30"
                  )}
                  style={{ backgroundColor: color }}
                  aria-label={`Select color ${color}`}
                  aria-pressed={currentColor === color}
                />
              ))}
            </div>

            {/* Brush Size */}
            <div className={cn("glass-flex glass-items-center glass-gap-2")}>
              <label
                htmlFor="brush-size"
                className={cn("glass-text-sm glass-text-primary-70")}
              >
                Size:
              </label>
              <input
                id="brush-size"
                type="range"
                min="1"
                max="20"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className={cn(
                  "glass-w-16 glass-focus glass-touch-target glass-contrast-guard"
                )}
                aria-label="Brush size"
              />
              <span
                className={cn("glass-text-sm glass-text-primary-70 glass-w-6")}
              >
                {brushSize}
              </span>
            </div>

            {/* Opacity */}
            <div className={cn("glass-flex glass-items-center glass-gap-2")}>
              <label
                htmlFor="brush-opacity"
                className={cn("glass-text-sm glass-text-primary-70")}
              >
                Opacity:
              </label>
              <input
                id="brush-opacity"
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                className={cn(
                  "glass-w-16 glass-focus glass-touch-target glass-contrast-guard"
                )}
                aria-label="Brush opacity"
              />
              <span
                className={cn("glass-text-sm glass-text-primary-70 glass-w-8")}
              >
                {(opacity * 100).toFixed(0)}%
              </span>
            </div>

            {/* Actions */}
            <div className={cn("glass-flex glass-gap-1")}>
              <button
                onClick={clearCanvas}
                className={cn(
                  "glass-px-2 glass-py-1.5 glass-text-xs glass-text-primary-opacity-70 hover:glass-text-primary hover:glass-surface-subtle/10 glass-radius-md glass-transition-colors glass-focus glass-touch-target glass-contrast-guard"
                )}
              >
                Clear
              </button>
              {selectedElements.size > 0 && (
                <button
                  onClick={deleteSelected}
                  className={cn(
                    "glass-px-3 glass-py-2 glass-text-sm glass-text-red-400 glass-hover-text-red-300 glass-hover-surface-red-10 glass-radius-md glass-transition-colors glass-focus glass-touch-target glass-contrast-guard"
                  )}
                >
                  Delete Selected
                </button>
              )}
              <button
                onClick={exportAsImage}
                className={cn(
                  "glass-px-2 glass-py-1.5 glass-text-xs glass-text-primary-opacity-70 hover:glass-text-primary hover:glass-surface-subtle/10 glass-radius-md glass-transition-colors glass-focus glass-touch-target glass-contrast-guard"
                )}
              >
                Export
              </button>
            </div>
          </div>
        )}

        {/* Text Input Modal */}
        {currentShape && currentShape.type === "text" && (
          <div
            className={cn(
              "glass-absolute glass-inset-0 glass-surface-black-50 glass-flex glass-items-center glass-justify-center glass-z-20"
            )}
          >
            <OptimizedGlass
              className={cn("glass-p-6 glass-max-w-sm glass-w-full glass-mx-4")}
              blur="medium"
              elevation={"level2"}
            >
              <input
                autoFocus
                placeholder="Enter text..."
                className={cn(
                  "glass-w-full glass-px-3 glass-py-2 glass-surface-white-10 glass-border glass-border-white-20 glass-radius-md glass-text-primary glass-placeholder-white-50 glass-focus-outline-none glass-focus-border-white-40 glass-focus glass-touch-target glass-contrast-guard"
                )}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleTextInput((e.target as HTMLInputElement).value);
                  } else if (e.key === "Escape") {
                    setCurrentShape(null);
                  }
                }}
              />
            </OptimizedGlass>
          </div>
        )}

        {/* Canvas Container */}
        <div
          ref={containerRef}
          className={cn(
            "glass-relative glass-overflow-hidden glass-surface-dark/20"
          )}
          style={{
            width: "100%",
            maxWidth: width,
            height: "clamp(180px, 32vw, 300px)",
          }}
        >
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className={cn(
              "glass-absolute glass-inset-0 glass-cursor-crosshair"
            )}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />

          <canvas
            ref={overlayCanvasRef}
            width={width}
            height={height}
            className={cn(
              "glass-absolute glass-inset-0 glass-pointer-events-none"
            )}
          />
        </div>
      </OptimizedGlass>
    );
  }
);

GlassWhiteboard.displayName = "GlassWhiteboard";

export { GlassWhiteboard };
