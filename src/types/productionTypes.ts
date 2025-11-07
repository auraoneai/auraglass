import React from 'react';
// Production-ready TypeScript definitions for AuraGlass

import { CSSProperties, ReactNode, RefObject } from 'react';

// === Core Glass Types ===

export type GlassVariant = 'frosted' | 'crystal' | 'tinted' | 'metallic' | 'neon';
export type BlurIntensity = 'none' | 'subtle' | 'medium' | 'strong' | 'intense';
export type GlassElevation = 0 | 1 | 2 | 3 | 4 | 'float';
export type PerformanceMode = 'high' | 'balanced' | 'low';
export type AnimationEasing = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'bounce' | 'elastic';

// === Component Base Props ===

export interface BaseGlassProps {
  /** Custom CSS class name */
  className?: string;
  /** Inline styles */
  style?: CSSProperties;
  /** Glass variant */
  variant?: GlassVariant;
  /** Blur intensity */
  blur?: BlurIntensity;
  /** Elevation level */
  elevation?: GlassElevation | number;
  /** Border radius */
  radius?: string;
  /** Color tint */
  tint?: string;
  /** Opacity level */
  opacity?: number;
  /** Border radius */
  borderRadius?: string;
  /** Enable interactive states */
  interactive?: boolean;
  /** Enable press effect */
  press?: boolean;
  /** Performance mode */
  performanceMode?: PerformanceMode;
  /** Accessibility label */
  'aria-label'?: string;
  /** Accessibility description */
  'aria-describedby'?: string;
  /** Test ID for testing */
  'data-testid'?: string;
}

// === Error Handling Types ===

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: any;
  errorId: string;
  retryCount: number;
}

export interface ErrorFallbackProps {
  error: Error;
  errorInfo: any;
  retry: () => void;
  errorId: string;
}

// === Performance Types ===

export interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  frameRate: number;
  networkSpeed: string;
  deviceCapabilities: {
    supportsGPU: boolean;
    supportsBackdropFilter: boolean;
    devicePixelRatio: number;
  };
}

export interface VirtualizationConfig {
  itemHeight: number | ((index: number) => number);
  containerHeight: number;
  overscan?: number;
  enableHorizontal?: boolean;
  threshold?: number;
}

// === Accessibility Types ===

export interface AccessibilitySettings {
  reducedMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
  colorScheme: 'light' | 'dark' | 'auto';
  forcedColors: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
}

export interface A11yAuditRule {
  id: string;
  name: string;
  description: string;
  wcagLevel: 'A' | 'AA' | 'AAA';
  wcagGuideline: string;
  severity: 'error' | 'warning' | 'info';
  check: (element: Element) => boolean;
  message: string;
  suggestion: string;
}

// === Animation Types ===

export type AnimationType =
  | 'fadeIn' | 'fadeOut'
  | 'slideIn' | 'slideOut'
  | 'scaleIn' | 'scaleOut'
  | 'bounce' | 'shake' | 'pulse'
  | 'rotate' | 'flip';

export type AnimationDirection = 'up' | 'down' | 'left' | 'right' | 'center';

export interface AnimationConfig {
  type: AnimationType;
  direction?: AnimationDirection;
  duration?: number;
  delay?: number;
  easing?: AnimationEasing;
  repeat?: number;
  yoyo?: boolean;
  amplitude?: number;
  frequency?: number;
}

export interface MotionPreferences {
  prefersReducedMotion: boolean;
  animationDuration: number;
  transitionDuration: number;
  enableParallax: boolean;
  enableHoverEffects: boolean;
}

// === Component-Specific Types ===

// Skeleton Loader
export interface GlassSkeletonLoaderProps extends Omit<BaseGlassProps, 'variant'> {
  loading?: boolean;
  text?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'pulse' | 'wave' | 'shimmer';
  children?: ReactNode;
}

export interface GlassSkeletonProps extends Omit<BaseGlassProps, 'variant'> {
  variant?: 'text' | 'rectangular' | 'circular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
  lines?: number;
  spacing?: string;
}

// Tooltip
export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right' | 'auto';

export interface GlassTooltipProps extends Omit<BaseGlassProps, 'variant'> {
  content: ReactNode;
  children: ReactNode;
  position?: TooltipPosition;
  placement?: TooltipPosition;
  showDelay?: number;
  hideDelay?: number;
  disabled?: boolean;
  maxWidth?: string;
  showArrow?: boolean;
  variant?: 'fade' | 'scale' | 'slide';
}

// Notification
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface GlassNotification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  persistent?: boolean;
}

export interface GlassNotificationCenterProps extends BaseGlassProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  maxNotifications?: number;
  autoHideDelay?: number;
}

