import React from 'react';

export interface GlassSurfaceVariant {
  clear: 'clear';
  frosted: 'frosted';
  tinted: 'tinted';
  luminous: 'luminous';
  dynamic: 'dynamic';
  crystal: 'crystal';
}

export type GlassSurfaceVariantType = keyof GlassSurfaceVariant;

export interface GlassSurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Surface variant */
  variant?: GlassSurfaceVariantType;

  /** Surface elevation (deprecated - use string values) */
  // elevation?: number;

  /** Surface depth */
  depth?: number;

  /** Enable glass morphism */
  glass?: boolean;

  /** Glass morphism variant */
  glassVariant?: 'frosted' | 'dynamic' | 'clear' | 'tinted' | 'luminous';

  /** Blur strength */
  blurStrength?: 'none' | 'light' | 'standard' | 'heavy';

  /** Surface opacity */
  opacity?: 'low' | 'medium' | 'high' | number;

  /** Surface color */
  color?: string;

  /** Border radius */
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

  /** Border color */
  borderColor?: string;

  /** Border width */
  borderWidth?: number;

  /** Enable hover effects */
  hoverable?: boolean;

  /** Hover elevation */
  hoverElevation?: number;

  /** Enable interactive effects */
  interactive?: boolean;

  /** Enable physics effects */
  physics?: boolean;

  /** Custom styles */
  glassStyles?: React.CSSProperties;

  /** Children */
  children?: React.ReactNode;

  /** Glass surface intent */
  intent?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  
  /** Glass surface elevation */
  elevation?: 'level1' | 'level2' | 'level3' | 'level4';
  
  /** Performance tier */
  tier?: 'low' | 'medium' | 'high';
}

export interface DimensionalGlassProps extends GlassSurfaceProps {
  /** Enable 3D perspective */
  perspective?: boolean;

  /** Perspective value */
  perspectiveValue?: number;

  /** Enable rotation on interaction */
  rotateOnHover?: boolean;

  /** Maximum rotation angle */
  maxRotation?: number;

  /** Enable scaling on interaction */
  scaleOnHover?: boolean;

  /** Scale factor */
  scaleFactor?: number;

  /** Enable depth layers */
  depthLayers?: boolean;

  /** Number of depth layers */
  layerCount?: number;

  /** Layer offset */
  layerOffset?: number;

  /** Enable parallax effect */
  parallax?: boolean;

  /** Parallax strength */
  parallaxStrength?: number;

  /** Border opacity */
  borderOpacity?: 'none' | 'subtle' | 'light' | 'medium' | 'strong';

  /** Full width */
  fullWidth?: boolean;

  /** Full height */
  fullHeight?: boolean;

  /** Padding */
  padding?: number;

  /** Dynamic shadow */
  dynamicShadow?: boolean;

  /** Enable animation */
  animate?: boolean;

  /** Z-index */
  zIndex?: number;

  /** Background color */
  backgroundColor?: string;

  /** Maximum tilt angle */
  maxTilt?: number;

  /** Hover scale factor */
  hoverScale?: number;

  /** Animation configuration */
  animationConfig?: any;

  /** Disable animation */
  disableAnimation?: boolean;

  /** Motion sensitivity */
  motionSensitivity?: any;
  /**
   * Glass material variant
   */
  material?: 'glass' | 'liquid';
  /**
   * Material properties for liquid glass
   */
  materialProps?: {
    ior?: number;
    thickness?: number;
    tint?: { r: number; g: number; b: number; a: number };
    variant?: 'regular' | 'clear';
    quality?: 'ultra' | 'high' | 'balanced' | 'efficient';
  };
}

export interface FrostedGlassProps extends GlassSurfaceProps {
  /** Frost intensity */
  frostIntensity?: number;

  /** Enable dynamic frost */
  dynamicFrost?: boolean;

  /** Frost pattern */
  frostPattern?: 'noise' | 'lines' | 'crystals';

  /** Frost density */
  frostDensity?: number;

  /** Frost color */
  frostColor?: string;

  /** Enable animated frost */
  animatedFrost?: boolean;

  /** Animation speed */
  animationSpeed?: number;

  /** Border opacity */
  borderOpacity?: 'none' | 'subtle' | 'light' | 'medium' | 'strong';

  /** Full width */
  fullWidth?: boolean;

  /** Full height */
  fullHeight?: boolean;

  /** Padding */
  padding?: number;

  /** Animation intensity */
  intensity?: number;

  /** Enable animation */
  animate?: boolean;

  /** Pattern type */
  pattern?: 'noise' | 'lines' | 'crystals' | string;

  /** Background color */
  backgroundColor?: string;

  /** Enables specular sheen overlay */
  specular?: boolean;

  /** Enables additive glow; string uses semantic accent */
  glow?: boolean | 'primary' | 'success' | 'warning' | 'danger' | 'info';

  /** Light angle for specular sheen in degrees */
  lightAngle?: number;

  /** Pointer parallax for sheen */
  parallax?: boolean;

  /** Parallax strength (px at extremes) */
  parallaxStrength?: number;
}

