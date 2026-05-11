"use client";
import React from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { motion } from "framer-motion";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useMotionPreference } from "../../hooks/useMotionPreference";
import { OptimizedGlass } from "../../primitives";
import { useA11yId } from "../../utils/a11y";
import { createGlassStyle } from "../../utils/createGlassStyle";
import { useGlassSound } from "../../utils/soundDesign";
import {
  ContrastGuard,
  TextWithContrast,
} from "@/components/accessibility/ContrastGuard";
import { ANIMATION, BORDER_RADIUS } from "../../tokens/designConstants";

export interface Island {
  id: string;
  content: React.ReactNode;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex?: number;
  category?: string;
  pinned?: boolean;
  minimized?: boolean;
  resizable?: boolean;
  draggable?: boolean;
  connections?: string[];
  metadata?: Record<string, unknown>;
}

export interface IslandConnection {
  from: string;
  to: string;
  type: "solid" | "dashed" | "dotted" | "animated";
  color?: string;
  strength?: number;
}

export interface LayoutConfig {
  containerPadding: number;
  islandSpacing: number;
  connectionDistance: number;
  animationSpeed: number;
  gravityStrength: number;
  repulsionStrength: number;
  enablePhysics: boolean;
  enableAutoArrange: boolean;
  enableCollisionDetection: boolean;
}

export interface GlassIslandLayoutProps {
  islands: Island[];
  connections?: IslandConnection[];
  config?: Partial<LayoutConfig>;
  showMinimap?: boolean;
  showConnections?: boolean;
  showGrid?: boolean;
  showStats?: boolean;
  enablePhysics?: boolean;
  enableDragging?: boolean;
  enableResizing?: boolean;
  enableZooming?: boolean;
  zoomLevel?: number;
  width?: string | number;
  height?: string | number;
  compact?: boolean;
  centerOnLoad?: boolean;
  onIslandMove?: (island: Island, x: number, y: number) => void;
  onIslandResize?: (island: Island, width: number, height: number) => void;
  onIslandSelect?: (island: Island) => void;
  onConnectionCreate?: (from: string, to: string) => void;
  className?: string;
}

const defaultConfig: LayoutConfig = {
  containerPadding: 50,
  islandSpacing: 100,
  connectionDistance: 300,
  animationSpeed: 1.0,
  gravityStrength: 0.02,
  repulsionStrength: 100,
  enablePhysics: false,
  enableAutoArrange: false,
  enableCollisionDetection: true,
};

interface PhysicsIsland extends Island {
  vx: number;
  vy: number;
  mass: number;
  fixed: boolean;
}

export const GlassIslandLayout = forwardRef<
  HTMLDivElement,
  GlassIslandLayoutProps
