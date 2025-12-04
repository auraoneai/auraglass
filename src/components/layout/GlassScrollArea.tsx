'use client';
import { cn } from "../../lib/utilsComprehensive";
import React, { forwardRef, useEffect, useRef, useState } from "react";
import { OptimizedGlass } from "../../primitives";
import { useA11yId } from "@/utils/a11y";
import { useMotionPreferenceContext } from "@/contexts/MotionPreferenceContext";
import {
  ContrastGuard,
  TextWithContrast,
} from "@/components/accessibility/ContrastGuard";

export interface GlassScrollAreaProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onScroll"> {
  /**
   * Scroll area content
   */
  children: React.ReactNode;
  /**
   * Maximum height
   */
  maxHeight?: string | number;
  /**
   * Maximum width
   */
  maxWidth?: string | number;
  /**
   * Scroll direction
   */
  direction?: "vertical" | "horizontal" | "both";
  /**
   * Show scrollbars
   */
  showScrollbars?: "always" | "hover" | "auto" | "never";
  /**
   * Scrollbar size
   */
  scrollbarSize?: "sm" | "md" | "lg";
  /**
   * Scrollbar position
   */
  scrollbarPosition?: "inside" | "outside";
  /**
   * Custom scrollbar styling
   */
  scrollbarClassName?: string;
  /**
   * Callback when scroll position changes
   */
  onScroll?: (scrollTop: number, scrollLeft: number) => void;
  /**
   * Enable smooth scrolling
   */
  smoothScrolling?: boolean;
  /**
   * Whether to respect user's motion preferences
   */
  respectMotionPreference?: boolean;
  /**
   * Accessibility label for screen readers
   */
  "aria-label"?: string;
  /**
   * Accessibility role for semantic meaning
   */
  role?: string;
}

export interface GlassScrollBarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Scrollbar orientation
   */
  orientation: "vertical" | "horizontal";
  /**
   * Scrollbar size
   */
  size?: "sm" | "md" | "lg";
  /**
   * Show scrollbar thumb
   */
  showThumb?: boolean;
  /**
   * Whether to respect user's motion preferences
   */
  respectMotionPreference?: boolean;
}

/**
 * GlassScrollArea component
 * A glassmorphism scrollable area with custom scrollbars
 */
