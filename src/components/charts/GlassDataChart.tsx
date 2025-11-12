'use client';
/**
 * GlassDataChart Component
 * 
 * An advanced glass-styled chart component with physics-based interactions,
 * smooth animations, and rich customization options.
 */
// Typography tokens available via typography.css (imported in index.css)
import React, { useState, useRef, useEffect, useCallback, useMemo, memo, forwardRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { createGlassStyle } from '../../core/mixins/glassMixins';
import { cn } from '@/lib/utils';
// Basic styled components replaced with CSS modules
import chartStyles from './GlassDataChart.module.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Tooltip,
  Legend,
  ChartOptions,
  ChartType,
  Filler,
  defaults,
  Plugin,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { useAccessibilitySettings } from '../../hooks/useAccessibilitySettings';
// import { glassGlow } from '../../core/mixins/glowEffects'; // unused
// import { createThemeContext } from '../../core/themeContext'; // unused
import { useGlassTheme } from '../../hooks/useGlassTheme';
// import { useGalileoStateSpring, GalileoStateSpringOptions } from '../../hooks/useGalileoStateSpring'; // unused
import { GlassTooltip, GlassTooltipContent } from '../modal/GlassTooltip';

import { useQualityTier, getQualityBasedPhysicsParams, getQualityBasedGlassParams } from '../charts/hooks/useQualityTier';
import { glassTokenUtils } from '../../tokens/glass';

const usePhysicsAnimation = (options: any) => ({
  value: 1,
  applyOscillation: (intensity?: number) => {},
  applyPopIn: () => {},
});

const useChartPhysicsInteraction = (chartRef: React.RefObject<any>, wrapperRef: React.RefObject<any>, options: any) => ({
  isPanning: false,
  zoomLevel: 1,
  applyZoom: (level: number) => {},
  resetZoom: () => {},
});

const GalileoElementInteractionPlugin = {
  id: 'galileoElementInteraction',
} as any;

// Dataset conversion to prevent unnecessary recalculations
const convertToChartJsDatasetWithEffects = (dataset: ChartDataset, index: number, chartType: ChartVariant, palette: string[], animation: any) => {
  const paletteColor = palette[index % (palette?.length || 0)];
  return {
    ...dataset,
    backgroundColor: dataset.style?.fillColor || paletteColor + '40',
    borderColor: dataset.style?.lineColor || paletteColor,
    borderWidth: dataset.style?.borderWidth || 2,
    pointBackgroundColor: dataset.style?.pointColor || paletteColor,
    pointBorderColor: dataset.style?.pointColor || paletteColor,
    pointRadius: dataset.style?.pointRadius || 4,
    tension: dataset.style?.tension || 0.4,
    fill: chartType === 'area',
  };
};

import { ContrastGuard, TextWithContrast } from '@/components/accessibility/ContrastGuard';

// Chart variant types
export type ChartVariant = 'line' | 'bar' | 'area' | 'pie' | 'doughnut' | 'polarArea' | 'kpi';

// Data point and dataset types
export interface DataPoint {
  x: string | number;
  y: number;
  label?: string;
  color?: string;
  extra?: Record<string, unknown>;
  formatType?: 'number' | 'currency' | 'percentage' | 'units';
  formatOptions?: {
    decimals?: number;
    currencySymbol?: string;
    locale?: string;
    compact?: boolean;
    showPlus?: boolean;
    suffix?: string;
    prefix?: string;
  };
}

export interface ChartDataset {
  id?: string;
  label: string;
  data: DataPoint[];
  style?: {
    lineColor?: string;
    fillColor?: string;
    pointColor?: string;
    borderWidth?: number;
    pointRadius?: number;
    tension?: number;
  };
  formatType?: 'number' | 'currency' | 'percentage' | 'units';
  formatOptions?: {
    decimals?: number;
    currencySymbol?: string;
    locale?: string;
    compact?: boolean;
    showPlus?: boolean;
    suffix?: string;
    prefix?: string;
  };
}

// Quality tier types
export type QualityTier = 'low' | 'medium' | 'high';

export interface PhysicsParams {
  stiffness: number;
  dampingRatio: number;
  mass: number;
  precision: number;
}

// Main component props
interface GlassDataChartProps {
  data?: any;
  datasets?: ChartDataset[];
  width?: string | number;
  height?: number;
  title?: string;
  subtitle?: string;
  variant?: ChartVariant;
  glassVariant?: 'clear' | 'frosted' | 'tinted' | 'luminous';
  blurStrength?: 'low' | 'medium' | 'high' | 'standard';
  color?: 'primary' | 'secondary' | 'tertiary';
  animation?: {
    physicsEnabled: boolean;
    duration: number;
    tension: number;
    friction: number;
    mass: number;
    easing: string;
    staggerDelay: number;
  };
  interaction?: {
    zoomPanEnabled: boolean;
    zoomMode: 'x' | 'y' | 'xy';
    physicsHoverEffects: boolean;
    hoverSpeed: number;
    showTooltips: boolean;
    tooltipStyle: 'frosted' | 'dynamic';
    tooltipFollowCursor: boolean;
    physics?: {
      tension: number;
      friction: number;
      mass: number;
      minZoom: number;
      maxZoom: number;
      wheelSensitivity: number;
      inertiaDuration: number;
    };
  };
  legend?: {
    show: boolean;
    position: 'top' | 'bottom';
    align: 'start' | 'center' | 'end';
    style: 'default' | 'compact';
    glassEffect: boolean;
  };
  axis?: {
    showXGrid: boolean;
    showYGrid: boolean;
    showXLabels: boolean;
    showYLabels: boolean;
    axisColor: string;
    gridColor: string;
    gridStyle: 'solid' | 'dashed';
  };
  initialSelection?: number | number[];
  showToolbar?: boolean;
  allowDownload?: boolean;
  palette?: string[];
  allowTypeSwitch?: boolean;
  borderRadius?: number;
  borderColor?: string;
  elevation?: number | 'level1' | 'level2' | 'level3' | 'level4' | 'level5';
  className?: string;
  style?: React.CSSProperties;
  onDataPointClick?: (datasetIndex: number, dataIndex: number, data: DataPoint) => void;
  onSelectionChange?: (selection: number[]) => void;
  onTypeChange?: (type: ChartVariant) => void;
  onZoomPan?: (chart: ChartJS) => void;
  exportOptions?: {
    filename: string;
    quality: number;
    format: 'png' | 'jpeg';
    backgroundColor: string;
    includeTitle: boolean;
    includeTimestamp: boolean;
  };
  renderExportButton?: () => React.ReactNode;
  kpi?: {
    value: number;
    label: string;
    format: 'number' | 'currency' | 'percentage';
  };
  useAdaptiveQuality?: boolean;
  getElementPhysicsOptions?: (
    dataPoint: DataPoint,
    datasetIndex: number,
    dataIndex: number,
    chartType: ChartVariant
  ) => {
    hoverEffect?: { scale: number; opacity: number };
    clickEffect?: { scale: number; opacity: number };
  } | null;
  'aria-label'?: string;
}

interface GlassDataChartRef {
  current: any;
}

// Simple format function
const formatValue = (value: any) => String(value);

const getContainerBackground = (variant?: string, color?: string) => {
  switch (variant) {
    case 'clear':
      return 'transparent';
    case 'dynamic':
      return 'color-mix(in srgb, var(--aura-color-glass-overlay) 65%, rgba(12, 18, 32, 0.45))';
    case 'tinted':
      return color ? `color-mix(in srgb, ${color} 18%, rgba(12, 18, 32, 0.65))` : 'rgba(99, 102, 241, 0.14)';
    case 'luminous':
      return 'color-mix(in srgb, var(--aura-color-semantic-primary) 12%, rgba(255, 255, 255, 0.08))';
    default:
      return 'color-mix(in srgb, var(--aura-color-glass-surface) 92%, transparent)';
  }
};

const getBlurStrength = (value?: string) => {
  switch (value) {
    case 'none':
      return 'none';
    case 'light':
      return 'blur(var(--aura-glass-neutral-level1-backdrop-blur))';
    case 'heavy':
      return 'blur(var(--aura-glass-neutral-level3-backdrop-blur))';
    default:
      return 'blur(var(--aura-glass-neutral-level2-backdrop-blur))';
  }
};

const getElevationShadow = (level?: number) => {
  switch (level) {
    case 0:
      return 'none';
    case 1:
      return '0 12px 28px rgba(15, 23, 42, 0.18)';
    case 2:
      return '0 18px 48px rgba(15, 23, 42, 0.24)';
    case 3:
      return '0 26px 60px rgba(15, 23, 42, 0.28)';
    case 4:
      return '0 32px 80px rgba(15, 23, 42, 0.32)';
    default:
      return '0 18px 48px rgba(15, 23, 42, 0.24)';
  }
};

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  $glassVariant?: string;
  $blurStrength?: string;
  $color?: string;
  $elevation?: number;
  $borderRadius?: number | string;
  $borderColor?: string;
}