export interface HeatGlassProps extends GlassSurfaceProps {
  /** Enable heat distortion */
  heatDistortion?: boolean;

  /** Distortion intensity */
  distortionIntensity?: number;

  /** Heat pattern */
  heatPattern?: 'waves' | 'ripples' | 'swirls' | 'random';

  /** Heat color */
  heatColor?: string;

  /** Enable animated heat */
  animatedHeat?: boolean;

  /** Animation speed */
  animationSpeed?: number;

  /** Heat temperature */
  temperature?: number;

  /** Enable animation */
  animate?: boolean;

  /** Background color */
  backgroundColor?: string;
}

export interface PageGlassContainerProps extends GlassSurfaceProps {
  /** Container type */
  containerType?: 'page' | 'section' | 'card' | 'modal';

  /** Enable sticky positioning */
  sticky?: boolean;

  /** Sticky offset */
  stickyOffset?: number;

  /** Enable full height */
  fullHeight?: boolean;

  /** Enable full width */
  fullWidth?: boolean;

  /** Enable full page */
  fullPage?: boolean;

  /** Maximum width */
  maxWidth?: string | number;

  /** Background color */
  backgroundColor?: string;

  /** Enable scroll fade effect */
  scrollFade?: boolean;

  /** Dimensional children */
  dimensionalChildren?: boolean;

  /** Container padding */
  containerPadding?: string | number;

  /** Container margin */
  containerMargin?: string | number;

  /** Enable responsive behavior */
  responsive?: boolean;

  /** Breakpoint behavior */
  breakpoints?: {
    sm: Partial<GlassSurfaceProps>;
    md: Partial<GlassSurfaceProps>;
    lg: Partial<GlassSurfaceProps>;
    xl: Partial<GlassSurfaceProps>;
  };
}

export interface WidgetGlassProps extends Omit<DimensionalGlassProps, 'onDrag'> {
  /** Widget type */
  widgetType?: 'card' | 'panel' | 'container' | 'overlay';

  /** Widget size */
  widgetSize?: 'sm' | 'md' | 'lg' | 'xl' | 'auto';

  /** Enable widget header */
  showHeader?: boolean;

  /** Widget title */
  widgetTitle?: string;

  /** Widget subtitle */
  subtitle?: string;

  /** Enable widget footer */
  showFooter?: boolean;

  /** Widget actions */
  widgetActions?: React.ReactNode;

  /** Enable collapsible */
  collapsible?: boolean;

  /** Collapsed state */
  collapsed?: boolean;

  /** Enable resizable */
  resizable?: boolean;

  /** Minimum size */
  minSize?: { width: number; height: number };

  /** Maximum size */
  maxSize?: { width: number; height: number };

  /** Resize callback */
  onResize?: (size: { width: number; height: number }) => void;

  /** Enable draggable */
  draggable?: boolean;

  /** Drag bounds */
  dragBounds?: string | HTMLElement | { left: number; top: number; right: number; bottom: number };

  /** Border opacity */
  borderOpacity?: 'none' | 'subtle' | 'light' | 'medium' | 'strong';

  /** Full width */
  fullWidth?: boolean;

  /** Full height */
  fullHeight?: boolean;

  /** Padding */
  padding?: number;

  /** Highlight on hover */
  highlightOnHover?: boolean;

  /** Animate on mount */
  animateOnMount?: boolean;

  /** Priority level */
  priority?: 'low' | 'medium' | 'high';

  /** Background color */
  backgroundColor?: string;
}

// Surface effects types
export interface SurfaceEffect {
  type: 'glow' | 'shadow' | 'blur' | 'noise' | 'gradient' | 'pattern';
  intensity: number;
  color?: string;
  size?: number;
  animated?: boolean;
  direction?: 'horizontal' | 'vertical' | 'radial';
}

export interface SurfaceEffectsConfig {
  /** Glow effect */
  glow?: SurfaceEffect;

  /** Shadow effect */
  shadow?: SurfaceEffect;

  /** Blur effect */
  blur?: SurfaceEffect;

  /** Noise texture */
  noise?: SurfaceEffect;

  /** Gradient overlay */
  gradient?: SurfaceEffect;

  /** Pattern overlay */
  pattern?: SurfaceEffect;

  /** Enable depth */
  depth?: boolean;

  /** Depth layers */
  depthLayers?: number;

  /** Layer separation */
  layerSeparation?: number;
}

export interface SurfaceAnimationConfig {
  /** Enable entrance animation */
  entrance?: boolean;

  /** Entrance animation type */
  entranceType?: 'fadeIn' | 'slideIn' | 'scaleIn' | 'bounceIn' | 'elasticIn';

  /** Entrance duration */
  entranceDuration?: number;

  /** Enable hover animations */
  hoverAnimations?: boolean;

  /** Hover animation type */
  hoverType?: 'lift' | 'glow' | 'scale' | 'tilt' | 'pulse';

  /** Hover duration */
  hoverDuration?: number;

  /** Enable interaction animations */
  interactionAnimations?: boolean;

