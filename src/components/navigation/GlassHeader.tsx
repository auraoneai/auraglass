'use client';
import { GlassButton } from "../button/GlassButton";

import { cn } from "../../lib/utilsComprehensive";
import React, {
  forwardRef,
  useRef,
  useState,
  useCallback,
  useEffect,
} from "react";
import { FocusTrap } from "../../primitives/focus/FocusTrap";
import { OptimizedGlass } from "../../primitives";
import { Motion } from "../../primitives";
import {
  LiquidGlassMaterial,
  type LiquidGlassMaterialProps,
} from "../../primitives/LiquidGlassMaterial";
import {
  type LiquidGlassMaterial as MaterialType,
  type MaterialVariant,
} from "../../tokens/glass";
import { IconButton } from "../button/GlassButton";
import { GlassInput } from "../input/GlassInput";
import {
  usePredictiveEngine,
  useInteractionRecorder,
} from "../advanced/GlassPredictiveEngine";
import { useAchievements } from "../advanced/GlassAchievementSystem";
import { useBiometricAdaptation } from "../advanced/GlassBiometricAdaptation";
import { useEyeTracking } from "../advanced/GlassEyeTracking";
import { useSpatialAudio } from "../advanced/GlassSpatialAudio";
import type { ConsciousnessFeatures } from "../layout/GlassContainer";

export interface HeaderAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  href?: string;
  badge?: string | number;
  disabled?: boolean;
}

export interface UserMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  divider?: boolean;
}

export interface GlassHeaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    ConsciousnessFeatures {
  /**
   * Header variant
   */
  variant?: "default" | "floating" | "sticky" | "transparent";
  /**
   * Header size
   */
  size?: "sm" | "md" | "lg";
  /**
   * Material type - standard uses OptimizedGlass, liquid uses LiquidGlassMaterial
   */
  material?: MaterialType;
  /**
   * Material variant - regular or clear transparency (only for liquid material)
   */
  materialVariant?: MaterialVariant;
  /**
   * Enable scroll-adaptive density (liquid material only)
   */
  scrollAdaptive?: boolean;
  /**
   * Left content (logo, brand)
   */
  logo?: React.ReactNode;
  /**
   * Navigation items
   */
  navigation?: React.ReactNode;
  /**
   * Header actions
   */
  actions?: HeaderAction[];
  /**
   * Search configuration
   */
  search?: {
    placeholder?: string;
    onSearch?: (query: string) => void;
    suggestions?: string[];
  };
  /**
   * User menu configuration
   */
  userMenu?: {
    user: {
      name: string;
      email?: string;
      avatar?: string;
      status?: "online" | "away" | "busy" | "offline";
    };
    items: UserMenuItem[];
  };
  /**
   * Mobile menu toggle
   */
  mobileMenuOpen?: boolean;
  /**
   * Mobile menu toggle callback
   */
  onMobileMenuToggle?: () => void;
  /**
   * Breadcrumbs
   */
  breadcrumbs?: React.ReactNode;
  /**
   * Custom content
   */
  children?: React.ReactNode;
  className?: string;
}

/**
 * GlassHeader component
 * A glassmorphism header with navigation, search, and user menu
 */