export const GlassScrollArea = forwardRef<HTMLDivElement, GlassScrollAreaProps>(
  (
    {
      // TODO: Integrate ContrastGuard for any section titles, labels, and helper text for WCAG AA compliance

      children,
      maxHeight = "200px",
      maxWidth,
      direction = "vertical",
      showScrollbars = "auto",
      scrollbarSize = "md",
      scrollbarPosition = "inside",
      scrollbarClassName,
      className,
      onScroll,
      smoothScrolling = false,
      respectMotionPreference = true,
      "aria-label": ariaLabel = "Scrollable content area",
      role = "region",
      ...props
    },
    ref
  ) => {
    const [scrollTop, setScrollTop] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    const [contentHeight, setContentHeight] = useState(0);
    const [contentWidth, setContentWidth] = useState(0);
    const [containerHeight, setContainerHeight] = useState(0);
    const [containerWidth, setContainerWidth] = useState(0);

    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const scrollAreaId = useA11yId();
    const { prefersReducedMotion, isMotionSafe } = useMotionPreferenceContext();
    const shouldRespectMotion =
      respectMotionPreference && !prefersReducedMotion && isMotionSafe;

    // Update dimensions when content changes
    useEffect(() => {
      const updateDimensions = () => {
        if (containerRef.current && contentRef.current) {
          const containerRect = containerRef.current.getBoundingClientRect();
          const contentRect = contentRef.current.getBoundingClientRect();

          setContainerHeight(containerRect.height);
          setContainerWidth(containerRect.width);
          setContentHeight(contentRect.height);
          setContentWidth(contentRect.width);
        }
      };

      updateDimensions();

      const resizeObserver = new ResizeObserver(updateDimensions);
      if (containerRef.current) resizeObserver.observe(containerRef.current);
      if (contentRef.current) resizeObserver.observe(contentRef.current);

      return () => resizeObserver.disconnect();
    }, [children]);

    const [scrollActive, setScrollActive] = useState(false);
    const scrollTimer = useRef<any>(null);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.target as HTMLDivElement;
      const newScrollTop = target.scrollTop;
      const newScrollLeft = target.scrollLeft;

      setScrollTop(newScrollTop);
      setScrollLeft(newScrollLeft);
      onScroll?.(newScrollTop, newScrollLeft);

      setScrollActive(true);
      if (scrollTimer.current) clearTimeout(scrollTimer.current);
      scrollTimer.current = setTimeout(() => setScrollActive(false), 200);
    };

    const shouldShowScrollbars = () => {
      switch (showScrollbars) {
        case "always":
          return true;
        case "never":
          return false;
        case "hover":
          return isHovering;
        case "auto":
        default:
          return (
            (direction === "vertical" && contentHeight > containerHeight) ||
            (direction === "horizontal" && contentWidth > containerWidth) ||
            (direction === "both" &&
              (contentHeight > containerHeight ||
                contentWidth > containerWidth))
          );
      }
    };

    const scrollbarSizeClasses = {
      sm: "w-1 h-1",
      md: "w-2 h-2",
      lg: "w-3 h-3",
    };

    const getOverflowStyle = (): React.CSSProperties => {
      switch (direction) {
        case "vertical":
          return { overflowX: "hidden", overflowY: "auto" };
        case "horizontal":
          return { overflowX: "auto", overflowY: "hidden" };
        case "both":
        default:
          return { overflowX: "auto", overflowY: "auto" };
      }
    };

    const isAtTop = scrollTop <= 0;
    const isAtBottom = contentHeight - containerHeight - scrollTop <= 1;

    return (
      <OptimizedGlass
        ref={ref}
        id={scrollAreaId}
        intent="neutral"
        elevation="level1"
        intensity="medium"
        depth={2}
        tint="neutral"
        border="subtle"
        animation={shouldRespectMotion ? "shimmer" : "none"}
        performanceMode="medium"
        role={role}
        aria-label={ariaLabel}
        className={cn(
          "relative glass-backdrop-blur-md ring-1 ring-white/10 bg-white/5",
          scrollbarPosition === "outside" && "glass-p-2",
          smoothScrolling && "scroll-smooth",
          // Motion preferences
          shouldRespectMotion &&
            "motion-safe:transition-all motion-reduce:transition-none",
          className
        )}
        style={{
          maxHeight:
            typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight,
          maxWidth: typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth,
        }}
        {...props}
      >
        <div
          ref={containerRef}
          className={cn(
            "relative overflow-hidden",
            scrollbarPosition === "inside" && "glass-radius-lg"
          )}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Content */}
          <div
            ref={contentRef}
            className='glass-relative'
            style={getOverflowStyle()}
            onScroll={handleScroll}
          >
            {children}
          </div>

          {/* Edge fades */}
          {direction !== "horizontal" && (
            <>
              {!isAtTop && (
                <div
                  className={cn(
                    "pointer-events-none absolute top-0 left-0 right-0 h-6 bg-gradient-to-b to-transparent",
                    scrollActive ? "from-blue-400/20" : "from-black/20"
                  )}
                />
              )}
              {!isAtBottom && (
                <div
                  className={cn(
                    "pointer-events-none absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t to-transparent",
                    scrollActive ? "from-blue-400/20" : "from-black/20"
                  )}
                />
              )}
            </>
          )}

          {/* Custom Scrollbars */}
          {shouldShowScrollbars() && (
            <>
              {/* Vertical Scrollbar */}
              {direction !== "horizontal" &&
                contentHeight > containerHeight && (
                  <GlassScrollBar
                    orientation="vertical"
                    size={scrollbarSize}
                    className={scrollbarClassName}
                    showThumb={true}
                  />
                )}

              {/* Horizontal Scrollbar */}
              {direction !== "vertical" && contentWidth > containerWidth && (
                <GlassScrollBar
                  orientation="horizontal"
                  size={scrollbarSize}
                  className={scrollbarClassName}
                  showThumb={true}
                />
              )}
            </>
          )}
        </div>
      </OptimizedGlass>
    );
  }
);

GlassScrollArea.displayName = "GlassScrollArea";

/**
 * GlassScrollBar component
 * Custom scrollbar with glassmorphism styling
 */
