import React from "react";

export interface GlassContainerVariant {
  default: "default";
  fluid: "fluid";
  fixed: "fixed";
  responsive: "responsive";
}

export type GlassContainerVariantType = keyof GlassContainerVariant;

export interface GlassContainerSize {
  sm: "sm";
  md: "md";
  lg: "lg";
  xl: "xl";
  xxl: "xxl";
}

export type GlassContainerSizeType = keyof GlassContainerSize;

export interface GlassContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Container variant */
  variant?: GlassContainerVariantType;

  /** Container size */
  size?: GlassContainerSizeType;

  /** Maximum width */
  maxWidth?: string | number;

  /** Container padding */
  padding?: "none" | "sm" | "md" | "lg" | "xl";

  /** Enable centering */
  centered?: boolean;

  /** Glass morphism variant */
  glassVariant?: "frosted" | "dynamic" | "clear" | "tinted" | "luminous";

  /** Blur strength */
  blurStrength?: "none" | "light" | "standard" | "heavy";

  /** Custom styles */
  glassStyles?: React.CSSProperties;

  /** Children */
  children?: React.ReactNode;

  /** Glass surface intent */
  intent?: "neutral" | "primary" | "success" | "warning" | "danger" | "info";

  /** Glass surface elevation */
  elevation?: "level1" | "level2" | "level3" | "level4";

  /** Performance tier */
  tier?: "low" | "medium" | "high";
}

export interface GlassFlexProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "direction"> {
  /** Flex direction */
  direction?: "row" | "column" | "row-reverse" | "column-reverse";

  /** Justify content */
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";

  /** Align items */
  align?: "start" | "center" | "end" | "stretch" | "baseline";

  /** Flex wrap */
  wrap?: "nowrap" | "wrap" | "wrap-reverse";

  /** Gap between items */
  gap?: string | number;

  /** Enable responsive behavior */
  responsive?: boolean;

  /** Glass morphism variant */
  glassVariant?: "frosted" | "dynamic" | "clear" | "tinted" | "luminous";

  /** Blur strength */
  blurStrength?: "none" | "light" | "standard" | "heavy";

  /** Custom styles */
  glassStyles?: React.CSSProperties;

  /** Children */
  children?: React.ReactNode;
}

export interface GlassGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Grid template columns */
  columns?:
    | number
    | string
    | {
        sm: number | string;
        md: number | string;
        lg: number | string;
        xl: number | string;
      };

  /** Grid template rows */
  rows?:
    | number
    | string
    | {
        sm: number | string;
        md: number | string;
        lg: number | string;
        xl: number | string;
      };

  /** Grid gap */
  gap?: string | number;

  /** Grid auto flow */
  flow?: "row" | "column" | "dense" | "row-dense" | "column-dense";

  /** Justify items */
  justifyItems?: "start" | "center" | "end" | "stretch";

  /** Align items */
  alignItems?: "start" | "center" | "end" | "stretch";

  /** Justify content */
  justifyContent?: "start" | "center" | "end" | "between" | "around" | "evenly";

  /** Align content */
  alignContent?: "start" | "center" | "end" | "between" | "around" | "evenly";

  /** Enable responsive behavior */
  responsive?: boolean;

  /** Glass morphism variant */
  glassVariant?: "frosted" | "dynamic" | "clear" | "tinted" | "luminous";

  /** Blur strength */
  blurStrength?: "none" | "light" | "standard" | "heavy";

  /** Custom styles */
  glassStyles?: React.CSSProperties;

  /** Children */
  children?: React.ReactNode;
}

