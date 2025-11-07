/**
 * ModularGlassDataChart Component
 *
 * A modular implementation of the GlassDataChart component that uses separate
 * components for chart rendering, tooltips, filters, and KPI display.
 */
import React, { useState, useRef, useEffect, useCallback, useImperativeHandle } from 'react';
import { cn } from '@/lib/utils';

// Consciousness interface imports
import { usePredictiveEngine, useInteractionRecorder } from '../advanced/GlassPredictiveEngine';
import { useAchievements } from '../advanced/GlassAchievementSystem';
import { useBiometricAdaptation } from '../advanced/GlassBiometricAdaptation';
import { useEyeTracking } from '../advanced/GlassEyeTracking';
import { useSpatialAudio } from '../advanced/GlassSpatialAudio';

// Helper function to convert elevation strings to numbers
const getNumericElevation = (elevation: string | number): number => {
  if (typeof elevation === 'number') return elevation;
  switch (elevation) {
    case 'level1': return 1;
    case 'level2': return 2;
    case 'level3': return 3;
    case 'level4': return 4;
    case 'level5': return 5;
    default: return 3; // default to level3
  }
};
import {
  ChartContainer,
  ChartHeader,
  ChartTitle,
  ChartSubtitle
} from './styles/ChartContainerStyles';

import {
  ChartToolbar,
  ChartTypeSelector,
  TypeButton,
  ToolbarButton,
  EnhancedExportButton,
  ChartLegend,
  LegendItem,
  LegendColor,
  LegendLabel
} from './styles/ChartElementStyles';

// Import all types
import {
  ChartVariant,
  DataPoint,
  ChartDataset,
  ChartType,
  ChartQualityTier
} from './types/ChartTypes';

import {
  GlassDataChartProps,
  GlassDataChartRef
} from './types/ChartProps';

// Import hooks
import { 
  useQualityTier, 
  QualityTier, 
  PhysicsParams,
  getQualityBasedPhysicsParams,
  getQualityBasedGlassParams
} from './hooks/useQualityTier';

// import { usePhysicsAnimation } from './hooks/usePhysicsAnimation';
import { useAccessibilitySettings } from '../../hooks/useAccessibilitySettings';
import { useGlassTheme } from '../../hooks/useGlassTheme';
import { createThemeContext } from '../../core/themeContext';

// Import modular components
import {
  KpiChart,
  ChartTooltip,
  TooltipData,
  ChartRenderer
} from './components';

// Import utilities
import { 
  calculateDamping,
  createAnimationOptions,
  pathAnimationPlugin
} from './utils/ChartAnimationUtils';

// Import and register required Chart.js components
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip as ChartJsTooltip,
  Legend as ChartJsLegend,
  Filler,
  RadialLinearScale
} from 'chart.js';

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  ChartJsTooltip,
  ChartJsLegend,
  Filler,
  RadialLinearScale
);

/**
 * ModularGlassDataChart Component
 * 
 * An advanced glass-styled chart component with physics-based interactions,
 * smooth animations, and rich customization options. Enhanced with consciousness interface features.
 */
