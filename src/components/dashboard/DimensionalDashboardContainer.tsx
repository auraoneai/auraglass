/**
 * Dimensional Dashboard Container
 * Advanced dashboard container with 3D depth layers and Z-space positioning
 */

import React, {
  CSSProperties,
  forwardRef,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { GlassContainer } from "../layout/GlassContainer";

/**
 * Dimensional Dashboard Container Props
 */
export interface DimensionalDashboardContainerProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  perspective?: number;
  depth?: number; // Z-axis depth in pixels
  parallax?: boolean; // Enable parallax scrolling
  autoRotate?: boolean; // Auto-rotate the dashboard
  rotationSpeed?: number; // Rotation speed (degrees per second)
  layers?: ReactNode[]; // Separate content layers with different Z positions
  onLayerClick?: (layerIndex: number) => void;
}

/**
 * Dimensional Dashboard Container Component
 */
export const DimensionalDashboardContainer = forwardRef<
  HTMLDivElement,
  DimensionalDashboardContainerProps
>(
  (
    {
      children,
      className = "",
      style = {},
      perspective = 1200,
      depth = 100,
      parallax = false,
      autoRotate = false,
      rotationSpeed = 10,
      layers = [],
      onLayerClick,
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion();
    const containerRef = useRef<HTMLDivElement>(null);
    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    const [scrollPosition, setScrollPosition] = useState(0);
    const animationFrameRef = useRef<number | null>(null);

    /**
     * Handle auto-rotation
     */
    useEffect(() => {
      if (!autoRotate || prefersReducedMotion) return;

      let lastTime = Date.now();

      const rotate = () => {
        const currentTime = Date.now();
        const delta = (currentTime - lastTime) / 1000;
        lastTime = currentTime;

        setRotation((prev) => ({
          x: prev.x,
          y: (prev.y + rotationSpeed * delta) % 360,
        }));

        animationFrameRef.current = requestAnimationFrame(rotate);
      };

      animationFrameRef.current = requestAnimationFrame(rotate);

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }, [autoRotate, rotationSpeed, prefersReducedMotion]);

    /**
     * Handle mouse move for interactive rotation
     */
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (autoRotate || prefersReducedMotion) return;

      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 15;
      const rotateX = -((e.clientY - centerY) / (rect.height / 2)) * 15;

      setRotation({ x: rotateX, y: rotateY });
    };

    /**
     * Reset rotation on mouse leave
     */
    const handleMouseLeave = () => {
      if (!autoRotate) {
        setRotation({ x: 0, y: 0 });
      }
    };

    /**
     * Handle parallax scrolling
     */
    useEffect(() => {
      if (!parallax || prefersReducedMotion) return;

      const handleScroll = () => {
        setScrollPosition(window.scrollY);
      };

      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }, [parallax, prefersReducedMotion]);

    /**
     * Container styles
     */
    const containerStyles: CSSProperties = {
      ...style,
      position: "relative",
      perspective: `${perspective}px`,
      transformStyle: "preserve-3d",
    };

    /**
     * Content wrapper styles
     */
    const contentStyles: CSSProperties = {
      transformStyle: "preserve-3d",
      transform: prefersReducedMotion
        ? "none"
        : `
            rotateX(${rotation.x}deg)
            rotateY(${rotation.y}deg)
            translateZ(${parallax ? scrollPosition * -0.2 : 0}px)
          `,
      transition: autoRotate
        ? "none"
        : "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    };

    /**
     * Calculate layer Z position
     */
    const getLayerZPosition = (index: number, total: number): number => {
      if (total <= 1) return 0;
      return ((index - (total - 1) / 2) * depth) / (total - 1);
    };

    return (
      <div
        ref={ref}
        className={`dimensional-dashboard-container ${className}`}
        style={containerStyles}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div
          ref={containerRef}
          className="dimensional-dashboard-content"
          style={contentStyles}
        >
          {/* Render layers */}
          {layers.length > 0 ? (
            layers.map((layer, index) => {
              const zPosition = getLayerZPosition(index, layers.length);

              return (
                <div
                  key={index}
                  className="dimensional-dashboard-layer"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    transform: `translateZ(${zPosition}px)`,
                    transformStyle: "preserve-3d",
                    cursor: onLayerClick ? "pointer" : "default",
                  }}
                  onClick={() => onLayerClick?.(index)}
                  role={onLayerClick ? "button" : undefined}
                  tabIndex={onLayerClick ? 0 : undefined}
                  onKeyDown={
                    onLayerClick
                      ? (e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            onLayerClick(index);
                          }
                        }
                      : undefined
                  }
                >
                  <GlassContainer
                    style={{
                      width: "100%",
                      height: "100%",
                      opacity: 1 - Math.abs(zPosition) / (depth * 2),
                    }}
                  >
                    {layer}
                  </GlassContainer>
                </div>
              );
            })
          ) : (
            // Single content layer
            <GlassContainer
              style={{
                width: "100%",
                height: "100%",
              }}
            >
              {children}
            </GlassContainer>
          )}
        </div>

        <style>{`
          .dimensional-dashboard-container {
            width: 100%;
            height: 100%;
            overflow: hidden;
          }

          .dimensional-dashboard-content {
            width: 100%;
            height: 100%;
            position: relative;
          }

          .dimensional-dashboard-layer:focus-visible {
            outline: 2px solid var(--aura-accent-color, #00d4ff);
            outline-offset: 4px;
          }

          @media (prefers-reduced-motion: reduce) {
            .dimensional-dashboard-content {
              transform: none !important;
              transition: none !important;
            }
            .dimensional-dashboard-layer {
              transform: none !important;
            }
          }
        `}</style>
      </div>
    );
  }
);

DimensionalDashboardContainer.displayName = "DimensionalDashboardContainer";
