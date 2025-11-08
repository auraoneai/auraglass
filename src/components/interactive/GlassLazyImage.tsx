import { cn } from '../../lib/utilsComprehensive';
import {
    AlertCircle,
    Download,
    Eye,
    Heart,
    Image as ImageIcon,
    Loader2,
    Share2,
    ZoomIn
} from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Motion } from '../../primitives';

export interface GlassLazyImageProps {
    /**
     * Image source URL
     */
    src: string;
    /**
     * Low quality placeholder image
     */
    placeholder?: string;
    /**
     * Alt text for the image
     */
    alt?: string;
    /**
     * Image title
     */
    title?: string;
    /**
     * Image width
     */
    width?: number | string;
    /**
     * Image height
     */
    height?: number | string;
    /**
     * CSS object-fit property
     */
    objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
    /**
     * Enable blur placeholder
     */
    blur?: boolean;
    /**
     * Blur intensity (0-10)
     */
    blurIntensity?: number;
    /**
     * Root margin for intersection observer
     */
    rootMargin?: string;
    /**
     * Threshold for intersection observer
     */
    threshold?: number;
    /**
     * Custom loading component
     */
    loadingComponent?: React.ReactNode;
    /**
     * Custom error component
     */
    errorComponent?: React.ReactNode;
    /**
     * Enable click to zoom
     */
    enableZoom?: boolean;
    /**
     * Enable image actions (download, share, etc.)
     */
    enableActions?: boolean;
    /**
     * Show image stats (views, likes)
     */
    showStats?: boolean;
    /**
     * Image statistics
     */
    stats?: {
        views?: number;
        likes?: number;
        downloads?: number;
    };
    /**
     * Image load callback
     */
    onLoad?: () => void;
    /**
     * Image error callback
     */
    onError?: (error: string) => void;
    /**
     * Image click callback
     */
    onClick?: (event: React.MouseEvent) => void;
    /**
     * Custom className
     */
    className?: string;
}

/**
 * GlassLazyImage component
 * Lazy loading image with blur placeholder and performance optimizations
 */
