'use client';

import { GlassButton } from '../button/GlassButton';

import { cn } from '../../lib/utilsComprehensive';
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import React, { createContext, useContext, useEffect, useState, forwardRef } from 'react';
import { OptimizedGlass } from '../../primitives';
import { Motion } from '../../primitives';
import { useA11yId } from '../../utils/a11y';
import { useMotionPreferenceContext } from '../../contexts/MotionPreferenceContext';
import { ContrastGuard, TextWithContrast } from '@/components/accessibility/ContrastGuard';

export interface ToastData {
    id: string;
    title?: string;
    description?: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
    action?: {
        label: string;
        onClick: () => void;
    };
    onClose?: () => void;
}

export interface GlassToastProps extends ToastData {
    /**
     * Callback when toast is dismissed
     */
    onDismiss?: (id: string) => void;
    /**
     * Custom className
     */
    className?: string;
}

export interface GlassToastProviderProps {
    /**
     * Children
     */
    children: React.ReactNode;
    /**
     * Default toast duration (ms)
     */
    duration?: number;
    /**
     * Maximum number of toasts to show
     */
    maxToasts?: number;
    /**
     * Toast position
     */
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
}

export interface GlassToastViewportProps {
    /**
     * Custom className
     */
    className?: string;
    /**
     * Hotkey to focus viewport
     */
    hotkey?: string[];
}

export interface GlassToastActionProps {
    /**
     * Action content
     */
    children: React.ReactNode;
    /**
     * Action className
     */
    className?: string;
}

// Toast context
const ToastContext = createContext<{
    toasts: ToastData[];
    addToast: (toast: Omit<ToastData, 'id'>) => string;
    removeToast: (id: string) => void;
    updateToast: (id: string, updates: Partial<ToastData>) => void;
} | null>(null);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

/**
 * GlassToast component
 * Individual toast notification
 */
export const GlassToast: React.FC<GlassToastProps> = ({
  // TODO: Integrate ContrastGuard for table cells, list items, badges, card titles, and other text content for WCAG AA compliance

    id,
    title,
    description,
    type = 'info',
    duration = 5000,
    action,
    onClose,
    onDismiss,
    className,
}) => {
    const [isVisible, setIsVisible] = useState(true);
    const [progress, setProgress] = useState(100);
    const [paused, setPaused] = useState(false);

    // Auto-dismiss timer
    useEffect(() => {
        if (duration <= 0) return;

        const interval = setInterval(() => {
            if (paused) return;
            setProgress((prev) => {
                if (prev <= 0) {
                    handleDismiss();
                    return 0;
                }
                return prev - (100 / (duration / 100));
            });
        }, 100);

        return () => clearInterval(interval);
    }, [duration, paused]);

    const handleDismiss = () => {
        setIsVisible(false);
        setTimeout(() => {
            onDismiss?.(id);
            onClose?.();
        }, 300); // Wait for exit animation
    };

    const getTypeStyles = () => {
        switch (type) {
            case 'success':
                return {
                    icon: <CheckCircle className="w-5 h-5 text-primary" />,
                    borderColor: 'border-green-400/30',
                    bgColor: 'bg-green-500/10',
                };
            case 'error':
                return {
                    icon: <AlertCircle className="w-5 h-5 text-primary" />,
                    borderColor: 'border-red-400/30',
                    bgColor: 'bg-red-500/10',
                };
            case 'warning':
                return {
                    icon: <AlertTriangle className="w-5 h-5 text-primary" />,
                    borderColor: 'border-yellow-400/30',
                    bgColor: 'bg-yellow-500/10',
                };
            default:
                return {
                    icon: <Info className="w-5 h-5 text-primary" />,
                    borderColor: 'border-blue-400/30',
                    bgColor: 'bg-blue-500/10',
                };
        }
    };

    const { icon, borderColor, bgColor } = getTypeStyles();

    if (!isVisible) return null;

    return (
        <Motion data-glass-component
            preset="slideRight"
            duration={300}
        >
            <OptimizedGlass
          elevation={'level4'}
          intensity="strong"
          depth={2}
          tint="neutral"
          border="subtle"
          animation="none"
          performanceMode="medium"
          liftOnHover
          
                className={cn(
                    'relative min-w-80 max-w-md glass-p-4 backdrop-blur-md',
                    'border border-white/20 shadow-2xl',
                    bgColor,
                    className
                )}
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
            >
                {/* Progress bar */}
                {duration > 0 && (
                    <div className="absolute top-0 left-0 right-0 h-1 glass-surface-subtle/20 glass-radius-t-lg overflow-hidden">
                        <div
                            className={cn(
                                'h-full transition-all duration-100 ease-linear',
                                borderColor.replace('border-', 'bg-')
                            )}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                )}

                <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="flex-shrink-0 glass-mt-0-5">
                        {icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        {title && (
                            <h4 className="text-primary font-medium text-sm leading-tight mb-1">
                                {title}
                            </h4>
                        )}

                        {description && (
                            <p className="text-primary/80 text-sm leading-relaxed">
                                {description}
                            </p>
                        )}

                        {/* Action */}
                        {action && (
                            <GlassToastAction
                                onClick={action.onClick}
                                className="mt-3"
                            >
                                {action.label}
                            </GlassToastAction>
                        )}
                    </div>

                    {/* Close button */}
                    <GlassButton
                        onClick={handleDismiss}
                        className="flex-shrink-0 p-1 glass-radius-md hover:glass-surface-subtle/10 transition-colors duration-200"
                        aria-label="Close toast"
                    >
                        <X className="w-4 h-4 text-primary/60 hover:text-primary" />
                    </GlassButton>
                </div>
            </OptimizedGlass>
        </Motion>
    );
};

/**
 * GlassToastProvider component
 * Provides toast context and manages toast state
 */
export const GlassToastProvider: React.FC<GlassToastProviderProps> = ({
    children,
    duration = 5000,
    maxToasts = 5,
    position = 'bottom-right',
}) => {
    const [toasts, setToasts] = useState<ToastData[]>([]);

    const addToast = (toast: Omit<ToastData, 'id'>): string => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newToast: ToastData = {
            ...toast,
            id,
            duration: toast.duration ?? duration,
        };

        setToasts((prev) => {
            const updated = [newToast, ...prev];
            return updated.slice(0, maxToasts);
        });

        // Auto-remove after duration
        if (newToast.duration && newToast.duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, newToast.duration);
        }

        return id;
    };

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    const updateToast = (id: string, updates: Partial<ToastData>) => {
        setToasts((prev) =>
            prev.map((toast) =>
                toast.id === id ? { ...toast, ...updates } : toast
            )
        );
    };

    const contextValue = {
        toasts,
        addToast,
        removeToast,
        updateToast,
    };

    return (
        <ToastContext.Provider value={contextValue}>
            {children}
            <GlassToastViewport position={position} />
        </ToastContext.Provider>
    );
};

