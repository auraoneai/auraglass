import React from "react";

// Base interactive component types
export interface GlassInteractiveProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Glass morphism variant */
  glassVariant?: "frosted" | "dynamic" | "clear" | "tinted" | "luminous";

  /** Blur strength */
  blurStrength?: "none" | "light" | "standard" | "heavy";

  /** Interactive state */
  interactive?: boolean;

  /** Enable hover effects */
  hoverable?: boolean;

  /** Enable focus effects */
  focusable?: boolean;

  /** Enable click effects */
  clickable?: boolean;

  /** Enable magnetic effects */
  magnetic?: boolean;

  /** Enable physics-based animations */
  physics?: boolean;

  /** Animation configuration */
  animation?: InteractiveAnimationConfig;

  /** Accessibility configuration */
  accessibility?: InteractiveAccessibilityConfig;

  /** Custom styles */
  glassStyles?: React.CSSProperties;

  /** Glass surface intent */
  intent?: "neutral" | "primary" | "success" | "warning" | "danger" | "info";

  /** Glass surface elevation */
  elevation?: "level1" | "level2" | "level3" | "level4";

  /** Performance tier */
  tier?: "low" | "medium" | "high";
}

export interface InteractiveAnimationConfig {
  /** Enable entrance animation */
  entrance?: boolean;

  /** Entrance animation type */
  entranceType?: "fadeIn" | "slideIn" | "scaleIn" | "bounceIn" | "elasticIn";

  /** Entrance duration */
  entranceDuration?: number;

  /** Enable hover animations */
  hoverAnimations?: boolean;

  /** Hover animation type */
  hoverType?: "lift" | "glow" | "scale" | "tilt" | "pulse";

  /** Hover duration */
  hoverDuration?: number;

  /** Enable click animations */
  clickAnimations?: boolean;

  /** Click animation type */
  clickType?: "scale" | "ripple" | "bounce" | "shake";

  /** Click duration */
  clickDuration?: number;

  /** Enable physics animations */
  physicsAnimations?: boolean;

  /** Physics configuration */
  physicsConfig?: {
    stiffness: number;
    damping: number;
    mass: number;
    velocity: number;
  };
}

export interface InteractiveAccessibilityConfig {
  /** ARIA label */
  "aria-label"?: string;

  /** ARIA description */
  "aria-describedby"?: string;

  /** ARIA role */
  role?: string;

  /** Tab index */
  tabIndex?: number;

  /** Focus management */
  autoFocus?: boolean;

  /** Keyboard navigation */
  keyboardNavigation?: boolean;

  /** Screen reader support */
  screenReaderSupport?: boolean;
}

// Context aware glass types
export interface ContextAwareGlassProps extends GlassInteractiveProps {
  /** Context sensitivity */
  contextSensitivity?: "low" | "medium" | "high";

  /** Context triggers */
  contextTriggers?: ContextTrigger[];

  /** Adaptation rules */
  adaptationRules?: AdaptationRule[];

  /** Context state */
  contextState?: ContextState;
}

export interface ContextTrigger {
  type:
    | "hover"
    | "focus"
    | "click"
    | "scroll"
    | "resize"
    | "time"
    | "user-activity";
  condition: (context: ContextState) => boolean;
  action: (element: HTMLElement) => void;
}

export interface AdaptationRule {
  condition: (context: ContextState) => boolean;
  adaptations: {
    glassVariant?: "frosted" | "dynamic" | "clear" | "tinted" | "luminous";
    blurStrength?: "none" | "light" | "standard" | "heavy";
    opacity?: number;
    scale?: number;
    glow?: boolean;
    animation?: Partial<InteractiveAnimationConfig>;
  };
}

export interface ContextState {
  userActivity: "idle" | "active" | "focused";
  scrollPosition: number;
  viewportSize: { width: number; height: number };
  timeOfDay: "morning" | "afternoon" | "evening" | "night";
  userPreferences: {
    reducedMotion: boolean;
    highContrast: boolean;
    prefersDark: boolean;
  };
  interactionHistory: InteractionEvent[];
}

