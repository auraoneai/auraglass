/**
 * EnhancedGlassTabs Component
 *
 * High-contrast, accessibility-focused tab component for chart navigation
 * with glass morphism styling.
 */
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from "react";
import { cn } from "../../lib/utilsComprehensive";
import { OptimizedGlass, Motion } from "../../primitives";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useA11yId } from "@/utils/a11y";

/**
 * TabItem interface
 */
export interface TabItem {
  /**
   * Unique ID for the tab
   */
  id: string;

  /**
   * Display label for the tab
   */
  label: string;

  /**
   * Optional badge count to display
   */
  badgeCount?: number;

  /**
   * Whether the tab is disabled
   */
  disabled?: boolean;

  /**
   * Optional icon component
   */
  icon?: React.ReactNode;
}

/**
 * EnhancedGlassTabs props interface
 */
export interface EnhancedGlassTabsProps {
  /**
   * Array of tab items
   */
  tabs: TabItem[];

  /**
   * Currently active tab ID
   */
  activeTab?: string;

  /**
   * Callback when tab changes
   */
  onChange?: (tabId: string) => void;

  /**
   * Visual variant of the tabs
   */
  variant?: "default" | "elevated" | "outlined" | "text";

  /**
   * Size of the tabs
   */
  size?: "small" | "medium" | "large";

  /**
   * Color scheme for the tabs
   */
  color?: "primary" | "secondary" | "accent" | "light" | "dark";

  /**
   * Whether to use high contrast mode
   */
  highContrast?: boolean;

  /**
   * Animation behavior of the indicator
   */
  indicatorAnimation?: "slide" | "fade" | "none";

  /**
   * Whether to stretch tabs to fill width
   */
  fullWidth?: boolean;

  /**
   * Default tab to select if none provided
   */
  defaultTab?: string;

  /**
   * Whether to apply physics motion effects
   */
  physicsEnabled?: boolean;

  /**
   * Whether to show the active indicator
   */
  showIndicator?: boolean;

  /**
   * Text alignment within tabs
   */
  textAlign?: "center" | "left" | "right";

  /**
   * Additional CSS class name
   */
  className?: string;

  /**
   * Inline styles
   */
  style?: React.CSSProperties;

  /**
   * Whether to respect motion preferences for animations
   */
  respectMotionPreference?: boolean;
}

// Ref interface
export interface EnhancedGlassTabsRef {
  /** Gets the main tabs container DOM element */
  getContainerElement: () => HTMLDivElement | null;
  /** Programmatically sets the active tab */
  setActiveTab: (tabId: string) => void;
  /** Gets the ID of the currently active tab */
  getActiveTab: () => string;
  /** Get the DOM element for a specific tab button */
  getTabElement: (tabId: string) => HTMLButtonElement | null;
}

// Color utility functions
const getTabColors = (
  color: EnhancedGlassTabsProps["color"],
  isDarkMode: boolean,
  highContrast: boolean
) => {
  const baseColors = {
    primary: { light: "#4B66EA", dark: "#6366F1" },
    secondary: { light: "#8B5CF6", dark: "#A855F7" },
    accent: { light: "#EC4899", dark: "#F472B6" },
    light: { light: "var(--glass-gray-50)", dark: "var(--glass-gray-100)" },
    dark: { light: "var(--glass-gray-800)", dark: "var(--glass-gray-900)" },
  };

  const selectedColor =
    baseColors?.[color || "primary"][isDarkMode ? "dark" : "light"];

  return {
    activeColor: selectedColor,
    activeBg: isDarkMode ? `${selectedColor}22` : `${selectedColor}11`,
    activeText: highContrast
      ? isDarkMode
        ? "var(--glass-white)"
        : "var(--glass-black)"
      : selectedColor,
    inactiveText: isDarkMode
      ? highContrast
        ? "rgba(var(--glass-color-white) / var(--glass-opacity-80))"
        : "rgba(var(--glass-color-white) / var(--glass-opacity-60))"
      : highContrast
        ? "var(--glass-text-secondary-dark)"
        : "var(--glass-text-tertiary-dark)",
    hoverBg: isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)",
    disabledText: isDarkMode
      ? "var(--glass-bg-hover)"
      : "rgba(var(--glass-color-black) / var(--glass-opacity-30))",
  };
};

// Utility to detect dark mode preference
const useIsDarkMode = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return isDark;
};

