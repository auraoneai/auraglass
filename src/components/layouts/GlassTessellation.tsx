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
import { ANIMATION } from "../../tokens/designConstants";
import { useReducedMotion } from "../../hooks/useReducedMotion";

export interface TessellationTile {
  id: string;
  content: React.ReactNode;
  shape: "triangle" | "square" | "hexagon" | "rhombus" | "pentagon" | "octagon";
  size?: number;
  rotation?: number;
  color?: string;
  priority?: number;
  metadata?: Record<string, unknown>;
}

export interface TilePosition {
  x: number;
  y: number;
  rotation: number;
  scale: number;
}

export interface GlassTessellationProps {
  tiles: TessellationTile[];
  tessellationType?:
    | "triangular"
    | "square"
    | "hexagonal"
    | "rhombic"
    | "pentagonal"
    | "mixed";
  containerWidth?: number;
  containerHeight?: number;
  tileSize?: number;
  spacing?: number;
  animatePattern?: boolean;
  morphPattern?: boolean;
  morphSpeed?: number;
  showGrid?: boolean;
  interactive?: boolean;
  onTileClick?: (tile: TessellationTile) => void;
  onTileHover?: (tile: TessellationTile | null) => void;
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

function parseColorToRgb(
  color: string | undefined
): { r: number; g: number; b: number } | null {
  if (!color) return null;
  const trimmed = color.trim();
  const hex = trimmed.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    const value = hex[1];
    const full =
      value.length === 3
        ? value
            .split("")
            .map((char) => char + char)
            .join("")
        : value;
    return {
      r: parseInt(full.slice(0, 2), 16),
      g: parseInt(full.slice(2, 4), 16),
      b: parseInt(full.slice(4, 6), 16),
    };
  }

  const rgb = trimmed.match(
    /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*[\d.]+)?\s*\)$/i
  );
  if (rgb) {
    return {
      r: Number(rgb[1]),
      g: Number(rgb[2]),
      b: Number(rgb[3]),
    };
  }

  return null;
}

function getReadableTextColor(color: string | undefined) {
  const rgb = parseColorToRgb(color);
  if (!rgb) return "rgba(248,250,252,0.96)";
  const normalize = (channel: number) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  const luminance =
    0.2126 * normalize(rgb.r) +
    0.7152 * normalize(rgb.g) +
    0.0722 * normalize(rgb.b);
  return luminance > 0.48 ? "rgba(8,13,24,0.92)" : "rgba(248,250,252,0.96)";
}

export const GlassTessellation = forwardRef<
  HTMLDivElement,
  GlassTessellationProps
