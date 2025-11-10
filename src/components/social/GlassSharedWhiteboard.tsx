'use client';
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

import React, {
  forwardRef,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OptimizedGlass } from "../../primitives";
import { useGlassSound } from "../../utils/soundDesign";
import { useA11yId } from "../../utils/a11y";
import { useMotionPreference } from "../../hooks/useMotionPreference";
import { createGlassStyle } from "../../utils/createGlassStyle";

export interface DrawingStroke {
  id: string;
  userId: string;
  userName: string;
  userColor: string;
  points: Array<{ x: number; y: number; pressure?: number }>;
  tool: "pen" | "marker" | "eraser" | "shape";
  color: string;
  size: number;
  opacity: number;
  timestamp: number;
  isComplete: boolean;
}

export interface WhiteboardUser {
  id: string;
  name: string;
  color: string;
  avatar?: string;
  cursorX: number;
  cursorY: number;
  isDrawing: boolean;
  currentTool: string;
  lastActivity: number;
}

export interface GlassSharedWhiteboardProps {
  width?: number;
  height?: number;
  users: WhiteboardUser[];
  currentUserId: string;
  strokes?: DrawingStroke[];
  backgroundColor?: string;
  gridVisible?: boolean;
  showUserCursors?: boolean;
  showToolbar?: boolean;
  showUserList?: boolean;
  showUndoRedo?: boolean;
  maxStrokes?: number;
  realTimeSync?: boolean;
  soundEnabled?: boolean;
  canDraw?: boolean;
  readOnly?: boolean;
  onStroke?: (stroke: DrawingStroke) => void;
  onClear?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onUserCursorMove?: (userId: string, x: number, y: number) => void;
  className?: string;
}

const tools = [
  { id: "pen", name: "Pen", icon: "✏️" },
  { id: "marker", name: "Marker", icon: "🖍️" },
  { id: "eraser", name: "Eraser", icon: "🧽" },
  { id: "shape", name: "Shape", icon: "📐" },
];

const colors = [
  "var(--glass-black)",
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#FF00FF",
  "#00FFFF",
  "#FF8000",
  "#8000FF",
  "#FF0080",
];

const sizes = [2, 4, 8, 12, 16, 24];

export const GlassSharedWhiteboard = forwardRef<
  HTMLDivElement,
  GlassSharedWhiteboardProps