// Animated Number
export interface GlassAnimatedNumberProps extends Omit<BaseGlassProps, 'variant'> {
  value: number;
  from?: number;
  duration?: number;
  easing?: AnimationEasing;
  decimals?: number;
  separator?: boolean;
  prefix?: string;
  suffix?: string;
  formatter?: (value: number) => string;
  animateOnChange?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'count' | 'scale' | 'glow';
}

// Code Editor
export type Language =
  | 'javascript' | 'typescript' | 'python' | 'java' | 'cpp' | 'csharp'
  | 'go' | 'rust' | 'php' | 'ruby' | 'swift' | 'kotlin' | 'scala'
  | 'html' | 'css' | 'json' | 'xml' | 'yaml' | 'sql'
  | 'bash' | 'powershell' | 'dockerfile' | 'markdown' | 'plaintext';

export interface GlassCodeEditorProps extends BaseGlassProps {
  value?: string;
  language?: Language;
  readOnly?: boolean;
  placeholder?: string;
  fontSize?: number;
  lineNumbers?: boolean;
  minimap?: boolean;
  wordWrap?: boolean;
  tabSize?: number;
  autoComplete?: boolean;
  theme?: 'light' | 'dark' | 'auto';
  maxHeight?: string;
  minHeight?: string;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onMount?: (editor: any) => void;
}

// Color Scheme Generator
export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  neutral: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  background: string;
  surface: string;
  text: string;
}

export interface GlassColorSchemeGeneratorProps extends BaseGlassProps {
  initialScheme?: Partial<ColorScheme>;
  advanced?: boolean;
  generateCSS?: boolean;
  generateTailwind?: boolean;
  onSchemeChange?: (scheme: ColorScheme) => void;
  onExport?: (scheme: ColorScheme, format: 'css' | 'json' | 'tailwind') => void;
}

// Motion Controller
export interface GlassMotionControllerProps extends BaseGlassProps {
  enabled?: boolean;
  speed?: number;
  reduceMotion?: boolean;
  children: ReactNode;
}

// Mind Map
export interface MindMapNode {
  id: string;
  label: string;
  children?: MindMapNode[];
  color?: string;
  position?: { x: number; y: number };
  size?: 'sm' | 'md' | 'lg';
  shape?: 'circle' | 'rectangle' | 'diamond';
  icon?: ReactNode;
  data?: any;
}

export interface MindMapConnection {
  from: string;
  to: string;
  label?: string;
  type?: 'solid' | 'dashed' | 'dotted';
  color?: string;
}

export interface GlassMindMapProps extends BaseGlassProps {
  data: MindMapNode;
  connections?: MindMapConnection[];
  editable?: boolean;
  showMinimap?: boolean;
  zoomable?: boolean;
  direction?: 'horizontal' | 'vertical' | 'radial';
  nodeSpacing?: number;
  onNodeClick?: (node: MindMapNode) => void;
  onNodeDoubleClick?: (node: MindMapNode) => void;
  onNodeChange?: (nodeId: string, changes: Partial<MindMapNode>) => void;
  onNodeAdd?: (parentId: string, newNode: MindMapNode) => void;
  onNodeDelete?: (nodeId: string) => void;
}

// Whiteboard
export type DrawingTool = 'pen' | 'eraser' | 'rectangle' | 'circle' | 'line' | 'text' | 'select';
export type DrawingColor = 'var(--glass-white)' | 'var(--glass-black)' | '#ff0000' | '#00ff00' | '#0000ff' | '#ffff00' | '#ff00ff' | '#00ffff';

export interface DrawingPath {
  id: string;
  tool: DrawingTool;
  points: Array<{ x: number; y: number }>;
  color: DrawingColor;
  width: number;
  opacity: number;
  timestamp: number;
}

export interface DrawingShape {
  id: string;
  type: 'rectangle' | 'circle' | 'line' | 'text';
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color: DrawingColor;
  width: number;
  opacity: number;
  text?: string;
  timestamp: number;
}

export interface GlassWhiteboardProps extends BaseGlassProps {
  initialData?: Array<DrawingPath | DrawingShape>;
  collaborative?: boolean;
  userId?: string;
  enabledTools?: DrawingTool[];
  availableColors?: DrawingColor[];
  width?: number;
  height?: number;
  backgroundPattern?: 'none' | 'grid' | 'dots' | 'lines';
  showToolbar?: boolean;
  showMinimap?: boolean;
  onDrawingChange?: (data: Array<DrawingPath | DrawingShape>) => void;
  onToolChange?: (tool: DrawingTool) => void;
  onColorChange?: (color: DrawingColor) => void;
}

