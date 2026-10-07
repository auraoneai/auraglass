import React from "react";
// Type definitions for AuraGlass components
// This file provides TypeScript support for all exported components

import { ComponentProps } from "react";

// Base component props types
export type BaseComponentProps = ComponentProps<"div">;

// Optimized Glass primitive types
export interface OptimizedGlassProps extends BaseComponentProps {
  elevation?: 0 | 1 | 2 | 3 | 4 | "float";
  blur?: "none" | "subtle" | "medium" | "strong" | "intense";
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "error"
    | "frosted"
    | "liquid"
    | "crystal"
    | "holographic"
    | "neural"
    | "ethereal";
  interactive?: boolean;
  performanceMode?: "low" | "medium" | "high" | "ultra";
  lazyEffects?: boolean;
  depth?: 1 | 2 | 3 | 4 | 5;
  tint?:
    | "neutral"
    | "blue"
    | "purple"
    | "lavender"
    | "green"
    | "amber"
    | "red"
    | "cyan"
    | "pink"
    | "rainbow";
  animation?:
    | "none"
    | "float"
    | "pulse"
    | "shimmer"
    | "breathe"
    | "morph"
    | "ripple"
    | "wave";
  border?:
    | "none"
    | "subtle"
    | "glow"
    | "gradient"
    | "neon"
    | "dynamic"
    | "particle";
  intensity?: "subtle" | "medium" | "strong" | "extreme" | "ultra";
  lighting?:
    | "ambient"
    | "directional"
    | "volumetric"
    | "caustic"
    | "iridescent";
  refraction?: boolean;
  caustics?: boolean;
  chromatic?: boolean;
  parallax?: boolean;
  adaptive?: boolean;
  hoverSheen?: boolean;
  liftOnHover?: boolean;
  press?: boolean;
  tilt?: boolean;
  magnet?: boolean;
  cursorHighlight?: boolean;
  activeGlow?: boolean;
}

// Layout component types
export type GlassContainerProps = BaseComponentProps & {
  maxWidth?: string;
  padding?: string;
  center?: boolean;
};

export type GlassGridProps = BaseComponentProps & {
  columns?: number;
  gap?: string;
  responsive?: boolean;
};

export type GlassStackProps = BaseComponentProps & {
  direction?: "vertical" | "horizontal";
  gap?: string;
  align?: "start" | "center" | "end";
};

export type GlassSplitPaneProps = BaseComponentProps & {
  direction?: "horizontal" | "vertical";
  initial?: number;
  min?: number;
  max?: number;
};

// Navigation component types
export type GlassHeaderProps = BaseComponentProps & {
  sticky?: boolean;
  transparent?: boolean;
};

export type GlassSidebarProps = BaseComponentProps & {
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  width?: string;
};

export type GlassToolbarProps = BaseComponentProps & {
  left?: React.ReactNode;
  center?: React.ReactNode;
  right?: React.ReactNode;
  sticky?: boolean;
  floating?: boolean;
};

export type GlassCommandBarProps = BaseComponentProps & {
  items?: Array<{
    id: string;
    label: string;
    icon?: React.ReactNode;
    shortcut?: string;
    onSelect?: () => void;
    disabled?: boolean;
  }>;
  position?: "top" | "bottom";
};

export type GlassSegmentedControlProps = BaseComponentProps & {
  items: Array<{
    id: string;
    label: string;
    icon?: React.ReactNode;
  }>;
  value?: string;
  onChange?: (value: string) => void;
  size?: "sm" | "md" | "lg";
  condensed?: boolean;
};

// Modal component types
export type GlassDialogProps = BaseComponentProps & {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
};

export type GlassModalProps = BaseComponentProps & {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export type GlassDrawerProps = BaseComponentProps & {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: "left" | "right" | "top" | "bottom";
};

export type GlassPopoverProps = BaseComponentProps & {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
};

// Form component types
export type GlassInputProps = BaseComponentProps & {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
};

export type GlassTextareaProps = BaseComponentProps & {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  rows?: number;
  disabled?: boolean;
};

export type GlassSelectProps = BaseComponentProps & {
  options?: Array<{ value: string; label: string }>;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
};

export type GlassCheckboxProps = BaseComponentProps & {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
};

export type GlassSliderProps = BaseComponentProps & {
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
};

export type GlassSwitchProps = BaseComponentProps & {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
};

// Data display component types
export type GlassDataTableProps = BaseComponentProps & {
  columns?: Array<{ key: string; header: string }>;
  rows?: Array<Record<string, unknown>>;
};

export type GlassTimelineProps = BaseComponentProps & {
  items?: Array<{
    id: string;
    title: string;
    subtitle?: string;
    time?: string;
    icon?: React.ReactNode;
  }>;
};

export type GlassAlertProps = BaseComponentProps & {
  variant?: "default" | "success" | "warning" | "error";
  title?: string;
  description?: string;
};

export type GlassBadgeProps = BaseComponentProps & {
  variant?: "default" | "secondary" | "success" | "warning" | "error";
  children: React.ReactNode;
};

export type GlassProgressProps = BaseComponentProps & {
  value?: number;
  max?: number;
  showValue?: boolean;
};

// Interactive component types
export type GlassCarouselProps = BaseComponentProps & {
  items?: React.ReactNode[];
  autoPlay?: boolean;
  interval?: number;
};

export type GlassChatProps = BaseComponentProps & {
  messages?: Array<{
    id: string;
    content: string;
    sender: string;
    timestamp: Date;
  }>;
};

export type GlassKanbanProps = BaseComponentProps & {
  columns?: Array<{
    id: string;
    title: string;
    cards: Array<{
      id: string;
      title: string;
      content?: string;
    }>;
  }>;
};

// Chart component types
export type GlassAreaChartProps = BaseComponentProps & {
  data?: Array<{ x: string | number; y: number }>;
  width?: number;
  height?: number;
};

export type GlassBarChartProps = BaseComponentProps & {
  data?: Array<{ x: string | number; y: number }>;
  width?: number;
  height?: number;
};

export type GlassLineChartProps = BaseComponentProps & {
  data?: Array<{ x: string | number; y: number }>;
  width?: number;
  height?: number;
};

export type GlassPieChartProps = BaseComponentProps & {
  data?: Array<{ value: number; label: string; color?: string }>;
  width?: number;
  height?: number;
};

// Dashboard component types
export type GlassKPICardProps = BaseComponentProps & {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
};

export type GlassMetricCardProps = BaseComponentProps & {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
};

export type GlassStatCardProps = BaseComponentProps & {
  title: string;
  value: string | number;
  description?: string;
};

// Button component types
export type GlassButtonProps = BaseComponentProps & {
  variant?: "default" | "primary" | "secondary" | "ghost" | "link";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
};

// Card component types
export type GlassCardProps = BaseComponentProps & {
  padding?: string;
  shadow?: boolean;
};

// Calendar component types
export type GlassCalendarProps = BaseComponentProps & {
  value?: Date;
  onChange?: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
};