export interface InteractionEvent {
  type: string;
  timestamp: number;
  target: string;
  data?: any;
}

// A11y auditor types
export interface GlassA11yAuditorProps extends GlassInteractiveProps {
  /** Audit scope */
  scope?: "element" | "component" | "page" | "application";

  /** Audit rules */
  auditRules?: A11yAuditRule[];

  /** Real-time auditing */
  realTime?: boolean;

  /** Audit report callback */
  onAuditReport?: (report: A11yAuditReport) => void;

  /** Auto-fix violations */
  autoFix?: boolean;

  /** Highlight violations */
  highlightViolations?: boolean;
}

export interface A11yAuditRule {
  id: string;
  name: string;
  description: string;
  category: "critical" | "serious" | "moderate" | "minor";
  check: (element: HTMLElement) => A11yViolation | null;
  fix?: (element: HTMLElement, violation: A11yViolation) => void;
}

export interface A11yViolation {
  ruleId: string;
  message: string;
  element: HTMLElement;
  severity: "critical" | "serious" | "moderate" | "minor";
  suggestion?: string;
}

export interface A11yAuditReport {
  timestamp: Date;
  scope: string;
  violations: A11yViolation[];
  score: number;
  recommendations: string[];
  passedRules: string[];
  failedRules: string[];
}

// Theme demo types
export interface GlassThemeDemoProps extends GlassInteractiveProps {
  /** Demo title */
  title?: string;

  /** Demo description */
  description?: string;

  /** Demo themes */
  themes?: ThemeDemo[];

  /** Current theme */
  currentTheme?: string;

  /** Enable theme switching */
  themeSwitching?: boolean;

  /** Demo components */
  demoComponents?: DemoComponent[];

  /** Theme change callback */
  onThemeChange?: (themeId: string) => void;

  /** Demo layout */
  layout?: "grid" | "list" | "tabs" | "carousel";

  /** Show theme switcher */
  showThemeSwitcher?: boolean;

  /** Show examples */
  showExamples?: boolean;

  /** Custom examples */
  customExamples?: React.ReactNode;

  /** Glass intensity */
  glassIntensity?: number;

  /** Header component */
  header?: React.ReactNode;

  /** Footer component */
  footer?: React.ReactNode;

  /** Show performance metrics */
  showPerformanceMetrics?: boolean;

  /** Use tabs layout */
  useTabs?: boolean;

  /** Show code previews */
  showCode?: boolean;

  /** Interactive mode */
  interactive?: boolean;

  /** Included categories */
  includedCategories?: string[];

  /** Minimal layout */
  minimal?: boolean;

  /** Compact preview/card layout */
  compact?: boolean;

  /** Bound the demo inside its parent container */
  contained?: boolean;

  /** Maximum height for compact/contained demos */
  maxHeight?: number | string;
}

export interface ThemeDemo {
  id: string;
  name: string;
  description?: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: {
      primary: string;
      secondary: string;
      disabled: string;
    };
    border: string;
  };
  glassVariant: "frosted" | "dynamic" | "clear" | "tinted" | "luminous";
  blurStrength: "none" | "light" | "standard" | "heavy";
  preview: React.ReactNode;
}

export interface DemoComponent {
  id: string;
  name: string;
  component: React.ComponentType<any>;
  props: Record<string, any>;
  category: string;
}

// Themed glass components types
export interface ThemedGlassComponentsProps extends GlassInteractiveProps {
  /** Component theme */
  theme?: GlassComponentTheme;

  /** Component variants */
  variants?: ComponentVariant[];

  /** Active variant */
  activeVariant?: string;

  /** Component size */
  size?: "sm" | "md" | "lg" | "xl";

  /** Enable theming */
  themingEnabled?: boolean;

  /** Theme override */
  themeOverride?: Partial<GlassComponentTheme>;
}