>(
  (
    {
      // ContrastGuard layout text coverage is tracked in the manual accessibility QA report.

      islands,
      connections = [],
      config = {},
      showMinimap = true,
      showConnections = true,
      showGrid = false,
      showStats = true,
      enablePhysics = false,
      enableDragging = true,
      enableResizing = false,
      enableZooming = true,
      zoomLevel = 1.0,
      width = "min(1120px, calc(100vw - 48px))",
      height = 600,
      compact = false,
      centerOnLoad = true,
      onIslandMove,
      onIslandResize,
      onIslandSelect,
      onConnectionCreate,
      className = "",
      ...props
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion();
    const [layoutIslands, setLayoutIslands] = useState<Island[]>(islands);
    const [physicsIslands, setPhysicsIslands] = useState<PhysicsIsland[]>([]);
    const [selectedIsland, setSelectedIsland] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [viewportOffset, setViewportOffset] = useState({ x: 0, y: 0 });
    const [currentZoom, setCurrentZoom] = useState(zoomLevel);
    const [isResizing, setIsResizing] = useState<string | null>(null);
    const [connectionMode, setConnectionMode] = useState(false);
    const [pendingConnection, setPendingConnection] = useState<string | null>(
      null
    );

    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameRef = useRef<number>();

    const [layoutConfig] = useState<LayoutConfig>({
      ...defaultConfig,
      ...config,
    });

    const id = useA11yId("glass-island-layout");
    const { shouldAnimate } = useMotionPreference();
    const { play } = useGlassSound();

    // Auto-arrange islands in a spiral pattern
    const autoArrange = useCallback(() => {
      if (!layoutConfig.enableAutoArrange) return;

      const arranged = islands.map((island, index) => {
        const angle = index * 0.618 * 2 * Math.PI; // Golden angle
        const radius = Math.sqrt(index + 1) * layoutConfig.islandSpacing;

        return {
          ...island,
          x: Math.cos(angle) * radius + 400,
          y: Math.sin(angle) * radius + 400,
        };
      });

      setLayoutIslands(arranged);
    }, [islands, layoutConfig]);

    // Initialize physics islands
    const initializePhysics = useCallback(() => {
      if (!enablePhysics) return;

      const physics = layoutIslands.map((island: any) => ({
        ...island,
        vx: 0,
        vy: 0,
        mass: (island.width * island.height) / 10000,
        fixed: island.pinned || false,
      }));

      setPhysicsIslands(physics);
    }, [layoutIslands, enablePhysics]);

    // Physics simulation step
    const updatePhysics = useCallback(() => {
      if (!enablePhysics || physicsIslands.length === 0) return;

      setPhysicsIslands((prevIslands) => {
        const newIslands = prevIslands.map((island: any) => ({ ...island }));

        // Apply forces between islands
        for (let i = 0; i < newIslands.length; i++) {
          const island1 = newIslands[i];
          if (island1.fixed) continue;

          let fx = 0;
          let fy = 0;

          for (let j = 0; j < newIslands.length; j++) {
            if (i === j) continue;

            const island2 = newIslands[j];
            const dx =
              island2.x + island2.width / 2 - (island1.x + island1.width / 2);
            const dy =
              island2.y + island2.height / 2 - (island1.y + island1.height / 2);
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 0) {
              // Repulsion force
              const repulsion =
                layoutConfig.repulsionStrength / (distance * distance);
              fx -= (dx / distance) * repulsion;
              fy -= (dy / distance) * repulsion;

              // Connection attraction
              const hasConnection = connections.some(
                (conn) =>
                  (conn.from === island1.id && conn.to === island2.id) ||
                  (conn.to === island1.id && conn.from === island2.id)
              );

              if (hasConnection) {
                const attraction = layoutConfig.gravityStrength * distance;
                fx += (dx / distance) * attraction;
                fy += (dy / distance) * attraction;
              }
            }
          }

          // Apply forces
          island1.vx += fx / island1.mass;
          island1.vy += fy / island1.mass;

          // Damping
          island1.vx *= 0.95;
          island1.vy *= 0.95;

          // Update position
          island1.x += island1.vx * layoutConfig.animationSpeed;
          island1.y += island1.vy * layoutConfig.animationSpeed;

          // Boundary constraints
          if (island1.x < layoutConfig.containerPadding) {
            island1.x = layoutConfig.containerPadding;
            island1.vx = 0;
          }
          if (island1.y < layoutConfig.containerPadding) {
            island1.y = layoutConfig.containerPadding;
            island1.vy = 0;
          }
        }

        return newIslands;
      });
    }, [enablePhysics, physicsIslands, connections, layoutConfig]);

    // Physics animation loop
    useEffect(() => {
      if (!enablePhysics) return;

      const animate = () => {
        updatePhysics();
        animationFrameRef.current = requestAnimationFrame(animate);
      };

      animationFrameRef.current = requestAnimationFrame(animate);

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }, [enablePhysics, updatePhysics]);

    // Update layout islands from physics
    useEffect(() => {
      if (enablePhysics && physicsIslands.length > 0) {
        setLayoutIslands(physicsIslands);
      }
    }, [physicsIslands, enablePhysics]);

    // Draw connections on canvas
    const drawConnections = useCallback(() => {
      if (!showConnections || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(currentZoom, currentZoom);
      ctx.translate(viewportOffset.x, viewportOffset.y);

      connections.forEach((connection: any) => {
        const fromIsland = layoutIslands.find((i) => i.id === connection.from);
        const toIsland = layoutIslands.find((i) => i.id === connection.to);

        if (!fromIsland || !toIsland) return;

        const fromX = fromIsland.x + fromIsland.width / 2;
        const fromY = fromIsland.y + fromIsland.height / 2;
        const toX = toIsland.x + toIsland.width / 2;
        const toY = toIsland.y + toIsland.height / 2;

        ctx.strokeStyle = connection.color || "var(--glass-bg-hover)";
        ctx.lineWidth = (connection.strength || 1) * 2;

        if (connection.type === "dashed") {
          ctx.setLineDash([5, 5]);
        } else if (connection.type === "dotted") {
          ctx.setLineDash([2, 3]);
        } else {
          ctx.setLineDash([]);
        }

        ctx.beginPath();
        ctx.moveTo(fromX, fromY);

        // Curved connection
        const controlX = (fromX + toX) / 2;
        const controlY = Math.min(fromY, toY) - Math.abs(toX - fromX) / 4;
        ctx.quadraticCurveTo(controlX, controlY, toX, toY);

        ctx.stroke();

        // Draw arrow
        const angle = Math.atan2(toY - controlY, toX - controlX);
        const arrowLength = 10;

        ctx.fillStyle = connection.color || "var(--glass-border-hover)";
        ctx.beginPath();
        ctx.moveTo(toX, toY);
        ctx.lineTo(
          toX - arrowLength * Math.cos(angle - Math.PI / 6),
          toY - arrowLength * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
          toX - arrowLength * Math.cos(angle + Math.PI / 6),
          toY - arrowLength * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fill();
      });

      ctx.restore();
    }, [
      showConnections,
      connections,
      layoutIslands,
      currentZoom,
      viewportOffset,
    ]);

    // Handle island dragging
    const handleMouseDown = useCallback(
      (e: React.MouseEvent, island: Island) => {
        if (!enableDragging) return;

        setIsDragging(true);
        setSelectedIsland(island.id);
        setDragOffset({
          x: e.clientX - island.x * currentZoom,
          y: e.clientY - island.y * currentZoom,
        });

        if (connectionMode) {
          if (pendingConnection) {
            // Create connection
            onConnectionCreate?.(pendingConnection, island.id);
            setPendingConnection(null);
            setConnectionMode(false);
            play("connect");
          } else {
            setPendingConnection(island.id);
          }
          return;
        }

        onIslandSelect?.(island);
        play("select");
      },
      [
        enableDragging,
        currentZoom,
        connectionMode,
        pendingConnection,
        onConnectionCreate,
        onIslandSelect,
        play,
      ]
    );

    const handleMouseMove = useCallback(
      (e: React.MouseEvent) => {
        if (!isDragging || !selectedIsland) return;

        const newX = (e.clientX - dragOffset.x) / currentZoom;
        const newY = (e.clientY - dragOffset.y) / currentZoom;

        setLayoutIslands((prev: any) =>
          prev.map((island: any) =>
            island.id === selectedIsland
              ? { ...island, x: newX, y: newY }
              : island
          )
        );

        // Update physics island if physics is enabled
        if (enablePhysics) {
          setPhysicsIslands((prev: any) =>
            prev.map((island: any) =>
              island.id === selectedIsland
                ? { ...island, x: newX, y: newY, vx: 0, vy: 0 }
                : island
            )
          );
        }

        const island = layoutIslands.find((i) => i.id === selectedIsland);
        if (island) {
          onIslandMove?.(island, newX, newY);
        }
      },
      [
        isDragging,
        selectedIsland,
        dragOffset,
        currentZoom,
        enablePhysics,
        layoutIslands,
        onIslandMove,
      ]
    );

    const handleMouseUp = useCallback(() => {
      setIsDragging(false);
      setSelectedIsland(null);
      setIsResizing(null);
    }, []);

    // Center view on load
    useEffect(() => {
      if (centerOnLoad && layoutIslands.length > 0 && containerRef.current) {
        const bounds = layoutIslands.reduce(
          (acc, island) => ({
            minX: Math.min(acc.minX, island.x),
            minY: Math.min(acc.minY, island.y),
            maxX: Math.max(acc.maxX, island.x + island.width),
            maxY: Math.max(acc.maxY, island.y + island.height),
          }),
          { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity }
        );

        const centerX = (bounds.minX + bounds.maxX) / 2;
        const centerY = (bounds.minY + bounds.maxY) / 2;
        const containerRect = containerRef.current.getBoundingClientRect();

        setViewportOffset({
          x: containerRect.width / 2 - centerX * currentZoom,
          y: containerRect.height / 2 - centerY * currentZoom,
        });
      }
    }, [centerOnLoad, layoutIslands, currentZoom]);

    // Initialize
    useEffect(() => {
      setLayoutIslands(islands);
      if (layoutConfig.enableAutoArrange) {
        autoArrange();
      }
    }, [islands, autoArrange, layoutConfig.enableAutoArrange]);

    useEffect(() => {
      initializePhysics();
    }, [initializePhysics]);

    useEffect(() => {
      drawConnections();
    }, [drawConnections]);

    // Event listeners
    useEffect(() => {
      document.addEventListener("mousemove", handleMouseMove as any);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove as any);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }, [handleMouseMove, handleMouseUp]);

    const Minimap = () => {
      const minimapScale = 0.1;
      const minimapWidth = 200;
      const minimapHeight = 150;

      return (
        <div
          className="glass-island-layout-minimap glass-absolute glass-right-4 glass-w-50 glass-h-38 glass-surface-dark/50 glass-border glass-border-white/20 glass-radius-lg glass-p-2"
          style={{ top: 96 }}
        >
          <div className="glass-text-xs glass-text-primary-opacity-70 glass-mb-1">
            Overview
          </div>
          <div
            className="glass-relative glass-surface-dark/30 glass-radius"
            style={{ width: minimapWidth, height: minimapHeight }}
          >
            {layoutIslands.map((island: any) => (
              <div
                key={`mini-${island.id}`}
                className={`absolute rounded ${
                  selectedIsland === island.id ? "bg-blue-400" : "bg-white/40"
                }`}
                style={{
                  left: island.x * minimapScale,
                  top: island.y * minimapScale,
                  width: Math.max(2, island.width * minimapScale),
                  height: Math.max(2, island.height * minimapScale),
                }}
              />
            ))}

            {/* Viewport indicator */}
            <div
              className="glass-absolute glass-border glass-border-blue glass-pointer-events-none"
              style={{
                left: (-viewportOffset.x * minimapScale) / currentZoom,
                top: (-viewportOffset.y * minimapScale) / currentZoom,
                width: (200 * minimapScale) / currentZoom,
                height: (150 * minimapScale) / currentZoom,
              }}
            />
          </div>
        </div>
      );
    };

    const StatsPanel = () => (
      <div
        className={`
        absolute bottom-4 left-4 p-3 rounded-lg border border-white/10
        ${createGlassStyle({ blur: "sm", opacity: 0.8 }).background}
      `}
      >
        <div className="glass-text-xs glass-text-primary-glass-opacity-90 glass-space-y-1">
          <div>Islands: {layoutIslands.length}</div>
          <div>Connections: {connections.length}</div>
          <div>Zoom: {Math.round(currentZoom * 100)}%</div>
          {enablePhysics && <div>Physics: ON</div>}
        </div>
      </div>
    );

    const Controls = () => (
      <div
        className="glass-island-layout-controls glass-absolute glass-left-4 glass-flex glass-flex-col glass-space-y-2"
        style={{ top: 96 }}
      >
        <motion.button
          className="glass-p-2 glass-surface-subtle/10 hover:glass-surface-subtle/20 glass-border glass-border-white/20 glass-radius-lg glass-text-primary glass-transition-colors glass-focus glass-touch-target glass-contrast-guard"
          whileHover={shouldAnimate ? { scale: 1.05 } : {}}
          whileTap={shouldAnimate ? { scale: 0.95 } : {}}
          onClick={() => setCurrentZoom((prev: any) => Math.min(3, prev * 1.2))}
        >
          🔍+
        </motion.button>

        <motion.button
          className="glass-p-2 glass-surface-subtle/10 hover:glass-surface-subtle/20 glass-border glass-border-white/20 glass-radius-lg glass-text-primary glass-transition-colors glass-focus glass-touch-target glass-contrast-guard"
          whileHover={shouldAnimate ? { scale: 1.05 } : {}}
          whileTap={shouldAnimate ? { scale: 0.95 } : {}}
          onClick={() =>
            setCurrentZoom((prev: any) => Math.max(0.2, prev / 1.2))
          }
        >
          🔍-
        </motion.button>

        <motion.button
          className={`p-2 border border-white/20 ${BORDER_RADIUS.lg} text-white transition-colors glass-focus glass-touch-target glass-contrast-guard ${
            connectionMode ? "bg-blue-500/50" : "bg-white/10 hover:bg-white/20"
          }`}
          whileHover={shouldAnimate ? { scale: 1.05 } : {}}
          whileTap={shouldAnimate ? { scale: 0.95 } : {}}
          onClick={() => setConnectionMode(!connectionMode)}
        >
          🔗
        </motion.button>

        <motion.button
          className="glass-p-2 glass-surface-subtle/10 hover:glass-surface-subtle/20 glass-border glass-border-white/20 glass-radius-lg glass-text-primary glass-transition-colors glass-focus glass-touch-target glass-contrast-guard"
          whileHover={shouldAnimate ? { scale: 1.05 } : {}}
          whileTap={shouldAnimate ? { scale: 0.95 } : {}}
          onClick={autoArrange}
        >
          ⚡
        </motion.button>
      </div>
    );

    return (
      <OptimizedGlass
        ref={ref}
        variant="frosted"
        className={`glass-island-layout relative overflow-auto ${className}`}
        style={{
          width,
          maxWidth: "100%",
          height,
          overflowX: "auto",
          overflowY: "auto",
        }}
        {...props}
      >
        {/* Header */}
        {!compact && (
          <div className="glass-absolute glass-top-0 glass-left-0 glass-right-0 glass-p-4 glass-z-10">
            <div className="glass-flex glass-items-center glass-justify-between">
              <div>
                <h3 className="glass-text-xl glass-font-semibold glass-text-primary-glass-opacity-90">
                  Island Layout
                </h3>
                <p className="glass-text-sm glass-text-primary-glass-opacity-60">
                  Floating content islands with connections
                </p>
              </div>

              {connectionMode && (
                <div className="glass-px-3 glass-py-1 glass-surface-blue/20 glass-border glass-border-blue/50 glass-radius-lg glass-text-secondary glass-text-sm">
                  {pendingConnection
                    ? "Select target island"
                    : "Select source island"}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main container */}
        <div
          ref={containerRef}
          className="glass-absolute glass-inset-0 glass-overflow-visible glass-cursor-move"
          style={{
            width: 2000,
            height: 2000,
            transform: `scale(${currentZoom}) translate(${viewportOffset.x}px, ${viewportOffset.y}px)`,
            transformOrigin: "0 0",
          }}
        >
          {/* Grid background */}
          {showGrid && (
            <div
              className="glass-absolute glass-inset-0 glass-opacity-10"
              style={{
                backgroundImage: `
                  linear-gradient(var(--glass-bg-default) 1px, transparent 1px),
                  linear-gradient(90deg, var(--glass-bg-default) 1px, transparent 1px)
                `,
                backgroundSize: "50px 50px",
              }}
            />
          )}

          {/* Canvas for connections */}
          <canvas
            ref={canvasRef}
            data-glass-overlay="true"
            className="glass-absolute glass-inset-0 glass-pointer-events-none"
            width={2000}
            height={2000}
          />

          {/* Islands */}
          {layoutIslands.map((island, index) => (
            <motion.div
              key={island.id}
              className={`absolute cursor-pointer transition-all duration-[${ANIMATION.DURATION.fast}ms] ${
                selectedIsland === island.id ? "ring-2 ring-blue-400" : ""
              } ${island.minimized ? "opacity-50" : ""}`}
              style={{
                left: island.x,
                top: island.y,
                width: island.width,
                height: island.minimized ? 40 : island.height,
                zIndex:
                  island.zIndex ||
                  (selectedIsland === island.id ? 1000 : index),
              }}
              initial={shouldAnimate ? { opacity: 0, scale: 0.8 } : false}
              animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : { duration: ANIMATION.DURATION.normal / 1000 }
              }
              onMouseDown={(e) => handleMouseDown(e, island)}
            >
              <OptimizedGlass
                variant="frosted"
                className={`w-full h-full box-border p-4 hover:bg-white/10 transition-all duration-[${ANIMATION.DURATION.fast}ms] ${
                  island.pinned ? "border-yellow-400/50" : ""
                } ${connectionMode ? "hover:border-blue-400" : ""}`}
                style={{ boxSizing: "border-box", overflow: "hidden" }}
              >
                {!island.minimized && island.content}

                {/* Island controls */}
                <div
                  className="glass-absolute glass-top-2 glass-right-2 glass-flex glass-space-x-1 glass-opacity-0 glass-hover-opacity-100 glass-transition-opacity"
                  data-glass-overlay="true"
                >
                  {island.category && (
                    <span className="glass-px-2 glass-py-1 glass-surface-dark/30 glass-text-primary-opacity-70 glass-radius glass-text-xs">
                      {island.category}
                    </span>
                  )}

                  <button
                    tabIndex={-1}
                    onClick={(e) => {
                      e.stopPropagation();
                      setLayoutIslands((prev: any) =>
                        prev.map((i: any) =>
                          i.id === island.id
                            ? { ...i, minimized: !i.minimized }
                            : i
                        )
                      );
                    }}
                    className="glass-w-6 glass-h-6 glass-surface-subtle/20 hover:glass-surface-subtle/30 glass-radius glass-text-primary-glass-opacity-80 glass-text-xs glass-transition-colors glass-focus glass-touch-target glass-contrast-guard"
                  >
                    {island.minimized ? "□" : "_"}
                  </button>
                </div>

                {/* Resize handle */}
                {enableResizing && !island.minimized && (
                  <div
                    className="glass-absolute glass-bottom-0 glass-right-0 glass-w-4 glass-h-4 glass-surface-subtle/20 glass-cursor-se-resize glass-opacity-0 glass-hover-opacity-100 glass-transition-opacity"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      setIsResizing(island.id);
                    }}
                  >
                    ⋮⋮
                  </div>
                )}
              </OptimizedGlass>
            </motion.div>
          ))}
        </div>

        {/* Controls */}
        {enableZooming && <Controls />}

        {/* Minimap */}
        {showMinimap && <Minimap />}

        {/* Stats */}
        {showStats && <StatsPanel />}
      </OptimizedGlass>
    );
  }
);

GlassIslandLayout.displayName = "GlassIslandLayout";
