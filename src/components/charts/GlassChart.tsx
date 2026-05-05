"use client";
/**
 * GlassChart Component
 *
 * A unified chart container with glass styling, physics-based interactions,
 * and Z-Space layering. Acts as a wrapper for all chart types.
 */
// Typography tokens available via typography.css (imported in index.css)
import React, {
  useMemo,
  useState,
  useRef,
  useCallback,
  useEffect,
  forwardRef,
  useImperativeHandle,
  memo,
} from "react";
import { cn } from "@/lib/utils";

import { usePhysicsInteraction } from "../../hooks/usePhysicsInteraction";
import { zSpaceLayers } from "../../core/zspace";
import { createThemeContext } from "../../core/themeContext";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { createGlassStyle } from "../../core/mixins/glassMixins";
import { ANIMATION, COLORS } from "../../tokens/designConstants";
import {
  ContrastGuard,
  TextWithContrast,
} from "@/components/accessibility/ContrastGuard";

// Consciousness interface imports
import {
  usePredictiveEngine,
  useInteractionRecorder,
} from "../advanced/GlassPredictiveEngine";
import { useAchievements } from "../advanced/GlassAchievementSystem";
import { useBiometricAdaptation } from "../advanced/GlassBiometricAdaptation";
import { useEyeTracking } from "../advanced/GlassEyeTracking";
import { useSpatialAudio } from "../advanced/GlassSpatialAudio";

// Consciousness interface features
export interface ConsciousnessFeatures {
  /**
   * Enable predictive chart insights and data analysis
   */
  predictive?: boolean;
  /**
   * Enable predictive data preloading for chart interactions
   */
  preloadData?: boolean;
  /**
   * Enable eye tracking for chart element focus
   */
  eyeTracking?: boolean;
  /**
   * Enable gaze-responsive chart highlighting
   */
  gazeResponsive?: boolean;
  /**
   * Enable biometric adaptation for chart complexity
   */
  adaptive?: boolean;
  /**
   * Enable biometric responsive chart scaling and timing
   */
  biometricResponsive?: boolean;
  /**
   * Enable spatial audio for chart interactions
   */
  spatialAudio?: boolean;
  /**
   * Enable audio feedback for chart data points
   */
  audioFeedback?: boolean;
  /**
   * Enable achievement tracking for chart interactions
   */
  trackAchievements?: boolean;
  /**
   * Achievement identifier for chart usage
   */
  achievementId?: string;
  /**
   * Chart usage context for consciousness features
   */
  usageContext?:
    | "dashboard"
    | "analytics"
    | "report"
    | "presentation"
    | "exploration";
}

// Basic types
interface BaseChartProps {
  width?: string | number;
  height?: number;
  glass?: boolean;
  title?: string;
  description?: string;
  adaptToCapabilities?: boolean;
  onError?: (error: Error) => void;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * GlassChart props interface
 */
export interface GlassChartProps extends BaseChartProps, ConsciousnessFeatures {
  /**
   * The type of chart to render
   */
  type: "bar" | "line" | "area" | "pie" | "scatter";

  /**
   * Data for the chart
   */
  data?: any;

  /**
   * Force simplified mode (no advanced features)
   */
  forcedSimplified?: boolean;

  /**
   * Z-space elevation level
   */
  zElevation?: number;

  /**
   * Enable magnetic mouse effect
   */
  magneticEffect?: boolean;

  /**
   * Strength of magnetic effect
   */
  magneticStrength?: number;

  /**
   * Enable depth animation
   */
  depthAnimation?: boolean;

  /**
   * Tab configuration
   */
  tabs?: any;

  /**
   * Active tab ID
   */
  activeTab?: string;

  /**
   * Tab change handler
   */
  onTabChange?: (tabId: string) => void;

  /**
   * Additional chart props
   */
  chartProps?: any;

  /**
   * Custom toolbar items
   */
  toolbarItems?: any;

  /**
   * Accessible label for the chart container
   */
  "aria-label"?: string;

  /**
   * Allow switching chart types
   */
  allowTypeSwitch?: boolean;

  /**
   * Available chart types
   */
  availableTypes?: string[];

  /**
   * Focus mode
   */
  focusMode?: boolean;

  /**
   * Allow chart download
   */
  allowDownload?: boolean;

  /**
   * Download handler
   */
  onDownload?: () => void;

  /**
   * Theme override
   */
  theme?: any;
}

import { GlassAreaChart as AreaChart } from "./GlassAreaChart";
import { GlassBarChart as BarChart } from "./GlassBarChart";
import { GlassLineChart as LineChart } from "./GlassLineChart";
import { GlassPieChart as PieChart } from "./GlassPieChart";
import chartStyles from "./GlassChart.module.css";

interface AuraChartTheme {
  isDarkMode: boolean;
  colorMode: "light" | "dark";
  themeVariant: string;
  colors: Record<string, unknown>;
  zIndex: Record<string, number | string>;
}

// Ref interface
export interface GlassChartRef {
  /** Gets the main chart container DOM element */
  getContainerElement: () => HTMLDivElement | null;
  /** Gets the currently rendered chart type */
  getCurrentChartType: () => GlassChartProps["type"];
  /** Programmatically changes the rendered chart type */
  setChartType: (type: GlassChartProps["type"]) => void;
  /** Programmatically sets the active tab (if tabs are used) */
  setActiveTab: (tabId: string) => void;
  /** Programmatically triggers the download function (if configured) */
  downloadChart: () => void;
  /** Toggles the focus mode (if enabled) */
  toggleFocusMode: () => void;
}

/**
 * Styled container with glass effects
 */
const getElevationShadow = (level: number) => {
  switch (level) {
    case 0:
      return "none";
    case 1:
      return "var(--aura-shadow-elevation-1)";
    case 2:
      return "var(--aura-shadow-elevation-2)";
    case 3:
      return "var(--aura-shadow-elevation-3)";
    case 4:
      return "var(--aura-shadow-elevation-4)";
    default:
      return "var(--aura-shadow-elevation-2)";
  }
};

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  zElevation: number;
  height?: string | number;
  width?: string | number;
  focused: boolean;
}

