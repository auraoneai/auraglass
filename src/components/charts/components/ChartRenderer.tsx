import React, { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { cn } from '../../../lib/utilsComprehensive';
import { Line, Bar, Pie, Scatter } from 'react-chartjs-2';

export interface ChartRendererProps {
  chartType: 'line' | 'bar' | 'area' | 'pie' | 'scatter' | 'heatmap' | 'radar';
  datasets: any[];
  palette?: string[];
  qualityTier?: 'low' | 'medium' | 'high' | 'ultra';
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
  glassVariant?: 'frosted' | 'dynamic' | 'clear' | 'tinted' | 'luminous';

  /** Glass surface intent */
  intent?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  
  /** Glass surface elevation */
  elevation?: 'level1' | 'level2' | 'level3' | 'level4';
  
  /** Performance tier */
  tier?: 'low' | 'medium' | 'high';
}

export const ChartRenderer: React.FC<ChartRendererProps> = ({
  chartType,
  datasets,
  palette = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'],
  qualityTier = 'medium',
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
  glassVariant = 'frosted',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [isLoaded, setIsLoaded] = useState(false);

  // Chart configuration based on quality tier
  const chartConfig = useMemo(() => {
    const baseConfig = {
      responsive: true,
      maintainAspectRatio: false,
      animation: !isReducedMotion && animation ? {
        duration: qualityTier === 'low' ? 200 : qualityTier === 'medium' ? 400 : 600,
        easing: 'easeOutQuart' as const,
      } : false,
      interaction: {
        intersect: false,
        mode: 'index' as const,
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
            color: '${glassStyles.surface?.base || "var(--glass-bg-default)"}',
          },
          ticks: {
            color: '${glassStyles.text?.secondary || "rgba(var(--glass-color-white) / var(--glass-opacity-70))"}',
          },
        },
        y: {
          display: axis?.y?.show !== false,
          grid: {
            display: axis?.y?.grid !== false,
            color: '${glassStyles.surface?.base || "var(--glass-bg-default)"}',
          },
          ticks: {
            color: '${glassStyles.text?.secondary || "rgba(var(--glass-color-white) / var(--glass-opacity-70))"}',
          },
        },
      },
    };

    return baseConfig;
  }, [qualityTier, isReducedMotion, animation, axis]);

  // Prepare chart data
  const chartData = useMemo(() => {
    return {
      labels: datasets[0]?.data?.map((point: any) => point.x) || [],
      datasets: datasets.map((dataset, index) => ({
        label: dataset.name,
        data: dataset.data?.map((point: any) => point.y),
                backgroundColor: dataset.color || palette[index % (palette?.length || 1)],
        borderColor: dataset.color || palette[index % palette.length],
        borderWidth: 2,
        fill: chartType === 'area',
        tension: 0.4,
        pointRadius: qualityTier === 'low' ? 2 : 4,
        pointHoverRadius: qualityTier === 'low' ? 4 : 6,
      })),
    };
  }, [datasets, palette, chartType, qualityTier]);

  // Handle chart interactions
  const handleChartClick = useCallback((event: any, elements: any[]) => {
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
  }, [datasets, onDataPointClick]);

  const handleChartHoverEvent = useCallback((event: any, elements: any[]) => {
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
  }, [datasets, onChartHover, onChartLeave]);

  // Chart component based on type
  const ChartComponent = useMemo(() => {
    switch (chartType) {
      case 'line':
        return Line;
      case 'bar':
        return Bar;
      case 'area':
        return Line; // Area chart is a Line chart with fill
      case 'pie':
        return Pie;
      case 'scatter':
        return Scatter;
      default:
        return Line;
    }
  }, [chartType]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const containerStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    position: 'relative',
    background: 'transparent',
    borderRadius: glassVariant === 'clear' ? 0 : '8px',
    overflow: 'hidden',
  };

  if (!isLoaded) {
    return (
      <div style={containerStyle}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: 'var(--glass-border-hover)',
        }}>
          Loading chart...
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle} ref={chartRefCallback}>
      <ChartComponent
        data={chartData}
        options={{
          ...chartConfig,
          onClick: handleChartClick,
          onHover: handleChartHoverEvent,
        }}
      />
      {enablePhysicsAnimation && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          transform: `scale(${1 + springValue * 0.02})`,
          transition: 'transform 0.3s ease',
        }} />
      )}
    </div>
  );
};

export default ChartRenderer;
