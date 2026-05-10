import React from "react";
import { Chart, Plugin } from "chart.js";
import { ChartDataPoint } from "../types";

type GalileoChartType = "line" | "bar" | "scatter" | "bubble";

interface GalileoVector {
  x: number;
  y: number;
}

interface GalileoRipple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  startTime: number;
  color: string;
}

interface MagneticElementData {
  originalX: number;
  originalY: number;
  currentX: number;
  currentY: number;
  influence: number;
}

interface PositionedChartElement {
  x: number;
  y: number;
}

interface HoveredElement {
  element: PositionedChartElement;
  index: number;
  distance: number;
}

interface GalileoPluginState {
  hoveredElement: HoveredElement | null;
  activeElements: Map<number, MagneticElementData>;
  ripples: GalileoRipple[];
  mousePosition: GalileoVector;
}

type GalileoChartInstance = Chart<GalileoChartType> & {
  galileoConfig?: Required<GalileoInteractionConfig>;
  galileoState?: GalileoPluginState;
  galileoCleanup?: () => void;
};

export interface GalileoInteractionConfig {
  /** Enable magnetic effect on data points */
  magneticEffect?: boolean;
  /** Magnetic strength */
  magneticStrength?: number;
  /** Magnetic range in pixels */
  magneticRange?: number;
  /** Enable ripple effect on click */
  rippleEffect?: boolean;
  /** Ripple color */
  rippleColor?: string;
  /** Ripple duration */
  rippleDuration?: number;
  /** Enable hover glow */
  hoverGlow?: boolean;
  /** Glow color */
  glowColor?: string;
  /** Glow intensity */
  glowIntensity?: number;
  /** Enable physics-based animations */
  physicsAnimations?: boolean;
  /** Spring configuration */
  springConfig?: {
    stiffness: number;
    damping: number;
    mass: number;
  };
}

export interface ElementAnimationTarget {
  elementId: string;
  datasetIndex: number;
  dataIndex: number;
  dataPoint: ChartDataPoint;
  position: GalileoVector;
  velocity: GalileoVector;
  target: GalileoVector;
  isAnimating: boolean;
  magneticInfluence: number;
}

export interface GalileoPluginContext {
  elementAnimationTargets: Map<string, ElementAnimationTarget>;
  setElementAnimationTargets: React.Dispatch<
    React.SetStateAction<Map<string, ElementAnimationTarget>>
  >;
  getElementPhysicsOptions: (
    dataPoint: ChartDataPoint,
    datasetIndex: number,
    dataIndex: number
  ) => {
    stiffness: number;
    damping: number;
    mass: number;
    magneticStrength: number;
  };
}

const DEFAULT_CONFIG: Required<GalileoInteractionConfig> = {
  magneticEffect: true,
  magneticStrength: 0.3,
  magneticRange: 50,
  rippleEffect: true,
  rippleColor: "var(--glass-border-hover)",
  rippleDuration: 600,
  hoverGlow: true,
  glowColor: "hsl(var(--glass-color-primary)/0.4)",
  glowIntensity: 0.6,
  physicsAnimations: true,
  springConfig: {
    stiffness: 200,
    damping: 25,
    mass: 1,
  },
};

function asGalileoChart(chart: Chart): GalileoChartInstance {
  return chart as GalileoChartInstance;
}

function getPositionedElement(element: unknown): PositionedChartElement | null {
  if (
    typeof element === "object" &&
    element !== null &&
    "x" in element &&
    "y" in element
  ) {
    const candidate = element as { x: unknown; y: unknown };
    if (typeof candidate.x === "number" && typeof candidate.y === "number") {
      return candidate as PositionedChartElement;
    }
  }

  return null;
}

function getGalileoState(
  chart: GalileoChartInstance
): GalileoPluginState | undefined {
  return chart.galileoState;
}

function getGalileoConfig(
  chart: GalileoChartInstance
): Required<GalileoInteractionConfig> | undefined {
  return chart.galileoConfig;
}

export const GalileoElementInteractionPlugin: Plugin<GalileoChartType> = {
  id: "galileoElementInteraction",

  defaults: DEFAULT_CONFIG,

  beforeInit: (chart, args, options) => {
    const galileoChart = asGalileoChart(chart);
    const config = {
      ...DEFAULT_CONFIG,
      ...options,
    } as Required<GalileoInteractionConfig>;

    // Store configuration on chart instance
    galileoChart.galileoConfig = config;
    galileoChart.galileoState = {
      hoveredElement: null,
      activeElements: new Map(),
      ripples: [],
      mousePosition: { x: 0, y: 0 },
    };
  },

  afterInit: (chart, args, options) => {
    const galileoChart = asGalileoChart(chart);
    const canvas = chart.canvas;
    const config = getGalileoConfig(galileoChart);
    const state = getGalileoState(galileoChart);
    if (!config || !state) return;

    // Mouse move handler for magnetic effects
    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      state.mousePosition = { x, y };

      if (config.magneticEffect) {
        updateMagneticEffects(chart, x, y);
      }

      if (config.hoverGlow) {
        updateHoverGlow(chart, x, y);
      }

      chart.update("none");
    };

    // Click handler for ripple effects
    const handleClick = (event: MouseEvent) => {
      if (!config.rippleEffect) return;

      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      createRipple(chart, x, y);
    };

    // Mouse leave handler
    const handleMouseLeave = () => {
      state.hoveredElement = null;
      state.activeElements.clear();
      chart.update("none");
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("click", handleClick);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    // Store cleanup function
    galileoChart.galileoCleanup = () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("click", handleClick);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  },

  beforeDestroy: (chart) => {
    const cleanup = asGalileoChart(chart).galileoCleanup;
    if (cleanup) cleanup();
  },

  afterDraw: (chart, args, options) => {
    const galileoChart = asGalileoChart(chart);
    const ctx = chart.ctx;
    const state = getGalileoState(galileoChart);
    const config = getGalileoConfig(galileoChart);
    if (!state || !config) return;

    // Draw ripples
    if ((state.ripples?.length || 0) > 0) {
      drawRipples(ctx, state.ripples);
      updateRipples(state.ripples, config.rippleDuration);
    }

    // Draw hover glow
    if (state.hoveredElement) {
      drawHoverGlow(ctx, state.hoveredElement, config);
    }

    // Draw magnetic effects
    if (config.magneticEffect && state.activeElements.size > 0) {
      drawMagneticEffects(ctx, state.activeElements);
    }
  },
};

