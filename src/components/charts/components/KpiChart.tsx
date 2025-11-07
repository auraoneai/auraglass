// Typography tokens available via typography.css (imported in index.css)
import { cn } from '../../../lib/utilsComprehensive';
import React from 'react';
import { createGlassStyle } from '../../../core/mixins/glassMixins';
import { ContrastGuard, TextWithContrast } from '@/components/accessibility/ContrastGuard';

export interface KpiData {
  value: number | string;
  label: string;
  change?: number;
  changeLabel?: string;
  format?: 'number' | 'currency' | 'percentage';
}

export interface KpiChartProps {
  kpi: KpiData;
  animation?: {
    enabled?: boolean;
    stiffness?: number;
    dampingRatio?: number;
    mass?: number;
  };
  qualityTier?: 'low' | 'medium' | 'high' | 'ultra';
  color?: string;
  isReducedMotion?: boolean;
}

export const KpiChart: React.FC<KpiChartProps> = ({
  // TODO: Integrate ContrastGuard in chart labels, tooltips, and legends for WCAG AA compliance

  kpi,
  animation,
  qualityTier = 'medium',
  color = 'var(--glass-color-primary)',
  isReducedMotion = false,
}) => {
  const formatValue = (value: number | string, format?: string): string => {
    if (typeof value === 'string') return value;

    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(value);
      case 'percentage':
        return `${value}%`;
      default:
        return value.toLocaleString();
    }
  };

  const style = createGlassStyle({ intent: "neutral", elevation: "level2" });

  return (
    <div data-glass-component style={style}>
      <div style={{ fontSize: '2.25rem', marginBottom: '8px' }}>
        {formatValue(kpi.value, kpi.format)}
      </div>
      <div style={{ fontSize: 'var(--typography-body-size)', opacity: 0.8 }}>
        {kpi.label}
      </div>
      {kpi.change !== undefined && (
        <div style={{
          fontSize: 'var(--typography-caption-size)',
          color: kpi.change >= 0 ? 'var(--glass-color-success)' : 'var(--glass-color-danger)',
          marginTop: '4px'
        }}>
          {kpi.change >= 0 ? '↑' : '↓'} {Math.abs(kpi.change)}% {kpi.changeLabel || ''}
        </div>
      )}
    </div>
  );
};

export default KpiChart;