const ChartContainer = forwardRef<HTMLDivElement, ChartContainerProps>((props, ref) => {
  const {
    $glassVariant = 'frosted',
    $blurStrength = 'standard',
    $color,
    $elevation = 2,
    $borderRadius = 12,
    $borderColor,
    className,
    style,
    children,
    ...rest
  } = props;

  const background = getContainerBackground($glassVariant, $color);
  const blur = getBlurStrength($blurStrength);
  const boxShadow = getElevationShadow($elevation);

  return (
    <div
      ref={ref}
      className={cn(chartStyles.container, className)}
      style={{
        padding: '20px',
        borderRadius: typeof $borderRadius === 'number' ? `${$borderRadius}px` : $borderRadius ?? '12px',
        background,
        // Use createGlassStyle() instead,
        // Use createGlassStyle() instead,
        border: `1px solid ${$borderColor || 'color-mix(in srgb, var(--aura-color-global-border-soft) 75%, transparent)'}`,
        boxShadow,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
});
ChartContainer.displayName = 'ChartContainer';

const ChartHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn(chartStyles.header, className)} {...props} />
);

const ChartTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, ...props }) => (
  <h3 className={cn(chartStyles.title, className)} {...props} />
);

const ChartSubtitle: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className, ...props }) => (
  <p className={cn(chartStyles.subtitle, className)} {...props} />
);

const ChartWrapper = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn(chartStyles.wrapper, className)} {...props} />
));
ChartWrapper.displayName = 'ChartWrapper';

interface ChartLegendProps extends React.HTMLAttributes<HTMLDivElement> {
  $position?: 'top' | 'bottom' | 'left' | 'right';
  $style?: string;
  $glassEffect?: boolean;
}

const ChartLegend = forwardRef<HTMLDivElement, ChartLegendProps>(
  ({ $position, $glassEffect, className, style, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        chartStyles.legend,
        $position === 'top' && chartStyles.legendTop,
        $position === 'bottom' && chartStyles.legendBottom,
        $position === 'left' && chartStyles.legendLeft,
        $position === 'right' && chartStyles.legendRight,
        $glassEffect && chartStyles.legendGlass,
        className
      )}
      style={style}
      {...props}
    />
  )
);
ChartLegend.displayName = 'ChartLegend';

interface LegendItemProps extends React.HTMLAttributes<HTMLDivElement> {
  $style?: string;
  $active?: boolean;
  $color?: string;
}

const LegendItem: React.FC<LegendItemProps> = ({ $active = true, className, ...props }) => (
  <div
    className={cn(chartStyles.legendItem, !$active && chartStyles.legendItemInactive, className)}
    {...props}
  />
);

interface LegendColorProps extends React.HTMLAttributes<HTMLDivElement> {
  $color?: string;
  $active?: boolean;
}

const LegendColor: React.FC<LegendColorProps> = ({ $color, $active = true, className, style, ...props }) => (
  <div
    className={cn(chartStyles.legendColor, className)}
    style={{
      backgroundColor: $color || '#6366f1',
      opacity: $active ? 1 : 0.3,
      ...style,
    }}
    {...props}
  />
);

interface LegendLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  $active?: boolean;
}

const LegendLabel: React.FC<LegendLabelProps> = ({ $active = true, className, style, ...props }) => (
  <span
    className={cn(chartStyles.legendLabel, className)}
    style={{ opacity: $active ? 1 : 0.6, ...style }}
    {...props}
  />
);

interface DynamicTooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  $color?: string;
  $quality?: QualityTier;
}

const DynamicTooltip: React.FC<DynamicTooltipProps> = ({ $color, className, style, ...props }) => (
  <div
    className={cn(chartStyles.tooltip, className)}
    style={{
      borderColor: $color || undefined,
      boxShadow: $color
        ? `0 20px 48px color-mix(in srgb, ${$color} 35%, rgba(15, 23, 42, 0.32))`
        : undefined,
      ...style,
    }}
    {...props}
  />
);

