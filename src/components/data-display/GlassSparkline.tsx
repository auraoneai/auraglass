'use client';
import React from 'react';
import { cn } from '../../lib/utilsComprehensive';
import { ContrastGuard, TextWithContrast } from '@/components/accessibility/ContrastGuard';

export interface GlassSparklineProps {
  data: number[];
  width?: number;
  height?: number;
  stroke?: string;
  fill?: string;
  className?: string;
}

export function GlassSparkline({ data, width = 120, height = 32, stroke = 'currentColor', fill = 'none', className }: GlassSparklineProps) {
  // TODO: Integrate ContrastGuard for table cells, list items, badges, card titles, and other text content for WCAG AA compliance

  if (!(data?.length || 0)) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const norm = (v: number) => (height - 2) - ((v - min) / (max - min || 1)) * (height - 4);
  const step = (width - 4) / ((data?.length || 0) - 1);
  const d = data?.map((v, i) => `${i === 0 ? 'M' : 'L'} ${2 + i * step} ${norm(v)}`).join(' ');
  return (
    <svg data-glass-component viewBox={`0 0 ${width} ${height}`} width={width} height={height} className={cn('text-blue-300/90', className)}>
      <path d={d} fill={fill} stroke={stroke} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export default GlassSparkline;