import React from 'react';

import { GlassButton } from '../button/GlassButton';

import { cn } from '../../lib/utilsComprehensive';
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import { OptimizedGlass } from '../../primitives';
import { Motion } from '../../primitives';
import { useA11yId } from '../../utils/a11y';
import { useMotionPreferenceContext } from '../../contexts/MotionPreferenceContext';
import { ContrastGuard, TextWithContrast } from '@/components/accessibility/ContrastGuard';

// Glass Alert text color variants
const alertTextVariants = {
  default: 'text-foreground [&>svg]:text-foreground',
  success: 'text-green-400 [&>svg]:text-green-400',
  warning: 'text-amber-400 [&>svg]:text-amber-400',
  error: 'text-red-400 [&>svg]:text-red-400',
  info: 'text-blue-400 [&>svg]:text-blue-400',
};

// Glass Alert Component
export interface GlassAlertProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Alert variant */
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'destructive';
  /** Alert size */
  size?: 'sm' | 'md' | 'lg';
  /** Glass elevation */
  elevation?: 'level1' | 'level2' | 'level3' | 'level4';
  /** Whether to show default icon */
  showIcon?: boolean;
  /** Custom icon to display */
  icon?: React.ReactNode;
  /** Whether the alert is dismissible */
  dismissible?: boolean;
  /** Callback when alert is dismissed */
  onDismiss?: () => void;
  /** Whether to animate entrance */
  animate?: boolean;
  /** Glass blur effect */
  blur?: 'none' | 'subtle' | 'medium' | 'strong' | 'intense';
  /** Glass animation */
  animation?: 'none' | 'float' | 'pulse' | 'shimmer' | 'breathe' | 'morph' | 'ripple' | 'wave';
  /** Glass border style */
  border?: 'none' | 'subtle' | 'glow' | 'gradient' | 'neon' | 'dynamic' | 'particle';
  /** Glass lighting effect */
  lighting?: 'ambient' | 'directional' | 'volumetric' | 'caustic' | 'iridescent';
  /** Glass intensity */
  intensity?: 'subtle' | 'medium' | 'strong' | 'extreme' | 'ultra';
  /** Performance mode */
  performanceMode?: 'low' | 'medium' | 'high' | 'ultra';
  /** Respect user's motion preferences */
  respectMotionPreference?: boolean;
  /** ARIA live region priority */
  'aria-live'?: 'polite' | 'assertive' | 'off';
}

const GlassAlert = React.forwardRef<HTMLDivElement, GlassAlertProps>(
  ({
    className,
    variant = 'default',
    size = 'md',
    elevation = 'level1',
    showIcon = true,
    icon,
    dismissible = false,
    onDismiss,
    animate = true,
    blur = 'subtle',
    animation = 'none',
    border = 'subtle',
    lighting = 'ambient',
    intensity = 'medium',
    performanceMode = 'medium',
    respectMotionPreference = true,
    'aria-live': ariaLive = 'polite',
    children,
    ...props
  }, ref) => {
    const alertId = useA11yId('alert');
    const { prefersReducedMotion } = useMotionPreferenceContext();
    const [dismissed, setDismissed] = React.useState(false);
    const shouldAnimate = animate && (!respectMotionPreference || !prefersReducedMotion);

    const sizeStyles = {
      sm: 'glass-p-3 glass-text-sm',
      md: 'glass-p-4 glass-text-base',
      lg: 'glass-p-6 glass-text-lg',
    };

    // Get OptimizedGlass intent
    const getGlassIntent = (): 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info' => {
      switch (variant) {
        case 'success':
          return 'success';
        case 'warning':
          return 'warning';
        case 'error':
        case 'destructive':
          return 'danger';
        default:
          return 'neutral';
      }
    };

    // Get default icon based on variant
    const getDefaultIcon = () => {
      switch (variant) {
        case 'success':
          return <CheckCircle className="h-4 w-4" />;
        case 'warning':
          return <AlertTriangle className="h-4 w-4" />;
        case 'error':
        case 'destructive':
          return <AlertCircle className="h-4 w-4" />;
        case 'info':
          return <Info className="h-4 w-4" />;
        default:
          return <Info className="h-4 w-4" />;
      }
    };

    const handleDismiss = () => {
      setDismissed(true);
      onDismiss?.();
    };

    if (dismissed) {
      return null;
    }

    const displayVariant = (variant === 'destructive' ? 'error' : variant) as keyof typeof alertTextVariants;

    const alertContent = (
      <OptimizedGlass
        intent={getGlassIntent()}
        elevation={elevation}
        intensity={intensity}
        depth={2}
        tint="neutral"
        border={border}
        animation={animation}
        performanceMode={performanceMode}
        ref={ref}
        className={cn(
          'relative w-full transition-all duration-200',
          sizeStyles[size],
          alertTextVariants[displayVariant],
          '[&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px]',
          '[&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-current',
          className
        )}
        role="alert"
        aria-live={ariaLive}
        aria-atomic="true"
        id={alertId}
        {...props}
      >
        {/* Icon */}
        {showIcon && (icon || getDefaultIcon())}

        {/* Content */}
        <div className="flex-1">
          {children}
        </div>

        {/* Dismiss button */}
        {dismissible && (
          <GlassButton
            onClick={handleDismiss}
            className={cn(
              'absolute right-4 top-4 glass-radius-md glass-p-1',
              'opacity-70 hover:opacity-100 transition-opacity',
              'focus:outline-none focus:ring-2 focus:ring-current focus:ring-offset-2'
            )}
            aria-label="Dismiss alert"
          >
            <X className="h-4 w-4" />
          </GlassButton>
        )}
      </OptimizedGlass>
    );

    return shouldAnimate ? (
      <Motion preset="slideUp">
        {alertContent}
      </Motion>
    ) : alertContent;
  }
);
GlassAlert.displayName = 'GlassAlert';

