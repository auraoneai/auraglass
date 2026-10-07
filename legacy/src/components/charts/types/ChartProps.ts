import React from 'react';
import {
  ChartConfig,
  ChartDataPoint,
  ChartSeries,
  ChartState,
  ChartEvent,
  ChartQualityTier,
  ChartPhysicsConfig,
  ChartPerformanceMetrics,
  ChartTheme,
  ChartVariant,
  ChartType,
} from './ChartTypes';

export interface BaseChartProps {
  /** Chart configuration */
  config: ChartConfig;

  /** Chart data series */
  series?: ChartSeries[];

  /** Chart dimensions */
  width?: number | string;
  height?: number | string;

  /** Chart theme */
  theme?: ChartTheme;

  /** Chart variant */
  variant?: ChartVariant;

  /** Chart type */
  type?: ChartType;

  /** CSS class name */
  className?: string;

  /** Inline styles */
  style?: React.CSSProperties;

  /** Loading state */
  loading?: boolean;

  /** Error state */
  error?: string | React.ReactNode;

  /** Accessibility label */
  'aria-label'?: string;

  /** Accessibility description */
  'aria-describedby'?: string;

  /** Test ID for testing */
  'data-testid'?: string;

  /** Glass surface intent */
  intent?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  
  /** Glass surface elevation */
  elevation?: 'level1' | 'level2' | 'level3' | 'level4';
  
  /** Performance tier */
  tier?: 'low' | 'medium' | 'high';
}

export interface InteractiveChartProps extends BaseChartProps {
  /** Enable hover interactions */
  hover?: boolean;

  /** Enable click interactions */
  clickable?: boolean;

  /** Enable zoom functionality */
  zoomable?: boolean;

  /** Enable pan functionality */
  pannable?: boolean;

  /** Enable brush selection */
  brushable?: boolean;

  /** Hover callback */
  onHover?: (point: ChartDataPoint | null, series: ChartSeries | null) => void;

  /** Click callback */
  onClick?: (point: ChartDataPoint, series: ChartSeries) => void;

  /** Zoom callback */
  onZoom?: (domain: [number, number]) => void;

  /** Pan callback */
  onPan?: (offset: number) => void;

  /** Brush callback */
  onBrush?: (selection: [number, number]) => void;

  /** Selection callback */
  onSelect?: (points: ChartDataPoint[], series: ChartSeries[]) => void;
}

export interface AnimatedChartProps extends BaseChartProps {
  /** Enable animations */
  animated?: boolean;

  /** Animation duration in milliseconds */
  animationDuration?: number;

  /** Animation easing function */
  animationEasing?: string;

  /** Animation delay in milliseconds */
  animationDelay?: number;

  /** Stagger animation delay between series */
  staggerDelay?: number;

  /** Physics-based animation config */
  physics?: ChartPhysicsConfig;

  /** Animation start callback */
  onAnimationStart?: () => void;

  /** Animation end callback */
  onAnimationEnd?: () => void;

  /** Animation progress callback */
  onAnimationProgress?: (progress: number) => void;
}

export interface ResponsiveChartProps extends BaseChartProps {
  /** Enable responsive behavior */
  responsive?: boolean;

  /** Breakpoint configurations */
  breakpoints?: {
    [key: string]: Partial<ChartConfig>;
  };

  /** Minimum width for responsive behavior */
  minWidth?: number;

  /** Maximum width for responsive behavior */
  maxWidth?: number;

  /** Aspect ratio for responsive charts */
  aspectRatio?: number;

  /** Resize debounce delay */
  resizeDebounce?: number;

  /** Resize callback */
  onResize?: (width: number, height: number) => void;
}

export interface AccessibleChartProps extends BaseChartProps {
  /** Enable keyboard navigation */
  keyboardNavigation?: boolean;

  /** Enable screen reader support */
  screenReaderSupport?: boolean;

  /** Custom ARIA labels for chart elements */
  ariaLabels?: {
    chart?: string;
    series?: string;
    dataPoint?: string;
    legend?: string;
    tooltip?: string;
  };

  /** Focus management */
  focusManagement?: {
    autoFocus?: boolean;
    focusTrap?: boolean;
    restoreFocus?: boolean;
  };

  /** Color blindness support */
  colorBlindnessSupport?: boolean;

  /** High contrast mode */
  highContrast?: boolean;
}