  /** Interaction animation type */
  interactionType?: 'ripple' | 'wave' | 'sparkle' | 'magnetic';

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

export interface SurfaceAccessibilityConfig {
  /** ARIA label */
  'aria-label'?: string;

  /** ARIA description */
  'aria-describedby'?: string;

  /** ARIA role */
  role?: string;

  /** Tab index */
  tabIndex?: number;

  /** Focus management */
  focusable?: boolean;

  /** Keyboard navigation */
  keyboardNavigation?: boolean;

  /** Screen reader support */
  screenReaderSupport?: boolean;
}

// Material properties types
export interface MaterialProperties {
  /** Surface roughness */
  roughness: number;

  /** Surface metallicness */
  metallic: number;

  /** Surface transparency */
  transparent: boolean;

  /** Surface opacity */
  opacity: number;

  /** Surface reflectivity */
  reflectivity: number;

  /** Surface refraction */
  refraction: number;

  /** Surface emissive */
  emissive: boolean;

  /** Emissive color */
  emissiveColor?: string;

  /** Emissive intensity */
  emissiveIntensity?: number;
}

export interface SurfaceMaterial {
  /** Material type */
  type: 'glass' | 'plastic' | 'metal' | 'fabric' | 'wood' | 'stone';

  /** Material properties */
  properties: MaterialProperties;

  /** Material color */
  color?: string;

  /** Material texture */
  texture?: string;

  /** Material normal map */
  normalMap?: string;
}

// Lighting types
export interface SurfaceLighting {
  /** Enable lighting */
  enabled: boolean;

  /** Light type */
  type: 'ambient' | 'directional' | 'point' | 'spot';

  /** Light color */
  color: string;

  /** Light intensity */
  intensity: number;

  /** Light position */
  position?: { x: number; y: number; z: number };

  /** Light direction */
  direction?: { x: number; y: number; z: number };

  /** Light angle (for spot lights) */
  angle?: number;

  /** Light penumbra (for spot lights) */
  penumbra?: number;

  /** Cast shadows */
  castShadow?: boolean;

  /** Shadow configuration */
  shadow?: {
    enabled: boolean;
    mapSize: number;
    camera: {
      near: number;
      far: number;
      left: number;
      right: number;
      top: number;
      bottom: number;
    };
  };
}

export interface SurfaceEnvironment {
  /** Environment lighting */
  lighting: SurfaceLighting[];

  /** Environment reflections */
  reflections?: boolean;

  /** Environment map */
  environmentMap?: string;

  /** Ambient occlusion */
  ambientOcclusion?: boolean;

  /** Global illumination */
  globalIllumination?: boolean;
}

// Theme integration types
export interface SurfaceThemeTokens {
  colors: {
    surface: Record<GlassSurfaceVariantType, string>;
    border: Record<GlassSurfaceVariantType, string>;
    shadow: Record<GlassSurfaceVariantType, string>;
    glow: Record<GlassSurfaceVariantType, string>;
  };
  effects: {
    blur: Record<NonNullable<GlassSurfaceProps['blurStrength']>, string>;
    borderRadius: Record<NonNullable<GlassSurfaceProps['borderRadius']>, string>;
    boxShadow: Record<GlassSurfaceVariantType, string>;
    backdropFilter: Record<NonNullable<GlassSurfaceProps['blurStrength']>, string>;
  };
  materials: {
    glass: SurfaceMaterial;
    plastic: SurfaceMaterial;
    metal: SurfaceMaterial;
    fabric: SurfaceMaterial;
  };
}

// State types
export interface SurfaceState {
  isHovered: boolean;
  isFocused: boolean;
  isActive: boolean;
  isLoading: boolean;
  isDisabled: boolean;
  elevation: number;
  opacity: number;
  effects: SurfaceEffectsConfig;
}

// Event handler types
export interface SurfaceEventHandlers {
  onHover?: (hovered: boolean) => void;
  onFocus?: (focused: boolean) => void;
  onActivate?: (active: boolean) => void;
  onEffectChange?: (effects: SurfaceEffectsConfig) => void;
  onMaterialChange?: (material: SurfaceMaterial) => void;
  onLightingChange?: (lighting: SurfaceLighting[]) => void;
}

// Ref types
export type GlassSurfaceRef = React.RefObject<HTMLDivElement>;
export type DimensionalGlassRef = React.RefObject<HTMLDivElement>;
export type FrostedGlassRef = React.RefObject<HTMLDivElement>;
export type HeatGlassRef = React.RefObject<HTMLDivElement>;
export type PageGlassContainerRef = React.RefObject<HTMLDivElement>;
export type WidgetGlassRef = React.RefObject<HTMLDivElement>;

// Compound component types
export interface SurfaceCompoundComponent {
  Root: React.ComponentType<GlassSurfaceProps>;
  Content: React.ComponentType<React.HTMLAttributes<HTMLDivElement>>;
  Header: React.ComponentType<React.HTMLAttributes<HTMLDivElement>>;
  Footer: React.ComponentType<React.HTMLAttributes<HTMLDivElement>>;
  Overlay: React.ComponentType<React.HTMLAttributes<HTMLDivElement>>;
}

// All types are already exported as named exports above
