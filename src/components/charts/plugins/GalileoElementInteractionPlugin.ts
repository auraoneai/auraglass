import React from 'react';
import { Plugin } from 'chart.js';
import { ChartDataPoint } from '../types';

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
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  target: { x: number; y: number };
  isAnimating: boolean;
  magneticInfluence: number;
}

export interface GalileoPluginContext {
  elementAnimationTargets: Map<string, ElementAnimationTarget>;
  setElementAnimationTargets: React.Dispatch<React.SetStateAction<Map<string, ElementAnimationTarget>>>;
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
  rippleColor: 'var(--glass-border-hover)',
  rippleDuration: 600,
  hoverGlow: true,
  glowColor: 'rgba(59, 130, 246, 0.4)',
  glowIntensity: 0.6,
  physicsAnimations: true,
  springConfig: {
    stiffness: 200,
    damping: 25,
    mass: 1,
  },
};

export const GalileoElementInteractionPlugin: Plugin<'line' | 'bar' | 'scatter' | 'bubble'> = {
  id: 'galileoElementInteraction',

  defaults: DEFAULT_CONFIG,

  beforeInit: (chart, args, options) => {
    const config = { ...DEFAULT_CONFIG, ...options } as Required<GalileoInteractionConfig>;
    
    // Store configuration on chart instance
    (chart as any).galileoConfig = config;
    (chart as any).galileoState = {
      hoveredElement: null,
      activeElements: new Map(),
      ripples: [],
      mousePosition: { x: 0, y: 0 },
    };
  },

  afterInit: (chart, args, options) => {
    const canvas = chart.canvas;
    const config = (chart as any).galileoConfig;
    const state = (chart as any).galileoState;

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

      chart.update('none');
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
      chart.update('none');
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Store cleanup function
    (chart as any).galileoCleanup = () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  },

  beforeDestroy: (chart) => {
    const cleanup = (chart as any).galileoCleanup;
    if (cleanup) cleanup();
  },

  afterDraw: (chart, args, options) => {
    const ctx = chart.ctx;
    const state = (chart as any).galileoState;
    const config = (chart as any).galileoConfig;

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
function updateMagneticEffects(chart: any, mouseX: number, mouseY: number) {
  const config = chart.galileoConfig;
  const state = chart.galileoState;
  const meta = chart.getDatasetMeta(0);

  if (!meta || !meta.data) return;

  meta.data?.forEach((element: any, index: number) => {
    const centerX = element.x;
    const centerY = element.y;
    const distance = Math.sqrt((mouseX - centerX) ** 2 + (mouseY - centerY) ** 2);

    if (distance <= config.magneticRange) {
      const influence = 1 - (distance / config.magneticRange);
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
      element.x = centerX + deltaX;
      element.y = centerY + deltaY;
    } else {
      // Reset to original position
      if (state.activeElements.has(index)) {
        const original = state.activeElements.get(index);
        element.x = original.originalX;
        element.y = original.originalY;
        state.activeElements.delete(index);
      }
    }
  });
}

function updateHoverGlow(chart: any, mouseX: number, mouseY: number) {
  const state = chart.galileoState;
  const meta = chart.getDatasetMeta(0);

  if (!meta || !meta.data) return;

  let closestElement = null;
  let minDistance = Infinity;

  meta.data?.forEach((element: any, index: number) => {
    const distance = Math.sqrt((mouseX - element.x) ** 2 + (mouseY - element.y) ** 2);
    
    if (distance < minDistance && distance <= 20) { // 20px hover radius
      minDistance = distance;
      closestElement = { element, index, distance };
    }
  });

  state.hoveredElement = closestElement;
}

function createRipple(chart: any, x: number, y: number) {
  const state = chart.galileoState;
  const config = chart.galileoConfig;

  const ripple = {
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

function drawRipples(ctx: CanvasRenderingContext2D, ripples: any[]) {
  ripples.forEach((ripple: any) => {
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

function updateRipples(ripples: any[], duration: number) {
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

function drawHoverGlow(ctx: CanvasRenderingContext2D, hoveredElement: any, config: any) {
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

function drawMagneticEffects(ctx: CanvasRenderingContext2D, activeElements: Map<number, any>) {
  activeElements.forEach((elementData, index) => {
    const { originalX, originalY, currentX, currentY, influence } = elementData;

    // Draw connection line
    ctx.save();
    ctx.globalAlpha = influence * 0.3;
    ctx.strokeStyle = 'var(--glass-border-hover)';
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