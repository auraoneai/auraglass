"use client";
import React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useEnhancedPerformance } from "./useEnhancedPerformance";

export interface IntersectionOptions {
  threshold?: number | number[];
  rootMargin?: string;
  root?: Element | null;
  triggerOnce?: boolean;
  skip?: boolean;
  delay?: number;
}

export interface IntersectionState {
  isIntersecting: boolean;
  intersectionRatio: number;
  boundingClientRect: DOMRectReadOnly | null;
  rootBounds: DOMRectReadOnly | null;
  target: Element | null;
  hasIntersected: boolean;
}

/**
 * Enhanced intersection observer hook with performance optimizations
 */
export function useGlassIntersection(
  options: IntersectionOptions = {}
): [React.RefObject<HTMLElement>, IntersectionState] {
  const {
    threshold = 0.1,
    rootMargin = "0px",
    root = null,
    triggerOnce = false,
    skip = false,
    delay = 0,
  } = options;

  const [state, setState] = useState<IntersectionState>({
    isIntersecting: false,
    intersectionRatio: 0,
    boundingClientRect: null,
    rootBounds: null,
    target: null,
    hasIntersected: false,
  });

  const ref = useRef<HTMLElement>(null);
  const observerRef = useRef<IntersectionObserver>();
  const timeoutRef = useRef<NodeJS.Timeout>();
  const { performanceMode } = useEnhancedPerformance();

  // Performance-aware threshold adjustment
  const adaptiveThreshold = Array.isArray(threshold)
    ? threshold
    : performanceMode === "low"
      ? Math.max(threshold, 0.25) // Higher threshold for low-end devices
      : threshold;

  // Performance-aware root margin adjustment
  const adaptiveRootMargin =
    performanceMode === "low"
      ? "0px" // No preloading for low-end devices
      : rootMargin;

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];

      const updateState = () => {
        setState((prevState) => {
          const newState: IntersectionState = {
            isIntersecting: entry.isIntersecting,
            intersectionRatio: entry.intersectionRatio,
            boundingClientRect: entry.boundingClientRect,
            rootBounds: entry.rootBounds,
            target: entry.target,
            hasIntersected: prevState.hasIntersected || entry.isIntersecting,
          };

          return newState;
        });

        // Disconnect observer if triggerOnce and has intersected
        if (triggerOnce && entry.isIntersecting && observerRef.current) {
          observerRef.current.disconnect();
        }
      };

      // Apply delay if specified
      if (delay > 0 && entry.isIntersecting) {
        timeoutRef.current = setTimeout(updateState, delay);
      } else {
        updateState();
      }
    },
    [triggerOnce, delay]
  );

  // Set up intersection observer
  useEffect(() => {
    if (skip || !ref.current) return;

    // Clean up existing observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create new observer
    try {
      observerRef.current = new IntersectionObserver(handleIntersection, {
        threshold: adaptiveThreshold,
        rootMargin: adaptiveRootMargin,
        root,
      });

      observerRef.current.observe(ref.current);
    } catch {
      // Fallback: assume element is visible
      setState((prev: any) => ({
        ...prev,
        isIntersecting: true,
        hasIntersected: true,
      }));
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [skip, handleIntersection, adaptiveThreshold, adaptiveRootMargin, root]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [ref, state];
}

/**
 * Hook for lazy loading images with intersection observer
 */
export function useGlassLazyImage(
  src: string,
  options: IntersectionOptions & {
    placeholder?: string;
    lowQualitySrc?: string;
    webpSrc?: string;
    avifSrc?: string;
  } = {}
): {
  ref: React.RefObject<HTMLImageElement>;
  currentSrc: string;
  isLoading: boolean;
  isLoaded: boolean;
  error: string | null;
} {
  const {
    placeholder,
    lowQualitySrc,
    webpSrc,
    avifSrc,
    ...intersectionOptions
  } = options;

  const [elementRef, { isIntersecting, hasIntersected }] = useGlassIntersection(
    {
      triggerOnce: true,
      ...intersectionOptions,
    }
  );

  const [currentSrc, setCurrentSrc] = useState(
    placeholder || lowQualitySrc || ""
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { performanceMode, metrics } = useEnhancedPerformance();

  const imageRef = useRef<HTMLImageElement>(null);

  // Determine best image format based on performance
  const getBestImageSrc = useCallback(() => {
    const networkSpeed = metrics?.networkSpeed || "4g";

    // Use low quality for slow networks or low performance mode
    if (
      performanceMode === "low" ||
      networkSpeed === "2g" ||
      networkSpeed === "slow-2g"
    ) {
      return lowQualitySrc || src;
    }

    // Use modern formats for fast networks and high performance
    if (
      performanceMode === "high" &&
      (networkSpeed === "4g" || networkSpeed === "5g")
    ) {
      if (avifSrc && CSS.supports("image-format", "avif")) {
        return avifSrc;
      }
      if (webpSrc && CSS.supports("image-format", "webp")) {
        return webpSrc;
      }
    }

    return src;
  }, [src, lowQualitySrc, webpSrc, avifSrc, performanceMode, metrics]);

  // Load image when intersecting
  useEffect(() => {
    if (!isIntersecting && !hasIntersected) return;

    const loadImage = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const targetSrc = getBestImageSrc();
        const img = new Image();

        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error("Image failed to load"));
          img.src = targetSrc;
        });

        setCurrentSrc(targetSrc);
        setIsLoaded(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load image");
        setCurrentSrc(src); // Fallback to original
      } finally {
        setIsLoading(false);
      }
    };

    loadImage();
  }, [isIntersecting, hasIntersected, getBestImageSrc, src]);

  return {
    ref: imageRef,
    currentSrc,
    isLoading,
    isLoaded,
    error,
  };
}