// Helper functions
function updateMagneticEffects(chart: Chart, mouseX: number, mouseY: number) {
  const galileoChart = asGalileoChart(chart);
  const config = getGalileoConfig(galileoChart);
  const state = getGalileoState(galileoChart);
  if (!config || !state) return;

  const meta = chart.getDatasetMeta(0);

  if (!meta || !meta.data) return;

  meta.data?.forEach((element, index: number) => {
    const positionedElement = getPositionedElement(element);
    if (!positionedElement) return;

    const centerX = positionedElement.x;
    const centerY = positionedElement.y;
    const distance = Math.sqrt(
      (mouseX - centerX) ** 2 + (mouseY - centerY) ** 2
    );

    if (distance <= config.magneticRange) {
      const influence = 1 - distance / config.magneticRange;
      const deltaX = (mouseX - centerX) * config.magneticStrength * influence;
      const deltaY = (mouseY - centerY) * config.magneticStrength * influence;

      state.activeElements.set(index, {
        originalX: centerX,
        originalY: centerY,
        currentX: centerX + deltaX,
        currentY: centerY + deltaY,
        influence,
      });

      // Apply magnetic offset
      positionedElement.x = centerX + deltaX;
      positionedElement.y = centerY + deltaY;
    } else {
      // Reset to original position
      if (state.activeElements.has(index)) {
        const original = state.activeElements.get(index);
        if (original) {
          positionedElement.x = original.originalX;
          positionedElement.y = original.originalY;
        }
        state.activeElements.delete(index);
      }
    }
  });
}

function updateHoverGlow(chart: Chart, mouseX: number, mouseY: number) {
  const state = getGalileoState(asGalileoChart(chart));
  if (!state) return;

  const meta = chart.getDatasetMeta(0);

  if (!meta || !meta.data) return;

  let closestElement: HoveredElement | null = null;
  let minDistance = Infinity;

  meta.data?.forEach((element, index: number) => {
    const positionedElement = getPositionedElement(element);
    if (!positionedElement) return;

    const distance = Math.sqrt(
      (mouseX - positionedElement.x) ** 2 + (mouseY - positionedElement.y) ** 2
    );

    if (distance < minDistance && distance <= 20) {
      // 20px hover radius
      minDistance = distance;
      closestElement = { element: positionedElement, index, distance };
    }
  });

  state.hoveredElement = closestElement;
}

function createRipple(chart: Chart, x: number, y: number) {
  const galileoChart = asGalileoChart(chart);
  const state = getGalileoState(galileoChart);
  const config = getGalileoConfig(galileoChart);
  if (!state || !config) return;

  const ripple: GalileoRipple = {
    x,
    y,
    radius: 0,
    maxRadius: 100,
    opacity: 1,
    startTime: Date.now(),
    color: config.rippleColor,
  };

  state.ripples.push(ripple);
}

function drawRipples(ctx: CanvasRenderingContext2D, ripples: GalileoRipple[]) {
  ripples.forEach((ripple) => {
    ctx.save();
    ctx.globalAlpha = ripple.opacity;
    ctx.strokeStyle = ripple.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  });
}

function updateRipples(ripples: GalileoRipple[], duration: number) {
  const now = Date.now();

  for (let i = (ripples?.length || 0) - 1; i >= 0; i--) {
    const ripple = ripples[i];
    const elapsed = now - ripple.startTime;
    const progress = elapsed / duration;

    if (progress >= 1) {
      ripples.splice(i, 1);
    } else {
      ripple.radius = ripple.maxRadius * progress;
      ripple.opacity = 1 - progress;
    }
  }
}

function drawHoverGlow(
  ctx: CanvasRenderingContext2D,
  hoveredElement: HoveredElement | null,
  config: Required<GalileoInteractionConfig>
) {
  if (!hoveredElement) return;

  const { element } = hoveredElement;

  ctx.save();
  ctx.globalAlpha = config.glowIntensity;
  ctx.shadowColor = config.glowColor;
  ctx.shadowBlur = 20;
  ctx.fillStyle = config.glowColor;
  ctx.beginPath();
  ctx.arc(element.x, element.y, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawMagneticEffects(
  ctx: CanvasRenderingContext2D,
  activeElements: Map<number, MagneticElementData>
) {
  activeElements.forEach((elementData) => {
    const { originalX, originalY, currentX, currentY, influence } = elementData;

    // Draw connection line
    ctx.save();
    ctx.globalAlpha = influence * 0.3;
    ctx.strokeStyle = "var(--glass-border-hover)";
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 4]);
    ctx.beginPath();
    ctx.moveTo(originalX, originalY);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();
    ctx.restore();
  });
}

export default GalileoElementInteractionPlugin;