export interface GlassBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Box display type */
  display?:
    | "block"
    | "inline-block"
    | "inline"
    | "flex"
    | "inline-flex"
    | "grid"
    | "inline-grid";

  /** Box position */
  position?: "static" | "relative" | "absolute" | "fixed" | "sticky";

  /** Box dimensions */
  width?: string | number;
  height?: string | number;
  minWidth?: string | number;
  minHeight?: string | number;
  maxWidth?: string | number;
  maxHeight?: string | number;

  /** Box spacing */
  margin?:
    | string
    | number
    | {
        top?: string | number;
        right?: string | number;
        bottom?: string | number;
        left?: string | number;
      };
  padding?:
    | string
    | number
    | {
        top?: string | number;
        right?: string | number;
        bottom?: string | number;
        left?: string | number;
      };

  /** Box border */
  border?: string;
  borderRadius?: string | number;
  borderColor?: string;
  borderWidth?: string | number;

  /** Box background */
  background?: string;
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  backgroundRepeat?: "repeat" | "repeat-x" | "repeat-y" | "no-repeat";

  /** Box shadow */
  boxShadow?: string;

  /** Box overflow */
  overflow?: "visible" | "hidden" | "scroll" | "auto";
  overflowX?: "visible" | "hidden" | "scroll" | "auto";
  overflowY?: "visible" | "hidden" | "scroll" | "auto";

  /** Box opacity */
  opacity?: number;

  /** Box transform */
  transform?: string;
  transformOrigin?: string;

  /** Box transition */
  transition?: string;

  /** Glass morphism variant */
  glassVariant?: "frosted" | "dynamic" | "clear" | "tinted" | "luminous";

  /** Blur strength */
  blurStrength?: "none" | "light" | "standard" | "heavy";

  /** Enable hover effects */
  hoverable?: boolean;

  /** Custom styles */
  glassStyles?: React.CSSProperties;

  /** Children */
  children?: React.ReactNode;
}

export interface GlassMasonryProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of columns */
  columns?: number | { sm: number; md: number; lg: number; xl: number };

  /** Gap between items */
  gap?: string | number;

  /** Masonry items */
  items?: React.ReactNode[];

  /** Item aspect ratio */
  aspectRatio?: number;

  /** Enable responsive behavior */
  responsive?: boolean;

  /** Animation settings */
  animation?: {
    enabled: boolean;
    stagger: number;
    duration: number;
  };

  /** Glass morphism variant */
  glassVariant?: "frosted" | "dynamic" | "clear" | "tinted" | "luminous";

  /** Blur strength */
  blurStrength?: "none" | "light" | "standard" | "heavy";

  /** Custom styles */
  glassStyles?: React.CSSProperties;
}

export interface GlassScrollAreaProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Scroll direction */
  direction?: "vertical" | "horizontal" | "both";

  /** Enable smooth scrolling */
  smooth?: boolean;

  /** Scroll behavior */
  behavior?: "auto" | "smooth";

  /** Enable custom scrollbar */
  customScrollbar?: boolean;

  /** Scrollbar color */
  scrollbarColor?: string;

  /** Scrollbar width */
  scrollbarWidth?: number;

  /** Enable scroll snap */
  scrollSnap?: boolean;

  /** Scroll snap type */
  scrollSnapType?: "x" | "y" | "both" | "mandatory" | "proximity";

  /** Enable infinite scroll */
  infinite?: boolean;

  /** Infinite scroll callback */
  onLoadMore?: () => void;

  /** Infinite scroll threshold */
  loadMoreThreshold?: number;

  /** Glass morphism variant */
  glassVariant?: "frosted" | "dynamic" | "clear" | "tinted" | "luminous";

  /** Blur strength */
  blurStrength?: "none" | "light" | "standard" | "heavy";

  /** Custom styles */
  glassStyles?: React.CSSProperties;

  /** Children */
  children?: React.ReactNode;
}

export interface GlassSeparatorProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Separator orientation */
  orientation?: "horizontal" | "vertical";

  /** Separator variant */
  variant?: "solid" | "dashed" | "dotted" | "gradient";

  /** Separator color */
  color?: string;

  /** Separator thickness */
  thickness?: number;

  /** Separator length */
  length?: string | number;

  /** Enable glass effect */
  glass?: boolean;

  /** Glass variant */
  glassVariant?: "frosted" | "dynamic" | "clear" | "tinted" | "luminous";

  /** Custom styles */
  styles?: React.CSSProperties;
}