const ChartContainer = forwardRef<HTMLDivElement, ChartContainerProps>(
  (
    { zElevation, height, width, focused, className, style, children, ...rest },
    ref
  ) => {
    const resolvedWidth =
      typeof width === "number" ? `${width}px` : width || "100%";
    const resolvedHeight =
      typeof height === "number" ? `${height}px` : height || "400px";

    return (
      <div
        ref={ref}
        className={cn(
          chartStyles.container,
          focused && chartStyles.containerFocused,
          className
        )}
        style={{
          width: resolvedWidth,
          height: resolvedHeight,
          boxShadow: getElevationShadow(zElevation),
          ...style,
        }}
        {...rest}
      >
        {children}
      </div>
    );
  }
);
ChartContainer.displayName = "ChartContainer";

const ChartHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => <div className={cn(chartStyles.header, className)} {...props} />;

const ChartTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  ...props
}) => <h3 className={cn(chartStyles.title, className)} {...props} />;

const ChartDescription: React.FC<
  React.HTMLAttributes<HTMLParagraphElement>
> = ({ className, ...props }) => (
  <p className={cn(chartStyles.description, className)} {...props} />
);

const ChartControls: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => <div className={cn(chartStyles.controls, className)} {...props} />;

const TabsContainer: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => <div className={cn(chartStyles.tabs, className)} {...props} />;

const ToolbarContainer: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => <div className={cn(chartStyles.toolbar, className)} {...props} />;

interface ChartTypeButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

const ChartTypeButton: React.FC<ChartTypeButtonProps> = ({
  active,
  className,
  ...props
}) => (
  <button
    className={cn(
      chartStyles.typeButton,
      active && chartStyles.typeButtonActive,
      className
    )}
    {...props}
  />
);

interface ChartContentProps extends React.HTMLAttributes<HTMLDivElement> {
  focused: boolean;
}

const ChartContent: React.FC<ChartContentProps> = ({
  focused,
  className,
  ...props
}) => (
  <div
    className={cn(
      chartStyles.content,
      focused && chartStyles.contentFocused,
      className
    )}
    {...props}
  />
);

const FooterContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => <div className={cn(chartStyles.footer, className)} {...props} />;

/**
 * Chart SVG icons for type switching
 */
const ChartTypeIcons = {
  bar: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 18V7M12 18V11M16 18V15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  line: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 14L8 10L12 14L20 6M20 6V12M20 6H14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  area: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 14L8 10L12 14L20 6M20 6V12M20 6H14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 14V20H20V6L12 14L8 10L4 14Z"
        fill="currentColor"
        fillOpacity="0.2"
      />
    </svg>
  ),
  pie: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 12V2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 12L19 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 12L8 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

// Memoized theme helper function with cached default theme
const defaultTheme: AuraChartTheme = {
  isDarkMode: false,
  colorMode: "light",
  themeVariant: "nebula",
  colors: {
    nebula: {
      accentPrimary: COLORS.semantic.secondary,
      accentSecondary: COLORS.semantic.secondary,
      accentTertiary: COLORS.semantic.error,
      stateCritical: "var(--glass-color-danger)",
      stateOptimal: "var(--glass-color-success)",
      stateAttention: "var(--glass-color-warning)",
      stateInformational: "var(--glass-color-primary)",
      neutralBackground: "var(--glass-gray-50)",
      neutralForeground: "var(--glass-gray-800)",
      neutralBorder: "var(--glass-gray-200)",
      neutralSurface: "var(--glass-white)",
    },
    glass: {
      light: createGlassStyle({ intent: "neutral", elevation: "level2" }),
      dark: createGlassStyle({ intent: "neutral", elevation: "level2" }),
      tints: {
        primary:
          "color-mix(in srgb, var(--glass-color-primary) 10%, transparent)",
        secondary:
          "color-mix(in srgb, var(--glass-color-secondary) 10%, transparent)",
      },
    },
  },
  zIndex: {
    hide: -1,
    auto: "auto",
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
    glacial: 9999,
  },
};

// Helper function to ensure we have a properly typed theme
const ensureValidTheme = (themeInput: any): AuraChartTheme => {
  // If the theme is already a valid DefaultTheme return it
  if (
    themeInput &&
    typeof themeInput === "object" &&
    "isDarkMode" in themeInput &&
    "colorMode" in themeInput &&
    "themeVariant" in themeInput &&
    "colors" in themeInput &&
    "zIndex" in themeInput
  ) {
    return themeInput as AuraChartTheme;
  }

  // Return cached default theme instead of recreating
  return defaultTheme;
};