export interface GlassComponentTheme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: {
      primary: string;
      secondary: string;
      disabled: string;
    };
    border: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  effects: {
    borderRadius: string;
    boxShadow: string;
    backdropFilter: string;
    glow: string;
  };
  animations: {
    duration: string;
    easing: string;
    hover: string;
    focus: string;
  };
}

export interface ComponentVariant {
  id: string;
  name: string;
  theme: Partial<GlassComponentTheme>;
  preview: React.ReactNode;
}

// Focus ring types
export interface GlassFocusRingProps
  extends Omit<GlassInteractiveProps, "style"> {
  /** Focus target element */
  target?: HTMLElement | React.RefObject<HTMLElement>;

  /** Focus ring color */
  color?: string;

  /** Focus ring width */
  width?: number;

  /** Focus ring style */
  ringStyle?: "solid" | "dashed" | "dotted" | "glow";

  /** Focus ring shape */
  shape?: "rectangle" | "rounded" | "circle" | "pill";

  /** Focus ring offset */
  offset?: number;

  /** Focus ring thickness */
  thickness?: number;

  /** Border radius */
  borderRadius?: number;

  /** Disabled state */
  disabled?: boolean;

  /** Focus ring animation */
  animated?: boolean;

  /** Animation duration */
  animationDuration?: number;

  /** Keyboard navigation */
  keyboardNavigation?: boolean;
}

// Presets types
export interface GlassPresetsProps extends GlassInteractiveProps {
  /** Available presets */
  presets?: GlassPreset[];

  /** Current preset */
  currentPreset?: string;

  /** Preset categories */
  categories?: PresetCategory[];

  /** Enable preset switching */
  presetSwitching?: boolean;

  /** Preset change callback */
  onPresetChange?: (presetId: string) => void;

  /** Custom preset renderer */
  renderPreset?: (preset: GlassPreset) => React.ReactNode;
}

export interface GlassPreset {
  id: string;
  name: string;
  description?: string;
  category: string;
  config: {
    glassVariant: "frosted" | "dynamic" | "clear" | "tinted" | "luminous";
    blurStrength: "none" | "light" | "standard" | "heavy";
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      surface: string;
      text: {
        primary: string;
        secondary: string;
        disabled: string;
      };
      border: string;
    };
    effects: {
      borderRadius: string;
      boxShadow: string;
      backdropFilter: string;
      glow: string;
    };
    animations: Partial<InteractiveAnimationConfig>;
  };
  preview: React.ReactNode;
  tags?: string[];
}

export interface PresetCategory {
  id: string;
  name: string;
  description?: string;
  presets: string[]; // Preset IDs
}

// State management types
export interface InteractiveState {
  isHovered: boolean;
  isFocused: boolean;
  isActive: boolean;
  isLoading: boolean;
  isDisabled: boolean;
  isExpanded: boolean;
  isSelected: boolean;
  interactionCount: number;
  lastInteraction: Date;
}

export interface InteractiveContext {
  theme: GlassComponentTheme;
  accessibility: InteractiveAccessibilityConfig;
  animation: InteractiveAnimationConfig;
  state: InteractiveState;
  preferences: {
    reducedMotion: boolean;
    highContrast: boolean;
    prefersDark: boolean;
  };
}

// Utility types
export type InteractiveComponentProps<T = {}> = GlassInteractiveProps & T;
export type InteractiveRef = React.RefObject<HTMLElement>;

// Event types
export interface InteractiveEventHandlers {
  onHover?: (hovered: boolean) => void;
  onFocus?: (focused: boolean) => void;
  onActivate?: (active: boolean) => void;
  onSelect?: (selected: boolean) => void;
  onExpand?: (expanded: boolean) => void;
  onContextChange?: (context: ContextState) => void;
  onThemeChange?: (theme: GlassComponentTheme) => void;
  onPresetChange?: (preset: GlassPreset) => void;
  onA11yReport?: (report: A11yAuditReport) => void;
}

// All types are already exported with the export keyword above
