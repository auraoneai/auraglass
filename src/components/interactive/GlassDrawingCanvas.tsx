"use client";
import React, {
  forwardRef,
  useRef,
  useEffect,
  useState,
  useCallback,
} from "react";
import { OptimizedGlass } from "../../primitives";
import { Motion } from "../../primitives";
import { cn } from "../../lib/utilsComprehensive";
import { useA11yId } from "../../utils/a11y";
import { useMotionPreferenceContext } from "../../contexts/MotionPreferenceContext";
import { useGlassSound } from "../../utils/soundDesign";

export interface DrawingTool {
  type: "pen" | "brush" | "eraser" | "line" | "rectangle" | "circle" | "text";
  size: number;
  color: string;
  opacity: number;
}

export interface DrawingStroke {
  id: string;
  tool: DrawingTool;
  points: Array<{ x: number; y: number; pressure?: number }>;
  timestamp: number;
}

export interface GlassDrawingCanvasProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Canvas width */
  width?: number;
  /** Canvas height */
  height?: number;
  /** Current drawing tool */
  tool?: DrawingTool;
  /** Whether the canvas is read-only */
  readOnly?: boolean;
  /** Background color */
  backgroundColor?: string;
  /** Background image URL */
  backgroundImage?: string;
  /** Whether to show grid */
  showGrid?: boolean;
  /** Grid size */
  gridSize?: number;
  /** Whether to enable pressure sensitivity */
  pressureSensitive?: boolean;
  /** Whether to smooth strokes */
  smoothStrokes?: boolean;
  /** Maximum undo history */
  maxHistory?: number;
  /** Drawing data */
  data?: DrawingStroke[];
  /** Change handler */
  onChange?: (strokes: DrawingStroke[]) => void;
  /** Stroke complete handler */
  onStrokeComplete?: (stroke: DrawingStroke) => void;
  /** Export handler */
  onExport?: (dataUrl: string, format: "png" | "jpeg" | "svg") => void;
  /** Available tools */
  availableTools?: DrawingTool["type"][];
  /** Tool panel position */
  toolPanelPosition?: "top" | "bottom" | "left" | "right" | "floating";
  /** Whether to show tool panel */
  showToolPanel?: boolean;
  /** Respect user's motion preferences */
  respectMotionPreference?: boolean;
}

export const GlassDrawingCanvas = forwardRef<
  HTMLDivElement,
  GlassDrawingCanvasProps