/**
 * Memoized helper function to transform Chart.js data format to chart data
 */
const transformChartJsData = (chartJsData: any): any[] => {
  if (
    !chartJsData ||
    !Array.isArray(chartJsData.datasets) ||
    !Array.isArray(chartJsData.labels)
  ) {
    // Return empty or handle error if format is unexpected
    return [];
  }

  return chartJsData.datasets.map((dataset: any, index: number) => ({
    id: dataset.id || `dataset-${index}`,
    name: dataset.label || `Dataset ${index + 1}`,
    color: dataset.borderColor || dataset.backgroundColor, // Use borderColor or backgroundColor as series color
    data: dataset.data?.map((value: number, pointIndex: number) => ({
      x: chartJsData.labels?.[pointIndex] || pointIndex,
      y: value,
      value,
      label: chartJsData.labels?.[pointIndex] || `Point ${pointIndex + 1}`,
    })),
  }));
};

const normalizeSeriesData = (input: any): any[] => {
  if (!Array.isArray(input)) return [];
  if (input.length === 0) return [];

  const first = input[0];
  if (first && Array.isArray(first.data)) {
    return input;
  }

  return [
    {
      id: "series-1",
      name: "Series 1",
      data: input.map((point: any, index: number) => ({
        x: point?.x ?? point?.label ?? index,
        y: Number(point?.y ?? point?.value ?? point ?? 0),
        label: point?.label ?? String(point?.x ?? index + 1),
        ...point,
      })),
    },
  ];
};

// Memoized performance hook implementation with caching
const performanceCache = {
  isPerformanceConstrained: false,
  canUseBlur: true,
  canUseGlassEffects: true,
  canUseAdvancedAnimations: true,
  isPoorPerformance: false,
};

const useGlassPerformance = () => performanceCache;

/**
 * Memoized GlassChart Component for better performance
 */
