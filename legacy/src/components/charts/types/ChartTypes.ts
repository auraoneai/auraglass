import React from 'react';
import { CSSProperties } from 'react';

export type ChartTheme = 'light' | 'dark' | 'glass';
export type ChartVariant = 'default' | 'minimal' | 'detailed';
export type ChartType = 'line' | 'area' | 'bar' | 'pie' | 'scatter' | 'heatmap' | 'radar';

export interface ChartDataPoint {
  x: number | string | Date;
  y: number | string;
  label?: string;
  color?: string;
  size?: number;
  metadata?: Record<string, any>;
  formattedValue?: string | number;
}

export interface ChartSeries {
  id: string;
  name: string;
  data: ChartDataPoint[];
  type?: ChartType;
  color?: string;
  style?: CSSProperties;
  visible?: boolean;
  zIndex?: number;
}

// Alias for ChartDataPoint for backward compatibility
export type DataPoint = ChartDataPoint;

// Tooltip data interface
export interface TooltipData {
  datasetIndex: number;
  dataIndex: number;
  x: number;
  y: number;
  value: {
    dataset?: string;
    label?: string;
    value?: number | string;
    color?: string;
    extra?: Record<string, any>;
  };
}

// Dataset interface for chart data
export interface ChartDataset {
  id?: string;
  label?: string;
  data: (number | ChartDataPoint)[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  fill?: boolean | number | string;
  tension?: number;
  pointRadius?: number;
  pointHoverRadius?: number;
  style?: CSSProperties;
  hidden?: boolean;
}

export interface ChartAxis {
  id: string;
  label?: string;
  type: 'linear' | 'log' | 'category' | 'time';
  domain?: [number | string, number | string];
  ticks?: number;
  format?: (value: any) => string;
  style?: CSSProperties;
  grid?: boolean;
  show?: boolean;
}

export interface ChartGrid {
  show?: boolean;
  style?: CSSProperties;
  horizontal?: boolean;
  vertical?: boolean;
}

export interface ChartLegend {
  show?: boolean;
  position?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  style?: CSSProperties;
  itemStyle?: CSSProperties;
  interactive?: boolean;
}

export interface ChartTooltip {
  show?: boolean;
  format?: 'number' | 'currency' | 'percentage' | 'string';
  style?: CSSProperties;
  followCursor?: boolean;
  shared?: boolean;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  offset?: number;
}

export interface ChartAnimation {
  enabled?: boolean;
  duration?: number;
  easing?: string;
  delay?: number;
  stagger?: number;
}

export interface ChartInteraction {
  hover?: boolean;
  click?: boolean;
  zoom?: boolean;
  pan?: boolean;
  brush?: boolean;
  onHover?: (data: ChartDataPoint, series: ChartSeries) => void;
  onClick?: (data: ChartDataPoint, series: ChartSeries) => void;
  onZoom?: (domain: [number, number]) => void;
  onPan?: (domain: [number, number]) => void;
}

export interface ChartResponsive {
  enabled?: boolean;
  breakpoints?: {
    [key: string]: Partial<ChartConfig>;
  };
}

export interface ChartConfig {
  theme: ChartTheme;
  variant: ChartVariant;
  type: ChartType;
  width?: number | string;
  height?: number | string;
  margin?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  background?: string;
  series: ChartSeries[];
  xAxis?: ChartAxis;
  yAxis?: ChartAxis;
  grid?: ChartGrid;
  legend?: ChartLegend;
  tooltip?: ChartTooltip;
  animation?: ChartAnimation;
  interaction?: ChartInteraction;
  responsive?: ChartResponsive;
  style?: CSSProperties;
}

export interface ChartState {
  hoveredPoint?: ChartDataPoint;
  hoveredSeries?: ChartSeries;
  selectedPoints?: ChartDataPoint[];
  selectedSeries?: ChartSeries[];
  zoomDomain?: [number, number];
  panOffset?: number;
  isLoading?: boolean;
  error?: string;
}

export interface ChartQualityTier {
  tier: 'low' | 'medium' | 'high' | 'ultra';
  maxDataPoints: number;
  animationEnabled: boolean;
  interactionEnabled: boolean;
  quality: 'fast' | 'balanced' | 'quality';
}

export interface ChartPhysicsConfig {
  enabled?: boolean;
  stiffness?: number;
  damping?: number;
  mass?: number;
  velocity?: number;
  friction?: number;
}

export interface ChartPerformanceMetrics {
  renderTime: number;
  dataProcessingTime: number;
  animationTime: number;
  memoryUsage: number;
  fps: number;
}

export type ChartEventType =
  | 'hover'
  | 'click'
  | 'zoom'
  | 'pan'
  | 'brush'
  | 'resize'
  | 'dataUpdate'
  | 'themeChange';

export interface ChartEvent {
  type: ChartEventType;
  data?: any;
  series?: ChartSeries;
  point?: ChartDataPoint;
  timestamp: number;
  source: 'user' | 'system' | 'animation';
}

export interface ChartPlugin {
  id: string;
  name: string;
  version: string;
  enabled: boolean;
  config?: Record<string, any>;
  init?: (chart: any) => void;
  destroy?: () => void;
  onEvent?: (event: ChartEvent) => void;
  render?: (context: any) => void;
}
