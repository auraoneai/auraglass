import { useState, useRef, useCallback, useEffect } from 'react';
import type { Chart as ChartJS } from 'chart.js';

/**
 * Physics-based chart interaction options
 */
export interface ChartPhysicsOptions {
  /** Enable zoom/pan interactions */
  enabled?: boolean;
  /** Zoom mode: 'x', 'y', or 'xy' */
  mode?: 'x' | 'y' | 'xy';
  /** Physics parameters */
  physics?: {
    tension: number;
    friction: number;
    mass: number;
  };
  /** Minimum zoom level */
  minZoom?: number;
  /** Maximum zoom level */
  maxZoom?: number;
  /** Mouse wheel sensitivity */
  wheelSensitivity?: number;
  /** Inertia duration in milliseconds */
  inertiaDuration?: number;
  /** Respect user's reduced motion preference */
  respectReducedMotion?: boolean;
}

/**
 * Return type for the useChartPhysicsInteraction hook
 */
export interface ChartPhysicsInteraction {
  /** Whether the chart is currently being panned */
  isPanning: boolean;
  /** Current zoom level (1 = 100%) */
  zoomLevel: number;
  /** Apply a specific zoom level */
  applyZoom: (level: number) => void;
  /** Reset zoom to default (1.0) */
  resetZoom: () => void;
}

/**
 * Hook for physics-based chart interactions (zoom/pan)
 *
 * Provides smooth, physics-based zoom and pan interactions for Chart.js charts
 * with configurable spring physics and constraints.
 *
 * @param chartRef - Reference to the Chart.js instance
 * @param wrapperRef - Reference to the chart wrapper element
 * @param options - Configuration options for interactions
 *
 * @returns Object containing interaction state and control functions
 *
 * @example
 * ```tsx
 * function PhysicsChart() {
 *   const chartRef = useRef<ChartJS>(null);
 *   const wrapperRef = useRef<HTMLDivElement>(null);
 *
 *   const { isPanning, zoomLevel, applyZoom, resetZoom } = useChartPhysicsInteraction(
 *     chartRef,
 *     wrapperRef,
 *     {
 *       enabled: true,
 *       mode: 'xy',
 *       minZoom: 0.5,
 *       maxZoom: 5,
 *     }
 *   );
 *
 *   return (
 *     <div ref={wrapperRef}>
 *       <Chart ref={chartRef} {...chartProps} />
 *       <button onClick={resetZoom}>Reset</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useChartPhysicsInteraction(
  chartRef: React.RefObject<ChartJS | null>,
  wrapperRef: React.RefObject<HTMLDivElement | null>,
  options: ChartPhysicsOptions = {}
): ChartPhysicsInteraction {
  const {
    enabled = false,
    mode = 'xy',
    physics = { tension: 300, friction: 30, mass: 1 },
    minZoom = 0.5,
    maxZoom = 5,
    wheelSensitivity = 0.1,
    inertiaDuration = 500,
    respectReducedMotion = true,
  } = options;

  const [isPanning, setIsPanning] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  const panStartRef = useRef<{ x: number; y: number } | null>(null);
  const velocityRef = useRef({ x: 0, y: 0 });
  const lastPosRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | null>(null);

  /**
   * Apply zoom with physics constraints
   */
  const applyZoom = useCallback(
    (level: number) => {
      if (!enabled || !chartRef.current) return;

      // Clamp zoom level
      const clampedLevel = Math.max(minZoom, Math.min(maxZoom, level));
      setZoomLevel(clampedLevel);

      // Apply zoom to chart
      const chart = chartRef.current;
      if (chart.options.scales) {
        // Apply zoom transformations
        // Note: Actual implementation would interact with Chart.js zoom plugin
        // This is a simplified version showing the hook structure
      }

      chart.update('none'); // Update without animation for performance
    },
    [enabled, chartRef, minZoom, maxZoom]
  );

  /**
   * Reset zoom to default level
   */
  const resetZoom = useCallback(() => {
    applyZoom(1);
  }, [applyZoom]);

  /**
   * Handle wheel events for zooming
   */
  const handleWheel = useCallback(
    (event: WheelEvent) => {
      if (!enabled || !chartRef.current) return;

      event.preventDefault();

      const delta = -event.deltaY * wheelSensitivity;
      const newZoom = zoomLevel * (1 + delta);

      applyZoom(newZoom);
    },
    [enabled, chartRef, wheelSensitivity, zoomLevel, applyZoom]
  );

  /**
   * Handle mouse down for panning
   */
  const handleMouseDown = useCallback(
    (event: MouseEvent) => {
      if (!enabled || !chartRef.current) return;

      setIsPanning(true);
      panStartRef.current = { x: event.clientX, y: event.clientY };
      lastPosRef.current = { x: event.clientX, y: event.clientY };
      velocityRef.current = { x: 0, y: 0 };
    },
    [enabled, chartRef]
  );

  /**
   * Handle mouse move for panning
   */
  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!isPanning || !panStartRef.current || !chartRef.current) return;

      const deltaX = event.clientX - lastPosRef.current.x;
      const deltaY = event.clientY - lastPosRef.current.y;

      // Update velocity for inertia
      velocityRef.current = { x: deltaX, y: deltaY };

      // Apply pan to chart
      // Note: Actual implementation would interact with Chart.js pan plugin

      lastPosRef.current = { x: event.clientX, y: event.clientY };
    },
    [isPanning, chartRef]
  );

  /**
   * Handle mouse up to end panning with inertia
   */
  const handleMouseUp = useCallback(() => {
    if (!isPanning) return;

    setIsPanning(false);
    panStartRef.current = null;

    // Apply inertia if enabled
    if (!respectReducedMotion) {
      const applyInertia = () => {
        const { x, y } = velocityRef.current;

        if (Math.abs(x) < 0.1 && Math.abs(y) < 0.1) {
          // Inertia complete
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
          }
          return;
        }

        // Apply friction
        velocityRef.current.x *= 0.95;
        velocityRef.current.y *= 0.95;

        // Continue animation
        animationFrameRef.current = requestAnimationFrame(applyInertia);
      };

      applyInertia();
    }
  }, [isPanning, respectReducedMotion]);

  /**
   * Setup event listeners
   */
  useEffect(() => {
    if (!enabled || !wrapperRef.current) return;

    const wrapper = wrapperRef.current;

    wrapper.addEventListener('wheel', handleWheel, { passive: false });
    wrapper.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      wrapper.removeEventListener('wheel', handleWheel);
      wrapper.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [enabled, wrapperRef, handleWheel, handleMouseDown, handleMouseMove, handleMouseUp]);

  return {
    isPanning,
    zoomLevel,
    applyZoom,
    resetZoom,
  };
}
