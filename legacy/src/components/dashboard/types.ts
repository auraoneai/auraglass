import React from 'react';

export interface GlassActivityFeedProps {
  /** Activity items */
  items?: ActivityItem[];

  /** Maximum number of items to display */
  maxItems?: number;

  /** Enable real-time updates */
  realTime?: boolean;

  /** Update interval in milliseconds */
  updateInterval?: number;

  /** Enable animations */
  animated?: boolean;

  /** Custom item renderer */
  renderItem?: (item: ActivityItem) => React.ReactNode;

  /** Empty state component */
  emptyState?: React.ReactNode;

  /** Loading state */
  loading?: boolean;

  /** Custom styles */
  styles?: React.CSSProperties;

  /** Glass surface intent */
  intent?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  
  /** Glass surface elevation */
  elevation?: 'level1' | 'level2' | 'level3' | 'level4';
  
  /** Performance tier */
  tier?: 'low' | 'medium' | 'high';
}

export interface ActivityItem {
  id: string;
  type: 'user' | 'system' | 'notification' | 'error' | 'success' | 'warning';
  title: string;
  description?: string;
  timestamp: Date | string;
  user?: {
    name: string;
    avatar?: string;
    id: string;
  };
  metadata?: Record<string, any>;
  actions?: ActivityAction[];
  read?: boolean;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

export interface ActivityAction {
  label: string;
  action: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  icon?: React.ReactNode;
}

export interface GlassChartWidgetProps {
  /** Widget title */
  title?: string;

  /** Widget subtitle */
  subtitle?: string;

  /** Chart type */
  chartType?: 'line' | 'bar' | 'area' | 'pie' | 'donut';

  /** Chart data */
  data?: ChartData;

  /** Chart configuration */
  config?: ChartConfig;

  /** Widget size */
  size?: 'sm' | 'md' | 'lg' | 'xl';

  /** Enable controls */
  controls?: boolean;

  /** Enable fullscreen mode */
  fullscreen?: boolean;

  /** Loading state */
  loading?: boolean;

  /** Error state */
  error?: string;

  /** Custom styles */
  styles?: React.CSSProperties;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  fill?: boolean;
  tension?: number;
}

export interface ChartConfig {
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  aspectRatio?: number;
  plugins?: any[];
  scales?: any;
  animation?: any;
}

export interface GlassKPICardProps {
  /** KPI title */
  title: string;

  /** KPI value */
  value: number | string;

  /** KPI unit */
  unit?: string;

  /** Previous value for comparison */
  previousValue?: number;

  /** KPI trend */
  trend?: 'up' | 'down' | 'neutral';

  /** KPI format */
  format?: 'number' | 'currency' | 'percentage';

  /** KPI icon */
  icon?: React.ReactNode;

  /** KPI color theme */
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info';

  /** Enable animations */
  animated?: boolean;

  /** Size variant */
  size?: 'sm' | 'md' | 'lg';

  /** Custom styles */
  styles?: React.CSSProperties;
}

export interface GlassMetricCardProps extends GlassKPICardProps {
  /** Metric description */
  description?: string;

  /** Additional metrics */
  metrics?: MetricItem[];

  /** Enable sparkline */
  sparkline?: boolean;

  /** Sparkline data */
  sparklineData?: number[];

  /** Target value */
  target?: number;

  /** Show progress bar */
  showProgress?: boolean;
}

export interface MetricItem {
  label: string;
  value: number | string;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  format?: 'number' | 'currency' | 'percentage';
}

export interface GlassStatCardProps extends GlassKPICardProps {
  /** Statistic category */
  category?: string;

  /** Statistic period */
  period?: string;

  /** Enable comparison */
  showComparison?: boolean;

  /** Comparison period */
  comparisonPeriod?: string;

  /** Enable sparkline */
  sparkline?: boolean;

  /** Sparkline data */
  sparklineData?: number[];