// Glass Alert Title
export interface GlassAlertTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Title size variant */
  size?: 'sm' | 'md' | 'lg';
}

const GlassAlertTitle = React.forwardRef<HTMLParagraphElement, GlassAlertTitleProps>(
  ({ className, size = 'md', ...props }, ref) => {
    const sizeConfig = {
      sm: 'glass-text-sm',
      md: 'glass-text-base',
      lg: 'glass-text-lg',
    };

    return (
      <h5
        ref={ref}
        className={cn(
          'glass-alert-title glass-mb-1 font-semibold leading-none tracking-tight',
          sizeConfig[size],
          className
        )}
        {...props}
      />
    );
  }
);
GlassAlertTitle.displayName = 'GlassAlertTitle';

// Glass Alert Description
export interface GlassAlertDescriptionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Description size variant */
  size?: 'xs' | 'sm' | 'md';
}

const GlassAlertDescription = React.forwardRef<HTMLParagraphElement, GlassAlertDescriptionProps>(
  ({ className, size = 'sm', ...props }, ref) => {
    const sizeConfig = {
      xs: 'glass-text-xs',
      sm: 'glass-text-sm',
      md: 'glass-text-base',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'glass-alert-description [&_p]:leading-relaxed opacity-90',
          sizeConfig[size],
          className
        )}
        {...props}
      />
    );
  }
);
GlassAlertDescription.displayName = 'GlassAlertDescription';

// Glass Alert Actions (for action buttons)
export interface GlassAlertActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Actions alignment */
  align?: 'left' | 'right' | 'center';
  /** Actions spacing */
  spacing?: 'sm' | 'md' | 'lg';
}

const GlassAlertActions = React.forwardRef<HTMLDivElement, GlassAlertActionsProps>(
  ({ className, align = 'right', spacing = 'md', ...props }, ref) => {
    const alignConfig = {
      left: 'justify-start',
      right: 'justify-end',
      center: 'justify-center',
    };

    const spacingConfig = {
      sm: 'glass-gap-2 glass-mt-2',
      md: 'glass-gap-3 mt-3',
      lg: 'glass-gap-4 glass-mt-4',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'glass-alert-actions flex items-center',
          alignConfig[align],
          spacingConfig[spacing],
          className
        )}
        {...props}
      />
    );
  }
);
GlassAlertActions.displayName = 'GlassAlertActions';

// Export components
export {
  GlassAlert, GlassAlertActions, GlassAlertDescription, GlassAlertTitle
};

// Re-export with shorter names for easier usage
export {
  GlassAlert as Alert, GlassAlertActions as AlertActions, GlassAlertDescription as AlertDescription, GlassAlertTitle as AlertTitle
};

export default GlassAlert;