>(
  (
    {
      width = 800,
      height = 600,
      users,
      currentUserId,
      strokes = [],
      backgroundColor = "var(--glass-white)",
      gridVisible = false,
      showUserCursors = true,
      showToolbar = true,
      showUserList = true,
      showUndoRedo = true,
      maxStrokes = 1000,
      realTimeSync = false,
      soundEnabled = true,
      canDraw = true,
      readOnly = false,
      onStroke,
      onClear,
      onUndo,
      onRedo,
      onUserCursorMove,
      className = "",
      ...props
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentStroke, setCurrentStroke] = useState<DrawingStroke | null>(
      null
    );
    const [selectedTool, setSelectedTool] = useState("pen");
    const [selectedColor, setSelectedColor] = useState("var(--glass-black)");
    const [selectedSize, setSelectedSize] = useState(4);
    const [localStrokes, setLocalStrokes] = useState<DrawingStroke[]>(strokes);
    const [undoStack, setUndoStack] = useState<DrawingStroke[][]>([]);
    const [redoStack, setRedoStack] = useState<DrawingStroke[][]>([]);
    const [simulatedUsers, setSimulatedUsers] = useState(users);
    const [gridVisibleState, setGridVisible] = useState(gridVisible);
    const { play } = useGlassSound();
    const id = useA11yId("glass-shared-whiteboard");
    const { shouldAnimate } = useMotionPreference();

    // Helper function to respect motion preferences
    const respectMotionPreference = (config: any) =>
      shouldAnimate ? config : { duration: 0 };

    const currentUser = users.find((u) => u.id === currentUserId);

    // Simulated collaborative activity
    useEffect(() => {
      if (!realTimeSync) return;

      const interval = setInterval(() => {
        setSimulatedUsers((prev: any) =>
          prev.map((user: any) => {
            if (user.id === currentUserId) return user;

            // Randomly move cursors and simulate drawing
            const deltaX = (Math.random() - 0.5) * 50;
            const deltaY = (Math.random() - 0.5) * 50;
            const newX = Math.max(0, Math.min(width, user.cursorX + deltaX));
            const newY = Math.max(0, Math.min(height, user.cursorY + deltaY));

            const isDrawing = Math.random() < 0.1;

            if (isDrawing && Math.random() < 0.3) {
              // Simulate a simple drawing stroke
              const stroke: DrawingStroke = {
                id: `stroke-${Date.now()}-${user.id}`,
                userId: user.id,
                userName: user.name,
                userColor: user.color,
                points: [
                  { x: newX, y: newY },
                  {
                    x: newX + Math.random() * 20,
                    y: newY + Math.random() * 20,
                  },
                ],
                tool: "pen",
                color: user.color,
                size: 3,
                opacity: 0.8,
                timestamp: Date.now(),
                isComplete: true,
              };

              setLocalStrokes((prev: any) => [
                ...prev.slice(-maxStrokes + 1),
                stroke,
              ]);
              onStroke?.(stroke);

              if (soundEnabled) {
                play("draw");
              }
            }

            onUserCursorMove?.(user.id, newX, newY);

            return {
              ...user,
              cursorX: newX,
              cursorY: newY,
              isDrawing,
              lastActivity: Date.now(),
            };
          })
        );
      }, 200);

      return () => clearInterval(interval);
    }, [
      realTimeSync,
      currentUserId,
      width,
      height,
      maxStrokes,
      onStroke,
      onUserCursorMove,
      soundEnabled,
      play,
    ]);

    // Draw on canvas
    const drawStrokes = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Clear canvas
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);

      // Draw grid if visible
      if (gridVisibleState) {
        ctx.strokeStyle = "#E5E5E5";
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.3;

        for (let x = 0; x <= width; x += 20) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }

        for (let y = 0; y <= height; y += 20) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
      }

      ctx.globalAlpha = 1;

      // Draw all strokes
      localStrokes.forEach((stroke: any) => {
        if (stroke.points.length < 2) return;

        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.size;
        ctx.globalAlpha = stroke.opacity;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        if (stroke.tool === "eraser") {
          ctx.globalCompositeOperation = "destination-out";
        } else {
          ctx.globalCompositeOperation = "source-over";
        }

        ctx.beginPath();
        ctx.moveTo(stroke.points[0].x, stroke.points[0].y);

        for (let i = 1; i < stroke.points.length; i++) {
          ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
        }

        ctx.stroke();
      });

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    }, [localStrokes, backgroundColor, gridVisibleState, width, height]);

    useEffect(() => {
      drawStrokes();
    }, [drawStrokes]);

    const startDrawing = useCallback(
      (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (readOnly || !canDraw) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setIsDrawing(true);

        const stroke: DrawingStroke = {
          id: `stroke-${Date.now()}-${currentUserId}`,
          userId: currentUserId,
          userName: currentUser?.name || "Unknown",
          userColor: currentUser?.color || selectedColor,
          points: [{ x, y }],
          tool: selectedTool as any,
          color: selectedColor,
          size: selectedSize,
          opacity: selectedTool === "marker" ? 0.7 : 1,
          timestamp: Date.now(),
          isComplete: false,
        };

        setCurrentStroke(stroke);

        if (soundEnabled) {
          play("draw");
        }
      },
      [
        readOnly,
        canDraw,
        currentUserId,
        currentUser,
        selectedTool,
        selectedColor,
        selectedSize,
        soundEnabled,
        play,
      ]
    );

    const draw = useCallback(
      (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing || !currentStroke || readOnly) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const updatedStroke = {
          ...currentStroke,
          points: [...currentStroke.points, { x, y }],
        };

        setCurrentStroke(updatedStroke);
        setLocalStrokes((prev: any) => [
          ...prev.filter((s: any) => s.id !== updatedStroke.id),
          updatedStroke,
        ]);
      },
      [isDrawing, currentStroke, readOnly]
    );

    const stopDrawing = useCallback(() => {
      if (!currentStroke || readOnly) return;

      const completedStroke = {
        ...currentStroke,
        isComplete: true,
      };

      setLocalStrokes((prev: any) => {
        const newStrokes = [
          ...prev.filter((s: any) => s.id !== completedStroke.id),
          completedStroke,
        ].slice(-maxStrokes);

        setUndoStack((undoPrev) => [...undoPrev, prev]);
        setRedoStack([]);

        return newStrokes;
      });

      onStroke?.(completedStroke);
      setCurrentStroke(null);
      setIsDrawing(false);
    }, [currentStroke, readOnly, maxStrokes, onStroke]);

    const handleUndo = () => {
      if (undoStack.length === 0) return;

      const previousState = undoStack[undoStack.length - 1];
      setRedoStack((prev: any) => [localStrokes, ...prev]);
      setUndoStack((prev: any) => prev.slice(0, -1));
      setLocalStrokes(previousState);
      onUndo?.();
    };

    const handleRedo = () => {
      if (redoStack.length === 0) return;

      const nextState = redoStack[0];
      setUndoStack((prev: any) => [...prev, localStrokes]);
      setRedoStack((prev: any) => prev.slice(1));
      setLocalStrokes(nextState);
      onRedo?.();
    };

    const handleClear = () => {
      setUndoStack((prev: any) => [...prev, localStrokes]);
      setRedoStack([]);
      setLocalStrokes([]);
      onClear?.();
    };

    const UserCursor = ({ user }: { user: WhiteboardUser }) => (
      <motion.div
        className='absolute pointer-events-none z-20'
        style={{
          left: user.cursorX,
          top: user.cursorY,
          transform: "translate(-2px, -2px)",
        }}
        animate={
          prefersReducedMotion
            ? {}
            : {
                scale: user.isDrawing ? 1.2 : 1,
                opacity: Date.now() - user.lastActivity < 5000 ? 1 : 0.5,
              }
        }
        transition={respectMotionPreference({
          type: "spring",
          stiffness: 400,
          damping: 30,
        })}
      >
        <svg width="20" height="20" viewBox="0 0 24 24">
          <path
            d="M5 3L19 12L12 14L9 21L5 3Z"
            fill={user.color}
            stroke="white"
            strokeWidth="1"
          />
        </svg>
        <div
          className={`
          mt-2 px-2 py-1 text-xs font-medium text-white rounded
          ${createGlassStyle({ variant: "default" })}
        `}
        >
          {user.name}
        </div>
      </motion.div>
    );

    return (
      <OptimizedGlass
        ref={ref}
        intensity="subtle"
        className={`relative ${className}`}
        {...props}
      >
        <div className='glass-flex glass-flex-col space-y-4'>
          {/* Toolbar */}
          {showToolbar && !readOnly && (
            <div
              className={`
              flex items-center justify-between p-3 rounded-lg
              ${createGlassStyle({ variant: "default" })}
            `}
            >
              <div className='glass-flex glass-items-center space-x-4'>
                {/* Tools */}
                <div className='glass-flex space-x-2'>
                  {tools.map((tool: any) => (
                    <button
                      key={tool.id}
                      onClick={() => setSelectedTool(tool.id)}
                      className={`
                        p-2 rounded text-sm font-medium transition-colors duration-200 glass-focus glass-touch-target glass-contrast-guard
                        ${
                          selectedTool === tool.id
                            ? "bg-white/20 text-white"
                            : "text-white/70 hover:text-white hover:bg-white/10"
                        }
                      `}
                      title={tool.name}
                    >
                      {tool.icon}
                    </button>
                  ))}
                </div>

                {/* Colors */}
                <div className='glass-flex space-x-1'>
                  {colors.map((color, i) => (
                    <button
                      key={`${color}-${i}`}
                      onClick={() => setSelectedColor(color)}
                      className={`
                        w-6 h-6 rounded border-2 transition-transform duration-200 glass-focus glass-touch-target glass-contrast-guard
                        ${
                          selectedColor === color
                            ? "border-white scale-110"
                            : "border-white/30 hover:scale-105"
                        }
                      `}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                {/* Sizes */}
                <div className='glass-flex space-x-1'>
                  {sizes.map((size: any) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`
                        w-8 h-8 rounded flex items-center justify-center transition-colors duration-200 glass-focus glass-touch-target glass-contrast-guard
                        ${
                          selectedSize === size
                            ? "bg-white/20 text-white"
                            : "text-white/70 hover:text-white hover:bg-white/10"
                        }
                      `}
                    >
                      <div
                        className='bg-transparent glass-radius-full'
                        style={{
                          width: Math.min(size, 16),
                          height: Math.min(size, 16),
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className='glass-flex glass-items-center space-x-2'>
                {showUndoRedo && (
                  <>
                    <button
                      onClick={handleUndo}
                      disabled={undoStack.length === 0}
                      className='glass-px-3 glass-py-1 glass-text-sm font-medium text-primary/70 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard'
                    >
                      ↶ Undo
                    </button>
                    <button
                      onClick={handleRedo}
                      disabled={redoStack.length === 0}
                      className='glass-px-3 glass-py-1 glass-text-sm font-medium text-primary/70 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard'
                    >
                      ↷ Redo
                    </button>
                  </>
                )}
                <button
                  onClick={handleClear}
                  className='glass-px-3 glass-py-1 glass-text-sm font-medium text-primary hover:glass-text-secondary glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard'
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          <div className='glass-flex space-x-4'>
            {/* Whiteboard Canvas */}
            <div className='relative glass-flex-1'>
              <canvas
                ref={canvasRef}
                width={width}
                height={height}
                className={`
                  border border-white/20 rounded-lg cursor-crosshair
                  ${readOnly ? "cursor-not-allowed" : ""}
                `}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />

              {/* User cursors */}
              {showUserCursors && (
                <AnimatePresence>
                  {simulatedUsers
                    .filter((user: any) => user.id !== currentUserId)
                    .map((user: any) => (
                      <UserCursor key={user.id} user={user} />
                    ))}
                </AnimatePresence>
              )}

              {/* Grid toggle */}
              {!readOnly && (
                <button
                  onClick={() => setGridVisible(!gridVisible)}
                  className='absolute glass-top-2 right-2 glass-p-2 text-primary/60 hover:text-primary glass-focus glass-touch-target glass-contrast-guard'
                  title="Toggle Grid"
                >
                  #
                </button>
              )}
            </div>

            {/* User List */}
            {showUserList && (
              <div
                className={`
                w-48 p-3 rounded-lg space-y-2
                ${createGlassStyle({ variant: "default" })}
              `}
              >
                <h3 className='glass-text-sm font-medium text-primary/90 mb-3'>
                  Active Users ({simulatedUsers.length})
                </h3>
                {simulatedUsers.map((user: any) => (
                  <div
                    key={user.id}
                    className='glass-flex glass-items-center space-x-2 glass-p-2 glass-radius hover:glass-surface-subtle/5'
                  >
                    <div
                      className='w-3 h-3 glass-radius-full glass-border glass-border-white/30'
                      style={{ backgroundColor: user.color }}
                    />
                    <span className='glass-text-sm text-primary/80 truncate'>
                      {user.name}
                      {user.id === currentUserId && " (You)"}
                    </span>
                    {user.isDrawing && (
                      <span className='glass-text-xs text-primary'>✏️</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Status */}
          <div className='glass-flex glass-items-center glass-justify-between glass-text-xs text-primary/50'>
            <div className='glass-flex glass-items-center space-x-4'>
              <span>{localStrokes.length} strokes</span>
              {realTimeSync && (
                <span className='glass-flex glass-items-center space-x-1'>
                  <div className='w-2 h-2 glass-surface-green glass-radius-full animate-pulse' />
                  <span>Synced</span>
                </span>
              )}
              {readOnly && <span className='text-primary'>Read Only</span>}
            </div>
            <div>
              Canvas: {width}×{height}
            </div>
          </div>
        </div>
      </OptimizedGlass>
    );
  }
);