export interface PerformanceChartProps extends BaseChartProps {
  /** Quality tier for performance optimization */
  qualityTier?: ChartQualityTier;

  /** Enable performance monitoring */
  performanceMonitoring?: boolean;

  /** Performance metrics callback */
  onPerformanceMetrics?: (metrics: ChartPerformanceMetrics) => void;

  /** Memory limit for data points */
  maxDataPoints?: number;

  /** Enable virtualization for large datasets */
  virtualized?: boolean;

  /** Virtual item size */
  virtualItemSize?: number;

  /** Virtual container height */
  virtualContainerHeight?: number;
}

export interface AdvancedChartProps
  extends BaseChartProps,
    InteractiveChartProps,
    AnimatedChartProps,
    ResponsiveChartProps,
    AccessibleChartProps,
    PerformanceChartProps {
  /** Chart plugins */
  plugins?: any[];

  /** Custom event handlers */
  onEvent?: (event: ChartEvent) => void;

  /** Chart state management */
  state?: ChartState;

  /** State change callback */
  onStateChange?: (state: ChartState) => void;

  /** Custom rendering function */
  renderCustom?: (context: any) => React.ReactNode;

  /** Data transformation function */
  transformData?: (data: any) => ChartSeries[];

  /** Error boundary fallback */
  errorFallback?: React.ComponentType<{ error: Error; retry: () => void }>;

  /** Loading fallback */
  loadingFallback?: React.ComponentType;

  /** Empty state fallback */
  emptyFallback?: React.ComponentType;

  /** Custom tooltip renderer */
  renderTooltip?: (data: any) => React.ReactNode;

  /** Custom legend renderer */
  renderLegend?: (series: ChartSeries[]) => React.ReactNode;

  /** Custom axis renderer */
  renderAxis?: (axis: any) => React.ReactNode;
}

// Specific chart type props
export interface LineChartProps extends AdvancedChartProps {
  /** Line interpolation method */
  interpolation?: 'linear' | 'monotone' | 'step' | 'basis';

  /** Show data points */
  showPoints?: boolean;

  /** Point size */
  pointSize?: number;

  /** Line width */
  lineWidth?: number;

  /** Fill area under line */
  fillArea?: boolean;
}

export interface BarChartProps extends AdvancedChartProps {
  /** Bar orientation */
  orientation?: 'vertical' | 'horizontal';

  /** Bar padding */
  barPadding?: number;

  /** Group padding */
  groupPadding?: number;

  /** Show values on bars */
  showValues?: boolean;

  /** Value position */
  valuePosition?: 'top' | 'center' | 'bottom';
}

export interface PieChartProps extends AdvancedChartProps {
  /** Pie chart variant */
  pieVariant?: 'pie' | 'donut';

  /** Donut thickness */
  donutThickness?: number;

  /** Show labels */
  showLabels?: boolean;

  /** Label position */
  labelPosition?: 'inside' | 'outside';

  /** Sort data */
  sort?: boolean;

  /** Sort by */
  sortBy?: 'value' | 'name';
}

export interface AreaChartProps extends LineChartProps {
  /** Stack areas */
  stacked?: boolean;

  /** Stack offset */
  stackOffset?: 'expand' | 'diverging' | 'none' | 'silhouette' | 'wiggle';
}

export interface ScatterChartProps extends AdvancedChartProps {
  /** X field name */
  xField?: string;

  /** Y field name */
  yField?: string;

  /** Size field name */
  sizeField?: string;

  /** Color field name */
  colorField?: string;

  /** Symbol type */
  symbolType?: 'circle' | 'square' | 'triangle' | 'diamond' | 'star';

  /** Show regression line */
  showRegression?: boolean;

  /** Regression type */
  regressionType?: 'linear' | 'polynomial' | 'exponential' | 'logarithmic';
}

// Composite prop types
export type ChartProps =
  | BaseChartProps
  | InteractiveChartProps
  | AnimatedChartProps
  | ResponsiveChartProps
  | AccessibleChartProps
  | PerformanceChartProps
  | AdvancedChartProps
  | LineChartProps
  | BarChartProps
  | PieChartProps
  | AreaChartProps
  | ScatterChartProps;

// Glass-specific chart props
export interface GlassDataChartProps extends AdvancedChartProps {
  /** Chart title */
  title?: string;

  /** Chart subtitle */
  subtitle?: string;

  /** Chart datasets */
  datasets?: any[];