export const GlassLazyImage: React.FC<GlassLazyImageProps> = ({
    src,
    placeholder,
    alt = '',
    title,
    width,
    height,
    objectFit = 'cover',
    blur = true,
    blurIntensity = 5,
    rootMargin = '50px',
    threshold = 0.1,
    loadingComponent,
    errorComponent,
    enableZoom = false,
    enableActions = false,
    showStats = false,
    stats,
    onLoad,
    onError,
    onClick,
    className,
    ...props
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const [showActionsMenu, setShowActionsMenu] = useState(false);
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

    const imgRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    // Handle intersection observer
    useEffect(() => {
        if (!containerRef.current) return;

        observerRef.current = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry.isIntersecting) {
                    setIsInView(true);
                    if (observerRef.current) {
                        observerRef.current.disconnect();
                    }
                }
            },
            { rootMargin, threshold }
        );

        observerRef.current.observe(containerRef.current);

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [rootMargin, threshold]);

    // Handle image load
    const handleLoad = useCallback(() => {
        setIsLoaded(true);
        setIsError(false);

        // Get natural dimensions
        if (imgRef.current) {
            setImageDimensions({
                width: imgRef.current.naturalWidth,
                height: imgRef.current.naturalHeight
            });
        }

        onLoad?.();
    }, [onLoad]);

    // Handle image error
    const handleError = useCallback(() => {
        setIsLoaded(false);
        setIsError(true);
        const errorMsg = 'Failed to load image';
        onError?.(errorMsg);
    }, [onError]);

    // Handle image click
    const handleClick = useCallback((event: React.MouseEvent) => {
        onClick?.(event);
    }, [onClick]);

    // Handle zoom
    const handleZoom = useCallback(() => {
        if (!enableZoom) return;
        // Zoom functionality would be implemented here
        // Could open a modal with zoom controls
    }, [enableZoom]);

    // Handle download
    const handleDownload = useCallback(() => {
        if (!src) return;

        const link = document.createElement('a');
        link.href = src;
        link.download = title || 'image';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, [src, title]);

    // Handle share
    const handleShare = useCallback(async () => {
        if (!src) return;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: title || 'Image',
                    url: src
                });
            } catch (err) {
                console.error('Error sharing:', err);
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(src);
        }
    }, [src, title]);

    // Default loading component
    const defaultLoadingComponent = (
        <Motion preset="fadeIn" className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center gap-2 px-3 py-2 glass-surface-dark/50 backdrop-blur-md glass-radius-full">
                <Loader2 className="w-4 h-4 animate-spin text-primary/80" />
                <span className="text-primary/80 text-sm">Loading...</span>
            </div>
        </Motion>
    );

    // Default error component
    const defaultErrorComponent = (
        <Motion preset="fadeIn" className="absolute inset-0 flex flex-col items-center justify-center glass-surface-dark/20">
            <AlertCircle className="w-8 h-8 text-primary mb-2" />
            <span className="text-primary text-sm">Failed to load image</span>
        </Motion>
    );

    return (
        <Motion data-glass-component
            preset="fadeIn"
            className={cn(
                'relative overflow-hidden group cursor-pointer',
                className
            )}
            style={{
                width: width || 'auto',
                height: height || 'auto'
            }}
            onClick={handleClick}
            ref={containerRef}
            {...props}
        >
            {/* Placeholder/Loading State */}
            {(!isLoaded || !isInView) && (
                <div
                    className="absolute inset-0 glass-surface-subtle/10 flex items-center justify-center"
                    style={{
                        filter: blur ? `blur(${blurIntensity}px)` : 'none'
                    }}
                >
                    {placeholder ? (
                        <img
                            src={placeholder}
                            alt="Loading..."
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="flex items-center justify-center w-full h-full">
                            <ImageIcon className="w-8 h-8 text-primary/40" />
                        </div>
                    )}
                </div>
            )}

            {/* Main Image */}
            {isInView && (
                <Motion
                    preset="fadeIn"
                    className={cn(
                        'w-full h-full transition-opacity duration-300',
                        isLoaded ? 'opacity-100' : 'opacity-0'
                    )}
                >
                    <img
                        ref={imgRef}
                        src={src}
                        alt={alt}
                        className={cn(
                            'w-full h-full transition-all duration-300',
                            objectFit === 'contain' && 'object-contain',
                            objectFit === 'cover' && 'object-cover',
                            objectFit === 'fill' && 'object-fill',
                            objectFit === 'none' && 'object-none',
                            objectFit === 'scale-down' && 'object-scale-down'
                        )}
                        onLoad={handleLoad}
                        onError={handleError}
                        loading="lazy"
                    />
                </Motion>
            )}

            {/* Loading Overlay */}
            {!isLoaded && !isError && isInView && (
                <div className="absolute inset-0">
                    {loadingComponent || defaultLoadingComponent}
                </div>
            )}

            {/* Error Overlay */}
            {isError && (
                <div className="absolute inset-0">
                    {errorComponent || defaultErrorComponent}
                </div>
            )}

            {/* Image Info Overlay */}
            {(title || showStats) && (
                <div className="absolute bottom-0 left-0 right-0 p-3 glass-gradient-primary glass-gradient-primary glass-gradient-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    {title && (
                        <h3 className="text-primary font-medium text-sm mb-1 truncate">
                            {title}
                        </h3>
                    )}

                    {showStats && stats && (
                        <div className="flex items-center gap-3 text-primary/80 text-xs">
                            {stats.views && (
                                <div className="flex items-center gap-1">
                                    <Eye className="w-3 h-3" />
                                    <span>{stats.views}</span>
                                </div>
                            )}

                            {stats.likes && (
                                <div className="flex items-center gap-1">
                                    <Heart className="w-3 h-3" />
                                    <span>{stats.likes}</span>
                                </div>
                            )}

                            {stats.downloads && (
                                <div className="flex items-center gap-1">
                                    <Download className="w-3 h-3" />
                                    <span>{stats.downloads}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Actions Menu */}
            {enableActions && (
                <div className="absolute glass-top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="relative">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowActionsMenu(!showActionsMenu);
                            }}
                            className="p-2 glass-surface-dark/50 backdrop-blur-md glass-radius-full hover:glass-surface-dark/70 transition-colors"
                        >
                            <span className="text-primary text-lg">⋯</span>
                        </button>

                        {/* Actions Dropdown */}
                        {showActionsMenu && (
                            <Motion preset="slideDown" className="absolute top-full right-0 glass-mt-2">
                                <div className="glass-surface-dark/80 backdrop-blur-md glass-radius-lg shadow-xl border border-white/20 glass-min-w-32">
                                    {enableZoom && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleZoom();
                                                setShowActionsMenu(false);
                                            }}
                                            className="w-full text-left px-4 py-3 text-primary/90 hover:glass-surface-subtle/10 transition-colors flex items-center gap-3 first:glass-radius-t-lg"
                                        >
                                            <ZoomIn className="w-4 h-4" />
                                            <span className="text-sm">Zoom</span>
                                        </button>
                                    )}

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDownload();
                                            setShowActionsMenu(false);
                                        }}
                                        className="w-full text-left px-4 py-3 text-primary/90 hover:glass-surface-subtle/10 transition-colors flex items-center gap-3"
                                    >
                                        <Download className="w-4 h-4" />
                                        <span className="text-sm">Download</span>
                                    </button>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleShare();
                                            setShowActionsMenu(false);
                                        }}
                                        className="w-full text-left px-4 py-3 text-primary/90 hover:glass-surface-subtle/10 transition-colors flex items-center gap-3 last:glass-radius-b-lg"
                                    >
                                        <Share2 className="w-4 h-4" />
                                        <span className="text-sm">Share</span>
                                    </button>
                                </div>
                            </Motion>
                        )}
                    </div>
                </div>
            )}

            {/* Image Dimensions Info (dev mode) */}
            {process.env.NODE_ENV === 'development' && imageDimensions.width > 0 && (
                <div className="absolute glass-top-2 left-2 px-2 py-1 glass-surface-dark/50 backdrop-blur-md glass-radius-md text-primary/60 text-xs">
                    {imageDimensions.width} × {imageDimensions.height}
                </div>
            )}
        </Motion>
    );
};

export default GlassLazyImage;