export const GlassScrollBar = forwardRef<HTMLDivElement, GlassScrollBarProps>(
  (
    {
      orientation,
      size = "md",
      className,
      showThumb = true,
      respectMotionPreference = true,
      ...props
    },
    ref
  ) => {
    const [isDragging, setIsDragging] = useState(false);
    const [thumbPosition, setThumbPosition] = useState(0);
    const [thumbSize, setThumbSize] = useState(50);

    const internalRef = useRef<HTMLDivElement>(null);
    const scrollbarRef = ref || internalRef;

    // Handle ref access safely for both function and object refs
    const getScrollbarElement = () => {
      if (typeof scrollbarRef === "function") {
        return null; // Function refs don't have current property
      }
      return scrollbarRef.current;
    };
    const thumbRef = useRef<HTMLDivElement>(null);
    const { prefersReducedMotion, isMotionSafe } = useMotionPreferenceContext();
    const shouldRespectMotion =
      respectMotionPreference && !prefersReducedMotion && isMotionSafe;

    // Calculate thumb position and size based on scroll
    useEffect(() => {
      const updateThumb = () => {
        const scrollbarElement = getScrollbarElement();
        if (!scrollbarElement?.parentElement) return;

        const container = scrollbarElement.parentElement;
        const content = container.firstElementChild as HTMLElement;

        if (!content) return;

        const containerSize =
          orientation === "vertical"
            ? container.clientHeight
            : container.clientWidth;

        const contentSize =
          orientation === "vertical"
            ? content.scrollHeight
            : content.scrollWidth;

        const scrollPosition =
          orientation === "vertical" ? content.scrollTop : content.scrollLeft;

        // Calculate thumb size
        const newThumbSize = Math.max(
          30,
          (containerSize / contentSize) * containerSize
        );
        setThumbSize(newThumbSize);

        // Calculate thumb position
        const maxScroll = contentSize - containerSize;
        const maxThumbTravel = containerSize - newThumbSize;
        const newThumbPosition =
          maxScroll > 0 ? (scrollPosition / maxScroll) * maxThumbTravel : 0;

        setThumbPosition(newThumbPosition);
      };

      const container = getScrollbarElement()?.parentElement;
      if (container) {
        updateThumb();
        container.addEventListener("scroll", updateThumb);
        return () => container.removeEventListener("scroll", updateThumb);
      }
    }, [orientation]);

    const handleMouseDown = (e: React.MouseEvent) => {
      setIsDragging(true);
      e.preventDefault();
    };

    useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
        const scrollbarElement = getScrollbarElement();
        if (!isDragging || !scrollbarElement?.parentElement) return;

        const container = scrollbarElement.parentElement;
        const content = container.firstElementChild as HTMLElement;
        const rect = scrollbarElement.getBoundingClientRect();

        const clickPosition =
          orientation === "vertical"
            ? e.clientY - rect.top
            : e.clientX - rect.left;

        const containerSize =
          orientation === "vertical"
            ? container.clientHeight
            : container.clientWidth;

        const contentSize =
          orientation === "vertical"
            ? content.scrollHeight
            : content.scrollWidth;

        const scrollRatio = clickPosition / containerSize;
        const newScrollPosition = scrollRatio * (contentSize - containerSize);

        if (orientation === "vertical") {
          content.scrollTop = Math.max(
            0,
            Math.min(newScrollPosition, contentSize - containerSize)
          );
        } else {
          content.scrollLeft = Math.max(
            0,
            Math.min(newScrollPosition, contentSize - containerSize)
          );
        }
      };

      const handleMouseUp = () => {
        setIsDragging(false);
      };

      if (isDragging) {
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
      }

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }, [isDragging, orientation]);

    const scrollbarClasses =
      orientation === "vertical"
        ? "absolute right-0 top-0 bottom-0 w-6"
        : "absolute bottom-0 left-0 right-0 h-6";

    const thumbClasses =
      orientation === "vertical"
        ? "absolute right-1 glass-radius-full cursor-pointer"
        : "absolute bottom-1 glass-radius-full cursor-pointer";

    return (
      <div
        ref={scrollbarRef}
        className={cn(
          scrollbarClasses,
          "pointer-events-auto",
          // Motion preferences
          shouldRespectMotion &&
            "motion-safe:transition-all motion-reduce:transition-none",
          className
        )}
        onMouseDown={handleMouseDown}
        {...props}
      >
        {/* Track */}
        <div
          className={cn(
            "absolute bg-white/10 glass-radius-full transition-all duration-200",
            orientation === "vertical"
              ? "right-1 top-1 bottom-1 w-1 hover:w-2"
              : "bottom-1 left-1 right-1 h-1 hover:h-2"
          )}
        />

        {/* Thumb */}
        {showThumb && (
          <div
            ref={thumbRef}
            className={cn(
              thumbClasses,
              "glass-backdrop-blur-md bg-white/30 border border-white/20",
              shouldRespectMotion
                ? "hover:bg-white/40 transition-all duration-200"
                : "hover:bg-white/40",
              isDragging && "bg-white/50 scale-110",
              size === "sm" && "w-1 h-4",
              size === "md" && "w-2 h-6",
              size === "lg" && "w-3 h-8"
            )}
            style={{
              [orientation === "vertical" ? "top" : "left"]:
                `${thumbPosition}px`,
              [orientation === "vertical" ? "height" : "width"]:
                `${thumbSize}px`,
            }}
          />
        )}
      </div>
    );
  }
);

GlassScrollBar.displayName = "GlassScrollBar";

/**
 * Hook for managing scroll area state
 */
export const useScrollArea = () => {
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isAtTop, setIsAtTop] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isAtLeft, setIsAtLeft] = useState(true);
  const [isAtRight, setIsAtRight] = useState(false);

  const handleScroll = (newScrollTop: number, newScrollLeft: number) => {
    setScrollTop(newScrollTop);
    setScrollLeft(newScrollLeft);

    // Update boundary states (these would need to be calculated based on content/container sizes)
    setIsAtTop(newScrollTop === 0);
    setIsAtLeft(newScrollLeft === 0);
    // Note: isAtBottom and isAtRight would need container/content dimensions
  };

  const scrollToTop = () => {
    const container = document.querySelector("[data-scroll-area]");
    if (container) {
      container.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const scrollToBottom = () => {
    const container = document.querySelector("[data-scroll-area]");
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    }
  };

  return {
    scrollTop,
    scrollLeft,
    isAtTop,
    isAtBottom,
    isAtLeft,
    isAtRight,
    handleScroll,
    scrollToTop,
    scrollToBottom,
  };
};