>(
  (
    {
      // ContrastGuard layout text coverage is tracked in the manual accessibility QA report.

      tiles = [],
      tessellationType = "hexagonal",
      containerWidth = 800,
      containerHeight = 600,
      tileSize = 60,
      spacing = 2,
      animatePattern = true,
      morphPattern = false,
      morphSpeed = 2000,
      showGrid = false,
      interactive = true,
      onTileClick,
      onTileHover,
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
    const [hoveredTile, setHoveredTile] = useState<string | null>(null);
    const [selectedTile, setSelectedTile] = useState<string | null>(null);
    const [morphPhase, setMorphPhase] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<number>();

    const { prefersReducedMotion } = useMotionPreference();
    const tessellationId = useA11yId();
    const { play } = useGlassSound();
    const isCompactLike = compact || contained;
    const effectiveContainerWidth = isCompactLike
      ? Math.min(containerWidth, 320)
      : containerWidth;
    const effectiveContainerHeight =
      typeof (maxHeight ?? height) === "number"
        ? ((maxHeight ?? height) as number)
        : isCompactLike
          ? Math.min(containerHeight, 220)
          : containerHeight;
    const effectiveTileSize = isCompactLike ? Math.min(tileSize, 36) : tileSize;
    const effectiveSpacing = isCompactLike ? Math.max(spacing, 6) : spacing;
    const boundedHeight = maxHeight ?? height ?? effectiveContainerHeight;

    // Morphing animation
    useEffect(() => {
      if (!morphPattern || prefersReducedMotion) return;

      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const phase = (elapsed / morphSpeed) % 1;
        setMorphPhase(phase);
        animationRef.current = requestAnimationFrame(animate);
      };

      animationRef.current = requestAnimationFrame(animate);
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }, [morphPattern, morphSpeed, prefersReducedMotion]);

    // Generate tessellation pattern positions
    const generateTessellationPositions = useCallback((): Map<
      string,
      TilePosition
    > => {
      const positions = new Map<string, TilePosition>();
      const effectiveSize = effectiveTileSize + effectiveSpacing;

      switch (tessellationType) {
        case "triangular": {
          // Triangular tessellation
          const rowHeight = (effectiveSize * Math.sqrt(3)) / 2;
          let tileIndex = 0;

          for (
            let row = 0;
            row * rowHeight < effectiveContainerHeight &&
            tileIndex < tiles.length;
            row++
          ) {
            const cols =
              Math.floor(effectiveContainerWidth / effectiveSize) + (row % 2);
            const offsetX = row % 2 ? effectiveSize / 2 : 0;

            for (let col = 0; col < cols && tileIndex < tiles.length; col++) {
              const x = col * effectiveSize + offsetX;
              const y = row * rowHeight;
              const rotation = row % 2 ? 180 : 0;

              positions.set(tiles[tileIndex].id, {
                x,
                y,
                rotation,
                scale: 1,
              });
              tileIndex++;
            }
          }
          break;
        }

        case "square": {
          // Square tessellation
          let tileIndex = 0;
          const cols = Math.floor(effectiveContainerWidth / effectiveSize);
          const rows = Math.floor(effectiveContainerHeight / effectiveSize);

          for (let row = 0; row < rows && tileIndex < tiles.length; row++) {
            for (let col = 0; col < cols && tileIndex < tiles.length; col++) {
              const x = col * effectiveSize;
              const y = row * effectiveSize;

              positions.set(tiles[tileIndex].id, {
                x,
                y,
                rotation: 0,
                scale: 1,
              });
              tileIndex++;
            }
          }
          break;
        }

        case "hexagonal": {
          // Hexagonal tessellation
          const hexWidth = effectiveSize * Math.sqrt(3);
          const hexHeight = effectiveSize * 2;
          let tileIndex = 0;

          for (
            let row = 0;
            row * hexHeight * 0.75 < effectiveContainerHeight &&
            tileIndex < tiles.length;
            row++
          ) {
            const cols = Math.floor(effectiveContainerWidth / hexWidth) + 1;
            const offsetX = row % 2 ? hexWidth / 2 : 0;

            for (let col = 0; col < cols && tileIndex < tiles.length; col++) {
              const x = col * hexWidth + offsetX;
              const y = row * hexHeight * 0.75;

              positions.set(tiles[tileIndex].id, {
                x,
                y,
                rotation: 0,
                scale: 1,
              });
              tileIndex++;
            }
          }
          break;
        }

        case "rhombic": {
          // Rhombic tessellation
          const rhombWidth = effectiveSize * 1.5;
          const rhombHeight = effectiveSize;
          let tileIndex = 0;

          for (
            let row = 0;
            row * rhombHeight < effectiveContainerHeight &&
            tileIndex < tiles.length;
            row++
          ) {
            const cols = Math.floor(effectiveContainerWidth / rhombWidth) + 1;
            const offsetX = row % 2 ? rhombWidth / 2 : 0;

            for (let col = 0; col < cols && tileIndex < tiles.length; col++) {
              const x = col * rhombWidth + offsetX;
              const y = row * rhombHeight;
              const rotation = (row + col) % 2 ? 45 : -45;

              positions.set(tiles[tileIndex].id, {
                x,
                y,
                rotation,
                scale: 1,
              });
              tileIndex++;
            }
          }
          break;
        }

        case "pentagonal": {
          // Pentagonal tessellation (approximation)
          const pentSize = effectiveSize * 0.8;
          let tileIndex = 0;

          for (
            let row = 0;
            row * pentSize < effectiveContainerHeight &&
            tileIndex < tiles.length;
            row++
          ) {
            const cols = Math.floor(effectiveContainerWidth / pentSize) + 1;
            const offsetX = row % 2 ? pentSize / 2 : 0;
            const offsetY = row % 3 ? pentSize / 3 : 0;

            for (let col = 0; col < cols && tileIndex < tiles.length; col++) {
              const x = col * pentSize + offsetX;
              const y = row * pentSize + offsetY;
              const rotation = (row * col * 72) % 360;

              positions.set(tiles[tileIndex].id, {
                x,
                y,
                rotation,
                scale: 1,
              });
              tileIndex++;
            }
          }
          break;
        }

        case "mixed": {
          // Mixed tessellation pattern
          let tileIndex = 0;
          const baseSize = effectiveSize * 0.7;

          for (
            let y = 0;
            y < effectiveContainerHeight - baseSize && tileIndex < tiles.length;
            y += baseSize
          ) {
            for (
              let x = 0;
              x < effectiveContainerWidth - baseSize &&
              tileIndex < tiles.length;
              x += baseSize
            ) {
              const variation = Math.sin(
                x * 0.01 + y * 0.01 + morphPhase * Math.PI * 2
              );
              const scale = 0.8 + variation * 0.4;
              const rotation = variation * 60;

              positions.set(tiles[tileIndex].id, {
                x: x + variation * 20,
                y: y + variation * 20,
                rotation,
                scale,
              });
              tileIndex++;
            }
          }
          break;
        }
      }

      return positions;
    }, [
      tessellationType,
      tiles,
      effectiveTileSize,
      effectiveSpacing,
      effectiveContainerWidth,
      effectiveContainerHeight,
      morphPhase,
    ]);

    const tilePositions = useMemo(
      () => generateTessellationPositions(),
      [generateTessellationPositions]
    );
    const visualInset = Math.max(effectiveTileSize, 24);
    const svgViewBox = `${-visualInset} ${-visualInset} ${effectiveContainerWidth + visualInset * 2} ${effectiveContainerHeight + visualInset * 2}`;

    const handleTileClick = useCallback(
      (tile: TessellationTile) => {
        setSelectedTile(tile.id);
        onTileClick?.(tile);

        if (soundEnabled) {
          play("tap");
        }

        setTimeout(() => setSelectedTile(null), ANIMATION.DURATION.normal);
      },
      [onTileClick, soundEnabled, play]
    );

    const handleTileHover = useCallback(
      (tile: TessellationTile | null) => {
        setHoveredTile(tile?.id || null);
        onTileHover?.(tile);

        if (soundEnabled && tile) {
          play("hover");
        }
      },
      [onTileHover, soundEnabled, play]
    );

    const renderTileShape = (
      tile: TessellationTile,
      position: TilePosition
    ) => {
      const isHovered = hoveredTile === tile.id;
      const isSelected = selectedTile === tile.id;
      const effectiveSize = effectiveTileSize * position.scale;
      const tileFill =
        tile.color ??
        (isHovered || isSelected
          ? "rgba(125,211,252,0.44)"
          : "rgba(125,211,252,0.30)");
      const tileStroke =
        isHovered || isSelected
          ? "rgba(248,250,252,0.72)"
          : "rgba(248,250,252,0.36)";
      const textColor = getReadableTextColor(tileFill);

      const shapeProps = {
        className: "transition-all cursor-pointer",
        fill: tileFill,
        stroke: tileStroke,
        strokeWidth: 1.5,
      };

      const pathCommands = {
        triangle: `M ${effectiveSize / 2} 0 L ${effectiveSize} ${(effectiveSize * Math.sqrt(3)) / 2} L 0 ${(effectiveSize * Math.sqrt(3)) / 2} Z`,
        square: `M 0 0 L ${effectiveSize} 0 L ${effectiveSize} ${effectiveSize} L 0 ${effectiveSize} Z`,
        hexagon: (() => {
          const points = [];
          for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            const x = effectiveSize / 2 + (effectiveSize / 2) * Math.cos(angle);
            const y = effectiveSize / 2 + (effectiveSize / 2) * Math.sin(angle);
            points.push(`${x} ${y}`);
          }
          return `M ${points.join(" L ")} Z`;
        })(),
        rhombus: `M ${effectiveSize / 2} 0 L ${effectiveSize} ${effectiveSize / 2} L ${effectiveSize / 2} ${effectiveSize} L 0 ${effectiveSize / 2} Z`,
        pentagon: (() => {
          const points = [];
          for (let i = 0; i < 5; i++) {
            const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
            const x = effectiveSize / 2 + (effectiveSize / 2) * Math.cos(angle);
            const y = effectiveSize / 2 + (effectiveSize / 2) * Math.sin(angle);
            points.push(`${x} ${y}`);
          }
          return `M ${points.join(" L ")} Z`;
        })(),
        octagon: (() => {
          const points = [];
          for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI) / 4;
            const x = effectiveSize / 2 + (effectiveSize / 2) * Math.cos(angle);
            const y = effectiveSize / 2 + (effectiveSize / 2) * Math.sin(angle);
            points.push(`${x} ${y}`);
          }
          return `M ${points.join(" L ")} Z`;
        })(),
      };

      return (
        <g>
          <path
            d={pathCommands[tile.shape] || pathCommands.hexagon}
            {...shapeProps}
          />
          <foreignObject
            x="0"
            y="0"
            width={effectiveSize}
            height={effectiveSize}
            className="glass-pointer-events-none"
          >
            <div
              className="glass-w-full glass-h-full glass-flex glass-items-center glass-justify-center glass-text-xs"
              style={{
                color: textColor,
                fontWeight: 650,
                textShadow: textColor.startsWith("rgba(8")
                  ? "0 1px 2px rgba(255,255,255,0.18)"
                  : "0 1px 2px rgba(0,0,0,0.45)",
              }}
            >
              {tile.content}
            </div>
          </foreignObject>
        </g>
      );
    };

    const getTileVariants = () => ({
      hidden: {
        scale: 0,
        opacity: 0,
        rotate: -180,
      },
      visible: (delay: number) => ({
        scale: 1,
        opacity: 1,
        rotate: 0,
        transition: {
          type: "spring",
          tension: 300,
          friction: 25,
          delay: prefersReducedMotion ? 0 : delay * 0.02,
        },
      }),
      hover: {
        scale: 1.05,
        transition: {
          type: "spring",
          tension: 400,
          friction: 20,
        },
      },
      selected: {
        scale: 1.1,
        transition: {
          type: "spring",
          tension: 500,
          friction: 15,
        },
      },
    });

    return (
      <OptimizedGlass
        ref={ref}
        className={`glass-tessellation relative overflow-auto ${className}`}
        style={{
          width: isCompactLike
            ? "100%"
            : `min(${effectiveContainerWidth}px, calc(100vw - 48px))`,
          maxWidth: "100%",
          height:
            typeof boundedHeight === "number"
              ? `${boundedHeight}px`
              : boundedHeight,
          maxHeight:
            isCompactLike || maxHeight !== undefined || height !== undefined
              ? typeof boundedHeight === "number"
                ? `${boundedHeight}px`
                : boundedHeight
              : undefined,
          minWidth: isCompactLike ? undefined : Math.min(containerWidth, 320),
          overflowX: isCompactLike ? "hidden" : "auto",
          overflowY: isCompactLike ? "hidden" : "auto",
          boxSizing: "border-box",
          ...style,
        }}
        glassConfig={{
          blur: 10,
          opacity: 0.95, // Using opacity value for glass effect
          saturation: 1.1,
          brightness: 1.05,
          ...glassConfig,
        }}
        role="application"
        aria-label={`${tessellationType} tessellation pattern`}
        id={tessellationId}
        {...props}
      >
        <div
          ref={containerRef}
          className="glass-relative"
          style={{
            width: effectiveContainerWidth,
            height: effectiveContainerHeight,
            minWidth: isCompactLike ? undefined : effectiveContainerWidth,
            minHeight: isCompactLike ? undefined : effectiveContainerHeight,
            overflow: "visible",
          }}
        >
          {/* Grid overlay */}
          {showGrid && (
            <div className="glass-absolute glass-inset-0 glass-pointer-events-none">
              <svg
                width={effectiveContainerWidth}
                height={effectiveContainerHeight}
                viewBox={`0 0 ${effectiveContainerWidth} ${effectiveContainerHeight}`}
              >
                <defs>
                  <pattern
                    id="grid"
                    width="20"
                    height="20"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 20 0 L 0 0 0 20"
                      fill="none"
                      stroke="white"
                      strokeWidth="0.5"
                      opacity="0.2"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>
          )}

          {/* Tessellation tiles */}
          <svg
            width={effectiveContainerWidth}
            height={effectiveContainerHeight}
            viewBox={svgViewBox}
            className="glass-absolute glass-inset-0 glass-overflow-visible"
            style={{ overflow: "visible" }}
          >
            <AnimatePresence>
              {tiles.map((tile, index) => {
                const position = tilePositions.get(tile.id);
                if (!position) return null;

                const isHovered = hoveredTile === tile.id;
                const isSelected = selectedTile === tile.id;

                return (
                  <motion.g
                    key={tile.id}
                    custom={index}
                    variants={getTileVariants()}
                    initial="hidden"
                    animate={
                      isSelected ? "selected" : isHovered ? "hover" : "visible"
                    }
                    exit="hidden"
                    style={{
                      transformOrigin: `${position.x + effectiveTileSize / 2}px ${position.y + effectiveTileSize / 2}px`,
                    }}
                    onMouseEnter={() => interactive && handleTileHover(tile)}
                    onMouseLeave={() => interactive && handleTileHover(null)}
                    onClick={() => interactive && handleTileClick(tile)}
                  >
                    <g
                      transform={`translate(${position.x}, ${position.y}) rotate(${position.rotation + (tile.rotation || 0)})`}
                    >
                      {renderTileShape(tile, position)}
                    </g>
                  </motion.g>
                );
              })}
            </AnimatePresence>
          </svg>
        </div>

        {/* Info panel */}
        {!isCompactLike && (
          <div
            className="glass-absolute glass-bottom-4 glass-left-4 glass-flex glass-flex-col glass-gap-1 glass-text-xs glass-text-primary-opacity-70"
            data-glass-overlay="true"
          >
            <div className="glass-surface-dark/20 glass-px-2 glass-py-1 glass-radius glass-backdrop-blur-sm glass-contrast-guard">
              Pattern: {tessellationType}
            </div>
            <div className="glass-surface-dark/20 glass-px-2 glass-py-1 glass-radius glass-backdrop-blur-sm glass-contrast-guard">
              Tiles: {tiles.length}
            </div>
            <div className="glass-surface-dark/20 glass-px-2 glass-py-1 glass-radius glass-backdrop-blur-sm glass-contrast-guard">
              Size: {tileSize}px
            </div>
            {morphPattern && (
              <div className="glass-surface-dark/20 glass-px-2 glass-py-1 glass-radius glass-backdrop-blur-sm glass-contrast-guard">
                Morph: {Math.round(morphPhase * 100)}%
              </div>
            )}
          </div>
        )}

        {/* Legend */}
        {!isCompactLike && (
          <div
            className="glass-absolute glass-top-4 glass-right-4 glass-text-xs glass-text-primary-opacity-70"
            data-glass-overlay="true"
          >
            <div className="glass-surface-dark/20 glass-px-2 glass-py-1 glass-radius glass-backdrop-blur-sm glass-contrast-guard">
              {tessellationType.charAt(0).toUpperCase() +
                tessellationType.slice(1)}{" "}
              Tessellation
            </div>
          </div>
        )}
      </OptimizedGlass>
    );
  }
);

GlassTessellation.displayName = "GlassTessellation";
