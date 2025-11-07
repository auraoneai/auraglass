import React, { useRef } from 'react';
import { cn } from '../../../lib/utilsComprehensive';
import { createGlassStyle } from '../../../core/mixins/glassMixins';

export interface ChartGridProps {
  show?: boolean;
  style?: 'solid' | 'dashed' | 'dotted';
  color?: string;
  opacity?: number;
  horizontal?: boolean;
  vertical?: boolean;
}

export const ChartGrid: React.FC<ChartGridProps> = ({
  show = true,
  style = 'solid',
  color,
  opacity = 0.3,
  horizontal = true,
  vertical = true,
}) => {
  const glassStyles = createGlassStyle({ intent: 'neutral', elevation: 'level1' });
  const gridColor = color || glassStyles.borderColor || '${glassStyles.surface?.base || "var(--glass-bg-default)"}';
  const gridRef = useRef<SVGSVGElement>(null);

  if (!show) return null;

  // Generate grid lines
  const horizontalLines = horizontal ? Array.from({ length: 6 }, (_, i) => ({
    y: (i / 5) * 100,
    key: `h-${i}`,
  })) : [];

  const verticalLines = vertical ? Array.from({ length: 8 }, (_, i) => ({
    x: (i / 7) * 100,
    key: `v-${i}`,
  })) : [];

  const strokeDashArray = style === 'dashed' ? '5,5' : style === 'dotted' ? '2,3' : 'none';

  return (
    <svg
      ref={gridRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        opacity,
        zIndex: 0,
      }}
    >
      <defs>
        <pattern id="grid-pattern" width="100" height="100" patternUnits="userSpaceOnUse">
          {horizontal && (
            <g>
              {Array.from({ length: 5 }, (_, i) => (
                <line
                  key={`pattern-h-${i}`}
                  x1="0"
                  y1={i * 20}
                  x2="100"
                  y2={i * 20}
                  stroke={gridColor}
                  strokeWidth="0.5"
                  strokeDasharray={strokeDashArray}
                />
              ))}
            </g>
          )}
          {vertical && (
            <g>
              {Array.from({ length: 5 }, (_, i) => (
                <line
                  key={`pattern-v-${i}`}
                  x1={i * 20}
                  y1="0"
                  x2={i * 20}
                  y2="100"
                  stroke={gridColor}
                  strokeWidth="0.5"
                  strokeDasharray={strokeDashArray}
                />
              ))}
            </g>
          )}
        </pattern>
      </defs>

      {/* Main grid */}
      <g>
        {/* Horizontal lines */}
        {horizontalLines.map(line => (
          <line
            key={line.key}
            x1="0%"
            y1={`${line.y}%`}
            x2="100%"
            y2={`${line.y}%`}
            stroke={color}
            strokeWidth="1"
            strokeDasharray={strokeDashArray}
            opacity={line.y === 0 || line.y === 100 ? 0.6 : 0.3}
          />
        ))}

        {/* Vertical lines */}
        {verticalLines.map(line => (
          <line
            key={line.key}
            x1={`${line.x}%`}
            y1="0%"
            x2={`${line.x}%`}
            y2="100%"
            stroke={color}
            strokeWidth="1"
            strokeDasharray={strokeDashArray}
            opacity={line.x === 0 || line.x === 100 ? 0.6 : 0.3}
          />
        ))}
      </g>

      {/* Subtle gradient overlay for depth */}
      <defs>
        <radialGradient id="grid-gradient" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="100%" stopColor={color} stopOpacity="0.1" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-gradient)" />
    </svg>
  );
};

export default ChartGrid;