export interface GlassSplitPaneProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Split direction */
  direction?: "horizontal" | "vertical";

  /** Initial split position */
  initialSplit?: number;

  /** Minimum size for first pane */
  minSize?: number;

  /** Maximum size for first pane */
  maxSize?: number;

  /** Splitter size */
  splitterSize?: number;

  /** Enable resizing */
  resizable?: boolean;

  /** Enable collapsing */
  collapsible?: boolean;

  /** Collapse threshold */
  collapseThreshold?: number;

  /** Split change callback */
  onSplitChange?: (split: number) => void;

  /** Collapse callback */
  onCollapse?: (collapsed: boolean) => void;

  /** Compact density for constrained previews and embedded panels */
  compact?: boolean;

  /** Keep the split pane visually bounded inside its parent */
  contained?: boolean;

  /** Maximum rendered height for contained/compact contexts */
  maxHeight?: number | string;

  /** Maximum rendered width for contained/compact contexts */
  maxWidth?: number | string;

  /** Glass morphism variant */
  glassVariant?: "frosted" | "dynamic" | "clear" | "tinted" | "luminous";

  /** Blur strength */
  blurStrength?: "none" | "light" | "standard" | "heavy";

  /** Custom styles */
  glassStyles?: React.CSSProperties;

  /** Children (should be exactly 2) */
  children: [React.ReactNode, React.ReactNode];
}

export interface GlassStackProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Stack direction */
  direction?: "vertical" | "horizontal";

  /** Stack spacing */
  spacing?: string | number;

  /** Stack alignment */
  align?: "start" | "center" | "end" | "stretch";

  /** Stack justification */
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";

  /** Enable wrapping */
  wrap?: boolean;

  /** Stack divider */
  divider?: React.ReactNode;

  /** Enable responsive behavior */
  responsive?: boolean;

  /** Glass morphism variant */
  glassVariant?: "frosted" | "dynamic" | "clear" | "tinted" | "luminous";

  /** Blur strength */
  blurStrength?: "none" | "light" | "standard" | "heavy";

  /** Custom styles */
  glassStyles?: React.CSSProperties;

  /** Children */
  children?: React.ReactNode;
}

// Layout system types
export interface LayoutSystem {
  /** Layout type */
  type: "grid" | "flex" | "absolute" | "masonry";

  /** Layout configuration */
  config: LayoutConfig;

  /** Responsive breakpoints */
  breakpoints?: {
    [key: string]: LayoutConfig;
  };

  /** Layout constraints */
  constraints?: LayoutConstraints;
}

export interface LayoutConfig {
  columns?: number | string;
  rows?: number | string;
  gap?: string | number;
  padding?: string | number;
  margin?: string | number;
  maxWidth?: string | number;
  minHeight?: string | number;
}

export interface LayoutConstraints {
  minWidth?: string | number;
  maxWidth?: string | number;
  minHeight?: string | number;
  maxHeight?: string | number;
  aspectRatio?: number;
}

// Theme integration types
export interface LayoutThemeTokens {
  spacing: {
    container: Record<GlassContainerSizeType, string>;
    gap: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
  };
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
  };
  effects: {
    borderRadius: Record<NonNullable<GlassContainerProps["padding"]>, string>;
    boxShadow: string;
    backdropFilter: Record<
      NonNullable<GlassContainerProps["blurStrength"]>,
      string
    >;
  };
}

// Utility types
export type LayoutComponentProps<T = {}> =
  React.HTMLAttributes<HTMLDivElement> & T;
export type LayoutRef = React.RefObject<HTMLDivElement>;

// All types are already exported individually above