>(
  (
    {
      width = 800,
      height = 600,
      tool = { type: "pen", size: 2, color: "var(--glass-black)", opacity: 1 },
      readOnly = false,
      backgroundColor = "transparent",
      backgroundImage,
      showGrid = false,
      gridSize = 20,
      pressureSensitive = true,
      smoothStrokes = true,
      maxHistory = 50,
      data = [],
      onChange,
      onStrokeComplete,
      onExport,
      availableTools = [
        "pen",
        "brush",
        "eraser",
        "line",
        "rectangle",
        "circle",
      ],
      toolPanelPosition = "top",
      showToolPanel = true,
      respectMotionPreference = true,
      className,
      ...props
    },
    ref
  ) => {
    const { prefersReducedMotion, isMotionSafe } = useMotionPreferenceContext();
    const { play } = useGlassSound();

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    const drawingCanvasId = useA11yId("glass-drawing-canvas");

    const [strokes, setStrokes] = useState<DrawingStroke[]>(data);
    const [currentStroke, setCurrentStroke] = useState<DrawingStroke | null>(
      null
    );
    const [isDrawing, setIsDrawing] = useState(false);
    const [backgroundImageElement, setBackgroundImageElement] =
      useState<HTMLImageElement | null>(null);
    const [, setBackgroundImageStatus] = useState<
      "idle" | "loading" | "loaded" | "error"
    >("idle");
    const [history, setHistory] = useState<DrawingStroke[][]>([data]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [currentTool, setCurrentTool] = useState<DrawingTool>(tool);

    // Initialize canvas
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const context = canvas.getContext("2d");
      if (!context) return;

      contextRef.current = context;

      // Set canvas size
      canvas.width = width;
      canvas.height = height;

      // Configure context
      context.lineCap = "round";
      context.lineJoin = "round";
      context.imageSmoothingEnabled = true;
    }, [width, height]);

    // Draw grid
    const drawGrid = useCallback(
      (context: CanvasRenderingContext2D) => {
        if (!showGrid) return;

        context.save();
        context.strokeStyle = "rgba(200, 200, 200, 0.3)";
        context.lineWidth = 0.5;

        for (let x = 0; x <= width; x += gridSize) {
          context.beginPath();
          context.moveTo(x, 0);
          context.lineTo(x, height);
          context.stroke();
        }

        for (let y = 0; y <= height; y += gridSize) {
          context.beginPath();
          context.moveTo(0, y);
          context.lineTo(width, y);
          context.stroke();
        }

        context.restore();
      },
      [showGrid, width, height, gridSize]
    );

    // Draw background
    const drawBackground = useCallback(
      (context: CanvasRenderingContext2D) => {
        context.save();

        if (backgroundColor && backgroundColor !== "transparent") {
          context.fillStyle = backgroundColor;
          context.fillRect(0, 0, width, height);
        } else {
          context.clearRect(0, 0, width, height);
        }

        if (backgroundImageElement) {
          context.drawImage(backgroundImageElement, 0, 0, width, height);
        }

        context.restore();
      },
      [backgroundColor, backgroundImageElement, width, height]
    );

    // Draw stroke
    const drawStroke = useCallback(
      (context: CanvasRenderingContext2D, stroke: DrawingStroke) => {
        if (stroke.points.length < 2) return;

        context.save();
        context.globalAlpha = stroke.tool.opacity;
        context.strokeStyle = stroke.tool.color;
        context.lineWidth = stroke.tool.size;

        if (stroke.tool.type === "eraser") {
          context.globalCompositeOperation = "destination-out";
        }

        context.beginPath();

        if (smoothStrokes && stroke.points.length > 2) {
          // Smooth the stroke using quadratic curves
          context.moveTo(stroke.points[0].x, stroke.points[0].y);

          for (let i = 1; i < stroke.points.length - 1; i++) {
            const current = stroke.points[i];
            const next = stroke.points[i + 1];
            const controlX = current.x;
            const controlY = current.y;
            const endX = (current.x + next.x) / 2;
            const endY = (current.y + next.y) / 2;

            context.quadraticCurveTo(controlX, controlY, endX, endY);
          }

          // Draw the last segment
          const lastPoint = stroke.points[stroke.points.length - 1];
          const secondLastPoint = stroke.points[stroke.points.length - 2];
          context.quadraticCurveTo(
            secondLastPoint.x,
            secondLastPoint.y,
            lastPoint.x,
            lastPoint.y
          );
        } else {
          // Draw straight lines
          context.moveTo(stroke.points[0].x, stroke.points[0].y);
          for (let i = 1; i < stroke.points.length; i++) {
            context.lineTo(stroke.points[i].x, stroke.points[i].y);
          }
        }

        context.stroke();
        context.restore();
      },
      [smoothStrokes]
    );

    // Redraw canvas
    const redrawCanvas = useCallback(() => {
      const context = contextRef.current;
      if (!context) return;

      drawBackground(context);
      drawGrid(context);

      // Draw all strokes
      strokes.forEach((stroke: any) => drawStroke(context, stroke));

      // Draw current stroke
      if (currentStroke) {
        drawStroke(context, currentStroke);
      }
    }, [strokes, currentStroke, drawBackground, drawGrid, drawStroke]);

    // Update canvas when strokes change
    useEffect(() => {
      redrawCanvas();
    }, [redrawCanvas]);

    // Load and render background images when provided
    useEffect(() => {
      let cancelled = false;

      if (!backgroundImage) {
        setBackgroundImageElement(null);
        setBackgroundImageStatus("idle");
        return;
      }

      setBackgroundImageStatus("loading");
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        if (cancelled) return;
        setBackgroundImageElement(img);
        setBackgroundImageStatus("loaded");
        redrawCanvas();
      };
      img.onerror = () => {
        if (cancelled) return;
        setBackgroundImageElement(null);
        setBackgroundImageStatus("error");
      };
      img.src = backgroundImage;

      return () => {
        cancelled = true;
        img.onload = null;
        img.onerror = null;
      };
    }, [backgroundImage, redrawCanvas]);

    // Get pointer position
    const getPointerPos = useCallback(
      (event: React.PointerEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };

        const rect = canvas.getBoundingClientRect();
        return {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
          pressure: (event as any).pressure || 1,
        };
      },
      []
    );

    // Start drawing
    const handlePointerDown = useCallback(
      (event: React.PointerEvent<HTMLCanvasElement>) => {
        if (readOnly) return;

        event.preventDefault();
        setIsDrawing(true);

        const pos = getPointerPos(event);
        const newStroke: DrawingStroke = {
          id: `stroke-${Date.now()}-${Math.random()}`,
          tool: currentTool,
          points: [pos],
          timestamp: Date.now(),
        };

        setCurrentStroke(newStroke);
        play("tap");
      },
      [readOnly, getPointerPos, currentTool, play]
    );

    // Continue drawing
    const handlePointerMove = useCallback(
      (event: React.PointerEvent<HTMLCanvasElement>) => {
        if (!isDrawing || !currentStroke || readOnly) return;

        const pos = getPointerPos(event);
        const updatedStroke = {
          ...currentStroke,
          points: [...currentStroke.points, pos],
        };

        setCurrentStroke(updatedStroke);
      },
      [isDrawing, currentStroke, readOnly, getPointerPos]
    );

    // End drawing
    const handlePointerUp = useCallback(() => {
      if (!isDrawing || !currentStroke) return;

      setIsDrawing(false);

      // Add completed stroke to strokes
      const newStrokes = [...strokes, currentStroke];
      setStrokes(newStrokes);

      // Update history
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newStrokes);
      if (newHistory.length > maxHistory) {
        newHistory.shift();
      }
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);

      // Callbacks
      onChange?.(newStrokes);
      onStrokeComplete?.(currentStroke);

      setCurrentStroke(null);
      play("success");
    }, [
      isDrawing,
      currentStroke,
      strokes,
      history,
      historyIndex,
      maxHistory,
      onChange,
      onStrokeComplete,
      play,
    ]);

    // Undo
    const undo = useCallback(() => {
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setStrokes(history[newIndex]);
        onChange?.(history[newIndex]);
        play("tap");
      }
    }, [historyIndex, history, onChange, play]);

    // Redo
    const redo = useCallback(() => {
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setStrokes(history[newIndex]);
        onChange?.(history[newIndex]);
        play("tap");
      }
    }, [historyIndex, history, onChange, play]);

    // Clear canvas
    const clear = useCallback(() => {
      const newStrokes: DrawingStroke[] = [];
      setStrokes(newStrokes);

      const newHistory = [...history, newStrokes];
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);

      onChange?.(newStrokes);
      play("error");
    }, [history, onChange, play]);

    // Export canvas
    const exportCanvas = useCallback(
      (format: "png" | "jpeg" | "svg" = "png") => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const dataUrl = canvas.toDataURL(`image/${format}`);
        onExport?.(dataUrl, format);
        play("success");
      },
      [onExport, play]
    );

    // Tool panel
    const renderToolPanel = () => {
      if (!showToolPanel) return null;

      return (
        <OptimizedGlass
          elevation="level2"
          intensity="medium"
          depth={1}
          tint="neutral"
          border="subtle"
          className="glass-tool-panel glass-flex glass-items-center glass-gap-2 glass-p-2 glass-radius-lg glass-backdrop-blur-md glass-border glass-border-glass-border/20 glass-contrast-guard"
        >
          {/* Tool selection */}
          <div className="glass-flex glass-gap-1">
            {availableTools.map((toolType) => (
              <button
                key={toolType}
                onClick={() =>
                  setCurrentTool({ ...currentTool, type: toolType })
                }
                className={cn(
                  "glass-p-2 glass-radius-md transition-all duration-200",
                  "hover:bg-background/20 focus:outline-none focus:ring-2 focus:ring-primary/50",
                  "glass-focus glass-touch-target glass-contrast-guard",
                  currentTool.type === toolType && "bg-primary/20 text-primary"
                )}
                title={toolType.charAt(0).toUpperCase() + toolType.slice(1)}
                aria-label={`Select ${toolType} tool`}
              >
                {/* Tool icons would go here */}
                <span className='glass-w-4 glass-h-4 glass-block'>
                  {toolType[0].toUpperCase()}
                </span>
              </button>
            ))}
          </div>

          {/* Size control */}
          <div className="glass-flex glass-items-center glass-gap-2">
            <label
              htmlFor={`${drawingCanvasId}-size`}
              className="glass-text-sm glass-text-secondary"
            >
              Size:
            </label>
            <input
              id={`${drawingCanvasId}-size`}
              type="range"
              min="1"
              max="50"
              value={currentTool.size}
              onChange={(e) =>
                setCurrentTool({
                  ...currentTool,
                  size: parseInt(e.target.value),
                })
              }
              className='glass-w-20 glass-focus glass-touch-target glass-contrast-guard'
              aria-label={`Brush size: ${currentTool.size}`}
            />
            <span className='glass-text-sm glass-min-w-2ch' aria-live="polite">
              {currentTool.size}
            </span>
          </div>

          {/* Color picker */}
          <div className="glass-flex glass-items-center glass-gap-2">
            <label
              htmlFor={`${drawingCanvasId}-color`}
              className="glass-text-sm glass-text-secondary"
            >
              Color:
            </label>
            <input
              id={`${drawingCanvasId}-color`}
              type="color"
              value={currentTool.color}
              onChange={(e) =>
                setCurrentTool({ ...currentTool, color: e.target.value })
              }
              className='glass-w-8 glass-h-8 glass-radius-md glass-border glass-border-glass-border/20 glass-focus glass-touch-target glass-contrast-guard'
              aria-label={`Brush color: ${currentTool.color}`}
            />
          </div>

          {/* Opacity control */}
          <div className="glass-flex glass-items-center glass-gap-2">
            <label
              htmlFor={`${drawingCanvasId}-opacity`}
              className="glass-text-sm glass-text-secondary"
            >
              Opacity:
            </label>
            <input
              id={`${drawingCanvasId}-opacity`}
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={currentTool.opacity}
              onChange={(e) =>
                setCurrentTool({
                  ...currentTool,
                  opacity: parseFloat(e.target.value),
                })
              }
              className='glass-w-20 glass-focus glass-touch-target glass-contrast-guard'
              aria-label={`Brush opacity: ${(currentTool.opacity * 100).toFixed(0)}%`}
            />
          </div>

          {/* Actions */}
          <div className='glass-flex glass-gap-1 glass-ml-auto'>
            <button
              onClick={undo}
              disabled={historyIndex <= 0}
              className='glass-p-2 glass-radius-md hover:glass-surface-overlay disabled:glass-opacity-50 glass-disabled-cursor-not-allowed glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard'
              title="Undo"
            >
              ↶
            </button>
            <button
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className='glass-p-2 glass-radius-md hover:glass-surface-overlay disabled:glass-opacity-50 glass-disabled-cursor-not-allowed glass-focus glass-touch-target glass-contrast-guard'
              title="Redo"
            >
              ↷
            </button>
            <button
              onClick={clear}
              className='glass-p-2 glass-radius-md hover:glass-surface-overlay glass-text-primary glass-focus glass-touch-target glass-contrast-guard'
              title="Clear"
            >
              🗑
            </button>
            <button
              onClick={() => exportCanvas("png")}
              className='glass-p-2 glass-radius-md hover:glass-surface-overlay glass-focus glass-touch-target glass-contrast-guard'
              title="Export"
            >
              💾
            </button>
          </div>
        </OptimizedGlass>
      );
    };

    return (
      <OptimizedGlass
        ref={ref}
        id={drawingCanvasId}
        elevation="level1"
        intensity="subtle"
        depth={1}
        tint="neutral"
        border="subtle"
        className={cn(
          "glass-drawing-canvas relative glass-radius-lg glass-backdrop-blur-md border border-border/20",
          className
        )}
        {...props}
      >
        <Motion
          preset={isMotionSafe && respectMotionPreference ? "fadeIn" : "none"}
          className="glass-flex glass-flex-col glass-gap-4 glass-p-4"
        >
          {/* Tool panel - top/bottom */}
          {(toolPanelPosition === "top" || toolPanelPosition === "bottom") &&
            renderToolPanel()}

          <div className="glass-flex glass-gap-4">
            {/* Tool panel - left */}
            {toolPanelPosition === "left" && (
              <div className="glass-flex glass-flex-col">
                {renderToolPanel()}
              </div>
            )}

            {/* Canvas container */}
            <div className='glass-relative'>
              <canvas
                ref={canvasRef}
                width={width}
                height={height}
                className={cn(
                  "border border-border/20 glass-radius-md bg-white",
                  !readOnly && "cursor-crosshair",
                  "touch-none" // Prevent touch scrolling
                )}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                style={{ width, height }}
              />

              {/* Floating tool panel */}
              {toolPanelPosition === "floating" && (
                <div className='glass-absolute glass-top-4 glass-right-4'>
                  {renderToolPanel()}
                </div>
              )}
            </div>

            {/* Tool panel - right */}
            {toolPanelPosition === "right" && (
              <div className="glass-flex glass-flex-col">
                {renderToolPanel()}
              </div>
            )}
          </div>

          {/* Tool panel - bottom */}
          {toolPanelPosition === "bottom" && renderToolPanel()}
        </Motion>
      </OptimizedGlass>
    );
  }
);

GlassDrawingCanvas.displayName = "GlassDrawingCanvas";

export default GlassDrawingCanvas;
