'use client';

import React, { forwardRef, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';
import { OptimizedGlass } from '../../primitives';
import { Motion } from '../../primitives';
import { createButtonA11y, useA11yId, announceToScreenReader } from '../../utils/a11y';
import type { ConsciousnessFeatures } from '../layout/GlassContainer';
import { usePredictiveEngine, useInteractionRecorder } from '../advanced/GlassPredictiveEngine';
import { useAchievements } from '../advanced/GlassAchievementSystem';
import { useBiometricAdaptation } from '../advanced/GlassBiometricAdaptation';
import { useEyeTracking } from '../advanced/GlassEyeTracking';
import { useSpatialAudio } from '../advanced/GlassSpatialAudio';

export interface FabProps extends ConsciousnessFeatures {
  /**
   * The content of the button
   */
  children: React.ReactNode;

  /**
   * The color of the button
   */
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | 'default';

  /**
   * If true, the button will be disabled
   */
  disabled?: boolean;

  /**
   * The URL to link to when the button is clicked
   */
  href?: string;

  /**
   * The size of the button
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * The variant of the button
   */
  variant?: 'standard' | 'extended' | 'glass';

  /**
   * Callback fired when the button is clicked
   */
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;

  /**
   * The position of the FAB (fixed positioning options)
   */
  position?: 'bottomRight' | 'bottomLeft' | 'topRight' | 'topLeft' | 'center' | 'none';

  /**
   * Tooltip text for the FAB
   */
  tooltip?: string;

  /**
   * If true, the FAB will show a pulse animation
   */
  pulse?: boolean;

  /**
   * Additional CSS class
   */
  className?: string;

  /**
   * If true, glass glow effect will be more intense
   */
  enhanced?: boolean;

  /**
   * Z-index for the FAB
   */
  zIndex?: number;

  /**
   * Type of the button
   */
  type?: 'button' | 'submit' | 'reset';

  /** Controls visibility for entrance/exit animation */
  isVisible?: boolean;

  /** Additional style properties */
  style?: React.CSSProperties;

  /** Prop for disabling animation */
  disableAnimation?: boolean;

  /** Animation configuration */
  animationConfig?: any;

  /** Glass surface intent */
  intent?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  
  /** Glass surface elevation */
  elevation?: 'level1' | 'level2' | 'level3' | 'level4';
  
  /** Performance tier */
  tier?: 'low' | 'medium' | 'high';

  /** Accessible label for the button (required for icon-only buttons) */
  'aria-label'?: string;
  /** ID of element that labels the button */
  'aria-labelledby'?: string;
  /** ID of element(s) that describe the button */
  'aria-describedby'?: string;
  /** Whether button is pressed/active (for toggle buttons) */
  'aria-pressed'?: boolean;
  /** Whether button controls expanded content */
  'aria-expanded'?: boolean;
  /** ID of element controlled by this button */
  'aria-controls'?: string;
  /** Whether button has popup menu or dialog */
  'aria-haspopup'?: boolean | 'false' | 'true' | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
  /** Description text for complex buttons (automatically creates describedby) */
  description?: string;
}

// Get color by name for intent mapping
const getColorIntent = (color: string): 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info' => {
  switch (color) {
    case 'primary':
      return 'primary';
    case 'secondary':
      return 'info';
    case 'success':
      return 'success';
    case 'error':
      return 'danger';
    case 'warning':
      return 'warning';
    case 'info':
      return 'info';
    default:
      return 'neutral';
  }
};

// Get size classes
const getSizeClasses = (size: string, variant: string) => {
  const isExtended = variant === 'extended';

  switch (size) {
    case 'small':
      return {
        width: isExtended ? 'w-auto min-w-20' : 'w-10',
        height: 'h-10',
        padding: isExtended ? 'px-3 py-2' : 'p-0',
        fontSize: 'glass-text-xl',
      };
    case 'large':
      return {
        width: isExtended ? 'w-auto min-w-32' : 'w-16',
        height: 'h-16',
        padding: isExtended ? 'px-5 py-3' : 'p-0',
        fontSize: 'text-3xl',
      };
    default: // medium
      return {
        width: isExtended ? 'w-auto min-w-28' : 'w-14',
        height: 'h-14',
        padding: isExtended ? 'px-4 py-2.5' : 'p-0',
        fontSize: 'glass-text-2xl',
      };
  }
};

