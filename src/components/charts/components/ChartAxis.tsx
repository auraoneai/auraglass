'use client';
// Typography tokens available via typography.css (imported in index.css)
import { cn } from '../../../lib/utilsComprehensive';
import React, { useRef, useState, useEffect } from 'react';
import { createGlassStyle } from '../../../core/mixins/glassMixins';
import { ContrastGuard, TextWithContrast } from '@/components/accessibility/ContrastGuard';

export interface ChartAxisProps {
  orientation?: 'horizontal' | 'vertical';
  show?: boolean;
  showLabels?: boolean;
  showTicks?: boolean;
  label?: string;
  style?: React.CSSProperties;
}

export const ChartAxis: React.FC<ChartAxisProps> = ({
  // TODO: Integrate ContrastGuard in chart labels, tooltips, and legends for WCAG AA compliance

  orientation = 'horizontal',
  show = true,
  showLabels = true,
  showTicks = true,
  label,
  style,
}) => {
  const axisRef = useRef<HTMLDivElement>(null);
  const [ticks, setTicks] = useState<Array<{ value: string; position: number }>>([]);

  // Generate tick marks based on data range
  useEffect(() => {
    if (!showTicks) return;

    // Generate sample ticks - in a real implementation, this would be based on actual data
    const tickCount = orientation === 'horizontal' ? 6 : 5;
    const newTicks = Array.from({ length: tickCount }, (_, i) => ({
      value: orientation === 'horizontal' 
        ? `${i * 20}` 
        : `${(tickCount - i - 1) * 25}`,
      position: (i / (tickCount - 1)) * 100,
    }));

    setTicks(newTicks);
  }, [orientation, showTicks]);

  if (!show) return null;

  const glassStyles = createGlassStyle({ intent: 'neutral', elevation: 'level1' });
  const axisLineStyle: React.CSSProperties = {
    position: 'absolute',
    background: glassStyles.borderColor || '${glassStyles.borderColor || "rgba(var(--glass-color-white) / var(--glass-opacity-20))"}',
    ...(orientation === 'horizontal' 
      ? { height: '1px', left: 0, right: 0, bottom: '15px' }
      : { width: '1px', top: 0, bottom: '15px', right: '15px' }
    ),
  };

  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    ...(orientation === 'horizontal'
      ? { bottom: 0, left: 0, right: 0, height: '40px' }
      : { top: 0, bottom: 0, left: 0, width: '60px' }),
    ...style,
  };

  return (
    <div data-glass-component ref={axisRef} style={containerStyle}>
      {/* Axis line */}
      <div style={axisLineStyle} />

      {/* Tick marks and labels */}
      {showTicks && ticks.map((tick, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            ...(orientation === 'horizontal' 
              ? {
                  left: `${tick.position}%`,
                  bottom: '10px',
                  transform: 'translateX(-50%)',
                  borderLeft: `1px solid ${glassStyles.borderColor || '${glassStyles.borderColor || "rgba(var(--glass-color-white) / var(--glass-opacity-20))"}'}`,
                  height: '10px',
                }
              : {
                  top: `${100 - tick.position}%`,
                  right: '10px',
                  transform: 'translateY(50%)',
                  borderTop: `1px solid ${glassStyles.borderColor || '${glassStyles.borderColor || "rgba(var(--glass-color-white) / var(--glass-opacity-20))"}'}`,
                  width: '10px',
                }
            ),
          }}
        >
          {showLabels && (
            <span
              style={{
                position: 'absolute',
                fontSize: '0.625rem',
                color: '${glassStyles.text?.secondary || "rgba(var(--glass-color-white) / var(--glass-opacity-60))"}',
                whiteSpace: 'nowrap',
                ...(orientation === 'horizontal'
                  ? { top: '12px', left: '50%', transform: 'translateX(-50%)' }
                  : { right: '12px', top: '50%', transform: 'translateY(-50%)' }
                ),
              }}
            >
              {tick.value}
            </span>
          )}
        </div>
      ))}

      {/* Axis label */}
      {label && (
        <div style={{
          position: 'absolute',
          fontSize: 'var(--typography-caption-size)',
          color: '${glassStyles.text?.secondary || "rgba(var(--glass-color-white) / var(--glass-opacity-70))"}',
          fontWeight: 'var(--typography-subheading-weight)',
          ...(orientation === 'horizontal'
            ? { 
                bottom: '-25px', 
                left: '50%', 
                transform: 'translateX(-50%)',
                textAlign: 'center',
              }
            : { 
                left: '-45px', 
                top: '50%', 
                transform: 'translateY(-50%) rotate(-90deg)',
                transformOrigin: 'center',
                whiteSpace: 'nowrap',
              }
          ),
        }}>
          {label}
        </div>
      )}
    </div>
  );
};

export default ChartAxis;