// A11y Auditor
export interface A11yIssue {
  id: string;
  type: 'error' | 'warning' | 'info';
  rule: string;
  message: string;
  element?: string;
  line?: number;
  column?: number;
  code?: string;
  suggestion?: string;
  wcag?: string;
}

export interface A11yAuditResult {
  score: number;
  issues: A11yIssue[];
  summary: {
    errors: number;
    warnings: number;
    info: number;
  };
  timestamp: number;
}

export interface GlassA11yAuditorProps extends BaseGlassProps {
  children?: ReactNode;
  showPanel?: boolean;
  autoAudit?: boolean;
  rules?: string[];
  onAuditComplete?: (result: A11yAuditResult) => void;
  onIssueClick?: (issue: A11yIssue) => void;
}

// Component Playground
export interface ComponentExample {
  id: string;
  name: string;
  description?: string;
  category: string;
  component: React.ComponentType<any>;
  props?: Record<string, any>;
  code?: string;
}

export interface PlaygroundTab {
  id: string;
  label: string;
  content: ReactNode;
}

export interface GlassComponentPlaygroundProps extends BaseGlassProps {
  examples: ComponentExample[];
  defaultExample?: string;
  showCode?: boolean;
  showProps?: boolean;
  customTabs?: PlaygroundTab[];
  theme?: 'light' | 'dark' | 'auto';
  codeTheme?: 'light' | 'dark';
}

// === Utility Types ===

export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Bounds {
  top: number;
  left: number;
  bottom: number;
  right: number;
  width: number;
  height: number;
}

export interface ThemeConfig {
  colors: ColorScheme;
  blur: Record<BlurIntensity, string>;
  shadows: Record<GlassElevation, string>;
  animations: {
    duration: Record<'fast' | 'normal' | 'slow', number>;
    easing: Record<AnimationEasing, string>;
  };
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
}

// === Hook Return Types ===

export interface PhysicsInteractionReturn {
  ref: RefObject<HTMLElement>;
  physicsState: {
    isInteracting: boolean;
    velocity: Point;
    position: Point;
    scale: number;
    rotation: number;
  };
  isInteracting: boolean;
  startInteraction: () => void;
  endInteraction: () => void;
}

export interface VirtualizationReturn<T> {
  startIndex: number;
  endIndex: number;
  visibleItems: Array<{
    index: number;
    data: T;
    style: CSSProperties;
  }>;
  totalHeight: number;
  totalWidth: number;
  scrollTop: number;
  scrollLeft: number;
  containerProps: React.HTMLAttributes<HTMLDivElement>;
  scrollElementProps: React.HTMLAttributes<HTMLDivElement>;
  measureElement: (index: number, element: HTMLElement) => void;
}

export interface IntersectionReturn {
  ref: RefObject<HTMLElement>;
  isIntersecting: boolean;
  intersectionRatio: number;
  boundingClientRect: DOMRectReadOnly | null;
  rootBounds: DOMRectReadOnly | null;
  target: Element | null;
  hasIntersected: boolean;
}

// === Event Handler Types ===

export type GlassEventHandler<T = HTMLElement> = (event: React.SyntheticEvent<T>) => void;
export type GlassChangeHandler<T> = (value: T) => void;
export type GlassClickHandler = (event: React.MouseEvent<HTMLElement>) => void;
export type GlassFocusHandler = (event: React.FocusEvent<HTMLElement>) => void;

// === Validation Types ===

export interface ValidationRule<T = any> {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: T) => boolean | string;
  message?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// === Data Types ===

export interface ChartDataPoint {
  x: string | number;
  y: number;
  label?: string;
  color?: string;
}

export interface PieDataPoint {
  value: number;
  label: string;
  color?: string;
}

export interface TimelineItem {
  id: string;
  title: string;
  subtitle?: string;
  time: string;
  icon?: ReactNode;
  color?: string;
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  group?: string;
}

export interface TableColumn {
  key: string;
  header: string;
  width?: string | number;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: any) => ReactNode;
}

export interface TableRow {
  id: string;
  [key: string]: any;
}

// === Form Types ===

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio';
  required?: boolean;
  validation?: ValidationRule[];
  options?: SelectOption[];
  placeholder?: string;
  defaultValue?: any;
}

export interface FormState {
  values: Record<string, any>;
  errors: Record<string, string[]>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
}

// === Layout Types ===

export interface GridConfig {
  columns: number;
  gap: string;
  responsive?: boolean;
  breakpoints?: Record<string, number>;
}

export interface FlexConfig {
  direction: 'row' | 'column';
  align: string;
  justify: string;
  gap: string;
  wrap?: boolean;
}