export const ModularGlassDataChart = React.forwardRef<GlassDataChartRef, GlassDataChartProps & {
  // Consciousness interface features
  predictive?: boolean;
  preloadData?: boolean;
  eyeTracking?: boolean;
  gazeResponsive?: boolean;
  adaptive?: boolean;
  biometricResponsive?: boolean;
  spatialAudio?: boolean;
  audioFeedback?: boolean;
  trackAchievements?: boolean;
  achievementId?: string;
  usageContext?: 'dashboard' | 'analytics' | 'report' | 'presentation' | 'exploration';
}>((props, ref) => {
  // Theme & accessibility hooks
  const theme = useGlassTheme();
  const isDarkMode = theme ? theme.isDarkMode : false;
  const { settings: accessibilitySettings } = useAccessibilitySettings();
  const isReducedMotion = accessibilitySettings?.reducedMotion || false;
  const themeContext = theme ? createThemeContext(theme.theme) : undefined;
  
  // Extract all props with defaults
  const {
    title,
    subtitle,
    variant = 'line',
    datasets,
    width = '100%',
    height = 400,
    glassVariant = 'frosted',
    blurStrength = 'standard',
    color = 'primary',
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
    usageContext = 'dashboard',
    animation = {
      physicsEnabled: true,
      duration: 1000,
      tension: 300,
      friction: 30,
      mass: 1,
      easing: 'easeOutQuart',
      staggerDelay: 100,
    },
    interaction = {
      zoomPanEnabled: false,
      physicsHoverEffects: true,
      hoverSpeed: 150,
      showTooltips: true,
      tooltipStyle: 'frosted',
      tooltipFollowCursor: false,
    },
    legend = {
      show: true,
      position: 'top',
      align: 'center',
      style: 'default',
      glassEffect: false,
    },
    axis = {
      showXGrid: true,
      showYGrid: true,
      showXLabels: true,
      showYLabels: true,
      axisColor: '${glassStyles.borderColor || "rgba(255, 255, 255, 0.3)"}',
      gridColor: '${glassStyles.surface?.base || "rgba(255, 255, 255, 0.1)"}',
      gridStyle: 'solid',
    },
    initialSelection,
    showToolbar = true,
    allowDownload = true,
    palette = [
      '#6366F1', // primary
      '#8B5CF6', // secondary
      '#3B82F6', // blue
      '#10B981', // green
      '#F59E0B', // yellow
      '#EF4444', // red
      '#EC4899', // pink
      '#6B7280', // gray
    ],
    allowTypeSwitch = true,
    backgroundColor,
    borderRadius = 12,
    borderColor,
    elevation = 'level3',
    className,
    style,
    onDataPointClick,
    onSelectionChange,
    onZoomPan,
    onTypeChange,
    exportOptions = {
      filename: 'chart',
      quality: 0.9,
      format: 'png',
      backgroundColor: 'transparent',
      includeTitle: true,
      includeTimestamp: true,
    },
    renderExportButton,
    kpi,
    useAdaptiveQuality = true,
  } = props;
  
  // Quality tier system integration
  const qualityTier = useQualityTier(
    {
      dataPointCount: datasets?.reduce((sum, dataset) => sum + dataset.data.length, 0) || 0,
      seriesCount: datasets?.length || 0,
      animationComplexity: 'medium',
      interactionComplexity: 'medium',
    },
    variant as any,
    useAdaptiveQuality ? undefined : 'high'
  );
  
  // State
  const [chartType, setChartType] = useState<ChartVariant>(variant as ChartVariant);
  const [hoveredPoint, setHoveredPoint] = useState<TooltipData | null>(null);
  const [selectedIndices, setSelectedIndices] = useState<number[]>(
    initialSelection !== undefined 
      ? Array.isArray(initialSelection) 
        ? initialSelection 
        : [initialSelection] 
      : []
  );
  
  // Consciousness features state
  const [chartInsights, setChartInsights] = useState<any[]>([]);
  const [dataPatterns, setDataPatterns] = useState<any[]>([]);
  const [isPreloading, setIsPreloading] = useState(false);
  const [adaptiveComplexity, setAdaptiveComplexity] = useState<'low' | 'medium' | 'high'>('medium');
  const [currentDataFocus, setCurrentDataFocus] = useState<{ seriesIndex: number; pointIndex: number } | null>(null);
  
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  
  // Consciousness feature hooks - only initialize if features are enabled
  const predictiveEngine = predictive ? usePredictiveEngine() : null;
  const eyeTracker = eyeTracking ? useEyeTracking() : null;
  const biometricAdapter = adaptive ? useBiometricAdaptation() : null;
  const spatialAudioEngine = spatialAudio ? useSpatialAudio() : null;
  const achievementTracker = trackAchievements ? useAchievements() : null;
  const { recordInteraction } = usePredictiveEngine();
  const interactionRecorder = (predictive || trackAchievements) ? useInteractionRecorder(`modular-chart-${usageContext}`) : null;
  
  // Determine the active quality tier
  const activeQuality = useAdaptiveQuality ? qualityTier : 'high';
  
  // Get physics and glass parameters based on quality tier
  const qualityPhysicsParams = getQualityBasedPhysicsParams(activeQuality as any);
  const qualityGlassParams = getQualityBasedGlassParams(activeQuality as any);

  // Determine if we're using physics-based animations
  const enablePhysicsAnimation = animation.physicsEnabled && !isReducedMotion;

  // Animation state management with physics support
  const [animationValues, setAnimationValues] = useState<Record<string, number>>({});
  const [isAnimating, setIsAnimating] = useState(false);
  
  const animate = React.useCallback((key: string, from: number, to: number, duration: number = 500) => {
    setIsAnimating(true);
    setAnimationValues(prev => ({ ...prev, [key]: from }));
    
    if (enablePhysicsAnimation) {
      // Use spring physics animation
      const startTime = Date.now();
      const animateFrame = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Spring easing function
        const easeSpring = (t: number) => {
          return 1 - Math.pow(1 - t, 3) * Math.cos(t * Math.PI * 2);
        };
        
        const currentValue = from + (to - from) * easeSpring(progress);
        setAnimationValues(prev => ({ ...prev, [key]: currentValue }));
        
        if (progress < 1) {
          requestAnimationFrame(animateFrame);
        } else {
          setIsAnimating(false);
        }
      };
      requestAnimationFrame(animateFrame);
    } else {
      // Simple linear animation
      const steps = 60;
      const stepValue = (to - from) / steps;
      let currentStep = 0;
      
      const interval = setInterval(() => {
        currentStep++;
        const currentValue = from + stepValue * currentStep;
        setAnimationValues(prev => ({ ...prev, [key]: currentValue }));
        
        if (currentStep >= steps) {
          clearInterval(interval);
          setIsAnimating(false);
        }
      }, duration / steps);
    }
  }, [enablePhysicsAnimation]);
  
  const getValue = (key: string) => animationValues[key] ?? 1;
  
  // Chart insights and pattern analysis
  useEffect(() => {
    if (!predictive || !predictiveEngine || !datasets) return;

    const analyzeChartData = async () => {
      try {
        // Analyze data patterns for insights
        // Note: analyzeDataPatterns and generateInsights methods not available in current predictive engine
        setDataPatterns([]);
        setChartInsights([]);
        
        if (achievementTracker && trackAchievements) {
          achievementTracker.recordAction('modular_chart_insights_generated', {
            chartType: chartType,
            insightsCount: 0,
            patternsFound: 0,
            context: usageContext,
          });
        }
      } catch (error) {
        console.warn('Modular chart insights analysis failed:', error);
      }
    };

    analyzeChartData();
  }, [predictive, predictiveEngine, datasets, chartType, usageContext, achievementTracker, trackAchievements]);
  
  // Biometric adaptation for chart complexity
  useEffect(() => {
    if (!biometricResponsive || !biometricAdapter) return;

    const adaptChartComplexity = () => {
      const stressLevel = biometricAdapter.currentStressLevel;
      const cognitiveLoad = biometricAdapter.currentStressLevel; // Use stress level as proxy for cognitive load
      const deviceCapabilities = {}; // Device capabilities not available in current adapter
      
      // Adapt chart complexity based on biometric data
      if (stressLevel > 0.7 || cognitiveLoad > 0.8) {
        setAdaptiveComplexity('low'); // Simplified chart when stressed
      } else if (stressLevel < 0.3 && cognitiveLoad < 0.4) {
        setAdaptiveComplexity('high'); // Full complexity when relaxed
      } else {
        setAdaptiveComplexity('medium'); // Balanced complexity
      }
    };

    // Initial adaptation
    adaptChartComplexity();

    // Listen for biometric changes
    const interval = setInterval(adaptChartComplexity, 3000);
    return () => clearInterval(interval);
  }, [biometricResponsive, biometricAdapter]);
  
  // Eye tracking for chart element focus
  useEffect(() => {
    if (!gazeResponsive || !eyeTracker || !containerRef.current) return;

    const handleGazeOnDataPoint = (element: HTMLElement) => {
      // Extract data point information from element attributes
      const seriesIndex = parseInt(element.getAttribute('data-series-index') || '0');
      const pointIndex = parseInt(element.getAttribute('data-point-index') || '0');
      
      setCurrentDataFocus({ seriesIndex, pointIndex });
      
      if (spatialAudioEngine && audioFeedback) {
        spatialAudioEngine.playGlassSound('data_focus', {
          x: element.offsetLeft,
          y: element.offsetTop,
          z: 0,
        });
      }
      
      if (achievementTracker && trackAchievements) {
        achievementTracker.recordAction('modular_chart_data_gaze_focus', {
          seriesIndex,
          pointIndex,
          chartType: chartType,
          context: usageContext,
        });
      }
    };

    const handleGazeOffDataPoint = () => {
      setCurrentDataFocus(null);
      
      if (spatialAudioEngine && audioFeedback) {
        spatialAudioEngine.playGlassSound('data_blur');
      }
    };

    // Note: onGazeEnter/onGazeLeave not available on current eye tracker interface
    // eyeTracker.onGazeEnter?.(containerRef.current, handleGazeOnDataPoint);
    // eyeTracker.onGazeLeave?.(containerRef.current, handleGazeOffDataPoint);

    return () => {
      if (containerRef.current) {
        // eyeTracker.offGazeEnter?.(containerRef.current, handleGazeOnDataPoint);
        // eyeTracker.offGazeLeave?.(containerRef.current, handleGazeOffDataPoint);
      }
    };
  }, [gazeResponsive, eyeTracker, spatialAudioEngine, audioFeedback, achievementTracker, trackAchievements, chartType, usageContext]);
  
  // Data preloading for chart interactions
  useEffect(() => {
    if (!preloadData || !predictiveEngine) return;

    const preloadChartData = async () => {
      setIsPreloading(true);
      try {
        // Note: preloadData method not available in current predictive engine
        // await predictiveEngine.preloadData({
        //   chartType: chartType,
        //   context: usageContext,
        //   currentData: datasets,
        //   patterns: dataPatterns
        // });
      } catch (error) {
        console.warn('Modular chart data preloading failed:', error);
      } finally {
        setIsPreloading(false);
      }
    };

    preloadChartData();
  }, [preloadData, predictiveEngine, chartType, usageContext, datasets, dataPatterns]);
  
  // Apply initial animations based on quality tier
  useEffect(() => {
    if (enablePhysicsAnimation) {
      // Trigger a pop-in animation on mount for better visual impact
      if (activeQuality !== ('low' as any)) {
        // Start a simple animation from 0 to 1
        animate('chart-mount', 0, 1, 500);
      }
    }
  }, [enablePhysicsAnimation, activeQuality, animate]);
  
  // Handle chart type change with consciousness features
  const handleTypeChange = (type: ChartType) => {
    const previousType = chartType;
    setChartType(type as ChartVariant);
    
    // Consciousness-enhanced type change tracking
    if (recordInteraction) {
      recordInteraction({
        type: 'click',
        element: 'chart-type-selector',
        context: {
          viewport: { width: window.innerWidth, height: window.innerHeight },
          timeOfDay: new Date().getHours(),
          deviceType: window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop',
        },
        metadata: { action: 'type-change' },
      });
    }
    
    // Spatial audio feedback for type changes
    if (spatialAudioEngine && audioFeedback) {
      spatialAudioEngine.playGlassSound('chart_type_change', {
        x: 0,
        y: 0,
        z: 0,
      });
    }
    
    // Achievement tracking for chart exploration
    if (achievementTracker && trackAchievements) {
      achievementTracker.recordAction('modular_chart_type_switch', {
        fromType: previousType,
        toType: type,
        context: usageContext,
        timestamp: Date.now(),
      });
    }
    
    if (onTypeChange) {
      onTypeChange(type);
    }
  };
  
  // Handle data point click with consciousness features
  const handleDataPointClick = (datasetIndex: number, dataIndex: number) => {
    if (!onDataPointClick || !datasets) return;

    const dataset = datasets[datasetIndex];
    if (!dataset) return;

    const dataPoint = dataset.data[dataIndex];
    
    // Spatial audio feedback for data point interactions
    if (spatialAudioEngine && audioFeedback) {
      spatialAudioEngine.playGlassSound('data_point_click', {
        x: 0,
        y: 0,
        z: 0,
      });
    }
    
    // Track data point interactions
    if (recordInteraction && event) {
      recordInteraction({
        type: 'click',
        element: 'data-point',
        context: {
          viewport: { width: window.innerWidth, height: window.innerHeight },
          timeOfDay: new Date().getHours(),
          deviceType: window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop',
          location: { x: (event as MouseEvent).clientX, y: (event as MouseEvent).clientY },
        },
        metadata: { action: 'data-point-click' },
      });
    }
    
    // Achievement tracking for data exploration
    if (achievementTracker && trackAchievements) {
      achievementTracker.recordAction('modular_chart_data_point_interaction', {
        datasetIndex,
        dataIndex,
        datasetLabel: dataset.label,
        pointValue: dataPoint.y,
        chartType: chartType,
        context: usageContext,
        hasInsights: chartInsights.length > 0,
      });
    }
    
    onDataPointClick(datasetIndex, dataIndex, dataPoint);
    
    // Handle selection logic
    if (onSelectionChange) {
      const index = dataIndex;
      const newSelectedIndices = [...selectedIndices];
      
      if (newSelectedIndices.includes(index)) {
        // Deselect
        const indexPosition = newSelectedIndices.indexOf(index);
        newSelectedIndices.splice(indexPosition, 1);
      } else {
        // Select
        newSelectedIndices.push(index);
      }
      
      setSelectedIndices(newSelectedIndices);
      onSelectionChange(newSelectedIndices);
    }
  };
  
  // Handle chart hover for tooltips
  const handleChartHover = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!chartRef.current || !interaction.showTooltips || !datasets) return;

    const chart = chartRef.current;
    const points = chart.getElementsAtEventForMode(
      event.nativeEvent,
      'nearest',
      { intersect: false },
      false
    );

    if (points.length > 0) {
      const firstPoint = points[0];
      const datasetIndex = firstPoint.datasetIndex;
      const dataIndex = firstPoint.index;
      const dataset = datasets[datasetIndex];

      if (!dataset) return;
      const dataPoint = dataset.data[dataIndex];
      
      // Get position in canvas coordinates
      const rect = chart.canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      setHoveredPoint({
        datasetIndex,
        dataIndex,
        x: event.clientX,
        y: event.clientY,
        value: {
          dataset: dataset.label,
          label: dataPoint.label || dataPoint.x,
          value: dataPoint.y,
          color: dataset.style?.lineColor || palette[datasetIndex % palette.length],
          extra: dataPoint.extra,
        }
      });
    } else {
      setHoveredPoint(null);
    }
  };
  
  // Handle chart hover leave
  const handleChartLeave = () => {
    setHoveredPoint(null);
  };
  
  // Handle chart export
  const handleExport = useCallback(() => {
    if (!chartRef.current) return;
    
    // Get chart canvas
    const chart = chartRef.current;
    const canvas = chart.canvas;
    
    // Create a temporary canvas to include title if needed
    const tempCanvas = document.createElement('canvas');
    const ctx = tempCanvas.getContext('2d');
    if (!ctx) return;
    
    // Set temp canvas dimensions
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
    // Add extra space for title if needed
    const extraHeight = exportOptions.includeTitle && title ? 40 : 0;
    
    tempCanvas.width = canvasWidth;
    tempCanvas.height = canvasHeight + extraHeight;
    
    // Fill background
    ctx.fillStyle = exportOptions.backgroundColor || 'transparent';
    ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    
    // Add title if needed
    if (exportOptions.includeTitle && title) {
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 16px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(title, tempCanvas.width / 2, 25);
      
      if (subtitle) {
        ctx.fillStyle = '${glassStyles.text?.secondary || "rgba(255, 255, 255, 0.7)"}';
        ctx.font = '12px Inter, sans-serif';
        ctx.fillText(subtitle, tempCanvas.width / 2, 45);
      }
    }
    
    // Draw chart onto temp canvas
    ctx.drawImage(canvas, 0, extraHeight);
    
    // Generate filename
    let filename = exportOptions.filename || 'chart';
    
    // Add timestamp if requested
    if (exportOptions.includeTimestamp) {
      const now = new Date();
      const timestamp = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}-${now.getMinutes().toString().padStart(2, '0')}`;
      filename = `${filename}_${timestamp}`;
    }
    
    // Convert to data URL and download
    const dataUrl = tempCanvas.toDataURL(`image/${exportOptions.format || 'png'}`, exportOptions.quality);
    
    const link = document.createElement('a');
    link.download = `${filename}.${exportOptions.format || 'png'}`;
    link.href = dataUrl;
    link.click();
  }, [chartRef, title, subtitle, exportOptions]);
  
  // Expose chart methods via ref
  useImperativeHandle(ref, () => ({
    getChartInstance: () => chartRef.current,
    exportChart: handleExport,
    updateChart: () => {
      if (chartRef.current) {
        chartRef.current.update();
      }
    },
    getContainerElement: () => containerRef.current,
    switchChartType: (type: ChartType) => {
      handleTypeChange(type);
    },
    getChartState: () => ({
      hoveredPoint,
      selectedIndices,
      chartType,
      qualityTier: activeQuality
    }),
    forceUpdate: () => {
      if (chartRef.current) {
        chartRef.current.update('none');
      }
    }
  }), [chartRef, handleExport, hoveredPoint, selectedIndices, chartType, activeQuality]);
  
  // Prepare axis options, adjusting color for clear variant
  const effectiveAxisOptions = {
    ...axis,
    // Use a more visible grid color for the clear variant
    gridColor: glassVariant === 'clear' 
      ? 'rgba(0, 0, 0, 0.15)' // Darker, semi-transparent
      : axis.gridColor || '${glassStyles.surface?.base || "rgba(255, 255, 255, 0.1)"}', // Original default
  };
  
  // Special case for KPI chart type
  if (chartType === ('kpi' as ChartVariant) && kpi) {
    return (
      <ChartContainer
        className={cn(
          className,
          gazeResponsive && currentDataFocus && 'glass-chart-gaze-focused',
          isPreloading && 'glass-chart-preloading',
          adaptiveComplexity === 'low' && 'glass-chart-simplified',
          adaptiveComplexity === 'high' && 'glass-chart-enhanced'
        )}
        data-preloading={isPreloading ? 'true' : undefined}
        $glassVariant={glassVariant}
        $blurStrength={blurStrength}
        $color={color}
        $borderRadius={typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius}
        $borderColor={borderColor}
        $elevation={getNumericElevation(elevation)}
        ref={containerRef}
        data-chart-type={chartType}
        data-usage-context={usageContext}
        data-consciousness-level={`${[predictive, eyeTracking, adaptive, spatialAudio].filter(Boolean).length}`}
        data-adaptive-complexity={adaptiveComplexity}
        data-insights-count={chartInsights.length}
        data-patterns-count={dataPatterns.length}
        aria-label={`Interactive KPI chart${title ? ` titled ${title}` : ''}${chartInsights.length > 0 ? ` with ${chartInsights.length} insights` : ''}`}
        role="img"
      >
        {/* Chart title with consciousness insights */}
        {(title || subtitle || chartInsights.length > 0) && (
          <ChartHeader>
            {title && <ChartTitle>{title}</ChartTitle>}
            {subtitle && <ChartSubtitle>{subtitle}</ChartSubtitle>}
            
            {/* Predictive insights display */}
            {predictive && chartInsights.length > 0 && (
              <div
                className="mt-2 px-3 py-2 glass-radius glass-border text-primary glass-surface-primary/10"
                data-insights-panel="true"
              >
                <strong>💡 KPI Insights:</strong> {chartInsights.slice(0, 2).map(insight => insight.title || insight.message).join(', ')}
                {chartInsights.length > 2 && ` (+${chartInsights.length - 2} more)`}
              </div>
            )}
          </ChartHeader>
        )}
        
        {/* KPI display */}
        <KpiChart
          kpi={kpi}
          animation={{
            enabled: enablePhysicsAnimation,
            stiffness: qualityPhysicsParams.stiffness,
            dampingRatio: qualityPhysicsParams.dampingRatio,
            mass: qualityPhysicsParams.mass
          }}
          qualityTier={typeof activeQuality === 'object' ? activeQuality.tier : activeQuality}
          color={color}
          isReducedMotion={isReducedMotion}
        />
        
        {/* Atmospheric effects */}
        {/* <AtmosphericEffects
          qualityTier={activeQuality}
          color={color}
          isReducedMotion={isReducedMotion}
        /> */}
      </ChartContainer>
    );
  }
  
  // Render standard chart with consciousness enhancements
  return (
    <ChartContainer
      className={cn(
        className,
        gazeResponsive && currentDataFocus && 'glass-chart-gaze-focused',
        isPreloading && 'glass-chart-preloading',
        adaptiveComplexity === 'low' && 'glass-chart-simplified',
        adaptiveComplexity === 'high' && 'glass-chart-enhanced'
      )}
      data-preloading={isPreloading ? 'true' : undefined}
      $glassVariant={glassVariant}
      $blurStrength={blurStrength}
      $color={color}
      $borderRadius={typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius}
      $borderColor={borderColor}
      $elevation={getNumericElevation(elevation)}
      ref={containerRef}
      data-chart-type={chartType}
      data-usage-context={usageContext}
      data-consciousness-level={`${[predictive, eyeTracking, adaptive, spatialAudio].filter(Boolean).length}`}
      data-adaptive-complexity={adaptiveComplexity}
      data-insights-count={chartInsights.length}
      data-patterns-count={dataPatterns.length}
      aria-label={`Interactive ${chartType} chart${title ? ` titled ${title}` : ''}${chartInsights.length > 0 ? ` with ${chartInsights.length} insights` : ''}`}
      role="img"
    >
      {/* SVG Filters */}
      {/* <ChartFilters
        palette={palette}
        qualityTier={activeQuality}
      /> */}

      {/* Atmospheric effects - Conditionally render */}
      {/* {glassVariant !== 'clear' && (
        <AtmosphericEffects
          qualityTier={activeQuality}
          color={color}
          isReducedMotion={isReducedMotion}
        />
      )} */}
      
      {/* Chart header with consciousness insights */}
      {(title || subtitle || chartInsights.length > 0) && (
        <ChartHeader>
          {title && <ChartTitle>{title}</ChartTitle>}
          {subtitle && <ChartSubtitle>{subtitle}</ChartSubtitle>}
          
          {/* Predictive insights display */}
          {predictive && chartInsights.length > 0 && (
            <div
              className="mt-2 px-3 py-2 glass-radius glass-border text-primary glass-surface-primary/10"
              data-insights-panel="true"
            >
              <strong>💡 Insights:</strong> {chartInsights.slice(0, 2).map(insight => insight.title || insight.message).join(', ')}
              {chartInsights.length > 2 && ` (+${chartInsights.length - 2} more)`}
            </div>
          )}
          
          {/* Biometric adaptation indicator */}
          {biometricResponsive && adaptiveComplexity !== 'medium' && (
            <div
              className="mt-1 text-xs glass-text-secondary"
              data-adaptation-indicator="true"
            >
              🧠 Adapted for {adaptiveComplexity} cognitive load
            </div>
          )}
        </ChartHeader>
      )}
      
      {/* Chart toolbar */}
      {showToolbar && (
        <ChartToolbar>
          {/* Type selector */}
          {allowTypeSwitch && (
            <ChartTypeSelector>
              <TypeButton
                type="button"
                $active={chartType === ('line' as ChartVariant)}
                onClick={(e) => handleTypeChange('line')}
              >
                Line
              </TypeButton>
              <TypeButton
                type="button"
                $active={chartType === ('bar' as ChartVariant)}
                onClick={(e) => handleTypeChange('bar')}
              >
                Bar
              </TypeButton>
              <TypeButton
                type="button"
                $active={chartType === ('area' as ChartVariant)}
                onClick={(e) => handleTypeChange('area')}
              >
                Area
              </TypeButton>
              <TypeButton
                type="button"
                $active={chartType === ('pie' as ChartVariant)}
                onClick={(e) => handleTypeChange('pie')}
              >
                Pie
              </TypeButton>
            </ChartTypeSelector>
          )}
          
          {/* Download button */}
          {allowDownload && (
            renderExportButton ? (
              renderExportButton(handleExport)
            ) : (
              <EnhancedExportButton onClick={handleExport}>
                Export
              </EnhancedExportButton>
            )
          )}
        </ChartToolbar>
      )}
      
      {/* Legend - Top position */}
      {legend.show && legend.position === 'top' && (
        <ChartLegend 
          $position={legend.position} 
          $style={legend.style || 'default'} 
          $glassEffect={legend.glassEffect || false}
        >
          {datasets?.map((dataset, index) => {
            const color = dataset.style?.lineColor || palette[index % palette.length];
            const isActive = selectedIndices.includes(index);
            return (
              <LegendItem 
                key={dataset.id || index}
                $color={color}
                $style={legend.style || 'default'}
                $active={isActive}
              >
                <LegendColor 
                  $color={color} 
                  $active={isActive} 
                />
                <LegendLabel $active={isActive}>
                  {dataset.label}
                </LegendLabel>
              </LegendItem>
            );
          })}
        </ChartLegend>
      )}
      
      {/* Main Chart */}
      <ChartRenderer
        chartType={
          chartType === 'default' ? 'line' :
          chartType === 'minimal' ? 'line' :
          chartType === 'detailed' ? 'area' :
          chartType === 'heatmap' ? 'scatter' :
          chartType === 'radar' ? 'line' :
          (chartType as ChartType)
        }
        datasets={datasets || []}
        palette={palette}
        qualityTier={typeof activeQuality === 'object' ? activeQuality.tier : activeQuality}
        animation={animation}
        interaction={interaction}
        axis={effectiveAxisOptions}
        isReducedMotion={isReducedMotion}
        springValue={getValue('chart-mount')}
        enablePhysicsAnimation={enablePhysicsAnimation}
        onDataPointClick={handleDataPointClick}
        onChartHover={handleChartHover}
        onChartLeave={handleChartLeave}
        chartRefCallback={(chart) => chartRef.current = chart}
        glassVariant={glassVariant}
      />
      
      {/* Legend - Bottom position */}
      {legend.show && legend.position === 'bottom' && (
        <ChartLegend 
          $position={legend.position} 
          $style={legend.style || 'default'} 
          $glassEffect={legend.glassEffect || false}
        >
          {datasets?.map((dataset, index) => {
            const color = dataset.style?.lineColor || palette[index % palette.length];
            const isActive = selectedIndices.includes(index);
            return (
              <LegendItem 
                key={dataset.id || index}
                $color={color}
                $style={legend.style || 'default'}
                $active={isActive}
              >
                <LegendColor 
                  $color={color} 
                  $active={isActive} 
                />
                <LegendLabel $active={isActive}>
                  {dataset.label}
                </LegendLabel>
              </LegendItem>
            );
          })}
        </ChartLegend>
      )}
      
      {/* Enhanced Tooltip with consciousness features */}
      <ChartTooltip
        tooltipData={hoveredPoint}
        datasets={datasets}
        color={color}
        qualityTier={typeof activeQuality === 'object' ? activeQuality.tier : activeQuality}
        tooltipStyle={(interaction.tooltipStyle === 'dynamic' ? 'frosted' : interaction.tooltipStyle) || 'frosted'}
        followCursor={interaction.tooltipFollowCursor}
      />
      
      {/* Eye tracking focus overlay */}
      {currentDataFocus && gazeResponsive && (
        <div
          className="glass-absolute glass-inset-0 glass-surface-primary/10 pointer-events-none glass-z-10"
          data-gaze-overlay="true"
        />
      )}
      
      {/* Preloading indicator */}
      {isPreloading && (
        <div
          className="glass-absolute glass-z-50 glass-top-2 glass-left-2 glass-surface-primary text-primary px-3 py-2 glass-radius"
        >
          🔄 Analyzing data patterns...
        </div>
      )}
      
      {/* Chart insights footer */}
      {(chartInsights.length > 0 || currentDataFocus) && (
        <div
          className="glass-absolute px-2 py-1 glass-surface-primary/10 text-primary glass-radius glass-z-10"
          data-consciousness-footer="true"
        >
          {chartInsights.length > 0 && `📊 ${chartInsights.length} insights`}
          {currentDataFocus && chartInsights.length > 0 && ' | '}
          {currentDataFocus && `Focus: S${currentDataFocus.seriesIndex + 1}P${currentDataFocus.pointIndex + 1}`}
        </div>
      )}
    </ChartContainer>
  );
});

// Add display name for debugging
ModularGlassDataChart.displayName = 'ModularGlassDataChart';

/**
 * Enhanced ModularGlassDataChart with consciousness features enabled by default
 * Use this for data-heavy charts that need intelligent insights
 */
export const ConsciousModularGlassDataChart = React.forwardRef<GlassDataChartRef, Parameters<typeof ModularGlassDataChart>[0]>(
  (props, ref) => (
    <ModularGlassDataChart
      ref={ref}
      predictive={true}
      preloadData={true}
      adaptive={true}
      biometricResponsive={true}
      trackAchievements={true}
      achievementId="conscious_modular_chart_usage"
      {...props}
    />
  )
);

ConsciousModularGlassDataChart.displayName = 'ConsciousModularGlassDataChart';

/**
 * Predictive ModularGlassDataChart optimized for complex data analysis
 */
export const PredictiveModularGlassDataChart = React.forwardRef<GlassDataChartRef, Parameters<typeof ModularGlassDataChart>[0]>(
  (props, ref) => (
    <ModularGlassDataChart
      ref={ref}
      predictive={true}
      preloadData={true}
      eyeTracking={true}
      gazeResponsive={true}
      trackAchievements={true}
      achievementId="predictive_modular_chart_analysis"
      usageContext="analytics"
      {...props}
    />
  )
);

PredictiveModularGlassDataChart.displayName = 'PredictiveModularGlassDataChart';

/**
 * Adaptive ModularGlassDataChart that responds to user cognitive load
 */
export const AdaptiveModularGlassDataChart = React.forwardRef<GlassDataChartRef, Parameters<typeof ModularGlassDataChart>[0]>(
  (props, ref) => (
    <ModularGlassDataChart
      ref={ref}
      adaptive={true}
      biometricResponsive={true}
      spatialAudio={true}
      audioFeedback={true}
      trackAchievements={true}
      achievementId="adaptive_modular_chart_usage"
      {...props}
    />
  )
);

AdaptiveModularGlassDataChart.displayName = 'AdaptiveModularGlassDataChart';

/**
 * Immersive ModularGlassDataChart for dashboard and presentation contexts
 */
export const ImmersiveModularGlassDataChart = React.forwardRef<GlassDataChartRef, Parameters<typeof ModularGlassDataChart>[0]>(
  (props, ref) => (
    <ModularGlassDataChart
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
      achievementId="immersive_modular_chart_experience"
      usageContext="dashboard"
      {...props}
    />
  )
);

ImmersiveModularGlassDataChart.displayName = 'ImmersiveModularGlassDataChart';

/**
 * Pre-configured consciousness modular chart presets
 */
export const ModularChartConsciousnessPresets = {
  /**
   * Minimal consciousness features for performance-sensitive modular charts
   */
  minimal: {
    predictive: true,
    trackAchievements: true,
  },
  
  /**
   * Balanced consciousness features for general modular chart usage
   */
  balanced: {
    predictive: true,
    adaptive: true,
    biometricResponsive: true,
    trackAchievements: true,
  },
  
  /**
   * Full consciousness features for immersive modular chart experiences
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
    usageContext: 'analytics' as const,
  },
} as const;

export default ModularGlassDataChart; 