// Get position classes
const getPositionClasses = (position: string) => {
  switch (position) {
    case 'bottomRight':
      return 'fixed bottom-4 right-4';
    case 'bottomLeft':
      return 'fixed bottom-4 left-4';
    case 'topRight':
      return 'fixed top-4 right-4';
    case 'topLeft':
      return 'fixed top-4 left-4';
    case 'center':
      return 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
    case 'none':
    default:
      return '';
  }
};

// Get color classes for variants
const getColorClasses = (color: string, variant: string) => {
  if (variant === 'glass') {
    return 'glass-text-primary bg-white/10 backdrop-blur-md border border-white/20';
  }
  
  switch (color) {
    case 'primary':
      return 'bg-primary-500 glass-text-primary hover:bg-primary-600';
    case 'secondary':
      return 'bg-secondary-500 glass-text-primary hover:bg-secondary-600';
    case 'success':
      return 'bg-success-500 glass-text-primary hover:bg-success-600';
    case 'error':
      return 'bg-danger-500 glass-text-primary hover:bg-danger-600';
    case 'warning':
      return 'bg-warning-500 glass-text-primary hover:bg-warning-600';
    case 'info':
      return 'bg-info-500 glass-text-primary hover:bg-info-600';
    default:
      return 'bg-gray-700 glass-text-primary hover:bg-gray-600';
  }
};

// Get pulse animation classes
const getPulseClasses = (pulse: boolean, color: string) => {
  if (!pulse) return '';
  
  const baseClasses = 'animate-pulse-ring';
  
  switch (color) {
    case 'primary':
      return `${baseClasses} ring-primary-400`;
    case 'secondary':
      return `${baseClasses} ring-secondary-400`;
    case 'success':
      return `${baseClasses} ring-success-400`;
    case 'error':
      return `${baseClasses} ring-danger-400`;
    case 'warning':
      return `${baseClasses} ring-warning-400`;
    case 'info':
      return `${baseClasses} ring-info-400`;
    default:
      return `${baseClasses} ring-gray-400`;
  }
};

// Get variant-specific glass props
const getGlassVariantProps = (variant: string, enhanced: boolean) => {
  if (variant === 'glass') {
    return {
      variant: 'frosted' as const,
      intensity: enhanced ? 'ultra' as const : 'strong' as const,
      border: 'glow' as const,
      lighting: 'volumetric' as const,
      caustics: enhanced,
      refraction: enhanced,
    };
  }
  
  return {
    variant: 'clear' as const,
    intensity: 'medium' as const,
    border: 'subtle' as const,
    lighting: 'ambient' as const,
  };
};

// Tooltip component
const TooltipComponent: React.FC<{ 
  tooltip: string; 
  position: string; 
  show: boolean; 
}> = ({ tooltip, position, show }) => {
  const getTooltipPosition = (position: string) => {
    if (position === 'bottomRight' || position === 'bottomLeft') {
      return 'absolute -top-8 left-1/2 -translate-x-1/2';
    }
    if (position === 'topRight' || position === 'topLeft') {
      return 'absolute -bottom-8 left-1/2 -translate-x-1/2';
    }
    return 'absolute -top-8 left-1/2 -translate-x-1/2';
  };
  
  return (
    <span
      className={cn(
        'bg-gray-900/90 glass-text-primary px-2 py-1 glass-radius-md glass-text-xs whitespace-nowrap',
        'pointer-events-none z-50 transition-opacity duration-200',
        getTooltipPosition(position),
        show ? 'opacity-100 visible' : 'opacity-0 invisible'
      )}
    >
      {tooltip}
    </span>
  );
};

// Wrapper component to handle tooltip
const FabWrapper: React.FC<{ 
  position: string; 
  children: React.ReactNode; 
  className?: string; 
}> = ({ position, children, className }) => {
  return (
    <div
      className={cn(
        position === 'none' ? 'relative' : 'static',
        'inline-block',
        className
      )}
    >
      {children}
    </div>
  );
};

/**
 * Fab Component
 *
 * A floating action button (FAB) performs the primary action in an application.
 */