const GlassChartComponent = forwardRef<GlassChartRef, GlassChartProps>(
  (
    {
      type = "bar",
      data,
      width = "100%",
      height = 400,
      glass = true,
      title,
      description,
      forcedSimplified = false,
      zElevation = 2,
      magneticEffect = false,
      magneticStrength = 0.3,
      depthAnimation = false,
      adaptToCapabilities = true,
      tabs,
      activeTab,
      onTabChange,
      chartProps = {},
      toolbarItems,
      allowTypeSwitch = false,
      availableTypes = ["bar", "line", "area", "pie"],
      focusMode = false,
      allowDownload = false,
      onDownload,
      onError,
      style,
      className,
      theme: providedTheme,
      // Consciousness features
      predictive = false,
      preloadData = false,
      eyeTracking = false,
      gazeResponsive = false,
      adaptive = false,
      biometricResponsive = false,
      spatialAudio = false,
      audioFeedback = false,
      trackAchievements = false,
      achievementId,
      usageContext = "dashboard",
      "aria-label": ariaLabel,
      ...restProps
    },
    ref
  ) => {
    // Get theme from context or use the provided theme, and ensure it's valid
    const theme = ensureValidTheme(providedTheme);

    // Check for reduced motion preference
    const prefersReducedMotion = useReducedMotion();

    // Get device performance capabilities
    const performanceContext = useGlassPerformance();
    const isLowPerformanceDevice =
      performanceContext?.isPoorPerformance || false;

    // Determine if simplified rendering should be used
    const useSimplified = useMemo(() => {
      return (
        forcedSimplified || (adaptToCapabilities && isLowPerformanceDevice)
      );
    }, [forcedSimplified, adaptToCapabilities, isLowPerformanceDevice]);

    // State for active tab
    const [currentTab, setCurrentTab] = useState(
      activeTab || (tabs?.length ? tabs[0].id : "")
    );

    // State for current chart type when switching is allowed
    const [currentType, setCurrentType] = useState(type);

    // State for focus mode
    const [isFocused, setIsFocused] = useState(false);

    // Refs for chart container
    const containerRef = useRef<HTMLDivElement>(null);

    // Consciousness features state
    const [chartInsights, setChartInsights] = useState<any[]>([]);
    const [dataPatterns, setDataPatterns] = useState<any[]>([]);
    const [isPreloading, setIsPreloading] = useState(false);
    const [adaptiveComplexity, setAdaptiveComplexity] = useState<
      "low" | "medium" | "high"
    >("medium");
    const [currentDataFocus, setCurrentDataFocus] = useState<{
      seriesIndex: number;
      pointIndex: number;
    } | null>(null);

    // Consciousness feature hooks - only initialize if features are enabled
    const predictiveEngine = predictive ? usePredictiveEngine() : null;
    const eyeTracker = eyeTracking ? useEyeTracking() : null;
    const biometricAdapter = adaptive ? useBiometricAdaptation() : null;
    const spatialAudioEngine = spatialAudio ? useSpatialAudio() : null;
    const achievementTracker = trackAchievements ? useAchievements() : null;
    const interactionRecorder =
      predictive || trackAchievements
        ? useInteractionRecorder(`glass-chart-${usageContext}`)
        : null;

    // Chart insights and pattern analysis
    useEffect(() => {
      if (!predictive || !predictiveEngine || !data) return;

      const analyzeChartData = async () => {
        try {
          // Get patterns and insights from the predictive engine
          const patterns = predictiveEngine.engine?.getPatterns() || [];
          const insights = predictiveEngine.engine?.getInsights() || [];

          setDataPatterns(patterns || []);
          setChartInsights(insights || []);

          if (achievementTracker && trackAchievements) {
            achievementTracker.recordAction("chart_insights_generated", {
              chartType: currentType,
              insightsCount: insights?.length || 0,
              patternsFound: patterns?.length || 0,
              context: usageContext,
            });
          }
        } catch (error) {
          console.warn("Chart insights analysis failed:", error);
        }
      };

      analyzeChartData();
    }, [
      predictive,
      predictiveEngine,
      data,
      currentType,
      usageContext,
      achievementTracker,
      trackAchievements,
    ]);

    // Biometric adaptation for chart complexity
    useEffect(() => {
      if (!biometricResponsive || !biometricAdapter) return;

      const adaptChartComplexity = () => {
        const stressLevel = biometricAdapter.currentStressLevel;
        // For now, use a simple cognitive load estimation based on stress level
        const cognitiveLoad = stressLevel;
        // Assume desktop capabilities for now
        const deviceCapabilities = { isDesktop: true };

        // Adapt chart complexity based on biometric data
        if (stressLevel > 0.7 || cognitiveLoad > 0.8) {
          setAdaptiveComplexity("low"); // Simplified chart when stressed
        } else if (
          stressLevel < 0.3 &&
          cognitiveLoad < 0.4 &&
          deviceCapabilities.isDesktop
        ) {
          setAdaptiveComplexity("high"); // Full complexity when relaxed
        } else {
          setAdaptiveComplexity("medium"); // Balanced complexity
        }
      };

      // Initial adaptation
      adaptChartComplexity();

      // Listen for biometric changes
      const interval = setInterval(
        adaptChartComplexity,
        ANIMATION.DURATION.slower * 4
      );
      return () => clearInterval(interval);
    }, [biometricResponsive, biometricAdapter]);

    // Eye tracking for chart element focus
    useEffect(() => {
      if (!gazeResponsive || !eyeTracker || !containerRef.current) return;

      const handleGazeOnDataPoint = (element: HTMLElement) => {
        // Extract data point information from element attributes
        const seriesIndex = parseInt(
          element.getAttribute("data-series-index") || "0"
        );
        const pointIndex = parseInt(
          element.getAttribute("data-point-index") || "0"
        );

        setCurrentDataFocus({ seriesIndex, pointIndex });

        if (spatialAudioEngine && audioFeedback) {
          spatialAudioEngine.playGlassSound("data_focus", {
            x: element.offsetLeft,
            y: element.offsetTop,
            z: 0,
          });
        }

        if (achievementTracker && trackAchievements) {
          achievementTracker.recordAction("chart_data_gaze_focus", {
            seriesIndex,
            pointIndex,
            chartType: currentType,
            context: usageContext,
          });
        }
      };

      const handleGazeOffDataPoint = () => {
        setCurrentDataFocus(null);

        if (spatialAudioEngine && audioFeedback) {
          spatialAudioEngine.playGlassSound("data_blur");
        }
      };

      // Note: onGazeEnter/onGazeExit not available on current eye tracker interface
      // eyeTracker.onGazeEnter(containerRef.current, handleGazeOnDataPoint);
      // eyeTracker.onGazeExit(containerRef.current, handleGazeOffDataPoint);

      return () => {
        if (containerRef.current) {
          // eyeTracker.offGazeEnter(containerRef.current, handleGazeOnDataPoint);
          // eyeTracker.offGazeExit(containerRef.current, handleGazeOffDataPoint);
        }
      };
    }, [
      gazeResponsive,
      eyeTracker,
      spatialAudioEngine,
      audioFeedback,
      achievementTracker,
      trackAchievements,
      currentType,
      usageContext,
    ]);

    // Data preloading for chart interactions
    useEffect(() => {
      if (!preloadData || !predictiveEngine) return;

      const preloadChartData = async () => {
        setIsPreloading(true);
        try {
          // Note: preloadData not available on current predictive engine interface
          // await predictiveEngine.preloadData({
          //   chartType: currentType,
          //   context: usageContext,
          //   currentData: data,
          //   patterns: dataPatterns
          // });
        } catch (error) {
          console.warn("Chart data preloading failed:", error);
        } finally {
          setIsPreloading(false);
        }
      };

      preloadChartData();
    }, [
      preloadData,
      predictiveEngine,
      currentType,
      usageContext,
      data,
      dataPatterns,
    ]);

    // Use depth animation if enabled
    const zAnimationResult = {
      style: {},
      isAnimating: false,
      setDepth: () => {},
      resetDepth: () => {},
      setCustomPosition: (x: number, y: number, z: number) => {},
      reset: () => {},
    };

    // Store animation functions in a ref to avoid recreation
    const animationFunctionsRef = useRef({
      animate: () => {
        // Set a custom position to create animation effect
        zAnimationResult.setCustomPosition(0, 10, 20);
        setTimeout(() => zAnimationResult.reset(), ANIMATION.DURATION.slow);
      },
    });

    // Update the ref when zAnimationResult changes
    useEffect(() => {
      animationFunctionsRef.current.animate = () => {
        zAnimationResult.setCustomPosition(0, 10, 20);
        setTimeout(() => zAnimationResult.reset(), ANIMATION.DURATION.slow);
      };
    }, [zAnimationResult]);

    const depthStyles = zAnimationResult.style;

    // Flag to know if original data was Chart.js format
    const isChartJsDataFormat = useMemo(
      () =>
        data &&
        typeof data === "object" &&
        !Array.isArray(data) &&
        data?.datasets &&
        data?.labels,
      [data]
    );

    // Prepare data for non-pie charts
    const chartSeriesData = useMemo(() => {
      if (isChartJsDataFormat) {
        return transformChartJsData(data);
      }
      return normalizeSeriesData(data);
    }, [data, isChartJsDataFormat]);

    // Memoized handler functions for better performance
    // Handle tab change
    const handleTabChange = useCallback(
      (tabId: string) => {
        setCurrentTab(tabId);
        if (onTabChange) {
          onTabChange(tabId);
        }
      },
      [onTabChange]
    );

    // Handle chart type change
    const handleTypeChange = useCallback(
      (newType: GlassChartProps["type"]) => {
        const previousType = currentType;
        setCurrentType(newType);

        // Consciousness-enhanced type change tracking
        if (interactionRecorder) {
          // Create a synthetic mouse event for the type change
          const syntheticEvent = {
            currentTarget: { id: `chart-type-${newType}` },
            clientX: 0,
            clientY: 0,
            button: 0,
            ctrlKey: false,
            altKey: false,
            shiftKey: false,
          } as any;
          interactionRecorder.recordClick(syntheticEvent);
        }

        // Spatial audio feedback for type changes
        if (spatialAudioEngine && audioFeedback) {
          spatialAudioEngine.playGlassSound("chart_type_change", undefined, {
            frequency: newType === "pie" ? 800 : newType === "line" ? 600 : 400,
          });
        }

        // Achievement tracking for chart exploration
        if (achievementTracker && trackAchievements) {
          achievementTracker.recordAction("chart_type_switch", {
            fromType: previousType,
            toType: newType,
            context: usageContext,
            timestamp: Date.now(),
          });
        }
      },
      [
        currentType,
        interactionRecorder,
        spatialAudioEngine,
        audioFeedback,
        achievementTracker,
        trackAchievements,
        usageContext,
      ]
    );

    // Handle focus mode toggle
    const handleFocusToggle = useCallback(() => {
      if (focusMode) {
        setIsFocused((prev: any) => {
          const newFocused = !prev;

          // Enhanced focus toggle with consciousness features
          if (depthAnimation && !prev) {
            animationFunctionsRef.current?.animate &&
              animationFunctionsRef.current.animate();
          }

          // Spatial audio for focus state changes
          if (spatialAudioEngine && audioFeedback) {
            spatialAudioEngine.playGlassSound(
              newFocused ? "chart_focus_enter" : "chart_focus_exit",
              undefined,
              {
                intensity: newFocused ? 0.8 : 0.4,
              }
            );
          }

          // Track focus interactions
          if (interactionRecorder) {
            // Create a synthetic focus event
            const syntheticEvent = {
              currentTarget: { id: "chart-container" },
              type: newFocused ? "focus" : "blur",
            } as any;
            interactionRecorder.recordFocus(syntheticEvent);
          }

          // Achievement tracking for focused chart analysis
          if (achievementTracker && trackAchievements && newFocused) {
            achievementTracker.recordAction("chart_focus_mode_entered", {
              chartType: currentType,
              context: usageContext,
              hasInsights: chartInsights.length > 0,
            });
          }

          return newFocused;
        });
      }
    }, [
      focusMode,
      depthAnimation,
      spatialAudioEngine,
      audioFeedback,
      interactionRecorder,
      currentType,
      usageContext,
      achievementTracker,
      trackAchievements,
      chartInsights.length,
    ]);

    // Handle download with consciousness tracking
    const handleDownload = useCallback(() => {
      // Spatial audio feedback for download action
      if (spatialAudioEngine && audioFeedback) {
        spatialAudioEngine.playGlassSound("chart_download", undefined, {
          frequency: 500,
          duration: ANIMATION.DURATION.normal,
        });
      }

      // Track download interactions
      if (interactionRecorder) {
        // Create a synthetic mouse event for the download
        const syntheticEvent = {
          currentTarget: { id: "chart-download" },
          clientX: 0,
          clientY: 0,
          button: 0,
          ctrlKey: false,
          altKey: false,
          shiftKey: false,
        } as any;
        interactionRecorder.recordClick(syntheticEvent);
      }

      // Achievement tracking for chart exports
      if (achievementTracker && trackAchievements) {
        achievementTracker.recordAction("chart_exported", {
          chartType: currentType,
          context: usageContext,
          insightsCount: chartInsights.length,
          exportMethod: onDownload ? "custom" : "default",
        });
      }

      if (onDownload) {
        onDownload();
      } else {
        // Default download implementation - would need canvas conversion
        if (process.env.NODE_ENV === "development") {
          console.log("Download chart - custom implementation required");
        }
      }
    }, [
      onDownload,
      spatialAudioEngine,
      audioFeedback,
      interactionRecorder,
      currentType,
      usageContext,
      chartInsights.length,
      adaptiveComplexity,
      achievementTracker,
      trackAchievements,
    ]);

    // --- Imperative Handle (Moved After Handlers) ---
    useImperativeHandle(
      ref,
      () => ({
        getContainerElement: () => containerRef.current,
        getCurrentChartType: () => currentType,
        setChartType: (newType) => {
          if (availableTypes.includes(newType)) {
            handleTypeChange(newType);
          }
        },
        setActiveTab: (tabId: string) => {
          if (tabs?.some((tab: any) => tab.id === tabId)) {
            handleTabChange(tabId);
          }
        },
        downloadChart: () => {
          if (allowDownload) {
            handleDownload();
          }
        },
        toggleFocusMode: () => {
          if (focusMode) {
            handleFocusToggle();
          }
        },
      }),
      [
        containerRef,
        currentType,
        availableTypes,
        handleTypeChange, // Dependency
        tabs,
        handleTabChange, // Dependency
        allowDownload,
        handleDownload, // Dependency
        focusMode,
        handleFocusToggle, // Dependency
      ]
    );

    // Call the magnetic effect hook directly at component level
    const magneticEffectProps =
      magneticEffect && !prefersReducedMotion
        ? {
            type: "magnetic" as const,
            strength: magneticStrength,
            radius: 200,
            maxDisplacement: 10,
            affectsRotation: false,
            affectsScale: false,
            smooth: true,
          }
        : null;

    // Magnetic effect properties
    const magneticProps = {
      style: {},
      onMouseEnter: () => {},
      onMouseLeave: () => {},
      onMouseMove: () => {},
      ref: { current: null },
    };

    // Memoized chart props to prevent unnecessary re-renders
    const commonProps = useMemo(
      () => ({
        width: typeof width === "number" ? width : 640,
        height: typeof height === "number" ? height : 320,
        glass,
        title: undefined,
        description: undefined,
        adaptToCapabilities,
        simplified: useSimplified,
        onError,
        ...chartProps,
      }),
      [glass, adaptToCapabilities, useSimplified, onError, chartProps]
    );

    // Memoized pie data processing
    const pieData = useMemo(() => {
      if (currentType !== "pie") return [];

      let pieDataResult: any[] = [];

      if (isChartJsDataFormat) {
        const firstDataset = data?.datasets?.[0];
        if (firstDataset && Array.isArray(firstDataset.data)) {
          pieDataResult = firstDataset.data?.map(
            (value: number, index: number) => ({
              label: data?.labels?.[index] || `Slice ${index + 1}`,
              value: value,
              color: Array.isArray(firstDataset.backgroundColor)
                ? firstDataset.backgroundColor[
                    index % (firstDataset.backgroundColor?.length || 0)
                  ]
                : firstDataset.backgroundColor,
            })
          );
        }
      } else if (
        Array.isArray(data) &&
        data?.length > 0 &&
        data[0].value !== undefined
      ) {
        // Data looks like the expected format
        pieDataResult = data;
      } else if (Array.isArray(chartSeriesData) && chartSeriesData.length > 0) {
        // Extract data from the first series
        pieDataResult = chartSeriesData[0].data;
      }

      return pieDataResult;
    }, [currentType, isChartJsDataFormat, data, chartSeriesData]);

    // Optimized chart rendering with better memoization
    const renderChart = useCallback(() => {
      // Handle Pie/Doughnut data preparation separately
      if (currentType === "pie") {
        return <PieChart {...commonProps} data={pieData} />;
      }

      // Handle other chart types, passing chartSeriesData
      const chartDataForOtherTypes = chartSeriesData;

      if (useSimplified) {
        // Use default chart type when simplified
        return <div>Simplified chart view - {currentType}</div>;
      }

      switch (currentType) {
        case "bar":
          return <BarChart {...commonProps} data={chartDataForOtherTypes} />;
        case "line":
          return <LineChart {...commonProps} data={chartDataForOtherTypes} />;
        case "area":
          const { fillArea, ...otherAreaProps } = chartProps;
          return (
            <AreaChart
              {...commonProps}
              data={chartDataForOtherTypes}
              {...otherAreaProps}
            />
          );
        // Pie case handled above
        default:
          // Fallback or handle scatter etc.
          return <BarChart {...commonProps} data={chartDataForOtherTypes} />;
      }
      // Separate dependencies for chartSeriesData calculation from renderChart
    }, [
      currentType,
      isChartJsDataFormat,
      data,
      chartSeriesData,
      glass,
      chartProps,
      useSimplified,
      adaptToCapabilities,
      onError,
    ]);

    return (
      <ChartContainer
        ref={(element: HTMLDivElement | null) => {
          // Assign to internal ref
          if (containerRef.current !== element) {
            (
              containerRef as React.MutableRefObject<HTMLDivElement | null>
            ).current = element;
          }
          // Assign to magnetic ref if it exists
          if (magneticProps && magneticProps.ref) {
            (
              magneticProps.ref as React.MutableRefObject<HTMLDivElement | null>
            ).current = element;
          }
        }}
        zElevation={zElevation}
        width={width}
        height={height}
        focused={isFocused}
        style={{
          ...style,
          ...(magneticProps ? magneticProps.style : {}),
          ...(isFocused && depthAnimation ? depthStyles : {}),
        }}
        className={cn(
          className,
          gazeResponsive && currentDataFocus && "glass-chart-gaze-focused",
          isPreloading && "glass-chart-preloading",
          adaptiveComplexity === "low" && "glass-chart-simplified",
          adaptiveComplexity === "high" && "glass-chart-enhanced"
        )}
        onClick={handleFocusToggle}
        data-chart-type={currentType}
        data-usage-context={usageContext}
        data-consciousness-level={`${[predictive, eyeTracking, adaptive, spatialAudio].filter(Boolean).length}`}
        data-adaptive-complexity={adaptiveComplexity}
        data-insights-count={chartInsights.length}
        data-patterns-count={dataPatterns.length}
        aria-label={
          ariaLabel ||
          `Interactive ${currentType} chart${title ? ` titled ${title}` : ""}${chartInsights.length > 0 ? ` with ${chartInsights.length} insights` : ""}`
        }
        role="img"
      >
        <div
          style={{
            padding: "16px",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            opacity: isPreloading ? 0.7 : 1,
            transition: `opacity var(--glass-motion-duration-normal) var(--glass-motion-easing-standard)`,
          }}
        >
          {/* Chart header with consciousness insights */}
          {(title || description || chartInsights.length > 0) && (
            <ChartHeader>
              {title && (
                <ContrastGuard>
                  <ChartTitle>{title}</ChartTitle>
                </ContrastGuard>
              )}
              {description && (
                <ContrastGuard>
                  <ChartDescription>{description}</ChartDescription>
                </ContrastGuard>
              )}

              {/* Predictive insights display */}
              {predictive && chartInsights.length > 0 && (
                <div
                  style={{
                    marginTop: "8px",
                    padding: "8px 12px",
                    background:
                      '/* Use createGlassStyle({ intent: "primary", elevation: "level2" }) */',
                    borderRadius: "var(--glass-radius-md)",
                    border: "1px solid var(--glass-border-default)",
                    fontSize: "12px",
                    color:
                      "color-mix(in srgb, rgb(99, 102, 241) 90%, transparent)",
                  }}
                  data-insights-panel="true"
                >
                  <ContrastGuard>
                    <strong>💡 Insights:</strong>{" "}
                    {chartInsights
                      .slice(0, 2)
                      .map((insight: any) => insight.title || insight.message)
                      .join(", ")}
                    {chartInsights.length > 2 &&
                      ` (+${chartInsights.length - 2} more)`}
                  </ContrastGuard>
                </div>
              )}

              {/* Biometric adaptation indicator */}
              {biometricResponsive && adaptiveComplexity !== "medium" && (
                <div
                  style={{
                    marginTop: "4px",
                    fontSize: "10px",
                    color:
                      "color-mix(in srgb, var(--glass-white) 60%, transparent)",
                    fontStyle: "italic",
                  }}
                  data-adaptation-indicator="true"
                >
                  <ContrastGuard>
                    🧠 Adapted for {adaptiveComplexity} cognitive load
                  </ContrastGuard>
                </div>
              )}
            </ChartHeader>
          )}

          {/* Chart controls (tabs & toolbar) */}
          {(tabs?.length || allowTypeSwitch || toolbarItems) && (
            <ChartControls>
              {/* Tabs for chart navigation */}
              {tabs?.length ? (
                <TabsContainer>
                  <div>Tabs: {currentTab}</div>
                </TabsContainer>
              ) : null}

              {/* Action buttons toolbar */}
              <ToolbarContainer>
                {allowTypeSwitch && (
                  <>
                    {availableTypes.includes("bar") && (
                      <ChartTypeButton
                        active={currentType === "bar"}
                        onClick={(e) => handleTypeChange("bar")}
                        title="Bar chart"
                      >
                        {ChartTypeIcons.bar}
                      </ChartTypeButton>
                    )}
                    {availableTypes.includes("line") && (
                      <ChartTypeButton
                        active={currentType === "line"}
                        onClick={(e) => handleTypeChange("line")}
                        title="Line chart"
                      >
                        {ChartTypeIcons.line}
                      </ChartTypeButton>
                    )}
                    {availableTypes.includes("area") && (
                      <ChartTypeButton
                        active={currentType === "area"}
                        onClick={(e) => handleTypeChange("area")}
                        title="Area chart"
                      >
                        {ChartTypeIcons.area}
                      </ChartTypeButton>
                    )}
                    {availableTypes.includes("pie") && (
                      <ChartTypeButton
                        active={currentType === "pie"}
                        onClick={(e) => handleTypeChange("pie")}
                        title="Pie chart"
                      >
                        {ChartTypeIcons.pie}
                      </ChartTypeButton>
                    )}
                  </>
                )}

                {allowDownload && (
                  <ChartTypeButton
                    active={false}
                    onClick={handleDownload}
                    title="Download chart"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M7 10L12 15L17 10"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 15V3"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </ChartTypeButton>
                )}

                {/* Custom toolbar items */}
                {toolbarItems}
              </ToolbarContainer>
            </ChartControls>
          )}

          {/* Main chart content with consciousness enhancements */}
          <ChartContent
            focused={isFocused}
            data-current-focus={
              currentDataFocus
                ? `${currentDataFocus.seriesIndex}-${currentDataFocus.pointIndex}`
                : undefined
            }
            data-adaptive-complexity={adaptiveComplexity}
            style={{
              filter:
                currentDataFocus && gazeResponsive
                  ? "brightness(1.1) saturate(1.2)"
                  : undefined,
              transition: `filter var(--glass-motion-duration-normal) var(--glass-motion-easing-standard)`,
              position: "relative",
            }}
          >
            {renderChart()}

            {/* Eye tracking focus overlay */}
            {currentDataFocus && gazeResponsive && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background:
                    '/* Use createGlassStyle({ intent: "primary", elevation: "level2" }) */',
                  pointerEvents: "none",
                  zIndex: 1,
                  animation: "pulse 2s infinite",
                }}
                data-gaze-overlay="true"
              />
            )}

            {/* Preloading indicator */}
            {isPreloading && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  background:
                    '/* Use createGlassStyle({ intent: "primary", elevation: "level2" }) */',
                  color: "white",
                  padding: "8px 12px",
                  borderRadius: "var(--glass-radius-sm)",
                  fontSize: "12px",
                  zIndex: 10,
                }}
              >
                <ContrastGuard>🔄 Analyzing data patterns...</ContrastGuard>
              </div>
            )}
          </ChartContent>

          {/* Enhanced footer content with consciousness features */}
          {(isFocused || chartInsights.length > 0) && (
            <FooterContent>
              {isFocused && (
                <ContrastGuard>Click to exit focused view</ContrastGuard>
              )}
              {chartInsights.length > 0 && (
                <ContrastGuard>
                  <div
                    style={{
                      marginTop: isFocused ? "8px" : "0",
                      fontSize: "11px",
                      opacity: 0.8,
                    }}
                  >
                    📊 {chartInsights.length} insights available
                    {currentDataFocus
                      ? ` | Focus: Series ${currentDataFocus.seriesIndex + 1}, Point ${currentDataFocus.pointIndex + 1}`
                      : ""}
                  </div>
                </ContrastGuard>
              )}
            </FooterContent>
          )}
        </div>
      </ChartContainer>
    );
  }
);