  /** Glass morphism variant */
  glassVariant?: 'frosted' | 'dynamic' | 'clear' | 'tinted' | 'luminous';

  /** Blur strength for glass effect */
  blurStrength?: 'none' | 'light' | 'standard' | 'heavy';

  /** Chart color theme */
  color?: string;

  /** Border radius */
  borderRadius?: number | string;

  /** Border color */
  borderColor?: string;

  /** Elevation/shadow depth */
  // elevation?: 'level1' | 'level2' | 'level3' | 'level4' | 'level5';

  /** Animation configuration */
  animation?: {
    physicsEnabled: boolean;
    duration: number;
    tension: number;
    friction: number;
    mass: number;
    easing: string;
    staggerDelay: number;
  };

  /** Interaction configuration */
  interaction?: {
    zoomPanEnabled: boolean;
    physicsHoverEffects: boolean;
    hoverSpeed: number;
    showTooltips: boolean;
    tooltipStyle: 'frosted' | 'dynamic';
    tooltipFollowCursor: boolean;
  };

  /** Legend configuration */
  legend?: {
    show: boolean;
    position: 'top' | 'bottom';
    align: 'start' | 'center' | 'end';
    style: 'default' | 'compact';
    glassEffect: boolean;
  };

  /** Axis configuration */
  axis?: {
    showXGrid: boolean;
    showYGrid: boolean;
    showXLabels: boolean;
    showYLabels: boolean;
    axisColor: string;
    gridColor: string;
    gridStyle: 'solid' | 'dashed';
  };

  /** Initial selection */
  initialSelection?: number | number[];

  /** Show toolbar */
  showToolbar?: boolean;

  /** Allow download */
  allowDownload?: boolean;

  /** Color palette */
  palette?: string[];

  /** Allow type switch */
  allowTypeSwitch?: boolean;

  /** Background color */
  backgroundColor?: string;

  /** Data point click handler */
  onDataPointClick?: (datasetIndex: number, dataIndex: number, dataPoint: any) => void;

  /** Selection change handler */
  onSelectionChange?: (selection: number[]) => void;

  /** Zoom/pan handler */
  onZoomPan?: (chart: any) => void;

  /** Type change handler */
  onTypeChange?: (type: any) => void;

  /** Export options */
  exportOptions?: {
    filename: string;
    quality: number;
    format: 'png' | 'jpeg';
    backgroundColor: string;
    includeTitle: boolean;
    includeTimestamp: boolean;
  };

  /** Custom export button renderer */
  renderExportButton?: (exportFn: () => void) => React.ReactNode;

  /** KPI configuration */
  kpi?: {
    value: number;
    label: string;
    format: 'number' | 'currency' | 'percentage';
  };

  /** Enable physics-based animations */
  enablePhysics?: boolean;

  /** Physics animation config */
  physicsConfig?: ChartPhysicsConfig;

  /** Use adaptive quality based on performance */
  useAdaptiveQuality?: boolean;

  /** Custom glass surface function */
  createGlassSurfaceStyle?: (styles: any) => any;

  /** Custom glass border function */
  createGlassBorderStyle?: (styles: any) => any;

  /** Enable entrance animations */
  enableEntranceAnimation?: boolean;

  /** Animation preset */
  animationPreset?: 'gentle' | 'bouncy' | 'snappy' | 'none';

  /** Motion sensitivity for interactive elements */
  motionSensitivity?: number;

  /** Accessibility settings override */
  accessibilitySettings?: {
    isReducedMotion?: boolean;
    highContrast?: boolean;
    screenReaderSupport?: boolean;
  };
}

// Glass chart ref interface
export interface GlassDataChartRef {
  /** Get the underlying chart instance */
  getChartInstance: () => any;

  /** Export chart as image */
  exportChart: () => void;

  /** Update chart data */
  updateChart: () => void;

  /** Get container element */
  getContainerElement: () => HTMLDivElement | null;

  /** Switch chart type */
  switchChartType: (type: ChartType) => void;

  /** Get current chart state */
  getChartState: () => any;

  /** Force re-render */
  forceUpdate: () => void;
}

// Utility types
export type ChartComponentProps<T extends ChartProps = ChartProps> = T & {
  children?: React.ReactNode;
  ref?: React.Ref<any>;
};

export type ChartForwardRef<T extends ChartProps = ChartProps> = React.ForwardRefExoticComponent<
  ChartComponentProps<T>
>;