  /** Custom footer content */
  footer?: React.ReactNode;
}

// Dashboard layout types
export interface DashboardLayout {
  id: string;
  title: string;
  description?: string;
  widgets: DashboardWidget[];
  layout: LayoutConfig;
  theme?: DashboardTheme;
  permissions?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardWidget {
  id: string;
  type: 'chart' | 'kpi' | 'metric' | 'stat' | 'activity' | 'custom';
  title: string;
  component: React.ComponentType<any>;
  props: Record<string, any>;
  position: WidgetPosition;
  size: WidgetSize;
  config: WidgetConfig;
}

export interface WidgetPosition {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface WidgetSize {
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
}

export interface WidgetConfig {
  resizable?: boolean;
  draggable?: boolean;
  removable?: boolean;
  refreshable?: boolean;
  fullscreenable?: boolean;
  exportable?: boolean;
  settings?: WidgetSetting[];
}

export interface WidgetSetting {
  key: string;
  label: string;
  type: 'text' | 'number' | 'boolean' | 'select' | 'color';
  value: any;
  options?: any[];
}

export interface LayoutConfig {
  type: 'grid' | 'masonry' | 'flex' | 'absolute';
  columns?: number;
  rows?: number;
  gap?: number;
  responsive?: boolean;
  breakpoints?: {
    [key: string]: {
      columns: number;
      gap: number;
    };
  };
}

export interface DashboardTheme {
  background?: string;
  surface?: string;
  text?: string;
  accent?: string;
  border?: string;
  shadow?: string;
  glassEffect?: boolean;
  blurStrength?: 'light' | 'medium' | 'heavy';
}

// Dashboard state types
export interface DashboardState {
  loading: boolean;
  error: string | null;
  layouts: DashboardLayout[];
  activeLayout: string | null;
  widgets: Record<string, any>;
  theme: DashboardTheme;
  editMode: boolean;
  fullscreenWidget: string | null;
}

export interface DashboardActions {
  loadLayout: (id: string) => void;
  saveLayout: (layout: DashboardLayout) => void;
  addWidget: (widget: DashboardWidget) => void;
  removeWidget: (id: string) => void;
  updateWidget: (id: string, updates: Partial<DashboardWidget>) => void;
  moveWidget: (id: string, position: WidgetPosition) => void;
  resizeWidget: (id: string, size: WidgetSize) => void;
  toggleEditMode: () => void;
  setFullscreenWidget: (id: string | null) => void;
  updateTheme: (theme: Partial<DashboardTheme>) => void;
}

// Widget container types
export interface WidgetContainerProps {
  widget: DashboardWidget;
  editMode?: boolean;
  onEdit?: (widget: DashboardWidget) => void;
  onRemove?: (id: string) => void;
  onMove?: (id: string, position: WidgetPosition) => void;
  onResize?: (id: string, size: WidgetSize) => void;
  onFullscreen?: (id: string) => void;
  styles?: React.CSSProperties;
}

// Dashboard grid types
export interface DashboardGridProps {
  layout: DashboardLayout;
  editMode?: boolean;
  onLayoutChange?: (layout: DashboardLayout) => void;
  onWidgetChange?: (widget: DashboardWidget) => void;
  styles?: React.CSSProperties;
}

// Activity feed types
export interface ActivityFeedState {
  items: ActivityItem[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  filters: ActivityFilter[];
  sortBy: 'timestamp' | 'priority' | 'type';
  sortOrder: 'asc' | 'desc';
}

export interface ActivityFilter {
  type: ActivityItem['type'];
  enabled: boolean;
  label: string;
}

export interface ActivityFeedActions {
  addItem: (item: ActivityItem) => void;
  removeItem: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  setFilter: (filter: ActivityFilter) => void;
  setSort: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  clearItems: () => void;
}

// Data source types
export interface DataSource {
  id: string;
  name: string;
  type: 'api' | 'database' | 'file' | 'realtime';
  endpoint?: string;
  query?: string;
  refreshInterval?: number;
  transform?: (data: any) => any;
  cache?: boolean;
  cacheDuration?: number;
}

export interface DataSourceConfig {
  sources: DataSource[];
  globalRefreshInterval?: number;
  enableCaching?: boolean;
  cacheStrategy?: 'memory' | 'localStorage' | 'indexedDB';
}

// All types are already exported as named exports above