// === Navigation Types ===

export interface NavigationItem {
  id: string;
  label: string;
  href?: string;
  icon?: ReactNode;
  children?: NavigationItem[];
  disabled?: boolean;
  active?: boolean;
}

export interface BreadcrumbItem {
  id: string;
  label: string;
  href?: string;
  icon?: ReactNode;
}

// === Modal Types ===

export interface ModalState {
  isOpen: boolean;
  data?: any;
  onClose: () => void;
}

export interface DrawerState extends ModalState {
  side: 'left' | 'right' | 'top' | 'bottom';
}

// === Testing Types ===

export interface ComponentTestProps {
  'data-testid'?: string;
  'aria-label'?: string;
  role?: string;
}

export interface MockData<T> {
  generate: (count: number) => T[];
  single: () => T;
  empty: () => T[];
}

// === Configuration Types ===

export interface GlassConfig {
  theme: ThemeConfig;
  performance: {
    mode: PerformanceMode;
    enableVirtualization: boolean;
    enableLazyLoading: boolean;
    maxConcurrentAnimations: number;
  };
  accessibility: {
    enableAutoDetection: boolean;
    enableKeyboardNavigation: boolean;
    enableScreenReaderSupport: boolean;
    enableHighContrast: boolean;
  };
  development: {
    enableErrorBoundaries: boolean;
    enablePerformanceMonitoring: boolean;
    enableA11yAuditing: boolean;
    showComponentOutlines: boolean;
  };
}

// === Global State Types ===

export interface GlassGlobalState {
  theme: ThemeConfig;
  accessibility: AccessibilitySettings;
  performance: PerformanceMetrics;
  errors: ErrorBoundaryState[];
  notifications: GlassNotification[];
}

// === Plugin Types ===

export interface GlassPlugin {
  name: string;
  version: string;
  install: (config: GlassConfig) => void;
  uninstall: () => void;
}

// === Utility Function Types ===

export type ClassNameGenerator = (...classes: (string | undefined | null | false)[]) => string;
export type StyleGenerator<T = any> = (props: T) => CSSProperties;
export type ThemeGenerator = (baseColors: Partial<ColorScheme>) => ColorScheme;

// === Advanced Types ===

export interface GlassComponentFactory<P = {}> {
  create: (config: Partial<BaseGlassProps>) => React.ComponentType<P>;
  extend: (baseComponent: React.ComponentType<P>, overrides: Partial<BaseGlassProps>) => React.ComponentType<P>;
}

export interface GlassHOCOptions {
  withErrorBoundary?: boolean;
  withPerformanceMonitoring?: boolean;
  withAccessibility?: boolean;
  withLazyLoading?: boolean;
}

// === Type Guards ===

export const isGlassComponent = (component: any): component is React.ComponentType<BaseGlassProps> => {
  return component && typeof component === 'function';
};

export const isValidGlassVariant = (variant: any): variant is GlassVariant => {
  return ['frosted', 'crystal', 'tinted', 'metallic', 'neon'].includes(variant);
};

export const isValidBlurIntensity = (blur: any): blur is BlurIntensity => {
  return ['none', 'subtle', 'medium', 'strong', 'intense'].includes(blur);
};

// === Branded Types for Type Safety ===

export type ComponentId = string & { readonly brand: unique symbol };
export type ThemeId = string & { readonly brand: unique symbol };
export type AnimationId = string & { readonly brand: unique symbol };

// === Conditional Types ===

export type ConditionalGlassProps<T extends boolean> = T extends true
  ? Required<BaseGlassProps>
  : BaseGlassProps;

export type GlassPropsWithChildren<T = {}> = T & {
  children?: ReactNode;
} & BaseGlassProps;

// === Mapped Types ===

export type GlassComponentProps<T> = {
  [K in keyof T]: T[K];
} & BaseGlassProps;

export type PartialGlassProps<T> = Partial<T> & BaseGlassProps;

// === Template Literal Types ===

export type GlassClassName = `glass-${string}`;
export type AnimationName = `glass-${AnimationType}-${AnimationDirection}`;
export type ThemeVariable = `--glass-${string}`;

// === Recursive Types ===

export interface NestedGlassComponent {
  component: React.ComponentType<any>;
  props?: Record<string, any>;
  children?: NestedGlassComponent[];
}

// === Function Overloads ===

export interface CreateGlassComponent {
  <P>(component: React.ComponentType<P>): React.ComponentType<P & BaseGlassProps>;
  <P>(component: React.ComponentType<P>, defaultProps: Partial<BaseGlassProps>): React.ComponentType<P & BaseGlassProps>;
}
