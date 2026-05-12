import React from "react";

export interface GlassButtonVariant {
  default: "default";
  primary: "primary";
  secondary: "secondary";
  tertiary: "tertiary";
  ghost: "ghost";
  destructive: "destructive";
  error: "error";
  outline: "outline";
  link: "link";
  gradient: "gradient";
  aurora: "aurora";
  success: "success";
  warning: "warning";
}

export type GlassButtonVariantType = keyof GlassButtonVariant;

export interface GlassButtonSize {
  xs: "xs";
  sm: "sm";
  md: "md";
  lg: "lg";
  xl: "xl";
}

export type GlassButtonSizeType = keyof GlassButtonSize;

export interface GlassButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "size"> {
  /** Button variant */
  variant?: GlassButtonVariantType;

  /** Button size */
  size?: GlassButtonSizeType;

  /** Glass morphism variant */
  glassVariant?: "frosted" | "dynamic" | "clear" | "tinted" | "luminous";

  /** Blur strength */
  blurStrength?: "none" | "light" | "standard" | "heavy";

  /** Enable ripple effect */
  ripple?: boolean;

  /** Enable magnetic effect */
  magnetic?: boolean;

  /** Loading state */
  loading?: boolean;

  /** Loading text */
  loadingText?: string;

  /** Icon position */
  iconPosition?: "left" | "right";

  /** Full width */
  fullWidth?: boolean;

  /** Border radius */
  borderRadius?: "none" | "sm" | "md" | "lg" | "xl" | "full";

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

export interface GlassFabProps
  extends Omit<GlassButtonProps, "size" | "fullWidth"> {
  /** FAB size */
  size?: "sm" | "md" | "lg";

  /** FAB position */
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";

  /** Always visible */
  alwaysVisible?: boolean;

  /** Extended state */
  extended?: boolean;

  /** Extended text */
  extendedText?: string;
}

export interface GlassMagneticButtonProps extends GlassButtonProps {
  /** Magnetic strength */
  magneticStrength?: number;

  /** Magnetic range */
  magneticRange?: number;

  /** Enable 3D tilt effect */
  tiltEffect?: boolean;

  /** Maximum tilt angle */
  maxTiltAngle?: number;

  /** Enable glow effect */
  glowEffect?: boolean;

  /** Glow color */
  glowColor?: string;

  /** Glow intensity */
  glowIntensity?: number;
}

export interface ButtonGroupProps {
  /** Button group variant */
  variant?: GlassButtonVariantType;

  /** Button group size */
  size?: GlassButtonSizeType;

  /** Button group orientation */
  orientation?: "horizontal" | "vertical";

  /** Full width */
  fullWidth?: boolean;

  /** Glass morphism variant */
  glassVariant?: "frosted" | "dynamic" | "clear" | "tinted" | "luminous";

  /** Children buttons */
  children: React.ReactNode;

  /** Custom container styles */
  containerStyles?: React.CSSProperties;

  /** Spacing between buttons */
  spacing?: "none" | "sm" | "md" | "lg";
}

export interface ButtonIconProps {
  /** Icon component */
  icon: React.ComponentType<any>;

  /** Icon size */
  size?: number;

  /** Icon color */
  color?: string;

  /** Icon animation */
  animated?: boolean;

  /** Animation type */
  animationType?: "spin" | "pulse" | "bounce" | "shake";
}

export interface LoadingSpinnerProps {
  /** Spinner size */
  size?: "xs" | "sm" | "md" | "lg";

  /** Spinner color */
  color?: string;

  /** Spinner thickness */
  thickness?: number;

  /** Custom spinner component */
  customSpinner?: React.ComponentType<any>;
}

// Theme integration types
export interface ButtonThemeTokens {
  colors: {
    primary: {
      background: string;
      hover: string;
      active: string;
      text: string;
      border: string;
    };
    secondary: {
      background: string;
      hover: string;
      active: string;
      text: string;
      border: string;
    };
    // ... other variants
  };
  spacing: {
    padding: Record<GlassButtonSizeType, string>;
    margin: Record<GlassButtonSizeType, string>;
  };
  typography: {
    fontSize: Record<GlassButtonSizeType, string>;
    fontWeight: Record<GlassButtonSizeType, string | number>;
  };
  effects: {
    borderRadius: Record<NonNullable<GlassButtonProps["borderRadius"]>, string>;
    boxShadow: Record<GlassButtonVariantType, string>;
    backdropFilter: Record<
      NonNullable<GlassButtonProps["blurStrength"]>,
      string
    >;
  };
}

// Animation and interaction types
export interface ButtonAnimationConfig {
  /** Enable entrance animation */
  entrance?: boolean;

  /** Entrance animation type */
  entranceType?: "fadeIn" | "slideIn" | "scaleIn" | "bounceIn";

  /** Entrance animation duration */
  entranceDuration?: number;

  /** Enable hover animations */
  hoverAnimations?: boolean;

  /** Hover animation scale */
  hoverScale?: number;

  /** Enable click animations */
  clickAnimations?: boolean;

  /** Click animation scale */
  clickScale?: number;

  /** Enable ripple effect */
  rippleEffect?: boolean;

  /** Ripple color */
  rippleColor?: string;

  /** Ripple duration */
  rippleDuration?: number;
}

export interface ButtonAccessibilityProps {
  /** ARIA label */
  "aria-label"?: string;

  /** ARIA description */
  "aria-describedby"?: string;

  /** ARIA expanded */
  "aria-expanded"?: boolean;

  /** ARIA pressed */
  "aria-pressed"?: boolean;

  /** Role */
  role?: "button" | "link" | "menuitem" | "tab";

  /** Tab index */
  tabIndex?: number;

  /** Focus management */
  autoFocus?: boolean;

  /** Keyboard navigation */
  keyboardNavigation?: boolean;
}

// Utility types
export type GlassButtonComponentProps = GlassButtonProps &
  ButtonAccessibilityProps;
export type GlassFabComponentProps = GlassFabProps & ButtonAccessibilityProps;
export type GlassMagneticButtonComponentProps = GlassMagneticButtonProps &
  ButtonAccessibilityProps;

// Event handler types
export interface ButtonEventHandlers {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseEnter?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseLeave?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLButtonElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLButtonElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
  onKeyUp?: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
}

// State types
export interface ButtonState {
  isHovered: boolean;
  isFocused: boolean;
  isActive: boolean;
  isLoading: boolean;
  isDisabled: boolean;
}

// Ref types
export type GlassButtonRef = React.RefObject<HTMLButtonElement>;
export type GlassFabRef = React.RefObject<HTMLButtonElement>;
export type GlassMagneticButtonRef = React.RefObject<HTMLButtonElement>;

// Compound component types
export interface ButtonCompoundComponent {
  Root: React.ComponentType<GlassButtonComponentProps>;
  Group: React.ComponentType<ButtonGroupProps>;
  Icon: React.ComponentType<ButtonIconProps>;
  LoadingSpinner: React.ComponentType<LoadingSpinnerProps>;
}

// All types are already exported individually above