export const Fab = forwardRef<HTMLButtonElement | HTMLAnchorElement, FabProps>((props, ref) => {
  const {
    children,
    color = 'primary',
    disabled = false,
    href,
    size = 'medium',
    variant = 'standard',
    onClick,
    position = 'bottomRight',
    tooltip,
    pulse = false,
    className,
    enhanced = false,
    zIndex = 1050,
    type = 'button',
    isVisible = true,
    animationConfig,
    disableAnimation,
    style,
    intent = 'primary',
    elevation = 'level4',
    tier = 'high',
    description,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    'aria-pressed': ariaPressed,
    'aria-expanded': ariaExpanded,
    'aria-controls': ariaControls,
    'aria-haspopup': ariaHaspopup,
    // Consciousness features
    predictive = false,
    preloadContent = false,
    eyeTracking = false,
    gazeResponsive = false,
    adaptive = false,
    biometricResponsive = false,
    spatialAudio = false,
    audioFeedback = false,
    trackAchievements = false,
    achievementId,
    usageContext = 'fab',
    ...rest
  } = props;

  const fabRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [shouldRender, setShouldRender] = useState(isVisible);
  
  // Consciousness feature hooks - only initialize if features are enabled
  const predictiveEngine = predictive ? usePredictiveEngine() : null;
  const eyeTracker = eyeTracking ? useEyeTracking() : null;
  const biometricAdapter = adaptive ? useBiometricAdaptation() : null;
  const spatialAudioEngine = spatialAudio ? useSpatialAudio() : null;
  const achievementTracker = trackAchievements ? useAchievements() : null;
  const interactionRecorder = (predictive || trackAchievements) ? useInteractionRecorder(`glass-fab-${variant}-${usageContext}`) : null;

  // Generate unique ID for accessibility
  const componentId = useA11yId('glass-fab');
  const descriptionId = description ? useA11yId('glass-fab-desc') : undefined;

  // Handle visibility changes
  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
    } else {
      // Delay hiding to allow exit animation
      const timeout = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isVisible]);

  // Eye tracking effects
  useEffect(() => {
    if (!gazeResponsive || !eyeTracker || !fabRef.current) return;

    const handleGazeEnter = () => {
      if (!disabled) {
        setIsHovered(true);
        
        if (spatialAudioEngine && audioFeedback) {
          spatialAudioEngine.playGlassSound('fab_gaze_enter', {
            x: fabRef.current?.offsetLeft || 0,
            y: fabRef.current?.offsetTop || 0,
            z: 0, // Default z position
          });
        }
      }
    };

    const handleGazeExit = () => {
      setIsHovered(false);
    };

    // Note: Eye tracking event handlers not yet implemented
    // eyeTracker.onGazeEnter?.(fabRef.current, handleGazeEnter);
    // eyeTracker.onGazeLeave?.(fabRef.current, handleGazeExit);

    return () => {
      // Note: Eye tracking cleanup not yet implemented
      // if (fabRef.current) {
      //   eyeTracker.offGazeEnter?.(fabRef.current, handleGazeEnter);
      //   eyeTracker.offGazeLeave?.(fabRef.current, handleGazeExit);
      // }
    };
  }, [gazeResponsive, eyeTracker, disabled, spatialAudioEngine, audioFeedback]);

  // Enhanced interaction tracking
  const handleInteraction = useCallback((event: React.MouseEvent<HTMLElement>) => {
    if (disabled) return;

    setClickCount(prev => prev + 1);

    // Record interaction for predictive learning
    if (interactionRecorder) {
      interactionRecorder.recordClick(event);
    }

    // Play spatial audio feedback
    if (spatialAudioEngine && audioFeedback) {
      spatialAudioEngine.playGlassSound('fab_click_success', {
        x: fabRef.current?.offsetLeft || 0,
        y: fabRef.current?.offsetTop || 0,
        z: 0, // Default z position
      });
    }
    
    // Track achievements
    if (achievementTracker && trackAchievements) {
      achievementTracker.recordAction(achievementId || 'fab_interaction', {
        variant,
        context: usageContext,
        clickCount,
        timestamp: Date.now(),
      });
    }

    // Call original onClick handler
    onClick?.(event as React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>);
  }, [disabled, interactionRecorder, spatialAudioEngine, audioFeedback, achievementTracker, trackAchievements, achievementId, variant, usageContext, clickCount, onClick]);

  // Create accessibility attributes
  const a11yProps = createButtonA11y({
    id: componentId,
    label: ariaLabel,
    description,
    pressed: ariaPressed,
    expanded: ariaExpanded,
    controls: ariaControls,
    haspopup: ariaHaspopup === 'true' ? true : ariaHaspopup === 'false' ? false : (ariaHaspopup as boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog' | undefined),
    disabled: disabled,
    descriptionId,
  });

  // Get computed classes and styles
  const colorIntent = getColorIntent(color);
  const sizeClasses = getSizeClasses(size, variant);
  const positionClasses = getPositionClasses(position);
  const colorClasses = getColorClasses(color, variant);
  const pulseClasses = getPulseClasses(pulse, color);
  const glassVariantProps = getGlassVariantProps(variant, enhanced);

  const baseClasses = cn(
    // Base styles
    'inline-flex items-center justify-center',
    'font-medium cursor-pointer outline-none',
    'select-none box-border transition-all duration-200',
    'will-change-transform',
    // Size classes
    sizeClasses.width,
    sizeClasses.height,
    sizeClasses.padding,
    sizeClasses.fontSize,
    // Position classes
    positionClasses,
    // Shape
    variant === 'extended' ? 'glass-radius-full' : 'glass-radius-full',
    // Color classes (for non-glass variants)
    variant !== 'glass' && colorClasses,
    // Pulse classes
    pulseClasses,
    // Hover and interaction states
    !disabled && 'hover:scale-105 active:scale-95',
    // Disabled state
    disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
    // Visibility animation
    isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75',
    // Consciousness feature styles
    gazeResponsive && isHovered && 'ring-2 ring-blue-400/40 shadow-lg shadow-blue-400/20',
    className
  );

  const combinedStyle = {
    ...style,
    zIndex,
    transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out',
  };

  const Component = href ? 'a' : 'button';

  const fabButton = (
    <Motion
      preset="scaleIn"
      duration={0.3}
      animateOnMount={isVisible}
      animateOnHover={!disabled}
      className="inline-block"
    >
      {variant === 'glass' ? (
        <OptimizedGlass
          intent={intent}
          elevation={elevation}
          tier={tier}
          {...glassVariantProps}
          interactive
          hoverSheen
          liftOnHover
          press
          className={baseClasses}
          style={combinedStyle}
          onClick={handleInteraction}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          ref={(node: HTMLElement | null) => {
            if (typeof ref === 'function') {
              ref(node as any);
            } else if (ref) {
              ref.current = node as any;
            }
            if (fabRef.current !== undefined) {
              (fabRef as any).current = node;
            }
          }}
          {...a11yProps}
          {...rest}
        >
          <span className="relative z-10">
            {children}
          </span>
          {description && (
            <span id={descriptionId} className="sr-only">
              {description}
            </span>
          )}
        </OptimizedGlass>
      ) : (
        <Component
          className={baseClasses}
          style={combinedStyle}
          href={href}
          disabled={disabled}
          onClick={handleInteraction}
          type={href ? undefined : type}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          ref={(node: HTMLElement | null) => {
            if (typeof ref === 'function') {
              ref(node as HTMLButtonElement | HTMLAnchorElement);
            } else if (ref) {
              ref.current = node as HTMLButtonElement | HTMLAnchorElement;
            }
            if (fabRef.current !== undefined) {
              (fabRef as any).current = node;
            }
          }}
          {...a11yProps}
          {...rest}
        >
          {children}
          {description && (
            <span id={descriptionId} className="sr-only">
              {description}
            </span>
          )}
        </Component>
      )}
    </Motion>
  );

  // --- Conditional Rendering Logic ---
  if (!shouldRender) {
    return null;
  }

  if (!tooltip) {
    return fabButton;
  }

  return (
    <FabWrapper position={position}>
      {fabButton}
      <TooltipComponent tooltip={tooltip} position={position} show={isHovered} />
    </FabWrapper>
  );
});

Fab.displayName = 'Fab';

/**
 * GlassFab Component
 *
 * A floating action button with glass morphism styling.
 */
export const GlassFab = forwardRef<HTMLElement, FabProps>((props, ref) => {
  const { 
    className, 
    variant = 'glass', 
    intent = 'primary',
    elevation = 'level4',
    tier = 'high',
    enhanced = true,
    ...rest 
  } = props;

  return (
    <Fab
      ref={ref as React.RefObject<HTMLButtonElement | HTMLAnchorElement>}
      className={cn('glass-fab', className)}
      variant={variant}
      intent={intent}
      elevation={elevation}
      tier={tier}
      enhanced={enhanced}
      {...rest} 
    />
  );
});

GlassFab.displayName = 'GlassFab';

export default Fab;
