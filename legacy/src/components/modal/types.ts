import React from 'react';

export type GlassModalVariantType = 'default' | 'fullscreen' | 'centered' | 'side' | 'bottom';

export type GlassModalSizeType = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface GlassModalProps {
  /** Modal open state */
  open: boolean;

  /** Modal close callback */
  onClose: () => void;

  /** Modal variant */
  variant?: GlassModalVariantType;

  /** Modal size */
  size?: GlassModalSizeType;

  /** Modal title */
  title?: string;

  /** Modal description */
  description?: string;

  /** Modal content */
  children?: React.ReactNode;

  /** Modal footer */
  footer?: React.ReactNode;

  /** Enable backdrop */
  backdrop?: boolean;

  /** Backdrop color */
  backdropColor?: string;

  /** Enable backdrop blur */
  backdropBlur?: boolean;

  /** Backdrop blur strength */
  backdropBlurStrength?: 'light' | 'standard' | 'heavy';

  /** Enable close on backdrop click */
  closeOnBackdropClick?: boolean;

  /** Enable close on escape key */
  closeOnEscape?: boolean;

  /** Enable focus trap */
  focusTrap?: boolean;

  /** Initial focus element */
  initialFocus?: HTMLElement | string;

  /** Final focus element */
  finalFocus?: HTMLElement | string;

  /** Modal z-index */
  zIndex?: number;

  /** Enable animations */
  animated?: boolean;

  /** Animation type */
  animationType?: 'fade' | 'slide' | 'scale' | 'bounce';

  /** Animation duration */
  animationDuration?: number;

  /** Glass morphism variant */
  glassVariant?: 'frosted' | 'dynamic' | 'clear' | 'tinted' | 'luminous';

  /** Blur strength */
  blurStrength?: 'none' | 'light' | 'standard' | 'heavy';

  /** Custom styles */
  glassStyles?: React.CSSProperties;

  /** ARIA attributes */
  'aria-labelledby'?: string;
  'aria-describedby'?: string;

  /** Glass surface intent */
  intent?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  
  /** Glass surface elevation */
  elevation?: 'level1' | 'level2' | 'level3' | 'level4';
  
  /** Performance tier */
  tier?: 'low' | 'medium' | 'high';
}

export interface GlassDialogProps extends Omit<GlassModalProps, 'variant'> {
  /** Dialog variant */
  variant?: 'default' | 'confirmation' | 'alert' | 'form';

  /** Dialog icon */
  icon?: React.ReactNode;

  /** Dialog actions */
  actions?: DialogAction[];

  /** Enable destructive mode */
  destructive?: boolean;
}

export interface DialogAction {
  label: string;
  action: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
}

export interface GlassDrawerProps extends Omit<GlassModalProps, 'variant' | 'size'> {
  /** Drawer position */
  position?: 'left' | 'right' | 'top' | 'bottom';

  /** Drawer width/height */
  size?: string | number;

  /** Enable overlay */
  overlay?: boolean;

  /** Overlay color */
  overlayColor?: string;

  /** Enable swipe to close */
  swipeToClose?: boolean;

  /** Swipe threshold */
  swipeThreshold?: number;
}

export interface GlassBottomSheetProps extends Omit<GlassModalProps, 'variant'> {
  /** Sheet height */
  height?: string | number;

  /** Enable snap points */
  snapPoints?: (string | number)[];

  /** Current snap point */
  currentSnapPoint?: number;

  /** Enable drag handle */
  dragHandle?: boolean;

  /** Drag handle color */
  dragHandleColor?: string;

  /** Enable scroll content */
  scrollable?: boolean;

  /** Snap point change callback */
  onSnapPointChange?: (index: number) => void;
}

export interface GlassHoverCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'content'> {
  /** Trigger element */
  trigger: React.ReactNode;

  /** Card content */
  content: React.ReactNode;

  /** Card position */
  position?: 'top' | 'bottom' | 'left' | 'right' | 'auto';

  /** Enable arrow */
  arrow?: boolean;

  /** Arrow color */
  arrowColor?: string;

  /** Hover delay */
  hoverDelay?: number;

  /** Close delay */
  closeDelay?: number;

  /** Enable click trigger */
  clickTrigger?: boolean;

  /** Enable focus trigger */
  focusTrigger?: boolean;

  /** Card width */
  width?: string | number;

  /** Card max width */
  maxWidth?: string | number;

  /** Card min width */
  minWidth?: string | number;

  /** Enable animations */
  animated?: boolean;

  /** Animation duration */
  animationDuration?: number;

  /** Glass morphism variant */
  glassVariant?: 'frosted' | 'dynamic' | 'clear' | 'tinted' | 'luminous';

  /** Blur strength */
  blurStrength?: 'none' | 'light' | 'standard' | 'heavy';

  /** Custom styles */
  glassStyles?: React.CSSProperties;
}

export interface GlassPopoverProps extends Omit<GlassHoverCardProps, 'trigger'> {
  /** Popover open state */
  open?: boolean;

  /** Popover close callback */
  onClose?: () => void;

  /** Enable controlled mode */
  controlled?: boolean;

  /** Popover trigger */
  trigger?: React.ReactNode;

  /** Enable portal */
  portal?: boolean;

  /** Portal container */
  portalContainer?: HTMLElement | string;

  /** Enable flip positioning */
  flip?: boolean;

  /** Enable shift positioning */
  shift?: boolean;

  /** Offset from trigger */
  offset?: number;
}

export interface GlassTooltipProps extends Omit<GlassHoverCardProps, 'content'> {
  /** Tooltip content */
  content: React.ReactNode | string;

  /** Tooltip variant */
  variant?: 'default' | 'info' | 'success' | 'warning' | 'error';

