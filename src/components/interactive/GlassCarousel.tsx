'use client';
import { cn } from "../../lib/utilsComprehensive";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Pause,
  Play,
} from "lucide-react";
import React, {
  Children,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
  forwardRef,
} from "react";
import { Motion } from "../../primitives";
import { GlassButton } from "../button";
import { CardContent, GlassCard } from "../card";
import {
  usePredictiveEngine,
  useInteractionRecorder,
} from "../advanced/GlassPredictiveEngine";
import { useAchievements } from "../advanced/GlassAchievementSystem";
import { useBiometricAdaptation } from "../advanced/GlassBiometricAdaptation";
import { useEyeTracking } from "../advanced/GlassEyeTracking";
import { useSpatialAudio } from "../advanced/GlassSpatialAudio";
import type { ConsciousnessFeatures } from "../layout/GlassContainer";

export interface CarouselItem {
  id: string;
  content: ReactNode;
  title?: string;
  description?: string;
  image?: string;
}

export interface GlassCarouselProps
  extends React.HTMLAttributes<HTMLDivElement>,
    ConsciousnessFeatures {
  /**
   * Carousel items or children
   */
  children?: ReactNode;
  items?: CarouselItem[];
  /**
   * Initial active slide index
   */
  initialIndex?: number;
  /**
   * Number of slides to show at once
   */
  slidesToShow?: number;
  /**
   * Number of slides to scroll at once
   */
  slidesToScroll?: number;
  /**
   * Enable infinite loop
   */
  infinite?: boolean;
  /**
   * Enable auto-play
   */
  autoPlay?: boolean;
  /**
   * Auto-play interval in milliseconds
   */
  autoPlayInterval?: number;
  /**
   * Show navigation arrows
   */
  showArrows?: boolean;
  /**
   * Show navigation dots
   */
  showDots?: boolean;
  /**
   * Show slide indicators
   */
  showIndicators?: boolean;
  /**
   * Enable swipe gestures
   */
  enableSwipe?: boolean;
  /**
   * Enable keyboard navigation
   */
  enableKeyboard?: boolean;
  /**
   * Animation duration in milliseconds
   */
  animationDuration?: number;
  /**
   * Pause auto-play on hover
   */
  pauseOnHover?: boolean;
  /**
   * Carousel height
   */
  height?: string | number;
  /**
   * Gap between slides
   */
  gap?: string | number;
  /**
   * Show fullscreen toggle
   */
  showFullscreen?: boolean;
  /**
   * Slide change callback
   */
  onSlideChange?: (index: number) => void;
  /**
   * Custom arrow components
   */
  customPrevArrow?: ReactNode;
  customNextArrow?: ReactNode;
}

/**
 * GlassCarousel component
 * A flexible carousel/slider with smooth animations and multiple display modes
 */
