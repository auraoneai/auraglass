'use client';

import { cn } from '../../lib/utilsComprehensive';
import React, { forwardRef } from 'react';
import { OptimizedGlass } from '../../primitives';
import { useA11yId } from '../../utils/a11y';

export interface GlassAvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    /**
     * Avatar variant
     */
    variant?: 'default' | 'circle' | 'square' | 'glass-radius-md';
    /**
     * Avatar size
     */
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    /**
     * Avatar status indicator
     */
    status?: 'online' | 'offline' | 'away' | 'busy';
    /**
     * Show status indicator
     */
    showStatus?: boolean;
    /**
     * Glass elevation
     */
    elevation?: 1 | 2 | 3;
    /**
     * Custom fallback content
     */
    fallback?: React.ReactNode;
    /**
     * Fallback text (will generate initials)
     */
    fallbackText?: string;
    /**
     * ARIA label for the avatar
     */
    'aria-label'?: string;
}

export interface GlassAvatarGroupProps {
    /**
     * Maximum number of avatars to show
     */
    max?: number;
    /**
     * Spacing between avatars
     */
    spacing?: 'tight' | 'normal' | 'loose';
    /**
     * Avatar size for group
     */
    size?: GlassAvatarProps['size'];
    /**
     * Children (GlassAvatar components)
     */
    children: React.ReactNode;
}

export interface GlassAvatarFallbackProps {
    /**
     * Delay before showing fallback (ms)
     */
    delayMs?: number;
    /**
     * Children content
     */
    children: React.ReactNode;
}

/**
 * GlassAvatar component
 * A glassmorphism avatar with status indicators and fallbacks
 */
export const GlassAvatar = forwardRef<HTMLImageElement, GlassAvatarProps>(
    (
        {
            variant = 'circle',
            size = 'md',
            status,
            showStatus = false,
            elevation = 'level1',
            fallback,
            fallbackText,
            'aria-label': ariaLabel,
            className,
            src,
            alt,
            onError,
            ...props
        },
        ref
    ) => {
        const avatarId = useA11yId('avatar');
        const [hasError, setHasError] = React.useState(false);
        const [isLoading, setIsLoading] = React.useState(!!src);

        const sizeClasses = {
            xs: 'w-6 h-6 glass-text-xs',
            sm: 'w-8 h-8 glass-text-sm',
            md: 'w-10 h-10 glass-text-base',
            lg: 'w-12 h-12 glass-text-lg',
            xl: 'w-16 h-16 glass-text-xl',
            '2xl': 'w-20 h-20 glass-text-2xl',
        };

        const variantClasses = {
            default: 'glass-radius-md',
            circle: 'glass-radius-full',
            square: 'rounded-none',
            'glass-radius-md': 'glass-radius-lg',
        };

        const statusColors = {
            online: 'glass-surface-success',
            offline: 'glass-surface-primary',
            away: 'glass-surface-warning',
            busy: 'glass-surface-danger',
        };

        const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
            setHasError(true);
            setIsLoading(false);
            onError?.(e);
        };

        const handleLoad = () => {
            setIsLoading(false);
        };

        // Generate initials from fallback text
        const getInitials = (text: string) => {
            return text
                .split(' ')
                .map((word: any) => word[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);
        };

        const showFallback = hasError || !src;
        const fallbackContent = fallback || (
            fallbackText ? (
                <span className="font-medium text-primary/80">
                    {getInitials(fallbackText)}
                </span>
            ) : (
                <div className="w-4 h-4 glass-surface-subtle/30 glass-radius-md" />
            )
        );

        // Convert numeric elevation to level string
        const getElevationLevel = (elev?: 1 | 2 | 3): 'level1' | 'level2' | 'level3' => {
          if (elev === 1) return 'level1';
          if (elev === 2) return 'level2';
          if (elev === 3) return 'level3';
          return 'level1'; // default
        };

        return (
            <div className="relative inline-block">
                <OptimizedGlass
          elevation={elevation === 1 ? 'level1' : elevation === 2 ? 'level2' : elevation === 3 ? 'level3' : 'level1'}
          intensity="medium"
          depth={2}
          tint="neutral"
          border="subtle"
          animation="none"
          performanceMode="medium"
          
                    id={avatarId}

                    className={cn(
                        'relative overflow-hidden',
                        sizeClasses[size],
                        variantClasses[variant],
                        'backdrop-blur-md bg-white/10 border border-white/20',
                        className
                    )}
                    role="img"
                    aria-label={ariaLabel || alt || (fallbackText ? `Avatar for ${fallbackText}` : 'Avatar')}
                >
                    {showFallback ? (
                        <div className="flex items-center justify-center w-full h-full">
                            {fallbackContent}
                        </div>
                    ) : (
                        <img
                            ref={ref}
                            src={src}
                            alt={alt || (ariaLabel ? '' : 'Avatar image')}
                            onError={handleError}
                            onLoad={handleLoad}
                            className="w-full h-full object-cover"
                            {...props}
                        />
                    )}

                    {isLoading && !hasError && (
                        <div className="absolute inset-0 flex items-center justify-center glass-surface-dark/20">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white/60 glass-radius-full animate-spin" />
                        </div>
                    )}
                </OptimizedGlass>

                {showStatus && status && (
                    <div
                        className={cn(
                            'absolute bottom-0 right-0 w-3 h-3 glass-radius-full border-2 border-white',
                            statusColors[status]
                        )}
                        role="status"
                        aria-label={`Status: ${status}`}
                    />
                )}
            </div>
        );
    }
);

GlassAvatar.displayName = 'GlassAvatar';

/**
 * GlassAvatarGroup component
 * Groups multiple avatars with overlap and max display
 */
export const GlassAvatarGroup: React.FC<GlassAvatarGroupProps> = ({
    max = 5,
    spacing = 'normal',
    size = 'md',
    children,
}) => {
    const childArray = React.Children.toArray(children);
    const visibleCount = Math.min(childArray.length, max);
    const hasOverflow = childArray.length > max;

    const spacingClasses = {
        tight: '-glass-gap-1',
        normal: '-glass-gap-2',
        loose: '-glass-gap-3',
    };

    return (
        <div className={cn('flex items-center', spacingClasses[spacing])}>
            {childArray.slice(0, visibleCount).map((child, index) => (
                <div key={index} className="relative">
                    {React.cloneElement(child as React.ReactElement, {
                        size,
                        elevation: 'level2',
                    })}
                </div>
            ))}

            {hasOverflow && (
                <div className="relative">
                    <GlassAvatar
                        size={size}
                        elevation={2}
                        fallback={
                            <span className="font-medium text-primary/60 text-xs">
                                +{childArray.length - max}
                            </span>
                        }
                    />
                </div>
            )}
        </div>
    );
};

/**
 * GlassAvatarFallback component
 * Shows fallback content with optional delay
 */
export const GlassAvatarFallback: React.FC<GlassAvatarFallbackProps> = ({
    delayMs = 0,
    children,
}) => {
    const [showFallback, setShowFallback] = React.useState(delayMs === 0);

    React.useEffect(() => {
        if (delayMs > 0) {
            const timer = setTimeout(() => setShowFallback(true), delayMs);
            return () => clearTimeout(timer);
        }
    }, [delayMs]);

    if (!showFallback) {
        return (
            <div className="w-full h-full flex items-center justify-center glass-surface-dark/10">
                <div className="w-3 h-3 border border-white/30 border-t-white/60 glass-radius-full animate-spin" />
            </div>
        );
    }

    return <>{children}</>;
};