interface TooltipHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  $color?: string;
}

const TooltipHeader: React.FC<TooltipHeaderProps> = ({ $color, className, style, ...props }) => (
  <div
    className={cn(chartStyles.tooltipHeader, className)}
    style={{ color: $color || undefined, ...style }}
    {...props}
  />
);

const TooltipRow: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn(chartStyles.tooltipRow, className)} {...props} />
);

const TooltipLabel: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({ className, style, ...props }) => (
  <span className={cn(chartStyles.tooltipLabel, className)} style={style} {...props} />
);

interface TooltipValueProps extends React.HTMLAttributes<HTMLSpanElement> {
  $highlighted?: boolean;
}

const TooltipValue: React.FC<TooltipValueProps> = ({ $highlighted, className, style, ...props }) => (
  <span
    className={cn(chartStyles.tooltipValue, className)}
    style={{
      color: $highlighted
        ? 'var(--aura-color-global-text-inverse)'
        : glassTokenUtils.getSurface('neutral', 'level1').text.primary,
      ...style,
    }}
    {...props}
  />
);

// Register required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Tooltip,
  Legend,
  Filler
);

// Custom SVG path animation plugin
const pathAnimationPlugin: Plugin<ChartType> = {
  id: 'pathAnimation',
  afterDraw: (chart) => {
    chart.data?.datasets.forEach((dataset, datasetIndex) => {
      const meta = chart.getDatasetMeta(datasetIndex);
      if (meta.type === 'line' && meta.dataset) {
        const element = meta.dataset as any; // Keep 'as any': _path is likely internal/non-standard for path animation
        if (element && element._path) {
          const path = element._path;
          
          // Check if we already processed this path
          if (!path._animationApplied && path.getTotalLength) {
            try {
              // Mark as processed to avoid reapplying
              path._animationApplied = true;
              
              // Get path length for animation
              const pathLength = path.getTotalLength();
              
              // Apply stroke dash settings
              path.style.strokeDasharray = `${pathLength} ${pathLength}`;
              path.style.strokeDashoffset = `${pathLength}`;
              
              // Create animation with WAAPI
                path.animate && path.animate(
                [
                  { strokeDashoffset: pathLength },
                  { strokeDashoffset: 0 }
                ],
                {
                  duration: 1500,
                  delay: datasetIndex * 150,
                  fill: 'forwards',
                  easing: 'ease-out'
                }
              );
            } catch (err) {
              // Fallback for browsers that don't support these features
              if (process.env.NODE_ENV === 'development') {
                console.log('Advanced path animation not supported in this browser');
              }
            }
          }
        }
      }
    });
  }
};

// Register the custom plugin
ChartJS.register(pathAnimationPlugin);
// Register our interaction plugin
ChartJS.register(GalileoElementInteractionPlugin);

// Adjust Chart.js defaults safely
if (defaults?.plugins?.tooltip) {
  defaults.plugins.tooltip.enabled = false; // Use custom tooltip
}
if (defaults?.font) {
  defaults.font.family = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
}
// Set colors safely
defaults.color = '${glassStyles.text?.secondary || "rgba(var(--glass-color-white) / var(--glass-opacity-70))"}';
defaults.borderColor = '${glassStyles.surface?.base || "var(--glass-bg-default)"}';

/**
 * Register required Chart.js components
 */
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Tooltip,
  Legend,
  Filler // Required for area charts
);

// Define a type for the hovered point value structure
interface HoveredPointValue {
  dataset?: string | number | null;
  label?: string | number | null;
  value?: number | null;
  color?: string | null;
  extra?: Record<string, unknown> | null; // Use unknown for potentially varied extra data
  formatType?: 'number' | 'currency' | 'percentage' | 'units';
  formatOptions?: {
    decimals?: number;
    currencySymbol?: string;
    locale?: string;
    compact?: boolean;
    showPlus?: boolean;
    suffix?: string;
    prefix?: string;
  };
}

