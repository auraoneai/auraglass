"use client";
import React, {
  useRef,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from "react";
import { cn } from "../../../lib/utilsComprehensive";
import { Line, Bar, Pie, Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip as ChartTooltipCore,
  Legend as ChartLegendCore,
} from "chart.js";
import {
  ContrastGuard,
  TextWithContrast,
} from "@/components/accessibility/ContrastGuard";
import { ANIMATION } from "../../../tokens/designConstants";
import { COLORS } from "../../../tokens/designConstants";

// Ensure required Chart.js elements/scales are registered once for all tests/usages
ChartJS.register(
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  ChartTooltipCore,
  ChartLegendCore
);

export interface ChartRendererProps {
  chartType: "line" | "bar" | "area" | "pie" | "scatter" | "heatmap" | "radar";
  datasets: any[];
  palette?: string[];
  qualityTier?: "low" | "medium" | "high" | "ultra";
  animation?: any;
  interaction?: any;
  axis?: any;
  isReducedMotion?: boolean;
  springValue?: number;
  enablePhysicsAnimation?: boolean;
  onDataPointClick?: (datasetIndex: number, dataIndex: number) => void;
  onChartHover?: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  onChartLeave?: () => void;
  chartRefCallback?: (chart: any) => void;
  glassVariant?: "frosted" | "dynamic" | "clear" | "tinted" | "luminous";
  className?: string;
  "data-testid"?: string;
  "aria-label"?: string;

  /** Glass surface intent */
  intent?: "neutral" | "primary" | "success" | "warning" | "danger" | "info";

  /** Glass surface elevation */
  elevation?: "level1" | "level2" | "level3" | "level4";

  /** Performance tier */
  tier?: "low" | "medium" | "high";
}

export const ChartRenderer: React.FC<ChartRendererProps> = ({
  // TODO: Integrate ContrastGuard in chart labels, tooltips, and legends for WCAG AA compliance

  chartType,
  datasets,
  palette = [
    COLORS.semantic.primary,
    COLORS.semantic.error,
    COLORS.semantic.success,
    COLORS.semantic.warning,
    COLORS.semantic.secondary,
  ],
  qualityTier = "medium",
  animation,
  interaction,
  axis,
  isReducedMotion = false,
  springValue = 0,
  enablePhysicsAnimation = false,
  onDataPointClick,
  onChartHover,
  onChartLeave,
  chartRefCallback,
  glassVariant = "frosted",
  className,
  "data-testid": dataTestId,
  "aria-label": ariaLabel,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [isLoaded, setIsLoaded] = useState(false);

  // Chart configuration based on quality tier
  const chartConfig = useMemo(() => {
    const baseConfig = {
      responsive: true,
      maintainAspectRatio: false,
      animation:
        !isReducedMotion && animation
          ? {
              duration:
                qualityTier === "low"
                  ? ANIMATION.DURATION.fast / 1000
                  : qualityTier === "medium"
                    ? ANIMATION.DURATION.normal / 1000
                    : ANIMATION.DURATION.slow / 1000,
              easing: "easeOutQuart" as const,
            }
          : false,
      interaction: {
        intersect: false,
        mode: "index" as const,
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false, // We'll use custom tooltip
        },
      },
      scales: {
        x: {
          display: axis?.x?.show !== false,
          grid: {
            display: axis?.x?.grid !== false,
            color: axis?.x?.gridColor || "var(--glass-bg-default)",
          },
          ticks: {
            color: axis?.x?.tickColor || "var(--glass-text-secondary)",
          },
        },
        y: {
          display: axis?.y?.show !== false,
          grid: {
            display: axis?.y?.grid !== false,
            color: axis?.y?.gridColor || "var(--glass-bg-default)",
          },
          ticks: {
            color: axis?.y?.tickColor || "var(--glass-text-secondary)",
          },
        },
      },
      // Accessibility plugin to add aria-label to canvas
      onResize: (chart: any) => {
        const canvas = chart.canvas;
        if (canvas) {
          const label = ariaLabel || `${chartType} chart`;
          canvas.setAttribute("aria-label", label);
          canvas.setAttribute("role", "img");
        }
      },
    };

    return baseConfig;
  }, [qualityTier, isReducedMotion, animation, axis, ariaLabel, chartType]);

  // Prepare chart data
  const chartData = useMemo(() => {
    return {
      labels: datasets[0]?.data?.map((point: any) => point.x) || [],
      datasets: datasets.map((dataset, index) => ({
        label: dataset.name,
        data: dataset.data?.map((point: any) => point.y),
        backgroundColor:
          dataset.color || palette[index % (palette?.length || 1)],
        borderColor: dataset.color || palette[index % palette.length],
        borderWidth: 2,
        fill: chartType === "area",
        tension: 0.4,
        pointRadius: qualityTier === "low" ? 2 : 4,
        pointHoverRadius: qualityTier === "low" ? 4 : 6,
      })),
    };
  }, [datasets, palette, chartType, qualityTier]);

  // Handle chart interactions
  const handleChartClick = useCallback(
    (event: any, elements: any[]) => {
      if ((elements?.length || 0) > 0 && onDataPointClick) {
        const element = elements[0];
        const datasetIndex = element.datasetIndex;
        const dataIndex = element.index;
        const dataset = datasets?.[datasetIndex];
        const dataPoint = dataset?.data[dataIndex];

        if (dataPoint) {
          onDataPointClick(datasetIndex, dataIndex);
        }
      }
    },
    [datasets, onDataPointClick]
  );

  const handleChartHoverEvent = useCallback(
    (event: any, elements: any[]) => {
      if ((elements?.length || 0) > 0 && onChartHover) {
        const element = elements[0];
        const datasetIndex = element.datasetIndex;
        const dataIndex = element.index;
        const dataset = datasets?.[datasetIndex];
        const dataPoint = dataset?.data[dataIndex];

        if (dataPoint) {
          onChartHover(dataPoint);
        }
      } else if (onChartLeave) {
        onChartLeave();
      }
    },
    [datasets, onChartHover, onChartLeave]
  );

  // Chart component based on type
  const ChartComponent = useMemo(() => {
    switch (chartType) {
      case "line":
        return Line;
      case "bar":
        return Bar;
      case "area":
        return Line; // Area chart is a Line chart with fill
      case "pie":
        return Pie;
      case "scatter":
        return Scatter;
      default:
        return Line;
    }
  }, [chartType]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Set aria-label on canvas element for accessibility after chart renders
  useEffect(() => {
    if (isLoaded && canvasRef.current) {
      // Use requestAnimationFrame to ensure Chart.js has rendered the canvas
      const setAriaLabel = () => {
        const canvas = canvasRef.current?.querySelector("canvas");
        if (canvas) {
          const label = ariaLabel || `${chartType} chart`;
          canvas.setAttribute("aria-label", label);
          canvas.setAttribute("role", "img");
        } else {
          // If canvas not found yet, try again on next frame
          requestAnimationFrame(setAriaLabel);
        }
      };
      requestAnimationFrame(setAriaLabel);
    }
  }, [isLoaded, ariaLabel, chartType]);

  const containerStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    position: "relative",
    background: "transparent",
    borderRadius: glassVariant === "clear" ? 0 : "8px",
    overflow: "hidden",
  };

  const loadingStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    color: "var(--glass-border-hover)",
  };

  const physicsOverlayStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: "none",
    transform: `scale(${1 + springValue * 0.02})`,
    transition: "transform 0.3s ease",
  };

  if (!isLoaded) {
    return (
      <div data-glass-component style={{ ...containerStyle }}>
        <div style={{ ...loadingStyle }}>Loading chart...</div>
      </div>
    );
  }

  return (
    <div
      style={{ ...containerStyle }}
      ref={(el) => {
        (canvasRef as any).current = el;
        if (typeof chartRefCallback === "function") {
          chartRefCallback(el as any);
        }
      }}
      className={cn("glass-chart-renderer", className)}
      data-testid={dataTestId || "chartrenderer"}
      aria-label={ariaLabel || `${chartType} chart`}
      role="img"
    >
      <ChartComponent
        data={chartData}
        options={{
          ...chartConfig,
          onClick: handleChartClick,
          onHover: handleChartHoverEvent,
        }}
        plugins={[
          {
            id: "accessibility",
            afterRender: (chart: any) => {
              const canvas = chart.canvas;
              if (canvas) {
                const label = ariaLabel || `${chartType} chart`;
                canvas.setAttribute("aria-label", label);
                canvas.setAttribute("role", "img");
              }
            },
          },
        ]}
      />
      {enablePhysicsAnimation && <div style={{ ...physicsOverlayStyle }} />}
    </div>
  );
};

export default ChartRenderer;
