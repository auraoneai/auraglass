"use client";
import { AnimatePresence, motion } from "framer-motion";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";
import { useMotionPreference } from "../../hooks/useMotionPreference";
import { OptimizedGlass } from "../../primitives";
import { useA11yId } from "../../utils/a11y";
import { useGlassSound } from "../../utils/soundDesign";
import {
  ContrastGuard,
  TextWithContrast,
} from "@/components/accessibility/ContrastGuard";

export interface FractalNode {
  id: string;
  content: React.ReactNode;
  children?: FractalNode[];
  depth?: number;
  metadata?: Record<string, unknown>;
  scale?: number;
  rotation?: number;
  position?: { x: number; y: number };
}

export interface GlassFractalLayoutProps {
  nodes: FractalNode[];
  maxDepth?: number;
  fractalType?:
    | "sierpinski"
    | "mandelbrot"
    | "julia"
    | "tree"
    | "spiral"
    | "custom";
  scaleFactor?: number;
  branchAngle?: number;
  initialScale?: number;
  recursive?: boolean;
  animateGrowth?: boolean;
  zoomLevel?: number;
  centerNode?: boolean;
  interactiveZoom?: boolean;
  showControls?: boolean;
  onNodeClick?: (node: FractalNode) => void;
  onNodeHover?: (node: FractalNode | null) => void;
  glassConfig?: {
    blur?: number;
    opacity?: number;
    saturation?: number;
    brightness?: number;
    contrast?: number;
  };
  soundEnabled?: boolean;
  compact?: boolean;
  contained?: boolean;
  maxHeight?: number | string;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

export const GlassFractalLayout = forwardRef<
  HTMLDivElement,
  GlassFractalLayoutProps
>(
  (
    {
      // ContrastGuard layout text coverage is tracked in the manual accessibility QA report.

      nodes = [],
      maxDepth = 5,
      fractalType = "tree",
      scaleFactor = 0.618, // Golden ratio
      branchAngle = 30,
      initialScale = 1,
      recursive = true,
      animateGrowth = true,
      zoomLevel = 1,
      centerNode = true,
      interactiveZoom = true,
      showControls,
      onNodeClick,
      onNodeHover,
      glassConfig = {},
      soundEnabled = true,
      compact = false,
      contained = false,
      maxHeight,
      height,
      className = "",
      style = {},
      ...props
    },
    ref
  ) => {
    const isCompactLike = compact || contained;
    const displayMaxDepth = isCompactLike ? Math.min(maxDepth, 2) : maxDepth;
    const displayInitialScale = isCompactLike
      ? Math.min(initialScale, 0.58)
      : initialScale;
    const displayScaleFactor = isCompactLike
      ? Math.min(scaleFactor, 0.5)
      : scaleFactor;
    const displayZoomLevel = isCompactLike
      ? Math.min(zoomLevel, 0.72)
      : zoomLevel;
    const nodeDistance = isCompactLike ? 56 : 100;
    const spiralDistance = isCompactLike ? 30 : 50;
    const triangleRadius = isCompactLike ? 48 : 80;
    const rowDistance = isCompactLike ? 42 : 60;
    const columnDistance = isCompactLike ? 50 : 80;
    const [hoveredNode, setHoveredNode] = useState<string | null>(null);
    const [selectedNode, setSelectedNode] = useState<string | null>(null);
    const [currentZoom, setCurrentZoom] = useState(displayZoomLevel);
    const [growthProgress, setGrowthProgress] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<number>();

    const { prefersReducedMotion } = useMotionPreference();
    const layoutId = useA11yId();
    const { play } = useGlassSound();
    const boundedHeight =
      maxHeight ?? height ?? (compact || contained ? 240 : 600);
    const shouldShowControls = showControls ?? !compact;

    useEffect(() => {
      setCurrentZoom(displayZoomLevel);
    }, [displayZoomLevel]);

    useEffect(() => {
      if (animateGrowth && !prefersReducedMotion) {
        const startTime = Date.now();
        const duration = 2000; // 2 seconds

        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          setGrowthProgress(progress);

          if (progress < 1) {
            animationRef.current = requestAnimationFrame(animate);
          }
        };

        animationRef.current = requestAnimationFrame(animate);
      } else {
        setGrowthProgress(1);
      }

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }, [animateGrowth, prefersReducedMotion]);

    const generateFractalPositions = useCallback(
      (
        nodes: FractalNode[],
        depth: number = 0,
        parentPos: { x: number; y: number } = { x: 0, y: 0 },
        parentAngle: number = -90,
        parentScale: number = displayInitialScale
      ): FractalNode[] => {
        if (
          depth >= displayMaxDepth ||
          depth >= growthProgress * displayMaxDepth
        )
          return [];

        return nodes.map((node, index) => {
          const currentScale =
            parentScale * Math.pow(displayScaleFactor, depth);
          let position = { x: 0, y: 0 };
          let rotation = 0;

          switch (fractalType) {
            case "tree":
              const angleOffset =
                (index - (nodes.length - 1) / 2) * branchAngle;
              const currentAngle = parentAngle + angleOffset;
              const distance = nodeDistance * currentScale;
              position = {
                x:
                  parentPos.x +
                  Math.cos((currentAngle * Math.PI) / 180) * distance,
                y:
                  parentPos.y +
                  Math.sin((currentAngle * Math.PI) / 180) * distance,
              };
              rotation = currentAngle + 90;
              break;

            case "spiral":
              const spiralAngle = parentAngle + index * 137.5; // Golden angle
              const spiralRadius = depth * spiralDistance * currentScale;
              position = {
                x:
                  parentPos.x +
                  Math.cos((spiralAngle * Math.PI) / 180) * spiralRadius,
                y:
                  parentPos.y +
                  Math.sin((spiralAngle * Math.PI) / 180) * spiralRadius,
              };
              rotation = spiralAngle;
              break;

            case "sierpinski":
              // Sierpinski triangle pattern
              const triAngle = index * 120 + parentAngle;
              const triRadius = triangleRadius * currentScale;
              position = {
                x:
                  parentPos.x +
                  Math.cos((triAngle * Math.PI) / 180) * triRadius,
                y:
                  parentPos.y +
                  Math.sin((triAngle * Math.PI) / 180) * triRadius,
              };
              break;

            case "mandelbrot":
              // Approximation of Mandelbrot set pattern
              const c = { x: -0.7269, y: 0.1889 };
              const z = { x: index * 0.1, y: depth * 0.1 };
              position = {
                x: parentPos.x + z.x * 100 * currentScale,
                y: parentPos.y + z.y * 100 * currentScale,
              };
              break;

            default:
              position = {
                x:
                  parentPos.x +
                  (index - nodes.length / 2) * columnDistance * currentScale,
                y: parentPos.y + depth * rowDistance * currentScale,
              };
          }

          const processedNode: FractalNode = {
            ...node,
            depth,
            scale: currentScale,
            rotation,
            position,
            children:
              node.children && recursive
                ? generateFractalPositions(
                    node.children,
                    depth + 1,
                    position,
                    rotation || parentAngle,
                    currentScale
                  )
                : [],
          };

          return processedNode;
        });
      },
      [
        displayMaxDepth,
        fractalType,
        displayScaleFactor,
        branchAngle,
        displayInitialScale,
        recursive,
        growthProgress,
        nodeDistance,
        spiralDistance,
        triangleRadius,
        columnDistance,
        rowDistance,
      ]
    );

    const processedNodes = useMemo(() => {
      const rootPosition = centerNode ? { x: 0, y: 0 } : { x: -200, y: -200 };
      return generateFractalPositions(nodes, 0, rootPosition);
    }, [nodes, generateFractalPositions, centerNode]);

    const flattenNodes = (nodes: FractalNode[]): FractalNode[] => {
      return nodes.reduce((acc: FractalNode[], node) => {
        acc.push(node);
        if (node.children) {
          acc.push(...flattenNodes(node.children));
        }
        return acc;
      }, []);
    };

    const allNodes = useMemo(
      () => flattenNodes(processedNodes),
      [processedNodes]
    );

    const handleNodeClick = useCallback(
      (node: FractalNode) => {
        setSelectedNode(node.id);
        onNodeClick?.(node);

        if (soundEnabled) {
          play("click");
        }
      },
      [onNodeClick, soundEnabled, play]
    );

    const handleNodeHover = useCallback(
      (node: FractalNode | null) => {
        setHoveredNode(node?.id || null);
        onNodeHover?.(node);

        if (soundEnabled && node) {
          play("hover");
        }
      },
      [onNodeHover, soundEnabled, play]
    );

    const handleWheel = useCallback(
      (e: React.WheelEvent) => {
        if (!interactiveZoom) return;

        e.preventDefault();
        const zoomDelta = e.deltaY > 0 ? 0.9 : 1.1;
        setCurrentZoom((prev: any) =>
          Math.max(0.1, Math.min(5, prev * zoomDelta))
        );
      },
      [interactiveZoom]
    );

    const getNodeVariants = () => ({
      hidden: {
        opacity: 0,
      },
      visible: (delay: number) => ({
        opacity: 1,
        transition: {
          type: "spring",
          tension: 300,
          friction: 25,
          delay: prefersReducedMotion ? 0 : delay * 0.1,
        },
      }),
      hover: {
        opacity: 1,
        transition: {
          type: "spring",
          tension: 400,
          friction: 20,
        },
      },
      selected: {
        opacity: 1,
        transition: {
          type: "spring",
          tension: 400,
          friction: 20,
        },
      },
    });

    return (
      <OptimizedGlass
        ref={ref}
        className={`glass-fractal-layout relative overflow-hidden ${className}`}
        style={{
          width: "100%",
          height:
            typeof boundedHeight === "number"
              ? `${boundedHeight}px`
              : boundedHeight,
          maxHeight:
            typeof boundedHeight === "number"
              ? `${boundedHeight}px`
              : boundedHeight,
          ...style,
        }}
        glassConfig={{
          blur: 15,
          opacity: 0.9,
          saturation: 1.1,
          brightness: 1.05,
          ...glassConfig,
        }}
        onWheel={handleWheel}
        role="application"
        aria-label="Fractal layout visualization"
        id={layoutId}
        {...props}
      >
        <div
          ref={containerRef}
          className="glass-absolute glass-inset-0 glass-flex glass-items-center glass-justify-center"
        >
          <AnimatePresence>
            {allNodes.map((node, index) => {
              const isHovered = hoveredNode === node.id;
              const isSelected = selectedNode === node.id;
              const nodeScale = (node.scale || 1) * currentZoom;
              const nodeX = (node.position?.x || 0) * currentZoom;
              const nodeY = (node.position?.y || 0) * currentZoom;

              return (
                <motion.div
                  key={`${node.id}-${node.depth}`}
                  className="glass-absolute glass-cursor-pointer"
                  style={{
                    left: "50%",
                    top: "50%",
                    transform: `translate(-50%, -50%) translate(${nodeX}px, ${nodeY}px) scale(${nodeScale}) rotate(${node.rotation || 0}deg)`,
                  }}
                  custom={node.depth || 0}
                  variants={getNodeVariants()}
                  initial="hidden"
                  animate={
                    isSelected ? "selected" : isHovered ? "hover" : "visible"
                  }
                  exit="hidden"
                  onMouseEnter={() => handleNodeHover(node)}
                  onMouseLeave={() => handleNodeHover(null)}
                  onClick={() => handleNodeClick(node)}
                >
                  <div
                    className={`
                      glass-surface rounded-lg border border-white/20 glass-backdrop-blur-md
                      transition-all duration-200
                      ${isCompactLike ? "p-1 min-w-[28px] min-h-[28px] text-[10px]" : "p-2 min-w-[40px] min-h-[40px]"}
                      flex items-center justify-center
                      ${
                        isHovered || isSelected
                          ? "bg-white/20 border-white/40"
                          : "bg-white/10 border-white/20"
                      }
                    `}
                    style={{
                      opacity: Math.max(0.3, 1 - (node.depth || 0) * 0.2),
                    }}
                  >
                    {node.content}
                  </div>

                  {/* Connection lines to children */}
                  {node.children?.map((child, childIndex) => (
                    <div
                      key={`line-${child.id}`}
                      className="glass-absolute glass-border-l glass-border-white/30"
                      style={{
                        left: "50%",
                        top: "50%",
                        height:
                          Math.sqrt(
                            Math.pow(
                              (child.position?.x || 0) -
                                (node.position?.x || 0),
                              2
                            ) +
                              Math.pow(
                                (child.position?.y || 0) -
                                  (node.position?.y || 0),
                                2
                              )
                          ) * currentZoom,
                        transformOrigin: "0 0",
                        transform: `rotate(${Math.atan2(
                          (child.position?.y || 0) - (node.position?.y || 0),
                          (child.position?.x || 0) - (node.position?.x || 0)
                        )}rad)`,
                      }}
                    />
                  ))}

                  {/* Depth indicator */}
                  {!isCompactLike && (node.depth || 0) > 0 && (
                    <div className="glass-absolute glass-top-1 glass--right-1 glass-surface-dark/50 glass-text-primary glass-text-xs glass-radius-full glass-w-4 glass-h-4 glass-flex glass-items-center glass-justify-center">
                      {node.depth}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Controls */}
        {shouldShowControls && (
          <div className="glass-absolute glass-bottom-4 glass-left-4 glass-flex glass-flex-col glass-gap-2">
            <div className="glass-text-xs glass-text-primary-opacity-70 glass-surface-dark/20 glass-px-2 glass-py-1 glass-radius glass-backdrop-blur-sm glass-contrast-guard">
              Type: {fractalType}
            </div>
            <div className="glass-text-xs glass-text-primary-opacity-70 glass-surface-dark/20 glass-px-2 glass-py-1 glass-radius glass-backdrop-blur-sm glass-contrast-guard">
              Depth: {Math.floor(growthProgress * maxDepth)}/{maxDepth}
            </div>
            <div className="glass-text-xs glass-text-primary-opacity-70 glass-surface-dark/20 glass-px-2 glass-py-1 glass-radius glass-backdrop-blur-sm glass-contrast-guard">
              Nodes: {allNodes.length}
            </div>
            {interactiveZoom && (
              <div className="glass-text-xs glass-text-primary-opacity-70 glass-surface-dark/20 glass-px-2 glass-py-1 glass-radius glass-backdrop-blur-sm glass-contrast-guard">
                Zoom: {(currentZoom * 100).toFixed(0)}%
              </div>
            )}
          </div>
        )}

        {/* Growth progress indicator */}
        {!compact && animateGrowth && growthProgress < 1 && (
          <div className="glass-absolute glass-top-4 glass-right-4">
            <div className="glass-w-32 glass-h-2 glass-surface-dark/20 glass-radius-full glass-backdrop-blur-sm glass-contrast-guard">
              <div
                className="glass-h-full glass-surface-subtle/50 glass-radius-full glass-transition-all glass-duration-100"
                style={{ width: `${growthProgress * 100}%` }}
              />
            </div>
          </div>
        )}
      </OptimizedGlass>
    );
  }
);

GlassFractalLayout.displayName = "GlassFractalLayout";