// Memoized icon components to prevent unnecessary re-renders
const ZoomInIcon = memo(({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
  </svg>
));

const ZoomOutIcon = memo(({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 13H5v-2h14v2z" />
  </svg>
));

const RefreshIcon = memo(({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.65 6.35C16.2 4.9 14.2 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 10h7V3l-2.35 3.35z" />
  </svg>
));

// Memoized button component with stable styles
const buttonStyles = {
  base: createGlassStyle({ intent: "neutral", elevation: "level2" }),
  sm: { padding: '4px' },
  default: { padding: '8px' }
};

const GlassButton = memo(({ 
  children, 
  variant, 
  size, 
  onClick, 
  glass,
  'aria-label': ariaLabel
}: { 
  children: React.ReactNode, 
  variant?: string,
  size?: string,
  onClick?: () => void,
  glass?: string,
  'aria-label'?: string
}) => {
  const combinedStyle = useMemo(() => ({
    ...buttonStyles.base,
    ...(size === 'sm' ? buttonStyles.sm : buttonStyles.default)
  }), [size]);

  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      style={combinedStyle}
     className="glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard">
      {children}
    </button>
  );
});

// Define a ZoomControls component for displaying zoom UI
interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  zoomLevel: number;
  $variant?: 'clear' | 'frosted' | 'tinted' | 'luminous';
}

// Stable styles for zoom controls container
const zoomControlsStyle = createGlassStyle({ intent: "neutral", elevation: "level2" });

const zoomLevelStyle = {
  color: '${glassStyles.text?.primary || "rgba(var(--glass-color-white) / var(--glass-opacity-90))"}',
  fontSize: 'var(--typography-caption-size)',
  padding: '0 8px',
  minWidth: '40px',
  textAlign: 'center' as const
};

const ZoomControls: React.FC<ZoomControlsProps> = memo(({
  onZoomIn,
  onZoomOut,
  onReset,
  zoomLevel,
  $variant = 'frosted'
}) => {
  const displayZoom = useMemo(() => Math.round(zoomLevel * 100), [zoomLevel]);

  return (
    <div style={zoomControlsStyle}>
      <GlassButton
        variant="icon"
        size="sm"
        onClick={onZoomIn}
        aria-label="Zoom in"
        glass={$variant}
      >
        <ZoomInIcon size={16} />
      </GlassButton>
      
      <span style={zoomLevelStyle}>
        {displayZoom}%
      </span>
      
      <GlassButton
        variant="icon"
        size="sm"
        onClick={onZoomOut}
        aria-label="Zoom out"
        glass={$variant}
      >
        <ZoomOutIcon size={16} />
      </GlassButton>
      
      <GlassButton
        variant="icon"
        size="sm"
        onClick={onReset}
        aria-label="Reset zoom"
        glass={$variant}
      >
        <RefreshIcon size={16} />
      </GlassButton>
    </div>
  );
});

/**
 * GlassDataChart Component
 */
// Memoized main component to prevent unnecessary re-renders
const GlassDataChartComponent = React.forwardRef<GlassDataChartRef, GlassDataChartProps>((props, ref) => {
  const {
    title,
    subtitle,
    variant = 'line',
    datasets,
    width = '100%',
    height = 400,
    glassVariant = 'frosted',
    blurStrength = 'standard',
    color = 'primary',
    animation = {
      physicsEnabled: true,
      duration: 1000,
      tension: 300,
      friction: 30,
      mass: 1,
      easing: 'easeOutQuart',
      staggerDelay: 100,
    },
    interaction = {
      zoomPanEnabled: false,
      zoomMode: 'xy', // Ensure default matches type ('x' | 'y' | 'xy')
      physicsHoverEffects: true,
      hoverSpeed: 150,
      showTooltips: true,
      tooltipStyle: 'frosted',
      tooltipFollowCursor: false,
      // Add the physics sub-object with defaults to match the updated type
      physics: {
        tension: 300, // Default tension for zoom/pan physics
        friction: 30, // Default friction
        mass: 1,
        minZoom: 0.5,
        maxZoom: 5,
        wheelSensitivity: 0.1,
        inertiaDuration: 500,
      }
    },
    legend = {
      show: true,
      position: 'top',
      align: 'center',
      style: 'default',
      glassEffect: false,
    },
    axis = {
      showXGrid: true,
      showYGrid: true,
      showXLabels: true,
      showYLabels: true,
      axisColor: '${glassStyles.borderColor || "var(--glass-bg-hover)"}',
      gridColor: '${glassStyles.surface?.base || "var(--glass-bg-default)"}',
      gridStyle: 'solid',
    },
    initialSelection,
    showToolbar = true,
    allowDownload = true,
    palette = [
      '#6366F1', // primary
      '#8B5CF6', // secondary
      'var(--glass-color-primary)', // blue
      'var(--glass-color-success)', // green
      'var(--glass-color-warning)', // yellow
      'var(--glass-color-danger)', // red
      '#EC4899', // pink
      'var(--glass-gray-500)', // gray
    ],
    allowTypeSwitch = true,
    borderRadius = 12,
    borderColor,
    elevation = 'level2',
    className,
    style,
    onDataPointClick,
    onSelectionChange,
    onTypeChange,
    onZoomPan,
    exportOptions = {
      filename: 'chart',
      quality: 0.9,
      format: 'png',
      backgroundColor: 'transparent',
      includeTitle: true,
      includeTimestamp: true,
    },
    renderExportButton,
    kpi,
    useAdaptiveQuality = true,
    getElementPhysicsOptions,
    'aria-label': ariaLabel,
  } = props;
  
  // Hooks
  // const theme = useGlassTheme(); // unused
  const { settings: accessibilitySettings } = useAccessibilitySettings();
  const isReducedMotion = accessibilitySettings?.reducedMotion || false;
  const chartRef = useRef<ChartJS | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartWrapperRef = useRef<HTMLDivElement | null>(null);
  
  // Quality tier system integration
  const qualityTier = useQualityTier(
    {
      dataPointCount: datasets?.reduce((sum, dataset) => sum + (dataset.data?.length || 0), 0) || 0,
      seriesCount: datasets?.length || 0,
      animationComplexity: 'medium',
      interactionComplexity: 'medium',
    },
    variant as any,
    useAdaptiveQuality ? undefined : 'high'
  );
  const activeQuality = useAdaptiveQuality ? qualityTier : 'high';
  
  // Get physics parameters based on quality tier
  const qualityPhysicsParams = getQualityBasedPhysicsParams(activeQuality as any);
  const qualityGlassParams = getQualityBasedGlassParams(activeQuality as any);
  
  // Adapt quality based on user's settings
  const adaptedBlurStrength = qualityGlassParams.blurStrength as 'low' | 'medium' | 'high' || blurStrength;
  
  // Physics animation for main chart
  const { 
    value: springValue, 
    applyOscillation, 
    applyPopIn 
  } = usePhysicsAnimation({
    type: isReducedMotion ? 'none' : (animation.physicsEnabled ? 'spring' : 'none'),
    stiffness: qualityPhysicsParams.stiffness,
    damping: qualityPhysicsParams.dampingRatio * 2 * Math.sqrt(qualityPhysicsParams.stiffness * qualityPhysicsParams.mass),
    mass: qualityPhysicsParams.mass,
    precision: qualityPhysicsParams.precision,
    adaptiveMotion: true,
    respectReducedMotion: true
  });
  
  // Use our physics interaction hook for zoom/pan functionality
  const { 
    isPanning,
    zoomLevel,
    applyZoom,
    resetZoom
  } = useChartPhysicsInteraction(chartRef, chartWrapperRef, {
    enabled: interaction.zoomPanEnabled || false,
    mode: interaction.zoomMode || 'xy',
    physics: {
      tension: interaction.physics?.tension || qualityPhysicsParams.stiffness,
      friction: interaction.physics?.friction || (qualityPhysicsParams.dampingRatio * 2 * Math.sqrt(qualityPhysicsParams.stiffness * qualityPhysicsParams.mass)),
      mass: interaction.physics?.mass || qualityPhysicsParams.mass,
    },
    minZoom: interaction.physics?.minZoom || 0.5,
    maxZoom: interaction.physics?.maxZoom || 5,
    wheelSensitivity: interaction.physics?.wheelSensitivity || 0.1,
    inertiaDuration: interaction.physics?.inertiaDuration || 500,
    respectReducedMotion: true
  });
  
  // State
  const [chartType, setChartType] = useState<ChartVariant>(variant);
  const [selectedDataset, setSelectedDataset] = useState<number | null>(
    typeof initialSelection === 'number' ? initialSelection : null
  );
  const [selectedDatasets, setSelectedDatasets] = useState<number[]>(
    Array.isArray(initialSelection) ? initialSelection : []
  );
  const [hoveredPoint, setHoveredPoint] = useState<{
    datasetIndex: number;
    dataIndex: number;
    x: number;
    y: number;
    value: HoveredPointValue | null;
  } | null>(null);
  
  // Internal element animation state (managed by React)
  // The plugin will read targets from this or similar structure
  const [elementAnimationTargets, setElementAnimationTargets] = useState<Map<string, any>>(new Map());
  // Key: `datasetIndex_dataIndex`, Value: { targetScale: 1, targetOpacity: 1, ... }
  
  // Determine if we're using physics-based animations
  const enablePhysicsAnimation = animation.physicsEnabled && !isReducedMotion;
  
  // Apply initial animations based on quality tier
  useEffect(() => {
    if (enablePhysicsAnimation) {
      // Trigger a pop-in animation on mount for better visual impact
      if (activeQuality !== ('low' as any)) {
        applyPopIn();
      }
    }
  }, [enablePhysicsAnimation, activeQuality, applyPopIn]);
  
  // Derive chartjs type from our variant
  const getChartJsType = (): ChartType => {
    // Special handling for KPI type (we'll render our own component)
    if (chartType === 'kpi') {
      return 'bar' as ChartType; // Just a placeholder, we won't render the chart
    }
    
    // Map area to line type since it's not a native Chart.js type
    if (chartType === 'area') {
      // Use direct assignment for the most compatibility
      return 'line' as unknown as ChartType;
    }
    
    // For all other chart types
    return chartType as unknown as ChartType;
  };
  
  // Memoized SVG Filter Definitions to prevent expensive re-renders
  const svgFilters = useMemo(() => (
    <svg width="0" height="0" style={{ position: 'absolute', visibility: 'hidden' }}>
      <defs>
        {/* Gradient definitions */}
        {palette.map((color, i) => {
          // Ensure color is a valid value to prevent SVG errors
          const safeColor = color || '#6366F1'; // Default to primary color if undefined
          
          return (
            <React.Fragment key={`gradient-${i}`}>
              <linearGradient 
                id={`areaGradient${i}`} 
                x1="0%" 
                y1="0%" 
                x2="0%" 
                y2="100%"
              >
                <stop offset="0%" stopColor={`${safeColor}CC`} />
                <stop offset="100%" stopColor={`${safeColor}00`} />
              </linearGradient>
              
              {/* Glow filter for lines */}
              <filter 
                id={`glow${i}`} 
                x="-20%" 
                y="-20%" 
                width="140%" 
                height="140%"
              >
                <feGaussianBlur stdDeviation={activeQuality === ('low' as any) ? 1 : 2} result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              
              {/* Point highlight filter */}
              <filter 
                id={`pointGlow${i}`} 
                x="-50%" 
                y="-50%" 
                width="200%" 
                height="200%"
              >
                <feGaussianBlur stdDeviation={activeQuality === ('low' as any) ? 2 : 3} result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </React.Fragment>
          );
        })}
      </defs>
    </svg>
  ), [palette, activeQuality]);

  // Memoize the converted datasets to prevent unnecessary recalculations
  const convertedDatasets = useMemo(() => {
    if (!datasets) return [];
    return datasets.map((dataset: any, i: number) => {
      return convertToChartJsDatasetWithEffects(dataset, i, chartType, palette, animation);
    });
  }, [datasets, chartType, palette, animation]);

  // Memoize chart labels preparation
  const chartLabels = useMemo(() => {
    let labels: string[] | undefined;
    if (chartType === 'pie' || chartType === 'doughnut') {
      // Access processedLabels from the *first* dataset's conversion result
      const firstConvertedDataset = convertedDatasets?.[0] as any; 
      if (firstConvertedDataset?.processedLabels && (firstConvertedDataset.processedLabels?.length || 0) > 0) {
        labels = firstConvertedDataset.processedLabels;
      } else if (datasets && datasets[0]?.data) {
        // Fallback to original data labels if processed labels aren't available
        labels = datasets[0].data?.map((point: any) => point.label || String(point.x));
      }
    } else if (chartType === 'polarArea' && datasets) {
      // Use original labels for polarArea
      labels = datasets[0]?.data?.map((point: any) => point.label || String(point.x)) || [];
    }
    return labels;
  }, [chartType, convertedDatasets, datasets]);

  // Memoize chart data to prevent unnecessary Chart.js updates
  const chartData = useMemo(() => ({
    // Map converted datasets, removing any temporary properties like processedLabels
    datasets: convertedDatasets.map((ds: any) => {
      const { processedLabels, ...rest } = ds as any; // Use type assertion here too
      return rest;
    }),
    labels: chartLabels, // Assign the prepared labels
  }), [convertedDatasets, chartLabels]);
  
  // Zoom in function
  const handleZoomIn = useCallback(() => {
    applyZoom(zoomLevel * 1.2);
  }, [applyZoom, zoomLevel]);
  
  // Zoom out function
  const handleZoomOut = useCallback(() => {
    applyZoom(zoomLevel * 0.8);
  }, [applyZoom, zoomLevel]);
  
  // Handle zoom changed callback
  const handleZoomChanged = useCallback(() => {
    if (onZoomPan && chartRef.current) {
      onZoomPan(chartRef.current);
    }
  }, [onZoomPan]);
  
  // Handle chart type change
  const handleTypeChange = (type: ChartVariant) => {
    setChartType(type);
    onTypeChange?.(type);
  };
  
  // Memoized hex to RGB conversion function
  const hexToRgb = useCallback((hex: string) => {
    // Provide a default color if hex is undefined
    const safeHex = hex || 'var(--glass-white)';
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(safeHex);
    return result 
      ? `${parseInt(result?.[1], 16)}, ${parseInt(result?.[2], 16)}, ${parseInt(result?.[3], 16)}`
      : '255, 255, 255';
  }, []);
  
  // Memoized legend items to prevent unnecessary re-renders
  const legendItems = useMemo(() => {
    if (!datasets) return [];
    return datasets.map((dataset: any, index: number) => {
      const color = dataset.style?.lineColor || palette[index % (palette?.length || 0)];
      const rgbColor = hexToRgb(color);
      const isActive = !selectedDatasets.includes(index);
      
      return {
        id: dataset.id,
        label: dataset.label,
        color: color || 'var(--glass-white)',
        rgbColor,
        isActive,
        index
      };
    });
  }, [datasets, palette, selectedDatasets, hexToRgb]);

  // Optimized legend item click handler
  const handleLegendClick = useCallback((index: number) => {
    if (chartType === 'pie' || chartType === 'doughnut' || chartType === 'polarArea') {
      // For pie charts, handle single selection
      setSelectedDataset(selectedDataset === index ? null : index);

      if (onSelectionChange) {
        onSelectionChange(selectedDataset === index ? [] : [index]);
      }
    } else {
      // For other charts, handle multi-selection
      let newSelectedDatasets = [...selectedDatasets];

      if (newSelectedDatasets.includes(index)) {
        newSelectedDatasets = newSelectedDatasets.filter((i: any) => i !== index);
      } else {
        newSelectedDatasets.push(index);
      }

      setSelectedDatasets(newSelectedDatasets);

      if (onSelectionChange) {
        onSelectionChange(newSelectedDatasets);
      }
    }

    // Update the visible datasets
    if (chartRef.current) {
      const chart = chartRef.current;

      // Toggle dataset visibility
      chart.setDatasetVisibility(
        index,
        !chart.isDatasetVisible(index)
      );

      chart.update();
    }
  }, [chartType, selectedDataset, selectedDatasets, onSelectionChange]);

  // Memoized legend renderer to avoid duplication
  const renderLegend = useCallback(() => (
    <ChartLegend
      $position={legend.position}
      $style={legend.style || 'default'}
      $glassEffect={legend.glassEffect || false}
    >
      {legendItems.map((item) => (
        <LegendItem 
          key={item.id} 
          $style={legend.style || 'default'} 
          $active={item.isActive}
          $color={item.rgbColor}
          onClick={(e) => handleLegendClick(item.index)}
        >
          <LegendColor $color={item.color} $active={item.isActive} />
          <LegendLabel $active={item.isActive}>{item.label}</LegendLabel>
        </LegendItem>
      ))}
    </ChartLegend>
  ), [legend, legendItems, handleLegendClick]);
  
  // Handle chart data point click with formatted value feedback
  const handleDataPointClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!chartRef.current) return;
    
    const chart = chartRef.current;
    const points = chart.getElementsAtEventForMode(
      event.nativeEvent,
      'nearest',
      { intersect: true },
      false
    );
    
    if ((points?.length || 0) > 0) {
      const firstPoint = points[0];
      const datasetIndex = firstPoint.datasetIndex;
      const dataIndex = firstPoint.index;
      const dataset = datasets ? datasets[datasetIndex] : null;
      const dataPoint = dataset ? dataset.data[dataIndex] : null;
      
      // --- Trigger Element Click Animation State Update ---
      if (getElementPhysicsOptions && dataPoint) {
        const physicsOptions = getElementPhysicsOptions(dataPoint, datasetIndex, dataIndex, chartType);
        if (physicsOptions?.clickEffect) {
          const key = `${datasetIndex}_${dataIndex}`;
          setElementAnimationTargets((prev: Map<string, any>) =>
            new Map(prev).set(key, {
              ...(prev.get(key) || {}),
              targetScale: physicsOptions.clickEffect?.scale ?? 1,
              targetOpacity: physicsOptions.clickEffect?.opacity ?? 1,
              // Add other effects
            })
          );
          // Click effect resets automatically via CSS transition
          if (process.env.NODE_ENV === 'development') {
            console.log(`[Chart Interaction] Set CLICK target for ${key}:`, physicsOptions.clickEffect);
          }
        }
      }
      // --- End Trigger ---
      
      // Apply oscillation if physics enabled (This is separate chart-wide effect)
      if (interaction.physicsHoverEffects && !isReducedMotion) {
        applyOscillation(0.5);
      }
      
      // Format the value for the click handler
      if (!dataPoint || !dataset) return;

      const formatType = dataPoint.formatType || dataset.formatType || 'number';
      const formatOptions = {
        ...(dataset.formatOptions || {}),
        ...(dataPoint.formatOptions || {}),
      };

      // We'll provide both raw and formatted value to the handler
      if (onDataPointClick) {
        const formattedValue = formatValue(dataPoint.y);
        onDataPointClick(datasetIndex, dataIndex, dataPoint);
      }
    }
  };
  
  // Optimized chart hover handler with debouncing for better performance
  const handleChartHover = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!chartRef.current) return;

    // Exit early if BOTH interactions are disabled
    if (!interaction.physicsHoverEffects && !interaction.showTooltips) {
      setHoveredPoint(null); // Ensure tooltip state is cleared if disabled
      return;
    }

    // Clear previous hover animation targets first
    const previousHoveredKey = hoveredPoint ? `${hoveredPoint.datasetIndex}_${hoveredPoint.dataIndex}` : null;
    
    const chart = chartRef.current;
    const points = chart.getElementsAtEventForMode(
      event.nativeEvent,
      'nearest',
      { intersect: false },
      false
    );
    
    let currentHoveredKey: string | null = null;
    
    if ((points?.length || 0) > 0) {
      const firstPoint = points[0];
      const datasetIndex = firstPoint.datasetIndex;
      const dataIndex = firstPoint.index;
      currentHoveredKey = `${datasetIndex}_${dataIndex}`;
      
      // --- Trigger Element Hover Animation State Update ---
      // Check if physicsHoverEffects is enabled BEFORE updating targets
      if (interaction.physicsHoverEffects && getElementPhysicsOptions && datasets) {
          const dataset = datasets[datasetIndex];
          if (!dataset) return;

          const dataPoint = dataset.data[dataIndex];
          if (!dataPoint) return;
          const physicsOptions = getElementPhysicsOptions(dataPoint, datasetIndex, dataIndex, chartType);
          if (physicsOptions?.hoverEffect) {
            setElementAnimationTargets((prev: Map<string, any>) => 
              new Map(prev).set(currentHoveredKey!, { // Use non-null assertion as key is set
                ...(prev.get(currentHoveredKey!) || {}), 
                targetScale: physicsOptions.hoverEffect?.scale ?? 1,
                targetOpacity: physicsOptions.hoverEffect?.opacity ?? 1,
                // Add other effects
              })
            );
            if (process.env.NODE_ENV === 'development') {
              console.log(`[Chart Interaction] Set HOVER target for ${currentHoveredKey}:`, physicsOptions.hoverEffect);
            }
          }
      }
      // --- End Trigger ---
      
      // Update tooltip state only if enabled
      if (interaction.showTooltips && datasets) {
          const dataset = datasets[datasetIndex];
          if (!dataset) return;

          const dataPoint = dataset.data[dataIndex];
          if (!dataPoint) return;
          setHoveredPoint({
            datasetIndex,
            dataIndex,
            x: event.clientX,
            y: event.clientY,
            value: {
              dataset: dataset.label,
              label: dataPoint.label || dataPoint.x,
              value: dataPoint.y,
              color: dataset.style?.lineColor || palette[datasetIndex % (palette?.length || 0)],
              extra: dataPoint.extra,
              formatType: dataPoint.formatType,
              formatOptions: dataPoint.formatOptions,
            }
          });
      }
    } else {
      // Clear tooltip state if enabled
      if (interaction.showTooltips) {
        setHoveredPoint(null);
      }
    }
    
    // Reset animation targets for previously hovered element if it's different
    // Only reset if physics hover effects are enabled
    if (interaction.physicsHoverEffects && previousHoveredKey && previousHoveredKey !== currentHoveredKey) {
         setElementAnimationTargets((prev: Map<string, any>) => 
            new Map(prev).set(previousHoveredKey, { 
              ...(prev.get(previousHoveredKey) || {}),
              targetScale: 1, 
              targetOpacity: 1,
              // Reset other effects
            })
          );
          if (process.env.NODE_ENV === 'development') {
            console.log(`[Chart Interaction] Reset HOVER target for ${previousHoveredKey}`);
          }
    }
  }, [hoveredPoint, interaction.physicsHoverEffects, interaction.showTooltips, getElementPhysicsOptions, datasets, chartType, palette]);
  
  // Optimized chart hover leave handler
  const handleChartLeave = useCallback(() => {
    // Clear tooltip state if enabled
    if (interaction.showTooltips) {
        setHoveredPoint(null);
    }
    // Reset all hover targets on leave ONLY if physics effects are enabled
    if (interaction.physicsHoverEffects) {
        let resetOccurred = false;
        setElementAnimationTargets((prev: Map<string, any>) => {
            const next = new Map(prev);
            for (const key of next.keys()) {
                const current = next.get(key);
                if (current?.targetScale !== 1 || current?.targetOpacity !== 1) {
                    next.set(key, { ...current, targetScale: 1, targetOpacity: 1 });
                    resetOccurred = true; // Mark that at least one reset happened
                }
            }
            return next;
        });
        if (resetOccurred) {
            if (process.env.NODE_ENV === 'development') {
              console.log('[Chart Interaction] Reset ALL HOVER targets on leave');
            }
        }
    }
  }, [interaction.showTooltips, interaction.physicsHoverEffects]);
  
  // Handle enhanced chart export
  const handleExportChart = useCallback(() => {
    if (!chartRef.current && chartType !== 'kpi') return;

    const chart = chartRef.current;
    
    // For KPI display, use a different export method
    if (chartType === 'kpi' && containerRef.current) {
      // Use html2canvas or another library to capture the KPI display
      try {
        // Simplified export - in a real implementation we'd use something like html2canvas
        const link = document.createElement('a');
        link.download = `${exportOptions.filename || 'kpi'}.png`;
        link.href = '#';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      } catch (e) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Failed to export KPI', e);
        }
        return;
      }
    }
    
    // Create a temporary canvas for the export
    const exportCanvas = document.createElement('canvas');
    const exportContext = exportCanvas.getContext('2d');
    
    if (!exportContext || !chart) return;
    
    // Determine dimensions and scaling
    const sourceCanvas = chart.canvas;
    const devicePixelRatio = window.devicePixelRatio || 1;
    
    // Set the export canvas size with device pixel ratio for high-quality exports
    exportCanvas.width = sourceCanvas.width * devicePixelRatio;
    exportCanvas.height = sourceCanvas.height * devicePixelRatio;
    
    // If title should be included, make room for it
    let titleHeight = 0;
    if (exportOptions.includeTitle && (title || subtitle)) {
      titleHeight = title && subtitle ? 60 : 40;
      exportCanvas.height += titleHeight * devicePixelRatio;
    }
    
    // Fill background if specified
    if (exportOptions.backgroundColor && exportOptions.backgroundColor !== 'transparent') {
      exportContext.fillStyle = exportOptions.backgroundColor;
      exportContext.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
    }
    
    // Add title and subtitle if needed
    if (exportOptions.includeTitle && (title || subtitle)) {
      exportContext.textAlign = 'center';
      exportContext.textBaseline = 'middle';
      
      if (title) {
        exportContext.font = `bold ${16 * devicePixelRatio}px Inter, sans-serif`;
        exportContext.fillStyle = 'var(--glass-white)';
        exportContext.fillText(title, exportCanvas.width / 2, 25 * devicePixelRatio);
      }
      
      if (subtitle) {
        exportContext.font = `${14 * devicePixelRatio}px Inter, sans-serif`;
        exportContext.fillStyle = '${glassStyles.text?.secondary || "rgba(var(--glass-color-white) / var(--glass-opacity-70))"}';
        exportContext.fillText(subtitle, exportCanvas.width / 2, title ? 45 * devicePixelRatio : 25 * devicePixelRatio);
      }
    }

    // Draw the chart onto the export canvas
    exportContext.drawImage(
      sourceCanvas, 
      0, 
      0, 
      sourceCanvas.width, 
      sourceCanvas.height,
      0, 
      titleHeight * devicePixelRatio, 
      exportCanvas.width, 
      exportCanvas.height - (titleHeight * devicePixelRatio)
    );
    
    // Generate a filename with optional timestamp
    let filename = exportOptions.filename || 'chart';
    
    if (exportOptions.includeTimestamp) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
      filename += `_${timestamp}`;
    }
    
    // Determine format and quality
    const format = exportOptions.format === 'jpeg' ? 'image/jpeg' : 'image/png';
    const quality = exportOptions.format === 'jpeg' ? exportOptions.quality : undefined;
    
    // Create a data URL for the export
    const dataUrl = exportCanvas.toDataURL(format, quality);
    
    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.download = `${filename}.${exportOptions.format}`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [chartRef, containerRef, chartType, title, subtitle, exportOptions, kpi]);
  
  // Combined ref callback for ChartJS instance
  const chartRefCallback = useCallback((instance: any) => {
    if (chartRef.current) {
      chartRef.current = instance;
    }
    // Call the forwarded ref if it exists
    if (typeof ref === 'function') {
      ref(instance);
    } else if (ref && ref.current !== undefined) {
      ref.current = instance;
    }
  }, [ref]);
  
  // Memoize chart options
  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }, // Disable built-in legend
      tooltip: { enabled: false }, // Disable built-in tooltip
      // Configure our custom interaction plugin
      [GalileoElementInteractionPlugin.id]: {
        elementAnimationTargets,
        setElementAnimationTargets,
        getElementPhysicsOptions,
        isReducedMotion,
      }
    },
    scales: axis ? {
      x: {
        display: axis.showXLabels,
        grid: {
          display: axis.showXGrid,
          color: axis.gridColor,
        },
        ticks: {
          color: axis.axisColor,
        },
      },
      y: {
        display: axis.showYLabels,
        grid: {
          display: axis.showYGrid,
          color: axis.gridColor,
        },
        ticks: {
          color: axis.axisColor,
        },
      },
    } : undefined,
    animation: (animation?.physicsEnabled ? {
      duration: animation.duration || 1000,
      easing: (animation.easing || 'easeOutQuart') as any,
      delay: 0,
      loop: false,
      animateRotate: true,
      animateScale: true,
    } : false) as any,
  }), [axis, animation, elementAnimationTargets, getElementPhysicsOptions, isReducedMotion]); // Dependencies

  // Plugins to pass to the Chart component
  // Ensure all used plugins are registered above
  const chartPlugins: Plugin<ChartType>[] = useMemo(() => [
    pathAnimationPlugin,
    GalileoElementInteractionPlugin,
    // Add other custom plugins if needed
  ], []); 

  return (
    <ChartContainer
      ref={containerRef}
      className={cn('glass-data-chart', className)}
      style={{
        width,
        height,
        ...style
      }}
      $glassVariant={glassVariant}
      $blurStrength={adaptedBlurStrength}
      $color={color}
      $elevation={typeof elevation === 'string' ? (elevation === 'level1' ? 1 : elevation === 'level2' ? 2 : elevation === 'level3' ? 3 : elevation === 'level4' ? 4 : elevation === 'level5' ? 5 : 2) : elevation}
      $borderRadius={borderRadius}
      $borderColor={borderColor}
    >
      {svgFilters}
      <ChartHeader>
        {title && <ChartTitle>{title}</ChartTitle>}
        {subtitle && <ChartSubtitle>{subtitle}</ChartSubtitle>}
      </ChartHeader>
      <ChartWrapper ref={chartWrapperRef}> 
        {interaction.zoomPanEnabled && (
          <ZoomControls 
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onReset={resetZoom}
            zoomLevel={zoomLevel}
            $variant={glassVariant}
          />
        )}
        <Chart
          key={chartType} // Ensures re-render on type change
          type={getChartJsType()}
          data={chartData}
          options={chartOptions}
          plugins={chartPlugins} // Pass the memoized plugins array
          ref={chartRefCallback} // Use the combined ref callback
          onClick={handleDataPointClick}
          onMouseMove={handleChartHover} 
          onMouseLeave={handleChartLeave}
          aria-label={ariaLabel || (title ? `${title} chart` : 'Data chart')}
        />
      </ChartWrapper>
      
      {/* Optimized Legend Rendering */}
      {legend.show && renderLegend()}
      
      {/* Custom SVG Tooltip (replacing the component tooltip) */}
      {interaction.tooltipStyle === 'dynamic' ? (
        hoveredPoint && interaction.showTooltips && (
          <DynamicTooltip
            $color={color}
            $quality={typeof activeQuality === 'string' ? activeQuality : (activeQuality as any).tier}
            style={{ left: `${hoveredPoint.x ?? 0}px`, top: `${hoveredPoint.y ?? 0}px` }}
          >
            <TooltipHeader $color={hoveredPoint.value?.color || 'var(--glass-white)'}>
              {hoveredPoint.value?.dataset || 'Data'}
            </TooltipHeader>
            
            <TooltipRow>
              <TooltipLabel>{typeof hoveredPoint.value?.label === 'string' 
                ? hoveredPoint.value.label 
                : 'Value'}: </TooltipLabel>
              <TooltipValue $highlighted>{formatValue(
                hoveredPoint.value?.value ?? 0
              )}</TooltipValue>
            </TooltipRow>
            
            {hoveredPoint.value?.extra && Object.entries(hoveredPoint.value.extra).map(([key, value]) => (
              <TooltipRow key={key}>
                <TooltipLabel>{key}:</TooltipLabel>
                <TooltipValue>{String(value)}</TooltipValue>
              </TooltipRow>
            ))}
          </DynamicTooltip>
        )
      ) : (
        hoveredPoint && interaction.showTooltips && (
          <GlassTooltip
            position="top"
            showArrow={true}
            content={
              <div>
                <div style={{ color: hoveredPoint.value?.color || 'var(--glass-white)' }}>
                  {String(hoveredPoint.value?.dataset ?? 'Dataset')}
                </div>
                <div>
                  <strong>
                    {typeof hoveredPoint.value?.label === 'string'
                      ? hoveredPoint.value.label
                      : 'Value'}
                  </strong>: {hoveredPoint.value?.value ?? 'N/A'}
                </div>
                {hoveredPoint.value?.extra && Object.entries(hoveredPoint.value.extra).map(([key, value]) => (
                  <div key={key}>
                    <strong>{key}</strong>: {(typeof value === 'string' || typeof value === 'number')
                      ? value
                      : String(value)}
                  </div>
                ))}
              </div>
            }
          >
            <div style={{
              position: 'absolute',
              top: hoveredPoint.y,
              left: hoveredPoint.x,
              width: 1,
              height: 1,
              pointerEvents: 'none',
              zIndex: 100
            }} />
          </GlassTooltip>
        )
      )}
    </ChartContainer>
  );
});

// Add displayName for better debugging
GlassDataChartComponent.displayName = 'GlassDataChart';

// Export memoized component for better performance
export const GlassDataChart = memo(GlassDataChartComponent);

// ESLint disable for TypeScript forwardRef type issues in some configurations
// @ts-ignore - ForwardRef render functions are difficult to type correctly with generics in all TypeScript versions.
export default GlassDataChart;