  /** Tooltip size */
  size?: 'sm' | 'md' | 'lg';

  /** Enable multiline */
  multiline?: boolean;

  /** Maximum width */
  maxWidth?: string | number;

  /** Tooltip placement */
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'auto';

  /** Enable interactive mode */
  interactive?: boolean;

  /** Hide delay */
  hideDelay?: number;

  /** Follow cursor */
  followCursor?: boolean;
}

// Modal state management types
export interface ModalState {
  isOpen: boolean;
  isAnimating: boolean;
  animationPhase: 'entering' | 'entered' | 'exiting' | 'exited';
  triggerElement: HTMLElement | null;
  focusTrapActive: boolean;
  backdropVisible: boolean;
}

export interface ModalActions {
  open: () => void;
  close: () => void;
  toggle: () => void;
  setFocusTrap: (active: boolean) => void;
  setBackdrop: (visible: boolean) => void;
}

export interface ModalContextValue {
  state: ModalState;
  actions: ModalActions;
  config: ModalConfig;
}

export interface ModalConfig {
  variant: GlassModalVariantType;
  size: GlassModalSizeType;
  backdrop: boolean;
  focusTrap: boolean;
  closeOnBackdropClick: boolean;
  closeOnEscape: boolean;
  animated: boolean;
  animationType?: string;
  animationDuration: number;
  glassVariant?: string;
  blurStrength?: string;
}

// Animation types
export interface ModalAnimationConfig {
  /** Enable entrance animation */
  entrance?: boolean;

  /** Entrance animation type */
  entranceType?: 'fadeIn' | 'slideIn' | 'scaleIn' | 'bounceIn';

  /** Entrance duration */
  entranceDuration?: number;

  /** Enable exit animation */
  exit?: boolean;

  /** Exit animation type */
  exitType?: 'fadeOut' | 'slideOut' | 'scaleOut' | 'bounceOut';

  /** Exit duration */
  exitDuration?: number;

  /** Enable backdrop animation */
  backdropAnimation?: boolean;

  /** Backdrop animation duration */
  backdropAnimationDuration?: number;
}

// Accessibility types
export interface ModalAccessibilityConfig {
  /** ARIA label */
  'aria-label'?: string;

  /** ARIA description */
  'aria-describedby'?: string;

  /** ARIA modal */
  'aria-modal'?: boolean;

  /** ARIA hidden */
  'aria-hidden'?: boolean;

  /** Role */
  role?: 'dialog' | 'alertdialog' | 'tooltip';

  /** Focus management */
  autoFocus?: boolean;

  /** Return focus */
  returnFocus?: boolean;

  /** Focus trap */
  focusTrap?: boolean;

  /** Live region */
  liveRegion?: boolean;
}

// Theme integration types
export interface ModalThemeTokens {
  colors: {
    backdrop: string;
    surface: string;
    border: string;
    text: string;
    title: string;
    description: string;
  };
  spacing: {
    padding: Record<string, string>;
    margin: Record<string, string>;
    gap: string;
  };
  effects: {
    borderRadius: string;
    boxShadow: string;
    backdropFilter: Record<string, string>;
    blur: Record<string, string>;
  };
  animations: {
    duration: Record<string, string>;
    easing: string;
  };
}

// Event handler types
export interface ModalEventHandlers {
  onOpen?: () => void;
  onClose?: () => void;
  onBeforeOpen?: () => void;
  onAfterOpen?: () => void;
  onBeforeClose?: () => void;
  onAfterClose?: () => void;
  onBackdropClick?: (event: React.MouseEvent) => void;
  onEscapeKey?: (event: KeyboardEvent) => void;
  onFocusChange?: (focusedElement: HTMLElement) => void;
}

// Ref types
export type GlassModalRef = React.RefObject<HTMLDivElement>;
export type GlassDialogRef = React.RefObject<HTMLDivElement>;
export type GlassDrawerRef = React.RefObject<HTMLDivElement>;
export type GlassBottomSheetRef = React.RefObject<HTMLDivElement>;
export type GlassHoverCardRef = React.RefObject<HTMLDivElement>;
export type GlassPopoverRef = React.RefObject<HTMLDivElement>;
export type GlassTooltipRef = React.RefObject<HTMLDivElement>;

// Compound component types
export interface ModalCompoundComponent {
  Root: React.ComponentType<GlassModalProps>;
  Header: React.ComponentType<React.HTMLAttributes<HTMLDivElement>>;
  Title: React.ComponentType<React.HTMLAttributes<HTMLHeadingElement>>;
  Description: React.ComponentType<React.HTMLAttributes<HTMLParagraphElement>>;
  Content: React.ComponentType<React.HTMLAttributes<HTMLDivElement>>;
  Footer: React.ComponentType<React.HTMLAttributes<HTMLDivElement>>;
  CloseButton: React.ComponentType<React.ButtonHTMLAttributes<HTMLButtonElement>>;
  Backdrop: React.ComponentType<React.HTMLAttributes<HTMLDivElement>>;
}

export interface DialogCompoundComponent extends ModalCompoundComponent {
  Icon: React.ComponentType<{ icon: React.ReactNode }>;
  Actions: React.ComponentType<{ actions: DialogAction[] }>;
}

export interface DrawerCompoundComponent extends ModalCompoundComponent {
  Handle: React.ComponentType<React.HTMLAttributes<HTMLDivElement>>;
}

export interface BottomSheetCompoundComponent extends ModalCompoundComponent {
  Handle: React.ComponentType<React.HTMLAttributes<HTMLDivElement>>;
  SnapPoints: React.ComponentType<{ points: (string | number)[] }>;
}

// All types are already exported with the export keyword above