/**
 * GlassToastViewport component
 * Container for displaying toasts
 */
export const GlassToastViewport: React.FC<GlassToastViewportProps & {
    position?: GlassToastProviderProps['position'];
}> = ({
    className,
    hotkey = ['altKey', 'KeyT'],
    position = 'bottom-right',
}) => {
        const { toasts, removeToast } = useToast();

        // Keyboard shortcut to focus viewport
        useEffect(() => {
            const handleKeyDown = (e: KeyboardEvent) => {
                const shouldFocus = hotkey.every((key) => {
                    if (key === 'altKey') return e.altKey;
                    if (key === 'ctrlKey') return e.ctrlKey;
                    if (key === 'shiftKey') return e.shiftKey;
                    if (key === 'metaKey') return e.metaKey;
                    return e.key === key;
                });

                if (shouldFocus) {
                    // Focus first toast
                    const firstToast = document.querySelector('[data-toast-id]');
                    if (firstToast instanceof HTMLElement) {
                        firstToast.focus();
                    }
                }
            };

            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }, [hotkey]);

        const positionClasses = {
            'top-left': 'top-4 left-4',
            'top-right': 'top-4 right-4',
            'bottom-left': 'bottom-4 left-4',
            'bottom-right': 'bottom-4 right-4',
            'top-center': 'top-4 left-1/2 -translate-x-1/2',
            'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
        };

        return (
            <div
                className={cn(
                    'fixed z-[9999] flex flex-col glass-gap-3 pointer-events-none',
                    positionClasses[position],
                    className
                )}
            >
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        data-toast-id={toast.id}
                        className="pointer-events-auto"
                    >
                        <GlassToast
                            {...toast}
                            onDismiss={removeToast}
                        />
                    </div>
                ))}
            </div>
        );
    };

/**
 * GlassToastAction component
 * Action button for toast
 */
export const GlassToastAction: React.FC<GlassToastActionProps & {
    onClick?: () => void;
}> = ({
    children,
    className,
    onClick,
}) => {
        return (
            <GlassButton
                onClick={onClick}
                className={cn(
                    'inline-flex items-center justify-center glass-px-3 glass-py-1.5',
                    'glass-text-xs font-medium glass-text-primary/90',
                    'bg-black/30 hover:bg-black/40 border border-white/30 hover:border-white/40',
                    'glass-radius-md transition-all duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-white/30',
                    className
                )}
            >
                {children}
            </GlassButton>
        );
    };

/**
 * Hook for creating different types of toasts
 */
export const useToastActions = () => {
    const { addToast } = useToast();

    return {
        success: (title: string, description?: string, options?: Partial<ToastData>) =>
            addToast({ ...options, title, description, type: 'success' }),

        error: (title: string, description?: string, options?: Partial<ToastData>) =>
            addToast({ ...options, title, description, type: 'error' }),

        warning: (title: string, description?: string, options?: Partial<ToastData>) =>
            addToast({ ...options, title, description, type: 'warning' }),

        info: (title: string, description?: string, options?: Partial<ToastData>) =>
            addToast({ ...options, title, description, type: 'info' }),

        custom: (toast: Omit<ToastData, 'id'>) => addToast(toast),
    };
};