// Export memoized component for better performance
export const GlassChart = memo(GlassChartComponent);

// Add displayName
GlassChart.displayName = "GlassChart";

/**
 * Enhanced GlassChart with consciousness features enabled by default
 * Use this for charts that should be intelligent and adaptive
 */
export const ConsciousGlassChart = forwardRef<GlassChartRef, GlassChartProps>(
  (props, ref) => (
    <GlassChart
      ref={ref}
      predictive={true}
      preloadData={true}
      adaptive={true}
      biometricResponsive={true}
      trackAchievements={true}
      achievementId="conscious_chart_usage"
      {...props}
    />
  )
);

ConsciousGlassChart.displayName = "ConsciousGlassChart";

/**
 * Predictive GlassChart optimized for data analysis and insights
 */
export const PredictiveGlassChart = forwardRef<GlassChartRef, GlassChartProps>(
  (props, ref) => (
    <GlassChart
      ref={ref}
      predictive={true}
      preloadData={true}
      eyeTracking={true}
      gazeResponsive={true}
      trackAchievements={true}
      achievementId="predictive_chart_analysis"
      usageContext="analytics"
      {...props}
    />
  )
);

PredictiveGlassChart.displayName = "PredictiveGlassChart";

/**
 * Adaptive GlassChart that responds to user stress and cognitive load
 */