/**
 * Hook for animating elements on intersection
 */
export function useGlassIntersectionAnimation(
  animationClass: string = "animate-fade-in",
  options: IntersectionOptions = {}
): [React.RefObject<HTMLElement>, boolean] {
  const [ref, { isIntersecting, hasIntersected }] = useGlassIntersection({
    threshold: 0.1,
    triggerOnce: true,
    ...options,
  });

  const shouldAnimate = isIntersecting || hasIntersected;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (shouldAnimate) {
      element.classList.add(animationClass);
    } else {
      element.classList.remove(animationClass);
    }
  }, [shouldAnimate, animationClass]);

  return [ref, shouldAnimate];
}

/**
 * Hook for progressive content loading
 */
export function useProgressiveLoading<T>(
  items: T[],
  options: {
    batchSize?: number;
    delay?: number;
    threshold?: number;
  } = {}
): {
  visibleItems: T[];
  isLoading: boolean;
  loadedCount: number;
  totalCount: number;
  loadNext: () => void;
  loadAll: () => void;
  scrollRef: React.RefObject<HTMLElement>;
} {
  const { batchSize = 10, delay = 100, threshold = 0.8 } = options;

  const [loadedCount, setLoadedCount] = useState(batchSize);
  const [isLoading, setIsLoading] = useState(false);
  const { performanceMode } = useEnhancedPerformance();

  // Adjust batch size based on performance
  const adaptiveBatchSize =
    performanceMode === "low"
      ? Math.max(1, Math.floor(batchSize / 2))
      : performanceMode === "high"
        ? batchSize * 2
        : batchSize;

  const visibleItems = items.slice(0, loadedCount);

  const loadNext = useCallback(async () => {
    if (isLoading || loadedCount >= items.length) return;

    setIsLoading(true);

    // Simulate loading delay for better UX
    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    setLoadedCount((prev: any) =>
      Math.min(items.length, prev + adaptiveBatchSize)
    );
    setIsLoading(false);
  }, [isLoading, loadedCount, items.length, delay, adaptiveBatchSize]);

  const loadAll = useCallback(() => {
    setLoadedCount(items.length);
    setIsLoading(false);
  }, [items.length]);

  // Auto-load more when scrolled near bottom
  const [scrollRef] = useGlassIntersection({
    threshold: threshold,
    rootMargin: "100px",
  });

  return {
    visibleItems,
    isLoading,
    loadedCount,
    totalCount: items.length,
    loadNext,
    loadAll,
    scrollRef,
  };
}
