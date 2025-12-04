'use client';
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

export interface TessellationTile {
  id: string;
  content: React.ReactNode;
  shape: "triangle" | "square" | "hexagon" | "rhombus" | "pentagon" | "octagon";
  size?: number;
  rotation?: number;
  color?: string;
  priority?: number;
  metadata?: Record<string, any>;
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
  className?: string;
  style?: React.CSSProperties;
}

export const GlassTessellation = forwardRef<
  HTMLDivElement,
  GlassTessellationProps
>(
  (
    {
      // TODO: Integrate ContrastGuard for any section titles, labels, and helper text for WCAG AA compliance

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
      className="",
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
      const effectiveSize = tileSize + spacing;

      switch (tessellationType) {
        case "triangular": {
          // Triangular tessellation
          const rowHeight = (effectiveSize * Math.sqrt(3)) / 2;
          let tileIndex = 0;

          for (
            let row = 0;
            row * rowHeight < containerHeight && tileIndex < tiles.length;
            row++
          ) {
            const cols = Math.floor(containerWidth / effectiveSize) + (row % 2);
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
          const cols = Math.floor(containerWidth / effectiveSize);
          const rows = Math.floor(containerHeight / effectiveSize);

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
            row * hexHeight * 0.75 < containerHeight &&
            tileIndex < tiles.length;
            row++
          ) {
            const cols = Math.floor(containerWidth / hexWidth) + 1;
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
            row * rhombHeight < containerHeight && tileIndex < tiles.length;
            row++
          ) {
            const cols = Math.floor(containerWidth / rhombWidth) + 1;
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
            row * pentSize < containerHeight && tileIndex < tiles.length;
            row++
          ) {
            const cols = Math.floor(containerWidth / pentSize) + 1;
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
            y < containerHeight - baseSize && tileIndex < tiles.length;
            y += baseSize
          ) {
            for (
              let x = 0;
              x < containerWidth - baseSize && tileIndex < tiles.length;
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
      tileSize,
      spacing,
      containerWidth,
      containerHeight,
      morphPhase,
    ]);

    const tilePositions = useMemo(
      () => generateTessellationPositions(),
      [generateTessellationPositions]
    );

    const handleTileClick = useCallback(
      (tile: TessellationTile) => {
        setSelectedTile(tile.id);
        onTileClick?.(tile);

        if (soundEnabled) {
          play("click");
        }

        setTimeout(() => setSelectedTile(null), 300);
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
      const effectiveSize = tileSize * position.scale;

      const shapeProps = {
        className: `
          transition-all duration-200 cursor-pointer
          ${
            isHovered || isSelected
              ? "fill-white/20 stroke-white/60"
              : "fill-white/10 stroke-white/30"
          }
        `,
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
            className='glass-pointer-events-none'
          >
            <div className='glass-w-full glass-h-full glass-flex glass-items-center glass-justify-center glass-text-xs glass-text-primary-glass-opacity-90'>
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
        className={`glass-tessellation relative overflow-hidden ${className}`}
        style={{
          width: containerWidth,
          height: containerHeight,
          ...style,
        }}
        glassConfig={{
          blur: 10,
          opacity: 0.95,
          saturation: 1.1,
          brightness: 1.05,
          ...glassConfig,
        }}
        role="application"
        aria-label={`${tessellationType} tessellation pattern`}
        id={tessellationId}
        {...props}
      >
        <div ref={containerRef} className='glass-absolute glass-inset-0'>
          {/* Grid overlay */}
          {showGrid && (
            <div className='glass-absolute glass-inset-0 glass-pointer-events-none'>
              <svg width={containerWidth} height={containerHeight}>
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
            width={containerWidth}
            height={containerHeight}
            className='glass-absolute glass-inset-0'
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
                      transformOrigin: `${position.x + tileSize / 2}px ${position.y + tileSize / 2}px`,
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
        <div className='glass-absolute glass-bottom-4 glass-left-4 glass-flex glass-flex-col glass-gap-1 glass-text-xs glass-text-primary-opacity-70'>
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

        {/* Legend */}
        <div className='glass-absolute glass-top-4 glass-right-4 glass-text-xs glass-text-primary-opacity-70'>
          <div className="glass-surface-dark/20 glass-px-2 glass-py-1 glass-radius glass-backdrop-blur-sm glass-contrast-guard">
            {tessellationType.charAt(0).toUpperCase() +
              tessellationType.slice(1)}{" "}
            Tessellation
          </div>
        </div>
      </OptimizedGlass>
    );
  }
);

GlassTessellation.displayName = "GlassTessellation";