export const GlassCarousel = forwardRef<HTMLDivElement, GlassCarouselProps>(
  (
    {
      children,
      items = [],
      initialIndex = 0,
      slidesToShow = 1,
      slidesToScroll = 1,
      infinite = true,
      autoPlay = false,
      autoPlayInterval = 3000,
      showArrows = true,
      showDots = true,
      showIndicators = false,
      enableSwipe = true,
      enableKeyboard = true,
      animationDuration = 500,
      pauseOnHover = true,
      height = "400px",
      gap = "1rem",
      showFullscreen = false,
      className,
      onSlideChange,
      customPrevArrow,
      customNextArrow,
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
      usageContext = "main",
      ...props
    },
    ref
  ) => {
    const carouselRef = useRef<HTMLDivElement>(null);
    const autoPlayRef = useRef<NodeJS.Timeout>();
    const transitionRef = useRef<NodeJS.Timeout>();

    // Consciousness feature hooks - only initialize if features are enabled
    const predictiveEngine = predictive ? usePredictiveEngine() : null;
    const eyeTracker = eyeTracking ? useEyeTracking() : null;
    const biometricAdapter = adaptive ? useBiometricAdaptation() : null;
    const spatialAudioEngine = spatialAudio ? useSpatialAudio() : null;
    const achievementTracker = trackAchievements ? useAchievements() : null;
    const interactionRecorder =
      predictive || trackAchievements
        ? useInteractionRecorder(`glass-carousel-${usageContext}`)
        : null;
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [isPlaying, setIsPlaying] = useState(autoPlay);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [dragStart, setDragStart] = useState<number | null>(null);
    const [dragEnd, setDragEnd] = useState<number | null>(null);

    // Consciousness state
    const [slideInteractionCounts, setSlideInteractionCounts] = useState<
      Record<number, number>
    >({});
    const [predictedNextSlide, setPredictedNextSlide] = useState<number | null>(
      null
    );
    const [adaptiveAutoPlayInterval, setAdaptiveAutoPlayInterval] =
      useState(autoPlayInterval);
    const [gazeFocusedSlide, setGazeFocusedSlide] = useState<number | null>(
      null
    );

    // Determine if consciousness features are enabled
    const consciousness =
      predictive ||
      adaptive ||
      eyeTracking ||
      spatialAudio ||
      trackAchievements;

    // Get carousel items
    const carouselItems = children
      ? Children.toArray(children).map((child, index) => ({
          id: `item-${index}`,
          content: child as ReactNode,
        }))
      : items;

    const totalItems = carouselItems?.length || 0;
    const maxIndex = Math.max(0, totalItems - slidesToShow);

    // Handle slide change
    const handleSlideChange = useCallback(
      (newIndex: number) => {
        if (isTransitioning) return;

        let targetIndex = newIndex;

        if (infinite) {
          if (targetIndex < 0) {
            targetIndex = maxIndex;
          } else if (targetIndex > maxIndex) {
            targetIndex = 0;
          }
        } else {
          targetIndex = Math.max(0, Math.min(maxIndex, targetIndex));
        }

        if (targetIndex !== currentIndex) {
          setIsTransitioning(true);
          setCurrentIndex(targetIndex);
          onSlideChange?.(targetIndex);

          // Reset transition state after animation
          if (transitionRef.current) {
            clearTimeout(transitionRef.current);
          }
          transitionRef.current = setTimeout(() => {
            setIsTransitioning(false);
          }, animationDuration);
        }
      },
      [
        currentIndex,
        maxIndex,
        infinite,
        isTransitioning,
        animationDuration,
        onSlideChange,
      ]
    );

    // Enhanced slide change tracking (moved before navigation functions)
    const enhancedHandleSlideChange = useCallback(
      (newIndex: number) => {
        // Track slide interaction
        setSlideInteractionCounts((prev: any) => ({
          ...prev,
          [newIndex]: (prev[newIndex] || 0) + 1,
        }));

        // Record interaction for learning
        if (interactionRecorder) {
          interactionRecorder.recordClick({
            target: { id: `carousel-slide-${newIndex}` },
          } as any);
        }

        // Track achievements
        if (achievementTracker && trackAchievements) {
          achievementTracker.recordAction(
            achievementId || "carousel_navigation",
            {
              slideIndex: newIndex,
              interactionCount: (slideInteractionCounts[newIndex] || 0) + 1,
              context: usageContext,
            }
          );
        }

        // Play spatial audio feedback
        if (spatialAudioEngine && audioFeedback) {
          spatialAudioEngine.playGlassSound("carousel_slide_change");
        }

        // Call original handler
        handleSlideChange(newIndex);
      },
      [
        handleSlideChange,
        interactionRecorder,
        achievementTracker,
        trackAchievements,
        achievementId,
        slideInteractionCounts,
        usageContext,
        spatialAudioEngine,
        audioFeedback,
      ]
    );

    // Navigation functions (updated to use enhanced handler)
    const goToPrev = useCallback(() => {
      enhancedHandleSlideChange(currentIndex - slidesToScroll);
    }, [currentIndex, slidesToScroll, enhancedHandleSlideChange]);

    const goToNext = useCallback(() => {
      enhancedHandleSlideChange(currentIndex + slidesToScroll);
    }, [currentIndex, slidesToScroll, enhancedHandleSlideChange]);

    const goToSlide = useCallback(
      (index: number) => {
        enhancedHandleSlideChange(index);
      },
      [enhancedHandleSlideChange]
    );

    // Auto-play functionality (with consciousness adaptation)
    useEffect(() => {
      if (isPlaying && totalItems > slidesToShow) {
        autoPlayRef.current = setInterval(() => {
          goToNext();
        }, adaptiveAutoPlayInterval);
      } else {
        if (autoPlayRef.current) {
          clearInterval(autoPlayRef.current);
        }
      }

      return () => {
        if (autoPlayRef.current) {
          clearInterval(autoPlayRef.current);
        }
      };
    }, [
      isPlaying,
      totalItems,
      slidesToShow,
      adaptiveAutoPlayInterval,
      goToNext,
    ]);

    // Handle keyboard navigation
    useEffect(() => {
      if (!enableKeyboard) return;

      const handleKeyPress = (e: KeyboardEvent) => {
        switch (e.key) {
          case "ArrowLeft":
            e.preventDefault();
            goToPrev();
            break;
          case "ArrowRight":
            e.preventDefault();
            goToNext();
            break;
          case " ":
            e.preventDefault();
            setIsPlaying(!isPlaying);
            break;
          case "Escape":
            if (isFullscreen) {
              setIsFullscreen(false);
            }
            break;
        }
      };

      window.addEventListener("keydown", handleKeyPress);
      return () => window.removeEventListener("keydown", handleKeyPress);
    }, [enableKeyboard, goToPrev, goToNext, isPlaying, isFullscreen]);

    // Consciousness effects

    // Biometric adaptation for autoplay timing
    useEffect(() => {
      if (!biometricResponsive || !biometricAdapter) return;

      const adaptCarousel = () => {
        const deviceCapabilities = biometricAdapter.latestReading;
        const stressLevel = biometricAdapter.currentStressLevel;

        // Adapt autoplay speed based on stress level
        if (stressLevel > 0.7) {
          setAdaptiveAutoPlayInterval(Math.max(autoPlayInterval * 1.5, 5000)); // Slower when stressed
        } else if (stressLevel < 0.3) {
          setAdaptiveAutoPlayInterval(Math.max(autoPlayInterval * 0.8, 2000)); // Faster when relaxed
        } else {
          setAdaptiveAutoPlayInterval(autoPlayInterval);
        }
      };

      adaptCarousel();
      const interval = setInterval(adaptCarousel, 5000);
      return () => clearInterval(interval);
    }, [biometricResponsive, biometricAdapter, autoPlayInterval]);

    // Eye tracking for slide attention
    useEffect(() => {
      if (!gazeResponsive || !eyeTracker || !carouselRef.current) return;

      const handleSlideGaze = (event: any) => {
        const slideElements =
          carouselRef.current?.querySelectorAll("[data-slide-index]");
        if (!slideElements) return;

        slideElements.forEach((element, index) => {
          const rect = element.getBoundingClientRect();
          const isInView =
            event.clientX >= rect.left &&
            event.clientX <= rect.right &&
            event.clientY >= rect.top &&
            event.clientY <= rect.bottom;

          if (isInView) {
            setGazeFocusedSlide(index);

            if (spatialAudioEngine && audioFeedback) {
              spatialAudioEngine.playGlassSound("slide_attention", {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2,
                z: 0,
              });
            }
          }
        });
      };

      // Eye tracking integration - methods may need to be implemented
      // eyeTracker.onGazeEnter(carouselRef.current, handleSlideGaze);

      return () => {
        if (carouselRef.current) {
          // eyeTracker.offGazeEnter(carouselRef.current, handleSlideGaze);
        }
      };
    }, [gazeResponsive, eyeTracker, spatialAudioEngine, audioFeedback]);

    // Predictive slide navigation
    useEffect(() => {
      if (!predictive || !predictiveEngine) return;

      const updatePredictions = () => {
        const predictions = predictiveEngine.predictions;
        const slidePrediction = predictions.find(
          (p: any) =>
            p.type === "navigate" &&
            p.metadata?.carouselContext === usageContext
        );

        if (slidePrediction && slidePrediction.confidence > 0.8) {
          setPredictedNextSlide(slidePrediction.metadata.slideIndex);

          // Preload predicted slide content if enabled
          if (preloadContent) {
            console.log(
              `Preloading slide content: ${slidePrediction.metadata.slideIndex}`
            );
          }
        } else {
          setPredictedNextSlide(null);
        }
      };

      const interval = setInterval(updatePredictions, 2000);
      updatePredictions();

      return () => clearInterval(interval);
    }, [predictive, predictiveEngine, usageContext, preloadContent]);

    // Handle mouse/touch events for swipe
    const handleMouseDown = useCallback(
      (e: React.MouseEvent) => {
        if (!enableSwipe) return;
        setDragStart(e.clientX);
      },
      [enableSwipe]
    );

    const handleMouseMove = useCallback(
      (e: React.MouseEvent) => {
        if (!enableSwipe || dragStart === null) return;
        setDragEnd(e.clientX);
      },
      [enableSwipe, dragStart]
    );

    const handleMouseUp = useCallback(() => {
      if (!enableSwipe || dragStart === null || dragEnd === null) return;

      const diff = dragStart - dragEnd;
      const threshold = 50;

      if (Math.abs(diff) > threshold) {
        if (diff > 0) {
          goToNext();
        } else {
          goToPrev();
        }
      }

      setDragStart(null);
      setDragEnd(null);
    }, [enableSwipe, dragStart, dragEnd, goToNext, goToPrev]);

    // Handle hover for pause on hover
    const handleMouseEnter = useCallback(() => {
      if (pauseOnHover && isPlaying) {
        setIsPlaying(false);
      }
    }, [pauseOnHover, isPlaying]);

    const handleMouseLeave = useCallback(() => {
      if (pauseOnHover && autoPlay) {
        setIsPlaying(true);
      }
    }, [pauseOnHover, autoPlay]);

    // Calculate transform for slides
    const getTransform = () => {
      const slideWidth = 100 / slidesToShow;
      return `translateX(-${currentIndex * slideWidth}%)`;
    };

    // Check if navigation is needed
    const needsNavigation = totalItems > slidesToShow;

    if (totalItems === 0) {
      return (
        <GlassCard data-glass-component className={cn("p-8", className)}>
          <div className='glass-text-center glass-text-primary-glass-opacity-60'>No items to display</div>
        </GlassCard>
      );
    }

    return (
      <Motion preset="fadeIn" className="glass-w-full">
        <GlassCard
          ref={ref}
          elevation="level2"
          intensity="medium"
          depth={2}
          tint="neutral"
          border="subtle"
          animation="none"
          performanceMode="medium"
          className={cn(
            "overflow-hidden relative",
            isFullscreen && "fixed inset-0 z-50 rounded-none",
            className
          )}
          {...props}
        >
          <CardContent className="glass-p-0">
            {/* Main Carousel Container */}
            <div
              ref={carouselRef}
              className={cn(
                "relative overflow-hidden",
                eyeTracking && "consciousness-eye-trackable",
                predictive && "consciousness-predictive",
                adaptive && "consciousness-adaptive"
              )}
              style={{
                height: typeof height === "number" ? `${height}px` : height,
              }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              data-glass-carousel="true"
              data-carousel-autoplay={String(!!autoPlay)}
              data-consciousness-component="carousel"
              data-consciousness-active={String(!!consciousness)}
              data-eye-tracking={String(!!eyeTracking)}
              data-predictive={String(!!predictive)}
              data-adaptive={String(!!adaptive)}
              data-spatial-audio={String(!!spatialAudio)}
            >
              {/* Slides Container */}
              <div
                className={cn(
                  "flex h-full transition-transform duration-500 ease-in-out",
                  adaptive &&
                    adaptiveAutoPlayInterval !== autoPlayInterval &&
                    "consciousness-adaptive-timing",
                  predictive &&
                    predictedNextSlide !== null &&
                    "consciousness-predictive-active"
                )}
                style={{
                  transform: getTransform(),
                  gap: typeof gap === "number" ? `${gap}px` : gap,
                  transitionDuration: adaptive
                    ? `${Math.max(300, adaptiveAutoPlayInterval / 10)}ms`
                    : "500ms",
                }}
                data-consciousness-slides-container="true"
                data-predicted-slide={predictedNextSlide}
              >
                {carouselItems.map((item, index) => (
                  <div
                    key={item?.id}
                    className={cn(
                      "flex-shrink-0",
                      eyeTracking &&
                        gazeFocusedSlide === index &&
                        "consciousness-gaze-focused",
                      predictive &&
                        predictedNextSlide === index &&
                        "consciousness-predicted-next",
                      trackAchievements &&
                        slideInteractionCounts[index] > 0 &&
                        "consciousness-interacted"
                    )}
                    style={{
                      width: `${100 / slidesToShow}%`,
                      paddingLeft: index === 0 ? 0 : undefined,
                      paddingRight:
                        index === (carouselItems?.length || 0) - 1
                          ? 0
                          : undefined,
                    }}
                    data-slide-index={index}
                    data-consciousness-slide="true"
                    data-interaction-count={slideInteractionCounts[index] || 0}
                    data-gaze-focused={gazeFocusedSlide === index}
                    data-predicted={predictedNextSlide === index}
                  >
                    <div className='glass-h-full glass-w-full glass-relative'>
                      {item?.content}
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Arrows */}
              {showArrows && needsNavigation && (
                <>
                  {/* Previous Arrow */}
                  <div className='glass-absolute glass-left-4 glass-top-1/2 glass-transform glass--translate-y-1-2 glass-z-10'>
                    {customPrevArrow ? (
                      <div onClick={goToPrev}>{customPrevArrow}</div>
                    ) : (
                      <GlassButton
                        variant="secondary"
                        size="lg"
                        onClick={goToPrev}
                        disabled={!infinite && currentIndex === 0}
                        className='glass-p-3 glass-shadow-lg glass-hover--translate-y-0-5 glass-ripple'
                        data-consciousness-nav="prev"
                      >
                        <ChevronLeft className='glass-w-6 glass-h-6' />
                      </GlassButton>
                    )}
                  </div>

                  {/* Next Arrow */}
                  <div className='glass-absolute glass-right-4 glass-top-1/2 glass-transform glass--translate-y-1-2 glass-z-10'>
                    {customNextArrow ? (
                      <div onClick={goToNext}>{customNextArrow}</div>
                    ) : (
                      <GlassButton
                        variant="secondary"
                        size="lg"
                        onClick={goToNext}
                        disabled={!infinite && currentIndex >= maxIndex}
                        className='glass-p-3 glass-shadow-lg glass-hover--translate-y-0-5 glass-ripple'
                        data-consciousness-nav="next"
                      >
                        <ChevronRight className='glass-w-6 glass-h-6' />
                      </GlassButton>
                    )}
                  </div>
                </>
              )}

              {/* Play/Pause Controls */}
              {autoPlay && needsNavigation && (
                <div className='glass-absolute glass-top-4 glass-right-4 glass-z-10'>
                  <GlassButton
                    variant="secondary"
                    size="sm"
                    onClick={(e) => setIsPlaying(!isPlaying)}
                    className="glass-p-2"
                    data-consciousness-control="play-pause"
                    data-adaptive-interval={adaptiveAutoPlayInterval}
                  >
                    {isPlaying ? (
                      <Pause className='glass-w-4 glass-h-4' />
                    ) : (
                      <Play className='glass-w-4 glass-h-4' />
                    )}
                  </GlassButton>
                </div>
              )}

              {/* Fullscreen Toggle */}
              {showFullscreen && (
                <div className='glass-absolute glass-top-4 glass-left-4 glass-z-10'>
                  <GlassButton
                    variant="secondary"
                    size="sm"
                    onClick={(e) => setIsFullscreen(!isFullscreen)}
                    className="glass-p-2"
                    data-consciousness-control="fullscreen"
                  >
                    {isFullscreen ? (
                      <Minimize2 className='glass-w-4 glass-h-4' />
                    ) : (
                      <Maximize2 className='glass-w-4 glass-h-4' />
                    )}
                  </GlassButton>
                </div>
              )}
            </div>

            {/* Indicators */}
            {showIndicators && needsNavigation && (
              <div
                className="glass-px-6 glass-py-4"
                data-consciousness-indicators="true"
              >
                <div className='glass-flex glass-items-center glass-justify-between glass-text-sm glass-text-primary-glass-opacity-80'>
                  <span>
                    {currentIndex + 1} /{" "}
                    {Math.ceil(totalItems / slidesToScroll)}
                    {predictive && predictedNextSlide !== null && (
                      <span className='glass-ml-2 glass-text-xs glass-text-primary-glass-opacity-80'>
                        Next: {predictedNextSlide + 1}
                      </span>
                    )}
                  </span>
                  <div className="glass-flex glass-items-center glass-gap-2">
                    <span>
                      Slide {currentIndex + 1}
                      {adaptive &&
                        adaptiveAutoPlayInterval !== autoPlayInterval && (
                          <span className='glass-ml-1 glass-text-xs glass-text-primary-glass-opacity-80'>
                            ({Math.round(adaptiveAutoPlayInterval / 1000)}s)
                          </span>
                        )}
                    </span>
                    <div className='glass-w-32 glass-h-1 glass-surface-subtle/20 glass-radius-full glass-overflow-hidden'>
                      <div
                        className={cn(
                          "h-full bg-primary transition-all duration-300",
                          adaptive && "consciousness-adaptive-progress"
                        )}
                        style={{
                          width: `${((currentIndex + 1) / Math.ceil(totalItems / slidesToScroll)) * 100}%`,
                          transitionDuration: adaptive
                            ? `${adaptiveAutoPlayInterval / 10}ms`
                            : "300ms",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Dots Navigation */}
            {showDots && needsNavigation && (
              <div
                className="glass-px-6 glass-py-4"
                data-consciousness-dots="true"
              >
                <div className="glass-flex glass-justify-center glass-gap-2">
                  {Array.from({
                    length: Math.ceil(totalItems / slidesToScroll),
                  }).map((_, index) => {
                    const slideIndex = index * slidesToScroll;
                    const isActive =
                      Math.floor(currentIndex / slidesToScroll) === index;
                    const isPredicted =
                      predictive && predictedNextSlide === slideIndex;
                    const isInteracted =
                      trackAchievements &&
                      slideInteractionCounts[slideIndex] > 0;

                    return (
                      <button
                        key={index}
                        onClick={(e) => goToSlide(slideIndex)}
                        className={cn(
                          "w-3 h-3 glass-radius-full transition-all duration-200",
                          isActive && "bg-primary scale-125",
                          !isActive &&
                            "bg-black/40 hover:bg-black/60 border border-white/30 hover:border-white/50",
                          isPredicted && "consciousness-predicted-dot",
                          isInteracted && "consciousness-interacted-dot",
                          eyeTracking &&
                            gazeFocusedSlide === slideIndex &&
                            "consciousness-gaze-focused-dot"
                        )}
                        data-slide-index={slideIndex}
                        data-consciousness-dot="true"
                        data-predicted={isPredicted}
                        data-interacted={isInteracted}
                        data-gaze-focused={gazeFocusedSlide === slideIndex}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Item Info */}
            {(carouselItems[currentIndex] as any)?.title && (
              <div className="glass-px-6 glass-py-4 glass-border-t glass-border-white/10">
                <div className='glass-text-center'>
                  <h3 className='glass-text-lg glass-font-semibold glass-text-primary glass-mb-1'>
                    {(carouselItems[currentIndex] as any).title}
                  </h3>
                  {(carouselItems[currentIndex] as any)?.description && (
                    <p className='glass-text-sm glass-text-primary-opacity-70'>
                      {(carouselItems[currentIndex] as any).description}
                    </p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </GlassCard>
      </Motion>
    );
  }
);

GlassCarousel.displayName = "GlassCarousel";

// Consciousness-Enhanced Carousel Variants
export const GlassPredictiveCarousel: React.FC<GlassCarouselProps> = (
  props
) => <GlassCarousel {...props} predictive={true} />;

export const GlassAdaptiveCarousel: React.FC<GlassCarouselProps> = (props) => (
  <GlassCarousel {...props} adaptive={true} />
);

export const GlassEyeTrackingCarousel: React.FC<GlassCarouselProps> = (
  props
) => <GlassCarousel {...props} eyeTracking={true} />;

export const GlassSpatialAudioCarousel: React.FC<GlassCarouselProps> = (
  props
) => <GlassCarousel {...props} spatialAudio={true} />;

export const GlassAchievementCarousel: React.FC<GlassCarouselProps> = (
  props
) => <GlassCarousel {...props} trackAchievements={true} />;

export const GlassConsciousnessCarousel: React.FC<GlassCarouselProps> = (
  props
) => (
  <GlassCarousel
    {...props}
    predictive={true}
    adaptive={true}
    eyeTracking={true}
    spatialAudio={true}
    trackAchievements={true}
  />
);

// Thumbnail Carousel Variant
export interface GlassThumbnailCarouselProps
  extends Omit<GlassCarouselProps, "slidesToShow"> {
  /**
   * Show thumbnails
   */
  showThumbnails?: boolean;
  /**
   * Thumbnail size
   */
  thumbnailSize?: "sm" | "md" | "lg";
  /**
   * Thumbnail position
   */
  thumbnailPosition?: "bottom" | "left" | "right";
}

export const GlassThumbnailCarousel: React.FC<GlassThumbnailCarouselProps> = ({
  showThumbnails = true,
  thumbnailSize = "sm",
  thumbnailPosition = "bottom",
  items = [],
  children,
  ...props
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const thumbnailItems = children
    ? Children.toArray(children).map((child, index) => ({
        id: `thumb-${index}`,
        content: child as ReactNode,
      }))
    : items;

  const thumbnailSizeClasses = {
    sm: "w-16 h-16",
    md: "w-20 h-20",
    lg: "w-24 h-24",
  };

  if (!showThumbnails) {
    return <GlassCarousel {...props} />;
  }

  return (
    <div
      className={cn(
        "flex glass-gap-4",
        thumbnailPosition === "bottom" && "flex-col",
        thumbnailPosition === "left" && "flex-row-reverse",
        thumbnailPosition === "right" && "flex-row"
      )}
    >
      {/* Main Carousel */}
      <div className="glass-flex-1">
        <GlassCarousel
          {...props}
          items={thumbnailItems}
          onSlideChange={setSelectedIndex}
        />
      </div>

      {/* Thumbnails */}
      <div
        className={cn(
          "flex glass-gap-2 overflow-x-auto",
          thumbnailPosition === "bottom" && "flex-row justify-center",
          thumbnailPosition === "left" && "flex-col",
          thumbnailPosition === "right" && "flex-col"
        )}
      >
        {thumbnailItems.map((item, index) => (
          <button
            key={item?.id}
            onClick={(e) => setSelectedIndex(index)}
            className={cn(
              "flex-shrink-0 glass-radius-lg overflow-hidden border-2 transition-all duration-200",
              thumbnailSizeClasses?.[thumbnailSize],
              selectedIndex === index
                ? "border-primary scale-105 shadow-lg"
                : "border-white/20 hover:border-white/40 hover:scale-102"
            )}
          >
            {(item as any).image ? (
              <img
                src={(item as any).image}
                alt={(item as any).title || `Thumbnail ${index + 1}`}
                className='glass-w-full glass-h-full glass-object-cover'
              />
            ) : (
              <div className="glass-w-full glass-h-full glass-surface-subtle/10 glass-flex glass-items-center glass-justify-center">
                <span className='glass-text-xs glass-text-primary-glass-opacity-60'>
                  {index + 1}
                </span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GlassCarousel;