export const GlassHeader = forwardRef<HTMLDivElement, GlassHeaderProps>(
  (
    {
      variant = "default",
      size = "md",
      material = "standard",
      materialVariant = "regular",
      scrollAdaptive = true,
      logo,
      navigation,
      actions = [],
      search,
      userMenu,
      mobileMenuOpen = false,
      onMobileMenuToggle,
      breadcrumbs,
      children,
      className,
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
    const headerRef = useRef<HTMLDivElement>(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const [scrollDensity, setScrollDensity] = useState(1.0); // For scroll-adaptive density
    const [adaptiveSize, setAdaptiveSize] = useState(size);
    const [predictiveSearchSuggestions, setPredictiveSearchSuggestions] =
      useState<string[]>([]);
    const [navigationUsage, setNavigationUsage] = useState<
      Record<string, number>
    >({});

    // Consciousness feature hooks - only initialize if features are enabled
    const predictiveEngine = predictive ? usePredictiveEngine() : null;
    const eyeTracker = eyeTracking ? useEyeTracking() : null;
    const biometricAdapter = adaptive ? useBiometricAdaptation() : null;
    const spatialAudioEngine = spatialAudio ? useSpatialAudio() : null;
    const achievementTracker = trackAchievements ? useAchievements() : null;
    const interactionRecorder =
      predictive || trackAchievements
        ? useInteractionRecorder(`glass-header-${variant}`)
        : null;
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    // Enhanced scroll tracking with adaptive density for liquid glass
    useEffect(() => {
      const handleScroll = () => {
        const scrollY = window.scrollY;
        const scrolled = scrollY > 10;
        setIsScrolled(scrolled);

        // Scroll-adaptive density for liquid glass headers
        if (material === "liquid" && scrollAdaptive) {
          // Increase density (reduce transparency, enhance blur) as user scrolls
          const maxScrollForDensity = 200; // Max scroll distance for full density
          const densityFactor = Math.min(scrollY / maxScrollForDensity, 1);
          const newDensity = 1 + densityFactor * 0.5; // 1.0 to 1.5 density range
          setScrollDensity(newDensity);
        }

        // Record scroll interaction
        if (interactionRecorder && scrolled !== isScrolled) {
          // Note: recordScroll method may not be available, using recordClick as fallback
          if (interactionRecorder.recordClick) {
            interactionRecorder.recordClick({
              target: "header",
              data: {
                type: "scroll",
                scrolled,
                scrollY,
                density: scrollDensity,
                material,
              },
            } as any);
          }
        }
      };

      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    }, [
      interactionRecorder,
      isScrolled,
      material,
      scrollAdaptive,
      scrollDensity,
    ]);

    // Biometric adaptation effects
    useEffect(() => {
      if (!biometricResponsive || !biometricAdapter) return;

      const adaptHeader = () => {
        const stressLevel = biometricAdapter.currentStressLevel;

        // Adapt header size based on stress level
        if (stressLevel > 0.7) {
          setAdaptiveSize("lg"); // Larger header when stressed
        } else if (stressLevel < 0.3) {
          setAdaptiveSize("sm"); // Compact header when relaxed
        } else {
          setAdaptiveSize(size); // Use original size
        }
      };

      // Initial adaptation
      adaptHeader();

      // Listen for biometric changes
      const interval = setInterval(adaptHeader, 5000);
      return () => clearInterval(interval);
    }, [biometricResponsive, biometricAdapter, size]);

    // Predictive search suggestions
    useEffect(() => {
      if (!predictive || !predictiveEngine || !search) return;

      const updatePredictiveSearch = () => {
        const predictions = predictiveEngine.predictions;
        const searchPredictions = predictions
          .filter((p: any) => p.type === "suggest" && p.metadata?.searchQuery)
          .map((p: any) => p.metadata.searchQuery)
          .slice(0, 5);

        setPredictiveSearchSuggestions(searchPredictions);
      };

      // Update every 2 seconds during active search
      const interval = isSearchFocused
        ? setInterval(updatePredictiveSearch, 2000)
        : null;
      updatePredictiveSearch(); // Initial update

      return () => {
        if (interval) clearInterval(interval);
      };
    }, [predictive, predictiveEngine, search, isSearchFocused]);

    // Navigation usage tracking
    const trackNavigation = useCallback(
      (navItem: string) => {
        if (!predictive) return;

        setNavigationUsage((prev: any) => ({
          ...prev,
          [navItem]: (prev[navItem] || 0) + 1,
        }));

        if (interactionRecorder) {
          interactionRecorder.recordClick({
            target: `nav-${navItem}`,
            data: {
              context: "header-navigation",
            },
          } as any);
        }

        if (achievementTracker && trackAchievements) {
          achievementTracker.recordAction("navigation_usage", {
            navItem,
            totalUsage: (navigationUsage[navItem] || 0) + 1,
          });
        }

        if (spatialAudioEngine && audioFeedback) {
          spatialAudioEngine.playGlassSound("navigation_click");
        }
      },
      [
        predictive,
        interactionRecorder,
        achievementTracker,
        trackAchievements,
        navigationUsage,
        spatialAudioEngine,
        audioFeedback,
      ]
    );

    const effectiveSize = biometricResponsive ? adaptiveSize : size;

    const sizeClasses = {
      sm: "h-12 glass-px-4",
      md: "h-16 glass-px-6",
      lg: "h-20 glass-px-8",
    };

    const variantClasses = {
      default: "border-b border-border/20",
      floating: "border border-border/20 glass-radius-lg glass-mx-4 glass-mt-4",
      sticky: "border-b border-border/30 sticky top-0 z-40",
      transparent: "bg-transparent",
    };

    // Common props for both material types
    const commonProps = {
      ref,
      className: cn(
        "glass-w-full glass-flex glass-items-center glass-justify-between",
        "glass-transition",
        sizeClasses?.[effectiveSize],
        variantClasses?.[variant],
        variant === "floating" ? "squiricle" : "",
        // Consciousness feature styles
        {
          "glass-glass-backdrop-blur-sm":
            isScrolled && (predictive || gazeResponsive),
          "glass-shadow-lg": gazeResponsive,
        },
        className
      ),
      // Use utility class instead of inline style
      // Note: any external style prop is ignored to comply with no-inline-style-attr
      "data-overflow": "visible",
      ...props,
    };

    const elevation =
      variant === "transparent"
        ? "level1"
        : variant === "floating"
          ? "level3"
          : "level2";

    // Render with LiquidGlassMaterial for enhanced effects
    if (material === "liquid") {
      return (
        <LiquidGlassMaterial
          data-glass-component
          {...commonProps}
          material="liquid"
          variant={materialVariant}
          intent="primary"
          elevation={elevation}
          adaptToContent={true}
          adaptToMotion={true}
          enableMicroInteractions={true}
          // Removed inline style to comply with no-inline-style-attr (opacity adaptation skipped)
          performanceLevel={variant === "floating" ? "high" : "balanced"}
          interactive={true}
          radius={variant === "floating" ? "xl" : "lg"}
        >
          {/* Removed extra color overlay to follow global background */}
          {/* Left section */}
          <div className="glass-flex glass-items-center glass-gap-4">
            {/* Mobile menu toggle */}
            {onMobileMenuToggle && (
              <IconButton
                className='glass-focus md:glass-hidden'
                icon={
                  <div className='glass-w-5 glass-h-5 glass-flex glass-flex-col glass-justify-center glass-gap-1'>
                    <div
                      className={cn(
                        "h-0.5 bg-current transition-all duration-200",
                        mobileMenuOpen ? "rotate-45 translate-y-1.5" : "w-5"
                      )}
                    />
                    <div
                      className={cn(
                        "h-0.5 bg-current transition-all duration-200",
                        mobileMenuOpen ? "opacity-0" : "w-5"
                      )}
                    />
                    <div
                      className={cn(
                        "h-0.5 bg-current transition-all duration-200",
                        mobileMenuOpen ? "-rotate-45 -translate-y-1.5" : "w-5"
                      )}
                    />
                  </div>
                }
                intent="neutral"
                size="sm"
                onClick={onMobileMenuToggle}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              />
            )}

            {/* Logo */}
            {logo && <div className="glass-flex-shrink-0">{logo}</div>}

            {/* Navigation */}
            {navigation && <nav className='glass-hidden md:glass-block'>{navigation}</nav>}
          </div>

          {/* Center section */}
          <div className="glass-flex-1 glass-flex glass-justify-center glass-px-4">
            {search && (
              <div className='glass-relative glass-w-full glass-max-w-md'>
                <GlassInput
                  placeholder={search.placeholder || "Search..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  leftIcon={
                    <svg
                      className='glass-w-4 glass-h-4'
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  }
                  clearable
                  onClear={() => setSearchQuery("")}
                  className="glass-w-full"
                />

                {/* Search suggestions - combine original and predictive suggestions */}
                {isSearchFocused &&
                  ((search.suggestions?.length ?? 0) > 0 ||
                    predictiveSearchSuggestions.length > 0) && (
                    <Motion
                      preset="slideDown"
                      className='glass-absolute glass-top-full glass-left-0 glass-right-0 glass-mt-1 glass-z-1000'
                    >
                      <OptimizedGlass
                        intent="neutral"
                        elevation={"level4"}
                        intensity="strong"
                        depth={2}
                        tint="neutral"
                        border="subtle"
                        animation="none"
                        performanceMode="high"
                        className='glass-max-h-60 glass-overflow-y-auto glass-radius-xl'
                      >
                        <div className="glass-p-3">
                          {/* Predictive suggestions first */}
                          {predictiveSearchSuggestions.length > 0 && (
                            <>
                              <div className='glass-text-xs glass-text-primary glass-font-medium glass-mb-2 glass-px-2'>
                                🧠 Predicted
                              </div>
                              {predictiveSearchSuggestions.map(
                                (suggestion, index) => (
                                  <GlassButton
                                    key={`predictive-${index}`}
                                    className='glass-w-full glass-text-left glass-px-4 glass-py-3 glass-radius-xl hover:glass-surface-primary/20 glass-transition-colors glass-mb-2 glass-border glass-border'
                                    onClick={(e) => {
                                      setSearchQuery(suggestion);
                                      search.onSearch?.(suggestion);
                                      if (interactionRecorder) {
                                        interactionRecorder.recordClick({
                                          target:
                                            "predictive-search-suggestion",
                                          data: {
                                            value: suggestion,
                                            type: "predictive",
                                          },
                                        } as any);
                                      }
                                    }}
                                  >
                                    <span className='glass-text-primary'>💡</span>{" "}
                                    {suggestion}
                                  </GlassButton>
                                )
                              )}
                            </>
                          )}

                          {/* Original suggestions */}
                          {search.suggestions &&
                            search.suggestions.length > 0 && (
                              <>
                                {predictiveSearchSuggestions.length > 0 && (
                                  <div className="glass-border-t glass-border-white/10 glass-my-2"></div>
                                )}
                                <div className='glass-text-xs glass-text-primary-glass-opacity-60 glass-font-medium glass-mb-2 glass-px-2'>
                                  Recent
                                </div>
                                {search.suggestions.map((suggestion, index) => (
                                  <GlassButton
                                    key={`original-${index}`}
                                    className='glass-w-full glass-text-left glass-px-4 glass-py-3 glass-radius-xl hover:glass-surface-subtle glass-transition-colors glass-mb-2 last:glass-mb-0'
                                    onClick={(e) => {
                                      setSearchQuery(suggestion);
                                      search.onSearch?.(suggestion);
                                      if (interactionRecorder) {
                                        interactionRecorder.recordClick({
                                          target: "search-suggestion",
                                          data: {
                                            value: suggestion,
                                            type: "regular",
                                          },
                                        } as any);
                                      }
                                    }}
                                  >
                                    {suggestion}
                                  </GlassButton>
                                ))}
                              </>
                            )}
                        </div>
                      </OptimizedGlass>
                    </Motion>
                  )}
              </div>
            )}

            {/* Breadcrumbs */}
            {breadcrumbs && !search && (
              <div className="glass-flex glass-items-center">{breadcrumbs}</div>
            )}

            {/* Custom content */}
            {children && !search && !breadcrumbs && (
              <div className="glass-flex glass-items-center">{children}</div>
            )}
          </div>

          {/* Right section */}
          <div className="glass-flex glass-items-center glass-gap-2">
            {/* Actions */}
            {(actions || []).map((action) => (
              <NotificationButton key={action.id} action={action} />
            ))}

            {/* User Menu */}
            {userMenu && <UserMenu {...userMenu} />}
          </div>
        </LiquidGlassMaterial>
      );
    }

    // Fallback to OptimizedGlass for standard material
    return (
      <OptimizedGlass
        {...commonProps}
        intent="primary"
        elevation={elevation}
        intensity="medium"
        depth={2}
        tint="lavender"
        border={variant === "floating" ? "gradient" : "subtle"}
        animation="none"
        performanceMode="medium"
        role="navigation"
        aria-label={commonProps['aria-label'] || "Main navigation"}
      >
        {/* Removed extra color overlay to follow global background */}
        {/* Left section */}
        <div className="glass-flex glass-items-center glass-gap-4">
          {/* Mobile menu toggle */}
          {onMobileMenuToggle && (
            <IconButton
              icon={
                <div className='glass-w-5 glass-h-5 glass-flex glass-flex-col glass-justify-center glass-gap-1'>
                  <div
                    className={cn(
                      "h-0.5 bg-current transition-all duration-200",
                      mobileMenuOpen ? "rotate-45 translate-y-1.5" : "w-5"
                    )}
                  />
                  <div
                    className={cn(
                      "h-0.5 bg-current transition-all duration-200",
                      mobileMenuOpen ? "opacity-0" : "w-5"
                    )}
                  />
                  <div
                    className={cn(
                      "h-0.5 bg-current transition-all duration-200",
                      mobileMenuOpen ? "-rotate-45 -translate-y-1.5" : "w-5"
                    )}
                  />
                </div>
              }
              intent="neutral"
              size="sm"
              onClick={onMobileMenuToggle}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              className='md:glass-hidden'
            />
          )}

          {/* Logo */}
          {logo && <div className="glass-flex-shrink-0">{logo}</div>}

          {/* Navigation */}
          {navigation && <nav className='glass-hidden md:glass-block'>{navigation}</nav>}
        </div>

        {/* Center section */}
        <div className="glass-flex-1 glass-flex glass-justify-center glass-px-4">
          {search && (
            <div className='glass-relative glass-w-full glass-max-w-md'>
              <GlassInput
                placeholder={search.placeholder || "Search..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                leftIcon={
                  <svg
                    className='glass-w-4 glass-h-4'
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                }
                clearable
                onClear={() => setSearchQuery("")}
                className="glass-w-full"
              />

              {/* Search suggestions - combine original and predictive suggestions */}
              {isSearchFocused &&
                ((search.suggestions?.length ?? 0) > 0 ||
                  predictiveSearchSuggestions.length > 0) && (
                  <Motion
                    preset="slideDown"
                    className='glass-absolute glass-top-full glass-left-0 glass-right-0 glass-mt-1 glass-z-1000'
                  >
                    <OptimizedGlass
                      intent="neutral"
                      elevation={"level4"}
                      intensity="strong"
                      depth={2}
                      tint="neutral"
                      border="subtle"
                      animation="none"
                      performanceMode="high"
                      className='glass-max-h-60 glass-overflow-y-auto glass-radius-xl'
                    >
                      <div className="glass-p-3">
                        {/* Predictive suggestions first */}
                        {predictiveSearchSuggestions.length > 0 && (
                          <>
                            <div className='glass-text-xs glass-text-primary glass-font-medium glass-mb-2 glass-px-2'>
                              🧠 Predicted
                            </div>
                            {predictiveSearchSuggestions.map(
                              (suggestion, index) => (
                                <GlassButton
                                  key={`predictive-${index}`}
                                  className='glass-w-full glass-text-left glass-px-4 glass-py-3 glass-radius-xl hover:glass-surface-primary/20 glass-transition-colors glass-mb-2 glass-border glass-border'
                                  onClick={(e) => {
                                    setSearchQuery(suggestion);
                                    search.onSearch?.(suggestion);
                                    if (interactionRecorder) {
                                      interactionRecorder.recordClick({
                                        target: "predictive-search-suggestion",
                                        data: {
                                          value: suggestion,
                                          type: "predictive",
                                        },
                                      } as any);
                                    }
                                  }}
                                >
                                  <span className='glass-text-primary'>💡</span>{" "}
                                  {suggestion}
                                </GlassButton>
                              )
                            )}
                          </>
                        )}

                        {/* Original suggestions */}
                        {search.suggestions &&
                          search.suggestions.length > 0 && (
                            <>
                              {predictiveSearchSuggestions.length > 0 && (
                                <div className="glass-border-t glass-border-white/10 glass-my-2"></div>
                              )}
                              <div className='glass-text-xs glass-text-primary-glass-opacity-60 glass-font-medium glass-mb-2 glass-px-2'>
                                Recent
                              </div>
                              {search.suggestions.map((suggestion, index) => (
                                <GlassButton
                                  key={`original-${index}`}
                                  className='glass-w-full glass-text-left glass-px-4 glass-py-3 glass-radius-xl hover:glass-surface-subtle glass-transition-colors glass-mb-2 last:glass-mb-0'
                                  onClick={(e) => {
                                    setSearchQuery(suggestion);
                                    search.onSearch?.(suggestion);
                                    if (interactionRecorder) {
                                      interactionRecorder.recordClick({
                                        target: "search-suggestion",
                                        data: {
                                          value: suggestion,
                                          type: "regular",
                                        },
                                      } as any);
                                    }
                                  }}
                                >
                                  {suggestion}
                                </GlassButton>
                              ))}
                            </>
                          )}
                      </div>
                    </OptimizedGlass>
                  </Motion>
                )}
            </div>
          )}

          {/* Breadcrumbs */}
          {breadcrumbs && !search && (
            <div className="glass-flex glass-items-center">{breadcrumbs}</div>
          )}

          {/* Custom content */}
          {children && !search && !breadcrumbs && (
            <div className="glass-flex glass-items-center">{children}</div>
          )}
        </div>

        {/* Right section */}
        <div className="glass-flex glass-items-center glass-gap-2">
          {/* Actions */}
          {(actions || []).map((action) => (
            <NotificationButton key={action.id} action={action} />
          ))}

          {/* User Menu */}
          {userMenu && <UserMenu {...userMenu} />}
        </div>
      </OptimizedGlass>
    );
  }
);

GlassHeader.displayName = "GlassHeader";

/**
 * NotificationButton component
 */
interface NotificationButtonProps {
  action: HeaderAction;
}

function NotificationButton({ action }: NotificationButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Close on Escape for accessibility and convenience
  React.useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  return (
    <div className='glass-relative'>
      <GlassButton
        variant="ghost"
        flat
        onClick={(e) => {
          setIsOpen(!isOpen);
          action.onClick?.();
        }}
        disabled={action.disabled}
        className={cn(
          "relative glass-p-2 glass-radius-md transition-colors glass-focus",
          "hover:bg-white/10",
          action.disabled && "opacity-50 cursor-not-allowed"
        )}
        aria-label={action.label}
      >
        <div className='glass-w-5 glass-h-5 glass-flex glass-items-center glass-justify-center'>
          {action.icon}
        </div>
        {action.badge && (
          <span className='glass-absolute glass-top-0 glass-right-0 glass-z-20 glass-pointer-events-none glass-surface-danger glass-text-primary glass-text-xs glass-radius-full glass-min-glass-w-4 glass-h-4 glass-flex glass-items-center glass-justify-center glass-px-1 glass-font-semibold glass-shadow-md'>
            {action.badge}
          </span>
        )}
      </GlassButton>

      {/* Notification Dropdown */}
      {isOpen && action.id === "notifications" && (
        <Motion
          preset="slideDown"
          className='glass-absolute glass-top-full glass-right-0 glass-mt-2 glass-z-1000'
        >
          <OptimizedGlass
            intent="neutral"
            elevation={"level4"}
            intensity="strong"
            depth={2}
            tint="neutral"
            border="subtle"
            animation="none"
            performanceMode="medium"
            className='glass-w-80 glass-ring-1 glass-ring-white-opacity-10 glass-shadow-[0_12px_40px_rgba(17,24,39,0.45)] glass-radius-xl'
          >
            <div className="glass-p-4">
              <h3 className='glass-font-semibold glass-text-primary glass-mb-3 glass-flex glass-items-center glass-justify-between'>
                Notifications
                <span className='glass-text-xs glass-text-primary glass-surface-primary/10 glass-px-2 glass-py-1 glass-radius-full'>
                  3
                </span>
              </h3>
              <div className='glass-gap-3 glass-max-glass-h-64 glass-overflow-y-auto'>
                <div className='glass-p-3 glass-surface-subtle/8 glass-border glass-border-white/15 glass-transition-colors glass-cursor-pointer glass-shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] glass-radius-xl'>
                  <div className="glass-flex glass-items-start glass-justify-between">
                    <div>
                      <p className='glass-text-sm glass-text-primary glass-font-medium'>
                        New evaluation completed
                      </p>
                      <p className='glass-text-xs glass-text-primary glass-mt-1'>
                        Customer Support QA Template
                      </p>
                    </div>
                    <span className='glass-w-2 glass-h-2 glass-surface-primary glass-radius-full glass-mt-2'></span>
                  </div>
                  <p className='glass-text-xs glass-text-primary-opacity-70 glass-mt-2'>
                    2 minutes ago
                  </p>
                </div>
                <div className='glass-p-3 glass-surface-subtle/8 glass-border glass-border-white/15 glass-transition-colors glass-cursor-pointer glass-shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] glass-radius-xl'>
                  <div className="glass-flex glass-items-start glass-justify-between">
                    <div>
                      <p className='glass-text-sm glass-text-primary glass-font-medium'>
                        Model comparison ready
                      </p>
                      <p className="glass-text-xs glass-text-success glass-mt-1">
                        GPT-4 vs Claude-3.5 Sonnet
                      </p>
                    </div>
                    <span className='glass-w-2 glass-h-2 glass-surface-success glass-radius-full glass-mt-2'></span>
                  </div>
                  <p className='glass-text-xs glass-text-primary-opacity-70 glass-mt-2'>
                    15 minutes ago
                  </p>
                </div>
                <div className='glass-p-3 glass-surface-subtle/8 glass-border glass-border-white/15 glass-transition-colors glass-cursor-pointer glass-shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] glass-radius-xl'>
                  <div className="glass-flex glass-items-start glass-justify-between">
                    <div>
                      <p className='glass-text-sm glass-text-primary glass-font-medium'>
                        Team member joined
                      </p>
                      <p className='glass-text-xs glass-text-primary glass-mt-1'>
                        Sarah Chen joined your organization
                      </p>
                    </div>
                    <span className='glass-w-2 glass-h-2 glass-surface-primary glass-radius-full glass-mt-2'></span>
                  </div>
                  <p className='glass-text-xs glass-text-primary-opacity-70 glass-mt-2'>
                    1 hour ago
                  </p>
                </div>
              </div>
              <div className="glass-pt-3 glass-mt-3 glass-border-t glass-border-white/10">
                <GlassButton className='glass-w-full glass-text-sm glass-text-primary hover:glass-text-secondary glass-font-medium glass-transition-colors glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-[14px]'>
                  View all notifications
                </GlassButton>
              </div>
            </div>
          </OptimizedGlass>
        </Motion>
      )}

      {/* Backdrop for closing */}
      {isOpen && (
        <div className='glass-fixed glass-inset-0 glass-z-40' onClick={(e) => setIsOpen(false)} />
      )}
    </div>
  );
}

/**
 * UserMenu component
 */
interface UserMenuProps {
  user: {
    name: string;
    email?: string;
    avatar?: string;
    status?: "online" | "away" | "busy" | "offline";
  };
  items: UserMenuItem[];
}

function UserMenu({ user, items }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const statusColors = {
    online: "glass-surface-success",
    away: "glass-surface-warning",
    busy: "glass-surface-danger",
    offline: "glass-surface-primary",
  };

  const handleItemClick = (item: UserMenuItem) => {
    if (item?.disabled) return;

    item?.onClick?.();
    setIsOpen(false);

    if (item?.href) {
      window.location.href = item?.href;
    }
  };

  return (
    <div className='glass-relative'>
      <GlassButton
        variant="ghost"
        flat
        ref={triggerRef}
        onClick={(e) => setIsOpen(!isOpen)}
        className='glass-flex glass-items-center glass-gap-2 glass-p-1 glass-radius-md hover:glass-surface-subtle/5 active:glass-surface-subtle/10 glass-transition-colors'
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <div className='glass-relative'>
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className='glass-w-8 glass-h-8 glass-radius-full glass-object-cover'
            />
          ) : (
            <div className='glass-w-8 glass-h-8 glass-radius-full glass-surface-primary/20 glass-flex glass-items-center glass-justify-center'>
              <span
                className='glass-text-sm glass-font-medium'
                suppressHydrationWarning
              >
                {user.name.charAt(0)}
              </span>
            </div>
          )}

          {user.status && (
            <div
              className={cn(
                "absolute -bottom-0.5 -right-0.5 w-3 h-3 glass-radius-full border-2 border-background",
                statusColors?.[user.status]
              )}
            />
          )}
        </div>

        <div className='glass-hidden sm:glass-block glass-text-left'>
          <p
            className='glass-text-sm glass-font-medium glass-text-primary'
            suppressHydrationWarning
          >
            {user.name}
          </p>
          {user.email && (
            <p
              className='glass-text-xs glass-text-primary-opacity-70'
              suppressHydrationWarning
            >
              {user.email}
            </p>
          )}
        </div>

        <svg
          className={cn(
            "w-4 h-4 transition-transform duration-200",
            isOpen ? "rotate-180" : "rotate-0"
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </GlassButton>

      {/* Dropdown menu */}
      {isOpen && (
        <Motion
          preset="slideDown"
          className='glass-absolute glass-top-full glass-right-0 glass-mt-2 glass-z-1000'
        >
          <OptimizedGlass
            intent="neutral"
            elevation={"level4"}
            intensity="strong"
            depth={2}
            tint="neutral"
            border="subtle"
            animation="none"
            performanceMode="medium"
            className='glass-w-80 glass-p-1 glass-ring-1 glass-ring-white-opacity-10 glass-shadow-[0_20px_60px_rgba(2,8,23,0.55)] glass-radius-2xl'
          >
            <FocusTrap active={isOpen} onEscape={() => setIsOpen(false)}>
              <div className="glass-p-3">
                {/* User info header */}
                <div className='glass-px-3 glass-py-3 glass-gradient-primary glass-gradient-primary glass-via-white-opacity-3 glass-gradient-primary glass-border glass-border-white/12 glass-radius-[18px] glass-mb-2 glass-shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]'>
                  <div className="glass-flex glass-items-center glass-gap-3">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className='glass-w-10 glass-h-10 glass-radius-full glass-object-cover glass-border-2 glass-border-white/20'
                      />
                    ) : (
                      <div className='glass-w-10 glass-h-10 glass-radius-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-flex glass-items-center glass-justify-center glass-border-2 glass-border-white/20'>
                        <span
                          className='glass-text-primary glass-font-semibold'
                          suppressHydrationWarning
                        >
                          {user.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <p
                        className='glass-font-semibold glass-text-primary glass-text-sm'
                        suppressHydrationWarning
                      >
                        {user.name}
                      </p>
                      {user.email && (
                        <p
                          className='glass-text-xs glass-text-primary'
                          suppressHydrationWarning
                        >
                          {user.email}
                        </p>
                      )}
                      {user.status && (
                        <div className="glass-flex glass-items-center glass-gap-1 glass-mt-1">
                          <span
                            className={cn(
                              "w-2 h-2 glass-radius-full",
                              statusColors?.[user.status]
                            )}
                          />
                          <span className='glass-text-xs glass-text-primary-opacity-70 glass-capitalize'>
                            {user.status}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Menu items */}
                <div className="glass-gap-1">
                  {items.map((item) => (
                    <React.Fragment key={item?.id}>
                      {item?.divider ? (
                        <div className="glass-my-2 glass-border-t glass-border-white/10" />
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => handleItemClick(item)}
                          disabled={item?.disabled}
                          className={cn(
                            "w-full flex items-center justify-between glass-gap-3 glass-px-3 glass-py-2.5 rounded-[14px]",
                            "glass-text-sm text-left transition-colors",
                            item?.id === "logout"
                              ? "glass-text-danger hover:glass-surface-danger/10"
                              : "glass-text-primary/90 hover:glass-text-primary hover:bg-white/10",
                            item?.disabled && "opacity-50 cursor-not-allowed"
                          )}
                        >
                          <span className='glass-inline-glass-flex glass-items-center glass-gap-3 glass-truncate'>
                            {item?.icon && (
                              <span
                                className={cn(
                                  "w-4 h-4 flex items-center justify-center",
                                  item?.id === "logout"
                                    ? "glass-text-danger"
                                    : "glass-text-primary/80"
                                )}
                              >
                                {item?.icon}
                              </span>
                            )}
                            <span className='glass-truncate glass-font-medium'>
                              {item?.label}
                            </span>
                          </span>
                          {item?.id !== "logout" && (
                            <svg
                              className='glass-w-4 glass-h-4 glass-text-primary-glass-opacity-40'
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          )}
                        </button>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </FocusTrap>
          </OptimizedGlass>
        </Motion>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div className='glass-fixed glass-inset-0 glass-z-40' onClick={(e) => setIsOpen(false)} />
      )}
    </div>
  );
}

/**
 * HeaderBreadcrumbs component
 */
export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface HeaderBreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  className?: string;
}

export function HeaderBreadcrumbs({
  items,
  separator = "/",
  className,
}: HeaderBreadcrumbsProps) {
  return (
    <nav
      className={cn("flex items-center glass-gap-2 glass-text-sm", className)}
      aria-label="Breadcrumb"
    >
      <ol className="glass-flex glass-items-center glass-gap-2">
        {items.map((item, index) => (
          <li key={index} className="glass-flex glass-items-center glass-gap-2">
            {index > 0 && (
              <span className="glass-text-secondary">{separator}</span>
            )}

            {index === (items?.length || 0) - 1 ? (
              <span className='glass-font-medium glass-text-primary'>{item?.label}</span>
            ) : item?.href ? (
              <a
                href={item?.href}
                className='glass-text-secondary hover:glass-text-primary glass-transition-colors glass-focus glass-touch-target glass-contrast-guard'
              >
                {item?.label}
              </a>
            ) : item?.onClick ? (
              <GlassButton
                onClick={item?.onClick}
                className='glass-text-secondary hover:glass-text-primary glass-transition-colors'
              >
                {item?.label}
              </GlassButton>
            ) : (
              <span className="glass-text-secondary">{item?.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/**
 * HeaderNavigation component
 */
export interface NavItem {
  label: string;
  href?: string;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
}

export interface HeaderNavigationProps {
  items: NavItem[];
  className?: string;
}

export function HeaderNavigation({ items, className }: HeaderNavigationProps) {
  return (
    <nav className={className}>
      <ul className="glass-flex glass-items-center glass-gap-1">
        {items.map((item, index) => (
          <li key={index}>
            {item?.href ? (
              <a
                href={item?.href}
                className={cn(
                  "glass-px-3 glass-py-2 glass-radius-md glass-text-sm font-medium transition-colors",
                  "hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20",
                  {
                    "bg-primary/10 text-primary": item?.active,
                    "glass-text-secondary hover:text-foreground": !item?.active,
                    "opacity-50 cursor-not-allowed": item?.disabled,
                  }
                )}
                aria-current={item?.active ? "page" : undefined}
              >
                {item?.label}
              </a>
            ) : (
              <GlassButton
                onClick={item?.onClick}
                disabled={item?.disabled}
                className={cn(
                  "glass-px-3 glass-py-2 glass-radius-md glass-text-sm font-medium transition-colors",
                  "hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20",
                  {
                    "bg-primary/10 text-primary": item?.active,
                    "glass-text-secondary hover:text-foreground": !item?.active,
                    "opacity-50 cursor-not-allowed": item?.disabled,
                  }
                )}
                aria-current={item?.active ? "page" : undefined}
              >
                {item?.label}
              </GlassButton>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

/**
 * Enhanced GlassHeader with consciousness features enabled by default
 * Use this for headers that should be intelligent and adaptive
 */
export const ConsciousGlassHeader = forwardRef<
  HTMLDivElement,
  GlassHeaderProps
>((props, ref) => (
  <GlassHeader
    ref={ref}
    predictive={true}
    adaptive={true}
    biometricResponsive={true}
    trackAchievements={true}
    achievementId="conscious_header_usage"
    usageContext="main"
    {...props}
  />
));

ConsciousGlassHeader.displayName = "ConsciousGlassHeader";

/**
 * Predictive header with intelligent search suggestions and navigation tracking
 */
export const PredictiveHeader = forwardRef<HTMLDivElement, GlassHeaderProps>(
  (props, ref) => (
    <GlassHeader
      ref={ref}
      predictive={true}
      preloadContent={true}
      trackAchievements={true}
      achievementId="predictive_header_usage"
      usageContext="main"
      {...props}
    />
  )
);

PredictiveHeader.displayName = "PredictiveHeader";

/**
 * Gaze-responsive header with eye tracking for enhanced interactions
 */
export const GazeResponsiveHeader = forwardRef<
  HTMLDivElement,
  GlassHeaderProps
>((props, ref) => (
  <GlassHeader
    ref={ref}
    eyeTracking={true}
    gazeResponsive={true}
    spatialAudio={true}
    audioFeedback={true}
    trackAchievements={true}
    achievementId="gaze_header_interaction"
    usageContext="main"
    {...props}
  />
));

GazeResponsiveHeader.displayName = "GazeResponsiveHeader";

/**
 * Accessibility-focused header with biometric adaptation and spatial audio
 */
export const AccessibleHeader = forwardRef<HTMLDivElement, GlassHeaderProps>(
  (props, ref) => (
    <GlassHeader
      ref={ref}
      adaptive={true}
      biometricResponsive={true}
      spatialAudio={true}
      audioFeedback={true}
      trackAchievements={true}
      achievementId="accessible_header_usage"
      usageContext="main"
      {...props}
    />
  )
);

AccessibleHeader.displayName = "AccessibleHeader";

/**
 * Pre-configured consciousness header presets
 */
export const HeaderConsciousnessPresets = {
  /**
   * Minimal consciousness features for performance-sensitive contexts
   */
  minimal: {
    predictive: true,
    trackAchievements: true,
  },

  /**
   * Balanced consciousness features for general use
   */
  balanced: {
    predictive: true,
    adaptive: true,
    biometricResponsive: true,
    trackAchievements: true,
  },

  /**
   * Full consciousness features for immersive experiences
   */
  immersive: {
    predictive: true,
    preloadContent: true,
    eyeTracking: true,
    gazeResponsive: true,
    adaptive: true,
    biometricResponsive: true,
    spatialAudio: true,
    audioFeedback: true,
    trackAchievements: true,
  },

  /**
   * Accessibility-focused consciousness features
   */
  accessible: {
    adaptive: true,
    biometricResponsive: true,
    spatialAudio: true,
    audioFeedback: true,
    trackAchievements: true,
  },
} as const;