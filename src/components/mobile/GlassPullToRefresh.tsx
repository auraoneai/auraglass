import { cn } from '../../lib/utilsComprehensive';
import React, { forwardRef, useState, useRef, useCallback, useEffect } from 'react';
import { OptimizedGlass } from '../../primitives';

export interface GlassPullToRefreshProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Callback when refresh is triggered
   */
  onRefresh: () => Promise<void> | void;
  /**
   * Whether the component is currently refreshing
   */
  refreshing?: boolean;
  /**
   * Pull distance threshold to trigger refresh (in pixels)
   * @default 80
   */
  threshold?: number;
  /**
   * Maximum pull distance (in pixels)
   * @default 120
   */
  maxDistance?: number;
  /**
   * Whether to show the pull indicator
   * @default true
   */
  showIndicator?: boolean;
  /**
   * Custom refresh indicator
   */
  indicator?: React.ReactNode;
  /**
   * Custom loading indicator
   */
  loadingIndicator?: React.ReactNode;
  /**
   * Pull instruction text
   * @default 'Pull to refresh'
   */
  pullText?: string;
  /**
   * Release instruction text
   * @default 'Release to refresh'
   */
  releaseText?: string;
  /**
   * Refreshing text
   * @default 'Refreshing...'
   */
  refreshingText?: string;
  /**
   * Glassmorphism elevation level
   * @default 'level2'
   */
  elevation?: 'level1' | 'level2' | 'level3' | 'level4' | 'level5';
  /**
   * Disable pull to refresh
   * @default false
   */
  disabled?: boolean;
}

const RefreshIcon = ({ rotation }: { rotation: number }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-6 h-6"
    style={{ transform: `rotate(${rotation}deg)`, transition: 'transform 0.2s ease-out' }}
  >
    <path
      d="M21.5 2V8H15.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2.5 22V16H8.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19.13 5.86998C18.29 4.99998 17.27 4.31998 16.14 3.87998C15.01 3.43998 13.79 3.24998 12.56 3.32998C11.33 3.40998 10.14 3.75998 9.07 4.35998C8 4.95998 7.07 5.79998 6.35 6.81998M4.87 18.13C5.71 19 6.73 19.68 7.86 20.12C8.99 20.56 10.21 20.75 11.44 20.67C12.67 20.59 13.86 20.24 14.93 19.64C16 19.04 16.93 18.2 17.65 17.18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SpinnerIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-6 h-6 animate-spin"
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeDasharray="60"
      strokeDashoffset="20"
      opacity="0.5"
    />
  </svg>
);

export const GlassPullToRefresh = forwardRef<HTMLDivElement, GlassPullToRefreshProps>(
  (
    {
      children,
      onRefresh,
      refreshing = false,
      threshold = 80,
      maxDistance = 120,
      showIndicator = true,
      indicator,
      loadingIndicator,
      pullText = 'Pull to refresh',
      releaseText = 'Release to refresh',
      refreshingText = 'Refreshing...',
      elevation = 'level2',
      disabled = false,
      className,
      ...props
    },
    ref
  ) => {
    const [pullDistance, setPullDistance] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(refreshing);

    const containerRef = useRef<HTMLDivElement>(null);
    const startYRef = useRef(0);
    const scrollTopRef = useRef(0);

    useEffect(() => {
      setIsRefreshing(refreshing);
    }, [refreshing]);

    const handleTouchStart = useCallback(
      (event: TouchEvent) => {
        if (disabled || isRefreshing) return;

        const container = containerRef.current;
        if (!container) return;

        scrollTopRef.current = container.scrollTop;

        if (scrollTopRef.current === 0) {
          startYRef.current = event.touches[0].clientY;
          setIsDragging(true);
        }
      },
      [disabled, isRefreshing]
    );

    const handleTouchMove = useCallback(
      (event: TouchEvent) => {
        if (!isDragging || disabled || isRefreshing) return;

        const container = containerRef.current;
        if (!container || container.scrollTop > 0) {
          setIsDragging(false);
          setPullDistance(0);
          return;
        }

        const currentY = event.touches[0].clientY;
        const distance = currentY - startYRef.current;

        if (distance > 0) {
          event.preventDefault();
          const dampedDistance = Math.min(
            maxDistance,
            distance * (1 - distance / (maxDistance * 2))
          );
          setPullDistance(dampedDistance);
        }
      },
      [isDragging, disabled, isRefreshing, maxDistance]
    );

    const handleTouchEnd = useCallback(async () => {
      if (!isDragging) return;

      setIsDragging(false);

      if (pullDistance >= threshold && !disabled && !isRefreshing) {
        setIsRefreshing(true);

        try {
          await onRefresh();
        } catch (error) {
          console.error('Refresh failed:', error);
        } finally {
          setTimeout(() => {
            setIsRefreshing(false);
            setPullDistance(0);
          }, 300);
        }
      } else {
        setPullDistance(0);
      }
    }, [isDragging, pullDistance, threshold, disabled, isRefreshing, onRefresh]);

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      container.addEventListener('touchstart', handleTouchStart, { passive: false });
      container.addEventListener('touchmove', handleTouchMove, { passive: false });
      container.addEventListener('touchend', handleTouchEnd);

      return () => {
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchmove', handleTouchMove);
        container.removeEventListener('touchend', handleTouchEnd);
      };
    }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

    const pullProgress = Math.min(pullDistance / threshold, 1);
    const rotation = pullProgress * 360;
    const opacity = Math.min(pullProgress * 2, 1);
    const scale = 0.5 + pullProgress * 0.5;

    const indicatorContent = isRefreshing
      ? loadingIndicator || <SpinnerIcon />
      : indicator || <RefreshIcon rotation={rotation} />;

    const indicatorText = isRefreshing
      ? refreshingText
      : pullDistance >= threshold
      ? releaseText
      : pullText;

    return (
      <div data-glass-component
        ref={ref}
        className={cn('relative overflow-hidden', className)}
        {...props}
      >
        {showIndicator && (pullDistance > 0 || isRefreshing) && (
          <OptimizedGlass
            elevation={elevation}
            className="absolute left-0 right-0 top-0 z-50 flex items-center justify-center glass-p-4"
            style={{
              transform: `translateY(${isRefreshing ? 0 : pullDistance - 60}px)`,
              opacity: isRefreshing ? 1 : opacity,
              transition: isRefreshing || !isDragging ? 'transform 0.3s ease-out, opacity 0.3s ease-out' : 'none',
            }}
          >
            <div
              className="flex flex-col items-center gap-2"
              style={{
                transform: `scale(${isRefreshing ? 1 : scale})`,
                transition: isRefreshing || !isDragging ? 'transform 0.3s ease-out' : 'none',
              }}
            >
              <div className="glass-text-primary">
                {indicatorContent}
              </div>
              <span className="glass-text-sm glass-text-secondary">
                {indicatorText}
              </span>
            </div>
          </OptimizedGlass>
        )}

        <div
          ref={containerRef}
          className={cn(
            'h-full overflow-auto',
            (isDragging || isRefreshing) && 'overscroll-none'
          )}
          style={{
            transform: `translateY(${isRefreshing ? 60 : 0}px)`,
            transition: isRefreshing ? 'transform 0.3s ease-out' : 'none',
          }}
        >
          {children}
        </div>
      </div>
    );
  }
);

GlassPullToRefresh.displayName = 'GlassPullToRefresh';

export default GlassPullToRefresh;