export const AdaptiveGlassChart = forwardRef<GlassChartRef, GlassChartProps>(
  (props, ref) => (
    <GlassChart
      ref={ref}
      adaptive={true}
      biometricResponsive={true}
      spatialAudio={true}
      audioFeedback={true}
      trackAchievements={true}
      achievementId="adaptive_chart_usage"
      {...props}
    />
  )
);

AdaptiveGlassChart.displayName = "AdaptiveGlassChart";

/**
 * Immersive GlassChart with full consciousness features for presentations
 */
export const ImmersiveGlassChart = forwardRef<GlassChartRef, GlassChartProps>(
  (props, ref) => (
    <GlassChart
      ref={ref}
      predictive={true}
      preloadData={true}
      eyeTracking={true}
      gazeResponsive={true}
      adaptive={true}
      biometricResponsive={true}
      spatialAudio={true}
      audioFeedback={true}
      trackAchievements={true}
      achievementId="immersive_chart_experience"
      usageContext="presentation"
      {...props}
    />
  )
);

ImmersiveGlassChart.displayName = "ImmersiveGlassChart";

/**
 * Utility function to create consciousness-enhanced chart variants
 */
export function withChartConsciousness<T extends GlassChartProps>(
  defaultProps: Partial<ConsciousnessFeatures> = {}
) {
  return function EnhancedChart(props: T) {
    return (
      <GlassChart
        predictive={true}
        adaptive={true}
        trackAchievements={true}
        {...defaultProps}
        {...props}
      />
    );
  };
}

/**
 * Pre-configured consciousness chart presets
 */
export const ChartConsciousnessPresets = {
  /**
   * Minimal consciousness features for performance-sensitive charts
   */
  minimal: {
    predictive: true,
    trackAchievements: true,
  },

  /**
   * Balanced consciousness features for general chart usage
   */
  balanced: {
    predictive: true,
    adaptive: true,
    biometricResponsive: true,
    trackAchievements: true,
  },

  /**
   * Full consciousness features for immersive chart experiences
   */
  immersive: {
    predictive: true,
    preloadData: true,
    eyeTracking: true,
    gazeResponsive: true,
    adaptive: true,
    biometricResponsive: true,
    spatialAudio: true,
    audioFeedback: true,
    trackAchievements: true,
  },

  /**
   * Analytics-focused consciousness features for data exploration
   */
  analytics: {
    predictive: true,
    preloadData: true,
    eyeTracking: true,
    gazeResponsive: true,
    trackAchievements: true,
    usageContext: "analytics" as const,
  },
} as const;

export default GlassChart;