/**
 * EnhancedGlassTabs Component
 */
export const EnhancedGlassTabs = forwardRef<
  EnhancedGlassTabsRef,
  EnhancedGlassTabsProps
>(
  (
    {
      tabs,
      activeTab,
      onChange,
      variant = "default",
      size = "medium",
      color = "primary",
      highContrast = false,
      indicatorAnimation = "slide",
      fullWidth = false,
      defaultTab,
      physicsEnabled = true,
      showIndicator = true,
      textAlign = "center",
      className,
      style,
      respectMotionPreference = true,
    },
    ref
  ) => {
    // Check for reduced motion preference
    const prefersReducedMotion = useReducedMotion();
    const shouldReduceMotion = respectMotionPreference && prefersReducedMotion;
    const isDarkMode = useIsDarkMode();

    // Generate unique IDs for accessibility
    const tablistId = useA11yId("tablist");
    const tabIdPrefix = useA11yId("tab");

    // Refs for tab elements
    const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

    // Ref for the container element
    const containerRef = useRef<HTMLDivElement>(null);

    // State for currently active tab
    const [currentTab, setCurrentTab] = useState(
      activeTab || defaultTab || ((tabs?.length || 0) > 0 ? tabs[0].id : "")
    );

    // State for indicator position
    const [indicatorStyle, setIndicatorStyle] = useState<{
      left: number;
      width: number;
      height: number;
      bottom: number;
    }>({
      left: 0,
      width: 0,
      height: 2,
      bottom: 0,
    });

    // Handle tab change
    const handleTabChange = (tabId: string) => {
      if (currentTab !== tabId) {
        setCurrentTab(tabId);
        if (onChange) {
          onChange(tabId);
        }
      }
    };

    // --- Imperative Handle (Moved After Handlers) ---
    useImperativeHandle(
      ref,
      () => ({
        getContainerElement: () => containerRef.current,
        setActiveTab: (tabId) => {
          if (tabs.some((tab) => tab.id === tabId)) {
            handleTabChange(tabId);
          }
        },
        getActiveTab: () => currentTab,
        getTabElement: (tabId) => tabRefs.current?.[tabId] || null,
      }),
      [
        containerRef,
        currentTab,
        tabs,
        handleTabChange, // Dependency
        tabRefs, // Dependency
      ]
    );

    // Update active tab when controlled prop changes
    useEffect(() => {
      if (activeTab !== undefined && activeTab !== currentTab) {
        setCurrentTab(activeTab);
      }
    }, [activeTab]);

    // Update indicator position when active tab changes
    useEffect(() => {
      // Function to update the indicator position based on current tab
      const updateIndicatorPosition = () => {
        const activeTabElement = tabRefs.current?.[currentTab];
        if (activeTabElement && containerRef.current) {
          const { left, width } = activeTabElement.getBoundingClientRect();
          const containerLeft =
            containerRef.current.getBoundingClientRect().left || 0;
          const relativeLeft = left - containerLeft;

          const finalHeight = size === "small" ? 2 : size === "large" ? 4 : 3;
          const finalBottom = 0;

          setIndicatorStyle({
            left: relativeLeft,
            width,
            height: finalHeight,
            bottom: finalBottom,
          });
        }
      };

      // Run once immediately
      updateIndicatorPosition();

      // Set up resize observer to update indicator on tab resize
      const resizeObserver = new ResizeObserver(() => {
        updateIndicatorPosition();
      });

      // Observe the container and current tab element
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }

      const activeTabElement = tabRefs.current?.[currentTab];
      if (activeTabElement) {
        resizeObserver.observe(activeTabElement);
      }

      // Add window resize listener
      window.addEventListener("resize", updateIndicatorPosition);

      // Clean up
      return () => {
        resizeObserver.disconnect();
        window.removeEventListener("resize", updateIndicatorPosition);
      };
    }, [currentTab, size]); // Only re-run when tab or size changes

    // Get color scheme for styling
    const colors = useMemo(
      () => getTabColors(color, isDarkMode, highContrast),
      [color, isDarkMode, highContrast]
    );

    // Size-based styling
    const sizeClasses = {
      small: {
        padding: "glass-py-2 glass-px-4",
        text: "glass-text-sm",
        indicatorHeight: 2,
      },
      medium: {
        padding: "glass-py-3 px-5",
        text: "glass-text-base",
        indicatorHeight: 3,
      },
      large: {
        padding: "glass-py-4 glass-px-6",
        text: "glass-text-lg",
        indicatorHeight: 4,
      },
    };

    const sizeConfig = sizeClasses[size];

    // Text alignment classes
    const alignmentClasses = {
      left: "justify-start",
      center: "justify-center",
      right: "justify-end",
    };

    return (
      <OptimizedGlass
        ref={containerRef}
        intent="neutral"
        elevation={variant === "elevated" ? "level2" : "level1"}
        tier="medium"
        intensity="medium"
        depth={2}
        tint="neutral"
        border={variant === "outlined" ? "subtle" : "none"}
        animation={shouldReduceMotion ? "none" : "gentle"}
        performanceMode="medium"
        className={cn(
          "flex relative overflow-hidden w-full glass-radius-lg",
          {
            "bg-transparent": variant === "text",
          },
          className
        )}
        style={style}
      >
        <div
          className={cn("flex w-full relative", {
            "[&>*]:flex-1": fullWidth,
          })}
          role="tablist"
          aria-orientation="horizontal"
          id={tablistId}
        >
          {tabs.map((tab) => {
            const isActive = currentTab === tab.id;

            return (
              <button
                key={tab.id}
                ref={(element) => {
                  if (tabRefs.current) tabRefs.current[tab.id] = element;
                }}
                role="tab"
                id={`${tabIdPrefix}-${tab.id}`}
                tabIndex={tab.disabled ? -1 : isActive ? 0 : -1}
                aria-selected={isActive}
                aria-controls={`tabpanel-${tab.id}`}
                disabled={tab.disabled}
                className={cn(
                  "relative flex items-center glass-gap-2 whitespace-nowrap border-none cursor-pointer",
                  "outline-none transition-all duration-200 ease-out",
                  "glass-focus glass-touch-target glass-contrast-guard",
                  "focus-visible:ring-2 focus-visible:ring-offset-2",
                  sizeConfig.padding,
                  sizeConfig.text,
                  alignmentClasses[textAlign],
                  {
                    "cursor-not-allowed opacity-50": tab.disabled,
                    "bg-transparent": !isActive,
                    "font-semibold": isActive,
                    "font-medium": !isActive,
                  }
                )}
                style={
                  {
                    color: tab.disabled
                      ? colors.disabledText
                      : isActive
                        ? colors.activeText
                        : colors.inactiveText,
                    backgroundColor: isActive ? colors.activeBg : "transparent",
                  } as React.CSSProperties
                }
                onMouseEnter={(e) => {
                  if (!tab.disabled && !isActive) {
                    e.currentTarget.style.backgroundColor = colors.hoverBg;
                    e.currentTarget.style.color = colors.activeText;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!tab.disabled && !isActive) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = colors.inactiveText;
                  }
                }}
                onClick={() => !tab.disabled && handleTabChange(tab.id)}
              >
                {tab.icon && <span aria-hidden="true">{tab.icon}</span>}
                <span>{tab.label}</span>
                {tab.badgeCount !== undefined && tab.badgeCount > 0 && (
                  <span
                    className="glass-inline-flex glass-items-center glass-justify-center min-w-[18px] h-[18px] glass-px-1.5 glass-text-xs font-semibold text-primary glass-radius-full"
                    style={{ backgroundColor: colors.activeColor }}
                  >
                    {tab.badgeCount > 99 ? "99+" : tab.badgeCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Active indicator */}
        {showIndicator && currentTab && (
          <div
            className={cn("absolute pointer-events-none", {
              "transition-all duration-300 ease-out":
                indicatorAnimation === "slide" && !shouldReduceMotion,
              "transition-opacity duration-200 ease-out":
                indicatorAnimation === "fade" && !shouldReduceMotion,
            })}
            style={{
              left: `${indicatorStyle.left}px`,
              width: `${indicatorStyle.width}px`,
              height: `${sizeConfig.indicatorHeight}px`,
              bottom: `${indicatorStyle.bottom}px`,
              backgroundColor: colors.activeColor,
              borderRadius: `${sizeConfig.indicatorHeight / 2}px`,
              boxShadow: "var(--glass-elev-2)",
            }}
          />
        )}
      </OptimizedGlass>
    );
  }
);

// Add displayName
EnhancedGlassTabs.displayName = "EnhancedGlassTabs";

export default EnhancedGlassTabs;
